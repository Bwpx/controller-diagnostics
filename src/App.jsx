import { useEffect, useState, useRef, useCallback } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700&display=swap');`;

const DRIFT_THRESHOLD = 0.08;
const HISTORY_LEN = 120;
const HEATMAP_SIZE = 64; // grid cells per axis
const BUTTON_LABELS = ["A","B","X","Y","LB","RB","LT","RT","Select","Start","L3","R3","D↑","D↓","D←","D→"];

const css = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --mono: 'Share Tech Mono', monospace; --sans: 'Exo 2', sans-serif; }

  .root.light {
    --bg: #dce3ee; --surface: #c8d2e0; --surface2: #bcc7d6;
    --border: rgba(44,123,229,0.18); --border-bright: rgba(44,123,229,0.4);
    --accent: #2c7be5; --accent2: #5a5fcf;
    --accent-glow: rgba(44,123,229,0.15);
    --pressed: #0e9e6e; --pressed-glow: rgba(14,158,110,0.3);
    --danger: #e53e3e; --danger-bg: rgba(229,62,62,0.08); --danger-border: rgba(229,62,62,0.35);
    --text: #1e2a3a; --muted: #4a5568;
    --bar-bg: rgba(0,0,0,0.12); --badge-bg: rgba(44,123,229,0.10);
    --tag-bg: rgba(44,123,229,0.08); --card-tint: rgba(44,123,229,0.04);
    --trigger-glow: rgba(90,95,207,0.35);
    --chip-active-bg: rgba(14,158,110,0.12); --chip-active-in: rgba(14,158,110,0.05);
    --toggle-bg: #b0bdd0; --toggle-knob: #fff;
    --graph-bg: rgba(0,0,0,0.04); --connect-bg: #dce3ee;
  }
  .root.dark {
    --bg: #060a10; --surface: #0b1220; --surface2: #0f1a2e;
    --border: rgba(56,189,248,0.12); --border-bright: rgba(56,189,248,0.35);
    --accent: #38bdf8; --accent2: #818cf8;
    --accent-glow: rgba(56,189,248,0.2);
    --pressed: #34d399; --pressed-glow: rgba(52,211,153,0.4);
    --danger: #fc8181; --danger-bg: rgba(252,129,129,0.08); --danger-border: rgba(252,129,129,0.35);
    --text: #e2e8f0; --muted: #475569;
    --bar-bg: rgba(255,255,255,0.07); --badge-bg: rgba(56,189,248,0.08);
    --tag-bg: rgba(56,189,248,0.06); --card-tint: rgba(56,189,248,0.03);
    --trigger-glow: rgba(129,140,248,0.45);
    --chip-active-bg: rgba(52,211,153,0.12); --chip-active-in: rgba(52,211,153,0.05);
    --toggle-bg: #1e3a5f; --toggle-knob: #38bdf8;
    --graph-bg: rgba(255,255,255,0.02); --connect-bg: #060a10;
  }

  .root {
    min-height: 100vh; background: var(--bg); font-family: var(--sans);
    color: var(--text); display: flex; align-items: center; justify-content: center;
    padding: 40px 20px; transition: background 0.3s ease, color 0.3s ease;
  }
  .shell { width: 860px; max-width: 100%; }

  /* ── Connection screen ── */
  .connect-screen {
    min-height: 100vh; background: var(--connect-bg);
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 32px; font-family: var(--sans); transition: background 0.3s;
  }
  .connect-rings {
    position: relative; width: 120px; height: 120px;
    display: flex; align-items: center; justify-content: center;
  }
  .connect-ring {
    position: absolute; border-radius: 50%; border: 1px solid var(--accent);
    animation: ring-pulse 2.4s ease-out infinite;
  }
  .connect-ring:nth-child(1) { width: 40px; height: 40px; animation-delay: 0s; }
  .connect-ring:nth-child(2) { width: 70px; height: 70px; animation-delay: 0.5s; }
  .connect-ring:nth-child(3) { width: 100px; height: 100px; animation-delay: 1s; }
  @keyframes ring-pulse {
    0%   { transform: scale(0.8); opacity: 0; }
    40%  { opacity: 0.6; }
    100% { transform: scale(1.3); opacity: 0; }
  }
  .connect-icon {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--accent); box-shadow: 0 0 16px var(--accent); animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .connect-title { font-size: 22px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; transition: color 0.3s; }
  .connect-title span { color: var(--accent); }
  .connect-sub {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
    color: var(--muted); text-transform: uppercase; animation: blink 1.4s step-end infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
  .connect-hint { font-size: 12px; color: var(--muted); transition: color 0.3s; }
  .connect-theme-btn {
    position: absolute; top: 28px; right: 28px;
    display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;
  }

  /* ── Header ── */
  .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 36px; gap: 20px; }
  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.15em;
    color: var(--accent); text-transform: uppercase; background: var(--badge-bg);
    border: 1px solid var(--border-bright); padding: 4px 10px; border-radius: 3px;
    margin-bottom: 10px; transition: background 0.3s, border-color 0.3s, color 0.3s;
  }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 6px var(--accent); animation: pulse 2s infinite; }
  .title { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.1; }
  .title span { color: var(--accent); transition: color 0.3s; }
  .controller-id { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-top: 8px; max-width: 380px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.3s; }
  .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 14px; flex-shrink: 0; }
  .stat-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.12em; color: var(--muted); text-transform: uppercase; transition: color 0.3s; }
  .stat-value { font-family: var(--mono); font-size: 22px; color: var(--accent); line-height: 1; transition: color 0.3s; }

  /* ── Toggle ── */
  .theme-toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
  .toggle-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; transition: color 0.3s; min-width: 28px; text-align: right; }
  .toggle-track { width: 40px; height: 22px; border-radius: 11px; background: var(--toggle-bg); border: 1px solid var(--border-bright); position: relative; transition: background 0.3s, border-color 0.3s; }
  .toggle-knob { position: absolute; top: 3px; width: 14px; height: 14px; border-radius: 50%; background: var(--toggle-knob); transition: left 0.3s cubic-bezier(.4,0,.2,1), background 0.3s; }
  .root.light .toggle-knob { left: 3px; }
  .root.dark  .toggle-knob { left: 21px; }

  /* ── Divider ── */
  .divider { height: 1px; background: linear-gradient(90deg, transparent, var(--border-bright), transparent); margin-bottom: 32px; transition: background 0.3s; }

  /* ── Grid ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }

  /* ── Card ── */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 24px; position: relative; overflow: hidden; transition: background 0.3s, border-color 0.3s; }
  .card.drift-alert { border-color: var(--danger-border); background: var(--danger-bg); }
  .card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, var(--card-tint) 0%, transparent 60%); pointer-events: none; transition: background 0.3s; }
  .card-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.15em; color: var(--muted); text-transform: uppercase; margin-bottom: 20px; transition: color 0.3s; }
  .drift-badge { display: inline-flex; align-items: center; gap: 5px; font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; color: var(--danger); background: var(--danger-bg); border: 1px solid var(--danger-border); padding: 2px 8px; border-radius: 3px; margin-left: 8px; animation: pulse 1s infinite; }

  /* ── Stick ── */
  .stick-wrap { display: flex; gap: 8px; align-items: flex-start; }
  .stick-visual { position: relative; flex-shrink: 0; }
  .stick-circle { width: 120px; height: 120px; border-radius: 50%; border: 1px solid var(--border-bright); position: relative; background: radial-gradient(circle at center, var(--accent-glow) 0%, transparent 70%); transition: background 0.3s, border-color 0.3s; }
  .stick-deadzone { position: absolute; border-radius: 50%; border: 1px dashed var(--danger); opacity: 0.4; pointer-events: none; transform: translate(-50%, -50%); left: 50%; top: 50%; }
  .stick-line-h { position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--border); transform: translateY(-50%); transition: background 0.3s; }
  .stick-line-v { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--border); transform: translateX(-50%); transition: background 0.3s; }
  .stick-trail { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: var(--accent-glow); transform: translate(-50%, -50%); transition: left 0.05s linear, top 0.05s linear; filter: blur(4px); }
  .stick-dot { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); transform: translate(-50%, -50%); box-shadow: 0 0 12px var(--accent), 0 0 4px var(--accent); transition: left 0.05s linear, top 0.05s linear, background 0.3s, box-shadow 0.3s; }
  .stick-dot.drifting { background: var(--danger); box-shadow: 0 0 12px var(--danger), 0 0 4px var(--danger); }
  .stick-ring { position: absolute; width: 22px; height: 22px; border-radius: 50%; border: 1px solid var(--accent); opacity: 0.2; transform: translate(-50%, -50%); transition: left 0.05s linear, top 0.05s linear, border-color 0.3s; }
  .stick-data { flex: 1; display: flex; flex-direction: column; gap: 8px; padding-top: 8px; }
  .axis-row { display: flex; flex-direction: column; gap: 4px; }
  .axis-header { display: flex; justify-content: space-between; align-items: center; }
  .axis-name { font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; color: var(--muted); transition: color 0.3s; }
  .axis-num { font-family: var(--mono); font-size: 11px; color: var(--accent); transition: color 0.3s; }
  .axis-bar-bg { height: 4px; background: var(--bar-bg); border-radius: 2px; overflow: hidden; position: relative; transition: background 0.3s; }
  .axis-bar-fill { position: absolute; top: 0; height: 100%; background: var(--accent); border-radius: 2px; transition: left 0.05s, width 0.05s, background 0.3s; box-shadow: 0 0 6px var(--accent); }

  /* ── Heatmap ── */
  .heatmap-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .heatmap-canvas { width: 100%; aspect-ratio: 1; border-radius: 50%; display: block; image-rendering: pixelated; }
  .heatmap-inner { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .heatmap-legend { display: flex; align-items: center; gap: 8px; width: 100%; }
  .heatmap-legend-bar {
    flex: 1; height: 6px; border-radius: 3px;
    background: linear-gradient(90deg, #3b82f6, #22d3ee, #4ade80, #facc15, #f97316, #ef4444);
  }
  .heatmap-legend-label { font-family: var(--mono); font-size: 9px; color: var(--muted); letter-spacing: 0.06em; }
  .heatmap-reset {
    font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; padding: 3px 10px;
    border-radius: 3px; border: 1px solid var(--border-bright); background: transparent;
    color: var(--muted); cursor: pointer; text-transform: uppercase; transition: color 0.15s, background 0.15s;
  }
  .heatmap-reset:hover { color: var(--accent); background: var(--badge-bg); }
  .heatmap-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .heatmap-sample-count { font-family: var(--mono); font-size: 9px; color: var(--muted); letter-spacing: 0.06em; }

  /* ── History graph ── */
  .graph-card { margin-bottom: 20px; }
  .graph-canvas { width: 100%; height: 70px; display: block; border-radius: 4px; background: var(--graph-bg); }
  .graph-legend { display: flex; gap: 16px; margin-top: 8px; }
  .graph-legend-item { display: flex; align-items: center; gap: 5px; font-family: var(--mono); font-size: 9px; color: var(--muted); letter-spacing: 0.08em; }
  .legend-dot { width: 8px; height: 2px; border-radius: 1px; }

  /* ── Buttons ── */
  .buttons-card { margin-bottom: 20px; }
  .btn-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .btn-chip { font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em; padding: 5px 12px; border-radius: 4px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); transition: background 0.1s, color 0.1s, border-color 0.1s, box-shadow 0.1s; white-space: nowrap; }
  .btn-chip.active { background: var(--chip-active-bg); border-color: var(--pressed); color: var(--pressed); box-shadow: 0 0 8px var(--pressed-glow), inset 0 0 8px var(--chip-active-in); }

  /* ── Triggers ── */
  .triggers-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .trigger-fill-bg { height: 8px; background: var(--bar-bg); border-radius: 4px; overflow: hidden; margin-top: 12px; transition: background 0.3s; }
  .trigger-fill { height: 100%; background: linear-gradient(90deg, var(--accent2), var(--accent)); border-radius: 4px; transition: width 0.05s linear, background 0.3s; box-shadow: 0 0 8px var(--trigger-glow); }
  .trigger-val { font-family: var(--mono); font-size: 11px; color: var(--accent2); margin-top: 6px; text-align: right; transition: color 0.3s; }

  /* ── Recording ── */
  .rec-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding: 12px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; transition: background 0.3s, border-color 0.3s; }
  .rec-bar.recording { border-color: var(--danger-border); background: var(--danger-bg); }
  .rec-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); flex-shrink: 0; transition: background 0.3s; }
  .rec-dot.active { background: var(--danger); animation: pulse 1s infinite; }
  .rec-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; flex: 1; transition: color 0.3s; }
  .rec-label.active { color: var(--danger); }
  .rec-count { font-family: var(--mono); font-size: 10px; color: var(--muted); transition: color 0.3s; }
  .rec-btn { font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; padding: 5px 14px; border-radius: 3px; border: 1px solid var(--border-bright); background: transparent; color: var(--accent); cursor: pointer; text-transform: uppercase; transition: background 0.15s, color 0.15s; }
  .rec-btn:hover { background: var(--badge-bg); }
  .rec-btn.stop { border-color: var(--danger-border); color: var(--danger); }
  .rec-btn.export { border-color: var(--pressed-glow); color: var(--pressed); }

  /* ── Footer ── */
  .footer { border: 1px solid var(--border); border-radius: 8px; padding: 24px 28px; background: var(--surface); transition: background 0.3s, border-color 0.3s; }
  .footer-quote-bar { display: flex; gap: 16px; align-items: stretch; margin-bottom: 16px; }
  .footer-accent-bar { width: 3px; border-radius: 2px; background: var(--accent); flex-shrink: 0; opacity: 0.7; transition: background 0.3s; }
  .footer-quote { font-size: 13px; color: var(--text); line-height: 1.75; font-style: italic; transition: color 0.3s; }
  .footer-body { font-size: 12px; color: var(--muted); line-height: 1.7; margin-bottom: 18px; transition: color 0.3s; }
  .footer-divider { height: 1px; background: var(--border); margin-bottom: 14px; transition: background 0.3s; }
  .footer-meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .footer-meta-left { display: flex; align-items: center; gap: 8px; }
  .footer-name { font-size: 13px; font-weight: 600; color: var(--text); transition: color 0.3s; }
  .footer-sep { color: var(--muted); }
  .footer-role { font-size: 12px; color: var(--muted); transition: color 0.3s; }
  .footer-pills { display: flex; gap: 6px; flex-wrap: wrap; }
  .footer-pill { font-family: var(--mono); font-size: 9px; letter-spacing: 0.08em; color: var(--accent); background: var(--tag-bg); border: 1px solid var(--border-bright); padding: 3px 9px; border-radius: 3px; white-space: nowrap; transition: background 0.3s, border-color 0.3s, color 0.3s; }
`;

// ── Heat colour ramp: blue → cyan → green → yellow → orange → red ──
function heatColor(t) {
  // t in [0,1]
  const stops = [
    [0,   [30,  80,  220]],
    [0.2, [0,   200, 220]],
    [0.4, [40,  210, 80]],
    [0.6, [240, 210, 30]],
    [0.8, [245, 130, 20]],
    [1.0, [220, 30,  30]],
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i][0] && t <= stops[i+1][0]) { lo = stops[i]; hi = stops[i+1]; break; }
  }
  const f = (t - lo[0]) / (hi[0] - lo[0]);
  return lo[1].map((c, i) => Math.round(c + f * (hi[1][i] - c)));
}

// ── Polar Heatmap component ──
function PolarHeatmap({ label, grid, sampleCount, onReset, theme }) {
  const canvasRef = useRef(null);
  const SIZE = HEATMAP_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(SIZE, SIZE);

    // find max for normalisation
    let max = 1;
    for (let i = 0; i < SIZE * SIZE; i++) if (grid[i] > max) max = grid[i];

    const cx = SIZE / 2, cy = SIZE / 2, r = SIZE / 2;

    for (let py = 0; py < SIZE; py++) {
      for (let px = 0; px < SIZE; px++) {
        const dx = px - cx, dy = py - cy;
        const idx = (py * SIZE + px) * 4;
        if (dx * dx + dy * dy > r * r) {
          // outside circle — transparent
          imageData.data[idx + 3] = 0;
          continue;
        }
        const count = grid[py * SIZE + px];
        if (count === 0) {
          // unvisited — subtle bg
          const bg = theme === "dark" ? 20 : 200;
          imageData.data[idx]   = bg;
          imageData.data[idx+1] = bg;
          imageData.data[idx+2] = bg;
          imageData.data[idx+3] = theme === "dark" ? 60 : 40;
        } else {
          const t = Math.pow(count / max, 0.45); // gamma for visual pop
          const [r2, g, b] = heatColor(t);
          imageData.data[idx]   = r2;
          imageData.data[idx+1] = g;
          imageData.data[idx+2] = b;
          imageData.data[idx+3] = Math.round(80 + t * 175);
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // deadzone ring overlay
    ctx.beginPath();
    ctx.arc(cx, cy, DRIFT_THRESHOLD * r, 0, Math.PI * 2);
    ctx.strokeStyle = theme === "dark" ? "rgba(252,129,129,0.5)" : "rgba(229,62,62,0.5)";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 2]);
    ctx.stroke();
    ctx.setLineDash([]);

    // outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = theme === "dark" ? "rgba(56,189,248,0.3)" : "rgba(44,123,229,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // crosshairs
    ctx.strokeStyle = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(SIZE, cy); ctx.stroke();

  }, [grid, theme]);

  return (
    <div className="card">
      <div className="heatmap-header">
        <div className="card-label" style={{ marginBottom: 0 }}>
          {label} &nbsp;·&nbsp;
          <span className="heatmap-sample-count">{sampleCount.toLocaleString()} samples</span>
        </div>
        <button className="heatmap-reset" onClick={onReset}>Reset</button>
      </div>
      <div className="heatmap-inner">
        <canvas ref={canvasRef} className="heatmap-canvas" style={{ width: 160, height: 160 }} />
        <div className="heatmap-legend">
          <span className="heatmap-legend-label">Rare</span>
          <div className="heatmap-legend-bar" />
          <span className="heatmap-legend-label">Frequent</span>
        </div>
      </div>
    </div>
  );
}

// ── History graph ──
function HistoryGraph({ lxHist, rxHist, theme }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const isDark = theme === "dark";
    const colLX = isDark ? "rgba(56,189,248,0.85)"  : "rgba(44,123,229,0.85)";
    const colRX = isDark ? "rgba(129,140,248,0.85)" : "rgba(90,95,207,0.85)";
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
    const drawLine = (hist, color) => {
      if (hist.length < 2) return;
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.beginPath();
      hist.forEach((v, i) => {
        const x = (i / (HISTORY_LEN - 1)) * W;
        const y = H/2 - (v * H/2 * 0.85);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    };
    drawLine(lxHist, colLX);
    drawLine(rxHist, colRX);
  }, [lxHist, rxHist, theme]);

  const isDark = theme === "dark";
  const colLX = isDark ? "rgba(56,189,248,0.85)"  : "rgba(44,123,229,0.85)";
  const colRX = isDark ? "rgba(129,140,248,0.85)" : "rgba(90,95,207,0.85)";

  return (
    <div className="card graph-card">
      <div className="card-label">Input History · X-Axis (last {HISTORY_LEN} frames)</div>
      <canvas ref={canvasRef} className="graph-canvas" style={{ height: 70 }} />
      <div className="graph-legend">
        <div className="graph-legend-item"><div className="legend-dot" style={{ background: colLX }} />Left stick X</div>
        <div className="graph-legend-item"><div className="legend-dot" style={{ background: colRX }} />Right stick X</div>
      </div>
    </div>
  );
}

// ── Axis bar ──
function AxisBar({ value }) {
  const pct = value * 50;
  const left = pct < 0 ? 50 + pct : 50;
  const width = Math.abs(pct);
  return (
    <div className="axis-bar-bg">
      <div className="axis-bar-fill" style={{ left: `${left}%`, width: `${width}%` }} />
    </div>
  );
}

// ── Stick card ──
function StickCard({ label, x, y, pressed, drifting }) {
  const r = 55;
  const dotX = 60 + x * r, dotY = 60 + y * r;
  const deadzoneR = DRIFT_THRESHOLD * 120;
  return (
    <div className={`card${drifting ? " drift-alert" : ""}`}>
      <div className="card-label">
        {label}{pressed ? " · CLICK" : ""}
        {drifting && <span className="drift-badge">⚠ DRIFT DETECTED</span>}
      </div>
      <div className="stick-wrap">
        <div className="stick-visual">
          <div className="stick-circle" style={{ border: pressed ? "1px solid var(--pressed)" : drifting ? "1px solid var(--danger)" : undefined }}>
            <div className="stick-deadzone" style={{ width: deadzoneR * 2, height: deadzoneR * 2 }} />
            <div className="stick-line-h" /><div className="stick-line-v" />
            <div className="stick-trail" style={{ left: dotX, top: dotY }} />
            <div className="stick-ring"  style={{ left: dotX, top: dotY }} />
            <div className={`stick-dot${drifting ? " drifting" : ""}`} style={{ left: dotX, top: dotY }} />
          </div>
        </div>
        <div className="stick-data">
          <div className="axis-row">
            <div className="axis-header"><span className="axis-name">AXIS X</span><span className="axis-num" style={{ color: drifting ? "var(--danger)" : undefined }}>{x >= 0 ? "+" : ""}{x.toFixed(3)}</span></div>
            <AxisBar value={x} />
          </div>
          <div className="axis-row">
            <div className="axis-header"><span className="axis-name">AXIS Y</span><span className="axis-num" style={{ color: drifting ? "var(--danger)" : undefined }}>{y >= 0 ? "+" : ""}{y.toFixed(3)}</span></div>
            <AxisBar value={y} />
          </div>
          <div className="axis-row" style={{ marginTop: 4 }}>
            <div className="axis-header"><span className="axis-name">MAGNITUDE</span><span className="axis-num">{Math.min(1, Math.sqrt(x*x+y*y)).toFixed(3)}</span></div>
            <div className="axis-bar-bg"><div className="axis-bar-fill" style={{ left: 0, width: `${Math.min(100, Math.sqrt(x*x+y*y)*100)}%`, background: "var(--accent2)", boxShadow: "0 0 6px var(--accent2)" }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Connection screen ──
function ConnectScreen({ theme, onToggleTheme }) {
  const isDark = theme === "dark";
  return (
    <div className={`root ${theme}`}>
      <style>{css}</style>
      <div className="connect-theme-btn" onClick={onToggleTheme}>
        <span className="toggle-label" style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, letterSpacing:"0.1em", color:"var(--muted)", textTransform:"uppercase", minWidth:28, textAlign:"right" }}>{isDark ? "Dark" : "Light"}</span>
        <div className="toggle-track"><div className="toggle-knob" /></div>
      </div>
      <div className="connect-screen">
        <div className="connect-rings">
          <div className="connect-ring" /><div className="connect-ring" /><div className="connect-ring" />
          <div className="connect-icon" />
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="connect-title">Controller <span>Analyzer</span></div>
        </div>
        <div className="connect-sub">Waiting for controller</div>
        <div className="connect-hint">Plug in your controller and press any button to begin</div>
      </div>
    </div>
  );
}

// ── Helper: make empty heatmap grid ──
const makeGrid = () => new Array(HEATMAP_SIZE * HEATMAP_SIZE).fill(0);

// ── Main app ──
export default function App() {
  const [axes, setAxes]             = useState([0,0,0,0]);
  const [buttons, setButtons]       = useState([]);
  const [triggers, setTriggers]     = useState([0,0]);
  const [controllerId, setId]       = useState("");
  const [connected, setConnected]   = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const [theme, setTheme]           = useState("light");
  const [recording, setRecording]   = useState(false);
  const [sessionLog, setSessionLog] = useState([]);

  // History buffers
  const [lxHist, setLxHist] = useState(Array(HISTORY_LEN).fill(0));
  const [rxHist, setRxHist] = useState(Array(HISTORY_LEN).fill(0));

  // Heatmap grids (left / right stick)
  const [lGrid, setLGrid] = useState(makeGrid);
  const [rGrid, setRGrid] = useState(makeGrid);
  const [lSamples, setLSamples] = useState(0);
  const [rSamples, setRSamples] = useState(0);

  const prevButtons = useRef([]);
  const recRef      = useRef({ active: false, log: [] });

  const noInput = buttons.every(b => !b);
  const lDrift  = noInput && Math.sqrt(axes[0]**2 + axes[1]**2) > DRIFT_THRESHOLD;
  const rDrift  = noInput && Math.sqrt(axes[2]**2 + axes[3]**2) > DRIFT_THRESHOLD;

  // Map axis value [-1,1] to heatmap grid cell index
  const toCell = (v) => Math.min(HEATMAP_SIZE - 1, Math.max(0, Math.floor((v + 1) / 2 * HEATMAP_SIZE)));

  useEffect(() => {
    let raf;
    const update = () => {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        setConnected(true);
        setId(gp.id);
        const ax = [gp.axes[0]??0, gp.axes[1]??0, gp.axes[2]??0, gp.axes[3]??0];
        setAxes(ax);
        const btns = gp.buttons.map(b => b.pressed);
        setButtons(btns);
        setTriggers([gp.buttons[6]?.value??0, gp.buttons[7]?.value??0]);

        const prev = prevButtons.current;
        const newPresses = btns.filter((v,i) => v && !prev[i]).length;
        if (newPresses > 0) setPressCount(c => c + newPresses);
        prevButtons.current = btns;

        setLxHist(h => [...h.slice(1), ax[0]]);
        setRxHist(h => [...h.slice(1), ax[2]]);

        // Accumulate heatmap — update every frame
        const lCol = toCell(ax[0]), lRow = toCell(ax[1]);
        const rCol = toCell(ax[2]), rRow = toCell(ax[3]);

        setLGrid(g => { const n = [...g]; n[lRow * HEATMAP_SIZE + lCol]++; return n; });
        setRGrid(g => { const n = [...g]; n[rRow * HEATMAP_SIZE + rCol]++; return n; });
        setLSamples(s => s + 1);
        setRSamples(s => s + 1);

        if (recRef.current.active) {
          recRef.current.log.push({ t: Date.now(), axes: ax, buttons: btns });
        }
      } else {
        setConnected(false);
      }
      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, []);

  const startRecording = () => { recRef.current = { active: true, log: [] }; setSessionLog([]); setRecording(true); };
  const stopRecording  = () => { recRef.current.active = false; setSessionLog(recRef.current.log); setRecording(false); };

  const exportCSV = useCallback(() => {
    const rows = ["timestamp,lx,ly,rx,ry,buttons"];
    sessionLog.forEach(f => rows.push(`${f.t},${f.axes.join(",")},${f.buttons.map(Number).join("|")}`));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "controller-session.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [sessionLog]);

  const [lx,ly,rx,ry] = axes;
  const activeCount    = buttons.filter(Boolean).length;
  const isDark         = theme === "dark";
  const toggleTheme    = () => setTheme(t => t === "light" ? "dark" : "light");

  if (!connected) return <ConnectScreen theme={theme} onToggleTheme={toggleTheme} />;

  return (
    <div className={`root ${theme}`}>
      <style>{css}</style>
      <div className="shell">

        {/* Header */}
        <div className="header">
          <div className="header-left">
            <div className="badge"><div className="badge-dot" />Gamepad API · Live</div>
            <h1 className="title">Controller <span>Analyzer</span></h1>
            <div className="controller-id">{controllerId}</div>
          </div>
          <div className="header-right">
            <div style={{ textAlign: "right" }}>
              <div className="stat-label">Total Presses</div>
              <div className="stat-value">{String(pressCount).padStart(4,"0")}</div>
            </div>
            <div className="theme-toggle" onClick={toggleTheme}>
              <span className="toggle-label">{isDark ? "Dark" : "Light"}</span>
              <div className="toggle-track"><div className="toggle-knob" /></div>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Recording bar */}
        <div className={`rec-bar${recording ? " recording" : ""}`}>
          <div className={`rec-dot${recording ? " active" : ""}`} />
          <span className={`rec-label${recording ? " active" : ""}`}>
            {recording ? "Recording session..." : sessionLog.length > 0 ? "Session recorded" : "Session recorder"}
          </span>
          {recording && <span className="rec-count">{recRef.current?.log?.length ?? 0} frames</span>}
          {!recording && sessionLog.length > 0 && <button className="rec-btn export" onClick={exportCSV}>Export CSV</button>}
          {!recording
            ? <button className="rec-btn" onClick={startRecording}>Start</button>
            : <button className="rec-btn stop" onClick={stopRecording}>Stop</button>}
        </div>

        {/* Sticks */}
        <div className="grid-2">
          <StickCard label="LEFT STICK"  x={lx} y={ly} pressed={buttons[10]} drifting={lDrift} />
          <StickCard label="RIGHT STICK" x={rx} y={ry} pressed={buttons[11]} drifting={rDrift} />
        </div>

        {/* Heatmaps */}
        <div className="heatmap-row">
          <PolarHeatmap label="LEFT STICK HEATMAP"  grid={lGrid} sampleCount={lSamples} theme={theme} onReset={() => { setLGrid(makeGrid()); setLSamples(0); }} />
          <PolarHeatmap label="RIGHT STICK HEATMAP" grid={rGrid} sampleCount={rSamples} theme={theme} onReset={() => { setRGrid(makeGrid()); setRSamples(0); }} />
        </div>

        {/* History graph */}
        <HistoryGraph lxHist={lxHist} rxHist={rxHist} theme={theme} />

        {/* Triggers */}
        <div className="triggers-row">
          {[["LEFT TRIGGER", triggers[0]], ["RIGHT TRIGGER", triggers[1]]].map(([label, val]) => (
            <div className="card" key={label}>
              <div className="card-label">{label}</div>
              <div className="trigger-fill-bg"><div className="trigger-fill" style={{ width: `${val * 100}%` }} /></div>
              <div className="trigger-val">{(val * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="card buttons-card">
          <div className="card-label">
            Buttons &nbsp;·&nbsp;
            <span style={{ color: activeCount > 0 ? "var(--pressed)" : "var(--muted)" }}>{activeCount} active</span>
          </div>
          <div className="btn-grid">
            {BUTTON_LABELS.map((label, i) => (
              <div key={i} className={`btn-chip${buttons[i] ? " active" : ""}`}>{label}</div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-quote-bar">
            <div className="footer-accent-bar" />
            <div className="footer-quote">
              Built for competitive gamers who need to see exactly what their controller is doing — every axis, every button, every frame. Stick drift is invisible until it costs you. This tool makes it visible.
            </div>
          </div>
          <div className="footer-body">
            Controller Analyzer was developed as a personal project using the Web Gamepad API and React. No backend, no installs — just your browser and your controller. Whether you're diagnosing hardware before a tournament or just curious how your inputs look under pressure, this tool gives you the clarity you need to compete with confidence.
          </div>
          <div className="footer-divider" />
          <div className="footer-meta">
            <div className="footer-meta-left">
              <span className="footer-name">Martin Gonzalez</span>
              <span className="footer-sep">·</span>
              <span className="footer-role">Personal Project</span>
            </div>
            <div className="footer-pills">
              <span className="footer-pill">Web Gamepad API</span>
              <span className="footer-pill">React</span>
              <span className="footer-pill">Open Source</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}