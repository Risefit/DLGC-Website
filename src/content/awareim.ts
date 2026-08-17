/**
 * Members' Admin (AwareIM) — EXTERNAL SYSTEM. DO NOT INTEGRATE.
 *
 * AwareIM is administered by Mo Bent, is his proprietary product, and holds
 * personnel and financial data in its own authenticated database. This portal
 * links to it and nothing more: no shared session, no shared database, no data
 * exchange in either direction. Every link opens in a new tab.
 *
 * If AwareIM's URL ever changes, this file is the only place to edit.
 */

export const AWAREIM_BASE = 'https://free-flight.info:8443/AwareIM/logonOp.aw';

export type AwareLink = {
  label: string;
  hint: string;
  /** Deep links aren't available pre-login, so every entry lands on the same
   *  logon page. Kept as separate entries because members think in tasks,
   *  not in systems — this is signposting, not routing. */
  href: string;
};

export const awareimLinks: AwareLink[] = [
  { label: 'Daily Flying Planner (DFP)', hint: 'Book yourself onto a flying day', href: AWAREIM_BASE },
  { label: 'My Log Book', hint: 'Your recorded flights', href: AWAREIM_BASE },
  { label: 'Monthly Statements', hint: 'Your flying account', href: AWAREIM_BASE },
  { label: 'Top Up / Transfer Money', hint: 'Notify the club of a BACS payment', href: AWAREIM_BASE },
  { label: 'Duties and Volunteers', hint: 'What you have signed up for', href: AWAREIM_BASE },
  { label: 'Renew My Membership', hint: 'Annual renewal', href: AWAREIM_BASE },
  { label: 'My Details', hint: 'Your contact details and preferences', href: AWAREIM_BASE },
  { label: 'Airspace Re-brief', hint: 'Record your annual re-brief', href: AWAREIM_BASE },
];
