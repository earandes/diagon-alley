import { inspectBattleRecord, skipBattle } from '../browser-trial/battle-controls';
import { changeLanguage } from '../browser-trial/game-fixture';
import { expect, test } from '../browser-trial/game-fixture';
for (const language of ['es', 'en'] as const)
  test(`recorded passives and team identity in ${language}`, async ({ page }) => {
    const en = language === 'en';
    await page.goto('/tests/arcana-arena-harness.html');
    if (en) await changeLanguage(page, 'en');
    await skipBattle(page);
    const player = page.getByRole('region', { name: en ? 'Your Team' : 'Tu Equipo', exact: true });
    const rival = page.getByRole('region', { name: en ? 'Opponent' : 'Rival', exact: true });
    await expect(player.locator('[data-team-synergies]')).toContainText(
      en ? 'Alchemy III' : 'Alquimia III',
    );
    await expect(rival.locator('[data-team-synergies]')).toContainText(
      en ? 'Alchemy III' : 'Alquimia III',
    );
    await expect(player.locator('.pedestal')).toHaveCount(5);
    await player.locator('[data-unit="p0"] .arena-inspect').click();
    const inspector = page.locator('.arena-inspector[open]');
    await expect(inspector).toContainText(en ? 'Unit 1' : 'Unidad 1');
    await expect(inspector.locator('[data-passive="alchemy"]')).toContainText(
      en ? '+3 HP/turn' : '+3 PV/turno',
    );
    await page.keyboard.press('Escape');
    await inspectBattleRecord(page);
    await expect(page.locator('.battle-log')).toContainText(
      en ? 'Your Team · Unit 1' : 'Tu Equipo · Unidad 1',
    );
    await expect(page.locator('.battle-log')).toContainText(
      en ? 'Opponent · Unit 1' : 'Rival · Unidad 1',
    );
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 320, height: 844 });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    const overflow = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll<HTMLElement>('body *')]
        .map((element) => ({
          tag: element.tagName,
          className: element.className,
          width: element.getBoundingClientRect().width,
          right: element.getBoundingClientRect().right,
          text: element.textContent?.slice(0, 80),
        }))
        .filter((element) => element.width > innerWidth + 1 || element.right > innerWidth + 1)
        .slice(0, 30),
    }));
    const { writeFile } = await import('node:fs/promises');
    await writeFile(
      test.info().outputPath(`harness-overflow-${language}.json`),
      JSON.stringify(overflow, null, 2),
    );
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      .toBe(true);
    expect(
      await page
        .locator('.pedestal')
        .evaluateAll((nodes) => nodes.every((node) => node.scrollHeight <= node.clientHeight + 1)),
    ).toBe(true);
  });
test('invalid recorded activation shows recovery instead of crashing the application', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/tests/arcana-arena-harness.html?corrupt=synergy');
  await expect(page.getByRole('alert')).toContainText('El registro guardado no puede reproducirse');
  await expect(page.getByRole('button', { name: 'Volver al mapa', exact: true })).toBeVisible();
  await changeLanguage(page, 'en');
  await expect(page.getByRole('alert')).toContainText('The saved record cannot be replayed');
  await expect(page.getByRole('button', { name: 'Back to map', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test('Shadows I benefits neutral allies and uses singular contributor text in both languages', async ({
  page,
}) => {
  await page.goto('/tests/arcana-arena-harness.html?shadow=1');
  await skipBattle(page);
  const rival = page.getByRole('region', { name: 'Rival', exact: true });
  await expect(rival.locator('[data-team-synergies]')).toContainText('Sombras I');
  await rival.locator('[data-unit="r1"] .arena-inspect').click();
  await expect(page.locator('.arena-inspector[open]')).toContainText('Afinidad: Neutral');
  await expect(page.locator('.arena-inspector[open]')).toContainText('Sombras I · +2 iniciativa');
  await page.keyboard.press('Escape');
  await inspectBattleRecord(page);
  await expect(page.locator('.battle-log')).toContainText('sinergia Sombras (1 integrante)');
  await page.keyboard.press('Escape');
  await changeLanguage(page, 'en');
  await inspectBattleRecord(page);
  await expect(page.locator('.battle-log')).toContainText('Shadows synergy (1 contributor)');
});
