/**
 * REQUIRED READING — the short list every member is asked to open and confirm.
 *
 * THIS LIST IS A FIRST DRAFT. It was chosen by the website editor in November
 * 2026 from the club's own "main manuals" and its rules and policies, so that
 * the page had something sensible on it. The CFI and the committee decide what
 * is actually mandatory — correct it here.
 *
 * To change it, edit the groups below.
 *   slot('…')  a re-issued manual: always the current version (see CLAUDE.md)
 *   file('…')  one particular document, by its id in documents-imported.ts
 *   page(…)    a page of this portal
 *
 * READING THAT GOES WITH A DUTY. An item in the last group carries `roles`: the
 * duties (src/lib/roles.ts) whose members are asked to confirm it. A member who
 * holds one of those roles — ticked on My profile, or set by a controller on
 * the Members page — has the item added to their own list and their count.
 * Everybody else still sees it, as reading for a duty they do not do. WHICH
 * MANUAL GOES WITH WHICH ROLE WAS ALSO A FIRST DRAFT (a trainee is asked to
 * read the same manual as the person training them); the CFI and the duty
 * leads should correct it here.
 *
 * A CONFIRMATION BELONGS TO ONE VERSION. Each item has a `key`; for a document
 * it is the id of that file, so when a manual is re-issued under a new file
 * its key changes and every member is asked to confirm again, without anybody
 * having to remember to reset anything. For a page, bump `issue`.
 *
 * Confirmations are stored in the portal's own database (table
 * reading_confirmations, supabase/migrations/004_reading_confirmations.sql),
 * never in this repository.
 */

import { current, doc, type Doc } from './documents';
import { currentCfiNotices } from './notices';
import type { ReadingRule, RoleId } from '@/lib/roles';

export type ReadingItem = {
  /** What a confirmation is recorded against. Changes when the document does. */
  key: string;
  title: string;
  href: string;
  version?: string;
  /** One line on why it matters. */
  why: string;
  /** Who it applies to, when that is narrower than the group. */
  who?: string;
  /** The duties it is required reading for. None: it is not tied to a duty. */
  roles?: RoleId[];
};

export type ReadingGroup = { group: string; blurb: string; items: ReadingItem[] };

const fromDoc = (d: Doc, why: string, who?: string, roles?: RoleId[]): ReadingItem => ({
  key: d.id,
  title: d.title,
  href: d.href,
  version: d.version,
  why,
  who,
  roles,
});
const slot = (s: string, why: string, who?: string, roles?: RoleId[]) => fromDoc(current(s), why, who, roles);
const file = (id: string, why: string, who?: string, roles?: RoleId[]) => fromDoc(doc(id), why, who, roles);

// The three duty teams. A trainee reads what the people training them read.
const WINCH: RoleId[] = ['winch-master', 'winch-trainer', 'winch-driver', 'winch-trainee'];
const LAUNCH: RoleId[] = ['launch-master', 'launch-marshal'];
const CLERKS: RoleId[] = ['head-clerk', 'clerk', 'trainee-clerk'];
const page = (name: string, issue: string, title: string, href: string, why: string, version?: string): ReadingItem => ({
  key: `page:${name}:${issue}`,
  title,
  href,
  version,
  why,
});

export const requiredReading: ReadingGroup[] = [
  {
    group: 'Everyone who flies at Camphill',
    blurb: 'Read these before you next fly, and again whenever one is re-issued.',
    items: [
      slot('pilots-manual', 'The core operational manual for flying at Camphill.'),
      // A new notice changes the key, so everyone is asked to confirm again.
      page(
        'cfi-notices',
        currentCfiNotices.map((n) => n.num).join('-'),
        'The CFI’s current notices',
        '/flying/notices',
        'Instructions from the CFI that have the status of future content of the Pilots Manual.',
        `${currentCfiNotices.length} in force`,
      ),
      file('pdfs-flying-cards-summary-1-pdf', 'What your card colour allows you to fly, and in what conditions.'),
      page(
        'emergency',
        '2025-01',
        'Emergency Procedures',
        '/safety/emergency',
        'What to do when there has been an accident. Know this before you need it.',
        'Revised January 2025',
      ),
      slot('ground-training-manual', 'Handling gliders on the ground and looking after the airfield.'),
    ],
  },
  {
    group: 'Every member',
    blurb: 'The rules and policies you agree to by belonging to the club.',
    items: [
      file('pdfs-generalrules-f2-pdf', 'The club’s general rules.'),
      file('pdfs-dlgc-health-and-safety-policy-v5-jan2026-pdf', 'How the club manages health and safety, and your part in it.'),
      file('pdfs-members-code-of-conduct-pdf', 'What members can expect of each other.'),
    ],
  },
  {
    group: 'If you are learning to fly',
    blurb: 'For students working towards solo and the Sailplane Pilot Licence.',
    items: [slot('student-pilots-guide', 'How training works at Camphill, from first flight to licence.')],
  },
  {
    group: 'If you do one of these duties',
    blurb: 'Only the ones that apply to the duty you do.',
    items: [
      slot('launch-marshals-manual', 'Running the launch point safely and efficiently.', 'Launch marshals', LAUNCH),
      slot('launch-speeds', 'Launch speeds by glider type.', 'Launch marshals and winch drivers', [...LAUNCH, ...WINCH]),
      slot('winch-operating-manual', 'Operating the winch.', 'Winch drivers', WINCH),
      file('manuals-dutyclerkmanual2018-pdf', 'The duty clerk’s job through the day.', 'Duty clerks', CLERKS),
    ],
  },
];

/** How many items apply to everybody — the first two groups. */
export const requiredOfEveryone = requiredReading.slice(0, 2).flatMap((g) => g.items);

/**
 * Who is asked to confirm what, as plain keys: everybody's documents, and the
 * extra ones for each duty. This is what the pages hand to the browser so a
 * member's count can follow the roles they hold (src/lib/roles.ts has
 * `requiredKeys`, which does the adding up).
 */
export const readingRule: ReadingRule = (() => {
  const byRole: ReadingRule['byRole'] = {};
  for (const item of requiredReading.flatMap((g) => g.items)) {
    for (const role of item.roles ?? []) (byRole[role] ??= []).push(item.key);
  }
  return { everyone: requiredOfEveryone.map((i) => i.key), byRole };
})();
