import { HEATMAP_SIZE, HEAT_GAMMA } from '../input/stats.js';

// One ink color; opacity grows with how often the stick visited each cell.
// Cells outside the circular gate stay transparent.
export function heatPixels(heat, ink) {
  const size = HEATMAP_SIZE;
  const radius = size / 2;
  const pixels = new Uint8ClampedArray(size * size * 4);
  const max = heat.max || 1;
  for (let i = 0; i < heat.grid.length; i++) {
    const count = heat.grid[i];
    if (count === 0) continue;
    const dx = (i % size) + 0.5 - radius;
    const dy = Math.floor(i / size) + 0.5 - radius;
    if (dx * dx + dy * dy > radius * radius) continue;
    const p = i * 4;
    pixels[p] = ink[0];
    pixels[p + 1] = ink[1];
    pixels[p + 2] = ink[2];
    pixels[p + 3] = Math.round(40 + Math.pow(count / max, HEAT_GAMMA) * 215);
  }
  return pixels;
}

export function parseHex(color) {
  const hex = String(color).trim().replace(/^#/, '');
  const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return [255, 255, 255];
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

// The canvas stays at grid resolution; CSS scales it up smoothly.
export function drawHeat(canvas, heat, ink) {
  if (canvas.width !== HEATMAP_SIZE) {
    canvas.width = HEATMAP_SIZE;
    canvas.height = HEATMAP_SIZE;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.putImageData(new ImageData(heatPixels(heat, ink), HEATMAP_SIZE, HEATMAP_SIZE), 0, 0);
}
