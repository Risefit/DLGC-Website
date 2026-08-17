import Link from 'next/link';
import { PageHeader, Badge, Callout } from '@/components/ui';
import { currentYearNews, archivedNews, currentNewsYear, type NewsItem } from '@/content/news';

export const metadata = { title: 'News and Notices' };

/**
 * PRESERVED FROM THE OLD SITE: the house style — dated, attributed, warm and
 * specific. First solos congratulated by name; volunteers thanked for
 * unglamorous jobs. No design system should flatten that.
 *
 * The page shows this year only. Older items move to /archive/news
 * automatically, derived from the date — nothing to maintain.
 */
export function NewsArticle({ item }: { item: NewsItem }) {
  return (
    <article className="card p-6">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <h2 className="text-xl">{item.title}</h2>
        {item.from && <span className="text-sm italic text-slate2">from {item.from}</span>}
        {item.pinned && <Badge tone="warn">Worth knowing now</Badge>}
      </div>
      <time dateTime={item.date} className="mb-3 block text-sm text-slate2">
        {item.displayDate}
      </time>

      <div className="prose-club">
        {item.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* The old site wrote every one of these as "this link", which told a
          member nothing. Named, bold and obvious here. */}
      {item.links && item.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2 border-t border-skyLine pt-4">
          {item.links.map((l, i) => (
            <li key={`${l.href}-${i}`}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="tap gap-2 rounded-lg border-2 border-skyLine bg-skyTint px-3.5 py-2
                           text-sm font-semibold text-navy hover:border-sky transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                  <rect x="3" y="4" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 15l5-4 4 3 3-2 6 4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                {l.label}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

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
            {archivedNews.length} notices from before {currentNewsYear} are kept in the archive —
            nothing has been deleted.
          </p>
          <Link
            href="/archive/news"
            className="tap mt-4 gap-2 rounded-lg bg-sky px-6 py-3.5 font-semibold text-white hover:bg-skyDark transition-colors"
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
