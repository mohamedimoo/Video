// ===== ACT II — SHAPE MORPHING (bars 8–13, beats 28–51) =====
const NM = 140;
const CIRC = [[560, 560], [960, 560], [1360, 560]], CR = 150;
const RING = { cx: 960, cy: 560, r0: 190, r1: 262 };
const HAB_LO = { size: 30, w: 700, c: C.mist, align: 'center' };
const GAP = 0.09;
const ROT_W = 0.75;
function ringRot(t) {
  const a = Math.min(t, B(36)) - B(31);
  return -Math.PI / 2 + ROT_W * Math.max(0, a) + ROT_W * 0.25 * eOut(P(t, B(36), 0.5));
}
const ROT_FINAL = -Math.PI / 2 + ROT_W * (B(36) - B(31)) + ROT_W * 0.25;
function rotPts(pts, cx, cy, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
}
// during the inserted bar the loop shrinks up and makes room for the 30-day comparison
function ringXf(t) {
  const sh = eInOut(P(t, BN(36), 0.5)) - eInOut(P(t, BN(39), 0.5));
  const k = 1 - 0.45 * sh, dy = -250 * sh;
  return pts => pts.map(([x, y]) => [RING.cx + (x - RING.cx) * k, RING.cy + (y - RING.cy) * k + dy]);
}
ringXf.k = t => 1 - 0.45 * (eInOut(P(t, BN(36), 0.5)) - eInOut(P(t, BN(39), 0.5)));
function habitDays(ctx, t) {
  if (t < BN(36) || t > BN(40)) return;
  const rows = [
    { lab: 'Winning apps', y: 600, tIn: BN(36) + 0.15, lit: d => BN(36.6) + d * BN(1) / 30, right: 'every day', rc: C.neon },
    { lab: 'Telco app', y: 760, tIn: BN(37), lit: d => d === 29 ? BN(38) : 1e9, right: 'once a month', rc: C.fog },
  ];
  const gone = eIn(P(t, BN(39), 0.5));
  rows.forEach((r, ri) => {
    rise(ctx, t, r.lab, 150, r.y + 12, { size: 34, w: 700, c: C.mist }, r.tIn, BN(39));
    for (let d = 0; d < 30; d++) {
      const k = spr(t, r.tIn + d * 0.012, 18, 0.8);
      if (k <= 0.01) continue;
      const x0 = 470 + d * 36, y0 = r.y;
      const x = lerp(x0, RING.cx, gone), y = lerp(y0, RING.cy, gone);
      const on = t >= r.lit(d);
      const pop = on ? 1 + 0.35 * Math.max(0, 1 - (t - r.lit(d)) * 5) : 1;
      circ(ctx, x, y, 12 * k * pop * (1 - gone)); ctx.fillStyle = on ? (ri ? C.leaf : C.neon) : C.teal; ctx.fill();
    }
    const rk = ri ? BN(38) + 0.1 : BN(37.6);
    rise(ctx, t, r.right, 1770, r.y + 12, { size: 34, w: 700, c: r.rc, align: 'right' }, rk, BN(39));
  });
}
const sectorCanon = i => sectorPts(RING.cx, RING.cy, RING.r0, RING.r1, i * 2 * Math.PI / 3 + GAP, (i + 1) * 2 * Math.PI / 3 - GAP, NM);

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
  const circles = CIRC.map(([cx, cy], i) => circlePts(cx, cy, CR, NM));
  const sectors = circles.map((c, i) => align(c, sectorCanon(i)));
  // "7–15×"
  const num = glyphRun('7–15×', 300);
  const nx = 960 - num.w / 2, ny = 680;
  const numG = num.gl.map(g => g.cs.map(c => c.map(([a, b]) => [a + nx, b + ny])));
  const mainOf = cs => { let mi = 0; cs.forEach((c, k) => { if (Math.abs(area(c)) > Math.abs(area(cs[mi]))) mi = k; }); return mi; };
  const glyphT = [2, 3, 4].map((gi, i) => {
    const cs = numG[gi], mi = mainOf(cs);
    const src = rotPts(sectors[i], RING.cx, RING.cy, ROT_FINAL + Math.PI / 2);
    return { src, tgt: align(src, resample(cs[mi], NM)), rest: cs.filter((_, k) => k !== mi) };
  });
  // the × becomes the globe's crosshair
  const xg = glyphT[2].tgt, xc = centroid(xg);
  const R = 330, th = 3;
  const plus = resample([[-th, -R], [th, -R], [th, -th], [R, -th], [R, th], [th, th], [th, R], [-th, R], [-th, th], [-R, th], [-R, -th], [-th, -th]].map(([a, b]) => [a + 960, b + 600]), NM);
  const xToPlus = align(rotPts(xg, xc[0], xc[1], Math.PI / 4).map(([a, b]) => [a - xc[0] + 960, b - xc[1] + 600]), plus);
  _M2 = { letters, circles, sectors, numG, glyphT, xc, plus, nx, ny };
  return _M2;
}

scene(27.5, 40.2, (ctx, t) => {
  const M = morph2();
  if (t >= B(28)) bg(ctx, C.deep);
  const rot = ringRot(t) + Math.PI / 2;
  const toSector = eInOut(P(t, B(31), 0.62));
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
    // 2) circles -> 3) the habit loop: rotating sectors with direction arrows around a 24-hour dial
    const xf = ringXf(t);
    if (toSector > 0.3) {
      ctx.strokeStyle = C.line; ctx.lineCap = 'round';
      for (let h = 0; h < 24; h++) {
        const a = h / 24 * Math.PI * 2 - Math.PI / 2, major = h % 6 === 0;
        const r0 = (major ? 136 : 148) * toSector, r1 = 162 * toSector;
        ctx.lineWidth = major ? 4 : 2;
        const p0 = xf([[RING.cx + Math.cos(a) * r0, RING.cy + Math.sin(a) * r0]])[0], p1 = xf([[RING.cx + Math.cos(a) * r1, RING.cy + Math.sin(a) * r1]])[0];
        ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); ctx.stroke();
      }
    }
    M.circles.forEach((c, i) => {
      const s = rotPts(M.sectors[i], RING.cx, RING.cy, rot);
      const col = [C.mist, C.leaf, C.neon][i];
      poly(ctx, xf(mixPts(c, s, toSector))); ctx.fillStyle = mixC(C.mist, col, toSector); ctx.fill();
      // arrowhead on the leading end of each sector: it reads as a loop
      const ar = eOut(P(t, B(31) + 0.4, 0.35));
      if (ar > 0) {
        const a1 = (i + 1) * 2 * Math.PI / 3 - GAP + rot, rm = (RING.r0 + RING.r1) / 2;
        const tri = [[Math.cos(a1) * (RING.r0 - 14), Math.sin(a1) * (RING.r0 - 14)], [Math.cos(a1) * (RING.r1 + 14), Math.sin(a1) * (RING.r1 + 14)], [Math.cos(a1 + 0.2 * ar) * rm, Math.sin(a1 + 0.2 * ar) * rm]];
        poly(ctx, xf(tri.map(([x, y]) => [RING.cx + x, RING.cy + y]))); ctx.fillStyle = col; ctx.fill();
      }
    });
  } else if (t < B(39.2)) {
    // 4) sectors -> "15×"
    M.glyphT.forEach((g, i) => {
      const src = rotPts(M.sectors[i], RING.cx, RING.cy, rot);
      ctx.beginPath();
      const pts = mixPts(src, g.tgt, toGlyph);
      ctx.moveTo(pts[0][0], pts[0][1]); pts.forEach(q => ctx.lineTo(q[0], q[1])); ctx.closePath();
      if (toGlyph > 0.6) g.rest.forEach(c => { ctx.moveTo(c[0][0], c[0][1]); c.forEach(z => ctx.lineTo(z[0], z[1])); ctx.closePath(); });
      const exit = i < 2 ? eIn(P(t, B(39), 0.25)) : 0;
      if (exit > 0) { const cc = centroid(g.tgt); ctx.save(); ctx.translate(cc[0], cc[1]); ctx.scale(1 - exit, 1 - exit); ctx.translate(-cc[0], -cc[1]); }
      ctx.fillStyle = i === 2 ? mixC(C.mist, C.neon, toGlyph) : C.mist; ctx.fill('nonzero');
      if (exit > 0) ctx.restore();
    });
  }
  // real 3D icons: inside the circles first, then riding the loop's sectors
  const HAB_IC = ['ContentWriting', 'UserGroup', 'ShoppingBag01'], labels = [];
  ['Content', 'Community', 'Commerce'].forEach((lab, i) => {
    const q = spr(t, B(29) + i * 0.08, 15, 0.8) * (1 - eIn(P(t, BN(39) + 0.1, 0.3)));
    if (t < B(36) && q > 0.01) {
      const am = i * 2 * Math.PI / 3 + Math.PI / 3 + rot, rm = (RING.r0 + RING.r1) / 2;
      const [sx, sy] = ringXf(t)([[RING.cx + Math.cos(am) * rm, RING.cy + Math.sin(am) * rm]])[0];
      const k = ringXf.k(t);
      const ix = lerp(CIRC[i][0], sx, toSector), iy = lerp(CIRC[i][1], sy, toSector);
      if (toSector > 0.05) { circ(ctx, ix, iy, 40 * k * q * toSector); ctx.fillStyle = C.night; ctx.fill(); }
      icon(ctx, HAB_IC[i], ix, iy, lerp(120, 44 * k, toSector) * q, mixC(C.deep, C.neon, toSector), 1.1);
      // the label hugs the outside of the ring: its box never comes closer than 20 px to the band
      const hw = TW(ctx, lab, HAB_LO) / 2 + 12, d = RING.r1 + 20 + Math.abs(Math.cos(am)) * hw + Math.abs(Math.sin(am)) * 23;
      labels.push([lab, i, RING.cx + Math.cos(am) * d, RING.cy + Math.sin(am) * d + 10, hw]);
    }
  });
  // plus signs
  [760, 1160].forEach((x, i) => {
    const k = spr(t, B(30) + i * 0.08, 18) * (1 - eIn(P(t, B(31) - 0.1, 0.25)));
    if (k <= 0.001) return;
    ctx.fillStyle = C.neon; ctx.fillRect(x - 28 * k, 556, 56 * k, 8); ctx.fillRect(x - 4, 560 - 28 * k, 8, 56 * k);
  });
  rise(ctx, t, 'THE HABIT LOOP', 960, 110, { size: 26, w: 700, c: C.leaf, align: 'center', ls: 10 }, B(28.75), BN(36));
  // stats around the loop: white cards with the partner's real logo, wired to the loop
  const STATS = [
    ['TIKTOK', 95, ' min/day', 96, 330, 'left', '', 'l_tiktok'],
    ['SPOTIFY', 30, ' min/day', 1824, 330, 'right', '', 'l_spotify'],
    ['STARBUCKS · US', 1, ' pay app', 1824, 840, 'right', '#', 'l_starbucks'],
    ['ALIPAY', 1, 'B daily users', 96, 840, 'left', '', 'l_alipay'],
  ];
  STATS.forEach(([k, v, suf, x, y, al, pre, logo], i) => {
    const t0 = B(32 + i);
    if (t < t0 || t > BN(36) + 0.5) return;
    const n = Math.round(v * eOut(P(t, t0, 0.45)));
    const stat = (pre || '') + n + suf, full = (pre || '') + v + suf;
    const cw = 140 + Math.max(TW(ctx, k, { size: 20, w: 700, ls: 6 }), TW(ctx, full, { size: 44, w: 700, ls: -1 })) + 34, ch = 130;
    const inn = spr(t, t0, 15, 0.86), out = eIn(P(t, BN(36), 0.4));
    const dx = (al === 'left' ? -1 : 1) * ((1 - inn) * 700 + out * 900);
    const x0 = (al === 'left' ? x : x - cw) + dx, y0 = y - ch / 2;
    // connector to the loop
    const ex = al === 'left' ? x0 + cw : x0, ang = Math.atan2(y - RING.cy, ex - RING.cx);
    const lp = eOut(P(t, t0 + 0.15, 0.35)) * (1 - out);
    if (lp > 0) {
      const rx = RING.cx + Math.cos(ang) * (RING.r1 + 12), ry = RING.cy + Math.sin(ang) * (RING.r1 + 12);
      ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex, y); ctx.lineTo(lerp(ex, rx, lp), lerp(y, ry, lp)); ctx.stroke();
      circ(ctx, lerp(ex, rx, lp), lerp(y, ry, lp), 6); ctx.fillStyle = C.neon; ctx.fill();
    }
    shadowOn(ctx, 0.5); rr(ctx, x0, y0, cw, ch, 30); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
    pic(ctx, logo, x0 + 70, y, 82);
    T(ctx, k, x0 + 140, y - 16, { size: 20, w: 700, c: C.leaf, ls: 6 });
    T(ctx, stat, x0 + 140, y + 36, { size: 44, w: 700, c: C.deep, ls: -1 });
  });
  // the ring labels sit on top of the connectors: a knockout in the background colour lets the lines pass behind them
  // (under the circles first; they leave as the circles become the loop and return hugging the ring)
  labels.forEach(([lab, i, x, y, hw]) => {
    rise(ctx, t, lab, CIRC[i][0], CIRC[i][1] + CR + 70, { ...HAB_LO, size: 38 }, B(29) + 0.1 + i * 0.08, B(31) - 0.05);
    const t1 = B(31) + 0.5 + i * 0.06;
    if (t > t1 && t < BN(36) + 0.3) { rr(ctx, x - hw, y - 33, hw * 2, 46, 23); ctx.fillStyle = C.deep; ctx.fill(); }
    rise(ctx, t, lab, x, y, HAB_LO, t1, BN(36));
  });
  rise(ctx, t, 'daily', 960, 578, { size: 44, w: 700, c: C.mist, align: 'center' }, B(31.6), BN(36));
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
const NAFATH_TEAL = '#2F9B95';
function rrPts(x, y, w, h, r, N) {
  const o = [], c = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
  c.forEach(([cx, cy, a0]) => { for (let i = 0; i <= 10; i++) { const a = a0 + i / 10 * Math.PI / 2; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } });
  return resample(o, N);
}

// --- Nafath: the globe's dots stream into concentric identity rings around the Nafath tile ---
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
let _NFMAP = null;
function nafathMap() {
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
  const ripple = Math.sin(Math.PI * P(t, BV(56) + k * 0.06, 0.38)) * 12;
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
  const map = nafathMap();
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
      const spin = (t - BV(54)) * 0.05 * (slot.k % 2 ? -1 : 1);
      const a1 = slot.a + Math.max(0, spin), r1 = ringR(t, slot.k);
      const r0 = Math.hypot(from.x - NF.cx, from.y - NF.cy), a0 = Math.atan2(from.y - NF.cy, from.x - NF.cx);
      let da = ((a1 - a0) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
      const a = a0 + da * p + 0.9 * Math.sin(p * Math.PI), r = lerp(r0, r1, p) + 46 * Math.sin(p * Math.PI);
      const g = globeDot(from.z, 1);
      const rad = lerp(g.r, 4.3, p) * (1 - gone);
      if (rad <= 0.05) return;
      circ(ctx, NF.cx + Math.cos(a) * r, NF.cy + Math.sin(a) * r, rad); ctx.fillStyle = mixC(g.c, NAFATH_TEAL, p); ctx.fill();
    });
  }
  // Riyadh pin -> the white Nafath tile -> a line (the ground of the house)
  if (t >= B(48.4)) {
    const k = spr(t, B(48.4), 18);
    const toTile = eInOut(P(t, BV(53.15), 0.45));
    const flat = eInOut(P(t, B(51), 0.42));
    const gather = eIn(P(t, BV(58), 0.75));
    const c0 = circlePts(rq[0], rq[1], 12 * k, NM);
    const ts = NF.tile * (1 - 0.15 * gather);
    const tile = align(c0, rrPts(NF.cx - ts / 2, NF.cy - ts / 2, ts, ts, ts * 0.23, NM));
    let pts = mixPts(c0, tile, toTile);
    if (flat > 0) pts = mixPts(pts, align(tile, rectPts(-20, 538, 1960, 4, NM)), flat);
    poly(ctx, pts); ctx.fillStyle = flat > 0 ? mixC(C.white, C.mist, flat) : mixC(C.neon, C.white, toTile); ctx.fill();
    const q = spr(t, BV(53.45), 16, 0.82) * (1 - eIn(P(t, B(51) - 0.12, 0.2)));
    if (q > 0.01) pic(ctx, 'l_nafath', NF.cx, NF.cy, 205 * q * (1 - 0.15 * gather));
    // the identity ring draws itself around the tile
    const arc = eInOut(P(t, BV(53.4), 0.75)), ringOut = eIn(P(t, BV(58.2), 0.6));
    if (arc > 0 && ringOut < 1) {
      ctx.strokeStyle = NAFATH_TEAL; ctx.lineWidth = 3 * (1 - ringOut); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(NF.cx, NF.cy, lerp(NF.ring, 110, gather), -Math.PI / 2, -Math.PI / 2 + arc * Math.PI * 2); ctx.stroke();
    }
    // verified
    const vk = spr(t, BV(56), 17, 0.8) * (1 - eIn(P(t, BV(58), 0.3)));
    if (vk > 0.01) {
      const vx = NF.cx + Math.cos(-Math.PI / 4) * NF.ring, vy = NF.cy + Math.sin(-Math.PI / 4) * NF.ring;
      ctx.save(); ctx.translate(vx, vy); ctx.scale(vk, vk);
      circ(ctx, 0, 0, 26); ctx.fillStyle = NAFATH_TEAL; ctx.fill(); icon(ctx, 'Tick02', 0, 0, 30, C.white, 1.5);
      ctx.restore();
    }
    rise(ctx, t, 'RIYADH', 960, 590, { size: 24, w: 700, c: C.leaf, align: 'center', ls: 8 }, B(48.4), B(49));
  }
  rise(ctx, t, 'IDENTITY LAYER', 960, 902, { size: 22, w: 700, c: NAFATH_TEAL, align: 'center', ls: 8 }, BV(54), BV(58));
  rise(ctx, t, 'Nafath · Riyadh', 960, 962, { size: 46, w: 700, c: C.mist, align: 'center' }, BV(54.2), BV(58) + 0.04);
  rise(ctx, t, 'Telecoms own the identity layer.', 960, 128, { size: 60, w: 700, c: C.mist, align: 'center', ls: -1 }, BV(55), BV(58) + 0.08);
  {
    const o = { size: 36, w: 500 }, a = TW(ctx, 'Trusted identity and connectivity ', o), b = TW(ctx, 'at scale.', o);
    rise(ctx, t, 'Trusted identity and connectivity', 960 - (a + b) / 2, 188, { ...o, c: C.fog }, BV(57), BV(58) + 0.08);
    rise(ctx, t, 'at scale.', 960 - (a + b) / 2 + a, 188, { ...o, w: 700, c: C.neon }, BV(57) + 0.12, BV(58) + 0.1);
  }
});
