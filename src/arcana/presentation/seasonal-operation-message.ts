import type { Language } from '../domain/collection/wizards';
import { operationErrorKey } from './operation-error';
import { text } from './translations';

const seasonalMessages = {
  EVENT_UNAVAILABLE: {
    es: 'Esta edición no permite esta acción ahora. Consulta su disponibilidad.',
    en: 'This edition does not allow this action right now. Check its availability.',
  },
  EVENT_OPPORTUNITY_USED: {
    es: 'Esta oportunidad ya está resuelta. Actualiza para ver tu progreso.',
    en: 'This opportunity is already resolved. Refresh to see your progress.',
  },
  EVENT_CONDITION: {
    es: 'Tu equipo no puede realizar esta elección ahora. Revisa su condición.',
    en: 'Your team cannot make this choice now. Review its condition.',
  },
} as const;
/** Presentation only: unknown commits keep the shared uncertainty/recovery message. */
export function seasonalOperationMessage(language: Language, code: string): string {
  return (
    seasonalMessages[code as keyof typeof seasonalMessages]?.[language] ??
    text(language, operationErrorKey(code))
  );
}
