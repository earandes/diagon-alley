import type { GameState } from '../game';
import type { NodeReceipt } from '../run-contracts';
import type { Affinity } from '../../domain/combat/synergies';
import { activeSynergies } from '../../domain/combat/synergies';
import type { IntentionChoice } from '../../domain/exploration/intentions';
import { sameIntentionChoice } from '../../domain/exploration/intentions';
import { flavourCollection } from './flavour-collection';

export interface IntentionAvailability {
  readonly ownedAffinities: Readonly<Record<string, Affinity>>;
  readonly beanPrice: number;
}
/** Only directly owned alternatives are promised. Temporary offers are not guaranteed ownership. */
export function availableIntentions(
  game: GameState,
  availability: IntentionAvailability,
): readonly IntentionChoice[] {
  const run = game.exploration?.run;
  if (!run || run.status === 'active') return Object.freeze([]);
  const options: IntentionChoice[] = [];
  const battles = game.receipts.flatMap((receipt) =>
    receipt.kind === 'advance-node' && receipt.request.runId === run.id && receipt.battle
      ? [receipt.battle]
      : [],
  );
  const previousIds = new Set(
    battles.length
      ? battles.flatMap((battle) => battle.input.player.map((unit) => unit.wizardId))
      : run.members.map((m) => m.unit.wizardId),
  );
  const companion = game.copies.find((copy) => !previousIds.has(copy.wizard.id));
  if (companion) options.push({ kind: 'new-companion', wizardId: companion.wizard.id });
  const previousSynergies = new Set(
    battles.length
      ? battles.flatMap((battle) =>
          battle.events.flatMap((event) =>
            event.kind === 'synergy-activated' && event.team === 'player' ? [event.affinity] : [],
          ),
        )
      : activeSynergies(run.members.map((m) => m.unit)).map((s) => s.affinity),
  );
  const possible = activeSynergies(
    game.copies.map((copy) => ({
      hp: copy.wizard.stats.maxHp,
      affinity: availability.ownedAffinities[copy.wizard.id] ?? 'neutral',
    })),
  );
  const synergy = possible.find((s) => !previousSynergies.has(s.affinity));
  if (synergy) options.push({ kind: 'synergy', affinity: synergy.affinity });
  const bean = game.inventory.products.some(
    (product) => product.kind === 'random-beans' && product.status === 'available',
  );
  const affordable =
    Number.isSafeInteger(availability.beanPrice) &&
    availability.beanPrice >= 0 &&
    game.inventory.crowns >= availability.beanPrice;
  if ((bean || affordable) && flavourCollection(game).some((flavour) => !flavour.discovered))
    options.push({ kind: 'bean' });
  return Object.freeze(options.map((option) => Object.freeze(option)));
}
export function canSelectIntention(
  game: GameState,
  availability: IntentionAvailability,
  choice: IntentionChoice,
): boolean {
  return availableIntentions(game, availability).some((candidate) =>
    sameIntentionChoice(candidate, choice),
  );
}
export type IntentionStatus = 'selected' | 'active' | 'completed' | 'ended' | 'unavailable';
/** No optimistic progress: selecting a portrait, assigning a bean or opening a replay cannot complete a plan. */
export function intentionProgress(game: GameState, availability?: IntentionAvailability) {
  const intention = game.exploration?.intention;
  if (!intention) return null;
  const { choice, runId } = intention;
  const evidence =
    runId === null
      ? undefined
      : game.receipts.find((receipt): receipt is NodeReceipt => {
          if (receipt.kind !== 'advance-node' || receipt.request.runId !== runId || !receipt.battle)
            return false;
          const battle = receipt.battle;
          if (choice.kind === 'new-companion')
            return battle.input.player.some(
              (unit) =>
                unit.wizardId === choice.wizardId &&
                unit.hp > 0 &&
                game.copies.some(
                  (copy) => copy.copyId === unit.id && copy.wizard.id === choice.wizardId,
                ),
            );
          if (choice.kind === 'synergy')
            return battle.events.some(
              (event) =>
                event.kind === 'synergy-activated' &&
                event.team === 'player' &&
                event.affinity === choice.affinity,
            );
          return battle.events.some(
            (event) =>
              event.kind === 'bean-activated' &&
              battle.input.player.some((unit) => unit.id === event.actorId),
          );
        });
  let status: IntentionStatus;
  if (evidence) status = 'completed';
  else if (runId === null)
    status =
      availability && !canSelectIntention(game, availability, choice) ? 'unavailable' : 'selected';
  else
    status =
      game.exploration?.run?.id === runId && game.exploration.run.status === 'active'
        ? 'active'
        : 'ended';
  return Object.freeze({ intention, status, evidenceReceiptId: evidence?.id ?? null });
}
