import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RecoveryNotice } from '../../../src/arcana/presentation/RecoveryNotice';
import type { ClientSnapshot } from '../../../src/arcana/application/client/game-controller';
import type { PendingOperation } from '../../../src/arcana/application/client/ports';
const pending: PendingOperation = {
  schemaVersion: 1,
  playerId: 'player',
  kind: 'purchase',
  command: {
    key: 'same-key',
    expectedRevision: 1,
    request: { product: 'cacao-toad', quantity: 1, priceVersion: 1 },
  },
};
const state: ClientSnapshot = {
  status: 'error',
  game: null,
  content: null,
  serverTime: null,
  energy: null,
  refreshingStatus: false,
  statusError: null,
  pending: null,
  receipt: null,
  error: 'UNAUTHORIZED',
};
const props = {
  state,
  language: 'en' as const,
  onReload: () => {},
  onRecover: () => {},
  onEnter: () => {},
};
describe('A75 recovery action availability', () => {
  it('does not offer another trial while an uncertain request remains', () => {
    const html = renderToStaticMarkup(
      createElement(RecoveryNotice, {
        ...props,
        state: { ...state, pending, status: 'recovery-required' },
      }),
    );
    expect(html).toContain('Recover operation');
    expect(html).not.toContain('Enter another trial');
    expect(html).toContain('request is retained');
  });
  it('keeps the consultation visible but disabled offline', () => {
    const html = renderToStaticMarkup(
      createElement(RecoveryNotice, { ...props, connected: false }),
    );
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Check session<\/button>/);
    expect(html).toContain('Offline.');
  });
  it('offers an explicitly explained entry when no operation is pending, in both languages', () => {
    for (const language of ['es', 'en'] as const) {
      const html = renderToStaticMarkup(createElement(RecoveryNotice, { ...props, language }));
      expect(html).toContain(
        language === 'es' ? 'sin trasladar sus recursos' : 'without transferring its resources',
      );
      expect(html).toContain('role="alert"');
    }
  });
  it('does not render another alert in a lower inactive context', () => {
    expect(
      renderToStaticMarkup(createElement(RecoveryNotice, { ...props, announce: false })),
    ).not.toContain('role="alert"');
  });
});
