import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MotionPreference } from '../../../src/arcana/presentation/GameSettings';
import { mapSettingsText } from '../../../src/arcana/presentation/map-settings-messages';

describe('A75 own and effective motion preference are distinct', () => {
  for (const language of ['es', 'en'] as const)
    for (const systemReduced of [false, true])
      for (const ownReduced of [false, true])
        it(`${language}, system=${systemReduced}, own=${ownReduced}`, () => {
          const reduced = systemReduced || ownReduced;
          const html = renderToStaticMarkup(
            createElement(MotionPreference, {
              language,
              systemReduced,
              ownReduced,
              reduced,
              onReduced: () => undefined,
            }),
          );
          expect(html).toContain(`aria-pressed="${ownReduced}"`);
          expect(html).toContain(`data-motion-effective="${reduced}"`);
          expect(html).toContain('aria-describedby="settings-motion-state"');
          expect(html).toContain(
            mapSettingsText(
              language,
              systemReduced ? 'motionSystem' : reduced ? 'motionEffectiveOn' : 'motionEffectiveOff',
            ),
          );
        });
});
