'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { awareimLinks, AWAREIM_BASE } from '@/content/awareim';

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/flying', label: 'Flying' },
  { href: '/training', label: 'Training' },
  { href: '/safety', label: 'Safety' },
  { href: '/documents', label: 'Documents' },
  { href: '/club-life', label: 'Club Life' },
  { href: '/buy-and-sell', label: 'Buy & Sell' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/archive', label: 'Archive' },
  { href: '/directory', label: 'Directory' },
];

/**
 * Members' Admin dropdown.
 * Opens on CLICK, not hover — the old site's hover-only navigation was
 * unusable on phones and to keyboard users (WCAG 1.4.13). Keep it click-based.
 */
function AwareIMMenu({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="tap w-full lg:w-auto gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-white
                   font-medium hover:bg-white/25 transition-colors"
      >
        <span>Members&rsquo; Admin</span>
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className={open ? 'rotate-180 transition-transform' : 'transition-transform'}>
          <path d="M2 5l6 6 6-6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] card p-2 shadow-lift"
          role="menu"
        >
          {/* Sign in first, then the list. The login itself lives on the
              AwareIM server — this portal never asks for those credentials. */}
          <a
            href={AWAREIM_BASE}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { setOpen(false); onNavigate?.(); }}
            className="tap w-full justify-center gap-2 rounded-lg bg-sky px-4 py-3 font-semibold
                       text-white transition-colors hover:bg-skyDark"
            role="menuitem"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
            </svg>
            Sign in to Members&rsquo; Admin
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <p className="px-3 py-2.5 text-xs text-slate2">
            A separate system with its own username and password — you sign in on its own
            page, and this portal never asks for those details. The list below is its menu,
            in its own words, so you know what is in there and where to find it.
          </p>
          <ul className="mt-1 max-h-[60vh] overflow-y-auto border-t border-skyLine pt-1">
            {awareimLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { setOpen(false); onNavigate?.(); }}
                  className="flex items-start gap-2 rounded-lg px-3 py-2.5 hover:bg-sky50 transition-colors"
                  role="menuitem"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-navy">{l.label}</span>
                    <span className="block text-xs text-slate2">{l.hint}</span>
                    <span className="mt-0.5 block text-xs text-sky">{l.where}</span>
                  </span>
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className="mt-1.5 shrink-0 text-inkMuted">
                    <path d="M6 2h8v8M14 2L6.5 9.5M11 12v2H2V5h2" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  </svg>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <header className="bg-navy text-white no-print">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg
                   focus:bg-white focus:px-4 focus:py-2 focus:text-navy focus:shadow-lift"
      >
        Skip to main content
      </a>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/dashboard" className="tap min-w-0 gap-3">
            {/* The club's own crest, from the old site's images/logo200x200.jpg.
                On a white disc because the badge is drawn in navy — reversing it
                out would lose the lettering. */}
            <Image
              src="/dlgc-logo.png"
              alt=""
              aria-hidden="true"
              width={44}
              height={44}
              priority
              className="h-11 w-11 shrink-0 rounded-full bg-white object-cover ring-1 ring-white/30"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-base font-semibold">DLGC Members</span>
              <span className="hidden truncate text-xs text-white/70 sm:block">
                Camphill, Great Hucklow
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden lg:block">
              <AwareIMMenu />
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="tap lg:hidden gap-2 rounded-lg bg-white/15 px-4 py-2.5 font-medium hover:bg-white/25"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                {mobileOpen ? (
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                ) : (
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                )}
              </svg>
              Menu
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden lg:block border-t border-white/15">
          <ul className="flex flex-wrap">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`tap px-4 py-3 font-medium border-b-4 transition-colors ${
                    isActive(item.href)
                      ? 'border-white text-white'
                      : 'border-transparent text-white/80 hover:text-white hover:border-white/40'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav id="mobile-nav" aria-label="Main" className="lg:hidden border-t border-white/15 bg-navy pb-4">
          <ul className="mx-auto max-w-7xl px-4">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-white/10">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`tap w-full py-4 text-lg ${isActive(item.href) ? 'font-semibold text-white' : 'text-white/85'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-4 max-w-7xl px-4">
            <AwareIMMenu onNavigate={() => setMobileOpen(false)} />
          </div>
        </nav>
      )}
    </header>
  );
}
