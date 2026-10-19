import type { GameState } from '../game';
import type { NodeReceipt } from '../run-contracts';
import type { Affinity } from '../../domain/combat/synergies';
import { activeSynergies } from '../../domain/combat/synergies';
import type { IntentionChoice } from '../../domain/exploration/intentions';
import { sameIntentionChoice } from '../../domain/exploration/intentions';
import { flavourCollection } from './flavour-collection';
import { BOND_GROUPS, bondProgress } from '../../domain/combat/bonds';
import { HOUSES } from '../../domain/collection/traits';
import { houseProgress } from '../../domain/combat/houses';
import type { CombatRules } from '../../domain/combat/engine';
import type { CompanyIntentionChoice } from '../../domain/exploration/intentions';

export interface IntentionAvailability {
  readonly ownedAffinities: Readonly<Record<string, Affinity>>;
  readonly beanPrice: number;
  /** Live rules apply only to the next run; active previews use their saved rules. */
  readonly combatRules?: CombatRules;
}
export function companyIntentionProgress(
  game: GameState,
  availability: IntentionAvailability,
  choice: CompanyIntentionChoice,
) {
  const active = game.exploration?.run?.status === 'active' ? game.exploration.run : null;
  const rules = active ? active.campaignSnapshot?.combatRules : availability.combatRules;
  if (!rules) return null;
  const units = active
    ? active.members.map((m) => m.unit)
    : game.copies.map((copy) => ({
        id: copy.copyId,
        wizardId: copy.wizard.id,
        hp: copy.wizard.stats.maxHp,
        house: rules.houseMembers?.[copy.wizard.id],
      }));
  if (choice.focus === 'house')
    return rules.houseSynergies
      ? houseProgress(units).find((p) => p.house === choice.house)!
      : null;
  return rules.bonds ? bondProgress(units, rules.bonds, choice.group) : null;
}
/** Only directly owned alternatives are promised. Temporary offers are not guaranteed ownership. */
export function availableIntentions(
  game: GameState,
  availability: IntentionAvailability,
): readonly IntentionChoice[] {
  const run = game.exploration?.run;
  if (!run || run.status === 'active') return Object.freeze([]);
  const options: IntentionChoice[] = [];
  const selected =
    game.exploration?.intention?.runId === null ? game.exploration.intention.choice : null;
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
  const companies: readonly CompanyIntentionChoice[] = [
    ...HOUSES.map((house) => ({ kind: 'company' as const, focus: 'house' as const, house })),
    ...BOND_GROUPS.map((group) => ({ kind: 'company' as const, focus: 'bond' as const, group })),
  ];
  // A suggestion must not invalidate an already selected company merely because ownership grows.
  const selectedCompany =
    selected?.kind === 'company'
      ? companies.find(
          (choice) =>
            sameIntentionChoice(choice, selected) &&
            !!companyIntentionProgress(game, availability, choice)?.tier,
        )
      : undefined;
  const company =
    selectedCompany ??
    companies.find((choice) => {
      if (!companyIntentionProgress(game, availability, choice)?.tier) return false;
      return !battles.some((battle) =>
        battle.events.some(
          (event) =>
            (event.kind === 'house-activated' &&
              event.team === 'player' &&
              choice.focus === 'house' &&
              event.house === choice.house) ||
            (event.kind === 'bond-activated' &&
              event.team === 'player' &&
              choice.focus === 'bond' &&
              event.group === choice.group),
        ),
      );
    });
  if (company) options.push(company);
  const eligibleCompanions = game.copies.filter((copy) => !previousIds.has(copy.wizard.id));
  const companion =
    (selected?.kind === 'new-companion'
      ? eligibleCompanions.find((copy) => copy.wizard.id === selected.wizardId)
      : undefined) ?? eligibleCompanions[0];
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
  const eligibleSynergies = possible.filter((s) => !previousSynergies.has(s.affinity));
  const synergy =
    (selected?.kind === 'synergy'
      ? eligibleSynergies.find((s) => s.affinity === selected.affinity)
      : undefined) ?? eligibleSynergies[0];
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
  const visible = options.slice(0, 3);
  const selectedOption =
    selected && options.find((option) => sameIntentionChoice(option, selected));
  // A new suggestion must not make a viable, already chosen legacy plan look unavailable.
  if (selectedOption && !visible.some((option) => sameIntentionChoice(option, selectedOption)))
    visible.splice(2, 1, selectedOption);
  return Object.freeze(visible.map((option) => Object.freeze(option)));
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
          if (choice.kind === 'company')
            return battle.events.some(
              (event) =>
                (event.kind === 'house-activated' &&
                  event.team === 'player' &&
                  choice.focus === 'house' &&
                  event.house === choice.house) ||
                (event.kind === 'bond-activated' &&
                  event.team === 'player' &&
                  choice.focus === 'bond' &&
                  event.group === choice.group),
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
