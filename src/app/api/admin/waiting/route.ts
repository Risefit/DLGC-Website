import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { isController } from '@/lib/auth';

/**
 * HOW MANY PEOPLE ARE WAITING TO JOIN — for the number beside "Members" in a
 * controller's menu. There is no email to tell a controller that somebody has
 * asked to join, so the menu has to.
 *
 * It answers with a count and nothing else, and only to a controller: it asks
 * Supabase who is signed in before it looks. Anybody else is told "no".
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const headers = { 'Cache-Control': 'private, no-store' };

export async function GET() {
  const supabase = await createClient();
  const admin = adminClient();
  if (!supabase || !admin) return NextResponse.json({ ok: false }, { status: 503, headers });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isController(user)) return NextResponse.json({ ok: false }, { status: 403, headers });

  const { count, error } = await admin
    .from('portal_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  return NextResponse.json({ ok: !error, waiting: error ? 0 : (count ?? 0) }, { headers });
}
