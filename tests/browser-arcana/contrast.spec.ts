import { skipBattle } from '../browser-trial/battle-controls';
import { expect, test } from '../browser-trial/game-fixture';
import { writeFile } from 'node:fs/promises';
test('checks arena text against its actual rendered background and the replay focus indicator', async ({
  page,
}, info) => {
  await page.goto('/tests/arcana-arena-harness.html');
  await expect(page.locator('.arena-stage .scene-canvas')).toHaveAttribute(
    'data-renderer',
    'webgl',
  );
  await skipBattle(page);
  const labels = await page
    .locator('.pedestal strong, .pedestal p, .pedestal small')
    .evaluateAll((elements) =>
      elements.map((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const rect = range.getBoundingClientRect();
        return {
          text: element.textContent,
          color: getComputedStyle(element).color,
          x: rect.left + scrollX,
          y: rect.top + scrollY,
          width: rect.width,
          height: rect.height,
        };
      }),
    );
  // Hiding foreground colour leaves identical layout and the real underlying WebGL/background.
  const style = await page.addStyleTag({
    content: '.pedestal strong,.pedestal p,.pedestal small {color: transparent !important}',
  });
  const pixels = await page.screenshot({ fullPage: true, scale: 'css' });
  const report = await page.evaluate(
    async ({ png, labels }) => {
      const image = await createImageBitmap(new Blob([new Uint8Array(png)], { type: 'image/png' }));
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      const data = context.getImageData(0, 0, image.width, image.height).data;
      const luminance = (rgb: number[]) =>
        rgb
          .map((channel) => {
            const c = channel / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          })
          .reduce((value, channel, i) => value + channel * [0.2126, 0.7152, 0.0722][i], 0);
      return labels.map((label) => {
        const foreground = label.color
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number);
        const a = luminance(foreground);
        let minimum = Infinity;
        let background: number[] = [];
        for (
          let y = Math.max(0, Math.ceil(label.y));
          y < Math.min(image.height, Math.floor(label.y + label.height));
          y++
        )
          for (
            let x = Math.max(0, Math.ceil(label.x));
            x < Math.min(image.width, Math.floor(label.x + label.width));
            x++
          ) {
            const offset = (y * image.width + x) * 4;
            const rgb = [data[offset], data[offset + 1], data[offset + 2]],
              b = luminance(rgb);
            const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
            if (ratio < minimum) {
              minimum = ratio;
              background = rgb;
            }
          }
        return { text: label.text, foreground, worstBackground: background, minimumRatio: minimum };
      });
    },
    { png: [...pixels], labels },
  );
  await style.evaluate((element) => element.parentNode?.removeChild(element));
  await writeFile(info.outputPath('arena-contrast.json'), JSON.stringify(report, null, 2));
  await info.attach('arena-contrast', {
    body: JSON.stringify(report),
    contentType: 'application/json',
  });
  for (const result of report)
    expect(result.minimumRatio, String(result.text)).toBeGreaterThanOrEqual(4.5);
  const control = page.locator('.arena-caption button');
  await page.keyboard.press('Tab');
  await control.focus();
  await expect(control).toBeFocused();
  const focus = await control.evaluate((element) => ({
    color: getComputedStyle(element).outlineColor,
    width: getComputedStyle(element).outlineWidth,
    style: getComputedStyle(element).outlineStyle,
    background: getComputedStyle(document.documentElement).backgroundColor,
  }));
  const luminance = (color: string) =>
    color
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number)
      .map((value) => {
        const c = value / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      })
      .reduce((value, channel, i) => value + channel * [0.2126, 0.7152, 0.0722][i], 0);
  const a = luminance(focus.color),
    b = luminance(focus.background);
  expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toBeGreaterThanOrEqual(3);
  expect(focus.style).not.toBe('none');
  expect(parseFloat(focus.width)).toBeGreaterThanOrEqual(2);
});
