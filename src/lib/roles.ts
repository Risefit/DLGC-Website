/**
 * THE DUTIES A MEMBER DOES — "roles" on the Members page and on My profile.
 *
 * Twenty of them, in five groups: where a member has got to as a PILOT (a
 * student, or the flying card they hold), then the duty teams — the winch, the
 * launch point, the duty clerks — and flying: instructing, introductory
 * flights and mutual flying. The list was given by Phil in November 2026.
 *
 * THE PILOT GROUP IS ONE CHOICE, NOT SEVERAL. A member is a student pilot or
 * holds one card: White, Red, Yellow, Green or Blue (src/content/flying-cards.ts
 * says what each allows). Giving one takes any other off; `withRole` below is
 * the one place that rule is applied, on the server and on the page alike. A
 * card shown here is a note of the card the member holds. It awards nothing:
 * the CFI issues cards, and the card a pilot carries is what counts.
 *
 * TO ADD, RENAME OR REMOVE ONE, edit ROLES below, then say which manuals it
 * needs in src/content/required-reading.ts. That is all: since migration 012
 * the database only checks that a role is a short lower-case name, so a new
 * one needs nothing run in Supabase. An id is lower-case letters, digits and
 * hyphens, and must never be reused for a different duty — it is what is
 * stored against each member. Removing a role from this list simply stops it
 * being shown or counted; nothing has to be deleted.
 *
 * WHAT A ROLE DOES HERE. Two things only:
 *   - it shows beside the member's name on the Members page;
 *   - it adds that duty's manuals to the member's required reading.
 *
 * WHAT IT DOES NOT DO. It is not a record that anybody is qualified, cleared
 * or current — the CFI and each duty's own lead keep that, and the duty rota
 * is made elsewhere. That holds for the flying roles above all: ticking
 * "Flight Instructor", "Chief Flying Instructor" or "Mutual flyer" here makes
 * nobody one — the CFI approves mutual flyers, on the club's own form — and
 * gives them no say over anything on the site. It opens nothing in the portal
 * either: who may see what is decided by the marks in src/lib/auth.ts, never
 * by a role. A member can tick their own on My profile, and a controller can
 * set them on the Members page; either can take one off again.
 *
 * They are kept in the Supabase table portal_member_roles (one row a member),
 * which the member's own browser may read but only the portal's server can
 * write.
 *
 * This file has no secrets and nothing from src/content, so it is safe to use
 * in a component that runs in the browser.
 */

export const ROLES = [
  { id: 'student-pilot', label: 'Student pilot', short: 'Student', team: 'Pilot' },
  { id: 'card-white', label: 'White card', short: 'White', team: 'Pilot' },
  { id: 'card-red', label: 'Red card', short: 'Red', team: 'Pilot' },
  { id: 'card-yellow', label: 'Yellow card', short: 'Yellow', team: 'Pilot' },
  { id: 'card-green', label: 'Green card', short: 'Green', team: 'Pilot' },
  { id: 'card-blue', label: 'Blue card', short: 'Blue', team: 'Pilot' },
  { id: 'winch-master', label: 'Winch master', short: 'Master', team: 'Winch' },
  { id: 'winch-trainer', label: 'Winch trainer', short: 'Trainer', team: 'Winch' },
  { id: 'winch-driver', label: 'Winch driver', short: 'Driver', team: 'Winch' },
  { id: 'winch-trainee', label: 'Winch trainee', short: 'Trainee', team: 'Winch' },
  { id: 'launch-master', label: 'Launch master', short: 'Master', team: 'Launch' },
  { id: 'launch-marshal', label: 'Launch marshal', short: 'Marshal', team: 'Launch' },
  { id: 'head-clerk', label: 'Head clerk', short: 'Head clerk', team: 'Clerk' },
  { id: 'clerk', label: 'Clerk', short: 'Clerk', team: 'Clerk' },
  { id: 'trainee-clerk', label: 'Trainee clerk', short: 'Trainee', team: 'Clerk' },
  { id: 'basic-instructor', label: 'Basic Instructor (BI)', short: 'BI', team: 'Flying' },
  { id: 'flight-instructor', label: 'Flight Instructor (FI)', short: 'FI', team: 'Flying' },
  { id: 'cfi', label: 'Chief Flying Instructor (CFI)', short: 'CFI', team: 'Flying' },
  { id: 'ifp', label: 'Introductory Flight Pilot (IFP)', short: 'IFP', team: 'Flying' },
  { id: 'mutual-flyer', label: 'Mutual flyer', short: 'Mutual flyer', team: 'Flying' },
] as const;

export type RoleId = (typeof ROLES)[number]['id'];
export type Role = (typeof ROLES)[number];

export const TEAMS = ['Pilot', 'Winch', 'Launch', 'Clerk', 'Flying'] as const;
export type Team = (typeof TEAMS)[number];
/** Groups where a member holds one role at most. */
export const ONE_ONLY: readonly Team[] = ['Pilot'];
export const TEAM_NAMES: Record<Team, string> = {
  Pilot: 'As a pilot',
  Winch: 'On the winch',
  Launch: 'At the launch point',
  Clerk: 'Duty clerk',
  Flying: 'Instructing, introductory flights and mutual flying',
};

const KNOWN = new Set<string>(ROLES.map((r) => r.id));

export const isRole = (x: unknown): x is RoleId => typeof x === 'string' && KNOWN.has(x);

const teamOf = (id: RoleId): Team => ROLES.find((r) => r.id === id)!.team;

/**
 * Whatever came from a form or the database, as a clean list: only roles the
 * club has, each once, in the order above. Anything else is dropped. In a
 * one-only group (the pilot's card) the first one given is kept and any other
 * is dropped, so a doctored form cannot leave a member holding two cards.
 */
export function cleanRoles(x: unknown): RoleId[] {
  if (!Array.isArray(x)) return [];
  const have = new Set<RoleId>();
  const taken = new Set<Team>();
  for (const id of x) {
    if (!isRole(id) || have.has(id)) continue;
    const team = teamOf(id);
    if (ONE_ONLY.includes(team)) {
      if (taken.has(team)) continue;
      taken.add(team);
    }
    have.add(id);
  }
  return ROLES.map((r) => r.id).filter((id) => have.has(id));
}

/**
 * The roles a member holds after one is given or taken off. Giving a role in
 * a one-only group replaces whatever they held in that group: a pilot given
 * the Red card no longer holds the White one.
 */
export function withRole(held: readonly string[], role: RoleId, on: boolean): RoleId[] {
  return cleanRoles(on ? [role, ...held] : held.filter((r) => r !== role));
}

/**
 * How each pilot's chip is coloured once it is held, and the dot that marks it
 * before. Colour is never the only sign (rule 4): every chip carries the
 * card's name, and a held one carries a tick. White and Yellow take dark
 * text; the others white. Written out in full so Tailwind keeps the classes.
 */
export const PILOT_TONE: Partial<Record<RoleId, { on: string; dot: string }>> = {
  'card-white': { on: 'border-navy bg-white text-navy ring-2 ring-navy', dot: 'bg-white ring-1 ring-slate-400' },
  'card-red': { on: 'border-bad bg-bad text-white', dot: 'bg-bad' },
  'card-yellow': { on: 'border-warn bg-cardYellow text-ink', dot: 'bg-cardYellow ring-1 ring-warn' },
  'card-green': { on: 'border-good bg-good text-white', dot: 'bg-good' },
  'card-blue': { on: 'border-sky bg-sky text-white', dot: 'bg-sky' },
};

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
