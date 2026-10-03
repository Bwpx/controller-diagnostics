import { HISTORY_LEN, HEATMAP_SIZE, heatCell, isDrifting } from './stats.js';

const createHeat = () => ({ grid: new Uint32Array(HEATMAP_SIZE * HEATMAP_SIZE), samples: 0, max: 0 });

// Everything that builds up over a session. Mutated in place every frame, never copied.
export function createAccumulators() {
  return {
    history: { lx: new Float32Array(HISTORY_LEN), rx: new Float32Array(HISTORY_LEN), head: 0 },
    heat: { left: createHeat(), right: createHeat() },
    prevPressed: [],
    pressCount: 0,
    rec: { active: false, log: [] },
  };
}

export function resetHeat(heat) {
  heat.grid.fill(0);
  heat.samples = 0;
  heat.max = 0;
}

function addHeat(heat, x, y) {
  const i = heatCell(y) * HEATMAP_SIZE + heatCell(x);
  heat.grid[i] += 1;
  if (heat.grid[i] > heat.max) heat.max = heat.grid[i];
  heat.samples += 1;
}

const toNumber = (v) => (Number.isFinite(v) ? v : 0);

// Reads one frame from a Gamepad-like object, updates the accumulators and returns the snapshot React renders.
export function samplePad(pad, acc, now) {
  const axes = Array.from(pad.axes ?? [], toNumber);
  while (axes.length < 4) axes.push(0);
  const buttons = Array.from(pad.buttons ?? [], (b) => {
    const pressed = Boolean(b?.pressed);
    return { pressed, value: Number.isFinite(b?.value) ? b.value : Number(pressed) };
  });
  const pressed = buttons.map((b) => b.pressed);

  acc.pressCount += pressed.filter((p, i) => p && !acc.prevPressed[i]).length;
  acc.prevPressed = pressed;

  const { history } = acc;
  history.lx[history.head] = axes[0];
  history.rx[history.head] = axes[2];
  history.head = (history.head + 1) % HISTORY_LEN;

  addHeat(acc.heat.left, axes[0], axes[1]);
  addHeat(acc.heat.right, axes[2], axes[3]);

  if (acc.rec.active) acc.rec.log.push({ t: now, axes: axes.slice(0, 4), buttons: pressed });

  const anyPressed = pressed.some(Boolean);
  return {
    connected: true,
    id: pad.id ?? '',
    mapping: pad.mapping ?? '',
    axes,
    buttons,
    pressCount: acc.pressCount,
    drift: {
      left: isDrifting(axes[0], axes[1], anyPressed),
      right: isDrifting(axes[2], axes[3], anyPressed),
    },
    recording: { active: acc.rec.active, frames: acc.rec.log.length },
  };
}
