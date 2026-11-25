'use client';

import { useMemo, useState } from 'react';

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
}: {
  readers: ReaderRow[];
  items: Item[];
  everyoneKeys: string[];
}) {
  const [show, setShow] = useState<Show>('outstanding');
  const [query, setQuery] = useState('');

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
                    {r.complete ? 'When each was confirmed' : `What is outstanding (${missing.length})`}
                    <span className="sr-only"> for {r.name || r.email}</span>
                  </summary>
                  <div className="mt-2 grid gap-x-10 gap-y-3 text-sm md:grid-cols-2">
                    {missing.length > 0 && (
                      <div>
                        <p className="font-semibold text-navy">Not yet confirmed</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-ink">
                          {missing.map((i) => (
                            <li key={i.key}>{i.title}</li>
                          ))}
                        </ul>
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
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
