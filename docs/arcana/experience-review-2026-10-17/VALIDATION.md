# A74 · Evidencia, ejecución y límites

17 octubre 2026. Auditoría documental sobre main `937a0a1f00bdbca7009a80cd99b7b4b450f652f0`. No se ha implementado ninguno de los fixes. No se ha tocado una cuenta ni arrancado servicios o navegador para esta fase.

## Método y procedencia

Fuentes normativas leídas: AGENTS.md, PRD completo, DECISIONS completo, DESIGN y README, más HOST-INCIDENT. Se contrastaron estado/aceptación históricos, contratos y evidencia vigente A63/A65/A67/A68/A69/A70/A71/A73 según el recorrido implicado. Las cabeceras A60 de REQUIREMENTS-STATUS, FINAL-ACCEPTANCE-AUDIT y PHASE-4-STATUS no acreditan ni desmienten por sí solas las ejecuciones posteriores.

Skills aplicadas: Game Design Workshop (diagnóstico/decisiones/feedback), Game UI/UX (jerarquía, equivalencia, foco y responsive), Game Feel (eventos/coreografía), Impeccable audit/critique (evaluación independiente y detector). Taste se limita a preservar identidad y auditar antes de cambiar: su propio alcance excluye interfaces complejas; no se trasladan defaults de landing pages al juego. No generación de imágenes ni pipeline de producción nuevos.

Impeccable context se ejecutó una vez sobre App. Assessment A se cerró antes de leer los findings de B; los evaluadores no leyeron el informe ajeno. B ejecutó un detector estático una vez, acotado a seis archivos tras inventariar538. Resultado `[]`/exit0, stderr vacío. No inspecciona todos los CSS ni verifica estados de red o calidad artística. [Raw](detector.json), [stderr](detector.log). La síntesis no adopta la puntuación ordinal de B como nota de calidad integral: la cobertura no permite ese claim.

El coordinador contrastó los findings con el código/CSS y vio los siete PNG seleccionados. Consolidó A-02+B05 en F07, amplió B03 a BeanAssignments y añadió F11 por divergencia duelo/jefe. **Descartó la mitad relativa a Ajustes de B06**: `game-stage.css:1159–1175` ya revela texto cuando no hay imagen; F09 conserva solo el cambio mapa/lista. Descartó también un supuesto error de redondeo del Refugio al comprobar que preview y aplicación usan el mismo40%; no se registra como bug. Recomendaciones de estilo no equivalen a condiciones humanas observadas.

Preguntas de crítica omitidas deliberadamente: la solicitud es revisión experta y documentación para una implementación posterior. No hay una decisión material que bloquee entregar el análisis, ni se sustituye la sesión humana por respuestas inventadas.

## Comandos ejecutados ahora

Entorno macOS; Node `v24.20.0`, npm `11.19.0`. Comandos lanzados en serie, sin servicios, navegador ni perfil gráfico. Los logs no son de una CI nueva.

| Comando | Resultado nuevo A74 | Evidencia y límite |
|---|---|---|
| `git status --short --untracked-files=no`, `git rev-parse HEAD`, inspección de diffs | Sin cambios rastreados iniciales; baseline main937a0a1 | Archivos ajenos no rastreados conservados. No staging/reset/clean. |
| Comparación `git ls-tree -r` del merge probado y HEAD | **1862 objetos no documentales idénticos** | [baseline.json](baseline.json); excluye docs/** y DESIGN.md. No implica ejecutar tests en HEAD ni valida archivos no rastreados ajenos. |
| Impeccable context sobre App, una ejecución | Correcto; contexto existente reutilizado | Sin brief ni edición de UI; evaluación documental. |
| Impeccable detect, una ejecución sobre App/MapPanel/ExpeditionPreparation/BattlePanel/CommercePanel/CollectionPanel | Exit0, `[]` | [detector.json](detector.json), [detector.log](detector.log). No aceptación artística, WCAG o ausencia general de defectos. |
| `npm test` | **562 correctos /81archivos**, exit0; duración reportada2,33s | [unit-tests.log](unit-tests.log). Reglas/controlador/proyecciones y otros unitarios actuales; no interfaz interactiva ni PG/Redis reales en este comando. |
| `npm run build` | **Correcto**, exit0; incluye validate:skin, typecheck principal/worker y Vite | [build.log](build.log). Se conserva warning chunk>500kB; bundle de entrada≈1010,94kB minificado/315,01kB gzip. No se infiere una causa de jank del peso o del tiempo de build. |
| `npm run verify:arcana:build` | **Correcto**, exit0 | [build-verification.log](build-verification.log). Comprueba el artefacto conforme al verificador existente, no rendimiento runtime ni distribución autorizada. |
| Verificación de enlaces/JSON/no cambios de aplicación | Correcta al cerrar | [documentation-check.json](documentation-check.json). Validación de documentación, no del comportamiento propuesto. |

No se ejecutó `test:browser:local` ni `test:browser:check`: no hacían falta para inspeccionar fuentes/PNG existentes. No se ejecutaron WebKit, matrices, perfiles, grabaciones o capturas en este Mac. No se cerraron procesos/sesiones ajenos. No se instalaron dependencias ni se alteró configuración global. Build solo produjo su salida local habitual ignorada.

Primer check documental: detectó su propio JSON de salida todavía no creado; resultado conservado en `documentation-check-initial.json`. Tras generar ese recurso, la comprobación final no tiene enlaces rotos. Es orden de generación de evidencia documental, no un fallo de producto ni una batería funcional repetida.

## Evidencia técnica reutilizada, sobre código equivalente

Fuente: [VALIDATION A73](../fluency-increment-2026-10-17/VALIDATION.md), [COVERAGE A73](../fluency-increment-2026-10-17/COVERAGE.md), [equivalencia histórica](../fluency-increment-2026-10-17/evidence/final/code-equivalence.json), artifacts/logs allí enlazados.

- CI **39038639396 success** documentada; head `eb5ce91b44e403882ab03036fcd853446b0761f7`, merge ejecutado `8541ee2c9fbf3844d5df0f433945113fd96bd7c0`. No se consultó de nuevo GitHub para afirmar estado remoto actual; no hace falta una integración nueva en esta auditoría.
- **562 unitarios/81archivos,78 integraciones PG/Redis reales/13archivos,268gráficos correctos y40skip** en las configuraciones invocadas. El total no demuestra ejecución de cada prueba escrita en el repo.
- Cuatro journeys autoritativos A73 ES/EN×packs en Chromium1280: entrada→equipo→ruta→combate→mapa→jefe→cierre→rana poseída→otra run explícita. Helpers de ruta y cuentas aisladas declarados; no una persona ni una política humana espontánea.
- A70/A71 y A69 aportan casos Chromium/WebKit en1280×900,390×844,865×1079. No todas las combinaciones de estado/packs/idiomas forman un factorial completo. El lifecycle A73 de decode/hidden/resize/reducido es Chromium con fixture5×5 y visibilidad sintética.
- PG/Redis reales prueban transacciones, idempotencia, dos conexiones, recuperación postcommit, historicidad, derechos de primera victoria y estacionalidad según sus casos. No se han vuelto a arrancar ahora ni se les atribuyen los nuevos escenarios F01–F11.
- PWA/A63 cubren offline y respuesta perdida de operaciones específicas, incluida rana ganada abierta sin recompra y dos pestañas en resolución de nodo. No equivalen a entrada concurrente F02 ni errores en el inspector superior F04.
- Las configuraciones de tácticas/adverse A65 no se invocan completas por el workflow final. Los tests de contraste de arena escritos tampoco se contabilizan automáticamente como ejecutados por esa CI. Las suites históricas A59/A60 excluidas del trial general no se suman por existir en disco.
- Derrota/empate tienen modelos/render estático acreditados; **no se acredita un nuevo journey gráfico integral de ambos** sobre este candidato. No se afirma que estén rotos.

La aplicación no cambió en A74, por lo que no se relanza una matriz extensa del mismo runtime para redactar el informe. Los fixes posteriores sí necesitan ejecutar sus nuevos casos y regresiones afectadas sobre el candidato real.

## Galería seleccionada: vistas actuales, no mockups

Procedencia común: capturas explícitas Linux CI39038639396/merge8541ee2c, mismos objetos de runtime/estilos/arte que HEAD. Vistas otra vez por coordinador y Assessment A. No se copiaron ni sobrescribieron. Los nombres QA/valores extremos pertenecen a fixtures, no al balance de campaña.

| Archivo | Qué permite afirmar | Qué no permite afirmar |
|---|---|---|
| [Antesala desktop](../fluency-increment-2026-10-17/evidence/final/selected-preparation-desktop.png) | Separación rival/equipo/suministros, coste5 y una acción principal | Movimiento del jefe, respuesta al toque, ordenTab o primera preparación de run |
| [Antesala móvil Diagon](../fluency-increment-2026-10-17/evidence/final/selected-preparation-mobile-diagon.png) | Composición390 y repetidos posibles; tarro/acción presentes | Que las personas distingan procedencia sin aprender símbolos |
| [Antesala móvil ARCANA](../fluency-increment-2026-10-17/evidence/final/selected-preparation-mobile-arcana.png) | Presentación equivalente de la escena y texto más largo | Igualdad de peso perceptivo/lectura humana entre paquetes |
| [Arena Diagon](../fluency-increment-2026-10-17/evidence/final/selected-actor-diagon.png) | Dos bandos y contacto/actor mostrado en un instante | Coreografía en tiempo, hit timing, continuidad o rendimiento |
| [Arena ARCANA](../fluency-increment-2026-10-17/evidence/final/selected-actor-arcana.png) | Siluetas/escala actuales y relación con peanas | Animación articulada completa o gusto de jugadores |
| [Arena móvil5×5 pausada](../fluency-increment-2026-10-17/evidence/final/selected-paused-resize.png) | Diez nombres/PV presentes y figuras pequeñas frente a etiquetas; F06 | Claridad durante playback o un dispositivo físico |
| [Cierre](../fluency-increment-2026-10-17/evidence/final/selected-closure.png) | Resultado/loot/destinos actuales y relación con escenario | Concesión económica, repetición/derrota o motivación humana |

Falta evidencia visual actual seleccionada para una aceptación artística de entrada, mapa base, Pacto, Encuentro, preparación inicial, tiendas, apertura completa, álbum, forja/bóveda, Ajustes y Halloween. Se inspeccionan consumidores/estilos y pruebas correspondientes; **no se declara validadas visualmente todas esas superficies**. Ampliar evidencia en CI Linux de forma dirigida cuando se trabaje el fix pertinente, sin capturas masivas.

## Rendimiento: referencia conservada, no medición nueva

A73 ya investigó la fluidez; no se repite un benchmark para una auditoría sin runtime nuevo. Ver [PERFORMANCE](../fluency-increment-2026-10-17/PERFORMANCE.md).

- A/B15, mismas condiciones y tres parejas AB/BA/AB: arena genérica y remount P95rAF33,4→16,7–16,8ms; jefe baseline16,8/33,2/16,8→16,7ms. Picos de arranque genérico200–233→50–67ms y jefe233–250→50–83ms, en esas muestras concretas.
- A/B16 usa disponibilidad precisa después del submit de la escena/RAF: genérico236,5–242,3ms, jefe289,2–326,9ms; no es “tiempo humano hasta comprender”. Se conservó polling: dos muestras genéricas baseline fueron3–4ms antes según el marcador preciso. No mejora universal de toda métrica.
- Las muestras cortas A69 incluyen arranque/pausa/consulta/omisión: P95 WebKit26–77ms y máximo89ms en su protocolo, **no** ventana sostenida de10s equivalente al A/B Chromium. No se ocultan ni se combinan como una cifra universal.
- rAF no es GPU; promesa decode no es CPU pura; tamañoRGBA no es memoria residente; contadores locales liberados no demuestran ausencia global de fugas. No se ha medido hardware móvil físico.

Los fixes de layout/evidencia de F06 deben conservar condiciones, coste total desde acción y resultados desfavorables. El warning del build no autoriza otra optimización especulativa.

## Qué significa el cierre de A74

**Completado:** diagnóstico experto, revisión de código/estilo sobre evidencia disponible, pruebas locales no gráficas, contraste de cobertura, propuesta unificada y plan de fixes verificables. Aplicación intacta.

**No completado ni afirmado:** reproducción gráfica nueva de cada finding; inspección dinámica artística de todos los movimientos; aceptación global WCAG; lector audible; zoom nativo; dispositivo físico; observación humana de comprensión, ritmo, diversión o repetición. La revisión identifica esos huecos y permite preparar la siguiente implementación; no los sustituye por una aprobación estética genérica.

No se crea un nuevo goal de implementación, commit/PR/push o despliegue: no están autorizados por esta solicitud. El plan documental se cierra con resultados y límites, y los fixes permanecen propuestas.
