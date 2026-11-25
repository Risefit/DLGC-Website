import Link from 'next/link';
import FrontDoor from '@/components/FrontDoor';
import { supabaseConfigured } from '@/lib/auth';

export const metadata = { title: 'DLGC Members’ Portal' };

/**
 * THE FRONT PAGE — all that a visitor sees.
 *
 * Two ways forward: sign in, or ask to join. A member who is already signed in
 * never sees this; the lock (middleware.ts) sends them straight to the
 * dashboard.
 *
 * Keep it bare. It is public, so nothing from inside the portal goes here.
 */
export default function FrontPage() {
  return (
    <FrontDoor photo="from-above">
      <div className="card p-6">
        <h2 className="text-xl">For members of the club</h2>
        <p className="mt-1 text-inkMuted">
          The duty rota, notices from the CFI, manuals, minutes and the rest of the club&rsquo;s
          working papers. Sign in to see them.
        </p>

        <div className="mt-5 space-y-3">
          <Link
            href="/login"
            className="tap w-full justify-center rounded-full bg-navy px-5 py-4 text-lg font-semibold text-white transition-colors hover:bg-skyDark"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="tap w-full justify-center rounded-full border-2 border-navy/40 px-5 py-3.5 text-lg font-semibold text-navy transition-colors hover:border-navy"
          >
            Ask to join
          </Link>
        </div>

        <p className="mt-5 border-t border-skyLine pt-4 text-sm text-inkMuted">
          The portal is for club members only. If you are a member and have not been given a
          sign-in yet, ask to join and the club will set one up for you.
        </p>

        {!supabaseConfigured && (
          <p role="status" className="mt-4 rounded-lg border-l-4 border-warn bg-warnTint p-3 text-sm text-ink">
            Sign-in is not set up on this copy of the site yet.
          </p>
        )}
      </div>
    </FrontDoor>
  );
}
