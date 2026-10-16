import { previewEncounterTrade } from '../domain/exploration/encounter-trades';
import { nodeOptionsSnapshot } from './node-options';
import { randomizeRoute } from '../domain/exploration/randomize-route';
import { resolveEncounter } from '../domain/exploration/encounters';
import type { OwnedWizard } from '../domain/collection/wizards';
import {
  CombatEngine,
  validateCombatInput,
  type CombatUnitInput,
  type Combat,
  type CombatInput,
} from '../domain/combat/engine';
import type { CombatRandomFactory } from '../domain/combat/random';
import { createSeed } from '../domain/combat/seed';
import { spendCombatEssence } from '../domain/economy/essence';
import { inventorySnapshot } from '../domain/economy/inventory';
import { grantReward, victoryReward, NO_REWARD, type Reward } from '../domain/economy/rewards';
import {
  campaignSnapshot,
  selectEncounter,
  validateCampaign,
  type Campaign,
  type NodePlan,
} from '../domain/exploration/nodes';
import { bindIntention } from '../domain/exploration/intentions';
import { advanceRoute, createRoute, sameGraph } from '../domain/exploration/route';
import {
  healRun,
  runSnapshot,
  type Run,
  type RunMember,
  type ExplorationState,
} from '../domain/exploration/run';
import { ArcanaError } from '../domain/errors';
import { validDomainId } from '../domain/identifiers';
import type { AuthorityClock } from './authority-ports';
import {
  checkPlayer,
  checkRevision,
  gameSnapshot,
  operationResult,
  type GameTransactions,
  type OperationCommand,
  type OperationResult,
  type GameState,
} from './game';
import type {
  AdvanceNodeRequest,
  StartRunRequest,
  NodeReceipt,
  StartRunReceipt,
} from './run-contracts';
import { prepareOwnedUnit } from './prepare-team';
import { EMPTY_TEAM, selectTeam } from '../domain/collection/team';

export interface CampaignConfiguration extends Campaign {
  readonly equipmentRulesVersion?: 2;
  readonly challengeContent?: (
    challenge: 'discovery' | 'tactical' | 'mastery',
    graph: Campaign['graph'],
  ) => readonly NodePlan[];
  readonly tacticalContent?: { readonly version: 1 | 2; readonly nodes: readonly NodePlan[] };
  readonly routeVariation?: boolean;
  /** Optional public preparation metadata; authority still constructs every owned unit. */
  readonly ownedAffinities?: Readonly<Record<string, CombatUnitInput['affinity']>>;
  /** Authority composition reads owned equipment; requests never provide stats or multipliers. */
  readonly prepareOwned: (copy: OwnedWizard) => CombatUnitInput;
}
export interface BattleSeeds {
  next(): number;
}
export class ResolveCombatUseCase {
  constructor(
    private readonly engine: CombatEngine,
    private readonly seeds: BattleSeeds,
  ) {}
  execute(input: Omit<CombatInput, 'seed'>): Combat {
    // Validate before acquiring a seed, including ownership-independent combat preconditions.
    validateCombatInput({ ...input, seed: 0 });
    return this.engine.resolve({ ...input, seed: createSeed(this.seeds.next()) });
  }
}
const sameStart = (a: StartRunRequest, b: StartRunRequest) =>
  a.zoneId === b.zoneId &&
  a.campaignVersion === b.campaignVersion &&
  a.challenge === b.challenge &&
  a.copyIds.length === b.copyIds.length &&
  a.copyIds.every((id, i) => id === b.copyIds[i]);
const sameAdvance = (a: AdvanceNodeRequest, b: AdvanceNodeRequest) =>
  a.refugeAction === b.refugeAction &&
  a.pactAction === b.pactAction &&
  a.recruitId === b.recruitId &&
  a.replaceUnitId === b.replaceUnitId &&
  a.encounterAction === b.encounterAction &&
  a.encounterChoiceId === b.encounterChoiceId &&
  a.encounterUnitId === b.encounterUnitId &&
  a.runId === b.runId &&
  a.nodeId === b.nodeId &&
  a.campaignVersion === b.campaignVersion &&
  a.assignments.length === b.assignments.length &&
  a.assignments.every(
    (assignment, i) =>
      assignment.unitId === b.assignments[i].unitId &&
      assignment.beanId === b.assignments[i].beanId,
  );
const validVersion = (n: number) => Number.isSafeInteger(n) && n > 0;
function validateStart(request: StartRunRequest): void {
  if (
    !request ||
    !validDomainId(request.zoneId) ||
    !validVersion(request.campaignVersion) ||
    (request.challenge !== undefined &&
      !['discovery', 'tactical', 'mastery'].includes(request.challenge)) ||
    !Array.isArray(request.copyIds) ||
    request.copyIds.length < 1 ||
    request.copyIds.length > 5 ||
    request.copyIds.some((id) => !validDomainId(id)) ||
    new Set(request.copyIds).size !== request.copyIds.length
  )
    throw new ArcanaError('INVALID_FORMATION');
}
function validateAdvance(request: AdvanceNodeRequest): void {
  if (
    !request ||
    !validDomainId(request.runId) ||
    !validDomainId(request.nodeId) ||
    !validVersion(request.campaignVersion) ||
    !Array.isArray(request.assignments) ||
    request.assignments.length > 5 ||
    request.assignments.some((a) => !a || !validDomainId(a.unitId) || !validDomainId(a.beanId)) ||
    new Set(request.assignments.map((a) => a.unitId)).size !== request.assignments.length ||
    new Set(request.assignments.map((a) => a.beanId)).size !== request.assignments.length
  )
    throw new ArcanaError('INVALID_OPERATION');
  nodeOptionsSnapshot(request);
}
export class StartRunUseCase {
  constructor(
    private readonly games: GameTransactions,
    private readonly configuration: () => CampaignConfiguration,
    private readonly routes?: { seeds: BattleSeeds; random: CombatRandomFactory },
  ) {}
  execute = async (
    playerId: string,
    command: OperationCommand<StartRunRequest>,
  ): Promise<OperationResult> => {
    if (!validDomainId(command.key)) throw new ArcanaError('INVALID_OPERATION');
    validateStart(command.request);
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      const prior = current.receipts.find((r) => r.id === command.key);
      if (prior) {
        if (prior.kind !== 'start-run' || !sameStart(prior.request, command.request))
          throw new ArcanaError('OPERATION_CONFLICT');
        return current;
      }
      checkRevision(current, command.expectedRevision);
      const config = this.configuration();
      validateCampaign(config);
      if (command.request.challenge !== undefined && !config.challengeContent)
        throw new ArcanaError('STALE_CAMPAIGN');
      if (
        config.zoneId !== command.request.zoneId ||
        config.version !== command.request.campaignVersion
      )
        throw new ArcanaError('STALE_CAMPAIGN');
      const exploration: ExplorationState = current.exploration ?? {
        run: null,
        victories: [],
        unlockedZones: [config.zoneId],
      };
      if (!exploration.unlockedZones.includes(config.zoneId)) throw new ArcanaError('ZONE_LOCKED');
      const members: RunMember[] = command.request.copyIds.map((id) => {
        const copy = current.copies.find((c) => c.copyId === id);
        if (!copy) throw new ArcanaError('INVALID_FORMATION');
        const unit = prepareOwnedUnit(copy, config, current);
        return { source: 'owned', unit };
      });
      if (exploration.run?.status === 'active') throw new ArcanaError('RUN_ACTIVE');
      if (config.routeVariation && !this.routes) throw new ArcanaError('INVALID_CAMPAIGN');
      const routeGeneration = config.routeVariation
        ? { version: 1 as const, seed: createSeed(this.routes!.seeds.next()) }
        : undefined;
      const graph = routeGeneration
        ? randomizeRoute(config.graph, this.routes!.random.fromSeed(routeGeneration.seed))
        : config.graph;
      const run = runSnapshot({
        ...(config.equipmentRulesVersion
          ? { equipmentRulesVersion: config.equipmentRulesVersion }
          : {}),
        ...(config.challengeContent ? { challenge: command.request.challenge ?? 'discovery' } : {}),
        ...(config.tacticalContent
          ? {
              tacticalVersion: config.tacticalContent.version,
              campaignSnapshot: campaignSnapshot({
                ...config,
                graph,
                nodes:
                  config.challengeContent?.(command.request.challenge ?? 'discovery', graph) ??
                  config.tacticalContent.nodes,
              }),
            }
          : {}),
        ...(routeGeneration ? { routeGeneration } : {}),
        ...createRoute(command.key, graph),
        campaignVersion: config.version,
        zoneId: config.zoneId,
        graph,
        status: 'active',
        members,
      });
      const receipt: StartRunReceipt = {
        id: command.key,
        kind: 'start-run',
        request: { ...command.request, copyIds: [...command.request.copyIds] },
        run,
      };
      return gameSnapshot({
        ...current,
        revision: current.revision + 1,
        team: selectTeam(
          current.team ?? EMPTY_TEAM,
          command.request.copyIds,
          current.copies.map((c) => c.copyId),
          current.inventory.equipment ?? [],
        ),
        exploration: {
          ...exploration,
          run,
          ...(exploration.intention === undefined
            ? {}
            : { intention: bindIntention(exploration.intention, exploration.run?.id, run.id) }),
        },
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
}
export class AdvanceNodeUseCase {
  constructor(
    private readonly games: GameTransactions,
    private readonly configuration: () => CampaignConfiguration,
    private readonly combats: ResolveCombatUseCase,
    private readonly clock: AuthorityClock,
    private readonly random: CombatRandomFactory,
    private readonly seeds: BattleSeeds,
  ) {}
  execute = async (
    playerId: string,
    command: OperationCommand<AdvanceNodeRequest>,
  ): Promise<OperationResult> => {
    if (!validDomainId(command.key) || !validDomainId(`${command.key}:battle`))
      throw new ArcanaError('INVALID_OPERATION');
    validateAdvance(command.request);
    // Read permits a confirmed retry even during a clock outage; the locked transaction remains authoritative.
    const observed = await this.games.read(playerId);
    checkPlayer(observed, playerId);
    const recovered = this.replay(observed, command);
    if (recovered) return operationResult(recovered, command.key);
    const kind = observed.exploration?.run?.graph.nodes.find(
      (n) => n.id === command.request.nodeId,
    )?.kind;
    const now = kind === 'duel' || kind === 'boss' ? await this.clock.now() : 0;
    const state = await this.games.transact(playerId, (current) => {
      checkPlayer(current, playerId);
      const replayed = this.replay(current, command);
      if (replayed) return current;
      checkRevision(current, command.expectedRevision);
      const exploration = current.exploration,
        original = exploration?.run;
      if (!exploration || !original || original.id !== command.request.runId)
        throw new ArcanaError('INVALID_ROUTE');
      if (original.status !== 'active') throw new ArcanaError('RUN_CLOSED');
      const config = original.campaignSnapshot ?? this.configuration();
      validateCampaign(config);
      if (
        config.version !== command.request.campaignVersion ||
        original.campaignVersion !== config.version ||
        config.zoneId !== original.zoneId ||
        !sameGraph(
          original.graph,
          original.campaignSnapshot
            ? original.campaignSnapshot.graph
            : original.routeGeneration
              ? randomizeRoute(config.graph, this.random.fromSeed(original.routeGeneration.seed))
              : config.graph,
        )
      )
        throw new ArcanaError('STALE_CAMPAIGN');
      const route = advanceRoute(original, original.graph, command.request.nodeId);
      const plan = config.nodes.find((n) => n.nodeId === command.request.nodeId)!;
      const options = nodeOptionsSnapshot(command.request, plan.kind);
      if (plan.kind !== 'duel' && plan.kind !== 'boss' && command.request.assignments.length)
        throw new ArcanaError('INVALID_OPERATION');
      let inventory = current.inventory,
        members = original.members,
        status: Run['status'] = 'active',
        battle: Combat | null = null;
      let reward: Reward = NO_REWARD,
        firstVictory: boolean | null = null,
        encounter: NodeReceipt['encounter'] = null;
      let victories = exploration.victories,
        unlockedZones = exploration.unlockedZones;
      if (plan.kind === 'duel' || plan.kind === 'boss') {
        if (members.length < 3) throw new ArcanaError('INVALID_FORMATION');
        for (const assignment of command.request.assignments) {
          if (!members.some((m) => m.unit.id === assignment.unitId && m.unit.hp > 0))
            throw new ArcanaError('INVALID_FORMATION');
          if (
            !inventory.products.some(
              (u) =>
                u.id === assignment.beanId && u.kind === 'random-beans' && u.status === 'available',
            )
          )
            throw new ArcanaError('UNIT_UNAVAILABLE');
        }
        inventory = inventorySnapshot({
          ...inventory,
          essence: spendCombatEssence(inventory.essence, now),
        });
        const player = members.map((m) => ({
          ...m.unit,
          ...(command.request.assignments.find((a) => a.unitId === m.unit.id)
            ? {
                beanUnitId: command.request.assignments.find((a) => a.unitId === m.unit.id)!.beanId,
              }
            : {}),
        }));
        // Preflight loot allocations before generating seed or results.
        const alreadyWon = victories.some(
          (v) => v.levelId === plan.levelId && v.version === config.version,
        );
        grantReward(
          inventory,
          victoryReward(plan.reward, !alreadyWon, config.rounding),
          command.key,
        );
        battle = this.combats.execute({
          id: `${command.key}:battle`,
          player,
          rival: plan.opponents,
          rules: config.combatRules,
        });
        inventory = inventorySnapshot({
          ...inventory,
          products: inventory.products.map((u) =>
            command.request.assignments.some((a) => a.beanId === u.id)
              ? { ...u, status: 'consumed', operationId: command.key }
              : u,
          ),
        });
        members = members.map((m) => {
          const result = battle!.player.find((u) => u.id === m.unit.id)!;
          return { ...m, unit: { ...m.unit, hp: result.hp, mana: result.mana } };
        });
        if (battle.outcome === 'player') {
          firstVictory = !victories.some(
            (v) => v.levelId === plan.levelId && v.version === config.version,
          );
          reward = victoryReward(plan.reward, firstVictory, config.rounding);
          if (firstVictory)
            victories = [...victories, { levelId: plan.levelId, version: config.version }];
          if (plan.kind === 'boss') {
            status = 'won';
            if (!unlockedZones.includes(config.nextZoneId))
              unlockedZones = [...unlockedZones, config.nextZoneId];
          }
        } else status = battle.outcome === 'rival' ? 'lost' : 'draw';
      } else if (plan.kind === 'refuge') {
        members =
          options.refugeAction === 'focus'
            ? members.map((member) => ({
                ...member,
                unit: {
                  ...member.unit,
                  mana:
                    member.unit.hp > 0
                      ? Math.min(member.unit.maxMana, member.unit.mana + member.unit.maxMana * 0.4)
                      : member.unit.mana,
                },
              }))
            : healRun(members, 0.4);
      } else if (plan.kind === 'chest') reward = plan.reward;
      else if (plan.kind === 'pact') {
        if (options.pactAction === 'pass') {
          if (members.length < 3 || options.replaceUnitId !== undefined)
            throw new ArcanaError('INVALID_FORMATION');
        } else {
          const recruit = plan.recruits
            ? plan.recruits.find((unit) => unit.id === options.recruitId)
            : plan.recruit;
          if (
            !recruit ||
            (!plan.recruits && options.recruitId !== undefined && options.recruitId !== recruit.id)
          )
            throw new ArcanaError('INVALID_OPERATION');
          if (members.some((m) => m.unit.id === recruit.id))
            throw new ArcanaError('INVALID_FORMATION');
          if (options.replaceUnitId !== undefined) {
            const replaced = members.find((m) => m.unit.id === options.replaceUnitId);
            if (members.length !== 5 || replaced?.source !== 'temporary')
              throw new ArcanaError('INVALID_FORMATION');
            members = members.filter((m) => m.unit.id !== options.replaceUnitId);
          }
          if (members.length >= 5) throw new ArcanaError('INVALID_FORMATION');
          members = [...members, { source: 'temporary', unit: recruit }];
        }
      } else if (plan.kind === 'encounter' && options.encounterAction !== 'pass' && plan.offer) {
        if (options.encounterAction !== 'trade') throw new ArcanaError('INVALID_OPERATION');
        const projected = previewEncounterTrade(
          members,
          plan.offer,
          options.encounterChoiceId,
          options.encounterUnitId,
        );
        if (!projected.eligible) throw new ArcanaError('INVALID_FORMATION');
        members = projected.members;
        encounter = {
          seed: 0,
          choice: plan.offer.options.findIndex((o) => o.id === options.encounterChoiceId),
          trade: {
            offer: plan.offer,
            choiceId: options.encounterChoiceId!,
            ...(options.encounterUnitId ? { unitId: options.encounterUnitId } : {}),
            vitals: projected.vitals,
          },
        };
      } else if (plan.kind === 'encounter' && options.encounterAction !== 'pass') {
        if (options.encounterAction === 'trade') throw new ArcanaError('INVALID_OPERATION');
        for (const option of plan.choices)
          if (option.effect.kind === 'reward')
            grantReward(inventory, option.effect.reward, command.key);
        const seed = createSeed(this.seeds.next()),
          choice = selectEncounter(plan, this.random.fromSeed(seed));
        const resolved = resolveEncounter(members, plan.choices[choice]);
        encounter = { seed, choice, resolution: resolved.resolution };
        members = resolved.members;
        reward = resolved.reward;
        if (!members.some((member) => member.unit.hp > 0)) status = 'lost';
      }
      inventory = grantReward(inventory, reward, command.key);
      const run = runSnapshot({ ...original, visited: route.visited, status, members });
      const receipt: NodeReceipt = {
        id: command.key,
        kind: 'advance-node',
        request: {
          ...command.request,
          assignments: command.request.assignments.map((a) => ({ ...a })),
        },
        run,
        reward,
        firstVictory,
        battle,
        encounter,
      };
      return gameSnapshot({
        ...current,
        revision: current.revision + 1,
        inventory,
        exploration: { ...exploration, run, victories, unlockedZones },
        receipts: [...current.receipts, receipt],
      });
    });
    return operationResult(state, command.key);
  };
  private replay(
    current: GameState,
    command: OperationCommand<AdvanceNodeRequest>,
  ): GameState | null {
    const prior = current.receipts.find((r) => r.id === command.key);
    if (!prior) return null;
    if (prior.kind !== 'advance-node' || !sameAdvance(prior.request, command.request))
      throw new ArcanaError('OPERATION_CONFLICT');
    return current;
  }
}
