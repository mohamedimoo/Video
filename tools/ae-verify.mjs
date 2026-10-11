// Check the After Effects export without After Effects: rebuild frames from ae/salam_layers.json
// (keyframes interpolated the way AE does: linear, opacity held) over the plate, the camera applied,
// and compare each with the film's own frame.
// usage: node tools/ae-verify.mjs <outdir> <second> [<second> ...]   (needs ae/plate.mp4)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs'; import path from 'path';
const [out, ...secs] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const D = JSON.parse(fs.readFileSync('ae/salam_layers.json', 'utf8'));
const b = await chromium.launch({ args: ['--disable-gpu', '--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + path.resolve('showreel.html'));
await p.waitForFunction(() => window.ready === true);
for (const s of secs) {
  const t = Math.round(+s * 60) / 60, f = Math.round(t * 60);
  const plate = path.join(out, `plate_${f}.png`);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', 'ae/plate.mp4', '-vf', `select=eq(n\\,${f})`, '-vframes', '1', plate]);
  const uri = 'data:image/png;base64,' + fs.readFileSync(plate).toString('base64');
  await p.evaluate(t => { window.SAMPLES = 1; window.seek(t); }, t);
  await p.screenshot({ path: path.join(out, `film_${f}.png`) });
  await p.evaluate(async ([D, t, uri]) => {
    const lerpKeys = (keys, t) => {
      if (!keys || !keys.length) return null;
      if (t <= keys[0][0]) return keys[0].slice(1);
      for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
        const a = keys[i - 1], z = keys[i], u = (t - a[0]) / (z[0] - a[0]);
        return a.slice(1).map((v, j) => typeof v === 'number' ? v + (z[j + 1] - v) * u : v);
      }
      return keys[keys.length - 1].slice(1);
    };
    const holdKeys = (keys, t) => { let v = keys[0][1]; for (const k of keys) if (k[0] <= t + 1e-6) v = k[1]; return v; };
    const cv = document.getElementById('c'), ctx = cv.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    const im = new Image(); im.src = uri; await im.decode();
    const [cx, cy, cz] = lerpKeys(D.cam, t), k = cz / 100;
    const camM = () => ctx.setTransform(k, 0, 0, k, cx - 960 * k, cy - 540 * k);
    camM(); ctx.drawImage(im, 0, 0);
    const W = { 400: 400, 500: 500, 600: 600, 700: 700, 800: 800 };
    for (const L of D.layers) {
      if (t < L.in || t >= L.out) continue;
      const op = holdKeys(L.op, t) / 100; if (op <= 0) continue;
      const [x, y] = lerpKeys(L.pos, t), [rot] = lerpKeys(L.rot, t);
      ctx.save(); camM(); ctx.translate(x, y); ctx.rotate(rot * Math.PI / 180); ctx.globalAlpha = op;
      if (L.type === 'img') {
        const [w, h] = lerpKeys(L.wh, t), [sw, sh] = L.src, img = IMG[L.name];
        ctx.scale(w / sw, h / sh); ctx.translate(-sw / 2, -sh / 2);
        if (L.mask) { const m = lerpKeys(L.mask, t); ctx.beginPath(); for (let j = 0; j < m.length; j += 2) j ? ctx.lineTo(m[j], m[j + 1]) : ctx.moveTo(m[j], m[j + 1]); ctx.closePath(); ctx.clip(); }
        ctx.drawImage(img, 0, 0, sw, sh);
      } else {
        const [sc] = lerpKeys(L.scale, t); ctx.scale(sc / 100, sc / 100);
        const s = L.texts ? holdKeys(L.texts, t) : L.text;
        const col = L.colors ? lerpKeys(L.colors, t) : L.color;
        ctx.font = `${W[L.weight] || 700} ${L.size}px Geist`; ctx.letterSpacing = L.ls + 'px';
        ctx.fillStyle = `rgb(${col.map(v => Math.round(v * 255)).join(',')})`;
        if (L.type === 'text') { ctx.textAlign = L.align; ctx.fillText(s, 0, 0); }
        else {
          // the expressions, as AE would evaluate them
          ctx.textAlign = 'left'; const n = s.length, st = Math.min(0.018, 0.3 / Math.max(1, n)), so = Math.min(0.012, 0.08 / Math.max(1, n - 1)), du = 0.3 - so * (n - 1);
          const wTot = ctx.measureText(s).width;
          ctx.beginPath(); ctx.rect(-30, -1.02 * L.size, wTot + 60, 1.32 * L.size); ctx.clip();
          for (let i = 0; i < n; i++) {
            const pi = Math.min(1, Math.max(0, (t - L.tIn - i * st) / L.d)), ei = pi >= 1 ? 1 : 1 - Math.pow(2, -10 * pi);
            let dy = (1 - ei) * 1.25 * L.size;
            if (L.tOut !== null) { const po = Math.min(1, Math.max(0, (t - L.tOut - i * so) / du)); dy -= (po <= 0 ? 0 : Math.pow(2, 10 * po - 10)) * 1.3 * L.size; }
            const xi = ctx.measureText(s.slice(0, i + 1)).width - ctx.measureText(s[i]).width;
            ctx.fillText(s[i], xi, dy);
          }
        }
      }
      ctx.restore();
    }
  }, [D, t, uri]);
  await p.screenshot({ path: path.join(out, `ae_${f}.png`) });
  const r = spawnSync('ffmpeg', ['-i', path.join(out, `film_${f}.png`), '-i', path.join(out, `ae_${f}.png`), '-lavfi', 'psnr', '-f', 'null', '-'], { encoding: 'utf8' });
  console.log(`${s}s  PSNR ${(/average:(\S+)/.exec(r.stderr) || [])[1]} dB`);
}
await b.close();
