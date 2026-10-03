# Controller UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Execution note:** the owner asked for the work to be finished and pushed to `main` (Vercel deploys `main` to https://controller-diagnostics.vercel.app). It is executed natively in the authoring session.

**Goal:** Replace the single-file UI with the controller-centric redesign from the spec: per-model controller drawings on a bold platform-color stage, labeled frames, a light/dark frame theme, and a refactored input layer.

**Architecture:**
- **Input layer.** Plain JS modules. A `createInputStore` object owns the `requestAnimationFrame` loop and the accumulators, and React reads it through `useSyncExternalStore`. The pure logic (`detect`, `stats`, `storage`, `sampler`) is unit-tested with Vitest.
- **Drawings.** Hand-drawn SVG React components built from shared parts (`parts.jsx`).
- **Styling.** Plain CSS with tokens on `data-theme` and `data-platform`.

**Tech Stack:** React 19, Vite 8, Vitest (new dev dependency), plain CSS, SVG, Canvas 2D.

**Spec:** `docs/superpowers/specs/2026-10-03-controller-ui-redesign-design.md`

## Global Constraints

- No runtime dependencies added. Vitest is the only new dev dependency.
- `DRIFT_THRESHOLD = 0.08`, `HISTORY_LEN = 120`, `HEATMAP_SIZE = 64`, heat gamma `0.45`. These are unchanged from today.
- CSV export is byte-compatible with today's: header `timestamp,lx,ly,rx,ry,buttons`, rows `${Date.now()},${axes4.join(",")},${pressed.map(Number).join("|")}`, file `controller-session.csv`.
- No glows, no shadows, no gradient fills, no pill badges, no pulsing animations. Red (`#f26b6b` / `#dc2626`) is used only for drift.
- Colors are exactly the spec values in §4.1–4.3.
- Fonts are system stacks only. No web fonts.
- At a 1200×800 window, the full controller (front and top views) and the bottom tab bar are visible without scrolling.

## Review Focus

1. **Pads that report fewer buttons or axes** (cheap USB pads with 2 axes and 10 buttons). Missing values read as released/0, and nothing crashes. Covered by a test in Task 2 (`samplePad` with a short pad).
2. **Unplugging during a recording.** Stop and Export stay usable while disconnected, and the frames recorded so far are kept. Covered by the TopBar rule in Task 4 (Stop is never disabled) and a sampler test showing the log persists.
3. **Blocked `localStorage`** (private windows, strict browsers). The app still loads with defaults. Covered by storage tests in Task 2.
4. **Non-Chromium id formats** (the website runs in any browser). Firefox's `054c-0ce6-Name` and Safari's name-only ids still detect sensibly and never crash. Covered by detect tests in Task 2.
5. **Narrow browser windows** (the website on laptops and tablets). There's no horizontal page scroll, and the rails stack under the controller below 900px. Checked manually in Task 6 with a capture at 820px width.

---

### Task 1: Baseline

**Files:**
- Commit: existing uncommitted `src/App.jsx` (the owner's heatmap work)
- Modify: `package.json` (add `vitest` dev dependency and `"test": "vitest run"`)

- [ ] Commit the current `src/App.jsx` as the baseline: "Add stick heatmaps (baseline before redesign)".
- [ ] `npm install -D vitest`, add the `test` script, and run `npx vitest run --passWithNoTests`. Expected: exit 0.
- [ ] Commit "Add Vitest".

### Task 2: Input logic (TDD)

**Files:**
- Create: `src/input/stats.js`, `src/input/detect.js`, `src/input/storage.js`, `src/input/sampler.js`, `src/input/gamepadSource.js`, `src/input/inputStore.js`
- Test: `src/input/stats.test.js`, `src/input/detect.test.js`, `src/input/storage.test.js`, `src/input/sampler.test.js`, `src/input/gamepadSource.test.js`

**Interfaces (produced):**
- `stats.js`:
  - `DRIFT_THRESHOLD`, `HISTORY_LEN`, `HEATMAP_SIZE`, `HEAT_GAMMA`
  - `magnitude(x, y): number`
  - `isDrifting(x, y, anyPressed): boolean`
  - `heatCell(v): int`
  - `CSV_HEADER`
  - `csvRow({t, axes, buttons}): string`
  - `toCsv(frames): string`
- `detect.js`:
  - `detect(id): { model: string, xinput: boolean }`
  - `describeDevice(id): { name: string, vendor: string|null, product: string|null }`
- `storage.js`:
  - `readJSON(key, fallback, storage?)`
  - `writeJSON(key, value, storage?)`
  - The key prefix is `controller-ui:`.
- `sampler.js`:
  - `createAccumulators()` returns `{ history:{lx,rx,head}, heat:{left,right}, prevPressed, pressCount, rec:{active,log} }`, where each heat is `{ grid: Uint32Array, samples, max }`.
  - `samplePad(pad, acc, now)` returns the snapshot: `{ connected:true, id, mapping, axes, buttons:[{pressed,value}], pressCount, drift:{left,right}, recording:{active,frames} }`.
  - `resetHeat(heat)`.
- `gamepadSource.js`:
  - `realSource(): () => Gamepad|null` (first non-null connected pad)
  - `demoSource(modelId): () => fakePad`
  - `DEMO_IDS: Record<modelId|'xinput', string>`
- `inputStore.js`: `createInputStore(readPad)` returns `{ acc, subscribe, getSnapshot, start, stop, resetHeatmap(side), startRecording, stopRecording, csv() }`. The snapshot also carries `connectCount`.

- [ ] **Step 1: Write the failing tests.**
  - `stats`:
    - drift: `(0.08, 0) → false`, `(0.0801, 0) → true`, `(0.06, 0.06) → true`, and any button held → `false`.
    - `heatCell`: `-1 → 0`, `0 → 32`, `1 → 63`, `2 → 63`, `-3 → 0`, `NaN → 32`.
    - CSV: `csvRow({t:1700000000000, axes:[0,-0.5,0.25,1], buttons:[true,false,true]}) === "1700000000000,0,-0.5,0.25,1,1|0|1"`. `toCsv([])` equals the header, and rows are joined with `\n`.
  - `detect`:
    - Chromium DualSense → `dualsense`; Edge `0df2` → `dualsense`.
    - DS4 `09cc` and `05c4` → `dualshock4`.
    - `045e:0b13` → `xbox-series`; `045e:02ea` → `xbox-one`; `045e:028e` → `xbox-360`.
    - XInput id → `{model:'xbox-series', xinput:true}`.
    - `057e:2009` → `switch-pro`.
    - Firefox `054c-0ce6-DualSense Wireless Controller` → `dualsense`.
    - Uppercase hex → `dualsense`.
    - Name-only `DualSense Wireless Controller` → `dualsense`.
    - Unknown `2dc8:6006` → `generic`; `''` and `undefined` → `generic`.
    - `describeDevice`: name with the parenthesized suffix stripped, plus vendor and product.
  - `storage`:
    - missing key → fallback;
    - invalid JSON → fallback;
    - `getItem` throws → fallback;
    - `setItem` throws → no throw;
    - round trip uses the prefixed key.
  - `sampler`:
    - rising-edge press counting across 3 frames;
    - the history head wraps after 120 samples;
    - heat counts land in `heatCell(y)*64 + heatCell(x)` and `max` updates;
    - a short pad (2 axes, 10 buttons) gives 4 axes with zeros and no crash;
    - NaN axes become 0;
    - recording appends `{t, axes4, pressed}` only while active, and the log survives `active=false`;
    - drift flags follow `isDrifting`.
  - `gamepadSource`: for every model id, `detect(DEMO_IDS[id]).model === id`; `detect(DEMO_IDS.xinput).xinput === true`; and the demo pad has 4 axes and at least 17 buttons, with values in [-1, 1] and [0, 1].
- [ ] **Step 2:** `npx vitest run`. Expected: FAIL (modules missing).
- [ ] **Step 3:** Implement the modules exactly to those interfaces. `inputStore.js` emits a new snapshot object on every connected frame, once on disconnect, and after every action.
- [ ] **Step 4:** `npx vitest run`. Expected: PASS.
- [ ] **Step 5:** Commit "Add input layer: detection, stats, storage, sampler, demo source".

### Task 3: Visual system, shell and the DualSense stage

**Files:**
- Create:
  - styles: `src/styles/index.css`, `src/styles/tokens.css`, `src/styles/base.css`
  - theme and helpers: `src/theme.js`, `src/lib/cx.js`
  - `src/components/LabeledFrame.jsx` + `.css`
  - `src/components/TopBar.jsx` + `.css`
  - `src/components/ControllerSelector.jsx` + `.css`
  - `src/components/Stage.jsx` + `.css`
  - `src/components/StickGroup.jsx`, `src/components/TriggerGroup.jsx`, `src/components/groups.css`
  - `src/components/MiniHeatmap.jsx`, `src/components/heatmapDraw.js`, `src/components/Heatmap.css`
  - controllers: `src/controllers/parts.jsx`, `src/controllers/TopView.jsx`, `src/controllers/controllers.css`, `src/controllers/names.js`, `src/controllers/DualSense.jsx`, `src/controllers/index.js`
- Modify: `src/main.jsx`, `src/App.jsx` (full rewrite)

**Interfaces:**
- Consumes: the Task 2 store and snapshot.
- Produces:
  - `MODELS`, `getModel(id)`. Each model is `{ id, name, platform, buttonNames, shoulders:{l1,l2,r1,r2}, Front, Top }`.
  - `Front` props are `{ buttons, axes, drift }`, and `Top` props are `{ buttons, model }`.
  - `LabeledFrame({ title, value, valueInverse, surface:'stage'|'frame', className, children })`.
  - `drawHeat(ctx, heat, ink:[r,g,b])`.

- [ ] Tokens: copy every value from spec §4.1–4.3. `data-platform` sets `--stage`, `--stage-ink`, `--stage-pattern`, `--stage-pattern-size` and `--stage-pattern-pos`.
  - PlayStation uses the 54px △○✕□ SVG tile.
  - The others use the 10px offset dot grid.
  - `.stage::before` applies the pattern with the radial fade mask.
- [ ] `theme.js`: `getInitialTheme()` returns the saved theme, else the `prefers-color-scheme` result, else `dark`. `applyTheme(t)` sets `document.documentElement.dataset.theme`. `saveTheme(t)` stores it.
- [ ] `main.jsx`:
  1. Parse `?demo[=model]`.
  2. Create the store with the demo source or the real source.
  3. `applyTheme(getInitialTheme())`.
  4. `store.start()`.
  5. Render `<App store/>`.
- [ ] `App.jsx`, model resolution:
  - connected → `picks[id] ?? detect(id).model`;
  - disconnected → the preview if it was picked during this disconnected period (`preview.at === connectCount`), else the last device's model, else `lastModel`;
  - picking a tab while connected saves to `modelByDevice`; while disconnected it sets the preview;
  - an effect writes `lastModel`.
- [ ] `parts.jsx`: `Part`, `Trigger` (shape filled from its base via a clipPath with a sanitized `useId`), `Stick` (offset `= clampToUnit(x,y) × (wellR − capR)`), `FaceButton` (glyphs triangle/circle/cross/square or a text label), `DPadSplit`, `DPadCross`, `Pill`, `RoundButton`, `Grille`.
  - Pressed state is the `is-pressed` class and drift is `is-drift`.
  - All colors come from classes in `controllers.css`.
- [ ] `TopView.jsx`: renders a data-driven top view (body edge, L2/R2 fill rects, L1/R1, port, optional light bar and LEDs, trigger name labels).
- [ ] `DualSense.jsx`: the approved `controller-centric-v5` art, wired to standard indices 0–17.
- [ ] Stage: rails (`StickGroup`, `TriggerGroup`) | center (Front, top-view label line, Top, device line, non-standard notice) | rails.
  - Below 900px, two columns with the center first. Below 560px, one column.
- [ ] Run `npx vite build`. Expected: success. Capture `?demo=dualsense` at 1200×800 with the Electron capture script and check it against the mockup.
- [ ] Commit "Add redesigned shell, theming and DualSense stage".

### Task 4: Bottom panel, recording, connect state

**Files:**
- Create: `src/components/BottomPanel.jsx` + `.css`, `src/components/HistoryGraph.jsx`, `src/components/HeatmapsTab.jsx`, `src/components/ButtonsTab.jsx`, `src/components/AboutTab.jsx`, `src/components/NoController.jsx`
- Modify: `src/App.jsx`, `src/components/Stage.jsx`, `src/components/TopBar.jsx`

- [ ] Tabs are Input history, Heatmaps, Buttons and About. They use tab roles, and only the active tab renders.
- [ ] `HistoryGraph` draws on a DPR-aware canvas. Left X is solid `--frame-text` and right X is dashed `--frame-muted`. A drifting series switches to `--drift-on-frame`. Colors are read with `getComputedStyle` at draw time.
- [ ] `HeatmapsTab` shows two frames, each with a 220px heat canvas and an SVG overlay (rings, crosshair, dashed deadzone), plus the sample count and a Reset button.
- [ ] `ButtonsTab` has a BUTTONS frame (name, index, state, value bar) and an AXES frame (index, value, center bar). When nothing is connected, it shows an empty state.
- [ ] `AboutTab` has the existing footer copy. The tags become plain dot-separated text.
- [ ] TopBar recording controls:
  - Record is disabled while disconnected.
  - Stop is never disabled.
  - Export CSV appears once there are frames and no recording is active.
  - Export downloads `store.csv()` as `controller-session.csv`.
- [ ] Connect state: the dimmed model (35% opacity, neutral input) plus a `NO CONTROLLER` frame. The press counter is hidden.
- [ ] Build, capture the connected and disconnected states in both themes, and commit "Add bottom panel, recording controls and connect state".

### Task 5: Remaining drawings

**Files:**
- Create: `src/controllers/Xbox.jsx` (Series and One share one drawing with a `variant`), `src/controllers/DualShock4.jsx`, `src/controllers/Xbox360.jsx`, `src/controllers/SwitchPro.jsx`, `src/controllers/Generic.jsx`
- Modify: `src/controllers/index.js`

**Per-model features:**

| Model | Distinguishing features |
|---|---|
| Xbox Series | Offset sticks (left stick top-left, D-pad bottom-left); hybrid dish D-pad; View, Menu and Share; USB-C |
| Xbox One | No Share; plain cross D-pad; glossy top plate; micro-USB |
| DualShock 4 | Round recesses around the D-pad and face buttons; smaller touchpad with a light strip; Share/Options; light bar in the top view |
| Xbox 360 | Guide button with a four-segment ring; Back/Start arrow buttons; disc D-pad |
| Switch Pro | B/A/Y/X by position (standard index 0 = bottom = B); −, +, Capture (17), Home (16); player LEDs |
| Generic | Symmetric sticks; numbered face buttons 0–3; Select/Start/Home |

- [ ] Capture each with `?demo=<id>` and check that every lit part matches the index the demo is pressing.
- [ ] Commit "Add Xbox, DualShock 4, Xbox 360, Switch Pro and Generic drawings".

### Task 6: Cleanup and verification

**Files:**
- Delete: `src/App.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, and the old `src/index.css`
- Modify: `index.html` (`<title>Controller Analyzer</title>`)

- [ ] `npx vitest run`, `npx eslint .` and `npx vite build`. Expected: all clean.
- [ ] Captures:
  - 1200×800, every model, dark and light;
  - 820×900 (narrow layout);
  - disconnected state;
  - `?demo=xinput`, where the hint reads "Detected: Xbox controller".
- [ ] Commit "Remove template leftovers".
- [ ] Fast-forward `main` to `ui-redesign`, push `origin main`, and confirm the Vercel production deployment for the new SHA and the live HTML title.
