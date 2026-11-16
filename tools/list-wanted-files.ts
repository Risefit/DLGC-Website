/**
 * Lists every old-site file the portal links to, with the name it is stored
 * under. scripts/upload-legacy.mjs reads the result to tell you which linked
 * files are missing from your copy of the old site.
 *
 *   npx tsx --tsconfig tsconfig.json tools/list-wanted-files.ts
 *
 * Run it again after adding documents, then commit scripts/legacy-wanted.json.
 */
import * as fs from 'node:fs';
import { FILES_BASE, storageKey } from '../src/lib/files';
import { albums } from '../src/content/gallery';

const found = new Map<string, string>();
const add = (href: string) => {
  const path = href.slice(FILES_BASE.length + 1).split(/[?#]/)[0];
  let segments: string[];
  try {
    segments = path.split('/').map(decodeURIComponent);
  } catch {
    segments = path.split('/');
  }
  found.set(storageKey(segments), segments.join('/'));
};
const walk = (v: unknown, seen = new Set<unknown>()) => {
  if (typeof v === 'string') {
    if (v.startsWith(FILES_BASE + '/')) add(v);
  } else if (v && typeof v === 'object' && !seen.has(v)) {
    seen.add(v);
    for (const x of Object.values(v as object)) walk(x, seen);
  }
};

(async () => {
  for (const f of fs.readdirSync('src/content').filter((f) => f.endsWith('.ts'))) {
    walk(await import('../src/content/' + f));
  }
  // Gallery photographs are stored as /legacy/… and rebased when shown.
  for (const a of albums) for (const p of a.photos) if (p.src.startsWith('/legacy/')) add(FILES_BASE + p.src.slice('/legacy'.length));

  const list = [...found].map(([key, path]) => ({ key, path })).sort((a, b) => a.path.localeCompare(b.path));
  fs.writeFileSync('scripts/legacy-wanted.json', JSON.stringify(list, null, 0).replace(/\},\{/g, '},\n{') + '\n');
  console.log(`${list.length} files written to scripts/legacy-wanted.json`);
})();
