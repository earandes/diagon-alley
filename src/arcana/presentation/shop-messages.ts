import type { Language } from '../domain/collection/wizards';

const messages = {
  chooseDoor: { es: 'Elige un escaparate', en: 'Choose a shop window' },
  street: { es: 'Volver al callejón', en: 'Back to the alley' },
  enterShop: { es: 'Entrar', en: 'Enter' },
  sweets: { es: 'Dulces y descubrimientos', en: 'Sweets and discoveries' },
  wands: { es: 'Maderas y núcleos', en: 'Woods and cores' },
  treasure: { es: 'Llaves y tesoros', en: 'Keys and treasures' },
  ledger: { es: 'Consultar el catálogo de cromos', en: 'Read the card catalogue' },
  vaultLedger: { es: 'Consultar el libro de botines', en: 'Read the treasure ledger' },
  equipmentCase: { es: 'Abrir tu estuche de equipo', en: 'Open your equipment case' },
  closeBook: { es: 'Cerrar el libro', en: 'Close the book' },
  buy: { es: 'Comprar', en: 'Buy' },
  available: { es: 'Disponibles', en: 'Available' },
  buyOpen: { es: 'Comprar y abrir', en: 'Buy and open' },
  buyOpenLabel: {
    es: 'Comprar y abrir 1 · {value} {currency}',
    en: 'Buy and open 1 · {value} {currency}',
  },
  openOwned: { es: 'Abrir 1', en: 'Open 1' },
  openOwnedLabel: {
    es: 'Abrir 1 que ya tienes. Sin coste adicional.',
    en: 'Open 1 you already own. No additional cost.',
  },
  noCharge: { es: 'Sin coste extra', en: 'No extra cost' },
  moreBeans: { es: 'Otra gragea · {value}', en: 'Another bean · {value}' },
  beansInfo: { es: 'Cómo usar tus grageas', en: 'How to use your beans' },
  info: { es: 'Información', en: 'Information' },
  beanStepBuy: { es: 'Consigue una gragea', en: 'Get a bean' },
  beanStepAssign: { es: 'Asígnala antes de un duelo', en: 'Assign it before a duel' },
  beanStepDiscover: {
    es: 'Descubre su sabor al activarse',
    en: 'Discover its flavour when it activates',
  },
  beanNote: {
    es: 'Puede ayudar o perjudicar. Cada gragea se consume al usarse en combate; comprarla aún no descubre un sabor.',
    en: 'It may help or hinder. Each bean is consumed when used in combat; buying it does not discover a flavour yet.',
  },
  beansNext: { es: 'Llévalas a tu próximo duelo', en: 'Take them into your next duel' },
  alleyShort: { es: 'Callejón', en: 'Alley' },
  sealed: { es: 'Romper el sello', en: 'Break the seal' },
  keySlot: { es: 'Inserta una llave', en: 'Insert a key' },
  vaultLocked: { es: 'La bóveda espera una llave', en: 'The vault awaits a key' },
  keysCount: { es: 'Llaves disponibles: {count}', en: 'Available keys: {count}' },
  findKey: { es: 'Buscar al jefe en el mapa', en: 'Find the boss on the map' },
  noEquipment: { es: 'El estuche está vacío.', en: 'Your case is empty.' },
  forge: { es: 'Forjar', en: 'Forge' },
  confirmKey: { es: 'Usar 1 llave', en: 'Use 1 key' },
  checkLoot: { es: 'Botines', en: 'Treasures' },
  checkCards: { es: 'Cromos', en: 'Cards' },
  yourGear: { es: 'Tu equipo', en: 'Your gear' },
  prepareGear: { es: 'Preparar equipo', en: 'Prepare team' },
} as const;

export function shopText(
  language: Language,
  key: keyof typeof messages,
  values: Record<string, string | number> = {},
): string {
  return messages[key][language].replace(/\{(\w+)\}/g, (token, parameter: string) =>
    String(values[parameter] ?? token),
  );
}
