import Link from 'next/link';
import { ActionTile, Section, Badge, icons, Callout } from '@/components/ui';
import { AWAREIM_BASE } from '@/content/awareim';
import { news } from '@/content/news';
import { documents, isOverdue } from '@/content/documents';
import { calendar } from '@/content/site';

export const metadata = { title: 'Dashboard' };

/**
 * THE SCREEN THAT MATTERS.
 * Purpose: answer, in under five seconds on a phone at the launch point —
 * Is flying on? Am I needed? What do I owe? What's changed?
 */
export default function Dashboard() {
  const pinned = news.filter((n) => n.pinned).slice(0, 2);
  const latest = news.slice(0, 4);
  const liveDocs = documents.filter((d) => d.tier === 'live');
  const overdue = documents.filter((d) => isOverdue(d));
  const nextEvents = calendar[0]?.events.slice(0, 3) ?? [];

  return (
    <>
      {/* ── Status strip: one glance ─────────────────────────────────────── */}
      <section aria-labelledby="status-h" className="mb-8">
        <h1 id="status-h" className="sr-only">Members&rsquo; dashboard</h1>
        <div className="overflow-hidden rounded-card border border-skyLine bg-gradient-to-br from-navy to-sky text-white shadow-card">
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-5">
              <p className="text-xs uppercase tracking-widest text-white/70">Today at Camphill</p>
              <p className="mt-1 text-2xl font-semibold">Check the DFP</p>
              <p className="mt-1 text-sm text-white/80">
                Flying status is set on the Daily Flying Planner
              </p>
            </div>
            <div className="p-5 sm:border-l border-white/20">
              <p className="text-xs uppercase tracking-widest text-white/70">Wind</p>
              <p className="mt-1 text-2xl font-semibold">
                <span className="text-white/50">—</span>
              </p>
              <p className="mt-1 text-sm text-white/80">
                <Link href="/flying/weather" className="underline decoration-white/40 underline-offset-2 hover:decoration-white">
                  Camphill weather station
                </Link>
              </p>
            </div>
            <div className="p-5 lg:border-l border-white/20">
              <p className="text-xs uppercase tracking-widest text-white/70">Season</p>
              <p className="mt-1 text-2xl font-semibold">Summer</p>
              <p className="mt-1 text-sm text-white/80">Last day Fri 11 September</p>
            </div>
            <div className="p-5 sm:border-l border-white/20">
              <p className="text-xs uppercase tracking-widest text-white/70">Webcam</p>
              <p className="mt-1 text-2xl font-semibold">Live view</p>
              <p className="mt-1 text-sm text-white/80">
                <Link href="/flying/weather" className="underline decoration-white/40 underline-offset-2 hover:decoration-white">
                  Looking north across the hangar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Primary actions: four big tiles ─────────────────────────────── */}
      <Section
        title="What do you need?"
        description="The four things members do most. Everything else is in the menu above."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionTile
            href={AWAREIM_BASE}
            external
            label="Daily Flying Planner"
            hint="Book onto a flying day"
            icon={icons.plane}
          />
          <ActionTile href="/flying/roster" label="Duty Roster" hint="Who is on duty when" icon={icons.calendar} />
          <ActionTile
            href={AWAREIM_BASE}
            external
            label="My Flying Account"
            hint="Balance and statements"
            icon={icons.wallet}
          />
          <ActionTile href="/flying/weather" label="Weather" hint="Forecasts and webcam" icon={icons.cloud} />
        </div>
        <p className="mt-3 text-xs text-slate2">
          The Daily Flying Planner and your flying account live in Members&rsquo; Admin, a separate
          system with its own login. Those two tiles open it in a new tab.
        </p>
      </Section>

      {/* ── Needs attention ──────────────────────────────────────────────── */}
      {pinned.length > 0 && (
        <Section title="Worth knowing now">
          <div className="grid gap-4 lg:grid-cols-2">
            {pinned.map((n) => (
              <Callout key={n.title} tone="warn" title={n.title}>
                <p>{n.body[0]}</p>
                <p className="text-xs text-slate2">
                  {n.displayDate}
                  {n.from && ` · from ${n.from}`}
                </p>
              </Callout>
            ))}
          </div>
        </Section>
      )}

      <div className="grid gap-10 lg:grid-cols-3">
        {/* ── News: preserve the dated, attributed house style ──────────── */}
        <div className="lg:col-span-2">
          <Section
            title="News and Notices"
            action={<Link href="/club-life/news" className="link text-sm">All news</Link>}
          >
            <div className="space-y-4">
              {latest.map((n, i) => (
                <article key={`${n.date}-${i}`} className="card p-5">
                  <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg">{n.title}</h3>
                    {n.from && <span className="text-sm italic text-slate2">from {n.from}</span>}
                  </div>
                  <time dateTime={n.date} className="mb-2 block text-xs text-slate2">
                    {n.displayDate}
                  </time>
                  <p className="prose-club text-sm">{n.body[0]}</p>
                  {n.body.length > 1 && (
                    <Link href="/club-life/news" className="link mt-2 inline-block text-sm">
                      Read the rest
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <div>
          <Section title="This season" description="Changes during the year — check before you rely on it.">
            <ul className="card divide-y divide-skyLine">
              {liveDocs.slice(0, 7).map((d) => (
                <li key={d.id}>
                  <a
                    href={d.href}
                    target={d.href.startsWith('/') ? undefined : '_blank'}
                    rel={d.href.startsWith('/') ? undefined : 'noopener noreferrer'}
                    className="tap w-full flex-col items-start px-5 py-3.5 hover:bg-skyTint transition-colors"
                  >
                    <span className="font-medium text-navy">{d.title}</span>
                    {d.version && <span className="text-xs text-slate2">{d.version}</span>}
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/documents?tier=live" className="link mt-3 inline-block text-sm">
              All current documents
            </Link>
          </Section>

          <Section title="Coming up" action={<Link href="/calendar" className="link text-sm">Calendar</Link>}>
            <ul className="card divide-y divide-skyLine">
              {nextEvents.map((e) => (
                <li key={e.what} className="px-5 py-3.5">
                  <p className="text-sm font-medium text-navy">{e.when}</p>
                  <p className="text-sm text-slate2">{e.what}</p>
                </li>
              ))}
            </ul>
          </Section>

          {overdue.length > 0 && (
            <Section title="Housekeeping" description="Visible to all members deliberately — it keeps the library honest.">
              <Callout tone="warn">
                <p>
                  <strong>{overdue.length}</strong>{' '}
                  {overdue.length === 1 ? 'document is' : 'documents are'} past their review date.
                </p>
                <Link href="/documents?review=overdue" className="link text-sm">
                  Show them
                </Link>
              </Callout>
            </Section>
          )}

          <Section title="Looking for something?">
            <div className="card p-5">
              <p className="mb-3 text-sm text-slate2">
                Search every manual, policy, set of minutes and notice the club holds — including
                the full archive.
              </p>
              <Link
                href="/documents"
                className="tap gap-2 rounded-lg bg-sky px-5 py-3 font-medium text-white hover:bg-skyDark transition-colors"
              >
                <span aria-hidden="true">{icons.search}</span>
                Search documents
              </Link>
              <p className="mt-3 text-xs text-slate2">
                Knew the old site well?{' '}
                <Link href="/find-it" className="link">The old A–Z still works</Link>.
              </p>
            </div>
          </Section>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate2">
        <Badge tone="live">Live</Badge> changes within a season ·{' '}
        <Badge tone="reference">Reference</Badge> current, consult when needed ·{' '}
        <Badge tone="archive">Archive</Badge> historic, kept forever
      </p>
    </>
  );
}
