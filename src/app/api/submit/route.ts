import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * MEMBER SUBMISSIONS — flying blog stories and gallery photographs.
 *
 * Nothing submitted here is published automatically. Everything lands in a
 * Supabase table with status 'pending' for the website editor to read and
 * approve. That is deliberate: the club's news voice is one of the best things
 * about the old site, and an open publish button would lose it.
 *
 * WHERE THE EDITOR REVIEWS SUBMISSIONS
 * Supabase dashboard → Table Editor → `submissions`. No admin screens are
 * needed to start with; set `status` to 'approved' and copy the text into
 * src/content/news.ts or the blog.
 *
 * REQUIRED SERVER-SIDE ENVIRONMENT VARIABLES (no NEXT_PUBLIC_ prefix):
 *   SUPABASE_URL                — same as NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   — Settings → API → service_role
 *
 * The service_role key bypasses row-level security, so it must NEVER be
 * exposed to the browser and must never be committed. It is used here only to
 * insert a pending row.
 */

export const runtime = 'nodejs';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      {
        ok: false,
        code: 'not_configured',
        message:
          'Submissions are not switched on yet. Please email your story or photo to the website editor for now.',
      },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: 'Could not read the form.' }, { status: 400 });
  }

  const kind = String(form.get('kind') ?? '');
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const title = String(form.get('title') ?? '').trim();
  const body = String(form.get('body') ?? '').trim();
  const file = form.get('image');

  if (!['blog', 'photo'].includes(kind)) {
    return NextResponse.json({ ok: false, message: 'Unknown submission type.' }, { status: 400 });
  }
  if (!name || !email) {
    return NextResponse.json(
      { ok: false, message: 'Please give your name and email so the editor can reply.' },
      { status: 400 }
    );
  }
  if (kind === 'blog' && body.length < 20) {
    return NextResponse.json(
      { ok: false, message: 'Please write a little more — even a couple of sentences is fine.' },
      { status: 400 }
    );
  }
  if (kind === 'photo' && !(file instanceof File)) {
    return NextResponse.json({ ok: false, message: 'Please choose a photograph.' }, { status: 400 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  let imagePath: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { ok: false, message: 'That image is over 8 MB. Please send a smaller version.' },
        { status: 413 }
      );
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { ok: false, message: 'Please send a JPG, PNG, WEBP or GIF.' },
        { status: 415 }
      );
    }
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
    const path = `${kind}/${Date.now()}-${safe}`;
    const { error } = await supabase.storage
      .from('submissions')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      return NextResponse.json(
        { ok: false, message: `The image could not be uploaded: ${error.message}` },
        { status: 500 }
      );
    }
    imagePath = path;
  }

  const { error } = await supabase.from('submissions').insert({
    kind,
    name,
    email,
    title: title || null,
    body: body || null,
    image_path: imagePath,
    status: 'pending',
  });

  if (error) {
    return NextResponse.json(
      { ok: false, message: `Could not save the submission: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      kind === 'blog'
        ? 'Thank you — your story has gone to the website editor, who will read it and publish it.'
        : 'Thank you — your photograph has gone to the website editor for the gallery.',
  });
}
