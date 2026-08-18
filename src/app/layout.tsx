import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

/**
 * TYPEFACE — IBM Plex Sans, self-hosted.
 *
 * WHY THIS ONE, and not Inter or the system stack:
 *  • The site had no typeface at all — `system-ui` — which is the single
 *    loudest "nobody chose this" signal an interface can send.
 *  • Plex was drawn for engineering and technical documentation. It reads as
 *    precise rather than friendly-startup, which is the right register for
 *    airspace notices, flying cards and duty rotas. Inter would work but is the
 *    default of every SaaS dashboard, which is the look we were asked to avoid.
 *  • Unambiguous 1 / l / I and 0 / O. This matters here more than on most
 *    sites: members read glider registrations (G-CHEP, ASW15B), radio
 *    frequencies and dates off these pages.
 *  • Large x-height and open apertures — legibility at 18px for a membership
 *    that skews older.
 *
 * SELF-HOSTED ON PURPOSE. The files are committed under src/app/fonts, taken
 * from the @fontsource packages. No member's browser makes a request to Google
 * to read a club notice, and the build does not depend on a third party being
 * up. Total weight is 80 KB for the whole site.
 *
 * TO CHANGE IT: swap the file and the `src` below. Everything else keys off the
 * `font-sans` / `font-mono` tokens, so it is a one-file edit.
 */
const plexSans = localFont({
  src: './fonts/ibm-plex-sans-latin-wght-normal.woff2',
  // Variable font: the whole 400–700 range from one 45 KB file.
  weight: '100 700',
  display: 'swap',
  variable: '--font-sans',
  // Keeps layout stable while the font loads, so nothing jumps (CLS).
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
});

/**
 * Plex Mono, for data that should line up and be read character by character:
 * registrations, frequencies, times, reference numbers. Two weights only.
 */
const plexMono = localFont({
  src: [
    { path: './fonts/ibm-plex-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/ibm-plex-mono-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
});

export const metadata: Metadata = {
  title: {
    default: "DLGC Members' Portal",
    template: "%s · DLGC Members' Portal",
  },
  description:
    "Members' portal for Derbyshire & Lancashire Gliding Club, Camphill, Great Hucklow.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Never block zoom — WCAG 1.4.4.
  maximumScale: 5,
  themeColor: '#123A5C',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
