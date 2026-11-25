import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { isMember, mustChangePassword } from '@/lib/auth';

/**
 * THE CHECK A MEMBER'S OWN ACTION STARTS WITH.
 *
 * For the things a member does to their own record (My profile). It asks
 * Supabase who is signed in — never trusting what the browser says — and
 * refuses anybody who is not a member, or who is still on a temporary
 * password. It hands back that member and the server's own client.
 *
 * THE MEMBER IS ALWAYS THE ONE WHO IS SIGNED IN. An action that begins with
 * this must use `me.id` and nothing else to decide whose record it touches;
 * it must never take a member's id from the form. Controllers' actions begin
 * with requireController() (src/lib/controller.ts) instead.
 *
 * Server only: never import this into a component that runs in the browser.
 */
export async function requireMember() {
  const supabase = await createClient();
  const admin = adminClient();
  if (!supabase || !admin) throw new Error('not-configured');
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isMember(user) || mustChangePassword(user)) throw new Error('not-allowed');
  return { me: user, admin };
}
