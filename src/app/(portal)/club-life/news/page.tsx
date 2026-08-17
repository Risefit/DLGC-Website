import Link from 'next/link';
import { PageHeader, Callout } from '@/components/ui';
import NewsArticle from '@/components/NewsArticle';
import { currentYearNews, archivedNews, currentNewsYear } from '@/content/news';

export const metadata = { title: 'News and Notices' };

/**
 * The page shows this year only. Older items move to /archive/news
 * automatically, derived from the date — nothing to maintain.
 */
export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Everything from January ${currentNewsYear}`}
        title="News and Notices"
        lead="Newest first. Contributions are welcome — send anything worth telling other members to the website editor."
      />

      <div className="mb-8">
        <Callout tone="info">
          <p>
            Something worth telling other members? A first solo, an achievement, a change to how
            we operate, a thank you? Send it to the website editor. Short is fine.
          </p>
        </Callout>
      </div>

      <div className="space-y-6">
        {currentYearNews.map((n, i) => (
          <NewsArticle key={`${n.date}-${i}`} item={n} />
        ))}
      </div>

      {archivedNews.length > 0 && (
        <div className="mt-10 rounded-card border-2 border-dashed border-skyLine bg-white p-6 text-center">
          <h2 className="text-xl">Looking for something older?</h2>
          <p className="mx-auto mt-2 max-w-prose2 text-sm text-slate2">
            {archivedNews.length} notices going back to 2016 are kept in the archive, year by year —
            nothing has been deleted.
          </p>
          <Link
            href="/archive/news"
            className="tap mt-4 gap-2 rounded-lg bg-sky px-6 py-3.5 font-semibold text-white transition-colors hover:bg-skyDark"
          >
            All earlier news and notices
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}
    </>
  );
}
