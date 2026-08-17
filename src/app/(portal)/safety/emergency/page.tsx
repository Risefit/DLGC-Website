import { PageHeader, Callout } from '@/components/ui';
import { contacts } from '@/content/site';
import { procedures, hospitals, emergencyContacts, RED_BOX } from '@/content/emergency';

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

      {/* Which situation? */}
      <nav aria-label="Choose the situation" className="mb-10">
        <h2 className="mb-3 text-2xl">Which situation?</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {procedures.map((p) => (
            <li key={p.slug}>
              <a
                href={`#${p.slug}`}
                className="card flex h-full items-center gap-3 p-5 hover:border-sky hover:shadow-lift transition-all"
              >
                <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-badTint text-bad">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l9.5 17H2.5L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 9v5M12 17.2v.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="font-semibold text-navy">{p.when}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {procedures.map((p) => (
        <section key={p.slug} id={p.slug} className="mb-10 scroll-mt-24">
          <h2 className="mb-1 text-2xl">{p.title}</h2>
          <p className="mb-4 text-sm text-slate2">
            {p.revised && `Revised ${p.revised}. `}
            <a href={p.source} target="_blank" rel="noopener noreferrer" className="link">
              Original procedure on the old site
            </a>
          </p>

          {p.intro && <p className="prose-club mb-4">{p.intro}</p>}

          <ol className="card divide-y divide-skyLine overflow-hidden">
            {p.steps.map((s, i) => (
              <li key={i} className={`flex gap-4 px-5 py-4 ${s.emphasis ? 'bg-badTint' : ''}`}>
                <span
                  aria-hidden="true"
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                    s.emphasis ? 'bg-bad text-white' : 'bg-skyTint text-navy'
                  }`}
                >
                  {i + 1}
                </span>
                <span>
                  <span className={`block ${s.emphasis ? 'font-semibold text-bad' : 'text-ink'}`}>
                    {s.text}
                  </span>
                  {s.detail && <span className="mt-0.5 block text-sm text-slate2">{s.detail}</span>}
                </span>
              </li>
            ))}
          </ol>

          {p.after && (
            <div className="mt-4 space-y-3">
              {p.after.map((a, i) => (
                <p key={i} className="rounded-card border-l-4 border-warn bg-warnTint px-5 py-3 text-sm">
                  {a}
                </p>
              ))}
            </div>
          )}
        </section>
      ))}

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
