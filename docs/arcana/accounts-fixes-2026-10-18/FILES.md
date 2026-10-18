# A78 · Archivos y reproducción

- `src/arcana/presentation/AccountAccess.tsx`: pasos, errores, contraseña, cierre y foco.
- `account-messages.ts` / `accounts.css`: ES/EN y composición de carta/cabecera.
- `App.tsx` / `GameSettings.tsx`: sesión vigente, coordinación única y descarte de contextos por dueño. Gran parte del diff de App es sangría de dos contenedores React sin DOM adicional; `git diff -w` permite revisar la intención.
- `src/arcana/application/identity/password-policy.ts` y adaptador `infrastructure/identity/passwords.ts`: misma regla compartida, import nativo compatible, KDF intacto.
- Pruebas: `tests/domain/arcana/password-policy-a78.test.ts`, caso real Unicode de `tests/integration/arcana/identity-gateway.test.ts`, `tests/browser-accounts/accounts-fixes-a78.spec.ts` y ajustes de navegación esperada A76.
- `playwright.accounts-fixes-a78.config.ts`: namespaceUUID, servidor privado5535, tres proyectos, defineSafeConfig. Mac rechazado; no bypass.
- `.github/workflows/checks.yml`: batería serial A78 y artefacto acotado; sin nuevos workers, retry, video o timeout.
- Documentación A78, PRD/DECISIONS/DESIGN/README. Word y evidencia histórica intactos.

## Comandos ejecutados

Locales no gráficos: `npm run typecheck`, `npm test`, `npm run test:integration`, `npm run build`, `node tools/verification/verify-accounts-backup-a76.mjs`. Node24.20.0 local, PG16.9/Redis7 del proyecto; fixtures y namespaces propios. Backup usa exclusivamente dos bases nuevas con nombres internos; nunca una restauración habitual.

Linux CI: los anteriores y `npm run validate:content`, `npm run verify:arcana:build`, A76 completa, A78 y A75baseline. Reproducir A78 **solo en Linux** con servicios de ensayo y build: `ARCANA_CAPTURE_A78=1 npx playwright test --config playwright.accounts-fixes-a78.config.ts`. El flag captura13estados explícitos; sin flag no genera PNG. El buzón de ensayo usa namespaceA78UUID. No utilizar cuenta habitual.

Confirmación final: `ARCANA_CAPTURE_A78=1 ARCANA_A78_CONFIRM=1 npx playwright test --config playwright.accounts-fixes-a78.config.ts --grep 'A78 (remaining forms|close target)'`. Dos PNG seleccionados, seis casos; no sustituye la batería completa anterior.
