import { cls } from '../lib/cls.js';
import './LabeledFrame.css';

// Square frame with its title set into the top border and small corner ticks, like a panel on test equipment.
// `surface` picks the colors: "stage" sits on the platform color, "frame" on the page background.
export default function LabeledFrame({ title, value, valueInverse = false, surface = 'frame', className, children }) {
  return (
    <section className={cls('lf', `lf--${surface}`, className)}>
      <header className="lf-head">
        <h3 className="lf-title">{title}</h3>
        {value != null && <span className={cls('lf-value', valueInverse && 'is-inverse')}>{value}</span>}
      </header>
      {children}
      <span className="lf-tick lf-tick--left" aria-hidden="true" />
      <span className="lf-tick lf-tick--right" aria-hidden="true" />
    </section>
  );
}
