# A86 · Arena como escena de duelo

18 octubre2026. Baseline46a43df; A85 continúa en PR9, CI39159355139 pendiente. Nueva instrucción de Enric y referencia67683.jpg: implementar simplificación de arena e integrar casas. No merge/despliegue. La referencia no cambia participantes, estadísticas o poderes.

## Estado y elección
Comprobado en código: cabecera global, monedero, dos filas de controles, pie permanente de evento/guardado y ordinales de posición consumen espacio. La escena ya tiene reloj compartido, actor/objetivo, daño, fallback e inspectores; se conservan. Casas A85 llegan al inspector pero falta lectura compacta por bando.

Alternativas: (A) decorar controles existentes conserva redundancia; (B) escena con cabecera propia, una pausa y opciones bajo demanda recupera espacio sin perder funciones. Elegida B. Sin producción raster: mismos personajes, escenario y emblemas originales.

## Recorrido y aceptación
Preparar → confirmar operación existente → escena automática → pausa/consulta/velocidad/omisión → desenlace → continuar al botín existente. Una pausa siempre accesible abre opciones; consultar o salir nunca cambia el resultado confirmado. Preferencia de velocidad1×/2× por dispositivo desde Ajustes y menú de pausa, con almacenamiento ausente tolerado; no se recuerda una pausa como preferencia de futuros combates.

Cabecera de encuentro, ronda solo desde1, dos bandos, todos los nombres/PV, figuras mayores con presupuesto real de altura. Sin ordinales decorativos. Actor/objetivo diferenciados por marca/forma y acción breve del reloj actual. Las casas y efectos provienen del input/log confirmado; no recalcular activación tras caídas. Consultables por teclado/toque sin anunciar ganador antes de terminar. No escudos o estados nuevos. Recursos confirmados siguen consultables desde pausa, sin saldo falso.

## Persistencia y recuperación
Ningún comando nuevo, migración o cambio de dominio. BattleLog/receipts/inventario inmutables al consultar, pausar, omitir, cambiar preferencias o salir. Reduced/fallo conserva resultado estático y acciones. Global header fuera de escena; Ajustes y monedero dentro de pausa. Cierre/botín/intenciones A63/A85 conservados.

## Plan
1. Contrato y pruebas de preferencias/lectura del log.
2. Menú único, Ajustes, composición/PV/casas y cabecera.
3. Adaptar pruebas de interacción al nuevo acceso a opciones (sin relajar las garantías).
4. Tipos/build/tests y CI Linux original serial, evidencia seleccionada ambos packs/idiomas y densidades.
5. Inspección, correcciones necesarias y documentación de medidas/límites.

No gráficos locales; reglas AGENTS/HOST-INCIDENT intactas. Humana/físico pendientes. Una captura acredita composición, no movimiento.
