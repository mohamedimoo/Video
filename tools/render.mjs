// Full render: Playwright, 60 fps, 3 subframes per frame piped to ffmpeg and blended with tmix.
// usage: node tools/render.mjs [workers] [outDir] [fromFrame] [toFrame]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
import fs from 'fs'; import path from 'path';
const FPS = 60, SUB = 3;
const [nw = '4', outDir = 'out/render', fa, fb] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const html = 'file://' + path.resolve('showreel.html');

async function worker(id, f0, f1) {
  const browser = await chromium.launch({ args: ['--disable-gpu', '--force-color-profile=srgb'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(html);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 30000 });
  const seg = path.join(outDir, `seg_${String(id).padStart(2, '0')}.mp4`);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-c:v', 'mjpeg', '-i', '-',
    '-vf', `tmix=frames=${SUB}:weights='1 1 1',select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB`,
    '-r', String(FPS), '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let k = f0; k < f1; k++) {
    for (let j = 0; j < SUB; j++) {
      const t = k / FPS + (j - (SUB - 1) / 2) / (FPS * SUB * 2);   // subframes 1/360 s apart (180-degree shutter)
      await page.evaluate(t => window.seek(t), t);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    if ((k - f0) % 120 === 0) console.log(`w${id} frame ${k - f0}/${f1 - f0} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  return seg;
}

const total = Math.round(await (async () => { const b = await chromium.launch({ args: ["--disable-gpu"] }); const pg = await b.newPage(); await pg.goto(html); await pg.waitForFunction(() => window.ready === true); const d = await pg.evaluate(() => window.DUR); await b.close(); return d; })() * FPS);
const A = fa ? +fa : 0, Bf = fb ? +fb : total;
const n = +nw, per = Math.ceil((Bf - A) / n);
const jobs = [];
for (let i = 0; i < n; i++) { const a = A + i * per, b = Math.min(Bf, a + per); if (a < b) jobs.push(worker(i, a, b)); }
const segs = await Promise.all(jobs);
fs.writeFileSync(path.join(outDir, 'list.txt'), segs.map(s => `file '${path.basename(s)}'`).join('\n'));
console.log('segments done');
