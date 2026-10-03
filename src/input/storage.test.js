import { describe, it, expect } from 'vitest';
import { readJSON, writeJSON } from './storage.js';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); },
  };
}

const throwing = {
  getItem() { throw new Error('denied'); },
  setItem() { throw new Error('denied'); },
};

describe('storage', () => {
  it('returns the fallback for a missing key', () => {
    expect(readJSON('theme', 'dark', memoryStorage())).toBe('dark');
  });

  it('returns the fallback for invalid JSON', () => {
    expect(readJSON('theme', 'dark', memoryStorage({ 'controller-ui:theme': '{oops' }))).toBe('dark');
  });

  it('returns the fallback when storage throws', () => {
    expect(readJSON('theme', 'dark', throwing)).toBe('dark');
  });

  it('returns the fallback when no storage is available', () => {
    expect(readJSON('theme', 'dark', null)).toBe('dark');
  });

  it('swallows write errors', () => {
    expect(() => writeJSON('theme', 'light', throwing)).not.toThrow();
    expect(() => writeJSON('theme', 'light', null)).not.toThrow();
  });

  it('round-trips values under the app prefix', () => {
    const storage = memoryStorage();
    writeJSON('modelByDevice', { a: 'dualsense' }, storage);
    expect(storage.data['controller-ui:modelByDevice']).toBe('{"a":"dualsense"}');
    expect(readJSON('modelByDevice', {}, storage)).toEqual({ a: 'dualsense' });
  });
});
