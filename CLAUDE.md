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
- Every link opens in a new tab and lands on the AwareIM login page.
- All AwareIM URLs live in **one file**: `src/content/awareim.ts`. If the URL changes, that is the only edit.
- If someone asks you to "integrate" or "pull data from" AwareIM, stop and check with the committee first. That decision has not been made.

---

## Common jobs

### Add a news item
Edit `src/content/news.ts`. Add to the **top** of the `news` array.

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
   Wide tables scroll inside their own container, not the page.
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
- [ ] Safety Officer to verify the wording on `/safety/emergency` before go-live
- [ ] Set `NEXT_PUBLIC_PREVIEW_OPEN=false` in Vercel once member accounts exist
- [ ] **Transfer Supabase / Vercel / GitHub to club-owned accounts before handover** (see above)
- [ ] Convert duty rotas from quarterly PDFs into a real roster view
- [ ] Photo galleries — import and lay out
- [ ] Restart the Flying Blog (last entry November 2024)
- [ ] Decide who owns each document category and set real `reviewDue` dates
