// Injected into showreel.html by tools/ae-export.mjs and tools/render.mjs --plate.
// It wraps the film's three ways of putting type and pictures on screen (T, rise, pic) so that:
//  - "trace" mode records every line of text and every image, per frame, with its transform (camera removed),
//    and marks which ones can live as native After Effects layers (not inside a clip, not covered later on);
//  - "plate" mode renders the film without those native elements and without the camera,
//    so the AE layers and the camera null can be laid back on top of it.
(function () {
  const AE = window.__AE = { mode: 'off', frame: [], skip: null };
  const realCam = window.camAt;
  window.camAt = () => ({ z: 1, x: 0, y: 0 });   // the camera becomes a null in After Effects
  AE.cam = t => realCam(t);

  // which call site drew this (two stack lines, so riseWords and slam keep their callers apart)
  let seen = new Map();
  AE.begin = () => { seen = new Map(); AE.frame = []; };
  function site() {
    const s = new Error().stack.split('\n');
    const k = (s[3] || '').trim().replace(/^at /, '').replace(/\(?file:.*?showreel\.html:/, '@') + '|' + (s[4] || '').trim().replace(/^at /, '').replace(/\(?file:.*?showreel\.html:/, '@');
    const n = seen.get(k) || 0; seen.set(k, n + 1);
    return k + '#' + n;
  }

  // clip depth per context: a line or image inside someone else's clip stays in the plate
  const P = CanvasRenderingContext2D.prototype;
  const oSave = P.save, oRestore = P.restore, oClip = P.clip, oFill = P.fill, oFillRect = P.fillRect;
  // each clip remembers whether its path was a single rounded rect (rr): an image inside one such clip
  // becomes a native layer with a rounded mask
  P.save = function () { (this.__cs || (this.__cs = [])).push((this.__cl || []).slice()); return oSave.apply(this, arguments); };
  P.restore = function () { if (this.__cs && this.__cs.length) this.__cl = this.__cs.pop(); return oRestore.apply(this, arguments); };
  P.clip = function () { (this.__cl = (this.__cl || []).slice()).push(this.__rrOn ? this.__rr : null); return oClip.apply(this, arguments); };
  Object.defineProperty(P, '__cd', { get() { return (this.__cl || []).length; } });
  for (const fn of ['beginPath', 'moveTo', 'lineTo', 'arc', 'rect', 'roundRect', 'ellipse', 'bezierCurveTo', 'quadraticCurveTo', 'arcTo']) {
    const o = P[fn]; P[fn] = function () { this.__rrOn = false; return o.apply(this, arguments); };
  }
  const oRR = window.rr;
  window.rr = function (ctx, x, y, w, h, r) {
    oRR(ctx, x, y, w, h, r);
    r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
    ctx.__rr = { x, y, w, h, r, m: mat(ctx) }; ctx.__rrOn = true;
  };

  // anything opaque drawn later over a native element's box sends it back to the plate for that frame
  const opaque = ctx => ctx.globalAlpha > 0.95 && !(typeof ctx.fillStyle === 'string' && /rgba\(.*,\s*0?\.\d+\)$/.test(ctx.fillStyle));
  function coverTest(ctx, inside) {
    if (AE.mode !== 'trace' || !opaque(ctx)) return;
    for (const e of AE.frame) {
      if (!e.native || e.covered) continue;
      for (const [x, y] of e.pts) if (inside(x, y)) { e.covered = true; break; }
    }
  }
  P.fill = function (a, b) {
    if (AE.mode === 'trace' && AE.frame.length) {
      const path = a instanceof Path2D ? a : null;
      coverTest(this, (x, y) => path ? this.isPointInPath(path, x, y) : this.isPointInPath(x, y));
    }
    return oFill.apply(this, arguments);
  };
  P.fillRect = function (x0, y0, w, h) {
    if (AE.mode === 'trace' && AE.frame.length) {
      const m = this.getTransform().inverse();
      coverTest(this, (x, y) => { const u = m.a * x + m.c * y + m.e, v = m.b * x + m.d * y + m.f; return u >= Math.min(x0, x0 + w) && u <= Math.max(x0, x0 + w) && v >= Math.min(y0, y0 + h) && v <= Math.max(y0, y0 + h); });
    }
    return oFillRect.apply(this, arguments);
  };

  const mat = ctx => { const m = ctx.getTransform(); return [m.a, m.b, m.c, m.d, m.e, m.f]; };
  const app = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  // a 5 x 5 grid over the element's box: any later opaque fill touching it sends the element to the plate
  function boxPts(m, x0, y0, x1, y1) {
    const out = [], ix = (x1 - x0) * 0.03, iy = (y1 - y0) * 0.03;
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) out.push(app(m, x0 + ix + (x1 - x0 - 2 * ix) * i / 4, y0 + iy + (y1 - y0 - 2 * iy) * j / 4));
    return out;
  }
  // in plate mode: true = this element lives in After Effects, so the plate skips it
  const skip = key => AE.mode === 'plate' && AE.skip && AE.skip.has(key);

  let inRise = 0;
  const oT = window.T, oRise = window.rise;
  window.T = function (ctx, s, x, y, o = {}) {
    if (AE.mode === 'off' || inRise) return oT(ctx, s, x, y, o);
    const key = site();
    if (skip(key)) return;
    oT(ctx, s, x, y, o);
    if (AE.mode !== 'trace' || !s) return;
    const w = TW(ctx, s, o), size = o.size || 64, al = o.align || 'left', m = mat(ctx);
    const L = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x;
    AE.frame.push({ k: 'text', key, s: String(s), size, w: o.w || 700, ls: o.ls || 0, al, c: o.c || C.mist, x, y, m, a: ctx.globalAlpha,
      native: !(ctx.__cd > 0), pts: boxPts(m, L, y - size * 0.7, L + w, y) });
  };
  window.rise = function (ctx, t, s, x, y, o, tIn, tOut = 1e9, d = 0.42) {
    if (AE.mode === 'off') return oRise(ctx, t, s, x, y, o, tIn, tOut, d);
    if (t < tIn || !s || t >= tOut + 0.3) return;
    const key = site();
    if (skip(key)) return;
    const clipped = ctx.__cd > 0;
    inRise++; oRise(ctx, t, s, x, y, o, tIn, tOut, d); inRise--;
    if (AE.mode !== 'trace') return;
    const size = o.size || 64, w = TW(ctx, s, o), al = o.align || 'left', m = mat(ctx);
    const L = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x;
    AE.frame.push({ k: 'rise', key, s: String(s), size, w: o.w || 700, ls: o.ls || 0, c: o.c || C.mist, L, y, tw: w, tIn, tOut, d, m, a: ctx.globalAlpha,
      native: !clipped, pts: boxPts(m, L, y - size * 0.7, L + w, y) });
  };
  // every bitmap (pic and the phone's screens) goes through drawImage
  let imgName = null;
  const oDrawImage = P.drawImage;
  P.drawImage = function (im, dx, dy, dw, dh) {
    if (AE.mode === 'off' || arguments.length !== 5 || !(im instanceof HTMLImageElement)) return oDrawImage.apply(this, arguments);
    if (!imgName) imgName = new Map(Object.entries(IMG).map(([k, v]) => [v, k]));
    const name = imgName.get(im);
    if (!name) return oDrawImage.apply(this, arguments);
    const key = site();
    if (skip(key)) return;
    oDrawImage.apply(this, arguments);
    if (AE.mode !== 'trace' || dh <= 0.5) return;
    const cl = this.__cl || [], m = mat(this);
    const ok = cl.length === 0 || (cl.length === 1 && cl[0]);
    AE.frame.push({ k: 'img', key, name, cx: dx + dw / 2, cy: dy + dh / 2, w: dw, h: dh, m, a: this.globalAlpha, clip: cl.length ? cl[0] : null,
      native: !!ok, pts: boxPts(m, dx, dy, dx + dw, dy + dh) });
  };

  // one traced frame: draw it once, no motion-blur sub-samples, and hand back what was drawn
  AE.trace = function (t) {
    AE.mode = 'trace'; AE.begin();
    window.SAMPLES = 1; window.seek(t);
    const out = AE.frame.map(e => { const r = { ...e, native: e.native && !e.covered }; delete r.pts; delete r.covered; return r; });
    AE.mode = 'off';
    return { cam: AE.cam(t), els: out };
  };
  // plate mode: the set of keys that After Effects draws natively in this frame
  AE.plate = function (keys) { AE.mode = 'plate'; AE.skip = new Set(keys); };
  const oDraw = window.drawFrame;
  window.drawFrame = function (c, t) { if (AE.mode !== 'off') seen = new Map(); return oDraw(c, t); };
})();
