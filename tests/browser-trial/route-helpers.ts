import { preparedRoutePath } from '../support/prepared-route';
import { expect, type Page } from '@playwright/test';
import type { GameState } from '../../src/arcana/application/game';
import type { NodeKind } from '../../src/arcana/domain/exploration/route';
export const readGame = async (page: Page): Promise<GameState> =>
  (await (await page.request.get('/api/state')).json()).state;
export async function pathTo(page: Page, kind: NodeKind) {
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page.locator('[data-map-phase]')).toHaveAttribute('data-map-phase', 'route');
  const run = (await readGame(page)).exploration!.run!;
  return preparedRoutePath(run, kind);
}
export async function confirmEvent(page: Page, language: 'es' | 'en') {
  const directRecruit = page.locator('[data-pact-action="recruit"]');
  if (await directRecruit.count()) {
    await expect(directRecruit).toBeEnabled();
    await directRecruit.click();
  } else {
    const confirm = page.locator('.node-confirm-action');
    const encounterPass = page.locator('[data-encounter-offer] [data-encounter-choice="pass"]');
    if (await encounterPass.count()) await encounterPass.click();
    const candidate = page.locator('[data-pact-candidate]').first();
    if (await candidate.count()) {
      if (await candidate.isEnabled()) await candidate.click();
      else await page.locator('[data-pact-choice="pass"]').click();
      const replacement = page.locator('[data-tactical-pact] [data-visual-value]').first();
      if (!(await confirm.isEnabled()) && (await replacement.count())) await replacement.click();
    }
    const pass = page.locator('[data-preparation="pact"] [data-visual-value="pass"]');
    if ((await pass.count()) && (await pass.isEnabled()) && !(await confirm.isEnabled()))
      await pass.click();
    await confirm.click();
  }
  await expect(page.locator('dialog')).toHaveCount(0);
  // The committed response can precede React's route effect; await its observable destination.
  const receipt = (await readGame(page)).receipts.at(-1);
  if (receipt?.kind === 'advance-node' && receipt.battle)
    await expect(
      page.getByRole('heading', {
        name: language === 'es' ? 'Arena de Combate' : 'Combat Arena',
        exact: true,
      }),
    ).toBeVisible();
  else await expect(page.locator('[data-map-phase]')).toHaveAttribute('data-map-phase', 'route');
}
export async function reachNode(page: Page, kind: NodeKind, language: 'es' | 'en') {
  const path = await pathTo(page, kind);
  for (const id of path.slice(0, -1)) {
    await page.locator(`[data-node="${id}"]`).click();
    await confirmEvent(page, language);
    if (
      (await readGame(page)).receipts.at(-1)?.kind === 'advance-node' &&
      (await page
        .getByRole('button', {
          name: language === 'es' ? 'Volver al mapa' : 'Back to map',
          exact: true,
        })
        .count())
    )
      await page
        .getByRole('button', {
          name: language === 'es' ? 'Volver al mapa' : 'Back to map',
          exact: true,
        })
        .click();
  }
  return path.at(-1)!;
}
