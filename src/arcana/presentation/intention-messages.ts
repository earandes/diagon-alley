import type { Language } from '../domain/collection/wizards';
const messages = {
  heading: { es: 'Tu próxima intención', en: 'Your next intention' },
  hint: {
    es: 'Una idea para tu próxima ruta. Sin premio añadido.',
    en: 'A plan for your next route. No added reward.',
  },
  companion: { es: 'Otra compañía', en: 'Different company' },
  companionDetail: {
    es: 'Lleva a {name} a un combate de la próxima expedición. Ya tienes su copia; no se añade al equipo automáticamente.',
    en: 'Bring {name} into a battle in your next expedition. You own this card; it is not added to your team automatically.',
  },
  synergy: { es: 'Otra sinergia', en: 'Another synergy' },
  synergyDetail: {
    es: 'Activa {affinity} al empezar un combate de la próxima expedición. Tus copias permiten formarla; elige su composición al preparar.',
    en: 'Activate {affinity} at the start of a battle in your next expedition. Your owned copies can form it; choose your lineup when preparing.',
  },
  bean: { es: 'Prueba un sabor', en: 'Try a flavour' },
  beanDetail: {
    es: 'Asigna una gragea y actívala en un combate de la próxima expedición. Puede repetir sabor; comprar o asignar no lo descubre.',
    en: 'Assign a bean and activate it in a battle in your next expedition. Its flavour may repeat; buying or assigning does not discover it.',
  },
  ownBean: { es: 'Ya tienes una gragea', en: 'You already own a bean' },
  buyBean: { es: 'Necesitas comprar una gragea · {cost}', en: 'Buy a bean first · {cost}' },
  choose: { es: 'Elegir {name}', en: 'Choose {name}' },
  selected: { es: 'Elegida', en: 'Selected' },
  active: { es: 'En esta ruta', en: 'On this route' },
  completed: { es: 'Intención realizada', en: 'Intention fulfilled' },
  ended: { es: 'Ruta terminada · sin completar', en: 'Route ended · not completed' },
  unavailable: { es: 'Revisa tu intención', en: 'Review your intention' },
  unavailableDetail: {
    es: 'La preparación disponible ha cambiado. Puedes cambiar esta intención o continuar sin ella.',
    en: 'The available preparation has changed. You can change this intention or continue without it.',
  },
  cancel: { es: 'Dejar esta intención', en: 'Leave this intention' },
  details: { es: 'Cómo intentarlo', en: 'How to try it' },
  alchemy: { es: 'Alquimia III', en: 'Alchemy III' },
  fire: { es: 'Fuego II', en: 'Fire II' },
  shadows: { es: 'Sombras I', en: 'Shadows I' },
} as const;
export function intentionText(
  language: Language,
  key: keyof typeof messages,
  values: Record<string, string | number> = {},
) {
  return messages[key][language].replace(/\{(\w+)\}/g, (token, name: string) =>
    String(values[name] ?? token),
  );
}
