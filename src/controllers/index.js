import { NAMES } from './names.js';
import { DualSenseFront, DualSenseTop } from './DualSense.jsx';
import { DualShock4Front, DualShock4Top } from './DualShock4.jsx';
import { XboxOneFront, XboxOneTop, XboxSeriesFront, XboxSeriesTop } from './Xbox.jsx';
import { Xbox360Front, Xbox360Top } from './Xbox360.jsx';
import { SwitchProFront, SwitchProTop } from './SwitchPro.jsx';
import { GenericFront, GenericTop } from './Generic.jsx';
import './controllers.css';

const shouldersFrom = (names) => ({ l1: names[4], r1: names[5], l2: names[6], r2: names[7] });

// Selector order. `platform` picks the stage color and texture.
export const MODELS = [
  {
    id: 'dualsense',
    name: 'DualSense (PS5)',
    platform: 'playstation',
    buttonNames: NAMES.dualsense,
    Front: DualSenseFront,
    Top: DualSenseTop,
  },
  {
    id: 'dualshock4',
    name: 'DualShock 4 (PS4)',
    platform: 'playstation',
    buttonNames: NAMES.dualshock4,
    Front: DualShock4Front,
    Top: DualShock4Top,
  },
  {
    id: 'xbox-series',
    name: 'Xbox Series',
    platform: 'xbox',
    buttonNames: NAMES.xboxModern,
    Front: XboxSeriesFront,
    Top: XboxSeriesTop,
  },
  {
    id: 'xbox-one',
    name: 'Xbox One',
    platform: 'xbox',
    buttonNames: NAMES.xboxModern,
    Front: XboxOneFront,
    Top: XboxOneTop,
  },
  {
    id: 'xbox-360',
    name: 'Xbox 360',
    platform: 'xbox',
    buttonNames: NAMES.xbox360,
    Front: Xbox360Front,
    Top: Xbox360Top,
  },
  {
    id: 'switch-pro',
    name: 'Switch Pro',
    platform: 'nintendo',
    buttonNames: NAMES.switchPro,
    Front: SwitchProFront,
    Top: SwitchProTop,
  },
  {
    id: 'generic',
    name: 'Generic',
    platform: 'generic',
    buttonNames: NAMES.generic,
    // Numbered names are too long for frame titles, so the generic pad uses positional ones.
    shoulders: { l1: 'L1', r1: 'R1', l2: 'L2', r2: 'R2' },
    Front: GenericFront,
    Top: GenericTop,
  },
].map((model) => ({ shoulders: shouldersFrom(model.buttonNames), ...model }));

const BY_ID = Object.fromEntries(MODELS.map((model) => [model.id, model]));

export const isModelId = (id) => typeof id === 'string' && Object.hasOwn(BY_ID, id);

export const getModel = (id) => BY_ID[id] ?? BY_ID.generic;
