/**
 * CLUB MANUALS — ported from manuals_webpage.asp, keeping the old page's three
 * groupings, because the grouping is the useful part: the five you actually
 * need, the specialist ones, and the aircraft flight manuals.
 *
 * The caveat on the flight manuals is the club's own wording and matters — do
 * not drop it.
 */

const M = 'https://www.dlgc.org.uk/members/manuals';

export type Manual = { title: string; note?: string; href: string };
export type ManualGroup = { group: string; blurb: string; manuals: Manual[] };

export const manualGroups: ManualGroup[] = [
  {
    group: 'Main manuals',
    blurb: 'The five that govern how we operate. Read the Pilots Manual at least once.',
    manuals: [
      { title: 'Pilots Manual', note: 'November 2025', href: `${M}/Pilots%20Manual%20Nov%202025.pdf` },
      { title: 'Winch Operating Manual', note: '2024', href: `${M}/Winch%20Operating%20Manual_2024.pdf` },
      { title: 'Ground Training Manual', note: 'Amended June 2025', href: `${M}/DLGC%20GTM%20-%20080623,%20Amended%20030625.pdf` },
      { title: 'Launch Marshals Manual', note: 'V5.8, March 2026', href: `${M}/Launch%20Marshal%20Manual%20V5.8%20Mar%202026.pdf` },
      { title: 'Student Pilots Guide', note: 'v9.02 final', href: `${M}/Student%20Pilots%20Guide%20v9.02%20Final.pdf` },
    ],
  },
  {
    group: 'Other manuals',
    blurb: 'Specialist procedures — duty clerk, parachutes, cables and strops.',
    manuals: [
      { title: 'Duty Clerks Manual', note: '2018', href: `${M}/DutyClerkManual2018.pdf` },
      { title: 'Duty Clerks Trainees Guide', href: `${M}/Duty%20Clerks%20Trainees%20Update.pdf` },
      { title: 'Launch Speeds', note: 'V8', href: `${M}/LaunchSpeedsV8.pdf` },
      { title: 'Parachute Manual', note: '2019 v2', href: `${M}/Parachute%20manual%202019v2.pdf` },
      { title: 'Air-Pol SK-94 Parachute Manual', href: `${M}/Air-Pol%20SK-94%20Manual.pdf` },
      { title: 'Splicing 3-Strand Rope and Cable', href: `${M}/Splicing%203-Strand%20Rope.pdf` },
      { title: 'Splicing Dyneema', note: 'with video', href: `${M}/Splicing%20Dyneema%20(with%20Video).pdf` },
      { title: 'Steel Core Strop Assembly', href: `${M}/Steel-CoreStropAssembly_DLGC.pdf` },
      { title: 'Training (Pre-solo) Exercises', note: 'v1', href: `${M}/Training%20Exercises%20v1.pdf` },
    ],
  },
  {
    group: 'Club glider flight manuals',
    blurb:
      'Each flight manual belongs to the specific glider serial number it came with. The flying guidance and general information are generic, but if in doubt refer to the manual kept with the aircraft.',
    manuals: [
      { title: 'K8', href: `${M}/Glider%20Manuals/Ka8-manuel-de-vol-en-anglais.pdf` },
      { title: 'ASK 13', href: `${M}/Glider%20Manuals/ask13_dsgc_manual_2013.pdf` },
      { title: 'ASK 18', href: `${M}/Glider%20Manuals/K18%20KNM%20Flight%20Manual.pdf` },
      { title: 'ASW 15B', href: `${M}/Glider%20Manuals/ASW15B%20Flight%20Manual.pdf` },
      { title: 'Puchacz', href: `${M}/Glider%20Manuals/szd50-3_puchacz_g-chep_flight_manual.pdf` },
    ],
  },
];

/** The club's own caveat, shown under the flight manuals. Their words. */
export const flightManualCaveat =
  'Each flight manual should be regarded as specific to the glider serial number to which it belongs. However, the flying guidance and other general information can be regarded as generic. If in doubt, the pilot should refer to the flight manual retained with each glider.';
