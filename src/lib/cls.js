// Joins the truthy class names.
export const cls = (...names) => names.filter(Boolean).join(' ');
