import LabeledFrame from './LabeledFrame.jsx';

const AXIS_NAMES = ['Left X', 'Left Y', 'Right X', 'Right Y'];

const signed = (v) => `${v < 0 ? '−' : '+'}${Math.abs(v).toFixed(3)}`;
const unit = (v) => Math.min(1, Math.max(0, v));

// Raw input, by standard-mapping index. The fallback view when the drawing does not match a controller.
export default function ButtonsTab({ snapshot, model }) {
  if (!snapshot.connected) {
    return <p className="empty">Connect a controller to see its raw buttons and axes.</p>;
  }
  const { buttons, axes } = snapshot;
  const pressedCount = buttons.filter((b) => b.pressed).length;
  return (
    <div className="panel-grid">
      <LabeledFrame title="Buttons" value={`${pressedCount} pressed`}>
        <table className="raw-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>#</th>
              <th>State</th>
              <th className="raw-value">Value</th>
            </tr>
          </thead>
          <tbody>
            {buttons.map((button, i) => (
              <tr key={i} className={button.pressed ? 'is-on' : undefined}>
                <td>{model.buttonNames[i] ?? `Button ${i}`}</td>
                <td className="num">{i}</td>
                <td>{button.pressed ? 'Pressed' : 'Released'}</td>
                <td className="raw-value">
                  <span className="raw-value-cell">
                    <span className="num">{button.value.toFixed(2)}</span>
                    <span className="bar">
                      <i style={{ left: 0, width: `${unit(button.value) * 100}%` }} />
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LabeledFrame>

      <LabeledFrame title="Axes" value={`${axes.length} reported`}>
        <table className="raw-table">
          <thead>
            <tr>
              <th>Axis</th>
              <th>#</th>
              <th className="raw-value">Value</th>
            </tr>
          </thead>
          <tbody>
            {axes.map((value, i) => {
              const half = unit(Math.abs(value)) * 50;
              return (
                <tr key={i} className={Math.abs(value) > 0.01 ? 'is-on' : undefined}>
                  <td>{AXIS_NAMES[i] ?? `Axis ${i}`}</td>
                  <td className="num">{i}</td>
                  <td className="raw-value">
                    <span className="raw-value-cell">
                      <span className="num">{signed(value)}</span>
                      <span className="bar bar--center">
                        <i style={{ left: `${value < 0 ? 50 - half : 50}%`, width: `${half}%` }} />
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </LabeledFrame>
    </div>
  );
}
