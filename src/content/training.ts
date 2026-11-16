/**
 * WHAT THE TRAINING PAGE PUTS IN FRONT OF A STUDENT.
 *
 * The Training page used to list all 56 training documents, every one of which
 * is also in the document library. It now shows this short hand-picked set and
 * a button into the library for the rest.
 *
 * To change what is featured, edit the lists of ids below. An id that is not
 * in the library stops the build with a clear message, so a typo cannot ship
 * a dead link. `current('slot')` follows a re-issued manual to its newest file.
 *
 * The CFI owns this choice. It was first made by the website editor in
 * November 2026 and has not been reviewed by an instructor.
 */

import { doc, current, documents, type Doc } from './documents';
import { rotaQuarters } from './roster';

const pick = (...ids: string[]): Doc[] => ids.map(doc);

export const startHere: Doc[] = [
  current('student-pilots-guide'),
  ...pick(
    'spl-advice-student-spl-advice-pdf',
    'spl-advice-white-card-advice-pdf',
    'pdfs-safetybriefnewmembs-pdf',
  ),
];

export const towardsSolo: Doc[] = pick(
  'trainingdocs-spl-training-progress-cards-dlgc-spl-flight-training-prog',
  'trainingdocs-spl-training-progress-cards-dlgc-spl-flight-training-prog-2',
  'trainingdocs-pre-solo-theory-pre-solo-theory-briefing-series-overview-',
  'trainingdocs-pre-solo-theory-pre-solo-theory-briefings-student-record-',
  'pdfs-student-pilot-theory-test-v23-pdf',
  'trainingdocs-dlgc-solo-authorisation-form-pdf',
  'ft-spl-theory-bga',
);

export const onTheGround: Doc[] = [
  current('ground-training-manual'),
  ...pick(
    'flyingnotices-ground-movements-pdf',
    'flyingnotices-care-of-the-airfield-pdf',
    'flyingnotices-canopy-care-pdf',
  ),
];

export const simulator: Doc[] = pick(
  'pdfs-sim-camphill-simulator-guidelines-1r2-pdf',
  'pdfs-sim-simulator-start-up-notes-dave-pdf',
);

export const medical: Doc = doc('pdfs-dlgc-medical-procedure-v2-2-pdf');

/** The newest quarter that has a classroom-briefing schedule. */
export const briefings = rotaQuarters.find((q) => q.briefings);

/** How many documents the library holds under each training heading. */
export const libraryCount = (category: Doc['category']) =>
  documents.filter((d) => d.category === category && d.tier !== 'archive').length;
