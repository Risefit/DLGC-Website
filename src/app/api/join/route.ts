import { NextResponse } from 'next/server';
import { adminClient, logSupabaseProblem } from '@/lib/supabase/admin';

/**
 * ASK TO JOIN — stores one request for a controller to look at.
 *
 * This is one of the very few addresses a visitor may reach, so it is careful:
 *
 *   - It creates NO account and grants NO access. A row waits in
 *     `portal_requests` until a controller approves it on the Members page.
 *   - It gives the same answer whether or not the address already has a
 *     sign-in or a request waiting, so it cannot be used to find out who is a
 *     member.
 *   - A second request from the same address while one is waiting is quietly
 *     ignored (the table allows one waiting request per address), and the
 *     table is capped, so it cannot be filled up by a robot.
 *   - Nothing about the visitor is recorded beyond what they typed.
 */

export const runtime = 'nodejs';

const MAX_WAITING = 200;
const same = () =>
  NextResponse.json(
    { ok: true, message: 'Thank you. The club will be in touch.' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
const no = (message: string, status = 400) =>
  NextResponse.json({ ok: false, message }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return no('Could not read the form.');
  }

  const name = String(body.name ?? '').trim().replace(/\s+/g, ' ');
  const email = String(body.email ?? '').trim().toLowerCase();
  const note = String(body.note ?? '').trim().slice(0, 1000);

  // The hidden box. A person leaves it empty; pretend all is well and store nothing.
  if (String(body.website ?? '').trim()) return same();

  if (name.length < 2 || name.length > 120) return no('Please give your name.');
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return no('That does not look like an email address. Please check it.');
  }

  const admin = adminClient();
  if (!admin) {
    return no('Requests cannot be taken on this copy of the site. Please ring the club office.', 503);
  }

  const { count, error: countError, status: countStatus } = await admin
    .from('portal_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');
  if (countError) {
    logSupabaseProblem('ask to join, counting requests', { ...countError, status: countStatus });
    return no('Requests cannot be taken at the moment. Please ring the club office.', 503);
  }
  if ((count ?? 0) >= MAX_WAITING) return same();

  const { error, status } = await admin.from('portal_requests').insert({ name, email, note: note || null });
  // 23505: this address already has a request waiting. Say the same as ever.
  if (error && error.code !== '23505') {
    logSupabaseProblem('ask to join, saving a request', { ...error, status });
    return no('That could not be saved. Please try again, or ring the club office.', 503);
  }

  return same();
}
