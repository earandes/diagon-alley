/** Optional browser enhancement: registration failure never blocks the online game. */
export async function registerShellWorker(): Promise<void> {
  if (!globalThis.isSecureContext || !navigator.serviceWorker) return;
  try {
    await navigator.serviceWorker.register(new URL('service-worker.js', document.baseURI), {
      scope: new URL('./', document.baseURI).href,
      updateViaCache: 'none',
    });
  } catch {
    /* Browsers or local settings may disallow this optional cache. */
  }
}
