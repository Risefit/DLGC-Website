import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { isController, isMember } from '@/lib/auth';
import { KINDS } from '@/lib/sent-in';

/**
 * A PICTURE A MEMBER SENT IN — /files/sent-in/<id>, and ?size=small for the
 * little one used in a grid.
 *
 * The pictures are in a PRIVATE store. This hands a signed-in member a link to
 * one that is good for ten minutes, and only if a controller has approved it.
 * A controller can also see one that is still waiting, so they can look at it
 * before deciding.
 *
 * It answers for stories and photographs only. A picture attached to a safety
 * report is in the same store and must never come out this way, whoever asks —
 * the row's kind is checked before anything else.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const gone = () => new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d{1,12}$/.test(id)) return gone();

  const supabase = await createClient();
  const admin = adminClient();
  if (!supabase || !admin) return gone();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isMember(user)) return gone();

  const { data: row } = await admin
    .from('submissions')
    .select('kind, status, image_path, shown_path, thumb_path')
    .eq('id', Number(id))
    .maybeSingle();
  if (!row || !(KINDS as readonly string[]).includes(row.kind as string) || !row.image_path) return gone();
  if (row.status !== 'published' && !isController(user)) return gone();

  const small = new URL(request.url).searchParams.get('size') === 'small';
  // The copy made for showing, if there is one; otherwise the picture as it arrived.
  const path = ((small ? row.thumb_path : row.shown_path) as string | null) ?? (row.shown_path as string | null) ?? (row.image_path as string);

  const { data: signed } = await admin.storage.from('submissions').createSignedUrl(path, 600);
  if (!signed?.signedUrl) return gone();

  return NextResponse.redirect(signed.signedUrl, {
    status: 302,
    // The browser may reuse the link for a few minutes; nothing shared may keep it.
    headers: { 'Cache-Control': row.status === 'published' ? 'private, max-age=300' : 'private, no-store' },
  });
}
