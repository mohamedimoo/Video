// ===== Frame entry point =====
// window.seek(t) renders the frame at time t. Inside one frame it averages a few
// sub-samples across a short shutter, so anything moving fast blurs along its own
// direction in proportion to its speed; still elements stay sharp.
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
const tctx = tmp.getContext('2d');
window.SAMPLES = 2;
window.SHUTTER = 1 / 180;

function drawFrame(c, t) {
  t = ((t % DUR) + DUR) % DUR;      // the film loops: last frame == first frame
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  bg(c, C.night);
  for (const s of SCENES) {
    if (t >= B(s.a) && t < B(s.b)) { c.save(); s.draw(c, t); c.restore(); c.setTransform(1, 0, 0, 1, 0, 0); }
  }
}
window.seek = function (t) {
  const K = window.SAMPLES;
  if (K <= 1) { drawFrame(ctx, t); return; }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < K; k++) {
    drawFrame(tctx, t + ((k + 0.5) / K - 0.5) * window.SHUTTER);
    ctx.globalAlpha = 1 / K; ctx.drawImage(tmp, 0, 0);
  }
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
};
window.DUR = DUR; window.BEAT = BEAT;

(async () => {
  const bin = atob(window.__TTF);
  const buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  FONT = opentype.parse(buf.buffer);
  await Promise.all([300, 400, 500, 600, 700, 800].map(w => document.fonts.load(`${w} 100px Geist`)));
  window.seek(0);
  window.ready = true;
})();
