# After Effects project

`build_salam_project.jsx` builds and saves `Salam_30_Days_Lit.aep` around the final render.

## How to open it
1. Download the whole repo (the script reads `../salam-30-days-lit.mp4`, `soundtrack.wav` and `assets/`).
2. In After Effects: **File › Scripts › Run Script File…**, pick `ae/build_salam_project.jsx`.
3. The project opens and is saved as `ae/Salam_30_Days_Lit.aep`.

## What's inside
- **Salam 30 Days Lit** comp: 1920×1080, 60 fps, 118.57 s. The film is cut into 23 named layers, one per scene (Hook, Habit loop, Three forces EAI, End card…), so you can trim, reorder, retime or swap any section.
- **Soundtrack (84 BPM)** on its own layer.
- Comp markers on every scene change and on each scene start; a **Beats** guide layer with a marker on every beat, labelled by bar.
- **Assets** folder: logo, wordmark, app screens, photos, partner logos and 3D icons.

## What you can't edit here
The animation is drawn by code (`showreel.html`), so shapes and type are baked into the footage. To change an animation itself, edit `src/*.js`, run `node tools/build.mjs`, re-render (see the main README), then relink the footage in After Effects (**File › Replace Footage**). The scene cuts and markers stay valid as long as the timing doesn't change.
