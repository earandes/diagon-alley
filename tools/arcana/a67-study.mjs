/** A67 offline calibration; reads frozen A65 data, never a player or database. Node 24. */
import { registerHooks } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import ts from 'typescript';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const folder = root + '/docs/arcana/progression-increment-2026-10-16';
export const frozen = folder + '/evidence/reference';
registerHooks({
  resolve(s, c, n) {
    try {
      return n(s, c);
    } catch (e) {
      if (s.startsWith('.')) return n(s + '.ts', c);
      throw e;
    }
  },
  load(u, c, n) {
    if (u.endsWith('.json'))
      return {
        format: 'module',
        shortCircuit: true,
        source: 'export default ' + fs.readFileSync(fileURLToPath(u), 'utf8') + ';',
      };
    if (u.endsWith('.ts'))
      return {
        format: 'module',
        shortCircuit: true,
        source: ts.transpileModule(fs.readFileSync(fileURLToPath(u), 'utf8'), {
          compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
        }).outputText,
      };
    return n(u, c);
  },
});
export const data = JSON.parse(fs.readFileSync(frozen + '/trial-v1.json'));
const { CombatEngine } = await import(pathToFileURL(frozen + '/domain/combat/engine.ts'));
const { SeededRandom } = await import(
  pathToFileURL(frozen + '/infrastructure/random/seeded-random.ts')
);
const { randomizeRoute } = await import(
  pathToFileURL(frozen + '/domain/exploration/randomize-route.ts')
);
export const engine = new CombatEngine({ fromSeed: (s) => new SeededRandom(s) });
export function unit(wizardId, id, extra = {}) {
  const w = data.catalog.wizards.find((w) => w.id === wizardId),
    s = w.stats;
  return {
    id,
    wizardId,
    level: 1,
    affinity: data.affinities[wizardId],
    hp: s.maxHp,
    maxHp: s.maxHp,
    mana: s.maxMana,
    maxMana: s.maxMana,
    power: s.power,
    speed: s.speed,
    wandPowerBonus: 0,
    wandMultiplier: 1,
    broomInitiative: 0,
    ...extra,
  };
}
export function weak(id, boss = false) {
  const s = boss ? data.bossEnemy : data.enemy;
  return {
    id,
    wizardId: 'rival',
    level: 1,
    affinity: 'neutral',
    hp: s.hp,
    maxHp: s.hp,
    mana: s.mana,
    maxMana: s.mana,
    power: s.power,
    speed: s.speed,
    wandPowerBonus: 0,
    wandMultiplier: 1,
    broomInitiative: 0,
  };
}
export function combat(player, rival, seed = 0) {
  return engine.resolve({
    id: 'study:' + seed,
    seed,
    player,
    rival,
    rules: data.campaign.combatRules,
  });
}
const { previewEncounterTrade } = await import(
  pathToFileURL(root + '/src/arcana/domain/exploration/encounter-trades.ts')
);
const { progressionContent } = await import(
  pathToFileURL(root + '/src/arcana/infrastructure/content/progression-content.ts')
);
export function basePlans() {
  return data.campaign.graph.nodes.map((n) => {
    const base = { ...n, nodeId: n.id };
    if (n.kind === 'duel' || n.kind === 'boss')
      return {
        ...base,
        levelId: n.id,
        reward: n.kind === 'boss' ? data.bossReward : data.duelReward,
        opponents: [0, 1, 2].map((i) => weak(n.id + ':rival:' + i, n.kind === 'boss')),
      };
    if (n.kind === 'pact')
      return { ...base, recruit: unit(data.recruit.wizardId, n.id + ':recruit') };
    if (n.kind === 'chest') return { ...base, reward: data.chestReward };
    if (n.kind === 'encounter') return { ...base, choices: data.encounters };
    return base;
  });
}
export function plans(variant, graph = data.campaign.graph) {
  if (variant !== 'baseline')
    return progressionContent(basePlans(), data.catalog, data.affinities, graph, variant);
  let duel = 0,
    pact = 0;
  const tactics = JSON.parse(fs.readFileSync(frozen + '/tactical-v1.json'));
  return basePlans().map((n) => {
    if (n.kind === 'pact')
      return {
        ...n,
        recruits: tactics.pacts[pact++].map((id, i) => unit(id, n.id + ':choice:' + i)),
      };
    if (n.kind === 'duel') {
      const f = tactics.duels[duel++ % 2];
      return {
        ...n,
        threat: f.threat,
        opponents: [
          ...f.leaders.map((id, i) => unit(id, n.id + ':rival:' + i)),
          weak(n.id + ':rival:2'),
        ],
      };
    }
    return n;
  });
}
export function allPaths(graph) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n])),
    out = [];
  const walk = (n, p) => {
    const r = [...p, n];
    if (!n.next.length) out.push(r);
    else for (const id of n.next) walk(byId.get(id), r);
  };
  for (const n of graph.nodes.filter((n) => n.row === 0)) walk(n, []);
  return out;
}
export const summary = (v) => {
  const s = [...v].sort((a, b) => a - b),
    q = (p) => s[Math.min(s.length - 1, Math.floor((s.length - 1) * p))];
  return {
    min: s[0],
    p10: q(0.1),
    p50: q(0.5),
    p90: q(0.9),
    p95: q(0.95),
    max: s.at(-1),
    mean: v.reduce((a, b) => a + b, 0) / v.length,
  };
};
export const collections = {
  initial: ['apprentice'],
  intermediate: ['apprentice', 'circe', 'ember-keeper'],
  broad: ['apprentice', 'merlin', 'flamel', 'circe', 'morgana'],
  duplicates: ['apprentice', 'merlin', 'merlin'],
};
export function routeRun(
  route,
  byId,
  ids,
  policy,
  condition,
  beans,
  seed,
  repeat = true,
  useTrades = false,
) {
  let members = ids.map((id, i) =>
    unit(id, i === 0 ? 'starter:apprentice' : 'copy:' + i, {
      hp: unit(id, 'copy').maxHp * condition,
      ...(i === 0 ? { wandPowerBonus: 2, broomInitiative: 3 } : {}),
    }),
  );
  let trades = 0;
  let visited = 0;
  const combatPositions = [];
  let victoryMask = 0;
  let hp0 = members.reduce((s, u) => s + u.hp, 0),
    status = 'active',
    money = 0,
    stock = 0,
    spent = 0,
    combats = 0,
    keys = 0,
    frogs = 0;
  for (const n of route) {
    visited++;
    const p = byId.get(n.id);
    if (n.kind === 'pact' && members.length < 5) {
      const healthy =
        members.reduce((s, u) => s + u.hp, 0) / members.reduce((s, u) => s + u.maxHp, 0) > 0.75;
      const later = route.slice(route.indexOf(n) + 1).find((n) => n.kind === 'duel');
      const threat = later ? byId.get(later.id).threat : null;
      const affinity =
        policy === 'quantity'
          ? 'first'
          : policy === 'threat'
            ? healthy && threat === 'vanguard'
              ? 'shadows'
              : 'alchemy'
            : policy;
      const candidate = p.recruits.find((u) => u.affinity === affinity) ?? p.recruits[0];
      members.push({ ...candidate });
    }
    if (n.kind === 'encounter' && useTrades && p.offer) {
      const options = [];
      for (const option of p.offer.options) {
        const targets =
          option.scope === 'team' ? [undefined] : members.filter((u) => u.hp > 0).map((u) => u.id);
        for (const target of targets) {
          const preview = previewEncounterTrade(
            members.map((unit) => ({ source: 'owned', unit })),
            p.offer,
            option.id,
            target,
          );
          const score = preview.vitals.reduce(
            (s, v) => s + v.afterHp - v.beforeHp + 2 * (v.afterMana - v.beforeMana),
            0,
          );
          if (preview.eligible && score > 0) options.push({ preview, score });
        }
      }
      options.sort((a, b) => b.score - a.score);
      if (options[0]) {
        members = options[0].preview.members.map((m) => m.unit);
        trades++;
      }
    }
    if (n.kind === 'refuge')
      members = members.map((u) => ({ ...u, hp: Math.min(u.maxHp, u.hp + u.maxHp * 0.4) }));
    if (n.kind === 'chest') {
      money += data.chestReward.crowns;
      stock += data.chestReward.products.length;
    }
    if (n.kind === 'duel' || n.kind === 'boss') {
      if (members.length < 3) {
        status = 'formation-rejected';
        break;
      }
      combats++;
      combatPositions.push(visited);
      const use = beans && stock > 0;
      const bearer = members.find((u) => u.hp > 0)?.id;
      const player = members.map((u) => ({
        ...u,
        ...(use && u.id === bearer ? { beanUnitId: 'bean:' + combats } : {}),
      }));
      if (use) {
        stock--;
        spent++;
      }
      const result = combat(player, p.opponents, seed);
      members = result.player.map(({ effect, beanUnitId, ...u }) => u);
      if (result.outcome !== 'player') {
        status = result.outcome === 'draw' ? 'draw' : 'lost';
        break;
      }
      victoryMask |=
        1 <<
        data.campaign.graph.nodes
          .filter((x) => x.kind === 'duel' || x.kind === 'boss')
          .findIndex((x) => x.id === n.id);
      const reward = n.kind === 'boss' ? data.bossReward : data.duelReward;
      money += repeat ? Math.floor(reward.crowns / 10) : reward.crowns;
      if (!repeat) {
        stock += reward.products.filter((p) => p === 'random-beans').length;
        frogs += reward.products.filter((p) => p === 'cacao-toad').length;
        keys += reward.goldKeys;
      }
      if (n.kind === 'boss') status = 'won';
    }
  }
  return {
    seed,
    route: route.map((n) => n.id),
    visited,
    trades,
    combatPositions,
    status,
    victoryMask,
    money,
    stock,
    spent,
    combats,
    energy: 5 * combats,
    keys,
    frogs,
    hp: members.reduce((s, u) => s + u.hp, 0),
    mana: members.reduce((s, u) => s + u.mana, 0),
    hpFraction: members.reduce((s, u) => s + u.hp, 0) / members.reduce((s, u) => s + u.maxHp, 0),
    alive: members.filter((u) => u.hp > 0).length,
    hp0,
  };
}
export function model({ seeds = 128 } = {}) {
  const output = [],
    bank = [];
  for (const variant of ['baseline', 'discovery', 'tactical', 'mastery']) {
    for (const [collection, ids] of Object.entries(collections))
      for (const policy of ['quantity', 'alchemy', 'fire', 'shadows', 'threat'])
        for (const condition of [1, 0.6])
          for (const beans of [false, true]) {
            const rows = [];
            for (let seed = 0; seed < seeds; seed++) {
              const graph = randomizeRoute(data.campaign.graph, new SeededRandom(seed));
              const byId = new Map(plans(variant, graph).map((p) => [p.id, p]));
              for (const route of allPaths(graph))
                rows.push(routeRun(route, byId, ids, policy, condition, beans, seed));
            }
            if (condition === 1 && ['quantity', 'alchemy', 'threat'].includes(policy) && !beans)
              bank.push({
                variant,
                collection,
                policy,
                rows: rows.map((r) => [
                  r.seed,
                  r.status,
                  r.victoryMask,
                  r.money,
                  r.energy,
                  r.stock,
                  r.spent,
                  r.visited,
                  r.combatPositions,
                ]),
              });
            output.push({
              variant,
              collection,
              policy,
              condition,
              beans,
              seeds,
              paths: rows.length,
              wins: rows.filter((r) => r.status === 'won').length,
              losses: rows.filter((r) => r.status === 'lost').length,
              draws: rows.filter((r) => r.status === 'draw').length,
              rejects: rows.filter((r) => r.status === 'formation-rejected').length,
              money: summary(rows.map((r) => r.money)),
              energy: summary(rows.map((r) => r.energy)),
              hp: summary(rows.map((r) => r.hp)),
              mana: summary(rows.map((r) => r.mana)),
              alive: summary(rows.map((r) => r.alive)),
              beansSpent: summary(rows.map((r) => r.spent)),
              seedsWithWin: new Set(rows.filter((r) => r.status === 'won').map((r) => r.seed)).size,
              exampleWin: rows.find((r) => r.status === 'won') ?? null,
              exampleLoss: rows.find((r) => r.status === 'lost') ?? null,
            });
          }
  }
  fs.writeFileSync(
    folder + '/evidence/route-bank.json',
    JSON.stringify({
      seeds,
      tupleFields: [
        'seed',
        'status',
        'victoryMaskFourDuelsThenBoss',
        'repeatCrowns',
        'energy',
        'beansRemaining',
        'beansSpent',
        'visitedEvents',
        'combatEventPositions',
      ],
      bank,
    }) + '\n',
  );
  const tradeComparisons = [];
  for (const variant of ['discovery', 'tactical', 'mastery'])
    for (const collection of ['initial', 'intermediate', 'broad'])
      for (const condition of [1, 0.6])
        for (const beans of [false, true]) {
          const runs = [];
          for (let seed = 0; seed < seeds; seed++) {
            const graph = randomizeRoute(data.campaign.graph, new SeededRandom(seed));
            const byId = new Map(plans(variant, graph).map((p) => [p.id, p]));
            for (const route of allPaths(graph))
              runs.push(
                routeRun(
                  route,
                  byId,
                  collections[collection],
                  'alchemy',
                  condition,
                  beans,
                  seed,
                  true,
                  true,
                ),
              );
          }
          const prior = output.find(
            (r) =>
              r.variant === variant &&
              r.collection === collection &&
              r.policy === 'alchemy' &&
              r.condition === condition &&
              r.beans === beans,
          );
          tradeComparisons.push({
            variant,
            collection,
            condition,
            beans,
            paths: runs.length,
            passWins: prior.wins,
            tradeWins: runs.filter((r) => r.status === 'won').length,
            passMoney: prior.money,
            tradeMoney: summary(runs.map((r) => r.money)),
            tradesUsed: summary(runs.map((r) => r.trades)),
            hp: summary(runs.map((r) => r.hp)),
            mana: summary(runs.map((r) => r.mana)),
          });
        }
  return {
    tradeComparisons,
    scope:
      'Paired pure-domain A65 reference engine + integrated progressionContent constructor; path-uniform scenarios, not human behaviour; no accounts.',
    seeds,
    rows: output,
  };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = model({ seeds: Number(process.env.A67_SEEDS ?? 128) });
  fs.writeFileSync(folder + '/evidence/calibration.json', JSON.stringify(result, null, 2) + '\n');
  console.log(
    JSON.stringify({
      rows: result.rows.length,
      seeds: result.seeds,
      examples: result.rows
        .filter(
          (r) =>
            r.collection === 'initial' && r.condition === 1 && !r.beans && r.policy === 'alchemy',
        )
        .map((r) => ({
          variant: r.variant,
          wins: r.wins,
          paths: r.paths,
          seedsWithWin: r.seedsWithWin,
          money: r.money.mean,
          hp: r.hp.mean,
        })),
    }),
  );
}
