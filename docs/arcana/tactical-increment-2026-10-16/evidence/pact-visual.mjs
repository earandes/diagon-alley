import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const output = new URL('./ui/', import.meta.url);
await mkdir(output, { recursive: true });
const baseURL = process.env.A65_UI_URL ?? 'http://127.0.0.1:5391';
const browser = await chromium.launch();
const results = [];
try {
 for (const pack of ['diagon-alley','arcana']) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion:'reduce' });
  const page = await context.newPage();
  await page.addInitScript(pack=>localStorage.setItem('arcana.presentation.content-pack.v1',pack),pack);
  await page.goto(baseURL);
  await page.locator('.portal-enter').click();
  const prep=page.locator('[data-expedition-preparation="new"]');
  await prep.locator('.preparation-card').first().click();
  await prep.getByRole('button',{name:'Entrar al mapa',exact:true}).click();
  await expect(page.locator('.branch-map')).toBeVisible();
  const read=async()=> (await (await page.request.get(`${baseURL}/api/state`)).json()).state;
  const initial=await read();
  const node=initial.exploration.run.graph.nodes.find(n=>n.row===0);
  await page.locator(`[data-node="${node.id}"]`).click();
  await expect(page.locator('[data-tactical-pact]')).toBeVisible();
  await expect(page.locator('.node-confirm-action')).toBeDisabled();
  await page.locator('[data-pact-candidate]').first().click();
  await expect(page.locator('.node-confirm-action')).toBeEnabled();
  if(JSON.stringify(await read())!==JSON.stringify(initial)) throw Error('Selection changed server state');
  for (const size of [{width:1280,height:900},{width:390,height:844},{width:865,height:1079}]) {
   await page.setViewportSize(size);
   await page.screenshot({path:new URL(`${pack}-es-pact-${size.width}.png`,output).pathname,fullPage:true,animations:'disabled'});
   const geometry=await page.locator('.node-event-dialog').evaluate(e=>({width:e.getBoundingClientRect().width,client:e.clientHeight,scroll:e.scrollHeight}));
   results.push({pack,language:'es',size,geometry});
  }
  await page.locator('.tactical-pact-inspector > summary').first().click();
  await expect(page.locator('.tactical-pact-inspector[open]')).toHaveCount(1);
  await page.screenshot({path:new URL(`${pack}-es-pact-inspector-865.png`,output).pathname,fullPage:true,animations:'disabled'});
  await page.locator('.node-event-dialog .settings-trigger').click();
  await page.locator('dialog.game-settings[open]').getByRole('button',{name:'English',exact:true}).click();
  await page.locator('dialog.game-settings[open]').getByRole('button',{name:'Close',exact:true}).click();
  await expect(page.locator('[data-pact-candidate][aria-pressed="true"]')).toHaveCount(1);
  await page.screenshot({path:new URL(`${pack}-en-pact-865.png`,output).pathname,fullPage:true,animations:'disabled'});
  await page.keyboard.press('Escape');
  if(JSON.stringify(await read())!==JSON.stringify(initial)) throw Error('Cancel changed server state');
  await context.close();
 }
 await writeFile(new URL('geometry.json',output),JSON.stringify(results,null,2));
 console.log(JSON.stringify({passed:true,captures:10,results}));
} finally { await browser.close(); }
