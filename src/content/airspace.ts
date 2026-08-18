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

const A = 'https://www.dlgc.org.uk/members/airspace';
const OLD = 'https://www.dlgc.org.uk/members';

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
    note: 'The full formal Letter of Agreement',
    href: `${A}/Scottish-BGA-DLGC%20LoA%20Rev.pdf`,
  },
  {
    title: 'LoA for East Midlands',
    note: 'The full formal Letter of Agreement',
    href: `${A}/LOA%20East%20Mids%20and%20%20DLGC%20Jul2020.pdf`,
  },
  {
    title: 'Camphill Wave Box and L975 Crossing Briefing',
    note: 'The salient points, summarised. Read this before the re-brief.',
    href: `${A}/Wave%20Box%20and%20L975%20Crossing%20Briefing%20V3-1.pdf`,
  },
  {
    title: 'East Midlands Letter of Agreement Briefing',
    note: 'The salient points, summarised',
    href: `${A}/East%20Mids%20LoA%20Briefing%20NotesV3.pdf`,
  },
  {
    title: 'Frequently asked questions',
    note: 'Answers to the likely questions about flying in this controlled airspace',
    href: `${A}/FAQsv9.pdf`,
  },
];

export const nsgaIntro = [
  'Flying above FL100 without a transponder is restricted. Non-SSR Gliding Areas — previously called Non-Transponder Areas — are where you may do so.',
  'You can transition from the Derbyshire NSGA to the Greater Yorkshire NSGA and back again without a transponder. Read the briefing before you rely on it.',
];

export const nsgaDocs: AirspaceDoc[] = [
  { title: 'Derbyshire NSGA', note: 'The local area, in detail', href: `${A}/Derbyshire%20NSGA.pdf` },
  { title: 'Derbyshire Non-SSR Area', note: 'Overview of the areas where transponders are not required', href: `${A}/Derbyshire%20NonSSR%20Area%20.pdf` },
  { title: 'Transition to the Yorkshire NTA', note: 'Crossing between the two areas', href: `${A}/Transition%20to%20Yorkshire%20NTA.pdf` },
];

export const bgaDocs: AirspaceDoc[] = [
  {
    title: 'BGA letter to pilots, June 2015',
    note: 'Keep ATC informed near airfields that are also regional airports — notify them if you are above the ATZ or near the approach line, even outside class D. And do not infringe the controlled airspace west of Camphill used by traffic descending into Manchester.',
    href: `${A}/BGA%20airspace%20letter%20june%2015.pdf`,
  },
  {
    title: 'BGA letter to pilots, August 2015',
    note: 'Follows on from the June letter. Good practice keeps the risk reasonable, shows gliders do not pose the risk some assume, and strengthens the case against future airspace grabs.',
    href: `${A}/BGALetterToPilotsAug2015.pdf`,
  },
  {
    title: 'Airspace Safety — RA(T)s and the Red Arrows',
    note: 'Every pilot has a duty to respect airspace restrictions. This covers Restricted Areas (Temporary) and why they matter.',
    href: `${A}/Airspace%20Safety%20-%20RA(T)s.pdf`,
  },
  {
    title: 'Controlled airspace closure information',
    href: `${A}/CAS%20Closure%20Information.pdf`,
  },
  {
    title: 'Leeds Bradford radar guidance',
    note: 'Radar coverage in the area of Leeds Bradford Airport is currently degraded.',
    href: `${OLD}/pdfs/20260801%20-%20LAIT%20Radar%20Guidance.pdf`,
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
    name: 'Spine',
    note: 'Load it onto your own computer. Another interpreter of NATS NOTAM data.',
    href: 'http://www.enborne.f2s.com/gliding/spine.htm',
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
