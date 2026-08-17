/**
 * Members' Admin (AwareIM) — EXTERNAL SYSTEM. DO NOT INTEGRATE.
 *
 * AwareIM is administered by Mo Bent, is his proprietary product, and holds
 * personnel and financial data in its own authenticated database. This portal
 * links to it and nothing more: no shared session, no shared database, no data
 * exchange in either direction. Every link opens in a new tab.
 *
 * This portal NEVER collects an AwareIM username or password. A sign-in box
 * here would have to post credentials from our origin into Mo's session-based
 * login — it would break the first time he changed anything, and it would teach
 * members that typing their club password into a page that is not his is
 * normal. Members sign in on his page. That is the rule.
 *
 * This file is the ONLY place AwareIM URLs appear.
 */

/**
 * The `?domain=DLGC` parameter is REQUIRED. Without it AwareIM presents a login
 * form that rejects valid club credentials, because it does not know which
 * customer domain to authenticate against. Do not remove it.
 */
export const AWAREIM_BASE = 'https://free-flight.info:8443/AwareIM/logonOp.aw?domain=DLGC';

/**
 * ── WHAT WE KNOW ABOUT DEEP LINKING ────────────────────────────────────────
 *
 * AwareIM accepts `&firstCommand=startProcess(%27Name%27)`, which runs a named
 * process after the logon step. The old site used it once, on the airspace page:
 *
 *   logonOp.aw?domain=DLGC&firstCommand=startProcess(%27AS_Rebrief%27)
 *
 * Two things were established by looking at a signed-in session (August 2026):
 *
 * 1. It does NOT skip the login. Opening that URL in a new tab presents the
 *    logon form even when another tab is signed in — AwareIM starts a fresh
 *    session per `logonOp.aw` hit. The benefit is "sign in and land on the
 *    right screen", not "jump straight there".
 *
 * 2. The names visible in the running app are NOT process names. The member
 *    view is produced by one process, `WhiteBoardCreate_Member`, and
 *    `Flying_Planner`, `Flights_Today`, `Duties_and_Volunteers`, `Todays_TLs`,
 *    `My_Teams` and `Weather` are panels inside its perspective. Setting the
 *    SPA's own hash route to a named panel does not switch to it either.
 *
 * So the individual screens below cannot be deep-linked without the real
 * process names, which only the AwareIM administrator has. ASK MO for them,
 * put them in the `process` fields, and every button starts landing on its own
 * screen. Until then each falls back to the logon page — which is exactly what
 * happens today, so nothing regresses.
 *
 * NEVER guess a name. A wrong one produces an error inside Mo's system, which
 * is worse than the logon page.
 */
export const awareimProcess = (name: string) =>
  `${AWAREIM_BASE}&firstCommand=startProcess(%27${encodeURIComponent(name)}%27)`;

export type AwareTarget = {
  /** AwareIM's OWN wording. Do not improve it — a member should read the same
   *  words here and there, or the signpost fails. */
  label: string;
  hint: string;
  /** Where to find it once signed in, so the link is useful even unlinked. */
  where: string;
  process: string | null;
  inMenu?: boolean;
};

/**
 * Mirrors the Members' Admin menu as it actually appears, read from a signed-in
 * session. If Mo rearranges his menu, update the `where` values to match.
 */
const TARGETS = {
  flyingPlanner: { label: 'Flying Planner',        hint: 'Book yourself onto a flying day', where: 'Top row of tabs',   process: null, inMenu: true },
  flightsToday:  { label: 'Flights Today',         hint: 'What is flying, and what has landed', where: 'Top row of tabs', process: null, inMenu: true },
  todaysTls:     { label: 'Todays TLs',            hint: 'Trial lessons booked for today', where: 'Top row of tabs',    process: null },
  duties:        { label: 'Duties and Volunteers', hint: 'Your duties, swaps and offers',  where: 'Top row of tabs',    process: null, inMenu: true },
  myTeams:       { label: 'My Teams',              hint: 'Teams you belong to',            where: 'Top row of tabs',    process: null },
  myBookings:    { label: 'My Bookings',           hint: 'What you have booked',           where: 'Left menu',          process: null, inMenu: true },
  myDetails:     { label: 'My Details',            hint: 'Your contact details',           where: 'Left menu → My Stuff', process: null, inMenu: true },
  logbook:       { label: 'My Log Book',           hint: 'Your recorded flights',          where: 'Left menu → My Stuff', process: null, inMenu: true },
  splReport:     { label: 'My SPL Rolling Report', hint: 'Your licence currency',          where: 'Left menu → My Stuff', process: null, inMenu: true },
  account:       { label: 'My Account',            hint: 'Balance and monthly statements', where: 'Left menu → My Stuff', process: null, inMenu: true },
  transfer:      { label: 'Transfer money',        hint: 'Move money between accounts',    where: 'Left menu → My Stuff', process: null, inMenu: true },
  bacs:          { label: 'Notify the club of your BACS Payment', hint: 'After you have paid by bank transfer', where: 'Left menu → My Stuff', process: null, inMenu: true },
  uploadDocs:    { label: 'Upload Licence and Medical Docs', hint: 'Send the club your paperwork', where: 'Left menu → My Stuff', process: null, inMenu: true },
  shouldIGo:     { label: 'Should I Go',           hint: 'Is it worth the drive',          where: 'Left menu',          process: null, inMenu: true },
  events:        { label: 'Events Calendars',      hint: 'Club events and bookings',       where: 'Left menu',          process: null, inMenu: true },
  directory:     { label: 'Member Directory',      hint: 'Contact details for members',    where: 'Left menu',          process: null, inMenu: true },
  notableFlights:{ label: 'Notable Flights',       hint: 'Flights worth a look',           where: 'Left menu',          process: null },
  rebrief:       { label: 'Airspace Re-brief',     hint: 'Record your annual re-brief',    where: 'Opens straight there', process: 'AS_Rebrief', inMenu: true },
} satisfies Record<string, AwareTarget>;

export type AwareKey = keyof typeof TARGETS;

/**
 * The URL for a Members' Admin destination. Use this everywhere instead of
 * AWAREIM_BASE, so a button starts working the moment its process name is known.
 */
export const aim = (key: AwareKey): string => {
  const t = TARGETS[key];
  return t.process ? awareimProcess(t.process) : AWAREIM_BASE;
};

/** Where to go once signed in — shown next to a link that cannot deep-link yet. */
export const aimWhere = (key: AwareKey): string => TARGETS[key].where;

export type AwareLink = AwareTarget & { key: AwareKey; href: string };

const all: AwareLink[] = (Object.keys(TARGETS) as AwareKey[]).map((key) => ({
  ...TARGETS[key],
  key,
  href: aim(key),
}));

/** The Members' Admin dropdown list. */
export const awareimLinks = all.filter((l) => l.inMenu);

/** How many destinations still land on the logon page rather than their screen. */
export const awareimPendingCount = all.filter((l) => !l.process).length;
