// Full render: Playwright, 60 fps, 3 subframes per frame piped to ffmpeg and blended with tmix.
// Frames are rendered in chunks, each to its own segment: a crashed browser only retries its chunk,
// and running the command again skips every chunk that is already finished.
// usage: node tools/render.mjs [workers] [outDir] [fromFrame] [toFrame]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
import fs from 'fs'; import path from 'path';
const FPS = 60, SUB = 3, CHUNK = 240;
const [nw = '4', outDir = 'out/render', fa, fb] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const html = 'file://' + path.resolve('showreel.html');

async function openPage() {
  const browser = await chromium.launch({ args: ['--disable-gpu', '--force-color-profile=srgb'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(html);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 30000 });
  return { browser, page };
}

async function renderChunk(page, f0, f1, seg) {
  const part = seg.replace(/\.mp4$/, '.part.mp4');
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-c:v', 'mjpeg', '-i', '-',
    '-vf', `tmix=frames=${SUB}:weights='1 1 1',select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB`,
    '-r', String(FPS), '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', part], { stdio: ['pipe', 'inherit', 'inherit'] });
  const closed = new Promise(r => ff.on('close', r));
  try {
    for (let k = f0; k < f1; k++) {
      for (let j = 0; j < SUB; j++) {
        const t = k / FPS + (j - (SUB - 1) / 2) / (FPS * SUB * 2);   // subframes 1/360 s apart (180-degree shutter)
        await page.evaluate(t => window.seek(t), t);
        const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      }
    }
  } catch (e) {
    ff.stdin.destroy(); ff.kill('SIGKILL'); await closed; fs.rmSync(part, { force: true });
    throw e;
  }
  ff.stdin.end();
  const code = await closed;
  if (code !== 0) throw new Error(`ffmpeg exited with ${code}`);
  fs.renameSync(part, seg);
}

const total = Math.round(await (async () => { const { browser, page } = await openPage(); const d = await page.evaluate(() => window.DUR); await browser.close(); return d; })() * FPS);
const A = fa ? +fa : 0, Bf = fb ? +fb : total;
const chunks = [];
for (let f0 = A; f0 < Bf; f0 += CHUNK) chunks.push({ f0, f1: Math.min(Bf, f0 + CHUNK), seg: path.join(outDir, `seg_${String(f0).padStart(5, '0')}.mp4`) });
const queue = chunks.filter(c => !fs.existsSync(c.seg));
console.log(`${total} frames, ${chunks.length} chunks, ${queue.length} to render`);
const T0 = Date.now();
let done = chunks.length - queue.length;

async function worker(id) {
  let ctx = null;
  while (queue.length) {
    const c = queue.shift();
    for (let attempt = 1; ; attempt++) {
      try {
        if (!ctx) ctx = await openPage();
        await renderChunk(ctx.page, c.f0, c.f1, c.seg);
        break;
      } catch (e) {
        console.error(`w${id} frames ${c.f0}-${c.f1} attempt ${attempt} failed: ${String(e.message).split('\n')[0]}`);
        try { await ctx?.browser.close(); } catch { }
        ctx = null;
        if (attempt >= 3) throw e;
      }
    }
    console.log(`w${id} chunk ${++done}/${chunks.length} (frames ${c.f0}-${c.f1}) ${((Date.now() - T0) / 1000).toFixed(0)}s`);
  }
  if (ctx) await ctx.browser.close();
}

await Promise.all(Array.from({ length: +nw }, (_, i) => worker(i)));
fs.writeFileSync(path.join(outDir, 'list.txt'), chunks.map(c => `file '${path.basename(c.seg)}'`).join('\n') + '\n');
console.log('segments done');
