# DLGC Members' Portal

Members' portal for Derbyshire & Lancashire Gliding Club, Camphill, Great Hucklow.

Next.js · TypeScript · Tailwind CSS · Supabase Auth · Vercel.

> **Maintaining this site?** Read [`CLAUDE.md`](./CLAUDE.md) first. It is written for a club
> volunteer and covers the common jobs — adding news, adding documents, retiring documents —
> plus the rules that must not be broken.

---

## Run it locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. It works straight away with no accounts and no database —
**preview mode** leaves the login gate open so you can look around.

---

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project**, import that repo. Framework auto-detects as Next.js.
3. Deploy. It will work immediately in preview mode.
4. Add environment variables when you are ready to switch auth on (below).

## Switch on real sign-in

1. Create a project at [supabase.com](https://supabase.com) (free tier is ample).
2. **Project Settings → API**: copy the Project URL and the `anon` public key.
3. In Vercel, **Settings → Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon public key |
   | `NEXT_PUBLIC_PREVIEW_OPEN` | `false` |

4. In Supabase, **Authentication → Providers**: enable **Email**, and turn **off** "Enable
   sign-ups" so only accounts you create can sign in.
5. Add members under **Authentication → Users → Add user**. Set a password and tick
   "Auto confirm user".
6. Redeploy.

> ⚠️ **`NEXT_PUBLIC_PREVIEW_OPEN` must be `false` in production.** While it is `true` the portal
> is open to anyone with the URL.

This login is completely separate from Free Flight (AwareIM). Different system, different
database, different password. The login page says so, because members will otherwise assume
they are the same.

---

## The old site's files

Every document, photograph and presentation from the old members' site is linked as
`/files/members/…`. The portal decides where it comes from each time one is opened:

| Who is asking | The file has been copied across | What happens |
|---|---|---|
| Signed in to the portal | yes | Opens from the club's private storage. No second password |
| Signed in to the portal | no (too big, or newer than the copy) | Opens on the old site, as before |
| Not signed in, portal in preview | either | Opens on the old site, as before |
| Not signed in, login gate on | either | Sent to the sign-in page |

The copies live in a **private** Supabase Storage bucket called `legacy`. It is never made
public: it holds committee minutes, accounts and lists of named members.

### Copying the files across (once, and again whenever the old site gains files)

1. Run `supabase/migrations/003_legacy_files.sql` in the Supabase SQL editor. It creates the
   private bucket and lets signed-in members read from it.
2. On the computer that has the wget copy of the old site (usually `~/Desktop/dlgc-mirror`):

   ```bash
   node scripts/upload-legacy.mjs ~/Desktop/dlgc-mirror --dry-run   # look first
   node scripts/upload-legacy.mjs ~/Desktop/dlgc-mirror             # then copy
   ```

   It asks for the Supabase **secret** key and does not show it. Never put that key in a chat,
   an email or this repository. Files already uploaded are skipped, so it is safe to re-run.
3. Read `dlgc-upload-report.json`: it lists what went up, what was over 50 MB, and which
   files the portal links to that were not in your copy (they keep opening on the old site).

### What does not fit

The free plan holds 1 GB and 50 MB per file. Everything fits except three files, which stay
on the old site until they are moved somewhere else:

| File | Size |
|---|---|
| Bronze Theory Zoom recording — Operational Procedures (`.mp4`) | 381 MB |
| Bronze Theory Zoom recording — Threat and Error Management (`.mp4`) | 215 MB |
| Camphill News, October 2018, high-resolution (`.pdf`) | 60 MB |

The two recordings would sit well as unlisted videos on the club's own YouTube channel.

`scripts/import-mirror.mjs` is the earlier importer that produced the document list. It is
kept for reference and is not part of copying files across.

---|---|
| 2 Bronze Theory Zoom recordings (`.mp4`) | **596 MB** |
| 569 other documents (PDFs, Word, PowerPoint) | ~730 MB |
| 952 images | 87 MB |
| 589 pages (`.asp` / `.htm`) | 7 MB |

Note it is **not** the photographs — those are only 87 MB. Two video files are a quarter of
the entire archive. Options, cheapest first:

1. **Move the two videos elsewhere** (YouTube unlisted, Vimeo, or object storage) and link
   them. That alone removes 596 MB.
2. **Cloudflare R2** — free to 10 GB, S3-compatible. Serve `/legacy/...` from there and
   leave the repo holding only code. This is the recommended answer for the full archive.
3. **Supabase Storage** — already provisioned, but the free tier is 1 GB, so it fits only
   after the videos are moved out.

Whichever you pick, only the `href` values in `documents-imported.ts` change — a
find-and-replace of `/legacy/` for the storage URL. Nothing else in the site cares.

This produces two files:

- `scripts/out/manifest.json` — every file found, with its old URL and its new path
- `scripts/out/unmatched.json` — **files not yet referenced in `src/content/documents.ts`**

`unmatched.json` is the important one. It is the guarantee that nothing is left behind: work
through it and either add each file to the document manifest (use `tier: 'archive'` if it is
historic) or confirm it is genuinely junk. Then update the `href` values in
`src/content/documents.ts` from the legacy URLs to the new `/legacy/...` paths.

---

## How the content is organised

Three tiers, and they are the whole point of the reorganisation:

| Tier | Meaning | Where it shows |
|---|---|---|
| **Live** | Changes during a season — fees, rotas, current notices | Dashboard + Documents |
| **Reference** | Current and in force — manuals, rules, policies | Documents |
| **Archive** | Historic and superseded — kept forever | Archive, and Documents when asked for |

The Documents page defaults to **Current** (live + reference). The archive is one click away,
fully searchable, never deleted.

Every document can carry a `reviewDue` date. Past dates automatically raise an
"Overdue for review" flag. That is the mechanism that stops this library going the way of the
old Links Library, which still listed withdrawn insurance advice and Covid-19 guidance years later.

---

## Member submissions and the webcam

Three server-side environment variables switch on optional features. All are **server-only**
— do not prefix any of them `NEXT_PUBLIC_`, or their secrets would be shipped to the browser.

| Variable | Enables | Where to get it |
|---|---|---|
| `SUPABASE_URL` | Blog and photo submissions | Same value as `NEXT_PUBLIC_SUPABASE_URL` |
| `SUPABASE_SERVICE_ROLE_KEY` | ditto | Supabase → Settings → API → `service_role` |
| `WEBCAM_SNAPSHOT_URL` | Live webcam on the Weather page | The camera's snapshot URL, credentials included |

Submissions also need, in Supabase:

- a table `submissions` with columns `kind`, `name`, `email`, `title`, `body`,
  `image_path`, `status` (default `'pending'`), `created_at`
- a private storage bucket named `submissions`

The editor reviews pending items in the Supabase dashboard's Table Editor. Every feature
degrades honestly when its variable is missing: the form tells the member to email the
editor, and the webcam offers the met station page.

---

## Project structure

```
src/
├── app/(portal)/     Signed-in pages; layout.tsx holds nav + footer
├── app/login/        Sign-in
├── components/       Nav, shared UI, DocumentLibrary
├── content/          ← most edits happen here (plain data, no React)
└── lib/              Supabase clients, auth config
scripts/
└── import-mirror.mjs Import the mirrored old site
```

---

## Accessibility

Built to WCAG 2.2 AA, because the old site failed it in ways that mattered for this membership:
18px base type, visible focus rings, no hover-only navigation, no horizontal scrolling at any
width, descriptive link text, colour never used alone, and Emergency Procedures one tap from
every page.

Test any change at **390px wide** as well as desktop.

---

## What this portal deliberately does not do

- **It does not touch Free Flight (AwareIM).** It links to it. See `CLAUDE.md`.
- **It holds no member personal data.** Contact details stay in Free Flight.
- **It has no analytics.** None was wanted.
- **It is independent of the public site** (`glidingclub.org.uk`). A link can be added from
  there later; nothing here depends on it.
