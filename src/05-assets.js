// ===== Real brand assets: images, phone mockups, Hugeicons, the Salam mark =====
// Images come from the Salam Figma file (3D icons, app screens, people, logos),
// line icons from the Hugeicons library used by the team. All are embedded in the page.
const IMG = {};                       // name -> decoded HTMLImageElement
let FRAME_T = 0;                      // time of the frame being drawn (set at the top of each frame)
const ICONS = window.__ICONS || {};

async function loadImages() {
  const src = window.__IMGS || {};
  await Promise.all(Object.entries(src).map(async ([k, uri]) => {
    const im = new Image(); im.src = uri; await im.decode(); IMG[k] = im;
  }));
}
// draw an image centred at (cx, cy) with height h
function pic(ctx, name, cx, cy, h, alpha = 1) {
  const im = IMG[name]; if (!im || h <= 0.5) return;
  const w = h * im.width / im.height;
  if (alpha < 1) ctx.globalAlpha = alpha;
  ctx.drawImage(im, cx - w / 2, cy - h / 2, w, h);
  if (alpha < 1) ctx.globalAlpha = 1;
}
const picW = (name, h) => IMG[name] ? h * IMG[name].width / IMG[name].height : 0;

// contact shadow for cards and phones (a shadow, never a glow)
// a tight contact shadow: it reads as elevation, never as a halo
function shadowOn(ctx, k = 1) {
  ctx.shadowColor = `rgba(0, 10, 8, ${0.14 * Math.min(1, k)})`; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
}
function shadowOff(ctx) { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }

// ---- phone mockup with real app screens ----
// screens: [[name, tIn], ...]; each new screen pushes the previous one up inside the glass
const PHONE_AR = 393 / 852;
function phone(ctx, t, screens, cx, cy, h, opts = {}) {
  if (h < 4) return;
  const w = h * PHONE_AR, b = h * 0.024, r = h * 0.118;
  ctx.save();
  if (opts.rot) { ctx.translate(cx, cy); ctx.rotate(opts.rot); ctx.translate(-cx, -cy); }
  if (opts.shadow !== false) shadowOn(ctx, opts.shadow || 1);
  rr(ctx, cx - w / 2 - b, cy - h / 2 - b, w + 2 * b, h + 2 * b, r + b);
  ctx.fillStyle = '#0D1715'; ctx.fill(); shadowOff(ctx);
  ctx.strokeStyle = '#3A4744'; ctx.lineWidth = Math.max(1, h * 0.003); ctx.stroke();
  ctx.save();
  rr(ctx, cx - w / 2, cy - h / 2, w, h, r); ctx.clip();
  ctx.fillStyle = C.mist; ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  // the newest screen that has arrived slides up over the one before it
  let cur = 0;
  screens.forEach(([, tIn], i) => { if (t >= tIn) cur = i; });
  const [name, tIn] = screens[cur];
  const p = cur > 0 ? eInOut(P(t, tIn, 0.5)) : 1;
  if (cur > 0 && p < 1) {
    const prev = screens[cur - 1][0];
    ctx.drawImage(IMG[prev], cx - w / 2, cy - h / 2 - p * h * 0.35, w, h);
  }
  const sy = (opts.scroll || 0) * h;
  if (IMG[name]) ctx.drawImage(IMG[name], cx - w / 2, cy - h / 2 + (1 - p) * h - sy, w, h);
  ctx.restore();
  // dynamic island
  rr(ctx, cx - w * 0.15, cy - h / 2 + h * 0.014, w * 0.3, h * 0.034, h * 0.017); ctx.fillStyle = '#05100E'; ctx.fill();
  ctx.restore();
}

// ---- Hugeicons (stroke rounded), drawn as vectors ----
const _icp = {};
function iconParts(name) {
  if (_icp[name]) return _icp[name];
  const parts = (ICONS[name] || []).map(([tag, a]) => {
    const p = new Path2D();
    if (tag === 'path') p.addPath(new Path2D(a.d));
    else if (tag === 'circle') p.arc(+a.cx, +a.cy, +a.r, 0, Math.PI * 2);
    else if (tag === 'ellipse') p.ellipse(+a.cx, +a.cy, +a.rx, +a.ry, 0, 0, Math.PI * 2);
    return { p, fill: a.fill === 'currentColor', stroke: a.stroke === 'currentColor', sw: +(a.strokeWidth || 1.5) };
  });
  return (_icp[name] = parts);
}
function icon(ctx, name, cx, cy, size, col, weight = 1) {
  const s = size / 24;
  ctx.save(); ctx.translate(cx - size / 2, cy - size / 2); ctx.scale(s, s);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const e of iconParts(name)) {
    if (e.fill) { ctx.fillStyle = col; ctx.fill(e.p); }
    if (e.stroke) { ctx.strokeStyle = col; ctx.lineWidth = e.sw * weight; ctx.stroke(e.p); }
  }
  ctx.restore();
}

// ---- the Salam mark and wordmark (vector, from the brand file) ----
const WM_MARK = 'M12.5136 0.936071C11.0226 -0.00954849 9.16269 -0.167469 7.53288 0.511779C5.90307 1.19103 4.71828 2.59709 4.32461 4.34753C3.93095 6.09797 0.174962 22.7976 0.174962 22.7976C0.053249 23.3493 0 23.9068 0 24.4586C0 27.7939 2.17372 30.9733 5.03207 32.1796C8.70247 33.7283 30.607 42.8991 30.607 42.8991C30.6317 42.9105 30.6602 42.9086 30.685 42.8953C30.7078 42.882 30.7249 42.8592 30.7306 42.8325C33.6137 26.1824 26.4402 9.75678 12.5155 0.937974Z';
const WM_LETTERS = [
  'M75.3002 12.2359H79.9177V32.9044H75.3002C74.9065 32.9044 74.587 32.5848 74.587 32.191V30.4652C72.9895 32.4764 70.7436 33.4829 67.8529 33.4829C64.9622 33.4829 62.7352 32.4288 60.7669 30.3206C58.7967 28.2125 57.8135 25.6287 57.8135 22.5692C57.8135 19.5098 58.7986 16.9279 60.7669 14.8197C62.7352 12.7116 65.0972 11.6575 67.8529 11.6575C70.7455 11.6575 72.9895 12.664 74.587 14.6751V12.9494C74.587 12.5556 74.9065 12.2359 75.3002 12.2359ZM64.753 26.7665C65.8275 27.8548 67.1911 28.399 68.8437 28.399C70.4963 28.399 71.8656 27.8548 72.9553 26.7665C74.0431 25.6782 74.587 24.2797 74.587 22.5711C74.587 20.8625 74.0431 19.4641 72.9553 18.3758C71.8675 17.2875 70.4963 16.7433 68.8437 16.7433C67.1911 16.7433 65.8275 17.2875 64.753 18.3758C63.6785 19.4641 63.1422 20.8625 63.1422 22.5711C63.1422 24.2797 63.6785 25.6782 64.753 26.7665Z',
  'M111.993 12.2359H116.611V32.9044H111.993C111.599 32.9044 111.28 32.5848 111.28 32.191V30.4652C109.682 32.4764 107.436 33.4829 104.546 33.4829C101.655 33.4829 99.4281 32.4288 97.4598 30.3206C95.4896 28.2125 94.5063 25.6287 94.5063 22.5692C94.5063 19.5098 95.4915 16.9279 97.4598 14.8197C99.4281 12.7116 101.79 11.6575 104.546 11.6575C107.438 11.6575 109.682 12.664 111.28 14.6751V12.9494C111.28 12.5556 111.599 12.2359 111.993 12.2359ZM101.446 26.7665C102.52 27.8548 103.884 28.399 105.537 28.399C107.189 28.399 108.558 27.8548 109.648 26.7665C110.736 25.6782 111.28 24.2797 111.28 22.5711C111.28 20.8625 110.736 19.4641 109.648 18.3758C108.56 17.2875 107.189 16.7433 105.537 16.7433C103.884 16.7433 102.52 17.2875 101.446 18.3758C100.371 19.4641 99.8351 20.8625 99.8351 22.5711C99.8351 24.2797 100.371 25.6782 101.446 26.7665Z',
  'M143.382 11.6575C145.749 11.6575 147.644 12.43 149.062 13.973C150.481 15.5161 151.19 17.5824 151.19 20.1738V32.1929C151.19 32.5867 150.871 32.9063 150.477 32.9063H145.86V20.5467C145.86 19.3062 145.555 18.3415 144.951 17.6528C144.344 16.964 143.49 16.6196 142.389 16.6196C141.176 16.6196 140.234 17.0192 139.559 17.8183C138.884 18.6174 138.547 19.7761 138.547 21.2906V32.1929C138.547 32.5867 138.228 32.9063 137.834 32.9063H133.217V20.5467C133.217 19.3062 132.912 18.3415 132.308 17.6528C131.701 16.964 130.847 16.6196 129.746 16.6196C128.561 16.6196 127.618 17.0192 126.916 17.8183C126.214 18.6174 125.863 19.7761 125.863 21.2906V32.1929C125.863 32.5867 125.543 32.9063 125.149 32.9063H120.532V12.2378H125.149C125.543 12.2378 125.863 12.5575 125.863 12.9513V14.4297C127.103 12.5841 129.016 11.6594 131.606 11.6594C134.196 11.6594 136.012 12.6507 137.226 14.6352C138.603 12.6507 140.655 11.6594 143.382 11.6594V11.6575Z',
  'M89.3487 25.4327V4.36462H84.7312C84.3376 4.36462 84.0181 4.68427 84.0181 5.07812V26.8293C84.0181 30.1856 86.7376 32.9044 90.0904 32.9044H93.3462V27.5713H91.4882C90.3072 27.5713 89.3487 26.6124 89.3487 25.4308V25.4327Z',
  'M55.929 27.0652C55.9537 24.6412 54.0196 21.6845 47.5023 20.2727C44.1267 19.5421 42.63 19.0836 42.63 18.1988C42.63 16.8632 44.256 16.5264 46.4335 16.5264C48.9743 16.5264 50.7676 18.2502 50.7676 18.2502L54.6187 15.6474C53.2913 13.6553 48.6053 10.6624 42.9362 12.0038C37.8033 13.2177 37.1358 16.5759 37.073 18.1322C37.0122 19.6392 37.4762 22.6396 44.0259 24.1998C48.0918 25.1683 50.4139 25.7257 50.4139 27.0633C50.4139 28.4009 48.6205 28.614 46.3917 28.614C42.8677 28.614 40.8024 27.0157 39.9979 26.228C39.7545 25.9902 39.3799 25.9541 39.0984 26.1443L35.4832 28.5892C35.4832 28.5892 38.6857 33.4353 46.1578 33.4467C53.9873 33.4581 55.9062 29.6395 55.9309 27.0633L55.929 27.0652Z',
];
let _wm = null;
const wmPaths = () => _wm || (_wm = { mark: new Path2D(WM_MARK), letters: WM_LETTERS.map(d => new Path2D(d)) });
// letters "salam" only; (x, y) is the left of the "s" at the baseline-ish bottom of the x-height box
// letters span x 35.5..151.2 and y 4.4..33.5 in the 152x43 artboard
function wordLetters(ctx, x, y, h, col, reveal = [1, 1, 1, 1, 1], bold = 0) {
  const s = h / 29.1;                     // h = height of the "l"
  const order = [4, 0, 3, 1, 2];          // s a l a m  (left to right)
  order.forEach((pi, k) => {
    const r = reveal[k]; if (r <= 0) return;
    ctx.save();
    ctx.beginPath(); ctx.rect(x - 10 - bold, y - h * 1.2 - bold, (151.2 - 35.5) * s + 20 + 2 * bold, h * 1.4 + 2 * bold); ctx.clip();
    ctx.translate(x - 35.5 * s, y - 33.5 * s + (1 - r) * h * 1.3); ctx.scale(s, s);
    ctx.fillStyle = col; ctx.fill(wmPaths().letters[pi]);
    if (bold > 0) { ctx.strokeStyle = col; ctx.lineJoin = 'round'; ctx.lineWidth = bold / s; ctx.stroke(wmPaths().letters[pi]); }   // a heavier cut of the wordmark
    ctx.restore();
  });
}
const WORD_W = h => (151.2 - 35.5) * h / 29.1;

// mark outline as points (for morphing): flatten the cubic path
const MARK_PTS = (() => {
  const nums = WM_MARK.match(/-?\d*\.?\d+(?:e-?\d+)?/g).map(Number);
  const pts = [[nums[0], nums[1]]];
  for (let i = 2; i + 5 < nums.length; i += 6) {
    const [x0, y0] = pts[pts.length - 1];
    const [x1, y1, x2, y2, x3, y3] = nums.slice(i, i + 6);
    for (let k = 1; k <= 12; k++) {
      const u = k / 12, v = 1 - u;
      pts.push([v * v * v * x0 + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u * x3, v * v * v * y0 + 3 * v * v * u * y1 + 3 * v * u * u * y2 + u * u * u * y3]);
    }
  }
  const c = centroid(pts);
  return pts.map(([x, y]) => [(x - c[0]) / 43, (y - c[1]) / 43]);   // unit = mark height
})();
// mark polygon centred at (cx, cy), height h
const markPts = (cx, cy, h, N = 140) => resample(MARK_PTS.map(([x, y]) => [cx + x * h, cy + y * h]), N);

// glass logo image centred at (cx, cy), height h
function glass(ctx, cx, cy, h, alpha = 1) { pic(ctx, 'l_salam_glass', cx, cy, h, alpha); }

// the app icon: frame 0 and the very last frame (big, bright tile with a bold white label)
const APP_ICON_S = 260, ICON_LABEL = { h: 44, dy: 72, bold: 2.5 };
function appIcon(ctx, cx, cy, s, labelP = 1) {
  rr(ctx, cx - s / 2, cy - s / 2, s, s, s * 0.26); ctx.fillStyle = C.teal; ctx.fill();
  glass(ctx, cx, cy, s * 0.82);
  if (labelP > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(cx - 260, cy + s / 2 + 14, 520, 96); ctx.clip();
    const lh = ICON_LABEL.h, lw = WORD_W(lh);
    wordLetters(ctx, cx - lw / 2, cy + s / 2 + ICON_LABEL.dy + (1 - labelP) * 90, lh, C.mist, undefined, ICON_LABEL.bold);
    ctx.restore();
  }
}
