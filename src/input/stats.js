// Tuning values carried over unchanged from the original single-file app.
export const DRIFT_THRESHOLD = 0.08;
export const HISTORY_LEN = 120;
export const HEATMAP_SIZE = 64;
export const HEAT_GAMMA = 0.45;

export function magnitude(x, y) {
  return Math.hypot(x, y);
}

// A stick drifts when it reports movement while nothing is being pressed.
export function isDrifting(x, y, anyPressed) {
  return !anyPressed && magnitude(x, y) > DRIFT_THRESHOLD;
}

// Maps an axis value in [-1, 1] to a heatmap row or column.
export function heatCell(v) {
  const value = Number.isFinite(v) ? v : 0;
  return Math.min(HEATMAP_SIZE - 1, Math.max(0, Math.floor(((value + 1) / 2) * HEATMAP_SIZE)));
}

export const CSV_HEADER = 'timestamp,lx,ly,rx,ry,buttons';

export function csvRow({ t, axes, buttons }) {
  return `${t},${axes.join(',')},${buttons.map(Number).join('|')}`;
}

export function toCsv(frames) {
  return [CSV_HEADER, ...frames.map(csvRow)].join('\n');
}
