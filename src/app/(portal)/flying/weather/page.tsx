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
        <a
          href={club.weatherStation}
          target="_blank"
          rel="noopener noreferrer"
          className="card flex items-center gap-4 p-6 hover:shadow-lift hover:border-sky transition-all"
        >
          <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-skyTint text-sky">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M6 17a4 4 0 010-8 5.5 5.5 0 0110.6-1.3A3.8 3.8 0 0119 17H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            <span className="block text-xl font-semibold text-navy">Camphill Weather Station</span>
            <span className="block text-sm text-slate2">
              Current observations plus wind average speeds for the past 24 hours
            </span>
          </span>
        </a>

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
