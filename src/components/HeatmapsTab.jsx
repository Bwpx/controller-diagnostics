import { useEffect, useRef } from 'react';
import LabeledFrame from './LabeledFrame.jsx';
import HeatOverlay from './HeatOverlay.jsx';
import { drawHeat, parseHex } from './heatmapDraw.js';
import './Heatmap.css';

function StickHeatmap({ title, heat, onReset }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawHeat(canvas, heat, parseHex(getComputedStyle(canvas).getPropertyValue('--frame-text')));
  });
  return (
    <LabeledFrame title={title} value={`${heat.samples.toLocaleString()} samples`}>
      <div className="heat heat--large">
        <canvas ref={canvasRef} role="img" aria-label={`${title} position heatmap`} />
        <HeatOverlay />
      </div>
      <div className="heat-actions">
        <span className="heat-scale">
          Rare
          <i className="heat-scale-bar" />
          Frequent
        </span>
        <button type="button" className="btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </LabeledFrame>
  );
}

export default function HeatmapsTab({ heat, onReset }) {
  return (
    <div className="panel-grid">
      <StickHeatmap title="Left stick" heat={heat.left} onReset={() => onReset('left')} />
      <StickHeatmap title="Right stick" heat={heat.right} onReset={() => onReset('right')} />
    </div>
  );
}
