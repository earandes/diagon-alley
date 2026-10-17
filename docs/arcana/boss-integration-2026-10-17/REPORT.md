# A72 · Revisión e integración del jefe

17 octubre2026. Revisión completada; corrección de prueba implementada y comprobada localmente. Integración remota/CI final pendientes en este punto; se actualizará este registro con resultados reales.

## Qué estaba implementado

A70 aporta identidad del rival guardado, coreografía sobre el reloj común y hechos comprobables del BattleLog. A71 aporta antesala enfrentada, stock/borrador separados, actor pintado por piezas y selección localizada. Se conservan el cierre, botín, intenciones y preparación. No se reimplementa ni produce arte nuevo.

## Revisión de experiencia

Se inspeccionaron las seis imágenes originales seleccionadas en [galería A71](../boss-stage-2026-10-17/GALLERY.md), sin navegador en el Mac. Escritorio separa equipo/rival, móvil apila rival sobre equipo y conserva tarro/acción; el jefe tiene encuadre medio y objeto distinguible en las poses mostradas. Las consultas no compiten como bloques equivalentes y el cierre prioriza llave/rana confirmadas. No nuevo defecto visual bloqueante demostrado en esas imágenes. El gesto es brazo/objeto sobre recorte pintado, no rig corporal; no se evalúa continuidad por PNG.

Código contrastado: App/NodePreparation conectan retratos/libro/tarro con preparación existente y único comando de combate; BossPrelude/BossPartyStage/BossSupplies presentan datos guardados/borradores. BattlePanel/Pixi derivan identidad, actor/objetivo y transformaciones del mismo log/reloj. BossBattleFacts limita hechos propios a dos, sin causalidad inventada; ExpeditionClosure conserva botín primero. Artwork preserva fallback por URL. CSS denso redistribuye espacio sin ocultar figuras/PV. No nueva espera, reloj, regla o estado persistido.

La cobertura dinámica y geometría ES/EN×packs×3tamaños×2motores proviene de CI38988996115, no de estas imágenes. [QA y límites](../boss-stage-2026-10-17/QA.md). El candidato actual conserva exactamente src/arte/runtime de ese merge; certificado local de objetos en evidence/source-equivalence.json. La revisión completa de diff identifica una dependencia de workflow A70 ya presente en remoto, no edición nueva del guard.

## Finding corregido

Evidencia: último check PR3 CI38981493749 falló en trial-gateway.test.ts:177 con422. No es fallo gráfico. El test recorría un grafo aleatorio y omitía toda elección de encuentro; los encuentros A67 exigen elección o pase explícito.

Reproducción determinista: semilla17, Pacto→Pacto→Encuentro→Refugio→Duelo, falla exactamente en pasaje:4:1 con INVALID_OPERATION. [RED](evidence/route-red.txt). La semilla0 conserva ruta directa Pacto→Pacto→Duelo. Las primeras ocho semillas exploradas no reprodujeron el fallo; no se contaron como resolución.

Cambio mínimo: fijar solo seed de ruta en la prueba (spy restaurado incluso si falla transporte), probar ambas rutas y pasar explícitamente el encuentro. Ninguna regla de servidor relajada; tratos conservan sus contratos dedicados. Mantiene kit único, al menos3integrantes, coste5 y grafo persistido. [GREEN](evidence/route-green.txt).

## Comprobaciones actuales

Locales sin navegador: typecheck correcto;554unitarios;78integraciones reales PostgreSQL16.9/Redis; build/packs/scanner correctos,14.983.901B distribuidos y advertencia conocida chunk>500kB. Logs en evidence/. No nuevo preflight/browser necesario, servicios existentes saludables y cuentas de prueba con limpieza propia.

Validación Linux sobre main pendiente. Se consolidan los ancestros A70/A71 sin doble aplicación; la subida será avance directo sin force-push, después de verificar ancestría, igualdad del runtime probado y las comprobaciones locales del único cambio de test. Evita integrar primero un A70 intermedio con fallo conocido y repetir dos matrices idénticas. PR4 se dirige a main para reflejar la consolidación; PR3 queda contenida.

## Límites conservados

Picos de arranque y muestra genéricaA69 P95rAF33,4ms frente objetivo20ms siguen abiertos; muestra específica jefe16,8ms no los sustituye. No nueva atribución causal o mediciónGPU. Revisión final no cambia recursos/runtime ni oculta esos resultados. Ver [rendimiento A71](../boss-stage-2026-10-17/PERFORMANCE.md).

Humana, lector hablado y dispositivo físico pendientes. Sesión breve propuesta en A71: preparar y afrontar al jefe, después usar botín y decidir siguiente paso, sin explicar solución. Fixtures/viewport/toque/eventos de pérdidaWebGL no acreditan personas o hardware real. Sin despliegue/publicación.

## Primera CI de main y corrección adicional de prueba

Main de99ef3 contiene A70/A71; PR3/PR4 reconocidas comoMERGED. CI39016752481: tipos/contenido/554unitarios/78PGRedis/build/scanner correctos, A70+A71 98correctos/10omisiones y Halloween12correctos. A69 18correctos/1fallido/5omisiones: ocultación simulada leyó cursor3 antes de publicarse último frame4. [Error original](evidence/main-motion-failure.md). Se canceló el resto tras conservar evidencia, no se presenta comoCIaprobada.

Código de reloj/React y prueba contrastados: setVisible liquida intervalo visible y publica React de forma diferida; el test tomaba inmediatamente un atributo anterior. Se espera ahora no-playing/no-ticking y dos frames de asentamiento existentes, después se exige cursor, progreso y paints constantes durante los300ms originales. No tolerancia a avances ocultos ni cambio de renderer. Caracterización pura del cruce al ocultar pasa7/7; no se afirma RED nuevo de producción. Tipos correctos, nuevaCI necesaria.

Las seis imágenes y43JSON actuales de la faseA70/A71 correcta quedan en [galería main](GALLERY.md) con SHA/procedencia; el fallo posteriorA69 no invalida ni convierte en aprobación global esa fase. [Métricas actuales](PERFORMANCE.md).
