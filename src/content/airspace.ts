/**
 * AIRSPACE AND NOTAMS — ported from airspace/airspace-main.asp and
 * airspace/LOAsIntro.asp.
 *
 * SAFETY- AND LEGALLY-SIGNIFICANT. These are the arrangements that let Camphill
 * gliders into controlled airspace, and the conditions attached to them. The
 * prose is the club's own; do not paraphrase it to read better.
 *
 * The re-brief link is a real AwareIM deep link — the one the old site
 * published — so it opens the re-brief process rather than the AwareIM home
 * page. See src/content/awareim.ts.
 */

import { file, current } from './documents';
import { portalise } from '@/lib/files';

const A = 'https://www.dlgc.org.uk/members/airspace';

export type AirspaceDoc = { title: string; note?: string; href: string };

/** The self-brief cycle. This is the sentence that catches people out. */
export const REBRIEF_RULE =
  'Letters of Agreement are updated from time to time, so pilots must self re-brief every 12 months.';

export const airspaceIntro = [
  'There is limited but conditional provision for gliders from Camphill to fly at high levels, usually in wave lift, within specific areas of nearby controlled airspace. This is enabled by agreements with NATS set out in Letters of Agreement.',
  'The airspace covered is a Wave Box east of Camphill, a north/south crossing route through airway L975 north-east of Camphill, and some of the controlled airspace near East Midlands Airport.',
];

export const loaDocs: AirspaceDoc[] = [
  {
    title: 'LoA for the Wave Box and Airway Crossing',
    // Follows the current row for this slot in documents-imported.ts.
    note: `The full formal Letter of Agreement, issued ${current('loa-wave-box').version}`,
    href: current('loa-wave-box').href,
  },
  {
    title: 'LoA for East Midlands',
    note: 'The full formal Letter of Agreement',
    href: file('airspace-loa-east-mids-and-dlgc-jul2020-pdf'),
  },
  {
    title: 'Camphill Wave Box and L975 Crossing Briefing',
    note: 'The salient points, summarised. Read this before the re-brief.',
    href: file('airspace-wave-box-and-l975-crossing-briefing-v3-1-pdf'),
  },
  {
    title: 'East Midlands Letter of Agreement Briefing',
    note: 'The salient points, summarised',
    href: file('airspace-east-mids-loa-briefing-notesv3-pdf'),
  },
  {
    title: 'Frequently asked questions',
    note: 'Answers to the likely questions about flying in this controlled airspace',
    href: file('airspace-faqsv9-pdf'),
  },
];

export const nsgaIntro = [
  'Flying above FL100 without a transponder is restricted. Non-SSR Gliding Areas — previously called Non-Transponder Areas — are where you may do so.',
  'You can transition from the Derbyshire NSGA to the Greater Yorkshire NSGA and back again without a transponder. Read the briefing before you rely on it.',
];

export const nsgaDocs: AirspaceDoc[] = portalise([
  { title: 'Derbyshire NSGA', note: 'The local area, in detail', href: file('airspace-derbyshire-nsga-pdf') },
  { title: 'Derbyshire Non-SSR Area', note: 'Overview of the areas where transponders are not required. The file dates from 2012', href: file('derbyshire-nonssr-area-pdf') },
  { title: 'Transition to the Yorkshire NTA', note: 'Crossing between the two areas', href: file('airspace-transition-to-yorkshire-nta-pdf') },
]);

export const bgaDocs: AirspaceDoc[] = [
  {
    title: 'BGA letter to pilots, June 2015',
    note: 'Keep ATC informed near airfields that are also regional airports — notify them if you are above the ATZ or near the approach line, even outside class D. And do not infringe the controlled airspace west of Camphill used by traffic descending into Manchester.',
    href: file('airspace-bga-airspace-letter-june-15-pdf'),
  },
  {
    title: 'BGA letter to pilots, August 2015',
    note: 'Follows on from the June letter. Good practice keeps the risk reasonable, shows gliders do not pose the risk some assume, and strengthens the case against future airspace grabs.',
    href: file('airspace-bgalettertopilotsaug2015-pdf'),
  },
  {
    title: 'Airspace Safety — RA(T)s and the Red Arrows',
    note: 'Every pilot has a duty to respect airspace restrictions. This covers Restricted Areas (Temporary) and why they matter.',
    href: file('airspace-airspace-safety-ra-t-s-pdf'),
  },
  {
    title: 'Controlled airspace closure information',
    href: file('airspace-cas-closure-information-pdf'),
  },
  {
    title: 'Leeds Bradford radar guidance',
    note: 'Radar coverage in the area of Leeds Bradford Airport is currently degraded.',
    href: file('pdfs-20260801-lait-radar-guidance-pdf'),
  },
];

export const notamIntro = [
  'A NOTAM — Notice to Airmen — alerts pilots to hazards or restrictions en route or at a specific location. Pilots must be aware of any NOTAM that will or may affect their planned flying.',
];

export type NotamTool = { name: string; note: string; href: string; caution?: boolean };

export const notamTools: NotamTool[] = [
  {
    name: 'NOTAM Info',
    note: 'Interprets NATS data and plots it on a map. Worth becoming familiar with at home rather than on the day.',
    href: 'https://notaminfo.com',
  },
  {
    name: 'SkyDemon',
    note: 'Plot an intended route and the relevant NOTAMs are notified. Recommended for cross-country planning at home.',
    href: 'https://www.skydemon.aero/',
  },
  {
    name: 'NATS AIS — the authoritative source',
    note: 'Health warning: the tools above are helpful, but up-to-date NOTAM information should be obtained from the NATS Aeronautical Information Service itself.',
    href: 'https://nats-uk.ead-it.com/',
    caution: true,
  },
];

export const airspaceSource = `${A}/airspace-main.asp`;
export const loaSource = `${A}/LOAsIntro.asp`;

/** When the Wave Box agreement was last issued — shown on the Flying page. */
export const waveBoxLoaIssued = current('loa-wave-box').version ?? '';
