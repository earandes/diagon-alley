import type { GameState } from '../application/game';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';
import { FlavourCabinet } from './FlavourCabinet';
import { text } from './translations';
import { regionAppearance } from './content-packs/active';
import { prepText } from './prep-messages';
import './expedition-preparation.css';

export function JourneyCabinet({
  game,
  language,
  onMap,
  onCollection,
  onShop,
  onVault,
}: {
  game: GameState;
  language: Language;
  onMap: () => void;
  onCollection: () => void;
  onShop: () => void;
  onVault: () => void;
}) {
  const run = game.exploration?.run;
  const bossComplete = game.exploration?.unlockedZones.includes('bosque');
  const own = new Set(game.copies.map((copy) => copy.wizard.id)).size;
  const keys = game.inventory.goldKeys ?? 0;
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
          <span>{own}/30</span>
          <small>{text(language, 'gameCollect')}</small>
        </button>
        <button
          className="journey-object game-object"
          onClick={keys ? onVault : onMap}
          aria-label={text(language, keys ? 'obsidianVaults' : 'gameBossChallenge')}
        >
          <Artwork asset={keys ? 'product.gold-key' : 'node.boss'} language={language} decorative />
          <span>{keys || (bossComplete ? '✓' : '')}</span>
          <small>{text(language, keys ? 'gameOpenVault' : 'gameBossChallenge')}</small>
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
