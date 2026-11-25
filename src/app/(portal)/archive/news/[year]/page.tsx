import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui';
import NewsArticle from '@/components/NewsArticle';
import { currentNewsYear as fileNewsYear, newsYears as fileNewsYears } from '@/content/news';
import { newsView } from '@/lib/news';

/** Rebuilt when a notice is posted, and hourly in any case. */
export const revalidate = 3600;

/** The years in the news file are built ahead; any other year is built when first asked for. */
export function generateStaticParams() {
  return fileNewsYears.filter((y) => y.year < fileNewsYear).map((y) => ({ year: String(y.year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  return { title: `News and Notices ${year}` };
}

export default async function NewsYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = Number(year);
  const { news, currentNewsYear, newsYears } = await newsView();
  const items = news.filter((n) => Number(n.date.slice(0, 4)) === y);
  if (!items.length || y >= currentNewsYear) notFound();

  const all = newsYears.filter((n) => n.year < currentNewsYear);
  const idx = all.findIndex((n) => n.year === y);
  const newer = all[idx - 1];
  const older = all[idx + 1];

  return (
    <>

      <PageHeader
        back={{ href: '/archive', label: 'Archive' }}
        eyebrow={`${items.length} ${items.length === 1 ? 'notice' : 'notices'}`}
        title={`News and Notices ${y}`}
        lead="Exactly as the club published them, newest first."
      />

      {/* Year strip — jumping between years should not need the back button. */}
      <nav aria-label="Other years" className="mb-8 flex flex-wrap gap-2">
        {all.map((n) => (
          <Link
            key={n.year}
            href={`/archive/news/${n.year}`}
            aria-current={n.year === y ? 'page' : undefined}
            className={`tap rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
              n.year === y
                ? 'border-sky bg-sky text-white'
                : 'border-skyLine bg-white text-navy hover:border-sky'
            }`}
          >
            {n.year}
          </Link>
        ))}
      </nav>

      <div className="space-y-6">
        {items.map((n, i) => (
          <NewsArticle key={`${n.date}-${i}`} item={n} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-skyLine pt-6">
        {newer ? (
          <Link href={`/archive/news/${newer.year}`} className="link tap">
            &larr; {newer.year}
          </Link>
        ) : (
          <Link href="/club-life/news" className="link tap">
            &larr; This year&rsquo;s news
          </Link>
        )}
        {older && (
          <Link href={`/archive/news/${older.year}`} className="link tap">
            {older.year} &rarr;
          </Link>
        )}
      </div>
    </>
  );
}
