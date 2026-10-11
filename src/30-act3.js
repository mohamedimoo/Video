// ===== ACT III — THE STRATEGY HOUSE, FLAT AND RICH (bars 14–20, beats 51–79) =====
const PILLARS = [['EXPERIENCE', 'i_sparkles'], ['INTELLIGENCE', 'i_ai'], ['GROWTH', 'i_rocket'], ['ECOSYSTEM', 'i_globe'], ['TRUST', 'i_shield']];
const FOUND = [['Data', 'Database01'], ['AI', 'AiBrain01'], ['Engineering', 'CodeIcon'], ['Content', 'ContentWriting'], ['Operations', 'Settings01'], ['Security', 'SecurityLock'], ['Governance', 'JusticeScale01']];
const MEAS = ['Business outcomes', 'Customer outcomes', 'Experience KPIs', 'Leading indicators', 'Continuous optimisation'];
const CULT = 'Customer Obsessed  ·  Agile & Adaptive  ·  Empowered Teams  ·  Data-Driven  ·  Learn Fast  ·  Own It';
const PIL_X = i => 360 + i * 255;
// which pillars become the three forces
const FORCE = [0, 1, 3];
const STRIP = k => ({ x: 180, y: 434 + k * 120 - 40, w: 1560, h: 80 });
const STRIP_COL = [C.mist, C.neon, C.leaf];

// a rounded pediment: the roof
function roofPath(ctx, cx, top, w, h) {
  const l = cx - w / 2, r = cx + w / 2, b = top + h, k = 26;
  ctx.beginPath();
  ctx.moveTo(l + k, b);
  ctx.lineTo(r - k, b); ctx.quadraticCurveTo(r, b, r - k * 0.9, b - k * 0.45);
  ctx.lineTo(cx + k * 1.4, top + k * 0.5); ctx.quadraticCurveTo(cx, top - k * 0.1, cx - k * 1.4, top + k * 0.5);
  ctx.lineTo(l + k * 0.9, b - k * 0.45); ctx.quadraticCurveTo(l, b, l + k, b);
  ctx.closePath();
}

scene(51, 69, (ctx, t) => {
  // the line from Act II splits: the top edge flies up, the bottom edge becomes the ground
  const sp = eInOut(P(t, B(51.4), 0.55));
  const yTop = lerp(540, -30, sp), yBot = lerp(540, 900, sp);
  ctx.fillStyle = C.mist; ctx.fillRect(0, yTop, W, yBot - yTop);
  const sink = eIn(P(t, B(66), B(1))) * 1400;   // the house sinks on beat 66
  ctx.save(); ctx.translate(0, sink);

  // measurement row
  {
    const p = eOut(P(t, B(52), 0.45));
    if (p > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(360, 0, 1200 * p, H); ctx.clip();
      const flash = Math.max(0, 1 - Math.abs(t - B(65) - 0.1) * 3);
      rr(ctx, 360, 846, 1200, 54, 16); ctx.fillStyle = mixC(C.stone, C.leaf, flash * 0.6); ctx.fill();
      T(ctx, 'MEASUREMENT', 386, 881, { size: 18, w: 700, c: C.deep, ls: 4 });
      let x = 560;
      MEAS.forEach((m, i) => {
        T(ctx, m, x, 880, { size: 16, w: 600, c: C.deep });
        x += TW(ctx, m, { size: 16, w: 600 }) + 14;
        if (i < MEAS.length - 1) { icon(ctx, 'ArrowRight01', x + 10, 874, 20, C.green, 1.4); x += 36; }
      });
      ctx.restore();
    }
  }
  // culture row
  {
    const p = eOut(P(t, B(53), 0.45));
    if (p > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(360, 0, 1200 * p, H); ctx.clip();
      rr(ctx, 360, 786, 1200, 52, 16); ctx.fillStyle = C.teal; ctx.fill();
      T(ctx, 'CULTURE', 386, 819, { size: 18, w: 700, c: C.neon, ls: 4 });
      T(ctx, CULT, 520, 818, { size: 17, w: 500, c: C.mist });
      ctx.restore();
    }
  }
  // foundation chips with Hugeicons line icons
  const bw = (1200 - 6 * 10) / 7;
  FOUND.forEach(([n, ic], i) => {
    const k = spr(t, B(54) + i * 0.05, 17, 0.8); if (k <= 0.01) return;
    const cx = 360 + i * (bw + 10) + bw / 2, cy = 750;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
    rr(ctx, -bw / 2, -28, bw, 56, 16); ctx.fillStyle = C.white; ctx.fill();
    ctx.strokeStyle = '#CFE0D3'; ctx.lineWidth = 1.5; ctx.stroke();
    const tw = TW(ctx, n, { size: 17, w: 600 });
    icon(ctx, ic, -(tw + 30) / 2 + 11, 0, 22, C.green, 1.2);
    T(ctx, n, -(tw + 30) / 2 + 30, 6, { size: 17, w: 600, c: C.deep });
    ctx.restore();
  });
  // pillars, each with its real 3D icon
  PILLARS.forEach(([n, im], i) => {
    const k = spr(t, B(55) + i * 0.08, 15, 0.85); if (k <= 0.01) return;
    if (FORCE.includes(i) && t >= B(66)) return;     // drawn by the lift-out below
    const lift = pillarLift(t, i);
    const x0 = PIL_X(i), h = 296 * k, y0 = 712 - h - lift;
    const flash = Math.max(0, 1 - Math.abs(t - B(60 + i) - 0.15) * 2.2);
    rr(ctx, x0, y0, 180, h, 26); ctx.fillStyle = mixC(i === 3 ? C.neon : C.deep, i === 3 ? C.deep : C.green, flash * 0.85); ctx.fill();
    ctx.save(); rr(ctx, x0, y0, 180, h, 26); ctx.clip();
    const q = spr(t, B(56) + i * 0.06, 16, 0.8);
    const pop = 1 + 0.28 * Math.max(0, 1 - Math.abs(t - B(60 + i) - 0.15) * 3);
    pic(ctx, im, x0 + 90, y0 + 118 + (1 - q) * 300, 150 * pop);
    T(ctx, n, x0 + 90, y0 + h - 30 + (1 - q) * 200, { size: 18, w: 700, c: i === 3 ? C.night : C.mist, align: 'center', ls: 2 });
    ctx.restore();
  });
  // roof
  if (t >= B(57)) {
    const dy = (1 - spr(t, B(57), 20, 0.9)) * -700;
    roofPath(ctx, 960, 236 + dy, 1300, 164); ctx.fillStyle = C.deep; ctx.fill();
    const q = eOut(P(t, B(58), 0.4));
    if (q > 0) {
      ctx.save(); roofPath(ctx, 960, 236 + dy, 1300, 164); ctx.clip();
      const lw = WORD_W(40), gx = 960 - (lw + 66) / 2;
      glass(ctx, gx + 22, 330 + dy + (1 - q) * 120, 60);
      wordLetters(ctx, gx + 66, 346 + dy + (1 - q) * 120, 40, C.mist);
      T(ctx, 'Making the joy of technology accessible for everyone, everyday.', 960, 384 + dy + (1 - q) * 120, { size: 17, w: 500, c: C.fog, align: 'center' });
      ctx.restore();
    }
  }
  ctx.restore();

  // headlines (kinetic, flat): the house, then what it is built from and measured by
  const ho = { size: 64, w: 700, ls: -1 };
  riseWords(ctx, t, [['Our', C.deep], ['Strategy', C.deep], ['House.', C.leaf]], 120, 150, ho, [B(52), B(52) + .08, B(52) + .16], B(61) - 0.24);
  riseWords(ctx, t, [['Built', C.deep], ['from', C.deep], ['Joy.', C.leaf]], 120, 150, ho, [B(61), B(61) + .08, B(61) + .16], B(63) - 0.24);
  riseWords(ctx, t, [['Measured', C.deep], ['for', C.deep], ['Impact.', C.leaf]], 120, 150, ho, [B(63), B(63) + .08, B(63) + .16], B(66));

  // ground band, which rises and swallows the frame on beat 66
  const gy = lerp(yBot, -40, eIn(P(t, B(66) + 0.05, B(1) - 0.05)));
  ctx.fillStyle = C.night; ctx.fillRect(0, gy, W, H - gy + 10);

  // Experience, Intelligence and Ecosystem lift out and lie down as three flat strips
  if (t >= B(66)) {
    const lay = eInOut(P(t, B(66.5), B(1.5)));
    FORCE.forEach((pi, k) => {
      const up = eOut(P(t, B(66), 0.4)) * 140;
      const x0 = PIL_X(pi), y0 = 712 - 296 - up;
      const s = STRIP(k);
      const x = lerp(x0, s.x, lay), y = lerp(y0, s.y, lay), w = lerp(180, s.w, lay), h = lerp(296, s.h, lay);
      const rot = Math.sin(lay * Math.PI) * 0.22 * (k - 1);
      ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot);
      rr(ctx, -w / 2, -h / 2, w, h, lerp(26, 40, lay)); ctx.fillStyle = mixC(pi === 3 ? C.neon : C.deep, STRIP_COL[k], lay); ctx.fill();
      if (lay < 0.4) pic(ctx, PILLARS[pi][1], 0, -h / 2 + 118, 150 * (1 - lay * 2.5));
      ctx.restore();
    });
  }
});
function pillarLift(t, i) {
  // each pillar lifts a little on its own beat (60–64), settling on a damped spring
  const t0 = B(60 + i);
  if (t < t0) return 0;
  return 44 * (spr(t, t0, 16, 0.75) - spr(t, t0 + 0.4, 16, 0.75));
}

// --- Three forces: flat ribbons wrap into three rings around the EAI core (story 68–80, real 72–88) ---
const RIB = [{ n: 'EXPERIENCE', c: C.mist, im: 'SparklesIcon', lab: 'Experience' }, { n: 'AI', c: C.neon, im: 'AiBrain01', lab: 'AI' }, { n: 'VALUE-ADDED SERVICES', c: C.leaf, im: 'Gift', lab: 'Value-added services' }];
const RM = 120;
function eaiCentre(t) {
  const a = eInOut(P(t, BN(78), 0.55)), b = eInOut(P(t, BN(86.4), BN(1.4)));
  return [lerp(lerp(960, 560, a), 1220, b), lerp(lerp(500, 520, a), 540, b), lerp(lerp(1, 0.86, a), 0.6, b)];
}
const ringAng = (t, k) => t * (0.55 + k * 0.22) + k * 2.1;
scene(67.9, 81, (ctx, t) => {
  if (t >= B(68)) bg(ctx, C.night);
  if (t < B(68)) return;
  const amp = eInOut(P(t, BN(72), BN(1.5))) * 80;
  const conv = eInOut(P(t, BN(74), BN(1.2)));
  const wrap = eInOut(P(t, BN(75.2), BN(1.1)));
  const collapse = eInOut(P(t, BN(86.6), BN(1.2)));
  const [cx, cy, sc] = eaiCentre(t);
  const radii = [240, 292, 344];
  RIB.forEach((r, k) => {
    const R = lerp(radii[k] * sc, 175, collapse);
    const hw = lerp(40, lerp(9, 2, collapse), wrap);
    const top = [], bot = [];
    for (let j = 0; j <= RM; j++) {
      const s = j / RM;
      const tap = s < 0.18 ? eInOut(s / 0.18) : 1;
      const baseY = lerp(434 + k * 120, 554, conv);
      const braid = conv * 90 * Math.sin(s * Math.PI * 2 * 1.3 - t * 4 + k * 2.094);
      let x = lerp(180, 1740, s), y = baseY + tap * (amp * Math.sin(Math.PI * 2 * 1.1 * s - t * 3 + k * 1.3) * (1 - conv) + braid);
      const a = s * Math.PI * 2 * 0.82 + ringAng(t, k);
      x = lerp(x, cx + Math.cos(a) * R, wrap); y = lerp(y, cy + Math.sin(a) * R, wrap);
      const nx = lerp(0, Math.cos(a), wrap), ny = lerp(1, Math.sin(a), wrap);
      top.push([x + nx * hw, y + ny * hw]); bot.push([x - nx * hw, y - ny * hw]);
    }
    poly(ctx, top.concat(bot.reverse())); ctx.fillStyle = r.c; ctx.fill();
  });
  RIB.forEach((r, k) => rise(ctx, t, r.n, 180, 434 + k * 120 - 56, { size: 24, w: 700, c: r.c, ls: 6 }, BN(72) + 0.1 + k * 0.08, BN(74.4)));
  rise(ctx, t, 'One app.', 120, 200, { size: 96, w: 700, c: C.mist, ls: -2 }, BN(72), BN(75));
  rise(ctx, t, 'Three forces.', 120, 310, { size: 96, w: 700, c: C.neon, ls: -2 }, BN(73), BN(75) + 0.05);

  // the core: a neon disc that spells EAI, and later AI
  if (t >= BN(75.6)) {
    const k = spr(t, BN(75.6), 14, 0.82);
    const dr = lerp(158 * sc, 140, collapse) * k;
    circ(ctx, cx, cy, dr); ctx.fillStyle = C.neon; ctx.fill();
    ctx.strokeStyle = C.night; ctx.lineWidth = 3; circ(ctx, cx, cy, dr - 14); ctx.stroke();
    const o = { size: 112 * sc * k, w: 800, ls: -3 };
    const drop = eIn(P(t, BN(86.8), 0.35));
    const we = TW(ctx, 'E', o), wa = TW(ctx, 'AI', o);
    const left = cx - (we + wa) / 2 + drop * we / 2;
    ctx.save(); circ(ctx, cx, cy, dr - 16); ctx.clip();
    T(ctx, 'E', left, cy + 40 * sc + drop * 160, { ...o, c: C.night });
    T(ctx, 'AI', left + we, cy + 40 * sc, { ...o, c: C.night });
    ctx.restore();
  }
  // a rider on each ring: the force's real 3D icon in a white badge, with its name
  RIB.forEach((r, k) => {
    const q = spr(t, BN(76) + k * 0.12, 15, 0.8) * (1 - eIn(P(t, BN(86.3), 0.3)));
    if (q <= 0.01) return;
    const R = radii[k] * sc, a = ringAng(t, k) - 0.5;
    const bx = cx + Math.cos(a) * R, by = cy + Math.sin(a) * R;
    shadowOn(ctx, 0.4); circ(ctx, bx, by, 46 * q * sc); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
    icon(ctx, r.im, bx, by, 50 * q * sc, C.deep, 1.2);
  });
  // the equation that names it
  if (t >= BN(77) && t < BN(78.6)) {
    const parts = [['Experience', C.mist], ['+', C.neon], ['AI', C.mist], ['+', C.neon], ['Value-added services', C.mist], ['=', C.neon], ['EAI', C.neon]];
    const o = { size: 40, w: 700 };
    const sp = 22, ws = parts.map(p => TW(ctx, p[0], o));
    let x = 960 - (ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1)) / 2;
    parts.forEach((p, i) => { rise(ctx, t, p[0], x, 980, { ...o, c: p[1] }, BN(77) + i * 0.06, BN(78)); x += ws[i] + sp; });
  }
  // one intelligent experience
  rise(ctx, t, 'One intelligent', 1000, 470, { size: 96, w: 700, c: C.mist, ls: -2 }, BN(79), BN(81));
  rise(ctx, t, 'experience.', 1000, 580, { size: 96, w: 700, c: C.neon, ls: -2 }, BN(79) + 0.12, BN(81) + 0.04);
  rise(ctx, t, 'A new kind of ecosystem.', 1004, 660, { size: 40, w: 500, c: C.fog }, BN(80), BN(81) + 0.08);
  // the AI assistant, live: real screens from the Salam app
  {
    const k = spr(t, BN(81.3), 14, 0.86), out = eIn(P(t, BN(86), 0.45));
    if (k > 0.01 && out < 1) phone(ctx, t, [['s_ai_main', BN(81.3)], ['s_ai_typing', BN(83)], ['s_ai_answer', BN(85)]], 1390 + out * 900, lerp(1500, 545, k), 900, { shadow: 0.5 });
  }
  const co = { size: 48, w: 600, align: 'center' };
  rise(ctx, t, 'Ask anything.', 560, 960, { ...co, c: C.mist }, BN(82), BN(84) - 0.24);
  rise(ctx, t, 'Get the right plan.', 560, 960, { ...co, c: C.mist }, BN(84), BN(85.6) - 0.24);
  {
    const a = TW(ctx, 'Together, ', co), b = TW(ctx, 'as one.', co);
    rise(ctx, t, 'Together,', 560 - (a + b) / 2, 960, { ...co, align: 'left', c: C.mist }, BN(85.6), BN(86.4));
    rise(ctx, t, 'as one.', 560 - (a + b) / 2 + a, 960, { ...co, align: 'left', c: C.neon }, BN(85.7), BN(86.45));
  }
});
