// ===== ACT IV — DATA & UI (bars 21–27, beats 80–107) =====
const WHEEL_C = [975, 560];
const WH = { cx: WHEEL_C[0], cy: WHEEL_C[1], r0: 160, r1: 312, core: 150, ring: 125 };
const DOMAINS = ['Connectivity', 'Faith', 'News & Content', 'Sports & Fantasy', 'Gaming', 'Ecommerce', 'Food & Festivals', 'Travel', 'Health & Wellbeing', 'Fintech & Pay'];
const CAPS = ['Identity', 'Wallet & Billing', 'Personalisation Engine', 'Gamification', 'Martech & Data Stack', 'Product + Tech Ops', 'Mini-Apps Platform', 'Partnerships', 'Customer Support', 'Design System & UX'];
const SEGN = 20, SG = 0.013;
const WHEEL_GREEN = mixC(C.neon, C.green, 0.2);
function segAngles(i) {
  const up = i < 10, j = up ? i : i - 10;
  const a = up ? Math.PI : 0;   // domains over the top, capabilities under the bottom, both read left to right like the deck
  return [a + j * Math.PI / 10 + SG, a + (j + 1) * Math.PI / 10 - SG];
}
function wheelRot(t) { return 7 * eIn(P(t, B(86), B(1))); }
let _WC = null;
function wheelCache() {
  if (_WC) return _WC;
  const segs = [];
  for (let i = 0; i < SEGN; i++) {
    const [a0, a1] = segAngles(i);
    const src = sectorPts(WH.cx, WH.cy, WH.r0, WH.r1, a0, a1, 80);
    segs.push({ src, cell: align(src, rectPts(160 + i * 80, 850, 76, 14, 80)) });
  }
  return (_WC = segs);
}
// diagonal hatch inside a path (the "behind the scenes" texture)
function hatch(ctx, pathFn, col, gap = 9) {
  ctx.save(); pathFn(); ctx.clip();
  ctx.strokeStyle = col; ctx.lineWidth = 1.3; ctx.beginPath();
  for (let x = -H; x < W; x += gap) { ctx.moveTo(x, H); ctx.lineTo(x + H, 0); }
  ctx.stroke(); ctx.restore();
}
function arrowGlyph(ctx, x, y, up, col) {
  ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  const d = up ? 1 : -1;   // head at y - 7d: up points up
  ctx.moveTo(x, y + 7 * d); ctx.lineTo(x, y - 7 * d); ctx.moveTo(x - 5, y - 2 * d); ctx.lineTo(x, y - 7 * d); ctx.lineTo(x + 5, y - 2 * d); ctx.stroke();
}
function arrowSide(ctx, x, y, d, col) {   // a short horizontal arrow; d = 1 points right, -1 left
  ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  ctx.moveTo(x - 7 * d, y); ctx.lineTo(x + 7 * d, y); ctx.moveTo(x + 2 * d, y - 5); ctx.lineTo(x + 7 * d, y); ctx.lineTo(x + 2 * d, y + 5); ctx.stroke();
}
// faint dot grid, stronger towards the right edge (texture, not light)
function dotGrid(ctx, col, x0 = 700, sp = 34) {
  ctx.fillStyle = col;
  const drift = (FRAME_T * 9) % sp;                    // the texture drifts slowly left: nothing is ever static
  for (let x = x0 + sp - drift; x < W; x += sp) {
    const r = 0.5 + 1.1 * (x - x0) / (W - x0);
    for (let y = 18; y < H; y += sp) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  }
}
// a photo cropped to fill a box, centred on focus (0..1 across the source), drawn faintly as a backdrop
function coverPic(ctx, name, x, y, w, h, focus, a) {
  const im = IMG[name]; if (!im || a <= 0) return;
  const s = Math.max(w / im.width, h / im.height), sw = w / s, sh = h / s;
  const sx = clamp(focus * im.width - sw / 2, 0, im.width - sw), sy = (im.height - sh) / 2;
  ctx.globalAlpha = a; ctx.drawImage(im, sx, sy, sw, sh, x, y, w, h); ctx.globalAlpha = 1;
}
const segFill = (t, i) => {
  const up = i < 10, j = up ? i : i - 10;
  return eOut(P(t, B(up ? 81 : 82) + j * 0.075, 0.38));
};
const PULSES = [[83, [2, 7, 13]], [84, [5, 11, 17]], [85, [0, 9, 15, 19]]];   // spoke boundaries that light on each beat

scene(80, 88.2, (ctx, t) => {
  bg(ctx, C.night);
  const segs = wheelCache();
  const rot = wheelRot(t);
  const unroll = eInOut(P(t, B(86.25), B(0.75)));
  const open = eInOut(P(crispT(t), B(87), B(0.95)));
  const out = eIn(P(t, B(86), 0.35));
  // behind-the-scenes band and the divider
  const dv = eInOut(P(t, B(80.25), 0.55)) * (1 - out);
  // day left of the hub, night right of it: the day sky opens leftward out of the divider, the night half fills with stars
  const day = dv, dc = (n, d) => mixC(n, d, day);
  dotGrid(ctx, '#0D2420');
  if (dv > 0) {
    const left = WH.cx * (1 - dv);
    ctx.save(); ctx.beginPath(); ctx.rect(left, 0, WH.cx - left, H); ctx.clip();
    ctx.fillStyle = C.mist; ctx.fillRect(left, 0, WH.cx - left, H);
    coverPic(ctx, 'bg_riyadh_day', 0, 0, WH.cx, H, 0.6, 0.16);   // Riyadh by day, barely there
    dotGrid(ctx, '#DCE5DE', 0);
    // the sun, bottom left of the day half
    const sk = spr(t, B(81.3), 14, 0.85) * (1 - out);
    if (sk > 0.01) {
      ctx.save(); ctx.translate(240, 850); ctx.rotate((t - B(80)) * 0.15); ctx.scale(sk, sk);
      circ(ctx, 0, 0, 30); ctx.fillStyle = C.neon; ctx.fill();
      ctx.strokeStyle = C.green; ctx.lineWidth = 5; ctx.lineCap = 'round';
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 44, Math.sin(a) * 44); ctx.lineTo(Math.cos(a) * 58, Math.sin(a) * 58); ctx.stroke(); }
      ctx.restore();
    }
    ctx.restore();
    // stars and a crescent moon in the night half
    ctx.save(); ctx.beginPath(); ctx.rect(WH.cx, 0, (W - WH.cx) * dv, H); ctx.clip();
    coverPic(ctx, 'bg_riyadh_night', WH.cx, 0, W - WH.cx, H, 0.62, 0.3);   // Riyadh by night
    for (let k = 0; k < 90; k++) {
      const x = WH.cx + 24 + (k * 337.7 + 61) % (W - WH.cx - 40), y = 24 + (k * 151.3 + 17) % (H - 48);
      const tw = 0.55 + 0.45 * Math.sin(t * (1.3 + (k % 5) * 0.37) + k * 2.1);
      circ(ctx, x, y, (k % 7 === 0 ? 2.2 : 1.3) * tw); ctx.fillStyle = mixC(C.night, C.mist, 0.35 + 0.5 * tw); ctx.fill();
    }
    const mk = spr(t, B(82.3), 14, 0.85) * (1 - out);
    if (mk > 0.01) {
      ctx.save(); ctx.translate(1760, 360); ctx.scale(mk, mk); ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2); ctx.arc(14, -10, 28, 0, Math.PI * 2, true); ctx.fillStyle = C.mist; ctx.fill('evenodd');
      ctx.restore();
    }
    ctx.restore();
    ctx.fillStyle = '#22322E'; ctx.fillRect(WH.cx - 1, 60, 2, 960 * dv);
  }
  // core: dark disc, neon ring, dotted inner circle; the neon disc from EAI hollows out into the ring
  const coreK = 1 - eIn(P(t, B(86), 0.4));
  if (coreK > 0) {
    circ(ctx, WH.cx, WH.cy, lerp(WH.ring, WH.core, eOut(P(t, B(80), 0.5))) * coreK); ctx.fillStyle = '#0A1A17'; ctx.fill();
    const hollow = eInOut(P(t, B(80), 0.42));
    const rIn = (WH.ring - 3) * hollow * coreK, rOut = WH.ring * coreK;
    ctx.beginPath(); ctx.arc(WH.cx, WH.cy, rOut, 0, Math.PI * 2); ctx.arc(WH.cx, WH.cy, rIn, 0, Math.PI * 2, true); ctx.fillStyle = C.neon; ctx.fill('evenodd');
    const dots = eOut(P(t, B(80.3), 0.6));
    for (let k = 0; k < 60 * dots; k++) { const a = -Math.PI / 2 + k / 60 * Math.PI * 2; circ(ctx, WH.cx + Math.cos(a) * 104 * coreK, WH.cy + Math.sin(a) * 104 * coreK, 1.5); ctx.fillStyle = '#1E3A33'; ctx.fill(); }
    const o = { size: 104 * coreK, w: 800, ls: -3, align: 'center' };
    ctx.save(); circ(ctx, WH.cx, WH.cy, rIn); ctx.clip(); T(ctx, 'AI', WH.cx, WH.cy + 37 * coreK, { ...o, c: C.neon }); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.arc(WH.cx, WH.cy, rOut + 200, 0, Math.PI * 2); ctx.arc(WH.cx, WH.cy, rIn, 0, Math.PI * 2, true); ctx.clip('evenodd');
    ctx.beginPath(); ctx.arc(WH.cx, WH.cy, rOut, 0, Math.PI * 2); ctx.clip(); T(ctx, 'AI', WH.cx, WH.cy + 37 * coreK, { ...o, c: C.night }); ctx.restore();
  }
  // segments
  segs.forEach((g, i) => {
    const up = i < 10, j = up ? i : i - 10;
    const k = spr(t, B(80.4) + j * 0.02 + (up ? 0 : 0.1), 16, 0.85);
    if (k <= 0.001) return;
    const [a0, a1] = segAngles(i);
    const rOut = lerp(WH.r0 + 2, WH.r1, k);
    const fill = segFill(t, i);
    if (unroll > 0 || open > 0) {
      let pts = mixPts(rotPts(g.src, WH.cx, WH.cy, rot), g.cell, unroll);
      if (open > 0) {
        const x0 = 160 + i * 80, left = i === 0 ? lerp(x0, 0, open) : x0, right = i === 19 ? lerp(x0 + 76, W, open) : x0 + lerp(76, 80, open);
        pts = rectPts(left, lerp(850, -2, open), right - left, lerp(14, H + 4, open), 80);
      }
      poly(ctx, pts); ctx.fillStyle = mixC(up ? WHEEL_GREEN : '#1A2925', C.mist, unroll); ctx.fill();
      return;
    }
    const base = () => { ctx.beginPath(); poly(ctx, sectorPts(WH.cx, WH.cy, WH.r0, rOut, a0 + rot, a1 + rot, 60)); };
    base(); ctx.fillStyle = up ? dc('#13221F', '#DCE5DE') : '#0F1C19'; ctx.fill();
    if (fill > 0) {
      const rf = lerp(WH.r0, rOut, fill);
      const fp = () => poly(ctx, sectorPts(WH.cx, WH.cy, WH.r0, rf, a0 + rot, a1 + rot, 60));
      if (up) { fp(); ctx.fillStyle = WHEEL_GREEN; ctx.fill(); }
      else {
        fp(); ctx.fillStyle = '#16231F'; ctx.fill();
        hatch(ctx, fp, '#41544F');
        base(); ctx.strokeStyle = mixC('#0F1C19', '#4E605B', fill); ctx.lineWidth = 1.4; ctx.stroke();
      }
    }
    // labels outside the ring: grey until their segment comes alive
    const am = (a0 + a1) / 2 + rot, ra = WH.r1 + 24;
    const lx = WH.cx + Math.cos(am) * ra, ly = WH.cy + Math.sin(am) * ra + 7 + Math.sin(am) * 12;
    const al = Math.cos(am) < -0.02 ? 'right' : Math.cos(am) > 0.02 ? 'left' : 'center';   // near-vertical pairs split apart
    const name = up ? DOMAINS[j] : CAPS[j], onDay = lx < WH.cx;   // ink on the day half, white on the night half
    const lc = onDay ? mixC(dc('#41524E', '#9AA6A2'), dc(C.mist, C.deep), clamp(fill * 2)) : mixC('#41524E', C.mist, clamp(fill * 2));
    rise(ctx, t, name, lx, ly, { size: 21, w: 600, c: lc, align: al }, B(80.45) + j * 0.02 + (up ? 0 : 0.1), B(86));
  });
  // light pulses run from the core outward along the spokes
  if (unroll <= 0) PULSES.forEach(([n, list]) => list.forEach((sp, q) => {
    const p = P(t, B(n) + q * 0.06, 0.45); if (p <= 0 || p >= 1) return;
    const a = (sp < 10 ? Math.PI : 0) + (sp % 10) * Math.PI / 10 + rot;
    const r0 = lerp(WH.r0, WH.r1, eIn(p)), r1 = lerp(WH.r0, WH.r1, eOut(p));
    ctx.strokeStyle = C.white; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(WH.cx + Math.cos(a) * r0, WH.cy + Math.sin(a) * r0); ctx.lineTo(WH.cx + Math.cos(a) * r1, WH.cy + Math.sin(a) * r1); ctx.stroke();
  }));
  // headline (top right, night side); customer domains top left (day), internal capabilities bottom right (night)
  {
    const o = { size: 54, w: 700, ls: -1.5 }, wa = TW(ctx, 'AI ', o), wb = TW(ctx, 'cross-cuts every', o);
    rise(ctx, t, 'AI', 1810 - wb - wa, 112, { ...o, c: C.neon }, B(80.5), B(86));
    rise(ctx, t, 'cross-cuts every', 1810 - wb, 112, { ...o, c: C.mist }, B(80.5) + 0.06, B(86));
    rise(ctx, t, 'capability.', 1810, 172, { ...o, c: C.mist, align: 'right' }, B(80.5) + 0.14, B(86) + 0.04);
  }
  const block = (x, y, t0, cap, title, sub, capCol, mark, lit) => {
    const k = spr(t, t0, 16, 0.85) * (1 - out);
    if (k > 0.01) { ctx.save(); ctx.translate(x + 9, y - 7); ctx.scale(k, k); mark(); ctx.restore(); }
    rise(ctx, t, cap, x + 30, y, { size: 17, w: 700, c: capCol, ls: 5 }, t0, B(86));
    rise(ctx, t, title, x, y + 62, { size: 40, w: 700, c: lit ? dc(C.mist, C.deep) : C.mist, ls: -1 }, t0 + 0.08, B(86) + 0.03);
    rise(ctx, t, sub, x, y + 104, { size: 22, w: 500, c: lit ? dc(C.fog, '#5B6B66') : C.fog }, t0 + 0.16, B(86) + 0.06);
  };
  block(110, 252, B(81), 'CUSTOMER DOMAINS', 'What customers use', '10 everyday services, front of house', dc(C.neon, C.green), () => { rr(ctx, -9, -9, 18, 18, 4); ctx.fillStyle = dc(C.neon, C.green); ctx.fill(); }, true);
  block(1440, 905, B(82), 'INTERNAL CAPABILITIES', 'What powers it', '10 shared platforms, behind the scenes', '#8FA39E', () => {
    rr(ctx, -9, -9, 18, 18, 3); ctx.strokeStyle = '#8FA39E'; ctx.lineWidth = 1.6; ctx.stroke(); hatch(ctx, () => rr(ctx, -9, -9, 18, 18, 3), '#8FA39E', 5);
  });
  // front of house / behind the scenes
  const fk = spr(t, B(81.3), 16, 0.85) * (1 - out), bk = spr(t, B(82.3), 16, 0.85) * (1 - out);
  rise(ctx, t, 'FRONT OF HOUSE', 1780, WH.cy - 26, { size: 17, w: 700, c: C.neon, ls: 5, align: 'right' }, B(81.3), B(86));
  if (fk > 0.01) arrowGlyph(ctx, 1800, WH.cy - 32, true, C.neon);
  rise(ctx, t, 'BEHIND THE SCENES', 1780, WH.cy + 44, { size: 17, w: 700, c: '#8FA39E', ls: 5, align: 'right' }, B(82.3), B(86));
  if (bk > 0.01) arrowGlyph(ctx, 1800, WH.cy + 38, false, '#8FA39E');
  if (fk > 0.01) { ctx.fillStyle = '#3A4C47'; ctx.fillRect(WH.cx + WH.r1 + 250, WH.cy, (1780 - WH.cx - WH.r1 - 250 + 30) * fk, 1.5); }
});

// --- What users do every day vs. the Salam app today (beats 88–92) ---
const USAGE = [['Social', 93, 'UserGroup'], ['Streaming', 80, 'Video01'], ['News', 65, 'News01'], ['Gaming', 57, 'GameController03'], ['Work', 50, 'Briefcase01']];
const BEYOND = [['Sports & scores', 'FootballIcon'], ['Gaming hub', 'GameController03'], ['Streaming deals', 'Video01'], ['News feed', 'News01'], ['Lifestyle rewards', 'DiscountTag01']];
const BARRIERS = [
  { b: 'No branch near me', q: '“I want help when I need it.”', p: 23, c: C.red, ic: 'Store01', a: 'The app becomes the branch', s: '3-minute onboarding · 24/7 AI assistant', im: 'AiBrain01' },
  { b: "I don't know anyone using it", q: '“I need confidence.”', p: 22, c: C.orange, ic: 'UserMultiple', a: 'Refer & earn · Circles', s: 'Real users, real stories', im: 'Gift' },
  { b: 'Poor network performance', q: '“I need proof.”', p: 20, c: C.orange, ic: 'WifiDisconnected01', a: 'Live coverage map', s: 'Speed test · reliability dashboard', im: 'Signal' },
  { b: 'Too expensive', q: '“I don’t see enough value.”', p: 17, c: C.purple, ic: 'MoneyBag01', a: 'Value, reframed', s: 'Bundles · rewards & loyalty', im: 'Coins01' },
];
const GREYT = '#9AA6A2';
// chart tokens: one hue per series, hairline recessive grid, values in ink at the bar tips
const GRID_C = '#DCE5DE', TICK_C = '#7A8A85', MUTED = '#5B6B66', ALERT = C.red, ALERT_T = '#FBE4E4', GOOD_T = '#DDF3E2';
function hbar(ctx, x0, y, len, th, col) {               // a bar: square at the baseline, 4px rounded data-end
  if (len <= 0.5) return;
  ctx.beginPath(); ctx.roundRect(x0, y - th / 2, len, th, [0, Math.min(4, len), Math.min(4, len), 0]); ctx.fillStyle = col; ctx.fill();
}
function xAxis(ctx, t, t0, x0, x1, yTop, yBot, ticks, fmt) {
  ticks.forEach((v, i) => {
    const k = eOut(P(t, t0 + i * 0.04, 0.4)); if (k <= 0) return;
    const x = lerp(x0, x1, v / ticks[ticks.length - 1]);
    ctx.fillStyle = GRID_C; ctx.fillRect(x - 0.5, yBot - (yBot - yTop) * k, 1, (yBot - yTop) * k);
    T(ctx, fmt(v), x, yBot + 26, { size: 16, w: 600, c: TICK_C, align: 'center' });
  });
}
scene(88, 102.2, (ctx, t) => {
  bg(ctx, C.mist);
  const split = eIn(P(t, B(92), 0.42));
  // ---- left: what users do every day (share of users, daily) ----
  ctx.save(); ctx.translate(-split * 1300, 0);
  rise(ctx, t, 'What users do every day', 120, 190, { size: 52, w: 700, c: C.deep, ls: -1 }, B(88));
  rise(ctx, t, 'Share of users, daily', 120, 232, { size: 22, w: 500, c: MUTED }, B(88) + 0.15);
  const UX0 = 420, UX1 = 860;
  xAxis(ctx, t, B(88) + 0.2, UX0, UX1, 286, 790, [0, 25, 50, 75, 100], v => v + (v === 100 ? '%' : ''));
  USAGE.forEach(([n, v, ic], i) => {
    const t0 = B(88 + Math.floor(i / 2)) + (i % 2) * 0.15, y = 330 + i * 100;
    const k = spr(t, t0, 17, 0.8);
    if (k > 0.01) { circ(ctx, 150, y, 26 * k); ctx.fillStyle = C.deep; ctx.fill(); icon(ctx, ic, 150, y, 28 * k, C.neon, 1.1); }
    rise(ctx, t, n, 196, y + 11, { size: 30, w: 600, c: C.ink }, t0);
    const g = spr(t, t0 + 0.05, 11, 0.86), len = (UX1 - UX0) * v / 100 * g;
    hbar(ctx, UX0, y, len, 24, C.green);
    if (g > 0.05) T(ctx, Math.round(v * clamp(g)) + '%', UX0 + len + 12, y + 9, { size: 24, w: 700, c: C.ink });
  });
  ctx.fillStyle = TICK_C; ctx.fillRect(UX0 - 1, 286 * eOut(P(t, B(88) + 0.2, 0.4)) + 790 * (1 - eOut(P(t, B(88) + 0.2, 0.4))), 2, 790 - (286 * eOut(P(t, B(88) + 0.2, 0.4)) + 790 * (1 - eOut(P(t, B(88) + 0.2, 0.4)))));
  ctx.restore();
  if (t >= B(90) && t < B(92)) {
    const pu = 1 + 0.25 * Math.max(0, 1 - ((t - B(90)) % BEAT) * 4), k = spr(t, B(90), 16);
    ctx.save(); ctx.translate(1010, 560); ctx.scale(pu * k, pu * k);
    T(ctx, '»', 0, 30, { size: 110, w: 700, c: C.leaf, align: 'center' }); ctx.restore();
  }
  // ---- right: the real Salam app, and what it could add ----
  ctx.save(); ctx.translate(split * 1300, 0);
  {
    const k = spr(t, B(90), 14, 0.86);
    if (k > 0.01) phone(ctx, t, [['s_home', B(90)]], 1290, lerp(1600, 548, k), 800, { shadow: 0.7 });
    rise(ctx, t, 'Salam app today', 1290, 1040, { size: 32, w: 600, c: C.deep, align: 'center' }, B(90) + 0.15);
  }
  BEYOND.forEach(([n, ic], i) => {
    const q = spr(t, B(91) + i * 0.08, 17, 0.8);
    if (q <= 0.01) return;
    const x = 1520, y = 240 + i * 110;
    ctx.save(); ctx.translate(x + 180 * (1 - q), y);
    const w = TW(ctx, n, { size: 24, w: 600 }) + 120;
    shadowOn(ctx, 0.45); rr(ctx, 0, -32, w, 64, 32); ctx.fillStyle = C.deep; ctx.fill(); shadowOff(ctx);
    circ(ctx, 34, 0, 22); ctx.fillStyle = C.neon; ctx.fill(); icon(ctx, ic, 34, 0, 26, C.deep, 1.2);
    T(ctx, n, 68, 8, { size: 24, w: 600, c: C.mist });
    T(ctx, '+', w - 26, 10, { size: 30, w: 700, c: C.neon, align: 'center' });
    ctx.restore();
  });
  rise(ctx, t, '+ BEYOND', 1520, 195, { size: 22, w: 700, c: C.leaf, ls: 6 }, B(91));
  ctx.restore();

  // ---- 72%: a hero figure and a unit chart (one dot = one in a hundred aware users) ----
  const exitAll = eIn(P(t, B(100), 0.4));
  if (t >= B(92)) {
    const m = eInOut(P(t, B(94), 0.5));
    const v = Math.round(72 * eOut(P(t, B(92), 0.75)));
    const sc = lerp(1, 0.4, m), x = lerp(160, 120, m), y = lerp(600, 250, m) - exitAll * 1100;
    const o = { size: 280, w: 800, ls: -10 };
    const wn = TW(ctx, String(v), o);
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    T(ctx, String(v), 0, 0, { ...o, c: C.deep });
    T(ctx, '%', wn, 0, { ...o, c: C.leaf });
    ctx.restore();
    const co = { size: lerp(42, 28, m), w: 500, c: C.ink };
    rise(ctx, t, m < 0.5 ? 'of aware users still' : "of aware users still don't consider Salam.", m < 0.5 ? 168 : 450, lerp(700, 236, m) - exitAll * 1100, co, m < 0.5 ? B(93) : B(94) + 0.2);
    if (m < 0.5) rise(ctx, t, "don't consider Salam.", 168, 756, co, B(93) + 0.1, B(94) - 0.05);
    // the unit chart: dots fill in a wave, then leave in one
    const gone = (r, c) => eIn(P(t, B(94) - 0.1 + (r + c) * 0.012, 0.3));
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
      const i = r * 10 + c, cx = 1060 + c * 62, cy = 262 + r * 62;
      const k = spr(t, B(92) + 0.1 + (r + c) * 0.018, 16, 0.82) * (1 - gone(r, c));
      if (k <= 0.01) continue;
      const on = i < 72 && t >= B(92) + 0.2 + i * 0.011;
      const pop = on ? 1 + 0.18 * Math.max(0, 1 - (t - (B(92) + 0.2 + i * 0.011)) * 6) : 1;
      circ(ctx, cx, cy, 22 * k * pop); ctx.fillStyle = on ? C.deep : '#D3E4D7'; ctx.fill();
    }
    // legend
    const lk = eOut(P(t, B(93) + 0.2, 0.4)) * (1 - eIn(P(t, B(94) - 0.1, 0.3)));
    if (lk > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(1030, 892, 700, 48); ctx.clip(); ctx.translate(0, (1 - lk) * 48);
      circ(ctx, 1046, 916, 9); ctx.fillStyle = C.deep; ctx.fill(); T(ctx, "72 don't consider Salam", 1064, 923, { size: 20, w: 600, c: C.ink });
      circ(ctx, 1356, 916, 9); ctx.fillStyle = '#D3E4D7'; ctx.fill(); T(ctx, '28 consider', 1374, 923, { size: 20, w: 600, c: C.ink });
      ctx.restore();
    }
  }
  // ---- the barriers: one bar chart, one alert hue; each bar turns green when the app answers it ----
  const BX0 = 790, BX1 = 1150, BMAX = 25;
  if (t >= B(94)) xAxis(ctx, t, B(94), BX0, BX1, 330 - exitAll * 1100, 900 - exitAll * 1100, [0, 5, 10, 15, 20, 25], v => v + '%');
  BARRIERS.forEach((r, i) => {
    const t0 = B(94 + i), y = 370 + i * 136 - exitAll * 1100;
    if (t < t0) return;
    const flip = B(98 + Math.floor(i / 2)) + (i % 2) * 0.15;
    const done = clamp(P(t, flip + 0.15, 0.25));
    const tc = mixC(C.ink, GREYT, done);
    const k = spr(t, t0, 17, 0.8);
    circ(ctx, 150, y + 26, 34 * k); ctx.fillStyle = mixC(ALERT_T, GOOD_T, done); ctx.fill();
    if (done < 0.5) icon(ctx, r.ic, 150, y + 26, 34 * k * (1 - done * 2), ALERT, 1.2);
    else icon(ctx, 'Tick02', 150, y + 26, 34 * k * (done - 0.5) * 2, C.green, 1.6);
    rise(ctx, t, r.b, 206, y + 40, { size: 34, w: 700, c: tc }, t0);
    const g = spr(t, t0 + 0.05, 11, 0.86), len = (BX1 - BX0) * r.p / BMAX * g;
    hbar(ctx, BX0, y + 24, len, 24, mixC(ALERT, C.green, done));
    if (g > 0.05) T(ctx, Math.round(r.p * clamp(g)) + '%', BX0 + len + 12, y + 33, { size: 26, w: 700, c: C.ink });
    const f = P(t, flip, 0.36), k1 = spr(t, t0 + 0.1, 16), half = f < 0.5;
    const sy = half ? (f === 0 ? k1 : 1 - eIn(f * 2)) : eOut((f - 0.5) * 2);
    if (sy > 0.001) {
      ctx.save(); ctx.translate(0, y + 24); ctx.scale(1, sy); ctx.translate(0, -(y + 24));
      shadowOn(ctx, half ? 0.2 : 0.5); rr(ctx, 1260, y - 30, 560, 108, 28); ctx.fillStyle = half ? ALERT_T : C.deep; ctx.fill(); shadowOff(ctx);
      if (half) T(ctx, r.q, 1292, y + 34, { size: 27, w: 600, c: '#A3373B' });
      else {
        circ(ctx, 1318, y + 24, 34); ctx.fillStyle = C.neon; ctx.fill(); icon(ctx, r.im, 1318, y + 24, 38, C.deep, 1.2);
        T(ctx, r.a, 1382, y + 16, { size: 28, w: 700, c: C.mist }); T(ctx, r.s, 1382, y + 52, { size: 19, w: 500, c: C.fog });
      }
      ctx.restore();
    }
    const cp = P(t, flip - 0.05, 0.3);
    if (cp > 0 && cp < 1) T(ctx, '›', lerp(1200, 1260, eOut(cp)), y + 44, { size: 70, w: 700, c: C.leaf, align: 'center' });
  });
  rise(ctx, t, 'Four barriers. Four experience opportunities.', 120, 1010 - exitAll * 1100, { size: 30, w: 600, c: C.deep }, B(99) + 0.3);
});

// --- reason to stay -> fragmented tiles -> one app, three real screens (beats 100–108) ---
const CARD = { x: 180, y: 350, w: 1560, h: 380 };
const TILE_LABELS = ['Bills', 'eSIM', 'Router', 'Offers', 'Pay', 'Support', 'Top-up', 'Shop', 'Track', 'Plans', 'Rewards', 'Coverage'];
const TILE_IM = ['Invoice03', 'Simcard01', 'Wifi01', 'Gift', 'CreditCard', 'CustomerSupport', 'Flash', 'ShoppingBag01', 'Package', 'SmartPhone01', 'Medal01', 'Signal'];
const FRAG_COL = [C.stone, C.white, C.teal, '#F6C9A8', C.leaf, '#D6CCF5', C.white, C.stone, '#BFE6C4', C.deep, '#F9DADB', C.white];
const PHONES3 = [
  { s: 's_plans', x: 590, y: 640, h: 660, rot: -0.07 },
  { s: 's_home', x: 960, y: 600, h: 760, rot: 0 },
  { s: 's_ai_answer', x: 1330, y: 640, h: 660, rot: 0.07 },
];
const SCAT = TILE_LABELS.map((_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453, r1 = a - Math.floor(a), b = Math.sin(i * 78.233) * 12543.21, r2 = b - Math.floor(b);
  return { x: 120 + (i % 4) * 430 + r1 * 120, y: 200 + Math.floor(i / 4) * 260 + r2 * 90, w: 200 + r1 * 100, h: 150 + r2 * 50, r: (r1 - 0.5) * 0.5 };
});
scene(100, 108.6, (ctx, t) => {
  if (t >= B(100.7)) bg(ctx, C.mist);
  const grow = spr(t, B(100), 15, 0.85);
  if (t < B(102)) {
    const y = lerp(1100, CARD.y, grow);
    shadowOn(ctx, 0.6); rr(ctx, CARD.x, y, CARD.w, CARD.h, 44); ctx.fillStyle = C.deep; ctx.fill(); shadowOff(ctx);
    pic(ctx, 'i_check', CARD.x + 175, y + CARD.h / 2, 190 * spr(t, B(100) + 0.25, 15, 0.8));
    cardText(ctx, t, CARD.x + 120, y);
    // behind the type: the card sits behind him, his phone and head rise over its top edge
    const k = eInOut(P(t, B(100.5), 0.6)), out = eIn(P(t, B(101.7), 0.35));
    if (k > 0 && out < 1) {
      // mirrored so the phone arm reaches out of frame and the thumbs-up lands on the card
      ctx.save(); ctx.translate(1770, 0); ctx.scale(-1, 1);
      pic(ctx, 'p_thumbs', 0, 560 + (1 - k) * 600 + out * 1100, 1000 * (1 + 0.04 * P(t, B(100.5), B(1.5))));
      ctx.restore();
    }
  } else {
    // the card breaks into twelve mismatched tiles, then they pour into one app
    TILE_LABELS.forEach((lab, i) => {
      const cols = 4, tw = CARD.w / cols, th = CARD.h / 3;
      const from = { x: CARD.x + (i % cols) * tw, y: CARD.y + Math.floor(i / cols) * th, w: tw, h: th };
      const sc = SCAT[i], p1 = spr(t, B(102) + i * 0.02, 14, 0.85);
      const passT = B(103) + 0.05 + (sc.x + sc.w / 2) / 2100 * 0.4;
      const p2 = eIn(P(t, passT, 0.3));
      if (p2 >= 1) return;
      const x = lerp(lerp(from.x, sc.x, p1), 960 - 60, p2), y = lerp(lerp(from.y, sc.y, p1), 600 - 60, p2);
      const w = lerp(lerp(from.w, sc.w, p1), 120, p2) * (1 - p2), h = lerp(lerp(from.h, sc.h, p1), 120, p2) * (1 - p2);
      ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(sc.r * p1 * (1 - p2));
      const f1 = Math.abs(Math.cos(Math.min(1, p1 * 1.6) * Math.PI));
      const stage = p1 > 0.3 ? 1 : 0;
      ctx.scale(stage ? Math.max(f1, 0.02) : 1, 1);
      rr(ctx, -w / 2, -h / 2, w, h, stage ? 26 : 0);
      if (!stage) {
        ctx.fillStyle = C.deep; ctx.fill(); ctx.save(); ctx.clip();
        const ox = (i % 4) * tw, oy = Math.floor(i / 4) * th;
        ctx.translate(-w / 2 - ox * w / tw, -h / 2 - oy * h / th); ctx.scale(w / tw, h / th);
        pic(ctx, 'i_check', 175, CARD.h / 2, 190); cardText(ctx, t, 120, 0); ctx.restore();
      } else {
        shadowOn(ctx, 0.35); ctx.fillStyle = FRAG_COL[i]; ctx.fill(); shadowOff(ctx);
        const dark = [C.teal, C.deep, C.leaf].includes(FRAG_COL[i]);
        icon(ctx, TILE_IM[i], 0, -h * 0.12, h * 0.36, dark ? C.neon : C.deep, 1.1);
        T(ctx, lab, 0, h * 0.36, { size: 26, w: 700, c: dark ? C.mist : C.ink, align: 'center' });
      }
      ctx.restore();
    });
  }
  rise(ctx, t, 'FRAGMENTED TODAY', 960, 150, { size: 26, w: 700, c: C.red, align: 'center', ls: 8 }, B(102) + 0.1, B(103));
  const cp = P(t, B(103), 0.5);
  if (cp > 0 && cp < 1) T(ctx, '»»»', lerp(-300, 2300, eInOut(cp)), 580, { size: 240, w: 800, c: C.leaf, align: 'center', ls: -30 });
  // one app: a hub. Every service plugs into the same phone, then AI ties it together (real beats 111–119)
  if (t >= B(103.3) && t < B(107.6)) {
    const spread = eInOut(P(t, BN(118), 0.6));
    const lift = 20 * (spr(t, BN(119), 16, 0.8) - spr(t, BN(119) + 0.3, 16, 0.8));
    // side phones slide out from behind the hub on beat 118
    [0, 2].forEach(i => {
      if (spread <= 0) return;
      const ph = PHONES3[i];
      phone(ctx, t, [[ph.s, 0]], lerp(960, ph.x, spread), ph.y - lift, ph.h * lerp(0.85, 1, spread), { rot: ph.rot * spread, shadow: 0.6 });
    });
    // capability cards wired into the hub
    HUB.forEach((c, i) => {
      const t0 = BN(113 + Math.floor(i / 2)), left = i % 2 === 0;
      const k = spr(t, t0 + (left ? 0 : 0.1), 15, 0.86), out = eIn(P(t, BN(118) + (i % 3) * 0.04, 0.4));
      if (k <= 0.01 || out >= 1) return;
      const y = 340 + Math.floor(i / 2) * 200;
      const cw = 470, x0 = (left ? 150 : 1920 - 150 - cw) + (left ? -1 : 1) * ((1 - k) * 600 + out * 900);
      // connector + a pulse that travels into the phone
      const ex = left ? x0 + cw : x0, px = left ? 790 : 1130;
      const lp = eOut(P(t, t0 + 0.12, 0.3)) * (1 - out);
      if (lp > 0) {
        ctx.strokeStyle = '#B9D3C0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ex, y); ctx.lineTo(lerp(ex, px, lp), y); ctx.stroke();
        const pp = (((t - t0) / BEAT) % 1);
        circ(ctx, lerp(ex, px, pp), y, 7); ctx.fillStyle = C.green; ctx.fill();
      }
      shadowOn(ctx, 0.45); rr(ctx, x0, y - 62, cw, 124, 30); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
      circ(ctx, x0 + 64, y, 36); ctx.fillStyle = C.deep; ctx.fill(); icon(ctx, c[1], x0 + 64, y, 36, C.neon, 1.1);
      T(ctx, c[0], x0 + 120, y - 6, { size: 30, w: 700, c: C.deep });
      T(ctx, c[2], x0 + 120, y + 30, { size: 20, w: 500, c: '#5B6B66' });
    });
    // the hub phone: its screen follows each service as it plugs in
    {
      const k = spr(t, B(103.3), 14, 0.86);
      const scr = [['s_home', 0], ['s_plans', BN(114)], ['s_payment', BN(115)], ['s_ai_answer', BN(116)], ['s_home', BN(118)]];
      phone(ctx, t, scr, 960, 600 - lift, lerp(740, 760, spread) * k, { shadow: 0.7 });
    }
    const o = { size: 72, w: 700, ls: -2 }, a = TW(ctx, 'One App. ', o), b = TW(ctx, 'One Experience.', o);
    rise(ctx, t, 'One App.', 960 - (a + b) / 2, 120, { ...o, c: C.deep }, BN(112), BN(118.85));
    rise(ctx, t, 'One Experience.', 960 - (a + b) / 2 + a, 120, { ...o, c: C.leaf }, BN(112) + 0.12, BN(118.85) + 0.03);
    rise(ctx, t, 'All of Salam. Built around you.', 960, 178, { size: 32, w: 500, c: '#4E5F5A', align: 'center' }, BN(117), BN(118.85) + 0.06);
    const kk = eOut(P(t, BN(116), 0.45)), ko = eIn(P(t, BN(118.85), 0.3));
    if (kk > 0 && ko < 1) {
      ctx.save(); ctx.translate(0, ko * 200);
      shadowOn(ctx, 0.5); rr(ctx, 310, 985, 1300 * kk, 62, 31); ctx.fillStyle = C.neon; ctx.fill(); shadowOff(ctx);
      ctx.beginPath(); ctx.rect(310, 985, 1300 * kk, 62); ctx.clip();
      icon(ctx, 'AiBrain01', 352, 1016, 30, C.night, 1.2);
      T(ctx, 'AI ties it together   ·   Personalised  ·  Predictive  ·  Intelligent assistance  ·  Smart automation', 384, 1025, { size: 24, w: 600, c: C.night });
      ctx.restore();
    }
  }
});
const HUB = [
  ['Unified login', 'FingerPrint', 'One identity for everything'], ['E-Commerce', 'ShoppingBag01', 'Devices, checkout, tracking'],
  ['Mobile', 'SmartPhone01', 'Plans, SIM & eSIM, top-up'], ['Loyalty', 'Award01', 'Rewards every day'],
  ['Home', 'Home01', 'Fiber, 5G and your router'], ['Customer care', 'CustomerSupport', '24/7, right in the app'],
];
function cardText(ctx, t, x, y) {
  const o = { size: 54, w: 700, ls: -1 };
  rise(ctx, t, 'Turn every reason not to choose us', x + 250, y + 172, { ...o, c: C.mist }, B(100) + 0.15);
  rise(ctx, t, 'into a reason to stay.', x + 250, y + 258, { ...o, c: C.neon }, B(101));
}
