// ===== ACT II — SHAPE MORPHING (beats 28–58) =====
const NM = 140;
const CIRC = [[560, 560], [960, 560], [1360, 560]], CR = 150;
const HAB_LO = { size: 30, w: 700, c: C.mist, align: 'center' };
const HAB_IC = ['ContentWriting', 'UserGroup', 'ShoppingBag01'];
const HAB_NAMES = ['Content', 'Community', 'Commerce'];
function rotPts(pts, cx, cy, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
}

// --- The habit loop: one continuous trefoil runs through Content, Community and Commerce ---
// A light draws the loop on its first lap, then keeps lapping faster and faster: the habit builds momentum.
// The strands really pass over and under each other at the three crossings.
const KN_S = 104, KN_NODE = 58, KN_W = 18, KN_SEG = 300;
const KN_U = [Math.PI / 3, Math.PI, 5 * Math.PI / 3];          // lobe tips: Content (lower left), Community (top), Commerce (lower right)
const KN_OVER = [1.8235, 3.9179, 6.0123];                       // at each crossing, the strand that passes over
const KN_BACK = '#0B5244', KN_FRONT = '#45A88C', KN_CHEV = '#A6E0CC';
const knotXYZ = u => [-(Math.sin(u) + 2 * Math.sin(2 * u)), Math.cos(u) - 2 * Math.cos(2 * u), -Math.sin(3 * u)];
const KN_T0 = B(31.55), KN_A = 0.85, KN_B = 0.16, KN_TAU1 = BN(36) - B(31.55), KN_V1 = KN_A + 2 * KN_B * KN_TAU1;
// laps of the light: it accelerates while the app stats land, then holds its speed
function knLaps(t) {
  const s = t - KN_T0; if (s <= 0) return 0;
  return s <= KN_TAU1 ? KN_A * s + KN_B * s * s : KN_A * KN_TAU1 + KN_B * KN_TAU1 * KN_TAU1 + KN_V1 * (s - KN_TAU1);
}
function knTimeOf(L) {            // when the light reached lap position L
  let a = KN_T0, b = KN_T0 + 30;
  for (let i = 0; i < 32; i++) { const m = (a + b) / 2; if (knLaps(m) < L) a = m; else b = m; }
  return (a + b) / 2;
}
function knAge(t, n) {            // seconds since the light last passed node n
  const L = knLaps(t), o = n / 3;
  return t <= KN_T0 || L < o ? 1e9 : Math.max(0, t - knTimeOf(o + Math.floor(L - o)));
}
// where the loop sits: left of the app rows, then small at the top for the 30-day comparison, then centre for "15×"
function knPose(t) {
  const a = eInOut(P(t, BN(36), 0.55)), b = eInOut(P(t, BN(39), 0.5));
  return { cx: lerp(lerp(620, 960, a), 960, b), cy: lerp(lerp(575, 300, a), 560, b), k: lerp(lerp(1, 0.5, a), 1, b) };
}
const knXY = (u, ps) => { const [x, y, z] = knotXYZ(u); return [ps.cx + x * KN_S * ps.k, ps.cy + y * KN_S * ps.k, z]; };
// which stretches of the loop exist: drawn on by the first lap, retracted into the nodes before "15×"
function knRanges(t) {
  const L = knLaps(t), u0 = KN_U[0];
  if (L <= 0) return [];
  if (L < 1) return [[u0, u0 + L * 2 * Math.PI]];
  const r = eInOut(P(t, BN(39.2), 0.55));
  if (r <= 0) return [[u0, u0 + 2 * Math.PI]];
  if (r >= 1) return [];
  const h = (1 - r) * Math.PI / 3, out = [];
  KN_U.forEach(un => { out.push([un, un + h]); out.push([un + 2 * Math.PI / 3 - h, un + 2 * Math.PI / 3]); });
  return out;
}
function knStroke(ctx, ps, ua, ub, style) {
  const n = Math.max(1, Math.ceil((ub - ua) / (2 * Math.PI) * KN_SEG));
  let prev = knXY(ua, ps);
  for (let i = 1; i <= n; i++) {
    const u = ua + (ub - ua) * i / n, p = knXY(u, ps);
    const [col, w] = style(u, (prev[2] + p[2]) / 2);
    ctx.strokeStyle = col; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
    prev = p;
  }
}
// flow chevrons travel along the ribbon
function knChevrons(ctx, ps, t, ua, ub) {
  const n = 15, sp = 2 * Math.PI / n, ph = ((t * 0.4) % 1) * sp;
  ctx.strokeStyle = KN_CHEV; ctx.lineWidth = 2.2 * ps.k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let k = -n; k < 2 * n; k++) {
    const u = KN_U[0] + k * sp + ph;
    if (u < ua + 0.05 || u > ub - 0.05) continue;
    const [x, y] = knXY(u, ps), [x2, y2] = knXY(u + 0.01, ps), a = Math.atan2(y2 - y, x2 - x), s = 4.8 * ps.k;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    ctx.beginPath(); ctx.moveTo(-s * 0.7, -s); ctx.lineTo(s * 0.5, 0); ctx.lineTo(-s * 0.7, s); ctx.stroke();
    ctx.restore();
  }
  ctx.lineCap = 'round';
}
// the light: a tapered neon streak with a bright head
const KN_TAIL = 1.2;
function knComet(ctx, ps, t, ua, ub) {
  const L = knLaps(t); if (L <= 0) return;
  const head = KN_U[0] + L * 2 * Math.PI;
  for (let m = -3; m <= 1; m++) {
    const h = head + m * 2 * Math.PI, a = Math.max(ua, h - KN_TAIL), b = Math.min(ub, h);
    if (a >= b) continue;
    knStroke(ctx, ps, a, b, u => {
      const f = clamp((u - (h - KN_TAIL)) / KN_TAIL);
      return [mixC(KN_FRONT, C.neon, Math.min(1, f * 1.8)), lerp(3, KN_W + 3, Math.pow(f, 1.3)) * ps.k];
    });
    if (h >= ua && h <= ub) { const p = knXY(h, ps); circ(ctx, p[0], p[1], 6 * ps.k); ctx.fillStyle = C.mist; ctx.fill(); }
  }
}
function knRibbon(ctx, t, ps) {
  const ranges = knRanges(t);
  const rib = (u, z) => [mixC(KN_BACK, KN_FRONT, (z + 1) / 2), KN_W * ps.k];
  const run = (a, b) => { ctx.lineCap = 'round'; knStroke(ctx, ps, a, b, rib); knChevrons(ctx, ps, t, a, b); knComet(ctx, ps, t, a, b); };
  ranges.forEach(([a, b]) => run(a, b));
  // over-crossings: a casing in the background colour cuts the strand underneath, then the top strand is redrawn
  KN_OVER.forEach(uc => ranges.forEach(([a, b]) => {
    for (let m = -1; m <= 2; m++) {
      const c = uc + m * 2 * Math.PI, lo = Math.max(a, c - 0.3), hi = Math.min(b, c + 0.3);
      if (lo >= hi) continue;
      ctx.lineCap = 'butt'; knStroke(ctx, ps, lo, hi, () => [C.deep, (KN_W + 12) * ps.k]);
      run(lo, hi);
    }
  }));
}
function habitLoop(ctx, t) {
  const ps = knPose(t), mv = spr(t, B(31), 12, 0.9);
  if (t >= KN_T0) knRibbon(ctx, t, ps);
  HAB_NAMES.forEach((lab, n) => {
    const q = spr(t, B(29) + n * 0.08, 15, 0.8);
    const [nx, ny] = knXY(KN_U[n], ps);
    const x = lerp(CIRC[n][0], nx, mv), y = lerp(CIRC[n][1], ny, mv), r = lerp(CR, KN_NODE * ps.k, mv);
    // the node fires each time the light passes through it
    const age = knAge(t, n);
    if (age < 0.5) {
      const p = age / 0.5;
      ctx.strokeStyle = C.neon; ctx.lineWidth = 4 * (1 - p) * ps.k; circ(ctx, x, y, r + 28 * eOut(p) * ps.k); ctx.stroke();
    }
    const pop = 1 + 0.09 * Math.sin(Math.PI * clamp(age / 0.3));
    if (mv > 0.05) shadowOn(ctx, 0.5);
    circ(ctx, x, y, r * pop); ctx.fillStyle = C.mist; ctx.fill(); shadowOff(ctx);
    if (age < 0.3) { ctx.strokeStyle = C.neon; ctx.lineWidth = 3 * ps.k; circ(ctx, x, y, r * pop - 1.5 * ps.k); ctx.stroke(); }
    if (q > 0.01) icon(ctx, HAB_IC[n], x, y, lerp(120, 60 * ps.k, mv) * q * pop, C.deep, 1.1);
    // name: under its circle first, then beside its node once the light has reached it
    rise(ctx, t, lab, CIRC[n][0], CIRC[n][1] + CR + 70, { ...HAB_LO, size: 38 }, B(29) + 0.1 + n * 0.08, B(30.6) + n * 0.03);
    const ly = n === 1 ? ny - KN_NODE - 42 : ny + KN_NODE + 62;
    rise(ctx, t, lab, nx, ly, HAB_LO, Math.max(knTimeOf(n / 3) + 0.04, B(31) + 0.35), BN(36));
  });
  rise(ctx, t, 'daily', ps.cx, ps.cy + 11, { size: 32, w: 700, c: C.mist, align: 'center' }, knTimeOf(1), BN(36));
}
// the four winning apps, as rows: a real logo, the stat counting up, and a week of use with every day lit
const HAB_APPS = [
  ['TIKTOK', 95, ' min/day', '', 'l_tiktok'],
  ['SPOTIFY', 30, ' min/day', '', 'l_spotify'],
  ['STARBUCKS · US', 1, ' pay app', '#', 'l_starbucks'],
  ['ALIPAY', 1, 'B daily users', '', 'l_alipay'],
];
const DAYS7 = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
function habitApps(ctx, t) {
  HAB_APPS.forEach(([k, v, suf, pre, logo], i) => {
    const t0 = B(32 + i);
    if (t < t0 || t > BN(36) + 0.7) return;
    const inn = spr(t, t0, 14, 0.86), out = eIn(P(t, BN(36) + i * 0.04, 0.32));
    const w = 640, h = 112, x0 = 1100 + (1 - inn) * 900 + out * 1000, y = 330 + i * 140;
    shadowOn(ctx, 0.5); rr(ctx, x0, y - h / 2, w, h, 26); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
    pic(ctx, logo, x0 + 62, y, 66);
    T(ctx, k, x0 + 116, y - 14, { size: 18, w: 700, c: C.leaf, ls: 5 });
    const n = Math.round(v * eOut(P(t, t0 + 0.1, 0.5)));
    T(ctx, pre + n + suf, x0 + 116, y + 30, { size: 38, w: 700, c: C.deep, ls: -1 });
    DAYS7.forEach((d, j) => {
      const dx = x0 + w - 38 - (6 - j) * 27, q = spr(t, t0 + 0.3 + j * 0.06, 18, 0.8);
      circ(ctx, dx, y - 8, 9.5); ctx.fillStyle = '#E3ECE6'; ctx.fill();
      if (q > 0.01) { circ(ctx, dx, y - 8, 9.5 * q); ctx.fillStyle = C.green; ctx.fill(); }
      T(ctx, d, dx, y + 24, { size: 13, w: 600, c: '#7A8A85', align: 'center' });
    });
  });
}
// the inserted bar: thirty days, two kinds of app (the days then fly into the loop)
function habitDays(ctx, t) {
  if (t < BN(36) || t > BN(40)) return;
  const rows = [
    { lab: 'Winning apps', y: 600, tIn: BN(36) + 0.3, lit: d => BN(36.6) + d * BN(1) / 30, right: 'every day', rc: C.neon },
    { lab: 'Telco app', y: 760, tIn: BN(37), lit: d => d === 29 ? BN(38) : 1e9, right: 'once a month', rc: C.fog },
  ];
  const gone = eInOut(P(t, BN(39) - 0.05, 0.4)), ps = knPose(t);
  rows.forEach((r, ri) => {
    rise(ctx, t, r.lab, 150, r.y + 12, { size: 34, w: 700, c: C.mist }, r.tIn, BN(39));
    for (let d = 0; d < 30; d++) {
      const k = spr(t, r.tIn + d * 0.012, 18, 0.8);
      if (k <= 0.01) continue;
      const x0 = 470 + d * 36, y0 = r.y;
      const x = lerp(x0, ps.cx, gone), y = lerp(y0, ps.cy, gone);
      const on = t >= r.lit(d);
      const pop = on ? 1 + 0.35 * Math.max(0, 1 - (t - r.lit(d)) * 5) : 1;
      circ(ctx, x, y, 12 * k * pop * (1 - gone)); ctx.fillStyle = on ? (ri ? C.leaf : C.neon) : C.teal; ctx.fill();
    }
    const rk = ri ? BN(38) + 0.1 : BN(37.6);
    rise(ctx, t, r.right, 1770, r.y + 12, { size: 34, w: 700, c: r.rc, align: 'right' }, rk, BN(39));
  });
}

let _M2 = null;
function morph2() {
  if (_M2) return _M2;
  const { run, x, y } = habitsLayout();
  const letters = run.gl.slice(6).map((g, i) => {
    const cs = g.cs.map(c => c.map(([a, b]) => [a + x, b + y]));
    let mi = 0; cs.forEach((c, k) => { if (Math.abs(area(c)) > Math.abs(area(cs[mi]))) mi = k; });
    const main = resample(cs[mi], NM);
    const ci = Math.floor(i / 2);
    const tgt = align(main, circlePts(CIRC[ci][0], CIRC[ci][1], CR, NM));
    return { main, tgt, rest: cs.filter((_, k) => k !== mi), ci };
  });
  // "7–15×": the loop's three nodes become "1", "5" and "×"
  const num = glyphRun('7–15×', 300);
  const nx = 960 - num.w / 2, ny = 680;
  const numG = num.gl.map(g => g.cs.map(c => c.map(([a, b]) => [a + nx, b + ny])));
  const mainOf = cs => { let mi = 0; cs.forEach((c, k) => { if (Math.abs(area(c)) > Math.abs(area(cs[mi]))) mi = k; }); return mi; };
  const ps = { cx: 960, cy: 560, k: 1 };
  const glyphT = [2, 3, 4].map((gi, i) => {
    const cs = numG[gi], mi = mainOf(cs);
    const [px, py] = knXY(KN_U[i], ps);
    const src = circlePts(px, py, KN_NODE, NM);
    return { src, tgt: align(src, resample(cs[mi], NM)), rest: cs.filter((_, k) => k !== mi) };
  });
  // the × becomes the globe's crosshair
  const xg = glyphT[2].tgt, xc = centroid(xg);
  const R = 330, th = 3;
  const plus = resample([[-th, -R], [th, -R], [th, -th], [R, -th], [R, th], [th, th], [th, R], [-th, R], [-th, th], [-R, th], [-R, -th], [-th, -th]].map(([a, b]) => [a + 960, b + 600]), NM);
  _M2 = { letters, numG, glyphT, xc, plus, nx, ny };
  return _M2;
}

scene(27.5, 40.2, (ctx, t) => {
  const M = morph2();
  if (t >= B(28)) bg(ctx, C.deep);
  const toGlyph = eInOut(P(t, B(36), 0.55));

  // 1) letters of "habits" -> circles
  if (t < B(28.9)) {
    M.letters.forEach((L, i) => {
      const p = eInOut(P(t, B(27.5) + i * 0.035, 0.75));
      const pts = mixPts(L.main, L.tgt, p);
      const [tx, ty] = CIRC[L.ci];
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]); pts.forEach(q => ctx.lineTo(q[0], q[1])); ctx.closePath();
      L.rest.forEach(c => {
        const q = c.map(([a, b]) => [lerp(a, tx, p), lerp(b, ty, p)]);
        ctx.moveTo(q[0][0], q[0][1]); q.forEach(z => ctx.lineTo(z[0], z[1])); ctx.closePath();
      });
      ctx.fillStyle = C.mist; ctx.fill('nonzero');
    });
  } else if (t < B(36)) {
    // 2) the circles become the nodes of one continuous loop
    habitLoop(ctx, t);
  } else if (t < B(39.2)) {
    // 3) the nodes become "15×" (the last of the loop retracts into them)
    knRibbon(ctx, t, knPose(t));
    M.glyphT.forEach((g, i) => {
      ctx.beginPath();
      const pts = mixPts(g.src, g.tgt, toGlyph);
      ctx.moveTo(pts[0][0], pts[0][1]); pts.forEach(q => ctx.lineTo(q[0], q[1])); ctx.closePath();
      if (toGlyph > 0.6) g.rest.forEach(c => { ctx.moveTo(c[0][0], c[0][1]); c.forEach(z => ctx.lineTo(z[0], z[1])); ctx.closePath(); });
      const exit = i < 2 ? eIn(P(t, B(39), 0.25)) : 0;
      if (exit > 0) { const cc = centroid(g.tgt); ctx.save(); ctx.translate(cc[0], cc[1]); ctx.scale(1 - exit, 1 - exit); ctx.translate(-cc[0], -cc[1]); }
      ctx.fillStyle = i === 2 ? mixC(C.mist, C.neon, toGlyph) : C.mist; ctx.fill('nonzero');
      if (exit > 0) ctx.restore();
    });
  }
  // plus signs
  [760, 1160].forEach((x, i) => {
    const k = spr(t, B(30) + i * 0.08, 18) * (1 - eIn(P(t, B(31) - 0.1, 0.25)));
    if (k <= 0.001) return;
    ctx.fillStyle = C.neon; ctx.fillRect(x - 28 * k, 556, 56 * k, 8); ctx.fillRect(x - 4, 560 - 28 * k, 8, 56 * k);
  });
  rise(ctx, t, 'THE HABIT LOOP', 960, 110, { size: 26, w: 700, c: C.leaf, align: 'center', ls: 10 }, B(28.75), BN(36));
  habitApps(ctx, t);
  // the inserted bar: thirty days, two kinds of app
  habitDays(ctx, t);
  // "7–" joins, caption
  if (t >= B(37) && t < B(39.3)) {
    const p = eOut(P(t, B(37), 0.4)), q = eIn(P(t, B(39), 0.25));
    [0, 1].forEach(gi => {
      ctx.save(); ctx.beginPath(); ctx.rect(0, 380, W, 320); ctx.clip();
      fillContours(ctx, M.numG[gi], 0, (1 - p) * 330 + q * 330, C.mist); ctx.restore();
    });
  }
  rise(ctx, t, 'more lifetime value', 960, 870, { size: 60, w: 500, c: C.fog, align: 'center' }, B(38), B(39));
  // × turns into the globe crosshair; a night disc opens from it
  if (t >= B(39.2)) {
    const g = M.glyphT[2], p = eInOut(P(t, B(39.2), B(0.8)));
    const xc = M.xc;
    const pts = mixPts(rotPts(g.tgt, xc[0], xc[1], p * Math.PI / 4).map(([a, b]) => [a + (960 - xc[0]) * p, b + (600 - xc[1]) * p]), M.plus, eIn(P(t, B(39.5), B(0.5))));
    const r = lerp(0, 2300, eIn(P(crispT(t), B(39.2), B(0.8))));
    circ(ctx, lerp(xc[0], 960, p), lerp(xc[1], 600, p), r); ctx.fillStyle = C.night; ctx.fill();
    poly(ctx, pts); ctx.fillStyle = C.neon; ctx.fill();
  }
});

// --- Super-apps globe (beats 40–52) ---
const D2R = Math.PI / 180;
function gProj(lat, lon, lc, tilt, cx, cy, R) {
  const la = lat * D2R, dl = (lon - lc) * D2R;
  const X = Math.cos(la) * Math.sin(dl), Y = Math.sin(la), Z = Math.cos(la) * Math.cos(dl);
  const Z2 = Z * Math.cos(tilt) + Y * Math.sin(tilt), Y2 = Y * Math.cos(tilt) - Z * Math.sin(tilt);
  return [cx + R * X, cy - R * Y2, Z2];
}
function strokeVis(ctx, pts, front) {
  ctx.beginPath(); let on = false;
  for (const p of pts) {
    const v = front ? p[2] >= 0 : p[2] < 0;
    if (v) { on ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); on = true; } else on = false;
  }
  ctx.stroke();
}
// the globe: a dark body, a graticule, an orbit and the land as a dot matrix (Natural Earth 50m, 1.8 deg grid)
const LAND = (window.__LAND || []).map(([lat, lon], i) => ({ lat, lon, i }));
const LAND_LV = 8;
const landCol = lv => mixC('#1C6B5C', C.leaf, Math.min(1, 0.12 + 0.98 * lv / (LAND_LV - 1)));
function globeDot(z, k) { return { r: (1.2 + 2.0 * z) * k, c: landCol(Math.min(LAND_LV - 1, Math.floor(z * LAND_LV))) }; }
function graticule(ctx, lc, tilt, cx, cy, R, f) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#0E352F'; ctx.lineWidth = 1.2;
  for (let k = -9; k < 9; k++) {
    const lon = lc + k * 20 * f + 0.0001, pts = [];
    for (let i = 0; i <= 60; i++) pts.push(gProj(-90 + i * 3, lon, lc, tilt, cx, cy, R));
    strokeVis(ctx, pts, true);
  }
  for (let j = -4; j <= 4; j++) {
    const lat = j * 20 * f, pts = [];
    for (let i = 0; i <= 120; i++) pts.push(gProj(lat, lc - 180 + i * 3, lc, tilt, cx, cy, R));
    ctx.strokeStyle = j === 0 ? '#17594D' : '#0E352F'; ctx.lineWidth = j === 0 ? 1.7 : 1.2;
    strokeVis(ctx, pts, true);
  }
}
// opt: body (radius factor for body + graticule), bodyC (their centre), f (graticule spread), skip(i)
function drawGlobe(ctx, lc, tilt, cx, cy, R, reveal, opt = {}) {
  const body = opt.body ?? 1, f = opt.f ?? 1, [bx, by] = opt.bodyC || [cx, cy];
  if (body > 0.002) {
    const Rb = R * body;
    circ(ctx, bx, by, Rb); ctx.fillStyle = '#061E1A'; ctx.fill();
    graticule(ctx, lc, tilt, bx, by, Rb, f);
    circ(ctx, bx, by, Rb); ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.stroke();
  }
  // land dots, front hemisphere only, batched by facing so the globe draws in a few fills
  const lv = Array.from({ length: LAND_LV }, () => []);
  for (const d of LAND) {
    if (opt.skip && opt.skip(d.i)) continue;
    const q = gProj(d.lat, d.lon, lc, tilt, cx, cy, R);
    if (q[2] < 0.04) continue;
    const k = reveal(Math.hypot(q[0] - cx, q[1] - cy) / R, d.i);
    if (k <= 0.01) continue;
    lv[Math.min(LAND_LV - 1, Math.floor(q[2] * LAND_LV))].push(q[0], q[1], (1.2 + 2.0 * q[2]) * k);
  }
  lv.forEach((arr, l) => {
    if (!arr.length) return;
    ctx.beginPath();
    for (let i = 0; i < arr.length; i += 3) { ctx.moveTo(arr[i] + arr[i + 2], arr[i + 1]); ctx.arc(arr[i], arr[i + 1], arr[i + 2], 0, Math.PI * 2); }
    ctx.fillStyle = landCol(l); ctx.fill();
  });
}
// a thin inclined orbit with a satellite: back half before the globe, front half after
function orbit(ctx, t, cx, cy, R, front, k) {
  if (k <= 0.01) return;
  const Ro = R * 1.24, a = 0.32, b = -0.38, pts = [];
  for (let i = 0; i <= 160; i++) {
    const th = i / 160 * Math.PI * 2, X = Ro * Math.cos(th), Yp = Ro * Math.sin(th) * Math.sin(a), Zp = Ro * Math.sin(th) * Math.cos(a);
    pts.push([cx + (X * Math.cos(b) - Yp * Math.sin(b)) * k, cy - (X * Math.sin(b) + Yp * Math.cos(b)) * k, Zp]);
  }
  ctx.strokeStyle = front ? '#1F5F54' : '#0E3A33'; ctx.lineWidth = front ? 1.4 : 1.2;
  strokeVis(ctx, pts, front);
  const th = t * 1.05, X = Ro * Math.cos(th), Yp = Ro * Math.sin(th) * Math.sin(a), Zp = Ro * Math.sin(th) * Math.cos(a);
  if ((Zp >= 0) !== front) return;
  const sx = cx + (X * Math.cos(b) - Yp * Math.sin(b)) * k, sy = cy - (X * Math.sin(b) + Yp * Math.cos(b)) * k;
  circ(ctx, sx, sy, (front ? 7.5 : 5.5) * k); ctx.fillStyle = C.night; ctx.fill();
  circ(ctx, sx, sy, (front ? 5.5 : 4) * k); ctx.fillStyle = front ? C.neon : '#1E5C50'; ctx.fill();
}
// a point along the great circle between two lat/lon points, raised above the surface
function gcPoint(a, b, u, lc, tilt, cx, cy, R, lift) {
  const v = ([la, lo]) => [Math.cos(la * D2R) * Math.cos(lo * D2R), Math.sin(la * D2R), Math.cos(la * D2R) * Math.sin(lo * D2R)];
  const A = v(a), Bv = v(b), m = A.map((x, i) => lerp(x, Bv[i], u)), n = Math.hypot(...m);
  const lat = Math.asin(m[1] / n) / D2R, lon = Math.atan2(m[2], m[0]) / D2R;
  const q = gProj(lat, lon, lc, tilt, 0, 0, R * (1 + lift * Math.sin(u * Math.PI)));
  return [cx + q[0], cy + q[1], q[2]];
}
const PINS = [
  { n: 'WECHAT', v: 1.3, s: 'B', d: 1, lat: 35, lon: 105, sx: 1440, sy: 470, al: 'left' },
  { n: 'GRAB', v: 35, s: 'M', lat: 3, lon: 104, sx: 1440, sy: 740, al: 'left' },
  { n: 'JIO', v: 460, s: 'M', lat: 21, lon: 78, sx: 480, sy: 430, al: 'right', tag: 'The Salam blueprint.' },
  { n: 'KAKAO', v: 50, s: 'M', lat: 37, lon: 127, sx: 1440, sy: 300, al: 'left' },
  { n: 'M-PESA', v: 51, s: 'M', lat: -1, lon: 37, sx: 480, sy: 760, al: 'right' },
];
const RIYADH = { lat: 24.7, lon: 46.7 };
const TRUST_TEAL = '#2F9B95';
function rrPts(x, y, w, h, r, N) {
  const o = [], c = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
  c.forEach(([cx, cy, a0]) => { for (let i = 0; i <= 10; i++) { const a = a0 + i / 10 * Math.PI / 2; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } });
  return resample(o, N);
}

// --- Trust: the globe's dots stream into concentric identity rings around the trust tile ---
const NF = { cx: 960, cy: 535, ring: 150, tile: 190 };
const NF_RINGS = [196, 224, 252, 280, 308];
const NF_SLOTS = (() => {
  const out = [];
  NF_RINGS.forEach((r, k) => {
    const n = Math.round(2 * Math.PI * r / 30);
    for (let i = 0; i < n; i++) out.push({ k, a: -Math.PI / 2 + (i + (k % 2) * 0.5) / n * Math.PI * 2 });
  });
  // the stream fills the rings clockwise from the top
  return out.sort((p, q) => ((p.a + Math.PI / 2 + 4 * Math.PI) % (2 * Math.PI)) - ((q.a + Math.PI / 2 + 4 * Math.PI) % (2 * Math.PI)));
})();
const GLOBE_TILT = 0.32;
function globeFinalCentre() {
  const rp = gProj(RIYADH.lat, RIYADH.lon, RIYADH.lon, GLOBE_TILT, 0, 0, 330);
  return [NF.cx - rp[0], NF.cy - rp[1]];
}
// the trust mark on the tile: a filled teal shield with a white check (Hugeicons Shield01 + Tick02)
function trustMark(ctx, cx, cy, size) {
  const s = size / 24;
  ctx.save(); ctx.translate(cx - size / 2, cy - size / 2); ctx.scale(s, s);
  const sh = iconParts('Shield01')[0].p;
  ctx.lineJoin = 'round'; ctx.fillStyle = TRUST_TEAL; ctx.fill(sh);
  ctx.strokeStyle = TRUST_TEAL; ctx.lineWidth = 1.5; ctx.stroke(sh);
  ctx.restore();
  icon(ctx, 'Tick02', cx, cy - size * 0.02, size * 0.5, C.white, 2.2);
}
// the verified sequence: duotone icons from the Salam set (a 40% layer under a solid one)
const DUO = {
  id: { vb: 24, a: 'M10 3.5H14C17.7712 3.5 19.6569 3.5 20.8284 4.67157C22 5.84315 22 7.72876 22 11.5V12.5C22 16.2712 22 18.1569 20.8284 19.3284C19.6569 20.5 17.7712 20.5 14 20.5H10C6.22876 20.5 4.34315 20.5 3.17157 19.3284C2 18.1569 2 16.2712 2 12.5V11.5C2 7.72876 2 5.84315 3.17157 4.67157C4.34315 3.5 6.22876 3.5 10 3.5ZM8 11.5C8.9665 11.5 9.75 10.7165 9.75 9.75C9.75 8.7835 8.9665 8 8 8C7.0335 8 6.25 8.7835 6.25 9.75C6.25 10.7165 7.0335 11.5 8 11.5Z',
    b: 'M14.0566 2.75C15.8943 2.74998 17.3501 2.75016 18.4893 2.90332C19.6616 3.06096 20.6101 3.39329 21.3584 4.1416C22.1067 4.88991 22.439 5.83844 22.5967 7.01074C22.7498 8.14991 22.75 9.60571 22.75 11.4434V12.5566C22.75 14.3943 22.7498 15.8501 22.5967 16.9893C22.439 18.1616 22.1067 19.1101 21.3584 19.8584C20.6101 20.6067 19.6616 20.939 18.4893 21.0967C17.3501 21.2498 15.8943 21.25 14.0566 21.25H9.94336C8.10571 21.25 6.64991 21.2498 5.51074 21.0967C4.33844 20.939 3.38991 20.6067 2.6416 19.8584C1.89329 19.1101 1.56096 18.1616 1.40332 16.9893C1.25016 15.8501 1.24998 14.3943 1.25 12.5566V11.4434C1.24998 9.60571 1.25016 8.14991 1.40332 7.01074C1.56096 5.83844 1.89329 4.88991 2.6416 4.1416C3.38991 3.39329 4.33844 3.06096 5.51074 2.90332C6.64991 2.75016 8.10571 2.74998 9.94336 2.75H14.0566ZM10 4.25C8.09324 4.25 6.73859 4.2515 5.71094 4.38965C4.70485 4.52491 4.12536 4.77894 3.70215 5.20215C3.27894 5.62536 3.02491 6.20485 2.88965 7.21094C2.7515 8.23859 2.75 9.59324 2.75 11.5V12.5C2.75 14.4068 2.7515 15.7614 2.88965 16.7891C3.02491 17.7952 3.27894 18.3746 3.70215 18.7979C4.12536 19.2211 4.70485 19.4751 5.71094 19.6104C6.73859 19.7485 8.09324 19.75 10 19.75H14C15.9068 19.75 17.2614 19.7485 18.2891 19.6104C19.2952 19.4751 19.8746 19.2211 20.2979 18.7979C20.7211 18.3746 20.9751 17.7952 21.1104 16.7891C21.2485 15.7614 21.25 14.4068 21.25 12.5V11.5C21.25 9.59324 21.2485 8.23859 21.1104 7.21094C20.9751 6.20485 20.7211 5.62536 20.2979 5.20215C19.8746 4.77894 19.2952 4.52491 18.2891 4.38965C17.2614 4.2515 15.9068 4.25 14 4.25H10ZM4.30371 15.7207C5.57399 12.5553 10.3233 12.2997 11.6963 15.7207C11.8505 16.1051 11.6637 16.542 11.2793 16.6963C10.8949 16.8504 10.4579 16.6637 10.3037 16.2793C9.46867 14.1993 6.49755 14.2832 5.69629 16.2793C5.54204 16.6637 5.10512 16.8505 4.7207 16.6963C4.33641 16.542 4.14948 16.1051 4.30371 15.7207ZM16.5 14.75C16.9142 14.75 17.25 15.0858 17.25 15.5C17.25 15.9142 16.9142 16.25 16.5 16.25H14C13.5858 16.25 13.25 15.9142 13.25 15.5C13.25 15.0858 13.5858 14.75 14 14.75H16.5ZM19 11.25C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75H14C13.5858 12.75 13.25 12.4142 13.25 12C13.25 11.5858 13.5858 11.25 14 11.25H19ZM8 7.25C9.38071 7.25 10.5 8.36929 10.5 9.75C10.5 11.1307 9.38071 12.25 8 12.25C6.61929 12.25 5.5 11.1307 5.5 9.75C5.5 8.36929 6.61929 7.25 8 7.25ZM8 8.75C7.44772 8.75 7 9.19772 7 9.75C7 10.3023 7.44772 10.75 8 10.75C8.55228 10.75 9 10.3023 9 9.75C9 9.19772 8.55228 8.75 8 8.75ZM19 7.75C19.4142 7.75 19.75 8.08579 19.75 8.5C19.75 8.91421 19.4142 9.25 19 9.25H14C13.5858 9.25 13.25 8.91421 13.25 8.5C13.25 8.08579 13.5858 7.75 14 7.75H19Z' },
  stamp: { vb: 24, a: 'M17.6005 2.74984C18.6105 1.74484 20.2405 1.74484 21.2505 2.74984C22.2505 3.75584 22.2505 5.38686 21.2505 6.39286C21.1305 6.51086 21.0005 6.61385 20.8705 6.70385C20.2305 7.13685 19.4605 7.34384 18.8205 7.77084L17.6005 8.57885L19.3005 11.2478C19.8005 12.0298 19.6905 13.0528 19.0305 13.7088C18.6405 14.0948 18.0205 14.0948 17.6305 13.7088L10.2905 6.36386C9.90055 5.97786 9.90055 5.35183 10.2905 4.96483C10.9505 4.30983 11.9705 4.19786 12.7505 4.69486L15.4205 6.39286L16.2305 5.18085C16.6505 4.53985 16.8605 3.76184 17.2905 3.12484C17.3805 2.99284 17.4905 2.86784 17.6005 2.74984Z',
    b: 'M6.89648 7.27746C7.29337 7.15972 7.71116 7.38547 7.82812 7.78234C7.94602 8.17922 7.72004 8.59689 7.32324 8.71398C4.63038 9.51394 2.75019 12.036 2.75 14.8468C2.75 18.3748 5.62139 21.2452 9.15039 21.2452C11.9582 21.2451 14.4793 19.3658 15.2812 16.6749C15.3994 16.2782 15.817 16.0522 16.2139 16.17C16.6109 16.288 16.8367 16.7066 16.7188 17.1036C16.2427 18.7015 15.247 20.1377 13.9131 21.1476C12.5332 22.1924 10.8862 22.7451 9.15039 22.7452V22.7462C4.79439 22.7462 1.25 19.2028 1.25 14.8478C1.2501 13.111 1.80179 11.4639 2.84668 10.0851C3.85768 8.75008 5.29648 7.75346 6.89648 7.27746ZM11.7334 12.295C12.1203 12.1483 12.5532 12.3437 12.7002 12.7316C12.8469 13.1185 12.6515 13.5514 12.2637 13.6984C11.1597 14.1166 9.60953 16.1791 8.8916 17.381C8.7556 17.608 8.51104 17.7472 8.24805 17.7472L8.25 17.7462H8.21094C7.93415 17.7322 7.68741 17.5653 7.56934 17.3136C7.24103 16.6081 6.96218 16.4379 6.90039 16.4073C6.5324 16.3593 6.24904 16.0442 6.24902 15.6632C6.24902 15.2492 6.58502 14.9132 6.99902 14.9132C7.18502 14.9132 7.69984 14.9784 8.25684 15.6114C9.03684 14.4944 10.3894 12.804 11.7334 12.295ZM17.0723 2.21886C18.3703 0.927135 20.4824 0.926955 21.7803 2.21886C23.0712 3.51782 23.071 5.62598 21.7832 6.92199C21.6372 7.06599 21.4759 7.1984 21.2979 7.3214C20.9151 7.58019 20.5233 7.75694 20.1445 7.92883C19.8145 8.07783 19.5033 8.2196 19.2383 8.3966L18.6299 8.79894L19.9336 10.8468C20.6296 11.9348 20.4756 13.3323 19.5596 14.2433C19.2206 14.5791 18.7759 14.7462 18.3311 14.7462L18.3301 14.7443C17.8852 14.7443 17.4415 14.5771 17.1035 14.2423L9.75977 6.89367C9.43097 6.5687 9.24805 6.13098 9.24805 5.66613C9.24805 5.20013 9.42972 4.76173 9.76172 4.43273C10.6757 3.52478 12.0713 3.3736 13.1533 4.06359L15.2041 5.3673L15.6074 4.76476C15.7763 4.50685 15.9156 4.1971 16.0625 3.86828C16.2345 3.48332 16.413 3.08513 16.6689 2.70617C16.7939 2.52228 16.9388 2.36035 17.0518 2.23937L17.0723 2.21886ZM11.6895 5.13488C11.3725 5.13488 11.0593 5.25828 10.8184 5.49718C10.7594 5.55518 10.7471 5.62015 10.7471 5.66515C10.7471 5.70915 10.7594 5.77419 10.8174 5.83117L18.1602 13.1788C18.2562 13.2728 18.404 13.2739 18.502 13.1759C18.9118 12.768 18.9808 12.1414 18.668 11.6525L17.0107 9.0509L14.9473 6.98254L12.3467 5.32922C12.1439 5.19938 11.9162 5.13595 11.6895 5.13586V5.13488ZM20.7168 3.27941C20.0088 2.57441 18.8527 2.57155 18.1367 3.27355C18.0628 3.35344 17.9721 3.45417 17.9082 3.54797C17.7272 3.81697 17.5817 4.14056 17.4287 4.48156C17.2638 4.84929 17.0942 5.22918 16.8564 5.59191L16.3838 6.29894H16.3848L17.6973 7.61535L18.4053 7.1466C18.7713 6.9026 19.1544 6.72961 19.5244 6.56261C19.8614 6.41064 20.1783 6.2661 20.4492 6.08312C20.55 6.01326 20.6448 5.93635 20.7227 5.85851C21.4246 5.15153 21.4248 3.99142 20.7168 3.27941Z' },
  verify: { vb: 74, a: 'M67.8327 37C67.8327 19.9708 54.0286 6.16669 36.9993 6.16669C19.9701 6.16669 6.16602 19.9708 6.16602 37C6.16602 54.0293 19.9701 67.8333 36.9993 67.8333C54.0286 67.8333 67.8327 54.0293 67.8327 37Z',
    b: 'M36.999 3.85419C55.2769 3.85419 70.1453 18.7218 70.1455 36.9997C70.1455 55.2777 55.277 70.1462 36.999 70.1462C18.7212 70.146 3.85352 55.2776 3.85352 36.9997C3.85369 18.722 18.7213 3.85436 36.999 3.85419ZM36.999 8.47919C21.2743 8.47936 8.47869 21.275 8.47852 36.9997C8.47852 52.7246 21.2742 65.521 36.999 65.5212C52.724 65.5212 65.5205 52.7247 65.5205 36.9997C65.5203 21.2748 52.7239 8.47919 36.999 8.47919ZM48.2256 22.6374C49.3448 22.0241 50.7507 22.4372 51.3643 23.5563C51.9778 24.6755 51.5644 26.0814 50.4453 26.695C41.3847 31.6489 34.2544 47.0325 34.1719 47.2116C33.8143 47.9916 33.0524 48.5098 32.1953 48.5593C32.1521 48.5593 32.1084 48.5622 32.0684 48.5622H32.0654C31.2546 48.5622 30.4993 48.137 30.083 47.4372C27.9714 43.9096 23.5761 41.3531 23.5186 41.32C22.4118 40.6849 22.0294 39.2726 22.6611 38.1657C23.2963 37.0588 24.7056 36.6733 25.8125 37.3054C25.9801 37.4016 28.9981 39.1436 31.6523 41.9489C34.4705 36.7257 40.5635 26.8276 48.2256 22.6374Z' },
};
const _duo = {};
function duo(ctx, name, cx, cy, size, col, alpha = 1) {
  const d = DUO[name], p = _duo[name] || (_duo[name] = { a: new Path2D(d.a), b: new Path2D(d.b) });
  const s = size / d.vb;
  ctx.save(); ctx.translate(cx - size / 2, cy - size / 2); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.globalAlpha = 0.4 * alpha; ctx.fill(p.a, 'evenodd');
  ctx.globalAlpha = alpha; ctx.fill(p.b);
  ctx.restore();
}
let _NFMAP = null;
function trustMap() {
  if (_NFMAP) return _NFMAP;
  const [cx, cy] = globeFinalCentre();
  const front = [];
  LAND.forEach(d => {
    const q = gProj(d.lat, d.lon, RIYADH.lon, GLOBE_TILT, cx, cy, 330);
    if (q[2] >= 0.12) front.push({ i: d.i, x: q[0], y: q[1], z: q[2], a: (Math.atan2(q[1] - NF.cy, q[0] - NF.cx) + Math.PI / 2 + 4 * Math.PI) % (2 * Math.PI) });
  });
  front.sort((p, q) => p.a - q.a);
  const nS = NF_SLOTS.length, map = new Map();
  for (let s = 0; s < nS; s++) { const fr = front[Math.floor(s * front.length / nS)]; map.set(fr.i, { s, from: fr }); }
  return (_NFMAP = map);
}
function ringR(t, k) {
  const ripple = Math.sin(Math.PI * P(t, BV(55.5) + k * 0.06, 0.38)) * 12;   // the stamp lands
  const gather = eIn(P(t, BV(58), 0.75));
  return lerp(NF_RINGS[k] + ripple, 96, gather);
}

scene(40, 52.2, (ctx, t) => {
  bg(ctx, C.night);
  if (t >= BV(52.6)) dotGrid(ctx, '#0B201D', 1100);
  const f = eOut(P(t, B(40), 0.7));
  const toRiyadh = eInOut(P(t, B(48), 0.7));
  const lc = lerp(lerp(112, 84, eInOut(P(t, B(40), B(8)))), RIYADH.lon, toRiyadh);   // the globe keeps turning
  const tilt = GLOBE_TILT, R = 330;
  const [fx, fy] = globeFinalCentre();
  const cx = lerp(960, fx, toRiyadh), cy = lerp(600, fy, toRiyadh);
  const fly0 = BV(53);
  const map = trustMap();
  // the body and graticule shrink into the identity ring; land dots that are not part of the stream shrink away
  const drop = eIn(P(t, fly0, 0.45));
  const shrink = eInOut(P(t, fly0, 0.6)), bodyOut = eIn(P(crispT(t), BV(58.2), 0.5));
  const bodyF = lerp(f, NF.ring / R, shrink) * (1 - bodyOut);
  const bodyC = [lerp(cx, NF.cx, shrink), lerp(cy, NF.cy, shrink)];
  const ok = eOut(P(t, B(40.6), 0.6)) * (1 - eIn(P(t, fly0, 0.35)));
  orbit(ctx, t, cx, cy, R, false, ok);
  if (drop < 1 || bodyF > 0) drawGlobe(ctx, lc, tilt, cx, cy, R, (dist, i) => {
    const k = spr(t, B(40) + dist * 0.45 + (i % 7) * 0.01, 16, 0.8);
    return t >= fly0 ? k * (1 - drop) : k;
  }, { body: bodyF, bodyC, f, skip: i => t >= fly0 && map.has(i) });
  orbit(ctx, t, cx, cy, R, true, ok);
  if (t < B(40.2)) { ctx.fillStyle = C.neon; ctx.fillRect(957, 600 - 330, 6, 660); ctx.fillRect(630, 597, 660, 6); }

  {
    const o = { size: 60, w: 600 }, a = TW(ctx, 'The world is moving to ', o), b = TW(ctx, 'super-apps.', o);
    rise(ctx, t, 'The world is moving to', 960 - (a + b) / 2, 140, { ...o, c: C.mist }, B(41), B(48));
    rise(ctx, t, 'super-apps.', 960 - (a + b) / 2 + a, 140, { ...o, c: C.neon }, B(41) + 0.12, B(48));
  }
  // pins
  const pp = PINS.map(p => gProj(p.lat, p.lon, lc, tilt, cx, cy, R));
  PINS.forEach((p, i) => {
    const t0 = B(42 + i), q = pp[i];
    if (t < t0 || q[2] < 0) return;
    const k = spr(t, t0, 18) * (1 - eIn(P(t, B(48), 0.3)));
    const lx = p.al === 'left' ? p.sx - 16 : p.sx + 16, ly = p.sy - 24;
    const lp = eOut(P(t, t0, 0.35)) * (1 - eIn(P(t, B(48), 0.3)));
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(lerp(q[0], lx, lp), lerp(q[1], ly, lp)); ctx.stroke();
    circ(ctx, q[0], q[1], 10 * k); ctx.fillStyle = C.neon; ctx.fill();
    rise(ctx, t, p.n, p.sx, p.sy - 64, { size: 24, w: 700, c: C.leaf, align: p.al, ls: 6 }, t0, B(48));
    const v = p.v * eOut(P(t, t0, 0.5));
    rise(ctx, t, (p.d ? v.toFixed(1) : Math.round(v)) + p.s, p.sx, p.sy, { size: 62, w: 700, c: C.mist, align: p.al }, t0 + 0.04, B(48) + 0.03);
    if (p.tag) {
      const tp = spr(t, t0 + 0.25, 16) * (1 - eIn(P(t, B(48), 0.3)));
      if (tp > 0.01) {
        const tw = TW(ctx, p.tag, { size: 26, w: 700 }) + 36;
        ctx.save(); ctx.translate(p.sx - tw, p.sy + 26); ctx.scale(1, tp);
        rr(ctx, 0, 0, tw, 48, 24); ctx.fillStyle = C.green; ctx.fill();
        T(ctx, p.tag, 18, 33, { size: 26, w: 700, c: C.night }); ctx.restore();
      }
    }
  });
  // the light thread jumps pin to pin, then to Riyadh
  const rq = gProj(RIYADH.lat, RIYADH.lon, lc, tilt, cx, cy, R);
  const routeLL = [0, 1, 2, 3, 4].map(i => [PINS[i].lat, PINS[i].lon]).concat([[RIYADH.lat, RIYADH.lon]]);
  const tp = eInOut(P(t, B(47), B(1.4))) * (routeLL.length - 1);
  const th = eIn(P(t, B(49), 0.3));
  if (tp > 0 && t < B(49.4)) {
    ctx.strokeStyle = C.neon; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    const tail = Math.max(0, tp - 1.6 + th * 2);
    let pen = false;
    for (let s = tail; s <= tp + 1e-6; s += 0.02) {
      const i = Math.min(Math.floor(s), routeLL.length - 2), u = s - i;
      const q = gcPoint(routeLL[i], routeLL[i + 1], u, lc, tilt, cx, cy, R, 0.16);
      if (q[2] < 0) { pen = false; continue; }
      pen ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); pen = true;
    }
    ctx.stroke();
  }
  // the stream: front dots sweep clockwise into five identity rings
  if (t >= fly0) {
    const gone = eIn(P(t, BV(58.35), 0.4));
    map.forEach(({ s, from }, i) => {
      const slot = NF_SLOTS[s];
      const t0 = fly0 + (s / NF_SLOTS.length) * 0.6;
      const p = clamp(spr(t, t0, 8, 0.95));
      const spin = (t - BV(54)) * 0.11 * (slot.k % 2 ? -1 : 1);
      const a1 = slot.a + Math.max(0, spin), r1 = ringR(t, slot.k);
      const r0 = Math.hypot(from.x - NF.cx, from.y - NF.cy), a0 = Math.atan2(from.y - NF.cy, from.x - NF.cx);
      let da = ((a1 - a0) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
      const a = a0 + da * p + 0.9 * Math.sin(p * Math.PI), r = lerp(r0, r1, p) + 46 * Math.sin(p * Math.PI);
      const g = globeDot(from.z, 1);
      const rad = lerp(g.r, 4.3, p) * (1 - gone);
      if (rad <= 0.05) return;
      circ(ctx, NF.cx + Math.cos(a) * r, NF.cy + Math.sin(a) * r, rad); ctx.fillStyle = mixC(g.c, TRUST_TEAL, p); ctx.fill();
    });
  }
  // Riyadh pin -> the white trust tile -> a line (the ground of the house)
  if (t >= B(48.4)) {
    const k = spr(t, B(48.4), 18);
    const toTile = eInOut(P(t, BV(53.15), 0.45));
    const flat = eInOut(P(t, B(51), 0.42));
    const gather = eIn(P(t, BV(58), 0.75));
    const c0 = circlePts(rq[0], rq[1], 12 * k, NM);
    const ts = NF.tile * (1 - 0.15 * gather);
    // the tile is the ID card: scanned, stamped verified, then it becomes the verified profile
    const hit = BV(55.5), squash = 1 - 0.06 * Math.sin(Math.PI * P(t, hit, 0.22));
    const toAv = eInOut(P(t, BV(56.3), 0.5));
    const tile = align(c0, rrPts(NF.cx - ts * squash / 2, NF.cy - ts * squash / 2, ts * squash, ts * squash, lerp(ts * 0.23, ts / 2, toAv) * squash, NM));
    let pts = mixPts(c0, tile, toTile);
    if (flat > 0) pts = mixPts(pts, align(tile, rectPts(-20, 538, 1960, 4, NM)), flat);
    poly(ctx, pts); ctx.fillStyle = flat > 0 ? mixC(C.white, C.mist, flat) : mixC(C.neon, C.white, toTile); ctx.fill();
    const out = 1 - eIn(P(t, B(51) - 0.12, 0.2));
    // 1. the ID card on the tile, swept by the scanner
    const idk = spr(t, BV(53.45), 16, 0.82) * (1 - eIn(P(t, hit - 0.08, 0.1)));
    if (idk > 0.01) duo(ctx, 'id', NF.cx, NF.cy, 128 * idk, TRUST_TEAL);
    const fk = spr(t, BV(53.9), 18, 0.8) * (1 - eIn(P(t, hit - 0.15, 0.2)));
    if (fk > 0.01) {
      // viewfinder corners close in around the card
      const h = lerp(150, 122, fk), L = 34;
      ctx.save(); ctx.globalAlpha = fk; ctx.strokeStyle = C.neon; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
        ctx.beginPath(); ctx.moveTo(NF.cx + sx * h, NF.cy + sy * (h - L)); ctx.lineTo(NF.cx + sx * h, NF.cy + sy * h); ctx.lineTo(NF.cx + sx * (h - L), NF.cy + sy * h); ctx.stroke();
      });
      ctx.restore();
    }
    const sp = P(t, BV(54.1), BV(55.3) - BV(54.1));
    if (sp > 0 && sp < 1) {
      // one pass down and back up, with a soft band trailing the line
      const u = sp < 0.5 ? eInOut(sp * 2) : 1 - eInOut(sp * 2 - 2 * 0.5), dir = sp < 0.5 ? 1 : -1;
      const y = NF.cy - ts / 2 + 10 + u * (ts - 20), x0 = NF.cx - ts / 2 - 18, x1 = NF.cx + ts / 2 + 18;
      const g = ctx.createLinearGradient(0, y, 0, y - dir * 70);
      g.addColorStop(0, 'rgba(84, 243, 93, 0.38)'); g.addColorStop(1, 'rgba(84, 243, 93, 0)');
      ctx.save(); poly(ctx, tile); ctx.clip(); ctx.fillStyle = g; ctx.fillRect(x0, Math.min(y, y - dir * 70), x1 - x0, 70); ctx.restore();
      ctx.fillStyle = C.green; rr(ctx, x0, y - 2.5, x1 - x0, 5, 2.5); ctx.fill();
    }
    // 2. the stamp drops onto the card and leaves it verified
    if (t >= hit - 0.3 && toAv < 1) {
      const d = eIn3(P(t, hit - 0.3, 0.3)), land = spr(t, hit, 20, 0.7);
      const k = t < hit ? 1.7 - 0.7 * d : 1 + 0.04 * (1 - land);
      const rot = t < hit ? 0.35 * (1 - d) : 0;
      ctx.save(); ctx.globalAlpha = (t < hit ? d : 1) * (1 - toAv);
      ctx.translate(NF.cx, NF.cy); ctx.rotate(rot); duo(ctx, 'stamp', 0, 0, 132 * k, C.green); ctx.restore();
    }
    // 3. the account, verified: the profile photo fills the circle and the check lands on it
    if (toAv > 0 && out > 0) {
      const im = IMG.p_avatar;
      ctx.save(); poly(ctx, pts); ctx.clip(); ctx.globalAlpha = toAv * out;
      const z = ts * squash * lerp(1.12, 1, eOut(P(t, BV(56.3), 0.9)));
      if (im) ctx.drawImage(im, NF.cx - z / 2, NF.cy - z / 2, z, z);
      ctx.restore();
    }
    // the identity ring draws itself around the tile
    const arc = eInOut(P(t, BV(53.4), 0.75)), ringOut = eIn(P(t, BV(58.2), 0.6));
    if (arc > 0 && ringOut < 1) {
      ctx.strokeStyle = TRUST_TEAL; ctx.lineWidth = 3 * (1 - ringOut); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(NF.cx, NF.cy, lerp(NF.ring, 110, gather), -Math.PI / 2, -Math.PI / 2 + arc * Math.PI * 2); ctx.stroke();
    }
    // verified badge on the photo, bottom right
    const vk = spr(t, BV(56.75), 17, 0.8) * (1 - eIn(P(t, BV(58), 0.3)));
    if (vk > 0.01) {
      const r = ts / 2, vx = NF.cx + Math.cos(Math.PI / 4) * r, vy = NF.cy + Math.sin(Math.PI / 4) * r;
      ctx.save(); ctx.translate(vx, vy); ctx.scale(vk, vk);
      circ(ctx, 0, 0, 30); ctx.fillStyle = C.white; ctx.fill(); duo(ctx, 'verify', 0, 0, 68, C.green);
      ctx.restore();
    }
    rise(ctx, t, 'RIYADH', 960, 590, { size: 24, w: 700, c: C.leaf, align: 'center', ls: 8 }, B(48.4), B(49));
  }
  rise(ctx, t, 'IDENTITY LAYER', 960, 902, { size: 22, w: 700, c: TRUST_TEAL, align: 'center', ls: 8 }, BV(54), BV(58));
  rise(ctx, t, 'Verified · Riyadh', 960, 962, { size: 46, w: 700, c: C.mist, align: 'center' }, BV(55.5), BV(58) + 0.04);
  rise(ctx, t, 'Telecoms own the identity layer.', 960, 128, { size: 60, w: 700, c: C.mist, align: 'center', ls: -1 }, BV(55), BV(58) + 0.08);
  {
    const o = { size: 36, w: 500 }, a = TW(ctx, 'Trusted identity and connectivity ', o), b = TW(ctx, 'at scale.', o);
    rise(ctx, t, 'Trusted identity and connectivity', 960 - (a + b) / 2, 188, { ...o, c: C.fog }, BV(57), BV(58) + 0.08);
    rise(ctx, t, 'at scale.', 960 - (a + b) / 2 + a, 188, { ...o, w: 700, c: C.neon }, BV(57) + 0.12, BV(58) + 0.1);
  }
});
