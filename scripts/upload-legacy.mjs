#!/usr/bin/env node
/**
 * COPY THE OLD MEMBERS' SITE FILES INTO THE PORTAL'S PRIVATE STORAGE.
 *
 * Run this on the computer that holds the copy of the old site (the wget
 * mirror, usually a folder called dlgc-mirror):
 *
 *     node upload-legacy.mjs ~/Desktop/dlgc-mirror --dry-run     ← look first
 *     node upload-legacy.mjs ~/Desktop/dlgc-mirror               ← then copy
 *
 * It needs nothing installed except Node 18 or newer.
 *
 * WHAT IT DOES
 *   1. Finds every document, photograph and presentation under members/.
 *   2. Tells you how many there are, how big, and which files the portal
 *      links to that are NOT in your copy (those keep opening on the old site).
 *   3. Asks for the storage key, without showing it on screen.
 *   4. Uploads into the private bucket "legacy". Files already there are
 *      skipped, so it is safe to stop and run again.
 *   5. Writes dlgc-upload-report.json beside where you ran it.
 *
 * WHAT IT DOES NOT DO
 *   - It never deletes or changes anything in your copy of the old site.
 *   - It never makes a file public. The bucket is private; the portal gives a
 *     signed-in member a ten-minute link to one file at a time.
 *   - It skips anything over 50 MB (the free plan's limit) and lists it.
 *
 * THE KEY
 *   Supabase dashboard → project dlgc-members-portal → Project Settings →
 *   API Keys → the SECRET key (older projects call it "service_role").
 *   It can read and write everything in the project, so: paste it only into
 *   this prompt, never into a chat, an email or a file in the repository.
 *   This script keeps it in memory and does not write it anywhere.
 */

import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://nggycdgrivdjttgcimlh.supabase.co').replace(/\/$/, '');
const BUCKET = 'legacy';
const MAX_BYTES = 50 * 1024 * 1024;
/** The free plan holds 1 GB. Stay under it with room for the club to add files. */
const BUDGET_BYTES = 900 * 1024 * 1024;
const PARALLEL = 4;

/** Filled in when a single-file copy of this script is made for download. */
const EMBEDDED_WANTED = null; /*__WANTED__*/

const TYPES = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pps': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.ppsx': 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  '.pub': 'application/x-mspublisher',
  '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mp3': 'audio/mpeg',
  '.zip': 'application/zip',
};

/**
 * The name a file is stored under. IDENTICAL to storageKey() in
 * src/lib/files.ts — if one changes, change the other.
 */
export function storageKey(segments) {
  return segments
    .map((seg) =>
      Array.from(new TextEncoder().encode(seg.normalize('NFC').toLowerCase()))
        .map((b) => {
          const c = String.fromCharCode(b);
          return /[a-z0-9.-]/.test(c) ? c : '_' + b.toString(16).padStart(2, '0');
        })
        .join(''),
    )
    .join('/');
}

/** wget sometimes keeps %20 in a file name and sometimes writes the space. Accept both. */
function decodeName(name) {
  if (!name.includes('%')) return name;
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(n < 10 * 1024 * 1024 ? 1 : 0) + ' MB';

async function walk(dir, acc = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc);
    else if (e.isFile()) acc.push(p);
  }
  return acc;
}

/** Find the members/ folder inside whatever the user pointed at. */
async function findMembers(root) {
  const tries = [
    join(root, 'www.dlgc.org.uk', 'members'),
    join(root, 'dlgc.org.uk', 'members'),
    join(root, 'members'),
    root.replace(/[\\/]+$/, '').toLowerCase().endsWith('members') ? root : null,
  ].filter(Boolean);
  for (const t of tries) {
    try {
      if ((await stat(t)).isDirectory()) return t;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

/** Ask a question; with `hidden`, nothing typed or pasted is shown. */
function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(question);
    if (!hidden || !stdin.isTTY) {
      let buf = '';
      const onData = (d) => {
        buf += d;
        if (buf.includes('\n')) {
          stdin.off('data', onData);
          stdin.pause();
          resolve(buf.split('\n')[0].trim());
        }
      };
      stdin.setEncoding('utf8');
      stdin.resume();
      stdin.on('data', onData);
      return;
    }
    let buf = '';
    stdin.setRawMode(true);
    stdin.setEncoding('utf8');
    stdin.resume();
    const onData = (d) => {
      for (const ch of d) {
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false);
          stdin.off('data', onData);
          stdin.pause();
          stdout.write('\n');
          return resolve(buf.trim());
        }
        if (ch === '\u0003') {
          stdin.setRawMode(false);
          stdout.write('\nStopped.\n');
          process.exit(130);
        }
        if (ch === '\u007f' || ch === '\b') buf = buf.slice(0, -1);
        else buf += ch;
      }
    };
    stdin.on('data', onData);
  });
}

/** Refuse a key that is obviously the wrong one, with a reason a person can act on. */
function checkKey(key) {
  if (!key) return 'No key was entered.';
  if (key.startsWith('sb_publishable_')) return 'That is the PUBLISHABLE key. This needs the SECRET key (starts sb_secret_).';
  if (key.startsWith('sb_secret_')) return null;
  const parts = key.split('.');
  if (parts.length === 3) {
    try {
      const role = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')).role;
      if (role === 'service_role') return null;
      if (role === 'anon') return 'That is the ANON (public) key. This needs the SERVICE ROLE / SECRET key.';
    } catch {
      /* fall through */
    }
  }
  return 'That does not look like a Supabase secret key. It starts sb_secret_ or eyJ… and is on the API Keys page.';
}

async function loadWanted() {
  if (EMBEDDED_WANTED) return EMBEDDED_WANTED;
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    return JSON.parse(await readFile(join(here, 'legacy-wanted.json'), 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter((a) => a.startsWith('--')));
  const root = args.find((a) => !a.startsWith('--'));
  const dryRun = flags.has('--dry-run');
  const replace = flags.has('--replace');
  const wantedOnly = flags.has('--wanted-only');

  if (!root) {
    console.error('Tell me where the copy of the old site is, for example:\n  node upload-legacy.mjs ~/Desktop/dlgc-mirror --dry-run');
    process.exit(1);
  }
  if (Number(process.versions.node.split('.')[0]) < 18) {
    console.error(`This needs Node 18 or newer. You have ${process.versions.node}.`);
    process.exit(1);
  }

  const members = await findMembers(root);
  if (!members) {
    console.error(`I could not find a "members" folder in ${root}.\nPoint me at the folder that contains www.dlgc.org.uk (or members) and try again.`);
    process.exit(1);
  }
  console.log(`Reading ${members} …`);

  // ── 1. what is in the copy ────────────────────────────────────────────────
  const all = await walk(members);
  const byKey = new Map();
  const tooBig = [];
  let pages = 0;
  for (const abs of all) {
    const ext = extname(abs).toLowerCase();
    if (!TYPES[ext]) {
      if (/\.(asp|html?)$/i.test(abs)) pages++;
      continue;
    }
    const rel = abs.slice(members.length + 1).split(/[\\/]/).map(decodeName);
    const segments = ['members', ...rel];
    const key = storageKey(segments);
    const bytes = (await stat(abs)).size;
    if (bytes === 0) continue;
    if (bytes > MAX_BYTES) {
      tooBig.push({ path: segments.join('/'), bytes });
      continue;
    }
    // Two copies that differ only in capitals are the same file on the old
    // server. Keep the larger (a truncated download is the smaller one).
    const prev = byKey.get(key);
    if (!prev || bytes > prev.bytes) byKey.set(key, { abs, key, bytes, path: segments.join('/'), type: TYPES[ext] });
  }

  // ── 2. what the portal links to ───────────────────────────────────────────
  const wanted = await loadWanted();
  const wantedKeys = new Set(wanted ? wanted.map((w) => w.key) : []);
  const bigKeys = new Set(tooBig.map((t) => storageKey(t.path.split('/'))));
  const missing = wanted ? wanted.filter((w) => !byKey.has(w.key) && !bigKeys.has(w.key)) : [];

  // A PDF COPY of a Word or PowerPoint file sits beside the original with
  // ".pdf" on the end of its whole name ("JKU report.doc.pdf"). The portal
  // gives a signed-in member that copy, so the document opens in the browser
  // (pdfCopyKey in src/lib/files.ts). It counts as linked whenever its
  // original is.
  const OFFICE = /\.(docx?|rtf|pp[ts]x?|xlsx?)$/;
  const isPdfCopy = (key) => key.endsWith('.pdf') && OFFICE.test(key.slice(0, -4)) && wantedKeys.has(key.slice(0, -4));
  const isLinked = (f) => wantedKeys.has(f.key) || isPdfCopy(f.key);

  const found = [...byKey.values()];
  const linked = found.filter(isLinked);
  const extras = found.filter((f) => !isLinked(f));
  const office = found.filter((f) => wantedKeys.has(f.key) && OFFICE.test(f.key));
  const officeWithPdf = office.filter((f) => byKey.has(f.key + '.pdf'));
  const size = (list) => list.reduce((n, f) => n + f.bytes, 0);

  let plan = found;
  let leftOut = [];
  if (wanted && (wantedOnly || size(found) > BUDGET_BYTES)) {
    plan = linked;
    leftOut = extras;
  }

  console.log('');
  console.log(`  ${found.length} files to keep (${mb(size(found))}), ${pages} old web pages ignored`);
  if (wanted) {
    console.log(`  ${found.filter((f) => wantedKeys.has(f.key)).length} of the ${wanted.length} files the portal links to are here`);
    console.log(`  ${extras.length} more files are in the copy but not linked from the portal (${mb(size(extras))})`);
    if (missing.length) console.log(`  ${missing.length} linked files are NOT in this copy — they will keep opening on the old site`);
    if (office.length) {
      console.log(`  ${office.length} linked files are Word, PowerPoint or Excel; ${officeWithPdf.length} have a PDF copy beside them`);
      if (officeWithPdf.length < office.length) console.log('      (without a PDF copy they download instead of opening in the browser)');
    }
  }
  if (tooBig.length) {
    console.log(`  ${tooBig.length} files are over 50 MB and stay on the old site:`);
    for (const t of tooBig) console.log(`      ${mb(t.bytes).padStart(7)}  ${t.path}`);
  }
  if (leftOut.length) {
    console.log(`  The whole copy would not fit in 1 GB, so only the linked files will go up (${mb(size(plan))}).`);
  }
  console.log(`\n  Going up: ${plan.length} files, ${mb(size(plan))}`);

  const report = {
    when: new Date().toISOString(),
    source: members,
    planned: plan.length,
    plannedBytes: size(plan),
    uploaded: [],
    alreadyThere: [],
    failed: [],
    tooBig,
    notInThisCopy: missing.map((m) => m.path),
    notUploadedNoRoom: leftOut.map((f) => f.path),
  };

  if (dryRun) {
    await writeFile('dlgc-upload-report.json', JSON.stringify(report, null, 2));
    console.log('\nDry run — nothing was uploaded. The lists are in dlgc-upload-report.json.');
    return;
  }

  // ── 3. the key ────────────────────────────────────────────────────────────
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
  if (!key) {
    console.log('\nPaste the Supabase SECRET key and press Return. Nothing will appear as you paste — that is deliberate.');
    key = await ask('Secret key: ', { hidden: true });
  }
  const bad = checkKey(key);
  if (bad) {
    console.error('\n' + bad + '\nNothing was uploaded.');
    process.exit(1);
  }
  const headers = { Authorization: `Bearer ${key}`, apikey: key };

  const probe = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${BUCKET}`, { headers }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
  if (!probe.ok) {
    const body = (await probe.text()).slice(0, 200);
    console.error(
      probe.status === 0
        ? `\nCould not reach ${SUPABASE_URL}. Check the internet connection and try again.\n${body}`
        : probe.status === 401 || probe.status === 403
          ? '\nSupabase did not accept that key. Copy it again from the API Keys page — the whole of it.'
          : `\nThe private bucket "${BUCKET}" is not there yet (Supabase said ${probe.status}).\nRun supabase/migrations/003_legacy_files.sql in the Supabase SQL editor first.\n${body}`,
    );
    process.exit(1);
  }

  const go = await ask(`\nUpload ${plan.length} files (${mb(size(plan))}) to the private bucket? Type yes: `);
  if (!/^y(es)?$/i.test(go)) {
    console.log('Nothing was uploaded.');
    return;
  }

  // ── 4. upload ─────────────────────────────────────────────────────────────
  const queue = [...plan].sort((a, b) => a.bytes - b.bytes);
  let done = 0;

  async function put(f) {
    const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${f.key.split('/').map(encodeURIComponent).join('/')}`;
    let last = '';
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': f.type, 'x-upsert': replace ? 'true' : 'false', 'cache-control': 'max-age=3600' },
          body: await readFile(f.abs),
        });
        if (res.ok) return 'uploaded';
        const text = await res.text();
        if (res.status === 409 || /Duplicate|already exists/i.test(text)) return 'alreadyThere';
        last = `${res.status} ${text.slice(0, 160)}`;
        if (res.status >= 400 && res.status < 500 && res.status !== 429) break; // will not get better by retrying
      } catch (e) {
        last = String(e).slice(0, 160);
      }
      await new Promise((r) => setTimeout(r, 800 * attempt));
    }
    return 'failed: ' + last;
  }

  async function worker() {
    for (;;) {
      const f = queue.shift();
      if (!f) return;
      const out = await put(f);
      if (out === 'uploaded') report.uploaded.push(f.path);
      else if (out === 'alreadyThere') report.alreadyThere.push(f.path);
      else report.failed.push({ path: f.path, why: out.slice(8) });
      done++;
      if (done % 25 === 0 || done === plan.length) {
        process.stdout.write(`  ${done}/${plan.length}  (${report.uploaded.length} uploaded, ${report.alreadyThere.length} already there, ${report.failed.length} failed)\n`);
      }
    }
  }
  await Promise.all(Array.from({ length: PARALLEL }, worker));

  key = '';
  await writeFile('dlgc-upload-report.json', JSON.stringify(report, null, 2));

  console.log('');
  console.log(`Uploaded ${report.uploaded.length}, already there ${report.alreadyThere.length}, failed ${report.failed.length}.`);
  if (report.failed.length) {
    console.log('Some files failed. Run the same command again — it only retries what is missing.');
    for (const f of report.failed.slice(0, 8)) console.log(`   ${f.path}: ${f.why}`);
  }
  console.log('The full list is in dlgc-upload-report.json (it contains file names only, never the key).');
}

// Only run when started directly, so the tests can import storageKey().
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error('\nStopped: ' + (e?.message || e));
    process.exit(1);
  });
}
