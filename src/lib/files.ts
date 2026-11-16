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

/** An old-site file address becomes a portal one. Pages (.asp) and everything else are left alone. */
export function viaPortal(url: string): string {
  const m = url.match(OLD_ASSET);
  return m ? `${FILES_BASE}/${m[1]}` : url;
}

/**
 * Apply viaPortal to every string in a piece of content. Only a string that is
 * ENTIRELY a file address changes — wording is never touched.
 */
export function portalise<T>(value: T): T {
  if (typeof value === 'string') return viaPortal(value) as unknown as T;
  if (Array.isArray(value)) return value.map(portalise) as unknown as T;
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = portalise(v);
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
