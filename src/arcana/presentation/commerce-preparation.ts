import type { GameState } from '../application/game';
import type { PublicContent } from '../application/public-content';
import { activateBean, validateBeanTable, type BeanTable } from '../domain/combat/beans';
import type { OwnedWizard } from '../domain/collection/wizards';
import type { WandRecipe } from '../domain/economy/commerce';
import { ArcanaError } from '../domain/errors';
import { previewEquipment } from './contextual-preparation';

/** A hypothetical item exists only in this read projection, never in a request or saved inventory. */
export function previewWandRecipe(
  game: GameState,
  copy: OwnedWizard,
  recipe: WandRecipe,
  version: number,
  content?: PublicContent,
) {
  const owned = game.copies.find((entry) => entry.copyId === copy.copyId);
  if (!owned) throw new ArcanaError('INVALID_FORMATION');
  let id = 'preview:wand';
  while (game.inventory.equipment?.some((entry) => entry.id === id)) id += ':next';
  const item = {
    id,
    version,
    kind: 'wand' as const,
    wood: recipe.wood,
    core: recipe.core,
    powerBonus: recipe.powerBonus,
    multiplier: recipe.multiplier,
    ...(recipe.initiativeBonus === undefined ? {} : { initiativeBonus: recipe.initiativeBonus }),
    ...(recipe.healing === undefined ? {} : { healing: recipe.healing }),
  };
  const hypothetical: GameState = {
    ...game,
    inventory: { ...game.inventory, equipment: [...(game.inventory.equipment ?? []), item] },
  };
  const run = game.exploration?.run;
  const specializationDeferred =
    run?.status === 'active' &&
    run.equipmentRulesVersion !== 2 &&
    !!(recipe.initiativeBonus || recipe.healing);
  return {
    current: previewEquipment(hypothetical, owned, 'wand', id, content),
    specializationDeferred,
    nextExpedition: specializationDeferred
      ? previewEquipment(
          {
            ...hypothetical,
            exploration: hypothetical.exploration && { ...hypothetical.exploration, run: null },
          },
          owned,
          'wand',
          id,
          content,
        )
      : null,
  };
}

/** Distribution is public; neither this projection nor a discovered flavour predicts a jar. */
export function beanRiskPreview(table: BeanTable) {
  const total = validateBeanTable(table);
  return {
    version: table.version,
    possibilities: table.entries.map((entry) => ({
      flavour: entry.flavour,
      probability: entry.weight / total,
    })),
    penaltyProbability:
      table.entries
        .filter((entry) => entry.flavour === 'earth' || entry.flavour === 'soap')
        .reduce((sum, entry) => sum + entry.weight, 0) / total,
  };
}

/** Uses the activation rule and current condition; unavailable fallen carriers cannot revive. */
export function mintRecoveryPreview(carrier: { readonly hp: number; readonly maxHp: number }) {
  if (carrier.hp <= 0) return 0;
  return activateBean({ ...carrier, effect: null }, 'mint').hp - carrier.hp;
}
