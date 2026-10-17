// Declared component QA fixture. No player account, network operation or campaign progression.
import { useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { trialConfiguration } from '../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../src/arcana/application/public-content';
import { createInventory } from '../../src/arcana/domain/economy/inventory';
import { starterEquipment } from '../../src/arcana/domain/economy/equipment';
import type { GameState } from '../../src/arcana/application/game';
import type { BeanAssignment, NodeOptions } from '../../src/arcana/application/run-contracts';
import type { Run, RunMember } from '../../src/arcana/domain/exploration/run';
import type { EncounterOffer } from '../../src/arcana/domain/exploration/encounter-trades';
import { ExpeditionPreparation } from '../../src/arcana/presentation/ExpeditionPreparation';
import { BeanAssignments } from '../../src/arcana/presentation/BeanAssignments';
import { EncounterPreparation } from '../../src/arcana/presentation/EncounterPreparation';
import {
  activePack,
  setContentPack,
  type ContentPackId,
} from '../../src/arcana/presentation/content-packs/active';
import type { Language } from '../../src/arcana/domain/collection/wizards';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
import '../../src/arcana/presentation/game-experience.css';

const params = new URLSearchParams(location.search);
const config = trialConfiguration();
const content = projectPublicContent(config.opening, config.campaign);
const copies: GameState['copies'] = Array.from({ length: 30 }, (_, index) => ({
  copyId: `a75-copy-${index}`,
  wizard: content.catalog.wizards[index % 6],
  catalogVersion: content.catalog.version,
  sourceId: 'a75-declared-fixture',
  origin: 'toad',
}));
const member = (index: number, wizardIndex = index): RunMember => ({
  source: 'owned',
  unit: {
    ...config.campaign.prepareOwned(copies[wizardIndex]),
    id: copies[index].copyId,
    affinity: 'alchemy',
    hp: 30,
    maxHp: 100,
    mana: 50,
    maxMana: 100,
  },
});
const run: Run = {
  id: 'a75-declared-run',
  status: 'active',
  campaignVersion: config.campaign.version,
  graph: config.campaign.graph,
  graphVersion: config.campaign.graph.version,
  zoneId: config.campaign.zoneId,
  visited: [],
  members: [
    member(0),
    member(6, 0),
    { ...member(12, 0), source: 'temporary', unit: { ...member(12, 0).unit, id: 'a75-pact-copy' } },
  ],
  campaignSnapshot: {
    ...config.campaign,
    combatRules: {
      ...content.combatRules,
      alchemyHealing: 11,
      fireBurnDamage: 13,
      shadowInitiative: 15,
      beans: {
        version: 75,
        entries: [
          { flavour: 'mint', weight: 1 },
          { flavour: 'pepper', weight: 3 },
        ],
      },
    },
  },
};
const game: GameState = {
  schemaVersion: 1,
  playerId: 'a75-fixture-only',
  revision: 1,
  inventory: {
    ...createInventory(0),
    equipment: starterEquipment(),
    products: params.has('empty')
      ? []
      : Array.from({ length: 3 }, (_, i) => ({
          id: `a75-jar-${i}`,
          kind: 'random-beans',
          status: 'available',
        })),
  },
  copies,
  receipts: [],
  team: {
    copyIds: [copies[0].copyId, copies[6].copyId],
    loadouts: [
      { copyId: copies[0].copyId, wandId: 'starter:wand', broomId: null },
      { copyId: copies[6].copyId, wandId: null, broomId: 'starter:broom' },
    ],
  },
  exploration: { run: params.has('new') ? null : run, victories: [], unlockedZones: [] },
};
const offer: EncounterOffer = {
  id: 'a75-fixture-healer',
  npcId: 'moon-herbalist',
  kind: 'healer',
  options: [
    { id: 'a75-single', scope: 'unit', restore: 'hp', fraction: 0.4, costFraction: 0.2 },
    { id: 'a75-group', scope: 'team', restore: 'hp', fraction: 0.15, costFraction: 0.1 },
  ],
};
function Fixture() {
  const [language, setLanguage] = useState<Language>(params.get('lang') === 'en' ? 'en' : 'es');
  const [pack, updatePack] = useState<ContentPackId>(
    params.get('pack') === 'arcana' ? 'arcana' : 'diagon-alley',
  );
  const [assignments, setAssignments] = useState<readonly BeanAssignment[]>([]);
  const [options, setOptions] = useState<NodeOptions>({});
  const [confirmedTeam, setConfirmedTeam] = useState<readonly string[] | null>(null);
  setContentPack(pack);
  document.documentElement.lang = language;
  Object.assign(window, {
    __a75Preparation: {
      declared: true,
      read: () => JSON.stringify({ game, confirmedTeam, assignments, options }),
      source: () => JSON.stringify(game),
    },
  });
  return (
    <div
      className="arcana-shell game-shell"
      data-content-pack={pack}
      data-reduced="true"
      style={
        Object.fromEntries(
          Object.entries(activePack.palette).map(([key, value]) => [
            '--pack-' + key.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase()),
            value,
          ]),
        ) as CSSProperties
      }
    >
      <header className="game-header">
        <nav aria-label="QA fixture controls">
          <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}>QA language</button>
          <button
            onClick={() => {
              const next = pack === 'arcana' ? 'diagon-alley' : 'arcana';
              setContentPack(next);
              updatePack(next);
            }}
          >
            QA pack
          </button>
        </nav>
      </header>
      <main id="content">
        {params.get('view') === 'encounter' ? (
          <EncounterPreparation
            offer={offer}
            run={run}
            options={options}
            onChange={setOptions}
            language={language}
            ready
          />
        ) : params.get('view') === 'beans' ? (
          <BeanAssignments
            run={run}
            game={game}
            content={content}
            language={language}
            ready
            assignments={assignments}
            onChange={setAssignments}
          />
        ) : (
          <ExpeditionPreparation
            game={game}
            catalog={content.catalog}
            content={content}
            language={language}
            ready
            onTeam={({ copyIds }) => setConfirmedTeam(copyIds)}
            onStart={(ids) => setConfirmedTeam(ids)}
            onEquip={() => {}}
          />
        )}
        <output hidden data-fixture-confirmed>
          {confirmedTeam?.join(',') ?? ''}
        </output>
      </main>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
