import type { Language } from '../../domain/collection/wizards';
const messages = {
  es: {
    sound: 'Sonido',
    music: 'Ambiente musical',
    effects: 'Efectos',
    enabled: 'Activado',
    disabled: 'Desactivado',
    volume: 'Volumen',
    musicVolume: 'Volumen del ambiente',
    effectsVolume: 'Volumen de los efectos',
    retry: 'Activar sonido',
    unavailable: 'No se ha podido reproducir el sonido.',
    blocked: 'Toca para permitir el sonido en este navegador.',
    loading: 'Preparando sonido…',
    local: 'Solo en este dispositivo.',
  },
  en: {
    sound: 'Sound',
    music: 'Musical ambience',
    effects: 'Effects',
    enabled: 'On',
    disabled: 'Off',
    volume: 'Volume',
    musicVolume: 'Ambience volume',
    effectsVolume: 'Effects volume',
    retry: 'Enable sound',
    unavailable: 'Sound could not be played.',
    blocked: 'Tap to allow sound in this browser.',
    loading: 'Preparing sound…',
    local: 'On this device only.',
  },
} as const;
export const audioText = (language: Language, key: keyof typeof messages.es) =>
  messages[language][key];
