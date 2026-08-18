import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader, Callout, Badge } from '@/components/ui';
import { collections, getCollection, servedFromOldSite } from '@/content/documents';

/** Pre-render every collection at build time. */
export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  return { title: c ? c.title : 'Collection' };
}

function fmtSize(bytes?: number) {
  if (!bytes) return null;
  if (bytes >= 1_000_000) return `${Math.round(bytes / 1_000_000)} MB`;
  return `${Math.round(bytes / 1000)} KB`;
}

/**
 * One collection — every document in a run, newest first, grouped by year.
 * This is what the Archive boxes used to do badly: they threw members back to
 * the old site's directory listing. Now the listing lives here.
 */
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();

  // Group by year, newest first. Undated items go last.
  const byYear = new Map<string, typeof c.docs>();
  for (const d of c.docs) {
    const y = d.version && /^\d{4}$/.test(d.version) ? d.version : 'Undated';
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(d);
  }
  const years = [...byYear.keys()].sort((a, b) => {
    if (a === 'Undated') return 1;
    if (b === 'Undated') return -1;
    return Number(b) - Number(a);
  });

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/archive" className="link">Archive</Link>
        <span className="mx-2 text-inkMuted" aria-hidden="true">/</span>
        <span className="text-inkMuted">{c.title}</span>
      </nav>

      <PageHeader
        eyebrow={c.span ? `${c.span} · ${c.count} documents` : `${c.count} documents`}
        title={c.title}
        lead="Newest first. Every document in this collection, complete — nothing has been left on the old site."
      />

      {servedFromOldSite && (
        <div className="mb-8">
          <Callout tone="warn" title="Files still open on the old site">
            <p>
              The documents below are listed and ordered here, but the files themselves have not
              moved yet — opening one asks for the members&rsquo; username and password, the same
              one you have always used. That extra step disappears once the archive is hosted.
            </p>
          </Callout>
        </div>
      )}

      {years.map((year) => (
        <section key={year} className="mb-8">
          <h2 className="mb-3 text-2xl">{year}</h2>
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {byYear.get(year)!.map((d) => {
              const external = !d.href.startsWith('/');
              const size = fmtSize((d as { bytes?: number }).bytes);
              return (
                <li key={d.id}>
                  <a
                    href={d.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-sky50 transition-colors"
                  >
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className={`font-medium ${d.superseded ? 'text-inkMuted' : 'text-navy'}`}>
                          {d.title}
                        </span>
                        {d.superseded && <Badge tone="warn">No longer in force</Badge>}
                      </span>
                      {d.note && <span className="mt-1 block max-w-prose2 text-sm text-inkMuted">{d.note}</span>}
                      <span className="mt-1 block text-xs text-slate2">
                        {d.format ?? 'PDF'}
                        {size ? ` · ${size}` : ''}
                        {' · '}
                        {d.audience.join(' · ')}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-skyTint text-sky"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="sr-only">Download{external ? ' (opens in a new tab)' : ''}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/archive" className="link">← All collections</Link>
        <Link href="/documents" className="link">Search all documents</Link>
      </div>
    </>
  );
}
