// Isolated, declared component fixture; compatible with baseline86d6a92.
// No account, operation or economic authority. No new A92-only imports.
import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { MapPanel } from '../../src/arcana/presentation/MapPanel';
import { TeamHud } from '../../src/arcana/presentation/TeamHud';
import { BossPartyStage } from '../../src/arcana/presentation/BossPartyStage';
import { NodePreparation } from '../../src/arcana/presentation/NodePreparation';
import { BossSupplies } from '../../src/arcana/presentation/BossSupplies';
import { BossPrelude } from '../../src/arcana/presentation/BossPrelude';
import { projectPublicContent } from '../../src/arcana/application/public-content';
import { trialConfiguration } from '../../src/arcana/infrastructure/content/trial-configuration';
import { createInventory } from '../../src/arcana/domain/economy/inventory';
import type { GameState } from '../../src/arcana/application/game';
import type { Run } from '../../src/arcana/domain/exploration/run';
import {
  setContentPack,
  activePack,
  regionAppearance,
} from '../../src/arcana/presentation/content-packs/active';
import { visualAsset } from '../../src/arcana/presentation/content-packs/art';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
import '../../src/arcana/presentation/game-experience.css';
import '../../src/arcana/presentation/priority-a89.css';
import '../../src/arcana/presentation/node-event-dialog.css';
import '../../src/arcana/presentation/node-a60.css';
import '../../src/arcana/presentation/contextual-preparation.css';

const params = new URLSearchParams(location.search);
const language = params.get('lang') === 'en' ? 'en' : 'es';
setContentPack(params.get('pack') === 'arcana' ? 'arcana' : 'diagon-alley');
document.documentElement.lang = language;
document.documentElement.dataset.readingSize = params.get('large') === '1' ? 'large' : 'normal';
const config = trialConfiguration('a85');
const content = projectPublicContent(config.opening, config.campaign);
const fullPreparation = params.get('full') === '1';
const count = Math.min(5, Math.max(1, Number(params.get('count') ?? 5)));
const ids = ['merlin', 'morgana', 'moon-herbalist', 'flamel', 'apprentice'];
const copies = ids.slice(0, count).map((id, index) => ({
  copyId: `a92-map-copy-${index}`,
  wizard:
    content.catalog.wizards.find((wizard) => wizard.id === id) ?? content.catalog.wizards[index],
  catalogVersion: content.catalog.version,
  sourceId: 'a92-declared-component',
  origin: 'starter' as const,
}));
const run: Run = {
  id: 'a92-declared-map-run',
  status: 'active',
  zoneId: config.campaign.zoneId,
  graphVersion: config.campaign.graph.version,
  campaignVersion: config.campaign.version,
  graph: config.campaign.graph,
  visited: [],
  bondFocus: 'houses',
  campaignSnapshot: config.campaign,
  members: copies.map((copy, index) => ({
    source: index >= 3 ? 'temporary' : 'owned',
    unit: {
      ...config.campaign.prepareOwned(copy),
      id: copy.copyId,
      hp: index === 4 ? 0 : index === 3 ? 1 : copy.wizard.stats.maxHp,
    },
  })),
};
const game: GameState = {
  schemaVersion: 1,
  playerId: 'a92-declared-map-only',
  revision: 1,
  inventory: {
    ...createInventory(0),
    products: fullPreparation
      ? [{ id: 'a92-full-jar', kind: 'random-beans', status: 'available' }]
      : [],
  },
  copies,
  receipts: [],
  team: { copyIds: copies.map((copy) => copy.copyId), loadouts: [] },
};
const before = JSON.stringify({ run, game });
const boss = config.campaign.challengeContent!('discovery', config.campaign.graph).find(
  (node) => node.kind === 'boss',
);
if (boss?.kind !== 'boss') throw Error('A92 fixture requires existing boss');
const bossPlan = boss;
const opponents = bossPlan.opponents;
const mode = params.get('mode') ?? 'map';
const prepare = () => {
  window.__a92MapPrep.prepared++;
};
Object.assign(window, {
  __a92MapPrep: {
    declared: true,
    prepared: 0,
    selected: '',
    before,
    read: () => JSON.stringify({ run, game }),
    graph: run.graph,
  },
});
function Fixture() {
  const [selection, setSelection] = useState('');
  const encounter = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    encounter.current?.showModal();
  }, []);
  return (
    <div
      className={`arcana-shell game-shell ${mode === 'map' ? 'arcana-map-view' : ''}`}
      data-pack={activePack.id}
      data-a92-mode={mode}
      data-reading-size={params.get('large') === '1' ? 'large' : 'normal'}
      style={
        {
          ...Object.fromEntries(
            Object.entries(activePack.palette).map(([key, value]) => [
              '--pack-' + key.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase()),
              value,
            ]),
          ),
          '--scene-url': `url("${visualAsset(regionAppearance(run.zoneId, language).mapAsset)?.url ?? ''}")`,
        } as CSSProperties
      }
    >
      <div className="game-world-backdrop" aria-hidden="true" />
      <main id="content">
        {mode === 'map' ? (
          <section
            className="expedition-panel"
            data-map-phase="route"
            style={{ height: 'calc(100dvh - 32px)', position: 'relative' }}
          >
            <TeamHud
              game={{ ...game, exploration: { run, victories: [], unlockedZones: [run.zoneId] } }}
              content={content}
              language={language}
              onPrepare={prepare}
            />
            <MapPanel
              run={run}
              language={language}
              ready
              publicPlans={content.campaign.nodes}
              onSelect={(id) => {
                window.__a92MapPrep.selected = id;
                setSelection(id);
              }}
            />
            <output className="visually-hidden">{selection}</output>
          </section>
        ) : (
          <dialog
            ref={encounter}
            className="notice node-event-dialog boss-staging"
            data-event-kind="boss"
          >
            {fullPreparation ? (
              <NodePreparation
                plan={bossPlan}
                run={run}
                game={game}
                rounding={config.campaign.rounding}
                options={{}}
                onChange={() => {}}
                language={language}
                ready
                rules={content.combatRules}
              />
            ) : (
              <div className="boss-opponent-stage">
                <BossPrelude
                  opponents={opponents}
                  rules={content.combatRules}
                  language={language}
                />
              </div>
            )}
            <div className="boss-player-preparation">
              <BossPartyStage
                run={run}
                game={game}
                assignments={[]}
                language={language}
                ready
                rules={content.combatRules}
                onPrepare={prepare}
              />
              {fullPreparation && (
                <BossSupplies
                  run={run}
                  game={game}
                  content={content}
                  language={language}
                  ready
                  assignments={[]}
                  onChange={() => {}}
                />
              )}
            </div>
            <div className="node-event-actions node-combat-actions">
              <button className="node-confirm-action" onClick={() => setSelection('confirmed')}>
                {language === 'es' ? 'Combatir · 5' : 'Battle · 5'}
              </button>
            </div>
            <output className="visually-hidden">{selection}</output>
          </dialog>
        )}
      </main>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
declare global {
  interface Window {
    __a92MapPrep: {
      declared: boolean;
      prepared: number;
      selected: string;
      before: string;
      read: () => string;
      graph: Run['graph'];
    };
  }
}
