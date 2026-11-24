'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { findIt } from '@/content/site';
import { documents, rankDocs, categoryLabel } from '@/content/documents';
import { FileKind, outIcon } from '@/components/ui';

/**
 * FIND IT — the old site's A–Z, and now the documents too.
 *
 * The A–Z is the vocabulary members spent years learning ("weak links",
 * "caravans", "mole trapping"): old term in, new location out. A member who
 * types a word here should not have to go and type it again on the Documents
 * page, so the same box also searches the document list and shows the best
 * few matches underneath.
 *
 * The dashboard's search box lands here with `?q=` already filled in.
 */
const DOCS_SHOWN = 8;

export default function FindItBrowser({ initialQuery = '' }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const needle = q.trim().toLowerCase();

  const results = useMemo(() => {
    const list = needle ? findIt.filter((e) => e.term.toLowerCase().includes(needle)) : findIt;
    return [...list].sort((a, b) => a.term.localeCompare(b.term));
  }, [needle]);

  // Documents only once something has been typed — 590 rows is not an answer.
  const docs = useMemo(() => (needle.length >= 2 ? rankDocs(documents, needle) : []), [needle]);

  return (
    <>
      <div className="card mb-6 p-5">
        <label htmlFor="findit" className="mb-2 block font-medium text-navy">
          Look up a subject or a document
        </label>
        <input
          id="findit"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. weak links, caravans, medical, winch…"
          className="w-full rounded-lg border-2 border-skyLine bg-white px-4 py-3.5
                     placeholder:text-slate2/70 focus:border-sky focus:outline-none"
        />
        <p className="mt-2 text-xs text-slate2">
          Searches the A–Z of subjects and the titles of every document the club holds.
        </p>
      </div>

      <h2 className="display mb-1 text-2xl lg:text-3xl">
        {needle ? 'Where to look' : 'The A–Z'}
      </h2>
      <p aria-live="polite" className="mb-3 text-sm text-inkMuted">
        <strong className="text-navy">{results.length}</strong>{' '}
        {results.length === 1 ? 'subject' : 'subjects'}
        {needle && ` matching “${q.trim()}”`}
      </p>

      {results.length > 0 ? (
        <ul className="card divide-y divide-skyLine overflow-hidden">
          {results.map((e) => (
            <li key={e.term}>
              <Link
                href={e.to}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-sky50"
              >
                <span className="font-medium text-navy">{e.term}</span>
                <span className="flex items-center gap-1.5 text-sm text-skyDark">
                  {e.label}
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="card px-5 py-4 text-inkMuted">
          Nothing in the A–Z under that name
          {docs.length > 0 ? ' — but see the documents below.' : '. Try a shorter word.'}
        </p>
      )}

      {needle.length >= 2 && (
        <section aria-labelledby="findit-docs-h" className="mt-10">
          <h2 id="findit-docs-h" className="display mb-1 text-2xl lg:text-3xl">
            In the documents
          </h2>
          <p className="mb-3 text-sm text-inkMuted">
            <strong className="text-navy">{docs.length}</strong>{' '}
            {docs.length === 1 ? 'document' : 'documents'} matching “{q.trim()}”
            {docs.length > DOCS_SHOWN && `, best matches first`}. Documents open in a new tab.
          </p>
          {docs.length > 0 ? (
            <>
              <ul className="card divide-y divide-skyLine overflow-hidden">
                {docs.slice(0, DOCS_SHOWN).map((d) => (
                  <li key={d.id}>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-3 px-5 py-4 transition-colors hover:bg-sky50"
                    >
                      <span className="min-w-0">
                        <span className={`font-medium ${d.superseded ? 'text-inkMuted' : 'text-navy'}`}>
                          {d.title}
                          <FileKind doc={d} />
                        </span>
                        <span className="mt-0.5 block text-sm text-slate2">
                          {categoryLabel(d.category)}
                          {d.tier === 'archive' && ' · Archive'}
                          {d.superseded && ' · No longer in force'}
                        </span>
                      </span>
                      <span className="mt-1.5 text-slate2">{outIcon}</span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
              {docs.length > DOCS_SHOWN && (
                <p className="mt-4">
                  <Link
                    href={`/documents?tier=all&q=${encodeURIComponent(q.trim())}`}
                    className="pill-line"
                  >
                    All {docs.length} in Documents
                  </Link>
                </p>
              )}
            </>
          ) : (
            <p className="card px-5 py-4 text-inkMuted">No document has that in its title.</p>
          )}
        </section>
      )}
    </>
  );
}
