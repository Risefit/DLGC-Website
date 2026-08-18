/**
 * DUTY ROTAS — ported from dutyrotas.asp, plus the winch drivers list from
 * "winch drvr gallery.asp".
 *
 * The old page was a table of "Click LINK" cells with no indication of which
 * quarter you were looking at until the PDF opened. Here each quarter is a
 * named card with its two rotas, and the guidance that sat underneath is kept
 * because duty swapping is the thing members actually need help with.
 *
 * WHEN A NEW QUARTER IS PUBLISHED: add it to the TOP of `rotaQuarters`. The
 * page marks the first entry as current, so nothing else needs changing.
 */

const L = 'https://www.dlgc.org.uk/members/lists';
const T = 'https://www.dlgc.org.uk/members/trainingdocs';
const OLD = 'https://www.dlgc.org.uk/members';

export type RotaSheet = { label: string; href: string };

export type RotaQuarter = {
  /** Club shorthand, e.g. "26Q3". */
  code: string;
  label: string;
  covers: string;
  sheets: RotaSheet[];
  /** SPL classroom briefing schedule for the same quarter, where published. */
  briefings?: RotaSheet;
};

export const rotaPreparedBy = 'Steve Pearce';
export const briefingsPreparedBy = 'Simon Stannard';

export const rotaQuarters: RotaQuarter[] = [
  {
    code: '26Q3',
    label: 'July, August, September 2026',
    covers: 'Saturdays, Sundays and Bank Holidays',
    sheets: [
      { label: 'Instructors rota', href: `${L}/26Q3%20Instructors%20Rota.pdf` },
      { label: 'Ground crews rota', href: `${L}/26Q3%20Ground%20Crew%20Rota.pdf` },
    ],
    briefings: {
      label: 'SPL classroom briefings — topics and schedule',
      href: `${T}/SPL%20Theory%20Briefings%20-%202026%20Q3.pdf`,
    },
  },
  {
    code: '26Q2',
    label: 'April, May, June 2026',
    covers: 'Saturdays, Sundays and Bank Holidays',
    sheets: [
      { label: 'Instructors rota', href: `${L}/26Q2%20Instructors%20Rota.pdf` },
      { label: 'Ground crews rota', href: `${L}/26Q2%20Ground%20Crew%20Rota.pdf` },
    ],
    briefings: {
      label: 'SPL classroom briefings — topics and schedule',
      href: `${T}/SPL%20Theory%20Briefings%20-%20Schedule%20for%202026%20Q2.pdf`,
    },
  },
  {
    code: '25Q4',
    label: 'October, November, December 2025',
    covers: 'Saturdays, Sundays and Bank Holidays',
    sheets: [{ label: 'Instructors rota', href: `${L}/25Q4%20Instructors%20Rota.pdf` }],
  },
];

/**
 * PRESERVED FROM THE OLD SITE. Swapping a duty is the single most common thing
 * a member needs to do with the rota, and the old page's advice on it was good.
 */
export const swapGuidance = [
  'The normal way to deal with a duty you cannot do is to arrange a swap.',
  'There is an option in Free Flight to request one. Be aware that not everyone monitors swap requests regularly, so pressing "need to swap" and waiting for responses to flood in will not always work.',
  'The bulk email system is an acceptable way to do it. There is little point sending your request to all members — send it to the people on the same rota as you. If you are new and feel you do not know anyone, email the people rota-ed for the weekends either side of yours. The rota itself lists them.',
  'A swap is not complete until someone has agreed to it. Until then the duty is still yours.',
];

export const rotaDocs: RotaSheet[] = [
  { label: 'Duty swapping guidance', href: `${OLD}/misc_pages/Duty%20Swapping.pdf` },
  { label: 'How to use the Daily Flying Planner', href: `${OLD}/pdfs/DFP%20guidance.pdf` },
];

/**
 * Members who have qualified to winch solo, from the winch drivers gallery.
 * NAMES AND DATES ONLY — it is a roll of honour, not a contact list.
 */
export type WinchDriver = { name: string; qualified: string };

export const winchDrivers: WinchDriver[] = [
  { name: 'Richard Wilson', qualified: 'August 2026' },
  { name: 'Jan Rush', qualified: 'April 2025' },
  { name: 'Owen Brown', qualified: 'April 2025' },
  { name: 'Ben McIntyre', qualified: 'Q2 2025' },
  { name: 'Brian Allen', qualified: 'Q2 2025' },
  { name: 'Stuart Dennis', qualified: 'Q2 2025' },
  { name: 'Malcolm Blood', qualified: 'May 2024' },
  { name: 'David Heimerdinger', qualified: 'September 2023' },
  { name: 'Simon Stannard', qualified: 'September 2023' },
  { name: 'Geoff Cumner', qualified: 'January 2023' },
  { name: 'Dave Lee', qualified: 'January 2023' },
  { name: 'Michael Carter', qualified: 'January 2023' },
  { name: 'Steve Pearce', qualified: 'January 2023' },
  { name: 'Andy Mills', qualified: 'January 2023' },
  { name: 'Gabriel Ng', qualified: '18 June 2022' },
  { name: 'John McKenzie', qualified: '15 December 2021' },
  { name: 'Dave Upcott', qualified: '17 November 2021' },
];

export const rotaSource = `${OLD}/dutyrotas.asp`;
export const winchSource = `${OLD}/winch%20drvr%20gallery.asp`;
