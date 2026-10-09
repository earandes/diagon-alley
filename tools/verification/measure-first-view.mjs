import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const url = process.argv[2] ?? 'http://127.0.0.1:5190/';
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: 'es-ES',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Entrar en Weasley', exact: true }).waitFor();
  const entries = await page.evaluate(() =>
    [
      ...performance.getEntriesByType('navigation'),
      ...performance.getEntriesByType('resource'),
    ].map((e) => {
      const r = e;
      return {
        url: r.name,
        transferSize: r.transferSize,
        encodedBodySize: r.encodedBodySize,
        decodedBodySize: r.decodedBodySize,
      };
    }),
  );
  const measurement = {
    date: new Date().toISOString(),
    browser: await browser.version(),
    method:
      'PerformanceNavigationTiming/PerformanceResourceTiming in fresh Chromium context; production preview, cache empty, local loopback; transferSize includes browser header estimate',
    viewport: { width: 390, height: 844 },
    entries,
    totalTransferredBytes: entries.reduce((n, e) => n + e.transferSize, 0),
    limitBytes: 1000000,
    physicalDevice: false,
    fpsMeasured: false,
  };
  await writeFile('docs/i1-evidence/first-view.json', JSON.stringify(measurement, null, 2) + '\n');
  console.log(JSON.stringify(measurement, null, 2));
  if (measurement.totalTransferredBytes > measurement.limitBytes) process.exitCode = 1;
} finally {
  await browser.close();
}
