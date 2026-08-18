/**
 * Social channels, the Safety Spot, and the charities the club supports.
 */

// ── Social media ───────────────────────────────────────────────────────────
/**
 * `href: null` marks a channel the club hasn't set up yet. Those render as
 * greyed-out placeholders rather than dead links — add the URL here and the
 * button becomes live. Nothing else needs changing.
 */
export type Social = {
  name: string;
  href: string | null;
  handle?: string;
  note?: string;
};

export const socials: Social[] = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/camphillglidingclub/',
    handle: 'Camphill Gliding Club',
    note: 'The club page — public, used for news and photos',
  },
  {
    name: 'Facebook Group',
    href: 'https://www.facebook.com/groups/2400042550211730/',
    handle: 'Members group',
    note: 'Members-only discussion group',
  },
  { name: 'Instagram', href: null, note: 'Not set up yet' },
  { name: 'TikTok', href: null, note: 'Not set up yet' },
  { name: 'X', href: null, note: 'Not set up yet' },
];

// ── The Safety Spot ────────────────────────────────────────────────────────
/**
 * PRESERVED FROM THE OLD SITE — the right-hand "Safety Spot" panel on the
 * members' home page, in full. The old page introduced it as:
 *
 *   "Do yourself a favour! Read — or read again — the advice and information
 *    within the links below."
 *
 * That framing is the club's, and it is a good one. Kept.
 */
export const safetySpotIntro =
  'Do yourself a favour — read, or read again, the advice within these links.';

export type SafetyLink = { label: string; sub?: string; href: string; strong?: boolean };

export const safetySpot: SafetyLink[] = [
  {
    label: 'Safe Start 2026',
    sub: 'Essential reading for all pilots — a self-briefing for a safe start to the season',
    href: 'https://members.gliding.co.uk/wp-content/uploads/sites/3/2025/02/Safe-start-2026_online.pdf',
    strong: true,
  },
  {
    label: 'Low overflight? Here’s the action',
    sub: 'How to report a low overflight',
    href: 'https://dlgc.org.uk/members/pdfs/Low%20Overflights%20Reportingl%20V1.pdf',
  },
  {
    label: 'Keep winch launching safe',
    sub: 'BGA safe winching guidance',
    href: 'https://members.gliding.co.uk/bga-safety-management/safe-winching/',
  },
  {
    label: 'Paying attention when rigging',
    sub: 'Glider integrity briefing',
    href: 'https://www.dlgc.org.uk/members/safety/Glider%20Integrity%20Briefing%20Published.pdf',
  },
  {
    label: 'Using the Safe Rigging Toolbox',
    sub: 'BGA safe rigging',
    href: 'https://members.gliding.co.uk/bga-safety-management/safe-rigging/',
  },
  {
    label: 'Safety Lessons Log',
    sub: 'Learn from safety occurrences at Camphill',
    href: '/safety/lessons',
  },
  {
    label: 'About CHIRP and its help',
    sub: 'Confidential incident reporting',
    href: 'https://www.dlgc.org.uk/members/safety/About%20CHIRP.pdf',
  },
  {
    label: 'Safety Briefing Documents',
    sub: 'From the BGA library',
    href: 'https://members.gliding.co.uk/library/safety-briefings/',
  },
  {
    label: 'Spinning from a turn',
    sub: 'BGA safety briefing',
    href: 'https://members.gliding.co.uk/library/safety-briefings/',
  },
  {
    label: 'Crash / emergency — actions',
    sub: 'What to do when it has gone wrong',
    href: '/safety/emergency',
    strong: true,
  },
];

// ── Charities the club supports ────────────────────────────────────────────
/**
 * Taken from the club's own history: Tony Kay's "Glide for Guide Dogs"
 * evenings raised over £5,000 and earned the club the right to name a puppy,
 * and both Yorkshire Air Ambulance and Edale Mountain Rescue appear in the
 * club's news. Edale Mountain Rescue also trains at Camphill.
 *
 * Add or remove entries here — this is the only place they appear.
 */
export type Charity = { name: string; href: string; why: string };

export const charities: Charity[] = [
  {
    name: 'Yorkshire Air Ambulance',
    href: 'https://yorkshireairambulance.org.uk/donate/',
    why: 'The service that would come for us. Entirely charity funded.',
  },
  {
    name: 'Edale Mountain Rescue',
    href: 'https://justgiving.com/edalemrt',
    why: 'Our neighbours in the Peak, and they train at Camphill.',
  },
  {
    name: 'Guide Dogs',
    href: 'https://www.guidedogs.org.uk/how-you-can-help/donating/',
    why: 'Glide for Guide Dogs raised over £5,000 and named a puppy, "Puch".',
  },
];
