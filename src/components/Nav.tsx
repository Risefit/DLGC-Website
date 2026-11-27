'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isController } from '@/lib/auth';
import { useState, useRef, useEffect } from 'react';
import { awareimLinks, AWAREIM_BASE } from '@/content/awareim';
import { useReadingProgress } from '@/lib/reading-progress';
import type { ReadingRule } from '@/lib/roles';

/**
 * SIX ITEMS, ON PURPOSE. The old site failed with forty flat links; ten was
 * still too many for a phone. Gallery, Buy and Sell, Archive and Directory are
 * used least, so they live on the Club Life page and in the footer — and under
 * "Also" in the phone menu, where there is room for them.
 */
const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/flying', label: 'Flying' },
  { href: '/training', label: 'Training' },
  { href: '/safety', label: 'Safety' },
  { href: '/documents', label: 'Documents' },
  { href: '/club-life', label: 'Club Life' },
];

const ALSO = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/directory', label: 'Directory' },
  { href: '/archive', label: 'Archive' },
  { href: '/buy-and-sell', label: 'Buy and Sell' },
];

/** Pages that belong to a menu item without sharing its address. */
const UNDER: Record<string, string[]> = {
  '/club-life': ['/gallery', '/directory', '/archive', '/buy-and-sell', '/calendar'],
  '/flying': ['/fees'],
};

/**
 * Free Flight dropdown.
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
        <span>Free Flight</span>
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
            Sign in to Free Flight
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

/**
 * SIGNING IN TO THE PORTAL ITSELF — not Free Flight, which is the dropdown
 * beside it and a different system with a different password. The wording says
 * "portal" every time so nobody types the wrong password into the wrong box.
 *
 * Signed in (which, now the portal is members only, is everybody who can see
 * this menu): the address you signed in with, a link to change your password,
 * and a way out. A controller also gets "Members". It reads the session this
 * browser already holds; it never asks the server who you are, so it costs
 * nothing on each page — and the Members page checks for itself, on the
 * server, that whoever opens it really is a controller.
 */
function PortalAccount({
  onNavigate,
  wide = false,
  readingRule,
}: {
  onNavigate?: () => void;
  wide?: boolean;
  /** Which documents are asked of everybody and of each duty — for "My required reading". */
  readingRule: ReadingRule;
}) {
  const reading = useReadingProgress(readingRule);
  const readingNote = reading
    ? reading.done === reading.total
      ? `all ${reading.total} confirmed`
      : `${reading.total - reading.done} of ${reading.total} still to confirm`
    : 'what you have confirmed';
  const [email, setEmail] = useState<string | null>(null);
  const [controller, setController] = useState(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [waiting, setWaiting] = useState(0);
  const [sentIn, setSentIn] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // A controller is told how many people are waiting to join. Nobody emails
  // them about it, so this number is the only notice they get.
  useEffect(() => {
    if (!controller) return;
    let live = true;
    const ask = () =>
      fetch('/api/admin/waiting')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { waiting?: number; sentIn?: number } | null) => {
        if (live && d && typeof d.waiting === 'number') setWaiting(d.waiting);
        if (live && d && typeof d.sentIn === 'number') setSentIn(d.sentIn);
      })
        .catch(() => {});
    ask();
    // The approval page says when a decision has been made, so the number follows.
    window.addEventListener('dlgc:sent-in-changed', ask);
    return () => {
      live = false;
      window.removeEventListener('dlgc:sent-in-changed', ask);
    };
  }, [controller]);

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

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setReady(true);
      return;
    }
    let live = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!live) return;
      setEmail(data.session?.user?.email ?? null);
      setController(isController(data.session?.user));
      setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setController(isController(session?.user));
    });
    return () => {
      live = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    onNavigate?.();
    // A full reload to the front page, so nothing from the signed-in session
    // is left on screen.
    window.location.assign('/');
  }

  if (!ready) return null;

  const button = `tap rounded-lg border border-white/40 px-4 py-2.5 font-medium text-white transition-colors hover:border-white hover:bg-white/10 ${
    wide ? 'w-full justify-center' : ''
  }`;

  if (!email) {
    return (
      <Link href="/login" onClick={onNavigate} className={button}>
        {wide ? 'Sign in to the portal' : 'Portal sign in'}
      </Link>
    );
  }

  // In the phone menu: everything laid out, one under another.
  if (wide) {
    return (
      <div className="space-y-2">
        <span className="block truncate text-sm text-white/80">
          <span className="sr-only">Signed in to the portal as </span>
          {email}
        </span>
        {controller && (
          <Link href="/admin/members" onClick={onNavigate} className={`${button} gap-2`}>
            Members: add and approve
            {waiting > 0 && <Waiting n={waiting} />}
          </Link>
        )}
        {controller && (
          <Link href="/admin/submissions" onClick={onNavigate} className={`${button} gap-2`}>
            Sent in by members: approve
            {sentIn > 0 && <Waiting n={sentIn} />}
          </Link>
        )}
        {controller && (
          <Link href="/admin/reading" onClick={onNavigate} className={button}>
            Reading record: who has confirmed
          </Link>
        )}
        <Link href="/documents#required-reading" onClick={onNavigate} className={`${button} flex-col !gap-0 text-center`}>
          My required reading
          <span className="text-sm font-normal text-white/80">{readingNote}</span>
        </Link>
        <Link href="/account/profile" onClick={onNavigate} className={`${button} flex-col !gap-0 text-center`}>
          My profile
          <span className="text-sm font-normal text-white/80">my roles and emergency contact</span>
        </Link>
        <Link href="/account/password" onClick={onNavigate} className={button}>
          Change my portal password
        </Link>
        <button type="button" onClick={signOut} className={button}>
          Sign out of the portal
        </button>
      </div>
    );
  }

  // On a wide screen: one button that opens on a click, like Free Flight's.
  // A controller also gets "Members" out in the open beside it — the first
  // controller looked for where to approve people and could not find it
  // inside the menu.
  return (
    <div className="flex items-center gap-3">
      {controller && (
        <Link href="/admin/members" className={`${button} gap-2`}>
          Members
          {waiting > 0 && <Waiting n={waiting} />}
        </Link>
      )}
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`${button} gap-2`}
      >
        <span>My sign-in</span>
        {controller && sentIn > 0 && (
          <>
            <Waiting n={sentIn} />
            <span className="sr-only">sent in by members, waiting for approval</span>
          </>
        )}
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className={open ? 'rotate-180 transition-transform' : 'transition-transform'}>
          <path d="M2 5l6 6 6-6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="card absolute right-0 z-50 mt-2 w-[19rem] max-w-[calc(100vw-2rem)] p-2 shadow-lift" role="menu">
          <p className="px-3 pb-2 pt-1.5 text-xs text-slate2">
            Signed in to the portal as
            <span className="block break-all text-sm font-medium text-navy">{email}</span>
          </p>
          <ul className="border-t border-skyLine pt-1">
            {controller && (
              <li>
                <Link
                  href="/admin/members"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="tap w-full rounded-lg px-3 py-2.5 font-medium text-navy transition-colors hover:bg-sky50"
                >
                  Members
                  <span className="ml-2 text-xs font-normal text-slate2">
                    {waiting > 0 ? `${waiting} waiting to join` : 'add, approve, remove'}
                  </span>
                </Link>
              </li>
            )}
            {controller && (
              <li>
                <Link
                  href="/admin/submissions"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="tap w-full rounded-lg px-3 py-2.5 font-medium text-navy transition-colors hover:bg-sky50"
                >
                  Sent in by members
                  <span className="ml-2 text-xs font-normal text-slate2">
                    {sentIn > 0 ? `${sentIn} waiting for approval` : 'stories and photographs'}
                  </span>
                </Link>
              </li>
            )}
            {controller && (
              <li>
                <Link
                  href="/admin/reading"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="tap w-full rounded-lg px-3 py-2.5 font-medium text-navy transition-colors hover:bg-sky50"
                >
                  Reading record
                  <span className="ml-2 text-xs font-normal text-slate2">who has confirmed what</span>
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/documents#required-reading"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="tap w-full rounded-lg px-3 py-2.5 font-medium text-navy transition-colors hover:bg-sky50"
              >
                My required reading
                <span className="ml-2 text-xs font-normal text-slate2">{readingNote}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/account/profile"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="tap w-full rounded-lg px-3 py-2.5 font-medium text-navy transition-colors hover:bg-sky50"
              >
                My profile
                <span className="ml-2 text-xs font-normal text-slate2">my roles and emergency contact</span>
              </Link>
            </li>
            <li>
              <Link
                href="/account/password"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="tap w-full rounded-lg px-3 py-2.5 font-medium text-navy transition-colors hover:bg-sky50"
              >
                Change my password
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={signOut}
                role="menuitem"
                className="tap w-full rounded-lg px-3 py-2.5 text-left font-medium text-navy transition-colors hover:bg-sky50"
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}

/** The number of people waiting to join, on the orange the dark header keeps for one thing at a time. */
function Waiting({ n }: { n: number }) {
  return (
    <span className="grid h-6 min-w-6 place-items-center rounded-full bg-windsock px-1.5 text-sm font-bold text-deep">
      {n}
      <span className="sr-only"> waiting to join</span>
    </span>
  );
}

const NO_READING: ReadingRule = { everyone: [], byRole: {} };

export default function Nav({ readingRule = NO_READING }: { readingRule?: ReadingRule }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href ||
    (href !== '/dashboard' && pathname.startsWith(href)) ||
    (UNDER[href] ?? []).some((p) => pathname.startsWith(p));

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
            <div className="hidden items-center gap-3 lg:flex">
              <PortalAccount readingRule={readingRule} />
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
          <p className="mx-auto mt-4 max-w-7xl px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Also</p>
          <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4">
            {ALSO.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
                  className="tap w-full py-2.5 text-white/85"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-4 max-w-7xl space-y-3 px-4">
            <PortalAccount wide readingRule={readingRule} onNavigate={() => setMobileOpen(false)} />
            <AwareIMMenu onNavigate={() => setMobileOpen(false)} />
          </div>
        </nav>
      )}
    </header>
  );
}
