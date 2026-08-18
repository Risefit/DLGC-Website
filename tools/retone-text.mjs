/**
 * One-off: move supporting body text from `slate2` to the new `inkMuted`.
 *
 * The audit found `text-slate2` used 191 times against `text-ink` 5 times, so
 * every paragraph, description, caption and hint rendered at the same 6.9:1
 * mid grey and nothing could be weighted against anything else.
 *
 * THE RULE, applied mechanically so it is reviewable:
 *   • `text-slate2` alongside `text-xs`  → stays slate2.  Genuine captions:
 *     timestamps, counts, "opens in a new tab", file sizes.
 *   • `text-slate2` anywhere else        → becomes inkMuted. Card descriptions,
 *     section leads, form hints, prose — text a member actually reads.
 *   • `text-slate2/70`, `/50` etc.       → untouched. Those are placeholder and
 *     disabled treatments where the fade is the point.
 *
 * Run once: node tools/retone-text.mjs
 * Then delete it, or keep it as the record of what was changed and why.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src';
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.tsx?$/.test(e.name)) files.push(full);
  }
})(ROOT);

/** Every className string, whether a plain attribute or a template literal. */
const CLASS_BLOCK = /className=(?:"([^"]*)"|\{`([\s\S]*?)`\}|\{'([^']*)'\})/g;

let changed = 0;
let kept = 0;
const touched = [];

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');

  const after = before.replace(CLASS_BLOCK, (whole) => {
    // Only bare `text-slate2` — never `text-slate2/70` and friends.
    if (!/\btext-slate2\b(?!\/)/.test(whole)) return whole;
    if (/\btext-xs\b/.test(whole)) {
      kept += (whole.match(/\btext-slate2\b(?!\/)/g) ?? []).length;
      return whole;
    }
    const n = (whole.match(/\btext-slate2\b(?!\/)/g) ?? []).length;
    changed += n;
    return whole.replace(/\btext-slate2\b(?!\/)/g, 'text-inkMuted');
  });

  if (after !== before) {
    fs.writeFileSync(file, after);
    touched.push(file);
  }
}

console.log(`slate2 → inkMuted : ${changed}`);
console.log(`kept as slate2    : ${kept} (captions, alongside text-xs)`);
console.log(`files touched     : ${touched.length}`);
