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
| **Free Flight** (`free-flight.info:8443`) | AwareIM. Daily Flying Planner, log book, statements, renewals, member directory | **Do not touch.** Link only |

### Free Flight — the hard rule

**The name.** Members call the system Free Flight (it lives at `free-flight.info`), so that
is what every page, button and menu calls it. Until November 2026 this portal called it
"Members' Admin"; Phil asked for the change. The club's own roles list still says "Free
Flight & Members' Admin" for the role, and old news items keep whatever they said. In the
code the component is still `MembersAdminTab` — a name nobody sees.

AwareIM is Mo Bent's proprietary software, administered by him, holding personnel and financial
data in its own authenticated database. **This portal links to it and does nothing else.**

- No API calls, no scraping, no shared session, no shared database, no data sync — in either direction.
- **This portal never asks for an AwareIM username or password.** Members sign in on Mo's own
  page. A sign-in box here would have to post credentials from our origin into his session-based
  login — it would break the first time he changed anything, and it would teach members that
  typing their club password into a page that is not his is normal. Do not add one.
- Its links open in **one** Free Flight tab, which is reused (see "One tab, signed in once" below).
- All AwareIM URLs live in **one file**: `src/content/awareim.ts`. If anything changes, that is the only edit.
- If someone asks you to "integrate" or "pull data from" AwareIM, stop and check with the committee first. That decision has not been made.

#### One tab, signed in once

Free Flight asks for a sign-in every time its logon address is loaded, even with another
tab already signed in. The portal's buttons used to open that address in a new tab each
time, so three buttons meant three sign-ins and three tabs.

`src/components/MembersAdminTab.tsx` (mounted once, in the portal layout) changes only
**which tab a link opens in**: the first button opens Free Flight in a tab the portal
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
**From the News page (the usual way, from November 2026).** A controller opens
`/club-life/news` and presses **Add a notice**: heading, date, who it is from, the
text, any links, and whether to mark it "Worth knowing now". It is on the News page and
the dashboard at once. Under each notice posted this way a controller has **Edit** and
**Take down**; a notice taken down is kept and can be put back from "Notices taken
down". Only controllers see any of these buttons, and the server refuses anybody else
whatever their browser shows (`src/app/(portal)/club-life/news/actions.ts`, which
begins with `requireController()` like every controller action).

- Posted notices are rows in the Supabase table `portal_news` (migration 008), not in
  the repository. `src/lib/news.ts` joins them to the news file, and **every page that
  shows news asks `newsView()` there** — do not import the `news` array into a page.
- What is typed is plain text and is shown as text. A link must start `https://` or,
  for a portal page, `/`; "this link" is refused as a link's name (rule 3).
- **A notice can carry photographs and files** — up to four of each (JPG, PNG or WEBP up
  to 15 MB; PDF, Word, Excel, PowerPoint, text or CSV up to 25 MB). Each needs a few
  words: what a photograph shows (it is the caption, and what a member who cannot see it
  is read), or what a file is (it becomes the button's name). They are kept in the
  private store `news` (migration 010) and opened through `/files/news/<notice>/<n>`,
  which gives a signed-in member a ten-minute link, and only while the notice is
  showing. A photograph is shown from a smaller copy with the camera's location data
  removed, never the original. Taking one off a notice stops it showing; the file stays
  in the store. A PDF opens in the browser; the other kinds download, so prefer a PDF.
- "Worth knowing now" shows on the two newest notices that carry it, whoever marked
  them. The form says so.
- The pages are built ahead and kept. Posting, editing or taking down tells the site to
  rebuild them (`revalidatePath('/', 'layout')`), and they refresh hourly in any case.
- **The old site still has its own news column.** A notice posted here does not appear
  there, and one posted there has to be brought across. Until the old site is retired,
  somebody has to decide which is the club's noticeboard.

**In the file (for the notices brought across from the old site).**
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

### Which tab a link opens in — one rule
A member pointed out in November 2026 that it varied from link to link. It is now one rule,
and one function decides it (`opensNewTab` in `src/lib/files.ts`):

- **A link inside the content of a page opens in a new tab**, with the small arrow beside
  it: a document, another website, an old-site page — and equally a portal page named in a
  reading list, the Safety Spot or a news item. The member keeps their place.
- **Navigation stays in the same tab**: the menu, the buttons in the band at the top of a
  page, section tiles, "back" links, the footer, the Find It list. Those use `next/link`
  directly. Do not open navigation in new tabs — that buries a member in tabs.

A new list of links should call `opensNewTab(href)` rather than decide for itself.

### Links to other organisations — link to the page, not the file
In 2026 the BGA moved every uploaded file to a new address, and every link straight to a
BGA PDF (`…/wp-content/uploads/…`) died at once: Safe Start, five accident reviews, four
cross-country articles. **Link to the BGA's page for a document** (`members.gliding.co.uk/
library/…/`), which stays put and always carries the current file. The same goes for the
CAA and the Met Office. Old news items still say `…/wp-content/uploads/…`; those are sent
to the BGA's new file server as the item is loaded (`BGA_UPLOAD` in `src/lib/files.ts`).

Checked against the live sites on 24 November 2026; taken out because the site had gone:
GASCo (wound up), Spine, RainToday and the old UK Junior Gliding address.

### Word and PowerPoint files
A browser can show a PDF. It cannot show a Word document or a PowerPoint: it downloads the
file and hands it to another app, and a member without that app sees nothing. Twenty-odd
files in the library are like this. Two things are in place:

- The link says so before it is pressed — a "Word document · downloads" label, from
  `fileKind()` in `src/lib/files.ts`. Nothing to maintain.
- **The cure is a PDF copy.** Save the PDF beside the original in the copy of the old
  site, with `.pdf` added to the whole name (`JKU report for members.doc.pdf`), and run the
  uploader. A signed-in member is then given the PDF and it opens in the browser
  (`pdfCopyKey`, and the route in `src/app/files`). The original stays where it is.

### The Documents page — search first, then browse
`src/components/DocumentLibrary.tsx`. The search box is the first thing on the page and
results come back as one list, best match first (`rankDocs` in `documents.ts`; it also
matches a document's old file name). With nothing typed the page shows Required reading
and then the categories as tiles — never three hundred rows at once. Find It
(`/find-it`, and the search box at the top of the dashboard) searches the same list.

What keeps it tidy is the data, not the page:

- **An old version goes to the archive** the moment a new one is published (see "Retire a
  document"). Thirty-six rows that had been left as "current" were archived in November
  2026 — earlier Pilots Manuals, Launch Marshals Manuals, medical procedures, policies,
  past quarters' rotas. Each says what replaced it. **The CFI or Secretary should glance
  down the list of what was archived** (`dlgc/member-feedback-2026-11.md` in the project
  notes) in case one is still in force.
- **A document gets a proper title**, in `ENRICH` in `documents.ts`. About 150 were
  written then, only where the name was certain. Rota titles (`26Q4 Instructors Rota`)
  and `SPL Theory Briefings … 2026 Q4` must stay exactly as they are — the roster page
  finds them by title.
- **It sits in the category a member would look in** (`RECATEGORISE`). "Competitions &
  Trophies" was added for the Blake Robertshaw task sheets, which were swamping
  Operational Notices. "Advisory" is shown to members as "Articles & Advice".

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
- **Charities:** name, link and one line on why the club supports it. The list shows on
  the dashboard and, as plain links, under "Elsewhere" in the footer of every page.

### The gallery
One page, `/gallery`, in this order: the club's own six hand-kept galleries
(`src/content/photo-galleries.ts`), the albums recovered from the old site
(`src/content/gallery.ts`), then the form for sending a photograph in. The old
`/club-life/photo-galleries` address redirects there. Album titles were tidied by hand from
folder names in November 2026; the `slug` still holds the original folder name.

Choosing an album moves the page down to its photographs and says how many there are;
before that the pictures appeared below the bottom of the screen and the album buttons
looked dead. Each photograph opens full size in a new tab. The "Solo winch drivers" tile
opens the old site's photographs; the names and dates are on the Duty Roster page.

### Member submissions (flying blog stories, gallery photos)
Members submit via forms on `/club-life/blog` and `/gallery`. **Nothing publishes
automatically** — everything lands in the Supabase `submissions` table with status
`pending` and shows nowhere.

**A controller decides, on `/admin/submissions`** (My sign-in → Sent in by members; the
number waiting sits beside "My sign-in"). Each waiting story or photograph can be tidied
— title, text, the name it is shown as from — and then **approved, which publishes it
at once**: a story at the top of the Flying Blog, a photograph under "Sent in by
members" in the Gallery. Or declined. One that is on the site can be taken down, and one
that is not shown can be published after all. Nothing is deleted (migration 009 adds who
decided and when).

That gate is deliberate. The club's news voice is the best thing about the old site, and
an open publish button would lose it.

- **Safety reports and adverts are rows in the same table, and controllers never see
  them.** Every query in `src/lib/sent-in.ts`, the approval page, its action and the
  picture route names the two kinds it is for (`'blog'`, `'photo'`). Do not write one
  that reads `submissions` without that — a safety report is for the Safety Officer
  alone, and some are anonymous.
- **Uploads do not travel through the portal.** The host refuses a request over about
  4.5 MB, and a phone photograph is often bigger. So the server gives the browser a
  one-time permission to put one file at one address in the private store, the browser
  puts it there, and the form then says where it is. The server checks the file is
  really there, at an address it made, and is the kind and size allowed, before saving
  anything (`src/lib/uploads.ts`; `/api/submit/upload` for members' photographs,
  `newsUploads()` for a controller's notice). **Do not trust the address a form sends** —
  it is checked against the pattern the server uses, or one member could point a
  submission at another's picture. The stores also refuse the wrong kind of file
  themselves (migration 010). The safety report form is unchanged: its photograph
  still travels with the report.
- **Pictures stay private.** They are in the private `submissions` store; a page shows
  one through `/files/sent-in/<id>`, which gives a signed-in member a ten-minute link
  and only once the picture is approved (a controller can also see one that is waiting).
- **Approving a picture makes two smaller copies** (`src/lib/photos.ts`): 1800 and 700
  pixels, turned the right way up, saved **without the camera's hidden data** — so the
  location a phone records does not go out with the photograph. The original is kept
  untouched. If the copies cannot be made the original is shown instead.
- The member's email address is shown to controllers so they can write back, and never
  on the site.
- Adverts still go to the website editor and into `src/content/adverts.ts` by hand.

Needs two server-side variables in Vercel (no `NEXT_PUBLIC_` prefix):
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Without them the form tells the member to
email the editor instead — it never fails silently.

### Links to the old site's pages
Old news items and notices are full of links to the old site's pages. `OLD_PAGES` in
`src/lib/files.ts` lists every old page that has a home in the portal; a link to one goes
to the portal page instead (in a new tab, like every link in a news item), and a link whose only text was the old file
name ("dutyrotas") is given a proper name. It happens when the content is loaded
(`portalise`), so the news text itself is untouched.

About eighty old pages have **no** home here yet and still open on the old site: the
individual gallery pages (first-solo photographs, Snippets), the Blake Robertshaw task and
turn-point pages, the Inter-Club League fixtures, the 2025 trophy winners, and a handful of
one-offs. When one is brought across, add it to `OLD_PAGES` and every old link follows.

The Club Life pages pass `{ pages: false }`: each links to its own old page on purpose, for
the parts not brought across, and must not be pointed back at itself.

### When the old site renames a file — provisional minutes above all
Minutes go up as `2026_07(P).pdf`; when they are approved the Secretary replaces that file
with `2026_07.pdf`, and every link to the provisional one dies. All 536 old-site links in
the news were tested on 24 November 2026 and 66 were dead, nearly all for this reason.

`MOVED_FILES` in `src/lib/files.ts` lists each dead address and where it goes now. **When
minutes are approved:** change the row in `documents-imported.ts` to the new file name and
title, and add one line to `MOVED_FILES`. The same table covers anything else the old site
renames. A link whose file has gone for good points at the nearest page instead.

Minutes that still say "provisional" or "draft" on the page itself (several from 2022 to
2025) are the files as the Secretary published them — the portal cannot correct those.

### PDFs open without the side panel
Some club PDFs were saved to open with a bookmarks panel, which covers the page on a
phone. The file route adds `#pagemode=none&navpanes=0` to a PDF's address, which asks the
browser's viewer to leave the panel shut. Harmless where it is not understood.

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
- A member sees only their own ticks, in three places: the list itself (top of the
  Documents page, with the date beside each), a line on the dashboard ("Required reading:
  3 of 8 still to confirm"), and **My sign-in → My required reading**. The count is of the
  documents that apply to every member — the first two groups in the list — **plus the
  manuals for the roles that member holds** (next section). One function does the adding
  up everywhere: `requiredKeys` in `src/lib/roles.ts`.
- **Who has confirmed what** is the controllers' page `/admin/reading` (**My sign-in →
  Reading record**, or the link at the top of the Members page): member by member, and
  document by document. Only the current version of a document counts there, so a
  re-issued manual shows everybody as outstanding again. A member is marked as outstanding
  for a duty's manual only if they hold a role for that duty, so two members can be
  "3 of 8" and "3 of 10". The Documents page tells members that controllers can see the
  record.
- Only a controller can open that page. If the CFI should see it, a controller makes the
  CFI a controller — there is no separate "can see the reading record" mark yet.
- **A controller can email a reminder from that page.** Under a member's "What is
  outstanding" each document has "Email it to them", and there is one button for
  everything outstanding (one email, not eight). The manuals for students, and for duties
  the member holds no role for, are offered separately and never counted as outstanding.
  It needs the club's email
  sending (`RESEND_API_KEY`, `MAIL_FROM`); until then the buttons are greyed out and the
  page says why. Each send is noted in the table `reading_reminders` (migration 007), so
  the row says "Emailed 25 Nov 2026", and the same thing cannot be sent twice within
  five minutes.
- **The email does not attach the manual, and does not confirm anything.** Its button
  opens `/account/reading?doc=…` — that one document's page in the portal — where the
  member opens it and ticks it, signed in, exactly as on the Documents page. That is
  deliberate: the portal always shows the current version (an attachment is out of date
  the day a manual is re-issued), some of the reading is a page rather than a file, and a
  tick only means something if the member made it. **Do not add a link that confirms by
  being clicked**: mail scanners open every link in an email, and anybody the email was
  forwarded to could press it. A controller cannot tick for a member either.
- A member who is not signed in when they press the button is sent to sign in and then
  brought back to the document (`afterSignIn` in `src/lib/auth.ts`). That is the only
  address the sign-in page will send anybody on to; anything else becomes the dashboard,
  so the club's sign-in page cannot be used to bounce somebody to another website.
- The wording of the reminder is `readingReminder()` in `src/lib/mail.ts`. It uses the
  titles and the one-line reasons from `required-reading.ts` and quotes nothing from the
  documents themselves.
- Every visitor to the page is now a signed-in member, so the ticks always work (given
  migration 004 has been run).

### Roles, and My profile
Added November 2026 at Phil's request. The twenty roles are his list, in five groups:
**pilot** — student pilot, or the White, Red, Yellow, Green or Blue card · winch master,
winch trainer, winch driver, winch trainee · launch master, launch marshal · head clerk,
clerk, trainee clerk · Basic Instructor (BI), Flight Instructor (FI), Chief Flying
Instructor (CFI), Introductory Flight Pilot (IFP), mutual flyer. They are defined once,
in `src/lib/roles.ts`.

- **The pilot group is one choice.** A member is a student pilot or holds one card;
  giving one takes any other off (`withRole` and `cleanRoles` in `roles.ts` — the server
  applies it, so a doctored form cannot leave somebody with two cards). On the Members
  page each card's chip is in the card's colour, with its name and a tick when held
  (rule 4: never colour alone); on My profile it is a set of radio buttons. The colours
  are the ones the Flying Cards page uses, plus one token, `cardYellow`, because `warn`
  is a dark amber and a button called Yellow has to look yellow — dark text on it only.
- **A card shown here is a note, not the record.** The CFI issues cards and the card a
  pilot carries is what counts; both pages say so. A member can set their own. Do not
  let a card decide what anybody may see or do on the site, and do not show a member's
  card to other members without the club deciding that first.
- A card adds no reading (what each allows is in the Flying Cards summary, which
  everybody is asked to confirm). **Student pilot adds the Student Pilots Guide.**

- **Who sets a role.** The member, on **My sign-in → My profile** (`/account/profile`),
  by ticking it; or a controller, on the Members page, by clicking it in the member's
  block (click again to take it off; it saves at once). It is one list — either can
  change what the other set. The table notes who changed it last.
- **What a role does.** It shows beside the name on the Members page and the reading
  record, and it adds that duty's manuals to the member's required reading. Which manual
  goes with which role is the `roles` on each item in
  `src/content/required-reading.ts`. **That pairing was a first draft by the website
  editor**; the CFI and the duty leads should correct it there:

  | Role | Added to that member's required reading |
  |---|---|
  | Student pilot | Student Pilots Guide |
  | A flying card | nothing more |
  | Any winch role | Winch Operating Manual, Launch Speeds |
  | Launch master, launch marshal | Launch Marshals Manual, Launch Speeds |
  | Any clerk role | Duty Clerk Manual |
  | IFP | Introductory Flights, Trial Lessons Guidelines |
  | BI | those two, and the Student Pilots Guide |
  | FI, CFI | those three, and Training (Pre-solo) Exercises |
  | Mutual flyer | Mutual Flying — Requirements; Mutual Flying — Preparation and Briefing Record |

  The instructing documents were chosen by reading what each says it is for. The BGA's
  own instructor manuals are not on the list — they are not the club's to issue. The
  Student Pilots Guide stays, uncounted, in "If you are learning to fly" for anybody who
  is neither a student pilot nor an instructor; a group marked `duties: true` is one that
  offers the way to My profile.
- **The number is the same everywhere on a page.** The menu, the dashboard line and the
  list all get the member's roles from one shared place (`src/lib/my-roles.ts`), which
  asks again whenever the member moves to another page, comes back to the tab, or a role
  is changed. On the first day the menu said "all 8" beside a list saying "all 12",
  because the menu had asked once and never again. Do not give a component its own copy.
- **What a role does not do.** It is not a record that anybody is qualified, cleared or
  current, and the pages say so. **It opens nothing.** Who may see or do what is decided
  by the marks in `src/lib/auth.ts` and by `requireController()`; never write code that
  lets a role unlock anything, because a member can tick any role for themselves.
- **To add a role:** one line in `ROLES` in `src/lib/roles.ts`, and its manuals in
  `required-reading.ts`. Nothing has to be run in Supabase: since migration 012 the
  database checks only that a role is a short lower-case name, and the server drops
  anything not in `ROLES` before saving. Never reuse an id for a different duty. To
  retire one, take it out of `ROLES`; it stops being shown and counted, and nothing is
  deleted.

**The profile's emergency details** — emergency contact, next of kin, the member's own
mobile, blood type, and "anything a first-aider should know" — are the most personal
thing the portal holds. Blood type and the note are health information, and the contacts
are other people's names and numbers. The rules, none of them optional:

- Every field is optional, and the page tells the member who can see it before they type.
- **No browser can read the table** (`portal_profiles`: row-level security on, no
  policies). The member's own reach them through the server (`src/lib/profile.ts`); a
  member's action starts with `requireMember()` (`src/lib/member.ts`) and uses the
  signed-in person's id and nothing the form sends.
- **A controller sees one member's at a time, on purpose.** "Emergency details" beside a
  name fetches that member's; the Members page itself only knows *whether* somebody has
  given any. Each opening is noted in `portal_profile_views` (who, whose, when — not the
  details), and if it cannot be noted the details are not shown. Do not add a list,
  an export or a search of emergency details.
- Nothing of them goes in a log, an email, a commit or this repository (rule 6).
- A member who clears every box has the row deleted, not blanked.
- It is separate from Free Flight, which holds the club's membership records and may
  hold a next of kin already. Nothing is copied either way; the page tells members to
  keep both up to date.
- **Before the membership is invited, somebody on the committee should check this
  against the club's Data Protection Policy** — health information needs a stated reason
  and the member's clear agreement, and the policy should say the portal holds it.

Roles are in `portal_member_roles`, which a member's own browser may read (their own row
only — the tally on every page needs it) and nobody's browser may write. All three
tables are migration 011; 012 loosens the check on role names, as above.

### The portal is members only — who gets in, and how
Switched on in November 2026 at Phil's request. `src/lib/auth.ts` has the rules and
`middleware.ts` is the lock; read the comments at the top of each before changing either.

- **A visitor** sees three pages: the front page (`/`), sign-in (`/login`) and "Ask to
  join" (`/join`). They share one frame, `src/components/FrontDoor.tsx`. **Nothing from
  inside the portal goes on them** — no news, no names, no menu.
- **Everything else needs a signed-in member.** A member is an account carrying the mark
  `portal_member`, which only the server's secret key can set. Signing up is not enough,
  and "Allow new users to sign up" stays OFF in Supabase regardless.
- **It fails shut.** There is no setting that opens the live site. `NEXT_PUBLIC_PORTAL_OPEN=true`
  is for a developer's own computer only. The old `NEXT_PUBLIC_PREVIEW_OPEN` is no longer read.

**Controllers** (the mark `portal_admin`) run the Members page, `/admin/members`, reached
from **My sign-in → Members**:

- *Add a member* — name and email address. The account is made at once with a **temporary
  password, shown once**, for the controller to pass on in person, by telephone or by text.
- *Waiting to join* — requests from the front page (table `portal_requests`, migration
  005). Approve makes the account the same way; Decline makes nothing.
- *Temp password* — a new temporary password for somebody who has forgotten theirs. There
  is no "email me a reset link" yet.
- *Roles* — the club's duties, clickable in each member's block. See "Roles, and My profile".
- *Emergency details* — shown for a member who has given some. See the same section.
- *The club's list* — see the next section.
- *Remove access / Restore access*, and *Make a controller*. A controller cannot remove
  themselves, so there is always one.

A member on a temporary password is taken to `/account/password` and can go nowhere else
until they have chosen their own (10 characters or more). Anybody can change theirs later
from **My sign-in → Change my password**.

**A temporary password lasts 14 days** (`TEMP_PASSWORD_DAYS` in `src/lib/auth.ts`, and the
same number in `middleware.ts`). After that the sign-in page says it has run out and a
controller makes another. This is there because invitations are emailed: a password
sitting unread in an inbox must not stay good for ever.

### The club's list, and inviting everybody
The Supabase table `portal_roll` (migration 006) is the list of members the club means to
invite: first name, surname, email address. **Being on it gives nobody a sign-in**, and
nothing is sent to anybody until a controller presses a button. It was loaded on
25 November 2026 from the club's own Members' Directory of April 2026 (chairman's
approval, as reported by Phil) — 191 people. **Nothing in it came from Free Flight.**

On the Members page (`src/components/ClubList.tsx`) a controller can:

- *Invite one person.* Always works. With email set up the invitation is emailed;
  without it the temporary password is shown once, as for "Add a member".
- *Invite everybody who is ready.* **Only when email is set up** (`RESEND_API_KEY` and
  `MAIL_FROM` in Vercel); until then the button is greyed out and says why. It asks "are
  you sure", then works through the list five at a time, showing how far it has got. It
  can be stopped, and pressing it again carries on — nobody is invited twice. If an email
  cannot be sent, that person's account is taken back and they stay on the list.
- *Email me a sample first* — sends the controller the invitation with a made-up password.
- *Add or change an address*, *take somebody off*, *put them back*.
- *Add names* — paste "first name, surname, email", one person to a line. This is how an
  export from the membership secretary goes in. Anybody already listed is left out.

Who is **not** included when everybody is invited: people with no email address, two
people sharing one address (each sign-in needs its own), and anybody marked "check first"
— the thirty who were in the September 2025 directory but not the April 2026 one.

The wording of the invitation is `invitation()` in `src/lib/mail.ts`. It gives the
portal's address (`PORTAL_URL` in Vercel if set, otherwise the Vercel project's own
address), says the password lasts 14 days, and says the portal is separate from Free
Flight. **Resend's free plan sends 100 emails a day**, so the first full invitation takes
two days, or a month of the paid plan; the page stops cleanly and says so.

**The names are never in this repository** (rule 6). Not in a migration, a test, a commit
message or these notes. They go straight into Supabase, or in through the paste box.

The code that does all this is `src/app/(portal)/admin/members/actions.ts`. **Every action
there begins with `requireController()`**, which asks Supabase who is signed in; without
that, anybody could call them. Do not add one that skips it, and never import
`src/lib/supabase/admin.ts` (the secret key) into a component that runs in the browser.
The check itself lives in `src/lib/controller.ts`, and the reading reminders
(`src/app/(portal)/admin/reading/actions.ts`) begin with it too.

**Three things found on the first day, 25 November 2026 — do not undo them.**

- *Typing was invisible on the sign-in and join pages.* A white card on the dark front
  page inherited white text, so what a member typed was white on white. `globals.css` now
  makes any `.card` on a dark surface dark-on-white, and the sign-in form has "Show the
  password as I type". **Type into every box when you test a form** — a screenshot of an
  empty form looks perfect.
- *"Ask to join" answered "Requests cannot be taken at the moment".* The server was using
  its own copy of the Supabase address (`SUPABASE_URL`), which did not lead to the project.
  The server now uses the address members sign in with (`NEXT_PUBLIC_SUPABASE_URL`) — see
  `src/lib/supabase/admin.ts`. When Supabase refuses the server, the reason is written to
  Vercel → Logs as a line beginning `[portal]` (never a name, address or key).
- *The first controller could not find where to approve people.* Controllers now have a
  **Members** button in the header, with the number waiting to join beside it
  (`/api/admin/waiting`). Nobody emails a controller, so that number is the only notice.

**What the lock does not cover.** The pages are locked; the script files behind them
(`/_next/static/…`) are not, because a browser has to fetch them before anybody is signed
in. Their names are long and unguessable, but they are not secret, and the ones behind the
search boxes carry the text being searched (document titles, the safety log, the roles
list). Two consequences: the three public pages must never import from `src/content` in a
component marked `'use client'` (the sign-in form is handed the one telephone number it
needs), and nothing truly confidential belongs in `src/content` at all — that is what the
private file store is for.

**Members' names and email addresses live in Supabase only** — never in this repository,
a content file, a commit message or a log (rule 6).

The menu says "My sign-in" and the sign-in page says "portal" throughout, because the
Free Flight button sits beside it and is a different system with a different password.

**The first controller** is made by hand, once: see README, "The portal is members only".

**Still open — make the GitHub repository private.** The lock keeps a visitor out of the
website, but everything on it (news, names, notices) is also in the repository, which was
public when last checked. Until that is changed the lock is only half shut.

### No preview notes or hint boxes on the pages
Phil's instruction, November 2026: pages carry the club's content, not commentary about
the website. The "Preview mode" banner, the "still on the old site" boxes, the "how this
page is organised" boxes and the "rebuilt from the old page" footers were all removed.
Do not add new ones. Things that stayed because they are content or a safety matter: the
vacant-roles callout, the airspace re-brief panel, the notes inside the emergency
procedures, and the red "Verify before relying on this page" box on Emergency Procedures —
that one comes out only when the Safety Officer has checked the telephone numbers.


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
   Free Flight. If a directory is ever added here it must be opt-in per field.
7. **Touch targets at least 44×44px** with real spacing. `.tap` in `globals.css` enforces the minimum.
   `.tap-sm` is the one compact control, for the roles and buttons beside each name on the
   Members page: 44px wherever a finger does the pressing, 34px only with a mouse. Do not
   use it elsewhere.
8. **Every link in the content of a page** — external or not — gets `target="_blank"
   rel="noopener noreferrer"` and a visible "opens in a new tab" cue; navigation stays in
   the same tab. See "Which tab a link opens in". (One exception: plain Free Flight
   links are steered into a single reused tab — see "One tab, signed in once".)

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
│   ├── page.tsx           The public front page — sign in, or ask to join
│   ├── login/  join/      Sign-in, and "Ask to join". The only other public pages
│   ├── (portal)/          Every members' page. layout.tsx has the nav + footer
│   │   ├── admin/members/ Controllers only: add, approve, invite and remove members
│   │   ├── admin/reading/ Controllers only: who has confirmed the required reading,
│   │   │                  and the button that emails a member a reminder
│   │   ├── admin/submissions/  Controllers only: approve what members send in
│   │   ├── account/profile/   My profile: the duties I do, and my emergency details
│   │   ├── account/reading/   Where a reminder's button lands: read one document and tick it
│   │   └── account/password/  Choose or change your portal password
│   └── globals.css        Base type, focus rings, bands, .card/.link/.tap/.pill helpers
├── components/
│   ├── Nav.tsx            The six-item menu, the "Also" group, Free Flight dropdown
│   ├── ui.tsx             Band, PageHeader, Section, Figures, tiles — use these
│   └── DocumentLibrary.tsx  Search + filter for the document list
├── content/               ← MOST EDITS HAPPEN HERE. Plain data, no React
│   ├── news.ts            News and Notices brought from the old site (new ones are
│   │                      posted on the News page — see src/lib/news.ts)
│   ├── documents-imported.ts  THE document list. One row per file
│   ├── documents.ts       file() / current() helpers, ENRICH titles and review dates
│   ├── training.ts        What the Training page features
│   ├── roles.ts           Roles and role holders
│   ├── site.ts            Fees, calendar, weather links, contacts, Find It A–Z
│   ├── awareim.ts         The ONLY place AwareIM URLs appear
│   └── retired/           Kept, not used
├── lib/                   auth.ts (who gets in), Supabase clients, files.ts (old-site files),
│                          mail.ts (the one place that sends email), news.ts (all the
│                          news, file and posted), sent-in.ts (approved stories and
│                          photographs), controller.ts (the check every controller
│                          action starts with), uploads.ts (what may be uploaded),
│                          photos.ts (the smaller copies of a picture), roles.ts (the
│                          duties and what reading they add), profile.ts (a
│                          member's emergency details), member.ts (the check a
│                          member's own action starts with)
└── app/files/             The one route every old-site file goes through
middleware.ts              THE LOCK. Every request passes through it
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
- [ ] **Make the GitHub repository private** — the portal is locked but its text is all in
      the repository
- [ ] In Supabase → Authentication, turn OFF "Allow new users to sign up". A self-made
      account cannot get into the portal (it is not a member), but there is no reason to
      allow them at all
- [ ] Email for the portal (`RESEND_API_KEY`, `MAIL_FROM`, the club domain's DNS records).
      **The bulk invitation waits on this.** After it: a member resetting a forgotten
      password themselves, and a controller being told when somebody asks to join — neither
      is built yet
- [ ] Before inviting everybody: get the current membership from the membership secretary
      and paste it into "Add names", and have somebody check the thirty marked "check first"
- [x] `supabase/migrations/006_portal_roll.sql` — applied 25 November 2026
- [x] `supabase/migrations/007_reading_reminders.sql` — applied 25 November 2026
- [x] `supabase/migrations/008_portal_news.sql`, `009_submission_decisions.sql` and
      `010_news_attachments.sql` — applied 25 November 2026
- [x] `supabase/migrations/011_roles_and_profiles.sql` — run by Phil, 25 November 2026
- [x] `supabase/migrations/012_more_roles.sql` — run by Phil; seen in place 27 November
      2026. A new role now needs no SQL
- [ ] **CFI and duty leads to check which manuals go with which role**
      (`src/content/required-reading.ts`) — a first draft by the website editor
- [ ] **Committee to check the profile's emergency details against the Data Protection
      Policy** before members are invited (blood type and medical notes are health
      information), and to say whether anybody besides controllers should see them
- [ ] Decide which is the club's noticeboard while the old site is still running: news
      posted on the portal does not appear on the old site, or the other way about
- [ ] Move the two Bronze Theory Zoom recordings (596 MB) somewhere that can hold them
- [ ] **Safety Officer to verify `/safety/emergency`** — all four procedures are transcribed
      from the old site (MainGd.asp and its EmrgcyGdnc pages), but several hospital telephone
      numbers in the source have irregular digit counts. They are reproduced exactly as
      published and flagged "number needs checking" rather than guessed at. This is the one
      page where being wrong could matter.
- [x] The portal locked to members — November 2026. `NEXT_PUBLIC_PREVIEW_OPEN` can be
      deleted from Vercel; it is no longer read
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
- [x] Proper titles for the documents named after their files — done November 2026 for
      everything current. Archived documents still carry file names; add to `ENRICH`
- [ ] **PDF copies of the 26 Word and PowerPoint files**, so they open in the browser
      (see "Word and PowerPoint files")
- [ ] CFI or Secretary to check the 36 documents archived as old versions in November 2026
- [ ] Bring the five Blake Robertshaw pages across from the old site (introduction, task
      list, turn points, rules, notes for badge hunters)
- [ ] Camphill Catering's two mobile numbers are in `site.ts` and shown on the Directory.
      Rule 6 says no personal numbers without consent — confirm, or remove them
- [ ] Check the album names in `gallery.ts` that were a best reading of a folder name
      (Longest Day, Neighbours' Night, RF 100 km, Shipley aerobatics, KRB)
