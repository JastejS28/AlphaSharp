import { useEffect, useRef } from 'react';

/**
 * Hook to automatically refresh data at specified intervals
 * @param {Function} callback - Function to call on refresh
 * @param {number} intervalMs - Interval in milliseconds
 * @param {boolean} enabled - Whether auto-refresh is enabled
 */
export function useAutoRefresh(callback, intervalMs = 60000, enabled = true) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}
