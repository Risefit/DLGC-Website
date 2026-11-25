'use server';

import { revalidatePath } from 'next/cache';
import { requireController, refusal } from '@/lib/controller';
import { logSupabaseProblem } from '@/lib/supabase/admin';
import { storedAttachments, toPosted, type PostedNotice, type StoredAttachment } from '@/lib/news';
import { makeShownCopies } from '@/lib/photos';
import {
  FILE_TYPES,
  MAX_NOTICE_FILES,
  MAX_NOTICE_PHOTOS,
  PHOTO_TYPES,
  safeFileName,
  uploadProblem,
  type UploadKind,
} from '@/lib/uploads';

/**
 * A CONTROLLER POSTS A NOTICE — and edits one, takes one down, puts one back.
 *
 * Used by the form on the News page (src/components/NewsDesk.tsx). Like every
 * controller action each of these begins with requireController(): the button
 * is only drawn for controllers, but that is a courtesy, not the lock. This is
 * the lock.
 *
 * What is typed is stored as plain text and shown as plain text. A link has to
 * be an ordinary web address (https://…) or a page of this portal (/flying/…);
 * anything else is refused, so a notice cannot carry a "javascript:" link.
 *
 * PHOTOGRAPHS AND FILES. A notice can carry a few of each. They are put in the
 * private store called `news` by the controller's own browser, with a one-time
 * permission from newsUploads() below (src/lib/uploads.ts says why). When the
 * notice is saved, each one is checked: it must be at an address this file
 * handed out, really be there, and be the kind and size allowed. A photograph
 * then gets two smaller copies with the camera's location data removed. Taking
 * one off a notice only stops it showing; the file stays in the store.
 *
 * Only notices posted from the portal can be changed here. The older ones are
 * in src/content/news.ts and are edited there.
 *
 * After any change the site is told to rebuild its pages, because the News
 * page, the dashboard, Club Life and the archive all show news.
 */

export type NoticeInput = {
  date: string;
  title: string;
  from: string;
  body: string;
  links: { label: string; href: string }[];
  pinned: boolean;
  /** Photographs and files: which of the existing ones to keep (by position), and new ones just uploaded. */
  attachments?: { keep: number[]; add: { kind: UploadKind; path: string; label: string }[] };
};

export type UploadTicket = { path: string; token: string };

export type NoticeOutcome = { ok: true; message: string } | { ok: false; message: string };

const COLUMNS = '*';
const BUCKET = 'news';
/** Only an address newsUploads() made: up/<random id>/<file name>. */
const UPLOADED = /^up\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[a-z0-9._-]{1,90}$/;
const no = (message: string): NoticeOutcome => ({ ok: false, message });
const refuse = (e: unknown) => no(refusal(e, 'Posting news'));

/** Tidy what was typed and say what is wrong with it, if anything. */
function check(input: NoticeInput): { ok: true; row: Record<string, unknown> } | { ok: false; message: string } {
  if (!input || typeof input !== 'object') return { ok: false, message: 'That could not be read. Try again.' };
  const title = String(input.title ?? '').replace(/\s+/g, ' ').trim();
  const from = String(input.from ?? '').replace(/\s+/g, ' ').replace(/^from\s+/i, '').trim();
  const body = String(input.body ?? '').replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const date = String(input.date ?? '');

  if (title.length < 2) return { ok: false, message: 'Please give the notice a heading.' };
  if (title.length > 140) return { ok: false, message: 'The heading is too long. Keep it under 140 characters.' };
  if (from.length > 80) return { ok: false, message: 'The “from” line is too long.' };
  if (!body) return { ok: false, message: 'Please write the notice.' };
  if (body.length > 8000) return { ok: false, message: 'That is longer than a notice can be (8,000 characters). Put the detail in a document and link to it.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    return { ok: false, message: 'Please give the date.' };
  }
  const year = Number(date.slice(0, 4));
  const tomorrow = new Date(Date.now() + 36 * 3_600_000).toISOString().slice(0, 10);
  if (year < 2016 || date > tomorrow) return { ok: false, message: 'That date is in the future, or before the club’s news begins. Please check it.' };

  const links: { label: string; href: string }[] = [];
  for (const l of Array.isArray(input.links) ? input.links.slice(0, 12) : []) {
    const label = String(l?.label ?? '').replace(/\s+/g, ' ').trim();
    const href = String(l?.href ?? '').trim();
    if (!label && !href) continue;
    if (!label) return { ok: false, message: 'Each link needs a few words saying what it is.' };
    if (!href) return { ok: false, message: `The link “${label}” has no address.` };
    if (label.length > 120 || href.length > 600) return { ok: false, message: `The link “${label.slice(0, 40)}” is too long.` };
    if (/^(this link|click here|here|link)$/i.test(label)) {
      return { ok: false, message: 'Name each link for what it opens — “Committee minutes, October 2026”, not “this link”.' };
    }
    const web = /^https?:\/\/[^\s/?#]+\.[^\s]+$/i.test(href);
    const page = /^\/(?!\/)[^\s]*$/.test(href);
    if (!web && !page) {
      return { ok: false, message: `“${href.slice(0, 60)}” is not an address the portal can link to. Use one starting https:// or, for a page of this portal, one starting with /.` };
    }
    links.push({ label, href });
  }
  if (links.length > 6) return { ok: false, message: 'A notice can carry up to six links.' };

  return {
    ok: true,
    row: { news_date: date, title, from_name: from || null, body, links, pinned: Boolean(input.pinned) },
  };
}

/**
 * Permission for a controller's browser to put files in the private store —
 * one address and one one-time token per file. Nothing is saved to a notice by
 * this; saveNotice() does that, after checking what actually arrived.
 */
export async function newsUploads(
  files: { kind: UploadKind; name: string; type: string; size: number }[],
): Promise<{ ok: true; tickets: UploadTicket[] } | { ok: false; message: string }> {
  try {
    const { admin } = await requireController();
    if (!Array.isArray(files) || files.length === 0 || files.length > MAX_NOTICE_PHOTOS + MAX_NOTICE_FILES) {
      return { ok: false, message: 'That is more than a notice can carry.' };
    }
    const tickets: UploadTicket[] = [];
    for (const f of files) {
      const kind: UploadKind = f?.kind === 'photo' ? 'photo' : 'file';
      const problem = uploadProblem(kind, { name: String(f?.name ?? ''), type: String(f?.type ?? ''), size: Number(f?.size) });
      if (problem) return { ok: false, message: problem };
      const path = `up/${crypto.randomUUID()}/${safeFileName(String(f.name))}`;
      const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path);
      if (error || !data?.token) {
        logSupabaseProblem('news upload, asking the store for permission', error);
        return {
          ok: false,
          message: /bucket/i.test(error?.message ?? '')
            ? 'Files cannot be attached yet: the “news” store has not been created in Supabase (migration 010).'
            : 'The file store could not be reached. Try again.',
        };
      }
      tickets.push({ path, token: data.token });
    }
    return { ok: true, tickets };
  } catch (e) {
    return { ok: false, message: refusal(e, 'Posting news') };
  }
}

type Admin = Awaited<ReturnType<typeof requireController>>['admin'];

/** Check what a controller says they uploaded, and get a photograph ready to show. */
async function accept(
  admin: Admin,
  add: { kind: UploadKind; path: string; label: string }[],
): Promise<{ ok: true; made: StoredAttachment[] } | { ok: false; message: string }> {
  const made: StoredAttachment[] = [];
  for (const a of add) {
    const kind: UploadKind = a?.kind === 'photo' ? 'photo' : 'file';
    const path = String(a?.path ?? '');
    const label = String(a?.label ?? '').replace(/\s+/g, ' ').trim();
    if (!UPLOADED.test(path)) return { ok: false, message: 'One of the files did not upload properly. Take it off and add it again.' };
    if (label.length < 3 || label.length > 140) {
      return {
        ok: false,
        message: kind === 'photo' ? 'Say in a few words what each photograph shows.' : 'Say in a few words what each file is.',
      };
    }
    if (/^(this link|click here|here|link|file|photo|photograph|image|picture)$/i.test(label)) {
      return { ok: false, message: 'Describe it for somebody who cannot see it — “Committee minutes, October 2026”, “The new winch at the west end”.' };
    }
    const { data: info, error } = await admin.storage.from(BUCKET).info(path);
    if (error || !info) return { ok: false, message: `“${label}” did not finish uploading. Take it off and add it again.` };
    const meta = info as { size?: number; contentType?: string; metadata?: { size?: number; mimetype?: string } };
    const size = Number(meta.size ?? meta.metadata?.size ?? 0);
    const type = String(meta.contentType ?? meta.metadata?.mimetype ?? '');
    const problem = uploadProblem(kind, { name: label, type, size });
    if (problem) return { ok: false, message: problem };
    if (kind === 'photo' ? !PHOTO_TYPES.includes(type) : !FILE_TYPES[type]) return { ok: false, message: `“${label}” is not a kind of file a notice can carry.` };

    const stored: StoredAttachment = { kind, label, path, type, size };
    if (kind === 'photo') {
      // Smaller, the right way up, and without where the phone says it was taken.
      const copies = await makeShownCopies(admin, BUCKET, path, path.replace(/^up\//, 'shown/').replace(/\/[^/]+$/, ''));
      if (!copies) {
        return { ok: false, message: `The photograph “${label}” could not be made ready to show. Check it opens on your own computer, then add it again.` };
      }
      stored.shown = copies.shown;
      stored.thumb = copies.thumb;
    }
    made.push(stored);
  }
  return { ok: true, made };
}

/** News is shown on many pages; rebuild them all. */
const rebuild = () => revalidatePath('/', 'layout');

/** Publish a new notice, or save changes to one posted earlier (give its id). */
export async function saveNotice(input: NoticeInput, id?: number): Promise<NoticeOutcome> {
  try {
    const { me, admin } = await requireController();
    const checked = check(input);
    if (!checked.ok) return no(checked.message);

    // Photographs and files: what is kept from before, plus what has just been uploaded.
    const want = input.attachments ?? { keep: [], add: [] };
    const adding = Array.isArray(want.add) ? want.add.slice(0, MAX_NOTICE_PHOTOS + MAX_NOTICE_FILES) : [];
    let before: StoredAttachment[] = [];
    if (id !== undefined && id !== null) {
      if (!Number.isInteger(id)) return no('That notice could not be found.');
      const { data: was } = await admin.from('portal_news').select('attachments').eq('id', id).maybeSingle();
      before = storedAttachments(was?.attachments);
    }
    const keep = new Set((Array.isArray(want.keep) ? want.keep : []).filter((n) => Number.isInteger(n)));
    const kept = before.filter((_, n) => keep.has(n));
    const photos = kept.filter((a) => a.kind === 'photo').length + adding.filter((a) => a?.kind === 'photo').length;
    const files = kept.length + adding.length - photos;
    if (photos > MAX_NOTICE_PHOTOS) return no(`A notice can carry up to ${MAX_NOTICE_PHOTOS} photographs.`);
    if (files > MAX_NOTICE_FILES) return no(`A notice can carry up to ${MAX_NOTICE_FILES} files.`);
    const accepted = await accept(admin, adding);
    if (!accepted.ok) return no(accepted.message);
    const attachments = [...kept, ...accepted.made];
    // Left out entirely when there are none, so a notice with no files saves even before migration 010.
    const withFiles = attachments.length > 0 || before.length > 0 ? { attachments } : {};

    if (id === undefined || id === null) {
      const { error } = await admin.from('portal_news').insert({ ...checked.row, ...withFiles, created_by: me.id });
      if (error) {
        logSupabaseProblem('posting a notice', error);
        return no(
          error.code === '42P01' || error.code === 'PGRST205'
            ? 'Notices cannot be saved yet: the portal_news table has not been created in Supabase (migration 008).'
            : /attachments/.test(error.message ?? '')
              ? 'The photograph or file could not be saved with the notice: the database needs migration 010.'
            : 'That could not be published. Nothing was saved; try again.',
        );
      }
      rebuild();
      return { ok: true, message: 'Published. It is on the News page and the dashboard now.' };
    }

    const { data, error } = await admin
      .from('portal_news')
      .update({ ...checked.row, ...withFiles, updated_at: new Date().toISOString(), updated_by: me.id })
      .eq('id', id)
      .eq('status', 'published')
      .select('id');
    if (error) {
      logSupabaseProblem('changing a notice', error);
      return no('That could not be saved. Try again.');
    }
    if (!data || data.length === 0) return no('That notice is no longer showing. Reload the page.');
    rebuild();
    return { ok: true, message: 'Saved.' };
  } catch (e) {
    return refuse(e);
  }
}

/** Take a posted notice down, or put it back. It is never deleted. */
export async function showNotice(id: number, showing: boolean): Promise<NoticeOutcome> {
  try {
    const { me, admin } = await requireController();
    if (!Number.isInteger(id)) return no('That notice could not be found.');
    const { data, error } = await admin
      .from('portal_news')
      .update({ status: showing ? 'published' : 'removed', updated_at: new Date().toISOString(), updated_by: me.id })
      .eq('id', id)
      .select('id');
    if (error) {
      logSupabaseProblem('taking a notice down or putting it back', error);
      return no('That could not be saved. Try again.');
    }
    if (!data || data.length === 0) return no('That notice could not be found.');
    rebuild();
    return {
      ok: true,
      message: showing ? 'It is back on the News page.' : 'Taken down. It is kept, and can be put back from “Notices taken down”.',
    };
  } catch (e) {
    return refuse(e);
  }
}

/** The notices that have been taken down — for controllers, so one can be put back. */
export async function takenDown(): Promise<{ ok: true; notices: PostedNotice[] } | { ok: false; message: string }> {
  try {
    const { admin } = await requireController();
    const { data, error } = await admin
      .from('portal_news')
      .select(COLUMNS)
      .eq('status', 'removed')
      .order('news_date', { ascending: false })
      .limit(200);
    if (error) return { ok: false, message: 'The list could not be read. Try again.' };
    return { ok: true, notices: (data ?? []).map((r) => toPosted(r as Parameters<typeof toPosted>[0])) };
  } catch (e) {
    return { ok: false, message: refusal(e, 'Posting news') };
  }
}
