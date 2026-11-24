import Link from 'next/link';
import { Band, BandPhoto, BandSection, Figures, ActionTile, icons, outIcon } from '@/components/ui';
import { aim } from '@/content/awareim';
import { documents } from '@/content/documents';
import { manualGroups, flightManualCaveat } from '@/content/manuals';
import { rotaQuarters } from '@/content/roster';
import { currentCfiNotices } from '@/content/notices';
import { waveBoxLoaIssued } from '@/content/airspace';
import { opensNewTab } from '@/lib/files';

export const metadata = { title: 'Flying' };

export default function FlyingPage() {
  const ops = documents.filter((d) => d.category === 'Operational Notices');
  // Rotas, airspace notices and the Blake-Robertshaw task graphics each have a
  // page of their own, so they are not listed a second time here.
  const elsewhere = new Set(['Duty Rotas', 'Airspace Notices', 'Blake-Robertshaw Task Graphics']);
  const notices = ops.filter((d) => !elsewhere.has((d as { series?: string }).series ?? '') && d.tier !== 'archive');
  const quarter = rotaQuarters[0];

  return (
    <>
      <Band
        eyebrow="Getting airborne"
        title={
          <>
            Flying <em>from Camphill</em>
          </>
        }
        lead="Booking, duties, weather, airspace and the operational notices that govern how we fly here."
        aside={
          <BandPhoto
            src="/img/camphill-windsock-approach.jpg"
            alt="A glider flying past the orange windsock at Camphill, with a yellow airfield vehicle and a member watching from the grass below."
            caption="Past the windsock, with the hills beyond."
            width={1280}
            height={960}
            focus="center 35%"
            priority
          />
        }
        figures={
          <Figures
            items={[
              { label: 'Duty rota', value: quarter.code, note: quarter.label, href: '/flying/roster' },
              {
                label: 'CFI’s current notices',
                value: String(currentCfiNotices.length),
                note: currentCfiNotices.map((n) => n.title.split(/[,(]/)[0].trim()).join(' · '),
                href: '/flying/notices',
              },
              {
                label: 'Airspace re-brief',
                value: '12 months',
                note: `Wave Box agreement issued ${waveBoxLoaIssued}`,
                href: '/flying/airspace',
              },
            ]}
          />
        }
      >
        <nav aria-label="Book and check" className="mt-7 flex flex-wrap gap-3">
          <a href={aim('flyingPlanner')} target="_blank" rel="noopener noreferrer" className="pill-accent">
            Daily Flying Planner {outIcon}
            <span className="sr-only">(opens Members’ Admin in a new tab)</span>
          </a>
          <a href={aim('flightsToday')} target="_blank" rel="noopener noreferrer" className="pill-ghost">
            Flights today {outIcon}
            <span className="sr-only">(opens Members’ Admin in a new tab)</span>
          </a>
          <Link href="/flying/roster" className="pill-ghost">Duty roster</Link>
          <Link href="/flying/weather" className="pill-ghost">Weather and webcam</Link>
        </nav>

      </Band>

      <BandSection
        tone="white"
        title={
          <>
            Before you fly <em>cross-country</em>
          </>
        }
        description="Airspace agreements, NOTAMs, and the notices that govern how we operate."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionTile href="/flying/airspace" label="Airspace and NOTAMs" hint="Wave Box, L975, East Midlands, NSGAs" icon={icons.cloud} />
          <ActionTile href="/flying/notices" label="CFI and Launch Marshal notices" hint="How we check, launch and report" icon={icons.book} />
          <ActionTile href={aim('rebrief')} external label="Airspace re-brief" hint="Due every 12 months" icon={icons.calendar} />
        </div>
      </BandSection>

      {/* Ported from the old manuals_webpage.asp, in the club's own three groups. */}
      <BandSection
        id="manuals"
        tone="contour"
        title={
          <>
            Club <em>manuals</em>
          </>
        }
        description="How the club operates, written down. If you only read one, make it the Pilots Manual."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {manualGroups.map((g) => (
            <div key={g.group} className="card flex flex-col overflow-hidden">
              <div className="border-b border-skyLine bg-skyTint px-5 py-3.5">
                <h3 className="text-lg font-semibold text-navy">{g.group}</h3>
                <p className="mt-1 text-sm text-inkMuted">{g.blurb}</p>
              </div>
              <ul className="flex-1 divide-y divide-skyLine">
                {g.manuals.map((m) => (
                  <li key={m.href}>
                    <a href={m.href} target="_blank" rel="noopener noreferrer" className="block px-5 py-3.5 transition-colors hover:bg-sky50">
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
        <p className="mt-4 max-w-prose2 text-xs text-slate2">{flightManualCaveat}</p>
      </BandSection>

      <section className="band-white -mb-8 py-10 lg:-mb-10 lg:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <h2 className="display text-3xl lg:text-[2.6rem]">
              Operational <em>notices</em>
            </h2>
            <p className="mt-2 max-w-prose2 text-inkMuted">
              Mutual flying, launch marshalling, radios, field landings and more. Duty rotas and
              airspace notices are on their own pages above.
            </p>
          </div>
          <Link href="/documents?category=Operational%20Notices" className="pill-line">
            All {ops.length} in Documents
          </Link>
        </div>
        <ul className="grid gap-x-10 border-t-2 border-navy sm:grid-cols-2">
          {notices.map((d) => {
            const external = opensNewTab(d.href);
            return (
              <li key={d.id} className="border-b border-skyLine">
                <a
                  href={d.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="tap w-full justify-between gap-3 py-3 font-medium text-navy hover:text-skyDark"
                >
                  <span className="min-w-0 [overflow-wrap:anywhere]">{d.title}</span>
                  {external && <span className="text-slate2">{outIcon}</span>}
                  {external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
