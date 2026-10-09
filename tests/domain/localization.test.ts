import { describe, expect, it } from 'vitest';
import {
  copiesText,
  familyName,
  messages,
  percent,
  rarityName,
  progressText,
} from '../../src/i18n/messages';
describe('AC09 bilingual keys, plurals and formats', () => {
  it('has the same complete nonempty messages in both languages', () => {
    expect(Object.keys(messages.es).sort()).toEqual(Object.keys(messages.en).sort());
    for (const dictionary of Object.values(messages))
      for (const message of Object.values(dictionary)) expect(message.trim()).not.toBe('');
  });
  it('formats whole messages with singular/plural and local probabilities', () => {
    expect(copiesText('es', 1)).toBe('1 copia');
    expect(copiesText('es', 2)).toBe('2 copias');
    expect(copiesText('en', 1)).toBe('1 copy');
    expect(copiesText('en', 2)).toBe('2 copies');
    expect(percent('es', 0.125)).toMatch(/12,5\s*%/);
    expect(percent('en', 0.125)).toBe('12.5%');
    expect(progressText('es', 5)).toBe('5 de 12 descubrimientos');
    expect(progressText('en', 5)).toBe('5 of 12 discovered');
  });
  it('retains stable family and three rarity names', () => {
    expect(familyName('es', 'person')).toBe('Personas');
    expect(familyName('en', 'object')).toBe('Objects');
    expect(rarityName('es', 'R03')).toBe('Extraordinario');
    expect(rarityName('en', 'R02')).toBe('Uncommon');
  });
});
