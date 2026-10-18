import { starterEquipment } from '../../src/arcana/domain/economy/equipment';
import { refreshRunEquipment } from '../../src/arcana/application/prepare-team';
import { nodeActionLabel } from '../../src/arcana/presentation/node-event-messages';
import { text } from '../../src/arcana/presentation/translations';
import { Artwork } from '../../src/arcana/presentation/Artwork';
import type { BeanAssignment } from '../../src/arcana/application/run-contracts';
import { BossPartyStage } from '../../src/arcana/presentation/BossPartyStage';
import { BossSupplies } from '../../src/arcana/presentation/BossSupplies';
import { GameSettings } from '../../src/arcana/presentation/GameSettings';
import { IntentionReminder } from '../../src/arcana/presentation/ExpeditionIntentions';
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
// App owns this shared dialog sheet. Matching button classes without it stacks
// the confirmation artwork, label and cost into the legacy grid control.
import '../../src/arcana/presentation/node-event-dialog.css';
import '../../src/arcana/presentation/header-pact.css';
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
const fixtureChallenge = query.get('mode') === 'boss' ? 'mastery' : 'discovery';
let run: Run = {
  id: 'a85-fixture',
  campaignVersion: 1,
  graphVersion: graph.version,
  graph,
  zoneId: c.campaign.zoneId,
  visited: query.has('visited') ? [graph.nodes.find((n) => n.row === 0)!.id] : [],
  status: 'active',
  tacticalVersion: 3,
  equipmentRulesVersion: 2,
  challenge: fixtureChallenge,
  members,
  campaignSnapshot: {
    ...c.campaign,
    graph,
    nodes: c.campaign.challengeContent!(fixtureChallenge, graph),
  },
};
const dense = query.has('dense');
const gear = dense
  ? members.flatMap((_, i) =>
      starterEquipment().map((item) => ({ ...item, id: `fixture:gear:${i}:${item.kind}` })),
    )
  : [];
const beans =
  dense || query.has('intention')
    ? members.map((_, i) => ({
        id: `fixture:bean:${i}`,
        kind: 'random-beans' as const,
        status: 'available' as const,
      }))
    : [];
const denseAssignments: readonly BeanAssignment[] = dense
  ? members.map((m, i) => ({ unitId: m.unit.id, beanId: beans[i].id }))
  : [];
let game: GameState = {
  schemaVersion: 1,
  playerId: 'a85-declared',
  revision: 1,
  inventory: { ...createInventory(0), equipment: gear, products: beans },
  copies,
  receipts: [],
  team: {
    copyIds: copies.slice(0, 5).map((c) => c.copyId),
    loadouts: dense
      ? members.map((m, i) => ({
          copyId: m.unit.id,
          wandId: `fixture:gear:${i}:wand`,
          broomId: `fixture:gear:${i}:broom`,
        }))
      : [],
  },
  exploration: {
    run,
    victories: [],
    unlockedZones: [c.campaign.zoneId],
    ...(query.has('intention')
      ? {
          intention: {
            version: 1 as const,
            afterRunId: 'fixture-previous-run',
            runId: run.id,
            choice: { kind: 'bean' as const },
          },
        }
      : {}),
  },
};
if (dense) {
  run = refreshRunEquipment(run, game, game.team!);
  game = { ...game, exploration: { ...game.exploration!, run } };
}
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
  player: run.members.map((m) => ({
    ...m.unit,
    hp: 60,
    ...(denseAssignments.find((a) => a.unitId === m.unit.id)
      ? { beanUnitId: denseAssignments.find((a) => a.unitId === m.unit.id)!.beanId }
      : {}),
  })),
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
    [reduced, setReduced] = useState(query.has('reduced')),
    [ready, setReady] = useState(!query.has('busy'));
  const pact = run.campaignSnapshot!.nodes.find((p) => p.kind === 'pact')!;
  const boss = run.campaignSnapshot!.nodes.find((p) => p.kind === 'boss')!;
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
      className={`arcana-shell game-shell${mode === 'map' || mode === 'boss' ? ' arcana-map-view' : ''}`}
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
            <IntentionReminder game={game} content={content} language={language} />
            <TeamHud
              game={game}
              content={content}
              language={language}
              onPrepare={() => setMode('prepare')}
            />
            <MapPanel
              run={run}
              ready={ready}
              language={language}
              onSelect={() => setMode('pact')}
            />
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
            data-event-kind="boss"
          >
            <GameSettings
              language={language}
              onLanguage={() => {}}
              reduced={reduced}
              ownReduced={reduced}
              onReduced={setReduced}
            />
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
                assignments={denseAssignments}
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
                assignments={denseAssignments}
                onChange={() => {}}
              />
            </div>
            <div className="node-event-actions node-combat-actions">
              <button
                className="node-confirm-action"
                aria-describedby="fixture-boss-cost"
                onClick={() => setMode('battle')}
              >
                <Artwork asset="node.boss" language={language} decorative />
                <span>{nodeActionLabel(language, 'boss')}</span>
                <span
                  id="fixture-boss-cost"
                  className="boss-challenge-cost"
                  aria-label={text(language, 'uses5EssenceAutomaticCombatWithYourCurrent')}
                >
                  <Artwork asset="currency.essence" language={language} decorative />
                  <strong>5</strong>
                </span>
              </button>
              <button
                className="node-cancel-action"
                aria-label={text(language, 'cancel')}
                onClick={() => setMode('map')}
              >
                <span aria-hidden="true">×</span>
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
        {query.has('busy') && (
          <button data-qa-ready onClick={() => setReady(true)}>
            Release operation fixture
          </button>
        )}
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
