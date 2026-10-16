import type { EquipmentBlueprint } from '../domain/economy/commerce';
import type { Equipment } from '../domain/economy/equipment';
import type { Language } from '../domain/collection/wizards';
import { text } from './translations';
const woods = { birch: 'birch', willow: 'willow', elder: 'elder' } as const;
const cores = { dragon: 'dragon', phoenix: 'phoenix', wyvern: 'wyvern' } as const;
const brooms = {
  'cadet-zephyr': 'cadetZephyr',
  'zephyr-2000': 'zephyr2000',
  'wind-arrow': 'windArrow',
} as const;
export function equipmentName(item: Equipment | EquipmentBlueprint, language: Language) {
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US');
  if (item.kind === 'broom') return text(language, brooms[item.model]);
  return text(language, 'wandDescription', {
    wood: text(language, woods[item.wood]),
    core: text(language, item.core ? cores[item.core] : 'noCore'),
    bonus: numbers.format(item.powerBonus),
    multiplier: numbers.format(item.multiplier),
  });
}
