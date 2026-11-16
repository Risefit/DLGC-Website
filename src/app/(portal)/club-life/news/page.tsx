import Link from 'next/link';
import { PageHeader, BandSection } from '@/components/ui';
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
        back={{ href: '/club-life', label: 'Club Life' }}
        eyebrow={`Everything from January ${currentNewsYear}`}
        title={
          <>
            News <em>and notices</em>
          </>
        }
        lead="Newest first. Something worth telling other members — a first solo, an achievement, a change to how we operate, a thank you? Send it to the website editor. Short is fine."
      />

      <section className="sec">
        <div className="max-w-4xl">
          {currentYearNews.map((n, i) => (
            <NewsArticle key={`${n.date}-${i}`} item={n} />
          ))}
        </div>
      </section>

      {archivedNews.length > 0 && (
        <BandSection
          tone="contour"
          title={
            <>
              Looking for <em>something older?</em>
            </>
          }
          description={`${archivedNews.length} notices going back to 2016 are kept in the archive, year by year.`}
        >
          <Link href="/archive/news" className="pill-solid">
            All earlier news and notices
          </Link>
        </BandSection>
      )}
    </>
  );
}
