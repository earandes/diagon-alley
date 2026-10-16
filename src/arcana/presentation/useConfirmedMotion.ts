import { useEffect, useRef, useState } from 'react';
import { claimVisualEvent } from './visual-history';

/** A short visual acknowledgement. Hidden/reduced events settle immediately, never defer a celebration. */
export function useConfirmedMotion(
  namespace: string,
  id: string | undefined,
  enabled: boolean,
  reduced: boolean,
  durationMs = 300,
) {
  const [shown, setShown] = useState<string | null>(null);
  const active = useRef<{ id: string; until: number } | null>(null);
  useEffect(() => {
    if (!id || !enabled) {
      setShown(null);
      return;
    }
    const fresh = claimVisualEvent(namespace, id);
    if (reduced || document.hidden) {
      active.current = null;
      setShown(null);
      return;
    }
    if (fresh)
      active.current = { id, until: performance.now() + Math.min(500, Math.max(0, durationMs)) };
    const event = active.current;
    if (!event || event.id !== id || event.until <= performance.now()) {
      setShown(null);
      return;
    }
    setShown(id);
    const finish = () => {
      active.current = null;
      setShown(null);
    };
    const timer = window.setTimeout(finish, Math.max(0, event.until - performance.now()));
    const visibility = () => {
      if (document.hidden) finish();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [namespace, id, enabled, reduced, durationMs]);
  return shown === id;
}
