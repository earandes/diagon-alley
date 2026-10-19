// Offline data generation only: Vite's SSR loader supports the project's JSON imports.
// This never opens a browser, starts a listener or writes an account.
import { createServer } from 'vite';
import { writeFile } from 'node:fs/promises';

const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: 'custom',
});
try {
  const { trialConfiguration } = await server.ssrLoadModule(
    '/src/arcana/infrastructure/content/trial-configuration.ts',
  );
  const { randomizeRoute } = await server.ssrLoadModule(
    '/src/arcana/domain/exploration/randomize-route.ts',
  );
  const { SeededRandom } = await server.ssrLoadModule(
    '/src/arcana/infrastructure/random/seeded-random.ts',
  );
  const { campaign } = trialConfiguration('a85');
  const graph = randomizeRoute(campaign.graph, new SeededRandom(0));
  await writeFile(
    new URL('../../tests/support/fixtures/a85-route-seed0.json', import.meta.url),
    JSON.stringify(
      {
        version: 1,
        source: 'frozen a85 campaign; seed0; discovery; graph and node plans only',
        campaignVersion: campaign.version,
        graph,
        nodes: campaign.challengeContent('discovery', graph),
      },
      null,
      2,
    ) + '\n',
  );
} finally {
  await server.close();
}
