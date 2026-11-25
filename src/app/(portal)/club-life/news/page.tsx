import Link from 'next/link';
import { PageHeader, BandSection } from '@/components/ui';
import NewsArticle from '@/components/NewsArticle';
import NewsDesk, { NoticeTools } from '@/components/NewsDesk';
import { newsView } from '@/lib/news';

export const metadata = { title: 'News and Notices' };

/** Rebuilt at once when a controller posts, and hourly in any case. */
export const revalidate = 3600;
// Saving a notice with photographs makes their smaller copies, which takes a moment.
export const maxDuration = 60;

/**
 * The page shows this year only. Older items move to /archive/news
 * automatically, derived from the date — nothing to maintain.
 *
 * The notices come from two places and are shown as one list (src/lib/news.ts):
 * the news file, and what controllers post with the form at the top of this
 * page. A controller sees "Add a notice" there, and "Edit" and "Take down"
 * under each notice posted that way; nobody else sees any of it.
 */
export default async function NewsPage() {
  const { currentYearNews, archivedNews, currentNewsYear } = await newsView();
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
        lead="Newest first. Something worth telling other members — a first solo, an achievement, a change to how we operate, a thank you? Send it to the website editor or one of the portal’s controllers. Short is fine."
      />

      <section className="sec">
        <div className="max-w-4xl">
          <NewsDesk />
          {currentYearNews.map((n, i) => (
            <NewsArticle
              key={n.posted ? `posted-${n.posted.id}` : `${n.date}-${i}`}
              item={n}
              tools={n.posted ? <NoticeTools notice={n.posted} /> : undefined}
            />
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
