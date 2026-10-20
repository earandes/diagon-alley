import type { GameState } from '../application/game';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';
import { FlavourCabinet } from './FlavourCabinet';
import { text } from './translations';
import { regionAppearance } from './content-packs/active';
import { prepText } from './prep-messages';
import { useMemo } from 'react';
import type { PublicContent } from '../application/public-content';
import { collectionCompletion } from '../application/client/collection-completion';
import { vaultGuidance } from '../application/client/vault-guidance';
import { progressVaultText } from './progress-vault-messages';
import './expedition-preparation.css';

export function JourneyCabinet({
  game,
  language,
  onMap,
  onCollection,
  onShop,
  onVault,
  content,
}: {
  game: GameState;
  language: Language;
  onMap: () => void;
  onCollection: () => void;
  onShop: () => void;
  onVault: () => void;
  content?: PublicContent;
}) {
  const run = game.exploration?.run;
  const bossComplete = game.exploration?.unlockedZones.includes('bosque');
  const own = new Set(game.copies.map((copy) => copy.wizard.id)).size;
  const keys = game.inventory.goldKeys ?? 0;
  const completion = useMemo(
    () => (content ? collectionCompletion(content.catalog, game.copies, content.toadTable) : null),
    [content, game.copies],
  );
  const vault = useMemo(() => vaultGuidance(game, content), [game, content]);
  const keySource = vault.status === 'source';
  return (
    <section className="journey-cabinet">
      <h2>{text(language, 'missions')}</h2>
      <div className="journey-objects">
        <button
          className="journey-object game-object"
          onClick={onMap}
          aria-label={text(language, 'map')}
        >
          <Artwork asset="ui.map" language={language} decorative />
          <span>{run?.visited.length ?? 0}</span>
          <small>{text(language, 'gameExplore')}</small>
        </button>
        <button
          className="journey-object game-object"
          onClick={onCollection}
          aria-label={text(language, 'chromodex')}
        >
          <Artwork asset="ui.collection" language={language} decorative />
          <span>
            {completion ? `${completion.current.discovered}/${completion.current.total}` : own}
          </span>
          <small>{text(language, 'gameCollect')}</small>
          {!!completion?.historical.total && (
            <small>
              {progressVaultText(language, 'archive', { count: completion.historical.total })}
            </small>
          )}
        </button>
        <button
          className="journey-object game-object"
          onClick={keySource ? onMap : onVault}
          aria-label={
            keySource ? progressVaultText(language, 'findSource') : text(language, 'obsidianVaults')
          }
        >
          <Artwork
            asset={
              keys ? 'product.gold-key' : keySource ? `node.${vault.source}` : 'product.loot-chest'
            }
            language={language}
            decorative
          />
          <span>{keys || ''}</span>
          <small>
            {keySource
              ? progressVaultText(language, 'findSource')
              : text(language, keys ? 'gameOpenVault' : 'obsidianVaults')}
          </small>
        </button>
      </div>
      <FlavourCabinet game={game} language={language} />
      <button
        className="journey-next game-object"
        onClick={keys ? onVault : own < 3 ? onShop : onMap}
      >
        <Artwork
          asset={keys ? 'product.gold-key' : own < 3 ? 'toad.box' : 'ui.map'}
          language={language}
          decorative
        />
        {text(
          language,
          keys ? 'gameOpenVault' : own < 3 ? 'gameFindYourNextWizard' : 'gameContinueAdventure',
        )}
      </button>
      <section className="journey-atlas" aria-label={text(language, 'unlockedLocations')}>
        <h3>{prepText(language, 'atlas')}</h3>
        <div className="journey-atlas-spread">
          <button
            className="journey-atlas-page game-object"
            onClick={onMap}
            aria-label={text(language, 'map')}
          >
            <Artwork
              asset={regionAppearance('pasaje', language).mapAsset}
              language={language}
              decorative
            />
            <span>{regionAppearance('pasaje', language).name}</span>
            <small>{prepText(language, 'current')}</small>
          </button>
          <div className="journey-atlas-page" data-future="true">
            <Artwork
              asset={bossComplete ? 'ui.seal' : 'card.back'}
              language={language}
              decorative
            />
            <span>{prepText(language, 'future')}</span>
            <small>{prepText(language, bossComplete ? 'unlocked' : 'locked')}</small>
          </div>
        </div>
      </section>
    </section>
  );
}
