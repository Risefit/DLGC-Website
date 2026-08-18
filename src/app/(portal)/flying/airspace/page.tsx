import Link from 'next/link';
import { PageHeader, Section, Callout } from '@/components/ui';
import { aim } from '@/content/awareim';
import {
  airspaceIntro,
  loaDocs,
  nsgaIntro,
  nsgaDocs,
  bgaDocs,
  notamIntro,
  notamTools,
  REBRIEF_RULE,
  airspaceSource,
  loaSource,
} from '@/content/airspace';

export const metadata = { title: 'Airspace and NOTAMs' };

function DocList({ docs }: { docs: { title: string; note?: string; href: string }[] }) {
  return (
    <ul className="card divide-y divide-skyLine overflow-hidden">
      {docs.map((d) => (
        <li key={d.href}>
          <a
            href={d.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-5 py-4 transition-colors hover:bg-sky50"
          >
            <span className="font-medium text-navy">{d.title}</span>
            {d.note && <span className="mt-1 block max-w-prose2 text-sm text-inkMuted">{d.note}</span>}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * PORTED FROM airspace/airspace-main.asp and airspace/LOAsIntro.asp.
 *
 * The 12-month re-brief is the thing members most often let lapse, so it is at
 * the top in its own box rather than buried in the middle of the Letters of
 * Agreement prose the way it was on the old site.
 */
export default function AirspacePage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/flying" className="link">Flying</Link>
        <span className="mx-2 text-inkMuted" aria-hidden="true">/</span>
        <span className="text-inkMuted">Airspace and NOTAMs</span>
      </nav>

      <PageHeader
        eyebrow="Check before every cross-country flight"
        title="Airspace and NOTAMs"
        lead="Flying in controlled and uncontrolled airspace around Camphill — the Wave Box, the L975 crossing, East Midlands, transponder areas and where to get NOTAMs."
      />

      {/* The re-brief is the thing people forget. Top of the page, own box. */}
      <section className="mb-10 overflow-hidden rounded-card border-2 border-warn/60 bg-warnTint/50 shadow-panel">
        <div className="border-b-2 border-warn/40 bg-warn/10 px-6 py-4">
          <h2 className="text-2xl text-warn">Re-brief every 12 months</h2>
        </div>
        <div className="px-6 py-5">
          <p className="max-w-prose2">{REBRIEF_RULE}</p>
          <p className="mt-3 max-w-prose2 text-sm text-inkMuted">
            When you have reviewed the LoA for the Wave Box and Airway Crossing, and the Camphill
            Wave Box and L975 Crossing Briefing, reset your briefing date in Members&rsquo; Admin.
          </p>
          <a
            href={aim('rebrief')}
            target="_blank"
            rel="noopener noreferrer"
            className="tap mt-4 gap-2 rounded-lg bg-warn px-6 py-3.5 font-semibold text-white transition-colors hover:brightness-110"
          >
            Reset my briefing date
            <span className="sr-only">(opens Members&rsquo; Admin in a new tab)</span>
          </a>
        </div>
      </section>

      <Section title="Letters of Agreement">
        <div className="prose-club mb-4">
          {airspaceIntro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <DocList docs={loaDocs} />
      </Section>

      <Section title="Non-SSR Gliding Areas">
        <div className="prose-club mb-4">
          {nsgaIntro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <DocList docs={nsgaDocs} />
      </Section>

      <Section title="NOTAMs">
        <div className="prose-club mb-4">
          {notamIntro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {notamTools.map((t) => (
            <li key={t.href}>
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`card-interactive flex h-full flex-col p-5 ${ t.caution ? 'border-2 border-warn/60 bg-warnTint/30' : '' }`}
              >
                <span className={`font-semibold ${t.caution ? 'text-warn' : 'text-navy'}`}>
                  {t.name}
                </span>
                <span className="mt-1 text-sm text-inkMuted">{t.note}</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="BGA guidance and airspace notices">
        <DocList docs={bgaDocs} />
      </Section>

      <div className="mb-10">
        <Callout tone="info" title="If you are not sure">
          <p>
            The Airspace role holders are the people to ask — they handle NATS and BGA liaison for
            the club. <Link href="/club-life/roles" className="link">See who they are</Link>.
          </p>
        </Callout>
      </div>

      <p className="border-t border-skyLine pt-6 text-sm text-inkMuted">
        Rebuilt from the club&rsquo;s airspace pages —{' '}
        <a href={airspaceSource} target="_blank" rel="noopener noreferrer" className="link">
          Airspace and NOTAMS
        </a>{' '}
        and{' '}
        <a href={loaSource} target="_blank" rel="noopener noreferrer" className="link">
          Letters of Agreement
        </a>
        , both still on the old site.
      </p>
    </>
  );
}
