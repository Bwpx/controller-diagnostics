import { useEffect, useState, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700&display=swap');`;

const css = `
  ${FONTS}
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --mono: 'Share Tech Mono', monospace;
    --sans: 'Exo 2', sans-serif;
  }

  /* ── Light theme ── */
  .root.light {
    --bg: #dce3ee;
    --surface: #c8d2e0;
    --surface2: #bcc7d6;
    --border: rgba(44,123,229,0.18);
    --border-bright: rgba(44,123,229,0.4);
    --accent: #2c7be5;
    --accent2: #5a5fcf;
    --accent-glow: rgba(44,123,229,0.15);
    --pressed: #0e9e6e;
    --pressed-glow: rgba(14,158,110,0.3);
    --text: #1e2a3a;
    --muted: #4a5568;
    --bar-bg: rgba(0,0,0,0.12);
    --badge-bg: rgba(44,123,229,0.10);
    --tag-bg: rgba(44,123,229,0.08);
    --card-tint: rgba(44,123,229,0.04);
    --trigger-glow: rgba(90,95,207,0.35);
    --chip-active-bg: rgba(14,158,110,0.12);
    --chip-active-in: rgba(14,158,110,0.05);
    --toggle-bg: #b0bdd0;
    --toggle-knob: #fff;
  }

  /* ── Dark theme ── */
  .root.dark {
    --bg: #060a10;
    --surface: #0b1220;
    --surface2: #0f1a2e;
    --border: rgba(56,189,248,0.12);
    --border-bright: rgba(56,189,248,0.35);
    --accent: #38bdf8;
    --accent2: #818cf8;
    --accent-glow: rgba(56,189,248,0.2);
    --pressed: #34d399;
    --pressed-glow: rgba(52,211,153,0.4);
    --text: #e2e8f0;
    --muted: #475569;
    --bar-bg: rgba(255,255,255,0.07);
    --badge-bg: rgba(56,189,248,0.08);
    --tag-bg: rgba(56,189,248,0.06);
    --card-tint: rgba(56,189,248,0.03);
    --trigger-glow: rgba(129,140,248,0.45);
    --chip-active-bg: rgba(52,211,153,0.12);
    --chip-active-in: rgba(52,211,153,0.05);
    --toggle-bg: #1e3a5f;
    --toggle-knob: #38bdf8;
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
    transition: background 0.3s ease, color 0.3s ease;
  }

  .shell { width: 860px; max-width: 100%; }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 36px;
    gap: 20px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--accent);
    text-transform: uppercase;
    background: var(--badge-bg);
    border: 1px solid var(--border-bright);
    padding: 4px 10px;
    border-radius: 3px;
    margin-bottom: 10px;
    transition: background 0.3s, border-color 0.3s, color 0.3s;
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
  .title span { color: var(--accent); transition: color 0.3s; }
  .controller-id {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    margin-top: 8px;
    max-width: 380px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s;
  }

  /* ── Header right ── */
  .header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 14px;
    flex-shrink: 0;
  }
  .stat-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    color: var(--muted);
    text-transform: uppercase;
    transition: color 0.3s;
  }
  .stat-value {
    font-family: var(--mono);
    font-size: 22px;
    color: var(--accent);
    line-height: 1;
    transition: color 0.3s;
  }

  /* ── Toggle ── */
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }
  .toggle-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.1em;
    color: var(--muted);
    text-transform: uppercase;
    transition: color 0.3s;
    min-width: 28px;
    text-align: right;
  }
  .toggle-track {
    width: 40px;
    height: 22px;
    border-radius: 11px;
    background: var(--toggle-bg);
    border: 1px solid var(--border-bright);
    position: relative;
    transition: background 0.3s, border-color 0.3s;
  }
  .toggle-knob {
    position: absolute;
    top: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--toggle-knob);
    transition: left 0.3s cubic-bezier(.4,0,.2,1), background 0.3s;
  }
  .root.light .toggle-knob { left: 3px; }
  .root.dark  .toggle-knob { left: 21px; }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-bright), transparent);
    margin-bottom: 32px;
    transition: background 0.3s;
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
    transition: background 0.3s, border-color 0.3s;
  }
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--card-tint) 0%, transparent 60%);
    pointer-events: none;
    transition: background 0.3s;
  }
  .card-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.15em;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 20px;
    transition: color 0.3s;
  }

  /* ── Stick ── */
  .stick-wrap { display: flex; gap: 8px; align-items: flex-start; }
  .stick-visual { position: relative; flex-shrink: 0; }
  .stick-circle {
    width: 120px; height: 120px;
    border-radius: 50%;
    border: 1px solid var(--border-bright);
    position: relative;
    background: radial-gradient(circle at center, var(--accent-glow) 0%, transparent 70%);
    transition: background 0.3s, border-color 0.3s;
  }
  .stick-line-h {
    position: absolute;
    top: 50%; left: 0; right: 0;
    height: 1px;
    background: var(--border);
    transform: translateY(-50%);
    transition: background 0.3s;
  }
  .stick-line-v {
    position: absolute;
    left: 50%; top: 0; bottom: 0;
    width: 1px;
    background: var(--border);
    transform: translateX(-50%);
    transition: background 0.3s;
  }
  .stick-trail {
    position: absolute;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--accent-glow);
    transform: translate(-50%, -50%);
    transition: left 0.05s linear, top 0.05s linear;
    filter: blur(4px);
  }
  .stick-dot {
    position: absolute;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--accent);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 12px var(--accent), 0 0 4px var(--accent);
    transition: left 0.05s linear, top 0.05s linear, background 0.3s, box-shadow 0.3s;
  }
  .stick-ring {
    position: absolute;
    width: 22px; height: 22px;
    border-radius: 50%;
    border: 1px solid var(--accent);
    opacity: 0.2;
    transform: translate(-50%, -50%);
    transition: left 0.05s linear, top 0.05s linear, border-color 0.3s;
  }
  .stick-data { flex: 1; display: flex; flex-direction: column; gap: 8px; padding-top: 8px; }
  .axis-row { display: flex; flex-direction: column; gap: 4px; }
  .axis-header { display: flex; justify-content: space-between; align-items: center; }
  .axis-name { font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; color: var(--muted); transition: color 0.3s; }
  .axis-num { font-family: var(--mono); font-size: 11px; color: var(--accent); transition: color 0.3s; }
  .axis-bar-bg {
    height: 4px;
    background: var(--bar-bg);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
    transition: background 0.3s;
  }
  .axis-bar-fill {
    position: absolute;
    top: 0; height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: left 0.05s, width 0.05s, background 0.3s;
    box-shadow: 0 0 6px var(--accent);
  }

  /* ── Buttons ── */
  .buttons-card { margin-bottom: 20px; }
  .btn-grid { display: flex; flex-wrap: wrap; gap: 8px; }
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
    background: var(--chip-active-bg);
    border-color: var(--pressed);
    color: var(--pressed);
    box-shadow: 0 0 8px var(--pressed-glow), inset 0 0 8px var(--chip-active-in);
  }

  /* ── Triggers ── */
  .triggers-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .trigger-fill-bg {
    height: 8px;
    background: var(--bar-bg);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 12px;
    transition: background 0.3s;
  }
  .trigger-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent2), var(--accent));
    border-radius: 4px;
    transition: width 0.05s linear, background 0.3s;
    box-shadow: 0 0 8px var(--trigger-glow);
  }
  .trigger-val { font-family: var(--mono); font-size: 11px; color: var(--accent2); margin-top: 6px; text-align: right; transition: color 0.3s; }

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
    transition: background 0.3s, border-color 0.3s;
  }
  .footer-text { font-size: 12px; color: var(--muted); line-height: 1.6; transition: color 0.3s; }
  .footer-text strong { color: var(--text); font-weight: 600; }
  .footer-tag {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    color: var(--accent);
    background: var(--tag-bg);
    border: 1px solid var(--border-bright);
    padding: 4px 8px;
    border-radius: 3px;
    white-space: nowrap;
    transition: background 0.3s, border-color 0.3s, color 0.3s;
  }
`;

const BUTTON_LABELS = [
  "A","B","X","Y","LB","RB","LT","RT","Select","Start",
  "L3","R3","D↑","D↓","D←","D→"
];

function AxisBar({ value }) {
  const center = 50;
  const pct = value * 50;
  const left = pct < 0 ? center + pct : center;
  const width = Math.abs(pct);
  return (
    <div className="axis-bar-bg">
      <div className="axis-bar-fill" style={{ left: `${left}%`, width: `${width}%` }} />
    </div>
  );
}

function StickCard({ label, x, y, pressed }) {
  const r = 55;
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
  const [theme, setTheme] = useState("light");
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
        setTriggers([gp.buttons[6]?.value??0, gp.buttons[7]?.value??0]);
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
  const isDark = theme === "dark";

  return (
    <div className={`root ${theme}`}>
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

          <div className="header-right">
            <div style={{ textAlign: "right" }}>
              <div className="stat-label">Total Presses</div>
              <div className="stat-value">{String(pressCount).padStart(4,"0")}</div>
            </div>

            <div
              className="theme-toggle"
              onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              <span className="toggle-label">{isDark ? "Dark" : "Light"}</span>
              <div className="toggle-track">
                <div className="toggle-knob" />
              </div>
            </div>
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
            <div className="card" key={label}>
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
            <strong>Martin Gonzalez</strong> · Personal Project
            <br />
            Built for competitive gamers who need to detect stick drift and diagnose controller input in real time.
          </div>
          <div className="footer-tag">CS · Project</div>
        </div>

      </div>
    </div>
  );
}
