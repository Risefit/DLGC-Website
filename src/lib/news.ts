import { news as fileNews, type NewsItem, type NewsLink } from '@/content/news';
import { adminClient, logSupabaseProblem } from '@/lib/supabase/admin';

/**
 * ALL THE NEWS — the notices in src/content/news.ts, and the ones controllers
 * post from the News page itself.
 *
 * Until November 2026 every notice lived in the news file and adding one meant
 * editing the code. A controller can now write one on the News page
 * (src/components/NewsDesk.tsx); those are rows in the Supabase table
 * `portal_news` (migration 008). Every page that shows news asks HERE, so the
 * two are one list everywhere: the News page, the dashboard, Club Life and the
 * archive.
 *
 *   - Nothing is deleted. "Take down" marks a posted notice as removed; it
 *     stops showing and a controller can put it back.
 *   - A posted notice is plain text. It is shown as text, never as HTML.
 *   - "Worth knowing now" is kept to the two newest notices that carry it,
 *     whoever marked them, so the badge keeps its meaning.
 *   - If Supabase cannot be reached, the pages show the news file alone rather
 *     than fail.
 *
 * The pages are built ahead of time and kept; posting, editing or taking down
 * a notice tells the site to rebuild them (see the actions beside the News
 * page), and they refresh hourly regardless.
 *
 * Server only — it reads with the server's secret key. Never import this into
 * a component that runs in the browser.
 */

/** A notice as a controller typed it — what the edit form needs back. */
export type PostedNotice = {
  id: number;
  date: string; // ISO, YYYY-MM-DD
  title: string;
  from: string;
  body: string; // paragraphs separated by an empty line
  links: NewsLink[];
  pinned: boolean;
};

export type ShownNews = NewsItem & { /** set on a notice posted from the portal */ posted?: PostedNotice };

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The date as the club writes it: "Thursday 13th August 2026". */
export function clubDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const n = d.getUTCDate();
  const th = n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th';
  return `${DAYS[d.getUTCDay()]} ${n}${th} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export const paragraphs = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

type Row = {
  id: number;
  news_date: string;
  title: string;
  from_name: string | null;
  body: string;
  links: unknown;
  pinned: boolean;
};

const cleanLinks = (v: unknown): NewsLink[] =>
  Array.isArray(v)
    ? v
        .filter((l): l is NewsLink => Boolean(l) && typeof l.label === 'string' && typeof l.href === 'string')
        .map((l) => ({ label: l.label, href: l.href }))
    : [];

export const toPosted = (r: Row): PostedNotice => ({
  id: r.id,
  date: r.news_date,
  title: r.title,
  from: r.from_name ?? '',
  body: r.body,
  links: cleanLinks(r.links),
  pinned: r.pinned,
});

/** Notices posted from the portal that are currently showing, newest first. */
async function postedNews(): Promise<ShownNews[]> {
  const admin = adminClient();
  if (!admin) return [];
  try {
    const { data, error } = await admin
      .from('portal_news')
      .select('id, news_date, title, from_name, body, links, pinned')
      .eq('status', 'published')
      .order('news_date', { ascending: false })
      .order('id', { ascending: false })
      .limit(2000);
    if (error) {
      // "42P01" is "no such table": migration 008 has not been run yet. Not worth a log line every hour.
      if (error.code !== '42P01' && error.code !== 'PGRST205') logSupabaseProblem('reading posted news', error);
      return [];
    }
    return ((data ?? []) as Row[]).map((r) => {
      const posted = toPosted(r);
      return {
        date: posted.date,
        displayDate: clubDate(posted.date),
        title: posted.title,
        ...(posted.from ? { from: posted.from } : {}),
        body: paragraphs(posted.body),
        ...(posted.links.length ? { links: posted.links } : {}),
        ...(posted.pinned ? { pinned: true } : {}),
        posted,
      };
    });
  } catch {
    return [];
  }
}

/** Everything the pages need, worked out the same way the news file used to. */
export async function newsView() {
  const posted = await postedNews();
  // Newest first. On the same day, a notice posted here goes above one from the file.
  const merged: ShownNews[] = [...posted, ...fileNews]
    .map((n, i) => ({ n, i }))
    .sort((a, b) => (a.n.date === b.n.date ? a.i - b.i : a.n.date < b.n.date ? 1 : -1))
    .map(({ n }) => n);

  // "Worth knowing now" stays on the two newest that carry it.
  let badges = 0;
  const news = merged.map((n) => (n.pinned && ++badges > 2 ? { ...n, pinned: false } : n));

  const currentNewsYear = Number(news[0]?.date.slice(0, 4) ?? new Date().getFullYear());
  const yearOf = (n: NewsItem) => Number(n.date.slice(0, 4));

  const by = new Map<number, ShownNews[]>();
  for (const n of news) by.set(yearOf(n), [...(by.get(yearOf(n)) ?? []), n]);
  const newsYears = [...by.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({
      year,
      count: items.length,
      sample: items.find((i) => i.title.length > 8 && i.title.length < 46)?.title ?? items[0].title,
    }));

  return {
    news,
    currentNewsYear,
    /** Shown on /club-life/news. */
    currentYearNews: news.filter((n) => yearOf(n) >= currentNewsYear),
    /** Shown on /archive/news, one page per year. Nothing is ever deleted. */
    archivedNews: news.filter((n) => yearOf(n) < currentNewsYear),
    newsYears,
  };
}
