import { PageHeader, Callout } from '@/components/ui';
import { contacts } from '@/content/site';
import { procedures, hospitals, emergencyContacts, RED_BOX } from '@/content/emergency';
import ProcedureAccordion from '@/components/ProcedureAccordion';

export const metadata = { title: 'Emergency Procedures' };

const tel = (s: string) => s.replace(/\s/g, '');

/**
 * Reachable from every page footer in one tap. Never put this behind a menu.
 *
 * Content transcribed from the old site's MainGd.asp and its four linked
 * procedure pages. See src/content/emergency.ts — including the note about
 * hospital numbers that need verifying.
 */
export default function EmergencyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Know this before you need it"
        title="Emergency Procedures"
        lead="Find the situation below and follow that procedure. If in doubt, dial 999 first and open the RED box second."
      />

      {/* Dial 999 — always visible, always first */}
      <div className="mb-8 grid gap-4 lg:grid-cols-[2fr_3fr]">
        <div className="rounded-card border-l-4 border-bad bg-badTint p-6">
          <h2 className="text-lg text-bad">Emergency services</h2>
          <a href="tel:999" className="tap mt-1 text-5xl font-bold text-bad">999</a>
          <p className="mt-2 text-sm">
            Or 112. <strong>Ask for Fire and Rescue first</strong> — they are nearest and carry
            paramedics. Then ask for the Ambulance Service.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg">Say where you are</h2>
          <address className="mt-2 not-italic">
            <span className="block text-xl font-semibold text-navy">
              The Gliding Club, Great Hucklow
            </span>
            <span className="block text-slate2">
              Near Tideswell, near Buxton, <strong>SK17 8RQ</strong>
            </span>
          </address>
          <p className="mt-3 text-sm text-slate2">
            Club location: 2 miles north-east of the junction of the B6049 with the A623.
            Nearest classified road: B6049.
          </p>
        </div>
      </div>

      <div className="mb-10">
        <Callout tone="bad" title="Verify before relying on this page">
          <p>
            These procedures are transcribed from the club&rsquo;s own pages — the Serious Accident
            instructions (revised January 2025), remote crash, glider missing and personal injury
            procedures. <strong>The Safety Officer must confirm every word and every telephone
            number before this page is treated as the club&rsquo;s published procedure.</strong>{' '}
            Some hospital numbers in the source have irregular digit counts and are reproduced
            exactly as published rather than corrected by guesswork; they are marked below.
          </p>
        </Callout>
      </div>

      <section aria-labelledby="situations-h" className="mb-10">
        <h2 id="situations-h" className="mb-1 text-2xl">Which situation?</h2>
        <p className="mb-4 text-sm text-slate2">
          Open one procedure at a time, so it is always clear where it starts and ends.
        </p>
        <ProcedureAccordion procedures={procedures} />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-2xl">Hospitals</h2>
        <p className="mb-4 max-w-prose2 text-sm text-slate2">{hospitals.note}</p>
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { head: 'Accident & Emergency', list: hospitals.ae },
            { head: 'Minor Injuries Units', list: hospitals.minor },
          ].map(({ head, list }) => (
            <div key={head}>
              <h3 className="mb-2 text-lg">{head}</h3>
              <ul className="card divide-y divide-skyLine overflow-hidden">
                {list.map((h) => (
                  <li key={h.name} className="px-5 py-3.5">
                    <span className="block font-medium text-navy">{h.name}</span>
                    <span className="block text-sm text-slate2">{h.where}</span>
                    <a href={`tel:${tel(h.tel)}`} className="link mt-1 inline-block font-medium">
                      {h.tel}
                    </a>
                    {h.verify && (
                      <span className="ml-2 text-xs font-medium text-warn">
                        — number needs checking
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-2xl">Other numbers</h2>
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {emergencyContacts.map((c) => (
              <li key={c.label} className="px-5 py-3.5">
                <span className="block text-sm text-slate2">{c.label}</span>
                <a href={`tel:${tel(c.tel)}`} className="link text-xl font-semibold">{c.tel}</a>
                <span className="mt-0.5 block text-xs text-slate2">{c.note}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-2xl">Club numbers</h2>
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {[
              ['Launch Point', contacts.launchPoint],
              ['Clubhouse', contacts.clubhouse],
              ['Office', contacts.office.tel],
            ].map(([label, num]) => (
              <li key={label} className="px-5 py-3.5">
                <span className="block text-sm text-slate2">{label}</span>
                <a href={`tel:${tel(num)}`} className="link text-xl font-semibold">{num}</a>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-card border-l-4 border-bad bg-badTint p-5">
            <p className="text-sm font-semibold text-bad">The RED box</p>
            <p className="mt-1 text-sm">{RED_BOX}</p>
          </div>
        </div>
      </section>
    </>
  );
}
