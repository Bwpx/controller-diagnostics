import { useEffect, useState, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700&display=swap');`;

const css = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060a10; }

  :root {
    --bg: #060a10;
    --surface: #0b1220;
    --surface2: #0f1a2e;
    --border: rgba(56, 189, 248, 0.12);
    --border-bright: rgba(56, 189, 248, 0.35);
    --accent: #38bdf8;
    --accent2: #818cf8;
    --accent-glow: rgba(56, 189, 248, 0.25);
    --pressed: #34d399;
    --pressed-glow: rgba(52, 211, 153, 0.4);
    --text: #e2e8f0;
    --muted: #475569;
    --mono: 'Share Tech Mono', monospace;
    --sans: 'Exo 2', sans-serif;
  }

  .root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--sans);
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .shell {
    width: 860px;
    max-width: 100%;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 36px;
    gap: 20px;
  }
  .header-left {}
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--accent);
    text-transform: uppercase;
    background: rgba(56,189,248,0.08);
    border: 1px solid var(--border-bright);
    padding: 4px 10px;
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }
  .title span { color: var(--accent); }
  .controller-id {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    margin-top: 8px;
    max-width: 380px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .header-stat {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
  .stat-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    color: var(--muted);
    text-transform: uppercase;
  }
  .stat-value {
    font-family: var(--mono);
    font-size: 22px;
    color: var(--accent);
    line-height: 1;
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-bright), transparent);
    margin-bottom: 32px;
  }

  /* ── Grid ── */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  /* ── Card ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(56,189,248,0.03) 0%, transparent 60%);
    pointer-events: none;
  }
  .card-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.15em;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  /* ── Stick ── */
  .stick-wrap {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }
  .stick-visual {
    position: relative;
    flex-shrink: 0;
  }
  .stick-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px solid var(--border-bright);
    position: relative;
    background: radial-gradient(circle at center, rgba(56,189,248,0.04) 0%, transparent 70%);
  }
  .stick-line-h {
    position: absolute;
    top: 50%; left: 0; right: 0;
    height: 1px;
    background: var(--border);
    transform: translateY(-50%);
  }
  .stick-line-v {
    position: absolute;
    left: 50%; top: 0; bottom: 0;
    width: 1px;
    background: var(--border);
    transform: translateX(-50%);
  }
  .stick-trail {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent-glow);
    transform: translate(-50%, -50%);
    transition: left 0.05s linear, top 0.05s linear;
    filter: blur(4px);
  }
  .stick-dot {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 12px var(--accent), 0 0 4px var(--accent);
    transition: left 0.05s linear, top 0.05s linear;
  }
  .stick-ring {
    position: absolute;
    width: 22px; height: 22px;
    border-radius: 50%;
    border: 1px solid var(--accent);
    opacity: 0.2;
    transform: translate(-50%, -50%);
    transition: left 0.05s linear, top 0.05s linear;
  }
  .stick-data {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
  }
  .axis-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .axis-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .axis-name {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.1em;
    color: var(--muted);
  }
  .axis-num {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
  }
  .axis-bar-bg {
    height: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }
  .axis-bar-fill {
    position: absolute;
    top: 0;
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: left 0.05s, width 0.05s;
    box-shadow: 0 0 6px var(--accent);
  }

  /* ── Buttons card ── */
  .buttons-card {
    margin-bottom: 20px;
  }
  .btn-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .btn-chip {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    padding: 5px 12px;
    border-radius: 4px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--muted);
    transition: background 0.1s, color 0.1s, border-color 0.1s, box-shadow 0.1s;
    white-space: nowrap;
  }
  .btn-chip.active {
    background: rgba(52, 211, 153, 0.12);
    border-color: var(--pressed);
    color: var(--pressed);
    box-shadow: 0 0 8px var(--pressed-glow), inset 0 0 8px rgba(52,211,153,0.05);
  }

  /* ── Trigger bars ── */
  .triggers-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  .trigger-card {}
  .trigger-fill-bg {
    height: 8px;
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 12px;
  }
  .trigger-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent2), var(--accent));
    border-radius: 4px;
    transition: width 0.05s linear;
    box-shadow: 0 0 8px rgba(129,140,248,0.5);
  }
  .trigger-val {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent2);
    margin-top: 6px;
    text-align: right;
  }

  /* ── Footer ── */
  .footer {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--surface);
  }
  .footer-text {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.6;
  }
  .footer-text strong {
    color: var(--text);
    font-weight: 600;
  }
  .footer-tag {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    color: var(--accent);
    background: rgba(56,189,248,0.06);
    border: 1px solid var(--border-bright);
    padding: 4px 8px;
    border-radius: 3px;
    white-space: nowrap;
  }
`;

const BUTTON_LABELS = [
  "A","B","X","Y","LB","RB","LT","RT","Select","Start",
  "L3","R3","D↑","D↓","D←","D→"
];

function AxisBar({ value }) {
  // value in [-1, 1]. Center at 50%.
  const center = 50;
  const pct = value * 50;
  const left = pct < 0 ? center + pct : center;
  const width = Math.abs(pct);
  return (
    <div className="axis-bar-bg">
      <div
        className="axis-bar-fill"
        style={{ left: `${left}%`, width: `${width}%` }}
      />
    </div>
  );
}

function StickCard({ label, x, y, pressed }) {
  const r = 55; // radius from center in px (circle is 120px → r=60, minus dot)
  const dotX = 60 + x * r;
  const dotY = 60 + y * r;

  return (
    <div className="card">
      <div className="card-label">{label}{pressed ? " · CLICK" : ""}</div>
      <div className="stick-wrap">
        <div className="stick-visual">
          <div className="stick-circle" style={{ border: pressed ? "1px solid var(--pressed)" : undefined }}>
            <div className="stick-line-h" />
            <div className="stick-line-v" />
            <div className="stick-trail" style={{ left: dotX, top: dotY }} />
            <div className="stick-ring" style={{ left: dotX, top: dotY }} />
            <div className="stick-dot" style={{ left: dotX, top: dotY }} />
          </div>
        </div>
        <div className="stick-data">
          <div className="axis-row">
            <div className="axis-header">
              <span className="axis-name">AXIS X</span>
              <span className="axis-num">{x >= 0 ? "+" : ""}{x.toFixed(3)}</span>
            </div>
            <AxisBar value={x} />
          </div>
          <div className="axis-row">
            <div className="axis-header">
              <span className="axis-name">AXIS Y</span>
              <span className="axis-num">{y >= 0 ? "+" : ""}{y.toFixed(3)}</span>
            </div>
            <AxisBar value={y} />
          </div>
          <div className="axis-row" style={{ marginTop: 4 }}>
            <div className="axis-header">
              <span className="axis-name">MAGNITUDE</span>
              <span className="axis-num">{Math.min(1, Math.sqrt(x*x+y*y)).toFixed(3)}</span>
            </div>
            <div className="axis-bar-bg">
              <div
                className="axis-bar-fill"
                style={{
                  left: 0,
                  width: `${Math.min(100, Math.sqrt(x*x+y*y)*100)}%`,
                  background: "var(--accent2)",
                  boxShadow: "0 0 6px var(--accent2)"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [axes, setAxes] = useState([0,0,0,0]);
  const [buttons, setButtons] = useState([]);
  const [triggers, setTriggers] = useState([0,0]);
  const [controllerId, setControllerId] = useState("No controller detected — press any button to connect");
  const [pressCount, setPressCount] = useState(0);
  const prevButtons = useRef([]);

  useEffect(() => {
    let raf;
    const update = () => {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        setControllerId(gp.id);
        setAxes([gp.axes[0]??0, gp.axes[1]??0, gp.axes[2]??0, gp.axes[3]??0]);
        const btns = gp.buttons.map(b => b.pressed);
        setButtons(btns);
        // LT / RT as analog
        setTriggers([gp.buttons[6]?.value??0, gp.buttons[7]?.value??0]);
        // count new presses
        const prev = prevButtons.current;
        const newPresses = btns.filter((v,i) => v && !prev[i]).length;
        if (newPresses > 0) setPressCount(c => c + newPresses);
        prevButtons.current = btns;
      }
      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, []);

  const [lx,ly,rx,ry] = axes;
  const activeCount = buttons.filter(Boolean).length;

  return (
    <div className="root">
      <style>{css}</style>
      <div className="shell">

        {/* Header */}
        <div className="header">
          <div className="header-left">
            <div className="badge">
              <div className="badge-dot" />
              Gamepad API · Live
            </div>
            <h1 className="title">Controller <span>Analyzer</span></h1>
            <div className="controller-id">{controllerId}</div>
          </div>
          <div className="header-stat">
            <span className="stat-label">Total Presses</span>
            <span className="stat-value">{String(pressCount).padStart(4,"0")}</span>
          </div>
        </div>

        <div className="divider" />

        {/* Analog Sticks */}
        <div className="grid-2">
          <StickCard label="LEFT STICK" x={lx} y={ly} pressed={buttons[10]} />
          <StickCard label="RIGHT STICK" x={rx} y={ry} pressed={buttons[11]} />
        </div>

        {/* Triggers */}
        <div className="triggers-row">
          {[["LEFT TRIGGER", triggers[0]], ["RIGHT TRIGGER", triggers[1]]].map(([label, val]) => (
            <div className="card trigger-card" key={label}>
              <div className="card-label">{label}</div>
              <div className="trigger-fill-bg">
                <div className="trigger-fill" style={{ width: `${val * 100}%` }} />
              </div>
              <div className="trigger-val">{(val * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="card buttons-card">
          <div className="card-label">
            Buttons &nbsp;·&nbsp;
            <span style={{ color: activeCount > 0 ? "var(--pressed)" : "var(--muted)" }}>
              {activeCount} active
            </span>
          </div>
          <div className="btn-grid">
            {BUTTON_LABELS.map((label, i) => (
              <div key={i} className={`btn-chip${buttons[i] ? " active" : ""}`}>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-text">
            <strong>Martin Gonzalez</strong> · Computer Science Student
            <br />
            Real-time controller diagnostics via the Web Gamepad API.
          </div>
          <div className="footer-tag">CS · Project</div>
        </div>

      </div>
    </div>
  );
}
