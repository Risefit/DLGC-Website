import Link from 'next/link';
import { PageHeader, Section, Callout, Badge } from '@/components/ui';
import { archiveCollections, looseDocs, searchDocs, documents } from '@/content/documents';

export const metadata = { title: 'Archive' };

function fmtSize(bytes: number) {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
  if (bytes >= 1_000_000) return `${Math.round(bytes / 1_000_000)} MB`;
  return `${Math.round(bytes / 1000)} KB`;
}

/**
 * The archive is the answer to "reorganise so the relevant stuff is obvious".
 * Nothing is deleted. Everything historic lives here — out of the daily flow,
 * one click away, and browsable INSIDE the portal rather than bouncing members
 * back to the old site.
 */
export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;

  const cols = q
    ? archiveCollections.filter(
        (c) =>
          c.title.toLowerCase().includes(q.toLowerCase()) ||
          c.docs.some((d) => d.title.toLowerCase().includes(q.toLowerCase()))
      )
    : archiveCollections;

  const loose = searchDocs(looseDocs('archive'), q);
  const totalArchived = documents.filter((d) => d.tier === 'archive').length;
  const inCollections = archiveCollections.reduce((n, c) => n + c.count, 0);

  return (
    <>
      <PageHeader
        eyebrow="Kept forever, out of your way"
        title="Archive"
        lead={`${totalArchived} historic documents — minutes back to 2003, newsletters back to 2004, past accident reviews and superseded guidance. Nothing has been deleted.`}
      />

      <div className="mb-8">
        <Callout tone="info" title="How the archive is organised">
          <p>
            Anything that forms a run — AGM minutes, committee minutes, newsletters — is grouped
            into a <strong>collection</strong>. Open one and you get every document in it, newest
            first. Documents that don&rsquo;t belong to a run are listed individually below.
          </p>
          <p>
            {inCollections} of the {totalArchived} archived documents sit in{' '}
            {archiveCollections.length} collections, which is why this page is short and the old
            Links Library was not.
          </p>
        </Callout>
      </div>

      <form action="/archive" className="card mb-8 p-5">
        <label htmlFor="archive-q" className="mb-2 block font-medium text-navy">
          Search the archive
        </label>
        <div className="flex flex-wrap gap-3">
          <input
            id="archive-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="e.g. 2014 minutes, accident review, newsletter…"
            className="min-w-0 flex-1 rounded-lg border-2 border-skyLine bg-white px-4 py-3.5
                       placeholder:text-slate2/70 focus:border-sky focus:outline-none"
          />
          <button
            type="submit"
            className="tap rounded-lg bg-sky px-6 py-3 font-medium text-white hover:bg-skyDark transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {q && (
        <p className="mb-6 rounded-lg bg-skyTint px-4 py-3 text-sm">
          Showing archive matches for <strong>&ldquo;{q}&rdquo;</strong>.{' '}
          <Link href="/archive" className="link">Show everything</Link>
        </p>
      )}

      <Section
        title="Collections"
        description="Complete runs of the club's recurring documents. Every one opens inside the portal."
      >
        {cols.length === 0 ? (
          <p className="text-sm text-slate2">No collections match that search.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cols.map((c) => (
              <Link
                key={c.slug}
                href={`/archive/${c.slug}`}
                className="card flex flex-col p-5 hover:shadow-lift hover:border-sky transition-all"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-lg font-semibold text-navy">{c.title}</span>
                  {c.span && <Badge tone="archive">{c.span}</Badge>}
                </span>
                <span className="mt-2 flex-1 text-sm text-slate2">
                  {c.count} documents · {fmtSize(c.totalBytes)}
                </span>
                <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-sky">
                  Browse the collection
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Individual documents"
        description="Historic items that don't belong to a run."
      >
        {loose.length === 0 ? (
          <p className="text-sm text-slate2">Nothing here matches that search.</p>
        ) : (
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {loose.map((d) => {
              const external = !d.href.startsWith('/');
              return (
                <li key={d.id}>
                  <a
                    href={d.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="block px-5 py-4 hover:bg-skyTint transition-colors"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                      <span className={`font-medium ${d.superseded ? 'text-slate2' : 'text-navy'}`}>
                        {d.title}
                      </span>
                      {d.superseded && <Badge tone="warn">No longer in force</Badge>}
                      {d.version && <span className="text-xs text-slate2">{d.version}</span>}
                    </span>
                    {d.note && <span className="mt-1 block max-w-prose2 text-sm text-slate2">{d.note}</span>}
                    <span className="mt-1 block text-xs text-slate2">{d.category}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <p className="text-sm text-slate2">
        Looking for something current instead?{' '}
        <Link href="/documents" className="link">Search all documents</Link>.
      </p>
    </>
  );
}
