import { test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
/** Four explicit selected Linux images, never an automatic screenshot matrix. */
export async function selectedA75(
  page: Page,
  name: 'preparation-filter' | 'encounter-instance' | 'route-inspection' | 'recovery-inspector',
) {
  if (
    process.platform !== 'linux' ||
    process.env.ARCANA_CAPTURE_A75 !== '1' ||
    test.info().project.name !== 'chromium-390-a75'
  )
    return;
  const path = resolve('docs/arcana/experience-fixes-2026-10-17/evidence/linux');
  await mkdir(path, { recursive: true });
  await page.screenshot({ path: resolve(path, `selected-${name}.png`), fullPage: false });
}
