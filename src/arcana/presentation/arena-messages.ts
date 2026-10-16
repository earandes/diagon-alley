import type { Language } from '../domain/collection/wizards';
const messages = {
  es: {
    saved: 'Combate guardado',
    continue: 'Continuar',
    savedHelp:
      'La reproducción no cambia la condición, el inventario ni las recompensas guardadas.',
    round: 'Ronda',
    inspect: 'Inspeccionar',
    record: 'Registro',
    controls: 'Reproducción del combate',
    delta: 'Cambio de PV',
    savedResources: 'Recursos guardados',
  },
  en: {
    saved: 'Battle saved',
    continue: 'Continue',
    savedHelp: 'Playback does not change saved condition, inventory or rewards.',
    round: 'Round',
    inspect: 'Inspect',
    record: 'Record',
    controls: 'Battle playback',
    delta: 'HP change',
    savedResources: 'Saved resources',
  },
} as const;
export const arenaText = (language: Language, key: keyof typeof messages.es) =>
  messages[language][key];
