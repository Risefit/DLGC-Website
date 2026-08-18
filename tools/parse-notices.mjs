/**
 * Builds src/content/notices.ts from the CFI's Notices and the Chief Launch
 * Marshal's Bulletins on the old site.
 *
 *   CFI_Notices.asp  — 28 notices, full text inline, anchored #CFIN01..#CFIN28
 *   CLM_Notices.asp  — an index of bulletins, each a PDF
 *
 * The CFI notices are the ones that matter here: on the old site they were one
 * enormous scrolling page with an anchor index at the top, so a member looking
 * for the radio frequency notice had to scroll past eleven others.
 *
 * Run: node tools/parse-notices.mjs > src/content/notices.ts
 */
import fs from 'node:fs';

const BASE = '/mnt/user-data/uploads/dlgc-mirror/www.dlgc.org.uk/members/';
const OLD = 'https://www.dlgc.org.uk/members';

const ENT = [
  [/&nbsp;/gi, ' '], [/&amp;/gi, '&'], [/&lt;/gi, '<'], [/&gt;/gi, '>'],
  [/&quot;/gi, '"'], [/&#39;/g, "'"], [/&rsquo;/gi, '’'], [/&lsquo;/gi, '‘'],
  [/&ldquo;/gi, '“'], [/&rdquo;/gi, '”'], [/&pound;/gi, '£'],
  [/&hellip;/gi, '…'], [/&mdash;/gi, '—'], [/&ndash;/gi, '–'], [/&bull;/gi, '•'],
];
const decode = (s) => ENT.reduce((a, [r, t]) => a.replace(r, t), s).replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));

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
const text = (s) => decode(joinWords(s).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const abs = (h) => (/^https?:/i.test(h) ? h : `${OLD}/${h.replace(/^\.\//, '')}`);

// ── CFI's Notices ─────────────────────────────────────────────────────────
const cfiRaw = fs.readFileSync(BASE + 'CFI_Notices.asp', 'utf8');
const marks = [...cfiRaw.matchAll(/<a[^>]*name\s*=\s*["']?(CFIN\d+)["']?[^>]*>/gi)]
  .map((m) => ({ id: m[1], at: m.index }));

/**
 * The index at the top of the old page already carries a short, correct title
 * for every notice. Reading them from there beats guessing where the headline
 * ends and the first paragraph begins.
 */
const indexTitles = new Map();
for (const m of cfiRaw.matchAll(/<a\s[^>]*href\s*=\s*["']#(CFIN\d+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
  const t = text(m[2]).replace(/[\s.]+$/, '');
  if (!t || t.length < 3) continue;
  const prev = indexTitles.get(m[1]);
  if (!prev || t.length > prev.length) indexTitles.set(m[1], t);
}

const cfiNotices = [];
for (let i = 0; i < marks.length; i++) {
  const chunk = cfiRaw.slice(marks[i].at, i + 1 < marks.length ? marks[i + 1].at : cfiRaw.length);
  const flat = text(chunk);
  const head = flat.match(/CFI'?s? Notice\s+([0-9/\s.]{4,12})\s*No\.?\s*(\d+)\s+(.{3,80}?)(?:\s{2,}|\s(?=[A-Z0-9]\.|1\.))/i)
    ?? flat.match(/CFI'?s? Notice\s+([0-9/\s.]{4,12})\s*No\.?\s*(\d+)\s+(.{3,60})/i);
  const num = Number(marks[i].id.replace('CFIN', ''));
  const date = head?.[1]?.replace(/\s+/g, '') ?? '';
  let title = indexTitles.get(marks[i].id) ?? (head?.[3] ?? '').trim().replace(/[\s.]+$/, '');
  // The old index split "Landing skills (or lack thereof)" across two anchors,
  // so the closing bracket is lost. Put it back rather than ship a stray "(".
  if ((title.match(/\(/g) ?? []).length > (title.match(/\)/g) ?? []).length) title += ')';
  title = title.trim();
  if (title.length > 70) title = title.slice(0, 70).replace(/\s+\S*$/, '');

  let body = flat
    .replace(/^.*?CFI'?s? Notice\s+[0-9/\s.]{4,12}\s*No\.?\s*\d+\s*/i, '')
    .replace(new RegExp('^' + esc(title) + '[\\s.,:;-]*', 'i'), '')
    .replace(/\s*Back to Index\s*$/i, '')
    .trim();

  const links = [];
  const seen = new Set();
  for (const m of chunk.matchAll(/<a\s[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = decode(m[1]).trim();
    if (!href || href.startsWith('#') || /^(mailto:|javascript:)/i.test(href)) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    const label = text(m[2]) || href.split('/').pop();
    links.push({ label: label.slice(0, 60), href: abs(href) });
  }

  if (body.length < 20) continue;
  cfiNotices.push({ num, date, title: title || `Notice ${num}`, body, links });
}
cfiNotices.sort((a, b) => b.num - a.num);

// ── Chief Launch Marshal's bulletins ──────────────────────────────────────
const clmRaw = fs.readFileSync(BASE + 'CLM_Notices.asp', 'utf8');
const clmFlat = text(clmRaw);
const clmIntro = (clmFlat.match(/The information on this page contains[\s\S]{0,320}?launch marshals\./i) ?? [''])[0].trim();

const clmSeen = new Map();
for (const row of clmRaw.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
  const flat = text(row);
  const when = (flat.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}(?:\/\d)?/i) ?? [''])[0];
  const kind = /\bNotice\b/i.test(flat) && !/\bBulletin\b/i.test(flat) ? 'Notice' : 'Bulletin';
  for (const m of row.matchAll(/<a\s[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const raw = decode(m[1]).trim();
    if (!raw || raw.startsWith('#') || /^(mailto:|javascript:)/i.test(raw)) continue;
    if (!/\.pdf$/i.test(raw)) continue;
    const href = abs(raw);
    const label = text(m[2]);
    const prev = clmSeen.get(href);
    // The old page split some titles across two anchors; keep the longest.
    if (!prev || label.length > prev.title.length) {
      clmSeen.set(href, { kind, title: label || prev?.title || '', when: when || prev?.when || '', href });
    }
  }
}
for (const [href, v] of [...clmSeen]) {
  if (!v.title || v.title.length < 4) {
    const name = decodeURIComponent(href.split('/').pop() ?? '').replace(/\.pdf$/i, '').replace(/^CLM\s*/i, '');
    clmSeen.set(href, { ...v, title: name });
  }
}
const clmBulletins = [...clmSeen.values()];

// ── Emit ──────────────────────────────────────────────────────────────────
const q = (s) => JSON.stringify(s);
process.stdout.write(`/**
 * CFI'S NOTICES and the CHIEF LAUNCH MARSHAL'S BULLETINS.
 *
 * GENERATED by tools/parse-notices.mjs from CFI_Notices.asp and CLM_Notices.asp.
 * Hand edits are fine; re-running the generator overwrites them.
 *
 * The CFI's notices were one very long page with an anchor index at the top, so
 * finding the radio frequency notice meant scrolling past eleven others. Here
 * each is its own card, newest first, searchable, opening on click.
 *
 * SAFETY-CRITICAL. These are instructions from the CFI. Do not reword them.
 */

export type NoticeLink = { label: string; href: string };

export type CfiNotice = {
  num: number;
  /** As printed on the notice, e.g. "9/09/19". Left exactly as published. */
  date: string;
  title: string;
  body: string;
  links: NoticeLink[];
};

export const cfiNotices: CfiNotice[] = [
${cfiNotices.map((n) => `  { num: ${n.num}, date: ${q(n.date)}, title: ${q(n.title)}, body: ${q(n.body)}, links: [${n.links.map((l) => `{ label: ${q(l.label)}, href: ${q(l.href)} }`).join(', ')}] },`).join('\n')}
];

export type ClmBulletin = { kind: string; title: string; when: string; href: string };

/** What the Chief Launch Marshal says about running the airfield. */
export const clmIntro = ${q(clmIntro || 'Documents relating to the airfield operation. Useful for all flying members, and particularly for authorised and trained launch marshals.')};

export const clmBulletins: ClmBulletin[] = [
${clmBulletins.map((b) => `  { kind: ${q(b.kind)}, title: ${q(b.title)}, when: ${q(b.when)}, href: ${q(b.href)} },`).join('\n')}
];

export const cfiNoticesSource = '${OLD}/CFI_Notices.asp';
export const clmNoticesSource = '${OLD}/CLM_Notices.asp';
`);

process.stderr.write(`CFI notices: ${cfiNotices.length}\nCLM bulletins: ${clmBulletins.length}\n`);
