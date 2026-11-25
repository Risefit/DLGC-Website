import { notFound } from 'next/navigation';
import { PageHeader, Section } from '@/components/ui';
import ReadingRecord, { type ReaderRow } from '@/components/ReadingRecord';
import { requiredReading } from '@/content/required-reading';
import { getUser } from '@/lib/supabase/server';
import { adminClient, banned, everyUser, logSupabaseProblem } from '@/lib/supabase/admin';
import { isController, isMember } from '@/lib/auth';
import { mailReady } from '@/lib/mail';

export const metadata = { title: 'Required reading: who has confirmed' };
export const dynamic = 'force-dynamic';

/**
 * WHO HAS CONFIRMED THE REQUIRED READING — for controllers only.
 *
 * Every member who can sign in, and which of the required documents they have
 * ticked as read (src/content/required-reading.ts is the list; the ticks are
 * rows in the Supabase table reading_confirmations).
 *
 * ONLY THE CURRENT VERSION COUNTS. A confirmation is recorded against one
 * version of a document. When a manual is re-issued its tick no longer counts
 * here and the member shows as outstanding again, which is the point.
 *
 * A CONTROLLER CAN EMAIL A REMINDER from here (actions.ts beside this file):
 * one document, or everything a member has outstanding. The email has a button
 * for each document which opens /account/reading, where the member reads it
 * and ticks it themselves. Nobody can tick on a member's behalf.
 *
 * Anybody who is not a controller gets "page not found". The page is told who
 * is asking by Supabase, then reads with the server's secret key — a member's
 * own browser can only ever read that member's own ticks.
 */
export default async function ReadingRecordPage() {
  const user = await getUser();
  if (!isController(user)) notFound();

  const items = requiredReading.flatMap((g, gi) =>
    g.items.map((i) => ({ key: i.key, title: i.title, version: i.version ?? null, group: g.group, everyone: gi < 2, who: i.who ?? null })),
  );
  const everyoneKeys = items.filter((i) => i.everyone).map((i) => i.key);
  const current = new Set(items.map((i) => i.key));

  const admin = adminClient();
  let problem: string | null = null;
  let readers: ReaderRow[] = [];
  // member → document → when a controller last emailed them about it
  const reminded: Record<string, Record<string, string>> = {};

  if (!admin) {
    problem = 'This page needs SUPABASE_SERVICE_ROLE_KEY set in Vercel.';
  } else {
    try {
      const users = (await everyUser(admin)).filter((u) => isMember(u) && !banned(u));

      // Supabase hands back a thousand rows at a time.
      const ticks: { user_id: string; doc_key: string; confirmed_at: string }[] = [];
      for (let from = 0; from < 50_000; from += 1000) {
        const { data, error } = await admin
          .from('reading_confirmations')
          .select('user_id, doc_key, confirmed_at')
          .order('confirmed_at', { ascending: true })
          .range(from, from + 999);
        if (error) throw error;
        ticks.push(...((data ?? []) as typeof ticks));
        if (!data || data.length < 1000) break;
      }

      const byUser = new Map<string, Record<string, string>>();
      for (const t of ticks) {
        if (!current.has(t.doc_key)) continue; // a tick for a version since replaced
        const mine = byUser.get(t.user_id) ?? {};
        mine[t.doc_key] = t.confirmed_at;
        byUser.set(t.user_id, mine);
      }

      // Reminders already emailed. If the table is not there yet (migration 007),
      // the page still works; it just cannot say what has been sent.
      const { data: notes } = await admin
        .from('reading_reminders')
        .select('user_id, doc_key, sent_at')
        .order('sent_at', { ascending: true })
        .limit(5000);
      for (const n of (notes ?? []) as { user_id: string; doc_key: string; sent_at: string }[]) {
        if (!current.has(n.doc_key)) continue;
        (reminded[n.user_id] ??= {})[n.doc_key] = n.sent_at;
      }

      readers = users
        .map((u) => ({
          id: u.id,
          name: typeof u.user_metadata?.name === 'string' ? u.user_metadata.name : '',
          email: u.email ?? '',
          signedIn: Boolean(u.last_sign_in_at),
          confirmed: byUser.get(u.id) ?? {},
        }))
        .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));
    } catch (e) {
      logSupabaseProblem('reading record', e as { message?: string });
      problem =
        'The record could not be read from Supabase. If the table reading_confirmations has not been created, run supabase/migrations/004_reading_confirmations.sql.';
    }
  }

  const count = (key: string) => readers.filter((r) => r.confirmed[key]).length;

  return (
    <>
      <PageHeader
        eyebrow="Controllers only"
        back={{ href: '/admin/members', label: 'Members' }}
        title={
          <>
            Required reading: <em>who has confirmed</em>
          </>
        }
        lead="Every member with a sign-in, and which of the required documents they have ticked as read. Only the current version of each document counts."
      />

      {problem ? (
        <p role="alert" className="card border-l-4 border-bad p-5 text-bad">
          {problem}
        </p>
      ) : (
        <>
          <Section
            title="Member by member"
            description="Find a member, or see everybody who still has something to confirm. Open “What is outstanding” to email a member the documents they have not confirmed."
          >
            <ReadingRecord
              readers={readers}
              items={items.map(({ key, title, everyone, who }) => ({ key, title, everyone, who }))}
              everyoneKeys={everyoneKeys}
              reminded={reminded}
              mail={mailReady()}
            />
          </Section>

          <Section
            title="Document by document"
            description={`How many of the ${readers.length} ${readers.length === 1 ? 'member' : 'members'} with a sign-in have confirmed each one.`}
          >
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[34rem] text-left">
                <thead>
                  <tr className="border-b-2 border-navy text-sm text-navy">
                    <th scope="col" className="px-5 py-3 font-semibold">Document</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Applies to</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Confirmed by</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-skyLine">
                  {items.map((i) => (
                    <tr key={i.key}>
                      <th scope="row" className="px-5 py-3 font-medium text-navy">
                        {i.title}
                        {i.version && <span className="block text-sm font-normal text-slate2">{i.version}</span>}
                      </th>
                      <td className="px-5 py-3 text-sm text-inkMuted">{i.who ?? (i.everyone ? 'Everybody' : i.group.replace(/^If you are /, 'Anyone '))}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right text-navy">
                        <strong>{count(i.key)}</strong> of {readers.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </>
      )}
    </>
  );
}
