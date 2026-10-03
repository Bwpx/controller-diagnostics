import './TopBar.css';

export default function TopBar({
  connected,
  pressCount,
  theme,
  onToggleTheme,
  recording,
  onStartRecording,
  onStopRecording,
  onExport,
}) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <h1 className="topbar-title">Controller Analyzer</h1>
        <div className="topbar-actions">
          {connected && (
            <span className="topbar-count num">
              {pressCount.toLocaleString()} {pressCount === 1 ? 'press' : 'presses'}
            </span>
          )}
          <button type="button" className="link-btn" onClick={onToggleTheme} title={`Switch to ${nextTheme} theme`}>
            {nextTheme === 'light' ? 'Light' : 'Dark'}
          </button>
          {recording.active ? (
            // Never disabled: a recording must be stoppable even after the controller drops out.
            <button type="button" className="btn" onClick={onStopRecording}>
              Stop · <span className="num">{recording.frames.toLocaleString()}</span> frames
            </button>
          ) : (
            <button type="button" className="btn" onClick={onStartRecording} disabled={!connected}>
              Record
            </button>
          )}
          {!recording.active && recording.frames > 0 && (
            <button type="button" className="btn" onClick={onExport}>
              Export CSV
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
