// ===== ACT V — END TITLE (bars 28–33.5, beats 108–134) =====
const GROUND = 980;
const STAIRS = [
  { n: 'CORE', x: 260, top: 760, c: C.stone, tc: C.deep, sc: '#4E5F5A', b: ['Mobile + Home, merged', 'Unified identity & billing', 'AI assistant'], ph: 0 },
  { n: 'BEYOND', x: 760, top: 620, c: C.night, tc: C.mist, sc: C.fog, b: ['Mini-apps', 'Content partnerships', 'AI-guided recommendations'], ph: 2 },
  { n: 'ECOSYSTEM', x: 1260, top: 480, c: C.neon, tc: C.night, sc: C.deep, b: ['Salam-owned platforms', 'First-party content', 'Social & engagement'], ph: 1 },
];
scene(107.4, 112.8, (ctx, t) => {
  bg(ctx, C.mist);
  STAIRS.forEach((s, k) => {
    const rise_ = spr(t, B(108 + k), 15, 0.86);
    const h = (GROUND - s.top) * rise_;
    if (h > 1) {
      rr(ctx, s.x, GROUND - h, 500, h + 40, 0); ctx.fillStyle = s.c; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(s.x, GROUND - h, 500, h); ctx.clip();
      const y0 = GROUND - h;
      T(ctx, s.n, s.x + 30, y0 + 56, { size: 26, w: 800, c: s.tc, ls: 6 });
      s.b.forEach((b, i) => T(ctx, b, s.x + 30, y0 + 100 + i * 34, { size: 21, w: 500, c: s.sc }));
      ctx.restore();
    }
    // the matching phone from the previous scene walks onto its step
    const ph = PHONES3[s.ph];
    const m = eInOut(P(t, B(107.4) + k * 0.1, B(1) + 0.2));
    const tx = s.x + 400, th = 400, ty = GROUND - h + 60 - th / 2;   // rides on top of its block
    const x = lerp(ph.x, tx, m), y = lerp(ph.y, ty, m);
    phone(ctx, t, [[ph.s, 0]], x, y, lerp(ph.h, th, m), { rot: lerp(ph.rot, 0, m), shadow: 0.6 });
  });
  rise(ctx, t, 'BECOME A SUPERAPP', 120, 170, { size: 24, w: 700, c: C.leaf, ls: 8 }, B(108));
  rise(ctx, t, 'Step by step.', 120, 250, { size: 72, w: 700, c: C.deep, ls: -2 }, B(108) + 0.1);
  // the thread climbs the staircase on beat 111
  const tp = eInOut(P(t, B(111), 0.55));
  if (tp > 0) {
    const path = [[180, GROUND], [260, 760], [760, 760], [760, 620], [1260, 620], [1260, 480], [1760, 480], [2000, 220]];
    let tot = 0; for (let i = 1; i < path.length; i++) tot += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    const head = tp * tot, tail = Math.max(0, head - 900);
    ctx.strokeStyle = C.green; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    let acc = 0, started = false;
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1], b = path[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const s0 = clamp((tail - acc) / l), s1 = clamp((head - acc) / l);
      if (s1 > s0) {
        const p0 = [lerp(a[0], b[0], s0), lerp(a[1], b[1], s0)], p1 = [lerp(a[0], b[0], s1), lerp(a[1], b[1], s1)];
        if (!started) { ctx.moveTo(...p0); started = true; } else ctx.lineTo(...p0);
        ctx.lineTo(...p1);
      }
      acc += l;
    }
    ctx.stroke();
  }
  // the black "Beyond" block opens up into the night
  const op = eIn(P(t, B(111.6), B(0.4) + 0.1));
  if (op > 0) {
    const s = STAIRS[1];
    rr(ctx, lerp(s.x, -40, op), lerp(s.top, -40, op), lerp(500, W + 80, op), lerp(GROUND - s.top + 40, H + 80, op), 0);
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
  // everyday moments: a family photo, the arc of moments around it
  const toDots = eInOut(P(t, B(120), B(0.9)));
  {
    const k = spr(t, B(114) + 0.1, 14, 0.86), out = eIn(P(t, B(120), 0.4));
    if (k > 0.01 && out < 1) {
      const cy = lerp(1500, 790, k) + out * 900;
      ctx.save();
      rr(ctx, 960 - 240, cy - 300, 480, 600, 48); ctx.fillStyle = C.mist; ctx.fill(); ctx.clip();
      pic(ctx, 'p_family', 960, cy + 120, 780);
      ctx.restore();
    }
  }
  const ap = eInOut(P(t, B(114) + 0.1, B(1.6)));
  if (ap > 0 && toDots < 1) {
    ctx.strokeStyle = C.teal; ctx.lineWidth = 3; ctx.beginPath();
    ctx.arc(ARC.cx, ARC.cy, ARC.R, ARC.a0 - 0.12, lerp(ARC.a0 - 0.12, ARC.a1 + 0.12, ap * (1 - toDots))); ctx.stroke();
  }
  MOMENTS.forEach(([m, ic], i) => {
    const t0 = B(114) + 0.1 + B(1.6) * (i / 6) * 0.8;
    const k = spr(t, t0, 16) * (1 - eIn(P(t, B(120), 0.3)));
    if (k <= 0.001) return;
    const [x, y] = momentPos(i);
    const lit = B(116 + Math.floor(i / 2)) + (i % 2) * 0.15;
    const lp = spr(t, lit, 18);
    const pop = 1 + 0.12 * (t > lit ? Math.max(0, 1 - (t - lit) * 4) : 0);
    circ(ctx, x, y, 62 * k * pop); ctx.fillStyle = mixC(C.deep, C.green, clamp(lp)); ctx.fill();
    icon(ctx, ic, x, y, 54 * k, t > lit ? C.night : C.mist, 1.1);
    rise(ctx, t, m, x, y - 84, { size: 24, w: 600, c: C.mist, align: 'center' }, t0 + 0.1, B(120));
  });
  rise(ctx, t, 'Everyday moments.', 960, 150, { size: 84, w: 700, c: C.mist, align: 'center', ls: -2 }, B(116), B(120));
  rise(ctx, t, 'All in one place.', 960, 250, { size: 84, w: 700, c: C.neon, align: 'center', ls: -2 }, B(119), B(120) + 0.05);
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
  bg(ctx, C.night);
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
  // the real glass logo is revealed through the shape the dots have drawn
  if (solid > 0) {
    const cx = lerp(END.gx, 960, collapse), cy = lerp(END.gy, 500, collapse);
    const h = lerp(END.gh, 200 * 0.82, collapse);
    if (collapse > 0) {
      const k = spr(t, B(133) + 0.12, 16, 0.9);
      rr(ctx, 960 - 100 * k, 500 - 100 * k, 200 * k, 200 * k, 200 * 0.26 * k); ctx.fillStyle = C.deep; ctx.fill();
    }
    ctx.save();
    const sc = lerp(0.85, 1.35, solid);
    poly(ctx, glassPts(cx, cy, h * sc, 60)); ctx.clip();
    glass(ctx, cx, cy, h);
    ctx.restore();
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
  // end title: the real wordmark letters rise one by one
  {
    const rv = [0, 1, 2, 3, 4].map(i => eOut(P(t, B(129.5) + i * 0.06, 0.4)) * (1 - eIn(P(t, B(132.9) + i * 0.02, 0.25))));
    if (rv.some(v => v > 0)) wordLetters(ctx, END.wx, END.wy, END.wh, C.mist, rv);
  }
  const tw = { size: 46, w: 500 };
  riseWords(ctx, t, [['Making', C.mist], ['the', C.mist], ['joy', C.mist], ['of', C.mist], ['technology', C.mist], ['accessible', C.mist]], 960, 770, { ...tw, align: 'center' }, [0, 1, 2, 3, 4, 5].map(i => B(130) + i * 0.07), B(132.6));
  riseWords(ctx, t, [['for', C.mist], ['everyone,', C.mist], ['everyday.', C.neon]], 960, 840, { ...tw, align: 'center' }, [0, 1, 2].map(i => B(131) + i * 0.1), B(132.7));
  {
    const w1 = TW(ctx, 'for everyone, ', tw), w2 = TW(ctx, 'everyday.', tw), x = 960 - (w1 + w2) / 2 + w1;
    const p = eOut(P(t, B(132), 0.35)), q = eIn(P(t, B(132.7), 0.3));
    if (p > 0 && q < 1) { ctx.fillStyle = C.neon; ctx.fillRect(x, 860 + q * 200, w2 * p, 6); }
  }
  // the app icon label returns: last frame == first frame
  if (collapse > 0) {
    const lp = eOut(P(t, B(133) + 0.2, 0.25));
    ctx.save(); ctx.beginPath(); ctx.rect(960 - 200, 500 + 100 + 12, 400, 70); ctx.clip();
    const lh = 30, lw = WORD_W(lh);
    wordLetters(ctx, 960 - lw / 2, 500 + 100 + 60 + (1 - lp) * 70, lh, C.dim);
    ctx.restore();
  }
});
