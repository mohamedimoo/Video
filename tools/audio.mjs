// Render the Web Audio soundtrack (OfflineAudioContext inside the page) to a WAV file
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';
const out = process.argv[2] || 'out/soundtrack.wav';
fs.mkdirSync(path.dirname(out), { recursive: true });
const browser = await chromium.launch({ args: ['--disable-gpu', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
await page.goto('file://' + path.resolve('showreel.html'));
await page.waitForFunction(() => window.ready === true, null, { timeout: 30000 });
const b64 = await page.evaluate(() => window.renderAudio());
fs.writeFileSync(out, Buffer.from(b64, 'base64'));
console.log('wrote', out);
await browser.close();
