import { DPadCross, FaceButton, Part, Pill, RoundButton, Stick, Trigger } from './parts.jsx';
import { TopView } from './TopView.jsx';
import { dpadAt, pressedAt, valueAt } from '../lib/buttons.js';

const ZL = 'M154 90 C160 56 196 46 230 48 L246 50 C252 52 252 60 250 76 L228 76 C192 76 168 82 154 94 Z';
const ZR = 'M486 90 C480 56 444 46 410 48 L394 50 C388 52 388 60 390 76 L412 76 C448 76 472 82 486 94 Z';
const L = 'M140 110 C150 86 190 76 232 76 L252 78 L252 94 C208 94 170 100 146 116 Z';
const R = 'M500 110 C490 86 450 76 408 76 L388 78 L388 94 C432 94 470 100 494 116 Z';
const BODY =
  'M184 88 C244 76 396 76 456 88 C516 98 548 124 566 170 C588 226 606 290 610 334 C614 380 590 402 560 400 ' +
  'C534 398 516 382 502 354 L482 316 C442 304 400 300 320 300 C240 300 198 304 158 316 L138 354 ' +
  'C124 382 106 398 80 400 C50 402 26 380 30 334 C34 290 52 226 74 170 C92 124 124 98 184 88 Z';

// Face buttons follow Nintendo positions: B bottom (index 0), A right (1), Y left (2), X top (3).
export function SwitchProFront({ buttons, axes, drift }) {
  const pressed = (i) => pressedAt(buttons, i);
  return (
    <svg className="pad pad-front" viewBox="0 0 640 420" role="img" aria-label="Switch Pro controller, front view">
      <Trigger d={ZL} box={[150, 46, 104, 50]} value={valueAt(buttons, 6)} />
      <Trigger d={ZR} box={[386, 46, 104, 50]} value={valueAt(buttons, 7)} />
      <Part d={L} pressed={pressed(4)} />
      <Part d={R} pressed={pressed(5)} />

      <path className="pad-body" d={BODY} />
      <path className="pad-seam" d="M88 210 C74 258 64 312 68 352" />
      <path className="pad-seam" d="M552 210 C566 258 576 312 572 352" />
      {[302, 314, 326, 338].map((x) => (
        <rect key={x} className="pad-led" x={x - 3} y="96" width="6" height="2" rx="1" />
      ))}

      <Pill x={262} y={124} w={20} h={8} r={4} pressed={pressed(8)} icon="M267 128 h10" />
      <Pill x={358} y={120} w={18} h={16} r={4} pressed={pressed(9)} icon="M367 123.5 v9 M362.5 128 h9" />
      <Pill x={270} y={160} w={16} h={16} r={3} pressed={pressed(17)} icon="M274 168 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
      <RoundButton cx={362} cy={168} r={10} pressed={pressed(16)} icon="M357 169 l5 -4.5 l5 4.5 M358.5 168 v5 h7 v-5" />

      <Stick cx={178} cy={174} wellR={40} capR={28} x={axes[0]} y={axes[1]} pressed={pressed(10)} drift={drift.left} />
      <DPadCross cx={240} cy={258} w={22} len={30} pressed={dpadAt(buttons)} />
      <Stick cx={400} cy={258} wellR={40} capR={28} x={axes[2]} y={axes[3]} pressed={pressed(11)} drift={drift.right} />

      <FaceButton cx={466} cy={138} r={17} glyph="X" pressed={pressed(3)} />
      <FaceButton cx={502} cy={174} r={17} glyph="A" pressed={pressed(1)} />
      <FaceButton cx={466} cy={210} r={17} glyph="B" pressed={pressed(0)} />
      <FaceButton cx={430} cy={174} r={17} glyph="Y" pressed={pressed(2)} />
    </svg>
  );
}

const TOP = {
  edge: 'M64 108 C64 86 86 74 128 72 L512 72 C554 74 576 86 576 108 Z',
  l2: { x: 132, y: 14, w: 104, h: 42, r: 12 },
  r2: { x: 404, y: 14, w: 104, h: 42, r: 12 },
  l1: { x: 116, y: 58, w: 136, h: 12, r: 6 },
  r1: { x: 388, y: 58, w: 136, h: 12, r: 6 },
  port: { x: 308, y: 84, w: 24, h: 8, r: 4 },
  details: <circle className="part" cx="348" cy="88" r="3.5" />,
};

export function SwitchProTop({ buttons }) {
  return <TopView label="Switch Pro controller, top view" layout={TOP} buttons={buttons} names={{ l2: 'ZL', r2: 'ZR' }} />;
}
