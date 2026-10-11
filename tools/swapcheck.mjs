// render the exact moments of every headline swap, mid-transition, to confirm nothing overlaps
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'path'; import fs from 'fs';
fs.mkdirSync('out/swap', { recursive: true });
const b = await chromium.launch({ args: ['--disable-gpu'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + path.resolve('showreel.html'));
await p.waitForFunction(() => window.ready === true);
const beats = [16, 17, 23, 61, 63];           // story beats
const real = [84, 85.6];                       // real beats
let i = 0;
for (const sb of beats) for (const d of [-0.1, 0.08]) { await p.evaluate(([sb, d]) => window.seek(B(sb) + d), [sb, d]); await p.screenshot({ path: `out/swap/b${String(i++).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 80 }); }
for (const rb of real) for (const d of [-0.1, 0.08]) { await p.evaluate(([rb, d]) => window.seek(BN(rb) + d), [rb, d]); await p.screenshot({ path: `out/swap/b${String(i++).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 80 }); }
await b.close();
