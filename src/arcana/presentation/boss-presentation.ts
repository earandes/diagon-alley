import type { CombatUnitInput } from '../domain/combat/engine';
import type { Language } from '../domain/collection/wizards';
import { activePack, themedName } from './content-packs/active';
import { bossText } from './boss-messages';

export interface BossPresentation {
  readonly unit: CombatUnitInput;
  readonly index: number;
  readonly name: string;
  readonly figure: string;
  readonly portrait: string;
}

/** The saved roster owns identity. The legacy skin alias never replaces a nominal opponent. */
export function bossPresentation(
  opponents: readonly CombatUnitInput[],
  language: Language,
): BossPresentation | undefined {
  if (!opponents.length) return undefined;
  const nominalIndex = opponents.findIndex((unit) => unit.wizardId !== 'rival');
  const index =
    nominalIndex >= 0
      ? nominalIndex
      : Math.min(activePack.arenaAppearances.bossPosition, opponents.length - 1);
  const unit = opponents[index];
  const figure =
    nominalIndex >= 0
      ? unit.wizardId === 'circe'
        ? 'boss.circe.figure'
        : `character.${unit.wizardId}.figure`
      : activePack.arenaAppearances.boss;
  return Object.freeze({
    unit,
    index,
    name:
      nominalIndex >= 0
        ? themedName(unit.wizardId, bossText(language, 'boss'), language)
        : bossText(language, 'boss'),
    figure,
    portrait: nominalIndex >= 0 ? `character.${unit.wizardId}.portrait` : figure,
  });
}
