import { expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { runSnapshot, type Run } from '../../src/arcana/domain/exploration/run';
import { readGame } from '../browser-trial/route-helpers';

/** Declared isolated server-state fixture, not a promise every random first route wins.
 * Fix only the unvisited graph/node plans to a declared seed0 fixture. Stats and inventory
 * stay unchanged; opponents come from its versioned configuration. Subsequent commands use
 * the real authority. Never rewrite historical receipts. */
export async function fixedRouteFixture(
  page: Page,
  owner: string,
  definition = new URL('./fixtures/a85-route-seed0.json', import.meta.url),
) {
  if (process.platform !== 'linux') throw Error('Declared graph fixture is CI Linux only');
  const state = await readGame(page),
    run = state.exploration!.run!;
  expect(state.playerId).toBe(owner);
  expect(run.visited).toEqual([]);
  expect(run.status).toBe('active');
  // Plain JSON read avoids importing Vite's JSON modules through Node's browser-test loader.
  // A domain test compares every graph/node plan with the current campaign configuration.
  const fixture = JSON.parse(await readFile(definition, 'utf8')) as {
    version: number;
    campaignVersion: number;
    tacticalVersion?: number;
    graph: Run['graph'];
    nodes: NonNullable<Run['campaignSnapshot']>['nodes'];
  };
  expect(fixture.version).toBe(1);
  expect(run.campaignVersion).toBe(fixture.campaignVersion);
  expect(run.challenge ?? 'discovery').toBe('discovery');
  if (fixture.tacticalVersion !== undefined)
    expect(run.tacticalVersion).toBe(fixture.tacticalVersion);
  const graph = fixture.graph;
  const fixed = runSnapshot({
    ...run,
    graph,
    graphVersion: graph.version,
    routeGeneration: { version: 1, seed: 0 },
    campaignSnapshot: {
      ...run.campaignSnapshot!,
      graph,
      nodes: fixture.nodes,
    },
  });
  const pool = new Pool({
    host: '127.0.0.1',
    port: 55432,
    user: 'arcana_dev',
    password: 'arcana-local-development',
    database: 'arcana_dev',
    max: 1,
  });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const locked = await client.query(
      'SELECT revision FROM arcana_accounts WHERE player_id=$1 FOR UPDATE',
      [owner],
    );
    expect(Number(locked.rows[0].revision)).toBe(state.revision);
    const changed = await client.query(
      'UPDATE arcana_exploration SET run_state=$1::jsonb WHERE player_id=$2 AND run_id=$3',
      [JSON.stringify(fixed), owner, run.id],
    );
    expect(changed.rowCount).toBe(1);
    await client.query('UPDATE arcana_accounts SET revision=revision+1 WHERE player_id=$1', [
      owner,
    ]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
  // Refresh through the real controller without resetting performance.timeOrigin.
  const response = page.waitForResponse(
    (reply) => new URL(reply.url()).pathname === '/api/state' && reply.request().method() === 'GET',
  );
  const refresh = page.getByRole('button', {
    name: /^(Actualizar (Energía|Esencia)|Refresh (Energy|Essence))$/,
    exact: true,
  });
  await refresh.click();
  await response;
  await expect(refresh).toBeEnabled();
  await expect(page.locator('.branch-map')).toBeVisible();
}
