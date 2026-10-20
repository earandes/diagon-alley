import type { Language } from '../domain/collection/wizards';
const messages = {
  affinities: { es: 'Afinidades', en: 'Affinities' },
  affinityPlan: { es: 'Afinidades de la formación', en: 'Formation affinities' },
} as const;
export const planText = (language: Language, key: keyof typeof messages) => messages[key][language];
