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
        // Set in src/app/layout.tsx via next/font/local, self-hosted.
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        // For data read character by character: registrations, frequencies,
        // times, reference numbers.
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      /**
       * TYPE SCALE. Base is 18px, not 16px — this membership skews older, and
       * that does not change.
       *
       * The top of the scale was doing nothing: 197 uses of text-sm against 3
       * of text-3xl, so headings barely outranked body copy. Display sizes are
       * now genuinely large and tightly tracked, which is what lets a page have
       * a clear top note instead of everything sitting at the same pitch.
       *
       * Line height tightens as size grows — long lines need air, headlines do
       * not, and a headline set at body leading looks like an accident.
       */
      fontSize: {
        xs: ['0.9375rem', { lineHeight: '1.55' }],
        sm: ['1rem', { lineHeight: '1.6' }],
        base: ['1.125rem', { lineHeight: '1.65' }],
        lg: ['1.25rem', { lineHeight: '1.45' }],
        xl: ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.011em' }],
        '2xl': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.018em' }],
        '3xl': ['2.25rem', { lineHeight: '1.18', letterSpacing: '-0.022em' }],
        '4xl': ['2.75rem', { lineHeight: '1.12', letterSpacing: '-0.026em' }],
        '5xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },
      /**
       * TWO RADII, and only two. Controls (buttons, inputs, chips) at 8px;
       * containers (cards, panels, callouts) at 12px. Pills use rounded-full.
       *
       * There were five competing values in use — rounded-lg, rounded-card,
       * rounded-xl, rounded-md and rounded-full — which is what makes an
       * interface feel assembled rather than designed. rounded-xl and
       * rounded-md are now aliases so old class names still land on the system.
       */
      borderRadius: {
        control: '0.5rem',   // buttons, inputs, chips
        card: '0.75rem',     // cards, panels, callouts
        md: '0.5rem',        // alias → control
        lg: '0.5rem',        // alias → control
        xl: '0.75rem',       // alias → card
      },
      /**
       * ELEVATION — four steps, and they mean something.
       *
       * Every one of the 120 cards carried the identical shadow AND a border,
       * regardless of whether it was the Safety Spot or a footnote. When
       * everything is raised, nothing is.
       *
       *   flat   nothing. Rows inside a container, dense grids. Border only.
       *   card   the resting state of a standalone card.
       *   lift   hover, and cards that are genuinely interactive.
       *   panel  the two or three things per page that sit above everything —
       *          the Safety Spot, the re-brief box, an open form.
       *
       * Each is two or three layers: a tight contact shadow plus a wide soft
       * one. Real light does both; a single blurred rectangle does neither, and
       * that is what makes default shadows look like stickers.
       */
      boxShadow: {
        flat: 'none',
        card: '0 1px 2px rgba(14,31,46,0.05), 0 4px 12px rgba(14,31,46,0.05)',
        lift: '0 2px 4px rgba(14,31,46,0.07), 0 10px 28px rgba(14,31,46,0.10)',
        panel:
          '0 1px 2px rgba(14,31,46,0.06), 0 8px 20px rgba(14,31,46,0.08), 0 24px 56px rgba(14,31,46,0.10)',
      },
      maxWidth: {
        prose2: '68ch',
      },
    },
  },
  plugins: [],
};

export default config;
