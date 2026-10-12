// Turn out/design/scenes.json into one Claude Design artboard per scene: the scene's background as an image,
// then every image and line of text at its exact place, as editable markup (text in Geist, inline styles).
// usage: node tools/design-boards.mjs <canvas root> <blob map json> <existing canvas.json>
import fs from 'fs'; import path from 'path';
const [root, mapFile, canvasFile] = process.argv.slice(2);
const scenes = JSON.parse(fs.readFileSync('out/design/scenes.json', 'utf8'));
const blobs = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
const canvas = JSON.parse(fs.readFileSync(canvasFile, 'utf8'));
const IMG = Object.fromEntries(fs.readdirSync('ae/assets').filter(f => f.endsWith('.png')).map(f => {
  const b = fs.readFileSync('ae/assets/' + f); return [f.slice(0, -4), [b.readUInt32BE(16), b.readUInt32BE(20)]];
}));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r1 = v => Math.round(v * 10) / 10;
const app = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const css = c => c;
const fmt = s => { const m = Math.floor(s / 60), r = Math.floor(s % 60); return m + ':' + (r < 10 ? '0' : '') + r; };
fs.mkdirSync(path.join(root, 'project'), { recursive: true });
const COLS = 4, W = 1920, H = 1080, GX = 80, GY = 120, Y0 = 1100;
canvas.notes = canvas.notes || {};
canvas.notes.scenes = { x: 0, y: Y0 - 260, text: 'Scenes: one editable frame per scene', kind: 'title1', maxW: COLS * W + (COLS - 1) * GX };
for (const s of scenes) {
  const file = `Scene-${String(s.n).padStart(2, '0')}.dc.html`;
  const parts = [];
  for (const e of s.els) {
    const ms = Math.hypot(e.m[0], e.m[1]), rot = r1(Math.atan2(e.m[1], e.m[0]) * 180 / Math.PI);
    const op = e.a < 0.999 ? ` opacity: ${r1(e.a * 100) / 100};` : '';
    if (e.k === 'img') {
      const url = blobs[e.name]; if (!url) continue;
      const [cx, cy] = app(e.m, e.cx, e.cy), w = r1(e.w * ms), h = r1(e.h * ms);
      const tr = rot ? ` transform: rotate(${rot}deg);` : '';
      if (e.clip) {
        const c = e.clip, cs = Math.hypot(c.m[0], c.m[1]), [x0, y0] = app(c.m, c.x, c.y), cw = c.w * cs, ch = c.h * cs;
        parts.push(`  <div style="position: absolute; left: ${r1(x0)}px; top: ${r1(y0)}px; width: ${r1(cw)}px; height: ${r1(ch)}px; border-radius: ${r1(c.r * cs)}px; overflow: hidden;${op}${tr}">\n    <img src="${url}" alt="${e.name}" style="position: absolute; left: ${r1(cx - w / 2 - x0)}px; top: ${r1(cy - h / 2 - y0)}px; width: ${w}px; height: ${h}px; object-fit: fill">\n  </div>`);
      } else {
        parts.push(`  <img src="${url}" alt="${e.name}" style="position: absolute; left: ${r1(cx - w / 2)}px; top: ${r1(cy - h / 2)}px; width: ${w}px; height: ${h}px;${op}${tr}">`);
      }
    } else {
      const fs_ = r1(e.size * ms), [ax, ay] = app(e.m, e.k === 'rise' ? e.L : e.x, e.y);
      const al = e.k === 'rise' ? 'left' : (e.al || 'left');
      const shift = al === 'center' ? ' translateX(-50%)' : al === 'right' ? ' translateX(-100%)' : '';
      const tr = shift || rot ? ` transform:${shift}${rot ? ` rotate(${rot}deg)` : ''}; transform-origin: 0 85%;` : '';
      parts.push(`  <div style="position: absolute; left: ${r1(ax)}px; top: ${r1(ay - 0.85 * fs_)}px; margin: 0; font-size: ${fs_}px; line-height: 1; font-weight: ${e.w || 700}; letter-spacing: ${r1((e.ls || 0) * ms)}px; color: ${css(e.c)}; white-space: pre;${op}${tr}">${esc(e.s)}</div>`);
    }
  }
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(String(s.n).padStart(2, '0') + ' ' + s.name)}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<style>
body{margin:0}
</style>
</helmet>
<div style="position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #020E0D; font-family: Geist, system-ui, sans-serif; color: #F0F5F0">
  <img src="${blobs['plate' + s.n]}" alt="Scene ${s.n} background: shapes and motion graphics" style="position: absolute; left: 0px; top: 0px; width: ${W}px; height: ${H}px">
${parts.join('\n')}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${W},"height":${H}}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(root, 'project', file), html);
  const i = s.n - 1;
  canvas.boards[file] = { x: (i % COLS) * (W + GX), y: Y0 + Math.floor(i / COLS) * (H + GY), w: W, h: H, title: `${String(s.n).padStart(2, '0')} ${s.name} · ${fmt(s.start)}` };
  if (!canvas.order.includes(file)) canvas.order.push(file);
}
fs.writeFileSync(path.join(root, 'project', 'canvas.json'), JSON.stringify(canvas));
console.log('boards:', scenes.length);
