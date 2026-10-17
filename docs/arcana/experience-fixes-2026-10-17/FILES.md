# A75 · Archivos del incremento

Diferencia desde937a0a1 más documentación final en preparación. Solo paths de este incremento; archivos no rastreados ajenos se conservan fuera del staging. No listar este inventario como prueba de ejecución. Evidencia raw y PNG en `evidence/` (baseline, intentos conservados y candidato final).

## Runtime

- `src/arcana/application/client/game-controller.ts`
- `src/arcana/presentation/App.tsx`
- `src/arcana/presentation/BeanAssignments.tsx`
- `src/arcana/presentation/CardReveal.tsx`
- `src/arcana/presentation/CommercePanel.tsx`
- `src/arcana/presentation/EncounterPreparation.tsx`
- `src/arcana/presentation/ExpeditionPreparation.tsx`
- `src/arcana/presentation/GameSettings.tsx`
- `src/arcana/presentation/MapPanel.tsx`
- `src/arcana/presentation/RecoveryNotice.tsx`
- `src/arcana/presentation/RouteInspection.tsx`
- `src/arcana/presentation/arena-a63.css`
- `src/arcana/presentation/contextual-preparation.ts`
- `src/arcana/presentation/encounter-a67.css`
- `src/arcana/presentation/encounter-messages.ts`
- `src/arcana/presentation/expedition-preparation.css`
- `src/arcana/presentation/map-settings-a75.css`
- `src/arcana/presentation/map-settings-messages.ts`
- `src/arcana/presentation/prep-messages.ts`
- `src/arcana/presentation/recovery-messages.ts`
- `src/arcana/presentation/recovery-notice.css`
- `src/arcana/presentation/route-inspection.ts`
- `src/arcana/presentation/settings-case.css`
- `src/arcana/presentation/trial-entry.ts`
- `src/arcana/presentation/useReducedMotion.ts`
- `src/arcana/presentation/useTrialEntry.ts`

## Verificación y CI

- `.github/workflows/checks.yml`
- `playwright.experience-a75.config.ts`
- `tests/browser-experience-fixes/arena-a75.spec.ts`
- `tests/browser-experience-fixes/arena-performance-a75.spec.ts`
- `tests/browser-experience-fixes/map-settings-a75.spec.ts`
- `tests/browser-experience-fixes/preparation-a75-harness.tsx`
- `tests/browser-experience-fixes/preparation-a75.html`
- `tests/browser-experience-fixes/preparation-a75.spec.ts`
- `tests/browser-experience-fixes/recovery-a75.spec.ts`
- `tests/browser-experience-fixes/selected-evidence.ts`
- `tests/browser-experience-fixes/supplies-a75.spec.ts`
- `tests/browser-experience-fixes/vite-experience-a75.config.ts`
- `tests/browser-trial/asset-interface.spec.ts`
- `tests/browser-trial/browser-local-smoke-a67.spec.ts`
- `tests/browser-trial/header-pact-a66.spec.ts`
- `tests/browser-trial/progression-performance-a67.spec.ts`
- `tests/browser-trial/replay.spec.ts`
- `tests/browser-trial/seasonal-a68.spec.ts`
- `tests/domain/arcana/game-controller.test.ts`
- `tests/domain/arcana/preparation-a75.test.ts`
- `tests/domain/arcana/recovery-notice-a75.test.ts`
- `tests/domain/arcana/route-inspection-a75.test.ts`
- `tests/domain/arcana/settings-motion-a75.test.ts`
- `tests/domain/arcana/trial-entry-a75.test.ts`
- `tools/verification/a75-phase.json`
- `tools/verification/build-a75-reference.mjs`

## Documentación vigente

- `DESIGN.md`
- `docs/DECISIONS.md`
- `docs/PRD.md`

## A74 canónico preexistente incorporado como dependencia

- `docs/arcana/experience-review-2026-10-17/ASSESSMENT-A.md`
- `docs/arcana/experience-review-2026-10-17/ASSESSMENT-B.md`
- `docs/arcana/experience-review-2026-10-17/CONTRACT.md`
- `docs/arcana/experience-review-2026-10-17/FINDINGS.md`
- `docs/arcana/experience-review-2026-10-17/FIX-PLAN.md`
- `docs/arcana/experience-review-2026-10-17/JOURNEY-AND-SCREENS.md`
- `docs/arcana/experience-review-2026-10-17/REPORT.md`
- `docs/arcana/experience-review-2026-10-17/VALIDATION.md`
- `docs/arcana/experience-review-2026-10-17/baseline.json`
- `docs/arcana/experience-review-2026-10-17/build-verification.log`
- `docs/arcana/experience-review-2026-10-17/build.log`
- `docs/arcana/experience-review-2026-10-17/detector.json`
- `docs/arcana/experience-review-2026-10-17/detector.log`
- `docs/arcana/experience-review-2026-10-17/documentation-check-initial.json`
- `docs/arcana/experience-review-2026-10-17/documentation-check.json`
- `docs/arcana/experience-review-2026-10-17/unit-tests.log`

## Documentación A75

- `docs/arcana/experience-fixes-2026-10-17/ARENA-DESIGN.md`
- `docs/arcana/experience-fixes-2026-10-17/ASSETS-AND-MOTION.md`
- `docs/arcana/experience-fixes-2026-10-17/COMPATIBILITY.md`
- `docs/arcana/experience-fixes-2026-10-17/CONTRACT.md`
- `docs/arcana/experience-fixes-2026-10-17/DIFF-REVIEW.md`
- `docs/arcana/experience-fixes-2026-10-17/FILES.md`
- `docs/arcana/experience-fixes-2026-10-17/GALLERY.md`
- `docs/arcana/experience-fixes-2026-10-17/HUMAN-CHECK.md`
- `docs/arcana/experience-fixes-2026-10-17/MAP-SETTINGS.md`
- `docs/arcana/experience-fixes-2026-10-17/PERFORMANCE.md`
- `docs/arcana/experience-fixes-2026-10-17/PREPARATION.md`
- `docs/arcana/experience-fixes-2026-10-17/QA.md`
- `docs/arcana/experience-fixes-2026-10-17/RECOVERY.md`
- `docs/arcana/experience-fixes-2026-10-17/REPORT.md`
- `docs/arcana/experience-fixes-2026-10-17/baseline-ci.json`
- `docs/arcana/experience-fixes-2026-10-17/build-candidate.log.gz`
- `docs/arcana/experience-fixes-2026-10-17/build-first-candidate.log.gz`
- `docs/arcana/experience-fixes-2026-10-17/fixture-build-candidate.log.gz`
- `docs/arcana/experience-fixes-2026-10-17/scan-candidate.log.gz`
- `docs/arcana/experience-fixes-2026-10-17/typecheck-integration.log.gz`
- `docs/arcana/experience-fixes-2026-10-17/types-candidate.log.gz`
- `docs/arcana/experience-fixes-2026-10-17/unit-candidate.log.gz`
- `docs/arcana/experience-fixes-2026-10-17/unit-integration.log.gz`

Evidencia A75: 65 archivos seleccionados/crudos; fuente, SHA y estado de cada ejecución en QA, GALLERY y los JSON. Sin vídeos, trazas extensas, secretos o assets nuevos. Los diagnósticos comprimidos conservan bytes originales.
