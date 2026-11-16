/**
 * CLUB MANUALS — ported from manuals_webpage.asp, keeping the old page's three
 * groupings, because the grouping is the useful part: the five you actually
 * need, the specialist ones, and the aircraft flight manuals.
 *
 * The caveat on the flight manuals is the club's own wording and matters — do
 * not drop it.
 *
 * No file addresses are typed here. Each manual points at its record in the
 * document list (documents-imported.ts), by id or by slot.
 */

import { file, current } from './documents';

/**
 * The six manuals that get re-issued. Each follows whichever row in
 * documents-imported.ts currently holds its slot, and shows that row's
 * `version` underneath — so a new edition is one edit, over there.
 */
const latest = (slot: string) => {
  const d = current(slot);
  return { href: d.href, note: d.version };
};


export type Manual = { title: string; note?: string; href: string };
export type ManualGroup = { group: string; blurb: string; manuals: Manual[] };

export const manualGroups: ManualGroup[] = [
  {
    group: 'Main manuals',
    blurb: 'The five that govern how we operate. Read the Pilots Manual at least once.',
    manuals: [
      { title: 'Pilots Manual', ...latest('pilots-manual') },
      { title: 'Winch Operating Manual', ...latest('winch-operating-manual') },
      { title: 'Ground Training Manual', ...latest('ground-training-manual') },
      { title: 'Launch Marshals Manual', ...latest('launch-marshals-manual') },
      { title: 'Student Pilots Guide', ...latest('student-pilots-guide') },
    ],
  },
  {
    group: 'Other manuals',
    blurb: 'Specialist procedures — duty clerk, parachutes, cables and strops.',
    manuals: [
      { title: 'Duty Clerks Manual', note: '2018', href: file('manuals-dutyclerkmanual2018-pdf') },
      { title: 'Duty Clerks Trainees Guide', href: file('manuals-duty-clerks-trainees-update-pdf') },
      { title: 'Launch Speeds', ...latest('launch-speeds') },
      { title: 'Parachute Manual', note: '2019 v2', href: file('manuals-parachute-manual-2019v2-pdf') },
      { title: 'Air-Pol SK-94 Parachute Manual', href: file('manuals-air-pol-sk-94-manual-pdf') },
      { title: 'Splicing 3-Strand Rope and Cable', href: file('manuals-splicing-3-strand-rope-pdf') },
      { title: 'Splicing Dyneema', note: 'with video', href: file('manuals-splicing-dyneema-with-video-pdf') },
      { title: 'Steel Core Strop Assembly', href: file('manuals-steel-corestropassembly-dlgc-pdf') },
      { title: 'Training (Pre-solo) Exercises', note: 'v1', href: file('manuals-training-exercises-v1-pdf') },
    ],
  },
  {
    group: 'Club glider flight manuals',
    blurb:
      'Each flight manual belongs to the specific glider serial number it came with. The flying guidance and general information are generic, but if in doubt refer to the manual kept with the aircraft.',
    manuals: [
      { title: 'K8', href: file('manuals-glider-manuals-ka8-manuel-de-vol-en-anglais-pdf') },
      { title: 'ASK 13', href: file('manuals-glider-manuals-ask13-dsgc-manual-2013-pdf') },
      { title: 'ASK 18', href: file('manuals-glider-manuals-k18-knm-flight-manual-pdf') },
      { title: 'ASW 15B', href: file('manuals-glider-manuals-asw15b-flight-manual-pdf') },
      { title: 'Puchacz', href: file('manuals-glider-manuals-szd50-3-puchacz-g-chep-flight-manual-pdf') },
    ],
  },
];

/** The club's own caveat, shown under the flight manuals. Their words. */
export const flightManualCaveat =
  'Each flight manual should be regarded as specific to the glider serial number to which it belongs. However, the flying guidance and other general information can be regarded as generic. If in doubt, the pilot should refer to the flight manual retained with each glider.';
