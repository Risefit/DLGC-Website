import Link from 'next/link';
import { PageHeader, Section, Callout, ActionTile, icons } from '@/components/ui';
import { safetyCulture, contacts } from '@/content/site';
import { documents } from '@/content/documents';
import { safetyLessons } from '@/content/safety-log';
import SafetyReportForm from '@/components/SafetyReportForm';

export const metadata = { title: 'Safety' };

export default function SafetyPage() {
  const safetyDocs = documents.filter((d) => d.category === 'Safety' && d.tier !== 'archive');
  const archived = documents.filter((d) => d.category === 'Safety' && d.tier === 'archive');

  return (
    <>
      <PageHeader
        eyebrow="Promoting safety in gliding at Camphill"
        title="Safety"
        lead="Reporting, procedures, and learning from what has gone wrong elsewhere."
      />

      {/* PRESERVED FROM THE OLD SITE — four clear principles, well written.
          Given more prominence here, not less. */}
      <section className="mb-10 overflow-hidden rounded-card bg-gradient-to-br from-navy to-sky p-6 text-white lg:p-8">
        <h2 className="text-2xl text-white">Our safety culture</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {safetyCulture.map((line) => (
            <li key={line} className="flex gap-3">
              <span aria-hidden="true" className="mt-1 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                  <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-white/95">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <Section title="If something happens">
        <div className="grid gap-4 sm:grid-cols-2">
          <ActionTile
            href="/safety/emergency"
            label="Emergency Procedures"
            hint="Accident or other emergency — what to do"
            icon={icons.alert}
          />
          <ActionTile
            href="/safety/lessons"
            label="Safety Lessons Log"
            hint={`${safetyLessons.length} occurrences and what was learned`}
            icon={icons.shield}
          />
        </div>
      </Section>

      {/* The reporting form sits high on the page on purpose. A member who has
          just seen something unsafe should not have to scroll past a document
          library to tell somebody about it. */}
      <section className="mb-10">
        <SafetyReportForm safetyOfficerEmail={contacts.office.email} />
      </section>

      <Section
        title="Safety documents"
        description="Current guidance. Historic accident reviews and analyses are in the Archive."
      >
        <ul className="card divide-y divide-skyLine overflow-hidden">
          {safetyDocs.map((d) => {
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
                </a>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        title="Learning from accidents"
        description="You can learn to be safer by knowing how others have unfortunately come to grief."
        action={<Link href="/archive?q=accident" className="link text-sm">All in the Archive</Link>}
      >
        <ul className="card divide-y divide-skyLine overflow-hidden">
          {archived.map((d) => (
            <li key={d.id}>
              <a href={d.href} target="_blank" rel="noopener noreferrer" className="block px-5 py-4 hover:bg-skyTint transition-colors">
                <span className="font-medium text-navy">{d.title}</span>
                {d.note && <span className="mt-0.5 block text-sm text-slate2">{d.note}</span>}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
