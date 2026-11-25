import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { isController, isMember } from '@/lib/auth';
import { storedAttachments } from '@/lib/news';

/**
 * A PHOTOGRAPH OR FILE ON A NOTICE — /files/news/<notice>/<position>, and
 * ?size=small for the little copy of a photograph.
 *
 * They are in a PRIVATE store. This hands a signed-in member a link that is
 * good for ten minutes, and only while the notice is showing. A controller can
 * also open one on a notice that has been taken down.
 *
 * The address names a notice and a position on it, never where the file is
 * kept: that is looked up here, on the server, so nobody can ask for a file by
 * guessing at the store.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const gone = () => new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });

export async function GET(request: Request, { params }: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = await params;
  if (!/^\d{1,12}$/.test(id) || !/^\d{1,2}$/.test(n)) return gone();

  const supabase = await createClient();
  const admin = adminClient();
  if (!supabase || !admin) return gone();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isMember(user)) return gone();

  const { data: row } = await admin.from('portal_news').select('status, attachments').eq('id', Number(id)).maybeSingle();
  if (!row) return gone();
  if (row.status !== 'published' && !isController(user)) return gone();

  const a = storedAttachments(row.attachments)[Number(n)];
  if (!a) return gone();

  const small = new URL(request.url).searchParams.get('size') === 'small';
  // A photograph is always shown from the copy made for showing (location data removed), never the original.
  const path = a.kind === 'photo' ? ((small ? a.thumb : a.shown) ?? a.shown) : a.path;
  if (!path) return gone();

  const { data: signed } = await admin.storage.from('news').createSignedUrl(path, 600);
  if (!signed?.signedUrl) return gone();

  return NextResponse.redirect(signed.signedUrl, {
    status: 302,
    headers: { 'Cache-Control': row.status === 'published' ? 'private, max-age=300' : 'private, no-store' },
  });
}
