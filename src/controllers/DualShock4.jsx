import { DPadSplit, FaceButton, Grille, Part, Pill, RoundButton, Stick, Trigger } from './parts.jsx';
import { TopView } from './TopView.jsx';
import { dpadAt, pressedAt, valueAt } from '../lib/buttons.js';

const L2 = 'M152 86 C158 54 190 46 222 48 L236 50 C242 52 242 60 240 76 L220 76 C186 76 164 80 152 90 Z';
const R2 = 'M488 86 C482 54 450 46 418 48 L404 50 C398 52 398 60 400 76 L420 76 C454 76 476 80 488 90 Z';
const L1 = 'M140 104 C150 84 182 78 224 78 L242 80 L242 94 C202 94 166 98 146 110 Z';
const R1 = 'M500 104 C490 84 458 78 416 78 L398 80 L398 94 C438 94 474 98 494 110 Z';
const BODY =
  'M176 92 C240 80 400 80 464 92 C512 98 540 112 556 148 C580 204 600 276 604 326 C608 372 586 396 556 396 ' +
  'C530 396 512 382 498 356 L474 314 C436 302 400 298 320 298 C240 298 204 302 166 314 L142 356 ' +
  'C128 382 110 396 84 396 C54 396 32 372 36 326 C40 276 60 204 84 148 C100 112 128 98 176 92 Z';
const TOUCHPAD = 'M244 92 L396 92 Q406 92 405 102 L401 168 Q400 180 388 180 L252 180 Q240 180 239 168 L235 102 Q234 92 244 92 Z';

export function DualShock4Front({ buttons, axes, drift }) {
  const pressed = (i) => pressedAt(buttons, i);
  return (
    <svg className="pad pad-front" viewBox="0 0 640 420" role="img" aria-label="DualShock 4 controller, front view">
      <Trigger d={L2} box={[148, 46, 96, 46]} value={valueAt(buttons, 6)} ridges="M170 62 C184 57 202 56 222 56 M164 70 C180 64 202 63 226 63" />
      <Trigger d={R2} box={[396, 46, 96, 46]} value={valueAt(buttons, 7)} ridges="M470 62 C456 57 438 56 418 56 M476 70 C460 64 438 63 414 63" />
      <Part d={L1} pressed={pressed(4)} />
      <Part d={R1} pressed={pressed(5)} />

      <path className="pad-body" d={BODY} />
      <path className="pad-seam" d="M70 200 C58 250 52 300 56 338" />
      <path className="pad-seam" d="M570 200 C582 250 588 300 584 338" />

      <Part d={TOUCHPAD} pressed={pressed(17)} />
      <path className="pad-slit" d="M252 88 L388 88" />
      <Grille x={298} y={190} w={44} h={10} />
      <Pill x={212} y={98} w={9} h={20} rotate={-18} pressed={pressed(8)} />
      <Pill x={419} y={98} w={9} h={20} rotate={18} pressed={pressed(9)} />

      <circle className="pad-recess" cx="146" cy="182" r="50" />
      <DPadSplit cx={146} cy={182} w={22} len={30} gap={5} pressed={dpadAt(buttons)} />
      <circle className="pad-recess" cx="494" cy="182" r="50" />
      <FaceButton cx={494} cy={147} r={16} glyph="triangle" pressed={pressed(3)} />
      <FaceButton cx={529} cy={182} r={16} glyph="circle" pressed={pressed(1)} />
      <FaceButton cx={494} cy={217} r={16} glyph="cross" pressed={pressed(0)} />
      <FaceButton cx={459} cy={182} r={16} glyph="square" pressed={pressed(2)} />

      <Stick cx={246} cy={262} wellR={40} capR={28} x={axes[0]} y={axes[1]} pressed={pressed(10)} drift={drift.left} />
      <Stick cx={394} cy={262} wellR={40} capR={28} x={axes[2]} y={axes[3]} pressed={pressed(11)} drift={drift.right} />
      <RoundButton cx={320} cy={258} r={11} ring={4.5} pressed={pressed(16)} />
    </svg>
  );
}

const TOP = {
  edge: 'M66 108 C66 86 86 74 128 72 L512 72 C554 74 574 86 574 108 Z',
  l2: { x: 136, y: 16, w: 96, h: 40, r: 10 },
  r2: { x: 408, y: 16, w: 96, h: 40, r: 10 },
  l1: { x: 122, y: 58, w: 124, h: 12, r: 6 },
  r1: { x: 394, y: 58, w: 124, h: 12, r: 6 },
  // The DualShock 4 light bar runs along the top front edge.
  lightbar: { x: 234, y: 74, w: 172, h: 6, r: 3 },
  port: { x: 309, y: 87, w: 22, h: 6, r: 2 },
};

export function DualShock4Top({ buttons }) {
  return <TopView label="DualShock 4 controller, top view" layout={TOP} buttons={buttons} names={{ l2: 'L2', r2: 'R2' }} />;
}
