import { afterEach, it, expect } from 'vitest';
import {
  DEFAULT_CONTENT_PACK_ID,
  setContentPack,
} from '../../../src/arcana/presentation/content-packs/active';
afterEach(() => {
  setContentPack(DEFAULT_CONTENT_PACK_ID);
});
import { messages, text, savedCopies } from '../../../src/arcana/presentation/translations';
it('provides complete matching bilingual messages and parameters', () => {
  for (const value of Object.values(messages)) {
    expect(value.es.trim()).not.toBe('');
    expect(value.en.trim()).not.toBe('');
    expect(value.es.match(/\{\w+\}/g) ?? []).toEqual(value.en.match(/\{\w+\}/g) ?? []);
  }
});
it('formats full ARCANA purchase messages with supplied prices in both languages', () => {
  setContentPack('arcana');
  expect(text('es', 'buyCocoaToad', { value: '10' })).toBe('Comprar Sapo de Cacao · 10 Coronas');
  expect(text('en', 'buyCocoaToad', { value: '10' })).toBe('Buy Cocoa Toad · 10 Crowns');
});
it('formats one and multiple saved copies without concatenating translations', () => {
  expect(savedCopies('es', 1)).toBe('1 copia guardada');
  expect(savedCopies('en', 2)).toBe('2 saved copies');
});

it('formats Diagon purchases with the same supplied authoritative prices', () => {
  setContentPack('diagon-alley');
  expect(text('es', 'buyCocoaToad', { value: 10 })).toBe('Comprar Rana de Chocolate · 10 Galeones');
  expect(text('en', 'buyCocoaToad', { value: 10 })).toBe('Buy Chocolate Frog · 10 Galleons');
});
