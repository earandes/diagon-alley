# Configuración de ensayo y mantenimiento de I1

10 de octubre de 2026. A23 confirma stack; A24 conserva A13/A18. No implementar R1 normal sobre esta bienvenida.

- `src/content/catalog.json`: las doce identidades A15, familias, contenido es/en, rareza A18, assetId y versión de catálogo. Los contextos breves son textos funcionales de la demo, sin efectos de taller o nuevas propiedades canónicas. Glosario provisional revisable con usuarios.
- `src/content/welcome-table.json`: versión, versión de catálogo exacta y seis pesos enteros positivos. C01/C02/C03/O03/C04/O04 = 14/14/5/5/1/1, total 40. La UI divide cada peso entre ese mismo total: 35/35/12,5/12,5/2,5/2,5 %. O01/O02 no son candidatos porque son regalos conocidos.
- `src/content/art-manifest.json`: fuentes editables, capas/pivotes, dimensiones, sustitutos utilizados y arte final pendiente. El manifest registra recursos; no decide entregas.
- `src/i18n/messages.ts`: mensajes completos, plurales y formatos es-ES/en-GB. P10 se utiliza como hipótesis de idioma inicial; cambiar idioma persiste preferencia, conservando vista e inventario.

## Cambiar datos sin reescribir lógica

1. Exportar la partida si se quiere conservar la ejecución anterior. Editar solo los datos pertinentes. Mantener C01–C04/O01–O04/S01–S04 y tres rangos R01/R02/R03.
2. Al cambiar pesos, incrementar `welcome-table.version`. Si cambian nombre, contexto, rareza o catálogo, incrementar también `catalog.version`, actualizar `welcome-table.catalogVersion` e incrementar la versión de tabla. No reutilizar una versión para contenido distinto.
3. Ejecutar `npm run validate:content`, `npm test`, `npm run typecheck` y `npm run build`. Los pesos iniciales tienen una prueba determinista de sus 40 tickets; si se autoriza otra configuración de ensayo, actualizar explícitamente ese caso y registrar la nueva decisión. No modificar una prueba para ocultar una diferencia no autorizada.
4. Las nuevas páginas activan la configuración validada en IndexedDB, en una transacción compartida. Un bundle anterior no rebaja la configuración activa. Una ficha abierta con otra versión no consume: requiere recuperar, revisar probabilidades y confirmar de nuevo. La recuperación de una operación existente precede a cualquier validación o sorteo nuevo.
5. Una operación y sus copias conservan nombre, familia, rareza y versiones originales. No cambiar descubrimientos previos para reflejar asignaciones nuevas. Para probar una nueva bienvenida con stock agotado, reiniciar con confirmación; crea otra ejecución y no añade unidades a la anterior.

Los validadores rechazan catálogo incompleto, referencias o familias incorrectas, textos es/en vacíos, IDs duplicados, pesos no enteros/positivos, suma no segura y candidatos conocidos incompatibles. No renormalizan silenciosamente. Una versión repetida con otros datos produce conflicto, sin sustituir inventario.

## Persistencia y límites

Un único object store `records` conserva un agregado finito: ejecución, unidades, copias, operaciones, preferencias, configuración activa e historial referenciado. Todas las escrituras releen ese registro dentro de la transacción. Stock, progreso y copias por identidad se derivan. La transacción registra consumo/resultado/copia/versiones y espera `tx.done` antes de animar. Un request exitoso aislado no es éxito de la apertura. Fallos intentan aborto explícito y observan desenlace; un commit cuya respuesta se pierde es desconocido hasta consultar la operación.

La clave idempotente identifica petición semántica (ejecución, unidad, tipo y versiones), sin idioma/animación. Igual clave/petición devuelve entrega histórica. Igual clave/petición distinta da conflicto. Otra clave/unidad consumida se rechaza antes de llamar al azar. Crypto del navegador usa tickets enteros con muestreo por rechazo; ninguna animación selecciona resultados. Los tickets guionizados de pruebas no son estadísticas del azar ni stock extra de la UI.

Importar sustituye, sin sumar. El JSON contiene formato/esquema, ejecución, preferencias, unidades, copias, operaciones y configuraciones referenciadas. Se validan tamaño (256 KiB), tipos, IDs únicos, concesión exacta de cuatro regalos y vínculos unidad→operación→copia, snapshots/versiones y bienvenida nueva. Confirmar compara generación/ejecución/revisión de la lectura revisada; un cambio concurrente rechaza sustitución. Reset usa el mismo límite y crea un runId nuevo. Datos locales manipulables, sin crédito económico o migración confiable al piloto.

## Dependencias utilizadas

| Dependencia fijada | Motivo | Licencia observada en package.json instalado |
| --- | --- | --- |
| React/ReactDOM 19.3.0 | Vistas y estados bilingües | MIT |
| idb 8.0.4 | Peticiones/tx.done y frontera IndexedDB | ISC |
| TypeScript 5.9.3 | Tipos estrictos; no sustituye validación runtime | Apache-2.0 |
| Vite 8.3.4 | Servidor local y bundle estático | MIT |
| Vitest 5.0.3 | Reglas deterministas y validadores | MIT |
| Playwright 1.64.0 | IndexedDB de navegador y recorridos | Apache-2.0 |
| Prettier 3.6.2 | Formato legible y consistente de fuentes/tests; solo desarrollo | MIT |

`package-lock.json` fija el árbol real. Sin router, store global, ORM, GSAP, WebGL, audio, fuentes descargadas, backend, APIs o IA en runtime. Las licencias de herramientas no autorizan materiales de Harry Potter. T01 sigue pendiente; no se ha seleccionado licencia de redistribución del arte/código del proyecto. Esta entrega autoriza preparación privada y push solicitado, sin publicación.
