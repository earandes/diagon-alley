import { it, expect, vi } from 'vitest';
import { runInNewContext } from 'node:vm';
import { buildPwaAssets } from '../../../tools/arcana/pwa-build';
const scope = 'http://127.0.0.1:5190/';
const createWorker = () => {
  const events = new Map<string, (event: unknown) => void>();
  const stores = new Map<string, Map<string, Response>>();
  let offline = false;
  const fetch = vi.fn(async (input: Request) => {
    if (offline) throw Error('Offline');
    return new Response('network:' + input.url);
  });
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async (name: string) => stores.delete(name),
    open: async (name: string) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name)!;
      return {
        addAll: async (requests: Request[]) => {
          for (const request of requests) store.set(request.url, await fetch(request));
        },
        match: async (request: Request | string) =>
          store.get(typeof request === 'string' ? request : request.url)?.clone(),
        put: async (url: string, response: Response) => { store.set(url, response); },
      };
    },
  };
  const source = String(
    buildPwaAssets([
      { fileName: 'index.html', source: '<html>shell</html>' },
      { fileName: 'assets/app.js', source: 'app' },
      { fileName: 'assets/portrait-a.webp', source: 'public art' },
    ]).find((asset) => asset.fileName === 'service-worker.js')!.source,
  );
  const claim = vi.fn(async () => {});
  runInNewContext(source, {
    self: {
      registration: { scope },
      location: { origin: new URL(scope).origin },
      clients: { claim },
      addEventListener: (name: string, handler: (event: unknown) => void) =>
        events.set(name, handler),
    },
    caches,
    fetch,
    Request,
    Response,
    URL,
  });
  const lifecycle = async (name: string) => {
    let job = Promise.resolve();
    events.get(name)?.({ waitUntil: (promise: Promise<void>) => (job = promise) });
    await job;
  };
  const request = (url: string, method = 'GET', mode = 'cors') => {
    let response: Promise<Response> | undefined;
    events.get('fetch')?.({
      request: { url: new URL(url, scope).href, method, mode },
      respondWith: (value: Promise<Response>) => (response = value),
    });
    return response;
  };
  return {
    stores,
    fetch,
    claim,
    lifecycle,
    request,
    offline: () => {
      offline = true;
    },
  };
};
it('installs exactly shell resources and excludes authority, non-GET, external and undeclared URLs', async () => {
  const worker = createWorker();
  await worker.lifecycle('install');
  expect(worker.stores.size).toBe(1);
  const paths = [...worker.stores.values()][0];
  expect(paths.has(scope + 'index.html')).toBe(true);
  expect(paths.has(scope + 'assets/app.js')).toBe(true);
  for (const [url, method] of [
    ['/api/state', 'GET'],
    ['/api/state?owner=one', 'GET'],
    ['/api/trial/session', 'POST'],
    ['/assets/app.js', 'POST'],
    ['https://elsewhere.example/assets/app.js', 'GET'],
    ['/unknown', 'GET'],
    ['/assets/app.js?private=one', 'GET'],
  ])
    expect(worker.request(url, method)).toBeUndefined();
  expect(worker.request('/api/state', 'GET', 'navigate')).toBeUndefined();
});
it('downloads only requested art, keeps it offline and never requests all portraits on install', async () => {
  const worker=createWorker();
  await worker.lifecycle('install');
  expect([...worker.stores.values()][0].has(scope+'assets/portrait-a.webp')).toBe(false);
  expect((await worker.request('/assets/portrait-a.webp'))?.ok).toBe(true);
  worker.offline();
  expect((await worker.request('/assets/portrait-a.webp'))?.ok).toBe(true);
  expect(worker.request('/assets/not-in-build.webp')).toBeUndefined();
});
it('serves cached shell/assets offline without caching a response from the API or inventing state', async () => {
  const worker = createWorker();
  await worker.lifecycle('install');
  worker.offline();
  const document = await worker.request('/', 'GET', 'navigate');
  expect(await document?.text()).toContain('index.html');
  const asset = await worker.request('/assets/app.js');
  expect(await asset?.text()).toContain('app.js');
  expect(worker.request('/api/state')).toBeUndefined();
});
it('activation deletes only obsolete ARCANA shell caches and claims clients without forced replacement', async () => {
  const worker = createWorker();
  await worker.lifecycle('install');
  worker.stores.set('arcana-shell-old-build', new Map());
  worker.stores.set('another-app-cache', new Map());
  await worker.lifecycle('activate');
  expect(worker.stores.has('another-app-cache')).toBe(true);
  expect(worker.stores.has('arcana-shell-old-build')).toBe(false);
  expect(worker.claim).toHaveBeenCalledTimes(1);
});
it('recovers the same public shell for hash routes offline while preserving API isolation', async () => {
  const worker = createWorker();
  await worker.lifecycle('install');
  worker.offline();
  for (const hash of ['#/map', '#/shop/workshop', '#/collection', '#/battle']) {
    const document = await worker.request('/' + hash, 'GET', 'navigate');
    expect(await document?.text()).toContain('index.html');
  }
  expect(worker.request('/api/state#/map', 'GET', 'navigate')).toBeUndefined();
  expect(worker.request('/?owner=one#/map', 'GET', 'navigate')).toBeUndefined();
});
