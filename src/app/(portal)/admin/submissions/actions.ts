'use server';

import { revalidatePath } from 'next/cache';
import { requireController, refusal } from '@/lib/controller';
import { logSupabaseProblem } from '@/lib/supabase/admin';
import { makeShownCopies } from '@/lib/photos';
import { KINDS } from '@/lib/sent-in';

/**
 * A CONTROLLER DECIDES — approve a story or photograph a member sent in, or
 * decline it, or take down one that was approved earlier.
 *
 * Approving is what publishes: the story appears on the Flying Blog, the
 * photograph in the Gallery, as soon as the page is next opened. The
 * controller may tidy the title, the text and the name shown before
 * approving, the way the website editor always has.
 *
 * Like every controller action it begins with requireController(). It works
 * only on rows whose kind is 'blog' or 'photo' — the same table holds safety
 * reports and adverts, and nothing here can read, publish or change one.
 *
 * Nothing is deleted: "decline" and "take down" both leave the row, and the
 * picture, where they are.
 */

export type Decision = { ok: true; message: string } | { ok: false; message: string };
export type Edits = { title: string; body: string; name: string };

const no = (message: string): Decision => ({ ok: false, message });

export async function decideSubmission(id: number, publish: boolean, edits?: Edits): Promise<Decision> {
  try {
    const { me, admin } = await requireController();
    if (!Number.isInteger(id)) return no('That could not be found.');

    const { data: row, error: findError } = await admin
      .from('submissions')
      .select('id, kind, status, name, title, body, image_path, shown_path')
      .eq('id', id)
      .in('kind', KINDS as unknown as string[])
      .maybeSingle();
    if (findError || !row) return no('That could not be found. Reload the page.');

    const change: Record<string, unknown> = {
      status: publish ? 'published' : 'declined',
      decided_at: new Date().toISOString(),
      decided_by: me.id,
    };

    if (publish) {
      if (edits) {
        const title = String(edits.title ?? '').replace(/\s+/g, ' ').trim();
        const name = String(edits.name ?? '').replace(/\s+/g, ' ').trim();
        const body = String(edits.body ?? '').replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
        if (title.length > 140) return no('The title is too long. Keep it under 140 characters.');
        if (name.length < 2 || name.length > 120) return no('Please give the name it should be shown as from.');
        if (body.length > 20000) return no('The text is too long.');
        if (row.kind === 'blog' && body.length < 20) return no('A story needs some text before it can be published.');
        Object.assign(change, { title: title || null, name, body: body || null });
      }
      if (row.kind === 'photo' && !row.image_path) return no('There is no photograph with this one, so there is nothing to show.');
      // The copies for showing: smaller, and without the phone's location data.
      if (row.image_path && !row.shown_path) {
        const copies = await makeShownCopies(admin, 'submissions', row.image_path as string, `shown/${id}`);
        if (copies) Object.assign(change, { shown_path: copies.shown, thumb_path: copies.thumb });
      }
    }

    const { error } = await admin.from('submissions').update(change).eq('id', id).in('kind', KINDS as unknown as string[]);
    if (error) {
      logSupabaseProblem('deciding on a submission', error);
      return no(
        /decided_at|shown_path|thumb_path|decided_by/.test(error.message ?? '')
          ? 'That could not be saved: the database needs migration 009 (supabase/migrations/009_submission_decisions.sql).'
          : 'That could not be saved. Try again.',
      );
    }

    // The Flying Blog, the Gallery and the count in the menu all follow.
    revalidatePath('/', 'layout');
    const what = row.kind === 'blog' ? 'story' : 'photograph';
    return {
      ok: true,
      message: publish
        ? `Published. The ${what} is on the ${row.kind === 'blog' ? 'Flying Blog' : 'Gallery'} page now.`
        : row.status === 'published'
          ? `Taken down. The ${what} is kept, under “Not shown”.`
          : `Declined. The ${what} is kept, under “Not shown”, and nothing was sent to the member.`,
    };
  } catch (e) {
    return no(refusal(e, 'This page'));
  }
}
