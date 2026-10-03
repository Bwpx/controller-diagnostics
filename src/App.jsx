import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import TopBar from './components/TopBar.jsx';
import ControllerSelector from './components/ControllerSelector.jsx';
import Stage from './components/Stage.jsx';
import NoController from './components/NoController.jsx';
import BottomPanel from './components/BottomPanel.jsx';
import { getModel, isModelId } from './controllers/index.js';
import { detect } from './input/detect.js';
import { readJSON, writeJSON } from './input/storage.js';
import { resolveModelId, sanitizePicks } from './modelChoice.js';
import { applyTheme, getInitialTheme, saveTheme } from './theme.js';

const readPicks = () => sanitizePicks(readJSON('modelByDevice', {}), isModelId);

const readPreview = () => {
  const saved = readJSON('lastModel', null);
  return { id: isModelId(saved) ? saved : 'dualsense', at: 0 };
};

function downloadCsv(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'controller-session.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function App({ store }) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [theme, setTheme] = useState(getInitialTheme);
  const [picks, setPicks] = useState(readPicks);
  const [preview, setPreview] = useState(readPreview);

  const detection = useMemo(() => detect(snapshot.id), [snapshot.id]);
  const model = getModel(resolveModelId({ snapshot, picks, preview, detectedModel: detection.model }));

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    writeJSON('lastModel', model.id);
  }, [model.id]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
  };

  const chooseModel = (id) => {
    if (snapshot.connected) {
      const next = { ...picks, [snapshot.id]: id };
      setPicks(next);
      writeJSON('modelByDevice', next);
    } else {
      setPreview({ id, at: snapshot.connectCount });
    }
  };

  let hint = 'No controller';
  if (snapshot.connected) {
    hint = detection.xinput ? 'Detected: Xbox controller' : `Detected: ${getModel(detection.model).name}`;
  }

  return (
    <div className="app">
      <TopBar
        connected={snapshot.connected}
        pressCount={snapshot.pressCount}
        theme={theme}
        onToggleTheme={toggleTheme}
        recording={snapshot.recording}
        onStartRecording={store.startRecording}
        onStopRecording={store.stopRecording}
        onExport={() => downloadCsv(store.csv())}
      />
      <ControllerSelector modelId={model.id} hint={hint} onChoose={chooseModel} />
      <main className="app-main">
        <Stage model={model} snapshot={snapshot} heat={store.acc.heat}>
          {!snapshot.connected && <NoController />}
        </Stage>
        <BottomPanel store={store} snapshot={snapshot} model={model} />
      </main>
    </div>
  );
}
