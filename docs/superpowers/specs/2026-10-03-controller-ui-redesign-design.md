# Controller Analyzer: UI Redesign

**Date:** 2026-10-03
**Status:** Approved design, pending written-spec review
**Scope:** Replace the entire UI of the Electron + React app. Gamepad behavior (sampling, drift rule, recording format) stays the same except for the fixes listed here.

---

## 1. Intent

The owner wants the app to look completely different and more modern. Over several rounds of mockups, the direction narrowed to:

- **Controller-centric.** A large, detailed drawing of the user's actual controller is the centerpiece. Buttons, sticks and triggers react live on the drawing.
- **A selector for the controller model** (PS5, PS4, Xbox Series, Xbox One, Xbox 360, Switch Pro, Generic), auto-detected with a manual override.
- **No "AI slop".** No glowing status dots, glows, drop shadows, gradient fills, pill badges, decorative icons or pulsing animations. Every visual element must carry information or structure.
- **A bold platform-color stage** with the controller's grip texture.
- **Labeled frames** (test-equipment style) to give every section clear structure.

**Success looks like:**
- At the default 1200×800 Electron window size, the full controller (front and top views) and the bottom tab bar are visible without scrolling.
- Every input on every supported controller is visibly reflected on the right part of its drawing.
- Drift is impossible to miss on every platform color.
- Nothing on screen is purely decorative.

### Decisions log

| Topic | Decision |
|---|---|
| Visual direction | Controller-centric (round 2, option E), refined over three iterations |
| Detail level | High-detail front view and a separate top view (approved: `controller-centric-v5`) |
| Decoration | Removed all glows, gradients, drop shadows, pills, icon badges and the glowing "live" dot |
| Stage background | Grip texture on a **bold platform color** (`texture-color`, option 3) |
| Light/dark toggle | Kept. It changes only the frame (top bar, selector, bottom panel). The stage stays bold in both themes |
| Section style | **Labeled frames**: title set into the top border, square corners, corner ticks (`section-borders`, option C) |
| Drawing approach | Hand-drawn SVG React component per model (approach 1 of 3) |

The mockups live locally in `.superpowers/brainstorm/` (gitignored):
- `1546-1791062803/content/`: direction rounds, `controller-centric-v5.html` (the approved controller drawing), `texture-color.html`
- `1586-1791064612/content/`: `theming.html`, `section-borders.html`

### Non-goals

- Showing several controllers at once (the app shows one, as today).
- New analytics such as circularity scores or polling-rate measurement.
- Button remapping or calibration.
- Fixing Electron packaging. `electron.cjs` always loads `http://localhost:5173` and opens DevTools, so a packaged build shows a blank window. This is a known issue and is left untouched.

---

## 2. Screen layout

The layout targets the default Electron window (1200×800). The page scrolls vertically when the bottom panel content is taller than the space left.

```
┌──────────────────────────────────────────────────────────────────┐
│ Controller Analyzer               1,284 presses   Light  [Record]│  top bar (frame)
├──────────────────────────────────────────────────────────────────┤
│ DualSense (PS5)  DualShock 4  Xbox Series … Generic  Detected: … │  selector (frame)
├──────────────────────────────────────────────────────────────────┤
│ ┌─ stage box (platform color + texture) ───────────────────────┐ │
│ │ ┌LEFT STICK─[DRIFT]┐                       ┌RIGHT STICK─────┐ │ │
│ │ │ X  Y  Magnitude  │     FRONT VIEW        │ X  Y  Magnitude│ │ │
│ │ │ mini heatmap     │                       │ mini heatmap   │ │ │
│ │ └┘              └┘ │     TOP VIEW          └┘             └┘ │ │
│ │ ┌L2 · L1──────12%┐ │  name · 054c:0ce6     ┌R2 · R1─────68%┐ │ │
│ │ └┘              └┘ │                       └┘             └┘ │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌─ bottom box ─────────────────────────────────────────────────┐ │
│ │ Input history | Heatmaps | Buttons | About                   │ │
│ │ (tab content)                                                │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### 2.1 Top bar (frame)
- **Title:** "Controller Analyzer". No logo or status dot.
- **Press counter:** for example "1,284 presses", in a monospace font. Hidden when no controller is connected.
- **Theme toggle:** a text button naming the theme it switches to ("Light" while in dark mode), with the tooltip "Switch to light theme".
- **Recording controls:**
  - Idle: `Record`.
  - While recording: `Stop · 1,204 frames`.
  - After stopping with data: `Record` plus `Export CSV`.
  - Disabled when no controller is connected.

### 2.2 Controller selector (frame)
- Text tabs with an underline on the active one: `DualSense (PS5)`, `DualShock 4 (PS4)`, `Xbox Series`, `Xbox One`, `Xbox 360`, `Switch Pro`, `Generic`.
- A quiet hint on the right shows one of:
  - `Detected: <model name>`
  - `Detected: Xbox controller` (XInput, see §3.4)
  - `No controller`

### 2.3 Stage (platform color)
The stage is a box inset 12px from the window edges, with a 1px border and a 10px radius. Its contents:

- **Left rail:**
  - Frame `LEFT STICK`: X and Y as values with center-origin bars, Magnitude, and a mini heatmap.
  - Frame `<L2> · <L1>`: the trigger value in the top border (e.g. `12%`), a trigger bar, and the bumper state (`Pressed` or `Released`).
- **Right rail:** mirrors the left rail for the right stick, R2 and R1.
- **Center:** the front view, then the top view (labelled `TOP VIEW` with a one-line value summary), then the device line: `<gamepad name> · <vendor>:<product>`.
  - Connection type is not shown because the browser cannot detect it.
- **Frame titles use the selected model's names.** For example: `LT · LB` on Xbox, `ZL · L` on Switch Pro.

### 2.4 Bottom panel (frame)
A box with the same inset, border and radius as the stage. It has four tabs: **Input history**, **Heatmaps**, **Buttons** and **About** (see §5).

### 2.5 Removed compared with today
- The large header block and the gradient divider.
- The standalone recording bar.
- The grid of button chips. The drawing and the Buttons tab replace it.
- The always-visible footer, which moves to About.
- The pulsing connect rings.
- The Google Fonts import.

---

## 3. Controller drawings

### 3.1 Models
`dualsense`, `dualshock4`, `xbox-series`, `xbox-one`, `xbox-360`, `switch-pro`, `generic`.

- Each model has a **front view** and a **top view**, drawn as original SVG illustrations at the level of detail of the approved DualSense (`controller-centric-v5`). Proportions come from public references. Nothing is traced from official artwork.
- `generic` is a brand-free, symmetric pad with numbered face buttons.

### 3.2 Live state rules (all models)
| Input | How the drawing shows it |
|---|---|
| Digital button (face buttons, each D-pad direction, bumpers, menu buttons, home, touchpad click) | Fill turns light gray (`--pad-pressed`); the symbol inverts to dark |
| Analog trigger | The trigger shape fills from its base in proportion to its value, in both front and top views. Switch Pro ZL/ZR are digital, so they show 0% or 100% |
| Stick | The cap is offset inside its well by `(x, y) × (wellRadius − capRadius)`, so at full tilt the cap's edge touches the well's edge. On square-gate diagonals, where the magnitude exceeds 1, the offset vector is clamped to length 1. Positive Y means down in both the Gamepad API and SVG. A thin line connects the well center to the cap center |
| Stick click (L3/R3) | The cap fill turns light |
| Drift (see §4.4) | A red (`--drift`) 1.5px outline on that stick's cap |

### 3.3 Button names (by the W3C standard-mapping index)
| Index | PlayStation (PS5 / PS4) | Xbox Series / One | Xbox 360 | Switch Pro | Generic |
|---|---|---|---|---|---|
| 0 | Cross | A | A | B | Button 0 |
| 1 | Circle | B | B | A | Button 1 |
| 2 | Square | X | X | Y | Button 2 |
| 3 | Triangle | Y | Y | X | Button 3 |
| 4 / 5 | L1 / R1 | LB / RB | LB / RB | L / R | Button 4 / 5 |
| 6 / 7 | L2 / R2 | LT / RT | LT / RT | ZL / ZR | Button 6 / 7 |
| 8 | Create / Share | View | Back | − | Button 8 |
| 9 | Options | Menu | Start | + | Button 9 |
| 10 / 11 | L3 / R3 | LS / RS | LS / RS | L-stick / R-stick | Button 10 / 11 |
| 12–15 | D-pad Up/Down/Left/Right | same | same | same | Button 12–15 |
| 16 | PS | Xbox | Guide | Home | Button 16 |
| 17 (if reported) | Touchpad | — | — | Capture | Button 17 |

Axes: 0 = left X, 1 = left Y, 2 = right X, 3 = right Y. Any further axes appear only in the Buttons tab.

Switch Pro uses Nintendo's positions (B is the bottom button). The exact index order Chromium reports for the Switch Pro must be verified during implementation.

### 3.4 Auto-detection (`input/detect.js`, pure function)
Chromium/Electron reports `gamepad.id` in a form like `DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)`. The vendor and product IDs are parsed from that string.

| Match | Model |
|---|---|
| Vendor `054c`, product `0ce6` or `0df2` (Edge) | `dualsense` |
| Vendor `054c`, product `05c4` or `09cc` | `dualshock4` |
| Vendor `045e`, product `0b12` or `0b13` | `xbox-series` |
| Vendor `045e`, product `02d1`, `02dd`, `02e0`, `02ea` or `02fd` | `xbox-one` |
| Vendor `045e`, product `028e`, `028f` or `0719` | `xbox-360` |
| Vendor `057e`, product `2009` | `switch-pro` |
| `id` contains `XInput` (Windows reports every XInput pad as "Xbox 360 Controller") | **Xbox family.** The hint says "Detected: Xbox controller", and the model is the saved pick for this id, defaulting to `xbox-series` |
| Anything else | `generic` |

The ID table lives in one place and is covered by tests. It will be checked, and extended if needed, against the raw `id` of the owner's controller, which the stage's device line shows.

### 3.5 Model selection and memory
- The selected model is remembered **per device id** in `localStorage` (`controller-ui:modelByDevice`, a map from `gamepad.id` to model id).
- **Choosing the model:**
  - When a controller connects with a saved pick for its id, that pick is used.
  - When there is no saved pick, the detected model is used.
  - When the user clicks a selector tab, the pick is saved for the current device id.
- **Xbox works without special-casing.** Every XInput pad shares the same id, so "the last Xbox model you picked" falls out of the per-id memory.
- **With no controller connected,** clicking a tab only changes the preview and saves nothing per device.
- **The displayed model is always saved** to `controller-ui:lastModel` whenever it changes, whether or not a controller is connected. The connect state shows that model dimmed.

### 3.6 Non-standard mapping
If `gamepad.mapping !== "standard"`, one line appears under the device line:

> This controller doesn't report the standard layout, so the drawing may not match. See the Buttons tab for raw input.

The drawing still renders, using the standard indices.

### 3.7 Model module interface (`src/controllers/`)
```js
// controllers/index.js
export const MODELS = [
  {
    id: 'dualsense',
    name: 'DualSense (PS5)',
    platform: 'playstation',            // 'playstation' | 'xbox' | 'nintendo' | 'generic'
    buttonNames: ['Cross', 'Circle', /* … by standard index … */],
    Front,                               // ({ buttons, axes, drift }) => <svg>
    Top,                                 // ({ buttons }) => <svg>
  },
  // …
];
```
- `buttons` is an array of `{ pressed, value }` objects.
- `axes` is a number array.
- `drift` is `{ left, right }` as booleans.
- Shared SVG building blocks (stick well/cap with travel, clipped trigger fill, beveled face button, D-pad arrow) live in `controllers/parts.jsx`, so every model uses the same rules from §3.2.

### 3.8 Build order
DualSense, Xbox Series, DualShock 4, Xbox One, Xbox 360, Switch Pro, Generic.

---

## 4. Visual system and theming

All colors are CSS custom properties, defined once in `src/styles/tokens.css`. There are two independent axes:

- `data-theme="dark" | "light"` on `<html>` applies to the **frame**: top bar, selector, bottom panel, and the page background around the boxes.
- `data-platform="playstation" | "xbox" | "nintendo" | "generic"` on the stage applies to the **stage** only.

### 4.1 Frame tokens
| Token | Dark | Light |
|---|---|---|
| `--frame-bg` | `#111214` | `#ffffff` |
| `--frame-text` | `#e6e6e8` | `#18181b` |
| `--frame-muted` | `#86878e` | `#6b6b73` |
| `--frame-border` | `#232428` | `#e4e4e7` |
| `--frame-border-strong` (box borders, labeled frames, buttons) | `#3a3b40` | `#d4d4d8` |
| `--frame-track` (bar and graph tracks) | `#26272b` | `#e4e4e7` |
| `--drift-on-frame` | `#f26b6b` | `#dc2626` |

### 4.2 Platform tokens (the same in both themes)
| Platform | `--stage` | `--stage-texture` | Texture |
|---|---|---|---|
| playstation | `#0f57c8` | `#0b45a3` | 54px tile of △ ○ ✕ □ outlines, 1.1px stroke, staggered 3×3 |
| xbox | `#107c10` | `#0c600c` | Offset dot grid, 10px pitch, 1.3px dots |
| nintendo | `#e60012` | `#b5000e` | Offset dot grid |
| generic | `#3d4049` | `#32353d` | Offset dot grid |

- The texture fades out behind the controller through a radial mask: transparent inside the central ellipse, fully visible at the edges.
- **Text on the stage** is always white:
  - labels: `rgba(255,255,255,.78)`
  - values: `#fff`
  - bar tracks: `rgba(255,255,255,.24)`
  - bar fills: `#fff`

### 4.3 Controller drawing palette (the same in both themes)
| Part | Color |
|---|---|
| Body | `#202124` |
| Center plate | `#17181b` |
| Parts | `#2a2b2f` |
| Strokes | `#3a3b40` / `#2c2d31` |
| Symbols and details | `#9a9ba1` / `#6b6c72` |
| Stick wells | `#0f1012` |
| Pressed (`--pad-pressed`) | `#e6e6e8` |
| Drift (`--drift`) | `#f26b6b` |

### 4.4 Drift
- **Rule (unchanged):** no button is pressed, and the stick magnitude is greater than `0.08` (`DRIFT_THRESHOLD`).
- **On the stage:**
  - An inverted `DRIFT` label (white background, stage-colored text) sits in the stick frame's top border.
  - The stick cap in the drawing gets a red outline. It sits on the dark controller body, so it stays legible on every platform color.
- **In the frame:** `--drift-on-frame` is used, for example on the history line of the drifting stick.
- Red is never used for anything except drift.

### 4.5 Labeled frame component (`components/LabeledFrame.jsx`)
- 1px border with a 2px radius.
  - On the stage: `rgba(255,255,255,.5)`.
  - In the frame: `--frame-border-strong`.
- **Title:** set into the top border at its left. Uppercase, 10px, letter-spacing `.09em`, weight 600. Its background matches the surface behind it, so it cuts the border line.
- **Optional value:** set into the top border at its right, e.g. `12%` or the `DRIFT` label.
- **Corner ticks:** 6×6px, 2px thick, at the bottom-left and bottom-right.
- The same component is used on the stage and in the bottom panel. A prop selects the stage or frame surface.

### 4.6 Boxes
- The stage and bottom panel are inset 12px from the window edges, with a 1px `--frame-border-strong` border and a 10px radius.
- No shadows anywhere.

### 4.7 Typography
- **UI text:** `"Segoe UI Variable", "Segoe UI", system-ui, sans-serif`.
- **Numbers:** `"Cascadia Mono", Consolas, ui-monospace, monospace` with `font-variant-numeric: tabular-nums`.
- No web fonts, so the app renders correctly offline.

### 4.8 Persistence
- **Theme:** `controller-ui:theme`. On first launch, the theme follows `prefers-color-scheme`.
- **Model choice:** see §3.5.
- **Error handling:** all `localStorage` access is wrapped in try/catch. If storage is unavailable or the JSON is invalid, the defaults are used.

---

## 5. Bottom panel, recording, connect state

### 5.1 Input history
- Left X and right X over the last **120 samples** (one per animation frame), the same as today.
- Series colors: left X uses `--frame-text`, and right X uses `--frame-muted` with a dashed stroke, so the two lines stay distinguishable without color.
- A series switches to `--drift-on-frame` while its stick drifts.
- There's a center zero line and a small legend.

### 5.2 Heatmaps
- Two labeled frames, `LEFT STICK` and `RIGHT STICK`. Each contains a large circular heatmap, a sample count and its own `Reset`.
- **Data (unchanged):**
  - 64×64 grid per stick.
  - Cell index = `floor((v + 1) / 2 × 64)`, clamped.
  - One sample per frame.
  - Gamma `0.45` for display.
- **Color:** a single-hue scale replaces the rainbow ramp. The color is `--frame-text` with opacity proportional to intensity.
- **Overlays:** the dashed deadzone ring (radius = threshold), the outer ring and a crosshair.
- The stage's mini heatmaps draw the same grids in white.

### 5.3 Buttons
- Frame `BUTTONS`: one row per reported button, showing its name for the selected model (§3.3), its index, `Pressed`/`Released`, and a 0–1 value bar.
- Frame `AXES`: one row per reported axis, showing its index, value and a center-origin bar.
- This tab is the fallback view for non-standard controllers.

### 5.4 About
- One frame containing the existing footer text unchanged: the quote, the description, "Martin Gonzalez · Personal Project".
- The tags become plain text: `Web Gamepad API · React · Open Source`.

### 5.5 Recording
- **Behavior is unchanged.** Starting a recording clears the previous log, and stopping it enables export.
- **CSV format is unchanged** (byte-for-byte, so earlier exports keep working):
  - header: `timestamp,lx,ly,rx,ry,buttons`
  - each row: `Date.now()`, the four axes, then the pressed flags as `0|1` joined by `|`
  - file name: `controller-session.csv`

### 5.6 Connect state (no controller)
- The same top bar, selector and bottom panel as the main screen.
- The press counter is hidden, and Record is disabled.
- **The stage** shows the last-viewed model at 35% opacity, plus one labeled frame `NO CONTROLLER`: "Connect a controller and press any button."
  - Browsers only expose a gamepad after its first button press, which is why the message asks for one.
- The selector stays usable, so you can browse the drawings without a controller.
- **On a mid-session disconnect,** the app returns to this state but keeps the press count, history, heatmaps and recording until you reset them, the same as today.

---

## 6. Architecture

### 6.1 Files
```
src/
  main.jsx                 renders <App/>, imports styles/index.css
  App.jsx                  layout, theme state, model selection
  styles/
    index.css              imports tokens + base
    tokens.css             §4 tokens (theme × platform)
    base.css               reset, typography, page background
  input/
    useGamepad.js          frame loop, live snapshot, accumulators, recording
    gamepadSource.js       real source (navigator.getGamepads) + demo source
    detect.js              §3.4, pure
    stats.js               magnitude, drift rule, heatmap cell, CSV rows, pure
    storage.js             safe localStorage get/set (JSON, try/catch)
  controllers/
    index.js               MODELS registry, model lookup
    parts.jsx              shared SVG parts
    DualSense.jsx  DualShock4.jsx  XboxSeries.jsx  XboxOne.jsx
    Xbox360.jsx  SwitchPro.jsx  Generic.jsx
  components/
    TopBar.jsx  ControllerSelector.jsx  Stage.jsx  LabeledFrame.jsx
    StickGroup.jsx  TriggerGroup.jsx  MiniHeatmap.jsx
    BottomPanel.jsx  HistoryGraph.jsx  HeatmapsTab.jsx  ButtonsTab.jsx  AboutTab.jsx
    (component CSS files sit next to their components)
```

### 6.2 Data flow
- `useGamepad({ source })` runs a single `requestAnimationFrame` loop.
- **Each frame:**
  1. It reads the **first non-null** gamepad from the source. Today's code only reads slot `[0]` and can miss a controller in another slot.
  2. It updates one React state value, the **snapshot**: `{ connected, id, mapping, axes, buttons, pressCount, drift }`.
  3. It updates the **accumulators**, which are held in refs and never copied: two `Float32Array(120)` history ring buffers, two `Uint32Array(64*64)` heatmap grids with sample counts, the recording log and the press counter.
- **Exposed actions:** `resetHeatmap(side)`, `startRecording()`, `stopRecording()`, `exportCsv()`, plus `recording` state (`active`, `frames`, `hasData`).
- **Canvas components** (the history graph and both heatmap sizes) redraw from the accumulator refs on each render.
- **Selecting the model:** `App` derives `model` from the snapshot id, `detect.js` and `storage.js` (§3.5). `model.platform` drives `data-platform` on the stage.
- **Expected performance:** the whole tree re-renders once per frame. That should be fine for SVGs of this size. If profiling shows otherwise, the stage gets memoized against the snapshot fields it uses.

### 6.3 Error handling
| Situation | Behavior |
|---|---|
| No Gamepad API or no controller | Connect state (§5.6) |
| Disconnect mid-session | Connect state; data kept |
| Unknown device | `generic` model |
| `mapping !== "standard"` | Notice under the device line (§3.6) |
| Missing buttons or axes | Read as released / `0` |
| `localStorage` unavailable or invalid | Defaults; no crash |

---

## 7. Testing

### 7.1 Unit tests
- Add **Vitest** as a dev dependency, with an `npm test` script.
- **`detect.js`:** every row of §3.4, including the XInput id, an Edge DualSense, an unknown vendor and a malformed id.
- **`stats.js`:**
  - drift rule at, below and above `0.08`, and with a button held;
  - heatmap cell clamping at −1, 0, 1 and out-of-range values;
  - CSV header and row output matching today's format exactly.
- **`storage.js`:** invalid JSON, throwing storage, and a missing key.

### 7.2 Demo mode (development aid)
- Load the app with `?demo` to use a scripted fake gamepad instead of real hardware.
  - Add `?demo=<model-id>` to set the fake device id so detection selects that model.
- **The script loops:**
  - the left stick circles;
  - the right stick traces a figure-eight;
  - the triggers ramp up and down;
  - the buttons light up one at a time in index order;
  - every cycle, the left stick drifts for a few seconds (idle at an offset of about 0.1).
- It's implemented as an alternative `gamepadSource`, so the rest of the app is unaware of it.

### 7.3 Manual verification
- **Drawings:** for each model in demo mode, every button lights the matching part, the triggers fill in both views, the sticks move, and drift shows the label and the outline.
- **Window size:** at 1200×800, the controller and the tab bar are visible without scrolling.
- **Themes:** both themes on all four platforms. Text is legible and the drift label is visible.
- **Real controller:**
  - detection result and raw `id`;
  - connect, disconnect and reconnect;
  - recording and CSV export, with the CSV compared against one made by the old version.

---

## 8. Sequencing

1. **Baseline.**
   - Commit the existing uncommitted heatmap work in `src/App.jsx`, then do all redesign work on a branch.
   - Add `.superpowers/` to `.gitignore`.
   - Add Vitest.
2. **Input layer.** `useGamepad`, the sources (including demo), `detect`, `stats` and `storage`, with unit tests.
3. **Visual system and shell.** Tokens, base styles, `LabeledFrame`, the top bar, the selector, the stage with the DualSense drawing, and the bottom panel frame.
4. **Bottom tabs, recording and the connect state.**
5. **Remaining drawings,** in the §3.8 order.
6. **Cleanup.**
   - Remove the old `App.jsx` code.
   - Replace the Vite template `index.css`, which currently forces `#root` to 1126px with side borders and centered text.
   - Delete the unused `App.css` and `src/assets/*` template images.
   - Set `<title>` to "Controller Analyzer".
   - Run the final verification (§7.3).

## 9. Risks and open items

- **Detection IDs and the XInput string.** Verify both against the owner's controller. The table is easy to extend.
- **Switch Pro index order in Chromium.** Verify with real hardware if available. Otherwise, document it as unverified.
- **60 fps re-render cost.** Expected to be fine; the mitigation is described in §6.2.
- **Drawing accuracy.** The drawings are stylized original illustrations, not exact replicas.
