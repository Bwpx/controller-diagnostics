// Which controller drawing to show.
// Connected: the user's saved pick for this device, else the detected model.
// Disconnected: a model browsed since the controller dropped out, else the last device's model,
// else the preview restored from the previous session.
export function resolveModelId({ snapshot, picks, preview, detectedModel }) {
  const deviceModel = snapshot.id ? (picks[snapshot.id] ?? detectedModel) : null;
  if (snapshot.connected) return deviceModel;
  return preview.at === snapshot.connectCount || !deviceModel ? preview.id : deviceModel;
}

// Saved picks come from localStorage, so anything unexpected is dropped.
export function sanitizePicks(saved, isModelId) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
  return Object.fromEntries(Object.entries(saved).filter(([, id]) => isModelId(id)));
}
