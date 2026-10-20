# Validación, cobertura y límites A91

## Qué se ejecutó en esta fase

- Lectura de fuentes y documentación vigente; inspección Git/PR/main y comparación de árboles. main86d6a92 y local753b2a1 comparten árbol4127d93e346fec2b16d75b63c8eca38f13fdaed1.
- `impeccable context --target src/arcana/presentation/App.tsx`, una vez. No se actuó sobre drift de contexto ni configuración global.
- Dos assessments aislados según la skill; Assessment A terminó antes de incorporar al coordinador los resultados del detector B.
- `.agents/skills/arcana-impeccable/scripts/impeccable detect --json src/arcana/presentation`, una ejecución: exit2, dos resultados contrastados, sin overlay. No es aprobación estética.
- `python3 docs/arcana/whole-game-review-2026-10-19/tools/inventory.py`: cabeceras/bytes/hashes, cero archivos de registro ausentes. Sin decodificación gráfica ni audio.
- `python3 docs/arcana/whole-game-review-2026-10-19/tools/surface_details.py`: 209 anclajes de controles, 36 CSS/24 keyframes y 348 claves JSON efectivas por pack, sin campos vacíos o parámetros ES/EN discrepantes. No cubre todos los módulos TS ni acredita calidad lingüística.
- Inspección de15 PNG existentes mediante lector de archivos, cuatro copiados de artefactos históricos; no nuevas capturas.
- `python3 docs/arcana/whole-game-review-2026-10-19/tools/check_docs.py`: coherencia de IDs, referencias relativas, componentes y hashes copiados; resultado separado en documentation-check.json.

**No ejecutado ahora:** tipos/build/tests/servicios PostgreSQL-Redis/browser/CI/perfiles/grabaciones/reproducción de audio. No hay cambios de aplicación que justifiquen repetir esas baterías. La auditoría identifica pruebas a realizar al corregir; no afirma que esas correcciones estén validadas.

## Evidencia técnica anterior reutilizable

CI39280235365 sobre19f0b4fa1becad9f779b05c1936daeb86b544e07, checkout1dfca93108628d2d5fd29940240aad974e2a84dc idéntico. Tipos/build/contenido;759 unitarias/118archivos,120 PG-Redis/20archivos,6contenido;549 browser correctas y303 omisiones deliberadas, restauración aislada15 tablas. Se conservan fallo previoS07 y su corrección en A90. Son ejecuciones históricas, no datos de A91 ni de jugadores.

El cierre documental753b2a1 preserva5430objetos no exentos comparados; main86d6a92 es árbol idéntico aese cierre. No atribuir una suite nueva a main: [cadena de equivalencia](EVIDENCE.md). Los nombres/totales de tests describen lo ejecutado, no una cobertura universal de todas las combinaciones de68 superficies.

## Cobertura por familias

| Superficies | Revisado aquí | Evidencia seleccionada | Pendiente específico |
| --- | --- | --- | --- |
| S01–S12 acceso/recuperación | Condiciones, acciones, semántica y propietario C | V06/V07/V14 históricas; suites cuenta T | Login en contextoU03, sesión inválida con pending, cambio de dueño; correo externo no validado |
| S13–S15 Ajustes | Preferencias propias/efectivas, sonido voluntario C | V04, CI A90T | ÍndiceU13 si se decide; escucha, colores forzados/zoom/lector real |
| S16–S20 formación/equipo | Puestos, copias, filtros, consulta/gasto C | V02 contextual de comparación, otras referencias históricas T |30+ copias y nuevos nombres/posiciones, ninguna operación al consultar |
| S21–S24 mapa/equipo | Estados públicos, lista equivalente, emblemas C | V01 | Legibilidad de caminosU06 y gramáticaU07; no afirmar comprensión de ruta |
| S25–S32 nodos/preparación | Pacto, refugio, cofre, encuentro, duelo, jefe y tarros C | V03/V09/V11, Tpor suites previas | Cada elección en nuevos encuadres, stock100, nombre largoU08; no nueva captura de todos los nodos |
| S33–S40 arena | Fases/log/reloj/opciones/fallback C | V05/V08/V13; ensayos temporales históricos T | Nueva observación temporal para propuestas; rendimiento desfavorable no resuelto |
| S41–S43 resultados/intenciones | Prioridad del botín, evidencia/plan C | V12, suites intención T | Explicar plan y hechos con personas; no repetir operación histórica |
| S44–S49 tiendas/apertura | Stock/precio, consulta, coreografía confirmada C | V10 y documentación de apertura T | Ritmo/sonido escuchado, secuencia encantada actual completa, cierres sin arteU05 |
| S50–S54 colección/sabores | Denominador, capas, filtro y objetivo C | Captura fuente A90 citada en SCREENS, V10parcial | U01/U09/U11, identidades ocultas y archivo; no todas las fichas revisadas visualmente |
| S55–S60 taller/bóveda | Referencia/equipar/forjar separados; derechos y CTA C | V02/V15histórica | U02 tras agotar llave, orientación de botín por producto; no consumo nuevo |
| S61–S62 atlas/futuro |30fijo y región no jugable C | Sin captura fresca | U01 con34+archivo; no simular segunda región |
| S63–S67 temporada | Calendario/progreso/elección/recuerdo/error C | Sin captura fresca aquí; suite Halloween histórica T | U04, estados antes/cierre/edición y pendiente; accesibilidad visual de cada elección |
| S68 transversal | Mensajes/fallback/error C | Detector/source y evidencia A90 de fallbacks ya resueltos | Fallo selectivo libro/cierre; no generalizar a todo Artwork |

C no equivale a reproducción; V no equivale a animación; T requiere SHA/equivalencia. No se ha visto ni jugado todo en ejecución en esta fase. La cobertura pendiente no impide documentar hallazgos de código verificables.

## Estados que deben comprobarse en la fase de corrección

| Eje | Casos | Tipo de comprobación apropiada |
| --- | --- | --- |
| Partida/identidad | Primera visita/regreso/invitado/cuenta/vincular/sesión caducada/dueño incompatible | Modelo + integración PG/Redis cuando afecte autoridad; UI aislada |
| Operación | Antes de commit, commit con respuesta perdida, doble toque, dos pestañas, offline/recarga | Key/propietario/receipt invariantes; no solo mensajeDOM |
| Contenido | Snapshot30, catálogo34, archivo, versión incompatible, idioma/pack | Tests puros de fuentes efectivas + UI sin mutación |
| Equipo |1–5 y3×3/5×3/5×5, temporales/propios/duplicados/caídos/reserva | Fixtures declaradas + conectados reales pertinentes; no ocultar actor |
| Stock |0/1/3/30/100 tarros, monedas insuficientes, llave inicial/poseída/usada, frogposeída | Consulta/cancelación/gasto y actualización contextual |
| Colección |Inicial/amplia/completa/archivo, nuevo/repetido/encantado, filtros vacíos | Mismo universo, no información secreta; fuente exacta/propiedad |
| Reproducción |Pausa temprana/2x/inspector/ocultación/omitir/consulta histórica | Log idéntico, fases temporales y efecto finito; no nuevo premio |
| Robustez visual |Imagen ausente/import fallido/contextlost/fontcarga lenta | DOM operativo, cierre visible y registro accesible |
| Lectura |ES/EN×ambos packs,1280×900/390×844/865×1079,320/200% | Geometría+inspección seleccionada; zoom real aparte |
| Accesibilidad |Teclado/foco/toque, sistema/propia reducido, contraste/forcedcolors | Nombre/estado/retorno, no solo color; lector y dispositivo físico aparte |
| Temporada |Antes/durante/cierre/nueva edición, parcial/recuerdo obtenido | Reloj inyectado, progreso y premio una vez, sin alterar colección base |

## Ejecución gráfica futura segura

Solo CI Linux, una batería a la vez con guard, bloqueo, preflight, watchdog, un worker y retry0 originales. Usar suites existentes pertinentes al consumidor modificado y casos nuevos acotados; no multiplicar todos los ejes de esta tabla como una matriz exploratoria. Capturas seleccionadas explícitas; no vídeo/trazas por defecto. No lanzar desde subagentes en paralelo.

En este Mac no se ha usado Chrome/CUA/Browser ni scripts alternativos. La excepción `npm run test:browser:local` no se ha necesitado; `test:browser:check` solo preflight y tampoco se repitió. No se cierran procesos ajenos.

## Rendimiento conservado, no aprobado universalmente

Cohorte A75 emulada390ESDiagon5×5,3 paresAB/BA/AB y módulo evaluado: ChromiumactualP95rAF16,7–16,8ms; referencia16,8. WebKitactual21–23ms; referencia22. Acción→primer frame listo Chromium320,6–348ms vs316,4–324; WebKit393–524 vs425–743. No frío controlado, no dispositivo físico y no mejora atribuible de arranque por A90.

Otras72ventanas finitas A69, sin paresAB/control de host: Chromium16,8–50,1ms; WebKit31–92ms. Referencia por nombre de fixture16,7–50 y32–90 respectivamente. No afirmar causa o mejora con esa comparación. El objetivo20ms no es universal ni umbral del test funcional. rAF≠GPU; bytesRGBA≠memoria residente; contadores propios no prueban ausencia global de fugas. Datos originales en A90/evidence/performance.

Para cualquier corrección futura: acotar previamente3 pares por condición relevante, mismafixture/log/caché declarada y configuración. Medir gesto→utilizable y coreografía separados, conservar errores/extremos. No mover trabajo previo ni esconder participantes para mejorar cifra. Si cambio no afecta renderer, no relanzar perfiles completos por rutina.

## Sesión humana propuesta, no realizada

Dos hipótesis principales: H1 la gramática personaje/equipo/ruta reduce explicaciones necesarias; H2 objetivos verdaderos y hechos comprobables facilitan elegir voluntariamente otra expedición. Tareas en BUSINESS-METRICS sin decir cómo resolverlas. Preguntar qué espera, qué cambió y qué elegiría después; registrar ayuda/dudas/pausas. Sin inferir diversión/retención de terminar la tarea. Dispositivo físico, lector real, zoom real y escucha voluntaria permanecen pendientes.

## Archivo de la crítica

Copia adicional mediante helper de Impeccable en `.impeccable/critique/2026-10-19T19-42-17Z__src-arcana-presentation-app-tsx.md`, target App.tsx con fingerprint conservado.30/40, primera puntuación archivada para este target, sin tendencia comparable. El informe canónico amplio y el backlog permanecen en A91. No se ha creado overlay ni modificado hooks/configuración.
