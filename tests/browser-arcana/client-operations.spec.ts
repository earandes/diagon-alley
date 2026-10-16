import { expect, test } from '../browser-trial/game-fixture';
const intent = (key: string) => ({
  schemaVersion: 1 as const,
  playerId: 'player',
  kind: 'purchase' as const,
  command: {
    key,
    expectedRevision: 1,
    request: { product: 'cacao-toad' as const, quantity: 1, priceVersion: 1 },
  },
});
test.beforeEach(async ({ page }) => {
  await page.goto('/tests/arcana-client-harness.html');
});
test('retains only intent metadata across reload and finishes it by matching key', async ({
  page,
}) => {
  const name = 'arcana-meta-' + crypto.randomUUID(),
    operation = intent('buy');
  await page.evaluate(
    async ({ name, operation }) => {
      const { IndexedDbClientOperations } = await import(
        String('/src/arcana/infrastructure/client/client-operations.ts')
      );
      const store = new IndexedDbClientOperations(name);
      await store.claim(operation);
      await store.close();
    },
    { name, operation },
  );
  await page.reload();
  const result = await page.evaluate(
    async ({ name }) => {
      const { IndexedDbClientOperations } = await import(
        String('/src/arcana/infrastructure/client/client-operations.ts')
      );
      const store = new IndexedDbClientOperations(name);
      const recovered = await store.read('player'),
        other = await store.read('other');
      await store.finish('player', 'buy', 'confirmed');
      const after = await store.read('player');
      await store.close();
      indexedDB.deleteDatabase(name);
      return { recovered, other, after };
    },
    { name },
  );
  expect(result.recovered).toEqual(operation);
  expect(result.other).toBe(null);
  expect(result.after).toBe(null);
  expect(JSON.stringify(result)).not.toContain('inventory');
});
test('serializes two tabs claiming different keys and never erases the other key', async ({
  page,
  context,
}) => {
  const name = 'arcana-meta-' + crypto.randomUUID(),
    second = await context.newPage();
  await second.goto('/tests/arcana-client-harness.html');
  const claim = async (target: typeof page, key: string) =>
    target.evaluate(
      async ({ name, operation }) => {
        const { IndexedDbClientOperations } = await import(
          String('/src/arcana/infrastructure/client/client-operations.ts')
        );
        const store = new IndexedDbClientOperations(name);
        try {
          await store.claim(operation);
          return 'claimed';
        } catch (error) {
          return (error as { code: string }).code;
        } finally {
          await store.close();
        }
      },
      { name, operation: intent(key) },
    );
  const results = await Promise.all([claim(page, 'a'), claim(second, 'b')]);
  expect(results.sort()).toEqual(['OPERATION_PENDING', 'claimed']);
  const result = await page.evaluate(async (name) => {
    const { IndexedDbClientOperations } = await import(
      String('/src/arcana/infrastructure/client/client-operations.ts')
    );
    const store = new IndexedDbClientOperations(name);
    const pending = await store.read('player');
    let mismatch = '';
    try {
      await store.finish('player', 'foreign', 'confirmed');
    } catch (error) {
      mismatch = (error as { code: string }).code;
    }
    const after = await store.read('player');
    await store.finish('player', pending!.command.key, 'confirmed');
    await store.finish('player', pending!.command.key, 'confirmed');
    await store.close();
    indexedDB.deleteDatabase(name);
    return { pending, after, mismatch };
  }, name);
  expect(result.pending).toEqual(result.after);
  expect(result.mismatch).toBe('OPERATION_PENDING');
  await second.close();
});
test('rejects invalid metadata already stored without importing balances or replacing it', async ({
  page,
}) => {
  const name = 'arcana-meta-' + crypto.randomUUID();
  const result = await page.evaluate(async (name) => {
    const { IndexedDbClientOperations } = await import(
      String('/src/arcana/infrastructure/client/client-operations.ts')
    );
    const store = new IndexedDbClientOperations(name);
    await store.read('player');
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = indexedDB.open(name, 1);
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    const bad = { schemaVersion: 1, playerId: 'player', pending: { crowns: 9999 }, finished: null };
    const tx = db.transaction('operations', 'readwrite');
    tx.objectStore('operations').put(bad);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    let code = '';
    try {
      await store.read('player');
    } catch (error) {
      code = (error as { code: string }).code;
    }
    await store.close();
    indexedDB.deleteDatabase(name);
    return code;
  }, name);
  expect(result).toBe('INVALID_PENDING');
});
