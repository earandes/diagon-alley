import type { Language } from '../domain/collection/wizards';
export const bondMessages = {
  magicalDuel: { es: 'Duelo mágico', en: 'Magical duel' },
  activeTier: { es: 'Activo nivel {tier}', en: 'Active tier {tier}' },
  teamBond: { es: 'Vínculo del equipo', en: 'Team bond' },
  chooseBond: { es: 'Elegir vínculo del equipo', en: 'Choose team bond' },
  bond: { es: 'Vínculo', en: 'Bond' },
  auto: { es: 'Automático', en: 'Automatic' },
  houses: { es: 'Casas', en: 'Houses' },
  classification: { es: 'Clasificación', en: 'Classification' },
  all: { es: 'Todos', en: 'All' },
  inactive: {
    es: 'Se activa con tres identidades distintas en pie; cuatro lo refuerzan.',
    en: 'Activates with three distinct standing identities; four reinforce it.',
  },
  locked: {
    es: 'Sustituye al bono de casa; la afinidad se conserva. Duplicados y acabado encantado no multiplican el conteo. Se fija al confirmar combate.',
    en: 'Replaces the house bonus; affinity remains. Duplicates and enchanted finishes do not multiply the count. Locked at combat confirmation.',
  },
  choiceHelp: {
    es: 'Un vínculo. Automático: casa activa → {order} → {death} → {creatures}. Borrador hasta guardar.',
    en: 'One bond. Automatic: active house → {order} → {death} → {creatures}. Draft until saved.',
  },
  history: {
    es: 'Afiliaciones históricas, no bonos acumulables. Los grupos sin vínculo disponible son descriptivos.',
    en: 'Historical affiliations, not stacked bonuses. Groups without an available bond are descriptive.',
  },
  gear: {
    es: 'El equipo representa un vínculo mágico con esta criatura.',
    en: 'Equipment represents a magical bond with this creature.',
  },
  receivingHelp: { es: 'Recibe ayuda', en: 'Receiving help' },
  inspect: { es: 'Consultar vínculo', en: 'Inspect bond' },
  confirmed: { es: 'Vínculos confirmados', en: 'Confirmed bonds' },
  helpEvent: {
    es: '{healer} ayuda a {recipient}: +{value} PV.',
    en: '{healer} helps {recipient}: +{value} HP.',
  },
  blockedEvent: { es: 'Amortiguado: {value}.', en: 'Blocked: {value}.' },
  finisherEvent: { es: 'Bono de remate: {value}.', en: 'Finisher bonus: {value}.' },
  orderEffect: {
    es: 'Un contribuyente ayuda hasta {value} PV a otro aliado herido, una vez por ronda. Sin autocura o resurrección.',
    en: 'A contributor helps another wounded ally for up to {value} HP, once per round. No self-heal or revival.',
  },
  deathEffect: {
    es: '+{value} daño al acertar sobre un objetivo que ya tenía la mitad de PV o menos.',
    en: '+{value} damage on a hit against a target already at half HP or less.',
  },
  creaturesEffect: {
    es: 'Cada aliado amortigua hasta {value} daño del primer impacto positivo recibido. Sin sobrante; no reduce quemadura.',
    en: 'Each ally blocks up to {value} damage from the first positive hit received. No carry-over; does not reduce burn.',
  },
  legacy: {
    es: 'Esta expedición conserva sus reglas anteriores. Los nuevos vínculos se podrán elegir en la siguiente.',
    en: 'This expedition keeps its previous rules. New bonds can be chosen on the next one.',
  },
} as const;
export function bondText(
  language: Language,
  key: keyof typeof bondMessages,
  values: Record<string, string | number> = {},
): string {
  return bondMessages[key][language].replace(/\{(\w+)\}/g, (token, name: string) =>
    String(values[name] ?? token),
  );
}
