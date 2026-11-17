import { PageHeader, Section } from '@/components/ui';
import { weatherGroups, club } from '@/content/site';
import Webcam from '@/components/Webcam';
import WindPanel from '@/components/WindPanel';

export const metadata = { title: 'Weather' };

/**
 * PRESERVED FROM THE OLD SITE.
 * Someone thought hard about which forecast serves which purpose and wrote
 * genuinely useful notes on each one. The curation was good; only the
 * presentation was the problem. Keep every annotation.
 */
export default function WeatherPage() {
  return (
    <>
      <PageHeader
        eyebrow="Forecasts and observations"
        title="Weather"
        lead="The station, the camera and the wind at Camphill, then the forecasts — curated by members over many years, each with a note on what it is good for."
      />

      {/* Everything the station tells us, on this page: what the instruments
          say, what the field looks like, and what the wind has been doing. */}
      <Section
        id="now"
        title={
          <>
            Camphill <em>right now</em>
          </>
        }
        description="From the DSC/DLGC weather station on West Edge, and the camera looking north across the front of the hangar."
      >
        <div className="grid items-stretch gap-4 lg:grid-cols-2">
          <div className="card flex flex-col overflow-hidden">
            <iframe
              src={club.weatherStationEmbed}
              title="Camphill weather station — current conditions"
              className="block h-[480px] w-full shrink-0 border-0"
              loading="lazy"
            />
            <p className="border-t border-skyLine px-5 py-3 text-sm font-medium text-navy">
              Camphill weather station — current conditions
            </p>
          </div>

          <Webcam fallbackHref={club.webcam} mediaClassName="h-[480px]" />
        </div>
      </Section>

      <Section
        id="wind"
        title={
          <>
            Wind, <em>live and over the last 24 hours</em>
          </>
        }
        description="Average wind and gusts in knots, where the wind is coming from, and today’s readings: temperature, estimated cloud base, rain, pressure and humidity."
      >
        <WindPanel />
      </Section>

      {weatherGroups.map((g) => (
        <Section key={g.group} title={g.group} description={g.blurb}>
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {g.links.map((l) => (
              <li key={`${g.group}-${l.name}`}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-5 py-4 transition-colors hover:bg-sky50"
                >
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-medium text-navy">{l.name}</span>
                    <span className="text-xs text-slate2">{l.source}</span>
                    {l.login && (
                      <span className="rounded bg-warnTint px-2 py-0.5 text-xs font-medium text-warn">
                        Needs a login
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block max-w-prose2 text-sm text-inkMuted">{l.note}</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
