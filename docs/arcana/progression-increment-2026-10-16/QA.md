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

## Pendiente de cerrar

Regresión Linux sobre SHA exacto, comparación A66/A67 de acciones equivalentes, integración/main remoto/CI. No publicar ni desplegar. Dispositivo físico, lector hablado, diversión y comprensión humana quedan para sesión posterior.
