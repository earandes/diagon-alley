import { useEffect, useState } from 'react';
export function useReducedMotion() {
  const [system, setSystem] = useState(
      () =>
        typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    ),
    [own, setOwn] = useState(() => {
      try {
        return localStorage.getItem('arcana-reduced-motion') === 'true';
      } catch {
        return false;
      }
    });
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const query = matchMedia('(prefers-reduced-motion: reduce)'),
      change = () => setSystem(query.matches);
    const preference = (event: Event) => setOwn((event as CustomEvent<boolean>).detail);
    query.addEventListener('change', change);
    window.addEventListener('arcana-motion-preference', preference);
    return () => {
      query.removeEventListener('change', change);
      window.removeEventListener('arcana-motion-preference', preference);
    };
  }, []);
  const change = (value: boolean) => {
    setOwn(value);
    window.dispatchEvent(new CustomEvent('arcana-motion-preference', { detail: value }));
    try {
      localStorage.setItem('arcana-reduced-motion', String(value));
    } catch {
      /* Optional preference. */
    }
  };
  return { reduced: system || own, system, own, change };
}
