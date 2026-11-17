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
 * An old-site address becomes a portal one where the portal has it: a file
 * goes through /files/…, a page that has a home here goes to that page.
 * Everything else is left alone.
 */
export function viaPortal(url: string): string {
  const m = url.match(OLD_ASSET);
  if (m) return `${FILES_BASE}/${m[1]}`;
  return oldPage(url)?.to ?? url;
}

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

/** Path segments as the browser sent them → the same file on the old site. */
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
