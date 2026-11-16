import { Callout } from '@/components/ui';
import { roles, vacantRoles, rolesUpdated, committeeSource } from '@/content/roles';

/**
 * WHO DOES WHAT AT CAMPHILL — from job&roles.asp, shown on the Directory page.
 *
 * NAMES ONLY. No telephone numbers, no email addresses (CLAUDE.md rule 6).
 * The point is knowing who to ask, not how to reach them at home.
 *
 * The VACANT rows are the most useful part and are surfaced first: that is how
 * the club advertises that it needs somebody.
 */
export default function RolesList() {
  return (
    <>
      {vacantRoles.length > 0 && (
        <div className="mb-8">
          <Callout tone="warn" title={`${vacantRoles.length} roles are vacant`}>
            <p>
              {vacantRoles.map((r) => r.role).join(' · ')}
            </p>
            <p>
              A club this size runs on people putting their hand up. If one of these is something
              you could do, or could learn, say so to any committee member.
            </p>
          </Callout>
        </div>
      )}

      <div className="card overflow-hidden">
        <ul className="divide-y divide-skyLine">
          {roles.map((r) => {
            const vacant = r.holders.some((h) => /vacant/i.test(h));
            return (
              <li key={r.role} className="grid gap-1 px-5 py-4 sm:grid-cols-[1fr_1fr] sm:gap-6">
                <span>
                  <span className="block font-semibold text-navy">{r.role}</span>
                  {r.remit && <span className="block text-sm text-inkMuted">{r.remit}</span>}
                </span>
                <span className="flex flex-wrap items-start gap-x-3 gap-y-1">
                  {r.holders.length === 0 ? (
                    <span className="text-sm text-inkMuted">—</span>
                  ) : (
                    r.holders.map((h) => (
                      <span
                        key={h}
                        className={
                          vacant && /vacant/i.test(h)
                            ? 'rounded bg-warnTint px-2 py-0.5 text-sm font-semibold text-warn'
                            : 'text-sm'
                        }
                      >
                        {/vacant/i.test(h) ? 'Vacant — could this be you?' : h}
                      </span>
                    ))
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-6 text-sm text-inkMuted">
        Contact details are not published here — they are in Members&rsquo; Admin, or ask the
        office. Committee roles are on{' '}
        <a href={committeeSource} target="_blank" rel="noopener noreferrer" className="link">
          the committee page
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
        {rolesUpdated && ` List last updated ${rolesUpdated}.`} If it is out of date, tell the website editor.
      </p>
    </>
  );
}
