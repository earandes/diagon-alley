import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { RecoveryNotice } from '../../../src/arcana/presentation/RecoveryNotice';
import type { ClientSnapshot } from '../../../src/arcana/application/client/game-controller';
import type { PendingOperation } from '../../../src/arcana/application/client/ports';
import { CloseButton } from '../../../src/arcana/presentation/CloseButton';
import { seasonalOperationMessage } from '../../../src/arcana/presentation/seasonal-operation-message';

const pending: PendingOperation = {
  schemaVersion: 1,
  playerId: 'retained-owner',
  kind: 'purchase',
  command: {
    key: 'retained-key',
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
  error: 'INVALID_SESSION',
};
for (const language of ['es', 'en'] as const) {
  describe(`A92 contextual recovery ${language}`, () => {
    for (const retained of [null, pending])
      it(`offers sign-in without creating another player, pending=${!!retained}`, () => {
        const signIn = vi.fn(),
          enter = vi.fn();
        const before = JSON.stringify(retained);
        const html = renderToStaticMarkup(
          createElement(RecoveryNotice, {
            state: { ...state, pending: retained },
            language,
            onReload: vi.fn(),
            onRecover: vi.fn(),
            onEnter: enter,
            onSignIn: signIn,
          }),
        );
        expect(html).toContain(language === 'es' ? 'Volver a entrar' : 'Sign in again');
        if (retained) {
          expect(html).toContain(language === 'es' ? 'Recuperar operación' : 'Recover operation');
          expect(html).not.toContain('recovery-new-entry');
        }
        expect(enter).not.toHaveBeenCalled();
        expect(signIn).not.toHaveBeenCalled();
        expect(JSON.stringify(retained)).toBe(before);
      });
    it('does not offer authentication as a generic answer to every failure', () => {
      const html = renderToStaticMarkup(
        createElement(RecoveryNotice, {
          state: { ...state, error: 'INSUFFICIENT_CROWNS' },
          language,
          onReload: vi.fn(),
          onRecover: vi.fn(),
          onSignIn: vi.fn(),
        }),
      );
      expect(html).not.toContain(language === 'es' ? 'Volver a entrar' : 'Sign in again');
    });
    it('preserves a visible semantic close without a downloaded image', () => {
      const close = vi.fn(),
        label = language === 'es' ? 'Cerrar libro' : 'Close book';
      const html = renderToStaticMarkup(createElement(CloseButton, { label, onClose: close }));
      expect(html).toContain('type="button"');
      expect(html).toContain(`aria-label="${label}"`);
      expect(html).toContain('<svg');
      expect(html).not.toContain('<img');
      expect(close).not.toHaveBeenCalled();
    });
    it('localizes seasonal causes without reporting uncertain commits as rejected', () => {
      const uncertain = seasonalOperationMessage(language, 'UNKNOWN_COMMIT');
      const unavailable = seasonalOperationMessage(language, 'EVENT_UNAVAILABLE');
      const used = seasonalOperationMessage(language, 'EVENT_OPPORTUNITY_USED');
      expect(new Set([uncertain, unavailable, used]).size).toBe(3);
      for (const code of [
        'UNKNOWN_COMMIT',
        'NETWORK_ERROR',
        'EVENT_UNAVAILABLE',
        'EVENT_OPPORTUNITY_USED',
        'EVENT_CONDITION',
        'INVALID_SESSION',
        'STALE_TABLE',
        'UNEXPECTED',
      ]) {
        const message = seasonalOperationMessage(language, code);
        expect(message.length).toBeGreaterThan(10);
        expect(message).not.toContain(code);
      }
      expect(uncertain).toMatch(
        language === 'es' ? /comprobar|confirmar|inciert/ : /check|confirm|uncertain/,
      );
    });
  });
}
