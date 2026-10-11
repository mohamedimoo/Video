// ===== Core: timing, easing, colour, drawing helpers =====
// Everything is a pure function of t. No state survives between frames.
const W = 1920, H = 1080;
const BPM = 84, BEAT = 60 / BPM, BAR = BEAT * 4;
const DUR = BAR * 41.5;            // ~118.6 s: 41 full bars + final half bar
// Scenes are written against "story beats". Bars were inserted in two passes to give sections room:
// INSERTS maps story beats to v2 beats, INSERTS2 maps v2 beats to real beats.
// B() addresses story beats, BN() addresses v2 beats, BV() addresses real beats directly.
const INSERTS = [[36, 4], [72, 4], [106, 4], [112, 4], [132, 4]];
const INSERTS2 = [[54, 4], [83, 4], [128, 4]];   // Nafath, the AI plan story, step by step
const shiftOf = (n, L) => L.reduce((a, [p, k]) => a + (n >= p ? k : 0), 0);
const BN = n => (n + shiftOf(n, INSERTS2)) * BEAT;  // v2 beat -> seconds
const B = n => BN(n + shiftOf(n, INSERTS));          // story beat -> seconds
const BV = n => n * BEAT;                            // real beat -> seconds
// Large wipes are drawn at the frame's own time so they stay crisp (no blur halo)
const crispT = t => Math.round(t * 60) / 60;

const C = {
  deep: '#003830', teal: '#005147', night: '#020E0D', leaf: '#52B13C',
  green: '#00B140', neon: '#54F35D', mist: '#F0F5F0', stone: '#E5DFDC',
  ink: '#1E1E1E', red: '#E5484D', orange: '#F08A24', purple: '#8E6CEF',
  white: '#FFFFFF', dim: '#6E8F88', line: '#2B5F56', fog: '#9DB5AE'
};

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, x) => a + (b - a) * x;
const P = (t, t0, d) => clamp((t - t0) / d);
const eOut = x => { x = clamp(x); return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); };
const eIn = x => { x = clamp(x); return x === 0 ? 0 : Math.pow(2, 10 * x - 10); };
const eIn3 = x => { x = clamp(x); return x * x * x; };        // gentle accelerate (big bright exits)
const eInOut = x => {
  x = clamp(x); if (x === 0 || x === 1) return x;
  return x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
};
// Damped spring step response written as a function of time (zeta < 1 -> ~1.5% overshoot, never bouncy)
function spr(t, t0, w = 17, z = 0.8) {
  const s = t - t0; if (s <= 0) return 0;
  const k = Math.sqrt(1 - z * z), wd = w * k;
  return 1 - Math.exp(-z * w * s) * (Math.cos(wd * s) + (z / k) * Math.sin(wd * s));
}
// spring that goes 0 -> 1 at tIn and 1 -> 0 at tOut (exit is an exponential accelerate-away)
const inOut = (t, tIn, tOut, w, z) => spr(t, tIn, w, z) * (1 - eIn(P(t, tOut, 0.32)));

function hex(c) {
  if (c[0] === 'r') return c.slice(c.indexOf('(') + 1, -1).split(',').map(Number);
  const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255];
}
function mixC(a, b, p) {
  const A = hex(a), Bc = hex(b); p = clamp(p);
  return `rgb(${A.map((v, i) => Math.round(v + (Bc[i] - v) * p)).join(',')})`;
}

// ---- drawing ----
function bg(ctx, c) { ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); }
function rr(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
}
function poly(ctx, pts) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}
function circ(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2); }

const fnt = (size, w = 700) => `${w} ${size}px Geist`;
function setT(ctx, o) {
  ctx.font = fnt(o.size || 64, o.w || 700);
  ctx.letterSpacing = (o.ls || 0) + 'px';
  ctx.textAlign = o.align || 'left';
  ctx.textBaseline = o.base || 'alphabetic';
  ctx.fillStyle = o.c || C.mist;
}
function T(ctx, s, x, y, o = {}) { setT(ctx, o); ctx.fillText(s, x, y); }
function TW(ctx, s, o = {}) { setT(ctx, o); ctx.textAlign = 'left'; return ctx.measureText(s).width; }

// glyph positions with exact kerning: x of letter i = width(s[0..i]) - width(letter i)
const _lx = new Map();
function letterX(ctx, s, o) {
  const key = s + '|' + (o.size || 64) + '|' + (o.w || 700) + '|' + (o.ls || 0);
  let v = _lx.get(key);
  if (!v) {
    v = { x: [], w: TW(ctx, s, o) };
    for (let i = 0; i < s.length; i++) v.x.push(TW(ctx, s.slice(0, i + 1), o) - TW(ctx, s[i], o));
    _lx.set(key, v);
  }
  return v;
}
// A line that rises out of its own baseline mask at tIn and leaves upward through it at tOut,
// letter by letter (a short stagger), so every line of type arrives with kinetic energy.
function rise(ctx, t, s, x, y, o, tIn, tOut = 1e9, d = 0.42) {
  if (t < tIn || !s) return;
  // letters enter one after another; they leave in a tighter cascade that still ends 0.3 s after tOut,
  // so an outgoing line is always gone before the next line reaches its space
  const n = s.length, st = Math.min(0.018, 0.3 / Math.max(1, n)), so = Math.min(0.012, 0.08 / Math.max(1, n - 1));
  if (t >= tOut + 0.3) return;
  const size = o.size || 64, lx = letterX(ctx, s, o), w = lx.w;
  const al = o.align || 'left';
  const L = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x;
  ctx.save();
  ctx.beginPath(); ctx.rect(L - 30, y - size * 1.02, w + 60, size * 1.32); ctx.clip();
  setT(ctx, { ...o, align: 'left' });
  if (t >= tIn + st * (n - 1) + d && t < tOut) ctx.fillText(s, L, y);   // settled: draw whole line
  else for (let i = 0; i < n; i++) {
    if (s[i] === ' ') continue;
    const pi = eOut(P(t, tIn + i * st, d)), po = eIn(P(t, tOut + i * so, 0.3 - so * (n - 1)));
    if (pi <= 0 || po >= 1) continue;
    ctx.fillText(s[i], L + lx.x[i], y + (1 - pi) * size * 1.25 - po * size * 1.3);
  }
  ctx.restore();
}
// Words that rise one after another; words: [[text, colour]], times: per-word start
function riseWords(ctx, t, words, x, y, o, times, tOut = 1e9) {
  const sp = TW(ctx, ' ', o);
  const ws = words.map(w => TW(ctx, w[0], o));
  const total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let cx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x;
  words.forEach((w, i) => {
    rise(ctx, t, w[0], cx, y, { ...o, align: 'left', c: w[1] || o.c }, times[i], tOut + i * 0.03);
    cx += ws[i] + sp;
  });
  return total;
}
// Slam: arrives oversized and lands with an exponential settle (motion blur comes from the shutter)
function slam(ctx, t, s, x, y, o, tIn, tOut = 1e9) {
  if (t < tIn) return;
  const p = eOut(P(t, tIn, 0.24)), po = eIn(P(t, tOut, 0.3));
  if (po >= 1) return;
  const k = lerp(2.4, 1, p) * (1 - po);
  ctx.save(); ctx.translate(x, y - (o.size || 64) * 0.35); ctx.scale(k, k);
  T(ctx, s, 0, (o.size || 64) * 0.35, { ...o, align: 'center' });
  ctx.restore();
}

// ---- polygons & morphing ----
function resample(pts, N) {
  const L = [0];
  for (let i = 1; i <= pts.length; i++) {
    const a = pts[i - 1], b = pts[i % pts.length];
    L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const tot = L[L.length - 1], out = [];
  let j = 0;
  for (let k = 0; k < N; k++) {
    const d = tot * k / N;
    while (L[j + 1] < d) j++;
    const a = pts[j], b = pts[(j + 1) % pts.length], seg = (L[j + 1] - L[j]) || 1;
    const u = (d - L[j]) / seg;
    out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
  }
  return out;
}
function area(pts) { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
function centroid(pts) { let x = 0, y = 0; for (const p of pts) { x += p[0]; y += p[1]; } return [x / pts.length, y / pts.length]; }
// rotate target start index for the least travel; also match winding
function align(a, b) {
  if (Math.sign(area(a)) !== Math.sign(area(b))) b = b.slice().reverse();
  const N = a.length; let best = 0, bd = Infinity;
  for (let o = 0; o < N; o += 2) {
    let d = 0;
    for (let i = 0; i < N; i += 3) { const p = a[i], q = b[(i + o) % N]; d += (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; }
    if (d < bd) { bd = d; best = o; }
  }
  return a.map((_, i) => b[(i + best) % N]);
}
function mixPts(a, b, p) { return a.map((q, i) => [q[0] + (b[i][0] - q[0]) * p, q[1] + (b[i][1] - q[1]) * p]); }
function circlePts(cx, cy, r, N, a0 = -Math.PI / 2) {
  const o = []; for (let i = 0; i < N; i++) { const a = a0 + i / N * Math.PI * 2; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return o;
}
function rectPts(x, y, w, h, N) { return resample([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], N); }
// annulus sector as a closed outline
function sectorPts(cx, cy, r0, r1, a0, a1, N) {
  const o = [], n = 40;
  for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); o.push([cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]); }
  for (let i = n; i >= 0; i--) { const a = lerp(a0, a1, i / n); o.push([cx + Math.cos(a) * r0, cy + Math.sin(a) * r0]); }
  return resample(o, N);
}
// The Salam-style leaf: a lens with sharp tips, pointing up-right
function leafPts(cx, cy, s, ang = -Math.PI / 4, N = 160) {
  const o = [];
  for (let i = 0; i < N; i++) {
    const th = i / N * Math.PI * 2;
    const sn = Math.sin(th);
    const x = Math.cos(th) * s / 2, y = sn * Math.pow(Math.abs(sn), 0.55) * s * 0.29;
    o.push([cx + x * Math.cos(ang) - y * Math.sin(ang), cy + x * Math.sin(ang) + y * Math.cos(ang)]);
  }
  return o;
}
function drawLeaf(ctx, cx, cy, s, col = C.green, ang = -Math.PI / 4, rib = null) {
  if (s <= 0.5) return;
  poly(ctx, leafPts(cx, cy, s, ang, 96)); ctx.fillStyle = col; ctx.fill();
  if (rib) {
    ctx.strokeStyle = rib; ctx.lineWidth = Math.max(1, s * 0.035); ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(ang) * s * 0.3, cy - Math.sin(ang) * s * 0.3);
    ctx.lineTo(cx + Math.cos(ang) * s * 0.3, cy + Math.sin(ang) * s * 0.3); ctx.stroke();
  }
}
// ---- glyph outlines (opentype) for type that turns into shapes ----
let FONT = null;
function flatten(cmds) {
  const cs = []; let cur = null, px = 0, py = 0;
  for (const c of cmds) {
    if (c.type === 'M') { cur = [[c.x, c.y]]; cs.push(cur); px = c.x; py = c.y; }
    else if (c.type === 'L') { cur.push([c.x, c.y]); px = c.x; py = c.y; }
    else if (c.type === 'Q') {
      for (let i = 1; i <= 8; i++) { const u = i / 8, v = 1 - u; cur.push([v * v * px + 2 * v * u * c.x1 + u * u * c.x, v * v * py + 2 * v * u * c.y1 + u * u * c.y]); }
      px = c.x; py = c.y;
    } else if (c.type === 'C') {
      for (let i = 1; i <= 10; i++) { const u = i / 10, v = 1 - u; cur.push([v * v * v * px + 3 * v * v * u * c.x1 + 3 * v * u * u * c.x2 + u * u * u * c.x, v * v * v * py + 3 * v * v * u * c.y1 + 3 * v * u * u * c.y2 + u * u * u * c.y]); }
      px = c.x; py = c.y;
    }
  }
  return cs.filter(c => c.length > 2);
}
const _gcache = {};
// per-glyph contours for a string at size, origin = left baseline
function glyphRun(str, size) {
  const key = str + '|' + size; if (_gcache[key]) return _gcache[key];
  const gs = FONT.stringToGlyphs(str), upm = FONT.unitsPerEm; let x = 0; const out = [];
  gs.forEach((g, i) => {
    const cs = flatten(g.getPath(x, 0, size).commands);
    const adv = g.advanceWidth * size / upm;
    out.push({ ch: str[i], cs, x0: x, adv });
    x += adv + (i < gs.length - 1 ? FONT.getKerningValue(g, gs[i + 1]) * size / upm : 0);
  });
  return (_gcache[key] = { gl: out, w: x });
}
function fillContours(ctx, cs, dx, dy, col) {
  ctx.beginPath();
  for (const c of cs) { ctx.moveTo(c[0][0] + dx, c[0][1] + dy); for (let i = 1; i < c.length; i++) ctx.lineTo(c[i][0] + dx, c[i][1] + dy); ctx.closePath(); }
  ctx.fillStyle = col; ctx.fill('nonzero');
}

// ---- tiny 3D ----
function cam3(yaw, pitch, dist, cx = 960, cy = 540, f = dist) {
  const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  return {
    p(x, y, z) {
      const x1 = c * x + s * z, z1 = -s * x + c * z;
      const y2 = cp * y - sp * z1, z2 = sp * y + cp * z1;
      const k = f / (z2 + dist);
      return [cx + x1 * k, cy + y2 * k, z2];
    }
  };
}
const BOXF = [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [4, 5, 1, 0], [3, 2, 6, 7]];
// returns visible faces of an axis-aligned box: {pts, z, kind}
function boxFaces(cam, x0, y0, z0, x1, y1, z1, tag) {
  const v = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map(q => cam.p(...q));
  const kinds = ['front', 'back', 'left', 'right', 'top', 'bottom'];
  const out = [];
  BOXF.forEach((f, i) => {
    const pts = f.map(k => v[k]);
    if (area(pts) <= 0.5) return;
    out.push({ pts, z: pts.reduce((a, p) => a + p[2], 0) / 4, kind: kinds[i], tag });
  });
  return out;
}
// affine mapping of a local (w x h) rect onto a projected quad (p0 top-left, p1 top-right, p3 bottom-left)
function onQuad(ctx, q, w, h) {
  const [p0, p1, , p3] = q;
  ctx.setTransform((p1[0] - p0[0]) / w, (p1[1] - p0[1]) / w, (p3[0] - p0[0]) / h, (p3[1] - p0[1]) / h, p0[0], p0[1]);
}
