import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { campaignFixture, runInitial } from './support/run-fixtures';
import type { Run } from '../../../src/arcana/domain/exploration/run';
// Renderer double: this test covers native action semantics, not Canvas or browser input.
vi.mock('../../../src/arcana/presentation/scenes/SceneCanvas', () => ({ SceneCanvas: () => null }));
import { MapPanel } from '../../../src/arcana/presentation/MapPanel';
it('pending operations disable available route actions while keeping locked consultation and visited protection', () => {
  const c = campaignFixture();
  const run: Run = {
    id: 'pending-map',
    campaignVersion: 1,
    graphVersion: 1,
    graph: c.graph,
    zoneId: c.zoneId,
    visited: ['duel'],
    status: 'active',
    members: [{ source: 'owned', unit: c.prepareOwned(runInitial().copies[0]) }],
  };
  const before = JSON.stringify(run);
  const render = (ready: boolean) =>
    renderToStaticMarkup(
      createElement(MapPanel, { run, ready, language: 'es', onSelect: () => {} }),
    );
  const button = (html: string, id: string) =>
    html.match(new RegExp(`<button(?=[^>]*data-node="${id}")[^>]*>`))![0];
  expect(button(render(false), 'refuge')).toContain('disabled=""');
  expect(button(render(true), 'refuge')).not.toContain('disabled=""');
  expect(button(render(false), 'chest')).not.toContain('disabled=""');
  expect(button(render(false), 'duel')).toContain('disabled=""');
  expect(JSON.stringify(run)).toBe(before);
});
