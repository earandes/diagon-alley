import type { Language } from '../domain/collection/wizards';

const messages = {
  register: { es: 'Crear cuenta', en: 'Create account' },
  login: { es: 'Iniciar sesión', en: 'Sign in' },
  guest: { es: 'Jugar como invitado', en: 'Play as guest' },
  guestHint: {
    es: 'Puedes guardar tu partida con una cuenta más adelante. Sin vincularla, perder la sesión puede impedir recuperarla.',
    en: 'You can save your game with an account later. Until linked, losing the session may prevent recovery.',
  },
  save: { es: 'Guardar mi partida', en: 'Save my game' },
  account: { es: 'Mi cuenta', en: 'My account' },
  access: { es: 'Acceder a mi cuenta', en: 'Account access' },
  email: { es: 'Correo electrónico', en: 'Email' },
  password: { es: 'Contraseña', en: 'Password' },
  passwordHint: {
    es: 'Entre 15 y 128 caracteres. Puedes pegarla o usar un gestor de contraseñas.',
    en: '15 to 128 characters. You can paste it or use a password manager.',
  },
  token: { es: 'Código del correo', en: 'Email token' },
  show: { es: 'Mostrar contraseña', en: 'Show password' },
  hide: { es: 'Ocultar contraseña', en: 'Hide password' },
  close: { es: 'Volver al juego', en: 'Back to game' },
  cancel: { es: 'Volver', en: 'Back' },
  sending: { es: 'Conectando…', en: 'Connecting…' },
  verify: { es: 'Verificar y guardar', en: 'Verify and save' },
  verifyTitle: { es: 'Verifica tu correo', en: 'Verify your email' },
  registerHelp: {
    es: 'Te enviaremos un código para verificar el correo y elegir una contraseña. Tu partida actual se conserva.',
    en: 'We will email a token to verify your address and choose a password. Your current game is preserved.',
  },
  mailSent: {
    es: 'Si la solicitud es válida, recibirás un correo con el código y su caducidad. Revisa también la carpeta de correo no deseado.',
    en: 'If the request is valid, you will receive an email with a token and its expiry. Check your spam folder too.',
  },
  haveCode: { es: 'Tengo el código', en: 'I have the token' },
  forgot: { es: 'Olvidé mi contraseña', en: 'Forgot password' },
  requestReset: { es: 'Enviar recuperación', en: 'Send recovery email' },
  resetTitle: { es: 'Recuperar acceso', en: 'Recover access' },
  reset: { es: 'Guardar nueva contraseña', en: 'Save new password' },
  resetDone: {
    es: 'Contraseña actualizada. Inicia sesión para recuperar tu partida.',
    en: 'Password updated. Sign in to recover your game.',
  },
  linked: {
    es: 'Tu colección y avance están vinculados a esta cuenta.',
    en: 'Your collection and progress are linked to this account.',
  },
  logout: { es: 'Cerrar sesión', en: 'Sign out' },
  logoutHelp: {
    es: 'Tu avance permanece en el servidor. Necesitarás volver a identificarte para recuperarlo.',
    en: 'Your progress stays on the server. You will need to sign in again to recover it.',
  },
  switchHelp: {
    es: 'Entrar en una cuenta existente abre su partida. No se fusionan los cromos. La partida invitada permanece guardada, pero sin cuenta ni sesión válida no se garantiza volver a acceder a ella.',
    en: 'Signing into an existing account opens its game. Collections are not merged. The guest game remains stored, but access is not guaranteed without an account or valid session.',
  },
  switchAccountHelp: {
    es: 'Puedes volver a identificarte en esta cuenta. Para abrir otra partida, elige expresamente cambiar de cuenta. No se fusiona el progreso.',
    en: 'You can sign back into this account. To open another game, explicitly choose to switch accounts. Progress is not merged.',
  },
  allowSwitch: { es: 'Abrir otra partida guardada', en: 'Open another saved game' },
  sameOwner: { es: 'Recuperar esta partida', en: 'Recover this game' },
  switchChosen: {
    es: 'Se abrirá la partida de la cuenta indicada.',
    en: 'The entered account’s game will be opened.',
  },
  pending: {
    es: 'Hay una operación pendiente. Solo puedes identificarte como su mismo propietario para recuperarla.',
    en: 'An operation is pending. Sign in as the same owner to recover it.',
  },
  blocked: {
    es: 'Primero termina o recupera la operación actual. Tu partida y su clave se conservan.',
    en: 'Finish or recover the current operation first. Your game and its operation key are retained.',
  },
  offline: {
    es: 'Necesitas conexión para acceder a tu cuenta.',
    en: 'Connect to access your account.',
  },
  invalid: {
    es: 'No se ha podido verificar el acceso. Revisa tus datos o solicita un nuevo código.',
    en: 'Access could not be verified. Check your details or request a new token.',
  },
  rate: {
    es: 'Demasiados intentos. Espera antes de volver a intentarlo.',
    en: 'Too many attempts. Wait before trying again.',
  },
  conflict: {
    es: 'Esta cuenta pertenece a otra partida. Elige expresamente abrirla; la partida actual no se fusionará.',
    en: 'This account belongs to another game. Explicitly choose to open it; the current game will not be merged.',
  },
  uncertain: {
    es: 'No llegó la respuesta. Comprueba la sesión antes de volver a enviar; no se ha descartado tu partida.',
    en: 'The response did not arrive. Check the session before sending again; your game has not been discarded.',
  },
  check: { es: 'Comprobar sesión', en: 'Check session' },
  failed: {
    es: 'No se pudo conectar. Conservamos tu partida. Vuelve a intentarlo cuando haya conexión.',
    en: 'Could not connect. Your game is retained. Try again when connected.',
  },
  unavailable: {
    es: 'El acceso a cuentas no está disponible. Puedes volver a comprobarlo.',
    en: 'Account access is unavailable. You can check again.',
  },
} as const;
export type AccountMessage = keyof typeof messages;
export const accountText = (language: Language, key: AccountMessage): string =>
  messages[key][language];
export function accountError(language: Language, code: string): string {
  const key: AccountMessage =
    code === 'RATE_LIMITED'
      ? 'rate'
      : code === 'PLAYER_MISMATCH' || code === 'ACCOUNT_CONFLICT'
        ? 'conflict'
        : code === 'OPERATION_PENDING' || code === 'CLIENT_STORAGE'
          ? 'blocked'
          : code === 'NETWORK_ERROR'
            ? 'uncertain'
            : code === 'AUTH_UNAVAILABLE' || code === 'INTERNAL_ERROR' || code === 'STORAGE'
              ? 'unavailable'
              : 'invalid';
  return accountText(language, key);
}
