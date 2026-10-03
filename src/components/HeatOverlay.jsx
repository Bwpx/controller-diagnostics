import { DRIFT_THRESHOLD } from '../input/stats.js';

// Gate outline, crosshair and the dashed drift-threshold ring drawn over a heatmap canvas.
export default function HeatOverlay() {
  return (
    <svg className="heat-overlay" viewBox="0 0 64 64" aria-hidden="true">
      <circle className="heat-line" cx="32" cy="32" r="31.5" />
      <line className="heat-line" x1="0.5" y1="32" x2="63.5" y2="32" />
      <line className="heat-line" x1="32" y1="0.5" x2="32" y2="63.5" />
      <circle className="heat-deadzone" cx="32" cy="32" r={DRIFT_THRESHOLD * 32} />
    </svg>
  );
}
