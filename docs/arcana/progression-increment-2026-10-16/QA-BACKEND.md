# A67 · Contratos de Encuentro, progresión y equipo

16octubre2026. Node24, Vitest5.0.3, Fastifyinject sobre composición real, PostgreSQL55432 y Redis56379 de servicios locales. No navegador ni observación humana atribuida. Namespace y cuentas UUID exclusivos, borrados solo los datos de la suite al terminar. Las heridas son fixtures de preparación mediante transacción declarada, no un editor del juego ni una modificación de partida habitual.

## Comando ejecutado

`npx --no-install vitest run --config vitest.integration.config.ts tests/integration/arcana/encounter-progression-a67.test.ts tests/integration/arcana/equipment-specialization-postgres.test.ts`

**14/14correctos en2archivos tras añadir la revisión final.** Log en `evidence/backend-contracts.txt`.

## Estados ejecutados

| Contrato | Evidencia ejecutada |
|---|---|
| Progresión explícita | Inicio con configuración real `mastery`,5rivales en jefe, tacticalVersion2/equipmentRulesVersion2 y campaignVersion1; petición de perfil futuro rechazada400, derechos intactos |
| Oferta fijada | Consultas y segunda conexión recuperan snapshot exacto; previsualización pura no escribe |
| Pasar | Una visita, mismos integrantes/PV/PM/inventario, sin consumo |
| Confirmar sanador |40→80PV,10→6PM solo portador elegido; receiptvitales/fuente/oferta guardados; reintento mismo resultado |
| Confirmar estudioso |40→20PV,10→18PM solo portador; reintento no repite efecto |
| Respuesta perdida | Fallo después de COMMIT real503 UNKNOWN_COMMIT; misma key recupera efecto/oferta guardados, incluso sin campaña viva |
| Conflicto | Misma key con alternativa distinta409 OPERATION_CONFLICT |
| Dos conexiones | Dos keys sobre revisión compartida producen200/409, una visita y un cambio |
| Condición inválida | Coste sin PM disponible rechaza422, rollback exacto |
| Perfil y derechos únicos | Cambiar mastery→discovery en otra run conserva la primera llave ya obtenida; repetir jefe entrega solo10Coronas y ningún producto/llave |
| Oferta/coste forjados | Campos cliente `offer`, `costFraction`, `fraction` rechazados400 sin mutar cuenta |
| Petición inválida | Alternativa ausente/ajena, portador ajeno o perfil no reconocido no modifica cuenta |
| Fallo de almacenamiento | Error antes de COMMIT conserva snapshot previo |
| Legacy | Run sin snapshot y run con snapshot tácticoV1sinoferta mantienen su Encuentro aleatorio; este último también funciona sin configuración viva |
| Forja V2 |3casos SQL: especializaciónpersistida; error después de COMMIT recupera sin recobrar; dos conexiones no obtienen dos compras con saldo de una; fallo antes de COMMIT/cotizaciónV1 conserva cuenta |

## Defecto encontrado y corregido

La primera ejecución de los tratos devolvía500 INVALID_GAME: la validación exigía `encounter.trade` pero el mapper del snapshot omitía ese campo. Los casos de consulta/pasar/progreso/legacy funcionaban y los de confirmación fallaban antes de guardar. Se corrigió el mapper para conservar y validar `encounterTradeSnapshot`. La ejecución completa de12casos tras la corrección inicial pasa; el fallo previo no se cuenta como aceptación.

## Límites

Fastifyinject verifica el contrato HTTP y sus servicios reales, sin socket de navegador ni transporte móvil. Las averías antes/después de COMMIT son hooks deliberados alrededor de transacciones reales; no un corte físico del servidor. Redis real acredita autorización, reloj y límites de la composición, no un despliegue externo. La suite no acredita interés, comprensión, rendimiento visual ni dispositivos físicos.

## Revisión de corrección final

Se inspeccionaron contratos de snapshot/run/opciones, mapper de receipts, contenido de progresión, reglas/equipo y metadata de recuperación. No se encontró otro bloqueo económico tras el mapper corregido. Se reprodujo una validación demasiado permisiva de metadata local: `pendingSnapshot` aceptaba `challenge: ["mastery"]` al convertirlo con `String()`. HTTP lo rechazaba400, sin posibilidad de alterar reglas/saldos; el test de regresión exige rechazarlo al leer la metadata. Corrección coordinada en el validador de cliente; su resultado final figura en la validación global.
