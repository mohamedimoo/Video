// Export one editable design board per scene for Claude Design.
// usage: node tools/design-export.mjs <outdir>
// For each scene it picks a moment where the scene is fully built, renders the background (shapes only,
// no camera, without the text and images) as <outdir>/plates/<n>.jpg, and writes the text and images
// drawn at that moment, in frame pixels, to <outdir>/scenes.json.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';
const out = process.argv[2] || 'out/design';
fs.mkdirSync(path.join(out, 'plates'), { recursive: true });
const BEAT = 60 / 84;
// [real beat where the scene starts, name, beat inside the scene to snapshot]
const SCENES = [
  [0, 'Hook', 3.4], [4, 'They live on their phones', 6.9], [8, 'Disruption', 14.6], [16, 'Risk to opportunity', 18.6],
  [20, 'Awareness to relevance', 26.6], [28, 'Habit loop', 35.8], [36, 'Thirty days compare', 38.6], [40, '7–15×', 42.7],
  [44, 'Super-apps globe', 51.4], [53, 'Nafath', 57.6], [59, 'Strategy House', 71.6], [74, 'Three forces · EAI', 81.6],
  [86, 'Get the right plan', 92.4], [95, 'AI wheel', 101.4], [104, 'Usage chart', 107.6], [108, '72% and barriers', 115.4],
  [116, 'Reason to stay', 117.6], [120, 'One app hub', 125.6], [128, 'Step by step', 137.4], [140, 'Beyond telco · moments', 146.6],
  [148, 'Thirty days lit', 155.6], [156, 'End card', 162.4], [164, 'End title', 165.6]
];
const b = await chromium.launch({ args: ['--disable-gpu', '--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto('file://' + path.resolve('showreel.html'));
await p.waitForFunction(() => window.ready === true);
await p.addScriptTag({ path: path.resolve('tools/ae-instrument.js') });
const scenes = [];
for (let i = 0; i < SCENES.length; i++) {
  const [b0, name, hb] = SCENES[i];
  const t = Math.round(hb * BEAT * 60) / 60;
  const tr = await p.evaluate(t => window.__AE.trace(t), t);
  const keys = tr.els.filter(e => e.native).map(e => e.key);
  await p.evaluate(([t, k]) => { window.SAMPLES = 1; window.__AE.plate(k); window.seek(t); window.__AE.mode = 'off'; }, [t, keys]);
  await p.screenshot({ path: path.join(out, 'plates', `${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 86 });
  scenes.push({ n: i + 1, name, start: +(b0 * BEAT).toFixed(3), t, els: tr.els.filter(e => e.native) });
}
await b.close();
fs.writeFileSync(path.join(out, 'scenes.json'), JSON.stringify(scenes));
console.log(scenes.map(s => `${s.n} ${s.name}: ${s.els.filter(e => e.k !== 'img').length} text, ${s.els.filter(e => e.k === 'img').length} images`).join('\n'));
