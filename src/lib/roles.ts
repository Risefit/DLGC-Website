/**
 * THE DUTIES A MEMBER DOES — "roles" on the Members page and on My profile.
 *
 * Nine of them, in the club's three duty teams. The list was given by Phil in
 * November 2026. To add, rename or remove one, edit ROLES below AND the list
 * in supabase/migrations/011_roles_and_profiles.sql (the database refuses a
 * role it has not been told about); then say which manuals it needs, in
 * src/content/required-reading.ts.
 *
 * WHAT A ROLE DOES HERE. Two things only:
 *   - it shows beside the member's name on the Members page;
 *   - it adds that duty's manuals to the member's required reading.
 *
 * WHAT IT DOES NOT DO. It is not a record that anybody is qualified, cleared
 * or current — the CFI and each duty's own lead keep that, and the duty rota
 * is made elsewhere. It opens nothing in the portal either: who may see what
 * is decided by the marks in src/lib/auth.ts, never by a role. A member can
 * tick their own on My profile, and a controller can set them on the Members
 * page; either can take one off again.
 *
 * They are kept in the Supabase table portal_member_roles (one row a member),
 * which the member's own browser may read but only the portal's server can
 * write.
 *
 * This file has no secrets and nothing from src/content, so it is safe to use
 * in a component that runs in the browser.
 */

export const ROLES = [
  { id: 'winch-master', label: 'Winch master', short: 'Master', team: 'Winch' },
  { id: 'winch-trainer', label: 'Winch trainer', short: 'Trainer', team: 'Winch' },
  { id: 'winch-driver', label: 'Winch driver', short: 'Driver', team: 'Winch' },
  { id: 'winch-trainee', label: 'Winch trainee', short: 'Trainee', team: 'Winch' },
  { id: 'launch-master', label: 'Launch master', short: 'Master', team: 'Launch' },
  { id: 'launch-marshal', label: 'Launch marshal', short: 'Marshal', team: 'Launch' },
  { id: 'head-clerk', label: 'Head clerk', short: 'Head clerk', team: 'Clerk' },
  { id: 'clerk', label: 'Clerk', short: 'Clerk', team: 'Clerk' },
  { id: 'trainee-clerk', label: 'Trainee clerk', short: 'Trainee', team: 'Clerk' },
] as const;

export type RoleId = (typeof ROLES)[number]['id'];
export type Role = (typeof ROLES)[number];

export const TEAMS = ['Winch', 'Launch', 'Clerk'] as const;
export const TEAM_NAMES: Record<(typeof TEAMS)[number], string> = {
  Winch: 'On the winch',
  Launch: 'At the launch point',
  Clerk: 'Duty clerk',
};

const KNOWN = new Set<string>(ROLES.map((r) => r.id));

export const isRole = (x: unknown): x is RoleId => typeof x === 'string' && KNOWN.has(x);

/**
 * Whatever came from a form or the database, as a clean list: only roles the
 * club has, each once, in the order above. Anything else is dropped.
 */
export function cleanRoles(x: unknown): RoleId[] {
  if (!Array.isArray(x)) return [];
  const have = new Set(x.filter(isRole));
  return ROLES.map((r) => r.id).filter((id) => have.has(id));
}

export const roleLabel = (id: string) => ROLES.find((r) => r.id === id)?.label ?? id;

/**
 * WHICH READING APPLIES TO WHOM, in a form that can be handed to the browser:
 * the keys of the documents everybody is asked to confirm, and for each role
 * the keys of the extra ones. Made in src/content/required-reading.ts.
 */
export type ReadingRule = { everyone: string[]; byRole: Partial<Record<RoleId, string[]>> };

/** The documents one member is asked to confirm, given the roles they hold. Each once. */
export function requiredKeys(rule: ReadingRule, roles: readonly string[]): string[] {
  const keys = [...rule.everyone];
  for (const r of ROLES) {
    if (!roles.includes(r.id)) continue;
    for (const k of rule.byRole[r.id] ?? []) if (!keys.includes(k)) keys.push(k);
  }
  return keys;
}
