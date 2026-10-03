import { describe, it, expect } from 'vitest';
import {
  DRIFT_THRESHOLD, HISTORY_LEN, HEATMAP_SIZE, HEAT_GAMMA,
  magnitude, isDrifting, heatCell, CSV_HEADER, csvRow, toCsv,
} from './stats.js';

describe('constants', () => {
  it('keeps the existing tuning values', () => {
    expect(DRIFT_THRESHOLD).toBe(0.08);
    expect(HISTORY_LEN).toBe(120);
    expect(HEATMAP_SIZE).toBe(64);
    expect(HEAT_GAMMA).toBe(0.45);
  });
});

describe('isDrifting', () => {
  it('is false exactly at the threshold', () => {
    expect(isDrifting(0.08, 0, false)).toBe(false);
  });

  it('is true just above the threshold', () => {
    expect(isDrifting(0.0801, 0, false)).toBe(true);
  });

  it('uses the combined magnitude of both axes', () => {
    expect(magnitude(0.06, 0.06)).toBeCloseTo(0.0849, 4);
    expect(isDrifting(0.06, 0.06, false)).toBe(true);
  });

  it('is false while any button is held', () => {
    expect(isDrifting(0.5, 0.5, true)).toBe(false);
  });
});

describe('heatCell', () => {
  it('maps the axis range onto 64 cells', () => {
    expect(heatCell(-1)).toBe(0);
    expect(heatCell(0)).toBe(32);
    expect(heatCell(1)).toBe(63);
  });

  it('clamps out-of-range values', () => {
    expect(heatCell(2)).toBe(63);
    expect(heatCell(-3)).toBe(0);
  });

  it('treats non-numbers as centred', () => {
    expect(heatCell(NaN)).toBe(32);
    expect(heatCell(undefined)).toBe(32);
  });
});

describe('CSV export', () => {
  it('uses the existing header', () => {
    expect(CSV_HEADER).toBe('timestamp,lx,ly,rx,ry,buttons');
  });

  it('formats a frame exactly like the previous version', () => {
    const frame = { t: 1700000000000, axes: [0, -0.5, 0.25, 1], buttons: [true, false, true] };
    expect(csvRow(frame)).toBe('1700000000000,0,-0.5,0.25,1,1|0|1');
  });

  it('joins the header and rows with newlines', () => {
    const frame = { t: 1, axes: [0, 0, 0, 0], buttons: [false] };
    expect(toCsv([])).toBe('timestamp,lx,ly,rx,ry,buttons');
    expect(toCsv([frame, frame])).toBe('timestamp,lx,ly,rx,ry,buttons\n1,0,0,0,0,0\n1,0,0,0,0,0');
  });
});
