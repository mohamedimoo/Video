// render every headline hand-off mid-transition to confirm the outgoing and incoming lines never overlap
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'path'; import fs from 'fs';
fs.mkdirSync('out/swap', { recursive: true });
const b = await chromium.launch({ args: ['--disable-gpu'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + path.resolve('showreel.html'));
await p.waitForFunction(() => window.ready === true);
const pts = ['B(16)', 'B(17)', 'B(23)', 'B(24)', 'B(61)', 'B(63)', 'BV(86)', 'BV(89)', 'BV(93)', 'BV(131.5)', 'BV(134)', 'BV(136.5)', 'BN(112)', 'B(113)', 'B(116)', 'B(119)'];
let i = 0;
for (const e of pts) for (const d of [-0.05, 0.12, 0.3]) {
  await p.evaluate(([e, d]) => { window.SAMPLES = 1; window.seek(eval(e) + d); }, [e, d]);
  await p.screenshot({ path: `out/swap/b${String(i++).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 80 });
}
await b.close();
