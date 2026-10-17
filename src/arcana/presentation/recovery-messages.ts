import type { Language } from '../domain/collection/wizards';
const messages = {
  offline: {
    es: 'Sin conexión. Vuelve a conectar para consultar el estado.',
    en: 'Offline. Reconnect to check the state.',
  },
  session: { es: 'La sesión ya no permite continuar.', en: 'This session can no longer continue.' },
  pending: {
    es: 'Hay una operación pendiente. Conservamos su petición; recupera el resultado antes de empezar otra partida.',
    en: 'An operation is pending. Its request is retained; recover the result before starting another game.',
  },
  sameSession: {
    es: 'Reconsultar no crea otra cuenta ni repite el gasto.',
    en: 'Checking again does not create another account or repeat the cost.',
  },
  newTrial: { es: 'Entrar en otro ensayo', en: 'Enter another trial' },
  newTrialHelp: {
    es: 'Es una entrada explícita al ensayo. Si la sesión anterior caducó, se creará otra partida sin trasladar sus recursos.',
    en: 'This explicitly enters the trial. If the previous session expired, a separate game will be created without transferring its resources.',
  },
  check: { es: 'Comprobar sesión', en: 'Check session' },
  reload: { es: 'Volver a consultar', en: 'Check again' },
  recover: { es: 'Recuperar operación', en: 'Recover operation' },
  entering: { es: 'Entrando…', en: 'Entering…' },
  sending: { es: 'Guardando la operación…', en: 'Saving the operation…' },
  recovering: { es: 'Comprobando el resultado guardado…', en: 'Checking the saved result…' },
  entryFailed: {
    es: 'No se ha podido entrar. Puedes volver a intentarlo.',
    en: 'Entry failed. You can try again.',
  },
  rateLimited: {
    es: 'Demasiados intentos de entrada. Espera antes de intentarlo de nuevo.',
    en: 'Too many entry attempts. Wait before trying again.',
  },
} as const;
export const recoveryText = (language: Language, key: keyof typeof messages) =>
  messages[key][language];
