import type { Language } from '../domain/collection/wizards';

const messages = {
  es: {
    collection: 'Colección actual',
    archive: 'Archivo · {count}',
    source: 'La primera victoria de este jefe aún puede entregar una llave.',
    routeSource: 'La ruta tiene una oportunidad de obtener una llave. Consulta sus condiciones.',
    used: 'Bóveda visitada. No quedan fuentes de llave disponibles en el contenido actual.',
    unavailable: 'No quedan fuentes de llave disponibles en el contenido actual.',
    unknown: 'No hay información suficiente para indicar una fuente de llaves.',
    plan: 'Preparar otra expedición',
    continueRoute: 'Volver a la ruta',
    findSource: 'Consultar la ruta',
  },
  en: {
    collection: 'Current collection',
    archive: 'Archive · {count}',
    source: 'This boss’s first victory can still grant a key.',
    routeSource: 'The route has a chance to obtain a key. Check its conditions.',
    used: 'Vault visited. No key sources remain in the current content.',
    unavailable: 'No key sources remain in the current content.',
    unknown: 'There is not enough information to identify a key source.',
    plan: 'Prepare another expedition',
    continueRoute: 'Return to the route',
    findSource: 'Inspect the route',
  },
} as const;

export function progressVaultText(
  language: Language,
  key: keyof typeof messages.es,
  values: Record<string, string | number> = {},
) {
  return Object.entries(values).reduce(
    (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
    messages[language][key] as string,
  );
}
