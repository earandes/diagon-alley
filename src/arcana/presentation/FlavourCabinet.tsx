import { useEffect, useRef, useState } from 'react';
import { flavourCollection } from '../application/client/flavour-collection';
import type { GameState } from '../application/game';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';
import { text } from './translations';
import { prepText } from './prep-messages';
import './expedition-preparation.css';

const labels = {
  mint: 'gameFlavourMint',
  pepper: 'gameFlavourPepper',
  earth: 'gameFlavourEarth',
  soap: 'gameFlavourSoap',
} as const;
export function FlavourCabinet({ game, language }: { game: GameState; language: Language }) {
  const entries = flavourCollection(game);
  const [selected, setSelected] = useState<string | null>(null);
  const [recipe, setRecipe] = useState(false);
  const folio = useRef<HTMLDialogElement>(null),
    origin = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const current = folio.current;
    if (!recipe || !current) return;
    current.showModal();
    return () => {
      if (current.open) current.close();
      origin.current?.focus({ preventScroll: true });
    };
  }, [recipe]);
  const discovered = entries.filter((entry) => entry.discovered).length;
  return (
    <section className="flavour-cabinet" aria-label={text(language, 'gameFlavours')}>
      <div className="flavour-cabinet-title">
        <Artwork asset="beans.jar" language={language} decorative />
        <h3>{text(language, 'gameFlavours')}</h3>
        <span
          aria-label={text(language, 'gameFlavourProgress', {
            count: discovered,
            total: entries.length,
          })}
        >
          {discovered}/{entries.length}
        </span>
      </div>
      <div className="flavour-tray">
        {entries.map((entry) => (
          <button
            className="flavour-specimen game-object"
            key={entry.flavour}
            data-discovered={entry.discovered}
            aria-pressed={selected === entry.flavour}
            aria-label={text(
              language,
              entry.discovered ? 'gameKnownFlavour' : 'gameUnknownFlavour',
              { name: text(language, labels[entry.flavour]) },
            )}
            onClick={() => setSelected(entry.flavour)}
          >
            <Artwork asset={`product.bean-${entry.flavour}`} language={language} decorative />
            <Artwork
              className="specimen-status"
              asset={entry.discovered ? 'ui.seal' : 'card.back'}
              language={language}
              decorative
            />
          </button>
        ))}
      </div>
      {selected && (
        <p className="flavour-caption" role="status">
          {text(
            language,
            entries.find((entry) => entry.flavour === selected)?.discovered
              ? labels[selected as keyof typeof labels]
              : 'gameTasteToDiscover',
          )}
        </p>
      )}
      <button
        ref={origin}
        className="flavour-recipe-trigger game-object"
        aria-label={text(language, 'gameFlavourHelpTitle')}
        aria-haspopup="dialog"
        onClick={() => setRecipe(true)}
      >
        <Artwork asset="ui.collection" language={language} decorative />
        <span>{prepText(language, 'recipe')}</span>
      </button>
      {recipe && (
        <dialog
          ref={folio}
          className="discovery-folio flavour-recipe"
          aria-label={prepText(language, 'recipe')}
          onCancel={() => setRecipe(false)}
        >
          <button
            className="folio-close game-object"
            aria-label={text(language, 'close')}
            onClick={() => setRecipe(false)}
          >
            <Artwork asset="ui.clear" language={language} decorative />
          </button>
          <h3>{prepText(language, 'recipe')}</h3>
          <ol className="flavour-recipe-steps">
            {(
              [
                ['beans.jar', 'getJar'],
                ['node.duel', 'assign'],
                ['product.bean-mint', 'discover'],
              ] as const
            ).map(([asset, label]) => (
              <li key={label}>
                <Artwork asset={asset} language={language} decorative />
                <span>{prepText(language, label)}</span>
              </li>
            ))}
          </ol>
          <p className="flavour-recipe-note">{text(language, 'gameFlavourHelp')}</p>
        </dialog>
      )}
    </section>
  );
}
