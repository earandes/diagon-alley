// Declared presentation fixtures. Uses the real BattlePanel/SceneCanvas/CardReveal;
// does not write accounts, invent a granted reward or modify the campaign.
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BattlePanel } from '../../src/arcana/presentation/BattlePanel';
import { CardReveal } from '../../src/arcana/presentation/CardReveal';
import { CombatEngine, type CombatUnitInput } from '../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../src/arcana/infrastructure/random/seeded-random';
import { createInventory } from '../../src/arcana/domain/economy/inventory';
import type { GameState, OpeningReceipt } from '../../src/arcana/application/game';
import { trialConfiguration } from '../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../src/arcana/application/public-content';
import { setContentPack, activePack } from '../../src/arcana/presentation/content-packs/active';
import { visualAsset } from '../../src/arcana/presentation/content-packs/art';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
import '../../src/arcana/presentation/game-experience.css';

const params = new URLSearchParams(location.search);
setContentPack(params.get('pack') === 'arcana' ? 'arcana' : 'diagon-alley');
const configuration = trialConfiguration();
const catalog = configuration.opening.catalog;
const language = params.get('lang') === 'en' ? 'en' : 'es';
const makeUnits = (side: 'player' | 'rival', count: number): CombatUnitInput[] =>
  catalog.wizards
    .slice(side === 'player' ? 0 : 5, (side === 'player' ? 0 : 5) + count)
    .map((wizard, i) => ({
      id: `${side}-${i}`,
      wizardId: wizard.id,
      level: 1,
      affinity: side === 'player' ? 'alchemy' : i < 2 ? 'fire' : 'neutral',
      hp: 250,
      maxHp: 300,
      mana: 30,
      maxMana: 40,
      power: 12,
      speed: side === 'player' ? 8 : 6,
      wandPowerBonus: 2,
      wandMultiplier: 1,
      broomInitiative: 0,
    }));
// Fixed rules and seed, declared independently of any player's inventory. Resolved
// once to create the fixture BattleLog; playback must never resolve it a second time.
const battle = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }).resolve({
  id: 'a69-motion-fixture',
  seed: 69,
  player: makeUnits('player', Number(params.get('player') ?? 3)),
  rival: makeUnits('rival', Number(params.get('rival') ?? 3)),
  rules: { ...configuration.campaign.combatRules, maxRounds: 8 },
});
const game: GameState = {
  schemaVersion: 1,
  playerId: 'a69-render-fixture',
  revision: 1,
  inventory: createInventory(0),
  copies: [],
  receipts: [],
};
const content = projectPublicContent(configuration.opening, configuration.campaign);
const rarity = params.get('rarity') ?? 'common';
const wizard = catalog.wizards.find((entry) => entry.rarity === rarity)!;
const receipt: OpeningReceipt = {
  id: `a69-${activePack.id}-${language}-${rarity}-${params.get('repeat') ? 'repeat' : 'new'}-${params.get('instance') ?? 'primary'}`,
  kind: 'open-toad',
  request: {
    unitId: 'a69-declared-fixture-unit',
    catalogVersion: catalog.version,
    tableVersion: configuration.opening.table.version,
  },
  wizard,
  copyId: 'a69-declared-fixture-copy',
  isNew: !params.has('repeat'),
};
declare global {
  interface Window {
    __a69Fixture: { battle: string; game: string; receipt: string; retired: HTMLElement[] };
  }
}
window.__a69Fixture = {
  get battle() {
    return JSON.stringify(battle);
  },
  get game() {
    return JSON.stringify(game);
  },
  get receipt() {
    return JSON.stringify(receipt);
  },
  retired: [],
};

function Fixture() {
  const [mounted, setMounted] = useState(!params.has('manual'));
  const [generation, setGeneration] = useState(0);
  const [lang, setLang] = useState<'es' | 'en'>(language);
  const [reduced, setReduced] = useState(params.has('reduced'));
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const unmount = () => {
    window.__a69Fixture.retired.push(...document.querySelectorAll<HTMLElement>('.scene-canvas'));
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
          <span className="visually-hidden">Declared fixture, not an earned reward</span>
        </header>
        <main id="content">
          {!mounted && (
            <button data-qa-start onClick={() => setMounted(true)}>
              Present declared fixture
            </button>
          )}
          {mounted &&
            (params.get('kind') === 'opening' ? (
              <CardReveal
                key={generation}
                receipt={receipt}
                language={lang}
                reduced={reduced}
                onClose={unmount}
                onCollection={unmount}
              />
            ) : (
              <BattlePanel
                key={generation}
                combat={battle}
                game={game}
                content={content}
                language={lang}
                reduced={reduced}
                onBack={unmount}
              />
            ))}
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
        <button data-qa-language onClick={() => setLang((old) => (old === 'es' ? 'en' : 'es'))}>
          Fixture language
        </button>
        <button
          data-qa-pack
          onClick={() => {
            setContentPack(activePack.id === 'arcana' ? 'diagon-alley' : 'arcana');
            setGeneration((n) => n + 1);
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
