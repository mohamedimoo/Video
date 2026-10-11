# Salam — "30 Days Lit"

An 80-second (80.4 s) motion showreel for Salam, built as code.

**Concept, in one line:** Salam turns the one day a month people open their telco app into all thirty, so the film runs from "Last opened 29 days ago" to thirty days lit.

- `showreel.html`: the whole film in one self-contained 1920×1080 file. Open it and call `window.seek(t)` to render any moment. Every style is computed from `t`. There are no CSS animations, no timers and no state carried between frames.
- `salam-30-days-lit.mp4`: the final render at 1920×1080 and 60 fps, with motion blur and the code-generated soundtrack.
- `STORYBOARD.md`: the beat-by-beat storyboard.

## Rules the film follows
- **Real brand assets:** the logo, app screens, people photos, 3D icons and partner logos come from the Salam Figma file (`assets/packed/*.webp`), and every line icon comes from the team's Hugeicons library (`assets/icons.json`). The "salam" wordmark and its mark are the original vector paths.
- **Type and colour:** one typeface, Geist. The Salam palette only, used as flat colour: Deep Green, Forest Teal, Night, Leaf, Salam Green, Neon, Mist and Warm Stone. Alert red, orange and purple appear only on the barrier rows.
- **No cuts or fades:** each shot is built from the previous one. Letters become circles, circles become a ring, the ring becomes "15×", the × becomes a globe, the Riyadh pin becomes the Nafath tile, the tile becomes the Salam mark, the mark becomes a line, and the line becomes the ground of the house. Background changes are always a shape growing, never a crossfade.
- **Range:** each technique gets about a fifth of the running time:
  - kinetic type (bars 1–7)
  - shape morphing (bars 8–13)
  - the strategy house and EAI, kept fully flat with no 3D (bars 14–20)
  - data and UI (bars 21–27)
  - end title (bars 28–33½)
- **Banned effects:** no particle bursts, glows, lens flares, camera shake, RGB split, crossfades, generic gradients or bouncy easing. The only gradients are the ones inside the brand's own photos, renders and mark.
- **Camera:** locked off and front-on throughout. The subject moves and the camera does not.
- **Easing:** exponential curves and a damped spring (`spr`, zeta 0.8, about 1.5% overshoot), all written as functions of time.
- **Motion blur:** each `seek(t)` measures how much of the frame changes across the shutter, then averages 2 to 14 sub-samples to match. The render also blends 3 subframes per output frame with `tmix`. Fast moves blur along their own direction in proportion to speed, and still elements stay sharp.
- **Unusual techniques:**
  - *Sonification:* every number on screen also plays as a note in the score, and each lit day of the month is an ascending note.
  - *A logo traced from its own pixels:* at load time the glass logo's silhouette is traced from its alpha channel, so the thirty day-dots can fold into its exact outline before it appears.
  - *Glyph-outline morphing:* letters of real Geist outlines, parsed with opentype.js, turn into shapes.
- **Rhythm:** 100 BPM, with something happening on every beat. Bar 1 is the hook, the last full bar is the hit where all thirty days light up and fold into the glass logo, and the final half bar is the end title. The last frame matches the first, so the film loops.

## Build and render
```bash
node tools/build.mjs                         # src/*.js + fonts -> showreel.html
node tools/stills.mjs out/beats 0 134 0.42   # one frame per beat, for review
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
