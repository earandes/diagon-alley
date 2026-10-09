import { test, expect } from '@playwright/test';
import type {} from './harness';
test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/harness.html');
  await page.waitForFunction(() => !!window.fixture);
});
test('AC02/04/05 real IndexedDB initialization, atomic open and replay', async ({ page }) => {
  const r = await page.evaluate(async () => {
    const { DemoStore, configuration, tokenOf, openingRequest } = window.fixture;
    let draws = 0;
    const a = new DemoStore('atomic', () => {
      draws++;
      return 38;
    });
    const b = new DemoStore('atomic', () => {
      draws++;
      return 0;
    });
    const [s, t] = await Promise.all([a.start(configuration, 'es'), b.start(configuration, 'en')]);
    const req = openingRequest(s),
      tok = tokenOf(s);
    const n = await a.open('op', req, tok);
    const retry = await b.open('op', req, tok);
    const errors = [];
    for (const [key, request] of [
      ['op', { ...req, tableVersion: 2 }],
      ['other', req],
    ] as const) {
      try {
        await a.open(key, request, tok);
      } catch (e) {
        errors.push((e as Error).message);
      }
    }
    return {
      initial: s.state.copies.length,
      same: s.state.runId === t.state.runId,
      copies: n.state.copies.length,
      result: n.state.operations[0].identity.id,
      replay: retry.state.operations[0],
      operation: n.state.operations[0],
      draws,
      errors,
    };
  });
  expect(r).toMatchObject({
    initial: 4,
    same: true,
    copies: 5,
    result: 'C04',
    draws: 1,
    errors: ['CONFLICT', 'EXHAUSTED'],
  });
  expect(r.replay).toEqual(r.operation);
});
test('AC05 two actual pages serialize different keys for one unit', async ({ page, context }) => {
  const other = await context.newPage();
  await other.goto('/tests/browser/harness.html');
  await other.waitForFunction(() => !!window.fixture);
  const initialize = async (p: typeof page) =>
    p.evaluate(async () => {
      const f = window.fixture;
      return new f.DemoStore('tabs', () => 0).start(f.configuration, 'es');
    });
  const s = await initialize(page);
  await initialize(other);
  const open = async (p: typeof page, key: string) =>
    p.evaluate(
      async ({ s, key }) => {
        const f = window.fixture;
        try {
          return {
            state: await new f.DemoStore('tabs', () => 39).open(
              key,
              f.openingRequest(s),
              f.tokenOf(s),
            ),
          };
        } catch (e) {
          return { error: (e as Error).message };
        }
      },
      { s, key },
    );
  const results = await Promise.all([open(page, 'a'), open(other, 'b')]);
  expect(results.filter((r) => r.state)).toHaveLength(1);
  expect(results.filter((r) => r.error === 'EXHAUSTED')).toHaveLength(1);
  const saved = await page.evaluate(() => new window.fixture.DemoStore('tabs').read());
  expect(saved.state.copies).toHaveLength(5);
  expect(saved.state.operations).toHaveLength(1);
});
test('AC06/07 exception after successful put aborts, and response lost after commit recovers', async ({
  page,
}) => {
  const r = await page.evaluate(async () => {
    const f = window.fixture,
      store = new f.DemoStore('fault');
    const s = await store.start(f.configuration, 'en');
    let error = '';
    const fail = new f.DemoStore('fault', () => 0, {
      afterWrite() {
        throw Error('injected');
      },
    });
    try {
      await fail.open('op', f.openingRequest(s), f.tokenOf(s));
    } catch (e) {
      error = (e as Error).message;
    }
    const aborted = await store.read();
    const lost = new f.DemoStore('fault', () => 39, {
      afterCommit() {
        throw Error('response lost');
      },
    });
    let unknown = '';
    try {
      await lost.open('op', f.openingRequest(s), f.tokenOf(s));
    } catch (e) {
      unknown = (e as Error).message;
    }
    const saved = await store.read();
    return {
      error,
      aborted: aborted.state.copies.length,
      available: aborted.state.units[0].status,
      unknown,
      copies: saved.state.copies.length,
      id: saved.state.operations[0].identity.id,
    };
  });
  expect(r).toEqual({
    error: 'STORAGE',
    aborted: 4,
    available: 'available',
    unknown: 'UNKNOWN',
    copies: 5,
    id: 'O04',
  });
});
test('AC11 stale config reconfirmation, historical result and no downgrade by old bundle', async ({
  page,
}) => {
  const r = await page.evaluate(async () => {
    const f = window.fixture,
      store = new f.DemoStore('versions', () => 0);
    const s = await store.start(f.configuration, 'es');
    const v2 = structuredClone(f.configuration);
    v2.table.version = 2;
    v2.table.entries[0].weight = 4;
    await store.activate(v2);
    let error = '';
    try {
      await store.open('op', f.openingRequest(s), f.tokenOf(s));
    } catch (e) {
      error = (e as Error).message;
    }
    const fresh = await store.read();
    const opened = await store.open('op', f.openingRequest(fresh), f.tokenOf(fresh));
    const v3 = structuredClone(v2);
    v3.catalog.version = 2;
    v3.table.catalogVersion = 2;
    v3.table.version = 3;
    v3.catalog.identities[0].rarityId = 'R03';
    await store.activate(v3);
    const replay = await store.open('op', f.openingRequest(fresh), f.tokenOf(fresh));
    const old = await store.start(f.configuration, 'es');
    return {
      error,
      opened: opened.state.operations[0],
      replay: replay.state.operations[0],
      active: old.active.table.version,
    };
  });
  expect(r.error).toBe('STALE_CONFIG');
  expect(r.replay).toEqual(r.opened);
  expect(r.replay.identity.rarityId).toBe('R01');
  expect(r.active).toBe(3);
});
test('AC12 validated substitution, revision/generation, concurrent preference and reset', async ({
  page,
}) => {
  const r = await page.evaluate(async () => {
    const f = window.fixture,
      store = new f.DemoStore('replace', () => 0);
    let s = await store.start(f.configuration, 'es');
    const exported = f.parseExport(await store.export());
    const old = f.tokenOf(s);
    s = await store.preferences({ language: 'en' }, old);
    let stale = '';
    try {
      await store.replace(exported, old);
    } catch (e) {
      stale = (e as Error).message;
    }
    const replaced = await store.replace(exported, f.tokenOf(s));
    let generation = '';
    try {
      await store.open('op', f.openingRequest(replaced), old);
    } catch (e) {
      generation = (e as Error).message;
    }
    const reset = await store.replace(null, f.tokenOf(replaced));
    return {
      stale,
      generation,
      restored: replaced.state.copies.length,
      language: replaced.state.language,
      newRun: reset.state.runId !== s.state.runId,
      copies: reset.state.copies.length,
    };
  });
  expect(r).toEqual({
    stale: 'STALE_STATE',
    generation: 'STALE_STATE',
    restored: 4,
    language: 'es',
    newRun: true,
    copies: 4,
  });
});
test('AC06 actual reload after abort and actual close after commit recover intact state', async ({
  page,
  context,
}) => {
  const first = await page.evaluate(async () => {
    const f = window.fixture,
      s = new f.DemoStore('reload');
    const current = await s.start(f.configuration, 'es');
    const broken = new f.DemoStore('reload', () => 0, {
      afterWrite() {
        throw Error('abort');
      },
    });
    try {
      await broken.open('abort', f.openingRequest(current), f.tokenOf(current));
    } catch {}
    return current.state.runId;
  });
  await page.reload();
  await page.waitForFunction(() => !!window.fixture);
  const after = await page.evaluate(async () => {
    const f = window.fixture,
      s = new f.DemoStore('reload', () => 39);
    const current = await s.start(f.configuration, 'es');
    const opened = await s.open('committed', f.openingRequest(current), f.tokenOf(current));
    return {
      before: current.state,
      copies: opened.state.copies.length,
      result: opened.state.operations[0],
    };
  });
  expect(after.before.runId).toBe(first);
  expect(after.before.copies).toHaveLength(4);
  expect(after.before.units[0].status).toBe('available');
  const next = await context.newPage();
  await page.close();
  await next.goto('/tests/browser/harness.html');
  await next.waitForFunction(() => !!window.fixture);
  const recovered = await next.evaluate(() => new window.fixture.DemoStore('reload').read());
  expect(recovered.state.operations[0]).toEqual(after.result);
  expect(recovered.state.copies).toHaveLength(5);
});
