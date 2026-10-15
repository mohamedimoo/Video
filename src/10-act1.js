// ===== ACT I — KINETIC TYPE (bars 1–7, beats 0–27) =====
const SCENES = [];
const scene = (a, b, draw) => SCENES.push({ a, b, draw });

// --- Hook (beats 0–4): the feed whips past the app icon and brakes on "Last opened 29 days ago" ---
const FEED = [['CHAT', 'BubbleChat'], ['WATCH', 'Tv01'], ['PAY', 'CreditCard'], ['PLAY', 'GameController03'], ['SHOP', 'ShoppingBag01'], ['LISTEN', 'Headphones'], ['SCROLL', 'Search01'], ['STREAM', 'PlayCircle']];
const PITCH = 340, GAP0 = 760;  // the feed starts below the frame so frame 0 is the icon alone
scene(0, 8, (ctx, t) => {
  bg(ctx, C.night);
  if (t > B(4.7)) return;
  const sx = P(t, 0.06, B(2) - 0.06), S = (9 * PITCH + GAP0) * sx * sx * sx * (10 - 15 * sx + 6 * sx * sx);
  const up = eIn(P(t, B(4), 0.36)) * 1100;          // everything leaves upward on beat 4
  const lift = spr(t, B(3), 16) * 170;              // card makes room for the headline on beat 3
  const clear = eIn(P(t, B(2) - 0.05, 0.4)) * 900;  // the verb feed clears out once the card lands
  const y0 = 500 - S - up - clear;
  if (y0 > -260) appIcon(ctx, 960, y0, APP_ICON_S, 1);
  for (let i = 1; i <= 8; i++) {
    const y = 500 + GAP0 + i * PITCH - S - up - clear;
    if (y < -200 || y > 1300) continue;
    rr(ctx, 960 - 430, y - 150, 860, 300, 52); ctx.fillStyle = i % 2 ? C.teal : C.deep; ctx.fill();
    circ(ctx, 960 - 430 + 150, y, 90); ctx.fillStyle = C.neon; ctx.fill();
    icon(ctx, FEED[i - 1][1], 960 - 430 + 150, y, 100, C.deep, 1.1);
    T(ctx, FEED[i - 1][0], 960 - 430 + 300, y + 44, { size: 124, w: 800, c: C.mist, ls: -3 });
  }
  // item 9: the salam card
  const y9 = 500 + GAP0 + 9 * PITCH - S - lift - up;
  if (y9 < 1300) {
    rr(ctx, 960 - 430, y9 - 120, 860, 240, 52); ctx.fillStyle = C.mist; ctx.fill();
    appIcon(ctx, 960 - 430 + 130, y9, 150, 0);
    const lw = WORD_W(36);
    wordLetters(ctx, 960 - 430 + 240, y9 - 14, 36, C.deep);
    T(ctx, 'app', 960 - 430 + 252 + lw, y9 - 14, { size: 40, w: 500, c: C.deep });
    const w1 = TW(ctx, 'Last opened ', { size: 40, w: 500 });
    T(ctx, 'Last opened ', 960 - 430 + 240, y9 + 52, { size: 40, w: 500, c: C.ink });
    T(ctx, '29 days ago', 960 - 430 + 240 + w1, y9 + 52, { size: 40, w: 700, c: C.green });
  }
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

// --- "They live on their phones / EVERY DAY." with a real Salam customer (beats 4–8) ---
const CHIPS = [['BubbleChat', 'Chat'], ['Video01', 'Stream'], ['CreditCard', 'Pay']];
scene(4, 8, (ctx, t) => {
  // photo card on the right
  const k = spr(t, B(4) + 0.05, 14, 0.85);
  const cy = lerp(1500, 580, k);
  shadowOn(ctx, 0.6); rr(ctx, 1250, cy - 420, 560, 840, 52); ctx.fillStyle = C.mist; ctx.fill(); shadowOff(ctx);
  const hpH = 960 * (1 + 0.07 * P(t, B(4), B(4))), hpY = cy + 52 + (1 - k) * 120 - 0.02 * (hpH - 960);   // slow push-in
  ctx.save(); rr(ctx, 1250, cy - 420, 560, 840, 52); ctx.clip(); pic(ctx, 'p_headphones', 1530, hpY, hpH); ctx.restore();
  // above his waist the photo is a cutout: his head, elbow and outstretched hand break out of the card
  ctx.save(); ctx.beginPath(); ctx.rect(0, -200, W, hpY + hpH * 0.2 + 200); ctx.clip(); pic(ctx, 'p_headphones', 1530, hpY, hpH); ctx.restore();
  CHIPS.forEach(([ic, label], i) => {
    const q = spr(t, B(5 + i) + 0.08, 17);
    if (q <= 0.01) return;
    const x = [1330, 1690, 1300][i], y = cy + [-300, 20, 270][i];
    ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
    const w = TW(ctx, label, { size: 30, w: 600 }) + 98;
    shadowOn(ctx, 0.5); rr(ctx, -w / 2, -36, w, 72, 36); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
    circ(ctx, -w / 2 + 36, 0, 24); ctx.fillStyle = C.neon; ctx.fill();
    icon(ctx, ic, -w / 2 + 36, 0, 28, C.deep, 1.2);
    T(ctx, label, -w / 2 + 72, 11, { size: 30, w: 600, c: C.deep });
    ctx.restore();
  });
  rise(ctx, t, 'They live on their phones', 120, 300, { size: 64, w: 500, c: C.fog }, B(4) + 0.08);
  const o = { size: 300, w: 800, ls: -14 };
  const ex = lerp(-1400, 110, eOut(P(t, B(5), 0.34)));
  if (t >= B(5)) T(ctx, 'EVERY', ex, 640, { ...o, c: C.mist });
  const wd = TW(ctx, 'DAY', o);
  const dx = lerp(-1400, 110, eOut(P(t, B(6), 0.34)));
  if (t >= B(6)) {
    T(ctx, 'DAY', dx, 930, { ...o, c: C.neon });
    // the full stop is a real circle: it becomes the next scene
    const px = dx + wd + 46, py = 930 - 24;
    const r = lerp(26, 2400, eIn(P(crispT(t), B(7), B(1))));
    circ(ctx, px, py, r); ctx.fillStyle = r > 30 ? C.mist : C.neon; ctx.fill();
  }
});

// --- Threats: "Disruption from every direction." (beats 8–20) ---
const THREATS = [
  { k: 'OTT', l: 'owns the conversation', x: 500, y: 500, im: 'i_info' },
  { k: 'eSIM', l: 'owns customer choice', x: 1460, y: 470, im: 'i_esim' },
  { k: 'BIG TECH', l: 'owns identity', x: 1540, y: 790, im: 'i_faceid' },
  { k: 'FINTECH', l: 'owns the wallet', x: 960, y: 960, im: 'i_coins' },
  { k: 'SUPER-APPS', l: 'own the ecosystem', x: 420, y: 840, im: 'i_globe' },
];
const LEAF_C = [960, 660];
function threatLeafSize(t) {
  let s = 300;
  for (let i = 0; i < 5; i++) s *= lerp(1, 0.86, spr(t, B(10 + i) + 0.12, 16));
  s *= lerp(1, 0.55, eOut(P(t, B(15), 0.4)));
  s = lerp(s, 470, eOut(P(t, B(18), 0.45)));
  return s;
}
scene(8, 20, (ctx, t) => {
  bg(ctx, C.mist);
  riseWords(ctx, t, [['Disruption', C.deep], ['from', C.deep]], 120, 190, { size: 96, w: 700, ls: -2 }, [B(8), B(8) + 0.1], B(16) - 0.24);
  riseWords(ctx, t, [['every', C.leaf], ['direction.', C.leaf]], 120, 300, { size: 96, w: 700, ls: -2 }, [B(9), B(9) + 0.1], B(16) - 0.24);
  rise(ctx, t, 'The risk is real.', 120, 190, { size: 96, w: 700, ls: -2, c: C.deep }, B(16), B(17) - 0.24);
  riseWords(ctx, t, [['The', C.deep], ['opportunity', C.deep], ['is', C.deep]], 120, 190, { size: 96, w: 700, ls: -2 }, [B(17), B(17) + .08, B(17) + .16], B(19));
  slam(ctx, t, 'bigger.', 960, 1000, { size: 230, w: 800, ls: -8, c: C.leaf }, B(18));

  const s = threatLeafSize(t);
  THREATS.forEach((c, i) => {
    const t0 = B(10 + i);
    if (t < t0) return;
    const dx = c.x - LEAF_C[0], dy = c.y - LEAF_C[1], dl = Math.hypot(dx, dy);
    const fly = 1 - spr(t, t0, 15, 0.86);
    // once landed, every card keeps creeping in on the logo and floats a little, so the squeeze never stops
    const sq = 0.2 * eOut(P(t, B(15), 0.4)) + 0.06 * eInOut(P(t, t0 + 0.3, B(15) - t0));
    const blast = eIn(P(t, B(18) - 0.05, 0.4)) * 1900;
    const x = c.x + dx / dl * (1500 * fly + blast) - dx * sq + 5 * Math.sin(t * 1.9 + i * 1.7);
    const y = c.y + dy / dl * (1500 * fly + blast) - dy * sq + 7 * Math.sin(t * 2.3 + i * 2.9);
    // the card is sized to its own text
    const h = 160, w = 158 + Math.max(TW(ctx, c.k, { size: 22, w: 700, ls: 5 }), TW(ctx, c.l, { size: 32, w: 600, ls: -0.5 })) + 44;
    shadowOn(ctx, 0.55); rr(ctx, x - w / 2, y - h / 2, w, h, 34); ctx.fillStyle = C.white; ctx.fill(); shadowOff(ctx);
    pic(ctx, c.im, x - w / 2 + 82, y, 118);
    T(ctx, c.k, x - w / 2 + 158, y - 14, { size: 22, w: 700, c: C.leaf, ls: 5 });
    T(ctx, c.l, x - w / 2 + 158, y + 34, { size: 32, w: 600, c: C.deep, ls: -0.5 });
  });
  // the real Salam glass logo is squeezed by each card, then grows; its mark opens into the next scene
  const g = eIn(P(crispT(t), B(19), B(1))), g2 = eIn(P(crispT(t), B(19) + 0.1, B(1) - 0.1));
  if (g < 0.05) glass(ctx, LEAF_C[0], LEAF_C[1], s);
  if (g > 0) {
    poly(ctx, markPts(LEAF_C[0], LEAF_C[1], lerp(s * 0.9, 6400, g))); ctx.fillStyle = C.green; ctx.fill();
    if (g2 > 0) { poly(ctx, markPts(LEAF_C[0], LEAF_C[1], lerp(0, 6400, g2))); ctx.fillStyle = C.deep; ctx.fill(); }
  }
});

// --- "Awareness isn't the problem. Relevance is." / "daily usage" (beats 20–28) ---
const HAB_SIZE = 285;
function habitsLayout() {
  const run = glyphRun('daily usage', HAB_SIZE);
  return { run, x: 960 - run.w / 2, y: 470 };
}
scene(20, 28, (ctx, t) => {
  bg(ctx, C.deep);
  const o = { size: 150, w: 700, ls: -5, c: C.mist };
  rise(ctx, t, 'Awareness', 150, 420, o, B(20), B(23) - 0.36);
  rise(ctx, t, "isn't the problem.", 150, 590, o, B(21), B(23) - 0.32);
  [[420, TW(ctx, 'Awareness', o)], [590, TW(ctx, "isn't the problem.", o)]].forEach(([y, w], i) => {
    const p = eOut(P(t, B(22) + i * 0.1, 0.32)), po = eIn(P(t, B(23) - 0.36 + i * 0.04, 0.3));
    if (p <= 0 || po >= 1) return;
    ctx.fillStyle = C.neon; ctx.fillRect(140, y - 52 - po * 200, (w + 20) * p, 14);
  });
  if (t >= B(23) && t < B(24.6)) {
    const so = { size: 230, w: 800, ls: -8 };
    const wa = TW(ctx, 'Relevance ', so), wb = TW(ctx, 'is.', so);
    const p = eOut(P(t, B(23), 0.24)), po = eIn(P(t, B(24) - 0.12, 0.32));
    const k = lerp(2.4, 1, p);
    ctx.save(); ctx.translate(960, 600 - po * 900); ctx.scale(k, k);
    T(ctx, 'Relevance ', -(wa + wb) / 2, 80, { ...so, c: C.leaf });
    T(ctx, 'is.', -(wa + wb) / 2 + wa, 80, { ...so, c: C.mist });
    ctx.restore();
  }
  rise(ctx, t, 'Winning apps are built on', 130, 150, { size: 50, w: 500, c: C.fog }, B(24) + 0.2, B(27));
  rise(ctx, t, 'not monthly utility.', 130, 1000, { size: 46, w: 500, c: C.fog }, B(26), B(27) + 0.05);
  {
    const sw = TW(ctx, 'not monthly utility.', { size: 46, w: 500 });
    const p = eOut(P(t, B(26) + 0.25, 0.3)), po = eIn(P(t, B(27) + 0.05, 0.3));
    if (p > 0 && po < 1) { ctx.fillStyle = C.neon; ctx.fillRect(122, 984 - po * 100, (sw + 16) * p, 6); }
  }
  if (t >= B(25) && t < B(28)) {
    const { run, x, y } = habitsLayout();
    const p = eOut(P(t, B(25), 0.24)), k = lerp(2.4, 1, p);
    ctx.save(); ctx.translate(960, y - 110); ctx.scale(k, k); ctx.translate(-960, -(y - 110));
    run.gl.forEach((g, i) => {
      if (i < 6) {
        const q = eIn(P(t, B(27) + i * 0.03, 0.3));
        if (q >= 1) return;
        const cx = x + g.x0 + g.adv / 2, cy = y - HAB_SIZE * 0.36;
        ctx.save(); ctx.translate(cx, cy); ctx.scale(1 - q, 1 - q); ctx.translate(-cx, -cy);
        fillContours(ctx, g.cs, x, y, C.mist); ctx.restore();
      } else if (t < B(27.5)) fillContours(ctx, g.cs, x, y, C.mist);
    });
    ctx.restore();
  }
  // behind the type: the giant headline sits behind him, his head cuts into the letters like a cover
  {
    const k = eInOut(P(t, B(24) + 0.1, 0.7)), out = eIn(P(t, B(27), 0.4));
    if (k > 0 && out < 1) pic(ctx, 'p_coffee', 1000, 580 + (1 - k) * 500 + out * 1100, 1000 * (1 + 0.04 * P(t, B(24), B(3.5))));
  }
});
