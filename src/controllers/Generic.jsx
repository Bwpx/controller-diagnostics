import { DPadCross, FaceButton, Part, Pill, RoundButton, Stick, Trigger } from './parts.jsx';
import { TopView } from './TopView.jsx';
import { dpadAt, pressedAt, valueAt } from '../lib/buttons.js';

const L2 = 'M162 92 C168 62 196 54 226 56 L240 58 C246 60 246 68 244 82 L224 82 C194 82 174 86 162 96 Z';
const R2 = 'M478 92 C472 62 444 54 414 56 L400 58 C394 60 394 68 396 82 L416 82 C446 82 466 86 478 96 Z';
const L1 = 'M150 110 C160 92 190 86 228 86 L246 88 L246 100 C210 100 176 104 156 116 Z';
const R1 = 'M490 110 C480 92 450 86 412 86 L394 88 L394 100 C430 100 464 104 484 116 Z';
const BODY =
  'M190 96 C250 86 390 86 450 96 C500 104 528 126 544 166 C564 220 578 286 580 328 C582 372 560 394 532 392 ' +
  'C510 390 494 376 482 352 L464 318 C428 308 390 304 320 304 C250 304 212 308 176 318 L158 352 ' +
  'C146 376 130 390 108 392 C80 394 58 372 60 328 C62 286 76 220 96 166 C112 126 140 104 190 96 Z';

// Brand-free pad for anything detection does not recognize. Face buttons show their standard index.
export function GenericFront({ buttons, axes, drift }) {
  const pressed = (i) => pressedAt(buttons, i);
  return (
    <svg className="pad pad-front" viewBox="0 0 640 420" role="img" aria-label="Generic controller, front view">
      <Trigger d={L2} box={[158, 54, 90, 44]} value={valueAt(buttons, 6)} />
      <Trigger d={R2} box={[392, 54, 90, 44]} value={valueAt(buttons, 7)} />
      <Part d={L1} pressed={pressed(4)} />
      <Part d={R1} pressed={pressed(5)} />

      <path className="pad-body" d={BODY} />
      <path className="pad-seam" d="M104 210 C90 256 82 306 86 344" />
      <path className="pad-seam" d="M536 210 C550 256 558 306 554 344" />

      <DPadCross cx={170} cy={186} w={22} len={30} pressed={dpadAt(buttons)} />
      <FaceButton cx={470} cy={152} r={16} glyph="3" pressed={pressed(3)} />
      <FaceButton cx={504} cy={186} r={16} glyph="1" pressed={pressed(1)} />
      <FaceButton cx={470} cy={220} r={16} glyph="0" pressed={pressed(0)} />
      <FaceButton cx={436} cy={186} r={16} glyph="2" pressed={pressed(2)} />

      <Pill x={270} y={172} w={24} h={10} r={5} pressed={pressed(8)} />
      <Pill x={346} y={172} w={24} h={10} r={5} pressed={pressed(9)} />
      <RoundButton cx={320} cy={222} r={11} pressed={pressed(16)} />

      <Stick cx={250} cy={260} wellR={40} capR={28} x={axes[0]} y={axes[1]} pressed={pressed(10)} drift={drift.left} />
      <Stick cx={390} cy={260} wellR={40} capR={28} x={axes[2]} y={axes[3]} pressed={pressed(11)} drift={drift.right} />
    </svg>
  );
}

const TOP = {
  edge: 'M78 108 C78 88 98 76 140 74 L500 74 C542 76 562 88 562 108 Z',
  l2: { x: 150, y: 18, w: 92, h: 38, r: 10 },
  r2: { x: 398, y: 18, w: 92, h: 38, r: 10 },
  l1: { x: 136, y: 58, w: 120, h: 12, r: 6 },
  r1: { x: 384, y: 58, w: 120, h: 12, r: 6 },
  port: { x: 308, y: 86, w: 24, h: 7, r: 3 },
};

export function GenericTop({ buttons }) {
  return <TopView label="Generic controller, top view" layout={TOP} buttons={buttons} names={{ l2: 'L2', r2: 'R2' }} />;
}
