// Top-down view of the shoulder buttons, shared by every model.
// Triggers fill with their analog value; bumpers light while pressed.
import { pressedAt, valueAt } from '../lib/buttons.js';
import { cls } from '../lib/cls.js';
import { useSvgId } from '../lib/useSvgId.js';

const rectProps = ({ x, y, w, h, r = 0 }) => ({ x, y, width: w, height: h, rx: r });

function TopTrigger({ rect, value }) {
  const clipId = useSvgId('top-trigger');
  const { x, y, w, h } = rect;
  return (
    <g>
      <clipPath id={clipId}>
        <rect {...rectProps(rect)} />
      </clipPath>
      <rect className="part" {...rectProps(rect)} />
      {value > 0 && (
        <rect className="trigger-fill" clipPath={`url(#${clipId})`} x={x} y={y + h * (1 - value)} width={w} height={h * value} />
      )}
      <path className="trigger-ridges" d={`M${x + 12} ${y + 10} H${x + w - 12} M${x + 12} ${y + 16} H${x + w - 12}`} />
      <rect className="part-outline" {...rectProps(rect)} />
    </g>
  );
}

// `layout` holds the shapes for one model: edge (body outline), l2/r2/l1/r1 rects, optional port, lightbar
// and extra details. `names` labels the triggers.
export function TopView({ label, layout, buttons, names }) {
  const { edge, l2, r2, l1, r1, port, lightbar, details } = layout;
  return (
    <svg className="pad pad-top" viewBox="0 0 640 120" role="img" aria-label={label}>
      <path className="pad-body" d={edge} />
      <TopTrigger rect={l2} value={valueAt(buttons, 6)} />
      <TopTrigger rect={r2} value={valueAt(buttons, 7)} />
      <rect className={cls('part', pressedAt(buttons, 4) && 'is-pressed')} {...rectProps(l1)} />
      <rect className={cls('part', pressedAt(buttons, 5) && 'is-pressed')} {...rectProps(r1)} />
      {lightbar && <rect className="pad-lightbar" {...rectProps(lightbar)} />}
      {port && <rect className="pad-port" {...rectProps(port)} />}
      {details}
      <text className="pad-label" x={l2.x + l2.w + 10} y={l2.y + l2.h / 2 + 4}>
        {names.l2}
      </text>
      <text className="pad-label" x={r2.x - 10} y={r2.y + r2.h / 2 + 4} textAnchor="end">
        {names.r2}
      </text>
    </svg>
  );
}
