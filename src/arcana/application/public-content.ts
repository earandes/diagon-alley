import { encounterOfferSnapshot } from '../domain/exploration/encounter-trades';
import { seasonalEditionSnapshot, type SeasonalEdition } from '../domain/seasonal/events';
import { EXPEDITION_CHALLENGES, type ExpeditionChallenge } from '../domain/exploration/challenges';
import { encounterChoiceSnapshot } from '../domain/exploration/encounters';
import { unitSnapshot, type Affinity } from '../domain/combat/engine';
import type { Reward } from '../domain/economy/rewards';
import { commerceSnapshot, type CommerceCatalogs } from '../domain/economy/commerce';
import {
  validateToadTable,
  wizardSnapshot,
  type WizardCatalog,
  type ToadTable,
} from '../domain/collection/wizards';
import { validateShop, type ShopCatalog } from '../domain/economy/inventory';
import { validateCombatRules, type CombatRules } from '../domain/combat/engine';
import { validateGraph, type NodeGraph } from '../domain/exploration/route';
import { type NodePlan, validateCampaign } from '../domain/exploration/nodes';
import { validDomainId } from '../domain/identifiers';
import { ArcanaError } from '../domain/errors';
import type { OpeningConfiguration } from './shop-use-cases';
import type { CampaignConfiguration } from './run-use-cases';
export interface PublicContent {
  readonly seasonalEdition?: SeasonalEdition;
  readonly commerce?: CommerceCatalogs;
  readonly catalog: WizardCatalog;
  readonly toadTable: ToadTable;
  readonly shop: ShopCatalog;
  readonly campaign: {
    readonly version: number;
    readonly zoneId: string;
    readonly nextZoneId: string;
    readonly graph: NodeGraph;
    readonly challenges?: readonly ExpeditionChallenge[];
    readonly nodes?: readonly NodePlan[];
    readonly rounding?: 'floor' | 'ceil';
    readonly ownedAffinities?: Readonly<Record<string, Affinity>>;
  };
  readonly combatRules: CombatRules;
}
/** Only named, public data crosses this projection; authority callbacks/metadata remain private. */
export function projectPublicContent(
  opening: OpeningConfiguration,
  campaign: CampaignConfiguration,
  seasonalEdition?: SeasonalEdition,
): PublicContent {
  validateToadTable(opening.catalog, opening.table);
  validateShop(opening.shop);
  validateCampaign(campaign);
  return publicContentSnapshot({
    ...(seasonalEdition ? { seasonalEdition } : {}),
    ...(opening.commerce ? { commerce: opening.commerce } : {}),
    catalog: opening.catalog,
    toadTable: opening.table,
    shop: opening.shop,
    campaign: {
      version: campaign.version,
      zoneId: campaign.zoneId,
      nextZoneId: campaign.nextZoneId,
      graph: campaign.graph,
      ...(campaign.challengeContent ? { challenges: EXPEDITION_CHALLENGES } : {}),
      nodes: campaign.nodes,
      rounding: campaign.rounding,
      ownedAffinities: campaign.ownedAffinities,
    },
    combatRules: campaign.combatRules,
  });
}
export function publicContentSnapshot(value: unknown): PublicContent {
  const content = value as PublicContent;
  const opening = { catalog: content.catalog, table: content.toadTable, shop: content.shop };
  const campaign = { ...content.campaign, combatRules: content.combatRules };
  validateToadTable(opening.catalog, opening.table);
  validateShop(opening.shop);
  validateGraph(campaign.graph);
  validateCombatRules(campaign.combatRules);
  if (
    !Number.isSafeInteger(campaign.version) ||
    campaign.version < 1 ||
    !validDomainId(campaign.zoneId) ||
    !validDomainId(campaign.nextZoneId) ||
    campaign.zoneId === campaign.nextZoneId
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
  if (campaign.nodes !== undefined)
    validateCampaign({ ...campaign, nodes: campaign.nodes, rounding: campaign.rounding! });
  if (
    campaign.challenges !== undefined &&
    (!Array.isArray(campaign.challenges) ||
      campaign.challenges.length !== 3 ||
      campaign.challenges.some((c, i) => c !== EXPEDITION_CHALLENGES[i]))
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
  const rules = campaign.combatRules;
  const affinities = campaign.ownedAffinities;
  if (
    affinities !== undefined &&
    (!affinities ||
      typeof affinities !== 'object' ||
      Array.isArray(affinities) ||
      Object.entries(affinities).some(
        ([id, affinity]) =>
          !opening.catalog.wizards.some((w) => w.id === id) ||
          !['neutral', 'alchemy', 'fire', 'shadows'].includes(affinity),
      ))
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
  return Object.freeze({
    ...(content.seasonalEdition === undefined
      ? {}
      : { seasonalEdition: seasonalEditionSnapshot(content.seasonalEdition) }),
    ...(content.commerce === undefined ? {} : { commerce: commerceSnapshot(content.commerce) }),
    catalog: Object.freeze({
      version: opening.catalog.version,
      wizards: Object.freeze(opening.catalog.wizards.map(wizardSnapshot)),
    }),
    toadTable: Object.freeze({
      ...(opening.table.finish ? { finish: Object.freeze({ ...opening.table.finish }) } : {}),
      version: opening.table.version,
      catalogVersion: opening.table.catalogVersion,
      entries: Object.freeze(
        opening.table.entries.map((entry) =>
          Object.freeze({ wizardId: entry.wizardId, weight: entry.weight }),
        ),
      ),
    }),
    shop: Object.freeze({
      version: opening.shop.version,
      products: Object.freeze(
        opening.shop.products.map((product) =>
          Object.freeze({ kind: product.kind, crowns: product.crowns }),
        ),
      ),
    }),
    campaign: Object.freeze({
      ...(campaign.challenges ? { challenges: Object.freeze([...campaign.challenges]) } : {}),
      ...(affinities === undefined ? {} : { ownedAffinities: Object.freeze({ ...affinities }) }),
      ...(campaign.nodes
        ? { nodes: Object.freeze(campaign.nodes.map(publicNodePlan)), rounding: campaign.rounding }
        : {}),
      version: campaign.version,
      zoneId: campaign.zoneId,
      nextZoneId: campaign.nextZoneId,
      graph: Object.freeze({
        version: campaign.graph.version,
        nodes: Object.freeze(
          campaign.graph.nodes.map((node) =>
            Object.freeze({
              id: node.id,
              row: node.row,
              kind: node.kind,
              next: Object.freeze([...node.next]),
              ...(node.column === undefined ? {} : { column: node.column }),
            }),
          ),
        ),
      }),
    }),
    combatRules: Object.freeze({
      ...(rules.houseSynergies ? { houseSynergies: rules.houseSynergies } : {}),
      ...(rules.houseMembers ? { houseMembers: Object.freeze({ ...rules.houseMembers }) } : {}),
      version: rules.version,
      maxRounds: rules.maxRounds,
      spellManaCost: rules.spellManaCost,
      fireBurnDamage: rules.fireBurnDamage,
      alchemyHealing: rules.alchemyHealing,
      shadowInitiative: rules.shadowInitiative,
      beans: Object.freeze({
        version: rules.beans.version,
        entries: Object.freeze(
          rules.beans.entries.map((entry) =>
            Object.freeze({ flavour: entry.flavour, weight: entry.weight }),
          ),
        ),
      }),
    }),
  });
}

export function publicNodePlan(plan: NodePlan): NodePlan {
  const base = { nodeId: plan.nodeId, kind: plan.kind };
  const reward = (value: Reward) =>
    Object.freeze({
      crowns: value.crowns,
      goldKeys: value.goldKeys,
      products: Object.freeze([...value.products]),
    });
  switch (plan.kind) {
    case 'duel':
    case 'boss':
      return Object.freeze({
        ...base,
        kind: plan.kind,
        levelId: plan.levelId,
        ...(plan.threat ? { threat: plan.threat } : {}),
        opponents: Object.freeze(plan.opponents.map(unitSnapshot)),
        reward: reward(plan.reward),
      });
    case 'chest':
      return Object.freeze({ ...base, kind: plan.kind, reward: reward(plan.reward) });
    case 'refuge':
      return Object.freeze({ ...base, kind: plan.kind });
    case 'pact':
      return Object.freeze({
        ...base,
        kind: plan.kind,
        recruit: unitSnapshot(plan.recruit),
        ...(plan.recruits ? { recruits: Object.freeze(plan.recruits.map(unitSnapshot)) } : {}),
      });
    case 'encounter':
      return Object.freeze({
        ...base,
        kind: plan.kind,
        choices: Object.freeze(plan.choices.map(encounterChoiceSnapshot)),
        ...(plan.offer ? { offer: encounterOfferSnapshot(plan.offer) } : {}),
      });
  }
}
