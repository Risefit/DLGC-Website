/**
 * Rebuilds src/content/news.ts from the mirrored old members' home page.
 *
 * The old page ran every notice since 2016 down one column, separated by <hr>,
 * each preceded by a date paragraph and opening with a <strong> title and an
 * optional <em>From Someone</em>. That structure is regular enough to parse,
 * which is the only reason this file exists: the earlier text-scrape merged
 * unrelated notices into 76 giant items and lost the attributions.
 *
 * Run:  node tools/parse-news.mjs > src/content/news.ts
 * Source: the wget mirror of dlgc.org.uk/members/default.asp
 */
import fs from 'node:fs';

const SRC =
  process.env.DLGC_HOME_PAGE ??
  '/mnt/user-data/uploads/dlgc-mirror/www.dlgc.org.uk/members/default.asp';

const raw = fs.readFileSync(SRC, 'utf8');
const START = raw.indexOf('images/N&N1.JPG');
const END = [...raw.matchAll(/<head[\s>]/gi)].map((m) => m.index).find((i) => i > START) ?? raw.length;
const region = raw.slice(START, END);
const blocks = region.split(/<hr[^>]*>/i).slice(1);

const MONTHS =
  'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec';
const MONTH_NUM = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
  january: 1, february: 2, march: 3, april: 4, june: 6, july: 7, august: 8,
  september: 9, october: 10, november: 11, december: 12,
};
const MONTH_NAME = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const DAY_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ENT = [
  [/&nbsp;/gi, ' '], [/&amp;/gi, '&'], [/&lt;/gi, '<'], [/&gt;/gi, '>'],
  [/&quot;/gi, '"'], [/&#39;/g, "'"], [/&apos;/gi, "'"],
  [/&rsquo;/gi, '’'], [/&lsquo;/gi, '‘'],
  [/&ldquo;/gi, '“'], [/&rdquo;/gi, '”'],
  [/&pound;/gi, '£'], [/&hellip;/gi, '…'],
  [/&mdash;/gi, '—'], [/&ndash;/gi, '–'], [/&bull;/gi, '•'],
];
const decode = (s) =>
  ENT.reduce((a, [re, to]) => a.replace(re, to), s).replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));

/**
 * FrontPage closed and reopened inline tags in the middle of words, which is
 * why a naive strip produced "Elect ronic", "Gar ry" and "T hese". Removing an
 * INLINE tag that sits between two word characters fixes the whole class at
 * source. Block tags are left alone — they are real word boundaries.
 */
const INLINE = 'span|font|strong|b|em|i|u|sup|sub|small|big|a|o:p';
const joinWords = (s) => {
  let out = s;
  for (let i = 0; i < 6; i++) {
    const next = out.replace(new RegExp(`(\\w)(?:<\\/?(?:${INLINE})\\b[^>]*>)+(?=\\w)`, 'gi'), '$1');
    if (next === out) break;
    out = next;
  }
  return out;
};

const strip = (s) => decode(joinWords(s).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const TYPOS = [
  [/\bcertifiication\b/g, 'certification'], [/\bPubliications\b/g, 'Publications'],
  [/\bRecogntions\b/g, 'Recognitions'], [/\bexplanaton\b/g, 'explanation'],
  [/\bOccurances\b/g, 'Occurrences'], [/\bcommitteee\b/g, 'committee'],
  [/\b11tth\b/g, '11th'],
];
const tidy = (s) =>
  TYPOS.reduce((a, [re, to]) => a.replace(re, to), s)
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s{2,}/g, ' ')
    .trim();

function parseDate(text) {
  let m = text.match(
    new RegExp(`(?:^|\\b)(?:\\w{3,9}\\.?\\s+)?(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTHS})\\.?(?:\\s+(\\d{4}))?`, 'i')
  );
  if (m) return { day: +m[1], month: MONTH_NUM[m[2].toLowerCase()], year: m[3] ? +m[3] : null };
  m = text.match(new RegExp(`(${MONTHS})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?`, 'i'));
  if (m) return { day: +m[2], month: MONTH_NUM[m[1].toLowerCase()], year: m[3] ? +m[3] : null };
  return null;
}

const ord = (d) => (d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th');

// ── Parse ─────────────────────────────────────────────────────────────────
const parsed = [];
for (const block of blocks) {
  const head = strip(block.slice(0, 900));
  if (!head) continue;
  const d = parseDate(head.slice(0, 90));
  if (!d || !d.month || d.day < 1 || d.day > 31) continue;

  // Titles come from the first <strong>. Anchor contents are removed first —
  // the old site bolded the words "this link", which is not a title.
  const forTitle = block.replace(/<a\s[^>]*>[\s\S]*?<\/a>/gi, ' ');
  let title = '';
  for (const m of forTitle.matchAll(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    let t = tidy(strip(m[2]));
    if (!t || t.length < 3) continue;
    if (parseDate(t) && t.length < 32) continue;
    if (/^(this|the|a)\s+(link|page|webpage|web page)/i.test(t)) continue;
    if (/^(here'?s?|click here|more|read more)$/i.test(t)) continue;
    // A headline, not the opening sentence: cut at the first full stop and at
    // any "From Someone" that ran on because the tag closed late.
    t = t.split(/(?<=[.!?])\s/)[0];
    t = t.replace(/\s+[Ff]rom\s+.*$/, '');
    t = t.replace(/[\s.:,-]+$/, '');
    if (t.length > 72) t = t.slice(0, 72).replace(/\s+\S*$/, '');
    if (t.length < 3) continue;
    title = t;
    break;
  }

  let from = null;
  for (const m of block.matchAll(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = tidy(strip(m[2])).replace(/^[(\s]+|[)\s]+$/g, '');
    const fm = t.match(/^from\s+(.{2,40})$/i);
    if (fm) { from = fm[1]; break; }
  }
  if (!from) {
    const fm = head.match(/\(\s*[Ff]rom ([^)]{2,40})\)/);
    if (fm) from = tidy(fm[1]);
  }
  if (from) {
    // "<em>from the Chairman T</em>hese and..." — the tag closed mid-word.
    // "from Alex Oldham 12 June" — the attribution ran into the next line.
    from = from
      .replace(/[.,:;\s]+$/, '')
      .replace(new RegExp(`[,\\s]+(?:\\w{3,9}\\.?\\s+)?\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MONTHS})\\b.*$`, 'i'), '')
      .replace(/\s+[A-Z]$/, '')
      .trim();
    if (!/[a-z]/.test(from) && from.length > 12) from = null;   // a whole sentence, not a name
    if (from && from.length < 2) from = null;
  }

  const links = [];
  const seenHref = new Set();
  for (const m of block.matchAll(/<a\s[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = decode(m[1]).trim();
    if (!href || /^(#|mailto:|javascript:)/i.test(href)) continue;
    if (seenHref.has(href)) continue;
    seenHref.add(href);
    links.push({ label: tidy(strip(m[2])), href });
  }

  let paras = block
    .split(/<\/p>|<\/div>|<br\s*\/?>\s*<br\s*\/?>|<\/tr>/i)
    .map((p) => tidy(strip(p)))
    .filter((p) => p.length > 1);

  parsed.push({ d, title, from, links, paras });
}

// ── Resolve years (the column is newest-first; undated items inherit) ──────
let prev = null;
for (const it of parsed) {
  let { day, month, year } = it.d;
  if (!year) {
    year = prev ? prev.year : new Date().getFullYear();
    const cand = new Date(Date.UTC(year, month - 1, day));
    if (prev && cand > new Date(Date.UTC(prev.year, prev.month - 1, prev.day))) year -= 1;
  }
  it.d = { day, month, year };
  prev = it.d;
}

// ── Clean up bodies ───────────────────────────────────────────────────────
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const items = [];
for (const it of parsed) {
  const { day, month, year } = it.d;
  const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dow = DAY_NAME[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const displayDate = `${dow} ${day}${ord(day)} ${MONTH_NAME[month]} ${year}`;

  let body = it.paras.slice();

  // Drop paragraphs that are nothing but a date heading — the date is already
  // shown above the item, and a stray "18 September 2022" line reads as a bug.
  const dateOnly = new RegExp(
    `^[\\s(]*(?:\\w{3,9}\\.?[,\\s]+)?\\d{1,2}(?:st|nd|rd|th)?[\\s/-]*(?:${MONTHS})[a-z]*\\.?[\\s,]*\\d{0,4}[\\s.)]*$`,
    'i'
  );
  const dateOnlyAlt = new RegExp(
    `^[\\s(]*(?:\\w{3,9}\\.?[,\\s]+)?(?:${MONTHS})[a-z]*\\.?\\s+\\d{1,2}(?:st|nd|rd|th)?[\\s,]*\\d{0,4}[\\s.)]*$`,
    'i'
  );
  body = body.filter((p) => !dateOnly.test(p) && !dateOnlyAlt.test(p));

  // The first paragraph repeats "Title From Someone" before the prose. Remove it.
  if (body.length && it.title) {
    body[0] = body[0].replace(new RegExp(`^${esc(it.title)}[\\s.,:;-]*`, 'i'), '');
  }
  if (body.length && it.from) {
    // Usually "From Someone" opens the paragraph. Where a title WAS found but
    // had to be cut short, a word or two of it can sit in front, so allow a
    // short run-up — but only then. With no title, that run-up is the headline
    // and throwing it away leaves the item with no name.
    const runUp = it.title ? '.{0,40}?' : '';
    body[0] = body[0].replace(new RegExp(`^${runUp}\\(?\\s*from\\s+${esc(it.from)}\\)?[\\s.,:;-]*`, 'i'), '');
  }
  // Page furniture that the last block swallowed — the standing footer strap
  // line and the charities list, which live on their own pages here.
  const FURNITURE = [
    /^Safe Flying comes from a State of Mind/i,
    /^Our Favou?red Charities/i,
    /^Please send material for this column/i,
    /^Back to top$/i,
    /^Website (updated|last updated)/i,
  ];
  body = body
    .map((p) => p.replace(/^[\s.,:;-]+/, '').trim())
    .filter((p) => p.length > 2 && !/^font face=/i.test(p) && !FURNITURE.some((re) => re.test(p)));

  // A repeated "(from Someone)" line inside the prose duplicates the byline.
  if (it.from) {
    const dupByline = new RegExp(`^\\(?\\s*from\\s+${esc(it.from)}\\s*\\)?[.\\s]*$`, 'i');
    body = body.filter((p) => !dupByline.test(p));
  }

  // Deduplicate: FrontPage nesting means the same text can appear twice.
  const seen = new Set();
  body = body.filter((p) => {
    const k = p.slice(0, 60).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  // Drop paragraphs wholly contained in an earlier one.
  body = body.filter((p, i) => !body.some((q, j) => j < i && q.length > p.length && q.includes(p)));

  if (!body.length) continue;

  let title = it.title;
  if (!title) {
    // No <strong> headline in the source. Take one from the opening words, then
    // remove it (and any byline behind it) so the item does not read its own
    // title back at the member.
    title = body[0]
      .split(/[.!?]/)[0]
      .replace(/\s+[Ff]rom\s+.*$/, '')
      .split(/\s+/)
      .slice(0, 8)
      .join(' ');
    const lead = new RegExp(
      `^${esc(title)}[\\s.,:;-]*${it.from ? `(?:from\\s+${esc(it.from)}[\\s.,:;-]*)?` : ''}`,
      'i'
    );
    body = [body[0].replace(lead, '').trim(), ...body.slice(1)].filter((p) => p.length > 2);
    if (!body.length) continue;
  }

  items.push({
    date: iso,
    displayDate,
    title: title.slice(0, 80),
    from: it.from,
    body,
    links: it.links.map((l) => ({ label: labelFor(l), href: absolute(l.href) })),
  });
}

// ── Link labels: never "this link", never a bare URL ──────────────────────
function absolute(href) {
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith('/')) return 'https://www.dlgc.org.uk' + href;
  return 'https://www.dlgc.org.uk/members/' + href.replace(/^\.\//, '');
}

function titleCaseFile(name) {
  return decodeURIComponent(name)
    .replace(/\.[a-z0-9]{2,4}$/i, '')
    .replace(/[_+]+/g, ' ')
    .replace(/%20/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function labelFor(l) {
  const generic = /^(this|the|a)?\s*(link|page|webpage|web page|here|click here|this)\.?$/i;
  if (l.label && !generic.test(l.label) && l.label.length <= 58 && !/^https?:/i.test(l.label)) {
    return l.label;
  }
  try {
    const u = new URL(absolute(l.href));
    const last = u.pathname.split('/').filter(Boolean).pop() ?? u.hostname;
    const name = titleCaseFile(last);
    const ext = (last.match(/\.([a-z0-9]{2,4})$/i) ?? [])[1]?.toUpperCase();
    const kind = ext === 'PDF' ? ' (PDF)' : '';
    if (u.hostname.endsWith('dlgc.org.uk')) {
      return ((name || 'Page on the old site').slice(0, 52) + kind).trim();
    }
    return `${u.hostname.replace(/^www\./, '')} — ${name}`.slice(0, 58);
  } catch {
    return 'Linked document';
  }
}

// ── Emit ──────────────────────────────────────────────────────────────────
const q = (s) => JSON.stringify(s);
const out = [];
out.push(`/**
 * News and Notices — every notice from the old members' home page, 2016 to date.
 *
 * GENERATED by tools/parse-news.mjs from the wget mirror of default.asp. If you
 * are adding a new notice by hand, add it to the TOP of the array; the file is
 * ordinary TypeScript and hand edits are fine. Re-running the generator would
 * overwrite them, so it is kept for reference rather than routine use.
 *
 * PRESERVED: the dated, attributed house style. "From Dave Salmon", first solos
 * congratulated by name, volunteers thanked for unglamorous jobs. That voice is
 * the club. Keep it.
 *
 * \`links\` are the references the old site wrote as "this link" — photographs of
 * first solos, minutes, notices. They are given descriptive labels here, because
 * "this link" tells a member nothing about where they are going (WCAG 2.4.4).
 *
 * WHERE ITEMS APPEAR: the News page shows everything from 1 January of the
 * newest item's year. Older items move to /archive/news automatically — it is
 * derived from the date, so there is nothing to move by hand.
 */

export type NewsLink = { label: string; href: string };

export type NewsItem = {
  date: string;          // ISO, for sorting
  displayDate: string;   // as the club writes it
  title: string;
  from?: string;
  body: string[];
  links?: NewsLink[];
  pinned?: boolean;
};

export const news: NewsItem[] = [`);

items.forEach((n, i) => {
  const parts = [`date: ${q(n.date)}`, `displayDate: ${q(n.displayDate)}`, `title: ${q(n.title)}`];
  if (n.from) parts.push(`from: ${q(n.from)}`);
  parts.push(`body: [${n.body.map(q).join(', ')}]`);
  if (n.links.length) parts.push(`links: [${n.links.map((l) => `{ label: ${q(l.label)}, href: ${q(l.href)} }`).join(', ')}]`);
  if (i < 2) parts.push('pinned: true');
  out.push(`  { ${parts.join(', ')} },`);
});

out.push(`];

/** The newest item's year. Everything from 1 January of it stays on the News page. */
export const currentNewsYear = Number(news[0]?.date.slice(0, 4) ?? new Date().getFullYear());

/** Shown on /club-life/news. */
export const currentYearNews = news.filter((n) => Number(n.date.slice(0, 4)) >= currentNewsYear);

/** Shown on /archive/news, one page per year. Nothing is ever deleted. */
export const archivedNews = news.filter((n) => Number(n.date.slice(0, 4)) < currentNewsYear);

/**
 * Years present, newest first, with a count and one representative headline.
 * Drives the archive year index and the year strip on each year page.
 */
export const newsYears: { year: number; count: number; sample: string }[] = (() => {
  const by = new Map<number, typeof news>();
  for (const n of news) {
    const y = Number(n.date.slice(0, 4));
    if (!by.has(y)) by.set(y, []);
    by.get(y)!.push(n);
  }
  return [...by.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({
      year,
      count: items.length,
      sample: items.find((i) => i.title.length > 8 && i.title.length < 46)?.title ?? items[0].title,
    }));
})();
`);

process.stdout.write(out.join('\n'));
process.stderr.write(
  `items: ${items.length}\nwith from: ${items.filter((i) => i.from).length}\n` +
  `with links: ${items.filter((i) => i.links.length).length}\n` +
  `date range: ${items[items.length - 1].date} .. ${items[0].date}\n`
);
