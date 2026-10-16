# ARCANA — Fase 3 Contrato de pruebas antes del código

A48: Pasivos tres RED reales de assertions y GREEN; UI cuatro RED antes de regiones/bonos. Selector summary confundido con button y corrección de string sin coincidencia conservados, luego cuatro validos GREEN. Corrupción dos RED/crash → guard → seis GREEN; neutral/Shadows/cero/singular como refuerzo posterior. 298/36/62 vigentes.

A47: RED texto no crecía y overflow posterior, spacing RED por parámetro ignorado, contraste y hover RED reales seguidos de GREEN. Benchmark mide cifras aunque no cumpla target; quitar MSAA mejora desktop comprobado. Trace dentro de describe rechazado (sin medición) y dos errores de tipos de fixtures conservados. Suite vigente 293/36/54, límites en Fase 4.

A46: Helper RED por módulo ausente antes de lógica; código NETWORK_ERROR y recarga offline con hash RED de assertions seguidos de GREEN. Pruebas UI añadidas como refuerzo posterior, no RED retrospectivo. Fallo HMR del primer recorrido y expectativas antiguas de PWA conservados; 48 navegador finales correctos.

A45: Build/worker RED por módulos ausentes, navegador RED por manifest ausente; GREEN final con 12 pruebas PWA reales del build. Fallos Vary/fixtures de update y pérdida de respuesta conservados y corregidos; detalle y límites en Fase 4.

A44: `tdd-encounter-red.txt` contiene dos RED reales de assertions en caso de uso (resolución ausente/config de narrativa inválida aceptada) y módulo de servicio ausente (sin assertions de esos tres casos). GREEN después; legacy/tamper suplementario. Contenido RED por relatos ausentes, GREEN tras datos. UI RED es/en por aviso de riesgo ausente; pasos posteriores aún no alcanzados en ese RED. Primer GREEN UI falló por lectura antes de completar comando; espera explícita al resultado confirmado corrige, `tdd-encounter-ui-green-current.txt` cuatro correctos. SQL de narrativa/rollback/respuesta perdida añadido después, primero GREEN sin cambiar adapter; no RED retrospectivo. Typecheck detectó spread nullable de fixture, corregido con valor previamente estrechado.

A43: seis RED de assertions antes del código (`tdd-stars-red.txt`): validación, snapshot, metadata por copia/histórico, contenido público versión 2, opening/replay y discrepancia copia/receipt. GREEN posterior. UI RED es/en por estrellas ausentes (`tdd-stars-ui-red.txt`), GREEN cuatro casos Chromium/WebKit con revelación/álbum/inspección/recarga, idioma suplementario. Integración SQL de estrellas añadida después, inicialmente GREEN sin cambios de adapter: no RED retrospectivo. CLI detectó overflow del sello GSAP invisible escalado: intento inicial no insertó assertions por cambio de formato del test, `tdd-seal-overflow-first-attempt.txt` no es RED. Assertions reales `tdd-seal-overflow-red.txt` fallan en ambos idiomas; GREEN tras tamaño propio 34 px. Logs preservados.

A42: reglas/config/uso RED por módulos ausentes antes de implementación (`tdd-commerce-red/green`); transporte, metadata/controller, contenido/proyección y UI RED antes de sus nuevas funciones (`tdd-commerce-transport-*`, `tdd-commerce-content-*`, `tdd-commerce-preview-*`, `tdd-vault-probability-*`, `tdd-commerce-ui-*`). Integración comercio inicialmente GREEN con adapter genérico previo, sin afirmar RED retrospectivo. Selector `getByLabel` de select nativo falló en primer GREEN UI, corregido a rol/nombre accesible; intento interrumpido conservado. Foco/idioma suplementarios. Suite vigente 269 unitarios, 34 integración y 36 navegador; detalle en estado.

A41: modelos de energía/sinergias RED por módulos ausentes (5 casos), no assertions previas; HTTP RED real por energía ausente, controller cuatro RED (método de refresco ausente y campos del éxito ausentes), read-model RED por función ausente. Logs `tdd-hud-*`, `tdd-saved-node-result-*`. UI es/en RED por meter ausente antes de controles; GREEN posterior. Viewport de resultado RED después de hallazgo CLI, primer arreglo falló por MapPanel reaccionando a nuevos objetos de GET; GREEN actual con dependencias de navegación estables (`tdd-node-result-viewport-*`). Integración real de consulta añadida como refuerzo posterior, sin RED retrospectivo.

A40: `team-beans.spec.ts` escrito antes de controles. RED real Chromium es/en por filtro inexistente (`tdd-team-beans-ui-red.txt`). GREEN posterior verifica filtros/inspección/equipar/recarga/Grageas; no afirmar que los pasos posteriores al filtro llegaron a ejecutarse en RED. Refuerzo de idioma/opción exclusiva suplementario. Fallos intermedios: campo `type` incorrecto del test del log (contrato usa `kind`), assertion Playwright para `<option disabled>` corregida a atributo y regresión de foco inicial causada por botones de idioma, corregida cambiando su orden.

A39: ocho casos de modelos RED por módulos ausentes antes del código (`tdd-graphics-models-*`), assertion adicional de campos de log corruptos (`tdd-replay-fields-*`); replay/mapa/fallback/foco RED navegador antes de UI (`tdd-replay-ui-*`). RED observado WebKit/foco y primer nodo bajo nav fija, GREEN después (`tdd-webkit-focus-green.txt`, `tdd-map-viewport-*`). Dos casos de pérdida de contexto/módulo GSAP ausente RED antes de handler/catch (`tdd-graphics-loss-*`). Casos de perfil/omisión ampliados como verificación suplementaria; no RED retrospectivo. Intentos fallidos conservados, métrica y cobertura en `PHASE-4-STATUS.md`.

A38: RED previo de content (4), gateway SQL/Redis (3), read models (4), cookie HTTP (1), traducciones (3) y UI es/en (2 Chromium); logs `tdd-trial-content-*`, `tdd-trial-gateway-*`, `tdd-read-models-*`, `tdd-cookie-client-*`, `tdd-translations-*`, `tdd-trial-ui-*`. WebKit añadido como comprobación suplementaria, sin RED retrospectivo. Scanner del build falló antes de migrar entry/assets; GREEN tras compilación ARCANA. La primera concurrencia de suites de navegador compartía outputDir: error de trazas conservado, corregido con directorios separados y run posterior. Fuentes/coverage en `PHASE-4-STATUS.md`; no prueba de Pixi/FPS por DOM.

Bloque A37: contrato `CLIENT-CONTROLLER-CONTRACT.md`; RED antes del controlador (11 iniciales) y adapter IndexedDB (3 casos × Chromium/WebKit, imports ausentes). Logs `tdd-client-controller-*` y `tdd-client-indexeddb-*`; sin afirmar assertions antes de módulos. Dos assertions RED posteriores detectaron token cambiado y claim concurrente (`tdd-client-session-*`, `tdd-client-concurrent-controller-*`), GREEN tras corrección. Resultado final 219 unitarios, 26 integración y 6 navegador real, tipos/build correctos. Harness de metadata no acredita UI nueva o rendimiento; ver `PHASE-4-STATUS.md`.

Especificación inicial, 11 octubre 2026. Tests de reglas definidas pueden implementarse inmediatamente; casos con cifras de balance U25 usarán fixtures explícitas y no establecerán valores de producción. Todo bloque debe tener ejecución RED guardada antes de implementación y GREEN después; no reconstruir evidencia de TDD retrospectivamente.

## Prioridad y casos

| ID | Situación / acción | Resultado verificable |
| --- | --- | --- |
| EN01 | Esencia 50, consumir 5 | 45; estado original intacto |
| EN02 | Esencia 4, intentar combate | Error sin gasto/seed ni recompensa |
| EN03 | 11m59s / 12m / 24m desde cursor | 0 / 1 / 2 puntos; conservar resto temporal |
| EN04 | Reserva 49, muchas horas / 50 llena | Cap 50; no crédito acumulado para reclamar tras gastar |
| EN05 | Reloj retrocede o saldo inválido | No crédito por retroceso; NaN/float/negativo/51 rechazados |
| EX01 | Grafo con dos raíces/ramas; escoger un nodo alcanzable | Avance válido por arista |
| EX02 | Nodo remoto, desconocido, retroceso o repetido | Error sin modificar ruta/economía |
| EX03 | Referencia rota/IDs duplicados/ciclo/jefe inalcanzable | Config rechazada antes de habilitar gasto |
| CE01 | Snapshot+seed+versión iguales | Resultado y log completos iguales, sin Math.random/Date.now |
| CE02 | Velocidad/escoba/desempate con fixture | Orden estable; muertos no actúan ni reciben acciones inválidas |
| CE03 | Menta en herido/sano | Cura 25% PV máximo con cap y redondeo documentado |
| CE04 | Pimienta en varios hechizos del primer turno y turno posterior | A32: +30% durante primer turno; expira al completar turno; consumo único |
| CE05 | Tierra en rondas 1/2/3 | -15% iniciativa dos rondas; luego base restaurada |
| CE06 | Jabón | Primer hechizo falla; siguiente no falla por el mismo efecto |
| CE07 | PRNG fuerza cada sabor y extremos | Todos los efectos cubiertos con tickets controlados; no estadísticas reales |
| CE08 | Sinergias de fixture / PM / todos muertos / límite | Termina, explicación/log; no bucle infinito, estado fuente intacto |
| EC01 | Primera victoria / repetición / derrota | 100% / 10% Coronas sin botín inicial / cero recompensa |
| EC02 | Compra válida / saldo insuficiente / cantidad inválida | Gasto/unidades atómicos; cero gasto ante error |
| CO01 | Sapo disponible / misma petición / otra key / key con otro unit | Copia única / replay sin sorteo / agotado / conflicto |
| CO02 | Tabla inválida / versión antigua | No gasto ni falso éxito; refrescar y reconfirmar |
| CO03 | Cromo conocido o nuevo, ambas rarezas/config versiones | Copia/discovery correctos, snapshot previo conservado |
| AP01 | ResolveNode exitoso | Una tx paga energía+gragea y conserva resultado/PV/ruta/recompensa/recibo |
| AP02 | Throw después de calcular o escribir | Rollback completo; presenter no anuncia éxito |
| AP03 | Respuesta perdida después de commit | Misma key devuelve mismo resultado sin nueva seed/copia/recompensa |
| AP04 | Dos sesiones/pestañas compiten con revisión vieja | Una transición válida; saldo/copia no duplicados |
| AP05 | Cliente manda seed/ganador/saldo/fecha | Entrada rechazada o ignorada de forma documentada; autoridad propia |
| AP06 | Kit/recovery/recarga/cambio idioma | Kit una vez; estado y operación preservados |
| UI01 | ES y EN: inicializar→ruta→batalla→premio→compra→apertura→Cromodex→equipar | Misma lógica y estado; etiquetas/stats/errores completos |
| UI02 | 320/390/desktop, texto 200%, teclado/reducido/omitir/arte ausente | Recorrido completo, foco/lectura; renderer no decide resultado |
| UI03 | Auto/2x/reload durante reproducción | Mismo resultado confirmado; no repetir gasto |
| PK01 | Build limpio | Sin términos/recursos viejos en JS/HTML/CSS/public; sin dependencia de docs históricas |
| PW01 | Instalación/caché/actualización PWA | Shell funciona; offline no entrega saldo económico inventado |

## Infraestructura de comprobación

Vitest actual sirve para tests puros sin navegador ni mocks de React. Fixtures pequeñas de grafo/batalla/tablas se etiquetan `test-only`; no configurar treinta cromos por conveniencia de tests. Ejecución independiente de tests ARCANA para capturar RED; suite histórica seguirá verificando aislamiento durante migración.

Tests de aplicación inyectan reloj/seed/tx y comprueban que una validación fallida no solicita random ni confirma writes. Tests reales del adaptador demuestran rollback, replay, dos conexiones, reinicio del proceso y respuesta perdida. No duplicar tests mirando métodos internos. Playwright demuestra recorridos y navegador; la suite histórica no cuenta como cobertura ARCANA.

Reglas pendientes que no permiten una expectativa definitiva: daño/PM/desempate, cuantías de sinergias, redondeos, precios/loot, derrota/reintento/ruta nueva y equipo 3vs3 desde aprendiz. Mantener explícitas hasta resolución, sin tests skipped que parezcan verificación.

## Segundo bloque implementado

Tests de efectos (21), colección/economía (20), aplicación compra/apertura (10), VO (9) y los 37 anteriores se ejecutan desde `tests/domain/arcana`. RED de módulos ausentes capturado antes de implementación en `tdd-beans-red`, `tdd-collection-economy-red`, `tdd-shop-red`, `tdd-vo-red`; GREEN correspondiente. Al llegar A32 se modificó la prueba de Pimienta, RED con assertion `10 != 13` antes de ajustar duración y GREEN posterior, conservados en `tdd-first-turn-red/green.txt`.

Tests reales en `tests/integration/arcana`: 6 PostgreSQL y 6 Redis, RED por adapters ausentes y GREEN al conectar servicios aislados. PostgreSQL prueba create concurrente desde dos conexiones, unidades/costes/copias/recibos, cerrar/reabrir pools, rollback después de escrituras y respuesta perdida tras COMMIT; Redis prueba TTL real, revocación, límite compartido concurrente, ventanas aisladas y TIME. No usar estos casos como evidencia de motor, HTTP/auth recuperable, cliente Pixi, JSONB de Run, móvil físico o despliegue.

Total actual verificado: 120 unitarios (23 históricos + 97 ARCANA) y 12 integración. Logs `block-2-unit/integration/types/build.txt` separan comprobaciones. Suite de integración es explícita y requiere `npm run services:up`; no se esconde mediante skip. CI configurada para esos servicios, ejecución remota todavía no observada.

## Bloque A34: motor, run y generación

RED guardado antes del código para 14 casos de motor, 10 iniciales de aplicación/run y 5 de generación (módulos ausentes; no assertions ejecutadas antes de importarlos). GREEN posterior en `tdd-combat-green.txt`, `tdd-run-green.txt`, `tdd-route-generation-green.txt`. Cuatro casos de run/PostgreSQL escritos y fallados antes de extender SQL/adaptador, `tdd-run-postgres-red.txt`; GREEN de integración final.

Una assertion adicional falló con el comportamiento existente: repetición al límite de Coronas rechazaba una recompensa válida de 10 por reservar 100. RED/implementación mínima/GREEN en `tdd-repeat-preflight-red/green.txt`. JSONB real detectó comparación textual del grafo; reemplazada por comparación de nodos/aristas/columnas sin depender del orden de claves. Los casos adversos suplementarios y los tres tests específicos de rewards caracterizan comportamientos ya implementados; no se afirma TDD retrospectivo para ellos.

Estado final del bloque: `npm test` 161 correctos (23 anteriores + 138 ARCANA), 16 integración real (10 PG + 6 Redis), tipos/build correctos. Replay, rollback tras SQL, COMMIT con respuesta perdida, concurrencia entre conexiones, PM residual, premios, llave/zona y recluta temporal comprobados. No tests de API/identidad/UI nueva aún; no prueba de FPS, PWA, móvil físico o reinicio del servicio PG.

## Bloque A35: HTTP, autoridad y cliente

Contrato previo `HTTP-CONTRACT.md`. RED antes de código: 19 casos HTTP en `tdd-http-red.txt`, 3 crypto en `tdd-crypto-red.txt`, 5 composición pg/Redis en `tdd-http-integration-red.txt` y 8 cliente en `tdd-http-client-red.txt`. Suites sin módulo documentadas como tal, sin afirmar assertions previas a importar. Dos assertions nuevas RED detectaron metadata no pública serializada y una policy incompleta que permitía defaults accidentales; GREEN tras proyección explícita/validación en `tdd-public-content-*` y `tdd-http-policy-*`.

Casos: sesión faltante/falsa, rechazo de campos económicos/seed/stats/ganador/tiempo, JSON sin coerción, formación poseída, compra/apertura/avance/recuperación, stale/rechazos/rate limit, logout, error interno sin stack/SQL, payload grande, token/estado propios y respuesta incierta. Cliente: método/body/headers/key/versiones, snapshots válidos, errores de red sin retry, clave de receipt coincidente y JSON/esquema inválidos sin recompensa anunciada.

Integración real: ruta→combate/seed Redis TIME→premio→compra→apertura, reproducción exacta por entrada/seed, aislamiento de dos sesiones, revocación, carrera, UNKNOWN_COMMIT después de SQL y rate counters. Socket TCP comprueba GET y cliente tipado para state/content/compra/recovery. Tests iniciales del socket se ampliaron como integración del cliente ya implementado; no se presenta ese añadido como RED retrospectivo.

## Bloque A36: kit y equipo

Contrato previo `KIT-TEAM-CONTRACT.md`; RED inicial de 9 casos antes del código (`tdd-kit-team-red.txt`), 4 integración PG antes de tablas/adapter (`tdd-team-postgres-red.txt`) y 2 API antes de handlers/schemas (`tdd-team-http-red.txt`). Dos assertions adicionales RED descubrieron que una segunda copy podía reclamar grant starter y que se podía retirar el receipt del kit (`tdd-kit-uniqueness-red.txt`, `tdd-kit-receipt-red.txt`); corregidas con referencias/única copia y GREEN.

Kit exacto/replay sin configuración/reloj, validación de catálogo/stats, propiedad/selección/transferencia/desequipar, formación insuficiente sin gasto/seed, equipos actuales/anteriores y reserva PM/HP después de un duelo que inflige daño. La prueba de reserva se fortaleció con daño real en lugar de una batalla sin daño; es comprobación suplementaria de un comportamiento ya implementado, sin RED retrospectivo. Concurrencia de init/selección, gear/reserves al reabrir pool, rollback y COMMIT incierto reales. Integración completa del cliente kit→compra dos sapos→selección→equipar→duelo añadida como integración de comportamientos ya probados; no como TDD retrospectivo.

`npm test`: 206 correctos; integración real: 26 correctos. Las cifras no prueban UI, configuración final de 30 cromos, onboarding observado, identidad, FPS o PWA. Evidencia final en `PHASE-4-STATUS.md`.
