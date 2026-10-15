// Inline fonts, opentype.js and all src/*.js into one self-contained showreel.html
import fs from 'fs'; import path from 'path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = f => fs.readFileSync(path.join(root, f));
const js = fs.readdirSync(path.join(root, 'src')).filter(f => f.endsWith('.js')).sort()
  .map(f => `// ---- ${f} ----\n` + src('src/' + f).toString()).join('\n');
const html = src('src/template.html').toString()
  .replace('__WOFF2__', () => src('assets/Geist-Variable.woff2').toString('base64'))
  .replace('__TTF__', () => src('assets/Geist-Bold.ttf').toString('base64'))
  .replace('__OPENTYPE__', () => src('assets/opentype.min.js').toString())
  .replace('__ICONS__', () => src('assets/icons.json').toString())
  .replace('__LAND__', () => src('assets/land.json').toString())
  .replace('__IMGS__', () => JSON.stringify(Object.fromEntries(fs.readdirSync(path.join(root, 'assets/packed')).filter(f => f.endsWith('.webp'))
    .map(f => [f.replace('.webp', ''), 'data:image/webp;base64,' + src('assets/packed/' + f).toString('base64')]))))
  .replace('__AUDIO__', () => JSON.stringify(Object.fromEntries(fs.readdirSync(path.join(root, 'assets/audio')).filter(f => f.endsWith('.ogg'))
    .map(f => [f.replace('.ogg', ''), src('assets/audio/' + f).toString('base64')]))))
  .replace('__MAIN__', () => js);
fs.writeFileSync(path.join(root, 'showreel.html'), html);
console.log('built showreel.html', (html.length / 1024).toFixed(0) + 'KB');
