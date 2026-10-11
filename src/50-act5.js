// ===== ACT V — END TITLE (bars 28–33.5, beats 108–134) =====
const STAIRS = [
  { n: 'CORE', x: 260, top: 690, c: C.stone, tc: C.deep, sc: '#4E5F5A', b: ['Mobile + Home, merged', 'Unified identity & billing', 'AI assistant'] },
  { n: 'BEYOND', x: 760, top: 500, c: C.night, tc: C.mist, sc: C.fog, b: ['Mini-apps', 'Content partnerships', 'AI-guided recommendations'] },
  { n: 'ECOSYSTEM', x: 1260, top: 310, c: C.neon, tc: C.night, sc: C.deep, b: ['Salam-owned platforms', 'First-party content', 'Social & engagement'] },
];
const GROUND = 920;
scene(107.5, 112.8, (ctx, t) => {
  bg(ctx, C.mist);
  // grid tiles regroup into three rising blocks
  STAIRS.forEach((s, k) => {
    const form = eInOut(P(t, B(107.5) + k * 0.12, B(0.9)));
    const rise_ = spr(t, B(108 + k), 15, 0.86);
    const h = (GROUND - s.top) * rise_;
    for (let q = 0; q < 4; q++) {
      const g = GRID[k * 4 + q], st = tileState(k * 4 + q, B(107.4));
      const tx = s.x, tw = 500, th = Math.max(h, 1) / 4, ty = GROUND - Math.max(h, 1) + q * th;
      const x = lerp(st.x, tx, form), y = lerp(st.y, ty, form), w = lerp(st.w, tw, form), hh = lerp(st.h, th + 1, form);
      rr(ctx, x, y, w, hh, lerp(20, 0, form)); ctx.fillStyle = mixC(g.c, s.c, form); ctx.fill();
    }
    if (rise_ > 0.05) {
      ctx.save(); ctx.beginPath(); ctx.rect(s.x, GROUND - h, 500, h); ctx.clip();
      const y0 = GROUND - h;
      T(ctx, s.n, s.x + 34, y0 + 60, { size: 28, w: 800, c: s.tc, ls: 6 });
      s.b.forEach((b, i) => T(ctx, b, s.x + 34, y0 + 108 + i * 38, { size: 24, w: 500, c: s.sc }));
      ctx.restore();
    }
  });
  rise(ctx, t, 'BECOME A SUPERAPP', 120, 170, { size: 24, w: 700, c: C.leaf, ls: 8 }, B(108));
  rise(ctx, t, 'Step by step.', 120, 250, { size: 72, w: 700, c: C.deep, ls: -2 }, B(108) + 0.1);
  // the thread climbs the staircase on beat 111
  const tp = eInOut(P(t, B(111), 0.55));
  if (tp > 0) {
    const path = [[180, GROUND], [260, 690], [760, 690], [760, 500], [1260, 500], [1260, 310], [1760, 310], [2000, 60]];
    const L = []; let tot = 0; for (let i = 1; i < path.length; i++) { tot += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); L.push(tot); }
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
    rr(ctx, lerp(s.x, -40, op), lerp(s.top, -40, op), lerp(500, W + 80, op), lerp(GROUND - s.top, H + 80, op), 0);
    ctx.fillStyle = C.night; ctx.fill();
  }
});

// --- Beyond Telco. Closer to Life. / Everyday moments (beats 112–121) ---
const MOMENTS = ['Mobile', 'Home', 'Travel', 'Entertainment', 'Wellbeing', 'Deals', 'Faith'];
const ARC = { cx: 960, cy: 1400, R: 1000, a0: 218 * Math.PI / 180, a1: 322 * Math.PI / 180 };
const momentPos = i => { const a = lerp(ARC.a0, ARC.a1, i / 6); return [ARC.cx + Math.cos(a) * ARC.R, ARC.cy + Math.sin(a) * ARC.R]; };
function momentIcon(ctx, i, x, y, s, col) {
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  if (i === 0) { rr(ctx, x - s * 0.4, y - s * 0.65, s * 0.8, s * 1.3, s * 0.18); ctx.stroke(); }
  if (i === 1) { ctx.moveTo(x - s * 0.7, y - s * 0.05); ctx.lineTo(x, y - s * 0.65); ctx.lineTo(x + s * 0.7, y - s * 0.05); ctx.moveTo(x - s * 0.5, y - s * 0.2); ctx.lineTo(x - s * 0.5, y + s * 0.6); ctx.lineTo(x + s * 0.5, y + s * 0.6); ctx.lineTo(x + s * 0.5, y - s * 0.2); ctx.stroke(); }
  if (i === 2) { ctx.moveTo(x - s * 0.7, y + s * 0.1); ctx.lineTo(x + s * 0.7, y - s * 0.5); ctx.lineTo(x - s * 0.1, y + s * 0.65); ctx.lineTo(x - s * 0.15, y + s * 0.15); ctx.closePath(); ctx.stroke(); }
  if (i === 3) { ctx.moveTo(x - s * 0.35, y - s * 0.55); ctx.lineTo(x + s * 0.6, y); ctx.lineTo(x - s * 0.35, y + s * 0.55); ctx.closePath(); ctx.fill(); }
  if (i === 4) { ctx.moveTo(x, y + s * 0.6); ctx.bezierCurveTo(x - s * 1.1, y - s * 0.1, x - s * 0.5, y - s * 0.9, x, y - s * 0.3); ctx.bezierCurveTo(x + s * 0.5, y - s * 0.9, x + s * 1.1, y - s * 0.1, x, y + s * 0.6); ctx.stroke(); }
  if (i === 5) { T(ctx, '%', x, y + s * 0.42, { size: s * 1.4, w: 700, c: col, align: 'center' }); }
  if (i === 6) { ctx.arc(x, y, s * 0.6, 0.6, Math.PI * 2 - 0.6); ctx.arc(x + s * 0.28, y - s * 0.05, s * 0.48, Math.PI * 2 - 0.75, 0.75, true); ctx.closePath(); ctx.fill(); }
}
scene(111.6, 121.4, (ctx, t) => {
  if (t >= B(112)) bg(ctx, C.night);
  if (t < B(112)) return;
  const o = { size: 170, w: 800, ls: -6 };
  rise(ctx, t, 'Beyond Telco.', 120, 470, { ...o, c: C.mist }, B(112), B(114));
  rise(ctx, t, 'Closer to Life.', 120, 680, { ...o, c: C.leaf }, B(113), B(114) + 0.05);
  // the arc draws, the moments sit on it
  const ap = eInOut(P(t, B(114) + 0.1, B(1.6)));
  const toDots = eInOut(P(t, B(120), B(0.9)));
  if (ap > 0 && toDots < 1) {
    ctx.strokeStyle = C.teal; ctx.lineWidth = 3; ctx.beginPath();
    ctx.arc(ARC.cx, ARC.cy, ARC.R, ARC.a0 - 0.15, lerp(ARC.a0 - 0.15, ARC.a1 + 0.15, ap) * (1 - toDots) + (ARC.a0 - 0.15) * toDots); ctx.stroke();
  }
  MOMENTS.forEach((m, i) => {
    const t0 = B(114) + 0.1 + B(1.6) * (i / 6) * 0.8;
    const k = spr(t, t0, 16) * (1 - eIn(P(t, B(120), 0.3)));
    if (k <= 0.001) return;
    const [x, y] = momentPos(i);
    const lit = B(116 + Math.floor(i / 2)) + (i % 2) * 0.15;
    const lp = spr(t, lit, 18);
    circ(ctx, x, y, 66 * k * (1 + 0.12 * Math.max(0, 1 - (t - lit) * 4) * (t > lit ? 1 : 0)));
    ctx.fillStyle = mixC(C.deep, C.green, clamp(lp)); ctx.fill();
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); momentIcon(ctx, i, 0, 0, 34, t > lit ? C.night : C.mist); ctx.restore();
    rise(ctx, t, m, x, y + 112, { size: 24, w: 600, c: C.mist, align: 'center' }, t0 + 0.1, B(120));
  });
  rise(ctx, t, 'Everyday moments.', 960, 160, { size: 84, w: 700, c: C.mist, align: 'center', ls: -2 }, B(116), B(120));
  rise(ctx, t, 'All in one place.', 960, 262, { size: 84, w: 700, c: C.neon, align: 'center', ls: -2 }, B(119), B(120) + 0.05);
});

// --- 30 days light up, then fold into the leaf, the end title, and back to the icon (beats 120–134) ---
const GRIDC = { x0: 660, y0: 320, sp: 120, r: 36 };
const dayPos = d => [GRIDC.x0 + (d % 6) * GRIDC.sp, GRIDC.y0 + Math.floor(d / 6) * GRIDC.sp];
// when each of the 30 days lights: slow, then faster and faster into the last full bar
const DAY_T = (() => {
  const counts = [[121, 1], [122, 3], [123, 7], [124, 12], [125, 18], [126, 24], [127, 29], [128, 30]];
  const out = []; let prev = 0;
  counts.forEach(([b, n]) => { const m = n - prev; for (let i = 0; i < m; i++) out.push(B(b) + B(1) * i / m); prev = n; });
  return out;
})();
const END = { lx: 650, ly: 470, ls: 300, wx: 820, wy: 560 };
scene(120, 134.01, (ctx, t) => {
  bg(ctx, C.night);
  const fold = eInOut(P(t, B(128.5), B(0.8)));
  const punch = t >= B(128) ? spr(t, B(128), 14, 0.7) * (1 - eInOut(P(t, B(128.5), B(0.6)))) : 0;
  const solid = spr(t, B(129.25), 15, 0.9);
  const collapse = eInOut(P(t, B(133), 0.42));
  const leafPtsFinal = resample(leafPts(END.lx, END.ly, END.ls, -Math.PI / 4, 300), 30);
  const lit = DAY_T.filter(x => t >= x).length;
  // dots
  if (solid < 0.98) {
    for (let d = 0; d < 30; d++) {
      const src = momentPos(Math.min(6, Math.floor(d * 7 / 30)));
      const gp = dayPos(d);
      const form = eInOut(P(t, B(120) + d * 0.008, B(0.9)));
      let x = lerp(src[0], gp[0], form), y = lerp(src[1], gp[1], form);
      let r = lerp(20, GRIDC.r, form);
      const lt = DAY_T[d];
      const on = t >= lt;
      const pop = on ? 1 + 0.25 * Math.max(0, 1 - (t - lt) * 5) : 1;
      // the hit: the whole month pulses outward, then folds into the leaf outline
      const hit = punch * 0.22;
      x = lerp(x + (x - 960) * hit, leafPtsFinal[d][0], fold);
      y = lerp(y + (y - 560) * hit, leafPtsFinal[d][1], fold);
      r = lerp(r * pop, 22, fold) * (1 - solid);
      circ(ctx, x, y, r); ctx.fillStyle = on ? C.neon : C.teal; ctx.fill();
    }
  }
  // the leaf fills from the dots
  if (solid > 0) {
    const L = lerp(END.ls * 0.92, END.ls, solid);
    const cx = lerp(END.lx, 960, collapse), cy = lerp(END.ly, 500, collapse);
    const size = lerp(L, 180 * 0.62, collapse);
    if (collapse > 0) {
      const k = spr(t, B(133) + 0.12, 16, 0.9);
      rr(ctx, 960 - 90 * k, 500 - 90 * k, 180 * k, 180 * k, 180 * 0.24 * k); ctx.fillStyle = C.deep; ctx.fill();
    }
    ctx.save(); ctx.translate(cx, cy); ctx.scale(solid, solid); ctx.translate(-cx, -cy);
    drawLeaf(ctx, cx, cy, size, C.green, -Math.PI / 4, collapse > 0.5 ? C.deep : C.night);
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
  // end title
  rise(ctx, t, 'salam', END.wx, END.wy, { size: 230, w: 700, c: C.mist, ls: -8 }, B(129.5), B(132.9));
  const tw = { size: 46, w: 500 };
  riseWords(ctx, t, [['Making', C.mist], ['the', C.mist], ['joy', C.mist], ['of', C.mist], ['technology', C.mist], ['accessible', C.mist]], 960, 760, { ...tw, align: 'center' }, [0, 1, 2, 3, 4, 5].map(i => B(130) + i * 0.07), B(132.6));
  riseWords(ctx, t, [['for', C.mist], ['everyone,', C.mist], ['everyday.', C.neon]], 960, 830, { ...tw, align: 'center' }, [0, 1, 2].map(i => B(131) + i * 0.1), B(132.7));
  // final half bar: underline lands under "everyday." on the downbeat
  {
    const w1 = TW(ctx, 'for everyone, ', tw), w2 = TW(ctx, 'everyday.', tw), x = 960 - (w1 + w2) / 2 + w1;
    const p = eOut(P(t, B(132), 0.35)), q = eIn(P(t, B(132.7), 0.3));
    if (p > 0 && q < 1) { ctx.fillStyle = C.neon; ctx.fillRect(x, 850 + q * 200, w2 * p, 6); }
  }
  // the app icon label returns: last frame == first frame
  if (collapse > 0) {
    const lp = eOut(P(t, B(133) + 0.2, 0.25));
    ctx.save(); ctx.beginPath(); ctx.rect(960 - 200, 500 + 90 + 12, 400, 60); ctx.clip();
    T(ctx, 'salam', 960, 500 + 90 + 58 + (1 - lp) * 60, { size: 34, w: 600, c: C.dim, align: 'center', ls: 1 });
    ctx.restore();
  }
});
