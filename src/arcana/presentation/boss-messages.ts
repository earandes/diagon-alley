import type { Language } from '../domain/collection/wizards';
const messages = {
  house: { es: 'Casa', en: 'House' },
  boss: { es: 'Jefe', en: 'Boss' },
  lastDuel: { es: 'El último duelo', en: 'The last duel' },
  faced: { es: 'Último duelo · {name}', en: 'Last duel · {name}' },
  roster: { es: 'Rivales confirmados', en: 'Known opponents' },
  prepare: { es: 'Preparar el equipo', en: 'Prepare the team' },
  details: { es: 'Consultar la amenaza', en: 'Inspect the threat' },
  facts: { es: 'En este combate', en: 'In this battle' },
  bean: { es: 'Gragea activada', en: 'Bean activated' },
  healing: { es: 'Curación registrada', en: 'Recorded healing' },
  synergy: { es: 'Sinergia activada', en: 'Synergy activated' },
  beanFact: { es: '{name} · {flavour}', en: '{name} · {flavour}' },
  healingFact: { es: '{name} · +{amount} PV · {source}', en: '{name} · +{amount} HP · {source}' },
  synergyFact: { es: '{affinity} · {members} integrantes', en: '{affinity} · {members} members' },
  beanDescription: { es: 'Se activó {flavour} en {name}.', en: '{flavour} activated on {name}.' },
  healingDescription: {
    es: '{name} recuperó {amount} PV mediante {source}.',
    en: '{name} recovered {amount} HP through {source}.',
  },
  synergyDescription: {
    es: 'Se activó {affinity} al comenzar el combate con {members} integrantes.',
    en: '{affinity} activated at battle start with {members} members.',
  },
  mint: { es: 'Menta dulce', en: 'Sweet mint' },
  pepper: { es: 'Pimienta volcánica', en: 'Volcanic pepper' },
  earth: { es: 'Tierra podrida', en: 'Rotten earth' },
  soap: { es: 'Jabón', en: 'Soap' },
  alchemy: { es: 'Alquimia', en: 'Alchemy' },
  fire: { es: 'Fuego', en: 'Fire' },
  shadows: { es: 'Sombras', en: 'Shadows' },
  neutral: { es: 'Sin afinidad', en: 'Neutral' },
  equipment: { es: 'Varita', en: 'Wand' },
  companion: { es: 'Compañero', en: 'Companion' },
  positionedName: { es: '{name} · {position}', en: '{name} · {position}' },
} as const;
export type BossMessageKey = keyof typeof messages;
export function bossText(
  language: Language,
  key: BossMessageKey,
  values: Record<string, string | number> = {},
): string {
  return messages[key][language].replace(/\{(\w+)\}/g, (token, name: string) =>
    String(values[name] ?? token),
  );
}
