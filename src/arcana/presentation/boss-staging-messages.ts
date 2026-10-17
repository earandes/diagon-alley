import type { Language } from '../domain/collection/wizards';
const messages = {
  party: { es: 'Tu equipo', en: 'Your team' },
  prepare: { es: 'Preparar equipo', en: 'Prepare team' },
  member: {
    es: 'Preparar {name}, puesto {position}. {source}. PV {hp}/{maxHp}, PM {mana}/{maxMana}. {equipment} {bean}',
    en: 'Prepare {name}, position {position}. {source}. HP {hp}/{maxHp}, MP {mana}/{maxMana}. {equipment} {bean}',
  },
  gear: { es: 'Equipo: {items}.', en: 'Equipment: {items}.' },
  bean: { es: 'Gragea asignada en borrador.', en: 'Bean assigned in draft.' },
  fallen: { es: 'Caído', en: 'Fallen' },
  health: { es: 'PV', en: 'HP' },
  mana: { es: 'PM', en: 'MP' },
} as const;
export function bossStagingText(
  language: Language,
  key: keyof typeof messages,
  values: Record<string, string | number> = {},
) {
  return messages[key][language].replace(/\{(\w+)\}/g, (token, name: string) =>
    String(values[name] ?? token),
  );
}
