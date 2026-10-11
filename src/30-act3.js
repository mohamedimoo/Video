// ===== ACT III — 2D TO 3D (bars 14–20, beats 51–79) =====
// The strategy house is drawn flat as an elevation, then extruded and orbited.
const HY = 575;  // world origin on screen
const LIGHT = (() => { const l = [-0.35, -0.85, -0.55], m = Math.hypot(...l); return l.map(v => v / m); })();
function shade(base, n) {
  const f = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2];
  return f > 0.5 ? mixC(base, '#FFFFFF', (f - 0.5) * 0.45) : mixC(base, '#000000', (0.5 - f) * 0.5);
}
// extrude a screen-space polygon (front at z0) into faces
function prism(cam, pts, z0, z1, tag) {
  const F = pts.map(([x, y]) => cam.p(x - 960, y - HY, z0)), Bk = pts.map(([x, y]) => cam.p(x - 960, y - HY, z1));
  const out = [];
  const add = (q, n, kind) => { if (area(q) > 0.3) out.push({ pts: q, z: q.reduce((a, p) => a + p[2], 0) / q.length, n, kind, tag }); };
  add(F, [0, 0, -1], 'front');
  if (out.length) {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    out[0].bb = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => cam.p(x - 960, y - HY, z0));
    out[0].bw = x1 - x0; out[0].bh = y1 - y0;
  }
  if (z1 - z0 > 0.5) {
    add(Bk.slice().reverse(), [0, 0, 1], 'back');
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length, ex = pts[j][0] - pts[i][0], ey = pts[j][1] - pts[i][1], m = Math.hypot(ex, ey) || 1;
      add([Bk[i], Bk[j], F[j], F[i]], [ey / m, -ex / m, 0], 'side');
    }
  }
  return out;
}
const rectP = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

const PILLARS = ['EXPERIENCE', 'INTELLIGENCE', 'GROWTH', 'ECOSYSTEM', 'TRUST'];
const FOUND = ['Data', 'AI', 'Engineering', 'Content', 'Operations', 'Security', 'Governance'];
function pillarIcon(ctx, i, cx, cy, r, col) {
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  circ(ctx, cx, cy, r); ctx.stroke();
  const s = r * 0.5;
  ctx.beginPath();
  if (i === 0) { ctx.moveTo(cx, cy + s * 0.8); ctx.bezierCurveTo(cx - s * 1.4, cy - s * 0.2, cx - s * 0.6, cy - s * 1.2, cx, cy - s * 0.4); ctx.bezierCurveTo(cx + s * 0.6, cy - s * 1.2, cx + s * 1.4, cy - s * 0.2, cx, cy + s * 0.8); ctx.stroke(); }
  if (i === 1) { circ(ctx, cx, cy, s * 0.55); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx, cy, s * 1.1, s * 0.45, -0.5, 0, Math.PI * 2); ctx.stroke(); }
  if (i === 2) { ctx.moveTo(cx - s, cy + s * 0.6); ctx.lineTo(cx - s * 0.2, cy - s * 0.1); ctx.lineTo(cx + s * 0.2, cy + s * 0.3); ctx.lineTo(cx + s, cy - s * 0.6); ctx.moveTo(cx + s * 0.4, cy - s * 0.6); ctx.lineTo(cx + s, cy - s * 0.6); ctx.lineTo(cx + s, cy); ctx.stroke(); }
  if (i === 3) { const pts = [[0, -1], [-0.9, 0.6], [0.9, 0.6]].map(([a, b]) => [cx + a * s, cy + b * s]); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.lineTo(...pts[2]); ctx.closePath(); ctx.stroke(); pts.forEach(p => { circ(ctx, p[0], p[1], s * 0.28); ctx.fill(); }); }
  if (i === 4) { ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s * 0.85, cy - s * 0.6); ctx.lineTo(cx + s * 0.75, cy + s * 0.3); ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s * 0.75, cy + s * 0.3); ctx.lineTo(cx - s * 0.85, cy - s * 0.6); ctx.closePath(); ctx.stroke(); }
}

// house elements in screen-space elevation; each knows how to grow in 2D and how to label its front face
function houseEls(t) {
  const els = [];
  const reveal = (t0) => eOut(P(t, B(t0), 0.45));
  // measurement + culture rows reveal left->right
  {
    const p = reveal(52); if (p > 0) els.push({ id: 'meas', poly: rectP(360, 842, 360 + 1200 * p, 900), d: 230, col: C.stone, tc: C.deep,
      label: (c, w, h) => { T(c, 'MEASUREMENT', 26, 38, { size: 20, w: 700, c: C.deep, ls: 4 }); T(c, 'Business outcomes  ›  Customer outcomes  ›  Experience KPIs  ›  Leading indicators  ›  Continuous optimisation', 240, 37, { size: 17, w: 500, c: C.deep }); } });
  }
  {
    const p = reveal(53); if (p > 0) els.push({ id: 'cult', poly: rectP(360, 782, 360 + 1200 * p, 834), d: 230, col: C.teal, tc: C.mist,
      label: (c) => { T(c, 'CULTURE', 26, 34, { size: 20, w: 700, c: C.mist, ls: 4 }); T(c, 'Customer Obsessed  ·  Agile & Adaptive  ·  Empowered Teams  ·  Data-Driven  ·  Learn Fast  ·  Own It', 200, 33, { size: 17, w: 500, c: C.mist }); } });
  }
  const bw = (1200 - 6 * 8) / 7;
  FOUND.forEach((n, i) => {
    const k = spr(t, B(54) + i * 0.05, 18); if (k <= 0.001) return;
    const x0 = 360 + i * (bw + 8), cx = x0 + bw / 2, cy = 748, w = bw * k, h = 52 * k;
    els.push({ id: 'f' + i, poly: rectP(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), d: 230, col: C.deep, tc: C.mist,
      label: (c, ww, hh) => T(c, n, ww / 2, hh / 2 + 6, { size: 18, w: 600, c: C.mist, align: 'center' }) });
  });
  PILLARS.forEach((n, i) => {
    const k = spr(t, B(55) + i * 0.08, 15, 0.85); if (k <= 0.001) return;
    const x0 = 360 + i * 255, h = 284 * k;
    els.push({ id: 'p' + i, pillar: i, poly: rectP(x0, 714 - h, x0 + 180, 714), d: 200, col: i === 3 ? C.neon : C.green, tc: C.night,
      label: (c, w, hh) => {
        const q = eOut(P(t, B(56) + i * 0.06, 0.35)); if (q <= 0) return;
        c.save(); c.beginPath(); c.rect(0, 0, w, hh); c.clip();
        pillarIcon(c, i, w / 2, 76 + (1 - q) * 300, 38, C.night);
        T(c, n, w / 2, hh - 30 + (1 - q) * 200, { size: 18, w: 700, c: C.night, align: 'center', ls: 2 });
        c.restore();
      } });
  });
  {
    const k = spr(t, B(57), 20, 0.9);
    if (t >= B(57)) {
      const dy = (1 - k) * -700;
      els.push({ id: 'roof', poly: [[300, 416 + dy], [960, 244 + dy], [1620, 416 + dy]], d: 260, col: C.deep, tc: C.mist, roof: true,
        label: (c, w, h) => {
          const q = eOut(P(t, B(58), 0.4)); if (q <= 0) return;
          c.save(); c.beginPath(); c.rect(0, 0, w, h); c.clip();
          drawLeaf(c, w / 2 - 92, 96 + (1 - q) * 120, 52, C.green, -Math.PI / 4, C.deep);
          T(c, 'salam', w / 2 - 58, 112 + (1 - q) * 120, { size: 44, w: 700, c: C.mist });
          T(c, 'Making the joy of technology accessible for everyone, everyday.', w / 2, 150 + (1 - q) * 120, { size: 17, w: 500, c: C.fog, align: 'center' });
          c.restore();
        } });
    }
  }
  return els;
}

scene(51, 69, (ctx, t) => {
  // the line from Act II splits: the top edge flies up, the bottom edge becomes the ground
  const sp = eInOut(P(t, B(51.4), 0.55));
  const yTop = lerp(540, -30, sp), yBot = lerp(540, 900, sp);
  ctx.fillStyle = C.mist; ctx.fillRect(0, yTop, W, yBot - yTop);
  // 3D state
  const ex = eInOut(P(t, B(60), 0.7));                     // extrusion depth
  const orb = eInOut(P(t, B(60), B(3.2)));
  const sink = eIn(P(t, B(66), B(1)));
  const yaw = -0.62 * orb - 0.18 * P(t, B(63), B(5));
  const pitch = 0.36 * orb + 0.06 * P(t, B(63), B(5));
  const cam = cam3(yaw, pitch, 2600, 960, HY + 20 * orb);
  const fill = eOut(P(t, B(60), 0.5));
  const els = houseEls(t);
  let faces = [];
  els.forEach(e => {
    const lift = e.pillar === 0 || e.pillar === 1 || e.pillar === 3 ? 0 : sink * 1400;
    const poly2 = e.poly.map(([x, y]) => [x, y + lift]);
    prism(cam, poly2, 0, e.d * ex, e).forEach(f => faces.push(f));
  });
  faces.sort((a, b) => b.z - a.z);
  faces.forEach(f => {
    const e = f.tag;
    if (e.pillar !== undefined && [0, 1, 3].includes(e.pillar) && t >= B(66)) return; // drawn on top later
    drawFace(ctx, f, e, fill, t);
  });
  // ground band
  const gy = lerp(yBot, -40, eIn(P(t, B(66) + 0.05, B(1) - 0.05)));
  ctx.fillStyle = C.night; ctx.fillRect(0, gy, W, H - gy + 10);
  if (t < B(60)) { ctx.fillStyle = C.deep; ctx.fillRect(0, gy - 1.5, W, 3); }
  // the three forces lift out of the house and lay down as flat strips
  if (t >= B(66)) {
    const lay = eInOut(P(t, B(66.5), B(1.5)));
    const camL = cam3(lerp(yaw, 0, lay), lerp(pitch, 0, lay), 2600, 960, HY + 20 * orb);
    let pf = [];
    [0, 1, 3].forEach((pi, k) => {
      const e = els.find(q => q.pillar === pi); if (!e) return;
      const [x0, y0] = e.poly[0], [x1, y1] = e.poly[2];
      const tgt = [180, 440 + k * 120 - 40 - 6, 1740, 440 + k * 120 + 40 - 6];
      const up = eOut(P(t, B(66), 0.4)) * (1 - lay) * -120;
      const pts = rectP(lerp(x0, tgt[0], lay), lerp(y0, tgt[1], lay) + up, lerp(x1, tgt[2], lay), lerp(y1, tgt[3], lay) + up);
      prism(camL, pts, 0, e.d * ex * (1 - lay), { ...e, col: mixC(e.col, [C.mist, C.neon, C.leaf][k], lay), strip: lay > 0.15 ? k : undefined }).forEach(f => pf.push(f));
    });
    pf.sort((a, b) => b.z - a.z).forEach(f => drawFace(ctx, f, f.tag, 1, t));
  }
  // 3D type: the headline is extruded, then flips like a split-flap
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < B(60.3)) {
    riseWords(ctx, t, [['Our', C.deep], ['Strategy', C.deep], ['House.', C.leaf]], 120, 150, { size: 64, w: 700, ls: -1 }, [B(59), B(59) + .08, B(59) + .16], B(60.05));
  }
  if (t >= B(60.3) && t < B(66.6)) {
    const flip1 = eInOut(P(t, B(61), 0.42)), flip2 = eInOut(P(t, B(63), 0.42));
    const out = eIn(P(t, B(66), 0.4));
    let str, a;
    if (flip1 < 0.5) { str = 'Our Strategy House.'; a = flip1 * Math.PI; }
    else if (flip2 < 0.5) { str = 'Built from Joy.'; a = (flip1 - 1) * Math.PI + flip2 * Math.PI; }
    else { str = 'Measured for Impact.'; a = (flip2 - 1) * Math.PI; }
    const k = spr(t, B(60.3), 15);
    extruded(ctx, cam, str, -700, -470 - out * 900, 0, 84, 46 * k, a, C.deep, C.teal);
  }
});

function drawFace(ctx, f, e, fill, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  poly(ctx, f.pts);
  const front = f.kind === 'front';
  if (fill > 0) {
    let col = shade(e.col, f.n);
    // pillar colour pulses run left to right on beats 63-65
    if (e.pillar !== undefined && front) { const pu = Math.max(0, 1 - Math.abs(t - (B(63) + e.pillar * 0.3)) * 4); if (pu > 0) col = mixC(col, C.white, pu * 0.35); }
    ctx.save(); ctx.clip();
    // fill sweeps up from the ground on beat 60
    const sweepY = lerp(1100, -200, fill);
    ctx.fillStyle = col; ctx.fillRect(0, sweepY, W, H - sweepY + 200);
    ctx.restore();
    poly(ctx, f.pts);
  }
  ctx.lineWidth = 2; ctx.strokeStyle = fill >= 1 ? 'rgba(240,245,240,0.28)' : C.deep; ctx.lineJoin = 'round'; ctx.stroke();
  if (front && e.label && e.strip === undefined && f.bb) {
    const w = f.bw, h = f.bh;
    if (w < 20 || h < 20) return;
    ctx.save(); poly(ctx, f.pts); ctx.clip();
    onQuad(ctx, f.bb, w, h);
    e.label(ctx, w, h);
    ctx.restore();
  }
}

// slice-stacked extrusion: the same line of type drawn at 14 depths, back to front
function extruded(ctx, cam, str, X, Y, Z, size, depth, flip, colFront, colSide) {
  const o = { size, w: 800, ls: -3 };
  const w = TW(ctx, str, o), h = size * 1.1;
  const N = 14;
  const ca = Math.cos(flip), sa = Math.sin(flip);
  const pt = (u, v, z) => { const vv = v - h / 2; return cam.p(X + u, Y + h / 2 + vv * ca, z + vv * sa); };
  for (let k = 0; k <= N; k++) {
    const z = Z + depth * (1 - k / N);
    const p0 = pt(0, 0, z), p1 = pt(w, 0, z), p3 = pt(0, h, z);
    if (Math.abs((p1[0] - p0[0]) * (p3[1] - p0[1]) - (p1[1] - p0[1]) * (p3[0] - p0[0])) < 50) continue;
    ctx.setTransform((p1[0] - p0[0]) / w, (p1[1] - p0[1]) / w, (p3[0] - p0[0]) / h, (p3[1] - p0[1]) / h, p0[0], p0[1]);
    T(ctx, str, 0, size * 0.86, { ...o, c: k === N ? colFront : mixC(colSide, C.deep, k / N * 0.6) });
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// --- Three forces: ribbons twist together into the EAI sphere (beats 68–80) ---
const RIB = [
  { n: 'EXPERIENCE', c: C.mist, b: '#9DB5AE' },
  { n: 'AI', c: C.neon, b: '#2E8F35' },
  { n: 'VALUE-ADDED SERVICES', c: C.leaf, b: '#2D6B22' },
];
const RM = 96;
const ORB = { R: 280 };
// orientation of each band around the sphere
function bandBasis(k, t) {
  const fl = eInOut(P(t, B(78), B(1.2)));
  const tilt = lerp([0.35, 1.25, -0.6][k], 0, fl), spin = [0, 2.1, 4.2][k] + t * 0.5 * (1 - fl);
  // normal starts tilted around x then rotated around y by spin
  let n = [0, Math.cos(tilt), Math.sin(tilt)];
  const cs = Math.cos(spin), sn = Math.sin(spin);
  n = [n[0] * cs + n[2] * sn, n[1], -n[0] * sn + n[2] * cs];
  n = [lerp(n[0], 0, fl), lerp(n[1], 0, fl), lerp(n[2], -1, fl)];
  const m = Math.hypot(...n) || 1; n = n.map(v => v / m);
  let u = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const d = u[0] * n[0] + u[1] * n[1] + u[2] * n[2];
  u = u.map((v, i) => v - d * n[i]); const um = Math.hypot(...u); u = u.map(v => v / um);
  const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
  return { n, u, v };
}
scene(67.9, 81, (ctx, t) => {
  if (t >= B(68)) bg(ctx, C.night);
  if (t < B(68)) return;
  const amp = eInOut(P(t, B(68), B(1.5))) * 80;
  const tw = eInOut(P(t, B(68.3), B(1.5)));
  const conv = eInOut(P(t, B(70), B(1.2)));
  const toBand = eInOut(P(t, B(71.2), B(1.1)));
  const move = eInOut(P(t, B(78), B(1.6)));
  const cx = lerp(960, 1220, move), cy = 540;
  const shrink = eInOut(P(t, B(79), B(0.9)));
  const R = lerp(ORB.R, 175, shrink);
  const quads = [];
  RIB.forEach((r, k) => {
    const bb = bandBasis(k, t);
    const pts = [];
    for (let j = 0; j <= RM; j++) {
      const s = j / RM;
      // ribbon state (screen space)
      const baseY = lerp(434 + k * 120, 554, conv);
      const braid = conv * 90 * Math.sin(s * Math.PI * 2 * 1.3 - t * 4 + k * 2.094);
      const tap = s < 0.18 ? eInOut(s / 0.18) : 1;
      let x = lerp(180, 1740, s), y = baseY + tap * amp * Math.sin(Math.PI * 2 * 1.1 * s - t * 3 + k * 1.3) * (1 - conv) + braid * tap;
      const th = tap * tw * (Math.PI * 2 * 0.9 * s - t * 2.4 + k);
      let wx = 0, wy = 40 * Math.cos(th), front = Math.cos(th) >= 0, z = 0;
      // band state
      const ph = s * Math.PI * 2 + t * 1.2;
      const P3 = [0, 1, 2].map(i => R * (Math.cos(ph) * bb.u[i] + Math.sin(ph) * bb.v[i]));
      const hw = lerp(22, 3, shrink);
      const bx = cx + P3[0], by = cy + P3[1];
      x = lerp(x, bx, toBand); y = lerp(y, by, toBand);
      wx = lerp(wx, bb.n[0] * hw, toBand); wy = lerp(wy, bb.n[1] * hw, toBand);
      z = P3[2] * toBand;
      if (toBand > 0.5) front = z <= 0;
      pts.push({ x, y, wx, wy, z, front });
    }
    for (let j = 0; j < RM; j++) {
      const a = pts[j], b = pts[j + 1];
      quads.push({ q: [[a.x - a.wx, a.y - a.wy], [b.x - b.wx, b.y - b.wy], [b.x + b.wx, b.y + b.wy], [a.x + a.wx, a.y + a.wy]], z: (a.z + b.z) / 2, col: a.front ? r.c : r.b, k });
    }
  });
  const fillQ = q => { poly(ctx, q.q); ctx.fillStyle = q.col; ctx.fill(); ctx.strokeStyle = q.col; ctx.lineWidth = 1; ctx.stroke(); };
  if (toBand < 0.02) quads.forEach(fillQ);
  else {
    quads.filter(q => q.z > 0).sort((a, b) => b.z - a.z).forEach(fillQ);
    // the sphere
    const k = spr(t, B(71.6), 14);
    if (k > 0.01) {
      circ(ctx, cx, cy, R * k); ctx.fillStyle = mixC(C.night, C.neon, shrink); ctx.fill();
      if (shrink < 0.95) drawGlobe(ctx, t * 25, 0.4 + 0.9 * move, cx, cy, R * k * (1 - shrink * 0.5), 1, 1.4);
    }
    quads.filter(q => q.z <= 0).sort((a, b) => b.z - a.z).forEach(fillQ);
  }
  // labels ride the strips at first
  RIB.forEach((r, k) => {
    rise(ctx, t, r.n, 180, 434 + k * 120 - 56, { size: 24, w: 700, c: r.c, ls: 6 }, B(68) + 0.1 + k * 0.08, B(70.4));
  });
  rise(ctx, t, 'One app.', 120, 200, { size: 96, w: 700, c: C.mist, ls: -2 }, B(68), B(71));
  rise(ctx, t, 'Three forces.', 120, 310, { size: 96, w: 700, c: C.neon, ls: -2 }, B(69), B(71) + 0.05);
  // EAI -> AI
  if (t >= B(72)) {
    const k = spr(t, B(72), 16);
    const eOff = eIn(P(t, B(79), 0.35));
    const o = { size: 150, w: 800, ls: -4 };
    const we = TW(ctx, 'E', o), wa = TW(ctx, 'AI', o);
    const sz = lerp(1, 0.62, shrink);
    ctx.save(); ctx.translate(cx, cy + 52 * sz); ctx.scale(k * sz, k * sz);
    const left = lerp(-(we + wa) / 2, -wa / 2 - we, eOff);
    ctx.save(); ctx.beginPath(); ctx.rect(-600, -200, 1200, 260); ctx.clip();
    setT(ctx, o); ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.strokeStyle = C.night; ctx.strokeText('E', left, eOff * 220);
    T(ctx, 'E', left, 0 + eOff * 220, { ...o, c: C.mist });
    ctx.restore();
    ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.strokeStyle = C.night;
    if (shrink < 0.5) { setT(ctx, o); ctx.strokeText('AI', left + we, 0); }
    T(ctx, 'AI', left + we, 0, { ...o, c: mixC(C.mist, C.night, shrink) });
    ctx.restore();
  }
  rise(ctx, t, 'ONE INTELLIGENT EXPERIENCE', 960, 940, { size: 28, w: 700, c: C.leaf, align: 'center', ls: 10 }, B(73), B(78));
  {
    const o = { size: 60, w: 600 }, a = TW(ctx, 'A new kind of ', o), b = TW(ctx, 'ecosystem.', o);
    rise(ctx, t, 'A new kind of', 960 - (a + b) / 2, 150, { ...o, c: C.mist }, B(74), B(76));
    rise(ctx, t, 'ecosystem.', 960 - (a + b) / 2 + a, 150, { ...o, c: C.neon }, B(74) + 0.1, B(76) + 0.04);
  }
  rise(ctx, t, 'Experience, AI and value-added services', 960, 120, { size: 46, w: 500, c: C.fog, align: 'center' }, B(76), B(78));
  {
    const o = { size: 60, w: 600 }, a = TW(ctx, 'now come together ', o), b = TW(ctx, 'as one.', o);
    rise(ctx, t, 'now come together', 960 - (a + b) / 2, 200, { ...o, c: C.mist }, B(77), B(78));
    rise(ctx, t, 'as one.', 960 - (a + b) / 2 + a, 200, { ...o, c: C.neon }, B(77) + 0.1, B(78) + 0.04);
  }
});
