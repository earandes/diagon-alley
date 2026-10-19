# A87 · Validación en desarrollo

Baseline main440d278; códigoA87 todavía sin commit/CI propio. Ningún navegador local. Se mantiene CI Linux original, guardas/lock/watchdog/1worker/0retries; las nuevas pruebas gráficas aún no están ejecutadas.

## Ejecutado localmente, sin gráficos

- Umbral/Auto/snapshot de vínculos:3casos RED(módulo ausente)→GREEN.
- Combate: efectosOrden/Mortífagos/guardia y proyección final, más rechazo de ayudante que no estaba en turno. RED funcional→GREEN; dos errores iniciales de fixture (`BattleReplay.skip` inexistente y randomnumérico) se corrigieron y no se presentan como RED delproducto.
- Selección/formación e intención durable:2casos RED→GREEN.
- Contenido:34identidades/33tickets, estadísticas/rareza/estrellas previas intactas, clasificación sin falsas casas/animales y128semillas de candidatos fijos;3correctos.
- Snapshot público de reglas: reprodujo pérdida del bundle nuevo al proyectarlo; corregida y verificada la igualdad/congelación.
- Clasificación y perfiles/cues:3casos correctos. Cue único de especie, deduplicación por fase y ocultación; no escucha física/humana.
- `npm test`:675casos/107archivos correctos antes de las dos últimas pruebas de presentación y clasificación. Reejecución final pertinente pendiente; no se atribuye ese conteo a código posterior.
- `npm run test:integration`:108casos/18archivos correctos, PostgreSQL/Redis reales. Cinco casos nuevosA87 conPostgreSQL: respuesta perdida, concurrencia/rollback,StartRun+SetTeam, partidaA85 y adquisición de criatura. Fallo inicialreal: snapshot delreceiptSetTeamomitía bondFocus, haciendo fallar recuperación conOPERATION_CONFLICT; corregido yGREEN. SoloIDsdeensayoaleatorios, eliminados al terminar; partida habitual intacta.
- `npm run typecheck`: correcto tras integrar reglas/transporte/interfaz/renderer.
- `npm run build` y `node tools/arcana/verify-build.mjs`: correctos;17.326.223B distribuidos, +977.780B respecto aA86, sin masters enbuild. Advertencia existente dechunk>500KBconservada.
- Validación estática delpackprincipal:34personajes/188assets bilingües; falta contexto real y comprobar el packARCANA explícitamente.

Fuentes preparadas/instaladas:16WebPalpha y7WAVoriginales más3SVG. Estática inspeccionada; poses no son rig corporal. Se añadió prioridad de texturas enreposo antes deposescast, solo especiespresentes, sin nuevoSprite/ticker. Esto es implementación, **todavía no prueba de fluidez o calidad en contexto**.

## Pendiente antes de entrega

Recorrido conectado nuevo, controles de vínculo en UI, Pactos y Cromodex, muestras temporales/arte ausente/reducido, ambosidiomas/paquetes/tamaños, simulaciones pareadas y medidas con límites; CI real delcandidato y revisión de evidencia. Actualizar registros de assets/PRD/DECISIONS/DESIGN segúnresultado. LaCI main39173115270pruebaA85+A86, noA87.

## Candidato local19octubre · antes del primer commit A87

`npm run typecheck`, `npm test` (680/109), `npm run test:integration` (111/18, servicios reales), `npm run build`, `node tools/arcana/verify-build.mjs` y build del harness Vite correctos. Distribución17.328.456B; aviso de chunk>500KB conservado. Ambos packs completos pasan validate:skin (34personajes,188/173assets). Tres casos adicionales SQL verifican cuatro criaturas encantadas sin×2, apertura histórica y una sola llave entre versiones. Los conteos anteriores son hitos parciales históricos; estos son los más recientes. Formateo posterior sin cambio de comportamiento y tipos repetidos correctos.

La prueba de arte ausente intercepta tanto `cast.webp` como su nombre compilado `cast-HASH.webp` y exige observar solicitudes abortadas. El build Vite se inspeccionó para comprobar la ruta; una ruta de fuente no interceptaría el export compilado. No se presenta una ruta no interceptada como cobertura de fallo. La batería nueva está escrita, todavía no ejecutada. Ningún navegador local abierto.

## Ajuste de cobertura antes de gráficos

La fuente inicial d3cc959 fue sustituida en la cola por799e4c5 antes de ejecutar su batería. En799e4c5 se amplió la decodificación A84 a los16WAV reales y se añadió observación de fuentes nativas bajo consentimiento en A87. Revisión posterior del build detectó que el test de pose ausente necesitaba interceptar nombres con hash. Se detuvo exclusivamente la CI propia39177867296 en la fase no gráfica (integración/build), antes de abrir navegadores, para no ejecutar esa aserción defectuosa. No es un defecto del juego ni una validación gráfica superada. Se mantiene workflow, protección, worker y cero reintentos.

La CI histórica de main440d278,39173115270, ha terminado completa y correcta. No valida los cambios A87.

## Fallback contrastado en código, pendiente de Linux

El HUD compacto oculta los nombres de casa/grupo cuando su emblema es legible. Los emblemas nuevos usan archivos SVG externos; si fallan, `Artwork` devuelve null y aquel nombre también quedaba a tamaño0. Se prepara una regla localizada para mostrar el nombre del vínculo si falta la imagen, sin aumentar la barra ordinaria. El test aborta el SVG compilado, comprueba que el nombre sea visible y abre el detalle con teclado. No se afirma reproducción dinámica hasta ejecutar ese candidato.

`npm run test:browser:check` pasó con allowed=true, carga1,889,11núcleos y WindowServer39,25MiB/0%CPU. Solo preflight: ningún navegador o smoke local ejecutado. No se debilitan guardas o configuraciones.

## Corrección de acceso a las casas

La primera versión A87 sustituía por criaturas la segunda alternativa A85, eliminando los reclutas Gryffindor existentes y conservando solo tres temas humanos. La alternativa antigua tampoco garantizaba tres Gryffindor distintos: no se inventa esa garantía histórica. El incremento corregido permite los cuatro temas humanos en nuevas expediciones, con tres candidatos distintos por tema a lo largo de los mismos tres Pactos. El inicial solo no sesga toda ruta a Gryffindor; una colección propia de otra casa sigue pudiendo orientar su tema.

Prueba nueva RED: de128semillas no aparecía Gryffindor. GREEN tras la corrección: cuatro casas presentes y preferencia Hufflepuff con Cedric conservada en esas128semillas. Los12casos del contenido nuevo y A85 pasan; las ofertas antiguas A85 permanecen. Se conserva la calibración anterior y se repiten los escenarios del candidato. Sin cambios de precios, premios, probabilidades, estadísticas o motor.

## Primera batería gráfica A87: run39178088811

Fuente428927f, checkout729c7076. Tipos/build,680unit,111SQL/Redis, cuentas, bienvenida,A75(113),A70/A71/A73yHalloween correctos. Motion:85correctos,2fallidos,39omitidos; **check fallido, regression omitida**. [Error y evidencia cruda](evidence/candidate-428/provenance.json). Los2fallos móviles (Chromium/WebKit390) son una colisión del footer de herramientas de la fixture con el botón real Continuar. Se corrige la fixture, sin force-click o cambios al botón del juego. No se oculta ninguna unidad o contenido real.

Las6muestras A87 cumplen P95rAF16,7–16,8ms, figuras161,6–202,7ms y registroCPUdeposes163,7–204,7ms, sin long tasks observadas en sus ventanas. Se conservan crudos; no son tiempoGPU, red autoritativa, fríoOS o rendimiento físico. Audio:15WAVdeefectos solicitados solo trasconsentimiento y arranques nativos de lanzamiento/protección observados; decodificación16WAVenA84correcta. No se declara la batería completa superada.

## Hallazgos visuales contrastados en esa evidencia

- El libro de vínculo abierto ocupa demasiada altura y corta nombres a mitad de palabra: se corrige especificidad y composición, cinco medallones en filas compactas, nombres completos, sin paneles rectangulares equivalentes. Aceptación nueva: cinco elecciones en≤220px de alto en tamaños ordinarios; texto200%puede desplazarse.
- «Sin sinergias activas» contradice visualmente un vínculo activo. Ese bloque solo calcula afinidades: se nombra «Sin bono de afinidad» y su consulta indica afinidades, también enelinspector deljefe. No cambia ninguna regla.
- La ayuda usa la marca roja de un objetivo hostil por una colisión de especificidadCSS. Se diferencia con verdeytrazo doble, palabra ayuda y observación temporal encontacto, conservando los datos delreceptor/ayudante.
- La captura delPacto era una sección de prueba sin el diálogo real: no se presenta como evidencia delpopup productivo. Se ajusta el wrapper y se preparan dos capturas explícitas delApp conectado, una por paquete. Las capturas seleccionadas permanecen en la configuración A69 ya autorizada. El App conectado añade geometría, carga de los dos retratos y estado real como JSON por las rutas de artifacts existentes, sin modificar el workflow.
- Las afiliaciones históricas no deben prometer un bono para Ejército deDumbledore/Círculo deAprendices: ayuda concisa aclara que los grupos sin vínculo disponible son descriptivos.

La nueva fuente incluye la vía de cuatro casas, título «Duelo mágico» cuando hay criaturas, prueba del rival invertido declarada y los fallbacks anteriores. Se requiere su propia batería y revisión posterior; las cifras de428no se atribuyen al código siguiente.

Los controles propios de la fixture ya no se montan durante batalla. El límite de acciones de este archivo se acota a10s, conservando el límite general y cero reintentos. El log deWebKit muestra la intercepción delSwap; Chromium expira en el mismo tramo. La nueva ejecución deberá demostrar ambos retornos. No se atribuye esa espera al servidor o al motor.

## Candidato corregido preparado

Después de ampliar a cuatro temas de casa: `npm test`681/109correctos y `npm run test:integration`111/18correctos con servicios reales. Tipos, build, scan y compilación delharness correctos tras las correcciones de presentación (distribución17.329.832B en esa compilación). Advertencia existente dechunk>500KBconservada. Se añade cambio de paquete desde los Ajustes reales durante pausa; no se usa el footer de ensayo para cambiar el combate. Se comprueba que no repita cues.

La nueva calibración termina1.920expediciones y640pares: las filasA85 y lospares permanecen idénticos; A87cambia por loscuatro temas y sus datos se conservan separados dev1. Las cuatro casas y la preferencia deotra casa propia tienen prueba nueva RED→GREEN. No se afirma que todoslosplanes iniciales ganen: enDescubrimiento hay uncaso adverso de casa/afinidad; cantidad/criaturas32/32. EnTáctico aparecen conveniencias opuestas.

## Límite de credencial resuelto sin ampliar permisos

Elpush delcommit local a7d5fd7 fue rechazado por GitHub porque añadía unflagde evidencia y dos paths alworkflow y la credencial carece de scopeworkflow. No llegó al remoto. Se mantiene `.github/workflows/checks.yml` idéntico albaseline y se enmienda únicamente ese commit propio no publicado, sin forcepush. Las dos capturas complementarias delApp conectado no se ejecutan; se sustituyen por evidencia DOM real, retratos decodificados y persistencia. La imagen delPacto usa la fixture declarada con wrapper equivalente y el flag original de captura Linux A69. No se finge una fotografía delApp real o se elude una protección delMac. Las comprobaciones técnicas pertinentes continúan.
