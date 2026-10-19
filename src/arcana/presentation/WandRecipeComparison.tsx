import { useState, type ReactNode } from 'react';
import type { GameState } from '../application/game';
import type { PublicContent } from '../application/public-content';
import type { Language } from '../domain/collection/wizards';
import type { WandRecipe } from '../domain/economy/commerce';
import { Artwork } from './Artwork';
import { EquipmentArt } from './EquipmentArt';
import { equipmentName } from './equipment-label';
import { themedName } from './content-packs/active';
import { previewWandRecipe } from './commerce-preparation';
import { commercePrepText as c } from './commerce-preparation-messages';
import { text } from './translations';
import './commerce-preparation.css';

/** A fitting on the workshop table. Only the parent’s separate forge action spends resources. */
export function WandRecipeComparison({
  game,
  recipe,
  version,
  language,
  content,
  children,
}: {
  game: GameState;
  recipe: WandRecipe;
  version: number;
  language: Language;
  content?: PublicContent;
  children?: ReactNode;
}) {
  const [reference, setReference] = useState<{ player: string; copyId: string } | null>(null);
  const copy =
    game.copies.find(
      (entry) => reference?.player === game.playerId && entry.copyId === reference.copyId,
    ) ??
    game.copies.find((entry) => entry.copyId === game.team?.copyIds[0]) ??
    game.copies[0];
  if (!copy)
    return (
      <>
        <p className="forge-reference-empty">{c(language, 'noCopies')}</p>
        {children}
      </>
    );
  const preview = previewWandRecipe(game, copy, recipe, version, content);
  const loadout = game.team?.loadouts.find((entry) => entry.copyId === copy.copyId);
  const current = game.inventory.equipment?.find(
    (entry) => entry.id === loadout?.wandId && entry.kind === 'wand',
  );
  const name = (entry: typeof copy) =>
    themedName(entry.wizard.id, entry.wizard.name[language], language);
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    maximumFractionDigits: 2,
  });
  const comparison = (value: typeof preview.current) => (
    <dl className="forge-fitted-values" aria-label={c(language, 'compare')}>
      {(
        [
          ['spell', value.powerBefore, value.powerAfter],
          ['initiative', value.initiativeBefore, value.initiativeAfter],
          ['recovery', value.healingBefore, value.healingAfter],
        ] as const
      ).map(([key, before, after]) => (
        <div key={key}>
          <dt>{c(language, key)}</dt>
          <dd data-forge-value={key}>
            {numbers.format(before)} <span aria-hidden="true">→</span>
            <span className="visually-hidden"> {c(language, 'proposed')} </span>{' '}
            {numbers.format(after)}
          </dd>
        </div>
      ))}
    </dl>
  );
  const item = { kind: 'wand' as const, ...recipe };
  return (
    <section className="wand-fitting" aria-label={c(language, 'reference')} data-forge-comparison>
      <div className="forge-reference-shelf" role="group" aria-label={c(language, 'reference')}>
        {game.copies.map((entry, index) => (
          <button
            key={entry.copyId}
            type="button"
            className="game-object forge-reference-copy"
            data-forge-reference={entry.copyId}
            aria-label={c(language, 'copy', { name: name(entry), number: index + 1 })}
            aria-pressed={entry.copyId === copy.copyId}
            onClick={() => setReference({ player: game.playerId, copyId: entry.copyId })}
          >
            <Artwork
              asset={`character.${entry.wizard.id}.thumbnail`}
              language={language}
              decorative
            />
            <span>{index + 1}</span>
            {entry.copyId === copy.copyId && (
              <Artwork
                asset="ui.seal"
                className="forge-reference-seal"
                language={language}
                decorative
              />
            )}
          </button>
        ))}
      </div>
      <p className="forge-reference-name">
        {c(language, 'copy', { name: name(copy), number: game.copies.indexOf(copy) + 1 })}
      </p>
      <div className="forge-fitting-objects">
        <div>
          {current ? (
            <EquipmentArt item={current} language={language} selectionMotion={false} />
          ) : (
            <Artwork asset="ui.clear" language={language} decorative />
          )}
          <span>{c(language, current ? 'current' : 'noWand')}</span>
        </div>
        <div>
          {children ?? <EquipmentArt item={item} language={language} selectionMotion={false} />}
          <span>{c(language, 'proposed')}</span>
        </div>
      </div>
      {comparison(preview.current)}
      <details className="forge-fitting-help">
        <summary>{c(language, 'details')}</summary>
        <p>
          {c(
            language,
            'condition',
            Object.fromEntries(
              (['hp', 'maxHp', 'mana', 'maxMana'] as const).map((key) => [
                key,
                numbers.format(preview.current.before[key]),
              ]),
            ),
          )}
        </p>
        {preview.current.before.hp === 0 && <p>{c(language, 'fallen')}</p>}
        {preview.current.before.hp === preview.current.before.maxHp &&
          preview.current.healingAfter > 0 && <p>{c(language, 'fullHealth')}</p>}
        <p>{current ? equipmentName(current, language) : c(language, 'noWand')}</p>
        <p>{equipmentName(item, language)}</p>
        <p>{c(language, 'tradeoff')}</p>
        <p>{c(language, 'baseValues')}</p>
        <p>{c(language, 'forgeSeparate')}</p>
        {preview.nextExpedition && (
          <section aria-label={c(language, 'nextRun')}>
            <h4>{c(language, 'nextRun')}</h4>
            {comparison(preview.nextExpedition)}
          </section>
        )}
      </details>
      {preview.specializationDeferred && (
        <p className="forge-legacy-note">{c(language, 'legacy')}</p>
      )}
      <span className="visually-hidden">{text(language, 'ownedEquipment')}</span>
    </section>
  );
}
