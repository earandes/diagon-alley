# A80 · Validación técnica completada en rama

Baselinee537d4d. Cambios de runtime: CSS de cuentas y retirada de dos adornos del CTA. No se cambia backend, controlador, mensajes o dominio.

Local: `npm run typecheck`, `npm test` (622), `npm run build` y `git diff --check`, correctos. No navegador local. La última corrección de alcance del foco deja intactos bienvenida/Ajustes; se confirma en CI sobre el candidato real.

CI serial:30A76,16A78,7A79 y3A80, más2A75 baseline. A80 comprueba contraste calculado de texto funcional en la hoja, composición lateral/apilada, geometría, altura ordinaria<660px, recuperación de código, teclado/foco y200%. Capturas explícitas: registro/verificación/reparación390, acceso/reset1280 y verificación200%865. Se inspeccionan antes de aceptar. Unworker, cero retry; aislamiento de cuentas/namespace y guardias originales. La fase temporal baseline no equivale a la matriz completa de campaña. No pruebas humanas ni físicas.


## Ejecución real e inspección

[CI39109537742](https://github.com/earandes/diagon-alley/actions/runs/39109537742) SUCCESS. Head `79c4555d9af964231290bdadd71ce5ab49c7ef7d`, checkout de integración `458722e`, base A75 `ff23f580d9d3989abc9918d7b5bc8328d9e83b62`. Tipos/build/contenido/scanner,622unitarios y99PostgreSQL/Redis reales correctos. Backup/restauración aislada correcto.58casos de navegador activos:30A76+16A78+7A79+3A80+2A75baseline.43skips declarados por cuotas:30A76+11A78+2A79; no fallos, retries o tests omitidos por fallo. Se ejecutan suites en serie bajo guards originales. No navegador o captura del Mac.

Se inspeccionaron los seis PNG seleccionados conjuntamente: registro/verificación/reparación móvil, acceso/recuperación escritorio y verificación al200% enWebKit865. Títulos, objeto, etiquetas, CTA y reparación legibles; no ocultación de controles. No se detectó un defecto que justificara otra ronda de pulido. La ayuda ampliada en error puede desplazarse. El foco oscuro sobre papel y claro sobre cubierta se conserva.

| Muestra normal | Registro | Verificación | Login | Nueva contraseña |
| --- | ---: | ---: | ---: | ---: |
| Chromium390×844 ES/Diagon |464,5px|619,1px|515,9px|551,5px|
| Chromium1280×900 EN/ARCANA |356,4px|493,0px|387,9px|425,4px|
| WebKit865×1079 ES/Diagon |336,4px|493,0px|387,9px|425,4px|

Contraste mínimo calculado de texto funcional en las muestras normales:7,76:1 sobre la hoja. Se calculan colores computados de labels,inputs,p,summary ybotones visibles; no es una auditoría WCAG completa ni mide todos los píxeles/estados/arte. La ampliación200% comprueba ausencia de overflow horizontal y se inspecciona visualmente. La altura normal móvil aumenta14,9px respecto a A79 en verificación, para dar presencia al objeto; no se oculta ese coste ni se atribuye una mejora de concisión.

## Comandos

Local: tipos,622unitarios,build y revisión de diff. CI: `npm run typecheck`, `npm run validate:content`, `npm test`, `npm run test:integration`, `npm run build`, `node tools/verification/verify-accounts-backup-a76.mjs`, `npm run verify:arcana:build`.

Navegador Linux:

- `ARCANA_CAPTURE_A76=1 npx playwright test --config playwright.accounts-a76.config.ts`
- `npx playwright test --config playwright.accounts-fixes-a78.config.ts`
- `npx playwright test --config playwright.account-entry-a79.config.ts`
- `ARCANA_CAPTURE_A80=1 npx playwright test --config playwright.account-style-a80.config.ts`
- `ARCANA_CAPTURE_A75=1 npx playwright test --config playwright.experience-a75.config.ts` (baseline).

A76/A78 conservan registro, vínculo, reentrada desde otro contexto, caducidad/propietario, respuesta perdida, cambio de tarea, cancelación/foco, arte ausente, ampliación y acceso desde preparación/nodo/forja/revelación. A79 conserva concisión, ayuda por teclado y acción única ante incertidumbre. A80 comprueba la nueva composición y contraste, error de código y recuperación accesible. A76 cubre ES/EN con ambos paquetes, más las muestras representativas A80 declaradas. Cuentas ficticias y namespaces privados, sin cambiar datos habituales.

## Límites y coste

Sin benchmark nuevo de rAF/GPU/decodificación o memoria: no cambia renderer, carga lógica o relojes, y no se afirma una ganancia de rendimiento. Se amplían vectores existentes; no hay nuevas descargas de arte, animación o dependencias. Build conserva su aviso previo de tamaño de chunk; no se cambia el límite para ocultarlo. No se repite toda la campaña, perfiles o matriz general: el cambio afecta solo dos archivos de presentación de cuentas. Se restaura selecciónA75full para futuras ejecuciones; no convierte los dos casos baseline ejecutados en una batería completa.

Observación humana de comprensión/afinidad visual, dispositivo físico/teclado virtual, gestor real y lector hablado pendientes. Las imágenes solo acreditan composición estática; no se afirma animación nueva o experiencia humana. Buzón privado local, sin entrega de correo externo o seguridad productiva certificada.
