import type { Language } from '../domain/collection/wizards';

const messages = {
  ownedShort: { es: 'Propio', en: 'Owned' },
  temporaryShort: { es: 'Temporal', en: 'Temporary' },
  memberIdentity: { es: 'Puesto {position} · {source}', en: 'Position {position} · {source}' },
  memberLabel: {
    es: '{name}, puesto {position}, {source}',
    en: '{name}, position {position}, {source}',
  },
  healer: { es: 'Un remedio a tiempo', en: 'A timely remedy' },
  scholar: { es: 'El precio del conocimiento', en: 'The price of knowledge' },
  one: { es: 'Un integrante', en: 'One companion' },
  team: { es: 'Todo el equipo', en: 'The whole team' },
  restoreHp: { es: 'Recuperar PV', en: 'Restore HP' },
  restoreMana: { es: 'Recuperar PM', en: 'Restore MP' },
  healerDetail: {
    es: 'Recuperas PV a cambio de PM. Elige atención individual o un remedio para todos.',
    en: 'Restore HP in exchange for MP. Choose individual care or a remedy for everyone.',
  },
  scholarDetail: {
    es: 'Recuperas PM a cambio de PV. Elige un integrante o comparte el conocimiento con el equipo.',
    en: 'Restore MP in exchange for HP. Choose one companion or share the knowledge with your team.',
  },
  chooseUnit: { es: 'Elige quién recibe el trato', en: 'Choose who receives the deal' },
  noBenefit: { es: 'Ya está al máximo', en: 'Already at maximum' },
  insufficientCondition: { es: 'Condición insuficiente', en: 'Insufficient condition' },
  chooseOption: { es: 'Elige un trato', en: 'Choose a deal' },
  fallen: { es: 'Caído · necesita un Refugio', en: 'Fallen · needs a Refuge' },
  noRevive: {
    es: 'Solo integrantes en pie. El coste nunca puede dejarlos a 0 PV.',
    en: 'Standing companions only. The cost can never leave them at 0 HP.',
  },
  exactCost: {
    es: 'Se paga el coste completo aunque la recuperación llegue al máximo.',
    en: 'The full cost is paid even when recovery reaches the maximum.',
  },
  accept: { es: 'Aceptar trato', en: 'Accept deal' },
  choose: { es: 'Elige tu trato', en: 'Choose your deal' },
  confirmed: { es: 'Trato confirmado', en: 'Deal confirmed' },
  confirmedScope: { es: 'Trato confirmado · {scope}', en: 'Deal confirmed · {scope}' },
  companion: { es: 'Integrante {number}', en: 'Companion {number}' },
  maximum: {
    es: 'Los porcentajes se calculan sobre los máximos de cada integrante.',
    en: 'Percentages use each companion’s maximum values.',
  },
  preview: { es: 'Antes de confirmar', en: 'Before confirming' },
  cost: { es: 'Entregas', en: 'You give' },
  benefit: { es: 'Recibes', en: 'You receive' },
  free: { es: 'Sin coste', en: 'No cost' },
  health: { es: 'PV', en: 'HP' },
  mana: { es: 'PM', en: 'MP' },
  pass: { es: 'Seguir de largo', en: 'Walk on' },
  passDetail: { es: 'Avanzas sin aceptar ningún trato.', en: 'Continue without accepting a deal.' },
  inspect: { es: 'Detalles del trato', en: 'Deal details' },
  chooseHint: {
    es: 'Elige un trato para ver cómo queda tu equipo.',
    en: 'Choose a deal to preview your team.',
  },
  selectedHint: {
    es: 'La elección no se guarda hasta confirmar.',
    en: 'Your choice is saved only when you confirm.',
  },
  unavailable: { es: 'Faltan recursos', en: 'Not enough resources' },
  unchanged: {
    es: 'Tu equipo conserva su condición.',
    en: 'Your team keeps its current condition.',
  },
  change: {
    es: '{name}: {resource} {before} a {after}',
    en: '{name}: {resource} {before} to {after}',
  },
  changedTeam: { es: 'Cambio previsto en el equipo', en: 'Expected team change' },
  keepsReserves: { es: 'Las reservas no cambian.', en: 'Reserves are unchanged.' },
} as const;

export function encounterText(
  language: Language,
  key: keyof typeof messages,
  values: Record<string, string | number> = {},
): string {
  return messages[key][language].replace(/\{(\w+)\}/g, (token, name: string) =>
    String(values[name] ?? token),
  );
}
