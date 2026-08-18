import { PageHeader, Section, Callout } from '@/components/ui';
import { weatherGroups, club } from '@/content/site';
import Webcam from '@/components/Webcam';

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
        lead="Curated by members over many years — each entry says what it is actually good for, and where the location sits relative to Camphill."
      />

      {/* Station and camera share one row and one height: what the instruments
          say next to what the field looks like. They stack on a phone. */}
      <div className="mb-8 grid items-stretch gap-4 lg:grid-cols-2">
        <div className="card flex flex-col overflow-hidden">
          <iframe
            src={club.weatherStationEmbed}
            title="Camphill weather station — live observations"
            className="block h-[420px] w-full flex-1 border-0"
            loading="lazy"
          />
          <p className="border-t border-skyLine bg-skyTint px-5 py-3 text-sm text-inkMuted">
            {club.weatherStationNote}
          </p>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-skyLine px-5 py-3">
            <span className="font-medium text-navy">Camphill Weather Station — live</span>
            <a
              href={club.weatherStation}
              target="_blank"
              rel="noopener noreferrer"
              className="link text-sm"
            >
              Open the full station page
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <Webcam fallbackHref={club.webcam} mediaClassName="h-[420px]" />
      </div>

      <div className="mb-8">
        <Callout tone="info" title="A note on the links below">
          <p>
            Every link opens the source site in a new tab. Where registration is needed, or where a
            particular option must be selected to get Camphill data, the instruction is written out
            — you should not have to work it out each time.
          </p>
        </Callout>
      </div>

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
