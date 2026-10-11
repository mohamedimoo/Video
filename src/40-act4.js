// ===== ACT IV — DATA & UI (bars 21–27, beats 80–107) =====
const WH = { cx: 1220, cy: 540, r0: 192, r1: 430 };
const DOMAINS = ['Connectivity', 'Faith', 'News & Content', 'Sports & Fantasy', 'Gaming', 'Ecommerce', 'Food & Festivals', 'Travel', 'Health & Wellbeing', 'Fintech & Pay'];
const CAPS = ['Identity', 'Wallet & Billing', 'Personalisation', 'Gamification', 'Martech & Data', 'Product + Tech Ops', 'Mini-Apps Platform', 'Partnerships', 'Customer Support', 'Design System & UX'];
const SEGN = 20, SG = 0.012;
function segAngles(i) {
  const up = i < 10, j = up ? i : i - 10;
  const a0 = (up ? Math.PI : 0) + j * Math.PI / 10 + SG, a1 = (up ? Math.PI : 0) + (j + 1) * Math.PI / 10 - SG;
  return [a0, a1];
}
function wheelRot(t) {
  return 0.12 * Math.max(0, t - B(84)) + 7 * eIn(P(t, B(86), B(1)));
}
let _WC = null;
function wheelCache() {
  if (_WC) return _WC;
  const segs = [];
  for (let i = 0; i < SEGN; i++) {
    const [a0, a1] = segAngles(i);
    const src = sectorPts(WH.cx, WH.cy, WH.r0, WH.r1, a0, a1, 80);
    const cell = rectPts(160 + i * 80, 850, 76, 14, 80);
    segs.push({ src, cell: align(src, cell) });
  }
  return (_WC = segs);
}

scene(80, 88.2, (ctx, t) => {
  bg(ctx, C.night);
  const segs = wheelCache();
  const rot = wheelRot(t);
  const unroll = eInOut(P(t, B(86.25), B(0.75)));
  const open = eInOut(P(t, B(87), B(0.95)));
  // core + inner ring (the flattened EAI orb)
  const coreK = 1 - eIn(P(t, B(86), 0.4));
  if (coreK > 0) {
    ctx.strokeStyle = C.neon; ctx.lineWidth = 3; circ(ctx, WH.cx, WH.cy, 175 * coreK); ctx.stroke();
    circ(ctx, WH.cx, WH.cy, 175 * 0.62 * 1.2 * coreK); ctx.fillStyle = C.neon; ctx.fill();
    ctx.save(); ctx.translate(WH.cx, WH.cy + 52 * 0.62); ctx.scale(0.62 * coreK, 0.62 * coreK);
    T(ctx, 'AI', 0, 0, { size: 150, w: 800, ls: -4, c: C.night, align: 'center' }); ctx.restore();
  }
  // segments
  segs.forEach((g, i) => {
    const up = i < 10, j = up ? i : i - 10;
    const k = spr(t, B(up ? 80 : 81) + j * 0.035, 16, 0.85);
    if (k <= 0.001) return;
    const [a0, a1] = segAngles(i);
    let pts = sectorPts(WH.cx, WH.cy, WH.r0, lerp(WH.r0 + 2, WH.r1, k), a0 + rot, a1 + rot, 80);
    if (unroll > 0) pts = mixPts(rotPts(g.src, WH.cx, WH.cy, rot), g.cell, unroll);
    if (open > 0) { // every cell grows into a column of the next (light) scene
      const x0 = 160 + i * 80, cw = lerp(76, 80, open);
      const left = i === 0 ? lerp(x0, 0, open) : x0, right = i === 19 ? lerp(x0 + 76, W, open) : x0 + cw;
      pts = rectPts(left, lerp(850, -2, open), right - left, lerp(14, H + 4, open), 80);
    }
    // light pulses run outward through the segments on beats 83–85
    let base = up ? C.deep : C.teal;
    [83, 84, 85].forEach((n, q) => {
      const hit = q === 0 ? up : q === 1 ? !up : true;
      if (!hit) return;
      const pu = Math.max(0, 1 - Math.abs(t - (B(n) + j * 0.025)) * 3.2);
      if (pu > 0) base = mixC(base, C.green, pu);
    });
    if (unroll > 0) base = mixC(base, C.mist, unroll);
    poly(ctx, pts); ctx.fillStyle = base; ctx.fill();
    // labels
    if (unroll < 0.05 && k > 0.6) {
      const am = (a0 + a1) / 2 + rot;
      const flip = Math.cos(am) < 0;
      ctx.save(); ctx.translate(WH.cx + Math.cos(am) * 216, WH.cy + Math.sin(am) * 216); ctx.rotate(flip ? am + Math.PI : am);
      const name = up ? DOMAINS[j] : CAPS[j];
      const lw = TW(ctx, name, { size: 17, w: 600 });
      T(ctx, name, flip ? -lw : 0, 6, { size: 17, w: 600, c: C.mist });
      ctx.restore();
    }
  });
  // pulse rings
  [83, 84, 85].forEach(n => {
    const p = P(t, B(n), 0.45); if (p <= 0 || p >= 1) return;
    ctx.save(); ctx.beginPath(); ctx.arc(WH.cx, WH.cy, lerp(WH.r0, WH.r1, eOut(p)), 0, Math.PI * 2);
    ctx.strokeStyle = C.neon; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
  });
  rise(ctx, t, 'CUSTOMER DOMAINS', WH.cx, WH.cy - WH.r1 - 26, { size: 20, w: 700, c: C.leaf, align: 'center', ls: 6 }, B(80) + 0.3, B(86));
  rise(ctx, t, 'INTERNAL CAPABILITIES', WH.cx, WH.cy + WH.r1 + 46, { size: 20, w: 700, c: C.leaf, align: 'center', ls: 6 }, B(81) + 0.3, B(86));
  const o = { size: 92, w: 700, ls: -2 };
  rise(ctx, t, 'AI cross-cuts', 120, 440, { ...o, c: C.mist }, B(82), B(86));
  rise(ctx, t, 'every', 120, 545, { ...o, c: C.mist }, B(82) + 0.1, B(86) + 0.03);
  rise(ctx, t, 'capability.', 120, 650, { ...o, c: C.neon }, B(82) + 0.2, B(86) + 0.06);
});

// --- Usage vs offer, 72%, barriers -> answers (beats 88–102) ---
const USAGE = [['Social', 93], ['Streaming', 80], ['News', 65], ['Gaming', 57], ['Work', 50]];
const HAVE = ['Manage plan', 'Buy SIM', 'Promotions'];
const BEYOND = ['Sports & scores', 'Gaming hub', 'Streaming deals', 'News feed', 'Lifestyle rewards'];
const BARRIERS = [
  { b: 'No branch near me', q: '“I want help when I need it.”', p: 23, c: C.red, a: 'The app becomes the branch', s: '3-minute onboarding · 24/7 AI assistant' },
  { b: "I don't know anyone using it", q: '“I need confidence.”', p: 22, c: C.orange, a: 'Refer & earn · Circles', s: 'Real users, real stories' },
  { b: 'Poor network performance', q: '“I need proof.”', p: 20, c: C.orange, a: 'Live coverage map', s: 'Speed test · reliability dashboard' },
  { b: 'Too expensive', q: '“I don’t see enough value.”', p: 17, c: C.purple, a: 'Value, reframed', s: 'Bundles · rewards & loyalty' },
];
const GREYT = '#9AA6A2';
scene(88, 102.2, (ctx, t) => {
  bg(ctx, C.mist);
  const split = eIn(P(t, B(92), 0.42));
  // left: what users do every day
  ctx.save(); ctx.translate(-split * 1300, 0);
  rise(ctx, t, 'What users do every day', 120, 200, { size: 52, w: 700, c: C.deep, ls: -1 }, B(88));
  USAGE.forEach(([n, v], i) => {
    const t0 = B(88 + Math.floor(i / 2)) + (i % 2) * 0.15, y = 300 + i * 104;
    rise(ctx, t, n, 120, y + 38, { size: 34, w: 600, c: C.ink }, t0);
    const p = eOut(P(t, t0 + 0.05, 0.5));
    if (p > 0) {
      rr(ctx, 360, y, 480, 52, 26); ctx.fillStyle = '#DCE6DE'; ctx.fill();
      rr(ctx, 360, y, Math.max(52, 480 * v / 100 * p), 52, 26); ctx.fillStyle = C.green; ctx.fill();
      T(ctx, Math.round(v * p) + '%', 360 + 480 * v / 100 * p - 18, y + 37, { size: 28, w: 700, c: C.white, align: 'right' });
    }
  });
  ctx.restore();
  // arrow between halves
  if (t >= B(90) && t < B(92)) {
    const pu = 1 + 0.25 * Math.max(0, 1 - ((t - B(90)) % BEAT) * 4);
    ctx.save(); ctx.translate(960, 560); ctx.scale(pu * spr(t, B(90), 16), pu * spr(t, B(90), 16));
    T(ctx, '»', 0, 30, { size: 110, w: 700, c: C.leaf, align: 'center' }); ctx.restore();
  }
  // right: what the app offers
  ctx.save(); ctx.translate(split * 1300, 0);
  rise(ctx, t, 'Salam app today', 1060, 200, { size: 52, w: 700, c: C.deep, ls: -1 }, B(90));
  HAVE.concat(BEYOND).forEach((n, i) => {
    const beyond = i >= 3;
    const t0 = beyond ? B(91) + (i - 3) * 0.08 : B(90) + i * 0.08;
    const k = spr(t, t0, 17);
    if (k <= 0.001) return;
    const y = 252 + i * 80;
    ctx.save(); ctx.translate(1060, y + 30); ctx.scale(1, k); ctx.translate(-1060, -(y + 30));
    rr(ctx, 1060, y, 700, 62, 31);
    ctx.fillStyle = beyond ? C.deep : C.white; ctx.fill();
    if (!beyond) { ctx.strokeStyle = '#C9D9CD'; ctx.lineWidth = 2; ctx.stroke(); }
    T(ctx, n, 1092, y + 42, { size: 28, w: 600, c: beyond ? C.mist : C.ink });
    if (beyond) T(ctx, '+ BEYOND', 1734, y + 41, { size: 20, w: 700, c: C.neon, align: 'right', ls: 3 });
    else T(ctx, '✓', 1730, y + 43, { size: 30, w: 700, c: C.green, align: 'right' });
    ctx.restore();
  });
  ctx.restore();

  // 72% -> corner
  const exitAll = eIn(P(t, B(100), 0.4));
  if (t >= B(92)) {
    const v = Math.round(72 * eOut(P(t, B(92), 0.55)));
    const m = eInOut(P(t, B(94), 0.5));
    const sc = lerp(1, 0.4, m), x = lerp(960, 120, m), y = lerp(640, 250, m) - exitAll * 1100;
    const o = { size: 330, w: 800, ls: -12 };
    const wn = TW(ctx, String(v), o), wp = TW(ctx, '%', o);
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    const left = lerp(-(wn + wp) / 2, 0, m);
    T(ctx, String(v), left, 0, { ...o, c: C.deep });
    T(ctx, '%', left + wn, 0, { ...o, c: C.leaf });
    ctx.restore();
    const co = { size: lerp(46, 28, m), w: 500, c: C.ink, align: m < 0.5 ? 'center' : 'left' };
    rise(ctx, t, "of aware users still don't consider Salam.", m < 0.5 ? 960 : 450, lerp(760, 236, m) - exitAll * 1100, co, B(93));
  }
  // barrier rows
  BARRIERS.forEach((r, i) => {
    const t0 = B(94 + i), y = 370 + i * 136 - exitAll * 1100;
    if (t < t0) return;
    const flip = B(98 + Math.floor(i / 2)) + (i % 2) * 0.15;
    const done = P(t, flip + 0.15, 0.2);
    const tc = mixC(C.ink, GREYT, done);
    rise(ctx, t, r.b, 120, y + 40, { size: 38, w: 700, c: tc }, t0);
    // bar
    const p = eOut(P(t, t0 + 0.05, 0.5));
    rr(ctx, 760, y + 14, 300, 18, 9); ctx.fillStyle = '#E1E7E2'; ctx.fill();
    rr(ctx, 760, y + 14, Math.max(18, 300 * r.p / 25 * p), 18, 9); ctx.fillStyle = mixC(r.c, GREYT, done); ctx.fill();
    T(ctx, Math.round(r.p * p) + '%', 1170, y + 40, { size: 50, w: 800, c: mixC(r.c, GREYT, done), align: 'right' });
    // answer card: red-tinted customer voice flips to a green answer
    const f = P(t, flip, 0.36);
    const k1 = spr(t, t0 + 0.1, 16);
    const half = f < 0.5;
    const sy = half ? (f === 0 ? k1 : 1 - eIn(f * 2)) : eOut((f - 0.5) * 2);
    if (sy > 0.001) {
      ctx.save(); ctx.translate(0, y + 24); ctx.scale(1, sy); ctx.translate(0, -(y + 24));
      rr(ctx, 1250, y - 24, 560, 96, 26);
      ctx.fillStyle = half ? '#FBE4E4' : C.deep; ctx.fill();
      if (half) T(ctx, r.q, 1280, y + 34, { size: 28, w: 600, c: '#A3373B' });
      else { T(ctx, r.a, 1280, y + 16, { size: 30, w: 700, c: C.mist }); T(ctx, r.s, 1280, y + 52, { size: 20, w: 500, c: C.fog }); }
      ctx.restore();
    }
    // chevron shoots across on the flip
    const cp = P(t, flip - 0.05, 0.3);
    if (cp > 0 && cp < 1) T(ctx, '›', lerp(1100, 1250, eOut(cp)), y + 44, { size: 70, w: 700, c: C.leaf, align: 'center' });
  });
  rise(ctx, t, 'Four barriers. Four experience opportunities.', 120, 1010 - exitAll * 1100, { size: 30, w: 600, c: C.deep }, B(99) + 0.3);
});

// --- reason to stay -> fragmented tiles -> one app (beats 100–108) ---
const CARD = { x: 180, y: 350, w: 1560, h: 380 };
const TILE_LABELS = ['Bills', 'eSIM', 'Router', 'Offers', 'Pay', 'Support', 'Top-up', 'Shop', 'Track', 'Plans', 'Rewards', 'Coverage'];
const FRAG_COL = [C.stone, C.white, C.teal, '#F6C9A8', C.leaf, '#D6CCF5', C.white, C.stone, '#BFE6C4', C.deep, '#F9DADB', C.white];
const GRID = (() => {
  const g = [];
  const x0 = 310, w = 1300, cw = (w - 32) / 3;
  g.push({ x: x0, y: 250, w, h: 70, c: C.deep, tc: C.mist, s: 'Unified Authentication', b: true });
  ['Mobile', 'Home', 'E-Commerce'].forEach((s, i) => g.push({ x: x0 + i * (cw + 16), y: 336, w: cw, h: 64, c: C.teal, tc: C.mist, s, b: true }));
  [['Plans & SIMs', 'Recharge & top-up'], ['Pay invoices', 'Router & ONT'], ['Checkout', 'Order tracking']].forEach((col, i) =>
    col.forEach((s, j) => g.push({ x: x0 + i * (cw + 16), y: 416 + j * 92, w: cw, h: 80, c: C.white, tc: C.deep, s })));
  ['Loyalty', 'Customer care'].forEach((s, i) => g.push({ x: x0 + i * ((w - 16) / 2 + 16), y: 600, w: (w - 16) / 2, h: 70, c: C.stone, tc: C.deep, s }));
  return g;
})();
// scattered positions are deterministic
const SCAT = TILE_LABELS.map((_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453, r1 = a - Math.floor(a), b = Math.sin(i * 78.233) * 12543.21, r2 = b - Math.floor(b);
  return { x: 120 + (i % 4) * 430 + r1 * 120, y: 200 + Math.floor(i / 4) * 260 + r2 * 90, w: 170 + r1 * 120, h: 110 + r2 * 70, r: (r1 - 0.5) * 0.5 };
});
function tileState(i, t) {
  const cols = 4, tw = CARD.w / cols, th = CARD.h / 3;
  const from = { x: CARD.x + (i % cols) * tw, y: CARD.y + Math.floor(i / cols) * th, w: tw, h: th, r: 0 };
  const sc = SCAT[i], g = GRID[i];
  const p1 = spr(t, B(102) + i * 0.02, 14, 0.85);
  // the chevron sweep passes each tile and snaps it into the grid
  const passT = B(103) + 0.05 + (g.x + g.w / 2) / 2100 * 0.45;
  const p2 = spr(t, passT, 17, 0.85);
  const L = (a, b, c) => lerp(lerp(a, b, p1), c, p2);
  return { x: L(from.x, sc.x, g.x), y: L(from.y, sc.y, g.y), w: L(from.w, sc.w, g.w), h: L(from.h, sc.h, g.h), r: L(0, sc.r, 0), p1, p2 };
}
scene(100, 108.6, (ctx, t) => {
  if (t >= B(100.7)) bg(ctx, C.mist);
  const grow = spr(t, B(100), 15, 0.85);
  const toStairs = t >= B(107.5);
  if (t < B(102)) {
    // the deep-green card rises from the bottom edge
    const y = lerp(1100, CARD.y, grow);
    rr(ctx, CARD.x, y, CARD.w, CARD.h, 40); ctx.fillStyle = C.deep; ctx.fill();
    cardText(ctx, t, CARD.x, y);
  } else if (!toStairs) {
    GRID.forEach((g, i) => {
      const s = tileState(i, t);
      ctx.save(); ctx.translate(s.x + s.w / 2, s.y + s.h / 2); ctx.rotate(s.r);
      // flip at the moment of scattering and again at the snap
      const f1 = Math.abs(Math.cos(Math.min(1, s.p1 * 1.6) * Math.PI));
      const f2 = Math.abs(Math.cos(clamp((t - (B(103) + 0.05 + (g.x + g.w / 2) / 2100 * 0.45)) / 0.22) * Math.PI));
      const stage = s.p2 > 0.5 ? 2 : s.p1 > 0.3 ? 1 : 0;
      ctx.scale(stage === 2 ? Math.max(f2, 0.02) : stage === 1 ? Math.max(f1, 0.02) : 1, 1);
      rr(ctx, -s.w / 2, -s.h / 2, s.w, s.h, stage === 0 ? 0 : 20);
      if (stage === 0) {
        ctx.fillStyle = C.deep; ctx.fill(); ctx.save(); ctx.clip();
        const tw = CARD.w / 4, th = CARD.h / 3, ox = (i % 4) * tw, oy = Math.floor(i / 4) * th;
        ctx.translate(-s.w / 2 - ox * s.w / tw, -s.h / 2 - oy * s.h / th); ctx.scale(s.w / tw, s.h / th);
        cardText(ctx, t, 0, 0); ctx.restore();
      } else if (stage === 1) {
        ctx.fillStyle = FRAG_COL[i]; ctx.fill();
        const dark = [C.teal, C.deep, C.leaf].includes(FRAG_COL[i]);
        T(ctx, TILE_LABELS[i], 0, 10, { size: 30, w: 700, c: dark ? C.mist : C.ink, align: 'center' });
      } else {
        ctx.fillStyle = g.c; ctx.fill();
        if (g.c === C.white) { ctx.strokeStyle = '#C9D9CD'; ctx.lineWidth = 2; ctx.stroke(); }
        T(ctx, g.s, -s.w / 2 + 28, 10, { size: g.b ? 28 : 26, w: g.b ? 700 : 600, c: g.tc, ls: g.b ? 1 : 0 });
      }
      ctx.restore();
    });
  }
  rise(ctx, t, 'FRAGMENTED TODAY', 960, 150, { size: 26, w: 700, c: C.red, align: 'center', ls: 8 }, B(102) + 0.1, B(103));
  // chevrons
  const cp = P(t, B(103), 0.5);
  if (cp > 0 && cp < 1) {
    const x = lerp(-300, 2300, eInOut(cp));
    T(ctx, '»»»', x, 580, { size: 240, w: 800, c: C.leaf, align: 'center', ls: -30 });
  }
  if (t >= B(104) && !toStairs) {
    const o = { size: 72, w: 700, ls: -2 }, a = TW(ctx, 'One App. ', o), b = TW(ctx, 'One Experience.', o);
    rise(ctx, t, 'One App.', 960 - (a + b) / 2, 170, { ...o, c: C.deep }, B(104), B(107.5));
    rise(ctx, t, 'One Experience.', 960 - (a + b) / 2 + a, 170, { ...o, c: C.leaf }, B(104) + 0.12, B(107.5));
    rise(ctx, t, 'All of Salam. Built around you.', 960, 900, { size: 40, w: 500, c: C.ink, align: 'center' }, B(105), B(107.5));
    // AI bar slides in under the grid
    const k = eOut(P(t, B(106), 0.45));
    if (k > 0) {
      rr(ctx, 310, 690, 1300 * k, 64, 32); ctx.fillStyle = C.neon; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(310, 690, 1300 * k, 64); ctx.clip();
      T(ctx, 'AI   ·   Personalised  ·  Predictive  ·  Intelligent assistance  ·  Smart automation  ·  Continuous learning', 342, 732, { size: 24, w: 600, c: C.night });
      ctx.restore();
    }
    // a green arrow rises through the whole grid on beat 107
    const ap = P(t, B(107), 0.45);
    if (ap > 0 && ap < 1) {
      const y = lerp(1150, -250, eInOut(ap));
      ctx.fillStyle = C.green; ctx.fillRect(950, y, 20, 260);
      ctx.beginPath(); ctx.moveTo(920, y + 10); ctx.lineTo(960, y - 40); ctx.lineTo(1000, y + 10); ctx.closePath(); ctx.fill();
    }
  }
});
function cardText(ctx, t, x, y) {
  const o = { size: 66, w: 700, ls: -1 };
  rise(ctx, t, 'Turn every reason not to choose us', x + CARD.w / 2, y + 160, { ...o, c: C.mist, align: 'center' }, B(100) + 0.15);
  rise(ctx, t, 'into a reason to stay.', x + CARD.w / 2, y + 260, { ...o, c: C.neon, align: 'center' }, B(101));
}
