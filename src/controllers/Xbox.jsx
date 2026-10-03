import { DPadCross, FaceButton, Part, Pill, RoundButton, Stick, Trigger } from './parts.jsx';
import { TopView } from './TopView.jsx';
import { dpadAt, pressedAt, valueAt } from '../lib/buttons.js';

// Xbox Series and Xbox One share a body; the Series adds the Share button, the dish D-pad and USB-C.
const LT = 'M150 88 C156 50 196 40 232 42 L248 44 C254 46 254 54 252 72 L230 72 C192 72 168 78 150 92 Z';
const RT = 'M490 88 C484 50 444 40 408 42 L392 44 C386 46 386 54 388 72 L410 72 C448 72 472 78 490 92 Z';
const LB = 'M134 110 C144 84 186 74 232 74 L254 76 L254 92 C208 92 168 98 140 116 Z';
const RB = 'M506 110 C496 84 454 74 408 74 L386 76 L386 92 C432 92 472 98 500 116 Z';
const BODY =
  'M178 84 C240 72 400 72 462 84 C524 92 556 120 576 168 C598 222 616 290 620 334 C624 382 598 404 566 402 ' +
  'C540 400 522 384 506 356 L486 318 C446 306 400 302 320 302 C240 302 194 306 154 318 L134 356 ' +
  'C118 384 100 400 74 402 C42 404 16 382 20 334 C24 290 42 222 64 168 C84 120 116 92 178 84 Z';

function XboxFront({ variant, buttons, axes, drift }) {
  const pressed = (i) => pressedAt(buttons, i);
  const series = variant === 'series';
  return (
    <svg className="pad pad-front" viewBox="0 0 640 420" role="img" aria-label={`Xbox ${series ? 'Series' : 'One'} controller, front view`}>
      <Trigger d={LT} box={[146, 40, 110, 54]} value={valueAt(buttons, 6)} ridges="M170 60 C186 54 206 52 228 52 M162 68 C180 62 204 60 230 60" />
      <Trigger d={RT} box={[384, 40, 110, 54]} value={valueAt(buttons, 7)} ridges="M470 60 C454 54 434 52 412 52 M478 68 C460 62 436 60 410 60" />
      <Part d={LB} pressed={pressed(4)} />
      <Part d={RB} pressed={pressed(5)} />

      <path className="pad-body" d={BODY} />
      <path className="pad-seam" d="M92 214 C76 262 66 318 70 360" />
      <path className="pad-seam" d="M548 214 C564 262 574 318 570 360" />
      {!series && <path className="pad-plate" d="M262 94 C296 86 344 86 378 94 L370 138 C346 132 294 132 270 138 Z" />}

      <RoundButton cx={320} cy={114} r={19} ring={11} pressed={pressed(16)} />
      <RoundButton cx={272} cy={168} r={9} pressed={pressed(8)} icon="M267.5 164.5 h6 v5 h-6 Z M270.5 167.5 h6 v5 h-6" />
      <RoundButton cx={368} cy={168} r={9} pressed={pressed(9)} icon="M364 165 h8 M364 168 h8 M364 171 h8" />
      {series && <Pill x={309} y={190} w={22} h={10} r={5} icon="M320 192.5 v5 M317.5 195 l2.5 -2.5 l2.5 2.5" />}

      <Stick cx={166} cy={172} wellR={42} capR={29} x={axes[0]} y={axes[1]} pressed={pressed(10)} drift={drift.left} />
      <DPadCross cx={242} cy={256} w={22} len={30} dish={series ? 36 : 0} pressed={dpadAt(buttons)} />
      <Stick cx={400} cy={256} wellR={42} capR={29} x={axes[2]} y={axes[3]} pressed={pressed(11)} drift={drift.right} />

      <FaceButton cx={478} cy={136} r={17} glyph="Y" pressed={pressed(3)} />
      <FaceButton cx={514} cy={172} r={17} glyph="B" pressed={pressed(1)} />
      <FaceButton cx={478} cy={208} r={17} glyph="A" pressed={pressed(0)} />
      <FaceButton cx={442} cy={172} r={17} glyph="X" pressed={pressed(2)} />

      <rect className="pad-port" x="304" y="294" width="32" height="5" rx="2" />
    </svg>
  );
}

const topLayout = (series) => ({
  edge: 'M56 108 C56 84 78 72 122 70 L518 70 C562 72 584 84 584 108 Z',
  l2: { x: 126, y: 10, w: 110, h: 46, r: 12 },
  r2: { x: 404, y: 10, w: 110, h: 46, r: 12 },
  l1: { x: 110, y: 58, w: 142, h: 12, r: 6 },
  r1: { x: 388, y: 58, w: 142, h: 12, r: 6 },
  // USB-C on the Series, micro-USB on the One.
  port: series ? { x: 306, y: 82, w: 28, h: 8, r: 4 } : { x: 309, y: 83, w: 22, h: 6, r: 2 },
  details: <circle className="part" cx="356" cy="86" r="4" />,
});

const SERIES_TOP = topLayout(true);
const ONE_TOP = topLayout(false);
const TRIGGER_NAMES = { l2: 'LT', r2: 'RT' };

export function XboxSeriesFront(props) {
  return <XboxFront variant="series" {...props} />;
}

export function XboxSeriesTop({ buttons }) {
  return <TopView label="Xbox Series controller, top view" layout={SERIES_TOP} buttons={buttons} names={TRIGGER_NAMES} />;
}

export function XboxOneFront(props) {
  return <XboxFront variant="one" {...props} />;
}

export function XboxOneTop({ buttons }) {
  return <TopView label="Xbox One controller, top view" layout={ONE_TOP} buttons={buttons} names={TRIGGER_NAMES} />;
}
