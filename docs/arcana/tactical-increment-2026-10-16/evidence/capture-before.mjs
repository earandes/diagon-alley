import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch(); const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'}); const page=await context.newPage();
try {
await page.goto('http://127.0.0.1:5390/'); await page.locator('.portal-enter').click(); await page.locator('.preparation-card').first().click(); await page.getByRole('button',{name:'Entrar al mapa',exact:true}).click();
await page.locator('.branch-map').waitFor();
const data=await (await page.request.get('http://127.0.0.1:5390/api/state')).json();
const run=data.state.exploration.run; await page.locator(`[data-node="${run.graph.nodes.find(n=>n.row===0).id}"]`).click();
await page.locator('.node-event-dialog[open]').waitFor();
for(const width of [1280,390,865]) {await page.setViewportSize({width,height:width===390?844:width===865?1079:900});await page.screenshot({path:`docs/arcana/tactical-increment-2026-10-16/evidence/before/pact-${width}.png`,fullPage:true,animations:'disabled'});}
await writeFile('docs/arcana/tactical-increment-2026-10-16/evidence/before/state.json',JSON.stringify(data,null,2));
} finally {await context.close();await browser.close();}
