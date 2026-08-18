import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui';
import NewsArticle from '@/components/NewsArticle';
import { news, currentNewsYear, newsYears } from '@/content/news';

export function generateStaticParams() {
  return newsYears.filter((y) => y.year < currentNewsYear).map((y) => ({ year: String(y.year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  return { title: `News and Notices ${year}` };
}

export default async function NewsYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = Number(year);
  const items = news.filter((n) => Number(n.date.slice(0, 4)) === y);
  if (!items.length || y >= currentNewsYear) notFound();

  const all = newsYears.filter((n) => n.year < currentNewsYear);
  const idx = all.findIndex((n) => n.year === y);
  const newer = all[idx - 1];
  const older = all[idx + 1];

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/archive" className="link">Archive</Link>
        <span className="mx-2 text-inkMuted" aria-hidden="true">/</span>
        <Link href="/archive/news" className="link">News and Notices</Link>
        <span className="mx-2 text-inkMuted" aria-hidden="true">/</span>
        <span className="text-inkMuted">{y}</span>
      </nav>

      <PageHeader
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
          <Link href={`/archive/news/${newer.year}`} className="link">
            &larr; {newer.year}
          </Link>
        ) : (
          <Link href="/club-life/news" className="link">
            &larr; This year&rsquo;s news
          </Link>
        )}
        {older && (
          <Link href={`/archive/news/${older.year}`} className="link">
            {older.year} &rarr;
          </Link>
        )}
      </div>
    </>
  );
}
