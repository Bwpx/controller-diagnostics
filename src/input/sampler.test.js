import { describe, it, expect } from 'vitest';
import { createAccumulators, samplePad, resetHeat } from './sampler.js';
import { HISTORY_LEN, HEATMAP_SIZE, heatCell } from './stats.js';

function pad({ axes = [0, 0, 0, 0], pressed = [], id = 'Test Pad', mapping = 'standard', count = 17 } = {}) {
  const buttons = Array.from({ length: count }, (_, i) => ({
    pressed: pressed.includes(i),
    value: pressed.includes(i) ? 1 : 0,
  }));
  return { id, mapping, axes, buttons };
}

describe('samplePad', () => {
  it('describes the pad in the snapshot', () => {
    const snap = samplePad(pad({ id: 'Pad A' }), createAccumulators(), 1);
    expect(snap).toMatchObject({ connected: true, id: 'Pad A', mapping: 'standard' });
  });

  it('counts only new presses', () => {
    const acc = createAccumulators();
    samplePad(pad({ pressed: [0] }), acc, 1);
    samplePad(pad({ pressed: [0, 1] }), acc, 2);
    const snap = samplePad(pad({ pressed: [1] }), acc, 3);
    expect(snap.pressCount).toBe(2);
  });

  it('records left and right X into a ring buffer that wraps', () => {
    const acc = createAccumulators();
    for (let i = 0; i < HISTORY_LEN + 2; i++) {
      samplePad(pad({ axes: [i / 1000, 0, -i / 1000, 0] }), acc, i);
    }
    expect(acc.history.head).toBe(2);
    expect(acc.history.lx[1]).toBeCloseTo((HISTORY_LEN + 1) / 1000, 5);
    expect(acc.history.rx[1]).toBeCloseTo(-(HISTORY_LEN + 1) / 1000, 5);
  });

  it('accumulates heatmap counts per stick', () => {
    const acc = createAccumulators();
    samplePad(pad({ axes: [0.5, -0.5, 0, 0] }), acc, 1);
    samplePad(pad({ axes: [0.5, -0.5, 0, 0] }), acc, 2);
    const leftCell = heatCell(-0.5) * HEATMAP_SIZE + heatCell(0.5);
    expect(acc.heat.left.grid[leftCell]).toBe(2);
    expect(acc.heat.left.max).toBe(2);
    expect(acc.heat.left.samples).toBe(2);
    expect(acc.heat.right.grid[heatCell(0) * HEATMAP_SIZE + heatCell(0)]).toBe(2);
  });

  it('resets a single heatmap', () => {
    const acc = createAccumulators();
    samplePad(pad({ axes: [0.5, 0.5, 0.5, 0.5] }), acc, 1);
    resetHeat(acc.heat.left);
    expect(acc.heat.left.grid.every((c) => c === 0)).toBe(true);
    expect(acc.heat.left).toMatchObject({ samples: 0, max: 0 });
    expect(acc.heat.right.samples).toBe(1);
  });

  it('pads short controllers with zeros', () => {
    const cheap = {
      id: 'Cheap Pad',
      mapping: '',
      axes: [0.2, -0.1],
      buttons: Array.from({ length: 10 }, () => ({ pressed: false, value: 0 })),
    };
    const snap = samplePad(cheap, createAccumulators(), 1);
    expect(snap.axes).toEqual([0.2, -0.1, 0, 0]);
    expect(snap.buttons).toHaveLength(10);
  });

  it('turns non-numeric axis values into 0', () => {
    const odd = { id: 'Odd', mapping: 'standard', axes: [NaN, 0.3, undefined, 0], buttons: [] };
    expect(samplePad(odd, createAccumulators(), 1).axes).toEqual([0, 0.3, 0, 0]);
  });

  it('records frames only while recording and keeps them after stopping', () => {
    const acc = createAccumulators();
    samplePad(pad(), acc, 1);
    acc.rec.active = true;
    samplePad(pad({ axes: [0.1, 0.2, 0.3, 0.4], pressed: [2] }), acc, 2);
    acc.rec.active = false;
    const snap = samplePad(pad(), acc, 3);
    expect(acc.rec.log).toHaveLength(1);
    expect(acc.rec.log[0].t).toBe(2);
    expect(acc.rec.log[0].axes).toEqual([0.1, 0.2, 0.3, 0.4]);
    expect(acc.rec.log[0].buttons[2]).toBe(true);
    expect(snap.recording).toEqual({ active: false, frames: 1 });
  });

  it('flags drift per stick only when no button is held', () => {
    const acc = createAccumulators();
    expect(samplePad(pad({ axes: [0.1, 0, 0, 0] }), acc, 1).drift).toEqual({ left: true, right: false });
    expect(samplePad(pad({ axes: [0.1, 0, 0, 0], pressed: [0] }), acc, 2).drift).toEqual({ left: false, right: false });
  });
});
