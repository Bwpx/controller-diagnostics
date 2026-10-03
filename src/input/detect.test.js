import { describe, it, expect } from 'vitest';
import { detect, describeDevice } from './detect.js';

const chromium = (name, vendor, product) =>
  `${name} (STANDARD GAMEPAD Vendor: ${vendor} Product: ${product})`;

describe('detect', () => {
  it.each([
    [chromium('DualSense Wireless Controller', '054c', '0ce6'), 'dualsense'],
    [chromium('DualSense Edge Wireless Controller', '054c', '0df2'), 'dualsense'],
    [chromium('Wireless Controller', '054c', '09cc'), 'dualshock4'],
    [chromium('Wireless Controller', '054c', '05c4'), 'dualshock4'],
    [chromium('Xbox Wireless Controller', '045e', '0b13'), 'xbox-series'],
    [chromium('Xbox Wireless Controller', '045e', '0b12'), 'xbox-series'],
    [chromium('Xbox Wireless Controller', '045e', '02ea'), 'xbox-one'],
    [chromium('Xbox 360 Controller', '045e', '028e'), 'xbox-360'],
    [chromium('Pro Controller', '057e', '2009'), 'switch-pro'],
  ])('maps %s to %s', (id, model) => {
    expect(detect(id)).toEqual({ model, xinput: false });
  });

  it('treats XInput pads as the Xbox family, defaulting to Series', () => {
    expect(detect('Xbox 360 Controller (XInput STANDARD GAMEPAD)')).toEqual({ model: 'xbox-series', xinput: true });
  });

  it('reads Firefox-style ids', () => {
    expect(detect('054c-0ce6-DualSense Wireless Controller').model).toBe('dualsense');
  });

  it('ignores hex case', () => {
    expect(detect(chromium('DualSense', '054C', '0CE6')).model).toBe('dualsense');
  });

  it('falls back to the device name when the ids are missing or unknown', () => {
    expect(detect('DualSense Wireless Controller').model).toBe('dualsense');
    expect(detect('Pro Controller').model).toBe('switch-pro');
    expect(detect(chromium('Xbox Wireless Controller', '045e', '0b22')).model).toBe('xbox-series');
  });

  it('returns generic for unknown or malformed ids', () => {
    expect(detect(chromium('8BitDo Pro 2', '2dc8', '6006')).model).toBe('generic');
    expect(detect('').model).toBe('generic');
    expect(detect(undefined).model).toBe('generic');
  });
});

describe('describeDevice', () => {
  it('splits a Chromium id into name and ids', () => {
    expect(describeDevice(chromium('DualSense Wireless Controller', '054c', '0ce6')))
      .toEqual({ name: 'DualSense Wireless Controller', vendor: '054c', product: '0ce6' });
  });

  it('splits a Firefox id', () => {
    expect(describeDevice('054c-0ce6-DualSense Wireless Controller'))
      .toEqual({ name: 'DualSense Wireless Controller', vendor: '054c', product: '0ce6' });
  });

  it('keeps just the name when there are no ids', () => {
    expect(describeDevice('Xbox 360 Controller (XInput STANDARD GAMEPAD)'))
      .toEqual({ name: 'Xbox 360 Controller', vendor: null, product: null });
  });
});
