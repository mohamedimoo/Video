// ===== ACT V — END TITLE (story beats 108–134, real beats 120–154) =====
const GROUND = 1000;
const STAIRS = [
  { n: 'CORE', no: '01', x: 260, top: 700, c: C.stone, tc: C.deep, sc: '#3F504B', ck: C.green, b: ['Mobile + Home, merged', 'Unified identity & billing', 'AI assistant'], ph: 0, t0: 120, ic: 'SmartPhone01' },
  { n: 'BEYOND', no: '02', x: 760, top: 540, c: C.night, tc: C.mist, sc: C.fog, ck: C.neon, b: ['Mini-apps', 'Content partnerships', 'AI-guided recommendations'], ph: 2, t0: 122, ic: 'DashboardSquare01' },
  { n: 'ECOSYSTEM', no: '03', x: 1260, top: 380, c: C.neon, tc: C.night, sc: C.deep, ck: C.deep, b: ['Salam-owned platforms', 'First-party content', 'Social & engagement'], ph: 1, t0: 124, ic: 'Globe02' },
];
function stairTop(t, s) { return GROUND - (GROUND - s.top) * spr(t, BN(s.t0), 15, 0.86); }
scene(107.4, 112.8, (ctx, t) => {
  bg(ctx, C.mist);
  STAIRS.forEach((s, k) => {
    const top = stairTop(t, s), h = GROUND - top;
    if (h > 1) {
      ctx.beginPath(); ctx.roundRect(s.x, top, 500, h + 60, [28, 28, 0, 0]); ctx.fillStyle = s.c; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(s.x, top, 500, h); ctx.clip();
      T(ctx, s.no, s.x + 30, top + 74, { size: 60, w: 800, c: s.tc, ls: -2 });
      {
        const q = spr(t, BN(s.t0) + 0.25, 16, 0.8);
        if (q > 0.01) { ctx.save(); ctx.translate(s.x + 432, top + 66); ctx.scale(q, q);
          ctx.strokeStyle = s.ck; ctx.lineWidth = 3; circ(ctx, 0, 0, 40); ctx.stroke(); icon(ctx, s.ic, 0, 0, 42, s.ck, 1.1); ctx.restore(); }
      }
      T(ctx, s.n, s.x + 32, top + 116, { size: 24, w: 800, c: s.tc, ls: 6 });
      // each addition ticks in on the beat after its step lands
      s.b.forEach((b, i) => {
        const q = spr(t, BN(s.t0 + 1) + i * 0.18, 18, 0.8);
        if (q <= 0.01) return;
        const y = top + 160 + i * 40;
        ctx.save(); ctx.translate(s.x + 44, y - 7); ctx.scale(q, q); icon(ctx, 'Tick02', 0, 0, 24, s.ck, 1.4); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.rect(s.x + 64, y - 30, 420, 40); ctx.clip();
        T(ctx, b, s.x + 66, y + (1 - q) * 30, { size: 21, w: 500, c: s.sc }); ctx.restore();
      });
      ctx.restore();
    }
  });
  // growth: the thread climbs the stairs, and a rocket lifts off the top step
  const tp = eInOut(P(t, BN(126), 0.7));
  if (tp > 0) {
    const tops = STAIRS.map(s => stairTop(t, s));
    const path = [[160, GROUND], [260, tops[0] - 12], [760, tops[0] - 12], [760, tops[1] - 12], [1260, tops[1] - 12], [1260, tops[2] - 12], [1500, tops[2] - 12]];
    let tot = 0; for (let i = 1; i < path.length; i++) tot += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    const head = tp * tot;
    ctx.strokeStyle = C.green; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    let acc = 0, hx = path[0][0], hy = path[0][1]; ctx.moveTo(hx, hy);
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1], b = path[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const u = clamp((head - acc) / l); if (u <= 0) break;
      hx = lerp(a[0], b[0], u); hy = lerp(a[1], b[1], u); ctx.lineTo(hx, hy); acc += l;
    }
    ctx.stroke(); circ(ctx, hx, hy, 12); ctx.fillStyle = C.green; ctx.fill();
  }
  // the hub's three phones drop out of frame on the downbeat; no app screens on the stairs
  if (t < BN(120.6)) PHONES3.forEach((ph, k) => {
    const d = eIn(P(t, BN(119.4) + k * 0.06, 0.45));
    if (d >= 1) return;
    phone(ctx, t, [[ph.s, 0]], ph.x, ph.y + d * 1100, ph.h * (1 - d * 0.2), { rot: ph.rot * (1 + d * 2), shadow: 0.6 });
  });
  rise(ctx, t, 'BECOME A SUPERAPP', 120, 170, { size: 24, w: 700, c: C.leaf, ls: 8 }, BN(120));
  rise(ctx, t, 'Step by step.', 120, 250, { size: 72, w: 700, c: C.deep, ls: -2 }, BN(120) + 0.1);
  {
    const k = spr(t, BN(125.6), 16, 0.8), up = eIn(P(t, BN(126.6), BN(1)));
    // the growth line's head becomes an arrow that shoots off the top step
    if (k > 0.01) { ctx.save(); ctx.translate(1520 + up * 500, STAIRS[2].top - 12 - up * 700); ctx.rotate(-Math.PI / 4 * up); ctx.scale(k, k);
      ctx.beginPath(); ctx.moveTo(34, 0); ctx.lineTo(-14, -26); ctx.lineTo(-14, 26); ctx.closePath(); ctx.fillStyle = C.green; ctx.fill(); ctx.restore(); }
    rise(ctx, t, 'SUPERAPP', 1292, 940, { size: 64, w: 800, c: C.night, ls: 2 }, BN(127), BN(127.8));
  }
  // the black "Beyond" block opens up into the night
  const op = eIn(P(t, BN(127.6), BN(0.4) + 0.1));
  if (op > 0) {
    const s = STAIRS[1];
    rr(ctx, lerp(s.x, -40, op), lerp(s.top, -40, op), lerp(500, W + 80, op), lerp(GROUND - s.top + 60, H + 80, op), 0);
    ctx.fillStyle = C.night; ctx.fill();
  }
});

// --- Beyond Telco. Closer to Life. / Everyday moments with real Salam customers (beats 112–121) ---
const MOMENTS = [['Mobile', 'SmartPhone01'], ['Home', 'Home01'], ['Travel', 'Airplane01'], ['Entertainment', 'PlayCircle'], ['Wellbeing', 'Yoga01'], ['Deals', 'DiscountTag01'], ['Faith', 'Mosque01']];
const ARC = { cx: 960, cy: 1180, R: 780, a0: 205 * Math.PI / 180, a1: 335 * Math.PI / 180 };
const momentPos = i => { const a = lerp(ARC.a0, ARC.a1, i / 6); return [ARC.cx + Math.cos(a) * ARC.R, ARC.cy + Math.sin(a) * ARC.R]; };
scene(111.6, 121.4, (ctx, t) => {
  if (t >= B(112)) bg(ctx, C.night);
  if (t < B(112)) return;
  // Beyond Telco: a real customer, on a mist card
  {
    const k = spr(t, B(112) + 0.15, 14, 0.86), out = eIn(P(t, B(114), 0.4));
    if (k > 0.01 && out < 1) {
      const cy = lerp(1500, 560, k) - out * 1300;
      ctx.save();
      rr(ctx, 1220, cy - 440, 600, 880, 52); ctx.fillStyle = C.mist; ctx.fill(); ctx.clip();
      pic(ctx, 'p_friends', 1520, cy + 120 + (1 - k) * 160, 1130);
      ctx.restore();
    }
  }
  const o = { size: 160, w: 800, ls: -6 };
  rise(ctx, t, 'Beyond Telco.', 110, 470, { ...o, c: C.mist }, B(112), B(114));
  rise(ctx, t, 'Closer to Life.', 110, 670, { ...o, c: C.leaf }, B(113), B(114) + 0.05);
  // everyday moments, light themed: Mist rises from the arc like a sunrise
  const sun = eIn(P(t, B(114) - 0.3, 0.5));
  if (sun > 0) { circ(ctx, ARC.cx, ARC.cy, lerp(0, 2400, sun)); ctx.fillStyle = C.mist; ctx.fill(); }
  const toDots = eInOut(P(t, B(120), B(0.9)));
  {
    const k = spr(t, B(114) + 0.25, 14, 0.86), out = eIn(P(t, B(120), 0.4));
    if (k > 0.01 && out < 1) {
      const cy = lerp(1500, 790, k) + out * 900;
      ctx.save();
      shadowOn(ctx, 0.5); rr(ctx, 960 - 240, cy - 300, 480, 600, 48); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
      rr(ctx, 960 - 240, cy - 300, 480, 600, 48); ctx.clip();
      pic(ctx, 'p_family', 960, cy + 120, 780);
      ctx.restore();
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
const END = { gx: 640, gy: 460, gh: 380, wx: 860, wy: 560, wh: 150 };
scene(120, 134.01, (ctx, t) => {
  // the night returns as a disc opening from the month, never a crossfade
  const dusk = eIn(P(t, B(120), 0.55));
  if (dusk < 1) { bg(ctx, C.mist); circ(ctx, 960, 560, lerp(0, 1300, dusk)); ctx.fillStyle = C.night; ctx.fill(); }
  else bg(ctx, C.night);
  const fold = eInOut(P(t, B(128.5), B(0.8)));
  const punch = t >= B(128) ? spr(t, B(128), 14, 0.7) * (1 - eInOut(P(t, B(128.5), B(0.6)))) : 0;
  const solid = spr(t, B(129.25), 15, 0.9);
  const collapse = eInOut(P(t, B(133), 0.42));
  const glassFinal = glassPts(END.gx, END.gy, END.gh, 30);
  const lit = DAY_T.filter(x => t >= x).length;
  // the 30 days
  if (solid < 0.98) {
    for (let d = 0; d < 30; d++) {
      const src = momentPos(Math.min(6, Math.floor(d * 7 / 30)));
      const gp = dayPos(d);
      const form = eInOut(P(t, B(120) + d * 0.008, B(0.9)));
      let x = lerp(src[0], gp[0], form), y = lerp(src[1], gp[1], form);
      let r = lerp(20, GRIDC.r, form);
      const lt = DAY_T[d], on = t >= lt;
      const pop = on ? 1 + 0.25 * Math.max(0, 1 - (t - lt) * 5) : 1;
      const hit = punch * 0.22;
      x = lerp(x + (x - 960) * hit, glassFinal[d][0], fold);
      y = lerp(y + (y - 560) * hit, glassFinal[d][1], fold);
      r = lerp(r * pop, 22, fold) * (1 - solid);
      circ(ctx, x, y, r); ctx.fillStyle = on ? C.neon : C.teal; ctx.fill();
    }
  }
  // day counter and the "once a month" callback
  if (t < B(128.6)) {
    rise(ctx, t, 'DAY', 220, 420, { size: 30, w: 700, c: C.leaf, ls: 10 }, B(120.6), B(128));
    rise(ctx, t, String(Math.max(1, lit)).padStart(2, '0'), 210, 600, { size: 190, w: 800, c: C.mist, ls: -8 }, B(120.8), B(128) + 0.05);
    rise(ctx, t, 'once a month', 1730, 470, { size: 50, w: 600, c: C.fog, align: 'right' }, B(121), B(128));
    const sp = eOut(P(t, B(124), 0.4)), so = eIn(P(t, B(128), 0.3));
    if (sp > 0 && so < 1) { const w = TW(ctx, 'once a month', { size: 50, w: 600 }); ctx.fillStyle = C.neon; ctx.fillRect(1730 - w - 8, 452 - so * 80, (w + 16) * sp, 7); }
    rise(ctx, t, 'every', 1730, 620, { size: 110, w: 800, c: C.neon, align: 'right', ls: -4 }, B(126), B(128) + 0.05);
    rise(ctx, t, 'day.', 1730, 730, { size: 110, w: 800, c: C.neon, align: 'right', ls: -4 }, B(126) + 0.3, B(128) + 0.1);
  }
  // ---- outro (real beats 145–154) ----
  const L = lockup(t);
  // the real glass logo is revealed through the shape the dots have drawn
  if (solid > 0) {
    const cx = lerp(L.gx, 960, collapse), cy = lerp(L.gy, 500, collapse);
    const h = lerp(L.gh, 200 * 0.82, collapse);
    if (collapse > 0) {
      const k = spr(t, BN(153) + 0.12, 16, 0.9);
      rr(ctx, 960 - 100 * k, 500 - 100 * k, 200 * k, 200 * k, 200 * 0.26 * k); ctx.fillStyle = C.deep; ctx.fill();
    }
    ctx.save();
    poly(ctx, glassPts(cx, cy, h * lerp(0.85, 1.35, solid), 60)); ctx.clip();
    glass(ctx, cx, cy, h);
    ctx.restore();
  }
  // the real wordmark letters rise one by one, then ride with the lockup
  {
    const rv = [0, 1, 2, 3, 4].map(i => eOut(P(t, BN(145.5) + i * 0.06, 0.4)) * (1 - eIn(P(t, BN(152.9) + i * 0.02, 0.25))));
    if (rv.some(v => v > 0)) wordLetters(ctx, L.wx, L.wy, L.wh, C.mist, rv);
  }
  // the line that matters: "the joy of technology"
  if (t >= BN(146) && t < BN(153.6)) {
    const settle = eInOut(P(t, BN(151), 0.7));
    const gone = eIn(P(t, BN(153), 0.38));
    const s0 = lerp(1, 0.5, settle) * (1 - gone);
    const cx = 960, cy = lerp(600, 760, settle) + gone * 80;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s0, s0);
    joyPhrase(ctx, t, settle);
    ctx.restore();
  }
  // the app icon label returns: last frame == first frame
  if (collapse > 0) {
    const lp = eOut(P(t, BN(153) + 0.2, 0.25));
    ctx.save(); ctx.beginPath(); ctx.rect(960 - 200, 500 + 100 + 12, 400, 70); ctx.clip();
    const lh = 30, lw = WORD_W(lh);
    wordLetters(ctx, 960 - lw / 2, 500 + 100 + 60 + (1 - lp) * 70, lh, C.dim);
    ctx.restore();
  }
});

// the lockup (glass logo + wordmark) has three places: centre, tucked up top, and the final end title
function lockup(t) {
  const P0 = { gx: 640, gy: 460, gh: 380, wx: 860, wy: 560, wh: 150 };
  const P1 = { gx: 822, gy: 150, gh: 120, wx: 900, wy: 186, wh: 56 };
  const P2 = { gx: 690, gy: 330, gh: 270, wx: 856, wy: 410, wh: 112 };
  const a = eInOut(P(t, BN(146), 0.6)), b = eInOut(P(t, BN(151), 0.7));
  const o = {};
  for (const k in P0) o[k] = lerp(lerp(P0[k], P1[k], a), P2[k], b);
  return o;
}
const JOY_ICONS = [['SmartPhone01', -720, -250, 0], ['Home01', 720, -250, 0.25], ['Airplane01', -760, 170, 0.5], ['FavouriteIcon', 760, 170, 0.75]];
function joyPhrase(ctx, t, settle) {
  const big = { size: 150, w: 800, ls: -5 };
  const wA = TW(ctx, 'the joy ', big), wB = TW(ctx, 'of technology', big), x0 = -(wA + wB) / 2;
  rise(ctx, t, 'Making', 0, -215, { size: 58, w: 500, c: C.fog, align: 'center' }, BN(146) + 0.1, 1e9);
  // the two halves slam in on the beat and the off-beat
  // each half grows from its outer edge, so the gap between them never closes
  const slamIn = (t0, str, x, anchorRight) => {
    if (t < t0) return;
    const p = eOut(P(t, t0, 0.24)), k = lerp(1.8, 1, p), w = TW(ctx, str, big);
    const ax = anchorRight ? x + w : x;
    ctx.save(); ctx.translate(ax, -50); ctx.scale(k, k); T(ctx, str, anchorRight ? -w : 0, 50, { ...big, c: C.mist }); ctx.restore();
  };
  slamIn(BN(147), 'the joy', x0, true);
  slamIn(BN(147.5), 'of technology', x0 + wA, false);
  // the hit: a neon highlight sweeps behind the phrase and the type turns night-green inside it
  const hp = eOut(P(t, BN(148), 0.38));
  if (hp > 0) {
    const hx = x0 - 34, hw = (wA + wB + 68) * hp;
    ctx.save();
    rr(ctx, hx, -132, hw, 182, 34); ctx.fillStyle = C.neon; ctx.fill();
    ctx.beginPath(); ctx.rect(hx, -140, hw, 200); ctx.clip();
    T(ctx, 'the joy ', x0, 0, { ...big, c: C.night }); T(ctx, 'of technology', x0 + wA, 0, { ...big, c: C.night });
    ctx.restore();
  }
  // a spark pops above "joy"
  const sk = spr(t, BN(148.25), 15, 0.75) * (1 - settle);
  if (sk > 0.01) pic(ctx, 'i_sparkles', x0 + TW(ctx, 'the joy', big) + 18, -150, 120 * sk);
  rise(ctx, t, 'accessible', 0, 140, { size: 72, w: 700, c: C.mist, align: 'center' }, BN(149), 1e9);
  {
    const o = { size: 58, w: 500 }, a = TW(ctx, 'for everyone, ', o), b = TW(ctx, 'everyday.', o);
    rise(ctx, t, 'for everyone,', -(a + b) / 2, 230, { ...o, c: C.mist }, BN(149.5), 1e9);
    rise(ctx, t, 'everyday.', -(a + b) / 2 + a, 230, { ...o, c: C.neon }, BN(149.6), 1e9);
    const up = eOut(P(t, BN(152), 0.35));
    if (up > 0) { ctx.fillStyle = C.neon; ctx.fillRect(-(a + b) / 2 + a, 252, b * up, 8); }
  }
  // the joy, made of real Salam 3D icons, gathers around the phrase
  JOY_ICONS.forEach(([im, x, y, d]) => {
    const k = spr(t, BN(150) + d * BEAT, 15, 0.8) * (1 - eIn(P(t, BN(151), 0.35)));
    if (k > 0.01) { ctx.strokeStyle = C.neon; ctx.lineWidth = 4; circ(ctx, x, y, 70 * k); ctx.stroke(); icon(ctx, im, x, y, 64 * k, C.neon, 1.1); }
  });
}
