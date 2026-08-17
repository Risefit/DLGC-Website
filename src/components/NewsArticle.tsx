import type { NewsItem } from '@/content/news';
import { Badge } from '@/components/ui';

/**
 * PRESERVED FROM THE OLD SITE: the house style — dated, attributed, warm and
 * specific. First solos congratulated by name; volunteers thanked for
 * unglamorous jobs. No design system should flatten that.
 *
 * Shared by the News page and every year of the archive, so the archive is not
 * a lesser version of the same thing.
 */
export default function NewsArticle({ item }: { item: NewsItem }) {
  return (
    <article className="card p-6">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <h3 className="text-xl font-semibold text-navy">{item.title}</h3>
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
          member nothing. Named, bold and obvious here. Long labels wrap rather
          than pushing the page sideways on a phone. */}
      {item.links && item.links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2 border-t border-skyLine pt-4">
          {item.links.map((l, i) => (
            <li key={`${l.href}-${i}`} className="min-w-0 max-w-full">
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="tap inline-flex max-w-full items-center gap-2 break-words rounded-lg border-2
                           border-skyLine bg-skyTint px-3.5 py-2 text-left text-sm font-semibold
                           text-navy transition-colors hover:border-sky"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                  <rect x="3" y="4" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 15l5-4 4 3 3-2 6 4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                <span className="min-w-0 break-words">{l.label}</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
