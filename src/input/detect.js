export const MODEL_IDS = ['dualsense', 'dualshock4', 'xbox-series', 'xbox-one', 'xbox-360', 'switch-pro', 'generic'];

// vendor -> product -> model. Add a row here when a controller reports a new product id.
const BY_ID = {
  '054c': { '0ce6': 'dualsense', '0df2': 'dualsense', '05c4': 'dualshock4', '09cc': 'dualshock4' },
  '045e': {
    '0b12': 'xbox-series', '0b13': 'xbox-series',
    '02d1': 'xbox-one', '02dd': 'xbox-one', '02e0': 'xbox-one', '02ea': 'xbox-one', '02fd': 'xbox-one',
    '028e': 'xbox-360', '028f': 'xbox-360', '0719': 'xbox-360',
  },
  '057e': { '2009': 'switch-pro' },
};

// Used when a browser reports no ids (Safari) or an id that is not in BY_ID yet.
const BY_NAME = [
  [/dualsense/i, 'dualsense'],
  [/dualshock/i, 'dualshock4'],
  [/xbox 360/i, 'xbox-360'],
  [/xbox one/i, 'xbox-one'],
  [/xbox/i, 'xbox-series'],
  [/pro controller/i, 'switch-pro'],
];

// Chromium: "Name (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)". Firefox: "054c-0ce6-Name".
const CHROMIUM_IDS = /Vendor:\s*([0-9a-f]{4})\s+Product:\s*([0-9a-f]{4})/i;
const FIREFOX_IDS = /^([0-9a-f]{1,4})-([0-9a-f]{1,4})-(.*)$/i;

const hex4 = (s) => s.toLowerCase().padStart(4, '0');

export function describeDevice(id) {
  const text = typeof id === 'string' ? id.trim() : '';
  const firefox = FIREFOX_IDS.exec(text);
  if (firefox) return { name: firefox[3].trim(), vendor: hex4(firefox[1]), product: hex4(firefox[2]) };
  const chromium = CHROMIUM_IDS.exec(text);
  return {
    name: text.replace(/\s*\([^)]*\)\s*$/, '').trim(),
    vendor: chromium ? hex4(chromium[1]) : null,
    product: chromium ? hex4(chromium[2]) : null,
  };
}

export function detect(id) {
  if (typeof id !== 'string' || id.trim() === '') return { model: 'generic', xinput: false };
  // Windows XInput reports every Xbox pad as "Xbox 360 Controller", so only the family is known.
  if (/xinput/i.test(id)) return { model: 'xbox-series', xinput: true };
  const { name, vendor, product } = describeDevice(id);
  const byId = vendor && BY_ID[vendor]?.[product];
  if (byId) return { model: byId, xinput: false };
  const byName = BY_NAME.find(([pattern]) => pattern.test(name));
  return { model: byName ? byName[1] : 'generic', xinput: false };
}
