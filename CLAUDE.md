# DLGC Members' Portal — working notes for Claude

If you are Claude (or another assistant) helping someone maintain this site, read this first.
It is written for a club volunteer, not a professional developer.

---

## What this project is

The members' portal for Derbyshire & Lancashire Gliding Club. It replaces a Classic ASP site
at `dlgc.org.uk/members/` that had ~40 flat navigation items, no search, no mobile support,
and a hand-maintained A–Z index because its own navigation didn't work.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Supabase Auth · deployed on Vercel.

---

## The three systems — do not confuse them

| System | What it is | Our relationship to it |
|---|---|---|
| **This portal** (`dlgc.org.uk`) | Club information, documents, news, archive | We own and edit it |
| **Public site** (`glidingclub.org.uk`) | WordPress + WooCommerce marketing site | Separate. We may link to it. Do not modify it |
| **Members' Admin** (`free-flight.info:8443`) | AwareIM. Daily Flying Planner, log book, statements, renewals, member directory | **Do not touch.** Link only |

### Members' Admin — the hard rule

AwareIM is Mo Bent's proprietary software, administered by him, holding personnel and financial
data in its own authenticated database. **This portal links to it and does nothing else.**

- No API calls, no scraping, no shared session, no shared database, no data sync — in either direction.
- **This portal never asks for an AwareIM username or password.** Members sign in on Mo's own
  page. A sign-in box here would have to post credentials from our origin into his session-based
  login — it would break the first time he changed anything, and it would teach members that
  typing their club password into a page that is not his is normal. Do not add one.
- Every link opens in a new tab.
- All AwareIM URLs live in **one file**: `src/content/awareim.ts`. If anything changes, that is the only edit.
- If someone asks you to "integrate" or "pull data from" AwareIM, stop and check with the committee first. That decision has not been made.

#### Deep links — what was tried, and what is actually true

AwareIM accepts a `firstCommand` parameter that runs a named process after logon. The old
site used it once, on `airspace/LOAsIntro.asp`:

```
logonOp.aw?domain=DLGC&firstCommand=startProcess(%27AS_Rebrief%27)
```

Two things were established by inspecting a signed-in session in August 2026, so nobody has
to repeat the exercise:

1. **It does not skip the login.** Opening that URL in a new tab shows the logon form even
   when another tab is signed in — AwareIM starts a fresh session per `logonOp.aw` hit. The
   benefit is "sign in and land on the right screen", not "jump straight there".
2. **The names visible in the running app are not process names.** The whole member view is
   produced by one process, `WhiteBoardCreate_Member`; `Flying_Planner`, `Flights_Today`,
   `Duties_and_Volunteers`, `Todays_TLs`, `My_Teams` and `Weather` are panels inside its
   perspective. Setting the app's own hash route to a named panel does not switch to it.

So individual screens cannot be deep-linked without the real process names. **Ask Mo Bent for
them**, put them in the `process` fields of the `TARGETS` table in `src/content/awareim.ts`,
and every button starts landing on its own screen. Until then each falls back to the logon
page, which is what happens today.

**Never guess a process name.** A wrong one produces an error inside Mo's system, which is
worse than landing on the logon page.

The `label` and `where` values in that table are AwareIM's **own** wording, read from its
menu. Do not improve them — a member should read the same words here and there, or the
signpost fails. If Mo rearranges his menu, update `where` to match.

---

## Common jobs

### Add a news item
Edit `src/content/news.ts`. Add to the **top** of the `news` array.

The year split is automatic: the News page shows everything from 1 January of the newest
item's year, and older items get a page per year under `/archive/news`. Nothing to move
by hand — it is derived from the date.

`src/content/news.ts` was generated once by `tools/parse-news.mjs` from the wget mirror of
the old `default.asp`, which held all 673 notices back to 2016 in one column. **Hand edits
are fine and expected from here on** — the generator is kept for reference and would
overwrite them if re-run.

Use `links` for anything the notice points at — a first-solo photograph, minutes, a notice.
Give each a **descriptive label**; the old site wrote every one as "this link", which told a
member nothing (WCAG 2.4.4). They render as bold buttons under the story.

Keep the house style — it is the best thing the old site had, and it is deliberate:
- Always include `displayDate` written as the club writes it ("Thursday 13th August 2026")
- Always include `from` when someone contributed it ("From Dave Salmon")
- Warm and specific. Congratulate first solos by name. Thank people for unglamorous jobs.
- Set `pinned: true` to surface it in "Worth knowing now" on the dashboard. Use sparingly — two at most.

### Add or update a document
Edit `src/content/documents-imported.ts`. **This is the one list** — one row per document,
and every page that links to a file gets the address from here. Add new rows at the **top**.

The important fields:

- `tier` — `'live'` (changes during the season), `'reference'` (current, in force), `'archive'` (historic)
- `audience` — who it is for. Drives the "Who it's for" filter
- `superseded: true` — for anything kept for the record but no longer in force. It stays
  searchable and is clearly labelled
- `slot` — see "Re-issue a manual" below

Titles, owners and review dates that were added by hand sit in the `ENRICH` table in
`src/content/documents.ts`, keyed by the row's `id`, so they survive if the list is ever
regenerated. Set `reviewDue` there on anything that goes stale: past dates automatically show
an "Overdue for review" flag on the Documents page and a count on the dashboard. That is the
mechanism that stops the library silently filling up with withdrawn advice, which is exactly
what happened to the old Links Library.

**Never paste a file's address into a page or another content file.** Use `file('row-id')`
from `documents.ts`. If the id is wrong the build stops and says so, which is how a dead link
is caught before a member finds it. Until November 2026 there were two lists and every manual
was written out a second time in `manuals.ts`; an edit to one silently did nothing.

### Re-issue a manual (a new version under a new file name)
The Pilots Manual, Winch Operating Manual, Ground Training Manual, Launch Marshals Manual,
Student Pilots Guide, Launch Speeds and the Wave Box Letter of Agreement each carry a `slot`.
To publish a new version:

1. Copy the current row to the top of `documents-imported.ts`.
2. Change `id`, `title`, `href` and `version` on the new row. Leave `slot` alone.
3. On the old row, delete `slot` and set `tier: 'archive', superseded: true`.

The first row with a given slot is the current one. The Manuals box, the Training page, the
Airspace page and the figure on the Flying page all follow it — nothing else to edit.

### Retire a document
Do **not** delete it. Set `tier: 'archive'` and `superseded: true`, and put why in `note`.
Club history is not recoverable once deleted; storage is free.

### Retired content
`src/content/retired/` holds things taken out of use but kept: the 143 rows of the first
hand-written document list that no page ever showed, and the short roles list that the full
one replaced. Nothing imports them. Leave them there.

### Change fees, calendar, weather links
All in `src/content/site.ts`. (Roles are in `src/content/roles.ts` — see below.)

Calendar dates that have passed move under "Earlier this season" by themselves; nothing to
tidy by hand.

**Weather links must stay location-specific.** `weatherGroups` holds the club's own curated
deep links — Bretton Youth Hostel rather than "Met Office", Abney rather than "Meteoblue".
An earlier version replaced several with homepages, which is why forecasts opened on the
wrong part of the country. Verified against the live sites in August 2026; MetCheck had
retired its per-crag link and Netweather its lightning page, and both were dealt with rather
than left to rot. A forecast for the wrong area is worse than no link.

### Add or change a Club Life page
`src/content/club-life.ts`. One entry per page — Vintage Rally, Silver Seekers, Junior
Gliding, BGA Ladder, Blake Robertshaw, Inter-Club League, Trophies, Newsletters. Each has
prose sections and link grids, and renders at `/club-life/<slug>` automatically.

These were rebuilt from the old site's own pages. **Keep the writing.** The reason the first
version of this portal was wrong is that it replaced them with a document search, which
loses the member who explains what the Ladder is for. Prose first, links beside it.

### Flying cards
`src/content/flying-cards.ts` — White, Red, Yellow, Green and Blue, transcribed from the
club's summary card and the Blue card PDF. **SAFETY-CRITICAL, and the CFI owns it.** Do not
reword to read better. The printed card a member carries is what counts.

### Manuals
`src/content/manuals.ts`, ported from `manuals_webpage.asp`, in the club's own three groups.
It holds the grouping and the order only; every address comes from the document list via
`file()` or a slot. Keep the flight-manual caveat — it is the club's wording and it matters.

### The Training page
`src/content/training.ts` is the short hand-picked list a student sees (start here, towards
solo, on the ground, simulator, medicals). Everything else is one button away in the
library. The page used to list all 56 training documents. **The CFI should review the
choice** — it was first made by the website editor.

### The Safety page
Each file appears once. Anything already linked from a group higher up the page is left out
of "More safety reading" automatically, and the historic material is a button into the
library. Do not add a second list.

### Duty rotas
Nothing to edit on the roster page. Add the new quarter's rota PDFs to
`documents-imported.ts` with the titles the club already uses — `26Q4 Instructors Rota`,
`26Q4 Ground Crew Rota` — and the roster page, the dashboard and the Flying page pick the
newest quarter up from there. The classroom-briefing schedule is matched the same way, from
a title ending `2026 Q4`. The winch drivers list is in `src/content/roster.ts`; add new names
at the top.

The Daily Flying Planner tile is deliberately NOT on the roster page. It is on the dashboard
and the Flying page already, and a third copy on the page about duties only sent members to
the wrong system.

### Airspace, CFI notices and launch marshal bulletins
`src/content/airspace.ts` and `src/content/notices.ts` (generated once by
`tools/parse-notices.mjs`). The CFI's notices are instructions, not advice — do not reword
them, and if one contradicts another page of this site, the notice wins and the other page
needs fixing.

### Roles and role holders
Shown in full on the Directory page (`/directory#roles`); the old `/club-life/roles` address
redirects there. `src/content/roles.ts`, generated by `tools/parse-roles.mjs`. **Names only — no telephone
numbers and no email addresses** (rule 6). The VACANT rows are the most useful part of the
page: that is how the club advertises that it needs somebody. Do not tidy them away.

### Buy and Sell
`src/content/adverts.ts`. Approved adverts go in the `adverts` array; the six-month expiry
is derived from `placed`, so a stale advert flags itself. New adverts arrive as
`kind: 'advert'` in the Supabase `submissions` table.

Publish an advertiser's phone number ONLY if they put it in the "to publish" fields
themselves, and take it out when the advert expires (CLAUDE rule 6).

### Safety Lessons Log
`src/content/safety-log.ts` — 422 entries from 2003, generated once by
`tools/parse-safety-log.mjs` from both volumes on the old site. The page shows five years at
a time with a Show more button and a search box that covers the whole log.

### Safety occurrence reports
`src/components/SafetyReportForm.tsx` on `/safety`. Reports go to the Safety Officer, never
the website editor, and are never published from the form.

**Anonymous means anonymous.** Choosing it removes the name and email fields, and the API
stores nulls. Do not add IP logging, fingerprinting or anything else that could identify a
reporter — the club's reporting culture, and therefore the Safety Lessons Log, depends on
that being true in practice.

To email reports on as well as storing them, set `SAFETY_OFFICER_EMAIL`, `RESEND_API_KEY`
and `MAIL_FROM` in Vercel. Without them the report is still stored, and the member is still
told it arrived — it never fails silently.

### Change social channels, the Safety Spot, or the charities
All in `src/content/community.ts`.
- **Social:** set a channel's `href` to go live. `href: null` renders a greyed-out
  placeholder rather than a dead link — that is how Instagram, TikTok and X currently show.
- **Safety Spot:** the panel from the old site's home page, kept in full. `strong: true`
  gives an entry the red left border (Safe Start and Crash/Emergency have it).
- **Charities:** name, link and one line on why the club supports it.

### The gallery
One page, `/gallery`, in this order: the club's own six hand-kept galleries
(`src/content/photo-galleries.ts`), the albums recovered from the old site
(`src/content/gallery.ts`), then the form for sending a photograph in. The old
`/club-life/photo-galleries` address redirects there. Album titles were tidied by hand from
folder names in November 2026; the `slug` still holds the original folder name.

### Member submissions (flying blog stories, gallery photos)
Members submit via forms on `/club-life/blog` and `/gallery`. **Nothing publishes
automatically** — everything lands in the Supabase `submissions` table with status
`pending`, and the editor reviews it in the Supabase dashboard (Table Editor).

That gate is deliberate. The club's news voice is the best thing about the old site, and
an open publish button would lose it.

Needs two server-side variables in Vercel (no `NEXT_PUBLIC_` prefix):
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Without them the form tells the member to
email the editor instead — it never fails silently.

### The menu — six items, and it stays six
Dashboard, Flying, Training, Safety, Documents, Club Life. Gallery, Directory, Archive and
Buy and Sell are reached from the Club Life page, the footer, and the "Also" group in the
phone menu (`ALSO` in `src/components/Nav.tsx`). The old site had about forty menu items
and needed a hand-kept A–Z because of it. **A new page goes under one of the six**, and gets
an entry in `UNDER` in `Nav.tsx` so its parent lights up.

**When a page is merged or moved, add a redirect** in `next.config.mjs` so old bookmarks
and links in old emails still work. Never leave an address dead.

### The look — bands, not boxes
Agreed with Phil in November 2026. Pages are built from full-width bands of tone:

- **The opening band** is dark (`deep`) with the contour drawing behind it. Landing pages
  (Dashboard, Flying, Training, Safety, Club Life) use `<Band>` with a title, a few pill
  buttons and up to three `<Figures>`. Every other page uses `<PageHeader>`, which is the
  same band, shorter, with an optional `back` link in place of breadcrumbs.
- **`<Section>`** placed directly in a page is a full-width band; white and pale blue
  alternate automatically. `<BandSection tone="contour">` is the textured variant — one or
  two per page at most.
- **Three figures at most** in a band. They are the numbers a page turns on, not decoration.

The contour drawing is made by `tools/make-contours.mjs` and is an invented hillside, not a
map of anywhere. Re-run the script to change it; do not hand-edit the SVG.

`.bleed` in `globals.css` is what lets a band run edge to edge, and the portal layout
carries `overflow-x-clip` so it can never cause a horizontal scrollbar (rule 2). **Do not
remove either half.**

### The accent — windsock orange, and only one job
`windsock` (#F2A65A) appears **only on dark bands**: the italic phrase in a title and the
one primary pill button. It fails contrast on white, so it is never text or a button on a
light band. One accent pill per band — if everything is orange, nothing is.

### Colour — the tonal ladder
`tailwind.config.ts`. The palette is one hue plus three semantic colours, in graded steps:

| Purpose | Token | On white |
|---|---|---|
| Headings | `navy` | 11.8:1 |
| Body prose | `ink` (set on `body`) | 16.7:1 |
| Supporting text — card descriptions, section leads, form hints | `inkMuted` | 9.5:1 |
| Captions — timestamps, counts, "opens in a new tab" | `slate2` | 6.9:1 |

Surfaces, lightest to darkest: `white` → `sky50` (hover) → `cloud` (page) → `skyTint` (panels)
→ `sunken` (inset) → `sky200` (selected).

**Two rules that are not style preferences:**

1. **`sky` must not sit on `sunken` or `sky200`** — 4.48:1 and 4.25:1, at or under the AA
   floor. Those fills take `navy` or `ink` text. The config says so too.
2. **Do not darken `cloud` further.** `#E9EEF5` would look crisper but drags `sky` to 4.6:1
   on the page background. On a site built for members mostly over 60, headroom on link
   contrast beats a sharper card edge.

Reach for a step, not a new colour. If something needs emphasis, move it one notch up the
ladder rather than adding a hue.

### Typeface and type scale
The typeface is **IBM Plex Sans**, self-hosted from `src/app/fonts` and wired up in
`src/app/layout.tsx`. **Plex Mono** is there for data read character by character —
registrations, frequencies, times.

Self-hosted on purpose: no member's browser calls Google to read a club notice, and the
build does not depend on a third party. 80 KB for the whole site. To change it, swap the
file and the `src` in `layout.tsx` — everything else keys off `font-sans` / `font-mono`.

**Newsreader** is the display face — page titles, band headings and the big figures, via
the `.display` and `.figure` classes. Two static cuts (roman and italic), 49 KB, self-hosted
the same way. It is for headings only: never body text, never anything under about 20px.
Wrap the phrase to pick out in `<em>` and it is set in italic.

- **Body copy is 400. Headings are 700.** The site previously ran on 500/600 only, so
  headings barely outranked labels.
- **18px base stays.** Do not reduce it.
- Display sizes carry negative tracking, set on the scale so it travels with the size.
- `table`, `time`, `.tabular` and `.font-mono` get tabular figures, so numbers in columns
  line up. That is most of the reason to specify a typeface with good numerals.

### Containers and elevation
Four tiers, and they mean something. Do not add a fifth.

| Class | Use | Treatment |
|---|---|---|
| `.card-flat` | rows and chips inside a container, dense peer grids | border, no shadow |
| `.card` | a standalone resting card | border + soft two-layer shadow |
| `.card-interactive` | the whole card is a link | raises 1px and lifts on hover |
| `.card-panel` | the two or three things per page that sit above everything | three-layer shadow |

**Two radii only:** `rounded-control` (8px) for buttons, inputs and chips;
`rounded-card` (12px) for containers; `rounded-full` for pills. `rounded-lg`, `rounded-md`
and `rounded-xl` are aliases onto those, so old class names still land on the system —
there were five competing values before, which is what makes an interface feel assembled
rather than designed.

**When everything is raised, nothing is.** If a page has more than three `card-panel`s,
that is the bug.

### Change spacing
`tailwind.config.ts` holds every design token. Do not introduce new colours ad hoc.
**Base font size is 18px on purpose** (`src/app/globals.css`) — this membership skews older.
Do not reduce it.

---

## Rules that must not be broken

These come from the audit of the old site. Each one fixes a specific, observed failure.

1. **No hover-only behaviour.** The old site's navigation used hover tooltips and was
   undecipherable on a phone. Menus open on click.
2. **Never a horizontal scrollbar.** The old site was fixed-width ~1300px. Test at 390px wide.
   Wide tables scroll inside their own container, not the page. `.card` and `.prose-club` in
   `globals.css` carry `overflow-wrap` rules because old document filenames and inline URLs
   have no break opportunity — do not remove them.
3. **Link text must describe its destination.** No "click here", no "this link". The old
   Safety page used "this link" about twenty times.
4. **Never rely on colour alone.** The flying card system is White/Red/Yellow/Green — always
   pair the colour with the word.
5. **Emergency Procedures stays one tap from every page** (the red strip above the footer, in the portal layout).
6. **No member personal data in this repository.** Phone numbers and email addresses live in
   Members' Admin. If a directory is ever added here it must be opt-in per field.
7. **Touch targets at least 44×44px** with real spacing. `.tap` in `globals.css` enforces the minimum.
8. **Every external link** gets `target="_blank" rel="noopener noreferrer"` and a visible
   "opens in a new tab" cue.

---

## Verifying a change

```bash
npm run dev            # develop at http://localhost:3000
npm run build          # must pass before pushing
```

Before you say a change is done, check it at **390px wide** as well as desktop, and confirm
there is no horizontal scrollbar.

---

## Where things live

```
src/
├── app/
│   ├── (portal)/          Every signed-in page. layout.tsx has the nav + footer
│   ├── login/             Sign-in (email + password, Supabase)
│   └── globals.css        Base type, focus rings, bands, .card/.link/.tap/.pill helpers
├── components/
│   ├── Nav.tsx            The six-item menu, the "Also" group, Members' Admin dropdown
│   ├── ui.tsx             Band, PageHeader, Section, Figures, tiles — use these
│   └── DocumentLibrary.tsx  Search + filter for the document list
├── content/               ← MOST EDITS HAPPEN HERE. Plain data, no React
│   ├── news.ts            News and Notices
│   ├── documents-imported.ts  THE document list. One row per file
│   ├── documents.ts       file() / current() helpers, ENRICH titles and review dates
│   ├── training.ts        What the Training page features
│   ├── roles.ts           Roles and role holders
│   ├── site.ts            Fees, calendar, weather links, contacts, Find It A–Z
│   ├── awareim.ts         The ONLY place AwareIM URLs appear
│   └── retired/           Kept, not used
└── lib/                   Supabase clients and auth config
next.config.mjs            Redirects for merged and moved pages
tools/make-contours.mjs    Draws the contour background
```

**Rule of thumb:** content changes go in `src/content/`. If you find yourself editing a page
component to change a fact, the fact probably belongs in a content file instead.

---

## Accounts and ownership — READ THIS BEFORE HANDOVER

The infrastructure currently sits in **Phil's personal accounts**, as a deliberate
short-term decision to get moving. **It must be transferred to club-owned accounts before
the site is handed to a club maintainer**, otherwise DLGC's portal permanently depends on
one person's private accounts and billing, and the new maintainer cannot administer it.

| Service | Currently | Needs to become |
|---|---|---|
| Supabase | project `dlgc-members-portal` in the "Rise Fitness" org (eu-west-2, London) | Club-owned Supabase account |
| Vercel | Phil's Vercel team | Club-owned Vercel team |
| GitHub | Phil's account | Club-owned GitHub org |

Suggested club identity: a role address such as `webmaster@glidingclub.org.uk` rather than
any individual's email — so it survives the next change of volunteer. All three services are
free at this scale.

Note also: creating the Supabase project required pausing the `priority-air-ambulance`
project to stay within the 2-project free limit. That pause is reversible (restore it from the
Supabase dashboard) but a club-owned account removes the conflict entirely.

## Still to do

- [ ] Import the mirrored files from the old site (`scripts/import-mirror.mjs` — see README)
- [ ] **Safety Officer to verify `/safety/emergency`** — all four procedures are transcribed
      from the old site (MainGd.asp and its EmrgcyGdnc pages), but several hospital telephone
      numbers in the source have irregular digit counts. They are reproduced exactly as
      published and flagged "number needs checking" rather than guessed at. This is the one
      page where being wrong could matter.
- [ ] Set `NEXT_PUBLIC_PREVIEW_OPEN=false` in Vercel once member accounts exist
- [ ] **Transfer Supabase / Vercel / GitHub to club-owned accounts before handover** (see above)
- [ ] Convert duty rotas from quarterly PDFs into a real roster view
- [ ] Set `WEBCAM_SNAPSHOT_URL` in Vercel so the camera works through the proxy — and change
      the password on the camera first, it is currently `dlgc` and has been public for years
- [ ] Optional: `SAFETY_OFFICER_EMAIL`, `RESEND_API_KEY` and `MAIL_FROM` so safety reports
      are emailed as well as stored
- [ ] Register the club numbers with WhatsApp Business, or the WhatsApp buttons on the
      Directory will report the number is not on WhatsApp (all three are landlines)
- [x] `supabase/migrations/002_submission_details.sql` — applied 18 August 2026
- [ ] Decide whether safety reports should also arrive by email (see Safety occurrence
      reports above) and set the three variables if so
- [ ] Restart the Flying Blog (last entry November 2024)
- [ ] Decide who owns each document category and set real `reviewDue` dates
- [ ] **Photographs for the Flying, Training, Safety and Club Life bands** — landscape, at
      least 1600px wide. Only the dashboard has one so far
- [ ] CFI to review `src/content/training.ts` (what a student is shown first), and to say
      which of the 28 earlier CFI notices still apply
- [ ] Proper titles for the documents still named after their files ("833TrnscvrOps",
      "BR01"…). Add them to `ENRICH` in `documents.ts`
- [ ] Camphill Catering's two mobile numbers are in `site.ts` and shown on the Directory.
      Rule 6 says no personal numbers without consent — confirm, or remove them
- [ ] Check the album names in `gallery.ts` that were a best reading of a folder name
      (Longest Day, Neighbours' Night, RF 100 km, Shipley aerobatics, KRB)
