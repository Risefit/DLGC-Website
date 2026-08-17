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

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="card overflow-hidden lg:col-span-2">
          <iframe
            src={club.weatherStationEmbed}
            title="Camphill weather station — live observations"
            className="block h-[420px] w-full border-0"
            loading="lazy"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-skyLine px-5 py-3">
            <span className="font-medium text-navy">Camphill Weather Station — live</span>
            <a
              href={club.weatherStation}
              target="_blank"
              rel="noopener noreferrer"
              className="link text-sm"
            >
              Open the full station page
            </a>
          </div>
        </div>

<Webcam fallbackHref={club.webcam} />
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
        <Section key={g.group} title={g.group}>
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {g.links.map((l) => (
              <li key={`${g.group}-${l.name}`}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-5 py-4 hover:bg-skyTint transition-colors"
                >
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-medium text-navy">{l.name}</span>
                    <span className="text-xs text-slate2">{l.source}</span>
                  </span>
                  <span className="mt-1 block max-w-prose2 text-sm text-slate2">{l.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
