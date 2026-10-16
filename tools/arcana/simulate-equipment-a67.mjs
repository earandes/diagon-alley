/** A67 equipment experiment. Offline fixtures only; no player accounts or database. */
import { registerHooks } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
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
const { trialConfiguration } = await import(
  pathToFileURL(root + '/src/arcana/infrastructure/content/trial-configuration.ts')
);
const { specializedForge } = await import(
  pathToFileURL(root + '/src/arcana/infrastructure/content/equipment-content.ts')
);
const reference = JSON.parse(fs.readFileSync(root + '/src/arcana/content/trial-v1.json'));
const configuration = trialConfiguration(),
  engine = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) });
const recipes = specializedForge(reference.commerce.forge).recipes.filter(
  (r) => r.wood === 'birch',
);
const unit = (wizard, id, fraction = 1) => ({
  id,
  wizardId: wizard.id,
  level: 1,
  affinity: reference.affinities[wizard.id],
  hp: wizard.stats.maxHp * fraction,
  maxHp: wizard.stats.maxHp,
  mana: wizard.stats.maxMana,
  maxMana: wizard.stats.maxMana,
  power: wizard.stats.power,
  speed: wizard.stats.speed,
  wandPowerBonus: 0,
  wandMultiplier: 1,
  broomInitiative: 0,
});
const catalog = configuration.opening.catalog.wizards;
const healing = Number(process.env.A67_HEALING ?? 2),
  initiative = Number(process.env.A67_INITIATIVE ?? 3),
  seeds = Number(process.env.A67_EQUIPMENT_SEEDS ?? 32);
const testedRecipes = recipes.map((r) => ({
  ...r,
  ...(r.healing ? { healing } : {}),
  ...(r.initiativeBonus ? { initiativeBonus: initiative } : {}),
}));
const samples = [];
for (const lead of catalog)
  for (const enemy of catalog)
    for (const condition of [1, 0.5])
      for (const beans of [false, true]) {
        const player = [lead, ...catalog.filter((w) => w.id !== lead.id).slice(0, 2)].map((w, i) =>
          unit(w, 'p' + i, condition),
        );
        const rival = Array.from({ length: 3 }, (_, i) => unit(enemy, 'r' + i));
        const results = testedRecipes.map((recipe) => {
          let wins = 0,
            draws = 0,
            remaining = 0,
            rounds = 0;
          for (let seed = 1; seed <= seeds; seed++) {
            const p = player.map((u) => ({
              ...u,
              wandPowerBonus: recipe.powerBonus,
              wandMultiplier: recipe.multiplier,
              ...(recipe.initiativeBonus ? { wandInitiativeBonus: recipe.initiativeBonus } : {}),
              ...(recipe.healing ? { wandHealing: recipe.healing } : {}),
              ...(beans && u.id === 'p0' ? { beanUnitId: 'fixture:bean' } : {}),
            }));
            const battle = engine.resolve({
              id: 'fixture',
              seed,
              player: p,
              rival,
              rules: configuration.campaign.combatRules,
            });
            wins += battle.outcome === 'player';
            draws += battle.outcome === 'draw';
            remaining += battle.player.reduce((n, u) => n + u.hp, 0);
            rounds += battle.rounds;
          }
          return { core: recipe.core, wins, draws, hp: remaining / seeds, rounds: rounds / seeds };
        });
        const ordered = [...results].sort((a, b) => b.wins - a.wins || b.hp - a.hp);
        const winner =
          ordered[0].wins > 0 &&
          (ordered[0].wins > ordered[1].wins || ordered[0].hp > ordered[1].hp)
            ? ordered[0].core
            : null;
        samples.push({
          player: player.map((u) => u.wizardId),
          rival: enemy.id,
          condition,
          beans,
          results,
          winner,
        });
      }
const counts = Object.fromEntries(
  recipes.map((r) => [r.core, samples.filter((s) => s.winner === r.core).length]),
);
const witnesses = Object.fromEntries(
  recipes.map((r) => [
    r.core,
    samples
      .filter((s) => s.winner === r.core)
      .sort((a, b) => {
        const margin = (s) =>
          s.results.find((x) => x.core === r.core).wins -
          Math.max(...s.results.filter((x) => x.core !== r.core).map((x) => x.wins));
        return margin(b) - margin(a);
      })
      .slice(0, 3),
  ]),
);
const report = {
  kind: 'Declared synthetic equal-team equipment fixtures, not player behavior',
  seeds,
  scenarios: samples.length,
  combats: samples.length * seeds * 3,
  configuration: testedRecipes,
  selection:
    'strictly more wins, then strictly more remaining HP among victories; defeat/identical ties excluded',
  counts,
  witnesses,
};
const suffix = process.env.A67_EQUIPMENT_SUFFIX ?? '';
const output =
  root + '/docs/arcana/progression-increment-2026-10-16/equipment-simulation' + suffix + '.json';
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, counts, witnesses }, null, 2));
