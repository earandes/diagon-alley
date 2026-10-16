# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journey.spec.ts >> local ARCANA journey and reload in en
- Location: tests/browser-trial/journey.spec.ts:6:3

# Error details

```
TypeError: Cannot read properties of undefined (reading 'wizard')
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - link "Skip to content" [ref=f1e4]:
    - /url: "#content"
  - banner [ref=f1e5]:
    - heading "ARCANA" [level=1] [ref=f1e6]
    - button "Settings" [ref=f1e7] [cursor=pointer]
  - status [ref=f1e10]
  - generic [ref=f1e11]:
    - strong [ref=f1e12]:
      - generic "Crowns" [ref=f1e14]: "60"
    - generic [ref=f1e15]:
      - generic [ref=f1e16]:
        - generic [ref=f1e18]: Essence
        - text: 45 / 50
        - meter "Runic Essence" [ref=f1e19]
      - generic [ref=f1e20]: Next point at 04:20:52 PM.
      - button "Refresh Essence" [ref=f1e21] [cursor=pointer]
    - generic [ref=f1e24]:
      - strong [aria-hidden] [ref=f1e26]: "0"
      - generic [ref=f1e27]: 0 Gold Keys
  - main [ref=f1e28]:
    - status [ref=f1e29]
    - dialog "Confirmed card" [ref=f1e30]:
      - button "Settings" [ref=f1e31] [cursor=pointer]
      - heading "Confirmed card" [active] [level=2] [ref=f1e34]
      - generic [ref=f1e35]:
        - heading "Sun Priestess" [level=3] [ref=f1e36]
        - paragraph [ref=f1e37]:
          - generic [ref=f1e39]: Arcane Legendary
        - paragraph [ref=f1e40]: ★★★★★ 5 stars
      - paragraph [ref=f1e41]: New discovery
      - status [ref=f1e42]: New discovery
      - generic [ref=f1e43]:
        - button "View in Chromodex" [ref=f1e44] [cursor=pointer]
        - button "Continue" [ref=f1e46] [cursor=pointer]
    - region "The Enchanted Confectionery" [ref=f1e49]:
      - generic [ref=f1e50]:
        - button "Back to the alley" [ref=f1e51] [cursor=pointer]:
          - generic [ref=f1e57]: Alley
        - heading "The Enchanted Confectionery" [level=2] [ref=f1e58]
      - group "Choose a sweet" [ref=f1e59]:
        - button "Cocoa Toad" [pressed] [ref=f1e61] [cursor=pointer]:
          - generic [ref=f1e64]: "10"
        - generic [ref=f1e67]:
          - button "Chance Beans" [ref=f1e68] [cursor=pointer]:
            - generic [ref=f1e71]: "5"
          - button "How to use your beans" [ref=f1e74] [cursor=pointer]:
            - generic [aria-hidden] [ref=f1e75]: i
            - generic [ref=f1e76]: Information
      - button "Buy and open 1 · 10 Crowns" [ref=f1e78] [cursor=pointer]:
        - generic [ref=f1e80]:
          - strong [ref=f1e81]: Buy and open
          - generic [ref=f1e82]: "10"
        - generic [aria-hidden] [ref=f1e83]: ↗
      - button "Card probabilities" [ref=f1e85] [cursor=pointer]:
        - generic [ref=f1e88]: Cards
  - navigation "Main navigation" [ref=f1e89]:
    - button "Map" [ref=f1e90] [cursor=pointer]
    - button "Chromodex" [ref=f1e93] [cursor=pointer]
    - button "Bazaar" [ref=f1e96] [cursor=pointer]
    - button "Missions" [ref=f1e99] [cursor=pointer]
```

# Test source

```ts
  9   |     await page
  10  |       .getByRole('button', {
  11  |         name: language === 'es' ? 'Comenzar ensayo local' : 'Start local trial',
  12  |         exact: true,
  13  |       })
  14  |       .click();
  15  |     await expect(page.locator('.preparation-card').first()).toBeVisible();
  16  |     await startExpedition(page, language);
  17  |     const duelId = await reachNode(page, 'duel', language);
  18  |     await page.locator(`[data-node="${duelId}"]`).click();
  19  |     await confirmEvent(page, language);
  20  |     await expect(
  21  |       page.getByRole('heading', { name: language === 'es' ? 'Arena de Combate' : 'Combat Arena' }),
  22  |     ).toBeVisible();
  23  |     await page
  24  |       .getByRole('button', {
  25  |         name: language === 'es' ? 'Volver al mapa' : 'Back to map',
  26  |         exact: true,
  27  |       })
  28  |       .click();
  29  |     await page
  30  |       .getByRole('button', { name: language === 'es' ? 'Bazar' : 'Bazaar', exact: true })
  31  |       .click();
  32  |     await expect(page).toHaveURL(/#\/shop$/);
  33  |     const activeNavigation = page.getByRole('button', {
  34  |       name: language === 'es' ? 'Bazar' : 'Bazaar',
  35  |       exact: true,
  36  |     });
  37  |     await activeNavigation.hover();
  38  |     const activeContrast = await activeNavigation.evaluate((element) => {
  39  |       const css = getComputedStyle(element);
  40  |       const luminance = (color: string) =>
  41  |         color
  42  |           .match(/[\d.]+/g)!
  43  |           .slice(0, 3)
  44  |           .map(Number)
  45  |           .map((v) => {
  46  |             const c = v / 255;
  47  |             return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  48  |           })
  49  |           .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  50  |       const a = luminance(css.color),
  51  |         b = luminance(css.backgroundColor);
  52  |       return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  53  |     });
  54  |     expect(activeContrast).toBeGreaterThanOrEqual(4.5);
  55  | 
  56  |     const beforeNavigation = (await (await page.request.get('/api/state')).json()).state;
  57  |     await page
  58  |       .getByRole('button', {
  59  |         name: language === 'es' ? 'Taller de Varitas' : 'Wand Workshop',
  60  |         exact: true,
  61  |       })
  62  |       .click();
  63  |     await expect(page).toHaveURL(/#\/shop\/workshop$/);
  64  |     await page.reload();
  65  |     await expect(
  66  |       page.getByRole('heading', {
  67  |         name: language === 'es' ? 'Taller de Varitas' : 'Wand Workshop',
  68  |         exact: true,
  69  |       }),
  70  |     ).toBeVisible();
  71  |     await page
  72  |       .getByRole('button', { name: language === 'es' ? 'Cromodex' : 'Chromodex', exact: true })
  73  |       .click();
  74  |     await expect(page).toHaveURL(/#\/collection$/);
  75  |     await page.goBack();
  76  |     await expect(page).toHaveURL(/#\/shop\/workshop$/);
  77  |     await expect(page.locator('#content')).toBeFocused();
  78  |     await page.goForward();
  79  |     await expect(page).toHaveURL(/#\/collection$/);
  80  |     expect((await (await page.request.get('/api/state')).json()).state).toEqual(beforeNavigation);
  81  |     await page
  82  |       .getByRole('button', { name: language === 'es' ? 'Bazar' : 'Bazaar', exact: true })
  83  |       .click();
  84  |     await page
  85  |       .getByRole('button', {
  86  |         name: language === 'es' ? 'La Confitería Encantada' : 'The Enchanted Confectionery',
  87  |         exact: true,
  88  |       })
  89  |       .click();
  90  | 
  91  |     await page
  92  |       .getByRole('button', {
  93  |         name: language === 'es' ? 'Comprar y abrir 1 · 10 Coronas' : 'Buy and open 1 · 10 Crowns',
  94  |         exact: true,
  95  |       })
  96  |       .click();
  97  |     await expect(
  98  |       page.getByRole('heading', {
  99  |         name: language === 'es' ? 'Cromo confirmado' : 'Confirmed card',
  100 |       }),
  101 |     ).toBeVisible();
  102 |     await expect(page.locator('[data-opening-state]')).toHaveAttribute(
  103 |       'data-opening-state',
  104 |       'result',
  105 |       { timeout: 10_000 },
  106 |     );
  107 |     const saved = (await (await page.request.get('/api/state')).json()).state;
  108 |     const receipt = saved.receipts.find((r: { kind: string }) => r.kind === 'open-toad');
> 109 |     const stars = receipt.wizard.stars;
      |                           ^ TypeError: Cannot read properties of undefined (reading 'wizard')
  110 |     expect(stars).toBeGreaterThanOrEqual(1);
  111 |     expect(stars).toBeLessThanOrEqual(5);
  112 |     const rating =
  113 |       language === 'es'
  114 |         ? `${stars} ${stars === 1 ? 'estrella' : 'estrellas'}`
  115 |         : `${stars} ${stars === 1 ? 'star' : 'stars'}`;
  116 |     await expect(
  117 |       page.locator('.holographic-card').getByText(rating, { exact: true }),
  118 |     ).toBeVisible();
  119 |     await page.setViewportSize({ width: 320, height: 844 });
  120 |     await expect(page.locator('[data-opening-state]')).toHaveAttribute(
  121 |       'data-opening-state',
  122 |       'result',
  123 |     );
  124 |     await expect(
  125 |       page.getByRole('button', {
  126 |         name: language === 'es' ? 'Omitir animación' : 'Skip animation',
  127 |         exact: true,
  128 |       }),
  129 |     ).toHaveCount(0);
  130 |     await expect
  131 |       .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  132 |       .toBe(true);
  133 |     const navigationFont = await page
  134 |       .locator('nav button')
  135 |       .first()
  136 |       .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  137 |     await page.evaluate(() => {
  138 |       document.documentElement.style.fontSize = '200%';
  139 |     });
  140 |     expect(
  141 |       await page
  142 |         .locator('nav button')
  143 |         .first()
  144 |         .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  145 |     ).toBeGreaterThanOrEqual(navigationFont * 1.99);
  146 |     await expect
  147 |       .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  148 |       .toBe(true);
  149 |     await page.reload();
  150 |     await page
  151 |       .getByRole('button', { name: language === 'es' ? 'Cromodex' : 'Chromodex', exact: true })
  152 |       .click();
  153 |     await expect(
  154 |       page.getByText(language === 'es' ? '2 copias guardadas' : '2 saved copies', { exact: true }),
  155 |     ).toBeVisible();
  156 |     const article = page.locator('.album article').filter({
  157 |       has: page.getByRole('heading', { name: receipt.wizard.name[language], exact: true }),
  158 |     });
  159 |     await expect(article.getByText(rating, { exact: true }).first()).toBeVisible();
  160 |     await article.locator('.album-card-inspect').click();
  161 |     await expect(
  162 |       page.locator('.album-card-folio').getByText(rating, { exact: true }),
  163 |     ).toBeVisible();
  164 |     await page.keyboard.press('Escape');
  165 |     await changeLanguage(page, language === 'es' ? 'en' : 'es');
  166 |     const otherLanguage = language === 'es' ? 'en' : 'es';
  167 |     const otherArticle = page.locator('.album article').filter({
  168 |       has: page.getByRole('heading', { name: receipt.wizard.name[otherLanguage], exact: true }),
  169 |     });
  170 |     await otherArticle.locator('.album-card-inspect').click();
  171 |     const otherRating =
  172 |       language === 'es'
  173 |         ? `${stars} ${stars === 1 ? 'star' : 'stars'}`
  174 |         : `${stars} ${stars === 1 ? 'estrella' : 'estrellas'}`;
  175 |     await expect(
  176 |       page.locator('.album-card-folio').getByText(otherRating, { exact: true }),
  177 |     ).toBeVisible();
  178 |     await page.keyboard.press('Escape');
  179 |     await changeLanguage(page, language);
  180 |     expect((await (await page.request.get('/api/state')).json()).state).toEqual(saved);
  181 |     await expect(page.locator('html')).toHaveAttribute('lang', language);
  182 |   });
  183 | 
```