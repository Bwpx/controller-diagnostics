const PREFIX = 'controller-ui:';

function defaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

// localStorage can be missing or throw (private windows, blocked site data), so every access falls back quietly.
export function readJSON(key, fallback, storage = defaultStorage()) {
  try {
    const raw = storage?.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value, storage = defaultStorage()) {
  try {
    storage?.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Saving preferences is best-effort.
  }
}
