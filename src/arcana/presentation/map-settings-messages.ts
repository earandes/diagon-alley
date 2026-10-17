import type { Language } from '../domain/collection/wizards';
const messages = {
  routeBook: { es: 'Libro de ruta', en: 'Route book' },
  position: { es: 'Etapa {stage} · opción {option}', en: 'Stage {stage} · option {option}' },
  nodeName: {
    es: '{name} · etapa {stage}, opción {option}',
    en: '{name} · stage {stage}, option {option}',
  },
  nodeStateName: { es: '{name} · {state}', en: '{name} · {state}' },
  inspection: { es: 'Consultar ruta', en: 'Inspect route' },
  readOnly: {
    es: 'Solo consulta. No avanza la ruta ni utiliza recursos.',
    en: 'Read only. Does not advance the route or use resources.',
  },
  from: { es: 'Desde', en: 'From' },
  to: { es: 'Continúa hacia', en: 'Continues to' },
  end: { es: 'Final de la ruta', en: 'End of the route' },
  lockedHelp: {
    es: 'Todavía no puedes resolver este nodo.',
    en: 'You cannot resolve this node yet.',
  },
  visitedHelp: { es: 'Este nodo ya está resuelto.', en: 'This node is already resolved.' },
  motionOwn: { es: 'Reducir movimiento por mi elección', en: 'Reduce motion by my choice' },
  motionSystem: {
    es: 'Tu sistema solicita movimiento reducido. Se mantiene activo aunque desactives tu elección.',
    en: 'Your system requests reduced motion. It stays active even if you turn off your choice.',
  },
  motionEffectiveOn: { es: 'Movimiento reducido activo.', en: 'Reduced motion is active.' },
  motionEffectiveOff: { es: 'Movimiento completo activo.', en: 'Full motion is active.' },
} as const;
export function mapSettingsText(
  language: Language,
  key: keyof typeof messages,
  values: Record<string, string | number> = {},
) {
  return Object.entries(values).reduce(
    (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
    messages[key][language] as string,
  );
}
