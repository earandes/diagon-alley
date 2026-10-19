// Declared UI fixtures using real components. No player account, economic server or campaign balance claim.
import { useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { CombatEngine } from '../../src/arcana/domain/combat/engine';
import { SeededRandom } from '../../src/arcana/infrastructure/random/seeded-random';
import type { Language } from '../../src/arcana/domain/collection/wizards';
import type { BeanAssignment } from '../../src/arcana/application/run-contracts';
import type { IntentionChoice } from '../../src/arcana/domain/exploration/intentions';
import { SetIntentionUseCase } from '../../src/arcana/application/set-intention';
import {
  ExpeditionIntentions,
  IntentionReminder,
} from '../../src/arcana/presentation/ExpeditionIntentions';
import { ExpeditionGuide } from '../../src/arcana/presentation/ExpeditionGuide';
import { BattlePanel } from '../../src/arcana/presentation/BattlePanel';
import { BeanAssignments } from '../../src/arcana/presentation/BeanAssignments';
import { CommercePanel } from '../../src/arcana/presentation/CommercePanel';
import { CollectionPanel } from '../../src/arcana/presentation/CollectionPanel';
import { GameSettings } from '../../src/arcana/presentation/GameSettings';
import { ReadingScope } from '../../src/arcana/presentation/ReadingPreferences';
import { useReducedMotion } from '../../src/arcana/presentation/useReducedMotion';
import {
  setContentPack,
  activePack,
  type ContentPackId,
} from '../../src/arcana/presentation/content-packs/active';
import { visualAsset } from '../../src/arcana/presentation/content-packs/art';
import { acquirePriorityFixtureCopy, createPriorityFixtureState } from './fixture-state';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
import '../../src/arcana/presentation/game-experience.css';
import '../../src/arcana/presentation/node-event-dialog.css';
import '../../src/arcana/presentation/header-pact.css';

const query = new URLSearchParams(location.search);
const { configuration, content, copies, active, initial } = createPriorityFixtureState(query);
const view = query.get('view') ?? 'company';
const pack = (query.get('pack') === 'arcana' ? 'arcana' : 'diagon-alley') as ContentPackId;
setContentPack(pack);
if (query.has('reduced')) localStorage.setItem('arcana-reduced-motion', 'true');
// Deliberately prolonged battle input for pause/skip observation. Not a campaign composition or reward.
const players = copies.slice(0, query.has('dense') ? 5 : 3).map((copy, index) => ({
  ...configuration.campaign.prepareOwned(copy),
  id: copy.copyId,
  hp: 350,
  maxHp: 350,
  mana: 100,
  maxMana: 100,
  power: 3,
  speed: 1,
  ...(index === 0 ? { beanUnitId: 'a89-battle-jar' } : {}),
}));
const rival = players.map((unit, i) => ({
  ...unit,
  id: `a89-rival-${i}`,
  beanUnitId: undefined,
  house: undefined,
  wizardId: i === 0 ? 'circe' : 'rival',
}));
const battle = new CombatEngine({ fromSeed: (seed) => new SeededRandom(seed) }).resolve({
  id: 'a89-battle',
  seed: 89,
  player: players,
  rival,
  rules: { ...content.combatRules, maxRounds: 3 },
});

declare global {
  interface Window {
    __a89: {
      read(): string;
      switchOwner(): void;
      acquireTarget(id: string, temporary?: boolean): void;
    };
  }
}
function Fixture() {
  const [game, setGame] = useState(initial),
    [language, setLanguage] = useState<Language>(query.get('lang') === 'en' ? 'en' : 'es');
  const motion = useReducedMotion(),
    reduced = motion.reduced;
  const [assignments, setAssignments] = useState<readonly BeanAssignment[]>([]);
  const [error, setError] = useState(''),
    [consultations, setConsultations] = useState(0),
    [forgeRequests, setForgeRequests] = useState(0),
    [returned, setReturned] = useState(false);
  document.documentElement.lang = language;
  const choose = async (choice: IntentionChoice | null) => {
    let changed = game;
    try {
      const use = new SetIntentionUseCase(
        {
          read: async () => changed,
          transact: async (_owner, change) => (changed = change(changed)),
        },
        () => ({
          ownedAffinities: content.campaign.ownedAffinities ?? {},
          beanPrice: 5,
          combatRules: content.combatRules,
        }),
      );
      const result = await use.execute(game.playerId, {
        key: `a89-intention-${game.revision}`,
        expectedRevision: game.revision,
        request: { afterRunId: 'a89-prior', choice },
      });
      setGame(result.state);
    } catch (failure) {
      setError(String(failure));
    }
  };
  window.__a89 = {
    read: () =>
      JSON.stringify({ game, assignments, consultations, forgeRequests, returned, battle, error }),
    switchOwner: () =>
      setGame((current) => ({
        ...current,
        playerId: current.playerId.endsWith('-a') ? 'a89-fixture-owner-b' : 'a89-fixture-owner-a',
      })),
    acquireTarget: (id, temporary = false) => {
      const wizard = content.catalog.wizards.find((w) => w.id === id)!;
      setGame((current) =>
        temporary
          ? {
              ...current,
              exploration: {
                ...current.exploration!,
                run: {
                  ...active,
                  members: [
                    ...active.members,
                    {
                      source: 'temporary',
                      unit: configuration.campaign.prepareOwned({
                        ...copies[0],
                        copyId: 'a89-temporary-target',
                        wizard,
                      }),
                    },
                  ],
                },
              },
            }
          : acquirePriorityFixtureCopy(
              current,
              wizard,
              content.catalog.version,
              content.toadTable.version,
            ),
      );
    },
  };
  const shellStyle = {
    ...Object.fromEntries(
      Object.entries(activePack.palette).map(([key, value]) => [
        '--pack-' + key.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase()),
        value,
      ]),
    ),
    '--scene-url': `url("${visualAsset(view === 'battle' ? 'scene.arena' : 'scene.alley')?.url}")`,
  } as CSSProperties;
  return (
    <ReadingScope owner={game.playerId}>
      <div
        className="arcana-shell game-shell"
        data-content-pack={pack}
        data-view={view === 'battle' ? 'battle' : 'map'}
        data-reduced={reduced}
        style={shellStyle}
      >
        <div className="game-world-backdrop" style={shellStyle} />
        {view !== 'battle' && (
          <header className="game-header">
            <h1 className="visually-hidden">A89 declared component fixtures</h1>
            <GameSettings
              language={language}
              onLanguage={setLanguage}
              reduced={reduced}
              ownReduced={motion.own}
              systemReduced={motion.system}
              onReduced={motion.change}
            />
          </header>
        )}
        <main id="content">
          <p className="visually-hidden">
            Declared fixture, no player account or economic server; not an earned collection or a
            campaign result.
          </p>
          {error && <p role="alert">{error}</p>}
          {view === 'guide' && (
            <ExpeditionGuide
              run={query.has('new') ? null : active}
              language={language}
              effectiveEssence={query.has('energy') ? 0 : 50}
              onPrepare={() => setConsultations((c) => c + 1)}
              onConsult={() => setConsultations((c) => c + 1)}
            />
          )}
          {view === 'company' && (
            <>
              <ExpeditionIntentions
                game={game}
                content={content}
                language={language}
                ready
                onChoose={(choice) => {
                  void choose(choice);
                }}
              />
              <IntentionReminder
                game={game}
                content={content}
                language={language}
                ready
                onCancel={() => {
                  void choose(null);
                }}
              />
            </>
          )}
          {view === 'beans' && (
            <>
              <BeanAssignments
                game={game}
                run={active}
                content={content}
                language={language}
                ready
                assignments={assignments}
                onChange={setAssignments}
              />
              <button type="button" data-qa-cancel-draft onClick={() => setAssignments([])}>
                QA cancel draft
              </button>
            </>
          )}
          {view === 'forge' && (
            <CommercePanel
              mode="workshop"
              content={content.commerce!}
              game={game}
              receipt={null}
              language={language}
              ready
              pending={false}
              error={null}
              onForge={() => setForgeRequests((c) => c + 1)}
              onVault={() => {
                throw Error('not in this fixture');
              }}
              onRecover={() => {}}
              connected
              onPrepare={() => setConsultations((c) => c + 1)}
              onLanguage={setLanguage}
              reduced={reduced}
              preparationContent={content}
            />
          )}
          {view === 'collection' && (
            <CollectionPanel
              game={game}
              catalog={content.catalog}
              content={content}
              language={language}
              onPrepare={() => setConsultations((c) => c + 1)}
            />
          )}
          {view === 'battle' && !returned && (
            <BattlePanel
              combat={battle}
              game={game}
              content={content}
              language={language}
              reduced={reduced}
              preferredIntention={{ kind: 'company', focus: 'house', house: 'gryffindor' }}
              onBack={() => setReturned(true)}
              settings={
                <GameSettings
                  language={language}
                  onLanguage={setLanguage}
                  reduced={reduced}
                  ownReduced={motion.own}
                  systemReduced={motion.system}
                  onReduced={motion.change}
                />
              }
            />
          )}
          {returned && <p data-qa-returned>QA returned · confirmed input retained</p>}
        </main>
      </div>
    </ReadingScope>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
