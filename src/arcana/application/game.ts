import { seasonalStateSnapshot, type SeasonalState } from '../domain/seasonal/events';
import { seasonalReceiptSnapshot, type SeasonalReceipt } from './seasonal-events';
import { encounterTradeSnapshot } from '../domain/exploration/encounter-trades';
import { nodeOptionsSnapshot } from './node-options';
import { encounterResolutionSnapshot } from '../domain/exploration/encounters';
import {
  validateCatalog,
  wizardSnapshot,
  type OwnedWizard,
  type WizardDefinition,
} from '../domain/collection/wizards';
import {
  inventorySnapshot,
  validateInventory,
  type Inventory,
  type PurchaseRequest,
} from '../domain/economy/inventory';
import { ArcanaError } from '../domain/errors';
import { validDomainId } from '../domain/identifiers';
import { explorationSnapshot, runSnapshot, type ExplorationState } from '../domain/exploration/run';
import { validateReward } from '../domain/economy/rewards';
import { combatSnapshot } from '../domain/combat/record';
import type { NodeReceipt, StartRunReceipt } from './run-contracts';
import { createSeed } from '../domain/combat/seed';
import { EMPTY_TEAM, teamSnapshot, validateTeam, type Team } from '../domain/collection/team';
import type { StarterKitReceipt, TeamReceipt } from './team-contracts';
import { equipmentSnapshot } from '../domain/economy/equipment';
import { intentionReceiptSnapshot, type SetIntentionReceipt } from './set-intention';
import type { ForgeReceipt, VaultReceipt } from './commerce-contracts';

export interface OpenToadRequest {
  readonly unitId: string;
  readonly catalogVersion: number;
  readonly tableVersion: number;
}
export interface BuyOpenToadRequest {
  readonly priceVersion: number;
  readonly catalogVersion: number;
  readonly tableVersion: number;
}
export interface BuyOpenToadReceipt {
  readonly id: string;
  readonly kind: 'buy-open-toad';
  readonly request: BuyOpenToadRequest;
  readonly unitId: string;
  readonly spentCrowns: number;
  readonly wizard: WizardDefinition;
  readonly copyId: string;
  readonly isNew: boolean;
}
export type ToadOpeningReceipt = OpeningReceipt | BuyOpenToadReceipt;
export interface PurchaseReceipt {
  readonly id: string;
  readonly kind: 'purchase';
  readonly request: PurchaseRequest;
  readonly spentCrowns: number;
  readonly unitIds: readonly string[];
}
export interface OpeningReceipt {
  readonly id: string;
  readonly kind: 'open-toad';
  readonly request: OpenToadRequest;
  readonly wizard: WizardDefinition;
  readonly copyId: string;
  readonly isNew: boolean;
}
export type OperationReceipt =
  | SeasonalReceipt
  | SetIntentionReceipt
  | PurchaseReceipt
  | OpeningReceipt
  | BuyOpenToadReceipt
  | StartRunReceipt
  | NodeReceipt
  | StarterKitReceipt
  | TeamReceipt
  | ForgeReceipt
  | VaultReceipt;
export interface GameState {
  readonly schemaVersion: 1;
  readonly playerId: string;
  readonly revision: number;
  readonly inventory: Inventory;
  readonly copies: readonly OwnedWizard[];
  readonly receipts: readonly OperationReceipt[];
  readonly exploration?: ExplorationState;
  readonly team?: Team;
  readonly seasonal?: SeasonalState;
}

/** Changes run in isolation and are returned only after their durable commit succeeds. */
export interface GameTransactions {
  read(playerId: string): Promise<GameState>;
  transact(playerId: string, change: (current: GameState) => GameState): Promise<GameState>;
}
export interface PlayerAccounts extends GameTransactions {
  create(initial: GameState): Promise<GameState>;
}
export interface OperationResult {
  readonly state: GameState;
  readonly receipt: OperationReceipt;
}
export interface OperationCommand<Request> {
  readonly key: string;
  readonly expectedRevision: number;
  readonly request: Request;
}

const positiveInteger = (value: number) => Number.isSafeInteger(value) && value > 0;
const sameWizard = (a: WizardDefinition, b: WizardDefinition) =>
  a.id === b.id &&
  a.rarity === b.rarity &&
  a.stars === b.stars &&
  a.finish?.id === b.finish?.id &&
  a.finish?.version === b.finish?.version &&
  a.traits?.version === b.traits?.version &&
  a.traits?.house === b.traits?.house &&
  a.traits?.school === b.traits?.school &&
  a.traits?.profession === b.traits?.profession &&
  a.name.es === b.name.es &&
  a.name.en === b.name.en &&
  a.context.es === b.context.es &&
  a.context.en === b.context.en &&
  a.stats.maxHp === b.stats.maxHp &&
  a.stats.maxMana === b.stats.maxMana &&
  a.stats.power === b.stats.power &&
  a.stats.speed === b.stats.speed;

export function validateGame(value: unknown): asserts value is GameState {
  try {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error();
    const state = value as GameState;
    if (
      state.schemaVersion !== 1 ||
      !validDomainId(state.playerId) ||
      !positiveInteger(state.revision) ||
      !Array.isArray(state.copies) ||
      !Array.isArray(state.receipts) ||
      new Set(state.copies.map((copy) => copy.copyId)).size !== state.copies.length ||
      new Set(state.receipts.map((receipt) => receipt.id)).size !== state.receipts.length
    )
      throw Error();
    validateInventory(state.inventory);
    if (state.seasonal !== undefined) {
      const seasonal = seasonalStateSnapshot(state.seasonal);
      const seasonalReceipts = state.receipts
        .filter((r): r is SeasonalReceipt => r.kind === 'seasonal-event')
        .map(seasonalReceiptSnapshot);
      for (const participation of seasonal.participations) {
        const joined = seasonalReceipts.find(
          (r) =>
            r.request.action === 'join' && r.request.editionId === participation.edition.editionId,
        );
        if (
          !joined ||
          joined.participation.joinedAt !== participation.joinedAt ||
          JSON.stringify(joined.participation.edition) !== JSON.stringify(participation.edition)
        )
          throw Error();
        for (const runId of participation.boundRunIds) {
          if (
            joined.run?.id !== runId &&
            !state.receipts.some((r) => r.kind === 'start-run' && r.run.id === runId)
          )
            throw Error();
        }
        for (const opportunity of participation.opportunities) {
          const resolved = seasonalReceipts.find(
            (r) =>
              r.request.editionId === participation.edition.editionId &&
              r.request.action === opportunity.action &&
              r.request.runId === opportunity.runId &&
              r.run?.visited.length === opportunity.visited,
          );
          if (
            !resolved ||
            JSON.stringify(resolved.participation.opportunities.at(-1)) !==
              JSON.stringify(opportunity)
          )
            throw Error();
        }
      }
      for (const keepsake of seasonal.keepsakes) {
        const granted = seasonalReceipts.find((r) => r.id === keepsake.operationId);
        if (!granted || JSON.stringify(granted.keepsake) !== JSON.stringify(keepsake))
          throw Error();
      }
    }
    validateTeam(
      state.team ?? EMPTY_TEAM,
      state.copies.map((c) => c.copyId),
      state.inventory.equipment ?? [],
    );
    if (state.exploration !== undefined) {
      explorationSnapshot(state.exploration);
      for (const member of [
        ...(state.exploration.run?.members ?? []),
        ...(state.exploration.run?.reserves ?? []),
      ])
        if (
          member.source === 'owned' &&
          !state.copies.some(
            (copy) => copy.copyId === member.unit.id && copy.wizard.id === member.unit.wizardId,
          )
        )
          throw Error();
    }
    for (const copy of state.copies) {
      if (
        !validDomainId(copy.copyId) ||
        !validDomainId(copy.sourceId) ||
        !['starter', 'toad'].includes(copy.origin)
      )
        throw Error();
      validateCatalog({ version: copy.catalogVersion, wizards: [copy.wizard] });
    }
    const purchased = new Set<string>();
    for (const receipt of state.receipts as readonly OperationReceipt[]) {
      if (!validDomainId(receipt.id)) throw Error();
      if (receipt.kind === 'seasonal-event') {
        seasonalReceiptSnapshot(receipt);
        if (
          !state.seasonal?.participations.some(
            (p) => p.edition.editionId === receipt.request.editionId,
          )
        )
          throw Error();
        if (
          receipt.keepsake &&
          !state.seasonal.keepsakes.some(
            (k) => k.id === receipt.keepsake!.id && k.operationId === receipt.id,
          )
        )
          throw Error();
      } else if (receipt.kind === 'set-intention') {
        intentionReceiptSnapshot(receipt);
      } else if (receipt.kind === 'starter-kit') {
        const copy = state.copies.find((c) => c.copyId === receipt.copyId);
        validateCatalog({ version: receipt.catalogVersion, wizards: [receipt.wizard] });
        if (
          receipt.id !== 'starter-kit' ||
          !copy ||
          copy.origin !== 'starter' ||
          copy.sourceId !== receipt.id ||
          state.copies.filter((c) => c.origin === 'starter' && c.sourceId === receipt.id).length !==
            1 ||
          copy.catalogVersion !== receipt.catalogVersion ||
          !sameWizard(copy.wizard, receipt.wizard) ||
          !Array.isArray(receipt.equipmentIds) ||
          receipt.equipmentIds.length !== 2 ||
          new Set(receipt.equipmentIds).size !== 2 ||
          receipt.equipmentIds.some((id) => !state.inventory.equipment?.some((e) => e.id === id))
        )
          throw Error();
      } else if (receipt.kind === 'set-team' || receipt.kind === 'equip-equipment') {
        validateTeam(
          receipt.team,
          state.copies.map((c) => c.copyId),
          state.inventory.equipment ?? [],
        );
        if (receipt.run !== null) runSnapshot(receipt.run);
        if (receipt.kind === 'set-team') {
          if (
            !Array.isArray(receipt.request.copyIds) ||
            receipt.request.copyIds.length !== receipt.team.copyIds.length ||
            receipt.request.copyIds.some((id, i) => id !== receipt.team.copyIds[i])
          )
            throw Error();
        } else {
          const { copyId, slot, equipmentId } = receipt.request;
          const loadout = receipt.team.loadouts.find((l) => l.copyId === copyId);
          if (
            !state.copies.some((c) => c.copyId === copyId) ||
            !['wand', 'broom'].includes(slot) ||
            (equipmentId !== null && !validDomainId(equipmentId)) ||
            !loadout ||
            (slot === 'wand' ? loadout.wandId : loadout.broomId) !== equipmentId
          )
            throw Error();
        }
      } else if (receipt.kind === 'forge-wand' || receipt.kind === 'open-vault') {
        const gear = receipt.kind === 'forge-wand' ? [receipt.equipment] : receipt.equipment;
        const version =
          receipt.kind === 'forge-wand'
            ? receipt.request.catalogVersion
            : receipt.request.tableVersion;
        if (!positiveInteger(version) || !Array.isArray(gear) || gear.length > 5) throw Error();
        equipmentSnapshot(gear);
        for (const [index, item] of gear.entries()) {
          const owned = state.inventory.equipment?.find((e) => e.id === item.id);
          if (
            item.id !== `${receipt.id}:equipment:${index}` ||
            item.version !== version ||
            !owned ||
            JSON.stringify(equipmentSnapshot([item])) !== JSON.stringify(equipmentSnapshot([owned]))
          )
            throw Error();
        }
        if (receipt.kind === 'forge-wand') {
          if (
            !validDomainId(receipt.request.recipeId) ||
            receipt.equipment.kind !== 'wand' ||
            receipt.equipment.core === null ||
            !Number.isSafeInteger(receipt.spentCrowns) ||
            receipt.spentCrowns < 0
          )
            throw Error();
        } else {
          validateReward(receipt.reward);
          if (
            receipt.spentKeys !== 1 ||
            !validDomainId(receipt.entryId) ||
            receipt.reward.goldKeys !== 0
          )
            throw Error();
          for (const [index, kind] of receipt.reward.products.entries())
            if (
              !state.inventory.products.some(
                (unit) => unit.id === `${receipt.id}:loot:${index}` && unit.kind === kind,
              )
            )
              throw Error();
        }
      } else if (receipt.kind === 'purchase') {
        const request = receipt.request;
        if (
          !positiveInteger(request.priceVersion) ||
          !positiveInteger(request.quantity) ||
          request.quantity > 1000 ||
          !['cacao-toad', 'random-beans'].includes(request.product) ||
          !Number.isSafeInteger(receipt.spentCrowns) ||
          receipt.spentCrowns < 0 ||
          !Array.isArray(receipt.unitIds) ||
          receipt.unitIds.length !== request.quantity ||
          new Set(receipt.unitIds).size !== receipt.unitIds.length
        )
          throw Error();
        for (const [index, id] of receipt.unitIds.entries()) {
          if (
            id !== `${receipt.id}:${index}` ||
            purchased.has(id) ||
            !state.inventory.products.some(
              (unit) => unit.id === id && unit.kind === request.product,
            )
          )
            throw Error();
          purchased.add(id);
        }
      } else if (receipt.kind === 'open-toad' || receipt.kind === 'buy-open-toad') {
        const request = receipt.request;
        const unitId = receipt.kind === 'open-toad' ? receipt.request.unitId : receipt.unitId;
        if (
          receipt.kind === 'buy-open-toad' &&
          (!positiveInteger(receipt.request.priceVersion) ||
            receipt.unitId !== `${receipt.id}:0` ||
            receipt.copyId !== `${receipt.id}:copy` ||
            !Number.isSafeInteger(receipt.spentCrowns) ||
            receipt.spentCrowns < 0 ||
            purchased.has(unitId))
        )
          throw Error();
        if (receipt.kind === 'buy-open-toad') purchased.add(unitId);
        if (
          !validDomainId(unitId) ||
          !positiveInteger(request.catalogVersion) ||
          !positiveInteger(request.tableVersion) ||
          !validDomainId(receipt.copyId) ||
          typeof receipt.isNew !== 'boolean'
        )
          throw Error();
        validateCatalog({ version: request.catalogVersion, wizards: [receipt.wizard] });
        const unit = state.inventory.products.find((unit) => unit.id === unitId);
        const copyIndex = state.copies.findIndex((copy) => copy.copyId === receipt.copyId);
        const copy = state.copies[copyIndex];
        if (
          !unit ||
          unit.kind !== 'cacao-toad' ||
          unit.status !== 'consumed' ||
          unit.operationId !== receipt.id ||
          !copy ||
          copy.origin !== 'toad' ||
          copy.sourceId !== receipt.id ||
          copy.catalogVersion !== request.catalogVersion ||
          !sameWizard(copy.wizard, receipt.wizard) ||
          receipt.isNew !==
            !state.copies.slice(0, copyIndex).some((prior) => prior.wizard.id === copy.wizard.id)
        )
          throw Error();
      } else if (receipt.kind === 'start-run' || receipt.kind === 'advance-node') {
        runSnapshot(receipt.run);
        if (receipt.request.campaignVersion !== receipt.run.campaignVersion) throw Error();
        if (receipt.kind === 'start-run') {
          if (
            receipt.run.id !== receipt.id ||
            receipt.run.visited.length ||
            receipt.run.status !== 'active' ||
            receipt.request.zoneId !== receipt.run.zoneId ||
            (receipt.request.challenge !== undefined &&
              receipt.request.challenge !== receipt.run.challenge) ||
            !Array.isArray(receipt.request.copyIds) ||
            receipt.request.copyIds.length !== receipt.run.members.length ||
            receipt.run.members.some(
              (m, i) =>
                m.source !== 'owned' ||
                m.unit.id !== receipt.request.copyIds[i] ||
                !state.copies.some((c) => c.copyId === m.unit.id),
            )
          )
            throw Error();
        } else {
          validateReward(receipt.reward);
          if (
            receipt.request.runId !== receipt.run.id ||
            receipt.run.visited.at(-1) !== receipt.request.nodeId ||
            !Array.isArray(receipt.request.assignments) ||
            ![true, false, null].includes(receipt.firstVictory) ||
            (receipt.battle !== null && (!receipt.battle || typeof receipt.battle !== 'object')) ||
            (receipt.encounter !== null &&
              (!receipt.encounter || typeof receipt.encounter !== 'object'))
          )
            throw Error();
          const nodeKind = receipt.run.graph.nodes.find(
            (node) => node.id === receipt.request.nodeId,
          )?.kind;
          nodeOptionsSnapshot(receipt.request, nodeKind);
          if (
            (nodeKind === 'encounter' && receipt.request.encounterAction !== 'pass') !==
            (receipt.encounter !== null)
          )
            throw Error();
          if (receipt.encounter !== null) {
            const plan = receipt.run.campaignSnapshot?.nodes.find(
              (n) => n.nodeId === receipt.request.nodeId,
            );
            if (receipt.request.encounterAction === 'trade') {
              if (
                !receipt.encounter.trade ||
                receipt.encounter.resolution !== undefined ||
                receipt.encounter.seed !== 0 ||
                plan?.kind !== 'encounter' ||
                !plan.offer ||
                receipt.encounter.trade.offer.id !== plan.offer.id ||
                receipt.encounter.trade.choiceId !== receipt.request.encounterChoiceId ||
                receipt.encounter.trade.unitId !== receipt.request.encounterUnitId ||
                receipt.encounter.choice !==
                  plan.offer.options.findIndex((o) => o.id === receipt.request.encounterChoiceId) ||
                receipt.reward.crowns !== 0 ||
                receipt.reward.goldKeys !== 0 ||
                receipt.reward.products.length
              )
                throw Error();
              const trade = encounterTradeSnapshot(receipt.encounter.trade, receipt.run.members);
              // Persisted offer must match the immutable run's mechanics, not only its id.
              if (
                trade.offer.npcId !== plan.offer.npcId ||
                trade.offer.kind !== plan.offer.kind ||
                trade.offer.options.some((o, i) =>
                  Object.entries(o).some(
                    ([k, v]) => plan.offer!.options[i]?.[k as keyof typeof o] !== v,
                  ),
                )
              )
                throw Error();
            } else if (receipt.encounter.trade !== undefined) throw Error();
            createSeed(receipt.encounter.seed);
            if (!Number.isSafeInteger(receipt.encounter.choice) || receipt.encounter.choice < 0)
              throw Error();
            if (receipt.encounter.resolution !== undefined)
              encounterResolutionSnapshot(
                receipt.encounter.resolution,
                receipt.run.members,
                receipt.reward,
              );
          }
          const assignments = receipt.request.assignments;
          if (
            new Set(assignments.map((a) => a.unitId)).size !== assignments.length ||
            new Set(assignments.map((a) => a.beanId)).size !== assignments.length
          )
            throw Error();
          if (receipt.battle) {
            combatSnapshot(receipt.battle);
            if (receipt.battle.id !== `${receipt.id}:battle`) throw Error();
          }
          for (const assignment of assignments) {
            const unit = state.inventory.products.find((u) => u.id === assignment.beanId);
            if (
              !validDomainId(assignment.unitId) ||
              !unit ||
              unit.kind !== 'random-beans' ||
              unit.status !== 'consumed' ||
              unit.operationId !== receipt.id ||
              !receipt.battle?.events.some(
                (e) =>
                  e.kind === 'bean-activated' &&
                  e.actorId === assignment.unitId &&
                  e.unitId === assignment.beanId,
              )
            )
              throw Error();
          }
          for (const [index, kind] of receipt.reward.products.entries())
            if (
              !state.inventory.products.some(
                (u) => u.id === `${receipt.id}:loot:${index}` && u.kind === kind,
              )
            )
              throw Error();
        }
      } else throw Error();
    }
    for (const copy of state.copies)
      if (
        copy.origin === 'starter' &&
        copy.sourceId === 'starter-kit' &&
        !(state.receipts as readonly OperationReceipt[]).some(
          (receipt) => receipt.kind === 'starter-kit' && receipt.copyId === copy.copyId,
        )
      )
        throw Error();
    for (const copy of state.copies)
      if (
        copy.origin === 'toad' &&
        !(state.receipts as readonly OperationReceipt[]).some(
          (receipt) =>
            (receipt.kind === 'open-toad' || receipt.kind === 'buy-open-toad') &&
            receipt.copyId === copy.copyId,
        )
      )
        throw Error();
    for (const unit of state.inventory.products)
      if (
        unit.status === 'consumed' &&
        !(state.receipts as readonly OperationReceipt[]).some(
          (receipt) =>
            receipt.id === unit.operationId &&
            ((receipt.kind === 'open-toad' && receipt.request.unitId === unit.id) ||
              (receipt.kind === 'buy-open-toad' && receipt.unitId === unit.id) ||
              (receipt.kind === 'advance-node' &&
                receipt.request.assignments.some((a) => a.beanId === unit.id))),
        )
      )
        throw Error();
  } catch {
    throw new ArcanaError('INVALID_GAME');
  }
}

export function gameSnapshot(state: GameState): GameState {
  validateGame(state);
  return Object.freeze({
    schemaVersion: 1,
    ...(state.seasonal === undefined ? {} : { seasonal: seasonalStateSnapshot(state.seasonal) }),
    playerId: state.playerId,
    revision: state.revision,
    inventory: inventorySnapshot(state.inventory),
    team: teamSnapshot(state.team ?? EMPTY_TEAM),
    ...(state.exploration === undefined
      ? {}
      : { exploration: explorationSnapshot(state.exploration) }),
    copies: Object.freeze(
      state.copies.map((copy) => Object.freeze({ ...copy, wizard: wizardSnapshot(copy.wizard) })),
    ),
    receipts: Object.freeze(state.receipts.map(snapshotReceipt)),
  });
}

function snapshotReceipt(receipt: OperationReceipt): OperationReceipt {
  if (receipt.kind === 'seasonal-event') return seasonalReceiptSnapshot(receipt);
  if (receipt.kind === 'set-intention') return intentionReceiptSnapshot(receipt);
  if (receipt.kind === 'buy-open-toad')
    return Object.freeze({
      ...receipt,
      request: Object.freeze({ ...receipt.request }),
      wizard: wizardSnapshot(receipt.wizard),
    });
  if (receipt.kind === 'forge-wand')
    return Object.freeze({
      ...receipt,
      request: Object.freeze({ ...receipt.request }),
      equipment: equipmentSnapshot([receipt.equipment])[0],
    });
  if (receipt.kind === 'open-vault')
    return Object.freeze({
      ...receipt,
      request: Object.freeze({ ...receipt.request }),
      reward: Object.freeze({
        ...receipt.reward,
        products: Object.freeze([...receipt.reward.products]),
      }),
      equipment: equipmentSnapshot(receipt.equipment),
    });
  if (receipt.kind === 'starter-kit')
    return Object.freeze({
      ...receipt,
      wizard: wizardSnapshot(receipt.wizard),
      equipmentIds: Object.freeze([...receipt.equipmentIds]),
    });
  if (receipt.kind === 'set-team')
    return Object.freeze({
      ...receipt,
      request: Object.freeze({ copyIds: Object.freeze([...receipt.request.copyIds]) }),
      team: teamSnapshot(receipt.team),
      run: receipt.run === null ? null : runSnapshot(receipt.run),
    });
  if (receipt.kind === 'equip-equipment')
    return Object.freeze({
      ...receipt,
      request: Object.freeze({ ...receipt.request }),
      team: teamSnapshot(receipt.team),
      run: receipt.run === null ? null : runSnapshot(receipt.run),
    });
  return receipt.kind === 'purchase'
    ? Object.freeze({
        ...receipt,
        request: Object.freeze({ ...receipt.request }),
        unitIds: Object.freeze([...receipt.unitIds]),
      })
    : receipt.kind === 'open-toad'
      ? Object.freeze({
          ...receipt,
          request: Object.freeze({ ...receipt.request }),
          wizard: wizardSnapshot(receipt.wizard),
        })
      : receipt.kind === 'start-run'
        ? Object.freeze({
            ...receipt,
            request: Object.freeze({
              ...receipt.request,
              copyIds: Object.freeze([...receipt.request.copyIds]),
            }),
            run: runSnapshot(receipt.run),
          })
        : Object.freeze({
            ...receipt,
            request: Object.freeze({
              ...receipt.request,
              assignments: Object.freeze(
                receipt.request.assignments.map((a) => Object.freeze({ ...a })),
              ),
            }),
            run: runSnapshot(receipt.run),
            reward: Object.freeze({
              ...receipt.reward,
              products: Object.freeze([...receipt.reward.products]),
            }),
            battle: receipt.battle === null ? null : combatSnapshot(receipt.battle),
            encounter:
              receipt.encounter === null
                ? null
                : Object.freeze({
                    seed: receipt.encounter.seed,
                    choice: receipt.encounter.choice,
                    ...(receipt.encounter.trade
                      ? {
                          trade: encounterTradeSnapshot(
                            receipt.encounter.trade,
                            receipt.run.members,
                          ),
                        }
                      : {}),
                    ...(receipt.encounter.resolution === undefined
                      ? {}
                      : {
                          resolution: encounterResolutionSnapshot(
                            receipt.encounter.resolution,
                            receipt.run.members,
                            receipt.reward,
                          ),
                        }),
                  }),
          });
}

export function checkPlayer(state: GameState, playerId: string): void {
  validateGame(state);
  if (state.playerId !== playerId) throw new ArcanaError('PLAYER_MISMATCH');
}
export function checkRevision(state: GameState, expectedRevision: number): void {
  if (state.revision !== expectedRevision || !positiveInteger(expectedRevision))
    throw new ArcanaError('STALE_GAME');
}
export function operationResult(state: GameState, key: string): OperationResult {
  const snapshot = gameSnapshot(state);
  const receipt = snapshot.receipts.find((receipt) => receipt.id === key);
  if (!receipt) throw new ArcanaError('INVALID_OPERATION');
  return Object.freeze({ state: snapshot, receipt });
}
