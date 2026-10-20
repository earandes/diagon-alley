import { describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { collectionCompletion } from '../../../src/arcana/application/client/collection-completion';
import { vaultGuidance } from '../../../src/arcana/application/client/vault-guidance';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import { acquireWizard } from '../../../src/arcana/domain/collection/wizards';
import { runInitial } from './support/run-fixtures';
import { campaignFixture } from './support/run-fixtures';
import { validateRun, type Run } from '../../../src/arcana/domain/exploration/run';
import { JourneyCabinet } from '../../../src/arcana/presentation/JourneyCabinet';
import { CommercePanel } from '../../../src/arcana/presentation/CommercePanel';
import {
  selectedContentPackId,
  setContentPack,
} from '../../../src/arcana/presentation/content-packs/active';

const configuration = trialConfiguration();
const content = projectPublicContent(configuration.opening, configuration.campaign);
const catalog = content.catalog;
const starter = catalog.wizards.find(
  (w) => !content.toadTable.entries.some((e) => e.wizardId === w.id),
)!;
const boss = content.campaign.nodes!.find((node) => node.kind === 'boss')!;
const won = () => ({
  ...runInitial(),
  inventory: { ...runInitial().inventory, goldKeys: 0 },
  exploration: {
    run: null,
    victories: [
      { levelId: boss.kind === 'boss' ? boss.levelId : '', version: content.campaign.version },
    ],
    unlockedZones: [content.campaign.zoneId, content.campaign.nextZoneId],
  },
});

describe('A92 one current collection universe and a separate archive', () => {
  it.each([30, 34])(
    'counts %i current identities without letting old copies inflate completion',
    (size) => {
      const current = { ...catalog, wizards: catalog.wizards.slice(0, size) };
      const old = { ...catalog.wizards[0], id: 'archived:wizard' };
      let copies = acquireWizard([], 'old', old, 1, 'old-source', 'toad');
      for (const [index, wizard] of current.wizards.entries())
        copies = acquireWizard(
          copies,
          `copy:${index}`,
          wizard,
          current.version,
          `source:${index}`,
          'toad',
        );
      copies = acquireWizard(
        copies,
        'duplicate',
        { ...current.wizards[0], finish: { id: 'enchanted', version: 1 } },
        current.version,
        'extra',
        'toad',
      );
      const before = JSON.stringify(copies);
      const result = collectionCompletion(current, copies);
      expect(result.current).toEqual({ discovered: size, total: size, ratio: 1 });
      expect(result.historical).toEqual({ discovered: 1, total: 1 });
      expect(result.obtainable).toBe(null);
      expect(JSON.stringify(copies)).toBe(before);
    },
  );
  it('keeps starter in the base universe although it is not in the opening table', () => {
    const copies = acquireWizard([], 'starter-copy', starter, catalog.version, 'kit', 'starter');
    expect(collectionCompletion(catalog, copies, content.toadTable)).toMatchObject({
      current: { discovered: 1, total: 34 },
      obtainable: { discovered: 0, total: 33 },
      historical: { discovered: 0, total: 0 },
    });
  });
  it('does not count temporary allies, seasonal keepsakes or a missing table as owned discoveries', () => {
    expect(collectionCompletion(catalog, []).current).toEqual({
      discovered: 0,
      total: 34,
      ratio: 0,
    });
    expect(
      collectionCompletion(catalog, [], { ...content.toadTable, catalogVersion: 999 }).obtainable,
    ).toBe(null);
  });
});

describe('A92 key guidance uses stock and first-victory rights', () => {
  it('offers the boss only while its first key can still be obtained', () => {
    expect(
      vaultGuidance(
        { ...runInitial(), inventory: { ...runInitial().inventory, goldKeys: 0 } },
        content,
      ).status,
    ).toBe('source');
    expect(vaultGuidance(won(), content)).toMatchObject({ status: 'unavailable', opened: false });
    expect(vaultGuidance(won(), content, true)).toMatchObject({
      status: 'unavailable',
      opened: true,
    });
  });
  it('prioritizes a possessed key, never infers a visit from zero keys, and remains conservative without content', () => {
    expect(
      vaultGuidance({ ...won(), inventory: { ...won().inventory, goldKeys: 1 } }, content).status,
    ).toBe('ready');
    expect(vaultGuidance(won())).toMatchObject({ status: 'unknown', opened: false });
    expect(vaultGuidance({ ...won(), exploration: undefined }, content)).toMatchObject({
      status: 'source',
      opened: false,
    });
  });
  it('does not promise another key from a historical snapshot whose right was already claimed', () => {
    const prior = { ...content, campaign: { ...content.campaign, version: 7 } };
    const game = {
      ...won(),
      exploration: {
        ...won().exploration,
        victories: [
          ...won().exploration.victories,
          { levelId: boss.kind === 'boss' ? boss.levelId : '', version: 7 },
        ],
      },
    };
    const before = JSON.stringify(game);
    expect(vaultGuidance(game, prior).status).toBe('unavailable');
    expect(JSON.stringify(game)).toBe(before);
  });
  it('uses only reachable historical nodes, without reading receipts or inventing rights for another branch', () => {
    const campaign = campaignFixture();
    const graph = {
      version: 8,
      nodes: [
        { id: 'root', kind: 'pact' as const, row: 0, next: ['left', 'right'] },
        { id: 'left', kind: 'refuge' as const, row: 1, next: ['left-boss'] },
        { id: 'right', kind: 'refuge' as const, row: 1, next: ['right-boss'] },
        { id: 'left-boss', kind: 'boss' as const, row: 2, next: [] },
        { id: 'right-boss', kind: 'boss' as const, row: 2, next: [] },
      ],
    };
    const rival = campaign.nodes.find((node) => node.kind === 'boss')!;
    if (rival.kind !== 'boss') throw Error('fixture');
    const snapshot = {
      ...campaign,
      version: 8,
      graph,
      nodes: [
        {
          nodeId: 'root',
          kind: 'pact' as const,
          recruit: campaign.prepareOwned(runInitial().copies[0]),
        },
        { nodeId: 'left', kind: 'refuge' as const },
        { nodeId: 'right', kind: 'refuge' as const },
        {
          ...rival,
          nodeId: 'left-boss',
          levelId: 'old:left',
          reward: { crowns: 0, goldKeys: 0, products: [] },
        },
        {
          ...rival,
          nodeId: 'right-boss',
          levelId: 'old:right',
          reward: { crowns: 0, goldKeys: 1, products: [] },
        },
      ],
    };
    const run: Run = {
      id: 'old-run',
      zoneId: campaign.zoneId,
      campaignVersion: 8,
      tacticalVersion: 1,
      graphVersion: 8,
      graph,
      status: 'active',
      visited: ['root'],
      campaignSnapshot: snapshot,
      members: runInitial().copies.map((copy) => ({
        source: 'owned',
        unit: campaign.prepareOwned(copy),
      })),
    };
    const game = {
      ...won(),
      exploration: { ...won().exploration, run, unlockedZones: [campaign.zoneId] },
    };
    validateRun(run);
    Object.defineProperty(game, 'receipts', {
      get: () => {
        throw Error('history must not be scanned');
      },
    });
    expect(vaultGuidance(game, content).status).toBe('source');
    const chosenLeft: Run = { ...run, visited: ['root', 'left'] };
    expect(
      vaultGuidance({ ...won(), exploration: { ...game.exploration, run: chosenLeft } }, content)
        .status,
    ).toBe('unavailable');
    const legacy: Run = { ...run, campaignSnapshot: undefined, tacticalVersion: undefined };
    validateRun(legacy);
    expect(
      vaultGuidance({ ...won(), exploration: { ...game.exploration, run: legacy } }, content)
        .status,
    ).toBe('unknown');
  });
  it.each([
    ['es', 'diagon-alley'],
    ['en', 'diagon-alley'],
    ['es', 'arcana'],
    ['en', 'arcana'],
  ] as const)(
    'shows the shared total and a viable vault continuation in %s / %s',
    (language, pack) => {
      const originalPack = selectedContentPackId();
      setContentPack(pack);
      vi.stubGlobal('matchMedia', () => ({ matches: true }));
      const game = won();
      const journey = renderToStaticMarkup(
        createElement(JourneyCabinet, {
          game,
          content,
          language,
          onMap: vi.fn(),
          onCollection: vi.fn(),
          onShop: vi.fn(),
          onVault: vi.fn(),
        }),
      );
      expect(journey).toContain('/34');
      expect(journey).not.toContain('/30');
      const vault = renderToStaticMarkup(
        createElement(CommercePanel, {
          mode: 'vault',
          content: content.commerce!,
          preparationContent: content,
          game,
          receipt: null,
          language,
          ready: true,
          pending: false,
          error: null,
          connected: true,
          onForge: vi.fn(),
          onVault: vi.fn(),
          onRecover: vi.fn(),
          onPrepare: vi.fn(),
          onLanguage: vi.fn(),
          onMap: vi.fn(),
        }),
      );
      expect(vault).not.toContain(language === 'es' ? 'al vencer a un jefe' : 'defeating a boss');
      expect(vault).toContain(
        language === 'es' ? 'Preparar otra expedición' : 'Prepare another expedition',
      );
      setContentPack(originalPack);
    },
  );
});
