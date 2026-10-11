// Salam "30 Days Lit": rebuilds the film in After Effects with native, editable layers.
// In After Effects: File > Scripts > Run Script File... and pick this file (keep the ae/ folder together).
// Before running it, install the five fonts in ae/fonts (Geist Regular to ExtraBold).
//
// The comp "Salam 30 Days Lit" holds, bottom to top:
//   - Background plate (plate.mp4): every shape, line, dot, ring and wipe of the film, with no text, no images
//     and no camera. It is drawn by code, so it is the one part that stays a rendered layer.
//   - Images: every logo, photo, app screen and 3D icon as its own layer, with its real movement, scale, rotation
//     and fades as keyframes, and rounded masks where the film clips them.
//   - Text: every line of type as a live text layer in Geist. Kinetic headlines rise letter by letter through
//     expressions that read the layer's own text, so you can retype a line and it still animates.
//     Counters keep their values as Source Text keyframes.
//   - Camera: a null that every layer is parented to: the slow float and the push-ins on scene changes.
//   - Soundtrack, scene markers and a marker on every beat (84 BPM).
//   - Final render, as a switched-off guide layer on top, to compare against.
// Layer motion blur is on, with a 180-degree shutter, like the film.
(function () {
  var here = File($.fileName).parent, root = here.parent;
  function readJSON(p) { var f = new File(p); f.encoding = 'UTF-8'; if (!f.open('r')) return null; var s = f.read(); f.close(); return eval('(' + s + ')'); }
  var D = readJSON(here.fsName + '/salam_layers.json');
  if (!D) { alert('Missing ae/salam_layers.json'); return; }
  var FPS = D.fps, DUR = D.dur, BEAT = 60 / 84;
  var FONTS = { 400: 'Geist-Regular', 500: 'Geist-Medium', 600: 'Geist-SemiBold', 700: 'Geist-Bold', 800: 'Geist-ExtraBold' };
  var SCENES = [
    [0, '01 Hook'], [2.857, '02 They live on their phones'], [5.714, '03 Disruption'], [11.429, '04 Risk to opportunity'],
    [14.286, '05 Awareness to relevance'], [20, '06 Habit loop'], [25.714, '07 30 days compare'], [28.571, '08 7-15x'],
    [31.429, '09 Super-apps globe'], [37.857, '10 Nafath'], [42.143, '11 Strategy House'], [52.857, '12 Three forces EAI'],
    [61.429, '13 Get the right plan'], [67.857, '14 AI wheel'], [74.286, '15 Usage chart'], [77.143, '16 72 percent and barriers'],
    [82.857, '17 Reason to stay'], [85.714, '18 One app hub'], [91.429, '19 Step by step'], [100, '20 Beyond telco moments'],
    [105.714, '21 30 days lit'], [111.429, '22 End card'], [117.143, '23 End title']
  ];
  var warnings = [];

  function imp(f) { if (!f.exists) { warnings.push('Missing file: ' + f.fsName); return null; } return app.project.importFile(new ImportOptions(f)); }
  function times(keys) { var a = []; for (var i = 0; i < keys.length; i++) a.push(keys[i][0]); return a; }
  function vals(keys, fn) { var a = []; for (var i = 0; i < keys.length; i++) a.push(fn(keys[i])); return a; }
  function setKeys(prop, keys, fn, hold) {
    if (!keys || !keys.length) return;
    if (keys.length === 1) { prop.setValue(fn(keys[0])); return; }
    prop.setValuesAtTimes(times(keys), vals(keys, fn));
    var n = prop.numKeys;
    for (var k = 1; k <= n; k++) {
      if (hold) prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.HOLD);
      else if (prop.isSpatial) { try { prop.setSpatialTangentsAtKey(k, [0, 0, 0], [0, 0, 0]); } catch (e) { } }
    }
  }

  app.beginUndoGroup('Build Salam project');
  app.newProject();
  var proj = app.project;
  var fFoot = proj.items.addFolder('Footage'), fImg = proj.items.addFolder('Images'), fComps = proj.items.addFolder('Comps');

  var comp = proj.items.addComp('Salam 30 Days Lit', 1920, 1080, 1, DUR, FPS);
  comp.parentFolder = fComps;
  comp.bgColor = [0.008, 0.055, 0.051];
  comp.motionBlur = true; comp.shutterAngle = 180; comp.shutterPhase = -90;

  // the camera: a null whose layer space equals the comp at rest
  var cam = comp.layers.addNull(DUR);
  cam.name = 'Camera (float + push-ins)';
  cam.transform.anchorPoint.setValue([960, 540]);
  setKeys(cam.transform.position, D.cam, function (k) { return [k[1], k[2]]; });
  setKeys(cam.transform.scale, D.cam, function (k) { return [k[3], k[3]]; });

  function parentToCam(L) { try { L.setParentWithJump(cam); } catch (e) { L.parent = cam; } }

  // background plate
  var plate = imp(new File(here.fsName + '/plate.mp4'));
  if (plate) {
    plate.parentFolder = fFoot; plate.mainSource.conformFrameRate = FPS;
    var P = comp.layers.add(plate); P.name = 'Background plate (shapes, no text or images)'; P.moveToEnd(); parentToCam(P);
  }

  // native layers, in the order the film draws them (each new layer lands on top)
  var footage = {};
  var nText = 0, nImg = 0;
  for (var i = 0; i < D.layers.length; i++) {
    var L = D.layers[i], lay = null;
    try {
      if (L.type === 'img') {
        if (!footage[L.name]) { footage[L.name] = imp(new File(here.fsName + '/assets/' + L.name + '.png')); if (footage[L.name]) footage[L.name].parentFolder = fImg; }
        var src = footage[L.name]; if (!src) continue;
        lay = comp.layers.add(src);
        lay.name = L.name;
        var sw = src.width, sh = src.height;
        setKeys(lay.transform.scale, L.wh, function (k) { return [k[1] / sw * 100, k[2] / sh * 100]; });
        if (L.mask) {
          var m = lay.property('ADBE Mask Parade').addProperty('ADBE Mask Atom');
          m.name = 'Rounded clip';
          setKeys(m.property('ADBE Mask Shape'), L.mask, function (k) {
            var s = new Shape(), v = [];
            for (var j = 1; j + 1 < k.length; j += 2) v.push([k[j], k[j + 1]]);
            s.vertices = v; s.closed = true; return s;
          });
        }
        nImg++;
      } else {
        lay = comp.layers.addText(L.text);
        lay.name = L.name;
        var st = lay.property('ADBE Text Properties').property('ADBE Text Document');
        var td = st.value;
        td.resetCharStyle(); td.resetParagraphStyle();
        td.text = L.text;
        td.font = FONTS[L.weight] || 'Geist-Bold';
        td.fontSize = L.size;
        td.applyFill = true; td.fillColor = L.color; td.applyStroke = false;
        td.tracking = Math.round(L.ls / L.size * 1000);
        td.justification = L.type === 'text' && L.align === 'center' ? ParagraphJustification.CENTER_JUSTIFY : L.type === 'text' && L.align === 'right' ? ParagraphJustification.RIGHT_JUSTIFY : ParagraphJustification.LEFT_JUSTIFY;
        st.setValue(td);
        if (L.texts) {
          var tt = [], tv = [];
          for (var q = 0; q < L.texts.length; q++) { var d2 = st.value; d2.text = L.texts[q][1]; tt.push(L.texts[q][0]); tv.push(d2); }
          st.setValuesAtTimes(tt, tv);
        }
        setKeys(lay.transform.scale, L.scale, function (k) { return [k[1], k[1]]; });
        if (L.colors) {
          var fx = lay.property('ADBE Effect Parade').addProperty('ADBE Fill');
          setKeys(fx.property('Color'), L.colors, function (k) { return [k[1], k[2], k[3], 1]; });
        }
        if (L.type === 'rise') {
          // letters rise through the line's own mask on a short stagger, and leave the same way
          var anims = lay.property('ADBE Text Properties').property('ADBE Text Animators');
          var addRise = function (name, dy, expr) {
            var an = anims.addProperty('ADBE Text Animator'); an.name = name;
            an.property('ADBE Text Animator Properties').addProperty('ADBE Text Position 3D').setValue([0, dy, 0]);
            var sel = an.property('ADBE Text Selectors').addProperty('ADBE Text Expressible Selector');
            sel.property('ADBE Text Expressible Amount').expression = expr;
          };
          addRise('Rise in', 1.25 * L.size,
            'var i=textIndex-1,n=textTotal,st=Math.min(0.018,0.3/Math.max(1,n));\n' +
            'var p=Math.min(1,Math.max(0,(time-' + L.tIn + '-i*st)/' + L.d + '));\n' +
            'var e=p>=1?1:1-Math.pow(2,-10*p); var v=100*(1-e); [v,v,v]');
          if (L.tOut !== null) addRise('Rise out', -1.3 * L.size,
            'var i=textIndex-1,n=textTotal,so=Math.min(0.012,0.08/Math.max(1,n-1)),du=0.3-so*(n-1);\n' +
            'var p=Math.min(1,Math.max(0,(time-' + L.tOut + '-i*so)/du));\n' +
            'var e=p<=0?0:Math.pow(2,10*p-10); var v=100*e; [v,v,v]');
          var mk = lay.property('ADBE Mask Parade').addProperty('ADBE Mask Atom');
          mk.name = 'Line mask';
          mk.property('ADBE Mask Shape').expression =
            'var r=sourceRectAtTime(time,false),s=' + L.size + ';\n' +
            'createPath([[r.left-30,-1.02*s],[r.left+r.width+30,-1.02*s],[r.left+r.width+30,0.3*s],[r.left-30,0.3*s]],[],[],true)';
        }
        nText++;
      }
      setKeys(lay.transform.position, L.pos, function (k) { return [k[1], k[2]]; });
      setKeys(lay.transform.rotation, L.rot, function (k) { return k[1]; });
      setKeys(lay.transform.opacity, L.op, function (k) { return k[1]; }, true);
      lay.inPoint = L['in']; lay.outPoint = Math.min(DUR, L.out);
      lay.motionBlur = true;
      parentToCam(lay);
    } catch (err) {
      warnings.push('Layer "' + L.name + '": ' + err.toString());
      if (lay) try { lay.remove(); } catch (e2) { }
    }
  }

  // sound, the final render for reference, markers
  var audio = imp(new File(here.fsName + '/soundtrack.wav'));
  if (audio) { audio.parentFolder = fFoot; var A = comp.layers.add(audio); A.name = 'Soundtrack (84 BPM)'; A.moveToEnd(); }
  var ref = imp(new File(root.fsName + '/salam-30-days-lit.mp4'));
  if (ref) { ref.parentFolder = fFoot; var R = comp.layers.add(ref); R.name = 'Final render (reference)'; R.guideLayer = true; R.enabled = false; R.audioEnabled = false; }
  cam.moveToBeginning();

  var host = null;
  try { host = comp.markerProperty; } catch (e) { host = null; }
  if (!host) { var nl = comp.layers.addNull(DUR); nl.name = 'Scenes'; nl.guideLayer = true; host = nl.property('Marker'); }
  for (var s = 0; s < SCENES.length; s++) host.setValueAtTime(SCENES[s][0], new MarkerValue(SCENES[s][1]));
  var beats = comp.layers.addNull(DUR); beats.name = 'Beats (84 BPM)'; beats.guideLayer = true; beats.enabled = false;
  var bm = beats.property('Marker');
  for (var b = 0; b * BEAT < DUR - 1e-6; b++) bm.setValueAtTime(b * BEAT, new MarkerValue(b % 4 ? '' : 'bar ' + (b / 4 + 1)));

  app.endUndoGroup();
  comp.openInViewer();
  proj.save(new File(here.fsName + '/Salam_30_Days_Lit.aep'));
  alert('Built Salam_30_Days_Lit.aep: ' + nText + ' text layers and ' + nImg + ' image layers on the background plate, parented to the camera.' +
    (warnings.length ? '\n\n' + warnings.length + ' warnings:\n' + warnings.slice(0, 12).join('\n') : ''));
})();
