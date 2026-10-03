import { useEffect, useRef } from 'react';
import LabeledFrame from './LabeledFrame.jsx';
import { HISTORY_LEN } from '../input/stats.js';
import { cls } from '../lib/cls.js';

// Colors come from the theme tokens at draw time, so the graph follows the light/dark switch.
function draw(canvas, history, drift) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const styles = getComputedStyle(canvas);
  const token = (name) => styles.getPropertyValue(name).trim();

  ctx.strokeStyle = token('--frame-track');
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(0, Math.round(height / 2) + 0.5);
  ctx.lineTo(width, Math.round(height / 2) + 0.5);
  ctx.stroke();

  const series = (values, color, dashed) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash(dashed ? [5, 4] : []);
    ctx.beginPath();
    for (let i = 0; i < HISTORY_LEN; i++) {
      const value = values[(history.head + i) % HISTORY_LEN];
      const x = (i / (HISTORY_LEN - 1)) * width;
      const y = height / 2 - value * (height / 2) * 0.9;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  series(history.rx, token(drift.right ? '--drift-on-frame' : '--frame-muted'), true);
  series(history.lx, token(drift.left ? '--drift-on-frame' : '--frame-text'), false);
  ctx.setLineDash([]);
}

export default function HistoryGraph({ history, drift }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current) draw(canvasRef.current, history, drift);
  });
  return (
    <LabeledFrame title={`X axis · last ${HISTORY_LEN} frames`}>
      <canvas
        ref={canvasRef}
        className="history-canvas"
        role="img"
        aria-label={`Left and right stick X position over the last ${HISTORY_LEN} frames`}
      />
      <div className="legend">
        <span>
          <i className={cls('legend-swatch', drift.left && 'is-drift')} />
          Left X{drift.left && ' (drifting)'}
        </span>
        <span>
          <i className={cls('legend-swatch', 'legend-swatch--dashed', drift.right && 'is-drift')} />
          Right X{drift.right && ' (drifting)'}
        </span>
      </div>
    </LabeledFrame>
  );
}
