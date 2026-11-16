/**
 * Draws the contour-line texture used behind the page bands.
 *
 * Run:  node tools/make-contours.mjs
 * Writes public/img/contours-dark.svg (pale lines, for navy bands) and
 *        public/img/contours-light.svg (navy lines, for pale bands).
 *
 * THIS IS A DRAWING, NOT A MAP. The terrain is invented: a long edge with a
 * steep scarp on one side and a gentle dip slope on the other, which is the
 * shape of the ground Camphill sits on, plus a few knolls. It must never be
 * presented as a chart of the airfield. Every fifth line is drawn heavier, the
 * way index contours are on an Ordnance Survey sheet.
 *
 * No dependencies. The output is deterministic (fixed seed), so re-running it
 * produces the same files and a clean git diff.
 */
import fs from 'node:fs';

const W = 1600, H = 900, CELL = 10, LEVELS = 22;

// ── a small seeded value-noise, so the lines wobble like real ground ─────
let seed = 1935;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const G = 12, lattice = Array.from({ length: (G + 2) * (G + 2) }, rnd);
const smooth = (t) => t * t * (3 - 2 * t);
function noise(x, y) {
  const gx = (x / W) * G, gy = (y / H) * G, x0 = Math.floor(gx), y0 = Math.floor(gy);
  const fx = smooth(gx - x0), fy = smooth(gy - y0), at = (i, j) => lattice[(j % (G + 2)) * (G + 2) + (i % (G + 2))];
  return (at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx) * (1 - fy) + (at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx) * fy;
}

// ── the invented ground ─────────────────────────────────────────────────
const hill = (x, y, cx, cy, r, a) => a * Math.exp(-(((x - cx) ** 2 + (y - cy) ** 2) / (r * r)));
function height(x, y) {
  // the edge: runs from lower-left to upper-right, bowed slightly
  const nx = 0.42, ny = 0.91;                       // unit normal to the edge
  const bow = 70 * Math.sin((x / W) * Math.PI * 1.15);
  const d = (x - 180) * nx + (y - 620 + bow) * ny - 80;
  const edge = d < 0 ? Math.exp(-((d / 300) ** 2)) : Math.exp(-((d / 95) ** 2));   // gentle one side, steep the other
  return (
    1.0 * edge +
    hill(x, y, 1240, 250, 230, 0.55) +
    hill(x, y, 420, 170, 190, 0.42) +
    hill(x, y, 1480, 760, 210, -0.38) +             // a valley head
    hill(x, y, 780, 820, 260, -0.30) +
    0.34 * (noise(x, y) - 0.5) + 0.16 * (noise(x * 2.3 + 400, y * 2.3 + 90) - 0.5)
  );
}

// ── marching squares ────────────────────────────────────────────────────
const cols = Math.ceil(W / CELL) + 1, rows = Math.ceil(H / CELL) + 1;
const grid = new Float32Array(cols * rows);
let lo = Infinity, hi = -Infinity;
for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
  const v = height(i * CELL, j * CELL); grid[j * cols + i] = v; lo = Math.min(lo, v); hi = Math.max(hi, v);
}
const key = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
function contour(level) {
  const segs = [];
  const lerp = (ax, ay, av, bx, by, bv) => { const t = (level - av) / (bv - av); return [ax + (bx - ax) * t, ay + (by - ay) * t]; };
  for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
    const x = i * CELL, y = j * CELL;
    const a = grid[j * cols + i], b = grid[j * cols + i + 1], c = grid[(j + 1) * cols + i + 1], d = grid[(j + 1) * cols + i];
    const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
    if (idx === 0 || idx === 15) continue;
    const T = () => lerp(x, y, a, x + CELL, y, b), R = () => lerp(x + CELL, y, b, x + CELL, y + CELL, c),
          B = () => lerp(x, y + CELL, d, x + CELL, y + CELL, c), L = () => lerp(x, y, a, x, y + CELL, d);
    const table = { 1: [[L, B]], 2: [[B, R]], 3: [[L, R]], 4: [[T, R]], 5: [[T, L], [B, R]], 6: [[T, B]], 7: [[T, L]],
                    8: [[T, L]], 9: [[T, B]], 10: [[T, R], [L, B]], 11: [[T, R]], 12: [[L, R]], 13: [[B, R]], 14: [[L, B]] };
    for (const [p, q] of table[idx]) segs.push([p(), q()]);
  }
  // join segments end to end into lines
  const ends = new Map();
  const add = (k, s) => { if (!ends.has(k)) ends.set(k, []); ends.get(k).push(s); };
  segs.forEach((s) => { s.used = false; add(key(s[0]), s); add(key(s[1]), s); });
  const lines = [];
  for (const s of segs) {
    if (s.used) continue; s.used = true;
    const line = [s[0], s[1]];
    for (const dir of [1, 0]) {
      for (;;) {
        const tip = dir ? line[line.length - 1] : line[0];
        const next = (ends.get(key(tip)) || []).find((t) => !t.used);
        if (!next) break; next.used = true;
        const other = key(next[0]) === key(tip) ? next[1] : next[0];
        dir ? line.push(other) : line.unshift(other);
      }
    }
    if (line.length > 6) lines.push(line);
  }
  return lines;
}
// thin the points, then draw each line as smooth quadratic curves through midpoints
function path(line) {
  const pts = line.filter((_, i) => i % 3 === 0 || i === line.length - 1);
  const f = (n) => Math.round(n * 10) / 10;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${f(pts[i][0])} ${f(pts[i][1])} ${f(mx)} ${f(my)}`;
  }
  const last = pts[pts.length - 1];
  return d + `L${f(last[0])} ${f(last[1])}`;
}

const thin = [], index = [];
for (let n = 1; n < LEVELS; n++) {
  const level = lo + ((hi - lo) * n) / LEVELS;
  (n % 5 === 0 ? index : thin).push(...contour(level).map(path));
}
function svg(stroke) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" fill="none" stroke="${stroke}" stroke-linecap="round">` +
    `<path stroke-width="1" stroke-opacity=".5" d="${thin.join('')}"/>` +
    `<path stroke-width="1.6" stroke-opacity=".85" d="${index.join('')}"/></svg>\n`;
}
fs.writeFileSync('public/img/contours-dark.svg', svg('#BFD9EC'));
fs.writeFileSync('public/img/contours-light.svg', svg('#123A5C'));
console.log(`lines: ${thin.length} thin + ${index.length} index; ${fs.statSync('public/img/contours-dark.svg').size} bytes each`);
