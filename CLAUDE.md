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
Edit `src/content/documents.ts`. One entry per document. The important fields:

- `tier` — `'live'` (changes during the season), `'reference'` (current, in force), `'archive'` (historic)
- `audience` — who it is for. Drives the "Who it's for" filter
- `reviewDue` — **set this on anything that goes stale.** Past dates automatically show an
  "Overdue for review" flag on the Documents page and a count on the dashboard. This is the
  mechanism that stops the library silently filling up with withdrawn advice, which is exactly
  what happened to the old Links Library
- `superseded: true` — for anything kept for the record but no longer in force. It stays
  searchable and is clearly labelled

### Retire a document
Do **not** delete it. Set `tier: 'archive'` and `superseded: true`, and put why in `note`.
Club history is not recoverable once deleted; storage is free.

### Change fees, calendar, weather links, roles
All in `src/content/site.ts`.

### Change social channels, the Safety Spot, or the charities
All in `src/content/community.ts`.
- **Social:** set a channel's `href` to go live. `href: null` renders a greyed-out
  placeholder rather than a dead link — that is how Instagram, TikTok and X currently show.
- **Safety Spot:** the panel from the old site's home page, kept in full. `strong: true`
  gives an entry the red left border (Safe Start and Crash/Emergency have it).
- **Charities:** name, link and one line on why the club supports it.

### Member submissions (flying blog stories, gallery photos)
Members submit via forms on `/club-life/blog` and `/gallery`. **Nothing publishes
automatically** — everything lands in the Supabase `submissions` table with status
`pending`, and the editor reviews it in the Supabase dashboard (Table Editor).

That gate is deliberate. The club's news voice is the best thing about the old site, and
an open publish button would lose it.

Needs two server-side variables in Vercel (no `NEXT_PUBLIC_` prefix):
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Without them the form tells the member to
email the editor instead — it never fails silently.

### Change colours, spacing, type
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
5. **Emergency Procedures stays one tap from every page** (it is in the footer of the portal layout).
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
│   └── globals.css        Base type, focus rings, .card/.link/.tap helpers
├── components/
│   ├── Nav.tsx            Top nav + Members' Admin dropdown
│   ├── ui.tsx             Shared building blocks — use these, don't reinvent
│   └── DocumentLibrary.tsx  Search + filter for the document manifest
├── content/               ← MOST EDITS HAPPEN HERE. Plain data, no React
│   ├── news.ts            News and Notices
│   ├── documents.ts       The document manifest (the heart of the site)
│   ├── site.ts            Fees, calendar, weather links, contacts, roles, Find It A–Z
│   └── awareim.ts         The ONLY place AwareIM URLs appear
└── lib/                   Supabase clients and auth config
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
- [ ] Photo galleries — import and lay out
- [ ] Restart the Flying Blog (last entry November 2024)
- [ ] Decide who owns each document category and set real `reviewDue` dates
