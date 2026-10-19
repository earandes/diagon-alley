import { ClassificationChoices } from './ClassificationChoices';
import {
  matchesClassification,
  type ClassificationFilter,
} from '../domain/collection/classification';
import { HouseInsignia, houseName, TraitBadge } from './HouseInsignia';
import { BondEmblem, bondName } from './BondEmblem';
import { CloseButton } from './CloseButton';
import { EnchantedFinish, FinishLabel, enchantedName } from './EnchantedFinish';
import { VisualChoices } from './VisualChoices';
import { FlavourCabinet } from './FlavourCabinet';
import { Artwork } from './Artwork';
import { RarityBadge } from './RarityBadge';
import { wizardName, wizardContext } from './content-packs/active';
import { StarRating } from './StarRating';
import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../application/game';
import type { PublicContent } from '../application/public-content';
import { collectionGoalView, collectionSources } from '../application/client/collection-goal';
import { useCollectionGoal } from './useCollectionGoal';
import { collectionGoalText } from './collection-goal-messages';
import { CollectionSources } from './CollectionSources';
import type { WizardCatalog, Language } from '../domain/collection/wizards';
import { prepText } from './prep-messages';
import './expedition-preparation.css';
import './collection-goal.css';
import './collection-supplies.css';
import { albumWindow } from './collection-supplies-model';
import { collectionSuppliesText as s } from './collection-supplies-messages';
import { collectionCompletion } from '../application/client/collection-completion';
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
  content,
  onAcquire,
}: {
  game: GameState;
  catalog: WizardCatalog;
  language: Language;
  onPrepare?: (origin: HTMLElement) => void;
  content?: PublicContent;
  onAcquire?: (origin: HTMLElement) => void;
}) {
  const [classification, setClassification] = useState<ClassificationFilter>('all');
  const [rarity, setRarity] = useState('all'),
    [discovery, setDiscovery] = useState('all'),
    [finish, setFinish] = useState('all'),
    [offset, setOffset] = useState(0),
    [inspected, setInspected] = useState<string | null>(null),
    [inspectedCopy, setInspectedCopy] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<4 | 8>(4);
  const album = useRef<HTMLDivElement>(null);
  const folio = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = album.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      setCapacity(entry.contentRect.width >= 760 ? 8 : 4);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const heading = useRef<HTMLHeadingElement>(null);
  const origin = useRef<HTMLButtonElement | null>(null);
  const bookmark = useCollectionGoal(game.playerId);
  useEffect(() => {
    setInspected(null);
    setInspectedCopy(null);
  }, [game.playerId]);
  useEffect(() => {
    const current = folio.current;
    if (!inspected || !current) return;
    current.showModal();
    return () => {
      if (current.open) current.close();
      if (origin.current?.isConnected) origin.current.focus({ preventScroll: true });
      else if (heading.current?.isConnected) heading.current.focus({ preventScroll: true });
    };
  }, [inspected]);
  const t = (key: MessageKey, values?: Record<string, string | number>) =>
    text(language, key, values);
  const allEntries = cromodex(catalog, game.copies);
  const goalView = collectionGoalView(bookmark.goal, game, catalog, content);
  const goalEntry = allEntries.find((entry) => entry.wizard.id === goalView?.goal.wizardId);
  const g = (
    key: Parameters<typeof collectionGoalText>[1],
    values?: Record<string, string | number>,
  ) => collectionGoalText(language, key, values);
  const entryLabel = (entry: (typeof allEntries)[number]) =>
    entry.discovered
      ? wizardName(entry.wizard, language)
      : g('pending', { number: allEntries.indexOf(entry) + 1 });
  const groupEntries = allEntries.filter(
    (entry) =>
      !entry.historical &&
      matchesClassification(
        catalog.wizards.find((w) => w.id === entry.wizard.id)?.traits,
        classification,
      ),
  );
  const completion = collectionCompletion(catalog, game.copies, content?.toadTable);
  const activeFilters = [classification, rarity, discovery, finish].filter(
    (filter) => filter !== 'all',
  ).length;
  const entries = allEntries
    .filter(
      (entry) =>
        matchesClassification(
          catalog.wizards.find((w) => w.id === entry.wizard.id)?.traits ?? entry.wizard.traits,
          classification,
        ) &&
        (rarity === 'all' || entry.wizard.rarity === rarity) &&
        (discovery === 'all' || entry.discovered === (discovery === 'discovered')) &&
        (finish === 'all' || entry.copies.some((copy) => !!copy.wizard.finish)),
    )
    .sort((left, right) => Number(right.discovered) - Number(left.discovered));
  const spread = albumWindow(entries, offset, capacity);
  const { pages, page: currentPage, entries: visibleEntries } = spread;
  const inspectedEntry = allEntries.find((entry) => entry.wizard.id === inspected);
  useEffect(() => {
    if (inspected && !inspectedEntry) setInspected(null);
  }, [inspected, inspectedEntry]);
  const inspectedSources = inspectedEntry
    ? collectionSources(inspectedEntry.wizard.id, game, catalog, content)
    : null;
  const selectedCopy =
    inspectedEntry?.copies.find((c) => c.copyId === inspectedCopy) ?? inspectedEntry?.copies[0];
  const { reduced } = useReducedMotion();
  const pageMotion = useSelectionMotion(
    `${rarity}:${discovery}:${finish}:${classification}:${currentPage}`,
    reduced,
    160,
  );
  return (
    <section className="collection-panel">
      <h2 ref={heading} tabIndex={-1}>
        {t('chromodex')}
      </h2>
      <div className="collection-progress">
        <label>
          {t('collectionDiscoveryCount', {
            count: completion.current.discovered,
            total: completion.current.total,
          })}
          <progress
            value={completion.current.discovered}
            max={completion.current.total || 1}
            aria-label={t('collectionProgress')}
          />
        </label>
      </div>
      {completion.historical.discovered > 0 && (
        <p className="collection-archive-count">
          {s(language, 'archiveCount', { count: completion.historical.discovered })}
        </p>
      )}
      <p className="collection-copy-count">{savedCopies(language, game.copies.length)}</p>
      {goalView && (
        <aside
          className="collection-goal-bookmark"
          aria-label={g('objective')}
          data-goal-state={goalView.status}
        >
          <Artwork asset="ui.collection" language={language} decorative />
          <div>
            <strong>{g('objective')}</strong>
            {goalEntry ? (
              <button
                type="button"
                className="goal-open"
                onClick={(event) => {
                  origin.current = event.currentTarget;
                  setInspectedCopy(null);
                  setInspected(goalEntry.wizard.id);
                }}
              >
                {entryLabel(goalEntry)}
              </button>
            ) : (
              <span>{g('archived')}</span>
            )}
            <small role="status">
              {g(
                goalView.status === 'acquired'
                  ? 'acquired'
                  : goalView.status === 'archived'
                    ? 'archived'
                    : 'searching',
              )}
            </small>
          </div>
          <button
            type="button"
            className="goal-clear game-object"
            aria-label={g('clear')}
            onClick={() => bookmark.choose(null)}
          >
            <Artwork asset="ui.clear" language={language} decorative />
            <span>{g('clear')}</span>
          </button>
          <details>
            <summary>{g('source')}</summary>
            <p>{g('help')}</p>
          </details>
        </aside>
      )}
      {!bookmark.durable && bookmark.goal && <p role="status">{g('session')}</p>}
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
          <ClassificationChoices
            value={classification}
            onChange={(value) => {
              setClassification(value);
              setOffset(0);
            }}
            language={language}
          />
          <VisualChoices
            label={t('rarityFilter')}
            value={rarity}
            onChange={(value) => {
              setRarity(value);
              setOffset(0);
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
              setOffset(0);
            }}
            language={language}
            options={[
              { id: 'all', label: t('allCards'), asset: 'ui.collection' },
              { id: 'discovered', label: t('discovered'), asset: 'ui.owned' },
              { id: 'locked', label: t('undiscoveredCard'), asset: 'card.back' },
            ]}
          />
          <VisualChoices
            label={s(language, 'finish')}
            value={finish}
            onChange={(value) => {
              setFinish(value);
              setOffset(0);
            }}
            language={language}
            options={[
              { id: 'all', label: t('allCards'), asset: 'ui.collection' },
              { id: 'enchanted', label: enchantedName(language), asset: 'rarity.arcane-legendary' },
            ]}
          />
        </div>
      </details>
      {activeFilters > 0 && (
        <div className="album-active-filters" role="status">
          <span>{s(language, 'filtered', { count: activeFilters })}</span>
          <button
            type="button"
            onClick={() => {
              setClassification('all');
              setRarity('all');
              setDiscovery('all');
              setFinish('all');
              setOffset(0);
            }}
          >
            {s(language, 'clearFilters')}
          </button>
        </div>
      )}
      {classification !== 'all' && (
        <p className="collection-group-count">
          {g('counts', {
            owned: groupEntries.filter((entry) => entry.discovered).length,
            total: groupEntries.length,
          })}
        </p>
      )}
      {!entries.length && <p role="status">{t('noMatchingCards')}</p>}
      <div
        className="album album-illustrated"
        ref={(element) => {
          pageMotion.current = element;
          album.current = element;
        }}
        data-album-capacity={capacity}
        data-album-motion="selection-only"
      >
        {visibleEntries.map((entry) => (
          <article
            key={entry.wizard.id}
            className={entry.discovered ? 'card' : 'card locked'}
            data-rarity={entry.wizard.rarity}
            data-collection-goal={bookmark.goal?.wizardId === entry.wizard.id}
            data-collection-id={entry.wizard.id}
            data-collection-discovered={entry.discovered}
            aria-label={
              entry.discovered ? wizardName(entry.wizard, language) : t('undiscoveredCard')
            }
          >
            {bookmark.goal?.wizardId === entry.wizard.id && (
              <span className="album-goal-seal" role="img" aria-label={g('tracked')}>
                <Artwork asset="ui.collection" language={language} decorative />
              </span>
            )}
            <button
              className="album-card-inspect game-object enchanted-holder"
              aria-label={
                entry.discovered
                  ? prepText(language, 'consult', { name: wizardName(entry.wizard, language) })
                  : g('consult', { number: allEntries.indexOf(entry) + 1 })
              }
              onClick={(event) => {
                origin.current = event.currentTarget;
                setInspectedCopy(null);
                setInspected(entry.wizard.id);
              }}
            >
              <Artwork
                asset={entry.discovered ? `character.${entry.wizard.id}.portrait` : 'card.back'}
                language={language}
                className="card-portrait"
                fallbackAsset="card.back"
                decorative
              />
              {entry.discovered && entry.copies.find((c) => c.wizard.finish) && (
                <EnchantedFinish wizard={entry.copies.find((c) => c.wizard.finish)!.wizard} />
              )}
            </button>
            <h3 className={entry.discovered ? '' : 'visually-hidden'}>
              {entry.discovered ? wizardName(entry.wizard, language) : t('undiscoveredCard')}
            </h3>
            {entry.discovered &&
              (() => {
                const traits =
                  catalog.wizards.find((wizard) => wizard.id === entry.wizard.id)?.traits ??
                  entry.wizard.traits;
                return traits?.house ? (
                  <span
                    className="album-identity-emblem"
                    role="img"
                    aria-label={houseName(traits.house, language)}
                  >
                    <HouseInsignia house={traits.house} />
                  </span>
                ) : traits?.nature === 'creature' ? (
                  <span
                    className="album-identity-emblem"
                    role="img"
                    aria-label={bondName('creatures', language)}
                  >
                    <BondEmblem group="creatures" language={language} />
                  </span>
                ) : null;
              })()}
            {entry.historical && (
              <span className="album-archive-label">{s(language, 'archived')}</span>
            )}
            {entry.copies.some((c) => c.wizard.finish) && (
              <span className="enchanted-label">
                ✧ {enchantedName(language)} ×{entry.copies.filter((c) => c.wizard.finish).length}
              </span>
            )}
            <RarityBadge rarity={entry.wizard.rarity} language={language} />

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
          aria-label={entryLabel(inspectedEntry)}
          onCancel={() => setInspected(null)}
        >
          <CloseButton
            className="folio-close game-object"
            label={t('close')}
            onClose={() => setInspected(null)}
          />
          <div className="enchanted-holder">
            <Artwork
              asset={
                inspectedEntry.discovered
                  ? `character.${inspectedEntry.wizard.id}.portrait`
                  : 'card.back'
              }
              language={language}
              className="album-folio-portrait"
              fallbackAsset="card.back"
              decorative
            />
            {selectedCopy && <EnchantedFinish wizard={selectedCopy.wizard} />}
          </div>
          <h3>{entryLabel(inspectedEntry)}</h3>
          {selectedCopy && <FinishLabel wizard={selectedCopy.wizard} language={language} />}
          <details className="album-identity-details">
            <summary>{s(language, 'details')}</summary>
            <TraitBadge
              traits={
                catalog.wizards.find((w) => w.id === inspectedEntry.wizard.id)?.traits ??
                inspectedEntry.wizard.traits
              }
              expanded
              language={language}
            />
            <RarityBadge
              rarity={selectedCopy?.wizard.rarity ?? inspectedEntry.wizard.rarity}
              language={language}
            />
            <StarRating
              stars={selectedCopy?.wizard.stars ?? inspectedEntry.wizard.stars}
              language={language}
            />
            {inspectedEntry.discovered && <p>{wizardContext(inspectedEntry.wizard, language)}</p>}
            {inspectedEntry.discovered && selectedCopy && (
              <p className="album-copy-provenance">
                {s(language, selectedCopy.origin === 'starter' ? 'starterOrigin' : 'frogOrigin', {
                  version: selectedCopy.catalogVersion,
                })}
              </p>
            )}
          </details>
          {inspectedSources && (
            <CollectionSources
              sources={inspectedSources}
              language={language}
              onAcquire={
                onAcquire
                  ? (element) => {
                      setInspected(null);
                      onAcquire(element);
                    }
                  : undefined
              }
            />
          )}
          {inspectedSources &&
            !inspectedEntry.discovered &&
            inspectedSources.probability !== null &&
            inspectedSources.probability > 0 && (
              <button
                type="button"
                className="collection-goal-follow game-object"
                aria-pressed={bookmark.goal?.wizardId === inspectedEntry.wizard.id}
                onClick={() =>
                  bookmark.choose(
                    bookmark.goal?.wizardId === inspectedEntry.wizard.id
                      ? null
                      : {
                          version: 1,
                          owner: game.playerId,
                          wizardId: inspectedEntry.wizard.id,
                          catalogVersion: catalog.version,
                        },
                  )
                }
              >
                <Artwork asset="ui.collection" language={language} decorative />
                <span>
                  {g(bookmark.goal?.wizardId === inspectedEntry.wizard.id ? 'clear' : 'track')}
                </span>
              </button>
            )}
          {inspectedEntry.discovered && (
            <details className="album-copy-details">
              <summary>{t('cardCopyCount', { count: inspectedEntry.copies.length })}</summary>
              <ol className="album-copy-tokens" aria-label={t('collectionCopiesQuestion')}>
                {inspectedEntry.copies.map((copy, index) => (
                  <li
                    key={copy.copyId}
                    aria-label={prepText(language, 'copy', { number: index + 1 })}
                  >
                    <button
                      type="button"
                      aria-pressed={selectedCopy?.copyId === copy.copyId}
                      onClick={() => setInspectedCopy(copy.copyId)}
                      aria-label={`${prepText(language, 'copy', { number: index + 1 })}${copy.wizard.finish ? ` · ${enchantedName(language)}` : ''}`}
                    >
                      {index + 1}
                      {copy.wizard.finish ? ' ✧' : ''}
                    </button>
                  </li>
                ))}
              </ol>
            </details>
          )}
          {inspectedEntry.discovered && (
            <p className="album-readonly-note">{prepText(language, 'albumHelp')}</p>
          )}
        </dialog>
      )}
      <div className="album-page-controls" aria-label={t('gameAlbumPages')}>
        <button
          className="game-object"
          aria-label={t('gamePreviousPage')}
          disabled={currentPage === 0}
          onClick={() => setOffset((currentPage - 1) * capacity)}
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
          onClick={() => setOffset((currentPage + 1) * capacity)}
        >
          <Artwork asset="ui.pass" language={language} decorative />
          <span className="visually-hidden">{t('gameNextPage')}</span>
        </button>
      </div>
    </section>
  );
}
