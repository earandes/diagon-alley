// Explicit rendering fixture, never imported by the application or distributed build.
import { useEffect, useState } from 'react';
import { visualAsset } from '../../src/arcana/presentation/content-packs/art';
import { GameSettings } from '../../src/arcana/presentation/GameSettings';
import { createRoot } from 'react-dom/client';
import { BattlePanel } from '../../src/arcana/presentation/BattlePanel';
import { CombatEngine, type CombatUnitInput } from '../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../src/arcana/infrastructure/random/seeded-random';
import { trialConfiguration } from '../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../src/arcana/application/public-content';
import { createInventory } from '../../src/arcana/domain/economy/inventory';
import type { GameState } from '../../src/arcana/application/game';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
import '../../src/arcana/presentation/game-experience.css';
const config = trialConfiguration('a85');
const params = new URLSearchParams(location.search);
const definitions = config.opening.catalog.wizards.slice(0, Number(params.get('player') ?? 5));
const units = (side: string): CombatUnitInput[] =>
  (side === 'r'
    ? config.opening.catalog.wizards.slice(5, 5 + Number(params.get('rival') ?? 5))
    : definitions
  ).map((wizard, i) => ({
    id: `${side}${i}`,
    wizardId: wizard.id,
    level: 1,
    affinity:
      side === 'r' && new URLSearchParams(location.search).has('shadow')
        ? i === 0
          ? 'shadows'
          : 'neutral'
        : 'alchemy',
    hp: 1000,
    maxHp: 1000,
    mana: 100,
    maxMana: 100,
    power: 10,
    speed: 6,
    wandPowerBonus: 2,
    wandMultiplier: 1.2,
    broomInitiative: 3,
    beanUnitId: side === 'p' ? `bean${i}` : undefined,
  }));
const record = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }).resolve({
  id: 'visual-load-fixture',
  seed: 47,
  player: units('p'),
  rival: units('r'),
  rules: {
    ...config.campaign.combatRules,
    maxRounds: 30,
    beans: { version: 1, entries: [{ flavour: 'pepper', weight: 1 }] },
  },
});
const shownRecord =
  new URLSearchParams(location.search).get('corrupt') === 'synergy'
    ? {
        ...record,
        events: record.events.map((event) =>
          event.kind === 'synergy-activated' ? { ...event, affinity: 'neutral' as const } : event,
        ),
      }
    : record;
const game: GameState = {
  schemaVersion: 1,
  playerId: 'visual-fixture',
  revision: 0,
  inventory: createInventory(0),
  copies: [],
  receipts: [],
};
const content = projectPublicContent(config.opening, config.campaign);
function Fixture() {
  const [language, setLanguage] = useState<'es' | 'en'>(params.get('lang') === 'en' ? 'en' : 'es');
  const [reduced, setReduced] = useState(params.has('reduced'));
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return (
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
        <h1>ARCANA · Fixture</h1>
      </header>

      <main id="content">
        <BattlePanel
          settings={
            <GameSettings
              language={language}
              onLanguage={setLanguage}
              reduced={reduced}
              ownReduced={reduced}
              onReduced={setReduced}
            />
          }
          resources={
            <div className="hud">
              <span>50</span>
            </div>
          }
          combat={shownRecord}
          game={game}
          content={content}
          language={language}
          reduced={reduced}
          onBack={() => {}}
        />
      </main>
    </div>
  );
}
Object.assign(window, { __arenaFixtureRecord: JSON.stringify(record) });
createRoot(document.getElementById('root')!).render(<Fixture />);
