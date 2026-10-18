// Declared presentation fixture. Boss inputs/rules come from current profile snapshots;
// player stats are deliberately prolonged for phase observation, never campaign balance.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BattlePanel } from '../../src/arcana/presentation/BattlePanel';
import { CombatEngine, type CombatUnitInput } from '../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../src/arcana/infrastructure/random/seeded-random';
import { trialConfiguration } from '../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../src/arcana/application/public-content';
import { createInventory } from '../../src/arcana/domain/economy/inventory';
import type { GameState } from '../../src/arcana/application/game';
import { setContentPack, activePack } from '../../src/arcana/presentation/content-packs/active';
import { visualAsset } from '../../src/arcana/presentation/content-packs/art';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
import '../../src/arcana/presentation/game-experience.css';

const params = new URLSearchParams(location.search);
setContentPack(params.get('pack') === 'arcana' ? 'arcana' : 'diagon-alley');
// Keep the paired A75 replay byte-identical to its historical reference; A85 has its own current-rules fixture.
const configuration = trialConfiguration('a84');
const challenge =
  params.get('challenge') === 'mastery'
    ? 'mastery'
    : params.get('challenge') === 'tactical'
      ? 'tactical'
      : 'discovery';
const plans = configuration.campaign.challengeContent!(challenge, configuration.campaign.graph);
const plan = plans.find((node) => node.kind === 'boss')!;
if (plan.kind !== 'boss') throw Error('Current boss not available');
const players: CombatUnitInput[] = configuration.opening.catalog.wizards
  .slice(0, Number(params.get('player') ?? 3))
  .map((wizard, i) => ({
    id: `a70-player-${i}`,
    wizardId: wizard.id,
    affinity: 'alchemy',
    level: 1,
    hp: 350,
    maxHp: 350,
    mana: 40,
    maxMana: 40,
    power: 3,
    speed: 1,
    wandPowerBonus: 0,
    wandMultiplier: 1,
    broomInitiative: 0,
  }));
const battle = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }).resolve({
  id: `a70-declared-${challenge}`,
  seed: 70,
  player: players,
  rival: plan.opponents,
  rules: configuration.campaign.combatRules,
});
const game: GameState = {
  schemaVersion: 1,
  playerId: 'a70-declared-presentation',
  revision: 1,
  inventory: createInventory(0),
  copies: [],
  receipts: [],
};
const content = projectPublicContent(configuration.opening, configuration.campaign);
declare global {
  interface Window {
    __a70Fixture: {
      battle: string;
      game: string;
      bossAlias: string;
      leader: string;
      retired: HTMLElement[];
    };
  }
}
window.__a70Fixture = {
  // Re-serialize the actual objects on each observation. Comparing strings saved
  // at setup would always pass even if presentation accidentally mutated them.
  get battle() {
    return JSON.stringify(battle);
  },
  get game() {
    return JSON.stringify(game);
  },
  get bossAlias() {
    return activePack.arenaAppearances.boss;
  },
  leader: plan.opponents[0].id,
  retired: [],
};
function Fixture() {
  const [mounted, setMounted] = useState(!params.has('manual'));
  const [generation, setGeneration] = useState(0);
  const [language, setLanguage] = useState<'es' | 'en'>(params.get('lang') === 'en' ? 'en' : 'es');
  const [reduced, setReduced] = useState(params.has('reduced'));
  const [, refresh] = useState(0);
  const unmount = () => {
    window.__a70Fixture.retired.push(...document.querySelectorAll<HTMLElement>('.scene-canvas'));
    setMounted(false);
  };
  return (
    <>
      <div className="arcana-shell game-shell" data-view="battle">
        <div
          className="game-world-backdrop"
          style={
            {
              '--scene-url': `url("${visualAsset('scene.arena')?.url}")`,
            } as import('react').CSSProperties
          }
        />
        <header className="game-header">
          <h1>{activePack.brand} · QA</h1>
          <span className="visually-hidden">
            Declared fixture, modified player stats, not a campaign result.
          </span>
        </header>
        <main id="content">
          {mounted ? (
            <BattlePanel
              key={generation}
              bossEncounter
              combat={battle}
              game={game}
              content={content}
              language={language}
              reduced={reduced}
              onBack={unmount}
            />
          ) : (
            <button data-qa-start onClick={() => setMounted(true)}>
              Present declared fixture
            </button>
          )}
        </main>
      </div>
      <aside hidden aria-label="Fixture controls">
        <button data-qa-unmount onClick={unmount}>
          Unmount fixture
        </button>
        <button
          data-qa-mount
          onClick={() => {
            setGeneration((n) => n + 1);
            setMounted(true);
          }}
        >
          Mount fixture
        </button>
        <button data-qa-language onClick={() => setLanguage((old) => (old === 'es' ? 'en' : 'es'))}>
          Fixture language
        </button>
        <button
          data-qa-pack
          onClick={() => {
            setContentPack(activePack.id === 'arcana' ? 'diagon-alley' : 'arcana');
            refresh((n) => n + 1);
          }}
        >
          Fixture pack
        </button>
        <button data-qa-reduced onClick={() => setReduced((old) => !old)}>
          Fixture reduced
        </button>
      </aside>
    </>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
