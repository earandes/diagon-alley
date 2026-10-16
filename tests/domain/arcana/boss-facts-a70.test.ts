import { afterEach, describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { bossPresentation } from '../../../src/arcana/presentation/boss-presentation';
import { bossBattleFacts } from '../../../src/arcana/presentation/boss-facts';
import { BossBattleFacts } from '../../../src/arcana/presentation/BossBattleFacts';
import { ExpeditionClosure } from '../../../src/arcana/presentation/ExpeditionClosure';
import {
  selectedContentPackId,
  setContentPack,
} from '../../../src/arcana/presentation/content-packs/active';
import type {
  BattleEvent,
  BattleEventData,
  Combat,
  CombatUnitInput,
} from '../../../src/arcana/domain/combat/engine';
import type { GameState } from '../../../src/arcana/application/game';
import type { NodeReceipt } from '../../../src/arcana/application/run-contracts';
import { campaignFixture, runInitial } from './support/run-fixtures';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';

// Declared presentation fixtures. They never execute a battle or grant inventory.
const initialPack = selectedContentPackId();
afterEach(() => setContentPack(initialPack));
const unit = (id: string, wizardId = 'rival'): CombatUnitInput => ({
  id,
  wizardId,
  level: 1,
  affinity: 'neutral',
  hp: 80,
  maxHp: 80,
  mana: 40,
  maxMana: 40,
  power: 6,
  speed: 5,
  wandPowerBonus: 0,
  wandMultiplier: 1,
  broomInitiative: 0,
});
const event = (data: BattleEventData, sequence: number): BattleEvent => ({
  ...data,
  sequence,
  round: sequence === 0 ? 0 : 1,
});
function battle(events: BattleEvent[] = []): Combat {
  const player = [unit('p1', 'apprentice'), unit('p2', 'rune-weaver'), unit('p3', 'circe')];
  const rival = [unit('r1', 'circe'), unit('r2'), unit('r3')];
  return {
    id: 'saved-battle',
    engineVersion: 1,
    outcome: 'player',
    rounds: 1,
    input: { id: 'saved-battle', seed: 7, player, rival, rules: campaignFixture().combatRules },
    player: player.map((u) => ({ ...u, effect: null })),
    rival: rival.map((u) => ({ ...u, hp: 0, effect: null })),
    events,
  };
}
function closed(combat: Combat | null, nodeId = 'boss'): GameState {
  const base = runInitial(),
    campaign = campaignFixture();
  const run = {
    id: 'closed',
    campaignVersion: 1,
    graphVersion: 1,
    graph: campaign.graph,
    zoneId: campaign.zoneId,
    status: 'won' as const,
    visited: [nodeId],
    members: base.copies.map((copy) => ({
      source: 'owned' as const,
      unit: campaign.prepareOwned(copy),
    })),
  };
  const receipt: NodeReceipt = {
    id: 'last-node',
    kind: 'advance-node',
    request: { runId: run.id, nodeId, campaignVersion: 1, assignments: [] },
    run,
    reward: { crowns: 50, goldKeys: 1, products: ['cacao-toad'] },
    firstVictory: true,
    battle: combat,
    encounter: null,
  };
  return {
    ...base,
    exploration: { run, victories: [], unlockedZones: ['bulevar'] },
    receipts: [receipt],
  };
}
const bean = (actorId = 'p1', sequence = 1) =>
  event({ kind: 'bean-activated', actorId, unitId: 'bean', flavour: 'soap', hp: 80 }, sequence);
const heal = (actorId = 'p2', amount = 3, sequence = 2) =>
  event({ kind: 'healed', actorId, amount, source: 'alchemy', hp: 60 }, sequence);
const synergy = (team: 'player' | 'rival' = 'player', sequence = 0) =>
  event(
    {
      kind: 'synergy-activated',
      team,
      affinity: 'alchemy',
      members: 3,
    },
    sequence,
  );

describe('A70 boss identity derives from the saved opponents, never generic victory art', () => {
  it('uses the first nominal opponent, including when it is not in slot zero', () => {
    setContentPack('diagon-alley');
    const opponents = [unit('r0'), unit('r1', 'storm-caller'), unit('r2', 'circe')];
    expect(bossPresentation(opponents, 'es')).toMatchObject({
      unit: opponents[1],
      index: 1,
      name: 'Nymphadora Tonks',
      figure: 'character.storm-caller.figure',
      portrait: 'character.storm-caller.portrait',
    });
  });
  it('keeps legacy pack position and uses its generic label instead of inventing a catalog identity', () => {
    setContentPack('diagon-alley');
    const legacy = [unit('r0'), unit('r1'), unit('r2')];
    expect(bossPresentation(legacy, 'en')).toMatchObject({
      unit: legacy[1],
      index: 1,
      name: 'Boss',
      figure: 'character.veil-walker.figure',
      portrait: 'character.veil-walker.figure',
    });
    expect(bossPresentation([], 'es')).toBeUndefined();
  });
  it('changes presentation language and pack without altering the opponents', () => {
    const opponents = battle().input.rival,
      before = JSON.stringify(opponents);
    setContentPack('diagon-alley');
    expect(bossPresentation(opponents, 'en')?.name).toBe('Hermione Granger');
    setContentPack('arcana');
    expect(bossPresentation(opponents, 'en')?.name).toBe('Circe');
    expect(JSON.stringify(opponents)).toBe(before);
  });
  it.each([
    ['discovery', 3, 'circe'],
    ['tactical', 4, 'storm-caller'],
    ['mastery', 5, 'circe'],
  ] as const)(
    'uses actual %s content with %i rivals without changing it',
    (challenge, count, leaderId) => {
      const { campaign } = trialConfiguration();
      const plan = campaign.challengeContent!(challenge, campaign.graph).find(
        (p) => p.kind === 'boss',
      );
      if (!plan || plan.kind !== 'boss') throw Error('Missing current boss content');
      const before = JSON.stringify(plan);
      expect(plan.opponents).toHaveLength(count);
      expect(bossPresentation(plan.opponents, 'en')?.unit.wizardId).toBe(leaderId);
      expect(JSON.stringify(plan)).toBe(before);
    },
  );
});

describe('A70 facts are bounded, honest projections of confirmed log entries', () => {
  it('selects one own bean and one positive own heal ahead of fallback synergy', () => {
    const combat = battle([synergy(), bean(), heal(), bean('p3', 3)]),
      before = JSON.stringify(combat);
    expect(bossBattleFacts(combat)).toEqual([
      { kind: 'bean', sequence: 1, actorId: 'p1', wizardId: 'apprentice', flavour: 'soap' },
      {
        kind: 'healing',
        sequence: 2,
        actorId: 'p2',
        wizardId: 'rune-weaver',
        source: 'alchemy',
        amount: 3,
      },
    ]);
    expect(JSON.stringify(combat)).toBe(before);
  });
  it('filters rival events, zero healing and actors absent from the saved player input', () => {
    expect(
      bossBattleFacts(
        battle([bean('r1'), heal('r2'), bean('absent'), heal('p1', 0), synergy('rival')]),
      ),
    ).toEqual([]);
  });
  it('uses actual player synergy as fallback and is stable through serialized recovery', () => {
    const combat = battle([synergy(), bean()]);
    expect(bossBattleFacts(combat)).toEqual([
      { kind: 'bean', sequence: 1, actorId: 'p1', wizardId: 'apprentice', flavour: 'soap' },
      { kind: 'synergy', sequence: 0, affinity: 'alchemy', members: 3 },
    ]);
    expect(bossBattleFacts(JSON.parse(JSON.stringify(combat)))).toEqual(bossBattleFacts(combat));
    expect(bossBattleFacts(battle())).toEqual([]);
    expect(bossBattleFacts(null)).toEqual([]);
  });
  it.each(['es', 'en'] as const)(
    'renders negative bean activation without efficacy claims or live announcements in %s',
    (language) => {
      const html = renderToStaticMarkup(
        createElement(BossBattleFacts, { combat: battle([bean(), heal()]), language }),
      );
      expect(html).toContain('data-boss-fact="bean"');
      expect(html).toContain(language === 'es' ? 'Jabón' : 'Soap');
      expect(html).toContain('+3');
      expect(html).not.toMatch(/aria-live|role="status"|gracias|decisiv|thanks|because|victory/i);
      expect(
        renderToStaticMarkup(createElement(BossBattleFacts, { combat: battle(), language })),
      ).toBe('');
    },
  );
});

for (const pack of ['diagon-alley', 'arcana'] as const)
  for (const language of ['es', 'en'] as const) {
    it(`A70 closure uses the saved ${pack}/${language} adversary and preserves outcome, treasure and actions`, () => {
      setContentPack(pack);
      const game = closed(battle([bean(), heal()])),
        before = JSON.stringify(game);
      const html = renderToStaticMarkup(
        createElement(ExpeditionClosure, {
          game,
          language,
          ready: true,
          onAction: () => {},
          onReplay: () => {},
          onMissions: () => {},
        }),
      );
      expect(html).toContain('data-closure-boss="circe"');
      expect(html).toContain(pack === 'diagon-alley' ? 'Hermione Granger' : 'Circe');
      expect(html).toContain('data-art="character.circe.figure"');
      expect(html).not.toContain('data-art="rival.boss.figure"');
      expect(html).toContain('data-boss-fact="bean"');
      expect(html.indexOf('closure-spoils')).toBeLessThan(html.indexOf('data-boss-facts'));
    expect(html.indexOf('closure-actions')).toBeLessThan(html.indexOf('data-boss-facts'));
      expect(html).toContain('data-closure-action="prepare"');
      expect(JSON.stringify(game)).toBe(before);
    });
  }
it('A70 closure does not fabricate adversary or facts for missing battle or non-boss ending', () => {
  for (const game of [closed(null), closed(battle([bean()]), 'duel')]) {
    const html = renderToStaticMarkup(
      createElement(ExpeditionClosure, {
        game,
        language: 'en',
        ready: true,
        onAction: () => {},
        onReplay: () => {},
        onMissions: () => {},
      }),
    );
    expect(html).not.toContain('data-closure-boss');
    expect(html).not.toContain('data-boss-fact');
    expect(html).not.toContain('data-art="rival.boss.figure"');
  }
});
it.each(['lost', 'draw'] as const)(
  'A70 %s retains actual adversary and facts without inventing victory treasure',
  (status) => {
    const combat = {
      ...battle([bean()]),
      outcome: status === 'lost' ? ('rival' as const) : ('draw' as const),
    };
    const base = closed(combat),
      oldReceipt = base.receipts[0] as NodeReceipt;
    const run = { ...base.exploration!.run!, status };
    const game = {
      ...base,
      exploration: { ...base.exploration!, run },
      receipts: [
        {
          ...oldReceipt,
          run,
          reward: { crowns: 0, goldKeys: 0, products: [] },
          firstVictory: null,
        },
      ],
    };
    const html = renderToStaticMarkup(
      createElement(ExpeditionClosure, {
        game,
        language: 'en',
        ready: true,
        onAction: () => {},
        onReplay: () => {},
        onMissions: () => {},
      }),
    );
    expect(html).toContain(`data-expedition-closure="${status}"`);
    expect(html).toContain('data-closure-boss="circe"');
    expect(html).toContain('data-boss-fact="bean"');
    expect(html).not.toContain('+50');
    expect(html).not.toContain('closure-key');
  },
);
it('A70 repeated victory does not turn a remembered opponent into a second prize', () => {
  const base = closed(battle([heal()])),
    oldReceipt = base.receipts[0] as NodeReceipt;
  const game = {
    ...base,
    receipts: [
      { ...oldReceipt, reward: { crowns: 5, goldKeys: 0, products: [] }, firstVictory: false },
    ],
  };
  const html = renderToStaticMarkup(
    createElement(ExpeditionClosure, {
      game,
      language: 'en',
      ready: true,
      onAction: () => {},
      onReplay: () => {},
      onMissions: () => {},
    }),
  );
  expect(html).toContain('Repeat victory');
  expect(html).toContain('data-boss-fact="healing"');
  expect(html).not.toContain('+50');
  expect(html).not.toContain('closure-key');
});
