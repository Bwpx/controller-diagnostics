import { describe, it, expect } from 'vitest';
import { pressedAt, valueAt, dpadAt } from './buttons.js';

const buttons = [
  { pressed: true, value: 1 },
  { pressed: false, value: 0.4 },
  { pressed: false, value: 1.7 },
  { pressed: false, value: NaN },
];

describe('button reads', () => {
  it('reports pressed state and treats missing buttons as released', () => {
    expect(pressedAt(buttons, 0)).toBe(true);
    expect(pressedAt(buttons, 1)).toBe(false);
    expect(pressedAt(buttons, 40)).toBe(false);
  });

  it('clamps analog values to 0..1 and reads bad values as 0', () => {
    expect(valueAt(buttons, 1)).toBe(0.4);
    expect(valueAt(buttons, 2)).toBe(1);
    expect(valueAt(buttons, 3)).toBe(0);
    expect(valueAt(buttons, 40)).toBe(0);
  });

  it('reads the D-pad from standard indices 12-15', () => {
    const pad = Array.from({ length: 16 }, (_, i) => ({ pressed: i === 13 || i === 15, value: 0 }));
    expect(dpadAt(pad)).toEqual({ up: false, down: true, left: false, right: true });
  });
});
