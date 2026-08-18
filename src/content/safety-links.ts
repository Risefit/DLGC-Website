/**
 * THE SAFETY PAGE — everything from the old safety_page.asp that is not already
 * somewhere better in this portal.
 *
 * Deliberately NOT here, because each now has its own page:
 *   Emergency Procedures  → /safety/emergency
 *   Safety Lessons Log    → /safety/lessons
 *   Safety culture        → src/content/site.ts (safetyCulture)
 *
 * Everything else from that page is below, grouped by what a member is actually
 * trying to do. The old page was one column of nineteen "this link"s.
 */

const OLD = 'https://www.dlgc.org.uk/members';
const S = `${OLD}/safety`;

export type SafetyResource = { title: string; note: string; href: string };
export type SafetyGroup = { group: string; blurb: string; items: SafetyResource[] };

export const safetyGroups: SafetyGroup[] = [
  {
    group: 'Winch launching',
    blurb: 'Winch launching can be hazardous. With the right care and attention it is safe.',
    items: [
      {
        title: 'BGA safe winch launching',
        note: 'Guidance, videos and a quiz. Worth doing even if you have launched a thousand times.',
        href: 'https://members.gliding.co.uk/bga-safety-management/safe-winching/',
      },
      {
        title: 'Acceleration and over-rotation',
        note: 'Some gliders over-rotate more easily than others early in the launch. For winch drivers and pilots both.',
        href: `${OLD}/pdfs/Acceleration.pdf`,
      },
      {
        title: 'Too early rotation',
        note: 'The companion article to the above.',
        href: `${S}/TooEarlyRotationArticle.pdf`,
      },
    ],
  },
  {
    group: 'Reporting and learning',
    blurb: 'What to do when something happens, and what others have learned when it happened to them.',
    items: [
      {
        title: 'Safety Lessons Log — briefing',
        note: 'What the log is for and how entries are written.',
        href: `${OLD}/pdfs/SLL%20-%20Briefing%20v3.pdf`,
      },
      {
        title: 'Incident reports at another gliding club',
        note: 'Actual reports from another club. An excellent example of learning from mistakes.',
        href: `${S}/Another%20GC%20Incidents%20.pdf`,
      },
      {
        title: 'CHIRP — confidential incident reporting',
        note: 'Mostly general aviation rather than gliding, but the occurrences should make all of us think harder.',
        href: 'https://chirp.co.uk/category/aviation/general-aviation/',
      },
      {
        title: 'Safety Officer — role and contact',
        note: 'Who holds the role and what it covers.',
        href: `${S}/Safety%20Officer.pdf`,
      },
      {
        title: 'BGA Club Safety Officer Toolkit',
        note: 'For anyone taking on or supporting the role.',
        href: 'https://members.gliding.co.uk/bga-safety-management/club-safety-officer-toolkit/',
      },
    ],
  },
  {
    group: 'In the air',
    blurb: 'Radio, airspace conflicts and the things that go wrong close to the ground.',
    items: [
      {
        title: 'Pre-landing radio calls',
        note: 'Let others know your landing intentions. The correct calls, summarised.',
        href: `${OLD}/radionew.asp`,
      },
      {
        title: 'Distress and Diversion, 121.5 MHz',
        note: 'A three-fold handout you can print. How D&D can locate you if you are lost — say above cloud — and the fact that practice calls are welcome.',
        href: `${OLD}/pdfs/DD-briefing-handout-1.pdf`,
      },
      {
        title: 'Drones and mid-air conflict awareness',
        note: 'BGA guidance.',
        href: 'https://members.gliding.co.uk/bga-safety-management/drone-mid-air-conflict-awareness/',
      },
      {
        title: 'Ten traps for ridge flying',
        note: 'BGA safety briefing. Relevant at Camphill more than most sites.',
        href: 'https://members.gliding.co.uk/library/safety-briefings/ten-traps-for-ridge-flying/',
      },
    ],
  },
  {
    group: 'Fit to fly, and sitting properly',
    blurb: 'The two things pilots skip: an honest self-assessment, and the right cushions.',
    items: [
      {
        title: 'IMSAFE — are you fit to fly?',
        note: 'Illness, Medication, Stress, Alcohol, Fatigue, Emotion. A full interpretation.',
        href: 'https://en.wikipedia.org/wiki/IMSAFE',
      },
      {
        title: 'Back cushions',
        note: 'BGA note. It matters more than it sounds.',
        href: `${S}/BGACushionsNoteJul2018.doc`,
      },
      {
        title: 'Energy-absorbing seat cushions',
        note: 'BGA safety briefing on foam. The wrong foam is worse than none.',
        href: 'https://members.gliding.co.uk/library/safety-briefings/safety-foam/',
      },
    ],
  },
  {
    group: 'DLGC Safety Notes',
    blurb: 'The club’s own safety notes, kept in full.',
    items: [
      { title: 'Safety Note 1 — May 2017', note: '', href: `${S}/SafetyNote(01)May2017.pdf` },
      { title: 'Safety Note 2 — October 2017', note: '', href: `${S}/SafetyNote(02)Oct2017.pdf` },
      { title: 'Safety Note 3 — June 2021', note: '', href: `${S}/SafetyNote(03)Jun2021.pdf` },
      { title: 'Safety Note 3.1 — June 2021', note: '', href: `${S}/SafetyNote(03.1)Jun2021.pdf` },
    ],
  },
];

/**
 * BGA annual accident reviews, from the old page's long list. Newest first.
 * Kept because reading a bad year end to end changes how people fly.
 */
export const accidentReviews: { year: number; href: string }[] = [
  { year: 2021, href: 'https://members.gliding.co.uk/library/safety-briefings/2021-safety-review/' },
  { year: 2020, href: 'https://members.gliding.co.uk/library/safety/2020-accident-review/' },
  { year: 2019, href: 'https://members.gliding.co.uk/library/safety/2019-accident-review/' },
  { year: 2018, href: 'https://members.gliding.co.uk/wp-content/uploads/sites/3/2018/12/Accident-Review-2018.pdf' },
  { year: 2017, href: 'https://members.gliding.co.uk/library/safety/2017-accident-review/' },
  { year: 2016, href: 'https://members.gliding.co.uk/library/accident-and-incident-summaries/2016-accident-review/' },
  { year: 2015, href: 'https://members.gliding.co.uk/library/accident-and-incident-summaries/2015-accident-review/' },
  { year: 2014, href: 'https://members.gliding.co.uk/library/safety/2014-accident-review/' },
  { year: 2013, href: 'http://www.gliding.co.uk/bgainfo/documents/accidentreview2013web.pdf' },
  { year: 2012, href: 'http://www.gliding.co.uk/bgainfo/documents/accidentreview2012web.pdf' },
  { year: 2011, href: 'http://www.gliding.co.uk/bgainfo/documents/accidentreview2011web.pdf' },
  { year: 2010, href: 'http://www.gliding.co.uk/bgainfo/safety/documents/summary2010.pdf' },
  { year: 2008, href: `${OLD}/pdfs/Accidents%20to%20Gliders%202008.pdf` },
];

/** Soaring Society of America safety extracts, kept from the old page. */
export const ssaExtracts = {
  title: 'Safety articles from a medic',
  note: 'A thought-provoking series, collected by the club.',
  href: `${OLD}/ssa_extracts.asp`,
};

export const gasco = {
  title: 'GASCo Flight Safety Extra',
  note: 'A free monthly digest of UK general aviation safety information. Email the GASCo office to be added to the mailing list.',
  href: 'https://www.gasco.org.uk/',
};

export const safetyPageSource = `${OLD}/safety_page.asp`;
