import { describe, it, expect } from 'vitest';
import { DEMO_IDS, demoSource, realSource } from './gamepadSource.js';
import { detect, MODEL_IDS } from './detect.js';

describe('demo source', () => {
  it.each(MODEL_IDS)('reports an id that detects as %s', (model) => {
    expect(detect(DEMO_IDS[model]).model).toBe(model);
  });

  it('has an XInput variant', () => {
    expect(detect(DEMO_IDS.xinput)).toEqual({ model: 'xbox-series', xinput: true });
  });

  it('produces a standard pad with in-range values', () => {
    let now = 0;
    const read = demoSource('dualsense', () => now);
    for (now = 0; now < 12000; now += 250) {
      const p = read();
      expect(p.mapping).toBe('standard');
      expect(p.axes).toHaveLength(4);
      expect(p.buttons.length).toBeGreaterThanOrEqual(17);
      p.axes.forEach((v) => expect(Math.abs(v)).toBeLessThanOrEqual(1));
      p.buttons.forEach((b) => {
        expect(b.value).toBeGreaterThanOrEqual(0);
        expect(b.value).toBeLessThanOrEqual(1);
      });
    }
  });

  it('drifts the left stick while idle', () => {
    let now = 0;
    const read = demoSource('dualsense', () => now);
    now = 10000;
    const p = read();
    expect(p.buttons.some((b) => b.pressed)).toBe(false);
    expect(Math.hypot(p.axes[0], p.axes[1])).toBeGreaterThan(0.08);
    expect(Math.hypot(p.axes[2], p.axes[3])).toBeLessThan(0.08);
  });

  it('falls back to the DualSense id for an unknown model', () => {
    expect(demoSource('nope', () => 0)().id).toBe(DEMO_IDS.dualsense);
  });
});

describe('real source', () => {
  it('returns the first connected pad in any slot', () => {
    const a = { id: 'A', connected: true };
    const b = { id: 'B', connected: true };
    expect(realSource({ getGamepads: () => [null, a, b] })()).toBe(a);
  });

  it('skips disconnected entries', () => {
    expect(realSource({ getGamepads: () => [{ id: 'X', connected: false }] })()).toBe(null);
  });

  it('returns null without the Gamepad API', () => {
    expect(realSource({})()).toBe(null);
  });
});
