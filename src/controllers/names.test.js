import { describe, it, expect } from 'vitest';
import { NAMES } from './names.js';

describe('button names', () => {
  it('names the bottom face button the way each controller labels it', () => {
    expect(NAMES.dualsense[0]).toBe('Cross');
    expect(NAMES.xboxModern[0]).toBe('A');
    expect(NAMES.switchPro[0]).toBe('B');
    expect(NAMES.generic[0]).toBe('Button 0');
  });

  it('uses each controller’s name for the left menu button', () => {
    expect(NAMES.dualsense[8]).toBe('Create');
    expect(NAMES.dualshock4[8]).toBe('Share');
    expect(NAMES.xboxModern[8]).toBe('View');
    expect(NAMES.xbox360[8]).toBe('Back');
    expect(NAMES.switchPro[8]).toBe('−');
  });

  it('names the shoulder buttons at standard indices 4-7', () => {
    expect(NAMES.dualsense.slice(4, 8)).toEqual(['L1', 'R1', 'L2', 'R2']);
    expect(NAMES.xboxModern.slice(4, 8)).toEqual(['LB', 'RB', 'LT', 'RT']);
    expect(NAMES.switchPro.slice(4, 8)).toEqual(['L', 'R', 'ZL', 'ZR']);
  });

  it('covers at least the 17 standard buttons for every controller', () => {
    Object.values(NAMES).forEach((list) => expect(list.length).toBeGreaterThanOrEqual(17));
  });
});
