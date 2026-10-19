import type { Language } from '../domain/collection/wizards';
const messages = {
  es: {
    objective: 'Mi próximo descubrimiento',
    track: 'Seguir este cromo',
    clear: 'Quitar objetivo',
    acquired: 'Cromo obtenido',
    archived: 'Fuente no disponible',
    searching: 'Por descubrir',
    pending: 'Cromo pendiente {number}',
    consult: 'Consultar cromo pendiente {number}',
    own: '{product}: copia propia',
    temporary: 'Pacto: aliado temporal',
    probability: '{chance} por apertura · tabla {version}',
    unavailable: 'No hay una fuente de obtención vigente.',
    unknown: 'Consulta la fuente cuando el contenido esté disponible.',
    opportunity: 'Puede aparecer en las ofertas públicas. No entrega una copia.',
    help: 'Un objetivo personal, sin premio, guardado en este navegador. La colección se consulta siempre desde tu partida guardada.',
    session: 'Marcapáginas solo en esta sesión: no se pudo guardar.',
    source: 'Cómo obtenerlo',
    acquire: 'Ir a la confitería',
    tracked: 'Objetivo seleccionado',
    counts: '{owned} de {total} identidades de este grupo',
    sourceHelp:
      'La apertura es aleatoria: este objetivo no cambia sus probabilidades. El acabado no añade otra identidad.',
  },
  en: {
    objective: 'My next discovery',
    track: 'Track this card',
    clear: 'Clear goal',
    acquired: 'Card acquired',
    archived: 'Source unavailable',
    searching: 'Undiscovered',
    pending: 'Undiscovered card {number}',
    consult: 'Inspect undiscovered card {number}',
    own: '{product}: owned copy',
    temporary: 'Pact: temporary ally',
    probability: '{chance} per opening · table {version}',
    unavailable: 'No current acquisition source.',
    unknown: 'Check the source when content is available.',
    opportunity: 'May appear among public offers. Does not grant an owned copy.',
    help: 'A personal goal, without a reward, saved in this browser. Your collection is always read from your saved game.',
    session: 'Bookmark for this session only: saving failed.',
    source: 'How to obtain it',
    acquire: 'Go to the sweet shop',
    tracked: 'Selected goal',
    counts: '{owned} of {total} identities in this group',
    sourceHelp:
      'The opening is random: this goal does not change its probabilities. A finish does not add another identity.',
  },
} as const;
export function collectionGoalText(
  language: Language,
  key: keyof typeof messages.es,
  values: Record<string, string | number> = {},
) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    messages[language][key] as string,
  );
}
