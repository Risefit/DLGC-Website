import Link from 'next/link';
import { PageHeader } from '@/components/ui';
import { newsView } from '@/lib/news';

export const metadata = { title: 'News Archive' };

/**
 * A year index rather than one enormous page. 608 notices rendered together is
 * a slow page on a phone and impossible to navigate; a year is a size a member
 * can actually read.
 */
/** Rebuilt when a notice is posted, and hourly in any case. */
export const revalidate = 3600;

export default async function NewsArchiveIndex() {
  const { archivedNews, currentNewsYear, newsYears } = await newsView();
  const years = newsYears.filter((y) => y.year < currentNewsYear);

  return (
    <>

      <PageHeader
        back={{ href: '/archive', label: 'Archive' }}
        eyebrow={`${archivedNews.length} notices before ${currentNewsYear}`}
        title="News Archive"
        lead="Every notice the club has published since 2016, kept in full — including the photographs and documents each one linked to. Choose a year."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {years.map((y) => (
          <li key={y.year}>
            <Link
              href={`/archive/news/${y.year}`}
              className="card-interactive flex h-full flex-col p-5"
            >
              <span className="text-3xl font-bold text-navy">{y.year}</span>
              <span className="mt-1 text-sm text-inkMuted">
                {y.count} {y.count === 1 ? 'notice' : 'notices'}
              </span>
              {y.sample && (
                <span className="mt-3 line-clamp-2 text-sm text-ink/80">
                  Including &ldquo;{y.sample}&rdquo;
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/club-life/news" className="link tap">
          &larr; This year&rsquo;s news
        </Link>
        <Link href="/archive" className="link tap">
          All archive collections
        </Link>
      </div>
    </>
  );
}
