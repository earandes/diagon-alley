import { expect, type Locator, type Page } from '@playwright/test';

/** Navigate the actual native help disclosure; never force-click or set open in script. */
export async function clickAccountControl(control: Locator) {
  // Account access can mount after a Settings handoff; resolve its control before
  // checking ancestry so an early count=0 cannot skip the disclosure.
  await expect(control).toBeAttached();
  const disclosure = control.locator('xpath=ancestor::details[1]');
  if ((await disclosure.count()) && (await disclosure.getAttribute('open')) === null)
    await disclosure.locator(':scope > summary').click();
  await expect(control).toBeVisible();
  await control.click();
}
export async function clickAccountAction(
  page: Page,
  options: { name: string | RegExp; exact?: boolean },
) {
  await clickAccountControl(
    page
      .locator('[data-account-dialog][open]')
      .getByRole('button', { ...options, includeHidden: true }),
  );
}
