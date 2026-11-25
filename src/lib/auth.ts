/**
 * WHO MAY SEE THE PORTAL.
 *
 * From November 2026 the portal is members only. A visitor sees the front page
 * (/), the sign-in page and the "ask to join" page, and nothing else. Everything
 * else needs somebody who is BOTH signed in AND marked as a member.
 *
 * ── How somebody becomes a member ──────────────────────────────────────────
 * Only a controller can make one, on the Members page (/admin/members):
 * either by adding the person, or by approving a request made from the front
 * page. Either way the account is created there with a temporary password,
 * which the controller passes on and the member must change the first time
 * they sign in. Nobody can make themselves a member: the marks below live in
 * the account's `app_metadata`, which only the server's secret key can write.
 *
 *   portal_member          may see the portal
 *   portal_admin           is a controller (may add and remove members)
 *   must_change_password   signed in with a temporary password; sent to
 *                          /account/password until they choose their own
 *   temp_password_at       when that temporary password was made. It stops
 *                          working TEMP_PASSWORD_DAYS later, so one sitting
 *                          unread in an inbox does not stay good for ever
 *
 * ── Separate from Free Flight ──────────────────────────────────────────────
 * This sign-in has nothing to do with AwareIM (Free Flight). They share no
 * session, no user table and no database. That separation is deliberate and
 * must be preserved — AwareIM holds personnel and financial data and is
 * administered independently.
 *
 * ── Opening it up for development ──────────────────────────────────────────
 * `NEXT_PUBLIC_PORTAL_OPEN=true` switches the lock off. It is for working on
 * the site on your own computer and must never be set in Vercel. On your own
 * computer the lock is also off when Supabase is not set up at all; on the
 * live site a missing Supabase setting leaves the portal SHUT, not open.
 *
 * (The old switch, NEXT_PUBLIC_PREVIEW_OPEN, is no longer read. It can be
 * deleted from Vercel; leaving it there does nothing.)
 */

export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/** True only when the lock is deliberately off. Never true on the live site. */
export const portalOpen =
  process.env.NEXT_PUBLIC_PORTAL_OPEN === 'true' ||
  (!supabaseConfigured && process.env.NODE_ENV !== 'production');

type Marks = { app_metadata?: Record<string, unknown> | null } | null | undefined;

export const isMember = (user: Marks) => user?.app_metadata?.portal_member === true;
export const isController = (user: Marks) => isMember(user) && user?.app_metadata?.portal_admin === true;
export const mustChangePassword = (user: Marks) => user?.app_metadata?.must_change_password === true;

/**
 * A temporary password lasts this many days. After that the member is told it
 * has run out and a controller makes another. An account made before November
 * 2026 carries no date and is not affected.
 */
export const TEMP_PASSWORD_DAYS = 14;
export const temporaryExpired = (user: Marks) => {
  if (!mustChangePassword(user)) return false;
  const made = user?.app_metadata?.temp_password_at;
  if (typeof made !== 'string') return false;
  const at = Date.parse(made);
  return Number.isFinite(at) && Date.now() - at > TEMP_PASSWORD_DAYS * 86_400_000;
};

/** Pages anybody may see. Everything else is for members. */
export const PUBLIC_PATHS = ['/', '/login', '/join'];
export const PASSWORD_PAGE = '/account/password';

/**
 * Where the button in a reading-reminder email lands. The sign-in form will
 * send a member on to this page after signing in, and to NOWHERE else it is
 * asked to: `afterSignIn` accepts this one address (with its ?doc=… part) and
 * turns everything else into the dashboard, so a doctored link cannot use the
 * club's sign-in page to send somebody to another website.
 */
export const READING_PAGE = '/account/reading';
export const afterSignIn = (next: string | null | undefined) =>
  typeof next === 'string' && /^\/account\/reading(\?doc=[A-Za-z0-9%:._~-]{1,300})?$/.test(next) ? next : '/dashboard';

/** The rule for a password a member chooses. Said the same way on the page and checked on the server. */
export const MIN_PASSWORD = 10;
