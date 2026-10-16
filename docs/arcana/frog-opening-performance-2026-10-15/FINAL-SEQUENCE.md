# Preparación QA final A58

**Ejecutada tras confirmación de runtime integrado y build final: 46/46 correctos.** Resultados y límites en [TESTING.md](TESTING.md), sección final; logs y capturas en `../illustrated-assets-2026-10-15/qa/`. Los comandos se conservan para reproducción futura. No ejecutar generación GPU, otro navegador de pruebas o build concurrente. Nunca usar la sesión propietaria5194.

El primer pase aceptado está preservado sin sobrescribir en `first-pass/`: `after.txt`, cuatro JSON, cuatro capturas de resultado, build/typecheck. El baseline `before-*.json` y ambos logs RED siguen en su ubicación original. El directorio de evidencia final será `docs/arcana/illustrated-assets-2026-10-15/qa/`.

## Secuencia serial

El coordinador compila primero la integración definitiva. Los comandos siguientes no incluyen un build intermedio.

```sh
ARCANA_OPENING_EVIDENCE_ROOT=docs/arcana/illustrated-assets-2026-10-15/qa/opening npx --no-install playwright test --config playwright.opening.config.ts --reporter=line > docs/arcana/illustrated-assets-2026-10-15/qa/opening/browser.txt 2>&1
```

16 casos sobre preview compilado5222/5223. Muestra completa click→resultado con contador real de la decoración y URLs/tamaños decodificados de las imágenes de apertura. No sobrescribe el primer pase ni el baseline. Registrar cola de latencia, tareas largas y fases previas; no declarar ausencia de longtasks en WebKit que no expone esa API.

```sh
ARCANA_REDESIGN_COMPILED_PREVIEW=1 ARCANA_REDESIGN_EVIDENCE_ROOT=docs/arcana/illustrated-assets-2026-10-15/qa/game-redesign/captures npx --no-install playwright test --config playwright.game-redesign.config.ts --reporter=line > docs/arcana/illustrated-assets-2026-10-15/qa/game-redesign/browser.txt 2>&1
```

16 casos sobre preview compilado5216/5217. Capturas y perfiles se guardan en A58; la evidencia A57 no cambia. Acepta el renderer real Canvas2D, conserva los asserts de geometría, contraste, reducido, swap e igualdad exacta de autoridad.

```sh
shasum -a 256 dist/service-worker.js > docs/arcana/illustrated-assets-2026-10-15/qa/pwa-worker-before.sha256
npx --no-install playwright test --config playwright.pwa.config.ts --reporter=line > docs/arcana/illustrated-assets-2026-10-15/qa/pwa-browser.txt 2>&1
shasum -a 256 dist/service-worker.js > docs/arcana/illustrated-assets-2026-10-15/qa/pwa-worker-after.sha256
diff docs/arcana/illustrated-assets-2026-10-15/qa/pwa-worker-before.sha256 docs/arcana/illustrated-assets-2026-10-15/qa/pwa-worker-after.sha256
```

12 casos PWA compilada5218. Avisar al coordinador antes/después: un caso modifica temporalmente el worker y lo restaura en finally. No compilar mientras corre. Los hashes deben coincidir al terminar incluso cuando se investigue un fallo.

```sh
ARCANA_TEST_CONTENT_PACK=diagon-alley ARCANA_ARENA_EVIDENCE_ROOT=docs/arcana/illustrated-assets-2026-10-15/qa/arena npx --no-install playwright test --config playwright.arcana.config.ts --grep 'profiles sustained' --reporter=line > docs/arcana/illustrated-assets-2026-10-15/qa/arena/browser.txt 2>&1
```

Dos perfiles arena (uno por motor), tres tamaños ×10s cada uno, cinco unidades por lado, diez identidades de arte distintas; comprueba pack Diagon y que las diez imágenes visibles usan la familia `character-illustrated-v2`. Pausar detiene draws. El harness necesita Vite dev5198 porque deliberadamente no se distribuye en el build: **no es un benchmark de la app compilada ni combate económico real**. El benchmark de apertura anterior sí usa el build compilado y receipts reales.

Al acabar: revisar capturas A58, comparar cuatro perfiles de apertura con el baseline y primer pase, registrar métricas de arena con nuevas pinturas y confirmar worker restaurado. Una captura no demuestra persistencia; las igualdades de estado y contadores de operaciones proporcionan esa evidencia funcional.
