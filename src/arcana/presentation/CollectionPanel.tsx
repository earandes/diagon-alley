import { VisualChoices } from './VisualChoices';
import { FlavourCabinet } from './FlavourCabinet';
import { Artwork } from './Artwork';
import { RarityBadge } from './RarityBadge';
import { wizardName, wizardContext } from './content-packs/active';
import { StarRating } from './StarRating';
import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../application/game';
import type { WizardCatalog, Language } from '../domain/collection/wizards';
import { prepText } from './prep-messages';
import './expedition-preparation.css';
import { cromodex } from '../application/client/read-models';
import { savedCopies, text, type MessageKey } from './translations';
import { useSelectionMotion } from './useSelectionMotion';
import { useReducedMotion } from './useReducedMotion';
const rarityLabels = {
  common: 'common',
  unusual: 'unusual',
  epic: 'epic',
  'arcane-legendary': 'arcaneLegendary',
} as const;
export function CollectionPanel({
  game,
  catalog,
  language,
  onPrepare,
}: {
  game: GameState;
  catalog: WizardCatalog;
  language: Language;
  onPrepare?: (origin: HTMLElement) => void;
}) {
  const [rarity, setRarity] = useState('all'),
    [discovery, setDiscovery] = useState('all'),
    [page, setPage] = useState(0),
    [inspected, setInspected] = useState<string | null>(null);
  const folio = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const current = folio.current;
    if (!inspected || !current) return;
    current.showModal();
    return () => {
      if (current.open) current.close();
      if (origin.current?.isConnected) origin.current.focus({ preventScroll: true });
    };
  }, [inspected]);
  const t = (key: MessageKey, values?: Record<string, string | number>) =>
    text(language, key, values);
  const allEntries = cromodex(catalog, game.copies);
  const discovered = allEntries.filter((entry) => entry.discovered).length;
  const entries = allEntries
    .filter(
      (entry) =>
        (rarity === 'all' || entry.wizard.rarity === rarity) &&
        (discovery === 'all' || entry.discovered === (discovery === 'discovered')),
    )
    .sort((left, right) => Number(right.discovered) - Number(left.discovered));
  const pages = Math.max(1, Math.ceil(entries.length / 4));
  const currentPage = Math.min(page, pages - 1);
  const visibleEntries = entries.slice(currentPage * 4, currentPage * 4 + 4);
  const inspectedEntry = allEntries.find((entry) => entry.wizard.id === inspected);
  const { reduced } = useReducedMotion();
  const pageMotion = useSelectionMotion(`${rarity}:${discovery}:${currentPage}`, reduced, 160);
  return (
    <section className="collection-panel">
      <h2>{t('chromodex')}</h2>
      <div className="collection-progress">
        <label>
          {t('collectionDiscoveryCount', { count: discovered, total: allEntries.length })}
          <progress
            value={discovered}
            max={allEntries.length}
            aria-label={t('collectionProgress')}
          />
        </label>
      </div>
      <p className="collection-copy-count">{savedCopies(language, game.copies.length)}</p>
      {onPrepare && (
        <button
          className="album-prepare-link game-object"
          onClick={(event) => onPrepare(event.currentTarget)}
        >
          <Artwork asset="ui.map" language={language} decorative />
          <span>{prepText(language, 'prepareLink')}</span>
        </button>
      )}
      <FlavourCabinet game={game} language={language} />
      <details className="album-filter-drawer">
        <summary aria-label={t('rarityFilter')}>
          <Artwork asset="ui.owned" language={language} decorative />
          <span>{t('gameAlbumFilters')}</span>
        </summary>
        <div className="album-filters visual-filters">
          <VisualChoices
            label={t('rarityFilter')}
            value={rarity}
            onChange={(value) => {
              setRarity(value);
              setPage(0);
            }}
            language={language}
            options={[
              { id: 'all', label: t('allRarities'), asset: 'ui.collection' },
              ...Object.entries(rarityLabels).map(([id, key]) => ({
                id,
                label: t(key),
                asset: `rarity.${id}`,
              })),
            ]}
          />
          <VisualChoices
            label={t('discoveryFilter')}
            value={discovery}
            onChange={(value) => {
              setDiscovery(value);
              setPage(0);
            }}
            language={language}
            options={[
              { id: 'all', label: t('allCards'), asset: 'ui.collection' },
              { id: 'discovered', label: t('discovered'), asset: 'ui.owned' },
              { id: 'locked', label: t('undiscoveredCard'), asset: 'card.back' },
            ]}
          />
        </div>
      </details>
      {!entries.length && <p role="status">{t('noMatchingCards')}</p>}
      <div className="album" ref={pageMotion} data-album-motion="selection-only">
        {visibleEntries.map((entry) => (
          <article
            key={entry.wizard.id}
            className={entry.discovered ? 'card' : 'card locked'}
            data-rarity={entry.wizard.rarity}
            aria-label={
              entry.discovered ? wizardName(entry.wizard, language) : t('undiscoveredCard')
            }
          >
            <button
              className="album-card-inspect game-object"
              disabled={!entry.discovered}
              aria-label={
                entry.discovered
                  ? prepText(language, 'consult', { name: wizardName(entry.wizard, language) })
                  : t('undiscoveredCard')
              }
              onClick={(event) => {
                origin.current = event.currentTarget;
                setInspected(entry.wizard.id);
              }}
            >
              <Artwork
                asset={entry.discovered ? `character.${entry.wizard.id}.portrait` : 'card.back'}
                language={language}
                className="card-portrait"
                decorative
              />
            </button>
            <h3 className={entry.discovered ? '' : 'visually-hidden'}>
              {entry.discovered ? wizardName(entry.wizard, language) : t('undiscoveredCard')}
            </h3>
            <RarityBadge rarity={entry.wizard.rarity} language={language} />
            <StarRating stars={entry.wizard.stars} language={language} />
            <p className={entry.discovered ? 'card-ownership' : 'visually-hidden'}>
              {entry.discovered ? t('cardCopyCount', { count: entry.copies.length }) : t('locked')}
            </p>
            {entry.copies.some((copy) => game.team?.copyIds.includes(copy.copyId)) && (
              <p className="card-team-state">{t('cardInTeam')}</p>
            )}
          </article>
        ))}
      </div>
      {inspectedEntry && (
        <dialog
          ref={folio}
          className="discovery-folio album-card-folio"
          aria-label={wizardName(inspectedEntry.wizard, language)}
          onCancel={() => setInspected(null)}
        >
          <button
            className="folio-close game-object"
            aria-label={t('close')}
            onClick={() => setInspected(null)}
          >
            <Artwork asset="ui.clear" language={language} decorative />
          </button>
          <Artwork
            asset={`character.${inspectedEntry.wizard.id}.portrait`}
            language={language}
            className="album-folio-portrait"
            decorative
          />
          <h3>{wizardName(inspectedEntry.wizard, language)}</h3>
          <RarityBadge rarity={inspectedEntry.wizard.rarity} language={language} />
          <StarRating stars={inspectedEntry.wizard.stars} language={language} />
          <p>{wizardContext(inspectedEntry.wizard, language)}</p>
          <p>{t('cardCopyCount', { count: inspectedEntry.copies.length })}</p>
          <ol className="album-copy-tokens" aria-label={t('collectionCopiesQuestion')}>
            {inspectedEntry.copies.map((copy, index) => (
              <li key={copy.copyId} aria-label={prepText(language, 'copy', { number: index + 1 })}>
                {index + 1}
              </li>
            ))}
          </ol>
          <p className="album-readonly-note">{prepText(language, 'albumHelp')}</p>
        </dialog>
      )}
      <div className="album-page-controls" aria-label={t('gameAlbumPages')}>
        <button
          className="game-object"
          aria-label={t('gamePreviousPage')}
          disabled={currentPage === 0}
          onClick={() => setPage(currentPage - 1)}
        >
          <Artwork asset="ui.pass" language={language} decorative />
          <span className="visually-hidden">{t('gamePreviousPage')}</span>
        </button>
        <span aria-live="polite">
          {currentPage + 1} / {pages}
        </span>
        <button
          className="game-object"
          aria-label={t('gameNextPage')}
          disabled={currentPage === pages - 1}
          onClick={() => setPage(currentPage + 1)}
        >
          <Artwork asset="ui.pass" language={language} decorative />
          <span className="visually-hidden">{t('gameNextPage')}</span>
        </button>
      </div>
    </section>
  );
}
