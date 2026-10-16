/// Worker constants are injected from the exact compiled build, never runtime account data.
declare const PRECACHE: readonly string[];
declare const CACHE_NAME: string;
declare const ART_ASSETS: readonly string[];
const worker = self as unknown as ServiceWorkerGlobalScope;
const root = new URL('./', worker.registration.scope);
const shell = new URL('index.html', root).href;
const urls = PRECACHE.map((file) => new URL(file, root).href);
const allowed = new Set(urls);
const artwork = new Set(ART_ASSETS.map((file) => new URL(file, root).href));
worker.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(urls.map((url) => new Request(url, { credentials: 'omit', cache: 'reload' }))),
      ),
  );
});
worker.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys())
        if (name.startsWith('arcana-shell-') && name !== CACHE_NAME) await caches.delete(name);
      await worker.clients.claim();
    })(),
  );
});
worker.addEventListener('fetch', (event) => {
  const request = event.request,
    url = new URL(request.url);
  // A screen fragment carries no network resource identity, including on native reload.
  url.hash = '';
  if (
    request.method !== 'GET' ||
    url.origin !== root.origin ||
    url.pathname.startsWith(new URL('api/', root).pathname) ||
    url.search
  )
    return;
  if (request.mode === 'navigate' && [root.href, shell].includes(url.href)) {
    event.respondWith(
      fetch(request).catch(async () => {
        const response = await (await caches.open(CACHE_NAME)).match(shell);
        if (!response) throw Error('Shell unavailable');
        return response;
      }),
    );
    return;
  }
  if (!allowed.has(url.href) && !artwork.has(url.href)) return;
  // This closed list contains immutable public files, independent of Origin/auth headers.
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const saved = await cache.match(url.href, { ignoreVary: true });
      if (saved) return saved;
      const response = await fetch(request);
      if (artwork.has(url.href) && response.ok) await cache.put(url.href, response.clone());
      return response;
    }),
  );
});
