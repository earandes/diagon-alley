import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AccountAccess,
  accountRequest,
  readAccountSession,
} from '../../../src/arcana/presentation/AccountAccess';
import { accountError } from '../../../src/arcana/presentation/account-messages';

const props = {
  language: 'en' as const,
  initialMode: 'register' as const,
  session: { kind: 'guest' as const, playerId: 'guest-player' },
  playerId: 'guest-player',
  connected: true,
  onClose: () => {},
  beforeIdentityChange: async () => true,
  finishIdentityChange: async () => {},
  onSession: () => {},
};
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
describe('A76 account surfaces and transport', () => {
  it('bounds a retained authentication request without retrying or assuming it was rejected', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(
      (_url: string, options: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          options.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
    );
    vi.stubGlobal('fetch', fetcher);
    const pending = expect(
      accountRequest('login', { email: 'fixture@example.invalid' }),
    ).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
    await vi.advanceTimersByTimeAsync(15000);
    await pending;
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('registration requests email verification before collecting a password, in ES/EN', () => {
    for (const language of ['es', 'en'] as const) {
      const html = renderToStaticMarkup(createElement(AccountAccess, { ...props, language }));
      expect(html).toContain('data-account-dialog');
      expect(html).toContain('type="email"');
      expect(html).toContain('autoComplete="email"');
      expect(html).not.toContain('type="password"');
      expect(html).toContain(language === 'es' ? 'buzón local privado' : 'private local mailbox');
    }
  });
  it('login retains conventional credentials and explains a deliberate game switch', () => {
    const html = renderToStaticMarkup(
      createElement(AccountAccess, { ...props, initialMode: 'login' }),
    );
    expect(html).toContain('autoComplete="current-password"');
    expect(html).toContain('Open another saved game');
    expect(html).toContain('Collections are not merged');
    expect(html).not.toContain('type="checkbox"');
  });
  it('pending ownership permits same-player sign-in but offers no switch', () => {
    const html = renderToStaticMarkup(
      createElement(AccountAccess, { ...props, initialMode: 'login', pending: true }),
    );
    expect(html).toContain('same owner');
    expect(html).not.toContain('Open another saved game');
  });
  it('does not offer logout while an economic operation is pending', () => {
    const html = renderToStaticMarkup(
      createElement(AccountAccess, { ...props, initialMode: 'manage', pending: true }),
    );
    expect(html).toMatch(/<button[^>]*data-account-action="logout"[^>]*disabled=""/);
  });
  it('uses same-origin, non-cacheable auth transport without sending identity in query strings', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ accepted: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetcher);
    await accountRequest('register', { email: 'fixture@example.invalid' });
    expect(fetcher).toHaveBeenCalledWith(
      '/api/auth/register',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        body: JSON.stringify({ email: 'fixture@example.invalid' }),
      }),
    );
  });
  it('does not interpret unavailable or malformed identity as guest access', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ kind: 'account' }), { status: 200 })),
    );
    await expect(readAccountSession()).rejects.toMatchObject({ code: 'AUTH_UNAVAILABLE' });
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ error: { code: 'AUTH_UNAVAILABLE' } }), { status: 503 }),
        ),
    );
    await expect(readAccountSession()).rejects.toMatchObject({ code: 'AUTH_UNAVAILABLE' });
  });
  it('distinguishes uncertain transport from a credential rejection without exposing server internals', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network')));
    await expect(accountRequest('login', {})).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
    for (const language of ['es', 'en'] as const) {
      expect(accountError(language, 'NETWORK_ERROR')).not.toEqual(
        accountError(language, 'INVALID_CREDENTIALS'),
      );
      expect(accountError(language, 'unexpected-internal-detail')).not.toContain(
        'unexpected-internal-detail',
      );
    }
  });
});
