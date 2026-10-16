import { readFile } from 'node:fs/promises';
import type { Pool, PoolClient } from 'pg';
import {
  gameSnapshot,
  validateGame,
  type GameState,
  type PlayerAccounts,
} from '../../application/game';
import type { OwnedWizard } from '../../domain/collection/wizards';
import type { ProductUnit } from '../../domain/economy/inventory';
import { ArcanaError } from '../../domain/errors';
import { validDomainId } from '../../domain/identifiers';
import type { Run } from '../../domain/exploration/run';
import type { Equipment } from '../../domain/economy/equipment';
import type { ExpeditionIntention } from '../../domain/exploration/intentions';

export async function applyGameSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'));
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

interface TransactionFaults {
  /** Test-only faults around the actual SQL commit, absent in normal composition. */
  readonly beforeCommit?: () => void;
  readonly afterCommit?: () => void;
}

async function loadGame(client: PoolClient, playerId: string, lock: boolean): Promise<GameState> {
  if (!validDomainId(playerId)) throw new ArcanaError('PLAYER_NOT_FOUND');
  const account = await client.query<{ revision: string }>(
    `SELECT revision FROM arcana_accounts WHERE player_id=$1${lock ? ' FOR UPDATE' : ''}`,
    [playerId],
  );
  if (!account.rowCount) throw new ArcanaError('PLAYER_NOT_FOUND');
  const inventory = await client.query<{
    crowns: string;
    gold_keys: string;
    essence_points: number;
    essence_cursor: string;
  }>(
    'SELECT crowns, gold_keys, essence_points, essence_cursor FROM arcana_inventory WHERE player_id=$1',
    [playerId],
  );
  const units = await client.query<{
    unit_id: string;
    kind: ProductUnit['kind'];
    status: ProductUnit['status'];
    operation_id: string | null;
  }>(
    'SELECT unit_id, kind, status, operation_id FROM arcana_product_units WHERE player_id=$1 ORDER BY ordinal',
    [playerId],
  );
  const copies = await client.query<{
    copy_id: string;
    wizard_id: string;
    wizard_snapshot: OwnedWizard['wizard'];
    catalog_version: number;
    source_id: string;
    origin: OwnedWizard['origin'];
  }>(
    'SELECT copy_id, wizard_id, wizard_snapshot, catalog_version, source_id, origin FROM arcana_wizard_copies WHERE player_id=$1 ORDER BY ordinal',
    [playerId],
  );
  const receipts = await client.query<{
    operation_id: string;
    receipt: GameState['receipts'][number];
  }>('SELECT operation_id, receipt FROM arcana_operations WHERE player_id=$1 ORDER BY ordinal', [
    playerId,
  ]);
  const exploration = await client.query<{
    run_id: string | null;
    run_state: Run | null;
    intention: ExpeditionIntention | null;
  }>('SELECT run_id, run_state, intention FROM arcana_exploration WHERE player_id=$1', [playerId]);
  const victories = await client.query<{ level_id: string; campaign_version: number }>(
    'SELECT level_id, campaign_version FROM arcana_victories WHERE player_id=$1 ORDER BY ordinal',
    [playerId],
  );
  const zones = await client.query<{ zone_id: string }>(
    'SELECT zone_id FROM arcana_unlocked_zones WHERE player_id=$1 ORDER BY ordinal',
    [playerId],
  );
  const equipment = await client.query<{
    equipment_id: string;
    kind: Equipment['kind'];
    definition_version: number;
    equipment_snapshot: Equipment;
  }>(
    'SELECT equipment_id,kind,definition_version,equipment_snapshot FROM arcana_equipment WHERE player_id=$1 ORDER BY ordinal',
    [playerId],
  );
  const team = await client.query<{ copy_id: string }>(
    'SELECT copy_id FROM arcana_team_members WHERE player_id=$1 ORDER BY ordinal',
    [playerId],
  );
  const loadouts = await client.query<{
    copy_id: string;
    wand_id: string | null;
    broom_id: string | null;
  }>(
    'SELECT copy_id,wand_id,broom_id FROM arcana_team_loadouts WHERE player_id=$1 ORDER BY ordinal',
    [playerId],
  );
  if (
    !inventory.rowCount ||
    copies.rows.some((copy) => copy.wizard_id !== copy.wizard_snapshot.id) ||
    receipts.rows.some((row) => row.operation_id !== row.receipt.id) ||
    equipment.rows.some(
      (row) =>
        row.equipment_id !== row.equipment_snapshot.id ||
        row.kind !== row.equipment_snapshot.kind ||
        row.definition_version !== row.equipment_snapshot.version,
    ) ||
    exploration.rows.some((row) => row.run_id !== (row.run_state?.id ?? null)) ||
    (!exploration.rowCount && (victories.rowCount || zones.rowCount))
  )
    throw new ArcanaError('INVALID_GAME');
  const row = inventory.rows[0];
  return gameSnapshot({
    schemaVersion: 1,
    playerId,
    revision: Number(account.rows[0].revision),
    inventory: {
      crowns: Number(row.crowns),
      goldKeys: Number(row.gold_keys),
      essence: { points: row.essence_points, cursor: Number(row.essence_cursor) },
      products: units.rows.map((unit) => ({
        id: unit.unit_id,
        kind: unit.kind,
        status: unit.status,
        ...(unit.operation_id === null ? {} : { operationId: unit.operation_id }),
      })),
      equipment: equipment.rows.map((row) => row.equipment_snapshot),
    },
    copies: copies.rows.map((copy) => ({
      copyId: copy.copy_id,
      wizard: copy.wizard_snapshot,
      catalogVersion: copy.catalog_version,
      sourceId: copy.source_id,
      origin: copy.origin,
    })),
    receipts: receipts.rows.map((row) => row.receipt),
    team: {
      copyIds: team.rows.map((row) => row.copy_id),
      loadouts: loadouts.rows.map((row) => ({
        copyId: row.copy_id,
        wandId: row.wand_id,
        broomId: row.broom_id,
      })),
    },
    ...(exploration.rowCount
      ? {
          exploration: {
            run: exploration.rows[0].run_state,
            ...(exploration.rows[0].intention === null
              ? {}
              : { intention: exploration.rows[0].intention }),
            victories: victories.rows.map((v) => ({
              levelId: v.level_id,
              version: v.campaign_version,
            })),
            unlockedZones: zones.rows.map((z) => z.zone_id),
          },
        }
      : {}),
  });
}

async function writeGame(client: PoolClient, state: GameState): Promise<void> {
  validateGame(state);
  await client.query('UPDATE arcana_accounts SET revision=$2 WHERE player_id=$1', [
    state.playerId,
    state.revision,
  ]);
  await client.query(
    `INSERT INTO arcana_inventory (player_id,crowns,essence_points,essence_cursor,gold_keys) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (player_id) DO UPDATE SET crowns=$2,essence_points=$3,essence_cursor=$4,gold_keys=$5`,
    [
      state.playerId,
      state.inventory.crowns,
      state.inventory.essence.points,
      state.inventory.essence.cursor,
      state.inventory.goldKeys ?? 0,
    ],
  );
  // All aggregate replacement writes stay in this tx. Optimize deltas only after measuring real workloads.
  for (const table of [
    'arcana_team_members',
    'arcana_team_loadouts',
    'arcana_equipment',
    'arcana_product_units',
    'arcana_wizard_copies',
    'arcana_operations',
    'arcana_exploration',
    'arcana_victories',
    'arcana_unlocked_zones',
  ])
    await client.query(`DELETE FROM ${table} WHERE player_id=$1`, [state.playerId]);
  for (const [ordinal, unit] of state.inventory.products.entries())
    await client.query(
      'INSERT INTO arcana_product_units (player_id,unit_id,kind,status,operation_id,ordinal) VALUES ($1,$2,$3,$4,$5,$6)',
      [state.playerId, unit.id, unit.kind, unit.status, unit.operationId ?? null, ordinal],
    );
  for (const [ordinal, copy] of state.copies.entries())
    await client.query(
      `INSERT INTO arcana_wizard_copies (player_id,copy_id,wizard_id,catalog_version,wizard_snapshot,source_id,origin,ordinal)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        state.playerId,
        copy.copyId,
        copy.wizard.id,
        copy.catalogVersion,
        JSON.stringify(copy.wizard),
        copy.sourceId,
        copy.origin,
        ordinal,
      ],
    );
  for (const [ordinal, item] of (state.inventory.equipment ?? []).entries())
    await client.query(
      'INSERT INTO arcana_equipment (player_id,equipment_id,kind,definition_version,equipment_snapshot,ordinal) VALUES ($1,$2,$3,$4,$5,$6)',
      [state.playerId, item.id, item.kind, item.version, JSON.stringify(item), ordinal],
    );
  for (const [ordinal, copyId] of (state.team?.copyIds ?? []).entries())
    await client.query(
      'INSERT INTO arcana_team_members (player_id,copy_id,ordinal) VALUES ($1,$2,$3)',
      [state.playerId, copyId, ordinal],
    );
  for (const [ordinal, loadout] of (state.team?.loadouts ?? []).entries())
    await client.query(
      'INSERT INTO arcana_team_loadouts (player_id,copy_id,wand_id,broom_id,ordinal) VALUES ($1,$2,$3,$4,$5)',
      [state.playerId, loadout.copyId, loadout.wandId, loadout.broomId, ordinal],
    );
  for (const [ordinal, receipt] of state.receipts.entries())
    await client.query(
      'INSERT INTO arcana_operations (player_id,operation_id,receipt,ordinal) VALUES ($1,$2,$3,$4)',
      [state.playerId, receipt.id, JSON.stringify(receipt), ordinal],
    );
  if (state.exploration) {
    const { run, victories, unlockedZones } = state.exploration;
    await client.query(
      'INSERT INTO arcana_exploration (player_id,run_id,run_state,intention) VALUES ($1,$2,$3,$4)',
      [
        state.playerId,
        run?.id ?? null,
        run === null ? null : JSON.stringify(run),
        state.exploration.intention ? JSON.stringify(state.exploration.intention) : null,
      ],
    );
    for (const [ordinal, victory] of victories.entries())
      await client.query(
        'INSERT INTO arcana_victories (player_id,level_id,campaign_version,ordinal) VALUES ($1,$2,$3,$4)',
        [state.playerId, victory.levelId, victory.version, ordinal],
      );
    for (const [ordinal, zoneId] of unlockedZones.entries())
      await client.query(
        'INSERT INTO arcana_unlocked_zones (player_id,zone_id,ordinal) VALUES ($1,$2,$3)',
        [state.playerId, zoneId, ordinal],
      );
  }
}

export class PostgresGameTransactions implements PlayerAccounts {
  constructor(
    private readonly pool: Pool,
    private readonly faults: TransactionFaults = {},
  ) {}

  async create(initial: GameState): Promise<GameState> {
    const snapshot = gameSnapshot(initial);
    return this.transaction(async (client) => {
      const inserted = await client.query(
        'INSERT INTO arcana_accounts (player_id,revision) VALUES ($1,$2) ON CONFLICT (player_id) DO NOTHING RETURNING player_id',
        [snapshot.playerId, snapshot.revision],
      );
      if (!inserted.rowCount) return loadGame(client, snapshot.playerId, true);
      await writeGame(client, snapshot);
      return snapshot;
    });
  }

  async read(playerId: string): Promise<GameState> {
    // A repeatable-read snapshot prevents mixed tables if another tx commits mid-load.
    return this.transaction((client) => loadGame(client, playerId, false), true);
  }

  async transact(playerId: string, change: (current: GameState) => GameState): Promise<GameState> {
    return this.transaction(async (client) => {
      const current = await loadGame(client, playerId, true);
      const next = change(current);
      validateGame(next);
      if (next.playerId !== playerId) throw new ArcanaError('PLAYER_MISMATCH');
      if (next !== current && next.revision !== current.revision + 1)
        throw new ArcanaError('STALE_GAME');
      if (next !== current) await writeGame(client, next);
      return gameSnapshot(next);
    });
  }

  private async transaction(
    work: (client: PoolClient) => Promise<GameState>,
    readOnly = false,
  ): Promise<GameState> {
    let client: PoolClient;
    try {
      client = await this.pool.connect();
    } catch {
      throw new ArcanaError('STORAGE');
    }
    let commitAttempted = false;
    try {
      await client.query(readOnly ? 'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY' : 'BEGIN');
      const result = await work(client);
      if (!readOnly) this.faults.beforeCommit?.();
      commitAttempted = true;
      await client.query('COMMIT');
      if (!readOnly) this.faults.afterCommit?.();
      return result;
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch {
        /* Original commit uncertainty still needs recovery. */
      }
      if (commitAttempted) throw new ArcanaError('UNKNOWN_COMMIT');
      if (error instanceof ArcanaError) throw error;
      throw new ArcanaError('STORAGE');
    } finally {
      client.release();
    }
  }
}
