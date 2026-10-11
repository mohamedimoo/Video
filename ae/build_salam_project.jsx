// Salam "30 Days Lit": builds an editable After Effects project around the final render.
// In After Effects: File > Scripts > Run Script File... and pick this file (it lives in the repo's ae/ folder).
// It creates and saves ae/Salam_30_Days_Lit.aep next to this script.
//
// What you get:
// - "Salam 30 Days Lit" main comp (1920x1080, 60 fps, 118.57 s): the film cut into one layer per scene,
//   each trimmed to its scene and named, so you can trim, reorder, retime or replace any section
// - the soundtrack on its own layer
// - comp markers on every scene hit, and a "Beats" guide layer with a marker on every beat (84 BPM)
// - every brand asset (logo, wordmark, app screens, photos, partner logos, 3D icons) in an Assets folder
//
// The film itself is drawn by code (showreel.html), so its shapes and type are baked into the footage.
// To change an animation itself, edit src/*.js, rebuild and re-render, then relink the footage here.
(function () {
  var here = File($.fileName).parent;            // ae/
  var root = here.parent;                         // the repo
  var DUR = 118.571429, FPS = 60, BEAT = 60 / 84;
  var SCENES = [
    [0, "01 Hook"],
    [2.8571, "02 They live on their phones"],
    [5.7143, "03 Disruption"],
    [11.4286, "04 Risk to opportunity"],
    [14.2857, "05 Awareness to relevance"],
    [20, "06 Habit loop"],
    [25.7143, "07 30 days compare"],
    [28.5714, "08 7-15x"],
    [31.4286, "09 Super-apps globe"],
    [37.8571, "10 Nafath"],
    [42.1429, "11 Strategy House"],
    [52.8571, "12 Three forces EAI"],
    [61.4286, "13 Get the right plan"],
    [67.8571, "14 AI wheel"],
    [74.2857, "15 Usage chart"],
    [77.1429, "16 72 percent and barriers"],
    [82.8571, "17 Reason to stay"],
    [85.7143, "18 One app hub"],
    [91.4286, "19 Step by step"],
    [100, "20 Beyond telco moments"],
    [105.7143, "21 30 days lit"],
    [111.4286, "22 End card"],
    [117.1429, "23 End title"]
  ];
  var HITS = [2.8571, 5.7143, 11.4286, 14.2857, 20, 22.1429, 25.7143, 28.5714, 31.4286, 37.1429, 37.8571, 42.8571, 48.5714, 52.8571, 54.2857, 57.1429, 60, 62.1429, 65, 68.5714, 72.8571, 74.2857, 77.1429, 82.8571, 84.2857, 85.7143, 91.4286, 92.1429, 93.9286, 95.7143, 97.5, 99, 100, 102.8571, 105.7143, 111.4286, 112.5714, 114.6429, 117.1429];

  function imp(f) {
    if (!f.exists) { alert("Missing file: " + f.fsName); return null; }
    return app.project.importFile(new ImportOptions(f));
  }
  app.beginUndoGroup("Build Salam project");
  app.newProject();
  var proj = app.project;
  var fFoot = proj.items.addFolder("Footage"), fAssets = proj.items.addFolder("Assets"), fComps = proj.items.addFolder("Comps");

  var video = imp(new File(root.fsName + "/salam-30-days-lit.mp4"));
  var audio = imp(new File(here.fsName + "/soundtrack.wav"));
  if (!video) return;
  video.parentFolder = fFoot; if (audio) audio.parentFolder = fFoot;
  video.mainSource.conformFrameRate = FPS;

  var assets = new Folder(here.fsName + "/assets").getFiles(function (f) { return /\.(png|svg)$/i.test(f.name); });
  for (var a = 0; a < assets.length; a++) { var it = imp(assets[a]); if (it) it.parentFolder = fAssets; }

  var comp = proj.items.addComp("Salam 30 Days Lit", 1920, 1080, 1, DUR, FPS);
  comp.parentFolder = fComps;
  comp.bgColor = [0.008, 0.055, 0.051];          // Night #020E0D

  // one trimmed layer per scene (added last-first so scene 01 sits on top of the stack)
  for (var i = SCENES.length - 1; i >= 0; i--) {
    var t0 = SCENES[i][0], t1 = i + 1 < SCENES.length ? SCENES[i + 1][0] : DUR;
    var L = comp.layers.add(video);
    L.name = SCENES[i][1];
    L.startTime = 0; L.inPoint = t0; L.outPoint = t1;
    L.label = (i % 2) ? 9 : 8;
    L.audioEnabled = false;
  }
  if (audio) { var A = comp.layers.add(audio); A.name = "Soundtrack (84 BPM)"; A.moveToEnd(); }

  // scene-change markers on the comp (on a guide layer in versions without comp markers)
  var hitHost = null;
  try { hitHost = comp.markerProperty; } catch (e) { hitHost = null; }
  if (!hitHost) { var n = comp.layers.addNull(DUR); n.name = "Scene hits"; n.guideLayer = true; hitHost = n.property("Marker"); }
  for (var h = 0; h < HITS.length; h++) hitHost.setValueAtTime(HITS[h], new MarkerValue("hit"));
  for (var s = 0; s < SCENES.length; s++) hitHost.setValueAtTime(SCENES[s][0] + 0.0001, new MarkerValue(SCENES[s][1]));

  // a marker on every beat
  var beats = comp.layers.addNull(DUR); beats.name = "Beats (84 BPM)"; beats.guideLayer = true; beats.enabled = false;
  var bm = beats.property("Marker");
  for (var b = 0; b * BEAT < DUR - 1e-6; b++) bm.setValueAtTime(b * BEAT, new MarkerValue(b % 4 ? "" : "bar " + (b / 4 + 1)));

  app.endUndoGroup();
  comp.openInViewer();
  proj.save(new File(here.fsName + "/Salam_30_Days_Lit.aep"));
  alert("Built Salam_30_Days_Lit.aep: " + SCENES.length + " scene layers, " + HITS.length + " scene hits, beat markers, soundtrack and " + assets.length + " assets.");
})();
