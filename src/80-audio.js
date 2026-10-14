// ===== Soundtrack, written in code and rendered offline =====
// Kick on every beat, a riser into the last full bar, a hit on each scene change,
// and every number on screen is also a note (sonification).
const SCENE_HITS = [4, 8, 16, 20, 28, 31, 36, 40, 48, 52, 60, 66, 68, 72, 80, 86, 88, 92, 100, 102, 104, 108, 112, 116, 120, 128, 132];
const SCENE_HITS_V = [36, 53, 80, 87, 91, 129, 131.5, 134, 136.5, 138.6, 157.6, 160.5];   // real beats: inserted bars, step-by-step phases, end card
const PROG = [[38, [62, 66, 69]], [35, [59, 62, 66]], [31, [55, 59, 62]], [33, [57, 61, 64]]]; // D  Bm  G  A
const PENTA = [0, 2, 4, 7, 9];
const degMidi = d => 62 + 12 * Math.floor(d / 5) + PENTA[((d % 5) + 5) % 5];
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function sonicEvents() {
  const ev = []; // [time, degree, gain, kind]
  [4, 5, 6, 7, 8].forEach((d, i) => ev.push([B(10 + i), d, 0.5, 'pluck']));
  [[95, 32], [30, 33], [1, 34], [1, 35]].forEach(([v, n], i) => ev.push([B(n), [9, 6, 3, 10][i], 0.5, 'pluck']));
  ev.push([B(36), 7, 0.5, 'pluck'], [B(37), 5, 0.5, 'pluck'], [B(38), 10, 0.5, 'pluck']);
  [1300, 35, 460, 50, 51].forEach((v, i) => ev.push([B(42 + i), Math.round(Math.log10(v) * 3) + 2, 0.55, 'pluck']));
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
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -14; comp.knee.value = 8; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.18;
  const master = ac.createGain(); master.gain.value = 0.8;
  master.connect(comp); comp.connect(ac.destination);
  // deterministic noise
  const nb = ac.createBuffer(1, SR * 2, SR), nd = nb.getChannelData(0);
  let seed = 7; for (let i = 0; i < nd.length; i++) { seed = (seed * 16807) % 2147483647; nd[i] = seed / 1073741823.5 - 1; }
  const noise = (t, dur) => { const s = ac.createBufferSource(); s.buffer = nb; s.start(t, (t * 7.31) % 1, dur); return s; };
  const pan = p => { const n = ac.createStereoPanner(); n.pan.value = p; n.connect(master); return n; };
  const center = pan(0);
  // sidechain bus for bass and pad
  const duck = ac.createGain(); duck.connect(center);
  const nBeats = Math.round(DUR / BEAT);
  for (let n = 0; n < nBeats; n++) {
    const t = n * BEAT;                     // the groove runs on the final grid, holds included
    duck.gain.setValueAtTime(0.35, t); duck.gain.setTargetAtTime(1, t + 0.02, 0.09);
    // kick
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.11);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(n % 4 === 0 ? 1.0 : 0.85, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o.connect(g); g.connect(center); o.start(t); o.stop(t + 0.45);
    const c = noise(t, 0.02), cf = ac.createBiquadFilter(), cg = ac.createGain();
    cf.type = 'highpass'; cf.frequency.value = 3000; cg.gain.setValueAtTime(0.18, t); cg.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
    c.connect(cf); cf.connect(cg); cg.connect(center);
    // hats from Act II, 16ths from Act IV
    if (n >= RB(28)) {
      const steps = n >= RB(92) ? [0.25, 0.5, 0.75] : [0.5];
      steps.forEach(s => {
        const ht = t + s * BEAT, h = noise(ht, 0.06), hf = ac.createBiquadFilter(), hg = ac.createGain();
        hf.type = 'highpass'; hf.frequency.value = 7500;
        hg.gain.setValueAtTime(s === 0.5 ? 0.11 : 0.05, ht); hg.gain.exponentialRampToValueAtTime(0.001, ht + 0.05);
        h.connect(hf); hf.connect(hg); hg.connect(pan(s === 0.5 ? 0.25 : -0.25));
      });
    }
    // bass (8ths), from bar 2
    if (n >= 4 && n < nBeats - 1) {
      const [root] = PROG[Math.floor(n / 4) % 4];
      const subs = n >= RB(28) ? [0, 0.5] : [0];
      subs.forEach(s => {
        const bt = t + s * BEAT, bo = ac.createOscillator(), bf = ac.createBiquadFilter(), bg = ac.createGain();
        bo.type = 'sawtooth'; bo.frequency.value = mtof(root + (s ? 12 : 0) * (n >= RB(92) ? 1 : 0));
        bf.type = 'lowpass'; bf.frequency.setValueAtTime(n >= RB(92) ? 900 : 480, bt); bf.frequency.exponentialRampToValueAtTime(160, bt + 0.25); bf.Q.value = 4;
        bg.gain.setValueAtTime(0.0001, bt); bg.gain.exponentialRampToValueAtTime(0.32, bt + 0.01); bg.gain.exponentialRampToValueAtTime(0.0001, bt + BEAT * 0.48);
        bo.connect(bf); bf.connect(bg); bg.connect(duck); bo.start(bt); bo.stop(bt + BEAT * 0.5);
      });
    }
  }
  // pad: enters at the strategy house, opens at the EAI orb
  for (let bar = 15; bar < 41; bar++) {
    const t = BV(bar * 4), [, chord] = PROG[Math.round(t / BAR) % 4];
    const lvl = bar < 18 ? 0.035 : bar < 22 ? 0.05 : 0.06;
    const cutoff = bar < 18 ? 900 : bar < 22 ? 1800 : 2600;
    chord.forEach((m, i) => [-7, 7].forEach(dt => {
      const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
      o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = dt;
      f.type = 'lowpass'; f.frequency.value = cutoff;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(lvl, t + 0.25); g.gain.setValueAtTime(lvl, t + BAR - 0.12); g.gain.linearRampToValueAtTime(0.0001, t + BAR);
      o.connect(f); f.connect(g); g.connect(duck); o.start(t); o.stop(t + BAR + 0.02);
    }));
  }
  // scene-change hits
  SCENE_HITS.map(B).concat(SCENE_HITS_V.map(BV)).forEach(t => {
    const n = Math.round(t / BEAT);
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.6);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.55, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    o.connect(g); g.connect(center); o.start(t); o.stop(t + 1);
    const s = noise(t, 0.4), f = ac.createBiquadFilter(), ng = ac.createGain();
    f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(5000, t); f.frequency.exponentialRampToValueAtTime(400, t + 0.3);
    ng.gain.setValueAtTime(0.22, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    s.connect(f); f.connect(ng); ng.connect(center);
    const [, chord] = PROG[Math.floor(n / 4) % 4];
    chord.forEach((m, i) => {
      const so = ac.createOscillator(), sg = ac.createGain();
      so.type = 'triangle'; so.frequency.value = mtof(m + 12);
      sg.gain.setValueAtTime(0.0001, t); sg.gain.exponentialRampToValueAtTime(0.07, t + 0.005); sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      so.connect(sg); sg.connect(pan((i - 1) * 0.4)); so.start(t); so.stop(t + 0.55);
    });
  });
  // riser into the last full bar
  {
    const t0 = B(124), t1 = B(128);
    const s = noise(t0, t1 - t0), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = 'bandpass'; f.Q.value = 2; f.frequency.setValueAtTime(300, t0); f.frequency.exponentialRampToValueAtTime(9000, t1);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.4, t1 - 0.02); g.gain.linearRampToValueAtTime(0, t1);
    s.connect(f); f.connect(g); g.connect(center);
    const o = ac.createOscillator(), og = ac.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(mtof(50), t0); o.frequency.exponentialRampToValueAtTime(mtof(74), t1);
    const of = ac.createBiquadFilter(); of.type = 'lowpass'; of.frequency.setValueAtTime(400, t0); of.frequency.exponentialRampToValueAtTime(5000, t1);
    og.gain.setValueAtTime(0.0001, t0); og.gain.exponentialRampToValueAtTime(0.09, t1 - 0.02); og.gain.linearRampToValueAtTime(0, t1);
    o.connect(of); of.connect(og); og.connect(center); o.start(t0); o.stop(t1);
  }
  // a short second riser into the last full bar ("the joy of technology")
  {
    const t0 = BV(158.5), t1 = BV(160.5);
    const s2 = noise(t0, t1 - t0), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = 'bandpass'; f.Q.value = 2; f.frequency.setValueAtTime(500, t0); f.frequency.exponentialRampToValueAtTime(8000, t1);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.3, t1 - 0.02); g.gain.linearRampToValueAtTime(0, t1);
    s2.connect(f); f.connect(g); g.connect(center);
  }
  // the final resolve on the end title
  [[B(128), 1.6, 0.06], [BV(160.5), 2.2, 0.07], [B(132), 1.1, 0.05]].forEach(([t, d, l]) => {
    [50, 57, 62, 66, 69, 74].forEach((m, i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = i < 2 ? 'sine' : 'triangle'; o.frequency.value = mtof(m);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(l * (i < 2 ? 2 : 1), t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(pan((i % 3 - 1) * 0.3)); o.start(t); o.stop(t + d + 0.05);
    });
  });
  // sonification
  sonicEvents().forEach(([t, d, l, kind], i) => {
    if (kind === 'whoosh') {
      const n = noise(t, 0.9), f = ac.createBiquadFilter(), g = ac.createGain();
      f.type = 'bandpass'; f.Q.value = 3; f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(6000, t + 0.8);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(l, t + 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      n.connect(f); f.connect(g); g.connect(center);
      return;
    }
    if (kind === 'tick') {
      const s = noise(t, 0.03), f = ac.createBiquadFilter(), g = ac.createGain();
      f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 6;
      g.gain.setValueAtTime(l, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      s.connect(f); f.connect(g); g.connect(pan(((i * 37) % 7 - 3) / 6));
      return;
    }
    const o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain();
    o.type = 'triangle'; o.frequency.value = mtof(degMidi(d));
    o2.type = 'sine'; o2.frequency.value = mtof(degMidi(d) + 12);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16 * l * 2, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(g); o2.connect(g); g.connect(pan(((d * 3) % 7 - 3) / 5)); o.start(t); o2.start(t); o.stop(t + 0.5); o2.stop(t + 0.5);
  });

  const buf = await ac.startRendering();
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
