// Declared component fixture: no account, command, route advancement or authority claim.
// Reuses current catalogue/rules; duplicate IDs, condition and gear are explicit QA data.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { GameState } from '../../src/arcana/application/game';
import type { BeanAssignment } from '../../src/arcana/application/run-contracts';
import type { Run, RunMember } from '../../src/arcana/domain/exploration/run';
import { createInventory } from '../../src/arcana/domain/economy/inventory';
import { trialConfiguration } from '../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../src/arcana/application/public-content';
import { BossPartyStage } from '../../src/arcana/presentation/BossPartyStage';
import { BossSupplies } from '../../src/arcana/presentation/BossSupplies';
import { BossPrelude } from '../../src/arcana/presentation/BossPrelude';
import { setContentPack } from '../../src/arcana/presentation/content-packs/active';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
import '../../src/arcana/presentation/game-experience.css';

const params = new URLSearchParams(location.search);
const language = params.get('lang') === 'en' ? 'en' : 'es';
setContentPack(params.get('pack') === 'arcana' ? 'arcana' : 'diagon-alley');
const configuration = trialConfiguration('a85');
const content = projectPublicContent(configuration.opening, configuration.campaign);
const count = Math.min(5, Math.max(1, Number(params.get('members') ?? 5)));
const members: RunMember[] = Array.from({ length: count }, (_, i) => ({
  source: i >= 2 ? 'temporary' : 'owned',
  unit: {
    id: `a71-member-${i}`,
    wizardId: configuration.opening.catalog.wizards[i <= 1 ? 0 : i].id,
    affinity: i < 3 ? 'alchemy' : 'fire',
    level: 1,
    hp: i === 4 ? 0 : i === 2 ? 1 : 70,
    maxHp: 100,
    mana: i === 2 ? 0 : 20,
    maxMana: 30,
    power: 10,
    speed: 4,
    wandPowerBonus: i === 0 ? 1 : 0,
    wandMultiplier: 1,
    broomInitiative: i === 1 ? 1 : 0,
  },
}));
const run: Run = {
  id: 'a71-declared-party',
  graphVersion: configuration.campaign.graph.version,
  campaignVersion: configuration.campaign.version,
  zoneId: configuration.campaign.zoneId,
  graph: configuration.campaign.graph,
  visited: [],
  status: 'active',
  members,
  reserves: [],
};
const game: GameState = {
  schemaVersion: 1,
  playerId: 'a71-declared-component-only',
  revision: 1,
  inventory: {
    ...createInventory(0),
    products: params.has('empty')
      ? []
      : [{ id: 'a71-jar', kind: 'random-beans', status: 'available' }],
    equipment: [
      {
        id: 'a71-wand',
        kind: 'wand',
        version: 1,
        wood: 'birch',
        core: null,
        powerBonus: 1,
        multiplier: 1,
      },
      { id: 'a71-broom', kind: 'broom', version: 1, model: 'cadet-zephyr', initiative: 1 },
    ],
  },
  copies: members
    .filter((m) => m.source === 'owned')
    .map((m) => ({
      copyId: m.unit.id,
      wizard: configuration.opening.catalog.wizards[0],
      catalogVersion: configuration.opening.catalog.version,
      sourceId: 'a71-declared',
      origin: 'starter',
    })),
  team: {
    copyIds: members.filter((m) => m.source === 'owned').map((m) => m.unit.id),
    loadouts: [
      { copyId: 'a71-member-0', wandId: 'a71-wand', broomId: null },
      ...(count > 1 ? [{ copyId: 'a71-member-1', wandId: null, broomId: 'a71-broom' }] : []),
    ],
  },
  receipts: [],
};
const boss = configuration.campaign.challengeContent!(
  'discovery',
  configuration.campaign.graph,
).find((plan) => plan.kind === 'boss')!;
if (boss.kind !== 'boss') throw Error('No current boss');
const opponents = boss.opponents;
Object.assign(window, {
  __a71Party: {
    read: () => JSON.stringify({ run, game }),
    declared: true,
  },
});
function Fixture() {
  const [assignments, setAssignments] = useState<readonly BeanAssignment[]>([]);
  const [consulted, setConsulted] = useState('');
  return (
    <div className="arcana-shell game-shell">
      <main id="content">
        <section className="notice node-event-dialog boss-staging" data-event-kind="boss">
          <div className="boss-opponent-stage">
            <BossPrelude opponents={opponents} rules={content.combatRules} language={language} />
          </div>
          <div className="boss-player-preparation">
            <BossPartyStage
              run={run}
              game={game}
              assignments={assignments}
              language={language}
              ready
              rules={content.combatRules}
              onPrepare={(origin) => setConsulted(origin.dataset.bossMember ?? 'formation')}
            />
            <BossSupplies
              run={run}
              game={game}
              content={content}
              language={language}
              ready
              assignments={assignments}
              onChange={(value) => setAssignments(value ?? [])}
            />
          </div>
          <output data-component-consulted>{consulted}</output>
        </section>
      </main>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
declare global {
  interface Window {
    __a71Party: { read: () => string; declared: boolean };
  }
}
