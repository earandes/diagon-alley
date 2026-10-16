import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const root = 'src/arcana/presentation/content-packs/diagon-alley/art/character';
const output = 'design/diagon-alley/sources/portrait-renders';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 512, height: 640 }, deviceScaleFactor: 1 });
for (const file of (await fs.readdir(root)).filter((file) => file.endsWith('.svg'))) {
  await page.goto('http://127.0.0.1:5207/' + root + '/' + file);
  await page.screenshot({ path: output + '/' + file.replace('.svg', '.png'), omitBackground: true });
}
await browser.close();
console.log('Rendered local SVG family as transparent masters.');
