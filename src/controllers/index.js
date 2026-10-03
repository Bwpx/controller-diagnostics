import { NAMES } from './names.js';
import { DualSenseFront, DualSenseTop } from './DualSense.jsx';
import './controllers.css';

const shouldersFrom = (names) => ({ l1: names[4], r1: names[5], l2: names[6], r2: names[7] });

const drawings = { Front: DualSenseFront, Top: DualSenseTop };

// Selector order. `platform` picks the stage color and texture.
export const MODELS = [
  { id: 'dualsense', name: 'DualSense (PS5)', platform: 'playstation', buttonNames: NAMES.dualsense, ...drawings },
  { id: 'dualshock4', name: 'DualShock 4 (PS4)', platform: 'playstation', buttonNames: NAMES.dualshock4, ...drawings },
  { id: 'xbox-series', name: 'Xbox Series', platform: 'xbox', buttonNames: NAMES.xboxModern, ...drawings },
  { id: 'xbox-one', name: 'Xbox One', platform: 'xbox', buttonNames: NAMES.xboxModern, ...drawings },
  { id: 'xbox-360', name: 'Xbox 360', platform: 'xbox', buttonNames: NAMES.xbox360, ...drawings },
  { id: 'switch-pro', name: 'Switch Pro', platform: 'nintendo', buttonNames: NAMES.switchPro, ...drawings },
  {
    id: 'generic',
    name: 'Generic',
    platform: 'generic',
    buttonNames: NAMES.generic,
    // Numbered names are too long for frame titles, so the generic pad uses positional ones.
    shoulders: { l1: 'L1', r1: 'R1', l2: 'L2', r2: 'R2' },
    ...drawings,
  },
].map((model) => ({ shoulders: shouldersFrom(model.buttonNames), ...model }));

const BY_ID = Object.fromEntries(MODELS.map((model) => [model.id, model]));

export const isModelId = (id) => typeof id === 'string' && Object.hasOwn(BY_ID, id);

export const getModel = (id) => BY_ID[id] ?? BY_ID.generic;
