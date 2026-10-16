import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const directory = 'design/diagon-alley/compositions';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const evidence = [];
for (const file of (await fs.readdir(directory)).filter((file) => file.endsWith('.html'))) {
  const failures = [];
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto('http://127.0.0.1:5207/' + directory + '/' + file);
  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete));
  const images = await page.locator('img').evaluateAll((items) => items.map((image) => ({ src: image.getAttribute('src'), loaded: image.naturalWidth > 0 })));
  await page.screenshot({ path: directory + '/' + file.replace('.html', '.png') });
  evidence.push({ study: file, images, errors: failures });
}
await fs.writeFile(directory + '/capture-check.json', JSON.stringify(evidence, null, 2));
await browser.close();
console.log('Captured', evidence.length, 'local composition studies; working UI not claimed.');
