import Link from 'next/link';
import { Band, Figures, Section } from '@/components/ui';
import { safetyCulture, contacts } from '@/content/site';
import { documents } from '@/content/documents';
import { safetyLessons } from '@/content/safety-log';
import { safetyGroups, accidentReviews, ssaExtracts, gasco, safetyPageSource } from '@/content/safety-links';
import SafetyReportForm from '@/components/SafetyReportForm';

export const metadata = { title: 'Safety' };

export default function SafetyPage() {
  // EACH FILE ONCE. Anything already linked from a group higher up this page is
  // left out of "More safety reading", and the historic material is a button
  // into the library rather than a second list. Nine files used to appear twice.
  const linkedAbove = new Set<string>([
    ...safetyGroups.flatMap((g) => g.items.map((i) => i.href)),
    ...accidentReviews.map((r) => r.href),
    ssaExtracts.href,
    gasco.href,
    '/safety/emergency',
  ]);
  const safety = documents.filter((d) => d.category === 'Safety');
  const more = safety.filter((d) => d.tier !== 'archive' && !linkedAbove.has(d.href));
  const historic = safety.filter((d) => d.tier === 'archive').length;

  return (
    <>
      <Band
        eyebrow="Promoting safety in gliding at Camphill"
        title={
          <>
            Safety <em>is everybody’s job</em>
          </>
        }
        lead="Reporting, procedures, and learning from what has gone wrong elsewhere."
        figures={
          <Figures
            items={[
              {
                label: 'Safety Lessons Log',
                value: String(safetyLessons.length),
                note: 'Occurrences, and what was learned',
                href: '/safety/lessons',
              },
              {
                label: 'Report a concern',
                value: 'Any time',
                note: 'Named or anonymous — your choice',
                href: '#report',
              },
              {
                label: 'Safety Officer',
                value: contacts.safetyOfficer.name,
                note: 'Who reads every report',
                href: '/directory#roles',
              },
            ]}
          />
        }
      >
        {/* PRESERVED FROM THE OLD SITE — four clear principles, word for word.
            Given more prominence here, not less. */}
        <h2 className="sr-only">Our safety culture</h2>
        <ul className="mt-7 grid max-w-4xl gap-x-8 gap-y-3 sm:grid-cols-2">
          {safetyCulture.map((line) => (
            <li key={line} className="flex gap-3">
              <span aria-hidden="true" className="mt-1 shrink-0 text-windsock">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                  <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-white">{line}</span>
            </li>
          ))}
        </ul>

        <nav aria-label="If something happens" className="mt-7 flex flex-wrap gap-3">
          <Link href="/safety/emergency" className="pill-accent">Emergency Procedures</Link>
          <a href="#report" className="pill-ghost">Report a safety concern</a>
          <Link href="/safety/lessons" className="pill-ghost">Safety Lessons Log</Link>
        </nav>
      </Band>

      {/* The reporting form sits high on the page on purpose. A member who has
          just seen something unsafe should not have to scroll past a document
          library to tell somebody about it. */}
      <section id="report" className="sec">
        <SafetyReportForm
          safetyOfficerEmail={contacts.safetyOfficer.email}
          safetyOfficerName={contacts.safetyOfficer.name}
        />
      </section>

      {/* Everything else from the old safety_page.asp, grouped by what a member
          is trying to do rather than left as one column of "this link". */}
      {safetyGroups.map((g) => (
        <Section key={g.group} title={g.group} description={g.blurb}>
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {g.items.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-5 py-4 transition-colors hover:bg-sky50"
                >
                  <span className="font-medium text-navy">{r.title}</span>
                  {r.note && <span className="mt-1 block max-w-prose2 text-sm text-inkMuted">{r.note}</span>}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <Section
        title={
          <>
            Learning <em>from accidents</em>
          </>
        }
        description="You can learn to be safer by knowing how others have unfortunately come to grief. BGA annual accident reviews, newest first."
        action={
          <Link href="/documents?category=Safety&tier=archive" className="pill-line">
            All {historic} historic safety documents
          </Link>
        }
      >
        <ul className="flex flex-wrap gap-2">
          {accidentReviews.map((r) => (
            <li key={r.year}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="tap rounded-lg border-2 border-skyLine bg-white px-4 py-2.5 font-semibold text-navy transition-colors hover:border-sky"
              >
                {r.year}
                <span className="sr-only"> accident review (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[ssaExtracts, gasco].map((x) => (
            <a
              key={x.href}
              href={x.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-interactive flex flex-col p-5"
            >
              <span className="font-semibold text-navy">{x.title}</span>
              <span className="mt-1 text-sm text-inkMuted">{x.note}</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      </Section>

      <Section
        title={
          <>
            More <em>safety reading</em>
          </>
        }
        description="Current guidance that is not already linked above."
      >
        <ul className="card divide-y divide-skyLine overflow-hidden">
          {more.map((d) => {
            const external = !d.href.startsWith('/');
            return (
              <li key={d.id}>
                <a
                  href={d.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="block px-5 py-4 transition-colors hover:bg-sky50"
                >
                  <span className="font-medium text-navy">{d.title}</span>
                  {d.note && <span className="mt-0.5 block max-w-prose2 text-sm text-inkMuted">{d.note}</span>}
                  {external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-sm text-inkMuted">
          Checked against the club&rsquo;s own safety page —{' '}
          <a href={safetyPageSource} target="_blank" rel="noopener noreferrer" className="link">
            the original is still there
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </Section>
    </>
  );
}
