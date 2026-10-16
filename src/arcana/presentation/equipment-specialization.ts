import type { Language } from '../domain/collection/wizards';
import type { EquipmentBlueprint } from '../domain/economy/commerce';
import type { Equipment } from '../domain/economy/equipment';
const messages = {
  initiative: {
    es: 'Iniciativa +{value} · daño ×{damage}',
    en: 'Initiative +{value} · damage ×{damage}',
  },
  sustain: {
    es: 'Recupera {value} PV/turno · daño ×{damage}',
    en: 'Restore {value} HP/turn · damage ×{damage}',
  },
  legacy: { es: 'En la próxima expedición', en: 'On the next expedition' },
  healing: { es: 'PV/turno', en: 'HP/turn' },
} as const;
export function equipmentSpecialization(
  item: Equipment | EquipmentBlueprint,
  language: Language,
): string | null {
  if (item.kind !== 'wand') return null;
  const key = item.healing ? 'sustain' : item.initiativeBonus ? 'initiative' : null;
  if (!key) return null;
  const format = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US');
  return messages[key][language]
    .replace('{value}', format.format(item.healing ?? item.initiativeBonus ?? 0))
    .replace('{damage}', format.format(item.multiplier));
}
export function equipmentSpecializationText(key: 'legacy' | 'healing', language: Language) {
  return messages[key][language];
}
