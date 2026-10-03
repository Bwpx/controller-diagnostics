// Shared SVG building blocks for the controller drawings.
// Pressed parts get the `is-pressed` class; all colors live in controllers.css.
import { cls } from '../lib/cls.js';
import { useSvgId } from '../lib/useSvgId.js';

const unit = (v) => Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));

// Any button-shaped element that turns light while pressed.
export function Part({ as = 'path', pressed = false, className, ...shape }) {
  const Tag = as;
  return <Tag className={cls('part', pressed && 'is-pressed', className)} {...shape} />;
}

// Analog trigger seen from the front: the shape fills up from its base in proportion to the value.
export function Trigger({ d, box, value, ridges }) {
  const clipId = useSvgId('trigger');
  const v = unit(value);
  const [x, y, w, h] = box;
  return (
    <g>
      <clipPath id={clipId}>
        <path d={d} />
      </clipPath>
      <path className="part" d={d} />
      {v > 0 && (
        <rect className="trigger-fill" clipPath={`url(#${clipId})`} x={x} y={y + h * (1 - v)} width={w} height={h * v} />
      )}
      {ridges && <path className="trigger-ridges" d={ridges} />}
      <path className="part-outline" d={d} />
    </g>
  );
}

// Thumbstick: the cap moves inside its well; full tilt puts the cap's edge on the well's edge.
export function Stick({ cx, cy, wellR = 44, capR = 30, x = 0, y = 0, pressed = false, drift = false }) {
  let dx = Number.isFinite(x) ? x : 0;
  let dy = Number.isFinite(y) ? y : 0;
  const tilt = Math.hypot(dx, dy);
  if (tilt > 1) {
    dx /= tilt;
    dy /= tilt;
  }
  const px = cx + dx * (wellR - capR);
  const py = cy + dy * (wellR - capR);
  return (
    <g className={cls('stick', pressed && 'is-pressed', drift && 'is-drift')}>
      <circle className="stick-well" cx={cx} cy={cy} r={wellR} />
      <circle className="stick-well-ring" cx={cx} cy={cy} r={wellR - 6} />
      <line className="stick-link" x1={cx} y1={cy} x2={px} y2={py} />
      <circle className="stick-cap" cx={px} cy={py} r={capR} />
      <circle className="stick-grip" cx={px} cy={py} r={capR - 3} />
      <circle className="stick-top" cx={px} cy={py} r={capR * 0.66} />
      <circle className="stick-dish" cx={px} cy={py} r={capR * 0.43} />
    </g>
  );
}

function Glyph({ kind, cx, cy, r }) {
  const s = r * 0.42;
  if (kind === 'triangle') {
    return <path className="glyph" d={`M${cx} ${cy - s} L${cx + s * 0.95} ${cy + s * 0.65} L${cx - s * 0.95} ${cy + s * 0.65} Z`} />;
  }
  if (kind === 'circle') return <circle className="glyph" cx={cx} cy={cy} r={s * 0.88} />;
  if (kind === 'cross') {
    const c = s * 0.72;
    return <path className="glyph" d={`M${cx - c} ${cy - c} L${cx + c} ${cy + c} M${cx + c} ${cy - c} L${cx - c} ${cy + c}`} />;
  }
  if (kind === 'square') {
    const q = s * 0.72;
    return <rect className="glyph" x={cx - q} y={cy - q} width={q * 2} height={q * 2} rx="1" />;
  }
  return (
    <text className="glyph-text" x={cx} y={cy} dy="0.36em" textAnchor="middle" fontSize={r * 0.82}>
      {kind}
    </text>
  );
}

// Face button with a beveled rim and a symbol (△ ○ ✕ □) or a letter/number label.
export function FaceButton({ cx, cy, r = 18, glyph, pressed = false }) {
  return (
    <g className={cls('face', pressed && 'is-pressed')}>
      <circle className="face-body" cx={cx} cy={cy} r={r} />
      <circle className="face-bevel" cx={cx} cy={cy} r={r - 3} />
      <Glyph kind={glyph} cx={cx} cy={cy} r={r} />
    </g>
  );
}

const DIRECTIONS = [
  ['up', 0],
  ['right', 90],
  ['down', 180],
  ['left', 270],
];

// PlayStation-style D-pad: four separate arms that point at the center, each with an arrow.
export function DPadSplit({ cx, cy, w = 24, len = 34, gap = 6, pressed }) {
  const top = cy - gap - len;
  const arm = `M${cx - w / 2} ${top} h${w} v${len - w / 2} L${cx} ${cy - gap} L${cx - w / 2} ${cy - gap - w / 2} Z`;
  const arrow = `M${cx - 4} ${top + 13} l4 -6 l4 6 Z`;
  return (
    <g>
      {DIRECTIONS.map(([dir, angle]) => (
        <g key={dir} className={cls('dpad-arm', pressed[dir] && 'is-pressed')} transform={`rotate(${angle} ${cx} ${cy})`}>
          <path className="part" d={arm} />
          <path className="dpad-arrow" d={arrow} />
        </g>
      ))}
    </g>
  );
}

// One-piece cross D-pad (Xbox, Switch, generic). `dish` draws the round base of the Xbox Series hybrid pad.
export function DPadCross({ cx, cy, w = 22, len = 32, pressed, dish = 0 }) {
  const h = w / 2;
  const arm = len - h;
  const plus =
    `M${cx - h} ${cy - len} h${w} v${arm} h${arm} v${w} h${-arm} v${arm} h${-w} v${-arm} h${-arm} v${-w} h${arm} Z`;
  const arrow = `M${cx - 4} ${cy - len + 13} l4 -6 l4 6 Z`;
  return (
    <g>
      {dish > 0 && <circle className="pad-recess" cx={cx} cy={cy} r={dish} />}
      <path className="part dpad-plus" d={plus} />
      {DIRECTIONS.map(([dir, angle]) => (
        <g key={dir} className={cls('dpad-arm', pressed[dir] && 'is-pressed')} transform={`rotate(${angle} ${cx} ${cy})`}>
          {pressed[dir] && <rect className="dpad-hit" x={cx - h + 1} y={cy - len + 1} width={w - 2} height={arm - 1} rx="2" />}
          <path className="dpad-arrow" d={arrow} />
        </g>
      ))}
      <circle className="pad-recess" cx={cx} cy={cy} r={h * 0.55} />
    </g>
  );
}

// Small rounded button (Create, Options, View, −, …), optionally rotated, with an icon.
export function Pill({ x, y, w, h, r, rotate = 0, pressed = false, icon, iconFill = false }) {
  const transform = rotate ? `rotate(${rotate} ${x + w / 2} ${y + h / 2})` : undefined;
  return (
    <g className={cls('small', pressed && 'is-pressed')} transform={transform}>
      <rect className="part" x={x} y={y} width={w} height={h} rx={r ?? Math.min(w, h) / 2} />
      {icon && <path className={iconFill ? 'icon-fill' : 'icon'} d={icon} />}
    </g>
  );
}

// Small round button (PS, Xbox, Home, …) with an optional inner ring or icon.
export function RoundButton({ cx, cy, r, pressed = false, ring, icon, iconFill = false }) {
  return (
    <g className={cls('small', pressed && 'is-pressed')}>
      <circle className="part" cx={cx} cy={cy} r={r} />
      {ring && <circle className="icon" cx={cx} cy={cy} r={ring} />}
      {icon && <path className={iconFill ? 'icon-fill' : 'icon'} d={icon} />}
    </g>
  );
}

// Dotted speaker grille.
export function Grille({ x, y, w, h }) {
  const patternId = useSvgId('grille');
  return (
    <g>
      <pattern id={patternId} width="5" height="5" patternUnits="userSpaceOnUse">
        <circle className="grille-dot" cx="2.5" cy="2.5" r="1" />
      </pattern>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={`url(#${patternId})`} />
    </g>
  );
}
