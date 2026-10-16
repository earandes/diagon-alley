/** A65 offline experiment. Pure domain only; never opens a player account or database. */
import { registerHooks } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import crypto from 'node:crypto';
import ts from 'typescript';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (error) {
      if (specifier.startsWith('.')) return next(specifier + '.ts', context);
      throw error;
    }
  },
  load(url, context, next) {
    if (url.endsWith('.json'))
      return {
        format: 'module',
        shortCircuit: true,
        source: 'export default ' + fs.readFileSync(fileURLToPath(url), 'utf8') + ';',
      };
    if (url.endsWith('.ts'))
      return {
        format: 'module',
        shortCircuit: true,
        source: ts.transpileModule(fs.readFileSync(fileURLToPath(url), 'utf8'), {
          compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
        }).outputText,
      };
    return next(url, context);
  },
});

const { CombatEngine } = await import(pathToFileURL(root + '/src/arcana/domain/combat/engine.ts'));
const { SeededRandom } = await import(
  pathToFileURL(root + '/src/arcana/infrastructure/random/seeded-random.ts')
);
export const reference = JSON.parse(
  fs.readFileSync(root + '/docs/arcana/tactical-increment-2026-10-16/evidence/trial-before.json'),
);
export const engine = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) });
export function catalogUnit(wizardId, id, changes = {}) {
  const wizard = reference.catalog.wizards.find((w) => w.id === wizardId);
  if (!wizard) throw new Error('Unknown catalog fixture: ' + wizardId);
  return {
    id,
    wizardId,
    level: 1,
    affinity: reference.affinities[wizardId],
    hp: wizard.stats.maxHp,
    maxHp: wizard.stats.maxHp,
    mana: wizard.stats.maxMana,
    maxMana: wizard.stats.maxMana,
    power: wizard.stats.power,
    speed: wizard.stats.speed,
    wandPowerBonus: 0,
    wandMultiplier: 1,
    broomInitiative: 0,
    ...changes,
  };
}
export const team = (ids, side) =>
  ids.map((id, i) =>
    catalogUnit(
      id,
      side === 'player' && i === 0 && id === 'apprentice' ? 'starter:apprentice' : side + ':' + i,
    ),
  );
export function battle(player, rival, seed = 0) {
  return engine.resolve({
    id: 'tactics:' + seed,
    seed,
    player,
    rival,
    rules: reference.campaign.combatRules,
  });
}
export const score = (result) => ({
  outcome: result.outcome,
  hp: result.player.reduce((sum, unit) => sum + unit.hp, 0),
  survivors: result.player.filter((unit) => unit.hp > 0).length,
  rounds: result.rounds,
  mana: result.player.reduce((sum, unit) => sum + unit.mana, 0),
});

export function legacyUnit(id, stats, wizardId = 'rival', affinity = 'neutral') {
  return {
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
  };
}

export function candidatePlans() {
  return reference.campaign.graph.nodes.map((node) => {
    if (node.kind === 'duel') {
      const family = node.id === 'pasaje:2:0' || node.id === 'pasaje:4:2' ? 'fire' : 'vanguard';
      const ids = family === 'fire' ? ['circe', 'ember-keeper'] : ['storm-caller', 'rune-weaver'];
      return {
        nodeId: node.id,
        kind: node.kind,
        family,
        opponents: [
          ...ids.map((id, i) => catalogUnit(id, node.id + ':rival:' + i)),
          legacyUnit(node.id + ':rival:2', reference.enemy),
        ],
      };
    }
    if (node.kind === 'boss')
      return {
        nodeId: node.id,
        kind: node.kind,
        opponents: [0, 1, 2].map((i) => legacyUnit(node.id + ':rival:' + i, reference.bossEnemy)),
      };
    if (node.kind === 'pact') {
      const ids =
        node.id === 'pasaje:0:0'
          ? ['rune-weaver', 'circe']
          : node.id === 'pasaje:1:0'
            ? ['flamel', 'ember-keeper']
            : ['rune-weaver', 'morgana'];
      return {
        nodeId: node.id,
        kind: node.kind,
        candidates: ids.map((id, i) => catalogUnit(id, node.id + ':recruit:' + i)),
      };
    }
    return { nodeId: node.id, kind: node.kind };
  });
}

export function characterizePlans(plans) {
  const results = [];
  const pacts = plans.filter((n) => n.kind === 'pact');
  const offered = (node, index) => (pacts[node].recruits ?? pacts[node].candidates)[index];
  for (const plan of plans.filter((n) => n.kind === 'duel').slice(0, 2))
    for (const [name, units] of Object.entries({
      alchemy: [catalogUnit('apprentice', 'starter:apprentice'), offered(0, 0), offered(1, 0)],
      fire: [catalogUnit('apprentice', 'starter:apprentice'), offered(0, 1), offered(1, 1)],
      shadows: [catalogUnit('apprentice', 'starter:apprentice'), offered(0, 0), offered(2, 1)],
    }))
      for (const condition of [1, 0.6, 0.3])
        for (const withBeans of [false, true]) {
          const runs = Array.from({ length: 128 }, (_, seed) => {
            const player = units.map((u, i) => ({
              ...u,
              hp: u.maxHp * condition,
              ...(i ? {} : { wandPowerBonus: 2, broomInitiative: 3 }),
              ...(withBeans ? { beanUnitId: 'bean:' + i } : {}),
            }));
            return score(battle(player, plan.opponents, seed));
          });
          results.push({
            nodeId: plan.nodeId,
            family: plan.threat ?? plan.family ?? plan.archetype,
            plan: name,
            condition,
            withBeans,
            samples: runs.length,
            wins: runs.filter((r) => r.outcome === 'player').length,
            draws: runs.filter((r) => r.outcome === 'draw').length,
            hp: summarize(runs.map((r) => r.hp)),
            survivors: summarize(runs.map((r) => r.survivors)),
            mana: summarize(runs.map((r) => r.mana)),
            rounds: summarize(runs.map((r) => r.rounds)),
          });
        }
  return results;
}
export const summarize = (values) => ({
  min: Math.min(...values),
  mean: values.reduce((a, b) => a + b, 0) / values.length,
  max: Math.max(...values),
});

export async function routeModel(plans, options = {}) {
  const { randomizeRoute } = await import(
    pathToFileURL(root + '/src/arcana/domain/exploration/randomize-route.ts')
  );
  const planById = new Map(plans.map((n) => [n.nodeId, n]));
  const rows = [];
  const allPaths = (graph) => {
    const byId = new Map(graph.nodes.map((n) => [n.id, n])),
      paths = [];
    const visit = (node, prior) => {
      const route = [...prior, node];
      if (!node.next.length) paths.push(route);
      else for (const id of node.next) visit(byId.get(id), route);
    };
    for (const node of graph.nodes.filter((n) => n.row === 0)) visit(node, []);
    return paths;
  };
  const collections = {
    starter: ['apprentice'],
    mixed: ['apprentice', 'circe', 'ember-keeper'],
    duplicates: ['apprentice', 'apprentice', 'apprentice'],
  };
  for (const [collection, ids] of Object.entries(collections))
    for (const policy of ['first', 'fire', 'shadows', 'threat'])
      for (const condition of [1, 0.6]) {
        const runs = [];
        for (let seed = 0; seed < (options.seeds ?? 128); seed++) {
          const graph = randomizeRoute(reference.campaign.graph, new SeededRandom(seed));
          for (const route of allPaths(graph)) {
            let members = team(ids, 'player').map((u, i) => ({
              ...u,
              hp: u.maxHp * condition,
              ...(i ? {} : { wandPowerBonus: 2, broomInitiative: 3 }),
            }));
            let status = 'active',
              crownsFirst = 0,
              crownsRepeat = 0,
              beans = 0,
              frogs = 0,
              keys = 0,
              combats = 0,
              beansSpent = 0,
              formationRejects = 0;
            for (const node of route) {
              const plan = planById.get(node.id);
              if (node.kind === 'pact' && members.length < 5) {
                const candidates =
                  plan?.candidates ??
                  plan?.recruits ??
                  (plan?.recruit
                    ? [plan.recruit]
                    : [
                        legacyUnit(
                          node.id + ':recruit',
                          reference.recruit,
                          reference.recruit.wizardId,
                          reference.affinities[reference.recruit.wizardId],
                        ),
                      ]);
                const nextDuel = route
                  .slice(route.indexOf(node) + 1)
                  .find((n) => n.kind === 'duel');
                const threat = nextDuel ? planById.get(nextDuel.id)?.threat : null;
                const healthy =
                  members.reduce((s, u) => s + u.hp, 0) /
                    members.reduce((s, u) => s + u.maxHp, 0) >=
                  0.75;
                const wanted =
                  policy === 'first'
                    ? 'alchemy'
                    : policy === 'threat'
                      ? healthy && threat === 'vanguard'
                        ? candidates.some((u) => u.affinity === 'shadows')
                          ? 'shadows'
                          : 'fire'
                        : 'alchemy'
                      : policy;
                const chosen = candidates.find((u) => u.affinity === wanted) ?? candidates[0];
                members.push({ ...chosen });
              }
              if (node.kind === 'refuge')
                members = members.map((u) => ({
                  ...u,
                  hp: Math.min(u.maxHp, u.hp + u.maxHp * 0.4),
                }));
              if (node.kind === 'chest') {
                crownsFirst += reference.chestReward.crowns;
                crownsRepeat += reference.chestReward.crowns;
                beans += reference.chestReward.products.length;
              }
              if (node.kind === 'duel' || node.kind === 'boss') {
                if (members.length < 3) {
                  formationRejects++;
                  status = 'formation-rejected';
                  break;
                }
                combats++;
                const rivals =
                  plan?.opponents ??
                  [0, 1, 2].map((i) =>
                    legacyUnit(
                      node.id + ':rival:' + i,
                      node.kind === 'boss' ? reference.bossEnemy : reference.enemy,
                    ),
                  );
                const useBean = options.beans && beans > 0 && members.some((u) => u.hp > 0);
                const bearer = members.find((u) => u.hp > 0)?.id;
                const player = members.map((u) => ({
                  ...u,
                  ...(useBean && u.id === bearer ? { beanUnitId: 'bean:' + combats } : {}),
                }));
                if (useBean) {
                  beans--;
                  beansSpent++;
                }
                const combat = battle(player, rivals, seed);
                members = combat.player.map(({ beanUnitId, effect, ...u }) => u);
                if (combat.outcome !== 'player') {
                  status = combat.outcome === 'draw' ? 'draw' : 'lost';
                  break;
                }
                const reward = node.kind === 'boss' ? reference.bossReward : reference.duelReward;
                crownsFirst += reward.crowns;
                crownsRepeat += Math.floor(reward.crowns / 10);
                if (!options.repeated) {
                  beans += reward.products.filter((p) => p === 'random-beans').length;
                  frogs += reward.products.filter((p) => p === 'cacao-toad').length;
                  keys += reward.goldKeys;
                }
                if (node.kind === 'boss') status = 'won';
              }
            }
            runs.push({
              seed,
              routeIds: route.map((n) => n.id),
              status,
              crownsFirst,
              crownsRepeat,
              beans,
              beansSpent,
              frogs,
              keys,
              combats,
              formationRejects,
              hp: members.reduce((s, u) => s + u.hp, 0),
            });
          }
        }
        rows.push({
          collection,
          policy,
          condition,
          useEarnedBeans: !!options.beans,
          rewardMode: options.repeated ? 'all-battle-ids-previously-won' : 'all-first',
          routes: runs.length,
          wins: runs.filter((r) => r.status === 'won').length,
          losses: runs.filter((r) => r.status === 'lost').length,
          draws: runs.filter((r) => r.status === 'draw').length,
          formationRejects: runs.reduce((s, r) => s + r.formationRejects, 0),
          earnedCrowns: summarize(
            runs.map((r) => (options.repeated ? r.crownsRepeat : r.crownsFirst)),
          ),
          remainingHp: summarize(runs.map((r) => r.hp)),
          energy: summarize(runs.map((r) => r.combats * 5)),
          beansSpent: summarize(runs.map((r) => r.beansSpent)),
          keysFirst: summarize(runs.map((r) => r.keys)),
          frogsFirst: summarize(runs.map((r) => r.frogs)),
          exampleWon: runs.find((r) => r.status === 'won') ?? null,
          exampleLost: runs.find((r) => r.status === 'lost') ?? null,
          seedsWithViablePath: new Set(runs.filter((r) => r.status === 'won').map((r) => r.seed))
            .size,
          seedsWithoutWinningPath: Array.from({ length: options.seeds ?? 128 }, (_, i) => i).filter(
            (seed) => !runs.some((r) => r.seed === seed && r.status === 'won'),
          ),
        });
      }
  return rows;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { trialConfiguration } = await import(
    pathToFileURL(root + '/src/arcana/infrastructure/content/trial-configuration.ts')
  );
  const actual = trialConfiguration();
  const tactical = actual.campaign.tacticalContent;
  if (!tactical) throw new Error('Expected integrated tacticalContent');
  const sourceFiles = [
    'src/arcana/content/trial-v1.json',
    'src/arcana/content/tactical-v1.json',
    'src/arcana/domain/combat/engine.ts',
    'src/arcana/domain/exploration/randomize-route.ts',
  ];
  const hashes = Object.fromEntries(
    sourceFiles.map((file) => [
      file,
      crypto
        .createHash('sha256')
        .update(fs.readFileSync(root + '/' + file))
        .digest('hex'),
    ]),
  );
  const comparisons = [];
  for (const options of [
    { beans: false, repeated: false },
    { beans: false, repeated: true },
    { beans: true, repeated: false },
    { beans: true, repeated: true },
  ]) {
    const legacy = await routeModel([], options),
      current = await routeModel(tactical.nodes, options);
    comparisons.push({ options, legacy, current });
  }
  const result = {
    scope: 'A65 pure-domain deterministic scenarios; no accounts, DB or persistent writes',
    baselineSha256: crypto
      .createHash('sha256')
      .update(
        fs.readFileSync(
          root + '/docs/arcana/tactical-increment-2026-10-16/evidence/trial-before.json',
        ),
      )
      .digest('hex'),
    sourceHashes: hashes,
    tacticalVersion: tactical.version,
    seeds: [0, 127],
    characterization: characterizePlans(tactical.nodes),
    comparisons,
    limits: [
      'Paths equally weighted, not player route frequencies or a human win rate.',
      'Graph and combat share a seed only to reproduce paired scenarios; live server does not couple them.',
      'First policy means prefer Alchemy; otherwise first offered candidate. Fire/Shadows prefer named affinity.',
      'Threat policy knows the next duel along the enumerated path, chooses Alchemy below75%aggregateHP, otherwise Fire or Shadows for Vanguardia. Perfect route foreknowledge is a declared benchmark, not an in-game predictor.',
      'Always recruit to5; no replacement at capacity; healHP at refuge; pass encounters. No purchases or vault in route model.',
      'Starter has only granted wand+2/broom+3. Extra collection fixtures have no invented equipment or upgraded stats.',
      'Low-health scenarios set startingHP to60% to probe adverse condition; normal new runs start full. No saves altered.',
      'Bean policy spends at most one earned bean per battle on first living member; exact random flavour. First/repeated rewards modeled separately.',
      'Without beans no random draw occurs in combat; repeated seeds do not constitute independent combat randomness.',
      'Current engine and route generator are imported; JSON baseline preserved. Engine/rules equivalence checked separately.',
    ],
  };
  const output = process.argv[process.argv.indexOf('--output') + 1];
  if (process.argv.includes('--output')) {
    const absolute = path.resolve(root, output);
    if (!absolute.startsWith(root + '/docs/arcana/tactical-increment-2026-10-16/'))
      throw new Error('Evidence output must remain inside A65 docs');
    fs.writeFileSync(absolute, JSON.stringify(result, null, 2) + '\n');
    console.log(
      JSON.stringify({
        output: absolute,
        characterization: result.characterization.length,
        comparisons: comparisons.length,
        routesPerRow: comparisons[0].current[0].routes,
        rowsPerContent: comparisons[0].current.length,
      }),
    );
  } else console.log(JSON.stringify(result, null, 2));
}
