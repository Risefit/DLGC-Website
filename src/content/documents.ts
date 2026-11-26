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
import { FILES_BASE, fileKind } from '@/lib/files';

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
  | 'Advisory'
  | 'Competitions & Trophies';

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
  /** Worked out from the file's own extension — see formatOf(). Only 'Page' and 'Link' are typed by hand. */
  format?: 'PDF' | 'Page' | 'Link' | 'Video' | 'Word' | 'PowerPoint' | 'Excel' | 'Text';
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
  { id: 'ft-spl-theory-bga', title: 'SPL Theory & Examinations (from BGA)', category: 'Flight Training', tier: 'reference', audience: ['Students'], href: 'https://members.gliding.co.uk/bga-training-organisation/spl-theoretical-knowledge-and-examinations/', format: 'Link' },
  { id: 'sf-emergency', title: 'Emergency Procedures', category: 'Safety', tier: 'live', audience: ['All members'], href: '/safety/emergency', note: 'What to do when there has been an accident or other emergency. Know this before you need it.', owner: 'Safety Officer', format: 'Page' },
  { id: 'sf-toolkit', title: 'BGA Club Safety Officer Toolkit', category: 'Safety', tier: 'reference', audience: ['Committee'], href: 'https://members.gliding.co.uk/safety/club-safety-officer-toolkit/', format: 'Link' },
  { id: 'am-bga-fees', title: 'BGA Fees — including airworthiness (ARC / CofA)', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Aircraft owners'], href: 'https://members.gliding.co.uk/fees-and-charges/', format: 'Link' },
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

  // November 2026, after a member called the document search "a bit of a
  // mess". The importer filed by folder, and the old site's `pdfs` folder held
  // everything, so "Administrative" had Bronze theory, simulator notes and
  // launch-point bulletins in it. Moved to where a member would look.
  'pdfs-brthryflightperformance-planning-pdf': 'Flight Training',
  'pdfs-brthryhumanfactors-pdf': 'Flight Training',
  'pdfs-brthrynavchartqs-pdf': 'Flight Training',
  'pdfs-brthrynavigation-pdf': 'Flight Training',
  'pdfs-spl-exercises-bga-cf-dlgc-v3-pdf': 'Flight Training',
  'pdfs-spl-for-student-pilots-v1-1-pdf': 'Flight Training',
  'pdfs-t21-bga-570-flying-notes-rev-2-pdf': 'Flight Training',
  'pdfs-train-pilot-thry-tst-v21-pdf': 'Flight Training',
  'pdfs-train-pilot-thry-tst-v22-pdf': 'Flight Training',
  'pdfs-sim-condor-start-up-with-tablet-revision-2-pdf': 'Simulator',
  'pdfs-sim-handling-an-online-session-pdf': 'Simulator',
  'pdfs-sim-sim-dem-men-pdf': 'Simulator',
  'pdfs-sim-briefing-for-mentors-at-dlgc-v2-3-pdf': 'Simulator',
  'pdfs-sim-instr-briefings-pdf': 'Simulator',
  'pdfs-sim-self-briefing-progress-v2-pdf': 'Simulator',
  'pdfs-sim-usingglidingschool-instructors-pdf': 'Simulator',
  'pdfs-clm-bulletin-collision-risk-avoidance-pdf': 'Operational Notices',
  'pdfs-clm-bulletin-reporting-wing-drop-occurances-pdf': 'Operational Notices',
  'pdfs-clm-bulletin-reporting-wing-drop-occurances-v2-pdf': 'Operational Notices',
  'pdfs-clm-bulletin-winter-flying-update151022-pdf': 'Operational Notices',
  'pdfs-bga-lrngfrmaccdnts-fitness-to-fly-and-intervention-pdf': 'Safety',
  'pdfs-low-overflights-reportingl-v1-pdf': 'Safety',
  'pdfs-pilot-conspicuity-pdf': 'Safety',
  'situational-awareness-bga-pdf': 'Safety',
  'pdfs-careofglidersreminders-pdf': 'Ground Training',
  'pdfs-sll-briefing-pdf': 'Safety',
  'pdfs-sll-briefing-v2-pdf': 'Safety',
  'pdfs-sll-briefing-v3-pdf': 'Safety',
  // The Blake Robertshaw task sheets and turn points, the trophies scheme and
  // the photo competition: forty-odd rows that were swamping the notices.
  'kenblake-blake-r-tp-s-pdf': 'Competitions & Trophies',
  'blake-rbshw-blake-r-tp-s-word-v8-19-pdf': 'Competitions & Trophies',
  'blake-rbshw-br-task-list-simple-2024-pdf': 'Competitions & Trophies',
  'pdfs-trophies-scheme-v5-dec21-pdf': 'Competitions & Trophies',
  'pdfs-trophies-scheme-v6-feb-26-arh-pdf': 'Competitions & Trophies',
  'pdfs-photo-comp-2025-short-list-pdf': 'Competitions & Trophies',
  'misc-pages-malcolm-brackburn-photo-comp-pdf': 'Competitions & Trophies',
};

/** Whole series that belong in a category of their own, wherever the importer put them. */
const RECATEGORISE_SERIES: Record<string, Doc['category']> = {
  'Blake-Robertshaw Task Graphics': 'Competitions & Trophies',
  'Inter-Club League': 'Competitions & Trophies',
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

  // ── November 2026: the rest of the file-name titles ──────────────────────
  // Only where the name is certain: an abbreviation spelled out, or the name
  // the club's own page already gives the document. The files are untouched,
  // and the search still finds a document by its old file name.
  // Administrative
  'pdfs-20260801-lait-radar-guidance-pdf': { title: 'Leeds Bradford Radar Guidance (LAIT), 1 August 2026' },
  'pdfs-aerotow-performance-pdf': { title: 'Aerotow Performance' },
  'pdfs-contactdtls-pdf': { title: 'Contact Details' },
  'pdfs-dfp-guidance-pdf': { title: 'Daily Flying Planner — How to Use It' },
  'pdfs-dfp-training-guidance-pdf': { title: 'Daily Flying Planner — Training Guidance' },
  'pdfs-dlgc-maoa-companies-house-pdf': { title: 'Memorandum and Articles of Association (DLGC, Companies House)' },
  'pdfs-maoa-at-companies-house-pdf': { title: 'Memorandum and Articles of Association at Companies House' },
  'pdfs-dmackenzieobituary-pdf': { title: 'D Mackenzie — Obituary' },
  'pdfs-fi-s-matrix-29-9-2026-pdf': { title: 'FI(S) Matrix, 29 September 2026' },
  'pdfs-fi-s-matrix-27-4-2026-pdf': { title: 'FI(S) Matrix, 27 April 2026' },
  'pdfs-fi-s-matrix-22apr2026-pdf': { title: 'FI(S) Matrix, 22 April 2026' },
  'pdfs-lttr-fm-hans-georg-pdf': { title: 'Letter from Hans-Georg' },
  'pdfs-membsdrctry220817-pdf': { title: 'Members Directory, 22 August 2017' },
  'pdfs-mf-prep-brfingrecrd-v3-pdf': { title: 'Mutual Flying — Preparation and Briefing Record (v3)' },
  'pdfs-mf-requirements-v4-pdf': { title: 'Mutual Flying — Requirements (v4)' },
  'pdfs-saris-list-20250814-pdf': { title: 'SARIs List, 14 August 2025' },
  'pdfs-webcam-viewer-instructs-pdf': { title: 'Webcam Viewer — Instructions' },
  'rally-rota-2026-pdf': { title: 'Vintage Rally Rota 2026' },
  'pdfs-vintrally-rota-21may2023-pdf': { title: 'Vintage Rally Rota, 21 May 2023' },
  'pdfs-reciprocal-membership-july-2026-pdf': { title: 'Reciprocal Membership — list of clubs, July 2026' },
  'misc-pages-junr-fnd-ad-pdf': { title: 'Camphill Junior Fund' },
  // Competitions and trophies
  'pdfs-trophies-scheme-v6-feb-26-arh-pdf': { title: 'Trophies Scheme (V6, February 2026)' },
  'pdfs-trophies-scheme-v5-dec21-pdf': { title: 'Trophies Scheme (V5, December 2021)' },
  'pdfs-photo-comp-2025-short-list-pdf': { title: 'Photo Competition 2025 — Short List' },
  'kenblake-blake-r-tp-s-pdf': { title: 'Blake Robertshaw — Turn Points' },
  'blake-rbshw-blake-r-tp-s-word-v8-19-pdf': { title: 'Blake Robertshaw — Turn Points (V8, 2019)' },
  'blake-rbshw-br-task-list-simple-2024-pdf': { title: 'Blake Robertshaw — Task List 2024' },
  // Flight training
  'pdfs-brthryflightperformance-planning-pdf': { title: 'Bronze Theory — Flight Performance and Planning' },
  'pdfs-brthryhumanfactors-pdf': { title: 'Bronze Theory — Human Factors' },
  'pdfs-brthrynavchartqs-pdf': { title: 'Bronze Theory — Navigation Chart Questions' },
  'pdfs-brthrynavigation-pdf': { title: 'Bronze Theory — Navigation' },
  'misc-pages-brthryflight-performance-planning-pps': { title: 'Bronze Theory — Flight Performance and Planning (slide show)' },
  'misc-pages-brthryflight-performance-planning-pptx': { title: 'Bronze Theory — Flight Performance and Planning (slides)' },
  'misc-pages-brthryflight-performance-planning-pptx-2': { title: 'Bronze Theory — Flight Performance and Planning (slides, second file)' },
  'misc-pages-brthry-airmanship-tem-ppt': { title: 'Bronze Theory — Airmanship and Threat and Error Management (slides)' },
  'misc-pages-brthry-operatnal-procs-ppt': { title: 'Bronze Theory — Operational Procedures (slides)' },
  'misc-pages-brthry-zoom-0-optnlprocs-mp4': { title: 'Bronze Theory — Operational Procedures (Zoom recording)' },
  'misc-pages-brthry-zoom-0-thrt-errmngmt-mp4': { title: 'Bronze Theory — Threat and Error Management (Zoom recording)' },
  'misc-pages-air-law-atc-procs-2022-pps': { title: 'Bronze Theory — Air Law and ATC Procedures 2022 (slide show)' },
  'pdfs-air-law-atc-procs-briefing-2022-pdf': { title: 'Bronze Theory — Air Law and ATC Procedures, briefing 2022' },
  'pdfs-brgnrl-skills-test-prep-30042021-pdf': { title: 'Bronze — General Skills Test Preparation, 30 April 2021' },
  'pdfs-spl-for-student-pilots-v1-1-pdf': { title: 'SPL for Student Pilots (v1.1)' },
  'pdfs-train-pilot-thry-tst-v21-pdf': { title: 'Pilot Theory Test (v21)' },
  'pdfs-train-pilot-thry-tst-v22-pdf': { title: 'Pilot Theory Test (v22)' },
  'pdfs-lnch-mrshls-auth-latest-pdf': { title: 'Launch Marshals (Authorised) — latest' },
  'pdfs-dlgc-ground-training-record-card-may-19-pdf': { title: 'Ground Training Record Card (May 2019)' },
  'pdfs-dlgc-passenger-carrying-training-record-pdf': { title: 'Passenger Carrying Training Record' },
  // Simulator
  'pdfs-sim-condor-start-up-with-tablet-revision-2-pdf': { title: 'Simulator — Condor start-up with the tablet (revision 2)' },
  'pdfs-sim-handling-an-online-session-pdf': { title: 'Simulator — Handling an online session' },
  'pdfs-sim-briefing-for-mentors-at-dlgc-v2-3-pdf': { title: 'Simulator — Briefing for Mentors (v2.3)' },
  'pdfs-sim-instr-briefings-pdf': { title: 'Simulator — Instructor Briefings' },
  'pdfs-sim-self-briefing-progress-v2-pdf': { title: 'Simulator — Self-Briefing Progress (v2)' },
  'pdfs-sim-usingglidingschool-instructors-pdf': { title: 'Simulator — Using glidingschool.com (instructors)' },
  // Flying cards
  'misc-pages-flying-cards-whitecard-for-website-oct-2025-pdf': { title: 'White Card (October 2025)' },
  'misc-pages-flying-cards-red-card-v7-4-jan-2026-all-sides-for-website-p': { title: 'Red Card (V7.4, January 2026)' },
  'misc-pages-flying-cards-yellowcard1403-pdf': { title: 'Yellow Card (issue 1403)' },
  'misc-pages-flying-cards-greencard1403-pdf': { title: 'Green Card (issue 1403)' },
  'misc-pages-flying-cards-bluecard1406-pdf': { title: 'Blue Card (issue 1406)' },
  'pdfs-red-card-theory-test-v23-final-pdf': { title: 'Red Card Theory Test (V23)' },
  // Ground training and manuals
  'pdfs-careofglidersreminders-pdf': { title: 'Care of Gliders — Reminders' },
  'pdfs-hangarrashprevent-pdf': { title: 'Preventing Hangar Rash' },
  'pdfs-clm-prevent-hangar-rash-february-2019-pdf': { title: 'Preventing Hangar Rash — Chief Launch Marshal, February 2019' },
  'pdfs-clm-airfield-organisation-pdf': { title: 'Airfield Organisation — Chief Launch Marshal' },
  'pdfs-trailerparkrules-f2-pdf': { title: 'Trailer Park Rules' },
  'pdfs-caravanparkrules-f2-pdf': { title: 'Caravan Park Rules' },
  'pdfs-understanding-flarm-v7-1116-pdf': { title: 'Understanding FLARM (V7)' },
  'sossfiles-sosshintstips-trailer-towing-check-list-doc': { title: 'Trailer Towing Checklist' },
  'manuals-air-pol-sk-94-manual-pdf': { title: 'Air-Pol SK-94 Parachute Manual' },
  'manuals-parachute-manual-2019v2-pdf': { title: 'Parachute Manual (2019, v2)' },
  'manuals-duty-clerks-trainees-update-pdf': { title: 'Duty Clerks Trainees Guide' },
  'manuals-splicing-3-strand-rope-pdf': { title: 'Splicing 3-Strand Rope and Cable' },
  'manuals-splicing-dyneema-with-video-pdf': { title: 'Splicing Dyneema' },
  'manuals-steel-corestropassembly-dlgc-pdf': { title: 'Steel Core Strop Assembly' },
  'manuals-training-exercises-v1-pdf': { title: 'Training (Pre-solo) Exercises (v1)' },
  'manuals-winch-operating-manual-pdf': { title: 'Winch Operating Manual (undated file)' },
  'manuals-pilots-manual-jan-2023-2-pdf': { title: 'Pilots Manual, January 2023' },
  'manuals-pilots-manual-may-2024-pdf': { title: 'Pilots Manual, May 2024' },
  'manuals-pilots-manual-nov-2025-pdf': { title: 'Pilots Manual, November 2025' },
  'manuals-launch-marshal-manual-v5-7-jan-2023-pdf': { title: 'Launch Marshals Manual (V5.7, January 2023)' },
  'manuals-launch-marshal-manual-v5-8-jan-2025-pdf': { title: 'Launch Marshals Manual (V5.8, January 2025)' },
  'manuals-launch-marshal-manual-v5-8-mar-2026-pdf': { title: 'Launch Marshals Manual (V5.8, March 2026)' },
  'manuals-dlgc-gtm-080623-amended-130225-pdf': { title: 'Ground Training Manual (amended February 2025)' },
  'manuals-ground-trainng-manual-v-080623-pdf': { title: 'Ground Training Manual (June 2023)' },
  'manuals-student-pilots-guide-prev-ptg-v9-01-pdf': { title: 'Student Pilots Guide (v9.01)' },
  'manuals-pilots-training-guide-v-8-pdf': { title: 'Pilots Training Guide (v8)' },
  // Aircraft
  'manuals-glider-manuals-ask13-dsgc-manual-2013-pdf': { title: 'ASK 13 Flight Manual (DSGC, 2013)' },
  'manuals-glider-manuals-asw15b-flight-manual-pdf': { title: 'ASW 15B Flight Manual' },
  'manuals-glider-manuals-k18-knm-flight-manual-pdf': { title: 'ASK 18 Flight Manual (KNM)' },
  'manuals-glider-manuals-ka8-manuel-de-vol-en-anglais-pdf': { title: 'K8 Flight Manual (in English)' },
  'manuals-glider-manuals-szd50-3-puchacz-g-chep-flight-manual-pdf': { title: 'Puchacz SZD-50-3 Flight Manual (G-CHEP)' },
  'glider-mtce-owners-responsibilities-part-21-aircraft-under-part-m-ligh': { title: 'Owners’ Responsibilities — Part 21 Aircraft under Part-M Light' },
  'glider-mtce-warwick-s-pp-show-ppsx': { title: 'Warwick’s PowerPoint Show' },
  // Operational notices and airspace
  'pdfs-833trnscvrops-pdf': { title: '8.33 kHz Transceiver Operations' },
  'pdfs-clm-bulletin-collision-risk-avoidance-pdf': { title: 'Chief Launch Marshal’s Bulletin — Collision Risk Avoidance' },
  'pdfs-clm-bulletin-reporting-wing-drop-occurances-v2-pdf': { title: 'Chief Launch Marshal’s Bulletin — Reporting Wing Drop Occurrences (V2)' },
  'pdfs-clm-bulletin-reporting-wing-drop-occurances-pdf': { title: 'Chief Launch Marshal’s Bulletin — Reporting Wing Drop Occurrences' },
  'pdfs-clm-bulletin-winter-flying-update151022-pdf': { title: 'Chief Launch Marshal’s Bulletin — Winter Flying Update, 15 October 2022' },
  'pdfs-clm-air-band-radio-receiver-installed-in-the-tow-out-vehicle-octo': { title: 'Chief Launch Marshal’s Bulletin — Air-band Radio Receiver in the Tow-out Vehicle' },
  'pdfs-clm-launch-marshal-morning-briefing-document-pdf': { title: 'Launch Marshal’s Morning Briefing Document' },
  'pdfs-clm-winch-launch-signalling-procedure-if-the-automated-lights-fai': { title: 'Winch Launch Signalling if the Automated Lights Fail (V1)' },
  'pdfs-launch-marshals-v18c-010521-pdf': { title: 'Launch Marshals List (V18c, 1 May 2021)' },
  'pdfs-trained-launch-marshals-v15-160320-pdf': { title: 'Trained Launch Marshals List (V15, 16 March 2020)' },
  'pdfs-outlanding-fields-v4-pdf': { title: 'Outlanding Fields (V4)' },
  'airspace-airspace-safety-ra-t-s-pdf': { title: 'Airspace Safety — RA(T)s and the Red Arrows' },
  'airspace-bga-airspace-letter-june-15-pdf': { title: 'BGA Letter to Pilots on Airspace, June 2015' },
  'airspace-cas-closure-information-pdf': { title: 'Controlled Airspace Closure Information' },
  'airspace-east-mids-loa-briefing-notesv3-pdf': { title: 'East Midlands Letter of Agreement — Briefing Notes (V3)' },
  'airspace-faqsv9-pdf': { title: 'Airspace — Frequently Asked Questions (v9)' },
  'airspace-wave-box-and-l975-crossing-briefing-v3-1-pdf': { title: 'Camphill Wave Box and L975 Crossing — Briefing (V3.1)' },
  'airspace-scottish-bga-dlgc-loa-071126-pdf': { title: 'Wave Box and Airway Crossing — Letter of Agreement, 7 November 2026' },
  'airspace-scottish-bga-dlgc-loa-rev-pdf': { title: 'Wave Box and Airway Crossing — Letter of Agreement (earlier revision)' },
  'airspace-derbyshire-nsga-pdf': { title: 'Derbyshire NSGA (Non-SSR Gliding Area)' },
  // Policies and medicals
  'pdfs-dlgc-harassment-and-bullying-policy-approved1-1-pdf': { title: 'Harassment and Bullying Policy (v1.1)' },
  'pdfs-dlgc-spl-passenger-carrying-policy-pdf': { title: 'SPL Passenger Carrying Policy' },
  'pdfs-dlgc-health-safety-policy-v2-feb2020-pdf': { title: 'Health and Safety Policy V2, February 2020' },
  'pdfs-privacy-policy-may-2018-pdf': { title: 'Privacy Policy (May 2018)' },
  'pdfs-dlgc-medical-procedure-v2-1-pdf': { title: 'DLGC Medical Procedure (V2.1)' },
  'pdfs-dlgc-medical-procedure-v2-0-pdf': { title: 'DLGC Medical Procedure (V2.0)' },
  // Safety
  'safety-hbrowningslides-pptx': { title: 'H Browning — slides' },
  'safety-jku-report-for-members-doc': { title: 'JKU — Report for Members' },
  'safety-tooearlyrotationarticle-pdf': { title: 'Too Early Rotation — article' },
  'safety-glider-integrity-briefing-published-pdf': { title: 'Glider Integrity Briefing' },
  'safety-another-gc-incidents-pdf': { title: 'Incident Reports at Another Gliding Club' },
  'safety-tmg-safety-guidelines-v4-4-pdf': { title: 'TMG Safety Guidelines (V4.4)' },
  'safety-bgacushionsnotejul2018-doc': { title: 'BGA Note on Cushions (July 2018)' },
  'pdfs-low-overflights-reportingl-v1-pdf': { title: 'Low Overflights — How to Report One (V1)' },
  'situational-awareness-bga-pdf': { title: 'Situational Awareness (BGA)' },
  'pdfs-sll-briefing-v3-pdf': { title: 'Safety Lessons Log — Briefing (v3)' },
  'pdfs-sll-briefing-v2-pdf': { title: 'Safety Lessons Log — Briefing (v2)' },
  'pdfs-sll-briefing-pdf': { title: 'Safety Lessons Log — Briefing (first issue)' },
  // Silver Seekers — the names the Society's own page gives them
  'sossfiles-sosshintstips-a-personal-view-c-c-e-doc': { title: 'Getting the Cross Country Endorsement — a personal view' },
  'sossfiles-sossarticles-coaching-corner1-pdf': { title: 'Coaching Corner — Preparation (Silver distance, part A)' },
  'sossfiles-sossarticles-coaching-corner2-pdf': { title: 'Coaching Corner — The Flight (Silver distance, part B)' },
  'sossfiles-sosshintstips-comments-received-doc': { title: 'Hints and Tips — Comments Received' },
  'sossfiles-sossarticles-ew-logger-brief-pdf': { title: 'Logging the Flight — EW logger brief' },
  'sossfiles-sossarticles-field-landing-martin-fr-pdf': { title: 'A Silver Distance Attempt, and a Field Landing' },
  'sossfiles-sossarticles-height-problems-oo-pdf': { title: 'The 1% Rule — height problems' },
  'sossfiles-sosshintstips-landing-out-kit-doc': { title: 'Landing Out Kit' },
  'sossfiles-sossarticles-mysilvdist-clnh-1-pdf': { title: 'Silver Distance — CH' },
  'sossfiles-sosshintstips-notes-for-50k-doc': { title: 'Notes for 50K — checklist' },
  'sossfiles-sosshintstips-notes-on-cross-country-endorsement-doc': { title: 'Notes on the Cross Country Endorsement' },
  'sossfiles-sossarticles-pmsilverc-pdf': { title: 'Silver Distance — PM' },
  'sossfiles-sossarticles-silvdistwhatcangowrong-pdf': { title: 'Silver Distance Pitfalls — what can go wrong' },
  'sossfiles-sossarticles-silver-c-how-did-that-happen-docx': { title: 'Silver C — How Did That Happen?' },
  'sossfiles-sossarticles-silver-distance-ph-1-pdf': { title: 'Silver Distance — PH' },
  'sossfiles-sossarticles-silver-distance-sm-pdf': { title: 'Silver Distance — SM' },
  'sossfiles-sossarticles-silver-journey-gw-1-pdf': { title: 'Silver Journey — GW' },
  'sossfiles-sossarticles-silver-landings-1-pdf': { title: 'Silver Distance Landings' },
  'sossfiles-sossarticles-silver-landings-pdf': { title: 'Silver Distance Landings (first file)' },
  'sossfiles-sossarticles-silverbadgetraining-pdf': { title: 'Silver Badge Training' },
  'sossfiles-sossarticles-silverdistchrisknapp-1-pdf': { title: 'Silver Distance — CK' },
  'sossfiles-sossarticles-silverdistchrisknapp2-1-pdf': { title: 'Silver Distance — CK, again' },
  'sossfiles-sossarticles-silverdistlizmartin-pdf': { title: 'Silver Distance — LM' },
  'sossfiles-sossarticles-silverdistmartinwilcox-pdf': { title: 'Silver Distance — MW' },
  'sossfiles-sossarticles-slvrdistdjones-1-pdf': { title: 'Silver Distance — DJ' },
  'sossfiles-sossarticles-slvrdststrtddsn-doc': { title: 'Silver Distance — SD' },
  'sossfiles-sossarticles-st-auban-mountain-flying-safety-pdf': { title: 'Mountain Flying Safety (St Auban)' },
  'sossfiles-sossarticles-syllabus-pdf': { title: 'Silver Seekers — Syllabus' },
  'sossfiles-sossarticles-the-secrets-of-getting-away-v2-pdf': { title: 'The Secrets of Getting Away (v2)' },
  'sossfiles-sosshintstips-travel-check-list-page1-doc': { title: 'Travel Checklist, page 1' },
  'sossfiles-sosshintstips-travel-check-list-page-2-doc': { title: 'Travel Checklist, page 2' },
  'trainingdocs-articles-altimetry7-pdf': { title: 'Altimetry' },
  'trainingdocs-articles-look-where-you-re-going001-pdf': { title: 'Look Where You’re Going' },
  'trainingdocs-articles-piggott-article-reduced-g-pdf': { title: 'Reduced G — Piggott article' },
  'trainingdocs-articles-s-g-winch-launch-article-pdf': { title: 'Winch Launching — Sailplane & Gliding article' },
  'trainingdocs-articles-winch-launching-in-cross-winds-v6-pdf': { title: 'Winch Launching in Cross Winds (v6)' },
};

/** What sort of file a row is, from its own address rather than the importer's guess. */
function formatOf(d: Doc): Doc['format'] {
  if (d.format === 'Page' || d.format === 'Link') return d.format;
  const kind = fileKind(d.href);
  if (kind) return kind.label === 'Word document' ? 'Word' : kind.label === 'PowerPoint' ? 'PowerPoint' : 'Excel';
  const ext = (d.href.match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toLowerCase();
  if (ext === 'mp4' || ext === 'mov') return 'Video';
  if (ext === 'txt') return 'Text';
  return d.format ?? 'PDF';
}

/**
 * Titles the importer built from a pattern, put right for every row at once:
 * the Blake Robertshaw task sheets ("BR07", "Br18 Pd"), provisional minutes
 * ("((P))") and a stray "-1".
 */
function tidyTitle(d: Doc): string {
  if (d.series === 'Blake-Robertshaw Task Graphics') {
    const m = d.title.match(/^BR\s*0*(\d+)(?:\s+(\w+))?$/i);
    if (m) return `Blake Robertshaw task ${m[1]}${m[2] ? ` (${m[2].toUpperCase()})` : ''}`;
  }
  return d.title
    .replace(/ \(\(P\)\)$/, ' (provisional)')
    .replace(/^AGM Calling Notice -1 — /, 'AGM Calling Notice — ');
}

export const documents: Doc[] = [...curatedKept, ...rebased].map((row) => {
  const d: Doc = { ...row, title: tidyTitle(row), ...(ENRICH[row.id] ?? {}) };
  const category = RECATEGORISE[d.id] ?? (d.series ? RECATEGORISE_SERIES[d.series] : undefined);
  return { ...d, ...(category ? { category } : {}), format: formatOf(d) };
});

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

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
/** 1–12 for a title that names a month, 0 for one that does not. */
function monthOf(title: string): number {
  const t = title.toLowerCase();
  for (let i = MONTHS.length - 1; i >= 0; i--) if (new RegExp(`\\b${MONTHS[i]}\\b`).test(t)) return i + 1;
  return 0;
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
      // Newest first — by year, then by the month in the title ("— July 2026"),
      // so a year of minutes reads December down to January, not alphabetically.
      docs: [...list].sort(
        (a, b) =>
          Number(b.version ?? 0) - Number(a.version ?? 0) ||
          monthOf(b.title) - monthOf(a.title) ||
          a.title.localeCompare(b.title)
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

/** "Advisory" was the importer's word. Members are shown what is actually in it. */
export const categoryLabel = (c: string) => (c === 'Advisory' ? 'Articles & Advice' : c);

export const categories = [...new Set(documents.map((d) => d.category))].sort();
export const audiences: Audience[] = ['All members', 'Students', 'Solo pilots', 'Instructors', 'Winch drivers', 'Launch marshals', 'Aircraft owners', 'Committee'];

export function isOverdue(d: Doc, today = new Date()): boolean {
  return !!d.reviewDue && new Date(d.reviewDue) < today;
}

/** The file's own name, so a search for the old name ("BrThry", "BR07") still finds it. */
const fileName = (d: Doc) => {
  try {
    return decodeURIComponent(d.href.split('/').pop() ?? '');
  } catch {
    return '';
  }
};

/**
 * SEARCH, BEST MATCH FIRST.
 *
 * Every word typed must appear somewhere in the row. A word in the title
 * counts for far more than one in the description; a title that starts with
 * what was typed comes top; current documents come ahead of archived ones and
 * superseded versions go last. With nothing typed the list comes back as it
 * was given.
 */
export function rankDocs(docs: Doc[], q: string): Doc[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return docs;
  const terms = needle.split(/\s+/);
  const scored: [number, Doc][] = [];
  for (const d of docs) {
    const title = d.title.toLowerCase();
    const rest = [d.note ?? '', d.category, d.version ?? '', d.owner ?? '', d.series ?? '', fileName(d), ...d.audience]
      .join(' ')
      .toLowerCase();
    let score = 0;
    let all = true;
    for (const t of terms) {
      const at = title.indexOf(t);
      if (at >= 0) score += at === 0 || /[^a-z0-9]/.test(title[at - 1]) ? 6 : 4;
      else if (rest.includes(t)) score += 1;
      else {
        all = false;
        break;
      }
    }
    if (!all) continue;
    if (title.includes(needle)) score += 4;
    if (title.startsWith(needle)) score += 3;
    score += d.tier === 'live' ? 1.5 : d.tier === 'reference' ? 1 : 0;
    if (d.superseded) score -= 2;
    scored.push([score, d]);
  }
  return scored.sort((a, b) => b[0] - a[0] || a[1].title.localeCompare(b[1].title)).map(([, d]) => d);
}

/** The same search without the ordering, for pages that sort their own way. */
export function searchDocs(docs: Doc[], q: string): Doc[] {
  if (!q.trim()) return docs;
  const hits = new Set(rankDocs(docs, q).map((d) => d.id));
  return docs.filter((d) => hits.has(d.id));
}
