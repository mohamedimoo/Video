// Precompute the dotted world map: a lat/lon grid of points that fall on land (Natural Earth 50m).
// usage: node tools/landdots.mjs <land-50m.json> <topojson-client.js> [spacingDeg]
import fs from 'fs'; import { createRequire } from 'module';
const [landPath, tcPath, spacing = '1.8'] = process.argv.slice(2);
const require = createRequire(import.meta.url);
const topojson = require(tcPath);
const topo = JSON.parse(fs.readFileSync(landPath, 'utf8'));
const land = topojson.feature(topo, topo.objects.land);
const polys = [];
for (const f of land.features ?? [land]) {
  const g = f.geometry ?? f;
  const list = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  for (const rings of list) {
    const xs = rings[0].map(p => p[0]), ys = rings[0].map(p => p[1]);
    polys.push({ rings, bb: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] });
  }
}
const inRing = (x, y, r) => {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const onLand = (lon, lat) => polys.some(p => lon >= p.bb[0] && lon <= p.bb[2] && lat >= p.bb[1] && lat <= p.bb[3]
  && inRing(lon, lat, p.rings[0]) && !p.rings.slice(1).some(h => inRing(lon, lat, h)));
const d = +spacing, out = [];
for (let lat = -58; lat <= 80; lat += d) {
  const step = d / Math.max(0.2, Math.cos(lat * Math.PI / 180));
  const off = (Math.round(lat / d) % 2) * step / 2;          // brick-offset rows read as a dot matrix
  for (let lon = -180 + off; lon < 180; lon += step) if (onLand(lon, lat)) out.push([+lat.toFixed(1), +lon.toFixed(1)]);
}
fs.writeFileSync('assets/land.json', JSON.stringify(out));
console.log('land dots:', out.length);
