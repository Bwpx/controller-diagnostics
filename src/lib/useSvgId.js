import { useId } from 'react';

// A unique id that is safe inside url(#…) references.
export function useSvgId(prefix) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}
