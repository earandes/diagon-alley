import type { ClientSnapshot } from '../application/client/game-controller';
import type { Language } from '../domain/collection/wizards';
import { operationErrorKey } from './operation-error';
import { recoveryText as r } from './recovery-messages';
import { text } from './translations';
import './recovery-notice.css';

export const sessionInvalid = (error: string | null) =>
  error !== null && ['UNAUTHORIZED', 'INVALID_SESSION', 'PLAYER_MISMATCH'].includes(error);

/** Place in the active modal as well as the page; only the top context should announce it. */
export function RecoveryNotice({
  state,
  language,
  onReload,
  onRecover,
  onEnter,
  entering = false,
  entryError = null,
  announce = true,
  connected = true,
}: {
  state: ClientSnapshot;
  language: Language;
  onReload: () => void;
  onRecover: () => void;
  onEnter?: () => void;
  entering?: boolean;
  entryError?: string | null;
  announce?: boolean;
  connected?: boolean;
}) {
  const busy = ['sending', 'recovering', 'loading'].includes(state.status) || entering;
  const error = state.error ?? state.statusError;
  const invalid = sessionInvalid(error);
  if (!error && !state.pending && !entryError && !entering) return null;
  const message = entering
    ? r(language, 'entering')
    : state.status === 'sending'
      ? r(language, 'sending')
      : state.status === 'recovering'
        ? r(language, 'recovering')
        : entryError
          ? r(language, entryError === 'RATE_LIMITED' ? 'rateLimited' : 'entryFailed')
          : invalid
            ? r(language, 'session')
            : error
              ? text(language, operationErrorKey(error))
              : r(language, 'pending');
  return (
    <section className="recovery-notice" data-recovery-notice aria-busy={busy}>
      <p role={announce ? (busy ? 'status' : 'alert') : undefined}>{message}</p>
      {state.pending && message !== r(language, 'pending') && <p>{r(language, 'pending')}</p>}
      {!connected && <p>{r(language, 'offline')}</p>}
      {invalid && <small>{r(language, 'sameSession')}</small>}
      {!busy && (
        <div className="recovery-actions">
          <button
            className="game-object"
            disabled={!connected}
            onClick={state.pending ? onRecover : onReload}
          >
            {r(language, state.pending ? 'recover' : invalid ? 'check' : 'reload')}
          </button>
          {invalid && !state.pending && onEnter && (
            <details className="recovery-new-entry">
              <summary>{r(language, 'newTrial')}</summary>
              <p>{r(language, 'newTrialHelp')}</p>
              <button className="game-object" disabled={!connected} onClick={onEnter}>
                {r(language, 'newTrial')}
              </button>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
