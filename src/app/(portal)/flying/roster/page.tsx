import Link from 'next/link';
import { PageHeader, Section, ActionTile, icons, Callout } from '@/components/ui';
import { aim } from '@/content/awareim';
import {
  rotaQuarters,
  rotaPreparedBy,
  briefingsPreparedBy,
  swapGuidance,
  rotaDocs,
  winchDrivers,
  rotaSource,
} from '@/content/roster';

export const metadata = { title: 'Duty Roster' };

/**
 * PORTED FROM dutyrotas.asp.
 *
 * The old page was a grid of cells all reading "Click LINK", so you could not
 * tell which quarter you were opening until the PDF loaded. Each quarter is now
 * a named card carrying its own rotas.
 *
 * The Daily Flying Planner tile is deliberately NOT here. It is on the
 * dashboard and on the Flying page; a third copy on the page about duties just
 * sent people to the wrong system.
 */
export default function RosterPage() {
  const [current, ...previous] = rotaQuarters;

  return (
    <>
      <PageHeader
        eyebrow="Instructors, winch drivers, launch marshals and duty clerks"
        title="Duty Roster"
        lead="Saturdays, Sundays and Bank Holidays, quarter by quarter. Your own duties and swap requests live in Members’ Admin."
      />

      <Section
        title={`This quarter — ${current.label}`}
        description={`${current.covers}. Prepared by ${rotaPreparedBy}.`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {current.sheets.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex flex-col p-5 transition-all hover:border-sky hover:shadow-lift"
            >
              <span className="text-lg font-semibold text-navy">{s.label}</span>
              <span className="mt-1 text-sm text-inkMuted">{current.label}</span>
              <span className="mt-3 text-sm font-medium text-sky">Open the PDF</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
          {current.briefings && (
            <a
              href={current.briefings.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex flex-col p-5 transition-all hover:border-sky hover:shadow-lift"
            >
              <span className="text-lg font-semibold text-navy">SPL classroom briefings</span>
              <span className="mt-1 text-sm text-inkMuted">
                Topics and schedule · prepared by {briefingsPreparedBy}
              </span>
              <span className="mt-3 text-sm font-medium text-sky">Open the PDF</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </Section>

      <Section title="Your duties, and swapping one">
        <div className="grid gap-4 lg:grid-cols-2">
          <ActionTile
            href={aim('duties')}
            external
            label="Duties and Volunteers"
            hint="What you have signed up for, swaps and offers — in Members’ Admin"
            icon={icons.people}
          />
          <div className="card p-5">
            <h3 className="text-lg">Documents</h3>
            <ul className="mt-2 space-y-2">
              {rotaDocs.map((d) => (
                <li key={d.href}>
                  <a href={d.href} target="_blank" rel="noopener noreferrer" className="link">
                    {d.label}
                    <span className="sr-only"> (PDF, opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <Callout tone="info" title="If you cannot do a duty">
            {swapGuidance.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Callout>
        </div>
      </Section>

      {previous.length > 0 && (
        <Section title="Earlier quarters" description="Kept so the record is complete.">
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {previous.map((q) => (
              <li key={q.code} className="px-5 py-4">
                <p className="font-medium text-navy">{q.label}</p>
                <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {q.sheets.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="link">
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                  {q.briefings && (
                    <a href={q.briefings.href} target="_blank" rel="noopener noreferrer" className="link">
                      SPL briefings
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        title="Solo winch drivers"
        description="Members qualified to winch solo, most recent first. If you want to join them, talk to the Winch Master."
      >
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {winchDrivers.map((d) => (
            <li key={d.name} className="card flex items-baseline justify-between gap-3 px-4 py-3">
              <span className="font-medium text-navy">{d.name}</span>
              <span className="shrink-0 text-sm text-inkMuted">{d.qualified}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-inkMuted">
          Winch training is run by the Winch Master —{' '}
          <Link href="/club-life/roles" className="link">see who holds that role</Link>.
        </p>
      </Section>

      <p className="mt-8 border-t border-skyLine pt-6 text-sm text-inkMuted">
        Rebuilt from the club&rsquo;s duty rotas page.{' '}
        <a href={rotaSource} target="_blank" rel="noopener noreferrer" className="link">
          The original is still there
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
      </p>
    </>
  );
}
