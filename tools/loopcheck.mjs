import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'path';
const b = await chromium.launch({ args: ['--disable-gpu'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + path.resolve('showreel.html'));
await p.waitForFunction(() => window.ready === true);
const D = await p.evaluate(() => window.DUR);
for (const [t, f] of [[0, 'out/first.png'], [D - 1 / 60, 'out/last.png']]) { await p.evaluate(t => window.seek(t), t); await p.screenshot({ path: f }); }
await b.close();
