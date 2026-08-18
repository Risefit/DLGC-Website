import Link from 'next/link';
import type { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sky">{eyebrow}</p>
      )}
      <h1 className="text-3xl lg:text-4xl">{title}</h1>
      {lead && <p className="mt-3 max-w-prose2 text-inkMuted">{lead}</p>}
    </div>
  );
}

export function Section({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl">{title}</h2>
          {description && <p className="mt-1 max-w-prose2 text-sm text-inkMuted">{description}</p>}
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
