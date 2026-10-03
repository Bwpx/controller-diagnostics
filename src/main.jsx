import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';
import { createInputStore } from './input/inputStore.js';
import { demoSource, realSource } from './input/gamepadSource.js';
import { applyTheme, getInitialTheme } from './theme.js';

// `?demo` or `?demo=<model id>` swaps the real controller for a scripted one.
const params = new URLSearchParams(window.location.search);
const demo = params.has('demo') ? params.get('demo') || 'dualsense' : null;

const store = createInputStore(demo ? demoSource(demo) : realSource());
store.start();

// Set before the first render so the page never flashes the wrong theme.
applyTheme(getInitialTheme());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App store={store} />
  </StrictMode>,
);
