'use server';

import { revalidatePath } from 'next/cache';
import { requireController, refusal } from '@/lib/controller';
import { logSupabaseProblem } from '@/lib/supabase/admin';
import { toPosted, type PostedNotice } from '@/lib/news';

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
};

export type NoticeOutcome = { ok: true; message: string } | { ok: false; message: string };

const COLUMNS = 'id, news_date, title, from_name, body, links, pinned';
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

/** News is shown on many pages; rebuild them all. */
const rebuild = () => revalidatePath('/', 'layout');

/** Publish a new notice, or save changes to one posted earlier (give its id). */
export async function saveNotice(input: NoticeInput, id?: number): Promise<NoticeOutcome> {
  try {
    const { me, admin } = await requireController();
    const checked = check(input);
    if (!checked.ok) return no(checked.message);

    if (id === undefined || id === null) {
      const { error } = await admin.from('portal_news').insert({ ...checked.row, created_by: me.id });
      if (error) {
        logSupabaseProblem('posting a notice', error);
        return no(
          error.code === '42P01' || error.code === 'PGRST205'
            ? 'Notices cannot be saved yet: the portal_news table has not been created in Supabase (migration 008).'
            : 'That could not be published. Nothing was saved; try again.',
        );
      }
      rebuild();
      return { ok: true, message: 'Published. It is on the News page and the dashboard now.' };
    }

    if (!Number.isInteger(id)) return no('That notice could not be found.');
    const { data, error } = await admin
      .from('portal_news')
      .update({ ...checked.row, updated_at: new Date().toISOString(), updated_by: me.id })
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
