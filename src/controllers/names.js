// Button names by W3C standard-mapping index (0-16, plus 17 where the controller reports it).
const DPAD = ['D-pad up', 'D-pad down', 'D-pad left', 'D-pad right'];

export const NAMES = {
  dualsense: ['Cross', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', 'Create', 'Options', 'L3', 'R3', ...DPAD, 'PS', 'Touchpad'],
  dualshock4: ['Cross', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', 'Share', 'Options', 'L3', 'R3', ...DPAD, 'PS', 'Touchpad'],
  xboxModern: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'View', 'Menu', 'LS', 'RS', ...DPAD, 'Xbox'],
  xbox360: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'LS', 'RS', ...DPAD, 'Guide'],
  // Nintendo positions: B is the bottom button, so it sits at index 0.
  switchPro: ['B', 'A', 'Y', 'X', 'L', 'R', 'ZL', 'ZR', '−', '+', 'L-stick', 'R-stick', ...DPAD, 'Home', 'Capture'],
  generic: Array.from({ length: 18 }, (_, i) => `Button ${i}`),
};
