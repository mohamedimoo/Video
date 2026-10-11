// Render stills: node tools/stills.mjs <outdir> <fromBeat> <toBeat> [offsetSeconds]
// One frame per (real) beat, taken `offset` seconds after each downbeat.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';
const [out = 'out/stills', a = '0', b = '134', off = '0.42'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--disable-gpu', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
await page.goto('file://' + path.resolve('showreel.html'));
await page.waitForFunction(() => window.ready === true, null, { timeout: 30000 });
const BEAT = await page.evaluate(() => window.BEAT);
for (let n = +a; n < +b; n++) {
  const t = Math.round((n * BEAT + +off) * 60) / 60;   // on the 60 fps grid, like the render (crisp wipes stay crisp)
  await page.evaluate(t => window.seek(t), t);
  await page.screenshot({ path: `${out}/b${String(n).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 80 });
}
await browser.close();
