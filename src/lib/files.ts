/**
 * FILES FROM THE OLD MEMBERS' SITE.
 *
 * Every document, photograph and presentation that used to live at
 * dlgc.org.uk/members/… is linked as  /files/members/…  The route at
 * src/app/files/[...path]/route.ts decides, per request, where it comes from:
 *
 *   signed in to the portal, file copied across  → the club's private storage
 *   anything else                                → the old site, as before
 *
 * So nothing breaks while the copy is incomplete, and a file that was too big
 * to copy still opens. This module is the one place that knows the address
 * scheme; it has no dependencies so content files, pages and the route can
 * all use it.
 */

export const FILES_BASE = '/files';
export const OLD_SITE = 'https://www.dlgc.org.uk';
export const FILES_BUCKET = 'legacy';

const ASSET_EXT =
  'pdf|docx?|xlsx?|pptx?|ppsx?|pps|pub|txt|csv|jpe?g|png|gif|bmp|webp|mp4|mov|avi|mp3|zip';
const OLD_ASSET = new RegExp(
  `^https?://(?:www\\.)?dlgc\\.org\\.uk/(members/[^?#]+\\.(?:${ASSET_EXT}))$`,
  'i',
);

/**
 * PAGES OF THE OLD SITE THAT HAVE A HOME IN THE PORTAL.
 *
 * Old news items, notices and club pages are full of links to the old site's
 * pages ("see the duty rotas page"). Where the portal has that page, the link
 * goes to the portal instead; a member should not be sent to the old site, and
 * asked for its password, for something that is here.
 *
 * The key is the old address after /members/, lower case. `label` replaces a
 * link whose text was only the old file name ("dutyrotas", "comminutes").
 *
 * Old pages that are NOT here have nothing equivalent in the portal yet — the
 * individual photo-gallery pages, the Blake Robertshaw task and turn-point
 * pages, the Inter-Club League fixtures. They still open on the old site.
 * When one is brought across, add it here and every old link follows.
 */
const OLD_PAGES: Record<string, { to: string; label: string }> = {
  'default.asp': { to: '/dashboard', label: 'Members’ portal home' },
  'links-library.asp': { to: '/documents', label: 'Club documents' },
  'find_it.asp': { to: '/find-it', label: 'Find It (A–Z)' },
  'dutyrotas.asp': { to: '/flying/roster', label: 'Duty roster' },
  'winch drvr gallery.asp': { to: '/flying/roster#winch-drivers', label: 'Solo winch drivers' },
  'calendar.asp': { to: '/calendar', label: 'Calendar' },
  'fees_current.asp': { to: '/fees', label: 'Fees and charges' },
  'fees26-27.asp': { to: '/fees', label: 'Fees and charges' },
  'fees25_26.asp': { to: '/fees', label: 'Fees and charges' },
  'met_page.asp': { to: '/flying/weather', label: 'Weather' },
  'metstation.html': { to: '/flying/weather#wind', label: 'Camphill weather station' },
  'airspace/airspace-main.asp': { to: '/flying/airspace', label: 'Airspace and NOTAMs' },
  'airspace/loasintro.asp': { to: '/flying/airspace', label: 'Airspace and NOTAMs' },
  'cfis_notices.asp': { to: '/flying/notices', label: 'CFI’s notices' },
  'cfis_notices_new.asp': { to: '/flying/notices', label: 'CFI’s notices' },
  'clm_notices.asp': { to: '/flying/notices', label: 'Chief Launch Marshal’s bulletins' },
  'manuals/manuals.asp': { to: '/flying#manuals', label: 'Club manuals' },
  'manuals_webpage.asp': { to: '/flying#manuals', label: 'Club manuals' },
  'manuals_new2f.asp': { to: '/flying#manuals', label: 'Club manuals' },
  'safety.asp': { to: '/safety', label: 'Safety' },
  'safety_page.asp': { to: '/safety', label: 'Safety' },
  'safety/sftylssnslg.asp': { to: '/safety/lessons', label: 'Safety Lessons Log' },
  'safety/emrgcygdnc/glider_missing_2019a.htm': { to: '/safety/emergency', label: 'Emergency Procedures' },
  'ssa_extracts.asp': { to: '/archive/safety-articles-from-a-medic', label: 'Safety articles from a medic' },
  'training_articles.asp': { to: '/archive/training-articles', label: 'Training articles' },
  'bronze&spltheory.asp': { to: '/archive/bronze-spl-theory-briefings', label: 'Bronze and SPL theory briefings' },
  'bronze&spltheory2023.asp': { to: '/archive/bronze-spl-theory-briefings', label: 'Bronze and SPL theory briefings' },
  'minutes/comminutes.asp': { to: '/archive/committee-meeting-minutes', label: 'Committee meeting minutes' },
  'instrct-mtgs/instrct-mtgs.asp': { to: '/archive/instructors-meeting-minutes', label: 'Instructors’ meeting minutes' },
  'agm/agmdocs.asp': { to: '/archive?q=AGM', label: 'AGM documents' },
  'newsletters/newsletters.asp': { to: '/club-life/newsletters', label: 'Camphill Newsletters' },
  'committee.asp': { to: '/directory/committee', label: 'The committee' },
  'committee2026.2.asp': { to: '/directory/committee', label: 'The committee' },
  'job&roles.asp': { to: '/directory#roles', label: 'Roles and role holders' },
  'photogalleries.asp': { to: '/gallery', label: 'Gallery' },
  'piccies.asp': { to: '/gallery', label: 'Gallery' },
  'flyblog.asp': { to: '/club-life/blog', label: 'Flying blog' },
  'flyblog_c.html': { to: '/club-life/blog', label: 'Flying blog' },
  'vintagerally.asp': { to: '/club-life/vintage-rally', label: 'Annual Vintage Rally' },
  'junior_gliding.asp': { to: '/club-life/junior-gliding', label: 'Junior Gliding' },
  'silvrskrs.asp': { to: '/club-life/silver-seekers', label: 'Society of Silver Seekers' },
  'trophies.asp': { to: '/club-life/trophies', label: 'Trophies and trophy winners' },
  'i-clb-lg-2023x.asp': { to: '/club-life/inter-club-league', label: 'Inter-Club League' },
  'blake-rbshw/blake_rbshw_briefa.asp': { to: '/club-life/blake-robertshaw', label: 'Blake Robertshaw Trophy' },
};

/** Gallery pages that are still only on the old site, and what to call a link to one. */
const OLD_GALLERY_PAGES: [string, string][] = [
  ['galleries/solos/', 'First solo photograph'],
  ['galleries/snippets/', 'Photograph in the Snippets gallery'],
  ['galleries/fields & wine/', 'Field landings gallery'],
  ['galleries/aerialshots/', 'Aerial shots gallery'],
  ['galleries/clouds/', 'Clouds gallery'],
];

const OLD_PAGE = /^https?:\/\/(?:www\.)?dlgc\.org\.uk\/members\/([^?#]+)/i;

function oldPage(url: string): { to: string; label: string; file: string } | null {
  const m = url.match(OLD_PAGE);
  if (!m) return null;
  let key = m[1];
  try {
    key = decodeURIComponent(key);
  } catch {
    /* leave it as it is */
  }
  key = key.toLowerCase();
  const hit = OLD_PAGES[key];
  return hit ? { ...hit, file: key } : null;
}

/**
 * FILES THE OLD SITE HAS SINCE RENAMED OR REPLACED.
 *
 * Old news items link to a file by the name it had that week. The commonest
 * case by far: minutes are published as "2026_07(P).pdf" (provisional), and
 * when the committee approves them the Secretary replaces that file with
 * "2026_07.pdf" — so every news item announcing provisional minutes ends up
 * with a dead link. A member found a string of these in November 2026.
 *
 * Every old-site link in the news was tested against the old site on
 * 24 November 2026: 66 of 536 were dead. Each is listed here with where it
 * should go now — the file that replaced it, or a portal page when the file
 * itself has gone. Keys are lower case, after /members/.
 *
 * When minutes are approved from now on: change the row in
 * documents-imported.ts to the new file name, and add a line here.
 */
const MOVED_FILES: Record<string, string> = {
  // Provisional minutes, since approved
  'minutes/2026_07(p).pdf': 'minutes/2026_07.pdf',
  'minutes/2026_06(p).pdf': 'minutes/2026_06.pdf',
  'minutes/2026_01(p).pdf': 'minutes/2026_01.pdf',
  'minutes/2025_09(p).pdf': 'minutes/2025_09.pdf',
  'minutes/2025_08(p).pdf': 'minutes/2025_08.pdf',
  'minutes/2025_07(p).pdf': 'minutes/2025_07.pdf',
  'minutes/2025_05(p).pdf': 'minutes/2025_05.pdf',
  'minutes/2025_04(p).pdf': 'minutes/2025_04.pdf',
  'minutes/2025_01(p).pdf': 'minutes/2025_01.pdf',
  'minutes/2024_11(p).pdf': 'minutes/2024_11.pdf',
  'minutes/2024_09(p).pdf': 'minutes/2024_09.pdf',
  'minutes/2024_01(p).pdf': 'minutes/2024_01.pdf',
  'minutes/2023_11(p).pdf': 'minutes/2023_11.pdf',
  'minutes/2023_07(p).pdf': 'minutes/2023_07.pdf',
  'minutes/2023_05(p).pdf': 'minutes/2023_05.pdf',
  'minutes/2023_02(p).pdf': 'minutes/2023_02.pdf',
  'minutes/2022_10(p).pdf': 'minutes/2022_10.pdf',
  'minutes/2022_09(p).pdf': 'minutes/2022_09.pdf',
  'minutes/2022_08(p).pdf': 'minutes/2022_08.pdf',
  'minutes/2022_02(p).pdf': 'minutes/2022_02.pdf',
  'minutes/2022_01(p).pdf': 'minutes/2022_01.pdf',
  'minutes/2022_04 (p).pdf': 'minutes/2022_04.pdf',
  'minutes/2022_03 (p).pdf': 'minutes/2022_03.pdf',
  // Minutes no longer on the old site at all: the collection, where the rest are
  'minutes/2025_02_postagm2.pdf': '/archive/committee-meeting-minutes',
  'minutes/2025_postagm.pdf': '/archive/committee-meeting-minutes',
  'minutes/2021_10(p).pdf': '/archive/committee-meeting-minutes',
  'minutes/2021_09(f).pdf': '/archive/committee-meeting-minutes',
  'minutes/2021_08.pdf': '/archive/committee-meeting-minutes',
  'minutes/2021_07(p).pdf': '/archive/committee-meeting-minutes',
  'minutes/2021_05(f).pdf': '/archive/committee-meeting-minutes',
  'minutes/2021_05(p).pdf': '/archive/committee-meeting-minutes',
  'minutes/2021_04.pdf': '/archive/committee-meeting-minutes',
  'minutes/2021_03(f).pdf': '/archive/committee-meeting-minutes',
  'minutes/2021_03 [p].pdf': '/archive/committee-meeting-minutes',
  'minutes/2021_01p.pdf': '/archive/committee-meeting-minutes',
  'minutes/2020_10.pdf': '/archive/committee-meeting-minutes',
  'minutes/2020_09.pdf': '/archive/committee-meeting-minutes',
  'minutes/2020_06p.pdf': '/archive/committee-meeting-minutes',
  // Instructors' meetings and AGM minutes, renamed
  'instrct-mtgs/instructors_2025_03(mar).pdf': 'instrct-mtgs/Instructors 2025_03 (Mar).pdf',
  'instrct-mtgs/instructors_2024_10(oct).pdf': 'instrct-mtgs/Instructors 2024_10 (Oct).pdf',
  'instrct-mtgs/instructors _2024_03(mar).pdf': 'instrct-mtgs/Instructors 2024_03( Mar).pdf',
  'agm/2022 agm minutes (provisional).pdf': 'AGM/2022 AGM Minutes .pdf',
  'agm/2020 agm minutes(provisional).pdf': 'AGM/2020 AGM Minutes (Final).pdf',
  // Re-issued under a new name: the version in force now
  'newsletters/cn_2025_(aug).pdf': 'newsletters/CN_2025_1(aug).pdf',
  'pdfs/reciprocal membership may 2025.pdf': 'pdfs/Reciprocal Membership 4.8.26.pdf',
  'pdfs/clm bulletin winter flying.pdf': 'pdfs/CLM Bulletin Winter Flying Update151022.pdf',
  'manuals/launch marshal manualv5.3 final.pdf': 'manuals/Launch Marshal Manual V5.9 Aug 2026_.pdf',
  'pdfs/launch marshals v16c 220920.pdf': 'pdfs/Authorised Launch Marshals Latest.pdf',
  'airspace/east mids loa briefing notes.pdf': 'airspace/East Mids LoA Briefing NotesV3.pdf',
  'kenblake/blake r tps word v5 1117.pdf': "blake-rbshw/Blake R TP's Word V8 19.pdf",
  'pdfs/trophiesscheme.pdf': 'pdfs/Trophies Scheme V6 Feb 26 ARH.pdf',
  // Gone, with nothing that replaced it: the nearest place to look
  'lists/instructorsoct2020.pdf': '/flying/roster',
  'pdfs/covid19 bulletin 200417.pdf': '/archive',
  'manuals/daily mentor guidance.pdf': '/documents?tier=all&q=mentor',
};

/** Where a renamed or replaced old-site file is now, as a portal address; null if it never moved. */
function movedTo(url: string): string | null {
  const m = url.match(OLD_PAGE);
  if (!m) return null;
  let key = m[1];
  try {
    key = decodeURIComponent(key);
  } catch {
    /* leave it as it is */
  }
  const to = MOVED_FILES[key.toLowerCase()];
  if (!to) return null;
  return to.startsWith('/') ? to : `${FILES_BASE}/members/${to.split('/').map(encodeURIComponent).join('/')}`;
}

/**
 * THE BGA MOVED ITS FILES. In 2026 every file the BGA had published at
 * members.gliding.co.uk/wp-content/uploads/… went to a separate file server,
 * and the old addresses return "not found". The BGA's own pages now link to
 * the new server with the rest of the address unchanged, so old news items
 * are pointed the same way. New links should go to the BGA's page for a
 * document, not to the file (see CLAUDE.md).
 */
const BGA_UPLOAD = /^https?:\/\/(?:members|www)\.gliding\.co\.uk\/wp-content\/uploads\//i;
const BGA_FILES = 'https://dusin4sirodta.cloudfront.net/uploads/';

/**
 * An old-site address becomes a portal one where the portal has it: a file
 * goes through /files/…, a page that has a home here goes to that page.
 * Everything else is left alone.
 */
export function viaPortal(url: string): string {
  if (BGA_UPLOAD.test(url)) return url.replace(BGA_UPLOAD, BGA_FILES);
  const moved = movedTo(url);
  if (moved) return moved;
  const m = url.match(OLD_ASSET);
  if (m) return `${FILES_BASE}/${m[1]}`;
  return oldPage(url)?.to ?? url;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "dutyrotas", "this link", "." — link text that says nothing about where it goes. */
function saysNothing(label: string, file: string): boolean {
  const squash = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
  const stem = squash(file.split('/').pop()!.replace(/\.[a-z]+$/, ''));
  const l = squash(label);
  return l === stem || l.length < 3 || /^(this|here|link|webpage|page)/.test(l);
}

/**
 * Apply viaPortal to every string in a piece of content. Only a string that is
 * ENTIRELY an old-site address changes — wording is never touched.
 */
export function portalise<T>(value: T, opts: { pages?: boolean } = {}): T {
  // `pages: false` moves files only. The Club Life pages use it: each of them
  // deliberately links to its own old page for the parts not brought across
  // (past rally reports, the awards scheme), and that link must not be turned
  // round to point at the page it is on.
  const pages = opts.pages !== false;
  if (typeof value === 'string') {
    return (pages ? viaPortal(value) : value.replace(OLD_ASSET, `${FILES_BASE}/$1`)) as unknown as T;
  }
  if (Array.isArray(value)) return value.map((v) => portalise(v, opts)) as unknown as T;
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = portalise(v, opts);
    const src = value as Record<string, unknown>;
    if (pages && typeof src.href === 'string' && typeof src.label === 'string') {
      // A link to an old page that now lives here: give it a name worth
      // reading if all it had was the old file name.
      const hit = oldPage(src.href);
      if (hit && saysNothing(src.label, hit.file)) out.label = hit.label;
      // Provisional minutes that have since been approved: "2026 07(P) (PDF)"
      // is the old file's name, and no longer true of what opens.
      const approved = typeof out.href === 'string' && movedTo(src.href) && out.href.match(/\/minutes\/(\d{4})_(\d\d)\.pdf$/);
      if (approved) out.label = `Committee minutes, ${MONTH_NAMES[Number(approved[2]) - 1]} ${approved[1]}`;
      // Photographs still on the old site: "Solos(116)" tells a member nothing.
      const photo = !hit && src.href.match(OLD_PAGE);
      if (photo) {
        const file = decodeURIComponent(photo[1]).toLowerCase();
        const name = OLD_GALLERY_PAGES.find(([folder]) => file.startsWith(folder));
        if (name && saysNothing(src.label, file)) out.label = name[1];
      }
    }
    return out as T;
  }
  return value;
}

/** True for a link to a file rather than a page of the portal. */
export const isFileLink = (href: string) => href.startsWith(`${FILES_BASE}/`);

/**
 * True for a page of this portal. A file link starts with "/" too, but it is a
 * document: it opens in a new tab and must never be given to next/link, which
 * would try to pre-load it.
 */
export const isPortalPage = (href: string) => href.startsWith('/') && !isFileLink(href);

/**
 * WHICH TAB A LINK OPENS IN — one rule for the whole portal (November 2026,
 * after a member pointed out that it varied from one link to the next).
 *
 *   A link INSIDE THE CONTENT of a page opens in a new tab: a document,
 *   another website, an old-site page, and equally a portal page named in a
 *   reading list or a news item. The member keeps their place on the page
 *   they were reading.
 *
 *   NAVIGATION stays in the same tab: the menu, the buttons in the band at the
 *   top of a page, section tiles, "back" links, the footer, Find It. Those use
 *   next/link directly and never ask this function.
 *
 * Every list of links asks here, so the rule can be changed in one line.
 * Email, telephone and same-page links are never given a new tab.
 */
export const opensNewTab = (href: string) => !/^(#|mailto:|tel:|sms:)/i.test(href);

/** Path segments as the browser sent them → the same file on the old site. */
/**
 * FILES A BROWSER CANNOT SHOW.
 *
 * A PDF opens in the browser. A Word document or a PowerPoint cannot — every
 * browser downloads it and hands it to another app, and a member without that
 * app sees nothing at all. The link says so before it is pressed.
 *
 * The real cure is a PDF copy of the file: see `pdfCopyKey` below.
 */
export function fileKind(href: string): { label: string; hint: string } | null {
  const ext = (href.split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toLowerCase();
  if (/^(docx?|rtf)$/.test(ext)) return { label: 'Word document', hint: 'downloads, then opens in Word or Pages' };
  if (/^pp[ts]x?$/.test(ext)) return { label: 'PowerPoint', hint: 'downloads, then opens in PowerPoint or Keynote' };
  if (/^xlsx?$/.test(ext)) return { label: 'Excel spreadsheet', hint: 'downloads, then opens in Excel or Numbers' };
  return null;
}

/**
 * The storage key of the PDF copy of a Word, PowerPoint or Excel file: the
 * file's own key with ".pdf" on the end ("…/jku_20report.doc.pdf"). When that
 * object exists in the private store, a signed-in member is given it instead
 * of the original, so the document opens in the browser.
 */
export const pdfCopyKey = (key: string) => `${key}.pdf`;

export function oldSiteUrl(segments: string[]): string {
  return `${OLD_SITE}/${segments.map(encodeURIComponent).join('/')}`;
}

/**
 * The name a file is stored under.
 *
 * The old server did not care about capitals, and its file names use
 * characters storage will not accept, so: lower case, and anything other than
 * a–z, 0–9, dot and hyphen becomes _XX (its bytes in hex; a space is _20 and
 * an underscore itself is _5f, so two different names can never collide).
 *
 * scripts/upload-legacy.mjs carries an identical copy of this function. If one
 * changes, change the other, or files will be stored under names the portal
 * never asks for.
 */
export function storageKey(segments: string[]): string {
  return segments
    .map((seg) =>
      Array.from(new TextEncoder().encode(seg.normalize('NFC').toLowerCase()))
        .map((b) => {
          const c = String.fromCharCode(b);
          return /[a-z0-9.-]/.test(c) ? c : '_' + b.toString(16).padStart(2, '0');
        })
        .join(''),
    )
    .join('/');
}
