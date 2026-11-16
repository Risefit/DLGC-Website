/**
 * DUTY ROTAS — ported from dutyrotas.asp, plus the winch drivers list from
 * "winch drvr gallery.asp".
 *
 * The old page was a table of "Click LINK" cells with no indication of which
 * quarter you were looking at until the PDF opened. Here each quarter is a
 * named card with its two rotas, and the guidance that sat underneath is kept
 * because duty swapping is the thing members actually need help with.
 *
 * WHEN A NEW QUARTER IS PUBLISHED: add its files to the TOP of
 * documents-imported.ts, titled exactly "27Q1 Instructors Rota" and "27Q1
 * Ground Crew Rota" (and "SPL Theory Briefings - Schedule for 2027 Q1"). The
 * card appears here by itself and becomes the current one. Nothing to edit in
 * this file.
 */

import { file, documents } from './documents';

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

const QUARTER_MONTHS = [
  'January, February, March',
  'April, May, June',
  'July, August, September',
  'October, November, December',
];

/**
 * Built from the document list, not typed here. Any row in
 * documents-imported.ts titled "26Q4 Instructors Rota" or "26Q4 Ground Crew
 * Rota" becomes a sheet on that quarter's card, and "SPL Theory Briefings …
 * 2026 Q4" becomes its briefing schedule. Newest quarter first; the page marks
 * the first one as current.
 */
export const rotaQuarters: RotaQuarter[] = (() => {
  const by = new Map<string, RotaQuarter>();
  for (const d of documents) {
    const m = d.title.match(/^(\d\d)Q([1-4]) (Instructors|Ground Crew) Rota$/);
    if (!m) continue;
    const code = `${m[1]}Q${m[2]}`;
    if (!by.has(code)) {
      by.set(code, {
        code,
        label: `${QUARTER_MONTHS[Number(m[2]) - 1]} 20${m[1]}`,
        covers: 'Saturdays, Sundays and Bank Holidays',
        sheets: [],
      });
    }
    by.get(code)!.sheets.push({
      label: m[3] === 'Instructors' ? 'Instructors rota' : 'Ground crews rota',
      href: d.href,
    });
  }
  for (const d of documents) {
    const m = d.title.match(/^SPL Theory Briefings.*\b20(\d\d) Q([1-4])$/);
    const q = m && by.get(`${m[1]}Q${m[2]}`);
    if (q) q.briefings = { label: 'SPL classroom briefings — topics and schedule', href: d.href };
  }
  return [...by.values()]
    .map((q) => ({ ...q, sheets: [...q.sheets].sort((x, y) => x.label.localeCompare(y.label)).reverse() }))
    .sort((x, y) => y.code.localeCompare(x.code));
})();

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
  { label: 'Duty swapping guidance', href: file('misc-pages-duty-swapping-pdf') },
  { label: 'How to use the Daily Flying Planner', href: file('pdfs-dfp-guidance-pdf') },
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
