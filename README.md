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

This login is completely separate from Members' Admin (AwareIM). Different system, different
database, different password. The login page says so, because members will otherwise assume
they are the same.

---

## Importing the old site's files

The old members' site was mirrored with `wget` into a folder (typically `~/Desktop/dlgc-mirror`).

**The classification is already done.** `src/content/documents-imported.ts` holds all
**571 documents** recovered from the mirror, deduplicated and sorted into tiers. What
remains is copying the actual files so the links resolve:

```bash
# See what's there without copying anything
node scripts/import-mirror.mjs ~/Desktop/dlgc-mirror --dry-run

# Copy assets into public/legacy/ and produce the reports
node scripts/import-mirror.mjs ~/Desktop/dlgc-mirror
```

### Before you copy: the size problem

The mirror is 2.4 GB on disk, ~1.4 GB deduplicated. **That cannot go in the git repo** —
GitHub rejects files over 100 MB and Vercel would rebuild the lot on every deploy.

Where the bulk actually is:

| Item | Size |
|---|---|
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

- **It does not touch Members' Admin (AwareIM).** It links to it. See `CLAUDE.md`.
- **It holds no member personal data.** Contact details stay in Members' Admin.
- **It has no analytics.** None was wanted.
- **It is independent of the public site** (`glidingclub.org.uk`). A link can be added from
  there later; nothing here depends on it.
