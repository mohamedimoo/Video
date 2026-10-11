# Salam — "30 Days Lit"

A 116-second (115.7 s) motion showreel for Salam, built as code.

**Concept, in one line:** Salam turns the one day a month people open their telco app into all thirty, so the film runs from "Last opened 29 days ago" to thirty days lit.

- `showreel.html`: the whole film in one self-contained 1920×1080 file. Open it and call `window.seek(t)` to render any moment. Every style is computed from `t`. There are no CSS animations, no timers and no state carried between frames.
- `salam-30-days-lit.mp4`: the final render at 1920×1080 and 60 fps, 115.7 s long, with motion blur and the code-generated soundtrack.
- `STORYBOARD.md`: the beat-by-beat storyboard.

## Rules the film follows
- **Real brand assets:** the logo, app screens, people photos, 3D icons and partner logos come from the Salam Figma file (`assets/packed/*.webp`), and every line icon comes from the team's Hugeicons library (`assets/icons.json`). The "salam" wordmark and its mark are the original vector paths. The 3D renders are kept for hero moments only (the threat cards, the check on "a reason to stay", and the glass logo in the hook, the roof and the app icon). Everything else, including the Strategy House and the habit loop, uses simple line icons. The Step by step section has no app screens, and the Everyday moments section is light themed.
- **Type and colour:** one typeface, Geist. The Salam palette only, used as flat colour: Deep Green, Forest Teal, Night, Leaf, Salam Green, Neon, Mist and Warm Stone. Alert red, orange and purple appear only on the barrier rows.
- **No cuts or fades:** each shot is built from the previous one. Letters become circles, circles become a ring, the ring becomes "15×", the × becomes a globe, the globe's own dots stream into Nafath's identity rings, the Nafath tile becomes a line, the line becomes the ground of the house, the step rings open into the end card, and the thirty days become the icons that spiral into the wordmark. Background changes are always a shape growing, never a crossfade.
- **Range:** each technique gets about a fifth of the running time:
  - kinetic type (bars 1–7)
  - shape morphing (bars 8–15)
  - the strategy house and EAI, kept fully flat with no 3D (bars 15–23)
  - data and UI (bars 24–31)
  - step by step, vision and end title (bars 31–40½)
- **Banned effects:** no particle bursts, glows, lens flares, camera shake, RGB split, crossfades, generic gradients or bouncy easing. The only gradients are the ones inside the brand's own photos, renders and mark.
- **No glow, enforced:**
  - Shadows are tight contact shadows that are always darker than the background.
  - Large wipes are drawn at the frame's own time (`crispT`), so their edges stay sharp.
  - The shutter is 180°.
  - Big moves use springs, so motion blur never smears bright shapes into halos.
- **Camera:** locked off and front-on throughout. The subject moves and the camera does not.
- **Easing:** exponential curves and a damped spring (`spr`, zeta 0.8, about 1.5% overshoot), all written as functions of time.
- **Motion blur:** each `seek(t)` measures how much of the frame changes across a 1/360 s shutter, then averages 2 to 14 sub-samples to match. The render blends 3 subframes 1/360 s apart with `tmix`, which together make a 180° shutter. Fast moves blur along their own direction in proportion to speed, and still elements stay sharp.
- **Unusual techniques:**
  - *Sonification:* every number on screen also plays as a note in the score, and each lit day of the month is an ascending note.
  - *One set of dots, two meanings:* the globe is a Fibonacci sphere of dots, and the exact dots on its face stream clockwise into Nafath's identity rings.
  - *Thirty days, thirty icons:* the month's thirty day-dots become thirty icon tiles that orbit the end card and spiral into the wordmark.
  - *Glyph-outline morphing:* letters of real Geist outlines, parsed with opentype.js, turn into shapes.
- **Rhythm:** 84 BPM, slow enough to read, with something happening on every beat. Bar 1 is the hook. A riser lifts into the beat where all thirty days light up, and a second riser lands on the last full bar, the strongest moment: a neon highlight sweeps behind "the joy of technology" on the end card. The final half bar is the end title. The last frame matches the first, so the film loops.
- **Timing map:** bars were inserted in two passes. `INSERTS` in `src/00-core.js` adds bars at the habit loop, EAI, the hub, the step section and the outro. `INSERTS2` adds the Nafath bar and the step-by-step build. `B()` addresses story beats, `BN()` the first-pass beats, and `BV()` real beats.
- **Reference-led sections:** Nafath (a dot globe streaming into identity rings around the Nafath tile), the AI wheel (neon front of house, hatched behind the scenes, a dotted core and spoke pulses), the step-by-step build (concentric Core → Beyond → Ecosystem rings with phase text, a stepper, callouts and a progress line) and the end card (orbiting icon tiles spiralling into the wordmark, with a highlight on "the joy of technology"). Each follows the team's reference recordings.

## Build and render
```bash
node tools/build.mjs                         # src/*.js + fonts -> showreel.html
node tools/stills.mjs out/beats 0 162 0.42   # one frame per beat, for review
tools/sheet.sh out/beats 6 6                 # contact sheets
node tools/audio.mjs out/soundtrack.wav      # Web Audio (OfflineAudioContext) -> WAV
node tools/render.mjs 4 out/render           # 60 fps x 3 subframes -> tmix -> segments
ffmpeg -f concat -safe 0 -i out/render/list.txt -i out/soundtrack.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest salam-30-days-lit.mp4
```
Requirements: Node 18+, Playwright with Chromium, and ffmpeg.

## Notes
- **Assets:** the Figma exports are packed as WebP and embedded in `showreel.html`. The originals stay in `assets/figma/`, which is not committed. To refresh them, re-export from the Figma file and run `tools/build.mjs`.
- **Confidential figures:** the 72% figure, the barrier percentages and the usage percentages come from Ipsos BHT Wave 4. Keep the film internal.
- **Partner logos:** the TikTok, Spotify, Starbucks, Alipay and Nafath logos come from the team's Figma file. Clear usage rights before showing the film externally.
