# Salam — "30 Days Lit"

A 119-second (118.6 s) motion showreel for Salam, built as code.

**Concept, in one line:** Salam turns the one day a month people open their telco app into all thirty, so the film runs from "Last opened 29 days ago" to thirty days lit.

- `showreel.html`: the whole film in one self-contained 1920×1080 file. Open it and call `window.seek(t)` to render any moment. Every style is computed from `t`. There are no CSS animations, no timers and no state carried between frames.
- `salam-30-days-lit.mp4`: the final render at 1920×1080 and 60 fps, 118.6 s long, with motion blur and the code-generated soundtrack.
- `STORYBOARD.md`: the beat-by-beat storyboard.

## Rules the film follows
- **Real brand assets:** the logo, app screens, people photos, 3D icons and partner logos come from the Salam Figma file (`assets/packed/*.webp`), and every line icon comes from the team's Hugeicons library (`assets/icons.json`). The "salam" wordmark and its mark are the original vector paths. The 3D renders are kept for hero moments only (the threat cards, the check on "a reason to stay", and the glass logo in the hook, the roof and the app icon). Everything else, including the Strategy House and the habit loop, uses simple line icons. The Step by step section has no app screens, and the Everyday moments section is light themed.
- **Type and colour:** one typeface, Geist. The Salam palette only, used as flat colour: Deep Green, Forest Teal, Night, Leaf, Salam Green, Neon, Mist and Warm Stone. Off-palette colour appears in two places only. Alert red marks the barriers that are still open on the barrier chart. The clashing peach, lilac and pink of the "fragmented today" tiles show the problem before one app resolves it.
- **No cuts or fades:** each shot is built from the previous one. Letters become circles, the circles become the nodes of one continuous loop, the nodes become "15×", the × becomes the globe's crosshair, the globe's own land dots stream into Nafath's identity rings, the Nafath tile becomes a line, the line becomes the ground of the house, the house's ribbons curl into the EAI Venn, its circles merge into one orb that becomes the AI wheel's core, the step rings open into the end card, and the thirty days become the icons that spiral into the wordmark. Background changes are always a shape growing, never a crossfade.
- **Range:** each technique gets about a fifth of the running time:
  - kinetic type (bars 1–7)
  - shape morphing (bars 8–15)
  - the strategy house and EAI, kept fully flat with no 3D (bars 15–24)
  - data and UI (bars 25–32)
  - step by step, vision and end title (bars 33–41½)
- **Always moving:**
  - One camera language runs through the whole film: a slow, continuous float plus a soft push-in on every scene change. The camera only ever zooms in and pans inside that margin, so the frame edges are never uncovered. It never shakes or rolls. Its periods divide the running time, and every push-in settles before the end, so the loop stays seamless.
  - Headlines arrive letter by letter on a short stagger. They leave in a tighter cascade that clears its space before the next line arrives, so lines never overlap during a hand-off.
  - Cards that have landed keep drifting: the threat cards creep in on the logo, and the step rings' icon tiles turn slowly around their bands.
  - The background dot grids drift slowly.
  - Photos push in slowly.
  - The AI wheel spins up before it unrolls.
  - No hold lasts longer than half a second.
- **Banned effects:** no particle bursts, glows, lens flares, camera shake, RGB split, crossfades, generic gradients or bouncy easing. The only gradients are the ones inside the brand's own photos, renders and mark.
- **No glow, enforced:**
  - Shadows are tight contact shadows that are always darker than the background.
  - Large wipes are drawn at the frame's own time (`crispT`), so their edges stay sharp.
  - The shutter is 180°.
  - Big moves use springs, so motion blur never smears bright shapes into halos.
- **Easing:** exponential curves and a damped spring (`spr`, zeta 0.8, about 1.5% overshoot), all written as functions of time.
- **Motion blur:** each `seek(t)` measures how much of the frame changes across a 1/360 s shutter, then averages 2 to 14 sub-samples to match. The render blends 3 subframes 1/360 s apart with `tmix`, which together make a 180° shutter. Fast moves blur along their own direction in proportion to speed, and still elements stay sharp.
- **Charts:**
  - One hue per series. Bars are thin, with a 4 px rounded data end and a square end on the baseline.
  - Gridlines are hairlines, and values sit in ink at the bar tips.
  - The 72% is a hero number with a 10×10 unit chart and a legend.
  - The barrier chart runs on a 0–25% axis. Each barrier starts as an alert-red bar with the customer's quote. When it is answered, the bar turns green and gains a tick and the answer, so state is never carried by colour alone.
- **The Strategy House:**
  - It is flat and coloured with the brand accents.
  - Five white pillar cards fill from the bottom, one after another, with Salam Green, Forest Teal, Leaf, Neon and Deep Green, and their content inverts as they fill.
  - The roof is Deep Green with a neon edge. The Culture band is Deep Green, and the Measurement band is Warm Stone.
- **Unusual techniques:**
  - *Sonification:* every number on screen also plays as a note in the score. Each lit day of the month is an ascending note, and each time the light passes a node of the habit loop, a note plays, quickening as the loop speeds up.
  - *A real knot:* the habit loop is a trefoil, one continuous path through Content, Community and Commerce. Its strands really pass over and under each other at the three crossings. A light draws the loop on its first lap, then keeps lapping faster and faster, and each node fires as the light passes through it.
  - *A Venn in dots:* Experience, AI and Value-added services are three circles over a fixed dot matrix. Each dot lights by how many circles contain it: dim for one, brighter for two, neon where all three meet, which is EAI. When the circles merge, the whole field turns neon and becomes the orb.
  - *One set of dots, two meanings:* the globe is a dotted world map. Natural Earth land is sampled on a 1.8° grid (3,298 dots), and each dot is shaded by how directly it faces the camera. A graticule, an orbit with a satellite, and great-circle flight arcs between the super-app markets complete the globe. The exact land dots on its face then stream clockwise into Nafath's identity rings.
  - *Thirty days, thirty icons:* the month's thirty day-dots become thirty icon tiles that orbit the end card and spiral into the wordmark.
  - *Glyph-outline morphing:* letters of real Geist outlines, parsed with opentype.js, turn into shapes, and the loop's nodes turn back into the glyphs of "15×".
- **Rhythm:** 84 BPM, slow enough to read, with something happening on every beat. Bar 1 is the hook. A riser lifts into the beat where all thirty days light up, and a second riser lands on the last full bar, the strongest moment: a neon highlight sweeps behind "the joy of technology" on the end card. The final half bar is the end title. The last frame matches the first (60 dB PSNR, one frame of the camera float apart), so the film loops.
- **Timing map:** bars were inserted in two passes:
  - `INSERTS` in `src/00-core.js` adds bars at the habit loop, EAI, the hub, the step section and the outro.
  - `INSERTS2` adds the Nafath bar, the "Get the right plan" story and the step-by-step build.

  `B()` addresses story beats, `BN()` the first-pass beats, and `BV()` real beats.
- **Reference-led sections:** each follows the team's reference recordings.
  - *Nafath:* a dot globe streams into identity rings around the Nafath tile.
  - *The AI wheel:* neon front of house, hatched behind the scenes, a dotted core and spoke pulses.
  - *The step-by-step build:* concentric Core → Beyond → Ecosystem rings with phase text, a stepper, callouts and a progress line.
  - *The end card:* orbiting icon tiles spiral into the wordmark, with a highlight on "the joy of technology".
- **The plan story (EAI):** the assistant is asked "Which plan fits my month?".
  - What it knows flies out of the EAI core as chips (38 GB a month, Dubai every month, streams every day). The chips then settle into the plan's benefits: unlimited data, 40 GB GCC roaming and Shahid VIP.
  - A plan card then rises from the phone, carrying a 98% match ring, Solo Unlimited at 149 SAR a month and its benefits.
  - The button is tapped and the card reads "Activated ✓".

## Build and render
```bash
node tools/build.mjs                         # src/*.js + fonts + land dots -> showreel.html
node tools/stills.mjs out/beats 0 166 0.42   # one frame per beat on the 60 fps grid, for review
node tools/frames.mjs out/look "B(31.5)" "BV(86)+0.2"   # frames at any times, written with the timing helpers
tools/sheet.sh out/beats 6 5                 # contact sheets
node tools/swapcheck.mjs                     # every headline hand-off, mid-transition
node tools/audio.mjs out/soundtrack.wav      # Web Audio (OfflineAudioContext) -> WAV
node tools/loopcheck.mjs                     # first and last frame, for the loop
node tools/render.mjs 4 out/render           # 60 fps x 3 subframes -> tmix -> 4 s segments (resumable)
ffmpeg -f concat -safe 0 -i out/render/list.txt -i out/soundtrack.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest salam-30-days-lit.mp4
```
- **Requirements:** Node 18+, Playwright with Chromium, and ffmpeg.
- **Regenerating the globe:** `assets/land.json` is precomputed. To regenerate it, run `node tools/landdots.mjs <world-atlas land-50m.json> <topojson-client.js> 1.8`, which writes `assets/land.json`.

## Notes
- **Assets:** the Figma exports are packed as WebP and embedded in `showreel.html`. The originals stay in `assets/figma/`, which is not committed. To refresh them, re-export from the Figma file and run `tools/build.mjs`.
- **Confidential figures:** the 72% figure, the barrier percentages and the usage percentages come from Ipsos BHT Wave 4. Keep the film internal.
- **Partner logos:** the TikTok, Spotify, Starbucks, Alipay and Nafath logos come from the team's Figma file. Clear usage rights before showing the film externally.
