import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const root = 'docs/arcana/progression-increment-2026-10-16/evidence';
await fs.mkdir(`${root}/encounter-fixture`, { recursive: true });
const browser = await chromium.launch();
const cases = [
  { w: 390, h: 844, lang: 'es', pack: 'diagon-alley', state: 'unit', kind: 'healer' },
  { w: 1280, h: 900, lang: 'es', pack: 'diagon-alley', state: 'team', kind: 'healer' },
  { w: 865, h: 1079, lang: 'en', pack: 'arcana', state: 'unit', kind: 'scholar' },
];
const results=[];
for(const item of cases){
  const context=await browser.newContext({ viewport: {width:item.w,height:item.h},reducedMotion:'reduce'}), page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:5461/${root}/encounter-visual-fixture.html?${new URLSearchParams(item)}`);
  await page.locator('.encounter-offer-object').first().waitFor();
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(350);
  await page.screenshot({path:`${root}/encounter-fixture/${item.pack}-${item.lang}-${item.w}-${item.kind}-${item.state}.png`});
  const geometry=await page.locator('dialog').evaluate(el=>({height:el.getBoundingClientRect().height,width:el.getBoundingClientRect().width,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}));
  results.push({...item,errors,geometry});await context.close();
}
await browser.close();await fs.writeFile(`${root}/encounter-fixture/geometry.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));
