import { validPassword } from '../application/identity/password-policy';
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
  returnFocus,
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
  returnFocus?: HTMLElement | null;
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
    const origin =
      returnFocus ??
      (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const element = dialog.current;
    element?.showModal();
    return () => {
      mounted.current = false;
      if (element?.open) element.close();
      if (origin?.isConnected) origin.focus({ preventScroll: true });
      else document.getElementById('content')?.focus({ preventScroll: true });
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
    setShowPassword(false);
    setAllowSwitch(false);
  };
  const moveAfterRequest = (next: 'verify' | 'reset') => {
    setStep(next);
    setNotice('mailSent');
    setPassword('');
    setToken('');
    setShowPassword(false);
  };
  const errorRegion = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (!error || busy) return;
    errorRegion.current?.focus({ preventScroll: true });
    errorRegion.current?.scrollIntoView({ block: 'nearest' });
  }, [error, busy]);
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
      if (mounted.current) {
        const code = reason instanceof AccountRequestError ? reason.code : 'AUTH_UNAVAILABLE';
        setError(
          ['register', 'request-reset'].includes(step) && code === 'NETWORK_ERROR'
            ? 'MAIL_REQUEST_UNCERTAIN'
            : code,
        );
      }
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
    if (uncertain) return;
    void run(async () => {
      if (['login', 'verify', 'reset'].includes(step) && !validPassword(password))
        throw new AccountRequestError('PASSWORD_POLICY');
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
        moveAfterRequest('verify');
      } else if (step === 'request-reset') {
        await accountRequest('request-reset', { email });
        moveAfterRequest('reset');
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
            setShowPassword(false);
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
        setShowPassword(false);
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
  const codeStep = step === 'verify' || step === 'reset';
  const repairOwner =
    step === 'login' && ['PLAYER_MISMATCH', 'ACCOUNT_CONFLICT'].includes(error ?? '');
  const repairCode = [
    'INVALID_TOKEN',
    'GUEST_SESSION_REQUIRED',
    'PLAYER_MISMATCH',
    'ACCOUNT_CONFLICT',
  ].includes(error ?? '');
  const helpBeforeAction = step === 'login' && (repairOwner || allowSwitch);
  const title =
    step === 'verify'
      ? 'verifyTitle'
      : step === 'request-reset' || step === 'reset'
        ? 'resetTitle'
        : step === 'manage'
          ? 'account'
          : step;
  const emblem =
    step === 'register'
      ? 'ui.collection'
      : step === 'login'
        ? 'ui.map'
        : step === 'manage'
          ? 'ui.seal'
          : 'ui.missions';
  const errorMessage = error && (
    <p ref={errorRegion} tabIndex={-1} role="alert" className="account-error">
      {step === 'login' && error === 'INVALID_CREDENTIALS'
        ? a(language, 'loginInvalid')
        : accountError(language, error)}
    </p>
  );
  const help = (
    <details
      key={step}
      className="account-help"
      open={repairOwner || repairCode || allowSwitch || undefined}
    >
      <summary>
        {a(
          language,
          step === 'register'
            ? 'registerOptions'
            : step === 'login'
              ? 'loginOptions'
              : step === 'manage'
                ? 'manageOptions'
                : 'codeOptions',
        )}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m8 4 8 8-8 8" />
        </svg>
      </summary>
      <div className="account-help-content">
        {step === 'register' && (
          <>
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move('login')}
            >
              {a(language, 'login')}
            </button>
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move('verify')}
            >
              {a(language, 'haveCode')}
            </button>
            <p>{a(language, 'registerHelp')}</p>
          </>
        )}
        {step === 'login' && (
          <>
            {playerId && !pending && (
              <section className="account-switch">
                <p>{a(language, session?.kind === 'guest' ? 'switchHelp' : 'switchAccountHelp')}</p>
                <button
                  type="button"
                  className="account-link"
                  aria-pressed={allowSwitch}
                  disabled={busy || !!uncertain}
                  onClick={() => setAllowSwitch(!allowSwitch)}
                >
                  {a(language, allowSwitch ? 'sameOwner' : 'allowSwitch')}
                </button>
              </section>
            )}
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move('request-reset')}
            >
              {a(language, 'forgot')}
            </button>
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain || pending}
              onClick={() => move('register')}
            >
              {a(language, 'register')}
            </button>
            <p>{a(language, 'passwordDetails')}</p>
          </>
        )}
        {step === 'request-reset' && (
          <>
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move('reset')}
            >
              {a(language, 'haveCode')}
            </button>
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move('login')}
            >
              {a(language, 'login')}
            </button>
            <p>{a(language, 'mailSent')}</p>
          </>
        )}
        {codeStep && (
          <>
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move(step === 'verify' ? 'register' : 'request-reset')}
            >
              {a(language, 'requestAnother')}
            </button>
            <p>{a(language, 'mailSent')}</p>
            <p>{a(language, 'passwordDetails')}</p>
            {error === 'GUEST_SESSION_REQUIRED' && (
              <button
                type="button"
                className="account-link"
                disabled={busy || !!uncertain}
                onClick={() => move('login')}
              >
                {a(language, 'login')}
              </button>
            )}
          </>
        )}
        {step === 'manage' && (
          <>
            <button
              type="button"
              className="account-link"
              disabled={busy || !!uncertain}
              onClick={() => move('request-reset')}
            >
              {a(language, 'resetTitle')}
            </button>
            <p>{a(language, 'logoutHelp')}</p>
            <button
              type="button"
              className="account-link"
              data-account-action="logout"
              disabled={busy || !connected || pending || !!uncertain}
              onClick={() => void run(() => identity('logout', {}))}
            >
              {a(language, 'logout')}
            </button>
          </>
        )}
      </div>
    </details>
  );
  return (
    <dialog
      ref={dialog}
      className="account-access"
      data-account-dialog
      data-account-step={step}
      aria-labelledby="account-title"
      aria-busy={busy}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        close();
      }}
    >
      <header className="account-heading">
        <button
          type="button"
          className="account-close game-object"
          onClick={close}
          disabled={busy}
          aria-label={a(language, 'close')}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 5 7 12l7 7M7 12h14" />
          </svg>
        </button>
        <Artwork asset={emblem} language={language} decorative eager />
        <h2 id="account-title">{a(language, title)}</h2>
      </header>
      {step === 'manage' ? (
        <section className="account-management">
          <p className="account-email">{session?.email}</p>
          <p>{a(language, 'linked')}</p>
          {errorMessage}
          {help}
        </section>
      ) : (
        <form onSubmit={submit} data-account-action={step}>
          {(step === 'register' || step === 'login') && (
            <p className="account-intro">
              {a(language, step === 'register' ? 'registerHint' : 'loginHint')}
            </p>
          )}
          {codeStep && (
            <div className="account-delivery">
              {email && <p className="account-email">{email}</p>}
              {notice === 'mailSent' && <p role="status">{a(language, 'mailReceived')}</p>}
            </div>
          )}
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
          {codeStep && (
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
                {a(language, step === 'login' ? 'password' : 'newPassword')}
              </label>
              <div className="account-password-entry">
                <input
                  id="account-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={step === 'login' ? 'current-password' : 'new-password'}
                  aria-invalid={error === 'PASSWORD_POLICY' || undefined}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={busy}
                  aria-describedby={step === 'login' ? undefined : 'account-password-hint'}
                />
                <button
                  type="button"
                  className="account-eye"
                  aria-label={a(language, showPassword ? 'hide' : 'show')}
                  aria-controls="account-password"
                  aria-pressed={showPassword}
                  disabled={busy}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {showPassword && <path d="m3 3 18 18" />}
                  </svg>
                </button>
              </div>
              {step !== 'login' && <p id="account-password-hint">{a(language, 'passwordHint')}</p>}
            </div>
          )}
          {step !== 'login' && <p className="account-trial">{a(language, 'trialHint')}</p>}
          {step === 'login' && pending && <p>{a(language, 'pending')}</p>}
          {allowSwitch && <p role="status">{a(language, 'switchChosen')}</p>}
          {notice && notice !== 'mailSent' && (
            <p role="status" className="account-notice">
              {a(language, notice)}
            </p>
          )}
          {helpBeforeAction && help}
          {errorMessage}
          {uncertain ? (
            <button
              type="button"
              className="account-primary"
              disabled={busy || !connected}
              onClick={checkSession}
            >
              {a(language, busy ? 'sending' : 'check')}
            </button>
          ) : (
            <button
              type="submit"
              className="account-primary"
              data-account-action={`${step}-submit`}
              disabled={busy || !connected || (step === 'register' && pending)}
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
                          ? 'requestCode'
                          : 'login',
              )}
            </button>
          )}
          {!helpBeforeAction && help}
        </form>
      )}
      {busy && (
        <p role="status" className="visually-hidden">
          {a(language, 'sending')}
        </p>
      )}
      {!connected && <p role="status">{a(language, 'offline')}</p>}
      {step === 'manage' && uncertain && (
        <button
          type="button"
          className="account-primary"
          disabled={busy || !connected}
          onClick={checkSession}
        >
          {a(language, 'check')}
        </button>
      )}
    </dialog>
  );
}
