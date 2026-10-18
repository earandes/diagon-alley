// Declared isolated fixture; no account, economic command, or live collection is used.
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BattlePanel } from '../../src/arcana/presentation/BattlePanel';
import { GameSettings } from '../../src/arcana/presentation/GameSettings';
import {
  useGameAudioLifecycle,
  gameAudio,
  audioPreferences,
} from '../../src/arcana/presentation/audio/runtime';
import { soundAssets } from '../../src/arcana/presentation/audio/assets';
import { CombatEngine, type CombatUnitInput } from '../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../src/arcana/infrastructure/random/seeded-random';
import { createInventory } from '../../src/arcana/domain/economy/inventory';
import type { GameState } from '../../src/arcana/application/game';
import { trialConfiguration } from '../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../src/arcana/application/public-content';
import { activePack, setContentPack } from '../../src/arcana/presentation/content-packs/active';
import { visualAsset } from '../../src/arcana/presentation/content-packs/art';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
import '../../src/arcana/presentation/game-experience.css';

const configuration = trialConfiguration();
const units = (side: 'player' | 'rival'): CombatUnitInput[] =>
  configuration.opening.catalog.wizards
    .slice(side === 'player' ? 0 : 5, side === 'player' ? 5 : 10)
    .map((w, i) => ({
      id: `${side}-${i}`,
      wizardId: w.id,
      level: 1,
      affinity: side === 'player' ? 'alchemy' : i < 2 ? 'fire' : i === 2 ? 'neutral' : 'shadows',
      hp: 80,
      maxHp: 120,
      mana: 40,
      maxMana: 40,
      power: 10,
      speed: side === 'player' ? 8 : 6,
      wandPowerBonus: 2,
      wandMultiplier: 1,
      broomInitiative: 0,
    }));
const battle = new CombatEngine({ fromSeed: (s) => new SeededRandom(s) }).resolve({
  id: 'a84-audio-fixture',
  seed: 84,
  player: units('player'),
  rival: units('rival'),
  rules: configuration.campaign.combatRules,
});
const game = {
  playerId: 'a84-fixture',
  copies: [],
  inventory: createInventory(0),
  receipts: [],
} as unknown as GameState;
const params = new URLSearchParams(location.search);
setContentPack(params.get('pack') === 'arcana' ? 'arcana' : 'diagon-alley');
declare global {
  interface Window {
    __a84: {
      audio: typeof gameAudio;
      assets: typeof soundAssets;
      preferences: typeof audioPreferences;
      battle: typeof battle;
      unmount: () => void;
      reduced: () => void;
    };
  }
}

function Fixture() {
  useGameAudioLifecycle();
  const [language, setLanguage] = useState<'es' | 'en'>(params.get('lang') === 'en' ? 'en' : 'es');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const [reduced, setReduced] = useState(false);
  const [, refresh] = useState(0);
  window.__a84 = {
    audio: gameAudio,
    assets: soundAssets,
    preferences: audioPreferences,
    battle,
    unmount: () => setMounted(false),
    reduced: () => setReduced(true),
  };
  return (
    <div className="arcana-shell game-shell" data-view={mounted ? 'battle' : 'map'}>
      <div
        className="game-world-backdrop"
        style={
          {
            '--scene-url': `url("${visualAsset('scene.passage')?.url}")`,
          } as import('react').CSSProperties
        }
      />
      <header className="game-header">
        <h1>{activePack.brand}</h1>
        <GameSettings
          language={language}
          onLanguage={setLanguage}
          reduced={reduced}
          ownReduced={reduced}
          onReduced={setReduced}
        />
      </header>
      <main id="content">
        {mounted ? (
          <BattlePanel
            combat={battle}
            game={game}
            content={projectPublicContent(configuration.opening, configuration.campaign)}
            language={language}
            reduced={reduced}
            onBack={() => setMounted(false)}
          />
        ) : (
          <>
            <p>Declared QA fixture · no player resources</p>
            <button data-fixture-start onClick={() => setMounted(true)}>
              Start confirmed battle fixture
            </button>
            <button
              data-fixture-pack
              onClick={() => {
                setContentPack(activePack.id === 'arcana' ? 'diagon-alley' : 'arcana');
                refresh((n) => n + 1);
              }}
            >
              Swap fixture presentation
            </button>
          </>
        )}
      </main>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
