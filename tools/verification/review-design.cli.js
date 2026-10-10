// Run with the project's Playwright CLI. Isolated, disposable browser contexts.
async (page) => {
  const browser = page.context().browser();
  const results = [];
  for (const language of ['es', 'en']) {
    for (const width of [320, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: 844 },
        locale: language === 'es' ? 'es-ES' : 'en-GB',
        reducedMotion: 'reduce',
      });
      // Controlled C02 fixture, labelled evidence; no claimed draw statistics.
      await context.addInitScript(() => {
        const original = crypto.getRandomValues.bind(crypto);
        crypto.getRandomValues = function (array) {
          if (array instanceof Uint32Array && array.length === 1) {
            array[0] = 14;
            return array;
          }
          return original(array);
        };
      });
      const p = await context.newPage();
      const errors = [];
      p.on('pageerror', (e) => errors.push(e.message));
      const capture = async (view, action) => {
        if (action) await p.locator(action).waitFor();
        await p.waitForLoadState('networkidle');
        // SVG image resources can finish before their first painted frame in Chrome.
        await p.evaluate(async () => {
          await Promise.all([...document.querySelectorAll('svg image')].map(async (node) => {
            const image = new Image();
            image.src = node.href.baseVal;
            await image.decode();
          }));
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
        });
        const metrics = await p.evaluate((action) => {
          const rect = action ? document.querySelector(action).getBoundingClientRect() : null;
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            actionBottom: rect?.bottom,
            language: document.documentElement.lang,
            bottomNav: !!document.querySelector('.bottom-nav'),
          };
        }, action);
        if (metrics.overflow || metrics.bottomNav || metrics.language !== language)
          throw new Error(`Layout regression: ${language}/${width}/${view}`);
        await p.screenshot({ path: `docs/design-i1-v3/screenshots/cli-${language}-${view}-${width}.png`, fullPage: view.includes('200percent') });
        results.push({ language, width, view, ...metrics });
      };
      await p.goto('http://127.0.0.1:5193/');
      await p.locator('#language').selectOption(language);
      await p.locator('#enter-shop').waitFor();
      await capture('alley', '#enter-shop');
      await p.locator('#enter-shop').click();
      await capture('shop', '#consult-frog');
      await p.locator('#consult-frog').click();
      await capture('detail', '.use-frog');
      await p.locator('.use-frog').click();
      await p.locator('#result-album').waitFor();
      await capture('result', '#result-album');
      await p.locator('#result-album').click();
      await capture('album');
      await p.locator('#identity-C02').click();
      if (!(await p.locator('.keepsake-art').isVisible())) throw new Error('Hidden identity artwork');
      await capture('identity');
      if (width === 320) {
        await p.getByRole('button', { name: language === 'es' ? '← Álbum' : '← Album', exact: true }).click();
        await p.addStyleTag({ content: 'html{font-size:200%}.artwork{display:none!important}' });
        await capture('album-200percent-no-art');
      }
      if (errors.length) throw new Error(errors.join('\n'));
      results.push({ browser: await p.evaluate(() => navigator.userAgent), errors });
      await context.close();
    }
  }
  return results;
}
