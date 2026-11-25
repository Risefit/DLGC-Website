import Link from 'next/link';
import { PageHeader, Section, Badge } from '@/components/ui';
import { archiveCollections, looseDocs, searchDocs, documents } from '@/content/documents';
import { newsView } from '@/lib/news';

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
  const { archivedNews, currentNewsYear } = await newsView();

  const cols = q
    ? archiveCollections.filter(
        (c) =>
          c.title.toLowerCase().includes(q.toLowerCase()) ||
          c.docs.some((d) => d.title.toLowerCase().includes(q.toLowerCase()))
      )
    : archiveCollections;

  const loose = searchDocs(looseDocs('archive'), q);
  const totalArchived = documents.filter((d) => d.tier === 'archive').length;
  // Count only the ARCHIVED documents reachable via a collection. Summing
  // c.count would include each collection's current-tier members and produce
  // a number larger than the archive itself.
  const archivedInCollections = archiveCollections.reduce(
    (n, c) => n + c.docs.filter((d) => d.tier === 'archive').length,
    0
  );

  return (
    <>
      <PageHeader
        eyebrow="Kept forever, out of your way"
        title="Archive"
        lead={`${totalArchived} historic documents — minutes back to 2003, newsletters back to 2004, past accident reviews and superseded guidance. Nothing has been deleted.`}
      />


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
          <p className="text-sm text-inkMuted">No collections match that search.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* News is a collection too — it just lives in news.ts rather than
                the document manifest, so it is added by hand here. */}
            {archivedNews.length > 0 && (
              <Link
                href="/archive/news"
                className="card-interactive flex flex-col p-5"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-lg font-semibold text-navy">News and Notices</span>
                  <Badge tone="archive">before {currentNewsYear}</Badge>
                </span>
                <span className="mt-2 flex-1 text-sm text-inkMuted">
                  {archivedNews.length} notices, with the photographs and documents each one linked to
                </span>
                <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-sky">
                  Browse the collection
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            )}
            {cols.map((c) => (
              <Link
                key={c.slug}
                href={`/archive/${c.slug}`}
                className="card-interactive flex flex-col p-5"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-lg font-semibold text-navy">{c.title}</span>
                  {c.span && <Badge tone="archive">{c.span}</Badge>}
                </span>
                <span className="mt-2 flex-1 text-sm text-inkMuted">
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
        description="Historic items that do not belong to a run are in the document library, under its Archive filter, where they can be searched with everything else."
      >
        <Link href="/documents?tier=archive" className="pill-solid">
          Open all {totalArchived} archived documents
        </Link>
      </Section>

      <p className="text-sm text-inkMuted">
        Looking for something current instead?{' '}
        <Link href="/documents" className="link">Search all documents</Link>.
      </p>
    </>
  );
}
