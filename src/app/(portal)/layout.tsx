import Link from 'next/link';
import Nav from '@/components/Nav';
import { previewOpen } from '@/lib/auth';
import ClubNumbers from '@/components/ClubNumbers';
import { contacts, club } from '@/content/site';
import SocialButtons from '@/components/SocialButtons';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      {previewOpen && (
        <div className="bg-warnTint border-b border-warn/30 px-4 py-2.5 text-center text-xs text-warn no-print">
          <strong>Preview mode</strong> — the login gate is switched off so the committee can
          look around. Turn it on before any real member data goes in.
        </div>
      )}

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:py-10">
        {children}
      </main>

      <footer className="mt-auto border-t border-skyLine bg-white no-print">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Emergency Procedures reachable from every page, one tap. */}
          <Link
            href="/safety/emergency"
            className="tap mb-6 gap-3 rounded-card border-l-4 border-bad bg-badTint px-4 py-3 font-semibold text-bad hover:bg-bad/10 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3l9.5 17H2.5L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M12 9v5M12 17.2v.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            Emergency Procedures
          </Link>

          <div className="grid gap-8 text-sm sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <h2 className="mb-2 text-base">Contact the club</h2>
              <ClubNumbers compact />
              <p className="mt-2">
                <a href={`mailto:${contacts.office.email}`} className="link">
                  {contacts.office.email}
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base">Where we are</h2>
              <p className="text-inkMuted">
                {contacts.postal.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base">Quick links</h2>
              <ul className="space-y-1.5 text-inkMuted">
                <li><Link href="/find-it" className="link">Find It (old site A–Z)</Link></li>
                <li><Link href="/fees" className="link">Fees and charges</Link></li>
                <li><Link href="/archive" className="link">Archive</Link></li>
                <li><Link href="/directory" className="link">Who&rsquo;s who</Link></li>
              </ul>
            </div>

            <SocialButtons />

            <div>
              <h2 className="mb-2 text-base">Elsewhere</h2>
              <ul className="space-y-1.5 text-inkMuted">
                <li><a href={club.publicSite} className="link" target="_blank" rel="noopener noreferrer">Club public website</a></li>
                <li><a href={club.bga} className="link" target="_blank" rel="noopener noreferrer">British Gliding Association</a></li>
                <li><a href={club.bgaLadder} className="link" target="_blank" rel="noopener noreferrer">BGA Ladder</a></li>
                <li><a href={club.facebookPage} className="link" target="_blank" rel="noopener noreferrer">Club Facebook page</a></li>
              </ul>
            </div>
          </div>

          <p className="mt-8 border-t border-skyLine pt-5 text-xs text-slate2">
            {club.name} · Gliding at Camphill since {club.founded}. Members&rsquo; portal —
            separate from Members&rsquo; Admin, which holds membership and financial records
            and is reached from the Members&rsquo; Admin menu.
          </p>
        </div>
      </footer>
    </div>
  );
}
