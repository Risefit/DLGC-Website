import { PageHeader, Section, Callout, ActionTile, icons } from '@/components/ui';
import ClubNumbers from '@/components/ClubNumbers';
import { contacts, roles } from '@/content/site';
import { aim } from '@/content/awareim';

export const metadata = { title: 'Directory' };

/**
 * DATA PROTECTION NOTE
 * Member personal contact details are NOT held in this portal or in this
 * repository. The member directory lives in Members' Admin, which is
 * authenticated and administered separately. This page holds club numbers
 * (already public) and role names only.
 *
 * If a member directory is ever added here, it must be opt-in per field
 * (phone / email / address) and editable by the member.
 */
export default function DirectoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Who to ask"
        title="Directory"
        lead="Club phone numbers, who holds which role, and where to find member contact details."
      />

      <Section
        title="Club numbers"
        description="Call, or open a WhatsApp message. See the note below about WhatsApp."
      >
        <ClubNumbers />
        <p className="mt-3 max-w-prose2 text-xs text-slate2">
          All three are landlines. The WhatsApp button opens a chat only once the club has
          registered that number with WhatsApp Business — until then it will say the number is not
          on WhatsApp. Calling always works.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="card p-5">
            <h3 className="text-lg">Office hours</h3>
            <p className="mt-2 text-sm text-inkMuted">{contacts.officeHours}</p>
            <p className="mt-3">
              <a href={`mailto:${contacts.office.email}`} className="link">{contacts.office.email}</a>
            </p>
          </div>
          <div className="card p-5">
            <h3 className="text-lg">Camphill Catering</h3>
            <ul className="mt-2 space-y-2">
              {contacts.catering.map((c) => (
                <li key={c.name} className="flex items-baseline justify-between gap-3">
                  <span className="text-inkMuted">{c.name}</span>
                  <a href={`tel:${c.tel.replace(/\s/g, '')}`} className="link font-medium">{c.tel}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        title="Member contact details"
        description="Held in Members' Admin, not here."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ActionTile
            href={aim('directory')}
            external
            label="Member Directory"
            hint="Phone numbers and email addresses"
            icon={icons.people}
          />
          <Callout tone="info" title="Why it isn't on this site">
            <p>
              Members&rsquo; personal contact details stay in Members&rsquo; Admin, which is
              authenticated and administered separately. Keeping them out of this portal means
              there is one place to control who sees what, and one place to remove someone from
              when they leave.
            </p>
          </Callout>
        </div>
      </Section>

      <Section title="Roles" description="Who holds which club role. Contact details are in the Member Directory.">
        <ul className="card divide-y divide-skyLine overflow-hidden">
          {roles.map((r) => (
            <li key={r.role} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4">
              <span className="font-medium text-navy">{r.role}</span>
              <span className="text-inkMuted">{r.holder}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate2">
          Role holders change. This list needs an owner and a review date like everything else —
          see the note in the handover document.
        </p>
      </Section>
    </>
  );
}
