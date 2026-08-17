import { PageHeader, Badge, Callout } from '@/components/ui';
import { news } from '@/content/news';

export const metadata = { title: 'News and Notices' };

/**
 * PRESERVED FROM THE OLD SITE: the house style.
 * Dated, attributed ("From Dave Salmon"), warm and specific — congratulating
 * first solos by name, thanking members for clearing the drains. That voice is
 * the club. No design system should flatten it.
 */
export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="From the club, for the club"
        title="News and Notices"
        lead="Newest first. Contributions are welcome — send material to the website editor."
      />

      <div className="mb-8">
        <Callout tone="info">
          <p>
            Something worth telling other members? A first solo, an achievement, a change to how we
            operate, a thank you? Send it to the website editor. Short is fine.
          </p>
        </Callout>
      </div>

      <div className="space-y-6">
        {news.map((n, i) => (
          <article key={`${n.date}-${i}`} className="card p-6">
            <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
              <h2 className="text-xl">{n.title}</h2>
              {n.from && <span className="text-sm italic text-slate2">from {n.from}</span>}
              {n.pinned && <Badge tone="warn">Worth knowing now</Badge>}
            </div>
            <time dateTime={n.date} className="mb-3 block text-sm text-slate2">
              {n.displayDate}
            </time>
            <div className="prose-club">
              {n.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate2">
        Older notices are kept in the Archive rather than deleted.
      </p>
    </>
  );
}
