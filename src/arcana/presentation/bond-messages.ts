import type { Language } from '../domain/collection/wizards';
export const bondMessages = {
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
    es: 'Un vínculo por equipo. Automático prioriza una casa activa; después {order}, {death} y {creatures}. Cambiar aquí es un borrador: guarda o confirma la preparación.',
    en: 'One bond per team. Automatic prefers an active house, then {order}, {death} and {creatures}. This is a draft: save or confirm preparation.',
  },
  history: {
    es: 'Afiliaciones de su historia; solo el vínculo elegido activa su bono.',
    en: 'Historical affiliations; only the chosen bond activates its bonus.',
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
