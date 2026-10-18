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

La fuente inicial d3cc959 fue sustituida en la cola por799e4c5 antes de ejecutar su batería. En799e4c5 se amplió la decodificación A84 a los16WAV reales y se añadió observación de fuentes nativas bajo consentimiento en A87. Revisión posterior del build detectó que el test de pose ausente necesitaba interceptar nombres con hash. Se detuvo exclusivamente la CI propia39177867296 durante las pruebas de integración, antes de abrir navegadores, para no ejecutar esa aserción defectuosa. No es un defecto del juego ni una validación gráfica superada. Se mantiene workflow, protección, worker y cero reintentos.

La CI histórica de main440d278,39173115270, ha terminado completa y correcta. No valida los cambios A87.
