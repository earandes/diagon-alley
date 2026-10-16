import { useEffect, useRef, useState } from 'react';
import {
  parseRoute,
  routeHash,
  type PresentationRoute,
  type View,
  type BazaarPlace,
} from './navigation';
export function useNavigation() {
  const [route, setRoute] = useState(() => parseRoute(location.hash));
  const previous = useRef(routeHash(route));
  useEffect(() => {
    const read = () => {
      const next = parseRoute(location.hash);
      const canonical = routeHash(next);
      if (location.hash !== canonical) history.replaceState(null, '', canonical);
      setRoute(next);
    };
    read();
    window.addEventListener('popstate', read);
    window.addEventListener('hashchange', read);
    return () => {
      window.removeEventListener('popstate', read);
      window.removeEventListener('hashchange', read);
    };
  }, []);
  const path = routeHash(route);
  useEffect(() => {
    if (previous.current !== path)
      document.getElementById('content')?.focus({ preventScroll: true });
    previous.current = path;
  }, [path]);
  const navigate = (next: PresentationRoute) => {
    const hash = routeHash(next);
    if (location.hash !== hash) history.pushState(null, '', hash);
    setRoute(next);
  };
  return {
    view: route.view,
    bazaarPlace: route.place,
    setView: (view: View) => navigate({ ...route, view }),
    setBazaarPlace: (place: BazaarPlace) => navigate({ view: 'shop', place }),
  };
}
