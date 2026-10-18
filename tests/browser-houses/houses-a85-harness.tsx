import { BossPartyStage } from '../../src/arcana/presentation/BossPartyStage';
import { BossSupplies } from '../../src/arcana/presentation/BossSupplies';
// Declared UI fixtures, never an earned collection or a public server grant route.
import { useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { trialConfiguration } from '../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../src/arcana/application/public-content';
import { randomizeRoute } from '../../src/arcana/domain/exploration/randomize-route';
import { SeededRandom } from '../../src/arcana/infrastructure/random/seeded-random';
import { CombatEngine } from '../../src/arcana/domain/combat/engine';
import { createInventory } from '../../src/arcana/domain/economy/inventory';
import { TeamHud } from '../../src/arcana/presentation/TeamHud';
import { MapPanel } from '../../src/arcana/presentation/MapPanel';
import { CollectionPanel } from '../../src/arcana/presentation/CollectionPanel';
import { CardReveal } from '../../src/arcana/presentation/CardReveal';
import { BattlePanel } from '../../src/arcana/presentation/BattlePanel';
import { NodePreparation } from '../../src/arcana/presentation/NodePreparation';
import { ExpeditionPreparation } from '../../src/arcana/presentation/ExpeditionPreparation';
import { SweetshopScene } from '../../src/arcana/presentation/SweetshopScene';
import {
  selectedContentPackId,
  subscribeContentPack,
  setContentPack,
  activePack,
} from '../../src/arcana/presentation/content-packs/active';
import { visualAsset } from '../../src/arcana/presentation/content-packs/art';
import type { GameState, OpeningReceipt } from '../../src/arcana/application/game';
import type { Run } from '../../src/arcana/domain/exploration/run';
import type { NodeOptions } from '../../src/arcana/application/run-contracts';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
import '../../src/arcana/presentation/game-experience.css';
const query = new URLSearchParams(location.search),
  c = trialConfiguration(),
  content = projectPublicContent(c.opening, c.campaign);
setContentPack(query.get('pack') === 'arcana' ? 'arcana' : 'diagon-alley');
const language = query.get('lang') === 'en' ? 'en' : 'es';
document.documentElement.lang = language;
const selected = [
  ...c.opening.catalog.wizards.filter((w) => w.traits?.house === 'hufflepuff'),
  c.opening.catalog.wizards[0],
];
const catalog = [...selected, ...c.opening.catalog.wizards.filter((w) => !selected.includes(w))];
const copies = catalog.map((wizard, i) => ({
  copyId: `fixture:${i}`,
  wizard: {
    ...wizard,
    ...(i === 0 ? { finish: { id: 'enchanted' as const, version: 1 as const } } : {}),
  },
  catalogVersion: 3,
  sourceId: 'declared-fixture',
  origin: 'starter' as const,
}));
copies.push({
  ...copies[0],
  copyId: 'fixture:duplicate',
  wizard: { ...copies[0].wizard, finish: undefined },
});
const members = selected.map((_, i) => ({
  source: 'owned' as const,
  unit: c.campaign.prepareOwned(copies[i]),
}));
const graph = randomizeRoute(c.campaign.graph, new SeededRandom(0));
const run: Run = {
  id: 'a85-fixture',
  campaignVersion: 1,
  graphVersion: graph.version,
  graph,
  zoneId: c.campaign.zoneId,
  visited: query.has('visited') ? [graph.nodes.find((n) => n.row === 0)!.id] : [],
  status: 'active',
  tacticalVersion: 3,
  equipmentRulesVersion: 2,
  challenge: 'discovery',
  members,
  campaignSnapshot: {
    ...c.campaign,
    graph,
    nodes: c.campaign.challengeContent!('discovery', graph),
  },
};
const game: GameState = {
  schemaVersion: 1,
  playerId: 'a85-declared',
  revision: 1,
  inventory: createInventory(0),
  copies,
  receipts: [],
  team: { copyIds: copies.slice(0, 5).map((c) => c.copyId), loadouts: [] },
  exploration: { run, victories: [], unlockedZones: [c.campaign.zoneId] },
};
const receipt: OpeningReceipt = {
  id: `a85-opening-${query.get('pack') ?? 'default'}-${language}-${query.get('instance') ?? 'primary'}`,
  kind: 'open-toad',
  request: { unitId: 'declared', catalogVersion: 3, tableVersion: 3 },
  wizard: copies[0].wizard,
  copyId: copies[0].copyId,
  isNew: !query.has('repeat'),
};
const battle = new CombatEngine({ fromSeed: (s) => new SeededRandom(s) }).resolve({
  id: 'a85-combat-fixture',
  seed: 85,
  player: members.map((m) => ({ ...m.unit, hp: 60 })),
  rival: c.opening.catalog.wizards.slice(5, 10).map((w, i) => ({
    ...c.campaign.prepareOwned({ ...copies[0], wizard: w, copyId: `rival:${i}` }),
    power: 8,
    hp: 90,
    maxHp: 90,
  })),
  rules: { ...c.campaign.combatRules, maxRounds: 6 },
});
const record = JSON.stringify({ game, battle, receipt });
Object.assign(window, {
  __a85: { record, check: () => JSON.stringify({ game, battle, receipt }) === record },
});
function Fixture() {
  useSyncExternalStore(subscribeContentPack, selectedContentPackId);
  const [mode, setMode] = useState(query.get('mode') ?? 'map'),
    [options, setOptions] = useState<NodeOptions>({ pactAction: 'recruit' }),
    [reduced, setReduced] = useState(query.has('reduced'));
  const pact = run.campaignSnapshot!.nodes.find((p) => p.kind === 'pact')!;
  const boss = c.campaign.challengeContent!('mastery', graph).find((p) => p.kind === 'boss')!;
  const pactMembers = copies
    .filter(
      (copy) =>
        copy.wizard.traits?.house === pact.recruit.house &&
        copy.wizard.id !== pact.recruit.wizardId,
    )
    .slice(0, 2)
    .map((copy) => ({ source: 'owned' as const, unit: c.campaign.prepareOwned(copy) }));
  return (
    <div
      className={`arcana-shell game-shell${mode === 'map' ? ' arcana-map-view' : ''}`}
      data-view={mode === 'battle' ? 'battle' : 'map'}
    >
      <div
        className="game-world-backdrop"
        style={
          { '--scene-url': `url("${visualAsset('scene.passage')?.url}")` } as React.CSSProperties
        }
      />
      <header className="game-header">
        <h1>{activePack.brand}</h1>
      </header>
      <main id="content">
        {mode === 'map' && (
          <section className="expedition-panel" data-map-phase="route">
            <TeamHud
              game={game}
              content={content}
              language={language}
              onPrepare={() => setMode('prepare')}
            />
            <MapPanel run={run} ready language={language} onSelect={() => setMode('pact')} />
          </section>
        )}
        {mode === 'collection' && (
          <CollectionPanel game={game} catalog={c.opening.catalog} language={language} />
        )}
        {mode === 'prepare' && (
          <ExpeditionPreparation
            game={game}
            content={content}
            catalog={c.opening.catalog}
            language={language}
            ready
            onTeam={() => {}}
            onEquip={() => {}}
            onStart={() => {}}
            onClose={() => setMode('map')}
          />
        )}
        {mode === 'boss' && (
          <dialog
            ref={(element) => {
              if (element && !element.open) element.showModal();
            }}
            className="notice node-event-dialog boss-staging"
            aria-label="Declared boss fixture"
          >
            <NodePreparation
              plan={boss}
              run={run}
              game={game}
              rounding="floor"
              options={{}}
              onChange={() => {}}
              language={language}
              ready
              rules={content.combatRules}
            />
            <div className="boss-player-preparation">
              <BossPartyStage
                run={run}
                game={game}
                assignments={[]}
                language={language}
                ready
                rules={content.combatRules}
                onPrepare={() => setMode('prepare')}
              />
              <BossSupplies
                run={run}
                game={game}
                content={content}
                language={language}
                ready
                assignments={[]}
                onChange={() => {}}
              />
            </div>
            <div className="node-event-actions node-combat-actions">
              <button onClick={() => setMode('battle')}>
                {language === 'es' ? 'Confirmar combate · 5' : 'Confirm battle · 5'}
              </button>
              <button onClick={() => setMode('map')}>
                {language === 'es' ? 'Volver' : 'Back'}
              </button>
            </div>
          </dialog>
        )}
        {mode === 'pact' && (
          <section className="notice node-event-dialog">
            <NodePreparation
              plan={pact}
              run={{ ...run, members: pactMembers }}
              game={game}
              rounding="floor"
              options={options}
              onChange={setOptions}
              language={language}
              ready
              rules={content.combatRules}
            />
          </section>
        )}
        {mode === 'opening' && (
          <CardReveal
            receipt={receipt}
            language={language}
            reduced={reduced}
            onClose={() => setMode('collection')}
            onCollection={() => setMode('collection')}
          />
        )}
        {mode === 'battle' && (
          <BattlePanel
            combat={battle}
            game={game}
            content={content}
            language={language}
            reduced={reduced}
            onBack={() => setMode('map')}
          />
        )}
        {mode === 'shop' && (
          <SweetshopScene
            game={game}
            content={content}
            language={language}
            ready
            onPurchase={() => {}}
            onOpen={() => {}}
            onBuyOpen={() => {}}
          />
        )}
      </main>
      <footer
        className="a85-fixture-controls"
        style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 100, fontSize: 10 }}
      >
        <span>Declared fixture</span>
        <button
          data-qa-pack
          onClick={() =>
            setContentPack(selectedContentPackId() === 'arcana' ? 'diagon-alley' : 'arcana')
          }
        >
          Swap
        </button>
        <button data-qa-reduced onClick={() => setReduced(true)}>
          Reduce
        </button>
      </footer>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
