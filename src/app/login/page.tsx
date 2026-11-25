import { Suspense } from 'react';
import FrontDoor, { BackToFront } from '@/components/FrontDoor';
import SignInForm from '@/components/SignInForm';
import { contacts } from '@/content/site';

export const metadata = { title: 'Sign in' };

/**
 * Email + password sign-in to the PORTAL, via Supabase Auth.
 * Entirely separate from Free Flight (AwareIM) — different system, different
 * database, different credentials. The page says so, so members aren't
 * confused about which password they need.
 */
export default function LoginPage() {
  return (
    <FrontDoor>
      {/* The form reads "?why=" from the address, which needs this wrapper. */}
      <Suspense fallback={<div className="card p-6">Loading…</div>}>
        <SignInForm officeTel={contacts.office.tel} />
      </Suspense>
      <BackToFront />
    </FrontDoor>
  );
}
