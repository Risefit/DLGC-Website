'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { findIt } from '@/content/site';

/**
 * The old site's "Find It" A–Z, kept as a safety net.
 *
 * The old site NEEDED this because its navigation didn't work. We don't — but
 * members spent years learning this vocabulary, and these ~130 entries are free,
 * hard-won evidence of what people actually look for. So it survives as a
 * redirect map: old term in, new location out.
 */
export default function FindItPage() {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    const list = n ? findIt.filter((e) => e.term.toLowerCase().includes(n)) : findIt;
    return [...list].sort((a, b) => a.term.localeCompare(b.term));
  }, [q]);

  return (
    <>
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky">
          From the old site
        </p>
        <h1 className="text-3xl lg:text-4xl">Find It (A–Z)</h1>
        <p className="mt-3 max-w-prose2 text-slate2">
          Knew your way around the old members&rsquo; site? Look up the old subject name here and
          it will tell you where that thing lives now.
        </p>
      </div>

      <div className="card mb-6 p-5">
        <label htmlFor="findit" className="mb-2 block font-medium text-navy">
          Look up a subject
        </label>
        <input
          id="findit"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. weak links, caravans, mole trapping…"
          className="w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3.5
                     placeholder:text-slate2/70 focus:border-sky focus:outline-none"
        />
        <p className="mt-2 text-xs text-slate2">
          Can&rsquo;t see it? Try{' '}
          <Link href="/documents" className="link">searching all documents</Link> instead — that
          searches the full text, not just these headings.
        </p>
      </div>

      <p aria-live="polite" className="mb-3 text-sm text-slate2">
        <strong className="text-navy">{results.length}</strong>{' '}
        {results.length === 1 ? 'entry' : 'entries'}
      </p>

      <ul className="card divide-y divide-skyLine overflow-hidden">
        {results.map((e) => (
          <li key={e.term}>
            <Link
              href={e.to}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4 hover:bg-skyTint transition-colors"
            >
              <span className="font-medium text-navy">{e.term}</span>
              <span className="flex items-center gap-1.5 text-sm text-sky">
                {e.label}
                <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {results.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-lg font-medium text-navy">No match in the old A–Z</p>
          <p className="mt-1 text-sm text-slate2">
            <Link href="/documents" className="link">Search all documents</Link> — it covers far more
            than this list did.
          </p>
        </div>
      )}
    </>
  );
}
