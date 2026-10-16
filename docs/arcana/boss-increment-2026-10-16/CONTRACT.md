# A70 · El último duelo · contrato previo

16octubre2026. Base `f5d3a89`, main verificado en CI38964171860. La petición autoriza diseño, arte mínimo, implementación y validación; rama/PR para CI Linux. **Integrar en main y desplegar requieren autorización posterior.** Word, cambios ajenos y evidencia histórica conservados. Goal activo.

## Hechos y experiencia

El jefe es un equipo guardado, no un enemigo fijo. Descubrimiento: circe/Hermione y2neutrales; Táctico: storm-caller/Tonks, rune-weaver/Ginny y2neutrales; Maestría: circe, ember-keeper, copper-sage, storm-caller, mist-seer. Legacy3neutrales conserva alias visual. La vista de cierre won usa hoy un alias genérico que puede no haber participado. A69 ya proporciona reloj compartido, pause/2x/skip y fallback.

Buscamos expectativa y reconocimiento del adversario, control al preparar y satisfacción de entender el cierre. La muestra protagonista será la primera unidad nominal del plan; si no hay nominal, la posición de jefe del pack vigente. No se declara villano ni personaje nuevo. Solo el líder real circe recibe la muestra de objeto articulado Hermione/libro o Circe/cuenco; los demás mantienen figura compatible.

## Comparación y decisión

1. Transformar el retrato completo: coste bajo, personalidad limitada y ninguna articulación real.
2. Conservar pintura y articular un objeto específico: buen reconocimiento con pocas capas; **elegido**. Cuerpo sigue siendo raster plano; cubierta/página o superficie de cuenco son piezas reales independientes.
3. Nuevo rig anatómico/poses completas: requiere pintar zonas ocultas y verificar continuidad; fuera de esta muestra mínima por riesgo de costuras y cambio de acabado.

## Recorrido

Mapa→consultar jefe: figura/nombre real, roster/afinidades, detalle y sinergias efectivas derivadas de reglas compartidas. Se reutiliza el diálogo y la preparación existente; sin intro modal extra, espera obligatoria ni confirmación redundante. Un solo Fuego no promete quemadura. Consultar/cancelar no escribe ni gasta.

Preparar→confirmar: formación/equipamiento guardados y borrador de grageas conservan sus fronteras. BattleLog/resultado/consumo guardados antes de reproducir.

Arena: identifica líder; cubierta/página o cuenco responden al spell-cast real del líder y lanzamiento sale de su objeto. Anticipación0–.18, vuelo.18–.78, contacto.78–1 de la fase A69, con reposo al terminar. Reacción de figura plana limitada; PV/nombre y todos los actores visibles. Sin habilidad/fase nueva. Reducido y arte ausente dejan figura/fallback estático. Sin nuevo reloj, contexto, filtro, audio o bucle.

Desenlace→botín: identidad real del encuentro y como máximo2hechos player guardados (activación, curación positiva o sinergia), sin causalidad inventada. Resultado y botín primero, uso por stock real después. Intenciones existentes permanecen viables y separadas; nueva run siempre explícita. Histórico no vuelve a conceder ni celebrar.

## Invariantes

No cambia dominio, catálogo, composición, combate, estadísticas, RNG, precios/pesos/premios, energía, snapshots o acceso. No nuevo estado persistido: hechos e identidad derivan de plan/combat/receipt guardados. Visuales nunca deciden recompensa. Consulta/replay/cancelación/idioma/pack/recarga no ejecutan operaciones.

## Arte y presupuesto de ensayo

Primero una muestra en contexto con fuentes existentes. Máximo2–3capas por pack, registro de dimensiones/pivotes/fuente/procedencia y export CPU reproducible. Objetivos nuevos: ≤100kB comprimidos y≤2MiB RGBA extra por pack; son objetivos hasta medir. Articulación de objeto, no rig corporal. No inferencia o GPU local ni lote de personajes. Fallback conserva figura original y vuelo genérico. Fuente/exports/consumidor documentados; no se acredita licencia de franquicia o arte definitivo.

## Aceptación

- Identidad coincide con composición guardada en legacy/3/4/5; cierre no inventa personaje.
- Cancelación/consulta conservan recursos y foco. Preparación y confirmación explícitas.
- Misma batalla y premios antes/después de replay; pausa temprana/2x/oculto/inspector/skip/pack conservan reloj.
- Pieza del objeto cambia en fase de hechizo real, vuelve al reposo, no queda duplicada o separada del cuerpo. Reducido/fallo de overlay no bloquea el juego.
- Hechos0..2 verificables, sin datos de rival o afirmaciones de eficacia. Primera/repetida/derrota/empate correctos.
- Botín usable y orientación posterior conservados; consultar/recargar no repite concesiones.
- ES/EN, packs,1280×900/390×844/865×1079, teclado/foco/toqueemulado/reducido, arte/import/renderer fallidos.
- Tipos/build/unitarios y PG/Redis pertinentes; Linux seguro y evidencia seleccionada. Física/humana pendientes.

## Plan vivo y responsabilidad

1. Completado: fuentes/estado, boss real, alternativas y contrato previo.
2. Implementado: proyección/identidad/cierre, objetos y prelude/preparación; TDD de hechos/poses/consulta.
3. Comprobado localmente sin navegador:542unitarios,77PGRedis,tipos/build/content/scan. MuestrasCPU inspeccionadas; integración arena/reloj preparada. Preflight solo consulta, sin lanzar smoke.
4. Pendiente: candidato/PR, CI Linux serial, capturas seleccionadas y corrección.
5. Pendiente: documentación final y entrega de rama validada. Main/despliegue excluidos.

Root integra App/NodePreparation/BattlePanel/Pixi y coordinación. Agente hechos: boss-presentation.ts, boss-facts.ts, BossBattleFacts.tsx, ExpeditionClosure y mensajes/tests propios. Arte: fuentes/exports/manifest, sin editar renderer. QA: tests/browser-boss yconfig A70, sin lanzar suites; root coordina única ejecución. No agentes abren navegador o servicios en paralelo.
