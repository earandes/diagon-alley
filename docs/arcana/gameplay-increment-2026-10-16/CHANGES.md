# A63 · Archivos, conservación y límites

Comparación SHA256 con la referencia previa de 2063 archivos.30 archivos existentes cambiados y nuevos archivos de implementación/pruebas/configuración enumerados abajo. Checkout ya tenía modificaciones y archivos sin rastrear antes del incremento; esta relación separa la contribución A63 del estadoGit histórico. Sin reset/clean/stash/commit/push.

378 archivos de evidencia A62 idénticos, sin faltantes. JSON de catálogo/campaña/economía, fuentes/exports de arte, esquema/adaptadoresSQL, Word, AGENTS, package/package-lock y Vite conservan su hash inicial. No dependencias, migraciones o assets nuevos. El cambio mínimo de engine extrae aritmética compartida;640 registros de combate idénticos.

## Fronteras

- Raíz: App/navegación, cierre, scope de borrador, proyección pública de afinidades, funciones compartidas, pruebas del recorrido e integridad/documentación.
- Especialista arena: BattlePanel, CSS/mensajes, altura de figuras/peanas y canal visual en Pixi, harness/fixture y regresión de pasivas. Sin reglas.
- Especialista preparación: retratos/objetos/inspectores/sinergias, comparaciones y asignador; emisores de origen de foco en tienda/álbum/HUD/forja. CSS de nodo solo para compatibilidad del wrapper y barra adherida.
- Pruebas históricas: selectores de objetos nuevos, retorno explícito desde arena, acceso a receipt dentro del cierre, chunkGSAP conhash y destinos de evidencia configurables. Asserts económicos conservados.

## Archivos existentes modificados

- `src/arcana/application/run-use-cases.ts`
- `src/arcana/application/public-content.ts`
- `src/arcana/presentation/BeanAssignments.tsx`
- `src/arcana/presentation/App.tsx`
- `src/arcana/presentation/BattlePanel.tsx`
- `src/arcana/presentation/CollectionPanel.tsx`
- `src/arcana/presentation/NodeResult.tsx`
- `src/arcana/presentation/ExpeditionPreparation.tsx`
- `src/arcana/presentation/TeamHud.tsx`
- `src/arcana/presentation/SweetshopScene.tsx`
- `src/arcana/presentation/CommercePanel.tsx`
- `src/arcana/presentation/node-event-dialog.css`
- `src/arcana/presentation/scenes/pixi-scenes.ts`
- `src/arcana/domain/combat/engine.ts`
- `src/arcana/infrastructure/content/trial-configuration.ts`
- `tests/browser-trial/commerce-a60.spec.ts`
- `tests/browser-trial/visual-nodes.spec.ts`
- `tests/browser-trial/team-beans.spec.ts`
- `tests/browser-trial/commerce.spec.ts`
- `tests/browser-trial/pokelike-experience.spec.ts`
- `tests/browser-trial/game-redesign.spec.ts`
- `tests/browser-trial/replay.spec.ts`
- `tests/browser-trial/hud-results.spec.ts`
- `tests/browser-arcana/arena-passives.spec.ts`
- `playwright.trial.config.ts`
- `README.md`
- `.gitignore`
- `DESIGN.md`
- `docs/PRD.md`
- `docs/DECISIONS.md`

## Archivos nuevos de fuente, pruebas y runners

- `playwright.actions-a63.config.ts`
- `playwright.gameplay-a63.config.ts`
- `playwright.preparation-a63.config.ts`
- `playwright.profile-a63.config.ts`
- `src/arcana/application/client/expedition-closure.ts`
- `src/arcana/domain/combat/equipment-effects.ts`
- `src/arcana/presentation/ExpeditionClosure.tsx`
- `src/arcana/presentation/PreparationSynergies.tsx`
- `src/arcana/presentation/arena-a63.css`
- `src/arcana/presentation/arena-messages.ts`
- `src/arcana/presentation/closure-messages.ts`
- `src/arcana/presentation/contextual-messages.ts`
- `src/arcana/presentation/contextual-preparation.css`
- `src/arcana/presentation/contextual-preparation.ts`
- `src/arcana/presentation/expedition-closure.css`
- `tests/arcana-arena-a63-harness.html`
- `tests/browser-arcana/arena-a63-harness.tsx`
- `tests/browser-arcana/arena-a63.spec.ts`
- `tests/browser-trial/action-profile-a63.spec.ts`
- `tests/browser-trial/arena-profile-a63.spec.ts`
- `tests/browser-trial/gameplay-increment-a63.spec.ts`
- `tests/domain/arcana/contextual-preparation.test.ts`
- `tests/domain/arcana/expedition-closure-a63.test.ts`
- `tests/domain/arcana/preparation-contract-a63.test.ts`

## Documentación y evidencia nuevas

Contrato, informe, decisiones de interacción, preparación, movimiento, QA, rendimiento, galería, registro de ciclos y esta relación en la carpeta A63. Evidenciabefore/after, matrices de arena, perfilesJSON, logs, simulación de equivalencia y vídeos seleccionados. Los vídeos incluyen cuentas de ensayo aisladas, no sesiones humanas. Los artefactos grandes son evidencia local solicitada y no se han publicado.

`evidence/integrity-final.json` conserva lista/missing/protectedChanges y `delivered-sha256.json` identifica los archivos de fuente/pruebas y el HTML del compilado. La integridad histórica se comprueba por hash; no se infiere de ausencia de conflictos Git.

El arranque de servicios conservó volúmenes existentes y solo las pruebas crean sus propias cuentas/namespaces. Los servidores y navegadores iniciados por runners terminan al completar; no se detienen servicios compartidos o sesiones ajenas. La dirección 5194 no se utiliza para pruebas.
