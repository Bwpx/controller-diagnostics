import { useState } from 'react';
import HistoryGraph from './HistoryGraph.jsx';
import HeatmapsTab from './HeatmapsTab.jsx';
import ButtonsTab from './ButtonsTab.jsx';
import AboutTab from './AboutTab.jsx';
import { cls } from '../lib/cls.js';
import './BottomPanel.css';

const TABS = [
  ['history', 'Input history'],
  ['heatmaps', 'Heatmaps'],
  ['buttons', 'Buttons'],
  ['about', 'About'],
];

const NO_DRIFT = { left: false, right: false };

export default function BottomPanel({ store, snapshot, model }) {
  const [tab, setTab] = useState('history');
  const drift = snapshot.connected ? snapshot.drift : NO_DRIFT;
  return (
    <section className="panel" aria-label="Details">
      <div className="panel-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls="panel-body"
            className={cls('tab-btn', tab === id && 'is-active')}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="panel-body" id="panel-body" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'history' && <HistoryGraph history={store.acc.history} drift={drift} />}
        {tab === 'heatmaps' && <HeatmapsTab heat={store.acc.heat} onReset={store.resetHeatmap} />}
        {tab === 'buttons' && <ButtonsTab snapshot={snapshot} model={model} />}
        {tab === 'about' && <AboutTab />}
      </div>
    </section>
  );
}
