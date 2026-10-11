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
    rr(ctx, x0, y0, 180, h, 26); ctx.fillStyle = i === 3 ? C.neon : C.deep; ctx.fill();
    ctx.save(); rr(ctx, x0, y0, 180, h, 26); ctx.clip();
    const q = spr(t, B(56) + i * 0.06, 16, 0.8);
    const pop = 1 + 0.12 * Math.max(0, 1 - Math.abs(t - B(60 + i) - 0.12) * 4);
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
  riseWords(ctx, t, [['Our', C.deep], ['Strategy', C.deep], ['House.', C.leaf]], 120, 150, ho, [B(59), B(59) + .08, B(59) + .16], B(61));
  riseWords(ctx, t, [['Built', C.deep], ['from', C.deep], ['Joy.', C.leaf]], 120, 150, ho, [B(61), B(61) + .08, B(61) + .16], B(63));
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
  return 26 * (spr(t, t0, 16, 0.75) - spr(t, t0 + 0.32, 16, 0.75));
}

// --- Three forces: flat ribbons converge into the EAI rings around the real Salam glass logo (68–80) ---
const RIB = [{ n: 'EXPERIENCE', c: C.mist }, { n: 'AI', c: C.neon }, { n: 'VALUE-ADDED SERVICES', c: C.leaf }];
const RM = 120;
function eaiCentre(t) {
  const a = eInOut(P(t, B(73), 0.5)), b = eInOut(P(t, B(78), B(1.6)));
  return [lerp(lerp(960, 520, a), 1220, b), lerp(lerp(540, 500, a), 540, b), lerp(lerp(1, 0.82, a), 0.62, b)];
}
scene(67.9, 81, (ctx, t) => {
  if (t >= B(68)) bg(ctx, C.night);
  if (t < B(68)) return;
  const amp = eInOut(P(t, B(68), B(1.5))) * 80;
  const conv = eInOut(P(t, B(70), B(1.2)));
  const wrap = eInOut(P(t, B(71.2), B(1.1)));
  const collapse = eInOut(P(t, B(78.6), B(1.2)));
  const [cx, cy, sc] = eaiCentre(t);
  RIB.forEach((r, k) => {
    const R = lerp([250, 300, 350][k] * sc, 175, collapse);
    const hw = lerp(40, lerp(14, 2, collapse), wrap);
    const top = [], bot = [];
    for (let j = 0; j <= RM; j++) {
      const s = j / RM;
      const tap = s < 0.18 ? eInOut(s / 0.18) : 1;
      const baseY = lerp(434 + k * 120, 554, conv);
      const braid = conv * 90 * Math.sin(s * Math.PI * 2 * 1.3 - t * 4 + k * 2.094);
      let x = lerp(180, 1740, s), y = baseY + tap * (amp * Math.sin(Math.PI * 2 * 1.1 * s - t * 3 + k * 1.3) * (1 - conv) + braid);
      // rings: each ribbon becomes an arc that keeps turning
      const a = s * Math.PI * 2 * 0.86 + t * (0.6 + k * 0.25) + k * 2.1;
      x = lerp(x, cx + Math.cos(a) * R, wrap); y = lerp(y, cy + Math.sin(a) * R, wrap);
      // normal for the ribbon width
      const nx = lerp(0, Math.cos(a), wrap), ny = lerp(1, Math.sin(a), wrap);
      top.push([x + nx * hw, y + ny * hw]); bot.push([x - nx * hw, y - ny * hw]);
    }
    poly(ctx, top.concat(bot.reverse())); ctx.fillStyle = r.c; ctx.fill();
  });
  RIB.forEach((r, k) => rise(ctx, t, r.n, 180, 434 + k * 120 - 56, { size: 24, w: 700, c: r.c, ls: 6 }, B(68) + 0.1 + k * 0.08, B(70.4)));
  rise(ctx, t, 'One app.', 120, 200, { size: 96, w: 700, c: C.mist, ls: -2 }, B(68), B(71));
  rise(ctx, t, 'Three forces.', 120, 310, { size: 96, w: 700, c: C.neon, ls: -2 }, B(69), B(71) + 0.05);
  // the core: a night disc and the real glass logo
  if (t >= B(71.6)) {
    const k = spr(t, B(71.6), 14, 0.82);
    const dr = lerp(200 * sc, 140, collapse) * k;
    circ(ctx, cx, cy, dr); ctx.fillStyle = mixC(C.night, '#06231F', 1); ctx.fill();
    glass(ctx, cx, cy, lerp(330 * sc, 220, collapse) * k);
  }
  // EAI / ONE INTELLIGENT EXPERIENCE
  {
    const o = { size: 220, w: 800, ls: -8 };
    rise(ctx, t, 'EAI', 1000, 600, { ...o, c: C.mist }, B(73) + 0.1, B(74));
    rise(ctx, t, 'ONE INTELLIGENT EXPERIENCE', 1006, 680, { size: 28, w: 700, c: C.leaf, ls: 10 }, B(73) + 0.25, B(74) + 0.05);
  }
  // the AI assistant, live: real screens from the Salam app
  {
    const k = spr(t, B(74), 14, 0.86), out = eIn(P(t, B(78), 0.45));
    if (k > 0.01 && out < 1) {
      phone(ctx, t, [['s_ai_main', B(74)], ['s_ai_typing', B(75)], ['s_ai_answer', B(77)]], 1390 + out * 900, lerp(1500, 545, k), 900, { shadow: 0.5 });
    }
  }
  {
    const o = { size: 54, w: 600 }, a = TW(ctx, 'A new kind of ', o), b = TW(ctx, 'ecosystem.', o);
    rise(ctx, t, 'A new kind of', 520 - (a + b) / 2, 900, { ...o, c: C.mist }, B(74) + 0.1, B(76));
    rise(ctx, t, 'ecosystem.', 520 - (a + b) / 2 + a, 900, { ...o, c: C.neon }, B(74) + 0.2, B(76) + 0.04);
    const c2 = TW(ctx, 'Together, ', o), d2 = TW(ctx, 'as one.', o);
    rise(ctx, t, 'Together,', 520 - (c2 + d2) / 2, 900, { ...o, c: C.mist }, B(76), B(78));
    rise(ctx, t, 'as one.', 520 - (c2 + d2) / 2 + c2, 900, { ...o, c: C.neon }, B(76) + 0.1, B(78) + 0.04);
  }
});
