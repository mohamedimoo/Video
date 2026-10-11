// Export the film's text, images and camera as After Effects layer data.
// usage: node tools/ae-export.mjs            -> ae/salam_layers.json (read by ae/build_salam_project.jsx)
//                                              ae/plate_keys.json  (read by tools/render.mjs --plate)
// Every frame is drawn once with the camera removed. Each line of text and each image is followed from frame
// to frame into one track, and each track becomes one AE layer. Its keyframes are reduced to the ones needed
// to reproduce the motion within a quarter of a pixel.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';
const FPS = 60;
const b = await chromium.launch({ args: ['--disable-gpu'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.error('PAGE ERROR', e.message));
await p.goto('file://' + path.resolve('showreel.html'));
await p.waitForFunction(() => window.ready === true);
await p.addScriptTag({ path: path.resolve('tools/ae-instrument.js') });
const DUR = await p.evaluate(() => window.DUR);
const NF = Math.round(DUR * FPS);
const imgSize = await p.evaluate(() => Object.fromEntries(Object.entries(IMG).map(([k, im]) => [k, [im.width, im.height]])));

const frames = [];
for (let f0 = 0; f0 < NF; f0 += 120) {
  const chunk = await p.evaluate(([a, b, fps]) => { const out = []; for (let f = a; f < b; f++) out.push(window.__AE.trace(f / fps)); return out; }, [f0, Math.min(NF, f0 + 120), FPS]);
  frames.push(...chunk);
  if (f0 % 1200 === 0) console.log('traced', f0, '/', NF);
}
await b.close();

// ---- follow each element from frame to frame ----
const prefix = k => k.replace(/#\d+$/, '');
const sig = e => e.k === 'img' ? 'img:' + e.name : e.k === 'rise' ? 'rise:' + e.s.replace(/[\d.,]+/g, '#') + ':' + e.tIn : 'text:' + e.s.replace(/[\d.,]+/g, '#');
const anchor = e => { const m = e.m, x = e.k === 'img' ? e.cx : e.k === 'rise' ? e.L : e.x, y = e.k === 'img' ? e.cy : e.y; return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; };
const tracks = [];
let live = new Map();                    // prefix -> tracks seen in the previous frame
frames.forEach((fr, f) => {
  const next = new Map();
  const groups = new Map();
  fr.els.forEach((e, order) => { e.order = order; const g = prefix(e.key); (groups.get(g) || groups.set(g, []).get(g)).push(e); });
  for (const [g, els] of groups) {
    const cand = (live.get(g) || []).slice();
    const take = (e, tr) => { tr.fr.set(f, e); tr.last = f; (next.get(g) || next.set(g, []).get(g)).push(tr); cand.splice(cand.indexOf(tr), 1); };
    const rest = [];
    for (const e of els) { const tr = cand.find(c => c.sig === sig(e)); tr ? take(e, tr) : rest.push(e); }
    for (const e of rest) {
      // a counter or a line being typed: same call site, same kind, close by
      const [x, y] = anchor(e);
      let best = null, bd = 260;
      for (const c of cand) {
        if (c.kind !== e.k || e.k === 'rise' || (e.k === 'img' && c.name !== e.name)) continue;
        const [cx, cy] = anchor(c.fr.get(c.last)), dd = Math.hypot(cx - x, cy - y);
        if (dd < bd) { bd = dd; best = c; }
      }
      if (best) take(e, best);
      else { const tr = { kind: e.k, sig: sig(e), name: e.name, fr: new Map([[f, e]]), first: f, last: f, order: f * 1000 + e.order }; tracks.push(tr); (next.get(g) || next.set(g, []).get(g)).push(tr); }
    }
  }
  live = next;
});

// ---- keyframes, reduced (Ramer-Douglas-Peucker on each channel) ----
function rdp(ts, vs, tol) {
  const n = ts.length; if (n <= 2) return [...Array(n).keys()];
  const keep = new Uint8Array(n); keep[0] = keep[n - 1] = 1;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [a, z] = stack.pop(); let bi = -1, bd = tol;
    for (let i = a + 1; i < z; i++) {
      const u = (ts[i] - ts[a]) / (ts[z] - ts[a]);
      let d = 0; for (let c = 0; c < vs[i].length; c++) d = Math.max(d, Math.abs(vs[i][c] - (vs[a][c] + (vs[z][c] - vs[a][c]) * u)));
      if (d > bd) { bd = d; bi = i; }
    }
    if (bi >= 0) { keep[bi] = 1; stack.push([a, bi], [bi, z]); }
  }
  return [...keep.keys()].filter(i => keep[i]);
}
const r3 = v => Math.round(v * 1000) / 1000;
function channel(fs, val, tol) {
  const ts = fs.map(f => f / FPS), vs = fs.map(val);
  return rdp(ts, vs, tol).map(i => [r3(ts[i]), ...vs[i].map(r3)]);
}
function holds(fs, val) {            // stepped values: keep only the changes
  const out = []; let prev;
  fs.forEach(f => { const v = val(f); const s = JSON.stringify(v); if (s !== prev) { out.push([r3(f / FPS), v]); prev = s; } });
  return out;
}
const hexRGB = c => {
  const r = /^rgba?\(([^)]+)\)/.exec(c);
  if (r) return r[1].split(',').slice(0, 3).map(v => r3(+v / 255));
  const m = /^#?([0-9a-f]{6})$/i.exec(c); if (!m) return [1, 1, 1];
  const n = parseInt(m[1], 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255].map(r3);
};

function rrPoly(c) {                      // a rounded rect as 36 points, clockwise from the top-left corner
  const out = [], { x, y, w, h, r } = c, K = 8;
  const corners = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
  for (const [cx, cy, a0] of corners) for (let i = 0; i <= K; i++) { const a = a0 + i / K * Math.PI / 2; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return out;
}
function maskPts(e, src) {
  const [W, H] = src, m = e.m, det = m[0] * m[3] - m[1] * m[2];
  const inv = (X, Y) => { const x = X - m[4], y = Y - m[5]; return [(m[3] * x - m[2] * y) / det, (-m[1] * x + m[0] * y) / det]; };
  const c = e.clip || { x: e.cx - e.w / 2, y: e.cy - e.h / 2, w: e.w, h: e.h, r: 0, m };
  return rrPoly(c).flatMap(([px, py]) => {
    const cm = c.m, X = cm[0] * px + cm[2] * py + cm[4], Y = cm[1] * px + cm[3] * py + cm[5];
    const [u, v] = inv(X, Y);
    return [(u - (e.cx - e.w / 2)) * W / e.w, (v - (e.cy - e.h / 2)) * H / e.h];
  });
}
const layers = tracks.filter(tr => [...tr.fr.values()].some(e => e.native)).map((tr, i) => {
  const all = []; for (let f = tr.first; f <= tr.last; f++) all.push(f);
  const on = all.filter(f => tr.fr.has(f));
  // base style from the frame where the element is largest (lines that grow in from nothing keep a sane size)
  const e0 = on.reduce((best, f) => { const e = tr.fr.get(f); return !best || (e.size || e.h) * (e.native ? 1 : 0.999) > (best.size || best.h) ? e : best; }, null);
  const ms = e => Math.hypot(e.m[0], e.m[1]);
  const L = { type: tr.kind, in: r3(tr.first / FPS), out: r3((tr.last + 1) / FPS), order: tr.order };
  L.pos = channel(on, f => anchor(tr.fr.get(f)), 0.25);
  L.rot = channel(on, f => { const e = tr.fr.get(f); return [Math.atan2(e.m[1], e.m[0]) * 180 / Math.PI]; }, 0.05);
  L.op = holds(all, f => { const e = tr.fr.get(f); return e && e.native ? Math.round(e.a * 100) : 0; });
  if (tr.kind === 'img') {
    L.name = e0.name; L.src = imgSize[e0.name];
    // drawn size in pixels (width and height: phone screens are stretched to the screen's shape)
    L.wh = channel(on, f => { const e = tr.fr.get(f); return [e.w * ms(e), e.h * ms(e)]; }, 0.25);
    // a rounded clip becomes a mask, in the image's own pixels
    if (on.some(f => tr.fr.get(f).clip)) L.mask = channel(on, f => maskPts(tr.fr.get(f), imgSize[e0.name]), 0.5);
  } else {
    Object.assign(L, { size: e0.size, weight: e0.w, ls: e0.ls, color: hexRGB(e0.c), text: e0.s });
    L.scale = channel(on, f => { const e = tr.fr.get(f); return [100 * ms(e) * e.size / e0.size]; }, 0.05);
    const cols = holds(on, f => hexRGB(tr.fr.get(f).c));
    if (cols.length > 1) L.colors = channel(on, f => hexRGB(tr.fr.get(f).c), 0.004);
    const txt = holds(on, f => tr.fr.get(f).s);
    if (txt.length > 1) L.texts = txt;
    L.text = txt[txt.length - 1][1];
    if (tr.kind === 'text') L.align = e0.al;
    else {
      Object.assign(L, { tIn: r3(e0.tIn), tOut: e0.tOut > 1e8 ? null : r3(e0.tOut), d: e0.d });
    }
  }
  L.name = L.name || (L.text.length > 40 ? L.text.slice(0, 40) + '…' : L.text);
  return L;
}).sort((a, b) => a.order - b.order);

const cam = channel([...Array(NF).keys()], f => { const c = frames[f].cam; return [960 + c.x, 540 + c.y, c.z * 100]; }, 0.02);
fs.mkdirSync('ae', { recursive: true });
fs.writeFileSync('ae/salam_layers.json', JSON.stringify({ dur: DUR, fps: FPS, cam, layers }));
fs.writeFileSync('ae/plate_keys.json', JSON.stringify(frames.map(fr => fr.els.filter(e => e.native).map(e => e.key))));
const tally = new Map(); frames.forEach(fr => fr.els.forEach(e => { if (e.k === "img") return; const t = tally.get(e.s) || [0, 0]; t[e.native ? 0 : 1]++; tally.set(e.s, t); }));
fs.writeFileSync("out/ae_baked_text.json", JSON.stringify([...tally].filter(([, [n, b]]) => b > n).map(([s, [n, b]]) => [s, n, b])));
const kf = layers.reduce((a, l) => a + l.pos.length + (l.scale || l.wh).length + l.rot.length + l.op.length, 0);
console.log(`layers: ${layers.length} (${layers.filter(l => l.type === 'img').length} images, ${layers.filter(l => l.type === 'rise').length} kinetic lines, ${layers.filter(l => l.type === 'text').length} text), keyframes: ${kf}, camera keys: ${cam.length}`);
