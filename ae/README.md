# After Effects project

`build_salam_project.jsx` rebuilds the film in After Effects as native, editable layers and saves `Salam_30_Days_Lit.aep`.

## How to open it
1. Download the whole repo (the script reads files from this `ae/` folder, and the final render from the repo root).
2. Install the five fonts in `ae/fonts` (Geist Regular, Medium, SemiBold, Bold and ExtraBold), then restart After Effects.
3. In After Effects: **File › Scripts › Run Script File…**, pick `ae/build_salam_project.jsx`. It takes a minute or two.
4. The project opens and is saved as `ae/Salam_30_Days_Lit.aep`.

## What's in the comp
From bottom to top:

| Layer | What it is | What you can edit |
| --- | --- | --- |
| Background plate | Every shape, line, dot, ring and wipe, with no text, no images and no camera | Trim or retime it. The shapes themselves are drawn by code, so they stay a rendered layer |
| 50 image layers | Every logo, photo, app screen and 3D icon, with its real movement, scale, rotation and fades as keyframes. Rounded masks are added where the film clips an image | Swap the footage, edit the keyframes and masks |
| About 340 text layers | Every line of type, as live Geist text. Kinetic headlines rise letter by letter through expressions that read the layer's own text | Retype any line and it still animates. Change the font, size, colour or tracking. Counters keep their values as Source Text keyframes |
| Camera (null) | The slow float and the push-ins on scene changes. Every layer is parented to it | Edit or delete its keyframes to change or remove the camera move |
| Soundtrack, scene markers, beat markers | 84 BPM, with a marker on every beat, labelled by bar | — |
| Final render (reference) | The finished film as a switched-off guide layer | Switch it on to compare |

Layer motion blur is on, with a 180° shutter, like the film.

## Still in the background plate
About 24 lines of type are drawn inside a mask or a fill, so they stay in the plate:
- the Strategy House labels (Culture, Measurement and the pillar names)
- the roof tagline
- the "E" of EAI and the "AI" disc
- the plan button's "Activate in one tap" / "Activated"
- the 72% chart legend
- the "AI ties it together" bar

A line also drops into the plate for the frames where a later shape covers it, such as a wipe or the neon highlight on "the joy of technology".

## Regenerating it after a change to the film
```bash
node tools/ae-export.mjs                    # text, images and camera -> ae/salam_layers.json + ae/plate_keys.json
node tools/render.mjs 4 out/plate --plate   # the background plate, without those layers
ffmpeg -f concat -safe 0 -i out/plate/list.txt -c copy ae/plate.mp4
node tools/ae-verify.mjs out/aecheck 20 60 90   # rebuild frames from the export and compare with the film
```
Then run the script again.
