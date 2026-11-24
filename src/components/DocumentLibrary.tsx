'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  documents,
  categories,
  audiences,
  rankDocs,
  categoryLabel,
  isOverdue,
  type Doc,
  type Tier,
  type Audience,
  type Category,
} from '@/content/documents';
import { Badge, FileKind, outIcon } from '@/components/ui';
import { opensNewTab } from '@/lib/files';

/**
 * THE DOCUMENT LIBRARY — search first, then browse.
 *
 * Rebuilt in November 2026 after a member called the old version "a bit of a
 * mess". It used to open with every current document on the page at once,
 * three hundred rows in fifteen groups, under five tier buttons and a row of
 * filters. Now:
 *
 *   1. The search box is the first thing on the page. Results come back as
 *      one list, best match first.
 *   2. With nothing typed, the page shows the categories as tiles, not rows.
 *      Pick one to see what is in it.
 *   3. Old versions are out of the way unless "Archive" or "Everything" is
 *      chosen. (They are archived in documents-imported.ts, not hidden here.)
 *
 * `children` is whatever the page wants shown while nobody is searching — the
 * Required reading band. It steps aside as soon as a search starts.
 */

type Scope = 'current' | 'live' | 'archive' | 'all';

const SCOPES: { key: Scope; label: string; hint: string }[] = [
  { key: 'current', label: 'Current', hint: 'What is in force today.' },
  { key: 'live', label: 'This season', hint: 'What changes through the year: rotas, lists, this year’s notices.' },
  { key: 'archive', label: 'Archive', hint: 'Historic documents and earlier versions, kept for the record.' },
  { key: 'all', label: 'Everything', hint: 'Current and archive together.' },
];

/** One line under each category tile, and the order the tiles come in. */
const ABOUT: [Category, string][] = [
  ['Manuals', 'Pilots, winch, launch marshals, duty clerks'],
  ['Flying Cards', 'White, Red, Yellow, Green and Blue'],
  ['Rules & Constitution', 'The club’s rules'],
  ['Policies', 'Health and safety, data protection, conduct'],
  ['Operational Notices', 'Rotas, bulletins, airspace'],
  ['Flight Training', 'SPL, Bronze theory, progress cards'],
  ['Ground Training', 'Ground handling, the airfield, trailers'],
  ['Safety', 'Briefings, reports and advice'],
  ['Medicals', 'The medical procedure'],
  ['Simulator', 'Guidelines and briefings'],
  ['Aircraft & Maintenance', 'Flight manuals and the workshop'],
  ['Minutes & AGM', 'Minutes, annual reports, accounts'],
  ['Administrative', 'Forms, lists and club business'],
  ['Advisory', 'Articles, and members’ own accounts'],
  ['Competitions & Trophies', 'Blake Robertshaw tasks, trophies'],
  ['Newsletters', 'Every Camphill newsletter'],
];

const PAGE = 40;
const tierRank: Record<Tier, number> = { live: 0, reference: 1, archive: 2 };

function DocRow({ d, showCategory }: { d: Doc; showCategory: boolean }) {
  const blank = opensNewTab(d.href);
  const overdue = isOverdue(d);
  const meta = [
    showCategory ? categoryLabel(d.category) : null,
    d.version ? `Version: ${d.version}` : null,
    d.owner ? `Owner: ${d.owner}` : null,
  ].filter(Boolean);

  return (
    <li>
      <a
        href={d.href}
        target={blank ? '_blank' : undefined}
        rel={blank ? 'noopener noreferrer' : undefined}
        className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-sky50"
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span className={`font-medium ${d.superseded ? 'text-inkMuted' : 'text-navy'}`}>
              {d.title}
              <FileKind doc={d} />
            </span>
            {d.tier === 'live' && <Badge tone="live">This season</Badge>}
            {d.tier === 'archive' && !d.superseded && <Badge tone="archive">Archive</Badge>}
            {d.superseded && <Badge tone="warn">No longer in force</Badge>}
            {overdue && <Badge tone="warn">Overdue for review</Badge>}
          </span>

          {d.note && <span className="mt-1 block max-w-prose2 text-sm text-inkMuted">{d.note}</span>}

          {(meta.length > 0 || (d.bytes && d.bytes > 5_000_000)) && (
            <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate2">
              {meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
              {d.bytes && d.bytes > 5_000_000 && (
                <span className="font-medium text-warn">Large file, {(d.bytes / 1_000_000).toFixed(0)} MB</span>
              )}
            </span>
          )}
        </span>
        {blank && <span className="mt-1.5 text-slate2">{outIcon}</span>}
        {blank && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    </li>
  );
}

export default function DocumentLibrary({
  initialQuery = '',
  initialTier = 'current',
  initialReview = '',
  initialCategory = 'all',
  children,
}: {
  initialQuery?: string;
  initialTier?: Tier | 'all' | 'current';
  initialReview?: string;
  /** Lets a section page link straight to its own slice of the library. */
  initialCategory?: string;
  /** Shown while nobody is searching or browsing — the Required reading band. */
  children?: ReactNode;
}) {
  const [q, setQ] = useState(initialQuery);
  // 'reference' was one of the old five buttons; a bookmark to it means "current".
  const [scope, setScope] = useState<Scope>(initialTier === 'reference' ? 'current' : initialTier);
  const [category, setCategory] = useState<string>(initialCategory);
  const [audience, setAudience] = useState<Audience | 'all'>('all');
  const [onlyOverdue, setOnlyOverdue] = useState(initialReview === 'overdue');
  const [shown, setShown] = useState(PAGE);
  const resultsRef = useRef<HTMLElement>(null);

  const searching = q.trim().length > 0;
  const active = searching || scope !== 'current' || category !== 'all' || audience !== 'all' || onlyOverdue;

  const inScope = useMemo(() => {
    if (scope === 'current') return documents.filter((d) => d.tier !== 'archive');
    if (scope === 'all') return documents;
    return documents.filter((d) => d.tier === scope);
  }, [scope]);

  const results = useMemo(() => {
    let out = inScope;
    if (category !== 'all') out = out.filter((d) => d.category === category);
    if (audience !== 'all') out = out.filter((d) => d.audience.includes(audience));
    if (onlyOverdue) out = out.filter((d) => isOverdue(d));
    if (searching) return rankDocs(out, q);
    // Browsing: this season's first, then alphabetical.
    return [...out].sort((a, b) => tierRank[a.tier] - tierRank[b.tier] || a.title.localeCompare(b.title));
  }, [inScope, q, searching, category, audience, onlyOverdue]);

  // A new search starts again from the top of the list.
  useEffect(() => setShown(PAGE), [q, scope, category, audience, onlyOverdue]);

  /** Browsing everything at once is grouped by category; a search never is. */
  const grouped = useMemo(() => {
    if (searching || category !== 'all') return null;
    const map = new Map<string, Doc[]>();
    for (const d of results) {
      if (!map.has(d.category)) map.set(d.category, []);
      map.get(d.category)!.push(d);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [results, searching, category]);

  const counts = useMemo(() => {
    const current = new Map<string, number>();
    const total = new Map<string, number>();
    for (const d of documents) {
      total.set(d.category, (total.get(d.category) ?? 0) + 1);
      if (d.tier !== 'archive') current.set(d.category, (current.get(d.category) ?? 0) + 1);
    }
    return { current, total };
  }, []);

  const archived = documents.length - documents.filter((d) => d.tier !== 'archive').length;
  const anyOverdue = useMemo(() => documents.some((d) => isOverdue(d)), []);

  function clear() {
    setQ('');
    setScope('current');
    setCategory('all');
    setAudience('all');
    setOnlyOverdue(false);
  }

  function browse(c: Category) {
    setCategory(c);
    // A category with nothing current (the newsletters) is all archive.
    if (!counts.current.get(c)) setScope('all');
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ block: 'start' }));
  }

  const scopeHint = SCOPES.find((s) => s.key === scope)?.hint;
  const heading = searching
    ? `Results for “${q.trim()}”`
    : category !== 'all'
      ? categoryLabel(category)
      : (SCOPES.find((s) => s.key === scope)?.label ?? 'Documents');

  return (
    <>
      {/* ── Search ───────────────────────────────────────────────────────── */}
      <section id="library" className="band-contour scroll-mt-4 py-8 lg:py-10" aria-label="Search the documents">
        <div className="card-panel p-5 lg:p-6">
          <label htmlFor="doc-search" className="mb-2 block text-lg font-semibold text-navy">
            Search the documents
          </label>
          <div className="relative">
            <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-inkMuted">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
                <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              id="doc-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="A manual, a policy, minutes, a form…"
              className="w-full rounded-lg border-2 border-skyLine bg-white py-3.5 pl-12 pr-4
                         text-ink placeholder:text-slate2/70 focus:border-sky focus:outline-none"
            />
          </div>
          <p className="mt-2 text-sm text-slate2">
            Best match first. Try &ldquo;winch&rdquo;, &ldquo;medical&rdquo;, &ldquo;minutes&rdquo; or
            &ldquo;data protection&rdquo;. Documents open in a new tab.
          </p>
          {!active && (
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span className="text-slate2">On this page:</span>
              <a href="#required-reading" className="link">Required reading</a>
              <a href="#browse" className="link">Browse by category</a>
            </p>
          )}

          <div className="mt-5 border-t border-skyLine pt-4">
            <div role="group" aria-label="Which documents to look in" className="flex flex-wrap gap-2">
              {SCOPES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setScope(s.key)}
                  aria-pressed={scope === s.key}
                  className={`tap rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                    scope === s.key
                      ? 'border-navy bg-navy text-white'
                      : 'border-skyLine bg-white text-navy hover:border-navy'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-slate2">{scopeHint}</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
              <div>
                <label htmlFor="f-cat" className="mb-1.5 block text-sm font-medium text-navy">Category</label>
                <select
                  id="f-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border-2 border-skyLine bg-white px-3 py-2.5 focus:border-sky focus:outline-none"
                >
                  <option value="all">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{categoryLabel(c)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="f-aud" className="mb-1.5 block text-sm font-medium text-navy">Who it&rsquo;s for</label>
                <select
                  id="f-aud"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as Audience | 'all')}
                  className="w-full rounded-lg border-2 border-skyLine bg-white px-3 py-2.5 focus:border-sky focus:outline-none"
                >
                  <option value="all">Anyone</option>
                  {audiences.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              {(anyOverdue || onlyOverdue) && (
                <div className="flex items-end">
                  <label className="tap cursor-pointer gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={onlyOverdue}
                      onChange={(e) => setOnlyOverdue(e.target.checked)}
                      className="h-5 w-5 rounded border-2 border-skyLine text-sky focus:ring-sky"
                    />
                    <span className="text-navy">Only overdue for review</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {active ? (
        /* ── Results ──────────────────────────────────────────────────── */
        <section ref={resultsRef} id="results" className="band-white scroll-mt-4 py-8 lg:py-10" aria-label="Documents found">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="display text-2xl lg:text-3xl">{heading}</h2>
              <p aria-live="polite" className="mt-1 text-sm text-inkMuted">
                <strong className="text-navy">{results.length}</strong>{' '}
                {results.length === 1 ? 'document' : 'documents'}
                {searching && results.length > 1 && ', best match first'}
              </p>
            </div>
            <button type="button" onClick={clear} className="pill-line">
              Clear and start again
            </button>
          </div>

          {results.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-lg font-medium text-navy">Nothing matched</p>
              <p className="mt-1 text-sm text-inkMuted">
                Try a shorter word
                {scope !== 'all' && (
                  <>
                    , or{' '}
                    <button type="button" onClick={() => setScope('all')} className="link">
                      look in the archive as well
                    </button>
                  </>
                )}
                . If you are certain the club has this document and it isn&rsquo;t here, tell the
                website editor.
              </p>
            </div>
          ) : grouped ? (
            <div className="space-y-10">
              {grouped.map(([cat, docs]) => (
                <section key={cat}>
                  <h3 className="display mb-3 text-xl lg:text-2xl">
                    {categoryLabel(cat)}{' '}
                    <span className="font-sans text-base font-normal tracking-normal text-slate2">{docs.length}</span>
                  </h3>
                  <ul className="card divide-y divide-skyLine overflow-hidden">
                    {docs.map((d) => (
                      <DocRow key={d.id} d={d} showCategory={false} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <>
              <ul className="card divide-y divide-skyLine overflow-hidden">
                {results.slice(0, shown).map((d) => (
                  <DocRow key={d.id} d={d} showCategory={category === 'all'} />
                ))}
              </ul>
              {results.length > shown && (
                <p className="mt-5">
                  <button type="button" onClick={() => setShown((n) => n + PAGE)} className="pill-line">
                    Show {Math.min(PAGE, results.length - shown)} more
                  </button>
                  <span className="ml-3 text-sm text-slate2">
                    Showing {shown} of {results.length}
                  </span>
                </p>
              )}
            </>
          )}
        </section>
      ) : (
        <>
          {children}

          {/* ── Browse ───────────────────────────────────────────────── */}
          <section id="browse" className="band-cloud scroll-mt-4 py-8 lg:py-12" aria-labelledby="browse-h">
            <h2 id="browse-h" className="display text-3xl lg:text-[2.6rem]">
              Browse <em>by category</em>
            </h2>
            <p className="mb-6 mt-2 max-w-prose2 text-inkMuted">
              Current documents only. Earlier versions and historic papers are in the archive.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ABOUT.map(([c, about]) => {
                const n = counts.current.get(c) ?? 0;
                const all = counts.total.get(c) ?? 0;
                if (!all) return null;
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => browse(c)}
                      className="card-interactive flex h-full w-full items-start justify-between gap-4 p-5 text-left"
                    >
                      <span>
                        <span className="block font-semibold text-navy">{categoryLabel(c)}</span>
                        <span className="mt-1 block text-sm text-inkMuted">{about}</span>
                      </span>
                      <span className="text-right">
                        <span className="figure block text-2xl text-navy">{n || all}</span>
                        {!n && <span className="block text-xs text-slate2">archive</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
              <li>
                <Link href="/archive" className="card-interactive flex h-full items-start justify-between gap-4 p-5">
                  <span>
                    <span className="block font-semibold text-navy">The archive</span>
                    <span className="mt-1 block text-sm text-inkMuted">
                      Minutes, newsletters and earlier versions, by collection
                    </span>
                  </span>
                  <span className="figure text-2xl text-navy">{archived}</span>
                </Link>
              </li>
            </ul>
          </section>
        </>
      )}
    </>
  );
}
