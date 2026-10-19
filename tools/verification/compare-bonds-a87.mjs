// Controlled counterfactuals over obtainable units and current opponent plans. No browser or account.
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
  const { CombatEngine } = await load('domain/combat/engine.ts');
  const { SeededRandom } = await load('infrastructure/random/seeded-random.ts');
  const { randomizeRoute } = await load('domain/exploration/randomize-route.ts');
  const c = trialConfiguration('a87'),
    engine = new CombatEngine({ fromSeed: (s) => new SeededRandom(s) });
  const graph = randomizeRoute(c.campaign.graph, new SeededRandom(0));
  const opponents = [];
  const seen = new Set();
  for (const challenge of ['discovery', 'tactical', 'mastery'])
    for (const plan of c.campaign.challengeContent(challenge, graph)) {
      if (plan.kind !== 'duel' && plan.kind !== 'boss') continue;
      const key = JSON.stringify(plan.opponents.map(({ id, ...u }) => u));
      if (seen.has(key)) continue;
      seen.add(key);
      opponents.push({ challenge, nodeId: plan.nodeId, units: plan.opponents });
    }
  const rosters = {
    order: ['merlin', 'morgana', 'storm-caller', 'moon-herbalist', 'aurora-sage'],
    death: ['paracelso', 'obsidian-seer', 'echo-mage', 'veil-walker', 'apprentice'],
  };
  const rows = [];
  const stats = (fight) => ({
    outcome: fight.outcome,
    standing: fight.player.filter((u) => u.hp > 0).length,
    hp: fight.player.reduce((n, u) => n + u.hp, 0),
    rivalHp: fight.rival.reduce((n, u) => n + u.hp, 0),
    rounds: fight.rounds,
    help: fight.events.reduce(
      (n, e) => n + (e.kind === 'healed' && e.source === 'order' ? e.amount : 0),
      0,
    ),
    finisher: fight.events.reduce(
      (n, e) => n + (e.kind === 'spell-cast' ? (e.bondBoost ?? 0) : 0),
      0,
    ),
  });
  const rank = (x) => (x.outcome === 'player' ? 2 : x.outcome === 'draw' ? 1 : 0);
  const compare = (a, b) =>
    Math.sign(rank(a) - rank(b) || a.standing - b.standing || a.hp - b.hp || b.rivalHp - a.rivalHp);
  for (const [group, ids] of Object.entries(rosters))
    for (let rotation = 0; rotation < 5; rotation++)
      for (const condition of ['full', 'worn-front', 'worn-back', 'worn-all'])
        for (const prefix of ['a', 'z'])
          for (const rival of opponents) {
            const ordered = [...ids.slice(rotation), ...ids.slice(0, rotation)];
            const player = ordered.map((id, i) => {
              const w = c.opening.catalog.wizards.find((w) => w.id === id);
              const unit = c.campaign.prepareOwned({
                copyId: `${prefix}${i}`,
                wizard: w,
                catalogVersion: 4,
                sourceId: 'declared',
                origin: 'toad',
              });
              const fraction =
                condition === 'worn-all'
                  ? 0.4
                  : condition === 'worn-front' && i === 0
                    ? 0.15
                    : condition === 'worn-back' && i > 0
                      ? 0.4
                      : 1;
              return { ...unit, hp: Math.max(1, Math.floor(unit.maxHp * fraction)) };
            });
            const battle = (mode) =>
              engine.resolve({
                id: 'comparison',
                seed: 42,
                player,
                rival: rival.units,
                rules: c.campaign.combatRules,
                bondFocus: { player: mode, rival: 'houses' },
              });
            const house = stats(battle('houses')),
              alternative = stats(battle(group));
            rows.push({
              group,
              rotation,
              condition,
              idPrefix: prefix,
              challenge: rival.challenge,
              nodeId: rival.nodeId,
              roster: ordered,
              house,
              alternative,
              preference: compare(alternative, house),
            });
          }
  const groups = Object.keys(rosters).map((group) => {
    const cases = rows.filter((r) => r.group === group);
    return {
      group,
      n: cases.length,
      alternativeBetter: cases.filter((r) => r.preference > 0).length,
      houseBetter: cases.filter((r) => r.preference < 0).length,
      equal: cases.filter((r) => r.preference === 0).length,
      examples: {
        alternative: cases.find((r) => r.preference > 0),
        house: cases.find((r) => r.preference < 0),
      },
    };
  });
  const summary = {
    fixture: true,
    source:
      'Current obtainable catalogue units, actual distinct opponent plans from seed0; no master stat changes, no gear/beans, same actor IDs within each pair. Deterministic enumeration, not independent random or human samples.',
    conditions:
      '5 formation rotations x4 own HP patterns x2 ID tie orders x current distinct opponents; frozen seed42, rules3. Preference lexicographic outcome, standing, ownHP, lower rivalHP. Arrival conditions declared; opponents start at full configured HP.',
    opponentProfiles: opponents.map(({ units, ...p }) => ({
      ...p,
      wizards: units.map((u) => u.wizardId),
    })),
    groups,
  };
  await writeFile(
    'docs/arcana/creatures-bonds-2026-10-18/bond-comparison.json',
    JSON.stringify(summary, null, 2) + '\n',
  );
  await writeFile(
    'docs/arcana/creatures-bonds-2026-10-18/bond-comparison-samples.jsonl',
    rows.map((r) => JSON.stringify(r)).join('\n') + '\n',
  );
  console.log(JSON.stringify(groups.map(({ examples, ...g }) => g)));
} finally {
  await server.close();
}
