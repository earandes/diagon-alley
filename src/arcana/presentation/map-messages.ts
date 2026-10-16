import type { Language } from '../domain/collection/wizards';

const messages = {
  origin: { es: 'Inicio', en: 'Start' },
};
export const mapText = (language: Language, key: keyof typeof messages): string =>
  messages[key][language];
