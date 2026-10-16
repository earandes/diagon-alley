# A67 · Validación coordinada

## Ejecuciones locales finales, sin navegador

Node 24.20.0; PostgreSQL/Redis reales del compose del proyecto. Contextos y cuentas aislados.

| Comando | Resultado |
|---|---|
| `npm test` | 465/465; `evidence/unit-release.txt` |
| `npm run test:integration` | 63/63; `evidence/integration-release.txt` |
| `npm run build` | Correcto; incluye tipos y skins; `evidence/build-release.txt` |
| `npm run verify:arcana:build` | Correcto; `evidence/scanner-release.txt` |
| `node tools/arcana/a67-study-checks.mjs` | Correcto; `evidence/study-release-checks.txt` |
| `npm run test:browser:local` | 1/1 en 3,6 s, prueba limitada con watchdog, sin media; `evidence/local-browser-smoke.txt` |

## Cobertura y clasificación

Integración: offers fijas, trade único, cancelación sin cambio, rollback, COMMIT con respuesta perdida, dos comandos concurrentes, consulta obsoleta, metadatos inválidos, snapshots antiguos, premios únicos entre desafíos y especializaciones sin reinterpretar V1. No se atribuye concurrencia SQL a una captura.

UI histórica A67: ES/EN, Diagon/ARCANA, 1280×900,390×844,865×1079; consulta/selección/cancelar/Escape/foco; recarga; alcance grupo; recuperación; forja→equipar→combate; falta de WebP/WebGL, reducido y texto 200%. La última forja WebKit se interrumpió al caer WindowServer; no está aceptada por aquel log. Regresión general local incompleta. La CI Linux debe cubrir estos pendientes y constar con su SHA.

La política de ruta del harness elige un camino sobrevivible usando el contenido público y motor compartido para pruebas de cierre/inventario. No altera campaña, no es IA de producción ni una medida de dificultad o comportamiento humano. Test determinista `qa-route-planner-a67.test.ts`.

## Protección del host

Suites completas rechazadas en macOS antes de arrancar navegador/servidor; un worker global por suite y bloqueo entre comandos/worktrees; vídeo, traza y screenshot automáticos desactivados. Solo smoke fijo mediante watchdog, con límite 60 s y parada por presión o fallo de monitor. No garantiza inmunidad del compositor. [Diagnóstico y límites](HOST-INCIDENT.md).

## Historial de CI y correcciones del harness

- `38927428811`, SHA c858fa4: 55/56 regresiones. HUD esperaba botín de victoria tras escoger una rama solo hasta Encuentro y después perder el jefe. El receipt de derrota era correcto. Se fija el camino completo de la prueba antes de bifurcar; no se cambian rivales o premios.
- `38928713276`, SHA16f76ea: regresión56/56. A67 16/20: cuatro WebKit leían altura anterior de escena inmediatamente tras cambiar viewport (744 frente contenedor672). La comprobación nueva espera a la geometría observable de ResizeObserver/React y exige además que cada actor esté dentro. No añade scroll, recorta actores o relaja el tamaño permitido. El resultado de esta corrección se registra en CI posterior; aquel16/20 no se convierte en aprobado.

- `38930280886`, SHAcf8654c: regresión56/56, A6720/20, cierreA6316/16, intenciones8/8 y PWA12/12. Cabecera/Pactos14/20: tres lecturas de resize sin esperar y tres expectativas de amenaza especial en un duelo introductorio neutral de Descubrimiento. Se comparte la comprobación de geometría observable y el recorrido táctico elige Táctica explícitamente; la cabecera A66 sigue comprobándose en Descubrimiento. No se rebajan las aserciones de amenaza.
- La comparación A66 no llegó a ejecutarse en esa corrida: `git archive` superaba el bufferstdout de256MB para un árbol de534.593.535bytes. El extractor escribe temporal en disco, extrae y retira ese archivo; no carga el árbol en el heap. El perfil A67 sí se ejecutó, pero sin pareja no demuestra una diferencia de latencia. CI35min permite las suites secuenciales; regresión general sobre buildcompilado en la siguiente corrida.

La política técnica de ruta usa candidato0, refugioPV y pasar encuentros sin grageas. Para la cuenta inicial y sus tres Pactos coincide con lo confirmado. No es una política óptima general; el fallback BFS no acredita victoria y las fixtures futuras con equipo lleno deben declarar si sustituyen o pasan antes de reutilizarla. No se deduce diversidad o dificultad de una fixture elegida para comprobar el receipt ganador.

## Validación final de código

[CI38934126220](https://github.com/earandes/diagon-alley/actions/runs/38934126220) correcta sobre `13447f0eeec0afaed83e7313b964cb05993aa7a0`. 465unitarios,63integración real y134casos de navegador:56regresióncompilada,20A67,16cierreA63,20cabecera/Pactos,8intenciones,12PWA y2perfiles. ReferenciaA66 reconstruida y compilada correctamente; comparación ejecutada, no pendiente. Logs/metadata en `evidence/ci-validated*`, datos en PERFORMANCE.md.

El preparador táctico elige Táctica explícitamente y reconoce el selector de pasar de encuentros nuevos/legacy. Geometría esperaResizeObserver y comprueba todos los actores; no se oculta contenido ni se concede un premio para fabricar una victoria. Una corrida adicional38933970398 se canceló temprano para completar ese selector; no se cuenta como superada.

Integración autorizada por fast-forward; la CI exacta del commit final de main se vuelve a consultar y comunicar en la entrega. Sin publicación/despliegue. Dispositivo físico, lector hablado, diversión y comprensión humana quedan para la sesión posterior.
