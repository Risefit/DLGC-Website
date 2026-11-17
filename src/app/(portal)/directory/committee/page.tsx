import Link from 'next/link';
import { PageHeader, Section } from '@/components/ui';
import { committee } from '@/content/committee';
import { vacantRoles } from '@/content/roles';

export const metadata = { title: 'The Committee' };

/**
 * The club's committee page, brought across from the old site. Names and
 * roles only — see src/content/committee.ts.
 */
export default function CommitteePage() {
  return (
    <>
      <PageHeader
        back={{ href: '/directory', label: 'Directory' }}
        eyebrow={`Committee membership ${committee.term}`}
        title={
          <>
            The <em>committee</em>
          </>
        }
        lead={committee.standing}
      />

      <Section
        title="Members and their roles"
        description={`With effect from ${committee.effective}, the Committee Members and their roles for ${committee.term} are as follows.`}
      >
        <div className="card overflow-hidden">
          <ul className="divide-y divide-skyLine">
            {committee.members.map((m) => (
              <li key={m.name} className="grid gap-1 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6">
                <span className="font-semibold text-navy">{m.name}</span>
                <span className="text-inkMuted">{m.role || 'Committee member'}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-sm text-inkMuted">{committee.footnote}</p>
      </Section>

      <Section
        title={
          <>
            Getting <em>in touch</em>
          </>
        }
        description="One address reaches the whole committee."
      >
        <div className="flex flex-wrap items-center gap-3">
          <a href={`mailto:${committee.email}`} className="pill-solid">
            Email the committee
          </a>
          <span className="text-inkMuted">{committee.email}</span>
        </div>
        <ul className="mt-6 space-y-2 text-inkMuted">
          <li>
            <Link href="/archive/committee-meeting-minutes" className="link">Committee meeting minutes</Link>
          </li>
          <li>
            <Link href="/directory#roles" className="link">
              Roles and role holders{vacantRoles.length > 0 ? ` — ${vacantRoles.length} are vacant` : ''}
            </Link>
          </li>
          <li>
            <Link href="/calendar" className="link">Dates of committee meetings</Link>
          </li>
        </ul>
      </Section>
    </>
  );
}
