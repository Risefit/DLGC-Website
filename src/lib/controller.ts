import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { isController } from '@/lib/auth';

/**
 * THE CHECK EVERY CONTROLLER ACTION STARTS WITH.
 *
 * A "server action" can be called by anybody who can reach the site, whatever
 * page they are on, so each one has to find out for itself who is asking. This
 * asks Supabase who is signed in (never trusting what the browser says) and
 * refuses anybody who is not a controller. Only then does it hand back the
 * server's own client, which holds the secret key.
 *
 * Used by src/app/(portal)/admin/members/actions.ts and
 * src/app/(portal)/admin/reading/actions.ts. Do not write a controller action
 * that does not begin with it.
 *
 * Server only: never import this into a component that runs in the browser.
 */
export async function requireController() {
  const supabase = await createClient();
  const admin = adminClient();
  if (!supabase || !admin) throw new Error('not-configured');
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isController(user)) throw new Error('not-allowed');
  return { me: user, admin };
}

/** What to tell somebody the check turned away. Gives nothing else away. */
export const refusal = (e: unknown, page = 'This page') =>
  e instanceof Error && e.message === 'not-configured'
    ? `${page} needs SUPABASE_SERVICE_ROLE_KEY set in Vercel.`
    : 'Only a controller can do that. Sign in again and retry.';
