import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * MEMBER SUBMISSIONS — flying blog stories, gallery photographs, classified
 * adverts and safety occurrence reports.
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
 * SAFETY REPORTS ARE DIFFERENT. They go to the Safety Officer, not the website
 * editor, and they are never published from here. Anonymous reports carry no
 * name or email at all — the browser does not send those fields, and nothing is
 * derived from the request to identify the reporter. Do not add IP logging or
 * anything else that would undermine that; the whole value of the reporting
 * culture rests on it.
 *
 * REQUIRED SERVER-SIDE ENVIRONMENT VARIABLES (no NEXT_PUBLIC_ prefix):
 *   SUPABASE_URL                — same as NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   — Settings → API → service_role
 *
 * OPTIONAL, for emailing safety reports on as well as storing them:
 *   SAFETY_OFFICER_EMAIL        — where safety reports are sent
 *   RESEND_API_KEY              — any Resend account; free tier is ample
 *   MAIL_FROM                   — a verified sender, e.g. portal@dlgc.org.uk
 * Without these the report is still stored and the member is told it reached
 * the Safety Officer's queue — it never fails silently.
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
  const anonymous = String(form.get('anonymous') ?? '') === 'yes';
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const title = String(form.get('title') ?? '').trim();
  const body = String(form.get('body') ?? '').trim();
  const file = form.get('image');

  if (!['blog', 'photo', 'advert', 'safety'].includes(kind)) {
    return NextResponse.json({ ok: false, message: 'Unknown submission type.' }, { status: 400 });
  }
  // An anonymous safety report is the one case where we must NOT ask who sent it.
  if (!(kind === 'safety' && anonymous) && (!name || !email)) {
    return NextResponse.json(
      { ok: false, message: 'Please give your name and email so we can come back to you.' },
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
  if (kind === 'advert' && (!title || body.length < 10)) {
    return NextResponse.json(
      { ok: false, message: 'Please say what it is and add a line or two of detail.' },
      { status: 400 }
    );
  }
  if (kind === 'safety' && (!title || body.length < 20)) {
    return NextResponse.json(
      { ok: false, message: 'Please describe what happened — a couple of sentences is plenty.' },
      { status: 400 }
    );
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

  /**
   * Everything else the form carried, kept as JSON rather than as columns, so a
   * new field on a form does not need a database migration. The editor and the
   * Safety Officer read it in the Supabase table editor.
   */
  const extras: Record<string, unknown> = {};
  for (const key of ['advertKind', 'price', 'contactPhone', 'contactEmail', 'occurredOn', 'likelihood', 'consequence', 'riskLevel']) {
    const v = form.get(key);
    if (typeof v === 'string' && v.trim()) extras[key] = v.trim();
  }
  const where = form.getAll('where').filter((w) => typeof w === 'string') as string[];
  if (where.length) extras.where = where;
  if (kind === 'safety') extras.anonymous = anonymous;

  const { error } = await supabase.from('submissions').insert({
    kind,
    name: anonymous ? null : name || null,
    email: anonymous ? null : email || null,
    title: title || null,
    body: body || null,
    image_path: imagePath,
    details: Object.keys(extras).length ? extras : null,
    status: 'pending',
  });

  if (error) {
    return NextResponse.json(
      { ok: false, message: `Could not save the submission: ${error.message}` },
      { status: 500 }
    );
  }

  if (kind === 'safety') await emailSafetyOfficer({ title, body, extras, anonymous, name, email });

  const MESSAGES: Record<string, string> = {
    blog: 'Thank you — your story has gone to the website editor, who will read it and publish it.',
    photo: 'Thank you — your photograph has gone to the website editor for the gallery.',
    advert: 'Thank you — your advert has gone to the website editor, who will put it on the page.',
    safety: anonymous
      ? 'Your report has reached the Safety Officer. Nothing identifying you was sent with it.'
      : 'Your report has reached the Safety Officer, who may come back to you with questions.',
  };

  return NextResponse.json({ ok: true, message: MESSAGES[kind] });
}

/**
 * Best effort only. A failure here must never lose the report — it is already
 * safely stored by the time this runs, so we swallow the error rather than
 * telling a member their report failed when it did not.
 */
async function emailSafetyOfficer(r: {
  title: string;
  body: string;
  extras: Record<string, unknown>;
  anonymous: boolean;
  name: string;
  email: string;
}) {
  const to = process.env.SAFETY_OFFICER_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!to || !apiKey || !from) return;

  const lines = [
    `Reported by: ${r.anonymous ? 'ANONYMOUS' : `${r.name} <${r.email}>`}`,
    r.extras.occurredOn ? `When: ${r.extras.occurredOn}` : null,
    Array.isArray(r.extras.where) ? `Where: ${(r.extras.where as string[]).join(', ')}` : null,
    r.extras.riskLevel
      ? `Reporter's view of risk: ${r.extras.riskLevel} (${r.extras.likelihood} likelihood, ${r.extras.consequence} consequence)`
      : null,
    '',
    r.body,
    '',
    'Full record, including any photograph, is in Supabase → submissions.',
  ].filter(Boolean);

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject: `Safety report: ${r.title}`,
        text: lines.join('\n'),
      }),
    });
  } catch {
    // Stored already; nothing more to do.
  }
}
