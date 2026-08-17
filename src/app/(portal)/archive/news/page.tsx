import Link from 'next/link';
import { PageHeader } from '@/components/ui';
import { archivedNews, currentNewsYear } from '@/content/news';
import { NewsArticle } from '../../club-life/news/page';

export const metadata = { title: 'News Archive' };

export default function NewsArchivePage() {
  const byYear = new Map<string, typeof archivedNews>();
  for (const n of archivedNews) {
    const y = n.date.slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(n);
  }
  const years = [...byYear.keys()].sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/archive" className="link">Archive</Link>
        <span className="mx-2 text-slate2" aria-hidden="true">/</span>
        <span className="text-slate2">News and Notices</span>
      </nav>

      <PageHeader
        eyebrow={`${archivedNews.length} notices before ${currentNewsYear}`}
        title="News Archive"
        lead="Every notice the club has published, kept in full — including the photographs and documents each one linked to."
      />

      {years.map((y) => (
        <section key={y} className="mb-10">
          <h2 className="mb-4 text-2xl">{y}</h2>
          <div className="space-y-6">
            {byYear.get(y)!.map((n, i) => (
              <NewsArticle key={`${n.date}-${i}`} item={n} />
            ))}
          </div>
        </section>
      ))}

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/club-life/news" className="link">← This year&rsquo;s news</Link>
        <Link href="/archive" className="link">All collections</Link>
      </div>
    </>
  );
}
