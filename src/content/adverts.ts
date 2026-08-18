/**
 * MEMBERS' CLASSIFIEDS — ported from the old adverts.asp.
 *
 * The club's own rules for this page, kept because they are sensible:
 *   • for club people's own purposes — no commercial adverts
 *   • adverts run for up to six months, less if asked, and can be renewed
 *
 * New adverts arrive through the form on /buy-and-sell and land in Supabase as
 * `kind: 'advert'` with status 'pending'. Nothing appears here until the
 * website editor approves it and adds it below.
 *
 * NO PERSONAL DATA RULE (CLAUDE.md rule 6): an advertiser's phone number is
 * published only because they chose to publish it in their own advert. Do not
 * add contact details for anyone who has not asked for them to be here — and
 * remove them when the advert expires.
 */

export type AdvertKind = 'For sale' | 'Wanted' | 'Free to a good home' | 'Notice';

export type Advert = {
  id: string;
  kind: AdvertKind;
  title: string;
  /** Free text — the member's own wording. */
  details: string[];
  price?: string;
  /** As the member gave it. Optional: some prefer to be contacted via the editor. */
  contact?: { name: string; phone?: string[]; email?: string };
  /** ISO date the advert was placed. Drives the six-month expiry note. */
  placed: string;
  displayPlaced: string;
  /** A photograph, once one has been approved. */
  image?: { src: string; alt: string };
};

export const adverts: Advert[] = [
  {
    id: 'glider-guider-2025-11',
    kind: 'For sale',
    title: 'Glider Guider',
    details: [
      'Can be loaded with SeeYou Mobile, XCSoar and LK8000. A great little nav aid.',
      'Comes with the full manual.',
    ],
    price: '£25',
    contact: { name: 'Peter Gill', phone: ['01663 733496', '07779 080946'] },
    placed: '2025-11-07',
    displayPlaced: '7 November 2025',
  },
];

/** The club's own conditions, in the club's own words. */
export const advertRules = [
  'The service is for club people’s own purposes — sorry, no commercial adverts.',
  'Adverts are displayed for up to six months, less if you ask, and can of course be renewed.',
  'Nothing appears until the website editor has read it.',
];

/** Six months, as the old page had it. Used to flag stale adverts to the editor. */
export const ADVERT_MONTHS = 6;

export function isAdvertExpired(a: Advert, now = new Date()): boolean {
  const placed = new Date(a.placed);
  const expiry = new Date(placed);
  expiry.setMonth(expiry.getMonth() + ADVERT_MONTHS);
  return now > expiry;
}

export const advertKinds: AdvertKind[] = ['For sale', 'Wanted', 'Free to a good home', 'Notice'];
