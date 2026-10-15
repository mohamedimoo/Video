// ===== Soundtrack (Salam Vision v5), written in code and rendered offline =====
// An original afro-house track at 126 BPM in the vibe of Mohamed's theme: a deep Db bass on his
// syncopated rhythm, four-on-the-floor kick, shakers and congas, airy Db lydian chords, bright plucks
// and a lead hook. 126 BPM locks to the film: one film beat (84 BPM) is exactly 1.5 music beats, so
// every section starts on a music 16th. Each section starts on a music downbeat; a leftover half bar
// becomes a two-beat fill. Whooshes and hits sit on the cuts measured in the rendered picture, snapped
// to the music's 16th grid. The bars before the end card thin out and rise into the Salam outro sound
// (assets/audio/outro.ogg), which plays alone over the end card.
// the story's scene changes; the camera pushes in on these (src/90-main.js)
const SCENE_HITS = [4, 8, 16, 20, 28, 31, 36, 40, 48, 52, 60, 66, 68, 72, 80, 86, 88, 92, 100, 102, 104, 108, 112, 116, 120, 128, 132];
const SCENE_HITS_V = [36, 53, 80, 87, 91, 129, 131.5, 134, 136.5, 138.6, 157.6, 160.5];   // real beats: inserted bars, step-by-step phases, end card
const MB = 60 / 126, M16 = MB / 4;
const snap16 = t => Math.round(t / M16) * M16;
// [seconds, strength]: the biggest frame-to-frame changes in the rendered film (30 fps), one per half second
const VCUTS = [[1.07, 38], [2.14, 25], [3.1, 44], [3.69, 15], [5.6, 48], [14.17, 51], [18.69, 18], [19.29, 29], [22.5, 17],
  [28.81, 14], [45.6, 69], [49.4, 19], [56.43, 45], [70.36, 17], [71.9, 46], [76.07, 46], [76.79, 67], [80.36, 19], [85.83, 37],
  [87.14, 17], [93.21, 16], [94.29, 15], [101.9, 40], [102.5, 21], [103.21, 20], [104.4, 87], [108.57, 36], [109.05, 82]];
// Db lydian. Per bar of a section: Dbmaj9, Dbmaj9, Ab(add9), Fm7. [bass root, pad voicing, arp tones]
const PROG = [[37, [61, 65, 68, 72], [61, 65, 68, 72, 73]], [37, [61, 65, 68, 72], [61, 65, 68, 72, 79]],
  [32, [60, 63, 68, 70], [60, 63, 68, 70, 75]], [41, [60, 63, 65, 68], [60, 63, 65, 68, 72]]];
// the lead hook, one bar per chord: [16th step, midi, length in 16ths]
const HOOK = [
  [[0, 80, 3], [3, 77, 3], [6, 75, 2], [8, 73, 4], [12, 75, 2], [14, 77, 2]],
  [[0, 79, 2], [2, 77, 2], [4, 75, 4], [8, 72, 2], [10, 73, 6]],
  [[0, 75, 3], [3, 72, 3], [6, 75, 2], [8, 80, 4], [12, 79, 2], [14, 75, 2]],
  [[0, 77, 4], [4, 75, 2], [6, 72, 2], [8, 68, 4], [12, 70, 2], [14, 72, 2]],
];
// a sonification degree climbs the Db major pentatonic (Db Eb F Ab Bb)
const PENTA = [0, 2, 4, 7, 9];
const degMidi = d => 61 + 12 * Math.floor(d / 5) + PENTA[((d % 5) + 5) % 5];
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function sonicEvents() {
  const ev = []; // [time, degree, gain, kind]
  [4, 5, 6, 7, 8].forEach((d, i) => ev.push([B(10 + i), d, 0.5, 'pluck']));
  [[95, 32], [30, 33], [1, 34], [1, 35]].forEach(([v, n], i) => ev.push([B(n), [9, 6, 3, 10][i], 0.5, 'pluck']));
  ev.push([B(36), 7, 0.5, 'pluck'], [B(37), 5, 0.5, 'pluck'], [B(38), 10, 0.5, 'pluck']);
  [1300, 35, 460, 50, 51].forEach((v, i) => ev.push([B(42 + i * PIN_STEP), Math.round(Math.log10(v) * 3) + 2, 0.55, 'pluck']));
  [0, 1, 2, 3, 4].forEach(i => ev.push([B(52 + i * 0.25 + (i > 2 ? 0.25 : 0)), 2 + i, 0.3, 'pluck']));
  [0, 1, 2, 3, 4].forEach(i => ev.push([B(55) + i * 0.08, 5 + i, 0.35, 'pluck']));
  [93, 80, 65, 57, 50].forEach((v, i) => ev.push([B(88 + Math.floor(i / 2)) + (i % 2) * 0.15, Math.round(v / 9), 0.5, 'pluck']));
  for (let i = 0; i < 7; i++) ev.push([B(92) + i * 0.07, 3 + i, 0.32, 'pluck']);
  [23, 22, 20, 17].forEach((v, i) => ev.push([B(94 + i), Math.round(v / 3) - 1, 0.55, 'pluck']));
  [0, 1, 2, 3].forEach(i => ev.push([B(98 + Math.floor(i / 2)) + (i % 2) * 0.15, 8 + i, 0.5, 'pluck']));
  DAY_T.forEach((tt, d) => ev.push([tt, 2 + (d % 15), 0.42, 'pluck']));
  // the inserted bars
  for (let d = 0; d < 30; d++) ev.push([BN(36.6) + d * BN(1) / 30, 2 + (d % 10), 0.22, 'pluck']);
  ev.push([BN(38), 0, 0.6, 'pluck']);
  [0, 1, 2].forEach(k => ev.push([BN(75.9) + k * 0.12, 7 + k * 2, 0.45, 'pluck']));
  // the habit loop: a soft note each time the light passes a node, quickening with the loop
  for (let L = 0; ; L += 1 / 3) { const tt = knTimeOf(L); if (tt > BN(39.3)) break; ev.push([tt, [4, 7, 9][Math.round(L * 3) % 3], 0.16, 'pluck']); }
  [0, 1, 2, 3, 4, 5].forEach(i => ev.push([BN(113 + Math.floor(i / 2)) + (i % 2) * 0.1, 5 + i, 0.4, 'pluck']));
  // Trust: the rings form, the ID is scanned, stamped, the profile verified
  ev.push([RIYADH_IN, 12, 0.5, 'pluck'], [RIYADH_IN + 0.42, 9, 0.35, 'pluck']);   // arriving in Riyadh
  [0, 1, 2, 3, 4].forEach(i => ev.push([BV(53) + i * 0.12, 4 + i * 2, 0.4, 'pluck']));
  ev.push([BV(54), 9, 0.4, 'pluck'], [BV(55.5), 0, 0.5, 'tick'], [BV(56.95), 12, 0.45, 'pluck']);   // the stamp lands, the profile is verified
  // AI wheel: domains fill up the scale, capabilities come back down, pulses tick
  for (let j = 0; j < 10; j++) ev.push([B(81) + j * 0.075, 2 + j, 0.28, 'pluck'], [B(82) + j * 0.075, 11 - j, 0.24, 'pluck']);
  [83, 84, 85].forEach(n => ev.push([B(n), 0, 0.3, 'tick']));
  // step by step: one note per phase, ticks for the icons and callouts
  [129, 131.5, 134].forEach((n, i) => ev.push([BV(n), 3 + i * 3, 0.55, 'pluck']));
  [132, 132.6, 134.5, 135.1].forEach(n => [0, 1, 2].forEach(i => ev.push([BV(n) + i * 0.08, 0, 0.22, 'tick'])));
  ev.push([BV(138.6), 0, 0.5, 'whoosh']);
  // end card: the spiral, the wordmark, the line
  ev.push([BV(157.6), 0, 0.45, 'whoosh'], [BV(159), 7, 0.5, 'pluck'], [BV(160), 9, 0.45, 'pluck'], [BV(161.25), 11, 0.4, 'pluck'], [BV(162), 12, 0.35, 'pluck'], [BV(162.5), 14, 0.35, 'pluck']);
  // soft UI ticks on cards and tiles
  [10, 11, 12, 13, 14, 29, 30, 42, 43, 44, 45, 46, 90, 91, 103, 105, 106, 108, 109, 110, 116, 117, 118, 119].forEach(n => ev.push([B(n) + 0.02, 0, 0.25, 'tick']));
  return ev;
}

window.renderAudio = async function () {
  const SR = 44100, len = Math.ceil(DUR * SR);
  const ac = new OfflineAudioContext(2, len, SR);
  // sections start on film beats (real beats), matched to the cuts in the picture
  const SECS = [['hook', 0], ['a1', 4], ['a2', 28], ['a3', 60], ['a4', 96], ['a5', 128], ['build', 148], ['outro', 156]].map(([n, b]) => ({ n, t: BV(b) }));
  const OUTRO = SECS[7].t;
  const BARS = [];
  SECS.slice(0, -1).forEach((s, i) => {
    const end = SECS[i + 1].t;
    for (let t = s.t, k = 0; t < end - 1e-3; k++) { const beats = Math.min(4, Math.round((end - t) / MB)); BARS.push({ sec: s.n, t, beats, k, last: false }); t += beats * MB; }
    BARS[BARS.length - 1].last = true;
  });
  const decode = async b64 => ac.decodeAudioData(Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer);
  const outroBuf = await decode(window.__AUDIO.outro);

  // deterministic noise
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const NOISE = new Float32Array(SR * 2); for (let i = 0; i < NOISE.length; i++) NOISE[i] = rnd() * 2 - 1;
  const noiseIn = (c, t, dur) => { const b = c.createBuffer(1, NOISE.length, SR); b.copyToChannel(NOISE, 0); const s = c.createBufferSource(); s.buffer = b; s.loop = true; s.start(t, (t * 7.31) % 1.5); s.stop(t + dur); return s; };
  const env = (g, t, peak, a, d) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
  const satCurve = k => { const c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; c[i] = Math.tanh(k * x) / Math.tanh(k); } return c; };
  // one-shots are rendered once into buffers, then each hit is just a buffer playing
  const oneShot = async (dur, build) => { const c = new OfflineAudioContext(1, Math.ceil(dur * SR), SR); build(c, c.destination); return c.startRendering(); };
  const KICK = await oneShot(0.5, (c, d) => {
    const o = c.createOscillator(), g = c.createGain(), w = c.createWaveShaper(); w.curve = satCurve(2);
    o.frequency.setValueAtTime(160, 0); o.frequency.exponentialRampToValueAtTime(55, 0.06); o.frequency.exponentialRampToValueAtTime(42, 0.35);
    env(g, 0, 0.95, 0.002, 0.28); o.connect(w); w.connect(g); g.connect(d); o.start(0); o.stop(0.5);
    const n = noiseIn(c, 0, 0.02), f = c.createBiquadFilter(), ng = c.createGain(); f.type = 'highpass'; f.frequency.value = 3000; env(ng, 0, 0.25, 0.001, 0.012); n.connect(f); f.connect(ng); ng.connect(d);
  });
  const CLAP = await oneShot(0.35, (c, d) => {
    const f = c.createBiquadFilter(), g = c.createGain(); f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 0.8;
    g.gain.setValueAtTime(0.0001, 0); [0, 0.01, 0.021].forEach(o => { g.gain.setValueAtTime(0.5, o); g.gain.exponentialRampToValueAtTime(0.07, o + 0.009); });
    g.gain.setValueAtTime(0.38, 0.031); g.gain.exponentialRampToValueAtTime(0.0001, 0.28);
    const n = noiseIn(c, 0, 0.3); n.connect(f); f.connect(g); g.connect(d);
  });
  const SHAKER = await oneShot(0.09, (c, d) => {
    const f = c.createBiquadFilter(), g = c.createGain(); f.type = 'bandpass'; f.frequency.value = 7500; f.Q.value = 0.8;
    g.gain.setValueAtTime(0.0001, 0); g.gain.exponentialRampToValueAtTime(0.5, 0.012); g.gain.exponentialRampToValueAtTime(0.0001, 0.08);
    const n = noiseIn(c, 0, 0.09); n.connect(f); f.connect(g); g.connect(d);
  });
  const OHAT = await oneShot(0.3, (c, d) => {
    const f = c.createBiquadFilter(), g = c.createGain(); f.type = 'highpass'; f.frequency.value = 7000; env(g, 0, 0.45, 0.002, 0.25);
    const n = noiseIn(c, 0, 0.3); n.connect(f); f.connect(g); g.connect(d);
  });
  const conga = (f0) => oneShot(0.3, (c, d) => {
    const o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(f0 * 1.15, 0); o.frequency.exponentialRampToValueAtTime(f0, 0.03);
    env(g, 0, 0.6, 0.002, 0.22); o.connect(g); g.connect(d); o.start(0); o.stop(0.3);
    const n = noiseIn(c, 0, 0.02), f = c.createBiquadFilter(), ng = c.createGain(); f.type = 'bandpass'; f.frequency.value = f0 * 6; env(ng, 0, 0.2, 0.001, 0.015); n.connect(f); f.connect(ng); ng.connect(d);
  });
  const CONGA_LO = await conga(196), CONGA_HI = await conga(294);
  const RIM = await oneShot(0.08, (c, d) => {
    const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = 1700; env(g, 0, 0.5, 0.001, 0.04); o.connect(g); g.connect(d); o.start(0); o.stop(0.08);
  });
  const PLUCKS = {};
  const pluckBuf = async m => PLUCKS[m] || (PLUCKS[m] = await oneShot(0.6, (c, d) => {
    const o = c.createOscillator(), o2 = c.createOscillator(), o3 = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
    o.type = 'sawtooth'; o2.type = 'square'; o3.type = 'sine'; o.frequency.value = o2.frequency.value = mtof(m); o2.detune.value = 8; o3.frequency.value = mtof(m + 12);
    f.type = 'lowpass'; f.Q.value = 4; f.frequency.setValueAtTime(5200, 0); f.frequency.exponentialRampToValueAtTime(450, 0.25);
    env(g, 0, 0.5, 0.003, 0.5); o.connect(f); o2.connect(f); const g3 = c.createGain(); g3.gain.value = 0.35; o3.connect(g3); g3.connect(f); f.connect(g); g.connect(d);
    [o, o2, o3].forEach(x => { x.start(0); x.stop(0.6); });
  }));
  const BELLS = {};
  const bellBuf = async m => BELLS[m] || (BELLS[m] = await oneShot(0.8, (c, d) => {
    const car = c.createOscillator(), mo = c.createOscillator(), mg = c.createGain(), g = c.createGain();
    car.frequency.value = mtof(m); mo.frequency.value = mtof(m) * 3.5; mg.gain.setValueAtTime(mtof(m) * 1.4, 0); mg.gain.exponentialRampToValueAtTime(1, 0.5);
    mo.connect(mg); mg.connect(car.frequency); env(g, 0, 0.5, 0.002, 0.7); car.connect(g); g.connect(d); car.start(0); mo.start(0); car.stop(0.8); mo.stop(0.8);
  }));

  // ---------- busses ----------
  const out = ac.createGain(); out.gain.value = 0.38;
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -18; comp.knee.value = 8; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.14;
  const clip = ac.createWaveShaper(); clip.curve = satCurve(1.3);
  out.connect(comp); comp.connect(clip); clip.connect(ac.destination);
  const drums = ac.createGain(); drums.gain.value = 0.9; drums.connect(out);
  const duck = ac.createGain(); duck.connect(out);                       // music, pumped by the kick
  const musicHp = ac.createBiquadFilter(); musicHp.type = 'highpass'; musicHp.frequency.value = 20; musicHp.connect(duck);
  const drumHp = ac.createBiquadFilter(); drumHp.type = 'highpass'; drumHp.frequency.value = 20; drumHp.connect(drums);
  const fx = ac.createGain(); fx.gain.value = 0.85; fx.connect(out);
  const ir = ac.createBuffer(2, Math.round(SR * 2.6), SR);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp += 0.5 * ((rnd() * 2 - 1) - lp); d[i] = lp * Math.pow(1 - i / d.length, 3) * Math.exp(-i / (SR * 0.6)); } }
  const verb = ac.createConvolver(); verb.buffer = ir;
  const verbIn = ac.createGain(); verbIn.gain.value = 0.55; const verbHp = ac.createBiquadFilter(); verbHp.type = 'highpass'; verbHp.frequency.value = 300;
  verbIn.connect(verbHp); verbHp.connect(verb); verb.connect(out);
  const dl = ac.createDelay(2), dr = ac.createDelay(2), fbk = ac.createGain(), dlf = ac.createBiquadFilter(), merge = ac.createChannelMerger(2), dIn = ac.createGain();
  dl.delayTime.value = dr.delayTime.value = MB * 0.75; fbk.gain.value = 0.35; dlf.type = 'lowpass'; dlf.frequency.value = 4000; dIn.gain.value = 0.45;
  dIn.connect(dl); dl.connect(dlf); dlf.connect(dr); dr.connect(fbk); fbk.connect(dl);
  dl.connect(merge, 0, 0); dr.connect(merge, 0, 1); const dOut = ac.createGain(); dOut.gain.value = 0.5; merge.connect(dOut); dOut.connect(duck);
  const sendTo = (node, rv = 0, dly = 0) => { if (rv) { const g = ac.createGain(); g.gain.value = rv; node.connect(g); g.connect(verbIn); } if (dly) { const g = ac.createGain(); g.gain.value = dly; node.connect(g); g.connect(dIn); } };
  const PANS = {}; const panBus = (dest, p) => { const key = dest === drumHp ? 'd' + p : dest === fx ? 'f' + p : 'm' + p; if (!PANS[key]) { const n = ac.createStereoPanner(); n.pan.value = p; n.connect(dest); PANS[key] = n; } return PANS[key]; };
  const play = (buf, t, gain, dest, p = 0) => { const s = ac.createBufferSource(), g = ac.createGain(); s.buffer = buf; g.gain.value = gain; s.connect(g); g.connect(p ? panBus(dest, p) : dest); s.start(t); return g; };
  // instrument busses with their own filters, opened and closed by the arrangement
  const arpBus = ac.createGain(), arpLp = ac.createBiquadFilter(); arpLp.type = 'lowpass'; arpLp.frequency.value = 9000; arpLp.Q.value = 0.8;
  arpBus.connect(arpLp); arpLp.connect(musicHp); sendTo(arpLp, 0.25, 0.35);
  const padBus = ac.createGain(), padLp = ac.createBiquadFilter(); padLp.type = 'lowpass'; padLp.frequency.value = 3000;
  padBus.connect(padLp); padLp.connect(musicHp); sendTo(padLp, 0.35);
  const bassBus = ac.createGain(); bassBus.gain.value = 0.3; bassBus.connect(musicHp);
  const leadBus = ac.createGain(); leadBus.connect(musicHp); sendTo(leadBus, 0.3, 0.35);

  // ---------- the arrangement, bar by bar ----------
  const kickTimes = [];
  for (const bar of BARS) {
    const { sec: P, t: t0, beats, k, last } = bar, steps = beats * 4, fill = beats === 2;
    const ci = k % 4, [root, pad, tones] = PROG[ci];
    const light = (P === 'a3' && k < 5) || (P === 'a5' && k < 2);
    const groove = !['hook'].includes(P);
    const endOfBuild = P === 'build' && last;
    for (let s = 0; s < steps; s++) {
      const t = t0 + s * M16;
      const drumsOut = endOfBuild && s >= 8;
      // kick: four on the floor, half-time while a scene builds, none in the breakdown
      if (groove && !drumsOut) {
        const onKick = fill ? s === 0 : light ? (P === 'a3' && (s === 0 || s === 8)) : s % 4 === 0;
        if (onKick) { play(KICK, t, P === 'a1' && k < 2 ? 0.85 : 1, drumHp); kickTimes.push(t); }
        if (P === 'a4' && s === 14 && !fill) { play(KICK, t, 0.55, drumHp); kickTimes.push(t); }
      }
      // clap on 2 and 4 (a rim click while a scene builds)
      if (groove && !fill && !drumsOut && (s === 4 || s === 12)) {
        if (light) { if (P === 'a3') play(RIM, t, 0.25, drumHp, 0.3); }
        else if (!(P === 'a1' && k < 1)) { const g = play(CLAP, t, 0.55, drumHp); sendTo(g, 0.3); }
      }
      // shaker 16ths everywhere the groove runs
      if (groove && !drumsOut) play(SHAKER, t, [0.16, 0.08, 0.24, 0.09][s % 4] * (light ? 0.7 : 1), drumHp, s % 2 ? 0.35 : -0.25);
      // open hats on the off-beats once the track opens up
      if (!fill && !light && !drumsOut && s % 4 === 2 && ['a2', 'a3', 'a4', 'build'].includes(P) || (P === 'a5' && k >= 3 && s % 4 === 2 && !fill)) play(OHAT, t, 0.16, drumHp, -0.3);
      // congas on Mohamed's syncopation
      if (!fill && !drumsOut && ['a2', 'a3', 'a4', 'a5'].includes(P)) {
        if (s === 3 || s === 10) play(CONGA_LO, t, 0.32, drumHp, -0.4);
        if (s === 6 || s === 7 || s === 14) play(CONGA_HI, t, s === 7 ? 0.16 : 0.26, drumHp, 0.45);
      }
      // two-beat fill bars: a clap roll into the next section
      if (fill && P !== 'hook' && s >= 4) { const g = play(CLAP, t, 0.12 + 0.05 * (s - 4), drumHp); sendTo(g, 0.25); }
      if (fill && P !== 'hook' && s >= 6) play(CLAP, t + M16 / 2, 0.12 + 0.05 * (s - 4), drumHp);
      if (P === 'build' && !last && s % 2 === 0) play(CLAP, t, 0.08 + 0.12 * (k * 16 + s) / 32, drumHp, 0.2);
      if (P === 'build' && last && s < 8) play(CLAP, t, 0.35 + 0.03 * s, drumHp, 0.2);
      // the arp: Mohamed's upper-line rhythm, climbing the chord tones
      const ARP_STEPS = [0, 3, 6, 8, 10, 13, 14];
      const arpOn = P === 'hook' || (P === 'a1' && k >= 2) || ['a2', 'a3', 'a4', 'a5', 'build'].includes(P);
      if (arpOn && ARP_STEPS.includes(s % 16) && !drumsOut) {
        const i = ARP_STEPS.indexOf(s % 16), m = tones[(i + (k % 2) * 2) % tones.length] + (i >= 4 ? 12 : 0);
        play(await pluckBuf(m), t, (s % 16 === 0 ? 0.22 : 0.17) * (P === 'a4' ? 1.1 : 1), arpBus, ((i % 3) - 1) * 0.4);
      }
    }
    // bass on Mohamed's rhythm (steps 0, 7, 10, 13), a long note while a scene builds
    if (groove && !(P === 'a5' && k < 2)) {
      const hits = fill ? [0] : light ? [0] : endOfBuild ? [0] : [0, 7, 10, 13];
      const endStep = endOfBuild ? 8 : steps;
      hits.forEach((s, i) => {
        const bt = t0 + s * M16, dur = ((i + 1 < hits.length ? hits[i + 1] : endStep) - s) * M16, m = s === 10 && P === 'a4' ? root + 12 : root;
        const o = ac.createOscillator(), o2 = ac.createOscillator(), w = ac.createWaveShaper(), f = ac.createBiquadFilter(), g = ac.createGain(), g2 = ac.createGain();
        w.curve = satCurve(1.8); o.frequency.setValueAtTime(mtof(m) * 1.4, bt); o.frequency.exponentialRampToValueAtTime(mtof(m), bt + 0.03);
        o2.type = 'sawtooth'; o2.frequency.value = mtof(m + 12); g2.gain.value = 0.12; f.type = 'lowpass'; f.frequency.value = 700;
        g.gain.setValueAtTime(0.0001, bt); g.gain.exponentialRampToValueAtTime(0.42, bt + 0.008); g.gain.setTargetAtTime(0.26, bt + 0.05, 0.25);
        g.gain.setValueAtTime(0.24, bt + dur - 0.03); g.gain.linearRampToValueAtTime(0.0001, bt + dur);
        o.connect(w); o2.connect(g2); g2.connect(w); w.connect(f); f.connect(g); g.connect(bassBus);
        [o, o2].forEach(x => { x.start(bt); x.stop(bt + dur + 0.01); });
      });
    }
    // pad: airy Db lydian chords, swelling in the hook and the breakdown
    if (!endOfBuild || true) {
      const dur = beats * MB, lvl = { hook: 0.034, a1: 0.02, a2: 0.022, a3: 0.032, a4: 0.026, a5: 0.034, build: 0.028 }[P];
      const pd = endOfBuild ? 8 * M16 : dur;
      pad.forEach((m, i) => [-9, 0, 9].forEach(dt => {
        const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = dt + i;
        g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(lvl, t0 + (P === 'hook' && k === 0 ? 1.5 : 0.06));
        g.gain.setValueAtTime(lvl, t0 + pd - 0.06); g.gain.linearRampToValueAtTime(0.0001, t0 + pd);
        o.connect(g); g.connect(panBus(padBus, dt / 15)); o.start(t0); o.stop(t0 + pd + 0.02);
      }));
    }
    // lead hook: the drop in Act IV, softly over the plan story and the vision section
    const leadLvl = P === 'a4' ? 0.085 : (P === 'a3' && k >= 8) ? 0.05 : (P === 'a5' && k >= 2) ? 0.055 : 0;
    if (leadLvl && !fill) {
      let prev = null;
      for (const [s, m, l] of HOOK[ci]) {
        const t = t0 + s * M16, dur = l * M16 * 0.9, fr = mtof(m);
        const o = ac.createOscillator(), o2 = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
        o.type = 'sawtooth'; o2.type = 'triangle'; o2.frequency.value = fr * 2;
        if (prev !== null && Math.abs(prev - m) <= 5) { o.frequency.setValueAtTime(mtof(prev), t); o.frequency.exponentialRampToValueAtTime(fr, t + 0.05); }
        else { o.frequency.setValueAtTime(fr * 0.944, t); o.frequency.exponentialRampToValueAtTime(fr, t + 0.04); }
        lfo.frequency.value = 5.5; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(fr * 0.007, t + Math.min(dur, 0.35)); lfo.connect(lg); lg.connect(o.frequency);
        f.type = 'lowpass'; f.Q.value = 1.5; f.frequency.setValueAtTime(4200, t); f.frequency.exponentialRampToValueAtTime(1800, t + dur);
        const g2 = ac.createGain(); g2.gain.value = 0.25;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(leadLvl, t + 0.01); g.gain.setTargetAtTime(leadLvl * 0.7, t + 0.04, 0.15);
        g.gain.setValueAtTime(leadLvl * 0.65, t + dur - 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.06);
        o.connect(f); o2.connect(g2); g2.connect(f); f.connect(g); g.connect(leadBus);
        [o, o2, lfo].forEach(x => { x.start(t); x.stop(t + dur + 0.08); });
        prev = m;
      }
    }
  }
  // arrangement filters: the hook opens up, the breakdown dips, the build lifts
  const sec = n => SECS.find(s => s.n === n).t;
  arpLp.frequency.setValueAtTime(1300, 0); arpLp.frequency.exponentialRampToValueAtTime(3500, sec('a1'));
  arpLp.frequency.setValueAtTime(3500, sec('a2') - 0.01); arpLp.frequency.linearRampToValueAtTime(9000, sec('a2') + 0.05);
  arpLp.frequency.setValueAtTime(9000, sec('a5')); arpLp.frequency.exponentialRampToValueAtTime(2500, sec('a5') + 0.2);
  arpLp.frequency.setValueAtTime(2500, sec('a5') + 2 * 4 * MB - 0.5); arpLp.frequency.exponentialRampToValueAtTime(9000, sec('a5') + 2 * 4 * MB);
  padLp.frequency.setValueAtTime(600, 0); padLp.frequency.exponentialRampToValueAtTime(2600, sec('a1'));
  padLp.frequency.setValueAtTime(2600, sec('build')); padLp.frequency.exponentialRampToValueAtTime(7000, OUTRO - 0.5);
  // the build thins out from the bottom into the outro
  musicHp.frequency.setValueAtTime(20, sec('build') + 4 * MB); musicHp.frequency.exponentialRampToValueAtTime(900, OUTRO - 0.02);
  drumHp.frequency.setValueAtTime(20, sec('build') + 4 * MB); drumHp.frequency.exponentialRampToValueAtTime(400, OUTRO - 0.5);
  duck.gain.setValueAtTime(1, 0);
  kickTimes.sort((a, b) => a - b).forEach(t => { duck.gain.setValueAtTime(1, t); duck.gain.linearRampToValueAtTime(0.35, t + 0.008); duck.gain.setTargetAtTime(1, t + 0.02, 0.07); });
  duck.gain.setValueAtTime(1, OUTRO - 0.3); duck.gain.linearRampToValueAtTime(0, OUTRO);

  // ---------- sound design, on the measured cuts ----------
  const whooshIn = (t, d, v) => {
    const s = noiseIn(ac, t - d, d + 0.05), f = ac.createBiquadFilter(), g = ac.createGain(), p = ac.createStereoPanner();
    f.type = 'bandpass'; f.Q.value = 1.3; f.frequency.setValueAtTime(400, t - d); f.frequency.exponentialRampToValueAtTime(6500, t);
    g.gain.setValueAtTime(0.0001, t - d); g.gain.exponentialRampToValueAtTime(v, t - 0.01); g.gain.linearRampToValueAtTime(0.0001, t + 0.05);
    p.pan.setValueAtTime(-0.6, t - d); p.pan.linearRampToValueAtTime(0.6, t);
    s.connect(f); f.connect(g); g.connect(p); p.connect(fx); sendTo(g, 0.3);
  };
  const impact = (t, big) => {
    const o = ac.createOscillator(), g = ac.createGain(), w = ac.createWaveShaper(); w.curve = satCurve(1.5);
    o.frequency.setValueAtTime(mtof(big ? 49 : 49), t); o.frequency.exponentialRampToValueAtTime(mtof(25), t + (big ? 0.9 : 0.5));
    env(g, t, big ? 0.5 : 0.28, 0.003, big ? 1.1 : 0.55); o.connect(w); w.connect(g); g.connect(fx); o.start(t); o.stop(t + 1.3);
    const n = noiseIn(ac, t, 0.5), f = ac.createBiquadFilter(), ng = ac.createGain();
    f.type = 'lowpass'; f.frequency.setValueAtTime(big ? 9000 : 6000, t); f.frequency.exponentialRampToValueAtTime(300, t + 0.35);
    env(ng, t, big ? 0.3 : 0.15, 0.002, 0.35); n.connect(f); f.connect(ng); ng.connect(fx); sendTo(ng, big ? 0.5 : 0.3);
    if (big) { const c = noiseIn(ac, t, 2), cf = ac.createBiquadFilter(), cg = ac.createGain(); cf.type = 'highpass'; cf.frequency.value = 6000; env(cg, t, 0.14, 0.002, 1.8); c.connect(cf); cf.connect(cg); cg.connect(fx); sendTo(cg, 0.3); }
  };
  const swish = (t, v) => {   // a short air swish for smaller moves
    const s = noiseIn(ac, t - 0.18, 0.26), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = 'bandpass'; f.Q.value = 2; f.frequency.setValueAtTime(1500, t - 0.18); f.frequency.exponentialRampToValueAtTime(8000, t + 0.02);
    g.gain.setValueAtTime(0.0001, t - 0.18); g.gain.exponentialRampToValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    s.connect(f); f.connect(g); g.connect(panBus(fx, 0.3)); sendTo(g, 0.2);
  };
  const riser = (t0, t1, v) => {
    const s = noiseIn(ac, t0, t1 - t0), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = 'bandpass'; f.Q.value = 2.2; f.frequency.setValueAtTime(300, t0); f.frequency.exponentialRampToValueAtTime(10000, t1);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t1 - 0.02); g.gain.linearRampToValueAtTime(0.0001, t1 + 0.01);
    s.connect(f); f.connect(g); g.connect(fx); sendTo(g, 0.3);
  };
  VCUTS.filter(([t]) => t < OUTRO - 0.2).forEach(([t, v]) => {
    const ts = snap16(t);
    if (v >= 35) { whooshIn(ts, 0.5, 0.2); impact(ts, v >= 60 || SECS.some(s => Math.abs(s.t - ts) < 0.3)); }
    else swish(ts, 0.06 + v / 600);
  });
  // risers into the sections that open big
  riser(sec('a1') - 2 * MB, sec('a1'), 0.15);
  riser(sec('a3') - 2 * MB, sec('a3'), 0.2);
  riser(sec('a4') - 4 * MB, sec('a4'), 0.24);
  riser(sec('a5') - 2 * MB, sec('a5'), 0.16);
  riser(sec('build'), OUTRO, 0.3);
  // crashes on the downbeat of each new section
  ['a2', 'a4'].forEach(n => impact(sec(n), true));

  // ---------- into the outro ----------
  { // the outro sound itself, reversed and soaked in reverb, swells into its own first note
    const rv = ac.createBuffer(2, outroBuf.length, outroBuf.sampleRate);
    for (let c = 0; c < 2; c++) { const src = outroBuf.getChannelData(Math.min(c, outroBuf.numberOfChannels - 1)), d = rv.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = src[d.length - 1 - i]; }
    const r = ac.createBufferSource(), g = ac.createGain(), dur = 2 * MB; r.buffer = rv;
    g.gain.setValueAtTime(0.0001, OUTRO - dur); g.gain.exponentialRampToValueAtTime(0.6, OUTRO - 0.03); g.gain.linearRampToValueAtTime(0, OUTRO);
    r.connect(g); g.connect(out); sendTo(g, 0.8); r.start(OUTRO - dur, rv.duration - dur, dur);
  }
  { const s = ac.createBufferSource(), g = ac.createGain(); s.buffer = outroBuf; g.gain.value = 1.6; s.connect(g); g.connect(out); s.start(OUTRO); }

  // ---------- sonification, snapped to the music's 16ths (stops at the outro) ----------
  for (const [t0, d, l, kind] of sonicEvents()) {
    const t = snap16(t0); if (t >= OUTRO - 0.1) continue;
    if (kind === 'whoosh') { swish(t + 0.6, 0.1); continue; }
    if (kind === 'tick') { play(RIM, t, l * 0.35, fx, 0.3); continue; }
    play(await bellBuf(degMidi(d)), t, 0.16 * l, fx, ((d * 3) % 7 - 3) / 5).connect(verbIn);
  }

  let buf = await ac.startRendering();
  // normalise to -2 dBFS peak
  { let pk = 0; for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) pk = Math.max(pk, Math.abs(d[i])); }
    const k = 0.79 / (pk || 1); for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= k; } }
  // 16-bit PCM WAV
  const ch = [buf.getChannelData(0), buf.getChannelData(1)], N = buf.length;
  const ab = new ArrayBuffer(44 + N * 4), dv = new DataView(ab);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); dv.setUint32(4, 36 + N * 4, true); ws(8, 'WAVE'); ws(12, 'fmt ');
  dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true); dv.setUint32(24, SR, true);
  dv.setUint32(28, SR * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); ws(36, 'data'); dv.setUint32(40, N * 4, true);
  let off = 44;
  for (let i = 0; i < N; i++) for (let c = 0; c < 2; c++) { const v = Math.max(-1, Math.min(1, ch[c][i])); dv.setInt16(off, v < 0 ? v * 0x8000 : v * 0x7FFF, true); off += 2; }
  const bytes = new Uint8Array(ab); let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
