import { forgeCatalogSnapshot, type ForgeCatalog } from '../../domain/economy/commerce';
import { specializedForge } from './equipment-content';
import { progressionContent } from './progression-content';
import data from '../../content/trial-v1.json';
import type { OpeningConfiguration } from '../../application/shop-use-cases';
import type { StarterConfiguration } from '../../application/team-use-cases';
import type { CampaignConfiguration } from '../../application/run-use-cases';
import { projectPublicContent } from '../../application/public-content';
import type { Affinity, CombatUnitInput } from '../../domain/combat/engine';
import type { Campaign, NodePlan } from '../../domain/exploration/nodes';
import type { Reward } from '../../domain/economy/rewards';
import { ArcanaError } from '../../domain/errors';
interface Stats {
  hp: number;
  mana: number;
  power: number;
  speed: number;
}
/** Explicit trial data; never a claim of validated production balance. */
export function trialConfiguration(): {
  opening: OpeningConfiguration;
  campaign: CampaignConfiguration;
  starter: StarterConfiguration;
} {
  const config = structuredClone(data);
  const opening = {
    catalog: config.catalog,
    table: config.toadTable,
    shop: config.shop,
    commerce: {
      ...config.commerce,
      forge: specializedForge(forgeCatalogSnapshot(config.commerce.forge as ForgeCatalog)),
    },
  } as OpeningConfiguration;
  const base = config.campaign as unknown as Omit<Campaign, 'nodes'>;
  const affinities = config.affinities as Record<string, Affinity>;
  if (
    Object.values(affinities).some((a) => !['neutral', 'alchemy', 'fire', 'shadows'].includes(a)) ||
    opening.catalog.wizards.some((w) => !affinities[w.id])
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
  const unit = (
    id: string,
    wizardId: string,
    stats: Stats,
    affinity: Affinity = 'neutral',
  ): CombatUnitInput => ({
    id,
    wizardId,
    level: 1,
    affinity,
    hp: stats.hp,
    maxHp: stats.hp,
    mana: stats.mana,
    maxMana: stats.mana,
    power: stats.power,
    speed: stats.speed,
    wandPowerBonus: 0,
    wandMultiplier: 1,
    broomInitiative: 0,
  });
  const nodes: NodePlan[] = base.graph.nodes.map((node) => {
    if (node.kind === 'duel' || node.kind === 'boss')
      return {
        nodeId: node.id,
        kind: node.kind,
        levelId: node.id,
        opponents: [0, 1, 2].map((i) =>
          unit(
            `${node.id}:rival:${i}`,
            'rival',
            node.kind === 'boss' ? config.bossEnemy : config.enemy,
          ),
        ),
        reward: (node.kind === 'boss' ? config.bossReward : config.duelReward) as Reward,
      };
    if (node.kind === 'pact')
      return {
        nodeId: node.id,
        kind: node.kind,
        recruit: unit(
          `${node.id}:recruit`,
          config.recruit.wizardId,
          config.recruit,
          affinities[config.recruit.wizardId],
        ),
      };
    if (node.kind === 'refuge') return { nodeId: node.id, kind: node.kind };
    if (node.kind === 'chest')
      return { nodeId: node.id, kind: node.kind, reward: config.chestReward as Reward };
    return {
      nodeId: node.id,
      kind: 'encounter',
      choices: config.encounters as Extract<NodePlan, { kind: 'encounter' }>['choices'],
    };
  });
  const campaign: CampaignConfiguration = {
    ...base,
    equipmentRulesVersion: 2,
    tacticalContent: {
      version: 2,
      nodes: progressionContent(nodes, opening.catalog, affinities, base.graph, 'discovery'),
    },
    challengeContent: (challenge, graph) =>
      progressionContent(nodes, opening.catalog, affinities, graph, challenge),
    routeVariation: true,
    ownedAffinities: Object.freeze({ ...affinities }),
    nodes,
    prepareOwned: (copy) =>
      unit(
        copy.copyId,
        copy.wizard.id,
        {
          hp: copy.wizard.stats.maxHp,
          mana: copy.wizard.stats.maxMana,
          power: copy.wizard.stats.power,
          speed: copy.wizard.stats.speed,
        },
        affinities[copy.wizard.id] ?? 'neutral',
      ),
  };
  projectPublicContent(opening, campaign);
  return {
    opening,
    campaign,
    starter: { catalog: opening.catalog, apprenticeId: config.apprenticeId },
  };
}
