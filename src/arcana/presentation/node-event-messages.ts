import type { Language } from '../domain/collection/wizards';
import type { NodeKind } from '../domain/exploration/route';
const actions = {
  es: {
    duel: 'Iniciar duelo',
    boss: 'Desafiar al jefe',
    chest: 'Abrir cofre',
    pact: 'Confirmar pacto',
    refuge: 'Descansar',
    encounter: 'Descubrir',
  },
  en: {
    duel: 'Start duel',
    boss: 'Challenge the boss',
    chest: 'Open chest',
    pact: 'Confirm pact',
    refuge: 'Rest',
    encounter: 'Discover',
  },
} as const;
export const nodeActionLabel = (language: Language, kind: NodeKind) => actions[language][kind];
