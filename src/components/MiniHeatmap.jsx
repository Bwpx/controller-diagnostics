import { useEffect, useRef } from 'react';
import HeatOverlay from './HeatOverlay.jsx';
import { drawHeat } from './heatmapDraw.js';
import './Heatmap.css';

const WHITE = [255, 255, 255];

// Small heatmap inside a stick frame on the stage. Redraws after every render (once per frame while connected).
export default function MiniHeatmap({ heat }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current) drawHeat(canvasRef.current, heat, WHITE);
  });
  return (
    <div className="heat heat--mini" aria-hidden="true">
      <canvas ref={canvasRef} />
      <HeatOverlay />
    </div>
  );
}
