import { PageHeader, Callout } from '@/components/ui';
import { contacts } from '@/content/site';

export const metadata = { title: 'Emergency Procedures' };

/**
 * Reachable from every page footer in one tap. Never put this behind a menu.
 * Content below is scaffolding from the old site's structure — the club's
 * actual published emergency procedure must be checked and confirmed by the
 * Safety Officer before this goes live.
 */
export default function EmergencyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Know this before you need it"
        title="Emergency Procedures"
        lead="What to do when there has been an accident or another emergency at Camphill."
      />

      <div className="mb-8">
        <Callout tone="bad" title="Verify before launch">
          <p>
            The steps below are laid out from the old site&rsquo;s structure so the page exists and
            is reachable. <strong>The Safety Officer must confirm the exact wording against the
            club&rsquo;s published emergency procedure before this portal goes live.</strong> Do not
            treat this page as authoritative until that has happened.
          </p>
        </Callout>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="card p-6">
            <h2 className="text-2xl">Immediate actions</h2>
            <ol className="mt-4 space-y-4">
              {[
                ['Make the scene safe.', 'Stop launching. Stop vehicle movements. Do not put yourself or others at risk reaching a casualty.'],
                ['Call for help.', 'Dial 999. Ask for Ambulance, and Fire if there is any fire risk or entrapment.'],
                ['Give the location clearly.', 'Camphill Airfield, Great Hucklow, Buxton, SK17 8RQ. Say it is a gliding site with vehicle access from the Great Hucklow road.'],
                ['Send someone to meet the ambulance.', 'The site is not easy to find. Post someone at the entrance.'],
                ['Tell the Duty Instructor and the office.', 'They will start the club notification chain and contact the CFI and Safety Officer.'],
                ['Do not move the aircraft.', 'Unless it is necessary to reach or protect a casualty, leave everything as it is for the investigation.'],
                ['Say nothing to the media.', 'Refer all enquiries to the Chairman or the BGA.'],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bad font-semibold text-white"
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-semibold text-navy">{title}</span>
                    <span className="block text-sm text-slate2">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="card p-6">
            <h2 className="text-2xl">Distress and Diversion — 121.5 MHz</h2>
            <p className="prose-club mt-3 text-sm">
              The D&amp;D emergency radio service can locate you if you are lost, including above
              cloud. Practice calls to the service are permitted and encouraged — the handout in the
              document library explains how. Knowing the procedure before you need it is the whole
              point.
            </p>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-card border-l-4 border-bad bg-badTint p-5">
            <h2 className="text-lg text-bad">Emergency services</h2>
            <a href="tel:999" className="tap mt-2 text-3xl font-bold text-bad">999</a>
            <p className="mt-1 text-sm">Ambulance · Fire · Police</p>
          </div>

          <div className="card p-5">
            <h2 className="text-lg">Club numbers</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <span className="block text-slate2">Launch Point</span>
                <a href={`tel:${contacts.launchPoint.replace(/\s/g, '')}`} className="link text-lg font-medium">
                  {contacts.launchPoint}
                </a>
              </li>
              <li>
                <span className="block text-slate2">Clubhouse</span>
                <a href={`tel:${contacts.clubhouse.replace(/\s/g, '')}`} className="link text-lg font-medium">
                  {contacts.clubhouse}
                </a>
              </li>
              <li>
                <span className="block text-slate2">Office</span>
                <a href={`tel:${contacts.office.tel.replace(/\s/g, '')}`} className="link text-lg font-medium">
                  {contacts.office.tel}
                </a>
              </li>
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="text-lg">Site address</h2>
            <address className="mt-2 not-italic text-sm text-slate2">
              {contacts.postal.map((l) => <span key={l} className="block">{l}</span>)}
            </address>
            <p className="mt-2 text-xs text-slate2">Read this out slowly to the operator.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
