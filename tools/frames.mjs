// Render frames at chosen times: node tools/frames.mjs <outdir> <time expr> [<time expr> ...]
// Each expression is evaluated in the page, so the timing helpers work: "B(31.5)", "BN(36)+0.2", "BV(86)".
// Times snap to the 60 fps grid, like the render.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';
const [out, ...exprs] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--disable-gpu', '--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.error('PAGE ERROR', e.message));
await p.goto('file://' + path.resolve('showreel.html'));
await p.waitForFunction(() => window.ready === true);
let i = 0;
for (const e of exprs) {
  await p.evaluate(e => window.seek(Math.round(eval(e) * 60) / 60), e);
  await p.screenshot({ path: `${out}/b${String(i++).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 85 });
}
await b.close();
