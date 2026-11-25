import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { isMember, MIN_PASSWORD, temporaryExpired } from '@/lib/auth';

/**
 * A MEMBER CHOOSES THEIR OWN PASSWORD.
 *
 * Used the first time somebody signs in with a temporary password, and
 * whenever a member wants to change theirs. It changes the password of the
 * person who is signed in and nobody else — the account is taken from their
 * session, never from what the browser sends — and takes off the
 * "temporary password" mark in the same step, so the mark cannot be removed
 * without a new password actually being set.
 *
 * The password itself is passed straight to Supabase, which stores only a
 * scrambled form of it. It is not written to any log or table here.
 */

export const runtime = 'nodejs';

const no = (message: string, status = 400) =>
  NextResponse.json({ ok: false, message }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  const supabase = await createClient();
  const admin = adminClient();
  if (!supabase || !admin) return no('Passwords cannot be changed on this copy of the site.', 503);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isMember(user)) return no('Sign in to the portal first.', 401);
  if (temporaryExpired(user)) return no('That temporary password has run out. Ask the club for a new one.', 401);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return no('Could not read the form.');
  }
  const password = typeof body.password === 'string' ? body.password : '';

  if (password.length < MIN_PASSWORD) return no(`Please use at least ${MIN_PASSWORD} characters.`);
  if (password.length > 200) return no('That is too long. Please use fewer than 200 characters.');
  if (user.email && password.toLowerCase().includes(user.email.split('@')[0].toLowerCase())) {
    return no('Please choose a password that does not contain your email address.');
  }

  const { error } = await admin.auth.admin.updateUserById(user.id, {
    password,
    app_metadata: { ...(user.app_metadata ?? {}), must_change_password: false, temp_password_at: null },
  });
  if (error) {
    // Supabase explains weak or leaked passwords in plain words; pass that on.
    return no(error.message || 'That password could not be saved. Please try another.');
  }

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
