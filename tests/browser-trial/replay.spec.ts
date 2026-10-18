import { leaveBattle, pauseBattle, resumeBattle, skipBattle, setDoubleBattleSpeed } from './battle-controls';
import { startExpedition } from './game-fixture';
import { changeLanguage } from './game-fixture';
import { reachNode, confirmEvent } from './route-helpers';
import { expect, test, type Page } from './game-fixture';
import { writeFile } from 'node:fs/promises';
const battle = async (page: Page) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Jugar como invitado', exact: true }).click();
  await startExpedition(page);
  const duelId = await reachNode(page, 'duel', 'es');
  await page.locator(`[data-node="${duelId}"]`).click();
  await confirmEvent(page, 'es');
  await expect(page.getByRole('heading', { name: 'Arena de Combate' })).toBeVisible();
};
const economic = (page: Page) =>
  page.evaluate(async () => {
    const { state } = await (await fetch('/api/state')).json();
    return {
      revision: state.revision,
      inventory: state.inventory,
      run: state.exploration?.run ?? null,
      receiptCount: state.receipts.length,
    };
  });
test('keeps the first available map node above the fixed navigation after starting', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Jugar como invitado', exact: true }).click();
  await startExpedition(page);
  const first = page.locator('[data-node="pasaje:0:0"]');
  await expect(first).toBeInViewport();
  const box = await first.boundingBox();
  expect(box!.y + box!.height).toBeLessThan(760);
});
test('pause, Auto, 2x, language and skip only replay the committed log', async ({ page }) => {
  let posts = 0;
  page.on('request', (r) => {
    if (r.method() === 'POST') posts++;
  });
  await battle(page);
  const arena = page.locator('[data-replay-cursor]');
  await pauseBattle(page);
  const cursor = await arena.getAttribute('data-replay-cursor'),
    before = await economic(page),
    count = posts;
  await page.waitForTimeout(900);
  expect(await arena.getAttribute('data-replay-cursor')).toBe(cursor);
  await setDoubleBattleSpeed(page);
  await expect(page.locator('.replay-controls button').nth(1)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await resumeBattle(page);
  await expect.poll(() => arena.getAttribute('data-replay-cursor')).not.toBe(cursor);
  await changeLanguage(page, 'en');
  await expect(page.getByRole('heading', { name: 'Combat Arena' })).toBeVisible();
  await skipBattle(page);
  await expect(page.getByRole('status').filter({ hasText: /^Victory$/ })).toBeVisible();
  expect(await economic(page)).toEqual(before);
  expect(posts).toBe(count);
});
test('branching map and equivalent list keep identical accessible actions with WebGL absent', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      return type === 'webgl' || type === 'webgl2'
        ? null
        : Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await battle(page);
  await expect(page.getByRole('status').filter({ hasText: /^Victoria$/ })).toBeVisible();
  await expect(
    page
      .getByText(
        'Visualización gráfica no disponible. Todas las acciones y resultados siguen accesibles.',
      )
      .first(),
  ).toBeVisible();
  await leaveBattle(page);
  await page.getByRole('button', { name: 'Ver lista de nodos', exact: true }).click();
  const next = page.locator('[data-node][data-node-state="available"]').first();
  await expect(next).toBeEnabled();
  const beforeConsultation = await economic(page);
  await next.click();
  await expect(
    page
      .locator(
        '[data-encounter-choice]:not(:disabled), [data-pact-candidate]:not(:disabled), [data-pact-choice]:not(:disabled), .node-confirm-action:not(:disabled), [data-pact-action="recruit"]',
      )
      .first(),
  ).toBeFocused();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(next).toBeFocused();
  expect(await economic(page)).toEqual(beforeConsultation);
});
test('measures real WebGL rendering and responsive layout, without attributing emulation to a phone', async ({
  page,
}, info) => {
  await battle(page);
  const canvas = page.locator('.arena-stage .scene-canvas');
  await expect(canvas).toHaveAttribute('data-renderer', 'webgl');
  const profiles = [];
  for (const viewport of [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    const profile = await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        const start = performance.now();
        const warm = (time: number) => {
          if (time - start < 500) requestAnimationFrame(warm);
          else resolve();
        };
        requestAnimationFrame(warm);
      });
      const host = document.querySelector<HTMLElement>('.arena-stage .scene-canvas')!,
        before = Number(host.dataset.renderCount),
        times: number[] = [];
      await new Promise<void>((resolve) => {
        const start = performance.now();
        const sample = (time: number) => {
          times.push(time);
          if (time - start < 2200) requestAnimationFrame(sample);
          else resolve();
        };
        requestAnimationFrame(sample);
      });
      const elapsed = times.at(-1)! - times[0];
      return {
        viewport: { width: innerWidth, height: innerHeight },
        userAgent: navigator.userAgent,
        displayFps: ((times.length - 1) * 1000) / elapsed,
        rendererDraws: Number(host.dataset.renderCount) - before,
        sampleMs: elapsed,
        resizeWarmupMs: 500,
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(profile.rendererDraws).toBeGreaterThan(0);
    expect(profile.horizontalOverflow).toBe(false);
    profiles.push(profile);
  }
  await writeFile(info.outputPath('webgl-profile.json'), JSON.stringify(profiles, null, 2));
  await info.attach('WebGL profile', {
    body: JSON.stringify(profiles),
    contentType: 'application/json',
  });
});
test('skipping a GSAP reveal and changing language preserves the confirmed card without another POST', async ({
  page,
}) => {
  let posts = 0;
  page.on('request', (r) => {
    if (r.method() === 'POST') posts++;
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Jugar como invitado', exact: true }).click();
  await page.getByRole('button', { name: 'Bazar', exact: true }).click();
  await page.locator('[data-shop="confectionery"]').click();
  await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Cromo confirmado' })).toBeVisible();
  const before = await economic(page),
    count = posts;
  await page.getByRole('button', { name: 'Omitir animación', exact: true }).click();
  await changeLanguage(page, 'en');
  await expect(page.getByRole('heading', { name: 'Confirmed card' })).toBeVisible();
  expect(await economic(page)).toEqual(before);
  expect(posts).toBe(count);
});
test('falls back to the static confirmed result after a WebGL context loss event without another operation', async ({
  page,
}) => {
  await battle(page);
  await expect(page.locator('.arena-stage .scene-canvas')).toHaveAttribute(
    'data-renderer',
    'webgl',
  );
  const before = await economic(page);
  await page
    .locator('.arena-stage canvas')
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })),
    );
  await expect(
    page.getByText(
      'Visualización gráfica no disponible. Todas las acciones y resultados siguen accesibles.',
    ),
  ).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: /^Victoria$/ })).toBeVisible();
  expect(await economic(page)).toEqual(before);
});
test('keeps the card static and confirmed when the lazy GSAP asset is missing', async ({
  page,
}) => {
  const errors: string[] = [];
  let blocked = 0;
  page.on('pageerror', (error) => errors.push(error.message));
  // Match Vite's development module and its hashed compiled chunk.
  await page.route(/\/gsap(?:\.js|-[^/]+\.js)(?:\?.*)?$/, async (route) => {
    blocked++;
    await route.abort();
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Jugar como invitado', exact: true }).click();
  await page.getByRole('button', { name: 'Bazar', exact: true }).click();
  await page.locator('[data-shop="confectionery"]').click();
  await page.getByRole('button', { name: 'Comprar y abrir 1 · 10 Coronas', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Cromo confirmado' })).toBeVisible();
  await expect.poll(() => blocked).toBe(1);
  await expect(
    page.getByRole('button', { name: 'Omitir animación', exact: true }),
  ).not.toBeVisible();
  expect(errors).toEqual([]);
  expect((await economic(page)).receiptCount).toBe(2);
});
