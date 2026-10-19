import type { Language } from '../domain/collection/wizards';
const messages = {
  starterOrigin: {
    es: 'Copia inicial · catálogo {version}',
    en: 'Starter copy · catalogue {version}',
  },
  frogOrigin: { es: 'Rana · catálogo {version}', en: 'Frog · catalogue {version}' },
  details: { es: 'La ficha', en: 'Card details' },
  archived: { es: 'Archivo', en: 'Archive' },
  archiveCount: { es: 'Archivo: {count} identidades', en: 'Archive: {count} identities' },
  clearFilters: { es: 'Limpiar filtros', en: 'Clear filters' },
  filtered: { es: '{count} filtros activos', en: '{count} active filters' },
  previousJar: { es: 'Tarro anterior', en: 'Previous jar' },
  nextJar: { es: 'Tarro siguiente', en: 'Next jar' },
  jarNumber: { es: 'Tarro {number}', en: 'Jar {number}' },
  selectedJar: { es: 'Tarro {number} de {count}', en: 'Jar {number} of {count}' },
  assignedJars: {
    es: 'Tarros asignados: consultar para cambiar o quitar',
    en: 'Assigned jars: select to change or remove',
  },
  carrierJar: {
    es: 'Tarro {number} · puesto {position} · {name}',
    en: 'Jar {number} · position {position} · {name}',
  },
  finish: { es: 'Acabado', en: 'Finish' },
};
export function collectionSuppliesText(
  language: Language,
  key: keyof typeof messages,
  values: Record<string, string | number> = {},
) {
  return Object.entries(values).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    messages[key][language],
  );
}
