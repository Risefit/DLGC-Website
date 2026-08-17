import { PageHeader, Section, ActionTile, icons, Callout, ToMigrate } from '@/components/ui';
import { aim } from '@/content/awareim';
import { documents } from '@/content/documents';

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

      <Section title="Airspace and NOTAMs" description="Check before every cross-country flight.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Callout tone="info" title="Wave Box and Letter of Agreement">
            <p>
              The club&rsquo;s airspace arrangements, including the Wave Box and the Letter of
              Agreement, are held in the document library. Your annual airspace re-brief is recorded
              in Members&rsquo; Admin.
            </p>
            <p>
              <a href={aim('rebrief')} target="_blank" rel="noopener noreferrer" className="link">
                Record your airspace re-brief
              </a>{' '}
              (opens Members&rsquo; Admin in a new tab)
            </p>
          </Callout>
          <ToMigrate what="Airspace pages, NOTAM links, Wave Box chart and the Letter of Agreement from the old site's Airspace section." />
        </div>
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
