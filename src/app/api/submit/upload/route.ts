import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { isMember } from '@/lib/auth';
import { MAX_PHOTO, MB, safeFileName } from '@/lib/uploads';

/**
 * PERMISSION FOR A MEMBER TO UPLOAD ONE PHOTOGRAPH — for the Flying Blog and
 * Gallery forms.
 *
 * A photograph off a phone is often bigger than the portal's host will accept
 * in one request, so it does not go through the portal: this gives the
 * member's browser a one-time permission to put ONE picture at ONE address in
 * the private store, and the form then tells /api/submit where it is. That
 * route checks the picture really arrived, and is a picture, before it stores
 * the submission (src/lib/uploads.ts has the reasoning).
 *
 * Only a signed-in member is given one, and only for a story or a gallery
 * photograph. The safety report form does not use this: its photograph still
 * travels with the report itself.
 */

export const runtime = 'nodejs';

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const no = (message: string, status = 400) =>
  NextResponse.json({ ok: false, message }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  const supabase = await createClient();
  const admin = adminClient();
  if (!supabase || !admin) return no('Photographs cannot be taken on this copy of the site.', 503);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isMember(user)) return no('Sign in to the portal first.', 401);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return no('Could not read the form.');
  }
  const kind = body.kind === 'blog' ? 'blog' : body.kind === 'photo' ? 'photo' : null;
  const name = String(body.name ?? '');
  const type = String(body.type ?? '');
  const size = Number(body.size);
  if (!kind) return no('Unknown kind of submission.');
  if (!TYPES.includes(type)) return no('Please send a JPG, PNG, WEBP or GIF.', 415);
  if (!(size > 0)) return no('That photograph is empty.');
  if (size > MAX_PHOTO) return no(`That photograph is over ${MAX_PHOTO / MB} MB. Please send a smaller version.`, 413);

  const path = `${kind}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeFileName(name)}`;
  const { data, error } = await admin.storage.from('submissions').createSignedUploadUrl(path);
  if (error || !data?.token) return no('The photograph store could not be reached. Please try again.', 502);

  return NextResponse.json({ ok: true, path, token: data.token }, { headers: { 'Cache-Control': 'no-store' } });
}
