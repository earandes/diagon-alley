import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { ScryptPasswords } from '../../src/arcana/infrastructure/identity/passwords.ts';

/**
 * Destructive operations are confined to two internally named, newly created databases.
 * Never accepts an existing source/target database, player ID, credential or dump as input.
 * Run serially after the project's PostgreSQL is healthy. No browser/Redis/global configuration.
 */
const suffix = randomUUID().replaceAll('-', '');
const sourceName = `a76_backup_${suffix}`;
const targetName = `a76_restore_${suffix}`;
const tools = process.env.A76_PG_TOOLS ?? (process.platform === 'darwin' ? 'compose' : 'native');
if (!['compose', 'native'].includes(tools)) throw Error('A76_PG_TOOLS must be compose or native');
const connection = {
  host: '127.0.0.1',
  port: 55432,
  user: 'arcana_dev',
  password: 'arcana-local-development',
  connectionTimeoutMillis: 3000,
  max: 1,
};
const admin = new Pool({ ...connection, database: 'arcana_dev' });
const source = new Pool({ ...connection, database: sourceName });
const target = new Pool({ ...connection, database: targetName });
const owned = new Set();
const fixturePassword = `A76 backup fixture ${randomUUID()}`;
const passwords = new ScryptPasswords();

function command(tool, database, extra, input) {
  const args =
    tools === 'compose'
      ? [
          'compose',
          '-f',
          'compose.arcana.yml',
          'exec',
          '-T',
          'postgres',
          tool,
          '-U',
          'arcana_dev',
          '-d',
          database,
          ...extra,
        ]
      : [
          '-h',
          connection.host,
          '-p',
          String(connection.port),
          '-U',
          connection.user,
          '-d',
          database,
          ...extra,
        ];
  return new Promise((resolve, reject) => {
    const child = spawn(tools === 'compose' ? 'docker' : tool, args, {
      cwd: new URL('../../', import.meta.url),
      env: { ...process.env, PGPASSWORD: connection.password },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const output = [];
    let bytes = 0;
    const stop = setTimeout(() => child.kill('SIGTERM'), 30000);
    child.stdout.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > 16 * 1024 * 1024) child.kill('SIGTERM');
      else output.push(chunk);
    });
    // No raw dump, password, challenge token or mail content goes into logs.
    child.stderr.resume();
    child.on('error', (error) => {
      clearTimeout(stop);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(stop);
      if (code !== 0)
        reject(Error(`${tool} failed (exit ${code}); isolated databases will be removed`));
      else resolve(Buffer.concat(output));
    });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}

async function createOwned(name) {
  assert.match(name, /^a76_(backup|restore)_[a-f0-9]{32}$/);
  await admin.query(`CREATE DATABASE "${name}" TEMPLATE template0`);
  owned.add(name);
}

async function snapshot(pool) {
  const tables = await pool.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name`,
  );
  const result = {};
  for (const { table_name: table } of tables.rows) {
    assert.match(table, /^arcana_[a-z_]+$/);
    result[table] = (
      await pool.query(
        `SELECT row_to_json(t) AS record FROM "${table}" t ORDER BY row_to_json(t)::text`,
      )
    ).rows.map(({ record }) => record);
  }
  return result;
}

async function populate() {
  const gameSchema = await readFile(
    new URL('../../src/arcana/infrastructure/postgres/schema.sql', import.meta.url),
    'utf8',
  );
  const identitySchema = await readFile(
    new URL('../../src/arcana/infrastructure/identity/schema.sql', import.meta.url),
    'utf8',
  );
  await source.query(gameSchema);
  await source.query(identitySchema);
  const player = `backup-${suffix}`;
  const email = `a76-backup-${suffix}@example.invalid`;
  const wizard = JSON.parse(
    await readFile(new URL('../../src/arcana/content/trial-v1.json', import.meta.url), 'utf8'),
  ).catalog.wizards[0];
  const wand = {
    id: 'backup:wand',
    version: 1,
    kind: 'wand',
    wood: 'birch',
    core: null,
    powerBonus: 2,
    multiplier: 1,
  };
  const broom = {
    id: 'backup:broom',
    version: 1,
    kind: 'broom',
    model: 'cadet-zephyr',
    initiative: 3,
  };
  const receipt = {
    id: 'backup:purchase',
    kind: 'purchase',
    request: { product: 'cacao-toad', quantity: 1, priceVersion: 1 },
    spentCrowns: 10,
    unitIds: ['backup:frog'],
  };
  // Persistence-only fixture: these snapshots are explicitly not a generated campaign or earned reward.
  const run = {
    id: 'backup:run',
    schemaVersion: 1,
    status: 'active',
    campaignSnapshot: { version: 1, evidence: 'A76 persistence fixture' },
    visited: ['backup:pact'],
    reserves: [],
    members: [
      { kind: 'owned', copyId: 'backup:copy', unit: { id: 'backup:copy', hp: 62, mana: 17 } },
    ],
  };
  const client = await source.connect();
  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO arcana_accounts VALUES($1,7)', [player]);
    await client.query(
      'INSERT INTO arcana_inventory(player_id,crowns,gold_keys,essence_points,essence_cursor) VALUES($1,40,1,35,1700000000000)',
      [player],
    );
    await client.query(
      'INSERT INTO arcana_exploration(player_id,run_id,run_state,intention) VALUES($1,$2,$3,$4)',
      [player, run.id, run, { kind: 'fixture', id: 'backup:intention' }],
    );
    await client.query('INSERT INTO arcana_victories VALUES($1,$2,1,0)', [
      player,
      'backup:first-victory',
    ]);
    await client.query('INSERT INTO arcana_unlocked_zones VALUES($1,$2,0)', [player, 'pasaje']);
    await client.query('INSERT INTO arcana_product_units VALUES($1,$2,$3,$4,NULL,0)', [
      player,
      'backup:frog',
      'cacao-toad',
      'available',
    ]);
    await client.query('INSERT INTO arcana_wizard_copies VALUES($1,$2,$3,2,$4,$5,$6,0)', [
      player,
      'backup:copy',
      wizard.id,
      wizard,
      'backup:starter',
      'starter',
    ]);
    await client.query('INSERT INTO arcana_operations VALUES($1,$2,$3,0)', [
      player,
      receipt.id,
      receipt,
    ]);
    for (const [ordinal, equipment] of [wand, broom].entries())
      await client.query('INSERT INTO arcana_equipment VALUES($1,$2,$3,1,$4,$5)', [
        player,
        equipment.id,
        equipment.kind,
        equipment,
        ordinal,
      ]);
    await client.query('INSERT INTO arcana_team_members VALUES($1,$2,0)', [player, 'backup:copy']);
    await client.query('INSERT INTO arcana_team_loadouts VALUES($1,$2,$3,$4,0)', [
      player,
      'backup:copy',
      wand.id,
      broom.id,
    ]);
    await client.query('INSERT INTO arcana_seasonal_state VALUES($1,$2)', [
      player,
      {
        schemaVersion: 1,
        editions: [
          { editionId: 'halloween-2026', completed: ['window-1'], souvenir: 'fixture-only' },
        ],
      },
    ]);
    await client.query('INSERT INTO arcana_identities VALUES($1,$2,$3,$4,2,1700000000000)', [
      `identity-${suffix}`,
      email,
      await passwords.hash(fixturePassword),
      player,
    ]);
    await client.query(
      'INSERT INTO arcana_identity_challenges VALUES($1,$2,$3,$4,true,1700000060000,1700000005000,1700000000000)',
      [createHash('sha256').update(randomUUID()).digest('hex'), 'verify', email, player],
    );
    await client.query('INSERT INTO arcana_identity_sessions VALUES($1,$2,2,1700000060000)', [
      createHash('sha256').update(randomUUID()).digest('hex'),
      player,
    ]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  return { player, email };
}

try {
  await createOwned(sourceName);
  await createOwned(targetName);
  const fixture = await populate();
  const before = await snapshot(source);
  const dump = await command('pg_dump', sourceName, [
    '--format=custom',
    '--no-owner',
    '--no-privileges',
  ]);
  assert.ok(dump.byteLength > 0, 'pg_dump must return an archive');
  await command(
    'pg_restore',
    targetName,
    ['--exit-on-error', '--no-owner', '--no-privileges'],
    dump,
  );
  const after = await snapshot(target);
  assert.deepEqual(
    after,
    before,
    'Every public table and JSON snapshot must survive actual dump/restore',
  );
  const identity = (
    await target.query('SELECT password_hash,player_id FROM arcana_identities WHERE email_key=$1', [
      fixture.email,
    ])
  ).rows[0];
  assert.equal(identity.player_id, fixture.player);
  assert.equal(await passwords.verify(fixturePassword, identity.password_hash), true);
  assert.equal(await passwords.verify(`${fixturePassword}-wrong`, identity.password_hash), false);
  const relation = await target.query(
    `SELECT i.player_id,a.revision,o.receipt->>'id' AS operation_id
    FROM arcana_identities i JOIN arcana_accounts a USING(player_id)
    JOIN arcana_operations o USING(player_id) WHERE i.email_key=$1`,
    [fixture.email],
  );
  assert.equal(relation.rows[0].operation_id, 'backup:purchase');
  console.log(
    JSON.stringify(
      {
        result: 'pass',
        toolMode: tools,
        fixtureOnly: true,
        tableCount: Object.keys(after).length,
        rowCounts: Object.fromEntries(
          Object.entries(after).map(([table, rows]) => [table, rows.length]),
        ),
        archiveBytes: dump.byteLength,
        snapshotSha256: createHash('sha256').update(JSON.stringify(after)).digest('hex'),
        credentialsVerifiedWithProductionAdapter: true,
        economicSnapshotsAndOwnershipExactlyEqual: true,
        note: 'No browser, external email, ordinary-player database dump or device test',
      },
      null,
      2,
    ),
  );
} finally {
  await source.end();
  await target.end();
  for (const name of owned) {
    assert.match(name, /^a76_(backup|restore)_[a-f0-9]{32}$/);
    await admin.query(`DROP DATABASE "${name}"`);
  }
  await admin.end();
}
