#!/usr/bin/env node
/**
 * Import the mirrored old site into this project.
 *
 * The old members' site was mirrored with wget into a folder like:
 *   ~/Desktop/dlgc-mirror/www.dlgc.org.uk/members/...
 *
 * This script:
 *   1. Copies every PDF, image and other asset into public/legacy/, preserving paths
 *   2. Writes scripts/out/manifest.json — every file with its old URL and new path
 *   3. Writes scripts/out/unmatched.json — files NOT referenced by src/content/documents.ts,
 *      so nothing is silently left behind
 *
 * It does NOT overwrite src/content/documents.ts. Review the report, then update the
 * `href` values (or ask Claude to do it from manifest.json).
 *
 * Usage:
 *   node scripts/import-mirror.mjs ~/Desktop/dlgc-mirror
 *   node scripts/import-mirror.mjs ~/Desktop/dlgc-mirror --dry-run
 */

import { readdir, mkdir, copyFile, writeFile, stat, readFile } from 'node:fs/promises';
import { join, relative, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'public', 'legacy');
const OUT = join(ROOT, 'scripts', 'out');

const ASSET_EXT = new Set([
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pub', '.txt', '.csv',
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico',
  '.mp4', '.mov', '.avi', '.mp3', '.zip',
]);
const PAGE_EXT = new Set(['.asp', '.html', '.htm']);

const src = process.argv[2];
const dryRun = process.argv.includes('--dry-run');

if (!src) {
  console.error('Usage: node scripts/import-mirror.mjs <path-to-dlgc-mirror> [--dry-run]');
  process.exit(1);
}

async function walk(dir, acc = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc);
    else if (e.isFile()) acc.push(p);
  }
  return acc;
}

/** Reconstruct the original URL from wget's directory layout. */
function toOldUrl(relPath) {
  const parts = relPath.split('/');
  const host = parts[0];
  return `https://${host}/${parts.slice(1).join('/')}`;
}

const files = await walk(src);
console.log(`Scanned ${files.length} files under ${src}`);

const assets = [];
const pages = [];
const other = [];

for (const abs of files) {
  const rel = relative(src, abs).split('\\').join('/');
  if (rel.startsWith('.') || rel === 'mirror.log') continue;
  const ext = extname(rel).toLowerCase();
  const info = { rel, oldUrl: toOldUrl(rel), newPath: `/legacy/${rel}`, ext, bytes: (await stat(abs)).size };
  if (ASSET_EXT.has(ext)) assets.push({ ...info, abs });
  else if (PAGE_EXT.has(ext)) pages.push(info);
  else other.push(info);
}

console.log(`  ${assets.length} assets (PDFs, images, documents)`);
console.log(`  ${pages.length} pages (.asp/.html — content already ported by hand)`);
console.log(`  ${other.length} other files`);

if (!dryRun) {
  let copied = 0;
  for (const a of assets) {
    const dest = join(DEST, a.rel);
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(a.abs, dest);
    copied++;
    if (copied % 100 === 0) console.log(`  copied ${copied}/${assets.length}…`);
  }
  console.log(`Copied ${copied} assets into public/legacy/`);
}

// Which assets are already referenced in the manifest?
let manifestSrc = '';
try {
  manifestSrc = await readFile(join(ROOT, 'src', 'content', 'documents.ts'), 'utf8');
} catch { /* fine */ }

const referenced = [];
const unmatched = [];
for (const a of assets) {
  const filename = a.rel.split('/').pop();
  const decoded = decodeURIComponent(filename ?? '');
  const hit =
    manifestSrc.includes(filename ?? '\u0000') ||
    manifestSrc.includes(encodeURIComponent(decoded)) ||
    manifestSrc.includes(decoded);
  (hit ? referenced : unmatched).push({ oldUrl: a.oldUrl, newPath: a.newPath, ext: a.ext, bytes: a.bytes });
}

await mkdir(OUT, { recursive: true });
await writeFile(
  join(OUT, 'manifest.json'),
  JSON.stringify({ generated: new Date().toISOString(), counts: { assets: assets.length, pages: pages.length, other: other.length }, assets: assets.map(({ abs, ...rest }) => rest), pages }, null, 2)
);
await writeFile(join(OUT, 'unmatched.json'), JSON.stringify({ count: unmatched.length, files: unmatched }, null, 2));

console.log('');
console.log(`Referenced in documents.ts : ${referenced.length}`);
console.log(`NOT yet referenced         : ${unmatched.length}   <-- review scripts/out/unmatched.json`);
console.log('');
console.log('Nothing gets left behind: every unmatched file is listed. Add each one to');
console.log('src/content/documents.ts (tier archive if historic), or confirm it is genuinely junk.');
if (dryRun) console.log('\n(dry run — no files were copied)');
