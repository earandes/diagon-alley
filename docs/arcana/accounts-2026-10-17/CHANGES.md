# A76 · Archivos y fronteras

Identidad/contraseña/correo/sesiones en infraestructura separada. Gateway añade endpoints de cuenta y conserva la entrada invitada explícita. El inicializador reutiliza el caso existente dentro del mismo clienteSQL; no cambia el kit. Cliente añade exclusión de autenticación y lectura de intenciones pendientes al entrar sin sesión. Bienvenida/Ajustes integran una carta de cuenta; no hay menú permanente nuevo.

Sin dependencias nuevas, cambios de assets de juego, renderer, BattleLog, campaña, tablas económicas, precios, estadísticas o premios. Las imágenes nuevas del expediente son capturas de evidencia, no recursos runtime. El Word y archivos ajenos permanecen fuera del diff. Pruebas activas de entrada usan el nombre accesible coincidente con el texto visible; la muestra histórica de apertura distingue baseline explícitamente.

## Archivos del incremento hasta el candidato de código validado

- `.github/workflows/checks.yml`
- `.gitignore`
- `DESIGN.md`
- `README.md`
- `docs/DECISIONS.md`
- `docs/PRD.md`
- `docs/arcana/accounts-2026-10-17/AUTH-OPTIONS.md`
- `docs/arcana/accounts-2026-10-17/BACKUP.md`
- `docs/arcana/accounts-2026-10-17/COMPATIBILITY.md`
- `docs/arcana/accounts-2026-10-17/CONTRACT.md`
- `docs/arcana/accounts-2026-10-17/QA-PLAN.md`
- `docs/arcana/accounts-2026-10-17/QA.md`
- `docs/arcana/accounts-2026-10-17/REPORT.md`
- `docs/arcana/accounts-2026-10-17/UI.md`
- `docs/arcana/accounts-2026-10-17/evidence/restart-local.json`
- `playwright.accounts-a76.config.ts`
- `src/arcana/application/client/game-controller.ts`
- `src/arcana/application/client/ports.ts`
- `src/arcana/application/team-use-cases.ts`
- `src/arcana/infrastructure/client/client-operations.ts`
- `src/arcana/infrastructure/http/composition.ts`
- `src/arcana/infrastructure/http/identity-routes.ts`
- `src/arcana/infrastructure/http/local-runtime.ts`
- `src/arcana/infrastructure/http/trial-gateway.ts`
- `src/arcana/infrastructure/identity/mail.ts`
- `src/arcana/infrastructure/identity/passwords.ts`
- `src/arcana/infrastructure/identity/schema.sql`
- `src/arcana/infrastructure/identity/service.ts`
- `src/arcana/infrastructure/identity/sessions.ts`
- `src/arcana/infrastructure/postgres/game-transactions.ts`
- `src/arcana/presentation/AccountAccess.tsx`
- `src/arcana/presentation/App.tsx`
- `src/arcana/presentation/GameSettings.tsx`
- `src/arcana/presentation/account-messages.ts`
- `src/arcana/presentation/accounts.css`
- `tests/browser-accounts/accounts-a76.spec.ts`
- `tests/browser-opening/cold-opening.spec.ts`
- `tests/browser-pwa/shell.spec.ts`
- `tests/browser-trial/asset-interface.spec.ts`
- `tests/browser-trial/commerce-a60.spec.ts`
- `tests/browser-trial/commerce.spec.ts`
- `tests/browser-trial/game-feel.spec.ts`
- `tests/browser-trial/game-redesign.spec.ts`
- `tests/browser-trial/hud-results.spec.ts`
- `tests/browser-trial/journey.spec.ts`
- `tests/browser-trial/region-map.spec.ts`
- `tests/browser-trial/replay.spec.ts`
- `tests/browser-trial/shop-journey.spec.ts`
- `tests/browser-trial/team-beans.spec.ts`
- `tests/browser-trial/visual-nodes.spec.ts`
- `tests/browser-trial/visual-polish.spec.ts`
- `tests/domain/arcana/accounts-ui-a76.test.ts`
- `tests/domain/arcana/game-controller.test.ts`
- `tests/domain/arcana/identity-mail-atomic.test.ts`
- `tests/domain/arcana/identity-mail.test.ts`
- `tests/domain/arcana/identity-password.test.ts`
- `tests/integration/arcana/identity-gateway.test.ts`
- `tests/integration/arcana/identity-service.test.ts`
- `tests/integration/arcana/identity-session-races.test.ts`
- `tools/verification/verify-accounts-backup-a76.mjs`
- `tools/verification/verify-accounts-restart-a76.mjs`
- `vite.config.ts`

Los documentos de cierre, la guía local y la evidencia Linux se añaden después sin modificar estos objetos de aplicación/pruebas/configuración. La entrega demostrará esa equivalencia y no atribuirá otra batería al commit documental.
