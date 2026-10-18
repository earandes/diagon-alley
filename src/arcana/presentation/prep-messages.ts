import type { Language } from '../domain/collection/wizards';

const messages = {
  findCompanion: { es: 'Buscar compañero', en: 'Find a companion' },
  filterAffinity: { es: 'Por afinidad', en: 'By affinity' },
  filterIdentity: { es: 'Por personaje', en: 'By character' },
  allAffinities: { es: 'Todas las afinidades', en: 'All affinities' },
  allIdentities: { es: 'Todos los personajes', en: 'All characters' },
  clearFilters: { es: 'Ver todos', en: 'Show all' },
  noMatches: {
    es: 'Sin compañeros con esta combinación.',
    en: 'No companions match this combination.',
  },
  preparation: { es: 'Prepara tu expedición', en: 'Prepare your expedition' },
  choose: { es: 'Elige quién te acompaña', en: 'Choose your companions' },
  own: { es: 'Tus cromos', en: 'Your cards' },
  owned: { es: 'Propio', en: 'Owned' },
  thisRoute: { es: 'Solo esta ruta', en: 'This route only' },
  help: { es: 'Cómo formar el equipo', en: 'How to form your team' },
  temporary: { es: 'Aliados de esta expedición', en: 'Allies for this expedition' },
  temporaryHint: {
    es: 'Te acompañan solo en esta ruta. No son copias de tu álbum.',
    en: 'They accompany you on this route only. They are not owned album copies.',
  },
  copy: { es: 'Copia {number}', en: 'Copy {number}' },
  chooseCopy: {
    es: '{name} · copia {number} · elegir o retirar',
    en: '{name} · copy {number} · select or remove',
  },
  slot: { es: 'Puesto {number} vacío', en: 'Empty slot {number}' },
  capacity: { es: '{count}/5 acompañantes', en: '{count}/5 companions' },
  minimum: {
    es: 'Elige al menos un cromo propio para explorar.',
    en: 'Choose at least one owned card to explore.',
  },
  duels: {
    es: 'Explora con 1–5. Para un duelo necesitas 3–5 aliados; los Pactos pueden ayudarte.',
    en: 'Explore with 1–5. Duels need 3–5 allies; Pacts can help.',
  },
  start: { es: 'Entrar al mapa', en: 'Enter the map' },
  save: { es: 'Confirmar formación', en: 'Confirm formation' },
  saved: { es: 'Formación guardada', en: 'Formation saved' },
  equipment: { es: 'Preparar equipo', en: 'Prepare equipment' },
  base: { es: 'Atributos del cromo', en: 'Card attributes' },
  runStats: { es: 'Estado en la expedición', en: 'Expedition condition' },
  needStanding: {
    es: 'Necesitas al menos un aliado en pie.',
    en: 'You need at least one standing ally.',
  },
  equip: { es: 'Equipar {name}', en: 'Equip {name}' },
  transfer: { es: '{name} · lo lleva {owner}', en: '{name} · carried by {owner}' },
  remove: { es: 'Sin equipar', en: 'Unequipped' },
  return: { es: 'Volver', en: 'Back' },
  consult: { es: 'Consultar {name}', en: 'Inspect {name}' },
  albumHelp: {
    es: 'Los cromos se consultan aquí. Elige tus copias y su equipo al preparar la expedición.',
    en: 'Browse cards here. Choose your copies and equipment when preparing an expedition.',
  },
  prepareLink: { es: 'Preparar expedición', en: 'Prepare expedition' },
  recipe: { es: 'El secreto de los sabores', en: 'The secret of flavours' },
  getJar: { es: 'Consigue un tarro', en: 'Get a jar' },
  assign: { es: 'Asígnalo antes del duelo', en: 'Assign it before a duel' },
  discover: { es: 'Descubre el sabor que se active', en: 'Discover the activated flavour' },
  atlas: { es: 'Atlas del viaje', en: 'Journey atlas' },
  current: { es: 'Región jugable', en: 'Playable region' },
  future: { es: 'Bosque · próximamente', en: 'Forest · coming later' },
  unlocked: {
    es: 'Acceso descubierto · ruta aún no disponible',
    en: 'Access discovered · route not yet available',
  },
  locked: {
    es: 'Derrota al jefe para descubrir el acceso',
    en: 'Defeat the boss to discover its entrance',
  },
} as const;

export function prepText(
  language: Language,
  key: keyof typeof messages,
  values: Record<string, string | number> = {},
) {
  return messages[key][language].replace(/\{(\w+)\}/g, (token, key: string) =>
    String(values[key] ?? token),
  );
}
