import { PageHeader, Section, Callout, ToMigrate, ActionTile, icons } from '@/components/ui';
import { aim } from '@/content/awareim';
import { documents } from '@/content/documents';

export const metadata = { title: 'Duty Roster' };

export default function RosterPage() {
  const rota = documents.filter((d) => d.id.startsWith('rota-') || d.id === 'op-launchmarshals');

  return (
    <>
      <PageHeader
        eyebrow="Who is on when"
        title="Duty Roster"
        lead="Instructor rotas, launch marshals and the duties you have volunteered for."
      />

      <Section title="Your duties">
        <div className="grid gap-4 sm:grid-cols-2">
          <ActionTile
            href={aim('duties')}
            external
            label="Duties and Volunteers"
            hint="What you have signed up for, and sign up for more"
            icon={icons.people}
          />
          <ActionTile
            href={aim('flyingPlanner')}
            external
            label="Daily Flying Planner"
            hint="Put your name down for a flying day"
            icon={icons.plane}
          />
        </div>
        <p className="mt-3 text-xs text-slate2">
          Duties are held in Members&rsquo; Admin, which has its own login.
        </p>
      </Section>

      <Section title="Published rotas">
        <ul className="card divide-y divide-skyLine overflow-hidden">
          {rota.map((d) => (
            <li key={d.id}>
              <a href={d.href} target="_blank" rel="noopener noreferrer" className="block px-5 py-4 hover:bg-skyTint transition-colors">
                <span className="font-medium text-navy">{d.title}</span>
                {d.version && <span className="ml-2 text-sm text-slate2">{d.version}</span>}
                {d.note && <span className="mt-0.5 block text-sm text-slate2">{d.note}</span>}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Callout tone="warn" title="Rotas are still PDFs">
            <p>
              On the old site every rota was a quarterly PDF — hard to read on a phone and easy to
              be looking at an out-of-date copy. Converting these into a proper roster view is a
              priority once the import is done; the PDFs remain available in the meantime.
            </p>
          </Callout>
        </div>
      </Section>

      <Section title="Still to import">
        <ToMigrate what="Duty rotas and SPL briefings for all quarters, the Summer Weeks calendar, winter winch driver lists, and the members' phone and email lists from the old Duty Rotas page." />
      </Section>
    </>
  );
}
