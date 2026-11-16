import { PageHeader, Section, Callout, Badge } from '@/components/ui';
import { calendar, calendarNote, eventDate, startOfToday } from '@/content/site';
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

/** Re-rendered hourly, so a date moves to "earlier" by itself once it has passed. */
export const revalidate = 3600;

export default function CalendarPage() {
  const today = startOfToday();
  const isPast = (month: string, when: string) => {
    const d = eventDate({ month, when });
    return d !== null && d < today;
  };
  const months = (past: boolean) =>
    calendar
      .map((m) => ({ ...m, events: m.events.filter((e) => isPast(m.month, e.when) === past) }))
      .filter((m) => m.events.length > 0);
  const coming = months(false);
  const earlier = months(true);

  const list = (ms: typeof calendar, muted = false) => (
    <div className="space-y-6">
      {ms.map((m) => (
        <section key={m.month}>
          <h3 className={`mb-3 text-xl ${muted ? 'text-inkMuted' : ''}`}>{m.month}</h3>
          <ul className="card divide-y divide-skyLine overflow-hidden">
            {m.events.map((e) => (
              <li key={`${m.month}-${e.what}`} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-4">
                <span className={`w-full shrink-0 font-semibold sm:w-40 ${muted ? 'text-inkMuted' : 'text-navy'}`}>{e.when}</span>
                <span className="flex-1 text-inkMuted">{e.what}</span>
                {e.kind && <Badge tone={kindTone[e.kind]}>{kindLabel[e.kind]}</Badge>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );

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

      <Section title="Coming up">
        {coming.length > 0 ? list(coming) : <p className="text-inkMuted">Nothing in the calendar yet.</p>}
      </Section>

      {earlier.length > 0 && (
        <Section title="Earlier this season" description="Dates that have passed, kept for reference.">
          {list(earlier, true)}
        </Section>
      )}

      <p className="mt-8 text-sm text-inkMuted">
        Arranging an event and need the clubroom or other facilities? Contact the office or a
        committee member to check availability and book — putting it in the calendar is not a
        booking.
      </p>
    </>
  );
}
