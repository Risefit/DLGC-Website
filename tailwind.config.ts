import type { Config } from 'tailwindcss';

/**
 * DLGC design tokens.
 * Aviation-inspired: sky blues, clean whites, high contrast.
 * Deliberately small palette — consistency beats variety.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1F2E',      // body text
        slate2: '#4A5C6B',   // secondary text (AA on white)
        navy: '#123A5C',     // headings, nav bar
        sky: '#1F6FA8',      // primary interactive
        skyDark: '#155681',  // hover / active
        skyTint: '#EAF3F9',  // panel fill
        skyLine: '#CBDDEA',  // borders
        cloud: '#F7FAFC',    // page background
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
