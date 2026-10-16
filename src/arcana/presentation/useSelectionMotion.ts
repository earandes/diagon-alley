import { useEffect, useRef } from 'react';
import { animate } from 'motion/mini';

/** Actual local signature changes only; initial inspection is static and never suggests a grant. */
export function useSelectionMotion<T extends HTMLElement = HTMLDivElement>(
  signature: string,
  reduced: boolean,
  durationMs = 160,
) {
  const element = useRef<T>(null);
  const previous = useRef(signature);
  useEffect(() => {
    if (previous.current === signature) return;
    previous.current = signature;
    if (reduced || document.hidden || !element.current) return;
    const animation = animate(
      element.current,
      { transform: ['translateY(3px)', 'translateY(0)'], opacity: [0.8, 1] },
      { duration: durationMs / 1000, ease: [0.16, 1, 0.3, 1] },
    );
    const hidden = () => {
      if (document.hidden) animation.cancel();
    };
    document.addEventListener('visibilitychange', hidden);
    return () => {
      animation.cancel();
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [signature, reduced, durationMs]);
  return element;
}
