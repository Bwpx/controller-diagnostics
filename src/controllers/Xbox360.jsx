import { DPadCross, FaceButton, Part, Pill, RoundButton, Stick, Trigger } from './parts.jsx';
import { TopView } from './TopView.jsx';
import { dpadAt, pressedAt, valueAt } from '../lib/buttons.js';

const LT = 'M146 92 C150 52 190 40 230 42 L250 46 C256 48 256 58 254 78 L232 78 C196 78 168 82 146 96 Z';
const RT = 'M494 92 C490 52 450 40 410 42 L390 46 C384 48 384 58 386 78 L408 78 C444 78 472 82 494 96 Z';
const LB = 'M130 114 C140 88 184 78 232 78 L256 80 L256 96 C210 96 168 102 136 120 Z';
const RB = 'M510 114 C500 88 456 78 408 78 L384 80 L384 96 C430 96 472 102 504 120 Z';
const BODY =
  'M170 92 C236 74 404 74 470 92 C528 104 556 134 572 176 C592 230 610 296 612 338 C614 382 590 402 560 400 ' +
  'C536 398 518 382 504 354 L484 316 C444 306 400 304 320 304 C240 304 196 306 156 316 L136 354 ' +
  'C122 382 104 398 80 400 C50 402 26 382 28 338 C30 296 48 230 68 176 C84 134 112 104 170 92 Z';

export function Xbox360Front({ buttons, axes, drift }) {
  const pressed = (i) => pressedAt(buttons, i);
  return (
    <svg className="pad pad-front" viewBox="0 0 640 420" role="img" aria-label="Xbox 360 controller, front view">
      <Trigger d={LT} box={[142, 40, 116, 58]} value={valueAt(buttons, 6)} ridges="M168 62 C184 56 206 54 232 54 M160 72 C178 65 204 63 236 63" />
      <Trigger d={RT} box={[382, 40, 116, 58]} value={valueAt(buttons, 7)} ridges="M472 62 C456 56 434 54 408 54 M480 72 C462 65 436 63 404 63" />
      <Part d={LB} pressed={pressed(4)} />
      <Part d={RB} pressed={pressed(5)} />

      <path className="pad-body" d={BODY} />
      <path className="pad-seam" d="M96 220 C80 268 70 320 74 358" />
      <path className="pad-seam" d="M544 220 C560 268 570 320 566 358" />

      {/* Guide button with the four-segment player ring. */}
      <circle className="pad-ring" cx="320" cy="130" r="27" transform="rotate(-37 320 130)" />
      <RoundButton cx={320} cy={130} r={21} ring={13} pressed={pressed(16)} />
      <Pill x={252} y={162} w={22} h={12} r={6} pressed={pressed(8)} icon="M259 168 l7 -4 v8 Z" iconFill />
      <Pill x={366} y={162} w={22} h={12} r={6} pressed={pressed(9)} icon="M381 168 l-7 -4 v8 Z" iconFill />

      <Stick cx={166} cy={178} wellR={42} capR={29} x={axes[0]} y={axes[1]} pressed={pressed(10)} drift={drift.left} />
      <DPadCross cx={238} cy={258} w={18} len={26} dish={32} pressed={dpadAt(buttons)} />
      <Stick cx={402} cy={258} wellR={42} capR={29} x={axes[2]} y={axes[3]} pressed={pressed(11)} drift={drift.right} />

      <FaceButton cx={478} cy={141} r={18} glyph="Y" pressed={pressed(3)} />
      <FaceButton cx={515} cy={178} r={18} glyph="B" pressed={pressed(1)} />
      <FaceButton cx={478} cy={215} r={18} glyph="A" pressed={pressed(0)} />
      <FaceButton cx={441} cy={178} r={18} glyph="X" pressed={pressed(2)} />

      <rect className="pad-port" x="306" y="296" width="28" height="6" rx="2" />
    </svg>
  );
}

const TOP = {
  edge: 'M52 108 C52 86 76 74 122 72 L518 72 C564 74 588 86 588 108 Z',
  l2: { x: 124, y: 8, w: 116, h: 48, r: 14 },
  r2: { x: 400, y: 8, w: 116, h: 48, r: 14 },
  l1: { x: 108, y: 58, w: 148, h: 12, r: 6 },
  r1: { x: 384, y: 58, w: 148, h: 12, r: 6 },
  // Connect button and the plug-in charge port between the bumpers.
  details: (
    <>
      <circle className="part" cx="298" cy="88" r="5" />
      <rect className="pad-port" x="316" y="84" width="26" height="8" rx="2" />
    </>
  ),
};

export function Xbox360Top({ buttons }) {
  return <TopView label="Xbox 360 controller, top view" layout={TOP} buttons={buttons} names={{ l2: 'LT', r2: 'RT' }} />;
}
