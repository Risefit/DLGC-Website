'use client';

import { useMemo, useState } from 'react';
import {
  documents,
  categories,
  audiences,
  searchDocs,
  isOverdue,
  type Doc,
  type Tier,
  type Audience,
} from '@/content/documents';
import { Badge } from '@/components/ui';

type TierFilter = Tier | 'all' | 'current';

const TIERS: { key: TierFilter; label: string; hint: string }[] = [
  { key: 'current', label: 'Current', hint: 'In force today — this is the default, and what you want almost every time' },
  { key: 'live', label: 'This season', hint: 'Changes during the year — fees, rotas, current notices' },
  { key: 'reference', label: 'Reference', hint: 'Current manuals, rules and policies' },
  { key: 'archive', label: 'Archive', hint: 'Historic and superseded — kept forever, out of your way' },
  { key: 'all', label: 'Everything', hint: 'Current and archive together' },
];

function tierTone(t: Tier) {
  return t === 'live' ? 'live' : t === 'reference' ? 'reference' : 'archive';
}

function DocRow({ d }: { d: Doc }) {
  const external = !d.href.startsWith('/');
  const overdue = isOverdue(d);

  return (
    <li>
      <a
        href={d.href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="block px-5 py-4 hover:bg-sky50 transition-colors"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
          <span className={`font-medium ${d.superseded ? 'text-inkMuted' : 'text-navy'}`}>
            {d.title}
          </span>
          <Badge tone={tierTone(d.tier)}>
            {d.tier === 'live' ? 'This season' : d.tier === 'reference' ? 'Reference' : 'Archive'}
          </Badge>
          {d.superseded && <Badge tone="warn">No longer in force</Badge>}
          {overdue && <Badge tone="warn">Overdue for review</Badge>}
          {external && (
            <span className="text-xs text-slate2">
              opens in a new tab
              <span className="sr-only"> (external)</span>
            </span>
          )}
        </div>

        {d.note && <p className="mt-1 max-w-prose2 text-sm text-inkMuted">{d.note}</p>}

        <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate2">
          <span>{d.category}</span>
          {d.format && <span>{d.format}</span>}
          {d.bytes && d.bytes > 5_000_000 && (
            <span className="font-medium text-warn">
              Large file — {(d.bytes / 1_000_000).toFixed(0)} MB
            </span>
          )}
          {d.version && <span>Version: {d.version}</span>}
          {d.owner && <span>Owner: {d.owner}</span>}
          {d.reviewDue && (
            <span className={overdue ? 'font-medium text-warn' : ''}>
              Review due {new Date(d.reviewDue).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </span>
          )}
          <span>{d.audience.join(' · ')}</span>
        </p>
      </a>
    </li>
  );
}

export default function DocumentLibrary({
  initialQuery = '',
  initialTier = 'current',
  initialReview = '',
}: {
  initialQuery?: string;
  initialTier?: TierFilter;
  initialReview?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [tier, setTier] = useState<TierFilter>(initialTier);
  const [category, setCategory] = useState<string>('all');
  const [audience, setAudience] = useState<Audience | 'all'>('all');
  const [onlyOverdue, setOnlyOverdue] = useState(initialReview === 'overdue');

  const results = useMemo(() => {
    let out = documents;
    if (tier === 'current') out = out.filter((d) => d.tier !== 'archive');
    else if (tier !== 'all') out = out.filter((d) => d.tier === tier);
    if (category !== 'all') out = out.filter((d) => d.category === category);
    if (audience !== 'all') out = out.filter((d) => d.audience.includes(audience));
    if (onlyOverdue) out = out.filter((d) => isOverdue(d));
    out = searchDocs(out, q);
    // Live first, then reference, then archive; alphabetical within each.
    const rank: Record<Tier, number> = { live: 0, reference: 1, archive: 2 };
    return [...out].sort((a, b) => rank[a.tier] - rank[b.tier] || a.title.localeCompare(b.title));
  }, [q, tier, category, audience, onlyOverdue]);

  const grouped = useMemo(() => {
    const map = new Map<string, Doc[]>();
    for (const d of results) {
      const k = d.category;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(d);
    }
    return [...map.entries()];
  }, [results]);

  const filtersActive = q || tier !== 'current' || category !== 'all' || audience !== 'all' || onlyOverdue;

  return (
    <div>
      {/* Search */}
      <div className="card mb-5 p-5">
        <label htmlFor="doc-search" className="mb-2 block font-medium text-navy">
          Search documents
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
            placeholder="Manuals, minutes, policies, rotas…"
            className="w-full rounded-lg border-2 border-skyLine bg-white py-3.5 pl-12 pr-4
                       text-ink placeholder:text-slate2/70 focus:border-sky focus:outline-none"
          />
        </div>
        <p className="mt-2 text-xs text-slate2">
          Searches titles, descriptions, versions and owners. Try &ldquo;winch&rdquo;,
          &ldquo;medical&rdquo;, &ldquo;minutes&rdquo; or &ldquo;child protection&rdquo;.
        </p>
      </div>

      {/* Tier tabs */}
      <div className="mb-5">
        <div role="group" aria-label="Filter by tier" className="flex flex-wrap gap-2">
          {TIERS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTier(t.key)}
              aria-pressed={tier === t.key}
              title={t.hint}
              className={`tap rounded-lg border-2 px-4 py-2.5 font-medium transition-colors ${
                tier === t.key
                  ? 'border-sky bg-sky text-white'
                  : 'border-skyLine bg-white text-navy hover:border-sky'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate2">{TIERS.find((t) => t.key === tier)?.hint}</p>
      </div>

      {/* Facets */}
      <div className="card mb-6 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="f-cat" className="mb-1.5 block text-sm font-medium text-navy">Category</label>
          <select
            id="f-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border-2 border-skyLine bg-white px-3 py-2.5 focus:border-sky focus:outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
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
            {audiences.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="flex items-end">
          <label className="tap cursor-pointer gap-3 text-sm">
            <input
              type="checkbox"
              checked={onlyOverdue}
              onChange={(e) => setOnlyOverdue(e.target.checked)}
              className="h-5 w-5 rounded border-2 border-skyLine text-sky focus:ring-sky"
            />
            <span className="text-navy">Only show overdue for review</span>
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-inkMuted">
          <strong className="text-navy">{results.length}</strong>{' '}
          {results.length === 1 ? 'document' : 'documents'}
          {filtersActive && ' matching your filters'}
        </p>
        {filtersActive && (
          <button
            type="button"
            onClick={() => { setQ(''); setTier('current'); setCategory('all'); setAudience('all'); setOnlyOverdue(false); }}
            className="link tap text-sm"
          >
            Clear all filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-lg font-medium text-navy">Nothing matched</p>
          <p className="mt-1 text-sm text-inkMuted">
            Try a shorter search, or clear the filters. If you are certain the club has this
            document and it isn&rsquo;t here, tell the website editor — it may still be waiting to
            be imported from the old site.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([cat, docs]) => (
            <section key={cat}>
              <h2 className="mb-2 text-xl">{cat}</h2>
              <ul className="card divide-y divide-skyLine overflow-hidden">
                {docs.map((d) => <DocRow key={d.id} d={d} />)}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
