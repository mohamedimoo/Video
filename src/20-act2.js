// ===== ACT II — SHAPE MORPHING (bars 8–13, beats 28–51) =====
const NM = 140;
const CIRC = [[560, 560], [960, 560], [1360, 560]], CR = 150;
const RING = { cx: 960, cy: 560, r0: 190, r1: 262 };
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
  const HAB_IC = ['ContentWriting', 'UserGroup', 'ShoppingBag01'];
  ['Content', 'Community', 'Commerce'].forEach((lab, i) => {
    const q = spr(t, B(29) + i * 0.08, 15, 0.8) * (1 - eIn(P(t, BN(39) + 0.1, 0.3)));
    if (t < B(36) && q > 0.01) {
      const am = i * 2 * Math.PI / 3 + Math.PI / 3 + rot, rm = (RING.r0 + RING.r1) / 2;
      const [sx, sy] = ringXf(t)([[RING.cx + Math.cos(am) * rm, RING.cy + Math.sin(am) * rm]])[0];
      const k = ringXf.k(t);
      const ix = lerp(CIRC[i][0], sx, toSector), iy = lerp(CIRC[i][1], sy, toSector);
      if (toSector > 0.05) { circ(ctx, ix, iy, 40 * k * q * toSector); ctx.fillStyle = C.night; ctx.fill(); }
      icon(ctx, HAB_IC[i], ix, iy, lerp(120, 44 * k, toSector) * q, mixC(C.deep, C.neon, toSector), 1.1);
      const lr = 372, lx = RING.cx + Math.cos(am) * lr, ly = RING.cy + Math.sin(am) * lr + 12;
      const pl = [lerp(CIRC[i][0], lx, toSector), lerp(CIRC[i][1] + CR + 70, ly, toSector)];
      rise(ctx, t, lab, pl[0], pl[1], { size: lerp(38, 30, toSector), w: 700, c: C.mist, align: 'center' }, B(29) + 0.1 + i * 0.08, BN(36));
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
    ['TIKTOK', 95, ' min/day', 150, 420, 'left', '', 'l_tiktok'],
    ['SPOTIFY', 30, ' min/day', 1770, 420, 'right', '', 'l_spotify'],
    ['STARBUCKS', 1, ' pay app in US', 1770, 780, 'right', '#', 'l_starbucks'],
    ['ALIPAY', 1, 'B daily users', 150, 780, 'left', '', 'l_alipay'],
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
      const rx = RING.cx + Math.cos(ang) * (RING.r1 + 26), ry = RING.cy + Math.sin(ang) * (RING.r1 + 26);
      ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex, y); ctx.lineTo(lerp(ex, rx, lp), lerp(y, ry, lp)); ctx.stroke();
      circ(ctx, lerp(ex, rx, lp), lerp(y, ry, lp), 6); ctx.fillStyle = C.neon; ctx.fill();
    }
    shadowOn(ctx, 0.5); rr(ctx, x0, y0, cw, ch, 30); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
    pic(ctx, logo, x0 + 70, y, 82);
    T(ctx, k, x0 + 140, y - 16, { size: 20, w: 700, c: C.leaf, ls: 6 });
    T(ctx, stat, x0 + 140, y + 36, { size: 44, w: 700, c: C.deep, ls: -1 });
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
    const r = lerp(0, 2300, eIn(P(t, B(39.2), B(0.8))));
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
function drawGlobe(ctx, lc, tilt, cx, cy, R, f, lw = 2) {
  const lines = [];
  for (let k = -6; k < 6; k++) { const lon = lc + k * 30 * f + 0.0001; const pts = []; for (let i = 0; i <= 72; i++) pts.push(gProj(-90 + i * 2.5, lon, lc, tilt, cx, cy, R)); lines.push(pts); }
  for (let j = -2; j <= 2; j++) { const lat = j * 30 * f; const pts = []; for (let i = 0; i <= 120; i++) pts.push(gProj(lat, lc - 180 + i * 3, lc, tilt, cx, cy, R)); lines.push(pts); }
  ctx.lineWidth = lw; ctx.lineCap = 'round';
  ctx.strokeStyle = '#0B2B26'; lines.forEach(l => strokeVis(ctx, l, false));
  ctx.strokeStyle = C.teal; ctx.lineWidth = lw * 1.4; lines.forEach(l => strokeVis(ctx, l, true));
  circ(ctx, cx, cy, R); ctx.strokeStyle = C.teal; ctx.lineWidth = lw * 1.6; ctx.stroke();
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
const SHIELD = (() => {
  const pts = [[-1, -0.95], [0, -1.2], [1, -0.95], [1, 0.1]];
  for (let i = 1; i < 16; i++) { const u = i / 16; pts.push([1 - u, 0.1 + Math.sin(u * Math.PI / 2) * 1.1]); }
  for (let i = 0; i < 16; i++) { const u = i / 16; pts.push([-u, 0.1 + Math.cos(u * Math.PI / 2) * 1.1]); }
  pts.push([-1, 0.1]);
  return pts;
})();
const shieldPts = (cx, cy, s) => resample(SHIELD.map(([a, b]) => [cx + a * s, cy + b * s]), NM);

scene(40, 52.2, (ctx, t) => {
  bg(ctx, C.night);
  const f = eOut(P(t, B(40), 0.7));
  const toRiyadh = eInOut(P(t, B(48), 0.7));
  const lc = lerp(lerp(98, 88, P(t, B(40), B(8))), RIYADH.lon, toRiyadh);
  const tilt = 0.32;
  const zoom = eIn(P(t, B(49), 0.62));
  const R = 330 * (1 + 9 * zoom);
  // keep Riyadh fixed while the globe zooms in on it
  const rp = gProj(RIYADH.lat, RIYADH.lon, lc, tilt, 0, 0, R);
  const cx = lerp(960, 960 - rp[0], toRiyadh), cy = lerp(600, 500 - rp[1], toRiyadh);
  if (t < B(50.2)) drawGlobe(ctx, lc, tilt, cx, cy, R, f, lerp(2, 6, zoom));
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
    // leader line
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
  const order = [0, 1, 2, 3, 4];
  const rq = gProj(RIYADH.lat, RIYADH.lon, lc, tilt, cx, cy, R);
  const route = order.map(i => pp[i]).concat([rq]);
  const tp = eInOut(P(t, B(47), B(1.4))) * (route.length - 1);
  const th = eIn(P(t, B(49), 0.3));
  if (tp > 0 && t < B(49.4)) {
    ctx.strokeStyle = C.neon; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
    const tail = Math.max(0, tp - 1.6 + th * 2);
    for (let s = tail; s <= tp; s += 0.02) {
      const i = Math.min(Math.floor(s), route.length - 2), u = s - i, a = route[i], b = route[i + 1];
      const x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) - Math.sin(u * Math.PI) * 60;
      s === tail ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // Riyadh -> the Nafath tile -> the Salam mark -> a line
  if (t >= B(48.4)) {
    const k = spr(t, B(48.4), 18);
    const toTile = eInOut(P(t, B(49), 0.5)), toMark = eInOut(P(t, B(50), 0.5));
    const flat = eInOut(P(t, B(51), 0.42));
    const c0 = circlePts(rq[0], rq[1], 12 * k, NM);
    const tile = align(c0, rrPts(960 - 160, 500 - 160, 320, 320, 76, NM));
    const mk = align(tile, markPts(960, 500, 460, NM));
    let pts = mixPts(c0, tile, toTile);
    if (toMark > 0) pts = mixPts(pts, mk, toMark);
    if (flat > 0) pts = mixPts(pts, align(mk, rectPts(-20, 538, 1960, 4, NM)), flat);
    const col = toMark > 0 ? mixC(NAFATH_TEAL, C.green, toMark) : toTile > 0 ? mixC(C.neon, NAFATH_TEAL, toTile) : C.neon;
    poly(ctx, pts); ctx.fillStyle = flat > 0 ? mixC(C.green, C.mist, flat) : col; ctx.fill();
    // the real Nafath logo sits in the tile
    const q = spr(t, B(49) + 0.2, 17) * (1 - eIn(P(t, B(50) - 0.05, 0.22)));
    if (q > 0.01) {
      ctx.save(); ctx.translate(960, 500); ctx.scale(q, q);
      rr(ctx, -128, -128, 256, 256, 54); ctx.fillStyle = C.white; ctx.fill();
      pic(ctx, 'l_nafath', 0, 0, 250);
      ctx.restore();
    }
    rise(ctx, t, 'RIYADH', 960, 590, { size: 24, w: 700, c: C.leaf, align: 'center', ls: 8 }, B(48.4), B(49));
  }
  rise(ctx, t, 'Telecoms own the identity layer', 960, 880, { size: 60, w: 600, c: C.mist, align: 'center' }, B(49) + 0.1, B(50));
  {
    const o = { size: 60, w: 600 }, a = TW(ctx, 'Trusted identity and connectivity ', o), b = TW(ctx, 'at scale.', o);
    rise(ctx, t, 'Trusted identity and connectivity', 960 - (a + b) / 2, 880, { ...o, c: C.mist }, B(50) + 0.05, B(51));
    rise(ctx, t, 'at scale.', 960 - (a + b) / 2 + a, 880, { ...o, c: C.neon }, B(50) + 0.15, B(51) + 0.05);
  }
});
