import Link from 'next/link';
import { PageHeader, Callout } from '@/components/ui';
import { roles, vacantRoles, rolesUpdated, rolesSource, committeeSource } from '@/content/roles';

export const metadata = { title: 'Roles and Role Holders' };

/**
 * PORTED FROM job&roles.asp — who does what at Camphill.
 *
 * NAMES ONLY. No telephone numbers, no email addresses (CLAUDE.md rule 6).
 * The point of this page is knowing who to ask, not how to reach them at home.
 *
 * The VACANT rows are the most useful part of the page and are surfaced first:
 * that is how the club advertises that it needs somebody.
 */
export default function RolesPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/club-life" className="link">Club Life</Link>
        <span className="mx-2 text-slate2" aria-hidden="true">/</span>
        <span className="text-slate2">Roles and Role Holders</span>
      </nav>

      <PageHeader
        eyebrow="Who to ask"
        title="Roles and Role Holders"
        lead="The jobs that keep Camphill running, and the members who volunteer to do them. Committee roles are listed separately."
      />

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
                  {r.remit && <span className="block text-sm text-slate2">{r.remit}</span>}
                </span>
                <span className="flex flex-wrap items-start gap-x-3 gap-y-1">
                  {r.holders.length === 0 ? (
                    <span className="text-sm text-slate2">—</span>
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

      <p className="mt-8 border-t border-skyLine pt-6 text-sm text-slate2">
        Contact details are not published here — they are in Members&rsquo; Admin, or ask the
        office. Committee roles are on{' '}
        <a href={committeeSource} target="_blank" rel="noopener noreferrer" className="link">
          the committee page
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
        {rolesUpdated && ` List last updated ${rolesUpdated} on the old site — `}
        <a href={rolesSource} target="_blank" rel="noopener noreferrer" className="link">
          the original is still there
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        . If it is out of date, tell the website editor.
      </p>
    </>
  );
}
