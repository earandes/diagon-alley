// Offline actual application/engine scenarios. No browser, listener, user account or database.
import { createServer } from 'vite';
import { writeFile } from 'node:fs/promises';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});
try {
  const load = (p) => server.ssrLoadModule('/src/arcana/' + p);
  const { trialConfiguration } = await load('infrastructure/content/trial-configuration.ts');
  const { InitializePlayerUseCase } = await load('application/team-use-cases.ts');
  const { StartRunUseCase, AdvanceNodeUseCase, ResolveCombatUseCase } = await load(
    'application/run-use-cases.ts',
  );
  const { BuyAndOpenCocoaToadUseCase } = await load('application/shop-use-cases.ts');
  const { CombatEngine } = await load('domain/combat/engine.ts');
  const { SeededRandom } = await load('infrastructure/random/seeded-random.ts');
  const { gameSnapshot } = await load('application/game.ts');
  const { houseProgress } = await load('domain/combat/houses.ts');
  const { bondProgress } = await load('domain/combat/bonds.ts');
  const { activeSynergies } = await load('domain/combat/synergies.ts');
  const random = { fromSeed: (s) => new SeededRandom(s) },
    clock = { now: async () => 0 };
  class Memory {
    state;
    async read() {
      if (!this.state) {
        const { ArcanaError } = await load('domain/errors.ts');
        throw new ArcanaError('PLAYER_NOT_FOUND');
      }
      return gameSnapshot(this.state);
    }
    async create(s) {
      this.state = gameSnapshot(s);
      return this.read();
    }
    async transact(_, change) {
      this.state = gameSnapshot(change(await this.read()));
      return this.read();
    }
  }
  const ownedCreatures = process.argv.includes('--owned-creatures');
  const versions = ownedCreatures ? ['a87'] : ['a85', 'a87'];
  const collections = ownedCreatures ? ['creature-purchases'] : ['starter', 'three-purchases'];
  const prefix = ownedCreatures ? 'simulation-owned-creatures' : 'simulation';
  const samples = [];
  for (const version of versions)
    for (const collection of collections)
      for (const challenge of ['discovery', 'tactical', 'mastery'])
        for (const policy of ['quantity', 'affinity', 'house', 'creature'])
          for (let seed = 0; seed < 32; seed++) {
            const c = trialConfiguration(version),
              store = new Memory();
            await new InitializePlayerUseCase(store, () => c.starter, clock).execute('simulation');
            if (collection === 'three-purchases' || collection === 'creature-purchases') {
              const wanted =
                collection === 'creature-purchases'
                  ? ['phoenix-companion', 'hippogriff-companion', 'forest-unicorn']
                  : ['star-binder', 'paracelso', 'comet-scholar'];
              let index = 0;
              const draw = {
                ticket: (max) => {
                  if (max === 100) return 99;
                  const id = wanted[index++];
                  return c.opening.table.entries.findIndex((e) => e.wizardId === id);
                },
              };
              for (let i = 0; i < 3; i++)
                await new BuyAndOpenCocoaToadUseCase(store, () => c.opening, draw).execute(
                  'simulation',
                  {
                    key: `buy:${i}`,
                    expectedRevision: store.state.revision,
                    request: {
                      catalogVersion: c.opening.catalog.version,
                      tableVersion: c.opening.table.version,
                      priceVersion: c.opening.shop.version,
                    },
                  },
                );
            }
            let copies = store.state.copies;
            if (policy === 'creature')
              copies = copies.filter(
                (copy, i) => i === 0 || copy.wizard.traits?.nature === 'creature',
              );
            if (policy === 'house' && copies.length > 1)
              copies = copies.filter((_, i) => i === 0 || i === 1);
            if (policy === 'affinity' && copies.length > 1)
              copies = copies.filter(
                (copy) => c.campaign.ownedAffinities[copy.wizard.id] === 'alchemy',
              );
            await new StartRunUseCase(store, () => c.campaign, {
              random,
              seeds: { next: () => seed },
            }).execute('simulation', {
              key: 'run',
              expectedRevision: store.state.revision,
              request: {
                zoneId: c.campaign.zoneId,
                campaignVersion: c.campaign.version,
                challenge,
                ...(c.campaign.combatRules.bonds
                  ? {
                      bondFocus:
                        policy === 'creature'
                          ? 'creatures'
                          : policy === 'house'
                            ? 'houses'
                            : 'auto',
                    }
                  : {}),
                copyIds: copies.map((c) => c.copyId),
              },
            });
            const combat = new ResolveCombatUseCase(new CombatEngine(random), { next: () => seed });
            const advance = new AdvanceNodeUseCase(store, () => c.campaign, combat, clock, random, {
              next: () => seed,
            });
            let spent = 0,
              combats = 0,
              activations = 0,
              guarded = 0,
              orderHealed = 0,
              finishingBonus = 0,
              formed = false;
            for (
              let step = 0;
              step < 20 && store.state.exploration.run.status === 'active';
              step++
            ) {
              const run = store.state.exploration.run;
              const available = run.visited.length
                ? run.graph.nodes.find((n) => n.id === run.visited.at(-1)).next
                : run.graph.nodes.filter((n) => n.row === 0).map((n) => n.id);
              const priority = { pact: 0, refuge: 1, chest: 2, encounter: 3, duel: 4, boss: 5 };
              const node = available
                .map((id) => run.graph.nodes.find((n) => n.id === id))
                .sort((a, b) => priority[a.kind] - priority[b.kind] || a.id.localeCompare(b.id))[0];
              const plan = run.campaignSnapshot.nodes.find((p) => p.nodeId === node.id);
              const options = {};
              if (plan.kind === 'pact') {
                const candidates = plan.recruits ?? [plan.recruit];
                const score = (u) =>
                  policy === 'creature'
                    ? (c.opening.catalog.wizards.find((w) => w.id === u.wizardId)?.traits
                        ?.nature === 'creature'
                        ? 100
                        : 0) +
                      u.power / 100
                    : policy === 'quantity'
                      ? u.power + u.maxHp / 10
                      : policy === 'affinity'
                        ? activeSynergies([...run.members.map((m) => m.unit), u]).reduce(
                            (s, g) => s + g.members,
                            0,
                          )
                        : houseProgress([...run.members.map((m) => m.unit), u]).reduce(
                            (s, g) => s + g.tier * 20 + g.count,
                            0,
                          );
                const candidate = [...candidates].sort((a, b) => score(b) - score(a))[0];
                if (run.members.length < 5) options.recruitId = candidate.id;
                else options.pactAction = 'pass';
              }
              if (plan.kind === 'refuge') options.refugeAction = 'heal';
              if (plan.kind === 'encounter') options.encounterAction = 'pass';
              const receipt = (
                await advance.execute('simulation', {
                  key: `step:${step}`,
                  expectedRevision: store.state.revision,
                  request: {
                    runId: 'run',
                    nodeId: node.id,
                    campaignVersion: c.campaign.version,
                    assignments: [],
                    ...options,
                  },
                })
              ).receipt;
              if (receipt.battle) {
                combats++;
                spent += 5;
                activations += receipt.battle.events.filter(
                  (e) =>
                    (e.kind === 'house-activated' || e.kind === 'bond-activated') &&
                    e.team === 'player',
                ).length;
                guarded += receipt.battle.events.reduce(
                  (s, e) => s + (e.kind === 'spell-cast' ? (e.guarded ?? 0) : 0),
                  0,
                );
                orderHealed += receipt.battle.events.reduce(
                  (s, e) => s + (e.kind === 'healed' && e.source === 'order' ? e.amount : 0),
                  0,
                );
                finishingBonus += receipt.battle.events.reduce(
                  (s, e) => s + (e.kind === 'spell-cast' ? (e.bondBoost ?? 0) : 0),
                  0,
                );
              }
              formed ||=
                c.campaign.combatRules.bonds &&
                ['order', 'death', 'creatures'].some(
                  (g) =>
                    bondProgress(
                      store.state.exploration.run.members.map((m) => m.unit),
                      c.campaign.combatRules.bonds,
                      g,
                    ).tier > 0,
                );
              formed ||= houseProgress(store.state.exploration.run.members.map((m) => m.unit)).some(
                (h) => h.tier > 0,
              );
            }
            const state = store.state,
              run = state.exploration.run;
            samples.push({
              version,
              collection,
              challenge,
              policy,
              seed,
              status: run.status,
              formed,
              activations,
              combats,
              guarded,
              orderHealed,
              finishingBonus,
              essenceSpent: spent,
              crowns: state.inventory.crowns,
              keys: state.inventory.goldKeys ?? 0,
              remainingHp: run.members.reduce((s, m) => s + m.unit.hp, 0),
              own: state.copies.length,
            });
          }
  const groups = [];
  for (const version of versions)
    for (const collection of collections)
      for (const challenge of ['discovery', 'tactical', 'mastery'])
        for (const policy of ['quantity', 'affinity', 'house', 'creature']) {
          const rows = samples.filter(
              (s) =>
                s.version === version &&
                s.collection === collection &&
                s.challenge === challenge &&
                s.policy === policy,
            ),
            mean = (key) => rows.reduce((sum, r) => sum + r[key], 0) / rows.length;
          groups.push({
            version,
            collection,
            challenge,
            policy,
            n: rows.length,
            won: rows.filter((r) => r.status === 'won').length,
            lost: rows.filter((r) => r.status === 'lost').length,
            draw: rows.filter((r) => r.status === 'draw').length,
            active: rows.filter((r) => r.status === 'active').length,
            formed: rows.filter((r) => r.formed).length,
            meanCrowns: mean('crowns'),
            meanHp: mean('remainingHp'),
            meanEssence: mean('essenceSpent'),
            meanGuarded: mean('guarded'),
            meanOrderHealed: mean('orderHealed'),
            meanFinishingBonus: mean('finishingBonus'),
          });
        }
  await writeFile(
    `docs/arcana/creatures-bonds-2026-10-18/${prefix}.json`,
    JSON.stringify(
      {
        fixture: true,
        source:
          'Actual application use cases; memory transaction double, deterministic draw fixtures; not human behavior',
        conditions:
          '32 paired route/combat seeds per scenario; no beans; initial full condition; healing refuges; pass encounters; greedy public path; first-win accounts; creature policy deliberately reserves purchased humans to leave room for three creature Pacts; house policy keeps starter and the first purchased companion; profiles a85/a87 under the same current engine',
        groups,
      },
      null,
      2,
    ) + '\n',
  );
  await writeFile(
    `docs/arcana/creatures-bonds-2026-10-18/${prefix}-samples.jsonl`,
    samples.map((row) => JSON.stringify(row)).join('\n') + '\n',
  );
  process.stdout.write(
    JSON.stringify({
      runs: samples.length,
      groups: groups.length,
      unclosed: samples.filter((s) => s.status === 'active').length,
    }) + '\n',
  );
} finally {
  await server.close();
}
