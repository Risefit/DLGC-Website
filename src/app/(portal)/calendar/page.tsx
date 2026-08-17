import { PageHeader, Callout, Badge } from '@/components/ui';
import { calendar, calendarNote } from '@/content/site';
import { aim } from '@/content/awareim';

export const metadata = { title: 'Calendar' };

const kindTone = {
  course: 'live',
  committee: 'reference',
  social: 'neutral',
  season: 'warn',
} as const;

const kindLabel = {
  course: 'Course',
  committee: 'Committee',
  social: 'Social',
  season: 'Season',
} as const;

export default function CalendarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dates for 2026 / 2027"
        title="Calendar"
        lead="Courses, committee meetings, camps and the season's key dates."
      />

      {/* The old site's disclaimer was buried in small print. It matters, so it
          goes at the top — but the fix is to eventually have one source. */}
      <div className="mb-8">
        <Callout tone="warn" title="This is a summary, not the master">
          <p>{calendarNote}</p>
          <p>
            <a href={aim('events')} target="_blank" rel="noopener noreferrer" className="link">
              Open the Events Planner in Members&rsquo; Admin
            </a>{' '}
            (new tab)
          </p>
        </Callout>
      </div>

      <div className="space-y-6">
        {calendar.map((m) => (
          <section key={m.month}>
            <h2 className="mb-3 text-2xl">{m.month}</h2>
            <ul className="card divide-y divide-skyLine overflow-hidden">
              {m.events.map((e) => (
                <li key={`${m.month}-${e.what}`} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-4">
                  <span className="w-full shrink-0 font-semibold text-navy sm:w-40">{e.when}</span>
                  <span className="flex-1 text-slate2">{e.what}</span>
                  {e.kind && <Badge tone={kindTone[e.kind]}>{kindLabel[e.kind]}</Badge>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate2">
        Arranging an event and need the clubroom or other facilities? Contact the office or a
        committee member to check availability and book — putting it in the calendar is not a
        booking.
      </p>
    </>
  );
}
