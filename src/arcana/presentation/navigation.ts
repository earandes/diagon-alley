export type View = 'map' | 'collection' | 'shop' | 'missions' | 'battle';
export type BazaarPlace = 'street' | 'confectionery' | 'workshop' | 'vault';
export interface PresentationRoute {
  readonly view: View;
  readonly place: BazaarPlace;
}
const mapRoute: PresentationRoute = Object.freeze({ view: 'map', place: 'street' });
export function parseRoute(hash: string): PresentationRoute {
  const match = /^#\/(map|collection|missions|battle)$/.exec(hash);
  if (match) return Object.freeze({ view: match[1] as View, place: 'street' });
  const shop = /^#\/shop(?:\/(confectionery|workshop|vault))?$/.exec(hash);
  return shop
    ? Object.freeze({ view: 'shop', place: (shop[1] ?? 'street') as BazaarPlace })
    : mapRoute;
}
export function routeHash(route: PresentationRoute): string {
  return route.view === 'shop'
    ? route.place === 'street'
      ? '#/shop'
      : `#/shop/${route.place}`
    : `#/${route.view}`;
}
