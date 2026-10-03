// Returns the first connected pad in any slot. The old code only looked at slot 0.
export function realSource(nav = globalThis.navigator) {
  return () => {
    const pads = typeof nav?.getGamepads === 'function' ? nav.getGamepads() : [];
    for (const pad of pads ?? []) {
      if (pad && pad.connected !== false) return pad;
    }
    return null;
  };
}

// Ids in the format Chromium reports, so demo mode exercises detection too.
export const DEMO_IDS = {
  dualsense: 'DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)',
  dualshock4: 'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)',
  'xbox-series': 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)',
  'xbox-one': 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 02ea)',
  'xbox-360': 'Xbox 360 Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)',
  'switch-pro': 'Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)',
  generic: 'USB Gamepad (STANDARD GAMEPAD Vendor: 0079 Product: 0006)',
  xinput: 'Xbox 360 Controller (XInput STANDARD GAMEPAD)',
};

const CYCLE = 12; // seconds per loop
const ACTIVE = 8; // the rest of each loop idles with a drifting left stick
const STEP = 0.4; // seconds each button stays held
const PRESS_ORDER = [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]; // 6 and 7 are the analog triggers

const button = (pressed, value = Number(pressed)) => ({ pressed, value, touched: pressed });

// A scripted fake controller (`?demo=<model>`) so every drawing can be checked without the hardware.
export function demoSource(model = 'dualsense', clock = () => performance.now()) {
  const id = DEMO_IDS[model] ?? DEMO_IDS.dualsense;
  const count = ['dualsense', 'dualshock4', 'switch-pro'].includes(model) ? 18 : 17;
  const order = PRESS_ORDER.filter((i) => i < count);
  const start = clock();

  return () => {
    const t = ((clock() - start) / 1000) % CYCLE;
    let axes;
    let held = -1;
    let l2 = 0;
    let r2 = 0;
    if (t < ACTIVE) {
      const turn = (t / 2) * Math.PI * 2;
      axes = [
        0.9 * Math.cos(turn),
        0.9 * Math.sin(turn),
        0.85 * Math.sin((t / 3) * Math.PI * 2),
        0.6 * Math.sin((t / 1.5) * Math.PI * 2),
      ];
      l2 = (1 - Math.cos((t / 2.5) * Math.PI * 2)) / 2;
      r2 = (1 - Math.cos((t / 3.5) * Math.PI * 2)) / 2;
      held = order[Math.floor(t / STEP) % order.length];
    } else {
      axes = [0.072 + 0.004 * Math.sin(t * 9), -0.056, 0.012, -0.008];
    }
    const buttons = Array.from({ length: count }, (_, i) => {
      if (i === 6) return button(l2 > 0.1, l2);
      if (i === 7) return button(r2 > 0.1, r2);
      return button(i === held);
    });
    return { id, mapping: 'standard', connected: true, timestamp: clock(), axes, buttons };
  };
}
