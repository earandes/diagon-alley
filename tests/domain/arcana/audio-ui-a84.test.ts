import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AudioPreferences } from '../../../src/arcana/presentation/audio/AudioPreferences';
import { audioText } from '../../../src/arcana/presentation/audio/messages';
import { audioPreferences } from '../../../src/arcana/presentation/audio/runtime';
import { setContentPack } from '../../../src/arcana/presentation/content-packs/active';

describe('A84 sound preference semantics in both worlds and languages', () => {
  for (const pack of ['diagon-alley', 'arcana'] as const)
    for (const language of ['es', 'en'] as const)
      it(`${pack}/${language} has two silent object choices and volumes only on demand`, () => {
        setContentPack(pack);
        audioPreferences.set({ music: false, effects: false });
        const off = renderToStaticMarkup(createElement(AudioPreferences, { language }));
        expect(off.match(/aria-pressed="false"/g)).toHaveLength(2);
        expect(off).toContain(audioText(language, 'music'));
        expect(off).toContain(audioText(language, 'effects'));
        expect(off).not.toContain('type="range"');
        audioPreferences.set({ effects: true });
        const enabled = renderToStaticMarkup(createElement(AudioPreferences, { language }));
        expect(enabled.match(/type="range"/g)).toHaveLength(1);
        expect(enabled).toContain(audioText(language, 'effectsVolume'));
        expect(enabled).toContain('aria-valuetext="50');
        audioPreferences.set({ effects: false });
      });
});
