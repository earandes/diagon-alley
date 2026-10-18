# A81 · QA técnica completada en rama

Local: `npm run typecheck`, `npm test` (624), `npm run build` correctos. Tras ajustar el material plateado de la llave: dos pruebas de integridad de exports correctas. Sin navegador/captura/grabación local. El aviso preexistente de tamaño de chunk de build se conserva.

Candidato8d41edb en CI Linux serial. Se planifican30A76+16A78+7A79+3A80+3A81 y2A75baseline. A81 comprueba cargas512px, asset correcto en cada tarea/pack, medidas36/44/168px, teclado/foco/cancelación y200%. Se seleccionan siete capturas explícitas: bienvenida,registro,login en Chromium390/1280 y login200% enWebKit865. El éxito técnico no acredita significado percibido ni calidad artística: se inspeccionan las imágenes antes de cerrar.

Se conservan guards,lock,watchdog,unworker,cero retry y cuentas ficticias. Ningún acceso a partida habitual. No se habilita correo externo, main o despliegue.

Primera pasada CI39110702323 SUCCESS, head8d41edb /checkoutcbc913b sobrebaseff23f580:624unitarios,99PG/Redis,61casos de navegador activos y43skips por cuotas, tipos/build/contenido/scanner/backup correctos. Siete capturas inspeccionadas. Se aprecia recorte superior del emblema en la cabecera de fondo al200% (WebKit865). Código contrastado: altura fija56px y selector display:block de game-stage con igual especificidad que el flex nuevo. Corrección mínima: altura automática/min56px solo bienvenida y selector del grupo marca más específico. Se añade aceptación de geometría del emblema dentro de viewport/cabecera al200%, sin cambiar mapa. Requiere nueva confirmación; el primer check verde no basta para aprobar ese estado visual.


## Confirmación final

[CI39111152788](https://github.com/earandes/diagon-alley/actions/runs/39111152788) SUCCESS. Head `c9955b4033db604afc93bd60455a069b2cbb6e0c`, checkout de integración `ce6cc4a`, base `ff23f580d9d3989abc9918d7b5bc8328d9e83b62`. Tipos,contenido,build,scanner ybackup/restauración aislada correctos;624unitarios,99PostgreSQL/Redis y61casos activos de navegador correctos.43skips por cuotas declaradas (30A76/11A78/2A79); no fallo ni retry. La confirmación tiene código distinto que la primera pasada: se atribuyen ambas por su SHA.

Se compararon las cabeceras finales390/1280 y el estado200%865 con la revisión anterior. El test nuevo comprueba que el rectángulo44px del emblema permanece dentro de viewport y cabecera al ampliar. La imagen final muestra corona del umbral completa, marca/texto alineados y título de login legible. Las siete capturas finales se conservan; los otros cuatro encuadres de registro/login no cambian de composición, fuentes SVG o colores respecto a la revisión inspeccionada completa.

Tamaños de cajas registrados: emblema44×44px, acceso de bienvenida36×36px, cubierta móvil100×88px con contain y escritorio168×168px. Son cajas del recurso, no área opaca exacta; el margen transparente del SVG se aprecia visualmente. Lectura de la pluma/llave/folio valorada por inspección experta, no acreditada por `naturalWidth` o por tests humanos. Todos los originales cargan a512×512.

## Comandos y cobertura

Locales: `npm run typecheck`, `npm test`, `npm run build`; dos tests específicos de integridad del arte tras platear la llave; `git diff --check`. Sin navegador local.

CI: tipos, `npm run validate:content`,unitarios, `npm run test:integration`,build, `node tools/verification/verify-accounts-backup-a76.mjs`, `npm run verify:arcana:build`.

Gráficos Linux seriales:

- `ARCANA_CAPTURE_A76=1 npx playwright test --config playwright.accounts-a76.config.ts` (30activos).
- `npx playwright test --config playwright.accounts-fixes-a78.config.ts` (16activos).
- `npx playwright test --config playwright.account-entry-a79.config.ts` (7activos).
- `npx playwright test --config playwright.account-style-a80.config.ts` (3activos).
- `ARCANA_CAPTURE_A81=1 npx playwright test --config playwright.account-symbols-a81.config.ts` (3activos).
- `ARCANA_CAPTURE_A75=1 npx playwright test --config playwright.experience-a75.config.ts` (2baseline).

Se conservan guard,lock,watchdog,unworker,cero retry. ES/EN y ambos paquetes en regresiones A76, más DiagonES390/865 y ARCANAEN1280 en evidencia A81. Registro/vínculo/recuperación/cambio de propietario y respuesta perdida continúan cubiertos por A76/A78, también arte ausente, teclado/foco y acceso contextual. A79/A80 comprueban concisión, ayuda, contraste funcional y disposición. A81 prueba recursos reales, ausencia de estado autoritativo al consultar/cancelar y ajuste200%. Datos ficticios y namespaces privados; nunca la partida habitual.

## Límites

No observación humana del significado, marca preferida o comprensión. Dispositivo físico/teclado virtual, lector hablado y gestor real pendientes. No entrega externa de correo ni seguridad productiva completa. SVG nuevo no implica autorización de marca/franquicia o aprobación definitiva de identidad.

No benchmark nuevo de GPU/rAF/decodificación o memoria.15.066bytes son tamaño de archivo entre seis SVG, no memoria residente o latencia. No se ha repetido toda la campaña ni el rendimiento del renderer, que no cambia. El aviso de chunk grande preexistente permanece. La faseA75full se restaura para futuras ejecuciones; no amplía retroactivamente los dos casos baseline de estas pasadas. La entrega documental posterior conserva el código confirmado y distingue sus SHA.
