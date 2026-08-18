import { PageHeader, Callout } from '@/components/ui';
import { awareimLinks } from '@/content/awareim';

export const metadata = { title: "Members' Admin" };

/**
 * This page is a signpost, not an integration.
 * AwareIM is a separate authenticated system with its own database, holding
 * personnel and financial records. It is administered by Mo Bent. This portal
 * links to it and does nothing else. Do not attempt to read from, write to, or
 * share a session with AwareIM.
 */
export default function AccountPage() {
  return (
    <>
      <PageHeader
        eyebrow="A separate system"
        title="Members&rsquo; Admin"
        lead="Your flying account, log book, duties, membership renewal and the Daily Flying Planner all live in Members' Admin — a separate system with its own login."
      />

      <div className="mb-8">
        <Callout tone="info" title="Why this is separate">
          <p>
            Members&rsquo; Admin holds membership, personal and financial records in its own secure
            database, administered by Mo Bent. It is deliberately kept apart from this portal: this
            site holds club information and documents, and never touches your personal or financial
            data.
          </p>
          <p>
            You will need to sign in to Members&rsquo; Admin separately — signing in here does not
            sign you in there. Every link below opens it in a new tab.
          </p>
        </Callout>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {awareimLinks.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex min-h-[88px] items-center gap-4 p-5 hover:shadow-lift hover:border-sky transition-all"
            >
              <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-skyTint text-sky">
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                  <path d="M6 2h8v8M14 2L6.5 9.5M11 12v2H2V5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span>
                <span className="block text-lg font-semibold text-navy">{l.label}</span>
                <span className="block text-sm text-inkMuted">{l.hint}</span>
                <span className="sr-only">(opens in a new tab)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-inkMuted">
        Problems signing in to Members&rsquo; Admin, or something wrong with your account? Contact
        Mo Bent — this portal&rsquo;s editors cannot see or change anything in that system.
      </p>
    </>
  );
}
