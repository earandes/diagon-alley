# A72 · Revisión e integración del jefe

17 octubre2026. **Revisado, corregido, integrado en main y comprobado técnicamente.** [CI39021060226 completa correcta](https://github.com/earandes/diagon-alley/actions/runs/39021060226), código `15b1a99aa24863b7d00773c0f95c80ab8bebb625`. PR3 y PR4 integradas por avance directo, sin force-push o conflictos. La actualización documental posterior conserva runtime/pruebas/configuración ensayados y no repite matrices por documentación. Sin despliegue/publicación.

## Qué estaba implementado

A70 aporta identidad del rival guardado, coreografía sobre el reloj común y hechos comprobables del BattleLog. A71 aporta antesala enfrentada, stock/borrador separados, actor pintado por piezas y selección localizada. Se conservan el cierre, botín, intenciones y preparación. No se reimplementa ni produce arte nuevo.

## Revisión de experiencia

Se inspeccionaron las seis imágenes originales seleccionadas en [galería A71](../boss-stage-2026-10-17/GALLERY.md), sin navegador en el Mac. Escritorio separa equipo/rival, móvil apila rival sobre equipo y conserva tarro/acción; el jefe tiene encuadre medio y objeto distinguible en las poses mostradas. Las consultas no compiten como bloques equivalentes y el cierre prioriza llave/rana confirmadas. No nuevo defecto visual bloqueante demostrado en esas imágenes. El gesto es brazo/objeto sobre recorte pintado, no rig corporal; no se evalúa continuidad por PNG.

Código contrastado: App/NodePreparation conectan retratos/libro/tarro con preparación existente y único comando de combate; BossPrelude/BossPartyStage/BossSupplies presentan datos guardados/borradores. BattlePanel/Pixi derivan identidad, actor/objetivo y transformaciones del mismo log/reloj. BossBattleFacts limita hechos propios a dos, sin causalidad inventada; ExpeditionClosure conserva botín primero. Artwork preserva fallback por URL. CSS denso redistribuye espacio sin ocultar figuras/PV. No nueva espera, reloj, regla o estado persistido.

La cobertura dinámica y geometría ES/EN×packs×3tamaños×2motores proviene de CI38988996115, no de estas imágenes. [QA y límites](../boss-stage-2026-10-17/QA.md). El candidato actual conserva exactamente src/arte/runtime de ese merge; certificados de objetos inicial/final en evidence/source-equivalence.json y evidence/final-source-equivalence.json. La revisión completa de diff identifica una dependencia de workflow A70 ya presente en remoto, no edición nueva del guard.

## Finding corregido

Evidencia: último check PR3 CI38981493749 falló en trial-gateway.test.ts:177 con422. No es fallo gráfico. El test recorría un grafo aleatorio y omitía toda elección de encuentro; los encuentros A67 exigen elección o pase explícito.

Reproducción determinista: semilla17, Pacto→Pacto→Encuentro→Refugio→Duelo, falla exactamente en pasaje:4:1 con INVALID_OPERATION. [RED](evidence/route-red.txt). La semilla0 conserva ruta directa Pacto→Pacto→Duelo. Las primeras ocho semillas exploradas no reprodujeron el fallo; no se contaron como resolución.

Cambio mínimo: fijar solo seed de ruta en la prueba (spy restaurado incluso si falla transporte), probar ambas rutas y pasar explícitamente el encuentro. Ninguna regla de servidor relajada; tratos conservan sus contratos dedicados. Mantiene kit único, al menos3integrantes, coste5 y grafo persistido. [GREEN](evidence/route-green.txt).

## Comprobaciones actuales

Locales sin navegador: typecheck correcto;554unitarios;78integraciones reales PostgreSQL16.9/Redis; build/packs/scanner correctos,14.983.901B distribuidos y advertencia conocida chunk>500kB. Logs en evidence/. No nuevo preflight/browser necesario, servicios existentes saludables y cuentas de prueba con limpieza propia.

Se consolidaron los ancestros A70/A71 sin doble aplicación, por avance directo f5d3a89→de99ef3. PR4 se dirigió a main y GitHub reconoció ambasPR comoMERGED. Las correcciones posteriores8155efc/15b1a99 afectan solo pruebas/evidencia. La CI final comprueba el código integrado, con las ejecuciones canceladas/fallidas distinguidas más abajo. Runtime, arte, dominio, reglas, economía y persistencia se conservaron.

## Límites conservados

Picos de arranque y muestra genéricaA69 P95rAF33,4ms frente objetivo20ms siguen abiertos; muestra específica jefe16,8ms no los sustituye. No nueva atribución causal o mediciónGPU. Revisión final no cambia recursos/runtime ni oculta esos resultados. Ver [rendimiento A71](../boss-stage-2026-10-17/PERFORMANCE.md).

Humana, lector hablado y dispositivo físico pendientes. Sesión breve propuesta en A71: preparar y afrontar al jefe, después usar botín y decidir siguiente paso, sin explicar solución. Fixtures/viewport/toque/eventos de pérdidaWebGL no acreditan personas o hardware real. Sin despliegue/publicación.

## Primera CI de main y corrección adicional de prueba

Main de99ef3 contiene A70/A71; PR3/PR4 reconocidas comoMERGED. CI39016752481: tipos/contenido/554unitarios/78PGRedis/build/scanner correctos, A70+A71 98correctos/10omisiones y Halloween12correctos. A69 18correctos/1fallido/5omisiones: ocultación simulada leyó cursor3 antes de publicarse último frame4. [Error original](evidence/main-motion-failure.md). Se canceló el resto tras conservar evidencia, no se presenta comoCIaprobada.

Código de reloj/React y prueba contrastados: setVisible liquida intervalo visible y publica React de forma diferida; el test tomaba inmediatamente un atributo anterior. Se espera ahora no-playing/no-ticking y dos frames de asentamiento existentes, después se exige cursor, progreso y paints constantes durante los300ms originales. No tolerancia a avances ocultos ni cambio de renderer. Caracterización pura del cruce al ocultar pasa7/7; no se afirma RED nuevo de producción. Tipos correctos, nuevaCI necesaria.

Las seis imágenes y43JSON actuales de la faseA70/A71 correcta quedan en [galería main](GALLERY.md) con SHA/procedencia; el fallo posteriorA69 no invalida ni convierte en aprobación global esa fase. [Métricas actuales](PERFORMANCE.md).

## Segunda CI y selector de consulta

CI39018704725 sobre8155efc:555unitarios/78PGRedis/tipos/build correctos; A70/A71 yHalloween correctos, A69 completo correcto incluida ocultación sincronizada. General55correctos/1fallido: selector de foco de prueba excluía [data-encounter-choice], aunque la ruta real abrió Encuentro y App lo enfoca. [Error](evidence/main-map-focus-failure.md). Se añade ese control legítimo al selector y se mantiene la exigencia de foco/retorno; consulta y cancelación comparan además estado económico completo del helper. Sin cambio de producto o debilitamiento de aserción. Se cancela resto propio tras recoger evidencia; nuevaCI pendiente. Metadata de ambos intentos preservada en evidence/ci-attempt-*.json.

## Validación final y entrega

CI39021060226, push real de main15b1a99, **success**, job completo terminado; [metadata y pasos](evidence/ci-final.json), [salidas resumidas](evidence/ci-command-results.txt). No reintentos automáticos. Una batería por vez,1worker, guard/lock/watchdog originales; solo Linux para gráficos. No navegador en elMac, sesiones/procesos ajenos o partida habitual alterados.

| Comando/recorrido |Resultado final |
|---|---|
|`npm run typecheck` |Correcto, dos proyectosTS |
|`npm run validate:content` |6correctos |
|`npm test` |555correctos/78archivos |
|`npm run test:integration` |78correctos/13archivos,PG16.9/Redis reales |
|`npm run build` + `npm run verify:arcana:build` |Correctos,14.983.901B; advertencia conocida chunk>500kB |
|A70+A71 (`playwright.boss-a70.config.ts`) |98correctos/10omisiones deliberadas |
|HalloweenA68 |12correctos |
|MovimientoA69 |19correctos/5omisiones deliberadas |
|Recorridos generales compilados Chromium/WebKit |56correctos |
|ProgresiónA67 |20correctos |
|Preparación/arena/cierreA63 |16correctos |
|Cabecera/PactosA66 |20correctos |
|IntencionesA65 |8correctos |
|PWA |12correctos |
|ReferenciaA66 y muestrasA67 baseline/current |Referencia construida y1correcto por variante |

Total navegador **263ejecutados correctos y15omisiones intencionales** de muestreo; no se suman repeticiones de intentos anteriores ni el notice duplicado de56casos del reporter. Comandos exactos en evidencia y workflow conservado. Cobertura de packs/idiomas/viewports, fixtures/autoridad/fallos simulados/humano y dispositivo sigue la matriz detalladaA71, sin elevar una fixture a partida real o un eventoWebGL simulado a fallo deGPU.

Nueva muestra final del jefe: P95rAF16,8ms, pico de arranque233,3ms, omisión89ms como límite superior;0LongTasks cálidas y7.628.832B de texturas propias estimadas. GenéricoA69 vuelve a33,4ms P95, objetivo20ms incumplido; intento intermedio16,8ms también conservado. Sin optimización de runtime en A72, esa variación no demuestra causa ni mejora estable. [Mediciones y límites](PERFORMANCE.md).

Seis imágenes main de99ef3 inspeccionadas con fuente y hashes enGALLERY; runtime/arte idénticos a la versión final15b1a99. La nueva CI reproduce el mismo recorrido y efectos, sin atribuir movimiento aPNG ni comprensión a tests. No se produjeron nuevosassets. La muestra animada sigue siendo brazo/objeto sobre ilustración plana, no rigcorporal.

Archivos nuevos/cambiados en esta revisión: tres pruebas de integración/replay, caracterización pura del reloj, PRD/DECISIONS/DESIGN/README y esta carpeta de evidencia. Sin cambios de aplicación o producción artística frente al A71 revisado. [Lista exacta](FILES.txt). Históricos A70/A71/Word conservados; los espacios finales en stdout históricos no se corrigen para evitar reescribir evidencia, código y diffnuevo pasancheck.

Pendientes de producto: observar si la amenaza/equipo/coste se reconocen, si el gesto tiene personalidad y si el botín orienta a continuar; protocolo breveA71INTERACTIONS. Lector hablado, dispositivo físico, atribución de picos/variabilidad y objetivo genérico de rendimiento siguen abiertos. No se acredita diversión, comprensión, aceptación artística definitiva o distribución.
