import type { Language } from '../domain/collection/wizards';

const messages = {
  reference: { es: 'Probar para…', en: 'Try for…' },
  copy: { es: '{name} · copia {number}', en: '{name} · copy {number}' },
  noCopies: {
    es: 'Necesitas una copia propia para comparar.',
    en: 'An owned copy is needed to compare.',
  },
  current: { es: 'Equipada', en: 'Equipped' },
  proposed: { es: 'Receta', en: 'Recipe' },
  noWand: { es: 'Sin varita', en: 'No wand' },
  compare: { es: 'Actual → receta', en: 'Current → recipe' },
  spell: { es: 'Potencia', en: 'Spell power' },
  initiative: { es: 'Iniciativa', en: 'Initiative' },
  recovery: { es: 'PV por turno', en: 'HP per turn' },
  details: { es: 'Antes de forjar', en: 'Before forging' },
  forgeSeparate: {
    es: 'Comparar no guarda cambios. Forjar crea una varita; después puedes equiparla en preparación.',
    en: 'Comparing saves no changes. Forging creates a wand; equip it afterwards in preparation.',
  },
  condition: {
    es: '{hp}/{maxHp} PV · {mana}/{maxMana} PM',
    en: '{hp}/{maxHp} HP · {mana}/{maxMana} MP',
  },
  fullHealth: {
    es: 'PV completos: la curación solo será útil tras recibir daño.',
    en: 'Full HP: recovery only helps after taking damage.',
  },
  fallen: {
    es: 'Está caído. Una varita no lo revive.',
    en: 'Fallen. A wand does not revive them.',
  },
  tradeoff: {
    es: 'Más potencia, actuar antes o recuperar PV son ventajas distintas. Esta comparación no predice el combate.',
    en: 'More spell power, acting sooner and recovering HP offer different advantages. This comparison does not predict combat.',
  },
  baseValues: {
    es: 'Valores del equipo antes de afinidades, grageas y redondeo del combate.',
    en: 'Equipment values before affinities, beans and combat rounding.',
  },
  legacy: {
    es: 'Esta expedición conserva sus reglas: la iniciativa y curación de esta receta se aplican en una nueva expedición.',
    en: 'This expedition keeps its rules: this recipe’s initiative and recovery apply on a new expedition.',
  },
  nextRun: { es: 'En una nueva expedición', en: 'On a new expedition' },
  unknown: { es: 'Sabor desconocido', en: 'Unknown flavour' },
  stock: { es: 'Existencias ×{count}', en: 'In stock ×{count}' },
  preserve: {
    es: 'Asignar es opcional. Puedes conservar el tarro.',
    en: 'Assignment is optional. You can keep the jar.',
  },
  risk: {
    es: '{probability} de tierra o jabón: pueden perjudicar al portador.',
    en: '{probability} chance of earth or soap: they can hinder the carrier.',
  },
  mint: {
    es: 'Si sale menta: recuperaría {value} PV ahora.',
    en: 'If mint is drawn: would restore {value} HP now.',
  },
  mintFull: {
    es: 'Si sale menta: con sus PV completos no recuperaría nada.',
    en: 'If mint is drawn: at full HP it would restore nothing.',
  },
  unknownAgain: {
    es: 'Descubrir un sabor no permite elegirlo. Cada tarro sin usar sigue siendo aleatorio.',
    en: 'Discovering a flavour does not let you choose it. Every unused jar remains random.',
  },
  confirmedOnly: {
    es: 'El combate confirmado consume el tarro y registra su sabor.',
    en: 'Confirmed combat consumes the jar and records its flavour.',
  },
  distribution: { es: 'Posibilidades · tabla {version}', en: 'Possibilities · table {version}' },
  draftCompact: { es: 'Borrador {count}', en: 'Draft {count}' },
  draft: { es: '{count} asignados · sin consumir', en: '{count} assigned · not consumed' },
  draftOne: { es: '1 asignado · sin consumir', en: '1 assigned · not consumed' },
} as const;

export function commercePrepText(
  language: Language,
  key: keyof typeof messages,
  values: Record<string, string | number> = {},
) {
  return messages[key][language].replace(/\{(\w+)\}/g, (token, name: string) =>
    String(values[name] ?? token),
  );
}
