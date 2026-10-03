import { describe, it, expect } from 'vitest';
import { heatPixels, parseHex } from './heatmapDraw.js';
import { HEATMAP_SIZE, heatCell } from '../input/stats.js';

const blank = () => ({ grid: new Uint32Array(HEATMAP_SIZE * HEATMAP_SIZE), samples: 0, max: 0 });
const centre = heatCell(0) * HEATMAP_SIZE + heatCell(0);
const rgba = (pixels, i) => Array.from(pixels.slice(i * 4, i * 4 + 4));

describe('heatPixels', () => {
  it('leaves unvisited cells transparent', () => {
    expect(heatPixels(blank(), [255, 255, 255]).every((v) => v === 0)).toBe(true);
  });

  it('paints the busiest cell fully opaque in the ink color', () => {
    const heat = blank();
    heat.grid[centre] = 10;
    heat.max = 10;
    expect(rgba(heatPixels(heat, [1, 2, 3]), centre)).toEqual([1, 2, 3, 255]);
  });

  it('fades rarer cells with the 0.45 gamma', () => {
    const heat = blank();
    heat.grid[centre] = 10;
    heat.grid[centre + 1] = 1;
    heat.max = 10;
    expect(rgba(heatPixels(heat, [1, 2, 3]), centre + 1)[3]).toBe(116);
  });

  it('ignores corner cells outside the circular gate', () => {
    const heat = blank();
    heat.grid[0] = 5;
    heat.max = 5;
    expect(rgba(heatPixels(heat, [1, 2, 3]), 0)[3]).toBe(0);
  });
});

describe('parseHex', () => {
  it('reads long and short hex colors, ignoring whitespace', () => {
    expect(parseHex(' #e6e6e8 ')).toEqual([230, 230, 232]);
    expect(parseHex('#fff')).toEqual([255, 255, 255]);
  });

  it('falls back to white for anything else', () => {
    expect(parseHex('nonsense')).toEqual([255, 255, 255]);
  });
});
