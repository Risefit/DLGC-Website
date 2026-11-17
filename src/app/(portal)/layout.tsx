import Link from 'next/link';
import Nav from '@/components/Nav';
import ClubNumbers from '@/components/ClubNumbers';
import { contacts, club } from '@/content/site';
import SocialButtons from '@/components/SocialButtons';
import MembersAdminTab from '@/components/MembersAdminTab';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Nav />
      <MembersAdminTab />


      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:py-10">
        {children}
      </main>

      <footer className="mt-auto no-print">
        {/* Emergency Procedures reachable from every page, one tap (CLAUDE.md
            rule 5). A band of its own, so it never reads as part of the
            small print underneath. */}
        <div className="border-y border-bad/25 bg-badTint">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4">
            <p className="text-sm text-ink">An accident, or any other emergency on the airfield?</p>
            <Link
              href="/safety/emergency"
              className="tap gap-3 rounded-full bg-bad px-5 py-2.5 font-semibold text-white transition-colors hover:bg-ink"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3l9.5 17H2.5L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M12 9v5M12 17.2v.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              Emergency Procedures
            </Link>
          </div>
        </div>

        <div className="ground-contour">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:py-12">
            <div className="grid gap-x-8 gap-y-9 text-sm sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1fr]">
              <div>
                <h2 className="display mb-3 text-xl">Contact the club</h2>
                <ClubNumbers compact />
                <p className="mt-2">
                  <a href={`mailto:${contacts.office.email}`} className="link">
                    {contacts.office.email}
                  </a>
                </p>
                <p className="mt-4 text-inkMuted">
                  {contacts.postal.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </p>
              </div>

              <div>
                <h2 className="display mb-3 text-xl">Club life</h2>
                <ul className="space-y-1.5">
                  <li><Link href="/gallery" className="link">Gallery</Link></li>
                  <li><Link href="/directory" className="link">Directory and roles</Link></li>
                  <li><Link href="/archive" className="link">Archive</Link></li>
                  <li><Link href="/buy-and-sell" className="link">Buy and Sell</Link></li>
                  <li><Link href="/calendar" className="link">Calendar</Link></li>
                </ul>
              </div>

              <div>
                <h2 className="display mb-3 text-xl">Quick links</h2>
                <ul className="space-y-1.5">
                  <li><Link href="/documents" className="link">Club documents</Link></li>
                  <li><Link href="/fees" className="link">Fees and charges</Link></li>
                  <li><Link href="/flying/weather" className="link">Weather and webcam</Link></li>
                  <li><Link href="/find-it" className="link">Find It (A–Z)</Link></li>
                </ul>
              </div>

              <SocialButtons />

              <div>
                <h2 className="display mb-3 text-xl">Elsewhere</h2>
                <ul className="space-y-1.5">
                  <li><a href={club.publicSite} className="link" target="_blank" rel="noopener noreferrer">Club public website<span className="sr-only"> (opens in a new tab)</span></a></li>
                  <li><a href={club.bga} className="link" target="_blank" rel="noopener noreferrer">British Gliding Association<span className="sr-only"> (opens in a new tab)</span></a></li>
                  <li><a href={club.bgaLadder} className="link" target="_blank" rel="noopener noreferrer">BGA Ladder<span className="sr-only"> (opens in a new tab)</span></a></li>
                  <li><a href={club.facebookPage} className="link" target="_blank" rel="noopener noreferrer">Club Facebook page<span className="sr-only"> (opens in a new tab)</span></a></li>
                </ul>
              </div>
            </div>

            <p className="mt-9 border-t border-navy/15 pt-5 text-xs text-slate2">
              {club.name} · Gliding at Camphill since {club.founded}. Members&rsquo; portal —
              separate from Members&rsquo; Admin, which holds membership and financial records
              and is reached from the Members&rsquo; Admin menu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
