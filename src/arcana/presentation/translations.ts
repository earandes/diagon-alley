import { activePack } from './content-packs/active';
import { packMessage } from './content-packs/contract';
export const messages = activePack.messages;
export type MessageKey = keyof typeof messages;
export function text(
  language: 'es' | 'en',
  key: MessageKey,
  values: Record<string, string | number> = {},
): string {
  return packMessage(activePack, language, key, values);
}
export function savedCopies(language: 'es' | 'en', count: number): string {
  return text(
    language,
    new Intl.PluralRules(language).select(count) === 'one' ? 'savedCopy' : 'savedCopies',
    { count: new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US').format(count) },
  );
}
