import { forgeCatalogSnapshot, type ForgeCatalog } from '../../domain/economy/commerce';
import { specializedForge } from './equipment-content';
import { progressionContent } from './progression-content';
import { currentTraits, housePacts } from './house-content';
import data from '../../content/trial-v1.json';
import creatures from '../../content/creatures-v1.json';
import { creaturePacts } from './creature-content';
import { bondRulesSnapshot, BOND_GROUPS, type BondRules } from '../../domain/combat/bonds';
import { matchesClassification } from '../../domain/collection/classification';
import type { WizardDefinition } from '../../domain/collection/wizards';
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
export function trialConfiguration(contentVersion: 'a84' | 'a85' | 'a87' = 'a87'): {
  opening: OpeningConfiguration;
  campaign: CampaignConfiguration;
  starter: StarterConfiguration;
} {
  const config = structuredClone(data);
  const modern = contentVersion !== 'a84',
    extended = contentVersion === 'a87';
  const wizards = [
    ...config.catalog.wizards,
    ...(extended ? creatures.wizards : []),
  ] as WizardDefinition[];
  if (modern) {
    config.catalog.version = extended ? 4 : 3;
    config.toadTable.version = extended ? 4 : 3;
    config.toadTable.catalogVersion = extended ? 4 : 3;
  }
  const opening = {
    catalog: {
      ...config.catalog,
      wizards: wizards.map((w) => ({
        ...w,
        ...(modern ? { traits: currentTraits(w.id, extended ? 2 : 1) } : {}),
      })),
    },
    table: {
      ...config.toadTable,
      entries: [
        ...config.toadTable.entries,
        ...(extended ? creatures.wizards.map((w) => ({ wizardId: w.id, weight: 1 })) : []),
      ],
      ...(modern ? { finish: { version: 1, enchanted: 1, total: 100 } } : {}),
    },
    shop: config.shop,
    commerce: {
      ...config.commerce,
      forge: specializedForge(forgeCatalogSnapshot(config.commerce.forge as ForgeCatalog)),
    },
  } as OpeningConfiguration;
  const base = config.campaign as unknown as Omit<Campaign, 'nodes'>;
  const affinities = { ...config.affinities, ...(extended ? creatures.affinities : {}) } as Record<
    string,
    Affinity
  >;
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
    ...(modern && currentTraits(wizardId, extended ? 2 : 1)?.house
      ? { house: currentTraits(wizardId, extended ? 2 : 1)!.house }
      : {}),
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
    combatRules: modern
      ? {
          ...base.combatRules,
          version: extended ? 3 : 2,
          ...(extended
            ? {
                bonds: bondRulesSnapshot({
                  ...creatures.bondRules,
                  members: Object.fromEntries(
                    BOND_GROUPS.map((group) => [
                      group,
                      opening.catalog.wizards
                        .filter((w) => matchesClassification(w.traits, group))
                        .map((w) => w.id),
                    ]),
                  ),
                } as unknown as BondRules),
              }
            : {}),
          houseSynergies: 1,
          houseMembers: Object.fromEntries(
            opening.catalog.wizards.flatMap((w) =>
              w.traits?.house ? [[w.id, w.traits.house]] : [],
            ),
          ),
        }
      : base.combatRules,
    equipmentRulesVersion: 2,
    tacticalContent: {
      version: extended ? 4 : modern ? 3 : 2,
      nodes: progressionContent(nodes, opening.catalog, affinities, base.graph, 'discovery'),
    },
    challengeContent: (challenge, graph, initialWizardIds) => {
      const plans = progressionContent(nodes, opening.catalog, affinities, graph, challenge);
      const housed = modern
        ? housePacts(plans, opening.catalog, affinities, graph, initialWizardIds)
        : plans;
      return extended
        ? creaturePacts(housed, opening.catalog, affinities, graph, initialWizardIds)
        : housed;
    },
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
