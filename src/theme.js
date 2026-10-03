import { readJSON, writeJSON } from './input/storage.js';

// The saved choice wins; on first launch follow the operating system setting.
export function getInitialTheme() {
  const saved = readJSON('theme', null);
  if (saved === 'dark' || saved === 'light') return saved;
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

export function saveTheme(theme) {
  writeJSON('theme', theme);
}
