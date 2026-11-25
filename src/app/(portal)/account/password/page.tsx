import { PageHeader } from '@/components/ui';
import PasswordForm from '@/components/PasswordForm';
import { getUser } from '@/lib/supabase/server';
import { mustChangePassword } from '@/lib/auth';

export const metadata = { title: 'Your portal password' };
export const dynamic = 'force-dynamic';

/**
 * Choose or change the password for the PORTAL sign-in. A member arriving with
 * a temporary password is brought here by the lock and cannot go anywhere else
 * until they have chosen their own.
 */
export default async function PasswordPage() {
  const user = await getUser();
  const first = mustChangePassword(user);

  return (
    <>
      <PageHeader
        eyebrow="Your portal sign-in"
        title={
          first ? (
            <>
              Choose your <em>own password</em>
            </>
          ) : (
            <>
              Change your <em>password</em>
            </>
          )
        }
        lead={
          first
            ? 'You signed in with a temporary password. Choose one of your own now, and the portal opens.'
            : 'This is the password for the portal only. Free Flight has its own.'
        }
      />
      <PasswordForm email={user?.email ?? ''} first={first} />
    </>
  );
}
