'use client';

import { useMemo, useState } from 'react';
import type { SafetyLesson } from '@/content/safety-log';

/**
 * The Safety Lessons Log — 400-odd entries going back to 2003.
 *
 * Shown five years at a time with a Show more button, because a single page of
 * everything is a page nobody reaches the bottom of, and the recent entries are
 * the ones that change behaviour. Search covers the whole log regardless of how
 * many years are on screen, so nothing is hidden from someone looking for it.
 */
export default function SafetyLogBrowser({
  lessons,
  years,
  initialYears,
}: {
  lessons: SafetyLesson[];
  years: number[];
  initialYears: number;
}) {
  const [shownYears, setShownYears] = useState(initialYears);
  const [q, setQ] = useState('');

  const query = q.trim().toLowerCase();

  const visible = useMemo(() => {
    if (query) {
      return lessons.filter((l) =>
        `${l.title} ${l.report} ${l.lessons} ${l.actions} ${l.displayDate}`.toLowerCase().includes(query)
      );
    }
    const cutoff = years[Math.min(shownYears, years.length) - 1];
    return lessons.filter((l) => l.year >= cutoff);
  }, [lessons, years, shownYears, query]);

  const grouped = useMemo(() => {
    const map = new Map<number, SafetyLesson[]>();
    for (const l of visible) {
      if (!map.has(l.year)) map.set(l.year, []);
      map.get(l.year)!.push(l);
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [visible]);

  const moreYears = years.length - shownYears;

  return (
    <>
      <div className="mb-6 card p-5">
        <label htmlFor="sll-search" className="mb-1.5 block text-sm font-medium text-navy">
          Search the whole log
        </label>
        <input
          id="sll-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="cable, canopy, winch, undercarriage, airbrake…"
          className="w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3.5 placeholder:text-slate2/70 focus:border-sky focus:outline-none"
        />
        <p className="mt-2 text-sm text-inkMuted" aria-live="polite">
          {query
            ? `${visible.length} ${visible.length === 1 ? 'entry' : 'entries'} match “${q.trim()}”, across all ${years.length} years.`
            : `Showing ${visible.length} entries from the last ${Math.min(shownYears, years.length)} years. ${lessons.length} in total.`}
        </p>
      </div>

      {grouped.length === 0 && (
        <div className="card p-6">
          <p className="text-inkMuted">
            Nothing matches that. Try a single word — the entries are written in plain language.
          </p>
        </div>
      )}

      {grouped.map(([year, items]) => (
        <section key={year} className="mb-10">
          <h2 className="mb-4 text-2xl">{year}</h2>
          <ul className="space-y-4">
            {items.map((l) => (
              <li key={l.id} className="card overflow-hidden">
                <div className="border-b border-skyLine bg-sunken px-5 py-3">
                  <h3 className="text-lg font-semibold text-navy">{l.title}</h3>
                  <p className="text-sm text-inkMuted">{l.displayDate}</p>
                </div>
                <dl className="grid gap-px bg-skyLine lg:grid-cols-3">
                  {[
                    ['What happened', l.report],
                    ['Lessons learned', l.lessons],
                    ['Actions', l.actions],
                  ].map(([head, value]) => (
                    <div key={head} className="bg-white px-5 py-4">
                      <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-sky">{head}</dt>
                      <dd className="text-sm leading-relaxed">
                        {value ? value : <span className="text-inkMuted">—</span>}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {!query && moreYears > 0 && (
        <div className="rounded-card border-2 border-dashed border-skyLine bg-white p-6 text-center">
          <p className="text-sm text-inkMuted">
            {moreYears} earlier {moreYears === 1 ? 'year is' : 'years are'} kept too, back to{' '}
            {years[years.length - 1]}. Nothing has been deleted.
          </p>
          <button
            type="button"
            onClick={() => setShownYears((n) => Math.min(n + 5, years.length))}
            className="tap mt-3 rounded-lg bg-sky px-6 py-3.5 font-semibold text-white transition-colors hover:bg-skyDark"
          >
            Show {Math.min(5, moreYears)} more {Math.min(5, moreYears) === 1 ? 'year' : 'years'}
          </button>
          <button
            type="button"
            onClick={() => setShownYears(years.length)}
            className="tap mt-3 ml-3 rounded-lg border-2 border-skyLine px-5 py-3 font-medium text-navy hover:border-sky"
          >
            Show everything
          </button>
        </div>
      )}
    </>
  );
}
