/** Read-only export of real assembled content and generated paths; no server, browser or services. */
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const server = await createServer({ configFile: false, appType: 'custom', server: { middlewareMode: true, watch: null }, logLevel: 'error' });
try {
  const { trialConfiguration } = await server.ssrLoadModule('/src/arcana/infrastructure/content/trial-configuration.ts');
  const { randomizeRoute } = await server.ssrLoadModule('/src/arcana/domain/exploration/randomize-route.ts');
  const { SeededRandom } = await server.ssrLoadModule('/src/arcana/infrastructure/random/seeded-random.ts');
  const { victoryReward } = await server.ssrLoadModule('/src/arcana/domain/economy/rewards.ts');
  const { createInventory } = await server.ssrLoadModule('/src/arcana/domain/economy/inventory.ts');
  const { StartRunUseCase } = await server.ssrLoadModule('/src/arcana/application/run-use-cases.ts');
  const { InitializePlayerUseCase } = await server.ssrLoadModule('/src/arcana/application/team-use-cases.ts');
  const { ArcanaError } = await server.ssrLoadModule('/src/arcana/domain/errors.ts');
  const essence = await server.ssrLoadModule('/src/arcana/domain/economy/essence.ts');
  const config = trialConfiguration();
  let state;
  const games = { read: async () => { if (!state) throw new ArcanaError('PLAYER_NOT_FOUND'); return state; },
    create: async (initial) => { state = initial; return state; },
    transact: async (_owner, change) => { state = change(state); return state; } };
  await new InitializePlayerUseCase(games, () => config.starter, { now: async () => 0 }).execute('study:player');
  const copy = state.copies[0];
  const starts = new StartRunUseCase(games, () => config.campaign, { seeds: { next: () => 0 }, random: { fromSeed: (seed) => new SeededRandom(seed) } });
  const request = { zoneId: config.campaign.zoneId, campaignVersion: config.campaign.version, copyIds: [copy.copyId] };
  await starts.execute(state.playerId, { key: 'study:first-run', expectedRevision: state.revision, request });
  let activeRestartBlocked = false;
  try {
    await starts.execute(state.playerId, {
      key: 'study:restart', expectedRevision: state.revision, request,
    });
  } catch (error) {
    if (error.message !== 'RUN_ACTIVE') throw error;
    activeRestartBlocked = true;
  }
  if (!activeRestartBlocked) throw new Error('Current model requires active-run restart protection');
  const paths = [];
  for (const owned of [1, 17, 31]) {
    const initial = [config.starter.apprenticeId, ...config.opening.table.entries.slice(0, owned - 1).map((entry) => entry.wizardId)];
    for (const policy of ['balanced', 'chest-priority']) {
      for (let seed = 0; seed < 64; seed++) {
        const graph = randomizeRoute(config.campaign.graph, new SeededRandom(seed));
        const plans = config.campaign.challengeContent('discovery', graph, initial);
        let reachable = graph.nodes.filter((node) => node.row === 0);
        let members = Math.min(5, owned);
        const path = [];
        while (reachable.length) {
          const allowed = reachable.filter((node) => !['duel', 'boss'].includes(node.kind) || members >= 3);
          if (!allowed.length) break;
          const ranking = members < 3
            ? ['pact', 'chest', 'refuge', 'encounter', 'duel', 'boss']
            : policy === 'chest-priority'
              ? ['chest', 'pact', 'refuge', 'encounter', 'duel', 'boss']
              : ['duel', 'chest', 'pact', 'refuge', 'encounter', 'boss'];
          const node = [...allowed].sort((a, b) => ranking.indexOf(a.kind) - ranking.indexOf(b.kind) || a.id.localeCompare(b.id))[0];
          const plan = plans.find((candidate) => candidate.nodeId === node.id);
          path.push({ id: node.id, levelId: plan.levelId ?? null, kind: node.kind, firstReward: plan.reward ?? null,
            repeatReward: ['duel', 'boss'].includes(node.kind) ? victoryReward(plan.reward, false, config.campaign.rounding) : null,
            encounterHasTrade: !!plan.offer });
          if (node.kind === 'pact') members = Math.min(5, members + 1);
          reachable = graph.nodes.filter((candidate) => node.next.includes(candidate.id));
        }
        if (path.at(-1)?.kind !== 'boss') throw new Error('A declared route must reach a closure, not restart while active');
        paths.push({ owned, policy, seed, path });
      }
    }
  }
  const files = ['src/arcana/content/trial-v1.json', 'src/arcana/content/creatures-v1.json', 'src/arcana/content/equipment-v2.json',
    'src/arcana/infrastructure/content/trial-configuration.ts', 'src/arcana/infrastructure/content/progression-content.ts',
    'src/arcana/domain/exploration/randomize-route.ts', 'src/arcana/domain/economy/rewards.ts', 'src/arcana/domain/economy/essence.ts', 'src/arcana/application/run-use-cases.ts'];
  const hashes = await Promise.all(files.map(async (file) => ({ file, sha256: createHash('sha256').update(await readFile(file)).digest('hex') })));
  process.stdout.write(JSON.stringify({ kind: 'A89 real-content export; route policy, not combat outcomes or human play',
    inputs: hashes, versions: { catalog: config.opening.catalog.version, table: config.opening.table.version, campaign: config.campaign.version },
    activeRunRestartCheck: { fixture: 'isolated in-memory StartRunUseCase, no database', rejectedWith: 'RUN_ACTIVE', passed: activeRestartBlocked },
    starterId: config.starter.apprenticeId, catalog: config.opening.catalog.wizards.map((wizard) => ({ id: wizard.id, traits: wizard.traits })),
    table: config.opening.table, shop: config.opening.shop, vault: config.opening.commerce.vault,
    starterInventory: createInventory(0), essence: { capacity: essence.ESSENCE_CAPACITY, combatCost: essence.COMBAT_ESSENCE_COST, intervalMs: essence.ESSENCE_INTERVAL_MS }, paths }, null, 2) + '\n');
} finally {
  await server.close();
}
