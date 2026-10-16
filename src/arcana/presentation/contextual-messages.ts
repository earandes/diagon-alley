import type { Language } from '../domain/collection/wizards';
const messages = {
  prepareBoss: { es: 'Preparar jefe', en: 'Prepare boss' },
  prepareDuel: { es: 'Preparar duelo', en: 'Prepare duel' },
  pickJar: { es: 'Elige un tarro', en: 'Choose a jar' },
  pickCarrier: { es: 'Elige portador', en: 'Choose a carrier' },
  jar: { es: 'Tarro {number}', en: 'Jar {number}' },
  assign: {
    es: 'Asignar tarro {number} a {name}, puesto {position}',
    en: 'Assign jar {number} to {name}, position {position}',
  },
  remove: {
    es: 'Retirar tarro {number} de {name}, puesto {position}',
    en: 'Remove jar {number} from {name}, position {position}',
  },
  unknown: { es: 'Afinidad no registrada', en: 'Affinity not recorded' },
  consumedOnBattle: {
    es: 'Se usa al iniciar combate. El sabor es aleatorio; asignar o cancelar no consume.',
    en: 'Used when combat starts. Flavour is random; assigning or cancelling consumes nothing.',
  },
  draftOne: { es: '1 asignado · borrador', en: '1 assigned · draft' },
  draft: { es: '{count} asignados · borrador', en: '{count} assigned · draft' },
  emptyJar: { es: 'No quedan tarros', en: 'No jars left' },
  beansDestination: { es: 'Tu tarro está guardado', en: 'Your jar is saved' },
  beansNext: {
    es: 'Elige un Duelo o Jefe en el mapa para asignarlo.',
    en: 'Choose a Duel or Boss on the map to assign it.',
  },
  returnMap: { es: 'Volver a la ruta', en: 'Return to the route' },
  formationPreview: { es: 'Sinergias del equipo', en: 'Team synergies' },
  noSynergy: { es: 'Sin sinergias activas', en: 'No active synergies' },
  alchemy: { es: 'Alquimia', en: 'Alchemy' },
  fire: { es: 'Fuego', en: 'Fire' },
  shadows: { es: 'Sombras', en: 'Shadows' },
  neutral: { es: 'Neutral', en: 'Neutral' },
  synergyAlchemy: {
    es: '+{value} PV por acción · todo el equipo',
    en: '+{value} HP each action · whole team',
  },
  synergyFire: {
    es: '{value} de quemadura · todo el equipo',
    en: '{value} burn damage · whole team',
  },
  synergyShadows: {
    es: '+{value} iniciativa · todo el equipo',
    en: '+{value} initiative · whole team',
  },
  comparison: { es: 'Actual → propuesta', en: 'Current → proposed' },
  spellPower: { es: 'Potencia del hechizo', en: 'Spell power' },
  initiative: { es: 'Iniciativa', en: 'Initiative' },
  savedGear: {
    es: 'Equipar guarda el cambio. Cerrar no lo revierte.',
    en: 'Equipping saves the change. Closing does not undo it.',
  },
  baseToGear: { es: 'Base → con equipo', en: 'Base → equipped' },
  fallen: { es: 'Caído', en: 'Fallen' },
  owned: { es: 'Copia propia', en: 'Owned copy' },
  temporary: { es: 'Solo esta expedición', en: 'This expedition only' },
} as const;
export function contextualText(
  language: Language,
  key: keyof typeof messages,
  values: Record<string, string | number> = {},
) {
  return messages[key][language].replace(/\{(\w+)\}/g, (token, name: string) =>
    String(values[name] ?? token),
  );
}
