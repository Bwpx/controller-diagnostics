import { createAccumulators, samplePad, resetHeat } from './sampler.js';
import { toCsv } from './stats.js';

const EMPTY = Object.freeze({
  connected: false,
  id: '',
  mapping: '',
  axes: [0, 0, 0, 0],
  buttons: [],
  pressCount: 0,
  drift: { left: false, right: false },
  recording: { active: false, frames: 0 },
  connectCount: 0,
});

const browserFrames = {
  raf: (fn) => requestAnimationFrame(fn),
  caf: (id) => cancelAnimationFrame(id),
};

// Owns the per-frame polling loop and everything that accumulates over a session.
// React reads it through useSyncExternalStore; the snapshot object only changes when something changed.
export function createInputStore(readPad, { raf, caf } = browserFrames, now = () => Date.now()) {
  const acc = createAccumulators();
  const listeners = new Set();
  let snapshot = EMPTY;
  let connectCount = 0;
  let frameId = null;

  const publish = (next) => {
    snapshot = next;
    listeners.forEach((listener) => listener());
  };
  const recording = () => ({ active: acc.rec.active, frames: acc.rec.log.length });

  function frame() {
    const pad = readPad();
    if (pad) {
      if (!snapshot.connected) connectCount += 1;
      publish({ ...samplePad(pad, acc, now()), connectCount });
    } else if (snapshot.connected) {
      publish({ ...snapshot, connected: false });
    }
    frameId = raf(frame);
  }

  return {
    acc,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    start() {
      if (frameId === null) frameId = raf(frame);
    },
    stop() {
      if (frameId !== null) caf(frameId);
      frameId = null;
    },
    resetHeatmap(side) {
      resetHeat(acc.heat[side]);
      publish({ ...snapshot });
    },
    startRecording() {
      acc.rec = { active: true, log: [] };
      publish({ ...snapshot, recording: recording() });
    },
    stopRecording() {
      acc.rec.active = false;
      publish({ ...snapshot, recording: recording() });
    },
    csv: () => toCsv(acc.rec.log),
  };
}
