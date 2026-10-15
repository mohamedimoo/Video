// ===== Soundtrack, written in code and rendered offline =====
// A modern, driving score at the film's 84 BPM: punchy drums with an 808 bass, a darbuka groove,
// sidechained supersaw chords, a lead hook, and whooshes, risers and impacts on every scene change.
// The arrangement follows the acts, so the energy builds with the story and drops on the big moments.
// Every number on screen is still a note (sonification), now voiced from the chord that is playing.
const SCENE_HITS = [4, 8, 16, 20, 28, 31, 36, 40, 48, 52, 60, 66, 68, 72, 80, 86, 88, 92, 100, 102, 104, 108, 112, 116, 120, 128, 132];
const SCENE_HITS_V = [36, 53, 80, 87, 91, 129, 131.5, 134, 136.5, 138.6, 157.6, 160.5];   // real beats: inserted bars, step-by-step phases, end card
// D minor, i VI III VII: Dm  Bb  F  C. [bass root, chord voicing]
const PROG = [[38, [62, 65, 69]], [34, [62, 65, 70]], [41, [60, 65, 69]], [36, [60, 64, 67]]];
const chordAt = t => PROG[Math.floor((t + 1e-6) / BAR) % 4];
// a sonification degree climbs the D minor pentatonic (D F G A C), with E for F under the C chord
const PENTA = [0, 3, 5, 7, 10];
const degMidi = (d, t) => { const k = ((d % 5) + 5) % 5, m = 62 + 12 * Math.floor(d / 5) + PENTA[k]; return k === 1 && chordAt(t)[0] === 36 ? m - 1 : m; };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
// the lead hook, one phrase per chord: [16th step, midi, length in 16ths]
const HOOK = [
  [[0, 69, 2], [2, 74, 2], [4, 72, 1], [5, 74, 3], [8, 77, 3], [11, 76, 1], [12, 74, 4]],
  [[0, 74, 2], [2, 72, 2], [4, 70, 2], [6, 69, 4], [10, 65, 2], [12, 67, 2], [14, 69, 2]],
  [[0, 72, 2], [2, 77, 2], [4, 76, 1], [5, 77, 3], [8, 81, 4], [12, 79, 2], [14, 77, 2]],
  [[0, 76, 3], [3, 74, 1], [4, 72, 4], [8, 76, 2], [10, 79, 2], [12, 76, 4]],
];
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
  const S16 = BEAT / 4;
  const G = n => Math.round(BV(n) / BEAT);        // real beat -> beat on the final grid
  // the arrangement, in beats on the final grid
  const A2 = G(28), A3 = G(59), A4 = G(96), A5 = G(128), BUILD = G(148), DROP = G(156), ENDT = G(164);
  const NB = Math.round(DUR / BEAT);
  const part = n => n < 4 ? 'intro' : n < A2 ? 'a1' : n < A3 ? 'a2' : n < A4 ? 'a3' : n < A5 ? 'a4'
    : n < A5 + 4 ? 'breath' : n < BUILD ? 'a5' : n < DROP ? 'build' : n < ENDT ? 'drop' : 'end';

  // ---------- busses ----------
  const out = ac.createGain(); out.gain.value = 0.42;
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -18; comp.knee.value = 8; comp.ratio.value = 3; comp.attack.value = 0.003; comp.release.value = 0.12;
  const clip = ac.createWaveShaper(); { const c = new Float32Array(2048); for (let i = 0; i < 2048; i++) { const x = i / 1023.5 - 1; c[i] = Math.tanh(1.4 * x) / Math.tanh(1.4); } clip.curve = c; }
  out.connect(comp); comp.connect(clip); clip.connect(ac.destination);
  const drums = ac.createGain(); drums.gain.value = 0.9; drums.connect(out);
  const duck = ac.createGain(); duck.connect(out);                 // music, pumped by the kick
  const music = ac.createGain(); music.gain.value = 1.15; music.connect(duck);
  const fx = ac.createGain(); fx.gain.value = 0.9; fx.connect(out);
  // deterministic noise
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const nb = ac.createBuffer(1, SR * 2, SR), nd = nb.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = rnd() * 2 - 1;
  const noise = (t, dur) => { const s = ac.createBufferSource(); s.buffer = nb; s.loop = true; s.start(t, (t * 7.31) % 1.5); s.stop(t + dur); return s; };
  // plate reverb from a decaying noise impulse
  const ir = ac.createBuffer(2, Math.round(SR * 2.4), SR);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp += 0.55 * ((rnd() * 2 - 1) - lp); d[i] = lp * Math.pow(1 - i / d.length, 3.2) * Math.exp(-i / (SR * 0.55)); } }
  const verb = ac.createConvolver(); verb.buffer = ir;
  const verbIn = ac.createGain(); verbIn.gain.value = 0.6; const verbHp = ac.createBiquadFilter(); verbHp.type = 'highpass'; verbHp.frequency.value = 280;
  verbIn.connect(verbHp); verbHp.connect(verb); verb.connect(out);
  // dotted-eighth ping-pong delay
  const dl = ac.createDelay(2), dr = ac.createDelay(2), fb = ac.createGain(), dlf = ac.createBiquadFilter(), merge = ac.createChannelMerger(2), dIn = ac.createGain();
  dl.delayTime.value = dr.delayTime.value = BEAT * 0.75; fb.gain.value = 0.38; dlf.type = 'lowpass'; dlf.frequency.value = 3800; dIn.gain.value = 0.5;
  dIn.connect(dl); dl.connect(dlf); dlf.connect(dr); dr.connect(fb); fb.connect(dl);
  dl.connect(merge, 0, 0); dr.connect(merge, 0, 1); const dOut = ac.createGain(); dOut.gain.value = 0.55; merge.connect(dOut); dOut.connect(out);
  const panTo = (dest, p) => { const n = ac.createStereoPanner(); n.pan.value = p; n.connect(dest); return n; };
  const send = (node, rv = 0, dly = 0) => { if (rv) { const g = ac.createGain(); g.gain.value = rv; node.connect(g); g.connect(verbIn); } if (dly) { const g = ac.createGain(); g.gain.value = dly; node.connect(g); g.connect(dIn); } };
  const env = (g, t, peak, a, d) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
  const sat = (() => { const w = ac.createWaveShaper(), c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; c[i] = Math.tanh(2.2 * x); } w.curve = c; return () => { const s = ac.createWaveShaper(); s.curve = c; return s; }; })();

  // ---------- drums ----------
  const kickTimes = [];
  const kick = (t, v = 1) => {
    kickTimes.push(t);
    const o = ac.createOscillator(), g = ac.createGain(), s = sat();
    o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(52, t + 0.07); o.frequency.exponentialRampToValueAtTime(40, t + 0.3);
    env(g, t, 0.7 * v, 0.003, 0.34); o.connect(s); s.connect(g); g.connect(drums); o.start(t); o.stop(t + 0.4);
    const c = noise(t, 0.02), cf = ac.createBiquadFilter(), cg = ac.createGain();
    cf.type = 'highpass'; cf.frequency.value = 2500; env(cg, t, 0.25 * v, 0.001, 0.012); c.connect(cf); cf.connect(cg); cg.connect(drums);
  };
  const clap = (t, v = 1) => {
    const f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 0.9;
    g.gain.setValueAtTime(0.0001, t);
    [0, 0.011, 0.022].forEach(o => { g.gain.setValueAtTime(0.42 * v, t + o); g.gain.exponentialRampToValueAtTime(0.06 * v, t + o + 0.009); });
    g.gain.setValueAtTime(0.32 * v, t + 0.032); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    const s = noise(t, 0.22); s.connect(f); f.connect(g); g.connect(drums); send(g, 0.35);
    const o = ac.createOscillator(), og = ac.createGain(); o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(170, t + 0.06);
    env(og, t, 0.18 * v, 0.002, 0.08); o.connect(og); og.connect(drums); o.start(t); o.stop(t + 0.1);
  };
  const hat = (t, v, open = false, p = 0.2) => {
    const s = noise(t, open ? 0.3 : 0.06), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = 'highpass'; f.frequency.value = open ? 7000 : 8500; env(g, t, v, 0.001, open ? 0.24 : 0.035);
    s.connect(f); f.connect(g); g.connect(panTo(drums, p));
  };
  const crash = (t, v = 0.22) => {
    const s = noise(t, 2.2), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = 'highpass'; f.frequency.value = 5200; env(g, t, v, 0.002, 2.0); s.connect(f); f.connect(g); g.connect(drums); send(g, 0.3);
  };
  const doum = (t, v = 1) => {
    const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(92, t + 0.12);
    env(g, t, 0.34 * v, 0.003, 0.26); o.connect(g); g.connect(panTo(drums, -0.15)); o.start(t); o.stop(t + 0.3);
  };
  const tak = (t, v = 1, p = 0.3) => {
    const s = noise(t, 0.06), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.frequency.value = 3400; f.Q.value = 3;
    env(g, t, 0.5 * v, 0.001, 0.04); s.connect(f); f.connect(g); g.connect(panTo(drums, p)); send(g, 0.18);
    const o = ac.createOscillator(), og = ac.createGain(); o.type = 'triangle'; o.frequency.value = 760; env(og, t, 0.1 * v, 0.001, 0.035);
    o.connect(og); og.connect(panTo(drums, p)); o.start(t); o.stop(t + 0.05);
  };

  // ---------- music ----------
  const bass808 = (t, m, dur, v = 1, glideTo = null) => {
    const o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), s = sat(), f = ac.createBiquadFilter();
    o.frequency.setValueAtTime(mtof(m) * 1.5, t); o.frequency.exponentialRampToValueAtTime(mtof(m), t + 0.03);
    if (glideTo !== null) { o.frequency.setValueAtTime(mtof(m), t + dur * 0.6); o.frequency.exponentialRampToValueAtTime(mtof(glideTo), t + dur); }
    o2.type = 'triangle'; o2.frequency.value = mtof(m + 12); const g2 = ac.createGain(); g2.gain.value = 0.3; const drive = ac.createGain(); drive.gain.value = 0.6;
    f.type = 'lowpass'; f.frequency.value = 900;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.24 * v, t + 0.006); g.gain.setTargetAtTime(0.11 * v, t + 0.05, 0.3);
    g.gain.setValueAtTime(0.1 * v, t + dur - 0.03); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(drive); o2.connect(g2); g2.connect(drive); drive.connect(s); s.connect(f); f.connect(g); g.connect(music); o.start(t); o2.start(t); o.stop(t + dur + 0.01); o2.stop(t + dur + 0.01);
  };
  const saw = (t, m, dur, lvl, cutoff, dest, voices = 5, spread = 14) => {
    const f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'lowpass'; f.frequency.value = cutoff; f.Q.value = 0.7;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(lvl, t + 0.04); g.gain.setValueAtTime(lvl, t + dur - 0.08); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    for (let v = 0; v < voices; v++) {
      const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = (v - (voices - 1) / 2) * spread;
      o.connect(panTo(f, (v - (voices - 1) / 2) / voices * 1.4)); o.start(t); o.stop(t + dur + 0.01);
    }
    f.connect(g); g.connect(dest); return g;
  };
  const pluck = (t, m, lvl, cutoff, p, dest = music, rv = 0.25, dly = 0.3) => {
    const o = ac.createOscillator(), o2 = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = 'sawtooth'; o2.type = 'square'; o.frequency.value = mtof(m); o2.frequency.value = mtof(m); o2.detune.value = 7;
    f.type = 'lowpass'; f.Q.value = 3; f.frequency.setValueAtTime(cutoff, t); f.frequency.exponentialRampToValueAtTime(300, t + 0.22);
    env(g, t, lvl, 0.003, 0.25); o.connect(f); o2.connect(f); f.connect(g); const pn = panTo(dest, p); g.connect(pn); send(g, rv, dly);
    o.start(t); o2.start(t); o.stop(t + 0.3); o2.stop(t + 0.3);
  };
  const bell = (t, m, lvl, p) => {   // FM bell for the sonification
    const c = ac.createOscillator(), mo = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain();
    c.frequency.value = mtof(m); mo.frequency.value = mtof(m) * 3.5; mg.gain.setValueAtTime(mtof(m) * 1.6, t); mg.gain.exponentialRampToValueAtTime(1, t + 0.5);
    mo.connect(mg); mg.connect(c.frequency); env(g, t, lvl, 0.002, 0.6); c.connect(g); const pn = panTo(fx, p); g.connect(pn); send(g, 0.3, 0.18);
    c.start(t); mo.start(t); c.stop(t + 0.65); mo.stop(t + 0.65);
  };
  const lead = (t, m, dur, lvl, prev) => {
    const o = ac.createOscillator(), o2 = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
    o.type = 'sawtooth'; o2.type = 'square'; o2.detune.value = -9;
    const fr = mtof(m);
    if (prev !== null && Math.abs(prev - m) <= 5) { o.frequency.setValueAtTime(mtof(prev), t); o.frequency.exponentialRampToValueAtTime(fr, t + 0.06); }
    else { o.frequency.setValueAtTime(fr * 0.944, t); o.frequency.exponentialRampToValueAtTime(fr, t + 0.05); }   // a little grace-note bend, ney style
    o2.frequency.value = fr;
    lfo.frequency.value = 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(fr * 0.008, t + Math.min(dur, 0.5)); lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
    f.type = 'lowpass'; f.Q.value = 2; f.frequency.setValueAtTime(5200, t); f.frequency.exponentialRampToValueAtTime(2200, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(lvl, t + 0.012); g.gain.setTargetAtTime(lvl * 0.75, t + 0.05, 0.2);
    g.gain.setValueAtTime(lvl * 0.7, t + dur - 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.08);
    o.connect(f); o2.connect(f); f.connect(g); g.connect(music); send(g, 0.3, 0.32);
    [o, o2, lfo].forEach(x => { x.start(t); x.stop(t + dur + 0.1); });
  };

  // ---------- the groove, one 16th at a time ----------
  const KICK = { a1: [0, 7, 10], a2: [0, 3, 7, 10], a3: [0, 3, 7, 10], a4: [0, 3, 7, 8, 10], a5: [0, 7, 10], drop: [0, 3, 7, 8, 10], build: [0, 4, 8, 12] };
  const MAQSUM = { 0: 'D', 2: 'T', 6: 'T', 8: 'D', 12: 'T', 14: 't', 15: 't' };
  for (let n = 0; n < NB; n++) {
    const P = part(n), barStep = (n % 4) * 4;
    for (let q = 0; q < 4; q++) {
      const st = barStep + q, t = n * BEAT + q * S16;
      const lastBarOfPhrase = Math.floor(n / 4) % 4 === 3;
      // kick
      if (KICK[P] && KICK[P].includes(st) && !(P === 'build' && n >= DROP - 2)) kick(t, P === 'build' ? 0.75 + 0.25 * (n - BUILD) / (DROP - BUILD) : 1);
      // clap on 2 and 4
      if ((st === 4 || st === 12) && ['a1', 'a2', 'a3', 'a4', 'a5', 'drop'].includes(P)) clap(t, P === 'a1' ? 0.85 : 1);
      if (st === 15 && lastBarOfPhrase && ['a3', 'a4', 'drop'].includes(P)) clap(t, 0.4);
      // hats
      if (P === 'a1' && q % 2 === 0) hat(t, q === 2 ? 0.1 : 0.06, false, 0.2);
      if (['a2', 'a3', 'a5', 'breath'].includes(P)) hat(t, [0.05, 0.03, 0.09, 0.035][q], false, 0.22);
      if (P === 'a4' || P === 'drop') {
        if (st === 6 || st === 14) hat(t, 0.08, true, -0.2);
        else if (lastBarOfPhrase && st >= 12) { for (let r = 0; r < 3; r++) hat(t + r * S16 / 3, 0.04 + r * 0.02, false, 0.25 - r * 0.15); }
        else hat(t, [0.06, 0.035, 0.1, 0.04][q], false, 0.22);
      }
      // darbuka
      if ((P === 'a2' || P === 'a5' || P === 'breath') && MAQSUM[st] !== undefined) {
        const k = MAQSUM[st]; if (k === 'D') doum(t); else tak(t, k === 'T' ? 0.8 : 0.4, k === 'T' ? 0.3 : -0.3);
      }
      if (P === 'a3' && (st === 6 || st === 14)) tak(t, 0.45, 0.35);
    }
  }
  // snare roll and drums lift through the build
  for (let n = BUILD; n < DROP; n++) {
    const k = (n - BUILD) / (DROP - BUILD), div = k < 0.5 ? 2 : k < 0.75 ? 4 : 8;
    for (let j = 0; j < div; j++) { const t = n * BEAT + j * BEAT / div; clap(t, 0.25 + 0.6 * (k + j / div / (DROP - BUILD))); }
  }
  // sidechain pump on every kick
  duck.gain.setValueAtTime(1, 0);
  kickTimes.sort((a, b) => a - b).forEach(t => { duck.gain.setValueAtTime(1, t); duck.gain.linearRampToValueAtTime(0.25, t + 0.01); duck.gain.setTargetAtTime(1, t + 0.03, 0.09); });

  // bass, per bar
  const NBAR = Math.ceil(NB / 4);
  for (let bar = 0; bar < NBAR; bar++) {
    const n0 = bar * 4, P = part(n0), t0 = n0 * BEAT;
    if (['intro', 'breath', 'end'].includes(part(n0)) || n0 >= DROP - 2 && n0 < DROP) continue;
    const [root] = chordAt(t0), nextRoot = chordAt(t0 + BAR)[0];
    const hits = (KICK[P] || [0, 8]).filter(s => !(P === 'build' && s > 0 && n0 + s / 4 >= DROP - 2));
    hits.forEach((s, i) => {
      const end = i + 1 < hits.length ? hits[i + 1] : 16, dur = (end - s) * S16;
      const oct = (P === 'a4' || P === 'drop') && s === 7 ? 12 : 0;
      const glide = i === hits.length - 1 && bar % 2 === 1 && nextRoot !== root ? nextRoot : null;
      bass808(t0 + s * S16, root + oct, dur, P === 'a1' ? 0.75 : 1, glide);
    });
  }
  // pads: supersaw chords, pumped by the kick
  for (let bar = 0; bar < NBAR; bar++) {
    const n0 = bar * 4, P = part(n0), t0 = n0 * BEAT; if (P === 'end') continue;
    const lvl = { intro: 0, a1: 0.016, a2: 0.022, a3: 0.036, a4: 0.042, breath: 0.04, a5: 0.032, build: 0.036, drop: 0.046 }[P];
    if (!lvl) continue;
    const cut = { a1: 1200, a2: 1600, a3: 2600, a4: 3600, breath: 2200, a5: 2600, build: 1200 + 4000 * (n0 - BUILD) / (DROP - BUILD), drop: 4200 }[P];
    chordAt(t0)[1].forEach(m => saw(t0, m, BAR, lvl, cut, music));
    if (P === 'a4' || P === 'drop') saw(t0, chordAt(t0)[1][0] - 12, BAR, lvl * 0.7, cut * 0.6, music, 3, 10);
  }
  // arp: 16th chord tones, intro filtered, full in the drops
  const ARP = [0, 1, 2, 3, 2, 1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 5];
  for (let n = 0; n < NB; n++) {
    const P = part(n);
    const lvl = { intro: 0.07, a1: 0.05, a2: 0.06, a3: 0.045, a4: 0.07, breath: 0.07, a5: 0.06, build: 0.06, drop: 0.075, end: 0 }[P];
    if (!lvl) continue;
    for (let q = 0; q < 4; q++) {
      const t = n * BEAT + q * S16, st = (n % 4) * 4 + q, ch = chordAt(t)[1], i = ARP[st];
      const m = ch[i % 3] + 12 * Math.floor(i / 3);
      const cut = P === 'intro' ? 700 + 1800 * (n * 4 + q) / 16 : P === 'build' ? 1500 + 4500 * (n - BUILD) / (DROP - BUILD) : P === 'a3' ? 1800 : 3600;
      pluck(t, m, lvl * (q === 0 ? 1.2 : 0.85), cut, ((st % 4) - 1.5) * 0.35);
    }
  }
  // lead hook: Act IV and the final drop; a softer pass over the plan story
  const leadAt = (nA, nB, lvl) => {
    let prev = null;
    for (let bar = Math.ceil(nA / 4); bar * 4 < nB; bar++) {
      const t0 = bar * 4 * BEAT, ci = PROG.indexOf(chordAt(t0));
      HOOK[ci].forEach(([s, m, l]) => { if (bar * 4 + s / 4 < nB) { lead(t0 + s * S16, m, l * S16 * 0.92, lvl, prev); prev = m; } });
    }
  };
  leadAt(G(84), A4, 0.06);
  leadAt(A4, A5, 0.09);
  leadAt(A5 + 8, BUILD, 0.065);
  leadAt(DROP, ENDT, 0.1);

  // ---------- sound design ----------
  const whooshIn = (t, d = 0.55, v = 0.22) => {   // a swell that rushes into a cut, left to right
    const s = noise(t - d, d + 0.05), f = ac.createBiquadFilter(), g = ac.createGain(), p = ac.createStereoPanner();
    f.type = 'bandpass'; f.Q.value = 1.4; f.frequency.setValueAtTime(500, t - d); f.frequency.exponentialRampToValueAtTime(7000, t);
    g.gain.setValueAtTime(0.0001, t - d); g.gain.exponentialRampToValueAtTime(v, t - 0.01); g.gain.linearRampToValueAtTime(0.0001, t + 0.04);
    p.pan.setValueAtTime(-0.7, t - d); p.pan.linearRampToValueAtTime(0.7, t);
    s.connect(f); f.connect(g); g.connect(p); p.connect(fx); send(g, 0.25);
  };
  const impact = (t, big) => {
    const o = ac.createOscillator(), g = ac.createGain(), s = sat();
    o.frequency.setValueAtTime(big ? 95 : 80, t); o.frequency.exponentialRampToValueAtTime(32, t + (big ? 1.1 : 0.6));
    env(g, t, big ? 0.4 : 0.22, 0.004, big ? 1.3 : 0.7); o.connect(s); s.connect(g); g.connect(fx); o.start(t); o.stop(t + 1.5);
    const nz = noise(t, 0.5), f = ac.createBiquadFilter(), ng = ac.createGain();
    f.type = 'lowpass'; f.frequency.setValueAtTime(big ? 9000 : 6000, t); f.frequency.exponentialRampToValueAtTime(300, t + 0.4);
    env(ng, t, big ? 0.3 : 0.16, 0.002, 0.4); nz.connect(f); f.connect(ng); ng.connect(fx); send(ng, big ? 0.6 : 0.35);
    chordAt(t)[1].forEach((m, i) => pluck(t, m + 12, big ? 0.07 : 0.045, 6000, (i - 1) * 0.5, fx, 0.5, 0.25));
    if (big) crash(t);
  };
  const riser = (t0, t1, v = 0.3) => {
    const s = noise(t0, t1 - t0), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = 'bandpass'; f.Q.value = 2.2; f.frequency.setValueAtTime(300, t0); f.frequency.exponentialRampToValueAtTime(10000, t1);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t1 - 0.02); g.gain.linearRampToValueAtTime(0.0001, t1 + 0.01);
    s.connect(f); f.connect(g); g.connect(fx); send(g, 0.3);
    const o = ac.createOscillator(), og = ac.createGain(), of = ac.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(mtof(45), t0); o.frequency.exponentialRampToValueAtTime(mtof(81), t1);
    of.type = 'lowpass'; of.frequency.setValueAtTime(500, t0); of.frequency.exponentialRampToValueAtTime(6000, t1);
    og.gain.setValueAtTime(0.0001, t0); og.gain.exponentialRampToValueAtTime(v * 0.25, t1 - 0.02); og.gain.linearRampToValueAtTime(0.0001, t1 + 0.01);
    o.connect(of); of.connect(og); og.connect(fx); o.start(t0); o.stop(t1 + 0.02);
  };
  const BIG = [4, A2, A3, A4, A5, DROP].map(n => n * BEAT);
  const hits = SCENE_HITS.map(B).concat(SCENE_HITS_V.map(BV)).filter(t => t < DUR - 0.5).sort((a, b) => a - b)
    .filter((t, i, a) => i === 0 || t - a[i - 1] > 0.2);
  hits.forEach(t => { const big = BIG.some(b => Math.abs(b - t) < 0.05); if (!big) { whooshIn(t, 0.45, 0.16); impact(t, false); } });
  BIG.forEach(t => { whooshIn(t, 0.7, 0.28); impact(t, true); });
  riser(2 * BEAT, 4 * BEAT, 0.22);
  riser((A2 - 4) * BEAT, A2 * BEAT, 0.26);
  riser((A4 - 4) * BEAT, A4 * BEAT, 0.28);
  riser(BUILD * BEAT, DROP * BEAT, 0.36);
  riser(BV(158.5), BV(160.5), 0.24);
  // the hook: the verb cards whip past, ticking
  for (let i = 0; i < 10; i++) { const t = 0.35 + i * 0.13; hat(t, 0.05 + i * 0.006, false, (i % 2 ? 0.5 : -0.5)); }

  // the end title: drums out, the chord rings in D major and fades before the loop point
  {
    const t = ENDT * BEAT;
    impact(t, false);
    [38, 50, 57, 62, 66, 69, 74].forEach((m, i) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = i < 2 ? 'sine' : 'triangle'; o.frequency.value = mtof(m);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(i < 2 ? 0.14 : 0.05, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, DUR - 0.05);
      o.connect(g); g.connect(panTo(fx, (i % 3 - 1) * 0.35)); send(g, 0.5); o.start(t); o.stop(DUR);
    });
    saw(t, 62, DUR - t - 0.05, 0.02, 2400, fx); saw(t, 66, DUR - t - 0.05, 0.02, 2400, fx); saw(t, 69, DUR - t - 0.05, 0.02, 2400, fx);
  }

  // ---------- sonification ----------
  sonicEvents().forEach(([t, d, l, kind], i) => {
    if (kind === 'whoosh') { whooshIn(t + 0.6, 0.6, l * 0.6); return; }
    if (kind === 'tick') {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(2600, t); o.frequency.exponentialRampToValueAtTime(1500, t + 0.03);
      env(g, t, l * 0.45, 0.001, 0.04); o.connect(g); g.connect(panTo(fx, ((i * 37) % 7 - 3) / 6)); o.start(t); o.stop(t + 0.05);
      return;
    }
    bell(t, degMidi(d, t), 0.11 * l, ((d * 3) % 7 - 3) / 5);
  });

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
