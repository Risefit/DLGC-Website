import type { Metadata, Viewport } from 'next';
import './globals.css';

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
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
