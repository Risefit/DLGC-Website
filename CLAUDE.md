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
- Its links open in **one** Members' Admin tab, which is reused (see "One tab, signed in once" below).
- All AwareIM URLs live in **one file**: `src/content/awareim.ts`. If anything changes, that is the only edit.
- If someone asks you to "integrate" or "pull data from" AwareIM, stop and check with the committee first. That decision has not been made.

#### One tab, signed in once

Members' Admin asks for a sign-in every time its logon address is loaded, even with another
tab already signed in. The portal's buttons used to open that address in a new tab each
time, so three buttons meant three sign-ins and three tabs.

`src/components/MembersAdminTab.tsx` (mounted once, in the portal layout) changes only
**which tab a link opens in**: the first button opens Members' Admin in a tab the portal
remembers by name; every later button goes back to that same tab without reloading it, so
the member is still signed in there. A short message at the foot of the page says so, in
case the browser does not bring that tab to the front.

- It does **not** sign anyone in, keep a session alive, or read anything from Members'
  Admin. It cannot take a member to a particular screen either — that still needs Mo's
  process names (next section).
- A link that does land on its own screen (the airspace re-brief) is left alone, because
  it has to load the logon address to work.
- The remembered tab is opened without `noopener` — that is what lets the portal find it
  again. This is the one deliberate exception to rule 8, for the club's own system only.
- If a browser blocks it, the link behaves as it always did.

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

### The weather page
`/flying/weather` holds everything the station gives us, so nothing sends a member to the
old site's `metstation.html`:

- **Current conditions** — the Davis station's own WeatherLink panel (`club.weatherStationEmbed`
  in `site.ts`).
- **The camera** — through `/api/webcam`, once `WEBCAM_SNAPSHOT_URL` is set in Vercel. Until
  then the card says so and links to the old site's camera page.
- **Wind, live and over 24 hours** — `src/components/WindPanel.tsx`, which frames
  `public/embed/weather-hub.html`. That page runs the station's "weather hub" widget, a
  script the club does not control, so the frame is **sandboxed** (`sandbox="allow-scripts"`,
  never `allow-same-origin`): the widget cannot read the portal or a member's sign-in.
  **Never load that script into a portal page directly.**
- The widget lays itself out from the shape of its frame. `WindPanel` gives it a wide frame
  (compass beside the charts) only from 1000px of room, and a tall one (stacked) below that,
  because side by side is unreadable on anything narrower.

Then the forecast links, as before.

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

### The committee
`/directory/committee`, from `src/content/committee.ts`: names and roles only, and the one
shared address, `committee@glidingclub.org.uk`. Update it after each AGM. The roles are the
club's own wording, working-party shorthand included; the footnote explains it.

Every "Vacant — could this be you?" on the roles list, and the vacancy figure on Club Life,
is an email to that address with the role already named (`volunteerMailto`).

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

**Who is emailed.** Reports are always stored (Supabase → `submissions`). They are also
emailed when three settings exist in Vercel: `SAFETY_OFFICER_EMAIL`, `RESEND_API_KEY` and
`MAIL_FROM`. `SAFETY_OFFICER_EMAIL` takes one address or several separated by commas —
that is how a second person (Alex Sariban, Deputy Safety Officer, from November 2026)
receives every report. The
addresses are people's own, so they live in that setting and **not in this repository**.
The names of everyone who receives reports are shown on the form
(`contacts.safetyOfficer` and `contacts.safetyReportsAlso` in `site.ts`); keep the names
and the setting in step.

Open `/api/submit` in a browser to see whether storing and emailing are switched on and how
many people are emailed. It shows no addresses or keys. **Until the three settings exist
nobody is emailed at all** — the report waits in Supabase for someone to look.

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

### Links to the old site's pages
Old news items and notices are full of links to the old site's pages. `OLD_PAGES` in
`src/lib/files.ts` lists every old page that has a home in the portal; a link to one goes
to the portal page instead, in the same tab, and a link whose only text was the old file
name ("dutyrotas") is given a proper name. It happens when the content is loaded
(`portalise`), so the news text itself is untouched.

About eighty old pages have **no** home here yet and still open on the old site: the
individual gallery pages (first-solo photographs, Snippets), the Blake Robertshaw task and
turn-point pages, the Inter-Club League fixtures, the 2025 trophy winners, and a handful of
one-offs. When one is brought across, add it to `OLD_PAGES` and every old link follows.

The Club Life pages pass `{ pages: false }`: each links to its own old page on purpose, for
the parts not brought across, and must not be pointed back at itself.

### Phone numbers and WhatsApp
WhatsApp goes beside a **mobile** number (`isMobile` in `site.ts`) — the catering numbers,
and an advertiser's mobile on Buy and Sell. It never goes beside an emergency number. The
three club numbers are landlines; their WhatsApp buttons work only if the club has
registered those numbers with WhatsApp Business. If it has not, take the buttons out of
`ClubNumbers.tsx` rather than leave a button that reports an error.

### Files from the old site — one address, and a private store
Every old-site file is linked as `/files/members/…` (`src/lib/files.ts`). The route at
`src/app/files/[...path]/route.ts` gives a **signed-in** member a ten-minute link to the
club's private copy in Supabase Storage (bucket `legacy`), and sends everyone else — and
any file that was never copied — to the old site as before. README has the table.

Three rules:

1. **The bucket stays private.** It holds minutes, accounts and named lists. Never make it
   public, and never add a way to a file that skips the sign-in check in that route.
2. **A file link is not a page.** Use `isPortalPage(href)` from `src/lib/files.ts` to decide
   whether a link is internal; a `/files/…` link opens in a new tab and must never be given
   to `next/link`.
3. **`storageKey()` exists twice** — in `src/lib/files.ts` and in
   `scripts/upload-legacy.mjs`. They must stay identical or files are stored under names
   the portal never asks for.

To copy files across, see README ("The old site's files"). After adding documents, run
`npx tsx --tsconfig tsconfig.json tools/list-wanted-files.ts` so the uploader knows about them.

### Required reading — open it, then tick
At the top of the Documents page. The list is `src/content/required-reading.ts`; the
component is `src/components/RequiredReading.tsx`; confirmations are rows in the Supabase
table `reading_confirmations` (`supabase/migrations/004_reading_confirmations.sql`).

- **The list was a first draft by the website editor.** The CFI and committee decide what
  is mandatory. Edit the groups in `required-reading.ts`.
- A member must open a document from the list before its tick box becomes live, and a
  confirmation cannot be un-ticked — it is a record. The database refuses changes too, and
  stamps who and when itself rather than trusting the browser.
- **A confirmation belongs to one version.** Re-issue a manual the usual way (new row, same
  `slot`) and every member is asked again automatically. For a portal page in the list,
  change its `issue` value. The CFI's notices reset themselves when a notice is added.
- A member sees only their own ticks. **Who has confirmed what** is read in Supabase →
  Table Editor → `reading_confirmations` (it shows each member's sign-in address, the
  document, its version and the date). That table holds members' addresses, so only the
  people the committee nominates should have the Supabase login.
- Needs a signed-in member. Signed out, it is a plain reading list with a link to sign in.

### Signing in to the portal
The menu carries "Portal sign in" (and "Sign in to the portal" in the phone menu), which
becomes the member's address and "Sign out" once they are in — `PortalAccount` in
`src/components/Nav.tsx`. **It always says "portal"**, because the Members' Admin button
sits beside it and is a different system with a different password.

While the login gate is off, pressing Sign in with the boxes empty simply goes in; filling
them in signs in properly, which is what makes documents open from the club's own copy.
Accounts are created in Supabase → Authentication → Users. Nobody can register themselves
as long as "Allow new users to sign up" is off there — check that it is.

### No preview notes or hint boxes on the pages
Phil's instruction, November 2026: pages carry the club's content, not commentary about
the website. The "Preview mode" banner, the "still on the old site" boxes, the "how this
page is organised" boxes and the "rebuilt from the old page" footers were all removed.
Do not add new ones. Things that stayed because they are content or a safety matter: the
vacant-roles callout, the airspace re-brief panel, the notes inside the emergency
procedures, and the red "Verify before relying on this page" box on Emergency Procedures —
that one comes out only when the Safety Officer has checked the telephone numbers.

**The login gate is still OFF** (`NEXT_PUBLIC_PREVIEW_OPEN=true`) even though nothing on
the page says so any more.

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

### Photographs in the bands
Each landing page has one photograph beside its title, and the sign-in page has one beside
the form. Phil supplied them in November 2026:

| Page | File in `public/img` |
|---|---|
| Dashboard | `camphill-rainbow.jpg` |
| Flying | `camphill-windsock-approach.jpg` |
| Training | `camphill-puchacz-briefing.jpg` |
| Safety | `camphill-wing-walk.jpg` |
| Club Life | `camphill-launch-point-from-above.jpg` |
| Sign-in | `camphill-last-light.jpg` |

To change one, drop the new file in `public/img` and edit the `<BandPhoto …>` on that page
(`src`, `alt`, `caption`, `width`, `height`). Write a real `alt` — say what is in the
picture. Re-save anything straight off a phone before adding it (under about 250 KB, 1280px
wide): that also strips the location a phone writes into a photograph. One photograph per
band; `camphill-windsock.jpg`, the first dashboard picture, is still in the folder.

Some of these show members who can be recognised. That is fine on a members' site, but it
is one more reason the GitHub repository should be private.

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
   "opens in a new tab" cue. (One exception: plain Members' Admin links are steered into a
   single reused tab — see "One tab, signed in once".)

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
├── lib/                   Supabase clients, auth config, files.ts (old-site file addresses)
└── app/files/             The one route every old-site file goes through
next.config.mjs            Redirects for merged and moved pages
tools/make-contours.mjs    Draws the contour background
scripts/upload-legacy.mjs  Copies the old site's files into private storage
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

- [ ] **Copy the old site's files into private storage** — run migration 003, then
      `scripts/upload-legacy.mjs` on the computer that has the mirror (README)
- [ ] Run `supabase/migrations/004_reading_confirmations.sql` so required-reading ticks can
      be saved, and have the CFI correct the list in `src/content/required-reading.ts`
- [ ] **Before switching the login gate on:** in Supabase → Authentication, turn OFF
      "Allow new users to sign up". Otherwise anybody can register themselves and is then
      "signed in" as far as the portal and the file store are concerned
- [ ] Move the two Bronze Theory Zoom recordings (596 MB) somewhere that can hold them
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
- [ ] **`SAFETY_OFFICER_EMAIL`, `RESEND_API_KEY` and `MAIL_FROM` in Vercel** so safety reports
      are emailed (to the Safety Officer and Alex Sariban) as well as stored. Check at
      `/api/submit`
- [ ] Register the club numbers with WhatsApp Business, or the WhatsApp buttons on the
      Directory will report the number is not on WhatsApp (all three are landlines)
- [x] `supabase/migrations/002_submission_details.sql` — applied 18 August 2026
- [ ] Decide whether safety reports should also arrive by email (see Safety occurrence
      reports above) and set the three variables if so
- [ ] Restart the Flying Blog (last entry November 2024)
- [ ] Decide who owns each document category and set real `reviewDue` dates
- [ ] CFI to review `src/content/training.ts` (what a student is shown first), and to say
      which of the 28 earlier CFI notices still apply
- [ ] Proper titles for the documents still named after their files ("833TrnscvrOps",
      "BR01"…). Add them to `ENRICH` in `documents.ts`
- [ ] Camphill Catering's two mobile numbers are in `site.ts` and shown on the Directory.
      Rule 6 says no personal numbers without consent — confirm, or remove them
- [ ] Check the album names in `gallery.ts` that were a best reading of a folder name
      (Longest Day, Neighbours' Night, RF 100 km, Shipley aerobatics, KRB)
