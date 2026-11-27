import { PageHeader } from '@/components/ui';
import ProfileForm from '@/components/ProfileForm';
import { getUser } from '@/lib/supabase/server';
import { adminClient, logSupabaseProblem } from '@/lib/supabase/admin';
import { isMember } from '@/lib/auth';
import { emptyProfile, readProfile, readRoles } from '@/lib/profile';
import type { RoleId } from '@/lib/roles';

export const metadata = { title: 'My profile' };
// A member's own details: made fresh for them each time, never kept.
export const dynamic = 'force-dynamic';

/**
 * MY PROFILE — My sign-in → My profile.
 *
 * The member's own name, which they can correct, and two things they tell the
 * portal about themselves:
 *   - the duties they do, which add those duties' manuals to their required
 *     reading (src/lib/roles.ts, src/content/required-reading.ts);
 *   - who to ring in an emergency, their next of kin, blood type and anything
 *     a first-aider should know. All optional.
 *
 * The page reads the profile of whoever is signed in — the lock has already
 * made sure somebody is — and the form saves through actions.ts beside this
 * file, which works out for itself whose profile it is.
 *
 * Who can see the emergency details, and that this is not Free Flight, is
 * said on the page itself: a member is entitled to know before typing.
 */
export default async function ProfilePage() {
  const user = await getUser();
  const admin = adminClient();

  let roles: RoleId[] = [];
  let profile = emptyProfile;
  let ready = Boolean(user && isMember(user) && admin);
  if (ready) {
    try {
      roles = await readRoles(admin!, user!.id);
      profile = (await readProfile(admin!, user!.id)) ?? emptyProfile;
    } catch (e) {
      logSupabaseProblem('my profile, reading', { message: e instanceof Error ? e.message : undefined });
      ready = false;
    }
  }

  const name = typeof user?.user_metadata?.name === 'string' ? user.user_metadata.name : '';

  return (
    <>
      <PageHeader
        eyebrow="Your portal sign-in"
        title={
          <>
            My <em>profile</em>
          </>
        }
        lead="Where you have got to as a pilot, the duties you do at the club, and who to ring if something happens to you. Your required reading follows what you choose."
      />
      {ready ? (
        <ProfileForm name={name} email={user?.email ?? ''} roles={roles} profile={profile} />
      ) : (
        <p role="alert" className="card border-l-4 border-warn p-5 text-ink">
          Profiles cannot be opened at the moment. Nothing is wrong with your sign-in; please try again later.
        </p>
      )}
    </>
  );
}
