import type { Language } from '../domain/collection/wizards';
import type { collectionSources } from '../application/client/collection-goal';
import { collectionGoalText } from './collection-goal-messages';
import { text } from './translations';
import { Artwork } from './Artwork';

export function CollectionSources({
  sources,
  language,
  onAcquire,
}: {
  sources: ReturnType<typeof collectionSources>;
  language: Language;
  onAcquire?: (origin: HTMLElement) => void;
}) {
  const t = (
    key: Parameters<typeof collectionGoalText>[1],
    values?: Record<string, string | number>,
  ) => collectionGoalText(language, key, values);
  const chance =
    sources.probability === null
      ? null
      : new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-GB', {
          style: 'percent',
          maximumFractionDigits: 3,
        }).format(sources.probability);
  return (
    <section className="collection-source" aria-label={t('source')}>
      {sources.probability !== null && sources.probability > 0 ? (
        <>
          <p>
            <strong>{t('own', { product: text(language, 'cocoaToad') })}</strong>
          </p>
          <p>{t('probability', { chance: chance! })}</p>
          {onAcquire && (
            <button
              type="button"
              className="collection-goal-follow game-object"
              onClick={(event) => onAcquire(event.currentTarget)}
            >
              <Artwork asset="toad.box" language={language} decorative />
              <span>{t('acquire')}</span>
            </button>
          )}
        </>
      ) : (
        <p>{t(sources.probability === null ? 'unknown' : 'unavailable')}</p>
      )}
      {sources.temporaryOpportunity && (
        <p>
          <strong>{t('temporary')}</strong>
          <small>{t('opportunity')}</small>
        </p>
      )}
      <details>
        <summary>{t('source')}</summary>
        <p>{t('sourceHelp')}</p>
        {sources.tableVersion !== null && (
          <small>{t('table', { version: sources.tableVersion })}</small>
        )}
      </details>
    </section>
  );
}
