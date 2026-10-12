// ===== ACT V — STEP BY STEP, VISION, END TITLE =====
// --- Step by step: Core -> Beyond -> Ecosystem, built as concentric rings (real beats 123.4–136) ---
const RC = [1262, 578];
const SB = { core: 129, beyond: 131.5, eco: 134, sum: 136.5, out: 138.6 };
const PHASES = [
  { cap: 'PHASE 01 · CORE', title: ['Merge Mobile + Home'], sub: 'One identity, one bill, one AI assistant.' },
  { cap: 'PHASE 02 · BEYOND', title: ['Open up to partners'], sub: 'Mini-apps, content and AI-guided discovery.' },
  { cap: 'PHASE 03 · ECOSYSTEM', title: ['Build Salam-owned', 'platforms'], sub: 'First-party content and social engagement.' },
];
const BEYOND_IC = [[-125, 'Mosque01'], [-55, 'News01'], [0, 'PlayCircle'], [55, 'FootballIcon'], [125, 'GameController03'], [180, 'Headphones']];
const ECO_IC = [[-125, 'AiBrain01'], [-55, 'UserGroup'], [-166, 'FavouriteIcon'], [-14, 'CreditCard'], [152, 'DashboardSquare01'], [28, 'Analytics01'], [111, 'Shield01'], [69, 'BubbleChat']];
function callout(ctx, t, t0, t1, ex, ey, px, py, label) {
  const lp = eOut(P(t, t0, 0.35)), out = eIn(P(t, t1, 0.3));
  if (lp <= 0 || out >= 1) return;
  ctx.save(); ctx.translate(out * 60, 0);
  circ(ctx, ex, ey, 6 * (1 - out)); ctx.fillStyle = C.deep; ctx.fill();
  ctx.strokeStyle = C.deep; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(lerp(ex, px, lp), lerp(ey, py, lp)); ctx.stroke();
  const k = spr(t, t0 + 0.2, 17, 0.8) * (1 - out);
  if (k > 0.01) {
    const w = TW(ctx, label, { size: 22, w: 700 }) + 70;
    ctx.save(); ctx.translate(px, py); ctx.scale(k, k);
    shadowOn(ctx); rr(ctx, 0, -26, w, 52, 26); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
    circ(ctx, 28, 0, 6); ctx.fillStyle = C.green; ctx.fill();
    T(ctx, label, 46, 8, { size: 22, w: 700, c: C.deep });
    ctx.restore();
  }
  ctx.restore();
}
function iconTile(ctx, x, y, s, fill, stroke, ic, icCol) {
  rr(ctx, x - s / 2, y - s / 2, s, s, s * 0.26); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  icon(ctx, ic, x, y, s * 0.52, icCol, 1.15);
}
scene(107.4, 112.8, (ctx, t) => {
  bg(ctx, C.mist);
  dotGrid(ctx, '#D6E0D9', 1000);
  const [cx, cy] = RC;
  // dashed orbit guides
  const gp = eInOut(P(t, BV(128), 0.9));
  if (gp > 0) {
    ctx.save(); ctx.setLineDash([5, 8]); ctx.strokeStyle = '#C3D0C8'; ctx.lineWidth = 1.5;
    [560, 760, 980].forEach((r, i) => { ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(gp * 1.2 - i * 0.1)); ctx.stroke(); });
    ctx.restore();
  }
  // the hub's three phones drop out of frame on the downbeat
  if (t < BV(128.6)) PHONES3.forEach((ph, k) => {
    const d = eIn(P(t, BV(127.4) + k * 0.06, 0.45));
    if (d >= 1) return;
    phone(ctx, t, [[ph.s, 0]], ph.x, ph.y + d * 1100, ph.h * (1 - d * 0.2), { rot: ph.rot * (1 + d * 2), shadow: 0.6 });
  });
  // ring sizes
  const p1 = spr(t, BV(SB.core), 13, 0.86), p2 = spr(t, BV(SB.beyond), 12, 0.9), p3 = spr(t, BV(SB.eco), 12, 0.9);
  const pulse = (k) => 1 + 0.035 * Math.sin(Math.PI * P(t, BV(SB.sum + 1) + k * 0.12, 0.35));
  const coreR = lerp(lerp(295, 210, p2), 150, p3) * p1;
  const beyR = lerp(coreR, lerp(400, 288, p3), p2);
  const ecoR = lerp(beyR, 428, p3);
  if (p3 > 0.002) { circ(ctx, cx, cy, ecoR * pulse(2)); ctx.fillStyle = C.neon; ctx.fill(); }
  if (p2 > 0.002) { circ(ctx, cx, cy, beyR * pulse(1)); ctx.fillStyle = '#1B2421'; ctx.fill(); }
  if (p1 > 0.002) {
    circ(ctx, cx, cy, coreR * pulse(0)); ctx.fillStyle = C.stone; ctx.fill();
    ctx.strokeStyle = '#D4CAC6'; ctx.lineWidth = 2; ctx.stroke();
    const sc = coreR / 295;
    T(ctx, '01', cx, cy - 58 * sc, { size: 28 * sc, w: 600, c: '#8C8681', align: 'center', ls: 4 });
    T(ctx, 'Core', cx, cy + 26 * sc, { size: 78 * sc, w: 800, c: C.ink, align: 'center', ls: -2 });
    icon(ctx, 'SmartPhone01', cx - 34 * sc, cy + 92 * sc, 42 * sc, C.ink, 1.2);
    icon(ctx, 'Home01', cx + 34 * sc, cy + 92 * sc, 42 * sc, C.ink, 1.2);
  }
  // Beyond band: label, dotted track and six partner icons
  if (p2 > 0.05) {
    const rm = (coreR + beyR) / 2, sc = (beyR - coreR) / 190;
    ctx.save(); ctx.setLineDash([2, 6]); ctx.strokeStyle = '#3A4642'; ctx.lineWidth = 1.5; circ(ctx, cx, cy, rm); ctx.stroke(); ctx.restore();
    const lab = { size: 30 * sc, w: 800 }, wn = TW(ctx, '02 ', { ...lab, w: 600 }), wb = TW(ctx, 'BEYOND', lab);
    const ly = cy - rm + 10 * sc;
    T(ctx, '02', cx - (wn + wb) / 2, ly, { ...lab, w: 600, c: '#8A9692', size: 22 * sc, ls: 3 });
    T(ctx, 'BEYOND', cx - (wn + wb) / 2 + wn, ly, { ...lab, c: C.mist, ls: 1 });
    BEYOND_IC.forEach(([deg, ic], i) => {
      const k = spr(t, BV(SB.beyond + 0.5) + i * 0.08, 16, 0.8);
      if (k <= 0.01) return;
      const a = deg * D2R + 0.035 * (t - BV(SB.beyond));     // the band turns slowly
      ctx.save(); ctx.translate(cx + Math.cos(a) * rm, cy + Math.sin(a) * rm); ctx.scale(k, k);
      iconTile(ctx, 0, 0, 58 * sc, '#26312D', '#3C4844', ic, C.mist); ctx.restore();
    });
  }
  // Ecosystem band: label and eight white icon tiles
  if (p3 > 0.05) {
    const rm = (beyR + ecoR) / 2, sc = (ecoR - beyR) / 140;
    const lab = { size: 28 * sc, w: 800 }, wn = TW(ctx, '03 ', { ...lab, w: 600 }), wb = TW(ctx, 'ECOSYSTEM', lab);
    const ly = cy - rm + 10 * sc;
    T(ctx, '03', cx - (wn + wb) / 2, ly, { ...lab, w: 600, c: C.deep, size: 21 * sc, ls: 3 });
    T(ctx, 'ECOSYSTEM', cx - (wn + wb) / 2 + wn, ly, { ...lab, c: C.deep, ls: 1 });
    ECO_IC.forEach(([deg, ic], i) => {
      const k = spr(t, BV(SB.eco + 0.5) + i * 0.07, 16, 0.8);
      if (k <= 0.01) return;
      const a = deg * D2R - 0.035 * (t - BV(SB.eco));        // the other way
      ctx.save(); ctx.translate(cx + Math.cos(a) * rm, cy + Math.sin(a) * rm); ctx.scale(k, k);
      iconTile(ctx, 0, 0, 50 * sc, C.white, null, ic, C.deep); ctx.restore();
    });
  }
  // the orbit closes around all three
  const op = eInOut(P(t, BV(SB.sum + 0.3), 0.85));
  if (op > 0) {
    const r = ecoR + 30, a = -Math.PI / 2 + op * Math.PI * 2;
    ctx.strokeStyle = C.deep; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, a); ctx.stroke();
    circ(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 7); ctx.fillStyle = C.deep; ctx.fill();
  }
  // callouts
  const ca = (deg, r) => [cx + Math.cos(deg * D2R) * r, cy + Math.sin(deg * D2R) * r];
  { const [ex, ey] = ca(45, coreR); callout(ctx, t, BV(SB.core + 1), BV(SB.beyond) - 0.15, ex, ey, ex + 40, ey + 52, 'Unified account'); }
  { const [ex, ey] = ca(50, beyR); callout(ctx, t, BV(SB.beyond + 1.1), BV(SB.eco) - 0.15, ex, ey, ex + 36, ey + 46, 'AI-guided discovery'); }
  { const [ex, ey] = ca(50, ecoR); callout(ctx, t, BV(SB.eco + 1.1), BV(SB.out) - 0.2, ex, ey, ex - 120, ey + 52, 'Social & first-party content'); }

  // left column: header, title, phase text, stepper
  rise(ctx, t, 'THE PLAN · STEP BY STEP', 96, 104, { size: 18, w: 700, c: C.deep, ls: 5 }, BV(127.8));
  { const k = eOut(P(t, BV(127.8), 0.45)); if (k > 0) wordLetters(ctx, 1825 - WORD_W(22), 106, 22, C.deep, [0, 1, 2, 3, 4].map(i => eOut(P(t, BV(127.8) + i * 0.04, 0.4)))); }
  rise(ctx, t, 'BECOME A SUPERAPP', 96, 170, { size: 18, w: 700, c: C.green, ls: 6 }, BV(128));
  const ti = { size: 78, w: 800, ls: -2.5 };
  rise(ctx, t, 'Step by Step', 96, 254, { ...ti, c: C.deep }, BV(128) + 0.08, BV(SB.sum) - 0.06);
  rise(ctx, t, 'Approach', 96, 338, { ...ti, c: C.leaf }, BV(128) + 0.16, BV(SB.sum) + 0.02);
  {
    // "Core -> Beyond ->" / "Ecosystem"
    const parts = ['Core', '>', 'Beyond', '>'];
    let x = 96;
    parts.forEach((p, i) => {
      if (p === '>') {
        const k = spr(t, BV(SB.sum) + 0.24 + i * 0.06, 16, 0.8) * (1 - eIn(P(t, BV(SB.out), 0.3)));
        if (k > 0.01) icon(ctx, 'ArrowRight02', x + 30, 228, 62 * k, C.deep, 1.5);
        x += 66;
      } else { rise(ctx, t, p, x, 254, { ...ti, c: C.deep }, BV(SB.sum) + 0.24 + i * 0.06); x += TW(ctx, p, ti) + 14; }
    });
    rise(ctx, t, 'Ecosystem', 96, 338, { ...ti, c: C.leaf }, BV(SB.sum) + 0.45);
  }
  [SB.core, SB.beyond, SB.eco].forEach((t0, i) => {
    const t1 = i < 2 ? [SB.beyond, SB.eco][i] : 1e6, ph = PHASES[i];
    // each phase enters only after the previous one has left its mask
    const tin = BV(t0) + (i > 0 ? 0.26 : 0), tout = BV(t1) - 0.06;
    rise(ctx, t, ph.cap, 96, 478, { size: 18, w: 700, c: C.green, ls: 5 }, tin, tout);
    ph.title.forEach((line, j) => rise(ctx, t, line, 96, 544 + j * 58, { size: 50, w: 800, c: C.deep, ls: -1.5 }, tin + 0.08 + j * 0.05, tout + 0.03));
    rise(ctx, t, ph.sub, 96, 596 + (ph.title.length - 1) * 58, { size: 26, w: 500, c: '#5B6B66' }, tin + 0.18, tout + 0.06);
  });
  const NX = [116, 353, 590], NY = 786;
  const stepOn = i => spr(t, BV([SB.core, SB.beyond, SB.eco][i]), 17, 0.8);
  if (t >= BV(128.3)) {
    ctx.strokeStyle = '#C9D5CD'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(NX[0], NY); ctx.lineTo(NX[0] + (NX[2] - NX[0]) * eOut(P(t, BV(128.3), 0.6)), NY); ctx.stroke();
    const prog = clamp(eOut(P(t, BV(SB.beyond), 0.6)) * 0.5 + eOut(P(t, BV(SB.eco), 0.6)) * 0.5);
    if (prog > 0) { ctx.strokeStyle = C.green; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(NX[0], NY); ctx.lineTo(NX[0] + (NX[2] - NX[0]) * prog, NY); ctx.stroke(); }
    ['Core', 'Beyond', 'Ecosystem'].forEach((n, i) => {
      const k = spr(t, BV(128.3) + i * 0.08, 17, 0.8), on = stepOn(i);
      if (k <= 0.01) return;
      ctx.save(); ctx.translate(NX[i], NY); ctx.scale(k, k);
      circ(ctx, 0, 0, 20); ctx.fillStyle = mixC(C.mist, C.green, clamp(on)); ctx.fill();
      ctx.strokeStyle = mixC('#BFCCC4', C.green, clamp(on)); ctx.lineWidth = 2; ctx.stroke();
      T(ctx, '0' + (i + 1), 0, 6, { size: 15, w: 700, c: mixC('#7C8B86', C.white, clamp(on)), align: 'center' });
      ctx.restore();
      T(ctx, n, NX[i], NY + 42, { size: 18, w: 600, c: mixC('#8A9692', C.deep, clamp(on)), align: 'center' });
    });
  }
  // progress bar along the bottom
  {
    const prog = 0.04 + 0.29 * eOut(P(t, BV(SB.core), 0.6)) + 0.29 * eOut(P(t, BV(SB.beyond), 0.6)) + 0.29 * eOut(P(t, BV(SB.eco), 0.6)) + 0.09 * eOut(P(t, BV(SB.sum), 0.6));
    ctx.fillStyle = '#DCE5DE'; ctx.fillRect(72, 1050, 1776, 3);
    ctx.fillStyle = C.green; ctx.fillRect(72, 1050, 1776 * prog * eOut(P(t, BV(128), 0.5)), 3);
  }
  // a deep green disc opens from the rings into the next scene
  const dg = eIn(P(crispT(t), BV(SB.out), BV(1)));
  if (dg > 0) { circ(ctx, cx, cy, lerp(ecoR + 30, 2300, dg)); ctx.fillStyle = C.deep; ctx.fill(); }
});

// --- Beyond Telco. Closer to Life. / Everyday moments with real Salam customers (beats 112–121) ---
const MOMENTS = [['Mobile', 'SmartPhone01'], ['Home', 'Home01'], ['Travel', 'Airplane01'], ['Entertainment', 'PlayCircle'], ['Wellbeing', 'Yoga01'], ['Deals', 'DiscountTag01'], ['Faith', 'Mosque01']];
const ARC = { cx: 960, cy: 1180, R: 780, a0: 205 * Math.PI / 180, a1: 335 * Math.PI / 180 };
const momentPos = i => { const a = lerp(ARC.a0, ARC.a1, i / 6); return [ARC.cx + Math.cos(a) * ARC.R, ARC.cy + Math.sin(a) * ARC.R]; };
scene(111.6, 121.4, (ctx, t) => {
  if (t >= B(112)) bg(ctx, C.deep);
  if (t < B(112)) return;
  // Beyond Telco: a real customer, on a mist card
  {
    const k = spr(t, B(112) + 0.15, 14, 0.86), out = eIn(P(t, B(114), 0.4));
    if (k > 0.01 && out < 1) {
      const cy = lerp(1500, 560, k) - out * 1300;
      ctx.save();
      rr(ctx, 1220, cy - 440, 600, 880, 52); ctx.fillStyle = C.mist; ctx.fill(); ctx.clip();
      pic(ctx, 'p_friends', 1520, cy + 120 + (1 - k) * 160, 1130 * (1 + 0.06 * P(t, B(112), B(2))));
      ctx.restore();
    }
  }
  const o = { size: 160, w: 800, ls: -6 };
  rise(ctx, t, 'Beyond Telco.', 110, 470, { ...o, c: C.mist }, B(112), B(114));
  rise(ctx, t, 'Closer to Life.', 110, 670, { ...o, c: C.leaf }, B(113), B(114) + 0.05);
  // everyday moments, light themed: Mist rises from the arc like a sunrise
  const sun = eIn(P(crispT(t), B(114) - 0.3, 0.5));
  if (sun > 0) { circ(ctx, ARC.cx, ARC.cy, lerp(0, 2400, sun)); ctx.fillStyle = C.mist; ctx.fill(); }
  const toDots = eInOut(P(t, B(120), B(0.9)));
  {
    const k = spr(t, B(114) + 0.25, 14, 0.86), out = eIn(P(t, B(120), 0.4));
    if (k > 0.01 && out < 1) {
      const cy = lerp(1500, 790, k) + out * 900;
      // the cutout sits straight on the scene, with no card behind it; its lower half runs off the bottom of the frame
      pic(ctx, 'p_beanbag', 960, cy + 290, 540 * (1 + 0.06 * P(t, B(114), B(6))));
    }
  }
  const ap = eInOut(P(t, B(114) + 0.28, B(1.6)));
  if (ap > 0 && toDots < 1) {
    ctx.strokeStyle = '#BCD5C3'; ctx.lineWidth = 3; ctx.beginPath();
    ctx.arc(ARC.cx, ARC.cy, ARC.R, ARC.a0 - 0.12, lerp(ARC.a0 - 0.12, ARC.a1 + 0.12, ap * (1 - toDots))); ctx.stroke();
  }
  MOMENTS.forEach(([m, ic], i) => {
    const t0 = B(114) + 0.28 + B(1.6) * (i / 6) * 0.8;
    const k = spr(t, t0, 16) * (1 - eIn(P(t, B(120), 0.3)));
    if (k <= 0.001) return;
    const [x, y] = momentPos(i);
    const lit = B(116 + Math.floor(i / 2)) + (i % 2) * 0.15;
    const lp = spr(t, lit, 18);
    const pop = 1 + 0.12 * (t > lit ? Math.max(0, 1 - (t - lit) * 4) : 0);
    shadowOn(ctx, 0.35); circ(ctx, x, y, 62 * k * pop); ctx.fillStyle = mixC(C.white, C.green, clamp(lp)); ctx.fill(); shadowOff(ctx);
    if (t <= lit) { ctx.strokeStyle = '#CFE0D3'; ctx.lineWidth = 2; ctx.stroke(); }
    icon(ctx, ic, x, y, 54 * k, t > lit ? C.white : C.deep, 1.1);
    rise(ctx, t, m, x, y - 84, { size: 24, w: 600, c: C.deep, align: 'center' }, t0 + 0.1, B(120));
  });
  rise(ctx, t, 'Everyday moments.', 960, 150, { size: 84, w: 700, c: C.deep, align: 'center', ls: -2 }, B(116), B(120));
  rise(ctx, t, 'All in one place.', 960, 250, { size: 84, w: 700, c: C.green, align: 'center', ls: -2 }, B(119), B(120) + 0.05);
});

// --- 30 days light up, then fold into the Salam logo, the end title, and back to the icon (beats 120–134) ---
const GRIDC = { x0: 660, y0: 320, sp: 120, r: 36 };
const dayPos = d => [GRIDC.x0 + (d % 6) * GRIDC.sp, GRIDC.y0 + Math.floor(d / 6) * GRIDC.sp];
const DAY_T = (() => {
  const counts = [[121, 1], [122, 3], [123, 7], [124, 12], [125, 18], [126, 24], [127, 29], [128, 30]];
  const out = []; let prev = 0;
  counts.forEach(([b, n]) => { const m = n - prev; for (let i = 0; i < m; i++) out.push(B(b) + B(1) * i / m); prev = n; });
  return out;
})();
// --- 30 days light up, then the end card (reference: icons orbit, spiral in, the wordmark, the line) ---
const OC = [960, 452];                       // end card centre
const DAY_IC = ['BubbleChat', 'Tv01', 'CreditCard', 'GameController03', 'ShoppingBag01', 'Headphones', 'Airplane01', 'Home01', 'Mosque01', 'News01',
  'FootballIcon', 'Restaurant01', 'HealthIcon', 'DiscountTag01', 'PlayCircle', 'Wallet01', 'SmartPhone01', 'Yoga01', 'Gift', 'UserGroup',
  'Video01', 'Store01', 'Wifi01', 'Location01', 'Calendar03', 'FavouriteIcon', 'Search01', 'Mic01', 'Notification01', 'SparklesIcon'];
const UNLIT = '#0F5A4F';
scene(120, 134.01, (ctx, t) => {
  // deep green returns as a disc opening from the month (crisp edge, never a crossfade)
  const dusk = eIn(P(crispT(t), B(120), 0.55));
  if (dusk < 1) { bg(ctx, C.mist); circ(ctx, 960, 560, lerp(0, 1300, dusk)); ctx.fillStyle = C.deep; ctx.fill(); }
  else bg(ctx, C.deep);
  if (dusk >= 1) dotGrid(ctx, '#0A4339', 900);
  const punch = t >= B(128) ? spr(t, B(128), 14, 0.7) * (1 - eInOut(P(t, BV(156.5), BV(0.6)))) : 0;
  const lit = DAY_T.filter(x => t >= x).length;
  // the end card's concentric guides draw themselves as the days lift off the grid
  const gp = eInOut(P(t, BV(156.5), 0.9)), endOut = eIn(P(crispT(t), BV(164.7), 0.6));
  if (gp > 0) {
    ctx.strokeStyle = '#0E4D43'; ctx.lineWidth = 1.5;
    [240, 450, 690, 930].forEach((r, i) => {
      const rp = r + 14 * Math.sin(Math.PI * P(t, BV(163) + i * 0.1, 0.5));
      ctx.beginPath(); ctx.arc(OC[0], OC[1], rp, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(gp * 1.3 - i * 0.1)); ctx.stroke();
    });
  }
  // small moments keep orbiting the guides while the end title reads
  const ok = eOut(P(t, BV(160), 0.6)) * (1 - endOut);
  if (ok > 0) [[450, 0.32, 0.2], [690, -0.21, 2.1], [930, 0.15, 4.0]].forEach(([r, w, ph]) => {
    const a = ph + w * (t - BV(160));
    circ(ctx, OC[0] + Math.cos(a) * r, OC[1] + Math.sin(a) * r, 6 * ok); ctx.fillStyle = C.neon; ctx.fill();
  });
  // the 30 days: grid -> lit -> icon tiles on an orbit -> spiral into the wordmark
  for (let d = 0; d < 30; d++) {
    const src = momentPos(Math.min(6, Math.floor(d * 7 / 30)));
    const gpos = dayPos(d);
    const form = eInOut(P(t, B(120) + d * 0.008, B(0.9)));
    let x = lerp(src[0], gpos[0], form), y = lerp(src[1], gpos[1], form);
    const lt = DAY_T[d], on = t >= lt;
    const pop = on ? 1 + 0.25 * Math.max(0, 1 - (t - lt) * 5) : 1;
    x += (x - 960) * punch * 0.22; y += (y - 560) * punch * 0.22;
    let size = lerp(40, GRIDC.r * 2, form) * pop;
    // to the orbit
    const m = clamp(spr(t, BV(156.4) + d * 0.012, 7, 0.92));
    const sp = eIn(P(t, BV(157.6) + d * 0.018, 1.05));
    const orbit = 0.18 * Math.max(0, t - BV(156.6)) + 2.4 * sp;
    const th = -Math.PI / 2 + d / 30 * Math.PI * 2 + orbit, R = 400 * (1 - sp);
    x = lerp(x, OC[0] + Math.cos(th) * R, m); y = lerp(y, OC[1] + Math.sin(th) * R, m);
    size = lerp(size, 52, m) * (1 - sp * sp);
    if (size < 0.5) continue;
    const corner = lerp(size / 2, size * 0.26, m);
    rr(ctx, x - size / 2, y - size / 2, size, size, corner);
    ctx.fillStyle = m > 0 ? mixC(C.neon, '#0C4A40', m) : on ? C.neon : UNLIT; ctx.fill();
    if (m > 0.3) { ctx.strokeStyle = mixC(C.neon, '#1E6C5F', m); ctx.lineWidth = 1.5; ctx.stroke(); }
    const ik = clamp((m - 0.45) * 2);
    if (ik > 0) icon(ctx, DAY_IC[d], x, y, size * 0.5 * ik, C.mist, 1.1);
  }
  // day counter and the "once a month" callback
  if (t < B(128.6)) {
    rise(ctx, t, 'DAY', 220, 420, { size: 30, w: 700, c: C.leaf, ls: 10 }, B(120.6), B(128));
    rise(ctx, t, String(Math.max(1, lit)).padStart(2, '0'), 210, 600, { size: 190, w: 800, c: C.mist, ls: -8 }, B(120.8), B(128) + 0.05);
    rise(ctx, t, 'once a month', 1730, 470, { size: 50, w: 600, c: C.fog, align: 'right' }, B(121), B(128));
    const so = eIn(P(t, B(128), 0.3)), spk = eOut(P(t, B(124), 0.4));
    if (spk > 0 && so < 1) { const w = TW(ctx, 'once a month', { size: 50, w: 600 }); ctx.fillStyle = C.neon; ctx.fillRect(1730 - w - 8, 452 - so * 80, (w + 16) * spk, 7); }
    rise(ctx, t, 'every', 1730, 620, { size: 110, w: 800, c: C.neon, align: 'right', ls: -4 }, B(126), B(128) + 0.05);
    rise(ctx, t, 'day.', 1730, 730, { size: 110, w: 800, c: C.neon, align: 'right', ls: -4 }, B(126) + 0.3, B(128) + 0.1);
  }
  // the night disc that returns us to the first frame
  if (endOut > 0) { circ(ctx, OC[0], 500, lerp(0, 1300, endOut)); ctx.fillStyle = C.night; ctx.fill(); }
  // the wordmark: letters rise as the tiles arrive, breathe gently, then shrink into the app icon's label
  {
    const toLabel = eInOut(P(t, BV(164.6), 0.75));
    const breathe = 1 + 0.02 * eInOut(P(t, BV(160), BV(4)));
    const h = lerp(96 * breathe, 30, toLabel), y = lerp(OC[1] + 48, 660, toLabel);
    const rv = [0, 1, 2, 3, 4].map(i => eOut(P(t, BV(159) + i * 0.07, 0.45)));
    if (rv[0] > 0) wordLetters(ctx, 960 - WORD_W(h) / 2, y, h, mixC(C.mist, C.dim, toLabel), rv);
  }
  // the 3D glass Salam mark turns in above the wordmark, floats, then shrinks away before the app icon returns
  {
    const k = spr(t, BV(158.7), 13, 0.85) * (1 - eIn(P(t, BV(164.35), 0.3)));
    if (k > 0.01) {
      const turn = 1 - eOut(P(t, BV(158.7), 0.9)), fl = Math.sin((t - BV(158.7)) * 1.6) * 6;
      ctx.save(); ctx.translate(960, 300 + fl + (1 - k) * 40); ctx.scale(k * Math.cos(turn * 1.2), k);
      glass(ctx, 0, 0, 150);
      ctx.restore();
    }
  }
  // "Making [the joy of technology]" / "accessible for everyone, everyday."
  {
    const o = { size: 54, w: 500 }, ob = { size: 54, w: 700 };
    const wm = TW(ctx, 'Making ', o), wj = TW(ctx, 'the joy of technology', ob);
    const x0 = 960 - (wm + 20 + wj) / 2, xj = x0 + wm + 20, y1 = 664, y2 = 738;
    rise(ctx, t, 'Making', x0, y1, { ...o, c: C.mist }, BV(160), BV(164.4));
    rise(ctx, t, 'the joy of technology', xj, y1, { ...ob, c: C.mist }, BV(160) + 0.15, BV(164.4) + 0.03);
    // the highlight sweeps in on the off-beat and the type turns deep green inside it
    const hp = eOut(P(t, BV(160.5), 0.42)), ho = eIn(P(t, BV(164.4), 0.3));
    if (hp > 0 && ho < 1) {
      const hx = xj - 14, hw = (wj + 28) * hp, hy = y1 - 50 - ho * 90;
      ctx.save(); ctx.beginPath(); ctx.rect(0, y1 - 62, W, 84); ctx.clip();
      rr(ctx, hx, hy, hw, 68, 12); ctx.fillStyle = C.neon; ctx.fill();
      ctx.beginPath(); ctx.rect(hx, hy, hw, 68); ctx.clip();
      T(ctx, 'the joy of technology', xj, y1 - ho * 90, { ...ob, c: C.deep });
      ctx.restore();
    }
    rise(ctx, t, 'accessible for everyone, everyday.', 960, y2, { ...o, c: '#D6E2DC', align: 'center' }, BV(161.25), BV(164.45));
    {
      // "everyday." gets underlined on the beat after it lands
      const w1 = TW(ctx, 'accessible for everyone, ', o), w2 = TW(ctx, 'everyday.', o), x = 960 - (w1 + w2) / 2 + w1;
      const up = eOut(P(t, BV(162.5), 0.4)), uo = eIn(P(t, BV(164.45), 0.3));
      if (up > 0 && uo < 1) { ctx.fillStyle = C.neon; ctx.fillRect(x, y2 + 14 + uo * 120, (w2 - 10) * up, 6); }
    }
    rise(ctx, t, 'BEYOND TELCO · CLOSER TO LIFE', 960, 826, { size: 20, w: 700, c: C.fog, align: 'center', ls: 7 }, BV(162), BV(164.5));
  }
  // the progress line along the bottom completes with the film (as in the reference end card)
  if (t >= BV(156.6) && endOut < 1) {
    const pg = eOut(P(t, BV(156.6), 0.6)), fill = 0.06 + 0.94 * eInOut(P(t, BV(157), BV(7.4)));
    ctx.fillStyle = '#0E4D43'; ctx.fillRect(72, 1050, 1776 * pg, 3);
    ctx.fillStyle = C.neon; ctx.fillRect(72, 1050, 1776 * pg * fill, 3);
  }
  // the app icon returns: last frame == first frame
  {
    const k = spr(t, BV(164.9), 15, 0.86);
    if (k > 0.01) appIcon(ctx, 960, 500, 200 * k, 0);
  }
});
