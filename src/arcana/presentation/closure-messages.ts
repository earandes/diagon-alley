import type { Language } from '../domain/collection/wizards';
const messages = {
  won: { es: 'Expedición completada', en: 'Expedition complete' },
  lost: { es: 'Expedición terminada', en: 'Expedition ended' },
  draw: { es: 'Empate', en: 'Draw' },
  vault: { es: 'Visitar {name}', en: 'Visit {name}' },
  frog: { es: 'Abrir 1 · {name}', en: 'Open 1 · {name}' },
  noCharge: { es: 'Ya la tienes · sin monedas', en: 'Already owned · no coins' },
  equipment: { es: 'Preparar el equipo', en: 'Prepare equipment' },
  prepare: { es: 'Otra expedición', en: 'Another expedition' },
  prepareHint: { es: 'Elige tus copias y su equipo', en: 'Choose your copies and equipment' },
  spoils: { es: 'Botín ganado', en: 'Earned treasure' },
  details: { es: 'Tu recorrido', en: 'Your journey' },
  companions: { es: 'Compañeros de esta expedición', en: 'Companions on this expedition' },
  owned: { es: 'Copia propia', en: 'Owned copy' },
  temporary: { es: 'Solo esta expedición', en: 'This expedition only' },
  kept: { es: 'Conservas tus cromos y tu equipo. Los aliados temporales terminan aquí su viaje.',
    en: 'You keep your cards and equipment. Temporary companions finish their journey here.' },
  repeated: { es: 'Victoria repetida', en: 'Repeat victory' },
  available: { es: 'Disponible: {count}', en: 'Available: {count}' },
  wallet: { es: 'Recursos guardados', en: 'Saved resources' },
} as const;
export function closureText(language: Language, key: keyof typeof messages,
  values: Record<string, string | number> = {}) {
  return messages[key][language].replace(/\{(\w+)\}/g, (token, name: string) => String(values[name] ?? token));
}
