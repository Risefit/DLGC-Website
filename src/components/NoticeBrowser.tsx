'use client';

import { useMemo, useState } from 'react';
import type { CfiNotice } from '@/content/notices';

/**
 * The CFI's notices. On the old site these were one very long page with an
 * anchor index at the top, so finding the radio frequency notice meant
 * scrolling past eleven others and then scrolling back.
 *
 * Here each is a card, newest first, opening on click, with a search box across
 * all of them. Several stay relevant for years, so nothing is hidden by date.
 */
export default function NoticeBrowser({ notices }: { notices: CfiNotice[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  const shown = useMemo(
    () =>
      query
        ? notices.filter((n) => `${n.num} ${n.title} ${n.body}`.toLowerCase().includes(query))
        : notices,
    [notices, query]
  );

  return (
    <>
      <div className="mb-6 card p-5">
        <label htmlFor="cfi-search" className="mb-1.5 block text-sm font-medium text-navy">
          Search the notices
        </label>
        <input
          id="cfi-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="radio, FLARM, annual check, rigging, cable…"
          className="w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3.5 placeholder:text-slate2/70 focus:border-sky focus:outline-none"
        />
        <p className="mt-2 text-sm text-inkMuted" aria-live="polite">
          {query
            ? `${shown.length} of ${notices.length} notices match.`
            : `${notices.length} notices, newest first.`}
        </p>
      </div>

      {shown.length === 0 && (
        <div className="card p-6">
          <p className="text-inkMuted">Nothing matches that. Try a single word.</p>
        </div>
      )}

      <ul className="space-y-3">
        {shown.map((n) => {
          const isOpen = open === n.num;
          return (
            <li key={n.num} className={`card overflow-hidden ${isOpen ? 'border-sky' : ''}`}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : n.num)}
                  aria-expanded={isOpen}
                  aria-controls={`cfi-${n.num}`}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-sky50"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sunken font-bold text-navy"
                  >
                    {n.num}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy">{n.title}</span>
                    <span className="block text-sm text-inkMuted">
                      CFI&rsquo;s Notice {n.num}
                      {n.date && ` · ${n.date}`}
                    </span>
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className={`shrink-0 text-inkMuted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M2 5l6 6 6-6" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </h3>

              {isOpen && (
                <div id={`cfi-${n.num}`} className="border-t border-skyLine px-5 py-5">
                  <div className="prose-club">
                    <p>{n.body}</p>
                  </div>
                  {n.links.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2 border-t border-skyLine pt-4">
                      {n.links.map((l) => (
                        <li key={l.href} className="min-w-0 max-w-full">
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tap inline-flex max-w-full items-center gap-2 break-words rounded-lg border-2 border-skyLine bg-skyTint px-3.5 py-2 text-left text-sm font-semibold text-navy transition-colors hover:border-sky"
                          >
                            <span className="min-w-0 break-words">{l.label}</span>
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    className="tap mt-4 rounded-lg border-2 border-skyLine px-4 py-2.5 text-sm font-medium text-navy hover:border-sky"
                  >
                    Close this notice
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
