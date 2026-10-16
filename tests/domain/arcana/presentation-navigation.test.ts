import { describe, expect, it } from 'vitest';
import { parseRoute, routeHash } from '../../../src/arcana/presentation/navigation';
import { operationErrorKey } from '../../../src/arcana/presentation/operation-error';
import { text } from '../../../src/arcana/presentation/translations';
describe('presentation routes', () => {
  it('round trips every screen and bazaar place without economic data', () => {
    for (const hash of [
      '#/map',
      '#/collection',
      '#/missions',
      '#/battle',
      '#/shop',
      '#/shop/confectionery',
      '#/shop/workshop',
      '#/shop/vault',
    ])
      expect(routeHash(parseRoute(hash))).toBe(hash);
  });
  it('normalizes root, shorthand bazaar and invalid external or parameterized routes', () => {
    expect(routeHash(parseRoute(''))).toBe('#/map');
    expect(parseRoute('#/shop')).toEqual({ view: 'shop', place: 'street' });
    for (const hash of [
      '#https://other.test',
      '#/shop/invented',
      '#/map?seed=3',
      '#/battle/secret',
      '#/collection/',
    ])
      expect(routeHash(parseRoute(hash))).toBe('#/map');
  });
});
describe('operation error messages', () => {
  it('explains critical failures with complete es/en messages', () => {
    for (const [code, key] of [
      ['INSUFFICIENT_ESSENCE', 'errorEssence'],
      ['INVALID_FORMATION', 'errorFormation'],
      ['STALE_TABLE', 'errorVersion'],
      ['INSUFFICIENT_CROWNS', 'errorCrowns'],
      ['INSUFFICIENT_KEYS', 'errorKeys'],
      ['CLIENT_STORAGE', 'errorClientStorage'],
      ['UNKNOWN_COMMIT', 'errorUncertain'],
      ['UNIT_UNAVAILABLE', 'errorUnit'],
      ['UNAUTHORIZED', 'errorSession'],
    ] as const) {
      expect(operationErrorKey(code)).toBe(key);
      for (const language of ['es', 'en'] as const)
        expect(text(language, operationErrorKey(code)).length).toBeGreaterThan(30);
    }
  });
  it('never claims success or rejection for unknown failures', () => {
    expect(operationErrorKey('NEW_SERVER_ERROR')).toBe('errorReview');
    expect(operationErrorKey('NETWORK_ERROR')).toBe('errorUncertain');
  });
});
