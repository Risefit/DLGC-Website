/**
 * THE DOCUMENT MANIFEST — the heart of the reorganisation.
 *
 * This single file replaces the old site's "Links Library", "Manuals" and
 * "Find It" pages. Every document the club holds is listed here once, with
 * enough metadata that it can be found by searching, browsing or filtering.
 *
 * ── The three tiers ────────────────────────────────────────────────────────
 *   'live'      Changes within a season. Surfaced on the dashboard.
 *               (fees, rotas, reciprocal clubs, current notices)
 *   'reference' Current and in force, consulted when needed.
 *               (manuals, rules, policies, training material)
 *   'archive'   Historic. Kept forever, fully searchable, out of the main flow.
 *               (minutes, newsletters, past accident reviews, superseded docs)
 *
 * ── Adding or changing a document ───────────────────────────────────────
 * Edit `documents-imported.ts`. Despite its name it is now maintained by hand:
 * it began as an import of the old site and is the one list of every file.
 * Add new rows at the TOP. This file adds the tiers, the few non-file entries,
 * and corrections to titles and owners (ENRICH below).
 *
 * Set `reviewDue` on anything that goes stale. The Documents page shows an
 * "overdue for review" flag automatically — this is what stops the library
 * silently accumulating withdrawn advice the way the old one did.
 *
 * ── Where the files are ─────────────────────────────────────────────────
 * A member signed in to the portal gets the club's own copy of a file; anyone
 * else is sent to the old members' site (src/lib/files.ts). Every page gets a
 * file's address from here.
 */

import { importedDocuments } from './documents-imported';
import { FILES_BASE } from '@/lib/files';
import { previewOpen } from '@/lib/auth';

export type Tier = 'live' | 'reference' | 'archive';

export type Category =
  | 'Manuals'
  | 'Rules & Constitution'
  | 'Policies'
  | 'Flying Cards'
  | 'Operational Notices'
  | 'Flight Training'
  | 'Ground Training'
  | 'Safety'
  | 'Aircraft & Maintenance'
  | 'Medicals'
  | 'Simulator'
  | 'Administrative'
  | 'Minutes & AGM'
  | 'Newsletters'
  | 'Advisory';

export type Audience =
  | 'All members'
  | 'Students'
  | 'Solo pilots'
  | 'Instructors'
  | 'Winch drivers'
  | 'Launch marshals'
  | 'Aircraft owners'
  | 'Committee';

export type Doc = {
  id: string;
  title: string;
  category: Category;
  tier: Tier;
  audience: Audience[];
  href: string;
  /** Shown under the title. Keep it useful — this is what search matches on. */
  note?: string;
  /** Version or issue date as printed on the document. */
  version?: string;
  /** Role that owns the content, so the next reader knows who to ask. */
  owner?: string;
  /** ISO date. Past dates surface an "overdue for review" flag. */
  reviewDue?: string;
  /** Marks a document kept for the record but no longer in force. */
  superseded?: boolean;
  format?: 'PDF' | 'Page' | 'Link' | 'Video';
  /** File size in bytes — shown to warn members on mobile data before a big download. */
  bytes?: number;
  /**
   * Groups documents belonging to a run (AGM minutes, newsletters, …). Any
   * series with more than two documents becomes a collection on the Archive
   * page with its own browsable listing, instead of 56 rows in a flat list.
   */
  series?: string;
  /**
   * Marks the standing place a re-issued document fills, e.g. 'pilots-manual'.
   * The first row with a given slot is the current version. See current().
   */
  slot?: string;
};


const curated: Doc[] = [
  { id: 'fees', title: 'Fees and Charges', category: 'Administrative', tier: 'live', audience: ['All members'], href: '/fees', note: 'All membership, launch, flying, hangarage, caravan and accommodation fees. Effective 1 March 2026.', version: 'From 1/3/2026', owner: 'Treasurer', reviewDue: '2027-01-31', format: 'Page' },
  { id: 'ft-glidingschool', title: 'Instructors Briefings (glidingschool.com)', category: 'Flight Training', tier: 'reference', audience: ['Instructors'], href: 'https://www.glidingschool.com/', format: 'Link' },
  { id: 'ft-spl-theory-bga', title: 'SPL Theory & Examinations (from BGA)', category: 'Flight Training', tier: 'reference', audience: ['Students'], href: 'https://www.gliding.co.uk/', format: 'Link' },
  { id: 'sf-emergency', title: 'Emergency Procedures', category: 'Safety', tier: 'live', audience: ['All members'], href: '/safety/emergency', note: 'What to do when there has been an accident or other emergency. Know this before you need it.', owner: 'Safety Officer', format: 'Page' },
  { id: 'sf-toolkit', title: 'BGA Safety Officer Toolkit', category: 'Safety', tier: 'reference', audience: ['Committee'], href: 'https://www.gliding.co.uk/', format: 'Link' },
  { id: 'am-bga-fees', title: 'BGA Airworthiness Fees (ARC / CofA)', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Aircraft owners'], href: 'https://www.gliding.co.uk/', format: 'Link' },
];


// ── the full library ───────────────────────────────────────────────────────
/**
 * `curated` are the few entries that are not files on the old site: pages of
 * this portal (fees, emergency procedures) and links to other organisations.
 *
 * `importedDocuments` is every file the club holds. That is the list to edit.
 */
const curatedKept = curated;

/**
 * WHERE THE FILES ARE SERVED FROM.
 *
 * The list stores every document as `/legacy/members/...`. Each becomes
 * `/files/members/...`, and the route behind that address
 * (src/app/files/[...path]/route.ts) sends a signed-in member to the club's
 * own private copy, and everybody else to the old site as before. See
 * src/lib/files.ts.
 */
export const servedFromOldSite = previewOpen;

const rebased: Doc[] = importedDocuments.map((d) =>
  d.href.startsWith('/legacy/')
    ? { ...d, href: FILES_BASE + d.href.slice('/legacy'.length) }
    : d
);

/**
 * The importer classified by folder, which put every ground-training document
 * under "Operational Notices" or "Manuals" and left the Ground Training section
 * of the Training page completely empty. The curated Ground Training entries
 * could not fill it either — they were placeholders pointing at the old Links
 * Library index, so `curatedKept` correctly drops them.
 *
 * This is the explicit, auditable correction: real documents, moved to where a
 * member would look for them. Add to it rather than editing the generated
 * manifest, which gets overwritten by the importer.
 */
const RECATEGORISE: Record<string, Doc['category']> = {
  'flyingnotices-canopy-care-pdf': 'Ground Training',
  'flyingnotices-care-of-the-airfield-pdf': 'Ground Training',
  'flyingnotices-ground-movements-pdf': 'Ground Training',
  'pdfs-understanding-flarm-v7-1116-pdf': 'Ground Training',
  'pdfs-hangarrashprevent-pdf': 'Ground Training',
  'pdfs-clm-prevent-hangar-rash-february-2019-pdf': 'Ground Training',
  'pdfs-clm-airfield-organisation-pdf': 'Ground Training',
  'pdfs-airfield-holes-pdf': 'Ground Training',
  'pdfs-asw15b-ground-handling-pdf': 'Ground Training',
  'pdfs-trailerparkrules-f2-pdf': 'Ground Training',
  'sossfiles-sosshintstips-trailer-towing-check-list-doc': 'Ground Training',
  'manuals-dlgc-gtm-080623-amended-030625-pdf': 'Ground Training',
};

/**
 * Better titles, notes, owners and review dates for documents whose imported
 * record only had a file name. Carried over from the retired hand-written
 * entries (src/content/retired). Add to this rather than typing over a row in
 * the imported list, so the corrections are easy to see in one place.
 *
 * `reviewDue` is the mechanism that flags stale documents. The dates here were
 * first guesses — the role named as `owner` should set real ones.
 */
const ENRICH: Record<string, Partial<Doc>> = {
  'manuals-pilots-manual-aug-2026-pdf': { title: 'Pilots Manual', note: 'The core operational manual for flying at Camphill.', owner: 'CFI', reviewDue: '2026-11-30' },
  'manuals-winch-operating-manual-2024-pdf': { title: 'Winch Operating Manual', owner: 'Winch Master' },
  'pdfs-flying-cards-summary-1-pdf': { title: 'Flying Cards — all colours explained', note: 'White, Red, Yellow and Green card privileges and requirements on one page.', owner: 'CFI' },
  'pdfs-reciprocal-membership-4-8-26-pdf': { title: 'Reciprocal Membership — list of clubs', note: 'Clubs with which DLGC has day-membership agreements.', owner: 'Membership Secretary', reviewDue: '2026-11-01' },
  'pdfs-generalrules-f2-pdf': { title: 'General Club Rules', owner: 'Secretary' },
  'pdfs-financialrules-f3-pdf': { title: 'Financial Rules', owner: 'Treasurer' },
  'pdfs-membershiprules-f2-pdf': { title: 'Membership Rules', owner: 'Membership Secretary' },
  'pdfs-dp-policy-v4-august-2026-pdf': { owner: 'Secretary', reviewDue: '2026-12-31' },
  'pdfs-dlgc-health-and-safety-policy-v5-jan2026-pdf': { title: 'Health and Safety Policy V5, January 2026', owner: 'Safety Officer' },
  'pdfs-authorised-launch-marshals-latest-pdf': { title: 'Launch Marshals — Authorised List', owner: 'Chief Launch Marshal' },
  'flyingnotices-sftymesurssysrevoct2017-pdf': { title: 'Safety Measures — System Description (October 2017)', owner: 'Safety Officer' },
  'glider-mtce-glider-workshop-charges-2026-2-pdf': { title: 'Workshop Facility and Charges 2026', note: 'The club’s aircraft workshop can be hired for repairs and maintenance.', owner: 'Aircraft Officer' },
  'misc-pages-dlgc-sportdvlpmntplanapril2013-revd-pdf': { title: 'Sport Development Plan (April 2013, rev D)', owner: 'Committee' },
  'pdfs-caravans-list-latest-pdf': { title: 'Caravan Sites — Holders and Waiting List', reviewDue: '2026-10-01' },
  'pdfs-clm-bulletin-launch-point-pocedures-jul-2023-pdf': { owner: 'Chief Launch Marshal' },
  // File names tidied into titles (November 2026). The files are untouched.
  'manuals-launch-marshal-manual-v5-9-aug-2026-pdf': { title: 'Launch Marshals Manual' },
  'manuals-launchspeedsv8-pdf': { title: 'Launch Speeds' },
  'manuals-dutyclerkmanual2018-pdf': { title: 'Duty Clerks Manual', version: '2018' },
  'pdfs-members-code-of-conduct-pdf': { title: 'Members’ Code of Conduct' },
  'manuals-student-pilots-guide-v9-02-final-pdf': { title: 'Student Pilots Guide' },
  'manuals-dlgc-gtm-080623-amended-030625-pdf': { title: 'Ground Training Manual' },
  'trainingdocs-dlgc-solo-authorisation-form-pdf': { title: 'Solo Authorisation Form' },
  'trainingdocs-spl-training-progress-cards-dlgc-spl-flight-training-prog': { title: 'SPL Flight Training Progress Card — Exercises 1 to 15 (v6.2)' },
  'trainingdocs-spl-training-progress-cards-dlgc-spl-flight-training-prog-2': { title: 'SPL Flight Training Progress Card — Exercises 16 and 17 (v1.2)' },
  'trainingdocs-pre-solo-theory-pre-solo-theory-briefing-series-overview-': { title: 'Pre-Solo Theory Briefings — Overview of the Series' },
  'trainingdocs-pre-solo-theory-pre-solo-theory-briefings-student-record-': { title: 'Pre-Solo Theory Briefings — Student Record Card' },
  'pdfs-student-pilot-theory-test-v23-pdf': { title: 'Student Pilot Theory Test (v23)' },
  'spl-advice-student-spl-advice-pdf': { title: 'Advice for SPL Students' },
  'spl-advice-white-card-advice-pdf': { title: 'Advice for White Card Pilots' },
  'pdfs-dlgc-medical-procedure-v2-2-pdf': { title: 'DLGC Medical Procedure (V2.2)', note: 'The current version. Earlier versions are in the document library.' },
  'pdfs-sim-camphill-simulator-guidelines-1r2-pdf': { title: 'Camphill Simulator — Guidelines (1R2)' },
  'pdfs-sim-simulator-start-up-notes-dave-pdf': { title: 'Simulator — Start-up Notes' },
  'pdfs-safetybriefnewmembs-pdf': { title: 'Safety Briefing for New Members' },
  'safety-cph-advice-to-members-doc': { title: 'Camphill — Advice to Members' },
};

export const documents: Doc[] = [...curatedKept, ...rebased].map((d) => ({
  ...d,
  ...(ENRICH[d.id] ?? {}),
  ...(RECATEGORISE[d.id] ? { category: RECATEGORISE[d.id] } : {}),
}));

/**
 * ONE PLACE FOR EVERY FILE LINK.
 *
 * Section pages (manuals, airspace, rotas, safety, club life) do not type a
 * file's address themselves. They ask for it here, by the document's `id`, so
 * the address is written once — in documents-imported.ts — and every page
 * follows when it changes or when the files move to new hosting.
 *
 * A wrong id stops the build with a message naming it, which is far better
 * than a dead link nobody notices.
 */
export function doc(id: string): Doc {
  const d = documents.find((x) => x.id === id);
  if (!d) throw new Error(`No document with id "${id}" in documents-imported.ts — a content file refers to it.`);
  return d;
}
export const file = (id: string): string => doc(id).href;

/**
 * For documents that are re-issued under a new file name — the Pilots Manual,
 * the Wave Box agreement. Rows in documents-imported.ts can carry a `slot`
 * ("pilots-manual"); the FIRST row with that slot is the current one. To
 * publish a new version, copy the row to the top of the list and change its
 * `href` and `version`. Nothing else needs editing.
 */
export function current(slot: string): Doc {
  const d = documents.find((x) => x.slot === slot);
  if (!d) throw new Error(`No document has slot "${slot}" in documents-imported.ts — a content file refers to it.`);
  return d;
}

/**
 * Collections are DERIVED, not hand-listed — so adding documents to a series
 * grows its collection automatically and nothing has to be maintained twice.
 * Threshold is 3: two documents of a kind stay as ordinary rows.
 */
export const COLLECTION_MIN = 3;

export type Collection = {
  slug: string;
  title: string;
  docs: Doc[];
  count: number;
  span: string;
  totalBytes: number;
};

export function collectionSlug(series: string): string {
  return series.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildCollections(source: Doc[]): Collection[] {
  const bySeries = new Map<string, Doc[]>();
  for (const d of source) {
    if (!d.series) continue;
    if (!bySeries.has(d.series)) bySeries.set(d.series, []);
    bySeries.get(d.series)!.push(d);
  }
  const out: Collection[] = [];
  for (const [series, list] of bySeries) {
    if (list.length < COLLECTION_MIN) continue;
    const years = list.map((d) => Number(d.version)).filter((y) => Number.isFinite(y) && y > 1900);
    const span = years.length
      ? (Math.min(...years) === Math.max(...years)
          ? `${Math.min(...years)}`
          : `${Math.min(...years)} – ${Math.max(...years)}`)
      : '';
    out.push({
      slug: collectionSlug(series),
      title: series,
      // newest first, then alphabetical — the order a member expects
      docs: [...list].sort(
        (a, b) => Number(b.version ?? 0) - Number(a.version ?? 0) || a.title.localeCompare(b.title)
      ),
      count: list.length,
      span,
      totalBytes: list.reduce((n, d) => n + ((d as { bytes?: number }).bytes ?? 0), 0),
    });
  }
  return out.sort((a, b) => b.count - a.count);
}

/** Every collection, across all tiers. */
export const collections: Collection[] = buildCollections(documents);

/**
 * Collections shown on the Archive page: a run qualifies once it has at least
 * COLLECTION_MIN historic documents in it.
 *
 * Note these are the FULL collections, not just their archive-tier members —
 * a member looking for "Committee Meeting Minutes" wants the whole run,
 * including this year's. This also keeps the count on the box identical to the
 * number of rows on the page behind it; deriving them differently meant the box
 * said 6 and the page listed 18.
 */
export const archiveCollections: Collection[] = collections.filter(
  (c) => c.docs.filter((d) => d.tier === 'archive').length >= COLLECTION_MIN
);

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

/**
 * Documents in a tier that are NOT reachable through a collection shown on the
 * Archive page — these get listed individually so nothing is hidden.
 */
export function looseDocs(tier: Doc['tier']): Doc[] {
  const shown = new Set(archiveCollections.flatMap((c) => c.docs.map((d) => d.id)));
  return documents.filter((d) => d.tier === tier && !shown.has(d.id));
}

// ── helpers ────────────────────────────────────────────────────────────────

export const categories = [...new Set(documents.map((d) => d.category))].sort();
export const audiences: Audience[] = ['All members', 'Students', 'Solo pilots', 'Instructors', 'Winch drivers', 'Launch marshals', 'Aircraft owners', 'Committee'];

export function isOverdue(d: Doc, today = new Date()): boolean {
  return !!d.reviewDue && new Date(d.reviewDue) < today;
}

export function searchDocs(docs: Doc[], q: string): Doc[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return docs;
  const terms = needle.split(/\s+/);
  return docs.filter((d) => {
    const hay = [d.title, d.note ?? '', d.category, d.version ?? '', d.owner ?? '', ...d.audience].join(' ').toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}
