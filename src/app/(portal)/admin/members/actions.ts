'use server';

import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { adminClient, logSupabaseProblem, temporaryPassword } from '@/lib/supabase/admin';
import { isController, isMember } from '@/lib/auth';

/**
 * WHAT A CONTROLLER CAN DO — add a member, approve or decline a request, give
 * a new temporary password, take access away, make another controller.
 *
 * Every one of these runs on the server with the secret key, so every one of
 * them starts by asking Supabase who is signed in and refusing anybody who is
 * not a controller. The check is `requireController()`; nothing below it may
 * be reached without it. Do not add an action that skips it.
 *
 * Members' names and email addresses are personal data. They are held in
 * Supabase and shown only on the Members page; they are never written into
 * this repository or a log.
 */

export type Member = {
  id: string;
  email: string;
  name: string;
  controller: boolean;
  access: boolean;
  temporary: boolean;
  added: string | null;
  lastSignIn: string | null;
  you: boolean;
};

export type JoinRequest = { id: number; name: string; email: string; note: string | null; asked: string };

export type Outcome =
  | { ok: true; message: string; /** shown once, for the controller to pass on */ password?: string; forName?: string }
  | { ok: false; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function requireController() {
  const supabase = await createClient();
  const admin = adminClient();
  if (!supabase || !admin) throw new Error('not-configured');
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isController(user)) throw new Error('not-allowed');
  return { me: user, admin };
}

const refuse = (e: unknown): Outcome => ({
  ok: false,
  message:
    e instanceof Error && e.message === 'not-configured'
      ? 'The Members page needs SUPABASE_SERVICE_ROLE_KEY set in Vercel.'
      : 'Only a controller can do that. Sign in again and retry.',
});

async function everyUser(admin: NonNullable<ReturnType<typeof adminClient>>): Promise<User[]> {
  const all: User[] = [];
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(error.message);
    all.push(...data.users);
    if (data.users.length < 200) break;
  }
  return all;
}

const banned = (u: User) => {
  const until = (u as User & { banned_until?: string | null }).banned_until;
  return Boolean(until && new Date(until).getTime() > Date.now());
};

/** Everything the Members page shows. */
export async function loadMembers(): Promise<
  { ok: true; members: Member[]; requests: JoinRequest[]; requestsReady: boolean } | { ok: false; message: string }
> {
  let ctx;
  try {
    ctx = await requireController();
  } catch (e) {
    return refuse(e) as { ok: false; message: string };
  }
  const { me, admin } = ctx;

  let users: User[];
  try {
    users = await everyUser(admin);
  } catch (e) {
    // Almost always the secret key: missing, mistyped, or from another project.
    const why = e instanceof Error ? e.message : 'unknown error';
    logSupabaseProblem('members page, listing accounts', { message: why });
    return {
      ok: false,
      message: `The portal could not read the list of members from Supabase (${why}). Check that SUPABASE_SERVICE_ROLE_KEY in Vercel is the secret key of the project members sign in to, then redeploy.`,
    };
  }
  const members: Member[] = users
    .map((u) => ({
      id: u.id,
      email: u.email ?? '',
      name: typeof u.user_metadata?.name === 'string' ? u.user_metadata.name : '',
      controller: isController(u),
      access: isMember(u) && !banned(u),
      temporary: u.app_metadata?.must_change_password === true,
      added: u.created_at ?? null,
      lastSignIn: u.last_sign_in_at ?? null,
      you: u.id === me.id,
    }))
    .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));

  const { data, error } = await admin
    .from('portal_requests')
    .select('id, name, email, note, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  return {
    ok: true,
    members,
    requestsReady: !error,
    requests: (data ?? []).map((r) => ({
      id: r.id as number,
      name: r.name as string,
      email: r.email as string,
      note: (r.note as string | null) ?? null,
      asked: r.created_at as string,
    })),
  };
}

async function create(
  admin: NonNullable<ReturnType<typeof adminClient>>,
  nameIn: string,
  emailIn: string,
): Promise<Outcome> {
  const name = nameIn.trim().replace(/\s+/g, ' ');
  const email = emailIn.trim().toLowerCase();
  if (name.length < 2 || name.length > 120) return { ok: false, message: 'Please give the member’s name.' };
  if (!EMAIL.test(email) || email.length > 254) {
    return { ok: false, message: 'That does not look like an email address. Please check it.' };
  }

  const password = temporaryPassword();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // the controller vouches for the address; no email is sent
    user_metadata: { name },
    app_metadata: { portal_member: true, must_change_password: true },
  });

  if (error) {
    const said = error.message ?? '';
    if (!/already|registered|exists/i.test(said)) logSupabaseProblem('members page, creating an account', error);
    if (/already|registered|exists/i.test(said)) {
      return {
        ok: false,
        message: `${email} already has a sign-in. Find them in the list below — you can give them a new temporary password or restore their access there.`,
      };
    }
    return { ok: false, message: said || 'The account could not be created.' };
  }

  return {
    ok: true,
    message: `${name} now has a sign-in.`,
    password,
    forName: name,
  };
}

/** Add a member directly. */
export async function addMember(name: string, email: string): Promise<Outcome> {
  try {
    const { admin } = await requireController();
    return await create(admin, name, email);
  } catch (e) {
    return refuse(e);
  }
}

/** Approve a request from the front page: the account is created now. */
export async function approveRequest(id: number): Promise<Outcome> {
  try {
    const { me, admin } = await requireController();
    const { data: row, error } = await admin
      .from('portal_requests')
      .select('id, name, email, status')
      .eq('id', id)
      .maybeSingle();
    if (error || !row || row.status !== 'pending') {
      return { ok: false, message: 'That request has already been dealt with.' };
    }
    const made = await create(admin, row.name as string, row.email as string);
    // Somebody who already has a sign-in asked again: the request is settled either way.
    const already = !made.ok && /already has a sign-in/.test(made.message);
    if (made.ok || already) {
      await admin
        .from('portal_requests')
        .update({ status: 'approved', decided_at: new Date().toISOString(), decided_by: me.id })
        .eq('id', id);
    }
    return made;
  } catch (e) {
    return refuse(e);
  }
}

/** Decline a request. Nothing is created and nobody is told; the row is kept as a record. */
export async function declineRequest(id: number): Promise<Outcome> {
  try {
    const { me, admin } = await requireController();
    const { error } = await admin
      .from('portal_requests')
      .update({ status: 'declined', decided_at: new Date().toISOString(), decided_by: me.id })
      .eq('id', id)
      .eq('status', 'pending');
    return error
      ? { ok: false, message: 'That could not be saved. Try again.' }
      : { ok: true, message: 'Request declined. Nothing was created.' };
  } catch (e) {
    return refuse(e);
  }
}

/** A fresh temporary password for somebody who has forgotten theirs. */
export async function newTemporaryPassword(userId: string): Promise<Outcome> {
  try {
    const { admin } = await requireController();
    const { data, error: findError } = await admin.auth.admin.getUserById(userId);
    if (findError || !data.user) return { ok: false, message: 'That member could not be found.' };
    const password = temporaryPassword();
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password,
      app_metadata: { ...(data.user.app_metadata ?? {}), must_change_password: true },
    });
    if (error) return { ok: false, message: error.message || 'The password could not be changed.' };
    const name = typeof data.user.user_metadata?.name === 'string' ? data.user.user_metadata.name : data.user.email ?? 'them';
    return { ok: true, message: `A new temporary password has been set for ${name}.`, password, forName: name };
  } catch (e) {
    return refuse(e);
  }
}

/** Take access away, or give it back. The account and its record are kept. */
export async function setAccess(userId: string, allowed: boolean): Promise<Outcome> {
  try {
    const { me, admin } = await requireController();
    if (userId === me.id) return { ok: false, message: 'You cannot take away your own access.' };
    const { data, error: findError } = await admin.auth.admin.getUserById(userId);
    if (findError || !data.user) return { ok: false, message: 'That member could not be found.' };
    const { error } = await admin.auth.admin.updateUserById(userId, {
      // Shut out at once, and unable to sign in again, until access is restored.
      ban_duration: allowed ? 'none' : '876000h',
      app_metadata: {
        ...(data.user.app_metadata ?? {}),
        portal_member: allowed,
        ...(allowed ? {} : { portal_admin: false }),
      },
    });
    if (error) return { ok: false, message: error.message || 'That could not be saved.' };
    return { ok: true, message: allowed ? 'Access restored.' : 'Access removed. They can no longer sign in.' };
  } catch (e) {
    return refuse(e);
  }
}

/** Make somebody a controller, or stop them being one. There is always at least one. */
export async function setController(userId: string, on: boolean): Promise<Outcome> {
  try {
    const { me, admin } = await requireController();
    if (userId === me.id && !on) {
      return { ok: false, message: 'Ask another controller to do that — you cannot remove yourself.' };
    }
    const { data, error: findError } = await admin.auth.admin.getUserById(userId);
    if (findError || !data.user) return { ok: false, message: 'That member could not be found.' };
    if (on && !isMember(data.user)) return { ok: false, message: 'Restore their access first.' };
    const { error } = await admin.auth.admin.updateUserById(userId, {
      app_metadata: { ...(data.user.app_metadata ?? {}), portal_admin: on },
    });
    if (error) return { ok: false, message: error.message || 'That could not be saved.' };
    return { ok: true, message: on ? 'They are now a controller.' : 'They are no longer a controller.' };
  } catch (e) {
    return refuse(e);
  }
}
