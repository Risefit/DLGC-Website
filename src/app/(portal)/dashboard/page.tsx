import Link from 'next/link';
import Image from 'next/image';
import { Band, BandSection, Figures, Badge, icons, outIcon } from '@/components/ui';
import { aim } from '@/content/awareim';
import { news } from '@/content/news';
import { documents } from '@/content/documents';
import { upcomingEvents, eventDate, startOfToday } from '@/content/site';
import { rotaQuarters } from '@/content/roster';
import { safetySpot, safetySpotIntro, charities } from '@/content/community';
import { isPortalPage } from '@/lib/files';

export const metadata = { title: 'Dashboard' };

/** Re-rendered hourly, so "next up" moves on by itself when a date passes. */
export const revalidate = 3600;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const shortDate = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
const newsDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00Z');
  return `${DAYS[d.getUTCDay()]} ${shortDate(d)} ${d.getUTCFullYear()}`;
};

/**
 * THE SCREEN THAT MATTERS.
 * Purpose: answer, in under five seconds on a phone at the launch point —
 * Is flying on? Am I needed? What has changed?
 *
 * Everything on this page appears once. The opening band carries the four
 * things members do most; pinned notices are marked in the news list rather
 * than repeated above it.
 */
export default function Dashboard() {
  const today = startOfToday();
  const upcoming = upcomingEvents
    .map((e) => ({ ...e, date: eventDate(e) }))
    .filter((e) => e.date && e.date >= today);
  const next = upcoming[0];
  const latest = news.slice(0, 5);
  const newest = news[0];
  const quarter = rotaQuarters[0];
  const liveDocs = documents.filter((d) => d.tier === 'live');

  return (
    <>
      <Band
        eyebrow="Members’ portal"
        title={
          <>
            Camphill, <em>above the Hope Valley</em>
          </>
        }
        lead="Is flying on, am I needed, what has changed? Start here."
        figures={
          <Figures
            items={[
              next && next.date
                ? { label: 'Next up', value: shortDate(next.date), note: next.what, href: '/calendar' }
                : { label: 'Next up', value: '—', note: 'Nothing in the calendar yet', href: '/calendar' },
              { label: 'Duty rota', value: quarter.code, note: quarter.label, href: '/flying/roster' },
              {
                label: 'Latest notice',
                value: shortDate(new Date(newest.date + 'T00:00:00Z')),
                note: newest.title,
                href: '/club-life/news',
              },
            ]}
          />
        }
        aside={
          <figure className="lg:justify-self-end">
            <Image
              src="/img/camphill-windsock.jpg"
              alt="A single-seat glider on the grass at Camphill, with the windsock flying behind it."
              width={1080}
              height={720}
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="aspect-[2/1] w-full sm:aspect-[16/10] rounded-card border border-white/20 object-cover shadow-panel lg:aspect-[4/3]"
            />
            <figcaption className="mt-2 text-xs text-white/75">On the field at Camphill.</figcaption>
          </figure>
        }
      >
        <nav aria-label="Most used" className="mt-7 flex flex-wrap gap-3">
          <a href={aim('flyingPlanner')} target="_blank" rel="noopener noreferrer" className="pill-accent">
            Daily Flying Planner {outIcon}
            <span className="sr-only">(opens Members’ Admin in a new tab)</span>
          </a>
          <Link href="/flying/roster" className="pill-ghost">Duty roster</Link>
          <Link href="/flying/weather" className="pill-ghost">Weather and webcam</Link>
          <a href={aim('account')} target="_blank" rel="noopener noreferrer" className="pill-ghost">
            My flying account {outIcon}
            <span className="sr-only">(opens Members’ Admin in a new tab)</span>
          </a>
        </nav>
        <p className="mt-3 max-w-[52ch] text-xs text-white/75">
          The Daily Flying Planner and your flying account are in Members’ Admin, which has its own
          sign-in and opens in a new tab.
        </p>

      </Band>

      {/* ── News, with what is coming up beside it ───────────────────────── */}
      <BandSection
        tone="white"
        title={
          <>
            News <em>and notices</em>
          </>
        }
        action={<Link href="/club-life/news" className="pill-line">All news</Link>}
      >
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[2fr_1fr]">
          <div>
            {latest.map((n, i) => (
              <article
                key={`${n.date}-${i}`}
                className="grid gap-x-6 gap-y-1 border-t border-skyLine py-5 first:border-t-2 first:border-navy sm:grid-cols-[9rem_1fr]"
              >
                <time dateTime={n.date} className="pt-1 text-sm font-semibold text-slate2">
                  {newsDate(n.date)}
                </time>
                <div className="min-w-0">
                  <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xl">
                    {n.title}
                    {n.pinned && <Badge tone="warn">Worth knowing</Badge>}
                  </h3>
                  {n.from && <p className="text-sm italic text-inkMuted">from {n.from}</p>}
                  <p className="prose-club mt-1.5">{n.body[0]}</p>
                  {n.body.length > 1 && (
                    <Link href="/club-life/news" className="link tap text-sm">
                      Read the rest<span className="sr-only"> of {n.title}</span>
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-10">
            <section aria-labelledby="coming-h">
              <div className="mb-1 flex items-center justify-between gap-3 border-b-2 border-navy">
                <h3 id="coming-h" className="text-xl">Coming up</h3>
                <Link href="/calendar" className="link tap text-sm">Calendar</Link>
              </div>
              <ul className="divide-y divide-skyLine">
                {upcoming.slice(0, 4).map((e) => (
                  <li key={`${e.displayWhen}-${e.what}`} className="grid grid-cols-[5.6rem_1fr] items-baseline gap-x-4 py-3.5">
                    <span className="figure text-2xl text-navy">{e.date ? shortDate(e.date) : ''}</span>
                    <span>
                      <span className="block font-medium text-navy">{e.what}</span>
                      <span className="block text-sm text-inkMuted">{e.displayWhen}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="season-h">
              <div className="mb-1 flex items-center justify-between gap-3 border-b-2 border-navy">
                <h3 id="season-h" className="text-xl">This season</h3>
                <Link href="/documents?tier=live" className="link tap text-sm">All current</Link>
              </div>
              <ul className="divide-y divide-skyLine">
                {liveDocs.slice(0, 5).map((d) => (
                  <li key={d.id}>
                    <a
                      href={d.href}
                      target={isPortalPage(d.href) ? undefined : '_blank'}
                      rel={isPortalPage(d.href) ? undefined : 'noopener noreferrer'}
                      className="tap w-full justify-between gap-3 py-2.5 font-medium text-navy hover:text-skyDark"
                    >
                      {d.title}
                      {!isPortalPage(d.href) && <span className="text-slate2">{outIcon}</span>}
                      {!isPortalPage(d.href) && <span className="sr-only">(opens in a new tab)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </BandSection>

      {/* ── Safety Spot: red-edged, unmistakably its own thing ───────────── */}
      <section aria-labelledby="safety-spot-h" className="bleed border-y-2 border-bad/50 bg-badTint py-10 lg:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <h2 id="safety-spot-h" className="display text-3xl !text-bad lg:text-[2.6rem]">The Safety Spot</h2>
            <p className="mt-2 max-w-prose2 text-ink/85">{safetySpotIntro}</p>
          </div>
          <Link href="/safety" className="pill border border-bad/50 text-bad hover:bg-white">
            Loads of other safety material
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {safetySpot.map((l) => {
            // Two of these live in the portal — the emergency procedures and the
            // lessons log. Those must not open in a new tab.
            const internal = isPortalPage(l.href);
            const body = (
              <>
                <span className={`font-semibold ${l.strong ? 'text-bad' : 'text-navy'}`}>{l.label}</span>
                {l.sub && <span className="mt-1 text-sm text-inkMuted">{l.sub}</span>}
                {!internal && <span className="sr-only">(opens in a new tab)</span>}
              </>
            );
            const cls = `flex h-full flex-col rounded-card border bg-white px-5 py-4 transition-colors hover:border-bad ${
              l.strong ? 'border-l-4 border-bad/60' : 'border-bad/20'
            }`;
            return (
              <li key={l.label}>
                {internal ? (
                  <Link href={l.href} className={cls}>{body}</Link>
                ) : (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Find something · charities ───────────────────────────────────── */}
      <section className="band-contour -mb-8 py-10 lg:-mb-10 lg:py-14">
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-2">
          <div>
            <h2 className="display text-3xl lg:text-[2.6rem]">
              Looking for <em>something?</em>
            </h2>
            <p className="mt-3 max-w-[46ch] text-inkMuted">
              Search every manual, policy, set of minutes and notice the club holds, including the
              full archive.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/documents" className="pill-solid">
                <span aria-hidden="true">{icons.search}</span>
                Search documents
              </Link>
              <Link href="/find-it" className="pill-line">The old A–Z</Link>
            </div>
          </div>

          <div>
            <h2 className="display text-3xl lg:text-[2.6rem]">Charities we support</h2>
            <ul className="mt-4 divide-y divide-skyLine border-y border-skyLine">
              {charities.map((c) => (
                <li key={c.name}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="group block py-3.5">
                    <span className="flex items-center gap-2 font-semibold text-navy group-hover:text-skyDark">
                      {c.name} <span className="text-slate2">{outIcon}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-inkMuted">{c.why}</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
