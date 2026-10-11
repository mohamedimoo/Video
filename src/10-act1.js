// ===== ACT I — KINETIC TYPE (bars 1–7, beats 0–27) =====
const SCENES = [];
const scene = (a, b, draw) => SCENES.push({ a, b, draw });

// --- Hook (beats 0–4): the feed whips past the app icon and brakes on "Last opened 29 days ago" ---
const FEED = ['CHAT', 'WATCH', 'PAY', 'PLAY', 'SHOP', 'LISTEN', 'SCROLL', 'STREAM'];
const PITCH = 340, GAP0 = 760;  // the feed starts below the frame so frame 0 is the icon alone
scene(0, 8, (ctx, t) => {
  bg(ctx, C.night);
  if (t > B(4.7)) return;
  const sx = P(t, 0.06, B(2) - 0.06), S = (9 * PITCH + GAP0) * sx * sx * sx * (10 - 15 * sx + 6 * sx * sx);
  const up = eIn(P(t, B(4), 0.36)) * 1100;          // everything leaves upward on beat 4
  const lift = spr(t, B(3), 16) * 170;              // card makes room for the headline on beat 3
  // item 0: the app icon itself is the head of the feed
  const clear = eIn(P(t, B(2) - 0.05, 0.4)) * 900;   // the verb feed clears out once the card lands
  const y0 = 500 - S - up - clear;
  if (y0 > -200) appIcon(ctx, 960, y0, 180, 1);
  for (let i = 1; i <= 8; i++) {
    const y = 500 + GAP0 + i * PITCH - S - up - clear;
    if (y < -200 || y > 1300) continue;
    rr(ctx, 960 - 320, y - 150, 640, 300, 48); ctx.fillStyle = i % 2 ? C.teal : C.deep; ctx.fill();
    T(ctx, FEED[i - 1], 960, y + 54, { size: 150, w: 800, c: C.mist, align: 'center', ls: -4 });
  }
  // item 9: the salam card
  const y9 = 500 + GAP0 + 9 * PITCH - S - lift - up;
  if (y9 < 1300) {
    rr(ctx, 960 - 430, y9 - 120, 860, 240, 52); ctx.fillStyle = C.mist; ctx.fill();
    appIcon(ctx, 960 - 430 + 130, y9, 140, 0);
    T(ctx, 'salam app', 960 - 430 + 240, y9 - 22, { size: 44, w: 700, c: C.deep });
    const w1 = TW(ctx, 'Last opened ', { size: 40, w: 500 });
    T(ctx, 'Last opened ', 960 - 430 + 240, y9 + 46, { size: 40, w: 500, c: C.ink });
    T(ctx, '29 days ago', 960 - 430 + 240 + w1, y9 + 46, { size: 40, w: 700, c: C.green });
  }
  // beat 3: "Once a month." slams in
  if (t >= B(3)) {
    const o = { size: 190, w: 800, ls: -6 };
    const wa = TW(ctx, 'Once a ', o), wb = TW(ctx, 'month.', o);
    const p = eOut(P(t, B(3), 0.24)), k = lerp(2.4, 1, p);
    ctx.save(); ctx.translate(960, 700 - up); ctx.scale(k, k);
    T(ctx, 'Once a ', -(wa + wb) / 2, 66, { ...o, c: C.mist });
    T(ctx, 'month.', -(wa + wb) / 2 + wa, 66, { ...o, c: C.leaf });
    ctx.restore();
  }
});

// --- "They live on their phones / EVERY DAY." (beats 4–8) ---
scene(4, 8, (ctx, t) => {
  rise(ctx, t, 'They live on their phones', 960, 300, { size: 76, w: 500, c: C.fog, align: 'center' }, B(4) + 0.08);
  const o = { size: 300, w: 800, ls: -14 };
  const we = TW(ctx, 'EVERY', o);
  const ex = lerp(2600, 960, eOut(P(t, B(5), 0.34)));
  if (t >= B(5)) T(ctx, 'EVERY', ex, 640, { ...o, align: 'center', c: C.mist });
  const wd = TW(ctx, 'DAY', o);
  const dx = lerp(-1200, 960 - 46, eOut(P(t, B(6), 0.34)));
  if (t >= B(6)) {
    T(ctx, 'DAY', dx, 930, { ...o, align: 'center', c: C.neon });
    // the full stop is a real circle: it becomes the next scene
    const px = dx + wd / 2 + 40, py = 930 - 24;
    const r = lerp(26, 2400, eIn(P(t, B(7), B(1))));
    circ(ctx, px, py, r); ctx.fillStyle = r > 30 ? C.mist : C.neon; ctx.fill();
  }
});

// --- Threats: "Disruption from every direction." (beats 8–20) ---
const THREATS = [
  { k: 'OTT', l: 'owns the conversation', x: 470, y: 500 },
  { k: 'eSIM', l: 'owns customer choice', x: 1470, y: 470 },
  { k: 'BIG TECH', l: 'owns identity', x: 1530, y: 790 },
  { k: 'FINTECH', l: 'owns the wallet', x: 960, y: 960 },
  { k: 'SUPER-APPS', l: 'own the ecosystem', x: 390, y: 840 },
];
const LEAF_C = [960, 660];
function threatLeafSize(t) {
  let s = 250;
  for (let i = 0; i < 5; i++) s *= lerp(1, 0.86, spr(t, B(10 + i) + 0.12, 16));
  s *= lerp(1, 0.55, eOut(P(t, B(15), 0.4)));
  s = lerp(s, 430, eOut(P(t, B(18), 0.45)));
  return s;
}
scene(8, 20, (ctx, t) => {
  bg(ctx, C.mist);
  riseWords(ctx, t, [['Disruption', C.deep], ['from', C.deep]], 120, 190, { size: 96, w: 700, ls: -2 }, [B(8), B(8) + 0.1], B(16));
  riseWords(ctx, t, [['every', C.leaf], ['direction.', C.leaf]], 120, 300, { size: 96, w: 700, ls: -2 }, [B(9), B(9) + 0.1], B(16));
  rise(ctx, t, 'The risk is real.', 120, 190, { size: 96, w: 700, ls: -2, c: C.deep }, B(16), B(17));
  riseWords(ctx, t, [['The', C.deep], ['opportunity', C.deep], ['is', C.deep]], 120, 190, { size: 96, w: 700, ls: -2 }, [B(17), B(17) + .08, B(17) + .16], B(19));
  slam(ctx, t, 'bigger.', 960, 990, { size: 230, w: 800, ls: -8, c: C.leaf }, B(18));

  const s = threatLeafSize(t);
  // cards
  THREATS.forEach((c, i) => {
    const t0 = B(10 + i);
    if (t < t0) return;
    const dx = c.x - LEAF_C[0], dy = c.y - LEAF_C[1], dl = Math.hypot(dx, dy);
    const fly = 1 - spr(t, t0, 15, 0.86);
    const sq = 0.2 * eOut(P(t, B(15), 0.4));
    const blast = eIn(P(t, B(18) - 0.05, 0.4)) * 1900;
    const x = c.x + dx / dl * (1500 * fly + blast) - dx * sq;
    const y = c.y + dy / dl * (1500 * fly + blast) - dy * sq;
    const w = 420, h = 150;
    rr(ctx, x - w / 2, y - h / 2, w, h, 30); ctx.fillStyle = C.white; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = '#B9D8BF'; ctx.stroke();
    T(ctx, c.k, x - w / 2 + 34, y - 18, { size: 24, w: 700, c: C.leaf, ls: 5 });
    T(ctx, c.l, x - w / 2 + 34, y + 36, { size: 36, w: 600, c: C.deep, ls: -0.5 });
  });
  // the leaf is squeezed by each card, then grows and swallows the frame
  const g = eIn(P(t, B(19), B(1))), g2 = eIn(P(t, B(19) + 0.1, B(1) - 0.1));
  const ang = -Math.PI / 4 + g * 0.6;
  drawLeaf(ctx, LEAF_C[0], LEAF_C[1], lerp(s, 5600, g), C.green, ang, g > 0 ? null : C.mist);
  if (g2 > 0) drawLeaf(ctx, LEAF_C[0], LEAF_C[1], lerp(0, 5600, g2), C.deep, ang);
});

// --- "Awareness isn't the problem. Relevance is." / "daily habits" (beats 20–28) ---
const HAB_SIZE = 240;
function habitsLayout() {
  const run = glyphRun('daily habits', HAB_SIZE);
  return { run, x: 960 - run.w / 2, y: 650 };
}
scene(20, 28, (ctx, t) => {
  bg(ctx, C.deep);
  const o = { size: 150, w: 700, ls: -5, c: C.mist };
  rise(ctx, t, 'Awareness', 150, 420, o, B(20), B(23));
  rise(ctx, t, "isn't the problem.", 150, 590, o, B(21), B(23) + 0.05);
  // strike-throughs drawn on the beat
  [[420, TW(ctx, 'Awareness', o)], [590, TW(ctx, "isn't the problem.", o)]].forEach(([y, w], i) => {
    const p = eOut(P(t, B(22) + i * 0.1, 0.32)), po = eIn(P(t, B(23) + i * 0.05, 0.3));
    if (p <= 0 || po >= 1) return;
    ctx.fillStyle = C.neon; ctx.fillRect(140, y - 52 - po * 200, (w + 20) * p, 14);
  });
  // "Relevance is."
  if (t >= B(23) && t < B(24.6)) {
    const so = { size: 230, w: 800, ls: -8 };
    const wa = TW(ctx, 'Relevance ', so), wb = TW(ctx, 'is.', so);
    const p = eOut(P(t, B(23), 0.24)), po = eIn(P(t, B(24), 0.34));
    const k = lerp(2.4, 1, p);
    ctx.save(); ctx.translate(960, 600 - po * 900); ctx.scale(k, k);
    T(ctx, 'Relevance ', -(wa + wb) / 2, 80, { ...so, c: C.leaf });
    T(ctx, 'is.', -(wa + wb) / 2 + wa, 80, { ...so, c: C.mist });
    ctx.restore();
  }
  rise(ctx, t, 'Winning apps are built on', 960, 340, { size: 66, w: 500, c: C.fog, align: 'center' }, B(24) + 0.05, B(27));
  rise(ctx, t, 'not monthly utility.', 960, 850, { size: 66, w: 500, c: C.fog, align: 'center' }, B(26), B(27) + 0.05);
  {
    const sw = TW(ctx, 'not monthly utility.', { size: 66, w: 500 });
    const p = eOut(P(t, B(26) + 0.25, 0.3)), po = eIn(P(t, B(27) + 0.05, 0.3));
    if (p > 0 && po < 1) { ctx.fillStyle = C.neon; ctx.fillRect(960 - sw / 2 - 10, 828 - po * 100, (sw + 20) * p, 8); }
  }
  // "daily habits": drawn from glyph outlines because "habits" becomes shapes next
  if (t >= B(25) && t < B(28)) {
    const { run, x, y } = habitsLayout();
    const p = eOut(P(t, B(25), 0.24)), k = lerp(2.4, 1, p);
    ctx.save(); ctx.translate(960, y - 80); ctx.scale(k, k); ctx.translate(-960, -(y - 80));
    run.gl.forEach((g, i) => {
      if (i < 6) { // "daily " shrinks into its own centre on beat 27
        const q = eIn(P(t, B(27) + i * 0.03, 0.3));
        if (q >= 1) return;
        const cx = x + g.x0 + g.adv / 2, cy = y - HAB_SIZE * 0.36;
        ctx.save(); ctx.translate(cx, cy); ctx.scale(1 - q, 1 - q); ctx.translate(-cx, -cy);
        fillContours(ctx, g.cs, x, y, C.mist); ctx.restore();
      } else if (t < B(27.5)) fillContours(ctx, g.cs, x, y, C.mist);
    });
    ctx.restore();
  }
});
