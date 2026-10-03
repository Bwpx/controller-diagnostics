import { describe, it, expect } from 'vitest';
import { createInputStore } from './inputStore.js';

function manualFrames() {
  let callback = null;
  return {
    raf: (fn) => { callback = fn; return 1; },
    caf: () => { callback = null; },
    step: () => { if (callback) callback(); },
  };
}

const PAD = { id: 'Pad', mapping: 'standard', axes: [0, 0, 0, 0], buttons: [{ pressed: false, value: 0 }] };

describe('input store', () => {
  it('emits every connected frame and once on disconnect', () => {
    let pad = PAD;
    const frames = manualFrames();
    const store = createInputStore(() => pad, frames);
    let calls = 0;
    store.subscribe(() => { calls += 1; });
    store.start();
    frames.step();
    frames.step();
    expect(store.getSnapshot()).toMatchObject({ connected: true, connectCount: 1 });
    pad = null;
    frames.step();
    frames.step();
    expect(store.getSnapshot().connected).toBe(false);
    expect(calls).toBe(3);
  });

  it('counts reconnects', () => {
    let pad = PAD;
    const frames = manualFrames();
    const store = createInputStore(() => pad, frames);
    store.start();
    frames.step();
    pad = null;
    frames.step();
    pad = PAD;
    frames.step();
    expect(store.getSnapshot().connectCount).toBe(2);
  });

  it('keeps the snapshot stable between frames', () => {
    const frames = manualFrames();
    const store = createInputStore(() => PAD, frames);
    store.start();
    frames.step();
    expect(store.getSnapshot()).toBe(store.getSnapshot());
  });

  it('records frames and exports them as CSV after stopping', () => {
    const frames = manualFrames();
    const store = createInputStore(() => PAD, frames);
    store.start();
    store.startRecording();
    expect(store.getSnapshot().recording).toEqual({ active: true, frames: 0 });
    frames.step();
    frames.step();
    store.stopRecording();
    expect(store.getSnapshot().recording).toEqual({ active: false, frames: 2 });
    expect(store.csv().split('\n')).toHaveLength(3);
  });

  it('notifies subscribers on actions even while disconnected', () => {
    const frames = manualFrames();
    const store = createInputStore(() => null, frames);
    let calls = 0;
    store.subscribe(() => { calls += 1; });
    store.resetHeatmap('left');
    store.startRecording();
    store.stopRecording();
    expect(calls).toBe(3);
  });

  it('stops scheduling frames after stop()', () => {
    const frames = manualFrames();
    const store = createInputStore(() => PAD, frames);
    store.start();
    store.stop();
    frames.step();
    expect(store.getSnapshot().connected).toBe(false);
  });
});
