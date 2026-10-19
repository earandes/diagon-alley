import type { BondGroup, BondMode } from '../domain/combat/bonds';
import type { Language } from '../domain/collection/wizards';
import { selectedContentPackId } from './content-packs/active';
import { Artwork } from './Artwork';
import { bondText } from './bond-messages';
import './bonds-a87.css';
const names = {
  order: {
    'diagon-alley': ['Orden del Fénix', 'Order of the Phoenix'],
    arcana: ['Concordia del Farol', 'Lantern Concord'],
  },
  death: {
    'diagon-alley': ['Mortífagos', 'Death Eaters'],
    arcana: ['Cónclave de la Máscara', 'Mask Conclave'],
  },
  army: {
    'diagon-alley': ['Ejército de Dumbledore', 'Dumbledore’s Army'],
    arcana: ['Círculo de Aprendices', 'Apprentice Circle'],
  },
  creatures: {
    'diagon-alley': ['Criaturas fantásticas', 'Fantastic creatures'],
    arcana: ['Bestiario', 'Bestiary'],
  },
} as const;
export function bondName(group: BondMode | 'army', language: Language): string {
  if (group === 'auto' || group === 'houses') return bondText(language, group);
  return names[group][selectedContentPackId()][language === 'es' ? 0 : 1];
}
export function bondEffect(group: BondGroup, value: number, language: Language) {
  return bondText(
    language,
    ({ order: 'orderEffect', death: 'deathEffect', creatures: 'creaturesEffect' } as const)[group],
    { value },
  );
}
export function BondEmblem({ group, language }: { group: BondGroup; language: Language }) {
  return (
    <span className="bond-emblem" data-bond={group}>
      <Artwork asset={`bond.${group}`} language={language} decorative />
    </span>
  );
}
