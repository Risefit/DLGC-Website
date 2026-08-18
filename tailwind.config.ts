import type { Config } from 'tailwindcss';

/**
 * DLGC design tokens.
 * Aviation-inspired: sky blues, clean whites, high contrast.
 * Deliberately small palette — consistency beats variety.
 *
 * TONAL LADDER (added August 2026 after a design audit). The palette had the
 * right hues but almost no range: `text-slate2` was used 191 times against
 * `text-ink` 5 times, so every paragraph, caption and hint rendered in the same
 * mid grey, and `cloud` sat only 1.05:1 against white so cards had nothing to
 * sit on. The additions below are all tints and shades of existing colours —
 * no new hues.
 *
 * Every text token remains WCAG AA or better on white:
 *   ink 16.7:1 · inkMuted 9.4:1 · navy 11.8:1 · slate2 6.9:1 · sky 5.4:1
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1F2E',      // body text — 16.7:1
        inkMuted: '#33485A', // supporting body text — 9.4:1. Use for card
                             // descriptions and section leads; slate2 is now
                             // reserved for genuine captions and metadata.
        slate2: '#4A5C6B',   // captions, timestamps, counts — 6.9:1
        navy: '#123A5C',     // headings, nav bar
        sky: '#1F6FA8',      // primary interactive
        skyDark: '#155681',  // hover / active
        /**
         * SURFACE FILLS — what may sit on them:
         *   sky50   anything. Faintest wash: row hover, subtle fills.
         *   skyTint anything. The standard panel fill.
         *   sunken  ink / inkMuted / navy only. `sky` is 4.48:1 here — just
         *           under AA — so do NOT put links on it.
         *   sky200  navy or ink only (9.3:1 / 13.2:1). `sky` is 4.25:1 here.
         *           It is a selected-state fill, not a text background.
         */
        sky50: '#F4F9FC',    // faintest wash — row hover, subtle fills
        skyTint: '#EAF3F9',  // panel fill (= sky100)
        sky200: '#D6E7F2',   // selected / active state
        skyLine: '#CBDDEA',  // borders
        /**
         * Page background. Darkened from #F7FAFC, which sat at 1.05:1 against
         * white — barely a plane at all, so cards had nothing to sit on. This
         * more than doubles the luminance delta.
         *
         * It is deliberately NOT darker than this. Going to #E9EEF5 would look
         * better still, but it drags `sky` down to 4.6:1 on the page
         * background, and 4.5 is the AA floor. On a site built for members who
         * are mostly over 60, headroom on link contrast beats a slightly
         * crisper card edge.
         */
        cloud: '#EDF2F7',    // page background — 1.13:1 vs white, sky 4.78:1
        sunken: '#E4EBF2',   // inset panels, table headers, inside white cards
        good: '#1B6E48',
        warn: '#8A5200',
        bad: '#A8231C',
        warnTint: '#FDF6E9',
        badTint: '#FCF0EF',
        goodTint: '#EDF6F1',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Base is 18px, not 16px — this membership skews older.
        base: ['1.125rem', { lineHeight: '1.65' }],
        sm: ['1rem', { lineHeight: '1.6' }],
        xs: ['0.9375rem', { lineHeight: '1.55' }],
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(14,31,46,0.06), 0 4px 12px rgba(14,31,46,0.05)',
        lift: '0 2px 4px rgba(14,31,46,0.08), 0 8px 24px rgba(14,31,46,0.09)',
      },
      maxWidth: {
        prose2: '68ch',
      },
    },
  },
  plugins: [],
};

export default config;
