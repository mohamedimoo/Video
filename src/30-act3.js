// ===== ACT III — THE STRATEGY HOUSE, FLAT AND RICH (bars 14–20, beats 51–79) =====
const PILLARS = [['EXPERIENCE', 'FavouriteIcon'], ['INTELLIGENCE', 'AiBrain01'], ['GROWTH', 'ChartUp'], ['ECOSYSTEM', 'Globe02'], ['TRUST', 'Shield01']];
const FOUND = [['Data', 'Database01'], ['AI', 'AiBrain01'], ['Engineering', 'CodeIcon'], ['Content', 'ContentWriting'], ['Operations', 'Settings01'], ['Security', 'SecurityLock'], ['Governance', 'JusticeScale01']];
const MEAS = ['Business outcomes', 'Customer outcomes', 'Experience KPIs', 'Leading indicators', 'Continuous optimisation'];
const CULT = 'Customer Obsessed  ·  Agile & Adaptive  ·  Empowered Teams  ·  Data-Driven  ·  Learn Fast  ·  Own It';
const PIL_X = i => 360 + i * 255;
// each pillar's own colour: white until its beat, then it fills from the ground up
const ACCENT = [C.green, C.teal, C.leaf, C.neon, C.deep];
const ON_ACCENT = [C.white, C.white, C.white, C.night, C.white];
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
  const sp = eInOut(P(crispT(t), B(51.4), 0.55));
  const yTop = lerp(540, -30, sp), yBot = lerp(540, 900, sp);
  ctx.fillStyle = C.mist; ctx.fillRect(0, yTop, W, yBot - yTop);
  if (sp > 0.99) dotGrid(ctx, '#D6E0D9', 1300);
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
      let x = 596;
      MEAS.forEach((m, i) => {
        T(ctx, m, x, 880, { size: 15, w: 600, c: C.deep });
        x += TW(ctx, m, { size: 15, w: 600 }) + 12;
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
      rr(ctx, 360, 786, 1200, 52, 16); ctx.fillStyle = C.deep; ctx.fill();
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
  // pillars: white cards that fill with their own colour, one per beat
  PILLARS.forEach(([n, im], i) => {
    const k = spr(t, B(55) + i * 0.08, 15, 0.85); if (k <= 0.01) return;
    if (FORCE.includes(i) && t >= B(66)) return;     // drawn by the lift-out below
    const lift = pillarLift(t, i);
    const x0 = PIL_X(i), h = 296 * k, y0 = 712 - h - lift;
    const acc = ACCENT[i], on = ON_ACCENT[i];
    const q = spr(t, B(56) + i * 0.06, 16, 0.8);
    const pop = 1 + 0.22 * Math.max(0, 1 - Math.abs(t - B(60 + i) - 0.15) * 3);
    const fill = eOut(P(t, B(60 + i), 0.45)), fy = y0 + h * (1 - fill);
    const body = () => rr(ctx, x0, y0, 180, h, 26);
    // the card
    shadowOn(ctx); body(); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
    if (fill < 1) { body(); ctx.strokeStyle = '#D5E3D8'; ctx.lineWidth = 1.5; ctx.stroke(); }
    // its content, drawn twice: on white, and again inside the rising colour (where colours invert)
    const content = (filled) => {
      const iy = y0 + 104 + (1 - q) * 300;
      ctx.save(); ctx.translate(x0 + 90, iy); ctx.scale(pop, pop);
      circ(ctx, 0, 0, 46); ctx.fillStyle = filled ? (i === 3 ? C.deep : C.white) : acc; ctx.fill();
      icon(ctx, im, 0, 0, 50, filled ? (i === 3 ? C.neon : acc) : (i === 3 ? C.night : C.white), 1.15);
      ctx.restore();
      T(ctx, n, x0 + 90, y0 + h - 40 + (1 - q) * 200, { size: 18, w: 700, c: filled ? on : C.deep, align: 'center', ls: 2 });
      if (!filled) { const bw = 132 * eOut(P(t, B(56) + i * 0.06 + 0.15, 0.4)); rr(ctx, x0 + 90 - bw / 2, y0 + h - 22, bw, 6, 3); ctx.fillStyle = acc; ctx.fill(); }
    };
    ctx.save(); body(); ctx.clip(); content(false); ctx.restore();
    if (fill > 0) {
      ctx.save(); body(); ctx.clip(); ctx.beginPath(); ctx.rect(x0 - 2, fy, 184, h + 4); ctx.clip();
      ctx.fillStyle = acc; ctx.fillRect(x0 - 2, fy, 184, h + 4);
      content(true);
      ctx.restore();
    }
  });
  // roof
  if (t >= B(57)) {
    const dy = (1 - spr(t, B(57), 20, 0.9)) * -700;
    roofPath(ctx, 960, 236 + dy, 1300, 164); ctx.fillStyle = C.deep; ctx.fill();
    { const e = eOut(P(t, B(57) + 0.25, 0.5)); if (e > 0) { ctx.fillStyle = C.neon; ctx.fillRect(960 - 600 * e, 236 + dy + 160, 1200 * e, 4); } }
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
  const gy = lerp(yBot, -40, eIn(P(crispT(t), B(66) + 0.05, B(1) - 0.05)));
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
      rr(ctx, -w / 2, -h / 2, w, h, lerp(26, 40, lay)); ctx.fillStyle = mixC(ACCENT[pi], STRIP_COL[k], lay); ctx.fill();
      if (lay < 0.4) { const ik = 1 - lay * 2.5; circ(ctx, 0, -h / 2 + 104, 46 * ik); ctx.fillStyle = pi === 3 ? C.deep : C.white; ctx.fill(); icon(ctx, PILLARS[pi][1], 0, -h / 2 + 104, 50 * ik, pi === 3 ? C.neon : ACCENT[pi], 1.15); }
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

// --- Three forces: the ribbons curl into a dot-matrix Venn; where all three overlap is EAI; then they merge into one orb ---
const RIB = [
  { n: 'EXPERIENCE', c: C.mist, im: 'SparklesIcon' },
  { n: 'AI', c: C.neon, im: 'AiBrain01' },
  { n: 'VALUE-ADDED SERVICES', c: C.leaf, im: 'Gift' },
];
const RM = 120, VENN_R = 205, VENN_D = 118, VENN_TH = [-Math.PI / 2, Math.PI / 6, 5 * Math.PI / 6];
function eaiCentre(t) {
  const a = spr(t, BN(78), 9, 0.92), b = spr(t, BN(86.4), 7, 0.95);
  return [lerp(lerp(960, 560, a), WHEEL_C[0], b), lerp(lerp(520, 520, a), WHEEL_C[1], b), lerp(lerp(1, 0.86, a), 0.93, b)];
}
// the Venn turns slowly, and spins up while the assistant thinks
const vennRot = t => 0.07 * (t - BN(74)) + 2.4 * eInOut(P(t, BV(87), BV(2.2)));
function vennCircles(t, cx, cy, sc) {
  const merge = spr(t, BN(78), 8, 0.92), d = VENN_D * sc * (1 - merge), rot = vennRot(t);
  return RIB.map((r, k) => { const a = VENN_TH[k] + rot; return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, a }; });
}
// a fixed dot matrix that lights by membership: one force dim, two brighter, all three neon
function vennDots(ctx, t, cx, cy, sc, cs, R, reveal, shrink) {
  const g = 19 * sc, n = Math.ceil((VENN_D * sc + R) / g) + 1, rot = 0.25 * (t - BN(74)) + 3 * eInOut(P(t, BV(87), BV(2.2)));
  const cr = Math.cos(rot), sr = Math.sin(rot);
  for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) {
    const lx = i * g + (j % 2 ? g / 2 : 0), ly = j * g * 0.866;
    const x = cx + lx * cr - ly * sr, y = cy + lx * sr + ly * cr;
    let m = 0, cols = [];
    cs.forEach((c, k) => { if (Math.hypot(x - c.x, y - c.y) < R - 6 * sc) { m++; cols.push(RIB[k].c); } });
    if (!m) continue;
    const dist = Math.hypot(x - cx, y - cy), rv = eOut(P(reveal, dist / (R * 2.4), 0.45));
    if (rv <= 0) continue;
    const col = m === 3 ? C.neon : m === 2 ? mixC(C.night, mixC(cols[0], cols[1], 0.5), 0.86) : mixC(C.night, cols[0], 0.52);
    const r = (m === 3 ? 3.8 : m === 2 ? 3.0 : 2.3) * sc * rv * (1 - shrink);
    if (r <= 0.05) continue;
    circ(ctx, lerp(x, cx, shrink), lerp(y, cy, shrink), r); ctx.fillStyle = col; ctx.fill();
  }
}
scene(67.9, 81, (ctx, t) => {
  if (t >= B(68)) bg(ctx, C.night);
  if (t < B(68)) return;
  const amp = eInOut(P(t, BN(72), BN(1.5))) * 80;
  const curl = spr(t, BN(74.2), 6.5, 0.93);
  const merge = spr(t, BN(78), 8, 0.92);
  const collapse = spr(t, BN(86.6), 8, 0.98);
  const [cx, cy, sc] = eaiCentre(t);
  const R = lerp(VENN_R * sc, 125, collapse);
  const cs = vennCircles(t, cx, cy, sc);
  // the dot matrix fills the circles once they have formed, and gathers into the AI disc at the end
  if (t >= BN(74.9)) vennDots(ctx, t, cx, cy, sc, cs, R, t - BN(74.9), collapse);
  // the ribbons: flat waves that curl into the three circles; once merged, each keeps a third of the ring
  RIB.forEach((r, k) => {
    const hw = lerp(40, 2.6, curl) * (1 - collapse);
    if (hw <= 0.05) return;
    const frac = lerp(1, 1 / 3, merge), a0 = cs[k].a + Math.PI / 2 + merge * (2 * Math.PI / 3) * 0.5;
    const top = [], bot = [];
    for (let j = 0; j <= RM; j++) {
      const s = j / RM;
      const tap = s < 0.18 ? eInOut(s / 0.18) : 1;
      let x = lerp(180, 1740, s), y = 434 + k * 120 + tap * amp * Math.sin(Math.PI * 2 * 1.1 * s - t * 3 + k * 1.3);
      const a = a0 + Math.PI * 2 * s * lerp(1, frac, merge) + (s - 0.5) * 0.02;
      const rr0 = R + (curl < 1 ? 0 : 0);
      x = lerp(x, cs[k].x + Math.cos(a) * rr0, curl); y = lerp(y, cs[k].y + Math.sin(a) * rr0, curl);
      const nx = lerp(0, Math.cos(a), curl), ny = lerp(1, Math.sin(a), curl);
      top.push([x + nx * hw, y + ny * hw]); bot.push([x - nx * hw, y - ny * hw]);
    }
    poly(ctx, top.concat(bot.reverse())); ctx.fillStyle = r.c; ctx.fill();
  });
  RIB.forEach((r, k) => rise(ctx, t, r.n, 180, 434 + k * 120 - 56, { size: 24, w: 700, c: r.c, ls: 6 }, BN(72) + 0.1 + k * 0.08, BN(74.1)));
  rise(ctx, t, 'One app.', 120, 200, { size: 96, w: 700, c: C.mist, ls: -2 }, BN(72), BN(74.8));
  rise(ctx, t, 'Three forces.', 120, 310, { size: 96, w: 700, c: C.neon, ls: -2 }, BN(73), BN(74.85));
  // each force names itself outside its circle
  RIB.forEach((r, k) => {
    const t0 = BN(75.9) + k * 0.12, q = spr(t, t0, 15, 0.82) * (1 - eIn(P(t, BN(77.85), 0.3)));
    if (q <= 0.01) return;
    const c = cs[k], ex = c.x + Math.cos(c.a) * (R + 30 * sc), ey = c.y + Math.sin(c.a) * (R + 30 * sc);
    const o = { size: 24, w: 700, c: r.c, ls: 6 }, tw = TW(ctx, r.n, o), side = Math.cos(c.a);
    const x0 = side > 0.3 ? ex : side < -0.3 ? ex - tw - 44 : ex - (tw + 44) / 2, y0 = ey + (Math.sin(c.a) > 0.3 ? 20 : Math.sin(c.a) < -0.3 ? -14 : 8);
    ctx.save(); ctx.translate(x0 + (tw + 44) / 2, y0 - 8); ctx.scale(q, q); ctx.translate(-(x0 + (tw + 44) / 2), -(y0 - 8));
    icon(ctx, r.im, x0 + 15, y0 - 9, 34, r.c, 1.1);
    T(ctx, r.n, x0 + 44, y0, o);
    ctx.restore();
  });
  // the core: where all three overlap is EAI; it grows into the orb as the circles merge, then becomes AI
  if (t >= BN(75.6)) {
    const k = spr(t, BN(75.6), 14, 0.82);
    const dr = lerp(lerp(80, 150, merge) * sc, 125, collapse) * k;
    circ(ctx, cx, cy, dr); ctx.fillStyle = C.neon; ctx.fill();
    if (collapse < 1) { ctx.strokeStyle = C.night; ctx.lineWidth = 3 * (1 - collapse); circ(ctx, cx, cy, dr - 12 * dr / 150); ctx.stroke(); }
    const o = { size: dr * 0.83, w: 800, ls: -3 * dr / 125 };
    const drop = eIn(P(t, BN(86.8), 0.35));
    const we = TW(ctx, 'E', o), wa = TW(ctx, 'AI', o);
    // "E" drops out and "AI" slides to the centre, exactly where the AI wheel's core label sits
    const ax = lerp(cx - (we + wa) / 2 + we, cx - wa / 2, eInOut(P(t, BN(86.9), 0.45)));
    ctx.save(); circ(ctx, cx, cy, dr - 2); ctx.clip();
    T(ctx, 'E', ax - we, cy + dr * 0.296 + drop * 160, { ...o, c: C.night });
    T(ctx, 'AI', ax, cy + dr * 0.296, { ...o, c: C.night });
    ctx.restore();
  }
  // the equation that names it
  if (t >= BN(77) && t < BN(78.6)) {
    const parts = [['Experience', C.mist], ['+', C.neon], ['AI', C.mist], ['+', C.neon], ['Value-added services', C.mist], ['=', C.neon], ['EAI', C.neon]];
    const o = { size: 40, w: 700 };
    const sp = 22, ws = parts.map(p => TW(ctx, p[0], o));
    let x = 960 - (ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1)) / 2;
    parts.forEach((p, i) => { rise(ctx, t, p[0], x, 980, { ...o, c: p[1] }, BN(77) + i * 0.06, BN(78)); x += ws[i] + sp; });
  }
  // one intelligent experience
  rise(ctx, t, 'One intelligent', 1000, 470, { size: 96, w: 700, c: C.mist, ls: -2 }, BN(79), BN(81) - 0.3);
  rise(ctx, t, 'experience.', 1000, 580, { size: 96, w: 700, c: C.neon, ls: -2 }, BN(79) + 0.12, BN(81) - 0.26);
  rise(ctx, t, 'A new kind of ecosystem.', 1004, 660, { size: 40, w: 500, c: C.fog }, BN(80), BN(81) - 0.22);
  // the AI assistant, live: real screens from the Salam app, with the plan story drawn around it
  const out = eIn3(P(t, BV(94), 0.6));   // a gentle accelerate-away: the bright card never smears
  {
    const k = spr(t, BN(81.3), 14, 0.86);
    if (k > 0.01 && out < 1) phone(ctx, t, [['s_ai_main', BN(81.3)], ['s_ai_typing', BV(86.4)], ['s_ai_answer', BV(89.6)]], PH_X + out * 900, lerp(1500, 545, k), 900, { shadow: 0.5 });
  }
  if (t >= BV(85.8) && out < 1) planStory(ctx, t, cx, cy, sc, out);
  const co = { size: 48, w: 600, align: 'center' };
  rise(ctx, t, 'Ask anything.', 560, 960, { ...co, c: C.mist }, BV(86), BV(88.75));
  rise(ctx, t, 'Get the right plan.', 560, 960, { ...co, c: C.mist }, BV(89), BV(92.7));
  {
    const a = TW(ctx, 'Together, ', co), b = TW(ctx, 'as one.', co);
    rise(ctx, t, 'Together,', 560 - (a + b) / 2, 960, { ...co, align: 'left', c: C.mist }, BV(93), BV(94.4));
    rise(ctx, t, 'as one.', 560 - (a + b) / 2 + a, 960, { ...co, align: 'left', c: C.neon }, BV(93.1), BV(94.45));
  }
});

// --- the plan story: question -> what the AI knows -> the right plan -> activated (real beats 86-94) ---
const PH_X = 1470;
const CARD2 = { x: 958, y: 262, w: 384, h: 580 };
const INSIGHTS = [
  { ic: 'Analytics01', chip: '38 GB a month', row: 'Unlimited data' },
  { ic: 'Airplane01', chip: 'Dubai, every month', row: '40 GB GCC roaming' },
  { ic: 'PlayCircle', chip: 'Streams every day', row: 'Shahid VIP included' },
];
function planStory(ctx, t, ecx, ecy, esc, out) {
  ctx.save(); ctx.translate(out * 900, 0);
  const q = 'Which plan fits my month?';
  // 1) the question, typed into a bubble that pops out of the phone
  {
    const k = spr(t, BV(86), 15, 0.86);
    const n = Math.round(q.length * clamp((t - BV(86.15)) / 0.62));
    const o = { size: 26, w: 600 }, w = TW(ctx, q, o) + 56, x1 = 1342, y = 168;
    ctx.save(); ctx.translate(lerp(PH_X, x1, k), lerp(320, y, k)); ctx.scale(k, k);
    rr(ctx, -w, -30, w, 60, 22); ctx.fillStyle = C.neon; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-22, 26); ctx.lineTo(0, 40); ctx.lineTo(-6, 18); ctx.closePath(); ctx.fill();
    T(ctx, q.slice(0, n), -w + 28, 9, { ...o, c: C.night });
    if (n < q.length && Math.floor(t * 4) % 2 === 0) { ctx.fillStyle = C.night; ctx.fillRect(-w + 30 + TW(ctx, q.slice(0, n), o), -12, 3, 26); }
    ctx.restore();
  }
  // 2) thinking: three dots pulse in turn
  {
    const k = spr(t, BV(87), 16, 0.86) * (1 - eIn(P(t, BV(88.8), 0.3)));
    if (k > 0.01) {
      ctx.save(); ctx.translate(CARD2.x, 238); ctx.scale(k, k);
      rr(ctx, 0, -28, 112, 56, 22); ctx.fillStyle = '#123630'; ctx.fill();
      for (let i = 0; i < 3; i++) { const ph = (t * 2.4 - i * 0.18) % 1, r = 6 + 3 * Math.max(0, Math.sin(ph * Math.PI)); circ(ctx, 30 + i * 26, 0, r); ctx.fillStyle = mixC('#5E8C82', C.neon, Math.max(0, Math.sin(ph * Math.PI))); ctx.fill(); }
      ctx.restore();
    }
  }
  // 4) the right plan pops out of the phone
  const ck = spr(t, BV(89.05), 12, 0.88);
  if (ck > 0.01) {
    const { x, y, w, h } = CARD2;
    ctx.save(); ctx.translate(lerp(PH_X - 40, x + w / 2, ck), lerp(560, y + h / 2, ck)); ctx.scale(lerp(0.25, 1, ck), lerp(0.25, 1, ck)); ctx.translate(-(x + w / 2), -(y + h / 2));
    shadowOn(ctx); rr(ctx, x, y, w, h, 30); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
    // match ring
    const mp = eOut(P(t, BV(89.5), 0.9)), mx = x + w - 66, my = y + 74;
    ctx.lineCap = 'round'; ctx.lineWidth = 8;
    ctx.strokeStyle = '#E3ECE5'; circ(ctx, mx, my, 40); ctx.stroke();
    if (mp > 0) { ctx.strokeStyle = C.green; ctx.beginPath(); ctx.arc(mx, my, 40, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.98 * mp); ctx.stroke(); }
    T(ctx, Math.round(98 * mp) + '%', mx, my + 3, { size: 22, w: 800, c: C.deep, align: 'center' });
    T(ctx, 'match', mx, my + 21, { size: 12, w: 600, c: '#5B6B66', align: 'center', ls: 0.5 });
    // badge, title, price
    const bk = spr(t, BV(89.4), 16, 0.8);
    if (bk > 0.01) { ctx.save(); ctx.translate(x + 28, y + 52); ctx.scale(bk, bk); rr(ctx, 0, -18, 148, 36, 18); ctx.fillStyle = C.neon; ctx.fill(); T(ctx, 'BEST MATCH', 74, 6, { size: 15, w: 800, c: C.night, align: 'center', ls: 2.5 }); ctx.restore(); }
    rise(ctx, t, 'Solo Unlimited', x + 28, y + 152, { size: 36, w: 800, c: C.deep, ls: -0.5 }, BV(89.45));
    const price = Math.round(149 * eOut(P(t, BV(89.7), 0.6)));
    rise(ctx, t, String(price), x + 28, y + 240, { size: 70, w: 800, c: C.deep, ls: -2 }, BV(89.7));
    rise(ctx, t, 'SAR / month', x + 36 + TW(ctx, '149', { size: 70, w: 800, ls: -2 }), y + 238, { size: 22, w: 600, c: '#5B6B66' }, BV(89.8));
    ctx.fillStyle = '#E3ECE5'; ctx.fillRect(x + 28, y + 282, (w - 56) * eOut(P(t, BV(89.6), 0.5)), 2);
    // the button: tapped, it fills and confirms
    const bt = spr(t, BV(90.8), 15, 0.86);
    if (bt > 0.01) {
      const bx = x + 28, by = y + h - 94, bw = w - 56, bh = 64;
      ctx.save(); ctx.translate(bx + bw / 2, by + bh / 2); ctx.scale(bt * (1 - 0.04 * Math.sin(Math.PI * P(t, BV(91.6), 0.25))), bt); ctx.translate(-(bx + bw / 2), -(by + bh / 2));
      rr(ctx, bx, by, bw, bh, 32); ctx.fillStyle = C.deep; ctx.fill();
      const fill = eOut(P(t, BV(91.7), 0.4));
      if (fill > 0) { ctx.save(); rr(ctx, bx, by, bw, bh, 32); ctx.clip(); ctx.fillStyle = C.neon; ctx.fillRect(bx, by, bw * fill, bh); ctx.restore(); }
      ctx.save(); rr(ctx, bx, by, bw, bh, 32); ctx.clip();
      const sw = eInOut(P(t, BV(91.95), 0.35));
      T(ctx, 'Activate in one tap', bx + bw / 2, by + 41 - sw * 60, { size: 23, w: 700, c: C.mist, align: 'center' });
      icon(ctx, 'Tick02', bx + bw / 2 - 64, by + 32 + (1 - sw) * 60, 26, C.night, 1.8);
      T(ctx, 'Activated', bx + bw / 2 + 16, by + 41 + (1 - sw) * 60, { size: 23, w: 800, c: C.night, align: 'center' });
      ctx.restore();
      // the tap: a ring that opens from the touch point (flat, no glow)
      const tp = P(t, BV(91.55), 0.4);
      if (tp > 0 && tp < 1) { ctx.strokeStyle = C.neon; ctx.lineWidth = 3 * (1 - tp); circ(ctx, bx + bw * 0.72, by + bh / 2, 10 + 46 * eOut(tp)); ctx.stroke(); }
      ctx.restore();
    }
    ctx.restore();
  }
  // 3) what the AI knows: insights fly out of the EAI core along data lines, then become the plan's benefits
  const toCard = spr(t, BV(89.1), 13, 0.9);
  INSIGHTS.forEach((ins, i) => {
    const t0 = BV(87.3) + i * BV(0.5);
    if (t < t0) return;
    const fly = spr(t, t0, 9, 0.92);
    const dock = [CARD2.x + 4, 352 + i * 84];                    // chip left edge, centre y
    const row = [CARD2.x + 30, CARD2.y + 352 + i * 54];
    const ox = ecx + 120 * esc, oy = ecy;
    const x = lerp(lerp(ox, dock[0], fly), row[0], toCard), y = lerp(lerp(oy, dock[1], fly) - 150 * Math.sin(Math.PI * clamp(fly)) * (1 - toCard), row[1], toCard);
    // data line + a pulse travelling along it
    const ln = (1 - eIn(P(t, BV(88.9), 0.3)));
    if (ln > 0.01 && toCard < 0.5) {
      ctx.strokeStyle = '#1F5F54'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(ox, oy);
      ctx.quadraticCurveTo((ox + x) / 2, Math.min(oy, y) - 120, lerp(ox, x, ln), lerp(oy, y, ln)); ctx.stroke();
      const pp = ((t - t0) * 1.6) % 1, bx = (1 - pp) * (1 - pp) * ox + 2 * (1 - pp) * pp * (ox + x) / 2 + pp * pp * x, by = (1 - pp) * (1 - pp) * oy + 2 * (1 - pp) * pp * (Math.min(oy, y) - 120) + pp * pp * y;
      if (fly > 0.6) { circ(ctx, bx, by, 4.5); ctx.fillStyle = C.neon; ctx.fill(); }
    }
    // chip
    const o = { size: 22, w: 700 }, cw = TW(ctx, ins.chip, o) + 92;
    const pill = lerp(cw, 30, toCard), ph = lerp(56, 30, toCard), sk = lerp(lerp(0.35, 1, clamp(fly)), 1, toCard);
    ctx.save(); ctx.translate(x, y); ctx.scale(sk, sk);
    if (toCard < 0.98) { shadowOn(ctx, 0.5); rr(ctx, 0, -ph / 2, pill, ph, ph / 2); ctx.fillStyle = mixC(C.white, C.neon, toCard); ctx.fill(); shadowOff(ctx); }
    else { circ(ctx, 15, 0, 15); ctx.fillStyle = C.neon; ctx.fill(); }
    if (toCard < 0.5) {
      circ(ctx, 30, 0, 18 * (1 - toCard * 2)); ctx.fillStyle = C.deep; ctx.fill();
      icon(ctx, ins.ic, 30, 0, 22 * (1 - toCard * 2), C.neon, 1.2);
    } else icon(ctx, 'Tick02', 15, 0, 20 * (toCard - 0.5) * 2, C.deep, 1.6);
    ctx.restore();
    rise(ctx, t, ins.chip, x + 62 * sk, y + 8, { size: 22, w: 700, c: C.deep }, t0 + 0.12, BV(89.1));
    rise(ctx, t, ins.row, row[0] + 44, row[1] + 8, { size: 23, w: 600, c: C.deep }, BV(89.6) + i * 0.12);
  });
  ctx.restore();
}
