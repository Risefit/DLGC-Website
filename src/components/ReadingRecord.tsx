'use client';

import { useMemo, useState, useTransition } from 'react';
import { sendReadingReminder } from '@/app/(portal)/admin/reading/actions';

/**
 * The member-by-member half of the controllers' reading record
 * (/admin/reading). The page above it does the reading from Supabase and hands
 * the rows down; this only searches, filters and lays them out.
 *
 * "Everybody's" documents are the ones every member is asked to confirm (the
 * first two groups in src/content/required-reading.ts). The count beside each
 * name is of those. Documents for one duty or for students are shown when a
 * member has ticked them, but nobody is marked as outstanding for a duty they
 * may not do.
 *
 * EMAILING A REMINDER. Under "What is outstanding" each document has a button
 * that emails it to the member, and there is one button for everything they
 * have outstanding (one email, not several). The documents for students and
 * for particular duties are offered separately: they are never counted as
 * outstanding, and never go in the "all" email, because the portal does not
 * know who does which duty — the controller does. The email's button opens the
 * document's page in the portal, where the member reads and ticks it. It needs
 * the club's email sending; until that is set up the buttons are greyed out
 * and the page says why. Once sent, the row says when.
 */

export type ReaderRow = {
  id: string;
  name: string;
  email: string;
  signedIn: boolean;
  /** document key → when it was confirmed (current versions only) */
  confirmed: Record<string, string>;
};

type Item = { key: string; title: string; everyone: boolean; who: string | null };
type Show = 'outstanding' | 'done' | 'all';

const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ReadingRecord({
  readers,
  items,
  everyoneKeys,
  reminded,
  mail,
}: {
  readers: ReaderRow[];
  items: Item[];
  everyoneKeys: string[];
  /** member → document → when a controller last emailed them about it */
  reminded: Record<string, Record<string, string>>;
  /** true when the club's email sending is set up */
  mail: boolean;
}) {
  const [show, setShow] = useState<Show>('outstanding');
  const [query, setQuery] = useState('');
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);
  // What has been sent since the page loaded, and what was said about it.
  const [sentNow, setSentNow] = useState<Record<string, Record<string, string>>>({});
  const [said, setSaid] = useState<Record<string, { ok: boolean; message: string }>>({});

  const lastSent = (memberId: string, key: string) => sentNow[memberId]?.[key] ?? reminded[memberId]?.[key];

  function send(memberId: string, keys: string[], buttonKey: string) {
    setBusy(buttonKey);
    startTransition(async () => {
      let r;
      try {
        r = await sendReadingReminder(memberId, keys);
      } catch {
        r = { ok: false as const, message: 'That did not go through. Check your connection and try again.' };
      }
      setBusy(null);
      setSaid((s) => ({ ...s, [memberId]: { ok: r.ok, message: r.message } }));
      if (r.ok && r.keys.length > 0) {
        setSentNow((s) => ({
          ...s,
          [memberId]: { ...(s[memberId] ?? {}), ...Object.fromEntries(r.keys.map((k) => [k, r.at])) },
        }));
      }
    });
  }

  const small =
    'tap rounded-lg border-2 border-skyLine bg-white px-3.5 py-2 text-sm font-semibold text-navy transition-colors hover:border-sky disabled:opacity-50';

  /** One outstanding document, with the button that emails it to the member. */
  const sendRow = (r: ReaderRow, i: Item) => {
    const when = lastSent(r.id, i.key);
    const key = `${r.id}|${i.key}`;
    return (
      <li key={i.key} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
        <span className="min-w-0">
          {i.title}
          {!i.everyone && i.who && <span className="block text-xs text-slate2">{i.who}</span>}
          {when && <span className="block text-xs text-slate2">Emailed {day(when)}</span>}
        </span>
        <button
          type="button"
          className={small}
          disabled={!mail || pending}
          aria-describedby={mail ? undefined : 'no-mail-reminders'}
          onClick={() => send(r.id, [i.key], key)}
        >
          {busy === key ? 'Sending…' : when ? 'Email it again' : 'Email it to them'}
          <span className="sr-only">
            : {i.title}, to {r.name || r.email}
          </span>
        </button>
      </li>
    );
  };

  const rows = useMemo(
    () =>
      readers.map((r) => {
        const done = everyoneKeys.filter((k) => r.confirmed[k]).length;
        return { ...r, done, complete: done === everyoneKeys.length };
      }),
    [readers, everyoneKeys],
  );

  const complete = rows.filter((r) => r.complete).length;
  const started = rows.filter((r) => !r.complete && r.done > 0).length;
  const notStarted = rows.length - complete - started;

  const q = query.trim().toLowerCase();
  const shown = rows.filter(
    (r) =>
      (show === 'all' || (show === 'done' ? r.complete : !r.complete)) &&
      (!q || `${r.name} ${r.email}`.toLowerCase().includes(q)),
  );

  const chips: { key: Show; label: string; n: number }[] = [
    { key: 'outstanding', label: 'Still to confirm', n: rows.length - complete },
    { key: 'done', label: 'Confirmed everything', n: complete },
    { key: 'all', label: 'Everybody', n: rows.length },
  ];

  return (
    <div>
      <p className="mb-5 max-w-prose2 text-ink">
        <strong className="text-navy">{complete}</strong> of {rows.length}{' '}
        {rows.length === 1 ? 'member has' : 'members have'} confirmed all {everyoneKeys.length} documents that apply to
        everybody. <strong className="text-navy">{started}</strong> {started === 1 ? 'has' : 'have'} made a start and{' '}
        <strong className="text-navy">{notStarted}</strong> {notStarted === 1 ? 'has' : 'have'} confirmed none yet.
      </p>

      {!mail && (
        <p id="no-mail-reminders" className="card mb-5 max-w-prose2 border-l-4 border-warn px-5 py-4 text-sm text-ink">
          <strong>Reminders cannot be emailed yet</strong>, because the club’s email sending is not set up (it needs{' '}
          <code>RESEND_API_KEY</code> and <code>MAIL_FROM</code> in Vercel). The record below is complete without it.
        </p>
      )}

      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1 basis-64">
          <label htmlFor="reader-find" className="mb-1.5 block text-sm font-medium text-navy">
            Find a member
          </label>
          <input
            id="reader-find"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3 text-ink focus:border-sky focus:outline-none"
          />
        </div>
        <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={show === c.key}
              onClick={() => setShow(c.key)}
              className={`tap rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                show === c.key ? 'border-navy bg-navy text-white' : 'border-skyLine bg-white text-navy hover:border-sky'
              }`}
            >
              {c.label} <span className="ml-1.5 font-normal">{c.n}</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="card mt-3 px-5 py-4 text-inkMuted">Nobody here{q ? ' matches that' : ''}.</p>
      ) : (
        <ul className="card mt-3 divide-y divide-skyLine overflow-hidden" aria-live="polite">
          {shown.map((r) => {
            const missing = items.filter((i) => i.everyone && !r.confirmed[i.key]);
            const ticked = items.filter((i) => r.confirmed[i.key]);
            const forSome = items.filter((i) => !i.everyone && !r.confirmed[i.key]);
            return (
              <li key={r.id} className="px-5 py-4">
                <div className="grid gap-x-6 gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy">{r.name || 'No name given'}</p>
                    <p className="break-all text-sm text-ink">{r.email}</p>
                  </div>
                  <p className={`text-sm font-semibold ${r.complete ? 'text-good' : 'text-navy'}`}>
                    {r.complete ? 'All confirmed' : `${r.done} of ${everyoneKeys.length} confirmed`}
                    {!r.signedIn && <span className="block font-normal text-slate2">Has not signed in yet</span>}
                  </p>
                </div>
                <details className="mt-2">
                  <summary className="tap cursor-pointer text-sm font-medium text-skyDark underline underline-offset-4">
                    {r.complete ? 'When each was confirmed, and the duty documents' : `What is outstanding (${missing.length})`}
                    <span className="sr-only"> for {r.name || r.email}</span>
                  </summary>
                  <div className="mt-2 grid gap-x-10 gap-y-3 text-sm md:grid-cols-2">
                    {missing.length > 0 && (
                      <div>
                        <p className="font-semibold text-navy">Not yet confirmed</p>
                        <ul className="mt-1 divide-y divide-skyLine text-ink">
                          {missing.map((i) => sendRow(r, i))}
                        </ul>
                        {missing.length > 1 && (
                          <button
                            type="button"
                            className="pill-solid mt-3 !min-h-[44px] !py-2 text-sm disabled:opacity-50"
                            disabled={!mail || pending}
                            aria-describedby={mail ? undefined : 'no-mail-reminders'}
                            onClick={() => send(r.id, missing.map((i) => i.key), `${r.id}|all`)}
                          >
                            {busy === `${r.id}|all` ? 'Sending…' : `Email all ${missing.length} in one message`}
                            <span className="sr-only"> to {r.name || r.email}</span>
                          </button>
                        )}
                      </div>
                    )}
                    {forSome.length > 0 && (
                      <div>
                        <p className="font-semibold text-navy">For students and particular duties</p>
                        <p className="text-xs text-slate2">
                          Not counted as outstanding. Send one only if it applies to this member.
                        </p>
                        <ul className="mt-1 divide-y divide-skyLine text-ink">{forSome.map((i) => sendRow(r, i))}</ul>
                      </div>
                    )}
                    {ticked.length > 0 && (
                      <div>
                        <p className="font-semibold text-navy">Confirmed</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-ink">
                          {ticked.map((i) => (
                            <li key={i.key}>
                              {i.title}
                              <span className="text-slate2"> — {day(r.confirmed[i.key])}</span>
                              {!i.everyone && i.who && <span className="text-slate2"> ({i.who.toLowerCase()})</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {said[r.id] && (
                    <p
                      role={said[r.id].ok ? 'status' : 'alert'}
                      className={`mt-3 max-w-prose2 rounded-card border-l-4 px-4 py-3 text-sm ${
                        said[r.id].ok ? 'border-good bg-goodTint text-ink' : 'border-bad bg-badTint text-bad'
                      }`}
                    >
                      {said[r.id].message}
                    </p>
                  )}
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
