import { MODELS } from '../controllers/index.js';
import { cls } from '../lib/cls.js';
import './ControllerSelector.css';

export default function ControllerSelector({ modelId, hint, onChoose }) {
  return (
    <nav className="selector" aria-label="Controller model">
      <div className="selector-inner">
        <div className="selector-tabs">
          {MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              className={cls('selector-tab', model.id === modelId && 'is-active')}
              aria-pressed={model.id === modelId}
              onClick={() => onChoose(model.id)}
            >
              {model.name}
            </button>
          ))}
        </div>
        <span className="selector-hint">{hint}</span>
      </div>
    </nav>
  );
}
