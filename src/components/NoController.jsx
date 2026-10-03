import LabeledFrame from './LabeledFrame.jsx';

// Shown over the dimmed drawing until a controller connects. Browsers only expose a gamepad
// after one of its buttons has been pressed, hence the instruction.
export default function NoController() {
  return (
    <div className="no-controller" role="status">
      <LabeledFrame surface="stage" title="No controller">
        <p className="no-controller-text">Connect a controller and press any button.</p>
      </LabeledFrame>
    </div>
  );
}
