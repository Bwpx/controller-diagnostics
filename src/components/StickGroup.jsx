import LabeledFrame from './LabeledFrame.jsx';
import MiniHeatmap from './MiniHeatmap.jsx';
import { magnitude } from '../input/stats.js';

const signed = (v) => `${v < 0 ? '−' : '+'}${Math.abs(v).toFixed(3)}`;

function AxisRow({ label, value }) {
  const half = Math.min(1, Math.abs(value)) * 50;
  return (
    <>
      <div className="kv">
        <span>{label}</span>
        <span className="kv-value num">{signed(value)}</span>
      </div>
      <div className="bar bar--center">
        <i style={{ left: `${value < 0 ? 50 - half : 50}%`, width: `${half}%` }} />
      </div>
    </>
  );
}

export default function StickGroup({ title, x, y, drift, heat }) {
  return (
    <LabeledFrame surface="stage" title={title} value={drift ? 'Drift' : null} valueInverse={drift}>
      <AxisRow label="X" value={x} />
      <AxisRow label="Y" value={y} />
      <div className="kv">
        <span>Magnitude</span>
        <span className="kv-value num">{Math.min(1, magnitude(x, y)).toFixed(3)}</span>
      </div>
      <MiniHeatmap heat={heat} />
    </LabeledFrame>
  );
}
