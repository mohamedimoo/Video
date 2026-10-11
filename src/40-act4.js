// ===== ACT IV — DATA & UI (bars 21–27, beats 80–107) =====
const WH = { cx: 1220, cy: 540, r0: 192, r1: 430 };
const DOMAINS = ['Connectivity', 'Faith', 'News & Content', 'Sports & Fantasy', 'Gaming', 'Ecommerce', 'Food & Festivals', 'Travel', 'Health & Wellbeing', 'Fintech & Pay'];
const CAPS = ['Identity', 'Wallet & Billing', 'Personalisation', 'Gamification', 'Martech & Data', 'Product + Tech Ops', 'Mini-Apps Platform', 'Partnerships', 'Customer Support', 'Design System & UX'];
const DOM_IC = ['Wifi01', 'Mosque01', 'News01', 'FootballIcon', 'GameController03', 'ShoppingBag01', 'Restaurant01', 'Airplane01', 'HealthIcon', 'Wallet01'];
const CAP_IC = ['FingerPrint', 'Invoice01', 'MagicWand01', 'Award01', 'Database01', 'Settings02', 'DashboardSquare01', 'Agreement01', 'CustomerSupport', 'PaintBoard'];
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
  // core: the night disc and the real Salam glass logo, carried over from the EAI rings
  const coreK = 1 - eIn(P(t, B(86), 0.4));
  if (coreK > 0) {
    ctx.strokeStyle = C.neon; ctx.lineWidth = 4; circ(ctx, WH.cx, WH.cy, 175 * coreK); ctx.stroke();
    circ(ctx, WH.cx, WH.cy, 140 * coreK); ctx.fillStyle = '#06231F'; ctx.fill();
    glass(ctx, WH.cx, WH.cy, 220 * coreK);
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
    // label + Hugeicons icon on every segment
    if (unroll < 0.05 && k > 0.6) {
      const am = (a0 + a1) / 2 + rot;
      const flip = Math.cos(am) < 0;
      ctx.save(); ctx.translate(WH.cx + Math.cos(am) * 214, WH.cy + Math.sin(am) * 214); ctx.rotate(flip ? am + Math.PI : am);
      const name = up ? DOMAINS[j] : CAPS[j];
      const lw = TW(ctx, name, { size: 16, w: 600 });
      T(ctx, name, flip ? -lw : 0, 6, { size: 16, w: 600, c: C.mist });
      ctx.restore();
      icon(ctx, up ? DOM_IC[j] : CAP_IC[j], WH.cx + Math.cos(am) * 394, WH.cy + Math.sin(am) * 394, 30, C.neon, 1.1);
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


// --- What users do every day vs. the Salam app today (beats 88–92) ---
const USAGE = [['Social', 93, 'UserGroup'], ['Streaming', 80, 'Video01'], ['News', 65, 'News01'], ['Gaming', 57, 'GameController03'], ['Work', 50, 'Briefcase01']];
const BEYOND = [['Sports & scores', 'FootballIcon'], ['Gaming hub', 'GameController03'], ['Streaming deals', 'Video01'], ['News feed', 'News01'], ['Lifestyle rewards', 'DiscountTag01']];
const BARRIERS = [
  { b: 'No branch near me', q: '“I want help when I need it.”', p: 23, c: C.red, ic: 'Store01', a: 'The app becomes the branch', s: '3-minute onboarding · 24/7 AI assistant', im: 'i_ai' },
  { b: "I don't know anyone using it", q: '“I need confidence.”', p: 22, c: C.orange, ic: 'UserMultiple', a: 'Refer & earn · Circles', s: 'Real users, real stories', im: 'i_gift' },
  { b: 'Poor network performance', q: '“I need proof.”', p: 20, c: C.orange, ic: 'WifiDisconnected01', a: 'Live coverage map', s: 'Speed test · reliability dashboard', im: 'i_tower' },
  { b: 'Too expensive', q: '“I don’t see enough value.”', p: 17, c: C.purple, ic: 'MoneyBag01', a: 'Value, reframed', s: 'Bundles · rewards & loyalty', im: 'i_coins' },
];
const GREYT = '#9AA6A2';
scene(88, 102.2, (ctx, t) => {
  bg(ctx, C.mist);
  const split = eIn(P(t, B(92), 0.42));
  // left: usage, each row with its line icon
  ctx.save(); ctx.translate(-split * 1300, 0);
  rise(ctx, t, 'What users do every day', 120, 200, { size: 52, w: 700, c: C.deep, ls: -1 }, B(88));
  USAGE.forEach(([n, v, ic], i) => {
    const t0 = B(88 + Math.floor(i / 2)) + (i % 2) * 0.15, y = 290 + i * 112;
    const k = spr(t, t0, 17, 0.8);
    if (k > 0.01) { circ(ctx, 150, y + 26, 30 * k); ctx.fillStyle = C.deep; ctx.fill(); icon(ctx, ic, 150, y + 26, 30 * k, C.neon, 1.1); }
    rise(ctx, t, n, 200, y + 38, { size: 32, w: 600, c: C.ink }, t0);
    const p = eOut(P(t, t0 + 0.05, 0.5));
    if (p > 0) {
      rr(ctx, 400, y, 460, 52, 26); ctx.fillStyle = '#DCE6DE'; ctx.fill();
      rr(ctx, 400, y, Math.max(52, 460 * v / 100 * p), 52, 26); ctx.fillStyle = C.green; ctx.fill();
      T(ctx, Math.round(v * p) + '%', 400 + 460 * v / 100 * p - 18, y + 37, { size: 28, w: 700, c: C.white, align: 'right' });
    }
  });
  ctx.restore();
  if (t >= B(90) && t < B(92)) {
    const pu = 1 + 0.25 * Math.max(0, 1 - ((t - B(90)) % BEAT) * 4), k = spr(t, B(90), 16);
    ctx.save(); ctx.translate(1000, 560); ctx.scale(pu * k, pu * k);
    T(ctx, '»', 0, 30, { size: 110, w: 700, c: C.leaf, align: 'center' }); ctx.restore();
  }
  // right: the real Salam app, and what it could add
  ctx.save(); ctx.translate(split * 1300, 0);
  {
    const k = spr(t, B(90), 14, 0.86);
    if (k > 0.01) phone(ctx, t, [['s_home', B(90)]], 1290, lerp(1600, 548, k), 800, { shadow: 0.7, scroll: 0.08 * eInOut(P(t, B(90.5), B(1.5))) });
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
  // barrier rows: the customer's voice flips into the app's answer
  BARRIERS.forEach((r, i) => {
    const t0 = B(94 + i), y = 370 + i * 136 - exitAll * 1100;
    if (t < t0) return;
    const flip = B(98 + Math.floor(i / 2)) + (i % 2) * 0.15;
    const done = P(t, flip + 0.15, 0.2);
    const tc = mixC(C.ink, GREYT, done);
    const k = spr(t, t0, 17, 0.8);
    circ(ctx, 150, y + 26, 34 * k); ctx.fillStyle = mixC('#FBE4E4', '#E3E9E5', done); ctx.fill();
    icon(ctx, r.ic, 150, y + 26, 34 * k, mixC(r.c, GREYT, done), 1.2);
    rise(ctx, t, r.b, 206, y + 40, { size: 36, w: 700, c: tc }, t0);
    const p = eOut(P(t, t0 + 0.05, 0.5));
    rr(ctx, 790, y + 14, 260, 18, 9); ctx.fillStyle = '#E1E7E2'; ctx.fill();
    rr(ctx, 790, y + 14, Math.max(18, 260 * r.p / 25 * p), 18, 9); ctx.fillStyle = mixC(r.c, GREYT, done); ctx.fill();
    T(ctx, Math.round(r.p * p) + '%', 1170, y + 40, { size: 50, w: 800, c: mixC(r.c, GREYT, done), align: 'right' });
    const f = P(t, flip, 0.36), k1 = spr(t, t0 + 0.1, 16), half = f < 0.5;
    const sy = half ? (f === 0 ? k1 : 1 - eIn(f * 2)) : eOut((f - 0.5) * 2);
    if (sy > 0.001) {
      ctx.save(); ctx.translate(0, y + 24); ctx.scale(1, sy); ctx.translate(0, -(y + 24));
      shadowOn(ctx, half ? 0.2 : 0.5); rr(ctx, 1240, y - 30, 580, 108, 28); ctx.fillStyle = half ? '#FBE4E4' : C.deep; ctx.fill(); shadowOff(ctx);
      if (half) T(ctx, r.q, 1272, y + 34, { size: 28, w: 600, c: '#A3373B' });
      else {
        pic(ctx, r.im, 1300, y + 24, 92);
        T(ctx, r.a, 1362, y + 16, { size: 29, w: 700, c: C.mist }); T(ctx, r.s, 1362, y + 52, { size: 19, w: 500, c: C.fog });
      }
      ctx.restore();
    }
    const cp = P(t, flip - 0.05, 0.3);
    if (cp > 0 && cp < 1) T(ctx, '›', lerp(1110, 1240, eOut(cp)), y + 44, { size: 70, w: 700, c: C.leaf, align: 'center' });
  });
  rise(ctx, t, 'Four barriers. Four experience opportunities.', 120, 1010 - exitAll * 1100, { size: 30, w: 600, c: C.deep }, B(99) + 0.3);
});

// --- reason to stay -> fragmented tiles -> one app, three real screens (beats 100–108) ---
const CARD = { x: 180, y: 350, w: 1560, h: 380 };
const TILE_LABELS = ['Bills', 'eSIM', 'Router', 'Offers', 'Pay', 'Support', 'Top-up', 'Shop', 'Track', 'Plans', 'Rewards', 'Coverage'];
const TILE_IM = ['i_inbox', 'i_esim', 'i_homewifi', 'i_gift', 'i_coins', 'i_info', 'i_lightning', 'i_package', 'i_pin', 'i_sim', 'i_medal', 'i_tower'];
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
    pic(ctx, 'i_check', CARD.x + 210, y + CARD.h / 2, 250 * spr(t, B(100) + 0.25, 15, 0.8));
    cardText(ctx, t, CARD.x + 120, y);
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
        pic(ctx, 'i_check', 210, CARD.h / 2, 250); cardText(ctx, t, 120, 0); ctx.restore();
      } else {
        shadowOn(ctx, 0.35); ctx.fillStyle = FRAG_COL[i]; ctx.fill(); shadowOff(ctx);
        const dark = [C.teal, C.deep, C.leaf].includes(FRAG_COL[i]);
        pic(ctx, TILE_IM[i], 0, -h * 0.12, h * 0.55);
        T(ctx, lab, 0, h * 0.36, { size: 26, w: 700, c: dark ? C.mist : C.ink, align: 'center' });
      }
      ctx.restore();
    });
  }
  rise(ctx, t, 'FRAGMENTED TODAY', 960, 150, { size: 26, w: 700, c: C.red, align: 'center', ls: 8 }, B(102) + 0.1, B(103));
  const cp = P(t, B(103), 0.5);
  if (cp > 0 && cp < 1) T(ctx, '»»»', lerp(-300, 2300, eInOut(cp)), 580, { size: 240, w: 800, c: C.leaf, align: 'center', ls: -30 });
  // three real screens: one app
  if (t >= B(103.3) && t < B(107.6)) {
    PHONES3.forEach((ph, i) => {
      const k = spr(t, B(103.3) + [0.12, 0, 0.12][i], 14, 0.86);
      const spread = eOut(P(t, B(104), 0.5));
      const x = lerp(960, ph.x, spread), lift = 20 * (spr(t, B(107), 16, 0.8) - spr(t, B(107) + 0.3, 16, 0.8));
      phone(ctx, t, [[ph.s, 0]], x, ph.y - lift, ph.h * k, { rot: ph.rot * spread, shadow: 0.7, scroll: i === 1 ? 0.12 * eInOut(P(t, B(105), B(2))) : 0 });
    });
    const o = { size: 72, w: 700, ls: -2 }, a = TW(ctx, 'One App. ', o), b = TW(ctx, 'One Experience.', o);
    rise(ctx, t, 'One App.', 960 - (a + b) / 2, 150, { ...o, c: C.deep }, B(104), B(107.4));
    rise(ctx, t, 'One Experience.', 960 - (a + b) / 2 + a, 150, { ...o, c: C.leaf }, B(104) + 0.12, B(107.4));
    rise(ctx, t, 'All of Salam. Built around you.', 960, 1050, { size: 36, w: 500, c: C.ink, align: 'center' }, B(105), B(107.4));
    const k = eOut(P(t, B(106), 0.45));
    if (k > 0) {
      ctx.save(); shadowOn(ctx, 0.5); rr(ctx, 310, 900, 1300 * k, 64, 32); ctx.fillStyle = C.neon; ctx.fill(); shadowOff(ctx);
      ctx.beginPath(); ctx.rect(310, 900, 1300 * k, 64); ctx.clip();
      icon(ctx, 'AiBrain01', 352, 932, 30, C.night, 1.2);
      T(ctx, 'AI   ·   Personalised  ·  Predictive  ·  Intelligent assistance  ·  Smart automation  ·  Continuous learning', 384, 941, { size: 24, w: 600, c: C.night });
      ctx.restore();
    }
  }
});
function cardText(ctx, t, x, y) {
  const o = { size: 64, w: 700, ls: -1 };
  rise(ctx, t, 'Turn every reason not to choose us', x + CARD.w / 2 + 60, y + 165, { ...o, c: C.mist, align: 'center' }, B(100) + 0.15);
  rise(ctx, t, 'into a reason to stay.', x + CARD.w / 2 + 60, y + 262, { ...o, c: C.neon, align: 'center' }, B(101));
}
