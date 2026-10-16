import type { Language } from '../domain/collection/wizards';

const messages = {
  invitation: { es: 'Una noche encantada', en: 'An enchanted night' },
  title: { es: 'La noche de los escaparates encantados', en: 'The night of the enchanted windows' },
  story: {
    es: 'Una broma ha embrujado tres escaparates. Devuélveles la luz entre etapas de tu expedición.',
    en: 'A prank has enchanted three shop windows. Restore their light between stages of your expedition.',
  },
  join: { es: 'Participar', en: 'Take part' },
  close: { es: 'Volver', en: 'Back' },
  objective: {
    es: 'Tres escaparates · una linterna para recordar',
    en: 'Three windows · a lantern to remember',
  },
  progress: {
    es: '{done} de {total} escaparates iluminados',
    en: '{done} of {total} windows illuminated',
  },
  window: { es: 'Escaparate {number}', en: 'Window {number}' },
  lit: { es: 'Iluminado', en: 'Illuminated' },
  enchanted: { es: 'Embrujado', en: 'Enchanted' },
  next: { es: 'Tu siguiente escaparate', en: 'Your next window' },
  sweetshopWindow: { es: 'Las cajas bailarinas', en: 'The dancing boxes' },
  workshopWindow: { es: 'Las escobas revoltosas', en: 'The unruly brooms' },
  vaultWindow: { es: 'La cerradura risueña', en: 'The laughing lock' },
  sweetshopStory: {
    es: 'Las cajas saltan tras el cristal. Puedes romper su hechizo o transformar su energía en un remedio para el equipo.',
    en: 'Boxes leap behind the glass. Break their spell or turn its energy into a remedy for your team.',
  },
  workshopStory: {
    es: 'Las escobas barren el techo. Puedes devolverlas a su sitio o aprovechar la broma para recuperar PV.',
    en: 'Brooms sweep the ceiling. Return them to their places or use the prank to recover HP.',
  },
  vaultStory: {
    es: 'La cerradura no deja de reír. Puedes devolver la calma al escaparate o tomar fuerzas antes de acabar.',
    en: 'The lock cannot stop laughing. Restore calm to the window or gather strength before finishing.',
  },
  dispel: { es: 'Deshacer la broma', en: 'Undo the prank' },
  dispelDetail: {
    es: 'Iluminas un escaparate. Tu equipo conserva sus PV y PM.',
    en: 'Illuminate one window. Your team keeps its HP and MP.',
  },
  prepare: { es: 'Aprovechar el hechizo', en: 'Make use of the spell' },
  prepareDetail: {
    es: 'Recuperas PV a cambio de PM. El escaparate espera: avanza un nodo para volver a intentarlo.',
    en: 'Restore HP in exchange for MP. The window waits: advance one node to try again.',
  },
  preparationEffect: { es: '+25% PV · −10% PM', en: '+25% HP · −10% MP' },
  confirmDispel: { es: 'Iluminar este escaparate', en: 'Illuminate this window' },
  confirmPrepare: { es: 'Confirmar intercambio', en: 'Confirm exchange' },
  noBenefit: { es: 'No necesitas recuperar PV.', en: 'No HP recovery needed.' },
  insufficient: { es: 'Faltan PM para este intercambio.', en: 'Not enough MP for this exchange.' },
  beforeAfter: { es: 'Tu equipo antes y después', en: 'Your team before and after' },
  hp: { es: 'PV', en: 'HP' },
  mp: { es: 'PM', en: 'MP' },
  change: {
    es: '{name}: {resource}, de {before} a {after}',
    en: '{name}: {resource}, from {before} to {after}',
  },
  selected: { es: 'Elegido', en: 'Selected' },
  draft: {
    es: 'Elige y confirma. Consultar no cambia tu equipo.',
    en: 'Choose and confirm. Looking does not change your team.',
  },
  nextNode: {
    es: 'Sigue la ruta: habrá otra oportunidad al resolver un nodo.',
    en: 'Follow the route: another opportunity appears after resolving a node.',
  },
  startHint: {
    es: 'Prepara una expedición. Los escaparates aparecen después de los dos primeros nodos.',
    en: 'Prepare an expedition. Windows appear after the first two nodes.',
  },
  earlyHint: {
    es: 'Resuelve los dos primeros nodos para encontrar el primer escaparate.',
    en: 'Resolve the first two nodes to find the first window.',
  },
  route: { es: 'Preparar expedición', en: 'Prepare expedition' },
  returnRoute: { es: 'Seguir la ruta', en: 'Follow the route' },
  complete: { es: '{place} vuelve a brillar', en: '{place} shines again' },
  completeDetail: {
    es: 'Los tres escaparates están a salvo. Tu linterna ya forma parte de tus recuerdos.',
    en: 'All three windows are safe. Your lantern is now part of your keepsakes.',
  },
  keepsake: { es: 'Linterna de la noche encantada', en: 'Lantern of the enchanted night' },
  keepsakeDetail: {
    es: 'Recuerdo permanente · sin poder ni valor económico. No cuenta para la colección principal.',
    en: 'Permanent keepsake · no power or economic value. Separate from the main collection.',
  },
  reward: {
    es: 'Recuerdo garantizado al iluminar los tres escaparates.',
    en: 'Guaranteed keepsake for illuminating all three windows.',
  },
  history: { es: 'Tus recuerdos', en: 'Your keepsakes' },
  provenance: { es: 'Halloween · {edition}', en: 'Halloween · {edition}' },
  details: { es: 'Objetivo, costes y calendario', en: 'Objective, costs and dates' },
  participationCost: {
    es: 'Participar no cuesta recursos ni inicia una expedición. Cada combate conserva su coste de 5 {energy}.',
    en: 'Joining costs no resources and does not start an expedition. Each battle keeps its cost of 5 {energy}.',
  },
  tradeRules: {
    es: 'El intercambio usa los máximos de cada integrante en pie. Solo pagan quienes recuperan PV; las reservas no cambian. No revive caídos.',
    en: 'The exchange uses each standing companion’s maximum values. Only those recovering HP pay; reserves stay unchanged. Fallen companions are not revived.',
  },
  participationDates: { es: 'Participación: {start} → {end}', en: 'Joining: {start} → {end}' },
  finishDates: {
    es: 'Expediciones vinculadas antes del cierre: hasta {end}',
    en: 'Expeditions linked before joining closes: until {end}',
  },
  serverCalendar: {
    es: 'Calendario del servidor · {timezone}',
    en: 'Server calendar · {timezone}',
  },
  upcoming: {
    es: 'La celebración todavía no ha empezado.',
    en: 'The celebration has not started yet.',
  },
  grace: {
    es: 'Participación cerrada. Puedes terminar con una expedición vinculada antes del cierre.',
    en: 'Joining is closed. You can finish with an expedition linked before the deadline.',
  },
  closed: {
    es: 'Esta edición ha terminado. El progreso y los recuerdos se conservan.',
    en: 'This edition has ended. Progress and keepsakes remain.',
  },
  unavailableRun: {
    es: 'Esta expedición no quedó vinculada antes del cierre.',
    en: 'This expedition was not linked before joining closed.',
  },
  noAutomatic: {
    es: 'Participar no compra, equipa ni elige una rama por ti.',
    en: 'Joining does not buy, equip or choose a branch for you.',
  },
  savedDispel: { es: 'Un escaparate vuelve a brillar.', en: 'A window shines again.' },
  savedPrepare: {
    es: 'Intercambio guardado. El escaparate sigue embrujado.',
    en: 'Exchange saved. The window remains enchanted.',
  },
  permanent: { es: 'Conservado para siempre', en: 'Yours to keep' },
  pending: { es: 'Guardando…', en: 'Saving…' },
  recover: { es: 'Recuperar operación', en: 'Recover operation' },
  joined: {
    es: 'Participación guardada. Busca los escaparates durante tu expedición.',
    en: 'Participation saved. Look for the windows during your expedition.',
  },
  activeEdition: {
    es: 'Primero termina la edición en curso o espera a su cierre.',
    en: 'Finish your current edition first or wait for it to close.',
  },
  historicalEdition: { es: 'Edición {edition}', en: 'Edition {edition}' },
} as const;

export type SeasonalMessageKey = keyof typeof messages;
export function seasonalText(
  language: Language,
  key: SeasonalMessageKey,
  values: Record<string, string | number> = {},
): string {
  return messages[key][language].replace(/\{(\w+)\}/g, (token, name: string) =>
    String(values[name] ?? token),
  );
}
