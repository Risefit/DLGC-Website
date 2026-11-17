import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * The header of an inner page: a compact version of the dark contour band.
 * Landing pages use <Band> instead, which adds buttons and figures.
 * `back` replaces the old breadcrumb — one link up to the section the page
 * belongs to, set inside the band.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  back,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="band-dark page-head -mt-8 pb-9 pt-7 lg:-mt-10 lg:pb-11 lg:pt-9">
      {back && (
        <p className="mb-2 text-sm">
          <Link
            href={back.href}
            className="tap gap-1.5 text-white/85 underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {back.label}
          </Link>
        </p>
      )}
      {eyebrow && (
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#A9CFEA]">{eyebrow}</p>
      )}
      <h1 className="display text-[2.3rem] sm:text-[2.8rem] lg:text-[3.3rem]">{title}</h1>
      {lead && <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-white/85">{lead}</p>}
    </header>
  );
}

/**
 * A titled section. Directly inside a page it becomes a full-width band, and
 * the bands alternate white and cloud down the page by themselves (see `.sec`
 * in globals.css) — there is nothing to set. Inside a grid or a card it is an
 * ordinary block.
 */
export function Section({
  title,
  description,
  children,
  action,
  id,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="sec">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h2 className="display text-[1.9rem] lg:text-[2.3rem]">{title}</h2>
          {description && <p className="mt-1.5 max-w-prose2 text-inkMuted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Large, obvious primary action. Deliberately oversized for cold hands and reading glasses. */
export function ActionTile({
  href,
  label,
  hint,
  icon,
  external,
}: {
  href: string;
  label: string;
  hint: string;
  icon: ReactNode;
  external?: boolean;
}) {
  const inner = (
    <>
      <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-skyTint text-sky">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-lg font-semibold text-navy">
          {label}
          {external && (
            <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0 text-inkMuted">
              <path d="M6 2h8v8M14 2L6.5 9.5M11 12v2H2V5h2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </span>
        <span className="mt-0.5 block text-sm text-inkMuted">{hint}</span>
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </span>
    </>
  );

  const cls =
    'card flex items-center gap-4 p-5 min-h-[88px] hover:shadow-lift hover:border-sky transition-all';

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn' | 'bad' | 'good';
  title?: string;
  children: ReactNode;
}) {
  const map = {
    info: 'bg-skyTint border-sky',
    warn: 'bg-warnTint border-warn',
    bad: 'bg-badTint border-bad',
    good: 'bg-goodTint border-good',
  } as const;
  const text = { info: 'text-navy', warn: 'text-warn', bad: 'text-bad', good: 'text-good' } as const;

  return (
    <div className={`rounded-card border-l-4 ${map[tone]} p-5`}>
      {title && <p className={`mb-1 font-semibold ${text[tone]}`}>{title}</p>}
      <div className="text-sm text-ink/90 prose-club">{children}</div>
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'live' | 'reference' | 'archive' | 'warn';
}) {
  const map = {
    neutral: 'bg-skyTint text-navy',
    live: 'bg-goodTint text-good',
    reference: 'bg-skyTint text-sky',
    archive: 'bg-cloud text-slate2 border border-skyLine',
    warn: 'bg-warnTint text-warn',
  } as const;
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

/** Marks content still to be migrated from the old site. Honest placeholders beat fake ones. */
export function ToMigrate({ what }: { what: string }) {
  return (
    <div className="rounded-card border border-dashed border-skyLine bg-white p-5 text-sm text-inkMuted">
      <span className="font-medium text-navy">Awaiting import:</span> {what}
      <span className="mt-1 block text-xs">
        Will populate automatically once the mirrored files from the old site are imported.
      </span>
    </div>
  );
}

/* ── Bands ─────────────────────────────────────────────────────────────────
   Full-width bands of tone that open and divide a page. Styles are in
   globals.css (.band-dark, .band-white, .band-cloud, .band-contour). */

/**
 * The dark contour band that opens a landing page. `title` takes JSX so one
 * phrase can be picked out: <>Flying <em>from Camphill</em></>.
 * `aside` sits to the right on a wide screen and underneath on a phone.
 */
export function Band({
  eyebrow,
  title,
  lead,
  children,
  aside,
  figures,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  /** A <Figures> row, set across the full width under everything else. */
  figures?: ReactNode;
}) {
  return (
    <header className="band-dark -mt-8 pb-10 pt-9 lg:-mt-10 lg:pb-14 lg:pt-14">
      <div className={aside ? 'grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12' : undefined}>
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#A9CFEA]">{eyebrow}</p>
          )}
          <h1 className="display text-[2.5rem] sm:text-5xl lg:text-[3.9rem]">{title}</h1>
          {lead && <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-white/85">{lead}</p>}
          {children}
        </div>
        {aside}
      </div>
      {figures}
    </header>
  );
}

/**
 * The photograph beside a landing page's title. Pass it to <Band aside={…}>.
 *
 * `shape="wide"` is for a picture whose point is its width (a rainbow, a view
 * from above); the default suits most photographs. On a phone every picture is
 * cropped to a 2:1 strip so the band stays short — `focus` says which part to
 * keep ("center 70%" keeps the lower part of the frame).
 *
 * The files live in public/img. Keep them under about 250 KB and 1280px wide;
 * re-save anything straight off a phone first, which also removes the location
 * data a phone writes into a photograph.
 */
export function BandPhoto({
  src,
  alt,
  caption,
  width,
  height,
  shape = 'standard',
  focus,
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  shape?: 'standard' | 'wide';
  focus?: string;
  priority?: boolean;
}) {
  const aspect =
    shape === 'wide' ? 'aspect-[2/1] sm:aspect-[16/9]' : 'aspect-[2/1] sm:aspect-[16/10] lg:aspect-[4/3]';
  return (
    <figure className="w-full lg:justify-self-end">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(min-width: 1024px) 560px, 100vw"
        className={`${aspect} w-full rounded-card border border-white/20 object-cover shadow-panel`}
        style={focus ? { objectPosition: focus } : undefined}
      />
      {caption && <figcaption className="mt-2 text-xs text-white/75">{caption}</figcaption>}
    </figure>
  );
}

/** A light band with a display heading. Alternate `white` and `cloud` down a page. */
export function BandSection({
  tone = 'white',
  title,
  description,
  action,
  children,
  id,
}: {
  tone?: 'white' | 'cloud' | 'contour';
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={`band-${tone} py-10 lg:py-14`}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h2 className="display text-3xl lg:text-[2.6rem]">{title}</h2>
          {description && <p className="mt-2 max-w-prose2 text-inkMuted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Large figures with a small label under each — for the two or three numbers a page turns on. */
export function Figures({
  items,
}: {
  items: { value: string; label: string; note?: string; href?: string }[];
}) {
  return (
    <dl className="mt-7 grid gap-x-10 gap-y-5 border-t border-white/25 pt-5 sm:mt-9 sm:grid-cols-3 sm:gap-y-6 sm:pt-6">
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A9CFEA]">{it.label}</dt>
          <dd className="figure mt-1 text-[2.1rem] text-white sm:mt-1.5 sm:text-[2.5rem] lg:text-[3.1rem]">{it.value}</dd>
          {it.note &&
            (it.href ? (
              <dd className="mt-1.5 text-sm">
                {it.href.startsWith('/') || it.href.startsWith('#') ? (
                  <Link href={it.href} className="text-white/85 underline decoration-white/40 underline-offset-4 hover:decoration-white">
                    {it.note}
                  </Link>
                ) : (
                  /* an email address, say — not something next/link should handle */
                  <a href={it.href} className="text-white/85 underline decoration-white/40 underline-offset-4 hover:decoration-white">
                    {it.note}
                  </a>
                )}
              </dd>
            ) : (
              <dd className="mt-1.5 text-sm text-white/85">{it.note}</dd>
            ))}
        </div>
      ))}
    </dl>
  );
}

/** The small arrow that marks a link leaving the portal. */
export const outIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
    <path d="M6 2h8v8M14 2L6.5 9.5M11 12v2H2V5h2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

export const icons = {
  plane: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 14l20-7-9 9-3-2-2 4-1-3-5-1z" fill="currentColor" />
    </svg>
  ),
  calendar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  wallet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 10h20M16 14.5h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  cloud: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 17a4 4 0 010-8 5.5 5.5 0 0110.6-1.3A3.8 3.8 0 0119 17H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  book: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4h7v16H4zM13 4h7v16h-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l8 3v6c0 5-3.4 8.1-8 9-4.6-.9-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  people: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 5.5a3 3 0 010 5.6M17.5 19.5c0-2.4-.9-4-2.2-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  search: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  archive: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8M10 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  alert: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l9.5 17H2.5L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 9v5M12 17.2v.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  graduation: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 8.5L12 4l10 4.5L12 13 2 8.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};
