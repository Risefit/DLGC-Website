'use server';

import type { User } from '@supabase/supabase-js';
import { adminClient, banned, everyUser, logSupabaseProblem, temporaryPassword } from '@/lib/supabase/admin';
import { isController, isMember, TEMP_PASSWORD_DAYS } from '@/lib/auth';
import { invitation, mailReady, sendMail } from '@/lib/mail';
import { requireController, refusal } from '@/lib/controller';
import { cleanRoles, isRole, roleLabel, withRole, type RoleId } from '@/lib/roles';
import { checkName, readProfile, readRoles, ROLE_NOT_ALLOWED_YET, writeRoles, type Profile } from '@/lib/profile';

/**
 * WHAT A CONTROLLER CAN DO — add a member, approve or decline a request, give
 * a new temporary password, take access away, make another controller, set the
 * duties a member does, open a member's emergency details, and invite people
 * from the club's list (one at a time, or everybody at once).
 *
 * Every one of these runs on the server with the secret key, so every one of
 * them starts by asking Supabase who is signed in and refusing anybody who is
 * not a controller. The check is `requireController()` (src/lib/controller.ts);
 * nothing below it may be reached without it. Do not add an action that skips it.
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
  /** The duties they do (src/lib/roles.ts). Set here or by the member on My profile. */
  roles: RoleId[];
  /** true when they have filled in emergency details on My profile */
  details: boolean;
};

/** What comes back when a controller clicks a role beside a member's name. */
export type RoleOutcome = { ok: true; roles: RoleId[] } | { ok: false; message: string };

/** What comes back when a controller opens a member's emergency details. */
export type DetailsOutcome =
  | { ok: true; name: string; /** null: they have not filled any in */ details: Profile | null }
  | { ok: false; message: string };

/** Somebody on the club's list who has not been invited yet. */
export type ListPerson = {
  id: number;
  firstName: string;
  surname: string;
  email: string | null;
  /** listed = may be invited · hold = check first · removed = taken off */
  status: 'listed' | 'hold' | 'removed';
  note: string | null;
  /** What stops an invitation as things stand, if anything. */
  blocker: 'no-email' | 'shared' | null;
};

export type ClubListData = {
  /** false until supabase/migrations/006_portal_roll.sql has been run */
  ready: boolean;
  people: ListPerson[];
  /** how many on the list already have a sign-in */
  invited: number;
  /** true when RESEND_API_KEY and MAIL_FROM are set, so invitations can be emailed */
  mail: boolean;
};

export type BatchOutcome =
  | { ok: true; sent: number; left: number; /** why it stopped early, if it did */ stopped?: string }
  | { ok: false; message: string };

export type JoinRequest = { id: number; name: string; email: string; note: string | null; asked: string };

export type Outcome =
  | { ok: true; message: string; /** shown once, for the controller to pass on */ password?: string; forName?: string }
  | { ok: false; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const refuse = (e: unknown): Outcome => ({ ok: false, message: refusal(e, 'The Members page') });

/** Everything the Members page shows. */
export async function loadMembers(): Promise<
  | {
      ok: true;
      members: Member[];
      requests: JoinRequest[];
      requestsReady: boolean;
      list: ClubListData;
      /** false until supabase/migrations/011_roles_and_profiles.sql has been run */
      rolesReady: boolean;
    }
  | { ok: false; message: string }
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
  // Who does which duty, and who has filled in emergency details. Only the
  // fact that details exist is read here — never the details themselves.
  const { data: roleRows, error: roleError } = await admin.from('portal_member_roles').select('user_id, roles').limit(5000);
  const { data: detailRows } = await admin.from('portal_profiles').select('user_id').limit(5000);
  const rolesOf = new Map((roleRows ?? []).map((r) => [r.user_id as string, cleanRoles(r.roles)]));
  const hasDetails = new Set((detailRows ?? []).map((r) => r.user_id as string));

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
      roles: rolesOf.get(u.id) ?? [],
      details: hasDetails.has(u.id),
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
    list: await loadList(admin, users),
    rolesReady: !roleError,
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

type Made =
  | { ok: true; id: string; name: string; email: string; password: string }
  | { ok: false; message: string; /** the address already has a sign-in */ exists?: boolean };

/** Make the account, with a temporary password. Nothing is sent to anybody. */
async function makeAccount(
  admin: NonNullable<ReturnType<typeof adminClient>>,
  nameIn: string,
  emailIn: string,
): Promise<Made> {
  const name = nameIn.trim().replace(/\s+/g, ' ');
  const email = emailIn.trim().toLowerCase();
  if (name.length < 2 || name.length > 120) return { ok: false, message: 'Please give the member’s name.' };
  if (!EMAIL.test(email) || email.length > 254) {
    return { ok: false, message: 'That does not look like an email address. Please check it.' };
  }

  const password = temporaryPassword();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // the controller vouches for the address
    user_metadata: { name },
    app_metadata: { portal_member: true, must_change_password: true, temp_password_at: new Date().toISOString() },
  });

  if (error || !data?.user) {
    const said = error?.message ?? '';
    if (/already|registered|exists/i.test(said)) {
      return {
        ok: false,
        exists: true,
        message: `${email} already has a sign-in. Find them in the list below — you can give them a new temporary password or restore their access there.`,
      };
    }
    logSupabaseProblem('members page, creating an account', error);
    return { ok: false, message: said || 'The account could not be created.' };
  }

  return { ok: true, id: data.user.id, name, email, password };
}

async function create(
  admin: NonNullable<ReturnType<typeof adminClient>>,
  nameIn: string,
  emailIn: string,
): Promise<Outcome> {
  const made = await makeAccount(admin, nameIn, emailIn);
  if (!made.ok) return { ok: false, message: made.message };
  return { ok: true, message: `${made.name} now has a sign-in.`, password: made.password, forName: made.name };
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
      app_metadata: {
        ...(data.user.app_metadata ?? {}),
        must_change_password: true,
        temp_password_at: new Date().toISOString(),
      },
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

/**
 * Correct a member's name — the label beside their email address. Nothing else
 * about the account changes: not the address they sign in with, not their
 * access. (A member can correct their own on My profile.)
 */
export async function setMemberName(userId: string, nameIn: string): Promise<Outcome> {
  try {
    const { admin } = await requireController();
    if (typeof userId !== 'string') return { ok: false, message: 'That member could not be found.' };
    const named = checkName(nameIn);
    if (!named.ok) return { ok: false, message: named.message.replace('your name, as the club knows you', 'a name of two letters or more') };
    const { data, error: findError } = await admin.auth.admin.getUserById(userId);
    if (findError || !data.user) return { ok: false, message: 'That member could not be found.' };
    const { error } = await admin.auth.admin.updateUserById(userId, {
      user_metadata: { ...(data.user.user_metadata ?? {}), name: named.name },
    });
    if (error) {
      logSupabaseProblem('members page, changing a name', error);
      return { ok: false, message: 'The name could not be saved. Try again.' };
    }
    return { ok: true, message: `Name saved: ${named.name}.` };
  } catch (e) {
    return refuse(e);
  }
}

/**
 * Give a member a role, or take it off — one click on the Members page.
 *
 * A role adds that duty's manuals to the member's required reading and shows
 * beside their name. It opens nothing and is not a record of qualification
 * (src/lib/roles.ts). The member can change the same roles on My profile.
 *
 * It answers with the member's roles as they now stand, so the page shows
 * what was really saved — including a role the member ticked for themselves
 * since the page was opened.
 */
export async function setMemberRole(userId: string, role: string, on: boolean): Promise<RoleOutcome> {
  try {
    const { me, admin } = await requireController();
    if (typeof userId !== 'string' || !isRole(role) || typeof on !== 'boolean') {
      return { ok: false, message: 'That is not one of the club’s roles. Reload the page.' };
    }
    const { data, error: findError } = await admin.auth.admin.getUserById(userId);
    if (findError || !data.user) return { ok: false, message: 'That member could not be found.' };
    if (!isMember(data.user) || banned(data.user)) {
      return { ok: false, message: 'Restore their access first; a role is for somebody who can sign in.' };
    }
    try {
      const held = await readRoles(admin, userId);
      // Giving a flying card takes any other card off: withRole knows which groups are one-only.
      const next = withRole(held, role, on);
      if (next.join('|') !== held.join('|')) await writeRoles(admin, userId, next, me.id);
      return { ok: true, roles: next };
    } catch (e) {
      logSupabaseProblem('members page, setting a role', { message: e instanceof Error ? e.message : undefined });
      return {
        ok: false,
        message:
          e instanceof Error && e.message === ROLE_NOT_ALLOWED_YET
            ? `${roleLabel(role)} cannot be saved yet: run supabase/migrations/012_more_roles.sql in the Supabase SQL editor, then click it again.`
            : `${roleLabel(role)} could not be saved. If roles have never worked, run supabase/migrations/011_roles_and_profiles.sql.`,
      };
    }
  } catch (e) {
    return { ok: false, message: refusal(e, 'The Members page') };
  }
}

/**
 * Open ONE member's emergency details: who to ring, next of kin, blood type
 * and what they have said a first-aider should know.
 *
 * This is the most personal thing the portal holds, and some of it is health
 * information. It is fetched only when a controller asks for one named
 * member; it is never part of the list. Each time details are shown, who
 * looked and whose they were is noted in portal_profile_views (not the
 * details themselves), so the club can answer "who has seen mine?".
 *
 * For an emergency, or to check a member's contact is still right. Nothing
 * here is written to a log.
 */
export async function emergencyDetails(userId: string): Promise<DetailsOutcome> {
  try {
    const { me, admin } = await requireController();
    if (typeof userId !== 'string') return { ok: false, message: 'That member could not be found.' };
    const { data, error: findError } = await admin.auth.admin.getUserById(userId);
    if (findError || !data.user) return { ok: false, message: 'That member could not be found.' };
    const name = typeof data.user.user_metadata?.name === 'string' && data.user.user_metadata.name ? data.user.user_metadata.name : data.user.email ?? 'This member';

    let details: Profile | null;
    try {
      details = await readProfile(admin, userId);
    } catch (e) {
      logSupabaseProblem('members page, opening emergency details', { message: e instanceof Error ? e.message : undefined });
      return { ok: false, message: 'The emergency details could not be read just now. Try again.' };
    }
    if (!details) return { ok: true, name, details: null };

    // Noted before anything is shown. If it cannot be noted, nothing is shown.
    const { error: noteError } = await admin.from('portal_profile_views').insert({ subject_id: userId, viewer_id: me.id });
    if (noteError) {
      logSupabaseProblem('members page, noting that emergency details were opened', noteError);
      return { ok: false, message: 'The emergency details could not be opened just now. Try again.' };
    }
    return { ok: true, name, details };
  } catch (e) {
    return { ok: false, message: refusal(e, 'The Members page') };
  }
}

/* ══════════════════════════════════════════════════════════════════════════
 * THE CLUB'S LIST — people the club means to invite (table portal_roll).
 *
 * Being on the list gives nobody a sign-in. A controller invites from it: one
 * person, or everybody who is ready. Inviting makes the account exactly as
 * "Add a member" does. If the club's email sending is set up the temporary
 * password is emailed to the member; if not, it is shown to the controller
 * once, to pass on by hand.
 *
 * Inviting EVERYBODY needs the email sending — nobody can hand out a hundred
 * and fifty passwords. It is done a few at a time (BATCH), called again and
 * again by the page until nobody is left, so it never runs out of time and can
 * be stopped and picked up later. If an email cannot be sent, that person's
 * account is taken back so they are simply still "not yet invited".
 * ══════════════════════════════════════════════════════════════════════════ */

type Admin = NonNullable<ReturnType<typeof adminClient>>;
type ListRow = {
  id: number;
  first_name: string;
  surname: string;
  email: string | null;
  status: string;
  note: string | null;
};

const BATCH = 5;
const fullName = (r: { first_name: string; surname: string }) => `${r.first_name} ${r.surname}`.trim();
const lower = (e: string | null | undefined) => (e ?? '').trim().toLowerCase();

/** Rows not yet invited, with anybody who has since been given a sign-in settled first. */
async function openRows(admin: Admin, users: User[]): Promise<{ ready: boolean; rows: ListRow[]; invited: number }> {
  const { data, error } = await admin
    .from('portal_roll')
    .select('id, first_name, surname, email, status, note')
    .in('status', ['listed', 'hold', 'removed'])
    .order('surname', { ascending: true })
    .order('first_name', { ascending: true });
  if (error) return { ready: false, rows: [], invited: 0 };

  // Somebody on the list who already has a sign-in (added by hand, or approved
  // from "Ask to join") is not waiting for an invitation. Say so on their row.
  const accounts = new Map(users.filter((u) => u.email).map((u) => [lower(u.email), u.id]));
  const rows: ListRow[] = [];
  for (const r of (data ?? []) as ListRow[]) {
    const has = r.email ? accounts.get(lower(r.email)) : undefined;
    if (has && r.status !== 'removed') {
      await admin
        .from('portal_roll')
        .update({ status: 'invited', user_id: has, invited_at: new Date().toISOString() })
        .eq('id', r.id);
    } else {
      rows.push(r);
    }
  }

  const { count } = await admin.from('portal_roll').select('id', { count: 'exact', head: true }).eq('status', 'invited');
  return { ready: true, rows, invited: count ?? 0 };
}

/** An address two people on the list both give cannot be either one's sign-in. */
function sharedAddresses(rows: ListRow[]) {
  const seen = new Map<string, number>();
  for (const r of rows) {
    if (r.email && r.status !== 'removed') seen.set(lower(r.email), (seen.get(lower(r.email)) ?? 0) + 1);
  }
  return new Set([...seen].filter(([, n]) => n > 1).map(([e]) => e));
}

const blockerOf = (r: ListRow, shared: Set<string>): ListPerson['blocker'] =>
  !r.email ? 'no-email' : shared.has(lower(r.email)) ? 'shared' : null;

async function loadList(admin: Admin, users: User[]): Promise<ClubListData> {
  const { ready, rows, invited } = await openRows(admin, users);
  const shared = sharedAddresses(rows);
  return {
    ready,
    invited,
    mail: mailReady(),
    people: rows.map((r) => ({
      id: r.id,
      firstName: r.first_name,
      surname: r.surname,
      email: r.email,
      status: r.status as ListPerson['status'],
      note: r.note,
      blocker: blockerOf(r, shared),
    })),
  };
}

const markInvited = (admin: Admin, rowId: number, userId: string | null, by: string) =>
  admin
    .from('portal_roll')
    .update({ status: 'invited', user_id: userId, invited_at: new Date().toISOString(), invited_by: by })
    .eq('id', rowId);

/**
 * Make one person's account and, when email is set up, send them their
 * invitation. `emailed` says which way the password went.
 */
async function inviteRow(
  admin: Admin,
  row: ListRow,
  by: string,
): Promise<
  | { ok: true; emailed: boolean; name: string; password: string }
  | { ok: false; message: string; quota?: boolean; skipped?: boolean }
> {
  const name = fullName(row);
  const made = await makeAccount(admin, name, row.email ?? '');
  if (!made.ok) {
    if (made.exists) {
      // Somebody got there first; they have a sign-in, which is what was wanted.
      await markInvited(admin, row.id, null, by);
      return { ok: false, skipped: true, message: `${name} already has a sign-in.` };
    }
    return { ok: false, message: `${name}: ${made.message}` };
  }

  if (!mailReady()) {
    await markInvited(admin, row.id, made.id, by);
    return { ok: true, emailed: false, name, password: made.password };
  }

  const sent = await sendMail({
    to: made.email,
    ...invitation({ firstName: row.first_name, email: made.email, password: made.password, days: TEMP_PASSWORD_DAYS }),
  });
  if (!sent.ok) {
    // No email, so no invitation: take the account back and leave them on the list.
    const { error } = await admin.auth.admin.deleteUser(made.id);
    if (error) logSupabaseProblem('members page, taking back an account after a failed email', error);
    return { ok: false, quota: sent.quota, message: sent.reason };
  }
  await markInvited(admin, row.id, made.id, by);
  return { ok: true, emailed: true, name, password: made.password };
}

/** Invite one person from the list. */
export async function inviteFromList(id: number): Promise<Outcome> {
  try {
    const { me, admin } = await requireController();
    const { rows } = await openRows(admin, await everyUser(admin));
    const row = rows.find((r) => r.id === id);
    if (!row || row.status === 'removed') return { ok: false, message: 'That person is no longer waiting on the list.' };
    const blocker = blockerOf(row, sharedAddresses(rows));
    if (blocker === 'no-email') return { ok: false, message: 'Add an email address for them first.' };
    if (blocker === 'shared') {
      return { ok: false, message: 'Somebody else on the list has the same address. Each sign-in needs its own — change one of them first.' };
    }
    const done = await inviteRow(admin, row, me.id);
    if (!done.ok) return { ok: false, message: done.message };
    return done.emailed
      ? { ok: true, message: `An invitation has been emailed to ${done.name}.` }
      : { ok: true, message: `${done.name} now has a sign-in.`, password: done.password, forName: done.name };
  } catch (e) {
    return refuse(e);
  }
}

/**
 * Invite the next few people who are ready. The page calls this repeatedly
 * until `left` is 0 or `stopped` says why it cannot go on.
 */
export async function inviteBatch(): Promise<BatchOutcome> {
  try {
    const { me, admin } = await requireController();
    if (!mailReady()) {
      return { ok: false, message: 'Inviting everybody needs the club’s email sending set up first (RESEND_API_KEY and MAIL_FROM in Vercel).' };
    }
    const { rows } = await openRows(admin, await everyUser(admin));
    const shared = sharedAddresses(rows);
    const ready = rows.filter((r) => r.status === 'listed' && blockerOf(r, shared) === null);

    let sent = 0;
    let handled = 0;
    for (const row of ready.slice(0, BATCH)) {
      const done = await inviteRow(admin, row, me.id);
      if (done.ok) {
        sent++;
        handled++;
        continue;
      }
      if (done.skipped) {
        handled++;
        continue;
      }
      return { ok: true, sent, left: ready.length - handled, stopped: done.message };
    }
    return { ok: true, sent, left: ready.length - handled };
  } catch (e) {
    return refuse(e) as { ok: false; message: string };
  }
}

/** Send the controller the invitation as a member would get it, with a made-up password. */
export async function sendSample(): Promise<Outcome> {
  try {
    const { me } = await requireController();
    if (!mailReady()) return { ok: false, message: 'Email sending is not set up yet.' };
    if (!me.email) return { ok: false, message: 'Your sign-in has no email address.' };
    const first = typeof me.user_metadata?.name === 'string' && me.user_metadata.name ? me.user_metadata.name.split(' ')[0] : 'member';
    const mail = invitation({ firstName: first, email: me.email, password: 'abcd-efgh-jkmn', days: TEMP_PASSWORD_DAYS });
    const sent = await sendMail({
      to: me.email,
      subject: `[Sample] ${mail.subject}`,
      text: `THIS IS A SAMPLE. The password below is made up and opens nothing.\n\n${mail.text}`,
    });
    return sent.ok
      ? { ok: true, message: `A sample invitation has been sent to ${me.email}. Nobody else was emailed.` }
      : { ok: false, message: sent.reason };
  } catch (e) {
    return refuse(e);
  }
}

/** Give somebody on the list an email address, or correct it. */
export async function setListEmail(id: number, emailIn: string): Promise<Outcome> {
  try {
    const { admin } = await requireController();
    const email = emailIn.trim().toLowerCase();
    if (!EMAIL.test(email) || email.length > 254) {
      return { ok: false, message: 'That does not look like an email address. Please check it.' };
    }
    const { error } = await admin.from('portal_roll').update({ email }).eq('id', id).in('status', ['listed', 'hold']);
    if (error) return { ok: false, message: 'That could not be saved. Try again.' };
    // The note on a listed row only ever said the address was missing or shared.
    // (On a held row it says why they are held, so that one stays.)
    await admin.from('portal_roll').update({ note: null }).eq('id', id).eq('status', 'listed');
    return { ok: true, message: 'Email address saved.' };
  } catch (e) {
    return refuse(e);
  }
}

/** Take somebody off the list, put them back, or release somebody held for checking. */
export async function setListStatus(id: number, to: 'listed' | 'removed'): Promise<Outcome> {
  try {
    const { admin } = await requireController();
    if (to !== 'listed' && to !== 'removed') return { ok: false, message: 'That could not be saved.' };
    const { error } = await admin
      .from('portal_roll')
      .update({ status: to })
      .eq('id', id)
      .in('status', ['listed', 'hold', 'removed']);
    if (error) return { ok: false, message: 'That could not be saved. Try again.' };
    return {
      ok: true,
      message: to === 'removed' ? 'Taken off the list. Nothing was sent to them.' : 'They are on the list and may be invited.',
    };
  } catch (e) {
    return refuse(e);
  }
}

/**
 * Add people to the list from pasted text — one person per line, as it comes
 * out of a spreadsheet or an export: "First name, Surname, email". Commas,
 * tabs or semicolons between the parts; the email may be missing. Anybody
 * whose address is already on the list, or already has a sign-in, is left out.
 */
export async function addToList(text: string): Promise<Outcome> {
  try {
    const { admin } = await requireController();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return { ok: false, message: 'Paste at least one line: first name, surname, email address.' };
    if (lines.length > 500) return { ok: false, message: 'That is more than 500 lines. Please paste it in smaller pieces.' };

    const { data: existing, error: readError } = await admin
      .from('portal_roll')
      .select('first_name, surname, email, status');
    if (readError) return { ok: false, message: 'The list could not be read. Has migration 006 been run in Supabase?' };
    const users = await everyUser(admin);
    const knownEmail = new Set([
      ...((existing ?? []) as ListRow[]).filter((r) => r.email).map((r) => lower(r.email)),
      ...users.map((u) => lower(u.email)),
    ]);
    const knownName = new Set(((existing ?? []) as ListRow[]).filter((r) => !r.email).map((r) => fullName(r).toLowerCase()));

    const add: { first_name: string; surname: string; email: string | null; source: string }[] = [];
    const unread: number[] = [];
    let already = 0;
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    lines.forEach((line, i) => {
      const found = line.match(/[^\s<>,;"']+@[^\s<>,;"']+\.[^\s<>,;"']{2,}/);
      const email = found ? found[0].toLowerCase() : null;
      const rest = (found ? line.replace(found[0], ' ') : line).replace(/[<>"]/g, ' ');
      const parts = rest.split(/[,;\t]/).map((p) => p.trim().replace(/\s+/g, ' ')).filter(Boolean);
      // A heading row ("First name, Surname, Email") is not a person.
      if (!email && /^(first\s*name|name|surname|e-?mail)/i.test(parts[0] ?? '')) return;
      let first = '';
      let sur = '';
      if (parts.length >= 2) {
        [first, sur] = parts;
      } else if (parts.length === 1) {
        const words = parts[0].split(' ');
        sur = words.length > 1 ? words.pop()! : '';
        first = words.join(' ');
      }
      // A name is letters (any alphabet), with spaces, hyphens, apostrophes and full stops.
      const nameLike = /^\p{L}[\p{L}\p{M} .'’-]*$/u;
      if (
        !first ||
        first.length > 80 ||
        sur.length > 80 ||
        !nameLike.test(first) ||
        (sur !== '' && !nameLike.test(sur)) ||
        (email && (!EMAIL.test(email) || email.length > 254))
      ) {
        unread.push(i + 1);
        return;
      }
      const nameKey = `${first} ${sur}`.trim().toLowerCase();
      if (email ? knownEmail.has(email) : knownName.has(nameKey)) {
        already++;
        return;
      }
      if (email) knownEmail.add(email);
      else knownName.add(nameKey);
      add.push({ first_name: first, surname: sur, email, source: `Pasted in by a controller, ${today}` });
    });

    if (add.length > 0) {
      const { error } = await admin.from('portal_roll').insert(add);
      if (error) {
        logSupabaseProblem('members page, adding to the list', error);
        return { ok: false, message: 'Those could not be added. Nothing was saved; try again.' };
      }
    }
    const bits = [
      `${add.length} added to the list.`,
      already > 0 ? `${already} left out — already on the list or already signed up.` : '',
      unread.length > 0
        ? `${unread.length} could not be read (line${unread.length === 1 ? '' : 's'} ${unread.slice(0, 12).join(', ')}${unread.length > 12 ? '…' : ''}).`
        : '',
      add.length > 0 ? 'Nobody has been invited.' : '',
    ].filter(Boolean);
    return { ok: add.length > 0 || unread.length === 0, message: bits.join(' ') };
  } catch (e) {
    return refuse(e);
  }
}
