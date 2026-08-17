import Link from 'next/link';
import { PageHeader, Section, Callout, Badge } from '@/components/ui';
import { archiveCollections, documents, searchDocs } from '@/content/documents';

export const metadata = { title: 'Archive' };

/**
 * The archive is the answer to "reorganise so the relevant stuff is obvious".
 * Nothing is deleted. Everything historic lives here — out of the daily flow,
 * but one click away and fully searchable.
 */
export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const archived = documents.filter((d) => d.tier === 'archive');
  const results = searchDocs(archived, q);

  const filteredCollections = q
    ? archiveCollections.filter((c) =>
        `${c.title} ${c.note}`.toLowerCase().includes(q.toLowerCase())
      )
    : archiveCollections;

  return (
    <>
      <PageHeader
        eyebrow="Kept forever, out of your way"
        title="Archive"
        lead="The club's history — minutes back to 2003, newsletters back to 2004, galleries, past accident reviews and superseded documents. Nothing has been deleted."
      />

      <div className="mb-8">
        <Callout tone="info" title="Why an archive rather than a delete">
          <p>
            Storage is trivial; club history isn&rsquo;t recoverable once it&rsquo;s gone. Everything
            from the old site is preserved here and stays searchable. Superseded documents are kept
            too, clearly labelled as no longer in force, so nobody acts on old guidance by mistake
            but the record survives.
          </p>
        </Callout>
      </div>

      {q && (
        <p className="mb-6 rounded-lg bg-skyTint px-4 py-3 text-sm">
          Showing archive matches for <strong>&ldquo;{q}&rdquo;</strong>.{' '}
          <Link href="/archive" className="link">Show everything</Link>
        </p>
      )}

      <Section
        title="Collections"
        description="Complete runs of the club's recurring documents. Browse by year."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex flex-col p-5 hover:shadow-lift hover:border-sky transition-all"
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-lg font-semibold text-navy">{c.title}</span>
                <Badge tone="archive">{c.span}</Badge>
              </span>
              <span className="mt-1.5 flex-1 text-sm text-slate2">{c.note}</span>
              <span className="mt-3 text-xs font-medium text-sky">{c.count}</span>
            </a>
          ))}
        </div>
        {filteredCollections.length === 0 && (
          <p className="text-sm text-slate2">No collections match that search.</p>
        )}
      </Section>

      <Section
        title="Individual archived documents"
        description="Historic and superseded items, kept for the record."
      >
        {results.length === 0 ? (
          <p className="text-sm text-slate2">Nothing in the archive matches that search.</p>
        ) : (
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {results.map((d) => (
              <li key={d.id}>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
            ))}
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
