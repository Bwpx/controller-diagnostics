import { describe, it, expect } from 'vitest';
import { resolveModelId, sanitizePicks } from './modelChoice.js';

const PAD = 'DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)';
const snap = (over = {}) => ({ connected: true, id: PAD, connectCount: 1, ...over });
const choose = (over = {}) => resolveModelId({
  snapshot: snap(), picks: {}, preview: { id: 'xbox-one', at: 0 }, detectedModel: 'dualsense', ...over,
});

describe('resolveModelId', () => {
  it('shows the detected model for a connected controller', () => {
    expect(choose()).toBe('dualsense');
  });

  it('prefers the saved pick for this exact device', () => {
    expect(choose({ picks: { [PAD]: 'dualshock4' } })).toBe('dualshock4');
  });

  it('ignores picks saved for other devices', () => {
    expect(choose({ picks: { 'Other pad': 'xbox-360' } })).toBe('dualsense');
  });

  it('shows the preview before any controller has connected', () => {
    expect(choose({ snapshot: snap({ connected: false, id: '', connectCount: 0 }) })).toBe('xbox-one');
  });

  it('keeps showing the last controller after it disconnects', () => {
    expect(choose({ snapshot: snap({ connected: false }) })).toBe('dualsense');
  });

  it('shows a model browsed while disconnected', () => {
    expect(choose({ snapshot: snap({ connected: false }), preview: { id: 'switch-pro', at: 1 } })).toBe('switch-pro');
  });

  it('drops a preview from an earlier disconnected period', () => {
    expect(choose({ snapshot: snap({ connected: false, connectCount: 2 }), preview: { id: 'switch-pro', at: 1 } }))
      .toBe('dualsense');
  });
});

describe('sanitizePicks', () => {
  const known = (id) => ['dualsense', 'xbox-one'].includes(id);

  it('keeps only picks that name a known model', () => {
    expect(sanitizePicks({ a: 'dualsense', b: 'gamecube', c: 3 }, known)).toEqual({ a: 'dualsense' });
  });

  it('returns an empty map for anything that is not an object', () => {
    expect(sanitizePicks(null, known)).toEqual({});
    expect(sanitizePicks(['dualsense'], known)).toEqual({});
    expect(sanitizePicks('dualsense', known)).toEqual({});
  });
});
