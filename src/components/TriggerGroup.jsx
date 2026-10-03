import LabeledFrame from './LabeledFrame.jsx';

export default function TriggerGroup({ trigger, bumper, value, pressed }) {
  return (
    <LabeledFrame surface="stage" title={`${trigger} · ${bumper}`} value={`${Math.round(value * 100)}%`}>
      <div className="bar">
        <i style={{ left: 0, width: `${value * 100}%` }} />
      </div>
      <div className="kv">
        <span>{bumper}</span>
        <span className="kv-value">{pressed ? 'Pressed' : 'Released'}</span>
      </div>
    </LabeledFrame>
  );
}
