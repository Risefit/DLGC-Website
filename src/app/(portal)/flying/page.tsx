import { PageHeader, Section, ActionTile, icons, Callout } from '@/components/ui';
import { aim } from '@/content/awareim';
import { documents } from '@/content/documents';
import { manualGroups, flightManualCaveat } from '@/content/manuals';

export const metadata = { title: 'Flying' };

export default function FlyingPage() {
  const ops = documents.filter((d) => d.category === 'Operational Notices');

  return (
    <>
      <PageHeader
        eyebrow="Getting airborne"
        title="Flying"
        lead="Booking, duties, weather, airspace and the operational notices that govern how we fly at Camphill."
      />

      <Section title="Book and check">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionTile href={aim('flyingPlanner')} external label="Daily Flying Planner" hint="Book onto a flying day" icon={icons.plane} />
          <ActionTile href={aim('flightsToday')} external label="Flights Today" hint="What is happening now" icon={icons.calendar} />
          <ActionTile href="/flying/roster" label="Duty Roster" hint="Instructors and duties" icon={icons.people} />
          <ActionTile href="/flying/weather" label="Weather" hint="Forecasts, station, webcam" icon={icons.cloud} />
        </div>
      </Section>

      <Section
        title="Before you fly cross-country"
        description="Airspace agreements, NOTAMs, and the notices that govern how we operate."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionTile
            href="/flying/airspace"
            label="Airspace and NOTAMs"
            hint="Wave Box, L975, East Midlands, NSGAs"
            icon={icons.cloud}
          />
          <ActionTile
            href="/flying/notices"
            label="CFI and Launch Marshal notices"
            hint="How we check, launch and report"
            icon={icons.book}
          />
          <ActionTile
            href={aim('rebrief')}
            external
            label="Airspace re-brief"
            hint="Due every 12 months"
            icon={icons.calendar}
          />
        </div>
      </Section>

      {/* Ported from the old manuals_webpage.asp. Three columns, in the club's
          own groupings — the five that govern how we operate, the specialist
          procedures, and the aircraft flight manuals. */}
      <Section
        title="Club manuals"
        description="How the club operates, written down. If you only read one, make it the Pilots Manual."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {manualGroups.map((g) => (
            <div key={g.group} className="card flex flex-col overflow-hidden">
              <div className="border-b border-skyLine bg-skyTint px-5 py-3.5">
                <h3 className="text-lg font-semibold text-navy">{g.group}</h3>
                <p className="mt-1 text-sm text-slate2">{g.blurb}</p>
              </div>
              <ul className="flex-1 divide-y divide-skyLine">
                {g.manuals.map((m) => (
                  <li key={m.href}>
                    <a
                      href={m.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-5 py-3.5 transition-colors hover:bg-skyTint"
                    >
                      <span className="font-medium text-navy">{m.title}</span>
                      {m.note && <span className="mt-0.5 block text-xs text-slate2">{m.note}</span>}
                      <span className="sr-only">(PDF, opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-prose2 text-xs text-slate2">{flightManualCaveat}</p>
      </Section>

      <Section
        title="Operational notices"
        description="How we operate — mutual flying, launch marshalling, radios, field landings and more."
      >
        <ul className="card divide-y divide-skyLine overflow-hidden">
          {ops.map((d) => {
            const external = !d.href.startsWith('/');
            return (
              <li key={d.id}>
                <a
                  href={d.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="block px-5 py-4 hover:bg-skyTint transition-colors"
                >
                  <span className="font-medium text-navy">{d.title}</span>
                  {d.note && <span className="mt-0.5 block max-w-prose2 text-sm text-slate2">{d.note}</span>}
                  {d.owner && <span className="mt-1 block text-xs text-slate2">Owner: {d.owner}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
