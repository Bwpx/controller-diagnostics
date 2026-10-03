// Safe reads from a snapshot's button list. Controllers that report fewer buttons read as released.
export const pressedAt = (buttons, i) => Boolean(buttons[i]?.pressed);

export const valueAt = (buttons, i) => {
  const v = buttons[i]?.value;
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
};

// Standard-mapping indices 12-15.
export const dpadAt = (buttons) => ({
  up: pressedAt(buttons, 12),
  down: pressedAt(buttons, 13),
  left: pressedAt(buttons, 14),
  right: pressedAt(buttons, 15),
});
