// ===== Soundtrack (Salam Vision v4), rendered offline =====
// The music is Mohamed's theme (assets/audio/theme.ogg), time-stretched from about 93 to the film's 84 BPM
// so its downbeats land on the film's bars. It is arranged in whole bars across the film, with whooshes,
// impacts and risers on the scene changes. The bars before the outro thin out and rise into the Salam
// outro sound (assets/audio/outro.ogg), which plays alone over the end card.
// Every number on screen is still a note (sonification), as a soft bell in the theme's key of C.
const SCENE_HITS = [4, 8, 16, 20, 28, 31, 36, 40, 48, 52, 60, 66, 68, 72, 80, 86, 88, 92, 100, 102, 104, 108, 112, 116, 120, 128, 132];
const SCENE_HITS_V = [36, 53, 80, 87, 91, 129, 131.5, 134, 136.5, 138.6, 157.6, 160.5];   // real beats: inserted bars, step-by-step phases, end card
// the theme after stretching: a downbeat at THEME_DB seconds, and a four-bar phrase that repeats cleanly from there
const THEME_DB = 6.443, THEME_INTRO = THEME_DB - BAR;
// a sonification degree climbs the C minor pentatonic (C Eb F G Bb)
const PENTA = [0, 3, 5, 7, 10];
const degMidi = d => 60 + 12 * Math.floor(d / 5) + PENTA[((d % 5) + 5) % 5];
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
  const G = n => Math.round(BV(n) / BEAT);        // real beat -> beat on the final grid
  const A2 = G(28), A3 = G(59), A4 = G(96), A5 = G(128), BUILD = G(148), DROP = G(156);
  const OUTRO = DROP * BEAT;                     // the end card: only the Salam outro sound from here
  const decode = async b64 => ac.decodeAudioData(Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer);
  const theme = await decode(window.__AUDIO.theme), outroBuf = await decode(window.__AUDIO.outro);

  // ---------- busses ----------
  const out = ac.createGain(); out.gain.value = 0.8;
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -16; comp.knee.value = 8; comp.ratio.value = 2.5; comp.attack.value = 0.005; comp.release.value = 0.15;
  out.connect(comp); comp.connect(ac.destination);
  const music = ac.createGain(); const mHp = ac.createBiquadFilter(), mLp = ac.createBiquadFilter();
  mHp.type = 'highpass'; mHp.frequency.value = 20; mLp.type = 'lowpass'; mLp.frequency.value = 20000; mLp.Q.value = 0.9;
  music.connect(mHp); mHp.connect(mLp); mLp.connect(out);
  const fx = ac.createGain(); fx.gain.value = 0.55; fx.connect(out);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const nb = ac.createBuffer(1, SR * 2, SR), nd = nb.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = rnd() * 2 - 1;
  const noise = (t, dur) => { const s = ac.createBufferSource(); s.buffer = nb; s.loop = true; s.start(t, (t * 7.31) % 1.5); s.stop(t + dur); return s; };
  const ir = ac.createBuffer(2, Math.round(SR * 2.4), SR);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp += 0.55 * ((rnd() * 2 - 1) - lp); d[i] = lp * Math.pow(1 - i / d.length, 3.2) * Math.exp(-i / (SR * 0.55)); } }
  const verb = ac.createConvolver(); verb.buffer = ir; const verbIn = ac.createGain(); verbIn.gain.value = 0.5; verbIn.connect(verb); verb.connect(out);
  const panTo = (dest, p) => { const n = ac.createStereoPanner(); n.pan.value = p; n.connect(dest); return n; };
  const send = (node, rv) => { const g = ac.createGain(); g.gain.value = rv; node.connect(g); g.connect(verbIn); };
  const env = (g, t, peak, a, d) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };

  // ---------- the theme, laid out in whole bars ----------
  const XF = 0.02;   // short crossfade at each join, just before the downbeat
  const play = (at, from, dur, lvl = 1) => {
    const s = ac.createBufferSource(), g = ac.createGain(); s.buffer = theme;
    const t0 = Math.max(0, at - XF), o0 = Math.max(0, from - (at - t0));
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(lvl, t0 + XF);
    g.gain.setValueAtTime(lvl, at + dur - XF); g.gain.linearRampToValueAtTime(0, at + dur);
    s.connect(g); g.connect(music); s.start(t0, o0, dur + (at - t0) + 0.01);
  };
  // the hook plays the bar of the theme's opening that leads into its first downbeat
  play(0, THEME_INTRO, BAR);
  // then the four-bar phrase repeats, bar-aligned, up to the outro
  for (let bar = 1; bar * BAR < OUTRO - 1e-6; bar += 4) {
    const at = bar * BAR, dur = Math.min(4 * BAR, OUTRO - at);
    play(at, THEME_DB, dur);
  }
  // arrangement on the music bus: a breath at the step-by-step section, and the lead-in to the outro
  const tBreath = A5 * BEAT, tBack = (A5 + 4) * BEAT, tBuild = BUILD * BEAT;
  mLp.frequency.setValueAtTime(20000, tBreath - 0.3); mLp.frequency.exponentialRampToValueAtTime(700, tBreath + 0.2);
  mLp.frequency.setValueAtTime(700, tBack - BAR * 0.5); mLp.frequency.exponentialRampToValueAtTime(20000, tBack);
  music.gain.setValueAtTime(1, tBreath - 0.3); music.gain.linearRampToValueAtTime(0.7, tBreath + 0.2); music.gain.setValueAtTime(0.7, tBack - BAR * 0.5); music.gain.linearRampToValueAtTime(1, tBack);
  // the last two bars thin out from the bottom, rise, and dissolve into the outro sound
  mHp.frequency.setValueAtTime(20, tBuild + BAR); mHp.frequency.exponentialRampToValueAtTime(1400, OUTRO - 0.05);
  music.gain.setValueAtTime(1, OUTRO - BEAT); music.gain.linearRampToValueAtTime(0.45, OUTRO - 0.08); music.gain.linearRampToValueAtTime(0, OUTRO);

  // ---------- sound design ----------
  const whooshIn = (t, d = 0.55, v = 0.22) => {
    const s = noise(t - d, d + 0.05), f = ac.createBiquadFilter(), g = ac.createGain(), p = ac.createStereoPanner();
    f.type = 'bandpass'; f.Q.value = 1.4; f.frequency.setValueAtTime(500, t - d); f.frequency.exponentialRampToValueAtTime(7000, t);
    g.gain.setValueAtTime(0.0001, t - d); g.gain.exponentialRampToValueAtTime(v, t - 0.01); g.gain.linearRampToValueAtTime(0.0001, t + 0.04);
    p.pan.setValueAtTime(-0.7, t - d); p.pan.linearRampToValueAtTime(0.7, t);
    s.connect(f); f.connect(g); g.connect(p); p.connect(fx); send(g, 0.25);
  };
  const impact = (t, big) => {   // a sub drop on C, and a dark noise burst
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(mtof(big ? 43 : 41), t); o.frequency.exponentialRampToValueAtTime(mtof(24), t + (big ? 1.1 : 0.6));
    env(g, t, big ? 0.45 : 0.25, 0.004, big ? 1.3 : 0.7); o.connect(g); g.connect(fx); o.start(t); o.stop(t + 1.5);
    const nz = noise(t, 0.5), f = ac.createBiquadFilter(), ng = ac.createGain();
    f.type = 'lowpass'; f.frequency.setValueAtTime(big ? 8000 : 5000, t); f.frequency.exponentialRampToValueAtTime(300, t + 0.4);
    env(ng, t, big ? 0.28 : 0.14, 0.002, 0.4); nz.connect(f); f.connect(ng); ng.connect(fx); send(ng, big ? 0.6 : 0.35);
    if (big) { const c = noise(t, 2.2), cf = ac.createBiquadFilter(), cg = ac.createGain(); cf.type = 'highpass'; cf.frequency.value = 5200; env(cg, t, 0.16, 0.002, 2.0); c.connect(cf); cf.connect(cg); cg.connect(fx); send(cg, 0.3); }
  };
  const riser = (t0, t1, v = 0.3) => {
    const s = noise(t0, t1 - t0), f = ac.createBiquadFilter(), g = ac.createGain();
    f.type = 'bandpass'; f.Q.value = 2.2; f.frequency.setValueAtTime(300, t0); f.frequency.exponentialRampToValueAtTime(10000, t1);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t1 - 0.02); g.gain.linearRampToValueAtTime(0.0001, t1 + 0.01);
    s.connect(f); f.connect(g); g.connect(fx); send(g, 0.3);
  };
  const BIG = [A2, A3, A4, A5].map(n => n * BEAT);
  SCENE_HITS.map(B).concat(SCENE_HITS_V.map(BV)).filter(t => t > 1 && t < OUTRO - 0.3).sort((a, b) => a - b)
    .filter((t, i, a) => i === 0 || t - a[i - 1] > 0.2)
    .forEach(t => { if (!BIG.some(b => Math.abs(b - t) < 0.05)) { whooshIn(t, 0.45, 0.14); impact(t, false); } });
  BIG.forEach(t => { whooshIn(t, 0.7, 0.24); impact(t, true); });
  riser((A2 - 4) * BEAT, A2 * BEAT, 0.2);
  riser((A4 - 4) * BEAT, A4 * BEAT, 0.22);

  // ---------- the lead-in and the outro ----------
  riser(tBuild, OUTRO, 0.3);
  { // the outro sound itself, reversed and smeared in reverb, swells into its own first note
    const rv = ac.createBuffer(2, outroBuf.length, outroBuf.sampleRate);
    for (let c = 0; c < 2; c++) { const src = outroBuf.getChannelData(Math.min(c, outroBuf.numberOfChannels - 1)), d = rv.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = src[d.length - 1 - i]; }
    const r = ac.createBufferSource(), g = ac.createGain(), dur = 1.6; r.buffer = rv;
    g.gain.setValueAtTime(0.0001, OUTRO - dur); g.gain.exponentialRampToValueAtTime(0.55, OUTRO - 0.03); g.gain.linearRampToValueAtTime(0, OUTRO);
    r.connect(g); g.connect(out); send(g, 0.8); r.start(OUTRO - dur, rv.duration - dur, dur);
  }
  { const s = ac.createBufferSource(), g = ac.createGain(); s.buffer = outroBuf; g.gain.value = 1.0; s.connect(g); g.connect(out); s.start(OUTRO); }

  // ---------- sonification (stops at the outro) ----------
  sonicEvents().filter(([t]) => t < OUTRO - 0.1).forEach(([t, d, l, kind], i) => {
    if (kind === 'whoosh') { whooshIn(t + 0.6, 0.6, l * 0.5); return; }
    if (kind === 'tick') {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(2600, t); o.frequency.exponentialRampToValueAtTime(1500, t + 0.03);
      env(g, t, l * 0.35, 0.001, 0.04); o.connect(g); g.connect(panTo(fx, ((i * 37) % 7 - 3) / 6)); o.start(t); o.stop(t + 0.05);
      return;
    }
    const m = degMidi(d), c = ac.createOscillator(), mo = ac.createOscillator(), mg = ac.createGain(), g = ac.createGain();
    c.frequency.value = mtof(m); mo.frequency.value = mtof(m) * 3.5; mg.gain.setValueAtTime(mtof(m) * 1.4, t); mg.gain.exponentialRampToValueAtTime(1, t + 0.5);
    mo.connect(mg); mg.connect(c.frequency); env(g, t, 0.06 * l, 0.002, 0.55); c.connect(g); g.connect(panTo(fx, ((d * 3) % 7 - 3) / 5)); send(g, 0.3);
    c.start(t); mo.start(t); c.stop(t + 0.6); mo.stop(t + 0.6);
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
