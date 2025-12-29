import { useEffect } from 'react';

/**
 * Calls handler when a click occurs outside the referenced element(s).
 * @param refs - array of React refs to elements
 * @param handler - function to call on outside click
 * @param enabled - only active if true
 */
export function useClickOutside(
  refs: React.RefObject<HTMLElement>[],
  handler: (e: MouseEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;
    function listener(e: MouseEvent) {
      // If click is inside any of the refs, do nothing
      if (
        refs.some(
          (ref) => ref.current && ref.current.contains(e.target as Node)
        )
      ) {
        return;
      }
      handler(e);
    }
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [refs, handler, enabled]);
}
