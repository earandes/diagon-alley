import { Artwork } from './Artwork';
import type { ClientSnapshot } from '../application/client/game-controller';
import type { Language } from '../domain/collection/wizards';
import { text } from './translations';
export function PlayerHud({
  state,
  language,
  onRefresh,
  connected,
}: {
  state: ClientSnapshot;
  language: Language;
  onRefresh: () => void;
  connected: boolean;
}) {
  if (!state.game) return null;
  const format = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US'),
    energy = state.energy;
  return (
    <div className="hud">
      <strong>
        <Artwork asset="currency.crowns" language={language} className="currency-icon" decorative />
        <span aria-label={text(language, 'crowns')}>
          {format.format(state.game.inventory.crowns)}
        </span>
      </strong>
      <div className="energy-status">
        {energy ? (
          <>
            <label>
              <Artwork
                asset="currency.essence"
                language={language}
                className="currency-icon"
                decorative
              />
              <span className="visually-hidden">{text(language, 'essence')}</span>{' '}
              {format.format(energy.points)} / {format.format(energy.maximum)}
              <meter
                aria-label={text(language, 'runicEssence')}
                min={0}
                max={energy.maximum}
                value={energy.points}
              />
            </label>
            <small className="visually-hidden">
              {energy.nextPointAt === null
                ? text(language, 'essenceFull')
                : text(language, 'nextEssenceAt', {
                    time: new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    }).format(energy.nextPointAt),
                  })}
            </small>
          </>
        ) : (
          <p>{text(language, state.statusError ? 'essenceUnavailable' : 'updatingEssence')}</p>
        )}
        <button
          disabled={
            !connected || state.status !== 'ready' || !!state.pending || state.refreshingStatus
          }
          onClick={onRefresh}
        >
          <Artwork asset="currency.essence" language={language} decorative />
          <span className="visually-hidden">{text(language, 'refreshEssence')}</span>
        </button>
      </div>
      <span className="key-balance">
        <Artwork asset="product.gold-key" language={language} decorative />
        <strong aria-hidden="true">{format.format(state.game.inventory.goldKeys ?? 0)}</strong>
        <span className="visually-hidden">
          {text(
            language,
            new Intl.PluralRules(language).select(state.game.inventory.goldKeys ?? 0) === 'one'
              ? 'goldKeyCountOne'
              : 'goldKeyCountMany',
            { count: format.format(state.game.inventory.goldKeys ?? 0) },
          )}
        </span>
      </span>
    </div>
  );
}
