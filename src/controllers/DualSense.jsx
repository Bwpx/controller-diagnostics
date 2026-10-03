import { DPadSplit, FaceButton, Grille, Part, Pill, RoundButton, Stick, Trigger } from './parts.jsx';
import { TopView } from './TopView.jsx';
import { dpadAt, pressedAt, valueAt } from '../lib/buttons.js';

const L2 = 'M134 80 C140 44 178 36 214 38 L230 40 C236 42 236 50 234 66 L214 66 C170 66 146 72 134 82Z';
const R2 = 'M506 80 C500 44 462 36 426 38 L410 40 C404 42 404 50 406 66 L426 66 C470 66 494 72 506 82Z';
const L1 = 'M120 98 C130 76 170 68 214 68 L234 70 L234 86 C192 86 152 92 128 104 Z';
const R1 = 'M520 98 C510 76 470 68 426 68 L406 70 L406 86 C448 86 488 92 512 104 Z';
const BODY =
  'M168 86 C230 74 410 74 472 86 C520 92 548 110 566 150 C590 205 612 280 618 330 C624 380 600 404 568 404 ' +
  'C540 404 520 388 504 360 L478 312 C440 300 400 296 320 296 C240 296 200 300 162 312 L136 360 ' +
  'C120 388 100 404 72 404 C40 404 16 380 22 330 C28 280 50 205 74 150 C92 110 120 92 168 86 Z';
const PLATE =
  'M206 192 C250 186 390 186 434 192 C452 228 466 266 478 312 C440 300 400 296 320 296 C240 296 200 300 162 312 ' +
  'C174 266 188 228 206 192Z';
const TOUCHPAD = 'M228 84 L412 84 Q420 84 420 92 L420 174 Q420 198 396 198 L244 198 Q220 198 220 174 L220 92 Q220 84 228 84Z';

export function DualSenseFront({ buttons, axes, drift }) {
  const pressed = (i) => pressedAt(buttons, i);
  return (
    <svg className="pad pad-front" viewBox="0 0 640 420" role="img" aria-label="DualSense controller, front view">
      <Trigger d={L2} box={[130, 36, 108, 50]} value={valueAt(buttons, 6)} ridges="M160 54 C175 48 195 46 215 46 M152 62 C170 55 192 53 218 53" />
      <Trigger d={R2} box={[402, 36, 108, 50]} value={valueAt(buttons, 7)} ridges="M480 54 C465 48 445 46 425 46 M488 62 C470 55 448 53 422 53" />
      <Part d={L1} pressed={pressed(4)} />
      <Part d={R1} pressed={pressed(5)} />

      <path className="pad-body" d={BODY} />
      <path className="pad-seam" d="M62 196 C48 250 40 300 44 340" />
      <path className="pad-seam" d="M578 196 C592 250 600 300 596 340" />
      <path className="pad-plate" d={PLATE} />

      <Part d={TOUCHPAD} pressed={pressed(17)} />
      <path className="pad-seam" d="M228 90 L412 90" />
      <path className="pad-slit" d="M212 118 L212 176 Q212 204 238 206" />
      <path className="pad-slit" d="M428 118 L428 176 Q428 204 402 206" />
      <Grille x={292} y={210} w={56} h={12} />

      <Pill x={190} y={94} w={11} h={24} rotate={-12} pressed={pressed(8)} icon="M195.5 99 v4 M195.5 105 v4 M195.5 111 v2" />
      <Pill x={439} y={94} w={11} h={24} rotate={12} pressed={pressed(9)} icon="M441.5 101 h6 M441.5 106 h6 M441.5 111 h6" />

      <DPadSplit cx={140} cy={180} pressed={dpadAt(buttons)} />
      <FaceButton cx={500} cy={142} glyph="triangle" pressed={pressed(3)} />
      <FaceButton cx={538} cy={180} glyph="circle" pressed={pressed(1)} />
      <FaceButton cx={500} cy={218} glyph="cross" pressed={pressed(0)} />
      <FaceButton cx={462} cy={180} glyph="square" pressed={pressed(2)} />

      <Stick cx={238} cy={262} x={axes[0]} y={axes[1]} pressed={pressed(10)} drift={drift.left} />
      <Stick cx={402} cy={262} x={axes[2]} y={axes[3]} pressed={pressed(11)} drift={drift.right} />

      <RoundButton cx={320} cy={262} r={12} ring={5} pressed={pressed(16)} />
      <rect className="part" x="309" y="284" width="22" height="7" rx="3.5" />
      <path className="icon" d="M314 287.5 h12" />
    </svg>
  );
}

const TOP = {
  edge: 'M60 108 C60 84 80 72 120 68 L520 68 C560 72 580 84 580 108 Z',
  l2: { x: 128, y: 12, w: 104, h: 44, r: 10 },
  r2: { x: 408, y: 12, w: 104, h: 44, r: 10 },
  l1: { x: 112, y: 58, w: 136, h: 12, r: 6 },
  r1: { x: 392, y: 58, w: 136, h: 12, r: 6 },
  lightbar: { x: 262, y: 73, w: 116, h: 3, r: 1.5 },
  port: { x: 306, y: 84, w: 28, h: 8, r: 4 },
};

export function DualSenseTop({ buttons }) {
  return <TopView label="DualSense controller, top view" layout={TOP} buttons={buttons} names={{ l2: 'L2', r2: 'R2' }} />;
}
