import { createServer, type Plugin, type ViteDevServer, type PreviewServer } from 'vite';
import type { createLocalTrial } from '../../src/arcana/infrastructure/http/local-runtime.ts';
type LocalTrial = Awaited<ReturnType<typeof createLocalTrial>>;
function attach(server: ViteDevServer | PreviewServer, runtime: LocalTrial) {
  server.middlewares.use((request, response, next) => {
    if (request.url?.startsWith('/api/')) runtime.gateway.server.emit('request', request, response);
    else {
      if (
        request.url?.split('?')[0] === '/service-worker.js' ||
        request.url?.split('?')[0] === '/manifest.webmanifest'
      )
        response.setHeader('Cache-Control', 'no-cache');
      next();
    }
  });
}
async function runtime(loader: ViteDevServer, port: number): Promise<LocalTrial> {
  const module = (await loader.ssrLoadModule(
    '/src/arcana/infrastructure/http/local-runtime.ts',
  )) as { createLocalTrial: typeof createLocalTrial };
  // Opt-in server-side fixture only; no browser command can alter authority time.
  const configured = process.env.ARCANA_TRIAL_CLOCK_ISO;
  const fixedNow = configured === undefined ? undefined : Date.parse(configured);
  if (fixedNow !== undefined && !Number.isSafeInteger(fixedNow))
    throw new Error('Invalid trial clock');
  return module.createLocalTrial(
    `http://127.0.0.1:${port}`,
    process.env.ARCANA_TRIAL_NAMESPACE,
    fixedNow === undefined ? undefined : { now: async () => fixedNow },
  );
}
/** Opt-in local authority for source and compiled-artifact verification, never a deployment server. */
export function localAuthority(): Plugin {
  return {
    name: 'arcana-local-authority',
    async configureServer(server) {
      const trial = await runtime(server, server.config.server.port ?? 5189);
      attach(server, trial);
      server.httpServer?.once('close', () => {
        void trial.close();
      });
    },
    async configurePreviewServer(server) {
      const loader = await createServer({
        configFile: false,
        root: server.config.root,
        appType: 'custom',
        server: {
          middlewareMode: true,
          hmr: false,
          watch: { ignored: ['**/test-results-arcana*/**', '**/.playwright-cli/**'] },
        },
      });
      try {
        const trial = await runtime(loader, server.config.preview.port ?? 5190);
        attach(server, trial);
        server.httpServer.once('close', () => {
          void Promise.allSettled([trial.close(), loader.close()]);
        });
      } catch (error) {
        await loader.close();
        throw error;
      }
    },
  };
}
