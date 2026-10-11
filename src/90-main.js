// ===== Frame entry point =====
// window.seek(t) renders the frame at time t. Inside one frame it averages a few
// sub-samples across a short shutter, so anything moving fast blurs along its own
// direction in proportion to its speed; still elements stay sharp.
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
ctx.imageSmoothingQuality = 'high';
const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
const tctx = tmp.getContext('2d');
tctx.imageSmoothingQuality = 'high';
window.SAMPLES = 0;          // 0 = adaptive: more sub-samples when the frame moves fast
window.SHUTTER = 1 / 360;      // with 3 render subframes 1/360 s apart: a 180-degree shutter
const sm = document.createElement('canvas'); sm.width = 240; sm.height = 135;
const smctx = sm.getContext('2d', { willReadFrequently: true });

// One camera language for the whole film: a slow, continuous float, plus a soft push-in on every scene change.
// The float's periods divide the running time, so the loop stays seamless. The camera only ever zooms in, and it
// pans inside that zoom margin, so the edges of the frame are never uncovered. It never shakes or rolls.
const CAM_HITS = SCENE_HITS.map(B).concat(SCENE_HITS_V.map(BV)).sort((a, b) => a - b);
function camAt(t) {
  const w = (k, ph = 0) => Math.sin(2 * Math.PI * k * t / DUR + ph);
  let z = 1.016 + 0.008 * w(11) + 0.004 * w(17, 1.1);
  const settle = 1 - eInOut(P(t, DUR - 1.5, 1.4));     // every push-in has settled before the loop point
  for (const h of CAM_HITS) {
    const s = t - h;
    if (s > 0 && s < 3) z += settle * 0.014 * (1 - Math.exp(-s / 0.1)) * Math.exp(-s / 0.75) * (1 - P(s, 2.2, 0.8));
  }
  const m = z - 1;
  return { z, x: m * 960 * 0.55 * w(7, 0.7), y: m * 540 * 0.55 * w(9, 2.3) };
}
function drawFrame(c, t) {
  t = ((t % DUR) + DUR) % DUR;      // the film loops: last frame == first frame
  FRAME_T = t;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  bg(c, C.night);
  const cm = camAt(t);
  for (const s of SCENES) {
    if (t >= B(s.a) && t < B(s.b)) {
      c.save(); c.setTransform(cm.z, 0, 0, cm.z, (1 - cm.z) * 960 + cm.x, (1 - cm.z) * 540 + cm.y);
      s.draw(c, t); c.restore(); c.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}
// how much of the frame changes across the shutter (thumbnail difference)
function motionAt(t) {
  const px = [];
  for (const dt of [-0.5, 0.5]) {
    drawFrame(tctx, t + dt * window.SHUTTER);
    smctx.drawImage(tmp, 0, 0, 240, 135);
    px.push(smctx.getImageData(0, 0, 240, 135).data);
  }
  let n = 0;
  for (let i = 0; i < px[0].length; i += 4) {
    if (Math.abs(px[0][i] - px[1][i]) + Math.abs(px[0][i + 1] - px[1][i + 1]) + Math.abs(px[0][i + 2] - px[1][i + 2]) > 36) n++;
  }
  return n / (240 * 135);
}
window.samplesFor = t => {
  if (window.SAMPLES > 0) return window.SAMPLES;
  const m = motionAt(t);
  return m < 0.004 ? 2 : m < 0.03 ? 4 : m < 0.08 ? 8 : 14;
};
window.seek = function (t) {
  const K = window.samplesFor(t);
  window.lastK = K;
  if (K <= 1) { drawFrame(ctx, t); return; }
  // running average: sample k is laid over the mean of the previous k at weight 1/(k+1)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  for (let k = 0; k < K; k++) {
    drawFrame(tctx, t + ((k + 0.5) / K - 0.5) * window.SHUTTER);
    ctx.globalAlpha = 1 / (k + 1); ctx.drawImage(tmp, 0, 0);
  }
  ctx.globalAlpha = 1;
};
window.DUR = DUR; window.BEAT = BEAT;

(async () => {
  const bin = atob(window.__TTF);
  const buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  FONT = opentype.parse(buf.buffer);
  await loadImages();
  await Promise.all([300, 400, 500, 600, 700, 800].map(w => document.fonts.load(`${w} 100px Geist`)));
  window.seek(0);
  window.ready = true;
})();
