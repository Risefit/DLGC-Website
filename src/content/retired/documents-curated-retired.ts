/**
 * RETIRED — the hand-written document entries that were never shown.
 *
 * These 143 entries were written during the first audit of the old site, before
 * the old site's files were imported. Almost all of them pointed at the old
 * Links Library index page rather than at a document, so `documents.ts` filtered
 * them out at run time and showed the imported copies instead. They sat in
 * `documents.ts` looking like the place to edit a document, and edits made to
 * them changed nothing on the site.
 *
 * They were moved here on 16 November 2026 rather than deleted, because the
 * titles, owners and notes are a record of how the library was first thought
 * about. Where an entry had a clear match in the imported list, its title, note,
 * owner and review date were carried across (see ENRICH in documents.ts).
 *
 * NOTHING IMPORTS THIS FILE. It is not part of the site. To change a document,
 * edit `documents-imported.ts`.
 */

import type { Doc } from '../documents';

const OLD = 'https://www.dlgc.org.uk/members';

export const retiredCuratedDocuments: Doc[] = [
  // ── LIVE ────────────────────────────────────────────────────────────────
  { id: 'reciprocal', title: 'Reciprocal Membership — list of clubs', category: 'Administrative', tier: 'live', audience: ['All members'], href: `${OLD}/links-library.asp`, note: 'Clubs with which DLGC has day-membership agreements, and the limits of each agreement. Changes several times a year.', owner: 'Membership Secretary', reviewDue: '2026-11-01', format: 'PDF' },
  { id: 'rota-instructors', title: 'Instructors Rota — current quarter', category: 'Operational Notices', tier: 'live', audience: ['All members', 'Instructors'], href: `${OLD}/lists/26Q2%20Instructors%20Rota.pdf`, note: 'Who is instructing on which day.', version: '2026 Q2', owner: 'CFI', format: 'PDF' },
  { id: 'flying-cards', title: 'Flying Cards — all colours explained', category: 'Flying Cards', tier: 'live', audience: ['All members'], href: `${OLD}/pdfs/Flying%20Cards%20Summary-1.pdf`, note: 'White, Red, Yellow and Green card privileges and requirements. Determines what you may fly and in what conditions.', owner: 'CFI', format: 'PDF' },
  { id: 'weather-minima', title: 'Weather Minima', category: 'Operational Notices', tier: 'live', audience: ['All members'], href: `${OLD}/links-library.asp`, note: 'Minimum conditions for flying, by card colour.', owner: 'CFI', format: 'PDF' },
  { id: 'dfp-guidance', title: 'Daily Flying Planner — user guidance', category: 'Operational Notices', tier: 'live', audience: ['All members'], href: `${OLD}/links-library.asp`, note: 'How to book yourself onto a flying day in Members’ Admin.', format: 'PDF' },
  { id: 'airfield-condition', title: 'Airfield Condition Notice — deep holes, north rough patch', category: 'Operational Notices', tier: 'live', audience: ['All members'], href: `${OLD}/links-library.asp`, note: 'Notice from Belle Tyler, July 2026. Affects long landings to the north.', version: 'July 2026', format: 'PDF' },

  // ── REFERENCE: Manuals ──────────────────────────────────────────────────
  { id: 'man-pilots', title: 'Pilots Manual', category: 'Manuals', tier: 'reference', audience: ['All members'], href: `${OLD}/manuals/Pilots%20Manual%20Aug%202026.pdf`, note: 'The core operational manual for flying at Camphill.', version: 'August 2026', owner: 'CFI', reviewDue: '2026-11-30', format: 'PDF' },
  { id: 'man-winch', title: 'Winch Operating Manual', category: 'Manuals', tier: 'reference', audience: ['Winch drivers', 'Instructors'], href: `${OLD}/manuals/Winch%20Operating%20Manual_2024.pdf`, version: '2024', owner: 'Winch Master', format: 'PDF' },
  { id: 'man-ground', title: 'Ground Training Manual', category: 'Manuals', tier: 'reference', audience: ['Students', 'Instructors'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'man-launch', title: 'Launch Marshals Manual', category: 'Manuals', tier: 'reference', audience: ['Launch marshals'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'man-student', title: 'Student Pilots Guide', category: 'Manuals', tier: 'reference', audience: ['Students'], href: `${OLD}/manuals_webpage.asp`, note: 'Previously called the Pilots Training Guide.', format: 'PDF' },
  { id: 'man-dutyclerk', title: 'Duty Clerks Manual', category: 'Manuals', tier: 'reference', audience: ['All members'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'man-dutyclerk-trainee', title: 'Duty Clerks Trainees Guide', category: 'Manuals', tier: 'reference', audience: ['All members'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'man-launchspeeds', title: 'Launch Speeds & Weak Links by Glider', category: 'Manuals', tier: 'reference', audience: ['All members', 'Winch drivers'], href: `${OLD}/manuals_webpage.asp`, note: 'Correct launch speed and weak link for every type in the fleet.', owner: 'CFI', format: 'PDF' },
  { id: 'man-parachute', title: 'Parachute Manual', category: 'Manuals', tier: 'reference', audience: ['All members'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'man-airpol', title: 'Air Pol Parachute', category: 'Manuals', tier: 'reference', audience: ['All members'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'man-splicing-rope', title: 'Splicing Rope & Cable', category: 'Manuals', tier: 'reference', audience: ['Winch drivers'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'man-splicing-dyneema', title: 'Splicing Dyneema', category: 'Manuals', tier: 'reference', audience: ['Winch drivers'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'man-strop', title: 'Steel Core Strop Assembly', category: 'Manuals', tier: 'reference', audience: ['Winch drivers'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'man-presolo', title: 'Training (Pre-solo) Exercises', category: 'Manuals', tier: 'reference', audience: ['Students', 'Instructors'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },

  // Flight manuals — club fleet
  { id: 'fm-k8', title: 'Flight Manual — K8', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/manuals_webpage.asp`, note: 'Each Flight Manual is specific to the glider serial number it belongs to; general guidance is generic. If in doubt refer to the FM retained with the glider.', format: 'PDF' },
  { id: 'fm-ask13', title: 'Flight Manual — ASK 13', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'fm-ask18', title: 'Flight Manual — ASK 18', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'fm-asw15', title: 'Flight Manual — ASW 15B', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'fm-puchacz', title: 'Flight Manual — Puchacz', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'brief-t21', title: 'T21 Flying Notes', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'brief-asw15', title: 'ASW15 Briefing Notes', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'brief-asw15b-gh', title: 'ASW 15B Ground Handling', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },

  // ── REFERENCE: Rules & Constitution ─────────────────────────────────────
  { id: 'moa', title: 'Memorandum & Articles of Association', category: 'Rules & Constitution', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, note: 'The club’s constitution.', owner: 'Secretary', format: 'PDF' },
  { id: 'rules-general', title: 'General Club Rules', category: 'Rules & Constitution', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, owner: 'Secretary', format: 'PDF' },
  { id: 'rules-financial', title: 'Financial Rules', category: 'Rules & Constitution', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, owner: 'Treasurer', format: 'PDF' },
  { id: 'rules-membership', title: 'Membership Rules', category: 'Rules & Constitution', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, owner: 'Membership Secretary', format: 'PDF' },
  { id: 'rules-caravan', title: 'Caravan Park Rules', category: 'Rules & Constitution', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'rules-trailer', title: 'Trailer Park Rules', category: 'Rules & Constitution', tier: 'reference', audience: ['All members', 'Aircraft owners'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'membership-ifs', title: 'Membership / IFs — Principles & Guidance', category: 'Rules & Constitution', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'trophies-scheme', title: 'Trophies Scheme', category: 'Rules & Constitution', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },

  // ── REFERENCE: Policies ─────────────────────────────────────────────────
  { id: 'pol-child', title: 'Child Protection Policy', category: 'Policies', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, owner: 'Secretary', reviewDue: '2026-12-31', format: 'PDF' },
  { id: 'pol-child-advice', title: 'Child Protection — Advice and Guidance', category: 'Policies', tier: 'reference', audience: ['All members', 'Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'pol-data', title: 'Data Protection Policy', category: 'Policies', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, owner: 'Secretary', reviewDue: '2026-12-31', format: 'PDF' },
  { id: 'pol-privacy', title: 'Privacy Responsibilities', category: 'Policies', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'pol-equity', title: 'Equity and Opportunities Policy', category: 'Policies', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'pol-harassment', title: 'Harassment & Bullying Policy', category: 'Policies', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'pol-hs', title: 'Health & Safety Policy', category: 'Policies', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, owner: 'Safety Officer', format: 'PDF' },
  { id: 'pol-conduct', title: 'Code of Conduct', category: 'Policies', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },

  // ── REFERENCE: Operational Notices ──────────────────────────────────────
  { id: 'op-tl', title: 'Trial Lessons Guidelines', category: 'Operational Notices', tier: 'reference', audience: ['Instructors', 'All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-if-booking', title: 'Introductory Flights (IFs) — Booking & Flying', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-lowoverflight', title: 'Low Overflights — reporting link', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'Link' },
  { id: 'op-launchmarshals', title: 'Launch Marshals — Authorised List', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, owner: 'Chief Launch Marshal', format: 'PDF' },
  { id: 'op-mentors', title: 'Daily Mentors — Role Description', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-mutual-req', title: 'Mutual Flying — Requirements', category: 'Operational Notices', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/links-library.asp`, owner: 'CFI', format: 'PDF' },
  { id: 'op-mutual-brief', title: 'Mutual Flying — Preparation and Briefing', category: 'Operational Notices', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-gliderhire', title: 'Glider Hire — Fees & Use', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-safety-measures', title: 'Safety Measures — System Description', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, owner: 'Safety Officer', format: 'PDF' },
  { id: 'op-833', title: '"833" Radios — Channels and Operation', category: 'Operational Notices', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-flarm', title: 'FLARM IDs for Camphill Gliders', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'Link' },
  { id: 'op-topup', title: 'Topping Up your Flying Account', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-webcam', title: 'Webcam Viewer Instructions', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-hangar', title: 'Hangar Layout (from May 2022)', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, note: 'How the hangar is packed.', version: 'May 2022', format: 'PDF' },
  { id: 'op-hairpin', title: 'Hairpin Bend — Trailers To/From Gt Hucklow', category: 'Operational Notices', tier: 'reference', audience: ['All members', 'Aircraft owners'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-moles', title: 'Mole Trapping — How To', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-oo', title: 'Official Observers — Role and List', category: 'Operational Notices', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-fields-crops', title: 'Field Landings — Crops Advice', category: 'Operational Notices', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-fields-local', title: 'Local Fields for Out Landings', category: 'Operational Notices', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-airfields-uk', title: 'UK Airfields & Outlandings (Paul Ruskin)', category: 'Operational Notices', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'op-blake-tp', title: 'Blake Robertshaw Turnpoint Photos', category: 'Operational Notices', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/blake-rbshw/blake_rbshw_briefE.asp`, format: 'Page' },

  // ── REFERENCE: Flight Training ──────────────────────────────────────────
  { id: 'ft-spl-intro', title: 'Introduction to the SPL Training Course', category: 'Flight Training', tier: 'reference', audience: ['Students'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-spl-prog', title: 'SPL Course Training Programme (in full)', category: 'Flight Training', tier: 'reference', audience: ['Students', 'Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-syllabus', title: 'DLGC / SPL Syllabus Comparison', category: 'Flight Training', tier: 'reference', audience: ['Students', 'Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-classroom', title: 'Classroom Briefings', category: 'Flight Training', tier: 'reference', audience: ['Students', 'Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-card-1-15', title: 'SPL Flight Training Progress Card — Exercises 1 to 15', category: 'Flight Training', tier: 'reference', audience: ['Students', 'Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-card-16-17', title: 'SPL Flight Training Progress Card — Exercises 16 & 17', category: 'Flight Training', tier: 'reference', audience: ['Students', 'Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-instr-notes', title: 'SPL Flight Training Instructor Notes', category: 'Flight Training', tier: 'reference', audience: ['Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-solo-auth', title: 'SPL Solo Authorisation Card', category: 'Flight Training', tier: 'reference', audience: ['Students', 'Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-buddy', title: 'Buddy Session(s) Checklist', category: 'Flight Training', tier: 'reference', audience: ['Students'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-matrix', title: 'Flight Instructors Matrix', category: 'Flight Training', tier: 'reference', audience: ['Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-record-card', title: 'Student Record Card', category: 'Flight Training', tier: 'reference', audience: ['Students', 'Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-redcard-test', title: 'Red Card Theory Test', category: 'Flight Training', tier: 'reference', audience: ['Students'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-sptt', title: 'Student Pilot Theory Test', category: 'Flight Training', tier: 'reference', audience: ['Students'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-bronze-brief', title: 'Bronze / SPL Theory Briefings (DLGC)', category: 'Flight Training', tier: 'reference', audience: ['Students'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ft-bronze-skills', title: 'Bronze / SPL General Skills Test Preparation', category: 'Flight Training', tier: 'reference', audience: ['Students'], href: `${OLD}/links-library.asp`, format: 'PDF' },

  // ── REFERENCE: Ground Training ──────────────────────────────────────────
  { id: 'gt-record', title: 'Ground Training Record Card', category: 'Ground Training', tier: 'reference', audience: ['Students'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'gt-newmembers', title: 'Briefing for New Members', category: 'Ground Training', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, note: 'Start here if you have just joined.', format: 'PDF' },
  { id: 'gt-winch-record', title: 'Winch Training Record Sheet', category: 'Ground Training', tier: 'reference', audience: ['Winch drivers'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'gt-canopy-care', title: 'Care of Canopies', category: 'Ground Training', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'gt-canopy-clean', title: 'Canopy Cleaning — Washing Instructions', category: 'Ground Training', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'gt-airfield-care', title: 'Care of the Airfield', category: 'Ground Training', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'gt-ground-movements', title: 'Ground Movements', category: 'Ground Training', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'gt-hangar-rash', title: 'Hangar Rash Prevention', category: 'Ground Training', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'gt-flarm', title: 'Understanding FLARM', category: 'Ground Training', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },

  // ── REFERENCE: Safety ───────────────────────────────────────────────────
  { id: 'sf-radio-calls', title: 'Pre-landing Radio Calls', category: 'Safety', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/safety_page.asp`, note: 'Correct calls to let others know your landing intentions.', owner: 'Safety Officer', format: 'PDF' },
  { id: 'sf-winch-hazards', title: 'Winch Launching — guidance, videos and quiz', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/safety_page.asp`, note: 'Winch launching can be hazardous. With the right care and attention it is safe.', owner: 'Safety Officer', format: 'Link' },
  { id: 'sf-winch-driving', title: 'Winch Driving — over-rotation articles', category: 'Safety', tier: 'reference', audience: ['Winch drivers'], href: `${OLD}/safety_page.asp`, note: 'Some gliders can over-rotate early in the launch in an uncontrolled way.', format: 'PDF' },
  { id: 'sf-sll', title: 'Safety Lessons Log', category: 'Safety', tier: 'live', audience: ['All members'], href: `${OLD}/safety_page.asp`, note: 'Saw something that might have been an accident? Something unsafe? A near miss? Send it via the Safety Officer so others can learn.', owner: 'Safety Officer', format: 'PDF' },
  { id: 'sf-sll-brief', title: 'Safety Lessons Log — Briefing', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'sf-newmembers', title: 'Safety Brief — New Members', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'sf-chirp', title: 'CHIRP — Confidential Incident Reporting', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/safety_page.asp`, note: 'Reports from GA pilots containing occurrences that should make us all think more carefully.', format: 'Link' },
  { id: 'sf-dd', title: 'Distress and Diversion (121.5 MHz)', category: 'Safety', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/safety_page.asp`, note: 'How the D&D service can locate you when lost, and how to make practice calls. Printable 3-fold handout.', format: 'PDF' },
  { id: 'sf-imsafe', title: 'IMSAFE — are you fit to fly?', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/safety_page.asp`, note: 'Illness, Medication, Stress, Alcohol, Fatigue, Emotion.', format: 'PDF' },
  { id: 'sf-cushions-back', title: 'Back Cushions', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/safety_page.asp`, format: 'PDF' },
  { id: 'sf-cushions-seat', title: 'Energy Absorbing Seat Cushions', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/safety_page.asp`, format: 'PDF' },
  { id: 'sf-drones', title: 'Drones and Mid-air Conflict Awareness (BGA)', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/safety_page.asp`, format: 'PDF' },
  { id: 'sf-ridge', title: 'Ridge Soaring Traps', category: 'Safety', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/safety_page.asp`, note: 'How pilots get caught unaware by wind flow phenomena over a ridge.', format: 'PDF' },
  { id: 'sf-medic', title: 'Safety Articles from a Medic (SSA)', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/safety_page.asp`, note: 'Series on safety aspects of gliding from a medical viewpoint.', format: 'PDF' },
  { id: 'sf-gasco', title: 'GASCo Flight Safety Extra', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/safety_page.asp`, note: 'Monthly UK GA safety digest. Free by email from the GASCo office.', format: 'Link' },
  { id: 'sf-officer', title: 'Safety Officer — role and contact', category: 'Safety', tier: 'reference', audience: ['All members'], href: `${OLD}/safety_page.asp`, format: 'Page' },

  // ── REFERENCE: Aircraft & Maintenance ───────────────────────────────────
  { id: 'am-pilotowner', title: 'Pilot Owner Maintenance — Permitted Tasks (BGA)', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Aircraft owners'], href: `${OLD}/Glider_Mtce/glider_work.asp`, note: 'Permitted maintenance by owners on Part 21 and Non-Part 21 (Annex II) gliders, club or privately owned.', version: 'October 2016', format: 'PDF' },
  { id: 'am-owner-resp', title: 'Owners Airworthiness Responsibilities (BGA)', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Aircraft owners'], href: `${OLD}/Glider_Mtce/glider_work.asp`, version: 'January 2021', format: 'PDF' },
  { id: 'am-ao-guidance', title: 'Guidance for Pilot Owners from Aircraft Officer / Inspector', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Aircraft owners'], href: `${OLD}/Glider_Mtce/glider_work.asp`, owner: 'Aircraft Officer', format: 'PDF' },
  { id: 'am-workshop', title: 'Workshop Facility & Charges', category: 'Aircraft & Maintenance', tier: 'reference', audience: ['Aircraft owners'], href: `${OLD}/Glider_Mtce/glider_work.asp`, note: 'The club’s aircraft workshop can be hired for repair and maintenance of private gliders. Enquiries to the Aircraft Officer.', owner: 'Aircraft Officer', format: 'PDF' },

  // ── REFERENCE: Medicals ─────────────────────────────────────────────────
  { id: 'md-declaration', title: 'Obtaining a CAA Pilot Medical Declaration', category: 'Medicals', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'md-procedures', title: 'Medical Procedures for Pilots', category: 'Medicals', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, version: 'v2.1', format: 'PDF' },
  { id: 'md-lapl-gp', title: 'LAPL Medicals — Guidance for GPs', category: 'Medicals', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, note: 'Print this and take it to your GP.', format: 'PDF' },
  { id: 'md-licensing', title: 'Sailplane Pilot Licencing — Advice', category: 'Medicals', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },

  // ── REFERENCE: Simulator ────────────────────────────────────────────────
  { id: 'sim-usage', title: 'Simulator Usage Guidelines', category: 'Simulator', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, version: 'July 2021', format: 'PDF' },
  { id: 'sim-startup', title: 'Simulator — Access and Start Up', category: 'Simulator', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'sim-home', title: 'Instruction at Home', category: 'Simulator', tier: 'reference', audience: ['Students'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'sim-tablet', title: 'Tablet and Map for XC', category: 'Simulator', tier: 'reference', audience: ['Solo pilots'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'sim-demonstrators', title: 'Simulator Demonstrators / Mentors', category: 'Simulator', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'sim-glidingschool', title: 'Instruct with GlidingSchool.com', category: 'Simulator', tier: 'reference', audience: ['Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'sim-mentor-brief', title: 'Gliding School Briefing for Mentors', category: 'Simulator', tier: 'reference', audience: ['Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'sim-progress', title: 'Gliding School Progress Chart', category: 'Simulator', tier: 'reference', audience: ['Students', 'Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },

  // ── REFERENCE: Administrative ───────────────────────────────────────────
  { id: 'ad-sdp', title: 'Sport Development Plan', category: 'Administrative', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, owner: 'Committee', format: 'PDF' },
  { id: 'ad-caravan-list', title: 'Caravan Sites — Holders and Waiting List', category: 'Administrative', tier: 'live', audience: ['All members'], href: `${OLD}/links-library.asp`, reviewDue: '2026-10-01', format: 'PDF' },
  { id: 'ad-lms', title: 'Launch Marshals — Manual', category: 'Administrative', tier: 'reference', audience: ['Launch marshals'], href: `${OLD}/manuals_webpage.asp`, format: 'PDF' },
  { id: 'ad-clm-bulletin', title: 'Chief Launch Marshal — Launch Point Procedures Bulletin', category: 'Administrative', tier: 'reference', audience: ['All members'], href: `${OLD}/pdfs/CLM%20Bulletin%20Launch%20Point%20Pocedures%20Jul%202023.pdf`, version: 'July 2023', owner: 'Chief Launch Marshal', format: 'PDF' },
  { id: 'ad-clm-deputy', title: 'CLM Deputy — Winter Bulletin', category: 'Administrative', tier: 'archive', audience: ['All members'], href: `${OLD}/pdfs/CLM%20Deputy%20Winter%202023-4%20Bulletin.pdf`, version: 'Winter 2023–4', format: 'PDF' },
  { id: 'ad-passenger', title: 'Passenger Carrying Course Record (Camphill)', category: 'Administrative', tier: 'reference', audience: ['Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'ad-sari', title: 'Senior Assistant Rated Instructors', category: 'Administrative', tier: 'reference', audience: ['Instructors'], href: `${OLD}/links-library.asp`, format: 'PDF' },

  // ── REFERENCE: Advisory ─────────────────────────────────────────────────
  { id: 'av-topilots', title: 'To All Pilots', category: 'Advisory', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'av-whitecard', title: 'To White Card Pilots', category: 'Advisory', tier: 'reference', audience: ['Students'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'av-students', title: 'To Student Pilots', category: 'Advisory', tier: 'reference', audience: ['Students'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'av-training-articles', title: 'Training Articles', category: 'Advisory', tier: 'reference', audience: ['All members'], href: `${OLD}/links-library.asp`, format: 'PDF' },
  { id: 'av-coaching-corner', title: 'Coaching Corner', category: 'Advisory', tier: 'reference', audience: ['All members'], href: `${OLD}/sossfiles/sossarticles/Coaching_Corner1.pdf`, format: 'PDF' },

  // ── ARCHIVE — kept forever, searchable, out of the main flow ────────────
  { id: 'ar-vehicle-ins', title: 'Vehicle Insurance on Airfields', category: 'Advisory', tier: 'archive', audience: ['All members'], href: `${OLD}/links-library.asp`, note: 'WITHDRAWN — retained for the record only. Do not rely on this.', superseded: true, format: 'PDF' },
  { id: 'ar-covid', title: 'Covid-19 — Dept for Transport Guidance re GA', category: 'Advisory', tier: 'archive', audience: ['All members'], href: `${OLD}/links-library.asp`, note: 'No longer in force. Retained for the record.', superseded: true, format: 'PDF' },
  { id: 'ar-presolo-old', title: 'Pre-Solo Training Exercise Descriptions (old)', category: 'Flight Training', tier: 'archive', audience: ['Instructors'], href: `${OLD}/links-library.asp`, note: 'Superseded by the SPL progress cards.', superseded: true, format: 'PDF' },
  { id: 'ar-agm-2003', title: 'AGM Minutes 2003', category: 'Minutes & AGM', tier: 'archive', audience: ['All members'], href: `${OLD}/AGM/2003%20AGM%20Minutes.pdf`, version: '2003', format: 'PDF' },
  { id: 'ar-newsletter-2004-1', title: 'Camphill Newsletter — January 2004', category: 'Newsletters', tier: 'archive', audience: ['All members'], href: `${OLD}/newsletters/CN_2004_1(jan).pdf`, version: 'Jan 2004', format: 'PDF' },
  { id: 'ar-instr-2026-03', title: 'Instructors Meeting Minutes — March 2026', category: 'Minutes & AGM', tier: 'archive', audience: ['Instructors'], href: `${OLD}/instrct-mtgs/Instructors%202026_03%20(Mar).pdf`, version: 'March 2026', format: 'PDF' },
  { id: 'ar-accident-reviews', title: 'BGA Annual Accident Reviews', category: 'Safety', tier: 'archive', audience: ['All members'], href: `${OLD}/safety_page.asp`, note: 'You can learn to be safer by knowing how others have come to grief. Each review covers 1 Oct to 30 Sep.', format: 'PDF' },
  { id: 'ar-accidents-analyses', title: 'Accident Analyses 2008–2022', category: 'Safety', tier: 'archive', audience: ['All members'], href: `${OLD}/safety_page.asp`, format: 'PDF' },
  { id: 'ar-safety-notes', title: 'DLGC Safety Notes (May & Oct 2017, June 2021)', category: 'Safety', tier: 'archive', audience: ['All members'], href: `${OLD}/safety_page.asp`, format: 'PDF' },
  { id: 'ar-other-gc', title: 'Incident Reports at Another Gliding Club', category: 'Safety', tier: 'archive', audience: ['All members'], href: `${OLD}/safety_page.asp`, note: 'An excellent example of learning from mistakes.', format: 'PDF' },
];
