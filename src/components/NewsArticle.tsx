import type { NewsItem } from '@/content/news';
import { Badge } from '@/components/ui';
import { isPortalPage, opensNewTab } from '@/lib/files';

const linkClass =
  'tap inline-flex max-w-full items-center gap-2 break-words rounded-lg border-2 border-skyLine bg-skyTint px-3.5 py-2 text-left text-sm font-semibold text-navy transition-colors hover:border-sky';

/**
 * PRESERVED FROM THE OLD SITE: the house style — dated, attributed, warm and
 * specific. First solos congratulated by name; volunteers thanked for
 * unglamorous jobs. No design system should flatten that.
 *
 * Shared by the News page and every year of the archive, so the archive is not
 * a lesser version of the same thing.
 */
export default function NewsArticle({
  item,
  tools,
}: {
  item: NewsItem;
  /** Buttons for whoever looks after the notice — see NoticeTools in NewsDesk.tsx. */
  tools?: React.ReactNode;
}) {
  return (
    <article className="story">
      <time dateTime={item.date} className="block text-sm font-semibold uppercase tracking-[0.12em] text-slate2">
        {item.displayDate}
      </time>
      <div className="mb-3 mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <h3 className="display text-[1.7rem] text-navy lg:text-3xl">{item.title}</h3>
        {item.from && <span className="text-sm italic text-inkMuted">from {item.from}</span>}
        {item.pinned && <Badge tone="warn">Worth knowing now</Badge>}
      </div>

      <div className="prose-club">
        {item.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* The old site wrote every one of these as "this link", which told a
          member nothing. Named, bold and obvious here. Long labels wrap rather
          than pushing the page sideways on a phone. */}
      {item.links && item.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {item.links.map((l, i) => (
            <li key={`${l.href}-${i}`} className="min-w-0 max-w-full">
              {/* Every link in a news item opens in a new tab — see opensNewTab. */}
              <a
                href={l.href}
                target={opensNewTab(l.href) ? '_blank' : undefined}
                rel={opensNewTab(l.href) ? 'noopener noreferrer' : undefined}
                className={linkClass}
              >
                {isPortalPage(l.href) ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                    <path d="M5 12h13m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                    <rect x="3" y="4" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 15l5-4 4 3 3-2 6 4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                )}
                <span className="min-w-0 break-words">{l.label}</span>
                {opensNewTab(l.href) && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
      {tools}
    </article>
  );
}
