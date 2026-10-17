import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';
import { accountError, accountText as a } from './account-messages';
import './accounts.css';

export interface AccountSession {
  readonly kind: 'anonymous' | 'guest' | 'account';
  readonly playerId?: string;
  readonly email?: string;
}
export type AccountMode = 'register' | 'login' | 'manage';
type Step = AccountMode | 'verify' | 'request-reset' | 'reset';
export class AccountRequestError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}
/** No tokens or passwords are persisted by this transport. */
export async function accountRequest<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 15000);
  try {
    const response = await fetch(`/api/auth/${path}`, {
      method: body ? 'POST' : 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      signal: abort.signal,
      ...(body
        ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        : {}),
    });
    const value = await response.json().catch(() => null);
    if (!response.ok) throw new AccountRequestError(value?.error?.code ?? 'AUTH_UNAVAILABLE');
    if (!value || typeof value !== 'object') throw new AccountRequestError('AUTH_UNAVAILABLE');
    return value as T;
  } catch (error) {
    if (error instanceof AccountRequestError) throw error;
    throw new AccountRequestError('NETWORK_ERROR');
  } finally {
    clearTimeout(timer);
  }
}
export async function readAccountSession(): Promise<AccountSession> {
  const value = await accountRequest<AccountSession>('session');
  if (
    !['anonymous', 'guest', 'account'].includes(value.kind) ||
    (value.kind !== 'anonymous' && typeof value.playerId !== 'string')
  )
    throw new AccountRequestError('AUTH_UNAVAILABLE');
  return value;
}

export function AccountAccess({
  language,
  initialMode,
  session,
  playerId,
  ownerForRequest,
  pending = false,
  connected,
  onClose,
  beforeIdentityChange,
  finishIdentityChange,
  onSession,
  onAccessReset,
}: {
  language: Language;
  initialMode: AccountMode;
  session: AccountSession | null;
  playerId?: string;
  ownerForRequest?: () => string | undefined;
  pending?: boolean;
  connected: boolean;
  onClose: () => void;
  beforeIdentityChange: (samePlayerOnly: boolean) => Promise<boolean>;
  finishIdentityChange: (
    outcome: 'cancel' | 'authenticated' | 'signed-out' | 'uncertain',
    samePlayerOnly: boolean,
    expectedPlayerId?: string,
  ) => Promise<void>;
  onSession: (session: AccountSession) => void;
  onAccessReset?: () => Promise<void>;
}) {
  const [step, setStep] = useState<Step>(initialMode),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [token, setToken] = useState(''),
    [showPassword, setShowPassword] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null),
    [notice, setNotice] = useState<'mailSent' | 'resetDone' | 'resetUncertain' | null>(null),
    [allowSwitch, setAllowSwitch] = useState(false),
    [uncertain, setUncertain] = useState<'authenticated' | 'signed-out' | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    mutex = useRef(false),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const origin = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const element = dialog.current;
    element?.showModal();
    return () => {
      mounted.current = false;
      if (element?.open) element.close();
      if (origin?.isConnected) origin.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    dialog.current?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
  }, [step]);
  useEffect(() => {
    if (step === 'manage' && session && session.kind !== 'account' && !mutex.current)
      setStep('login');
  }, [session, step]);
  const move = (next: Step) => {
    if (mutex.current) return;
    setStep(next);
    setError(null);
    setNotice(null);
    setPassword('');
    setToken('');
    setAllowSwitch(false);
  };
  const close = () => {
    if (!mutex.current) onClose();
  };
  const samePlayerOnly = !allowSwitch || pending;
  const run = async (action: () => Promise<void>) => {
    if (mutex.current || !connected) return;
    mutex.current = true;
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (reason) {
      if (mounted.current)
        setError(reason instanceof AccountRequestError ? reason.code : 'AUTH_UNAVAILABLE');
    } finally {
      mutex.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  const identity = async (path: 'verify' | 'login' | 'logout', fields: Record<string, unknown>) => {
    const restricted = path === 'login' ? samePlayerOnly : false;
    if (!(await beforeIdentityChange(restricted)))
      throw new AccountRequestError('OPERATION_PENDING');
    let outcome: 'cancel' | 'authenticated' | 'signed-out' | 'uncertain' = 'cancel';
    try {
      const expectedOwner = ownerForRequest?.() ?? playerId;
      const confirmation = await accountRequest<{ playerId?: string }>(path, {
        ...fields,
        ...(expectedOwner ? { expectedPlayerId: expectedOwner } : {}),
        allowPlayerChange: !samePlayerOnly,
      });
      if (path !== 'logout' && typeof confirmation.playerId !== 'string')
        throw new AccountRequestError('AUTH_UNAVAILABLE');
      outcome = path === 'logout' ? 'signed-out' : 'authenticated';
      await finishIdentityChange(outcome, restricted, confirmation.playerId);
      outcome = 'cancel';
      const current = await readAccountSession();
      if (path !== 'logout' && current.playerId !== confirmation.playerId) {
        outcome = 'uncertain';
        setUncertain('authenticated');
        throw new AccountRequestError('PLAYER_MISMATCH');
      }
      onSession(current);
      onClose();
    } catch (reason) {
      if (
        reason instanceof AccountRequestError &&
        ['NETWORK_ERROR', 'STORAGE', 'AUTH_UNAVAILABLE'].includes(reason.code)
      ) {
        setUncertain(path === 'logout' ? 'signed-out' : 'authenticated');
        outcome = 'uncertain';
      }
      throw reason;
    } finally {
      if (outcome === 'cancel' || outcome === 'uncertain')
        await finishIdentityChange(outcome, restricted);
    }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void run(async () => {
      if (step === 'login') await identity('login', { email, password });
      else if (step === 'verify') await identity('verify', { token, password });
      else if (step === 'register') {
        if (pending) throw new AccountRequestError('OPERATION_PENDING');
        if (!(await beforeIdentityChange(false)))
          throw new AccountRequestError('OPERATION_PENDING');
        try {
          await accountRequest('register', {
            email,
            ...((ownerForRequest?.() ?? playerId)
              ? { expectedPlayerId: ownerForRequest?.() ?? playerId }
              : {}),
            allowPlayerChange: false,
          });
        } finally {
          await finishIdentityChange('cancel', false);
        }
        setNotice('mailSent');
        setPassword('');
      } else if (step === 'request-reset') {
        await accountRequest('request-reset', { email });
        setNotice('mailSent');
      } else if (step === 'reset') {
        try {
          await accountRequest('reset', { token, password });
        } catch (reason) {
          if (
            reason instanceof AccountRequestError &&
            ['NETWORK_ERROR', 'STORAGE', 'AUTH_UNAVAILABLE'].includes(reason.code)
          ) {
            setStep('login');
            setToken('');
            setPassword('');
            setNotice('resetUncertain');
            await onAccessReset?.();
            return;
          }
          throw reason;
        }
        await onAccessReset?.();
        setPassword('');
        setToken('');
        setStep('login');
        setNotice('resetDone');
      }
    });
  };
  const checkSession = () =>
    void run(async () => {
      const current = await readAccountSession();
      if (
        current.kind !== 'anonymous' &&
        playerId &&
        current.playerId !== playerId &&
        samePlayerOnly
      )
        throw new AccountRequestError('PLAYER_MISMATCH');
      if (!(await beforeIdentityChange(samePlayerOnly)))
        throw new AccountRequestError('OPERATION_PENDING');
      try {
        if (uncertain === 'signed-out' && current.kind === 'anonymous') {
          await finishIdentityChange('signed-out', samePlayerOnly);
          onSession(current);
          onClose();
        } else if (current.kind === 'account') {
          await finishIdentityChange('authenticated', samePlayerOnly);
          onSession(current);
          onClose();
        } else {
          await finishIdentityChange('cancel', samePlayerOnly);
          setUncertain(null);
          setError(null);
          onSession(current);
        }
      } catch (reason) {
        await finishIdentityChange('cancel', samePlayerOnly);
        throw reason;
      }
    });
  const passwordNeeded = ['login', 'verify', 'reset'].includes(step);
  const title =
    step === 'verify'
      ? 'verifyTitle'
      : step === 'request-reset' || step === 'reset'
        ? 'resetTitle'
        : step === 'manage'
          ? 'account'
          : step;
  return (
    <dialog
      ref={dialog}
      className="account-access"
      data-account-dialog
      aria-labelledby="account-title"
      aria-busy={busy}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        close();
      }}
    >
      <button
        type="button"
        className="account-close game-object"
        onClick={close}
        disabled={busy}
        aria-label={a(language, 'close')}
      >
        <Artwork asset="ui.pass" language={language} decorative />
      </button>
      <header className="account-heading">
        <Artwork asset="ui.missions" language={language} decorative />
        <h2 id="account-title">{a(language, title)}</h2>
      </header>
      {step === 'manage' ? (
        <section className="account-management">
          <p className="account-email">{session?.email}</p>
          <p>{a(language, 'linked')}</p>
          <p>{a(language, 'logoutHelp')}</p>
          <button
            type="button"
            data-account-action="logout"
            disabled={busy || !connected || pending || !!uncertain}
            onClick={() => void run(() => identity('logout', {}))}
          >
            {a(language, 'logout')}
          </button>
          <button
            type="button"
            className="account-link"
            onClick={() => move('request-reset')}
            disabled={busy}
          >
            {a(language, 'resetTitle')}
          </button>
        </section>
      ) : (
        <form onSubmit={submit} data-account-action={step}>
          {step === 'register' && <p className="account-intro">{a(language, 'registerHelp')}</p>}
          {['register', 'login', 'request-reset'].includes(step) && (
            <label htmlFor="account-email">
              {a(language, 'email')}
              <input
                id="account-email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={254}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={busy}
              />
            </label>
          )}
          {['verify', 'reset'].includes(step) && (
            <label htmlFor="account-token">
              {a(language, 'token')}
              <input
                id="account-token"
                name="token"
                type="text"
                autoComplete="one-time-code"
                autoCapitalize="none"
                spellCheck={false}
                required
                maxLength={64}
                value={token}
                onChange={(event) => setToken(event.target.value)}
                disabled={busy}
              />
            </label>
          )}
          {passwordNeeded && (
            <div className="account-password">
              <label htmlFor="account-password">
                {a(language, 'password')}
                <input
                  id="account-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={step === 'login' ? 'current-password' : 'new-password'}
                  minLength={step === 'login' ? 1 : 15}
                  maxLength={128}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={busy}
                  aria-describedby={step === 'login' ? undefined : 'account-password-hint'}
                />
              </label>
              <button
                type="button"
                className="account-link"
                aria-controls="account-password"
                aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}
                disabled={busy}
              >
                {a(language, showPassword ? 'hide' : 'show')}
              </button>
              {step !== 'login' && <p id="account-password-hint">{a(language, 'passwordHint')}</p>}
            </div>
          )}
          {step === 'login' && playerId && (
            <section className="account-switch">
              <p>
                {a(
                  language,
                  pending
                    ? 'pending'
                    : session?.kind === 'guest'
                      ? 'switchHelp'
                      : 'switchAccountHelp',
                )}
              </p>
              {!pending && (
                <button
                  type="button"
                  className="account-link"
                  aria-pressed={allowSwitch}
                  disabled={busy}
                  onClick={() => setAllowSwitch(!allowSwitch)}
                >
                  {a(language, allowSwitch ? 'sameOwner' : 'allowSwitch')}
                </button>
              )}
              {allowSwitch && <p role="status">{a(language, 'switchChosen')}</p>}
            </section>
          )}
          {notice && (
            <p role="status" className="account-notice">
              {a(language, notice)}
            </p>
          )}
          <button
            type="submit"
            className="account-primary"
            data-account-action={`${step}-submit`}
            disabled={busy || !connected || !!uncertain || (step === 'register' && pending)}
          >
            {a(
              language,
              busy
                ? 'sending'
                : step === 'request-reset'
                  ? 'requestReset'
                  : step === 'verify'
                    ? 'verify'
                    : step === 'reset'
                      ? 'reset'
                      : step === 'register'
                        ? 'register'
                        : 'login',
            )}
          </button>
          {step === 'register' && (
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move('verify')}
            >
              {a(language, 'haveCode')}
            </button>
          )}
          {step === 'request-reset' && (
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move('reset')}
            >
              {a(language, 'haveCode')}
            </button>
          )}
          {step === 'login' && (
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move('request-reset')}
            >
              {a(language, 'forgot')}
            </button>
          )}
          {step !== 'login' && (
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move('login')}
            >
              {a(language, 'login')}
            </button>
          )}
          {step === 'login' && (
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain || pending}
              onClick={() => move('register')}
            >
              {a(language, 'register')}
            </button>
          )}
        </form>
      )}
      {busy && <p role="status">{a(language, 'sending')}</p>}
      {!connected && <p role="status">{a(language, 'offline')}</p>}
      {error && (
        <p role="alert" className="account-error">
          {accountError(language, error)}
        </p>
      )}
      {uncertain && (
        <button type="button" disabled={busy || !connected} onClick={checkSession}>
          {a(language, 'check')}
        </button>
      )}
      <button type="button" className="account-link account-back" disabled={busy} onClick={close}>
        {a(language, 'cancel')}
      </button>
    </dialog>
  );
}
