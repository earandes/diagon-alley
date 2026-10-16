# A67 · Archivos y dependencias del incremento

Base remota original: `97573b0d95c027d0192914afcb73d32e74fb23a6`. El incremento conserva e integra el trabajo local A65/A66 del que depende; no se reseteó el checkout ni se añadieron indiscriminadamente los directorios históricos sin seguimiento.

| Área | Archivos principales y responsabilidad |
|---|---|
| Encuentros | `domain/exploration/encounter-trades.ts`, `application/node-options.ts`, `domain/exploration/nodes.ts`, `application/game.ts`: proyección/validación/receipt fijados y recuperables |
| Progresión | `content/progression-v2.json`, `infrastructure/content/progression-content.ts`, `application/run-use-cases.ts`, `domain/exploration/run.ts`: perfiles en grafo generado y snapshot, mismos derechos económicos |
| Equipo | `content/equipment-v2.json`, `infrastructure/content/equipment-content.ts`, `domain/economy/equipment.ts`, `commerce.ts`, `combat/equipment-effects.ts`, `engine.ts`, `application/prepare-team.ts`: instancias V2 y reglas compartidas, legacy conservado |
| Transporte/persistencia | `application/client/*`, `infrastructure/http/*`, `infrastructure/postgres/*`: solicitudes estrictas, intención A65, concurrencia y recuperación |
| Presentación | `EncounterPreparation`, `EncounterTradeOutcome`, `ExpeditionChallenge`, `NodePreparation`, `NodeResult`, `CommercePanel`, `ExpeditionPreparation`, `BattlePanel`, `App`; mensajes/estilos asociados. Título Encuentro sin sugerir azar |
| A65/A66 conservados | `ExpeditionIntentions`, `TacticalBadge`, `tactical-v1.json`, reglas de ofertas/rivales/intenciones, `tactical-a65.css`, `header-pact.css`, dos SVG editables existentes |
| Pruebas | Unitarios bajo `tests/domain/arcana`, integración SQL/Redis bajo `tests/integration/arcana`, recorridos y fixtures declaradas bajo `tests/browser-trial` y `tests/support` |
| Protección del host | `tools/verification/playwright-safety.ts`, `playwright-suite-lock.ts`, `local-browser-health.ts`, `run-local-browser-smoke.mjs`, todas las configuraciones Playwright; AGENTS/README. Smoke fijo, sin matrices locales |
| Estudio | `tools/arcana/a67-study.mjs`, `a67-completion.py`, `a67-study-checks.mjs`, `simulate-equipment-a67.mjs`; datos/referencias/hashes en esta carpeta |
| CI y rendimiento | `.github/workflows/checks.yml`, `build-a66-reference.mjs`, `run-performance-preview.mjs`, `playwright.performance-a67.config.ts`, test de acciones equivalentes |
| Documentación/evidencia | PRD1.0.33, DECISIONS, DESIGN, README, A65/A66 y esta carpeta. Galería compacta con fuentes/hashes; PNG/vídeos históricos completos se conservan localmente |

Las rutas de aplicación de la tabla son relativas a `src/arcana/`; no son archivos nuevos todos. El diff exacto de la entrega se obtiene con `git diff --name-status 97573b0d95c027d0192914afcb73d32e74fb23a6 <SHA-de-entrega>`. El SHA remoto y CI se comunican en la entrega final y el informe de integración.

No se añaden dependencias de producción, servicios de pago, configuración global, motor, región o migración que reinterprete recompensas. Word históricos, precios, pesos, energía y estadísticas maestras quedan intactos. Los nuevos efectos de forja y composiciones son los autorizados en el contrato. Logs originales conservan whitespace de terminal; la revisión de whitespace se limita al código/documentación editables, sin reescribir evidencia bruta para que pase un linter.
