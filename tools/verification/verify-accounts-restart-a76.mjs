import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readdir, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { createServer } from 'vite';

/** Non-graphical proof; only two new, UUID-labelled disposable containers can be mutated. */
const execute = promisify(execFile);
const nonce = randomUUID();
const namespace = `a76-restart-${nonce}`;
const images = {
  postgres: 'postgres:16.9@sha256:ddfe3e8713e3ee5b8f286082cb12512488dfbf3f5a1ecb0b74a42e6055af0a5f',
  redis: 'redis:7-alpine@sha256:bb186d083732f669da90be8b0f975a37812b15e913465bb14d845db72a4e3e08',
};
const mailbox = resolve('.local/arcana-mail', namespace);
const owned = [];
const password = `A76 restart fixture ${randomUUID()}`;
const email = `a76-restart-${nonce}@example.invalid`;
const started = performance.now();
const docker = async (args, timeout = 15000) =>
  (await execute('docker', args, { timeout, maxBuffer: 256 * 1024 })).stdout.trim();
let loader;
let current;
let outcome;
let phase = 'cached-image preflight';

async function verifyOwnership(container) {
  assert.match(container.id, /^[a-f0-9]{64}$/);
  const details = JSON.parse(await docker(['inspect', container.id]))[0];
  assert.equal(details.Id, container.id);
  assert.equal(details.Name, `/${container.name}`);
  assert.equal(details.Config.Labels?.['org.arcana.a76-restart'], nonce);
  assert.equal(details.HostConfig.Memory, container.memory);
  assert.equal(details.HostConfig.NanoCpus, 500000000);
  return details;
}

async function start(kind) {
  const name = `${namespace}-${kind}`;
  const memory = kind === 'postgres' ? 256 * 1024 * 1024 : 128 * 1024 * 1024;
  const command =
    kind === 'postgres'
      ? [
          '-e',
          'POSTGRES_DB=a76_restart',
          '-e',
          'POSTGRES_USER=a76_restart',
          '-e',
          'POSTGRES_PASSWORD=a76-restart-public-fixture',
          images.postgres,
          '-c',
          'shared_buffers=32MB',
          '-c',
          'work_mem=2MB',
          '-c',
          'maintenance_work_mem=16MB',
          '-c',
          'max_connections=12',
        ]
      : [
          images.redis,
          'redis-server',
          '--appendonly',
          'yes',
          '--appendfsync',
          'always',
          '--maxmemory',
          '32mb',
          '--maxmemory-policy',
          'noeviction',
        ];
  const id = await docker([
    'run',
    '--detach',
    '--pull=never',
    '--name',
    name,
    '--label',
    `org.arcana.a76-restart=${nonce}`,
    '--memory',
    String(memory),
    '--memory-swap',
    String(memory),
    '--cpus',
    '0.5',
    '--pids-limit',
    '128',
    '--publish',
    `127.0.0.1::${kind === 'postgres' ? 5432 : 6379}`,
    ...command,
  ]);
  const container = { id, name, kind, memory };
  owned.push(container);
  await verifyOwnership(container);
  return container;
}

async function ready(containers) {
  const deadline = performance.now() + 60000;
  for (const container of containers) {
    while (true) {
      const details = await verifyOwnership(container);
      if (!details.State.Running) throw Error(`Owned ${container.kind} stopped during startup`);
      try {
        const answer = await docker(
          [
            'exec',
            container.id,
            ...(container.kind === 'postgres'
              ? ['pg_isready', '-h', '127.0.0.1', '-U', 'a76_restart', '-d', 'a76_restart']
              : ['redis-cli', 'ping']),
          ],
          3000,
        );
        if (container.kind === 'postgres' || answer === 'PONG') break;
      } catch {
        // This readiness loop has a single bounded deadline; no test is retried after failure.
      }
      if (performance.now() >= deadline) throw Error('Owned service startup exceeded 60s');
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

async function port(container, number) {
  await verifyOwnership(container);
  const address = await docker(['port', container.id, `${number}/tcp`]);
  const match = /^127\.0\.0\.1:(\d+)$/.exec(address);
  assert.ok(match, 'Disposable service must bind exclusively to a random loopback port');
  const value = Number(match[1]);
  assert.ok(value > 0 && value <= 65535);
  assert.notEqual(value, 55432);
  assert.notEqual(value, 56379);
  return value;
}

async function closeCurrent() {
  if (!current) return;
  await current.runtime.app.close();
  if (current.redis.isOpen) await current.redis.close();
  await current.pool.end();
  current = undefined;
}

try {
  // No pulls or service installation. Refuse missing images before creating either container.
  for (const image of Object.values(images)) await docker(['image', 'inspect', image]);
  const total = Number(await docker(['info', '--format', '{{.MemTotal}}']));
  assert.ok(total >= 1024 * 1024 * 1024, 'Docker must have at least 1GiB configured');
  phase = 'create owned services';
  const postgres = await start('postgres');
  const redisContainer = await start('redis');
  await ready(owned);
  let pgPort = await port(postgres, 5432);
  let redisPort = await port(redisContainer, 6379);
  const initialPorts = { pgPort, redisPort };

  // Existing project TypeScript loader; middleware-only, no browser, watcher or HTTP listener.
  loader = await createServer({
    configFile: false,
    appType: 'custom',
    server: { middlewareMode: true, watch: null, hmr: false },
    optimizeDeps: { noDiscovery: true },
  });
  const modules = {};
  for (const [name, path] of Object.entries({
    games: '/src/arcana/infrastructure/postgres/game-transactions.ts',
    identity: '/src/arcana/infrastructure/identity/service.ts',
    sessions: '/src/arcana/infrastructure/identity/sessions.ts',
    authority: '/src/arcana/infrastructure/redis/authority.ts',
    mail: '/src/arcana/infrastructure/identity/mail.ts',
    team: '/src/arcana/application/team-use-cases.ts',
    configuration: '/src/arcana/infrastructure/content/trial-configuration.ts',
    composition: '/src/arcana/infrastructure/http/composition.ts',
  }))
    modules[name] = await loader.ssrLoadModule(path);
  const config = modules.configuration.trialConfiguration();

  async function connect() {
    const pool = new Pool({
      host: '127.0.0.1',
      port: pgPort,
      database: 'a76_restart',
      user: 'a76_restart',
      password: 'a76-restart-public-fixture',
      max: 3,
      connectionTimeoutMillis: 3000,
      statement_timeout: 5000,
    });
    const redis = createClient({
      url: `redis://127.0.0.1:${redisPort}`,
      socket: { connectTimeout: 3000, reconnectStrategy: false },
    });
    redis.on('error', () => {});
    try {
      await redis.connect();
      await modules.games.applyGameSchema(pool);
      await modules.identity.applyIdentitySchema(pool);
      await modules.sessions.applyIdentitySessionSchema(pool);
      const raw = new modules.authority.RedisAuthority(redis, namespace);
      const games = new modules.games.PostgresGameTransactions(pool);
      const identity = new modules.identity.IdentityService(pool, {
        initializePlayer: (playerId, client) =>
          new modules.team.InitializePlayerUseCase(
            modules.games.gameAccountsInTransaction(client),
            () => config.starter,
            raw,
          ).execute(playerId),
        now: () => raw.now(),
        mail: new modules.mail.LocalIdentityMail(mailbox, 'test'),
      });
      const sessions = new modules.sessions.IdentitySessions(raw, pool, identity);
      const runtime = modules.composition.composeArcanaApi({
        pool,
        redis,
        namespace,
        games,
        sessions,
        opening: () => config.opening,
        campaign: () => config.campaign,
        policy: { bodyLimit: 16384, maximumPerIp: 1000, maximumPerPlayer: 500, windowMs: 60000 },
      });
      current = { pool, redis, games, identity, sessions, runtime };
      return current;
    } catch (error) {
      if (redis.isOpen) await redis.close();
      await pool.end();
      throw error;
    }
  }

  phase = 'initial account and persisted gameplay';
  let app = await connect();
  await app.identity.register({ email });
  const messages = await readdir(mailbox);
  assert.equal(messages.length, 1);
  const message = JSON.parse(await readFile(resolve(mailbox, messages[0]), 'utf8'));
  assert.equal(message.to, email);
  const account = await app.identity.verify({ token: message.token, password });
  const oldSession = await app.sessions.issueIdentity(
    account.playerId,
    account.authVersion,
    600000,
  );
  const headers = { authorization: `Bearer ${oldSession.token}` };
  const initial = await app.games.read(account.playerId);
  const startRun = await app.runtime.app.inject({
    method: 'POST',
    url: '/api/runs',
    headers,
    payload: {
      key: 'restart:run',
      expectedRevision: initial.revision,
      request: {
        zoneId: config.campaign.zoneId,
        campaignVersion: config.campaign.version,
        copyIds: [initial.copies[0].copyId],
      },
    },
  });
  assert.equal(startRun.statusCode, 200);
  const buy = await app.runtime.app.inject({
    method: 'POST',
    url: '/api/toads/buy-open',
    headers,
    payload: {
      key: 'restart:toad',
      expectedRevision: startRun.json().state.revision,
      request: {
        priceVersion: config.opening.shop.version,
        catalogVersion: config.opening.catalog.version,
        tableVersion: config.opening.table.version,
      },
    },
  });
  assert.equal(buy.statusCode, 200);
  const before = await app.games.read(account.playerId);
  assert.equal(before.copies.length, 2);
  assert.equal(before.receipts.filter((receipt) => receipt.kind === 'starter-kit').length, 1);
  assert.equal(before.receipts.at(-1).id, 'restart:toad');
  assert.ok(before.exploration.run.campaignSnapshot);
  await closeCurrent();

  // Validate exact IDs/labels immediately before each mutation; never restart Compose services.
  phase = 'restart owned services';
  for (const container of owned) {
    await verifyOwnership(container);
    assert.equal(await docker(['restart', '--timeout', '5', container.id], 20000), container.id);
  }
  await ready(owned);
  // Docker may allocate different random host ports on restart; re-resolve only these owned IDs.
  pgPort = await port(postgres, 5432);
  redisPort = await port(redisContainer, 6379);
  phase = 'reconnect after restart';
  app = await connect();
  assert.equal(await app.sessions.resolve(oldSession.token), account.playerId);
  assert.deepEqual(await app.games.read(account.playerId), before);
  const restoredAccount = await app.identity.login({ email, password });
  assert.deepEqual(restoredAccount, account);
  const refreshed = await app.sessions.issueIdentity(account.playerId, account.authVersion, 600000);
  assert.notEqual(refreshed.token, oldSession.token);
  assert.equal(await app.sessions.resolve(refreshed.token), account.playerId);

  // Only the newly created Redis instance is cleared. Ordinary Redis is on another port/container.
  phase = 'recover identity after owned Redis loss';
  await verifyOwnership(redisContainer);
  assert.equal(await app.redis.flushDb(), 'OK');
  assert.equal(await app.sessions.resolve(oldSession.token), null);
  const recoveredAccount = await app.identity.login({ email, password });
  assert.deepEqual(recoveredAccount, account);
  const recovered = await app.sessions.issueIdentity(account.playerId, account.authVersion, 600000);
  const response = await app.runtime.app.inject({
    method: 'GET',
    url: '/api/state',
    headers: { authorization: `Bearer ${recovered.token}` },
  });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json().state, before);
  outcome = {
    result: 'pass',
    fixtureOnly: true,
    servicesActuallyRestarted: ['postgres', 'redis'],
    ordinaryServicesTouched: false,
    randomPortsChangedOnRestart:
      initialPorts.pgPort !== pgPort || initialPorts.redisPort !== redisPort,
    memoryLimitsMiB: { postgres: 256, redis: 128 },
    cpuLimitEach: 0.5,
    redisAofSessionSurvivedRestart: true,
    loginAfterRedisLossRecoveredSamePlayer: true,
    snapshotsInventoryCopiesAndReceiptsEqual: true,
    copyCount: before.copies.length,
    receiptCount: before.receipts.length,
    snapshotSha256: createHash('sha256').update(JSON.stringify(before)).digest('hex'),
    elapsedMs: Math.round(performance.now() - started),
    note: 'Actual services and production adapters; no browser, external mail or ordinary-player session',
  };
} catch (error) {
  throw new Error(`A76 isolated restart proof failed during ${phase}`, { cause: error });
} finally {
  await closeCurrent();
  if (loader) await loader.close();
  for (const container of owned.reverse()) {
    await verifyOwnership(container);
    await docker(['rm', '--force', '--volumes', container.id], 20000);
  }
  assert.match(namespace, /^a76-restart-[a-f0-9-]{36}$/);
  await rm(mailbox, { recursive: true, force: true });
}
console.log(
  JSON.stringify({ ...outcome, ownedContainersAndAnonymousVolumesRemoved: true }, null, 2),
);
