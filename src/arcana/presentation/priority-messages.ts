import type { Language } from '../domain/collection/wizards';
const messages = {
  reading: ['Lectura', 'Reading'],
  normal: ['Habitual', 'Standard'],
  large: ['Texto ampliado', 'Larger text'],
  contrast: ['Más contraste en la interfaz', 'Higher interface contrast'],
  systemContrast: [
    'El sistema mantiene el contraste reforzado.',
    'Your system keeps higher contrast enabled.',
  ],
  ownContrast: [
    'Se conserva tu elección en este dispositivo y jugador.',
    'Your choice is saved for this player on this device.',
  ],
  guide: ['Próximo paso', 'Next step'],
  begin: ['Prepara tu compañía', 'Prepare your company'],
  recruit: ['Recluta aliados', 'Recruit companions'],
  prepare: ['Revisa tu formación', 'Review your formation'],
  choose: ['Elige tu próximo destino', 'Choose your next destination'],
  energy: ['Comprueba la Esencia', 'Check your Essence'],
  won: ['Utiliza tu botín', 'Use your loot'],
  lost: ['Prepara otro intento', 'Prepare another attempt'],
  draw: ['Revisa tu plan', 'Review your plan'],
  beginHelp: [
    'Elige tus copias antes de iniciar. Los Pactos de la ruta permiten incorporar aliados temporales.',
    'Choose your copies before starting. Route Pacts let you recruit temporary companions.',
  ],
  recruitHelp: [
    'Necesitas tres integrantes para combatir. Puedes consultar un Pacto y elegir; los temporales acompañan solo esta expedición.',
    'Combat requires three members. Inspect a Pact and choose; temporary companions join only this expedition.',
  ],
  prepareHelp: [
    'Consulta tus puestos, reservas y el siguiente destino. Preparar no cura ni inicia un combate.',
    'Inspect your slots, reserves and next destination. Preparing does not heal or start combat.',
  ],
  chooseHelp: [
    'Consulta la amenaza y prepara equipo o grageas antes de confirmar. Elegir una consulta no avanza la ruta.',
    'Inspect the threat and prepare equipment or beans before confirming. Opening a consultation does not advance the route.',
  ],
  energyHelp: [
    'El combate cuesta {cost} de Esencia. Consulta el saldo y la próxima recuperación en el monedero; no se gasta al consultar.',
    'Combat costs {cost} Essence. Check your balance and next recovery in the resource display; inspection spends nothing.',
  ],
  inspectPact: ['Consultar Pacto', 'Inspect Pact'],
  openPreparation: ['Preparar compañía', 'Prepare company'],
  hideGuide: ['Ocultar orientación', 'Hide guidance'],
  showGuide: ['Consultar orientación', 'Show guidance'],
  company: ['Probar una compañía', 'Try a company'],
  companyDetail: [
    'Intenta activar {name} en un combate. No concede premios ni garantiza victoria.',
    'Try activating {name} in combat. It grants no reward and does not guarantee victory.',
  ],
  contributors: [
    '{count} identidades en pie · nivel {tier}',
    '{count} distinct standing identities · tier {tier}',
  ],
  houseFact: ['Se activó {name} · nivel {tier}', '{name} activated · tier {tier}'],
  bondFact: ['Se activó {name} · nivel {tier}', '{name} activated · tier {tier}'],
  groupDetail: [
    'Activación registrada para {count} identidades del propio bando. No demuestra por sí sola la causa del resultado.',
    'Activation recorded for {count} distinct identities on your side. This alone does not establish the cause of the outcome.',
  ],
  guardFact: ['{name}: {amount} de daño absorbido', '{name}: {amount} damage absorbed'],
  guardDetail: [
    'Cantidad absorbida en ese impacto confirmado.',
    'Amount absorbed on that confirmed impact.',
  ],
  house: ['Casa', 'House'],
  bond: ['Compañía', 'Company'],
  guard: ['Protección', 'Protection'],
} as const;
export function priorityText(
  language: Language,
  key: keyof typeof messages,
  values: Record<string, string | number> = {},
) {
  let result: string = messages[key][language === 'es' ? 0 : 1];
  for (const [name, value] of Object.entries(values))
    result = result.replaceAll(`{${name}}`, String(value));
  return result;
}
