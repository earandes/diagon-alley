import { describe, expect, it } from 'vitest';
import {
  albumWindow,
  beanStockSelection,
  adjacentBeanId,
} from '../../../src/arcana/presentation/collection-supplies-model';

describe('A92 collection and supplies preserve identity while presentation adapts', () => {
  it('keeps the inspected spread represented when moving between four and eight cards', () => {
    const entries = Array.from({ length: 34 }, (_, i) => `wizard-${i}`);
    expect(albumWindow(entries, 12, 4)).toMatchObject({
      page: 3,
      pages: 9,
      entries: entries.slice(12, 16),
    });
    expect(albumWindow(entries, 12, 8)).toMatchObject({
      page: 1,
      pages: 5,
      entries: entries.slice(8, 16),
    });
    expect(albumWindow(entries, 12, 4).entries).toContain('wizard-12');
    expect(albumWindow(entries, 32, 8).entries).toEqual(entries.slice(32));
  });
  it('clamps shrinking and empty filters without replacing identities', () => {
    expect(albumWindow(['historical'], 32, 8)).toMatchObject({
      page: 0,
      pages: 1,
      entries: ['historical'],
    });
    expect(albumWindow([], 32, 4)).toMatchObject({ page: 0, pages: 1, entries: [] });
  });
  it.each([0, 1, 3, 30, 100])(
    'selects a concrete unit from stock %i without mutating stock',
    (count) => {
      const jars = Array.from({ length: count }, (_, i) => ({ id: `jar-${i}` }));
      const before = JSON.stringify(jars);
      expect(beanStockSelection(jars, null)).toEqual({
        id: count ? 'jar-0' : null,
        index: count ? 0 : -1,
        count,
      });
      if (count) {
        expect(beanStockSelection(jars, `jar-${count - 1}`).id).toBe(`jar-${count - 1}`);
        expect(adjacentBeanId(jars, `jar-${count - 1}`, 1)).toBe(`jar-${count - 1}`);
        expect(adjacentBeanId(jars, 'jar-0', -1)).toBe('jar-0');
      }
      expect(JSON.stringify(jars)).toBe(before);
    },
  );
  it('retains a selected jar when another jar disappears; invalid selections explicitly fall back', () => {
    expect(beanStockSelection([{ id: 'a' }, { id: 'c' }], 'c')).toEqual({
      id: 'c',
      index: 1,
      count: 2,
    });
    expect(beanStockSelection([{ id: 'a' }], 'c').id).toBe('a');
    expect(adjacentBeanId([{ id: 'a' }, { id: 'c' }], 'a', 1)).toBe('c');
    expect(adjacentBeanId([], null, 1)).toBeNull();
  });
});

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BeanAssignments } from '../../../src/arcana/presentation/BeanAssignments';
import { CollectionPanel } from '../../../src/arcana/presentation/CollectionPanel';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
import { projectPublicContent } from '../../../src/arcana/application/public-content';
import { runInitial, campaignFixture } from './support/run-fixtures';
import type { Run } from '../../../src/arcana/domain/exploration/run';
import { assignBean } from '../../../src/arcana/presentation/contextual-preparation';

const config = trialConfiguration();
const content = projectPublicContent(config.opening, config.campaign);
for (const language of ['es', 'en'] as const) {
  it(`A92 renders one object for 100 jars with concrete carrier and fallen state in ${language}`, () => {
    const game = runInitial();
    const state = {
      ...game,
      inventory: {
        ...game.inventory,
        products: Array.from({ length: 100 }, (_, i) => ({
          id: `jar-${i}`,
          kind: 'random-beans' as const,
          status: 'available' as const,
        })),
      },
    };
    const campaign = campaignFixture();
    const run: Run = {
      id: 'a92-run',
      status: 'active',
      campaignVersion: 1,
      graphVersion: 1,
      zoneId: campaign.zoneId,
      graph: campaign.graph,
      visited: [],
      members: game.copies.map((copy, i) => ({
        source: i === 2 ? 'temporary' : 'owned',
        unit: { ...campaign.prepareOwned(copy), hp: i === 1 ? 0 : 20 },
      })),
    };
    const before = JSON.stringify(state);
    const assignments = assignBean([], 'jar-99', 'copy2');
    const html = renderToStaticMarkup(
      createElement(BeanAssignments, {
        game: state,
        content,
        run,
        language,
        ready: true,
        assignments,
        onChange: () => {
          throw Error('Consultation must not emit a command');
        },
      }),
    );
    expect(html.match(/class="bean-stock-jar"/g) ?? []).toHaveLength(1);
    expect(html.match(/class="bean-stock-page"/g) ?? []).toHaveLength(2);
    expect(html).toContain('data-bean-stock="100"');
    expect(html).toContain(language === 'es' ? 'Tarro 100 · puesto 3' : 'Jar 100 · position 3');
    expect(html).toContain('data-bean-unit="copy1" aria-pressed="false"');
    expect(html).toContain(language === 'es' ? 'Caído' : 'Fallen');
    expect(JSON.stringify(state)).toBe(before);
    expect(assignBean(assignments, 'jar-99', 'copy2')).toEqual([]);
  });
}

it('A92 can show 34 identities and 30 duplicate copies without leaking undiscovered identities or counting copies as identities', () => {
  const initial = runInitial();
  const wizard = content.catalog.wizards[0];
  const copies = Array.from({ length: 30 }, (_, i) => ({
    copyId: `a92-copy-${i}`,
    sourceId: `a92-source-${i}`,
    catalogVersion: content.catalog.version,
    origin: 'toad' as const,
    wizard:
      i === 0 ? { ...wizard, finish: { id: 'enchanted' as const, version: 1 as const } } : wizard,
  }));
  const html = renderToStaticMarkup(
    createElement(CollectionPanel, {
      game: { ...initial, copies },
      catalog: content.catalog,
      content,
      language: 'es',
    }),
  );
  expect(html).toContain('max="34"');
  expect(html).toContain('value="1"');
  expect(html).toContain('30 copias guardadas');
  expect(html).not.toContain('character.dragon.portrait');
  expect(html.match(/data-collection-id=/g) ?? []).toHaveLength(4);
});

it('A92 archived identities retain a full card back when their portrait no longer has an asset', () => {
  const state = runInitial();
  const archived = {
    ...state.copies[0],
    copyId: 'a92-archived-copy',
    wizard: { ...state.copies[0].wizard, id: 'a92-missing-portrait' },
  };
  const html = renderToStaticMarkup(
    createElement(CollectionPanel, {
      game: { ...state, copies: [archived] },
      catalog: content.catalog,
      content,
      language: 'es',
    }),
  );
  const article =
    html.split('data-collection-id="a92-missing-portrait"')[1]?.split('</article>')[0] ?? '';
  expect(article.includes('class="card-portrait"')).toBe(true);
  expect(article.includes('data-art="card.back"')).toBe(true);
  expect(article.includes('Archivo')).toBe(true);
  expect(html).toContain('Archivo: 1 identidad</p>');
});
