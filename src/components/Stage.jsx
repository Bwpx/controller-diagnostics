import StickGroup from './StickGroup.jsx';
import TriggerGroup from './TriggerGroup.jsx';
import { describeDevice } from '../input/detect.js';
import { pressedAt, valueAt } from '../lib/buttons.js';
import { cls } from '../lib/cls.js';
import './Stage.css';

const IDLE = { axes: [0, 0, 0, 0], buttons: [], drift: { left: false, right: false } };

const percent = (v) => `${Math.round(v * 100)}%`;
const state = (pressed) => (pressed ? 'pressed' : '—');

// The platform-colored area: stick and trigger readouts on the sides, the controller in the middle.
export default function Stage({ model, snapshot, heat, children }) {
  const { axes, buttons, drift } = snapshot.connected ? snapshot : IDLE;
  const { Front, Top, shoulders } = model;
  const device = describeDevice(snapshot.id);
  const summary = [
    `${shoulders.l2} ${percent(valueAt(buttons, 6))}`,
    `${shoulders.l1} ${state(pressedAt(buttons, 4))}`,
    `${shoulders.r1} ${state(pressedAt(buttons, 5))}`,
    `${shoulders.r2} ${percent(valueAt(buttons, 7))}`,
  ].join(' · ');

  return (
    <section className="stage" data-platform={model.platform} aria-label={`${model.name} live view`}>
      <div className="stage-grid">
        <div className="stage-rail">
          <StickGroup title="Left stick" x={axes[0]} y={axes[1]} drift={drift.left} heat={heat.left} />
          <TriggerGroup trigger={shoulders.l2} bumper={shoulders.l1} value={valueAt(buttons, 6)} pressed={pressedAt(buttons, 4)} />
        </div>

        <div className={cls('stage-center', !snapshot.connected && 'is-idle')}>
          <Front buttons={buttons} axes={axes} drift={drift} />
          <p className="stage-caption">
            <span>Top view</span>
            <span className="num">{summary}</span>
          </p>
          <Top buttons={buttons} />
          {snapshot.connected && (
            <p className="stage-device num">
              {device.name}
              {device.vendor && ` · ${device.vendor}:${device.product}`}
            </p>
          )}
          {snapshot.connected && snapshot.mapping !== 'standard' && (
            <p className="stage-note">
              This controller doesn’t report the standard layout, so the drawing may not match. See the Buttons tab
              for raw input.
            </p>
          )}
        </div>

        <div className="stage-rail">
          <StickGroup title="Right stick" x={axes[2]} y={axes[3]} drift={drift.right} heat={heat.right} />
          <TriggerGroup trigger={shoulders.r2} bumper={shoulders.r1} value={valueAt(buttons, 7)} pressed={pressedAt(buttons, 5)} />
        </div>
      </div>
      {children}
    </section>
  );
}
