# A69 · Registro de validación gráfica

## Estado antes del candidato Linux

Preparado, **todavía sin ejecución de navegador A69**. No se ha abierto navegador, renderer, captura o grabación en el Mac para esta ampliación. Las pruebas se escribieron durante la implementación coordinada, contra contratos de observabilidad acordados; no se atribuye un RED de navegador anterior al código. Las pruebas unitarias TDD del reloj pertenecen al registro del coordinador.

Comprobaciones no gráficas ejecutadas en macOS, Node24.20.0:

- `npx --no-install tsc --noEmit --pretty false`: correcto después de crear los archivos del harness.
- `npx --no-install vite build --config tests/browser-motion/vite-motion-a69.config.ts`: correcto. Compila la entrada QA, componentes reales y renderer lazy en `test-results/motion-a69-build/`, fuera del build de aplicación. Permanece advertencia de chunk>500kB; no se elevó su umbral. El chunk de entrada de esta fixture incluye generador de BattleLog/configuración de prueba y no se presenta como tamaño del runtime productivo.
- Prettier aplicado a archivos QA y workflow. No se modificó guard, bloqueo, preflight, watchdog o excepción Mac.

La CI candidata, SHA y sus resultados se añadirán después de que el coordinador los consulte. Un archivo de workflow escrito no equivale a CI superada.

## Suites Linux configuradas

```sh
npx playwright test --config playwright.seasonal-a68.config.ts
ARCANA_CAPTURE_A69=1 npx playwright test --config playwright.motion-a69.config.ts
```

Ambas usan `defineSafeConfig`, un worker, bloqueo entre procesos, cero reintentos y vídeo/trazas/captura automática desactivados. En macOS se rechazan antes de abrir servidores/navegadores; no se ha intentado eludir esa protección. El workflow conserva regresión general compilada, A67, A63, A66/Pactos, intenciones, PWA y referencia/perfilesA66–A67. A68 y A69 se añaden **en serie**. PostgreSQL/Redis reales pertenecen a los servicios aislados del job. Timeout55min frente35 anterior: más cobertura sin aumentar concurrencia; no acredita duración observada.

`playwright.motion-a69.config.ts` construye y sirve una entrada compilada de QA, no un HTML con imitación de la interfaz. Importa `BattlePanel`→`SceneCanvas`/Pixi y `CardReveal` reales. El servidor de esa fixture no emite operaciones económicas. Los recorridos y garantías con autoridad real se cubren aparte por las suites de aplicación y76integraciones registradas por el coordinador.

## Matriz prevista y aserciones

Seis proyectos: Chromium/WebKit ×1280×900,390×844,865×1079. Cuatro declaraciones de prueba por proyecto; la muestra de30ciclos/capturas se ejecuta una sola vez en Chromium1280 y se omite intencionadamente en los otros cinco. Se esperan19tests ejecutados y5omitidos, si la enumeración final conserva esta configuración; no son24pruebas humanas.

| Recorrido | Cobertura prevista |
| --- | --- |
| Arena/lectura | Cada proyecto recorre ES/EN ×Diagon/ARCANA ×3×3/5×3/5×5:72composiciones en total. Todas las peanas deben caber sin ocultarse ni scroll ordinario. Estado inicial y árbol accesible no anticipan victoria/derrota/empate. Inspector por toque emulado, Escape y devolución de foco. |
| Reloj | Pausa conserva cursor/progreso y estabiliza dibujos; 2x conserva fracción al estar pausado; Auto avanza, inspector pausa, ocultación sintética congela cursor/dibujos y retorno continúa. Omisión muestra resultado con el mismo log. |
| Fallo real de renderer | `webglcontextlost` sobre el canvas real destruye la escena y mantiene resultado, ocho actores5×3 y salida accesible. Se comprueba ampliación200%sin desbordamiento horizontal. No se simula un resultado distinto. |
| Apertura | ES/EN y ambos packs, cuatro rarezas con nuevos declarados, copia repetida sin celebración de descubrimiento. Omisión, recarga, reducido, idioma/pack/remount y fallo de GSAP/arte preservan receipt. El chunk GSAP separado en el build QA permite comprobar que la petición se ha abortado realmente. |
| Ciclo de vida |30montajes/desmontajes secuenciales de arena real. Canvas retirado y hosts guardados muestran `destroyed=true`, `activeTicking=false`, texturas0. Durante escena, estimación de texturas≤12MiB. No se declara que esto mida toda la memoriaGPU ni que pruebe heap sin retenciones: el propio test conserva hosts para inspeccionarlos. |
| Rendimiento caliente | Una ventana de10s de replay con aumento real de `renderCount`, separada del arranque. No se desplaza arranque para afirmar mejora fría. |

Los BattleLog son fixtures reproducibles creadas con motor existente/seed69 y reglas declaradas (8rondas, condición amplia), no rivales nuevos de campaña ni balance observado. Las composiciones no escriben cuentas. Los snapshots comparados se serializan de los **objetos reales actuales mediante getters**, no de copias de texto congeladas que pudieran esconder una mutación. El primer recorrido registra y exige ceroPOST durante replay.

Ocultación se prueba inyectando `document.hidden` y despachando el evento al listener real: **no** representa mandar a segundo plano un dispositivo físico. Los fixtures de fallback y200%texto son explícitos. La sesión humana, lector y móvil físico siguen pendientes.

## Mediciones y evidencia

El probe toma deltas rAF y Long Tasks cuando la API existe, junto con contadores reales de dibujo/texturas. Un rAF por sí solo no acredita pintura: por eso se registra además `renderCount` y crecimiento en la ventana caliente. WebKit devuelve `longTasks:null` si no ofrece la API; nunca «cero» inventado.

Omisión y presentación de carta se marcan en `pointerdown` real del control. Resultado utilizable incluye espera de assets/decodificación/coreografía y la holgura de observación del runner. La fixture no tiene transacciónHTTP; por tanto esas cifras no se publicarán como compra→COMMIT→apertura. Las suites de aplicación mantienen esa cobertura separada. Navegaciones crean documento nuevo; no se borra la caché de red entre celdas y elJSON lo declara. No existe baselineA69 equivalente ejecutada todavía: las métricas históricasA58/A63/A67 son contexto, no una comparación porcentual fabricada.

JSON por proyecto/recorrido en `evidence/linux/`: P50/P95/máximo de frames, número de muestras, tareas largas/API disponible, renderer/texturas, tiempos y SHA de CI. Los presupuestos20msP95/50mspico/100msomisión se incluyen como **objetivos**, no como resultados ni certificación de diversión. El coordinador deberá revisar incumplimientos reales, incluso si las aserciones funcionales pasan.

Capturas nuevas **solo con** `ARCANA_CAPTURE_A69=1` **y Linux**, seleccionadas en un único proyecto: anticipación/contacto/resultado de una arena y resultado de una apertura. Sin vídeo, traces, captura de cada celda o automatización en el Mac. Una captura fija no prueba la secuencia temporal; sus contadores/estados y las pruebas la complementan.

Artefacto CI añadido: `a69-motion-and-seasonal-evidence`, conJSON/capturas seleccionadas y error-contextsA68/A69. Se conserva el artefactoA67 existente. No se publican fuentes/artifacts de QA como producto ni se desplegará por este workflow.

## Pendiente de completar con ejecución real

- SHA candidato/main y enlace exacto de la CI.
- Casos ejecutados/pasados/fallidos/omitidos; corregir fallos y repetir únicamente las comprobaciones afectadas, conservando el primer resultado.
- Inspección de las cuatro capturas y contraste de métricas contra objetivos, sin atribuir una mejora que el baseline no permita.
- Límites de memoria totalGPU, móvil físico, lector y observación humana.
