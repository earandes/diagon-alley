import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const directory = 'docs/arcana/visual-nodes-2026-10-15/captures';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(process.env.ARCANA_CAPTURE_URL ?? 'http://127.0.0.1:5194');
  await page.getByRole('button', { name: 'Comenzar ensayo local', exact: true }).click();
  await page.getByRole('button', { name: 'Iniciar expedición', exact: true }).click();
  await page.locator('.branch-map').waitFor();
  await mkdir(directory, { recursive: true });
  const state = async () =>
    (await (await page.request.get(new URL('/api/state', page.url()).href)).json()).state;
  const path = (run, kind) => {
    const last = run.graph.nodes.find((n) => n.id === run.visited.at(-1));
    const queue = (
      last ? last.next : run.graph.nodes.filter((n) => n.row === 0).map((n) => n.id)
    ).map((id) => [id]);
    while (queue.length) {
      const ids = queue.shift(),
        node = run.graph.nodes.find((n) => n.id === ids.at(-1));
      if (node.kind === kind) return ids;
      queue.push(...node.next.map((id) => [...ids, id]));
    }
    throw Error('No remaining ' + kind);
  };
  const resolve = async (id) => {
    await page.locator(`[data-node="${id}"]`).click();
    const confirm = page.getByRole('button', { name: 'Confirmar nodo', exact: true });
    if (!(await confirm.isEnabled()))
      await page.locator('[data-preparation="pact"] [data-visual-value="pass"]').click();
    await confirm.click();
    await page.locator('dialog').waitFor({ state: 'detached' });
    const back = page.getByRole('button', { name: 'Volver al mapa', exact: true });
    if (await back.count()) await back.click();
  };
  const initial = (await state()).exploration.run.graph.nodes.find((n) => n.row === 0).id;
  await page.locator(`[data-node="${initial}"]`).click();
  await page.locator('dialog img').evaluateAll((images) =>
    Promise.all(
      images
        .filter((image) => image.getBoundingClientRect().width > 0)
        .map((image) => {
          image.loading = 'eager';
          return image.decode().catch(() => {});
        }),
    ),
  );
  await page.screenshot({ path: directory + '/chromium-es-pact.png' });
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  for (const kind of ['duel', 'boss']) {
    const ids = path((await state()).exploration.run, kind);
    for (const id of ids.slice(0, -1)) await resolve(id);
    await page.locator(`[data-node="${ids.at(-1)}"]`).click();
    await page.locator('dialog img').evaluateAll((images) =>
      Promise.all(
        images
          .filter((image) => image.getBoundingClientRect().width > 0)
          .map((image) => {
            image.loading = 'eager';
            return image.decode().catch(() => {});
          }),
      ),
    );
    await page.screenshot({ path: `${directory}/chromium-es-${kind}.png` });
    await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
    if (kind === 'duel') await resolve(ids.at(-1));
  }
} finally {
  await browser.close();
}
