'use server';

import { requiredReading } from '@/content/required-reading';
import { requireController, refusal } from '@/lib/controller';
import { banned, logSupabaseProblem } from '@/lib/supabase/admin';
import { isMember } from '@/lib/auth';
import { mailReady, readingReminder, sendMail } from '@/lib/mail';

/**
 * A CONTROLLER EMAILS A MEMBER ABOUT READING THEY HAVE NOT CONFIRMED.
 *
 * From the reading record (/admin/reading): one document, or everything that
 * member still has outstanding, in a single email. The email carries a button
 * for each document; the button opens that document's page in the portal,
 * where the member reads it and ticks it themselves (/account/reading).
 *
 * WHAT THIS DOES NOT DO: it does not confirm anything. A controller cannot
 * tick a document on a member's behalf, here or anywhere else — the database
 * takes a confirmation only from the member's own signed-in session.
 *
 * Like every controller action it begins with requireController(). The keys it
 * is given are checked against the current list, so it can only ever send
 * about a real, current document; and it looks up the member's address itself
 * rather than taking one from the browser.
 */

export type ReminderOutcome =
  | { ok: true; message: string; /** the documents the email covered */ keys: string[]; at: string }
  | { ok: false; message: string };

const AGAIN_AFTER_MINUTES = 5;

export async function sendReadingReminder(userId: string, keys: string[]): Promise<ReminderOutcome> {
  try {
    const { me, admin } = await requireController();
    if (!mailReady()) {
      return { ok: false, message: 'Reminders need the club’s email sending set up first (RESEND_API_KEY and MAIL_FROM in Vercel).' };
    }
    if (typeof userId !== 'string' || !Array.isArray(keys)) return { ok: false, message: 'That could not be sent.' };

    const all = requiredReading.flatMap((g) => g.items);
    const asked = new Set(keys.filter((k) => typeof k === 'string').slice(0, 50));
    let items = all.filter((i) => asked.has(i.key));
    if (items.length === 0) return { ok: false, message: 'That document is no longer on the required reading list. Reload the page.' };

    const { data, error: findError } = await admin.auth.admin.getUserById(userId);
    const member = data?.user;
    if (findError || !member || !member.email) return { ok: false, message: 'That member could not be found.' };
    if (!isMember(member) || banned(member)) return { ok: false, message: 'That person does not have access to the portal, so there is nothing for them to open.' };

    // Anything they have ticked since the page was loaded is left out.
    const { data: ticks, error: tickError } = await admin
      .from('reading_confirmations')
      .select('doc_key')
      .eq('user_id', userId);
    if (tickError) {
      logSupabaseProblem('reading reminder, reading confirmations', tickError);
      return { ok: false, message: 'The reading record could not be read. Try again.' };
    }
    const done = new Set((ticks ?? []).map((t) => t.doc_key as string));
    items = items.filter((i) => !done.has(i.key));
    const name = typeof member.user_metadata?.name === 'string' ? member.user_metadata.name.trim() : '';
    if (items.length === 0) {
      return { ok: true, keys: [], at: new Date().toISOString(), message: `${name || 'They'} already confirmed that. Nothing was sent.` };
    }

    // A second press straight after the first sends nothing.
    const since = new Date(Date.now() - AGAIN_AFTER_MINUTES * 60_000).toISOString();
    const { data: recent } = await admin
      .from('reading_reminders')
      .select('doc_key')
      .eq('user_id', userId)
      .gte('sent_at', since);
    const justSent = new Set((recent ?? []).map((r) => r.doc_key as string));
    items = items.filter((i) => !justSent.has(i.key));
    if (items.length === 0) {
      return { ok: false, message: `That was emailed to ${name || 'them'} a few minutes ago. Give it time to arrive before sending it again.` };
    }

    const mail = readingReminder({
      firstName: name ? name.split(' ')[0] : 'member',
      items: items.map((i) => ({ key: i.key, title: i.title, version: i.version, why: i.why, who: i.who })),
      sentBy: typeof me.user_metadata?.name === 'string' ? me.user_metadata.name : undefined,
    });
    const sent = await sendMail({ to: member.email, ...mail });
    if (!sent.ok) return { ok: false, message: sent.reason };

    const at = new Date().toISOString();
    const { error: noteError } = await admin
      .from('reading_reminders')
      .insert(items.map((i) => ({ user_id: userId, doc_key: i.key, sent_at: at, sent_by: me.id })));
    // The email has gone either way; failing to note it must not say otherwise.
    if (noteError) logSupabaseProblem('reading reminder, noting that it was sent', noteError);

    return {
      ok: true,
      keys: items.map((i) => i.key),
      at,
      message:
        items.length === 1
          ? `“${items[0].title}” has been emailed to ${name || member.email}.`
          : `${items.length} documents have been emailed to ${name || member.email} in one message.`,
    };
  } catch (e) {
    return { ok: false, message: refusal(e, 'The reading record') };
  }
}
