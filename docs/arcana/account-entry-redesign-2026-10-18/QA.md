# A79 · QA técnica completada en rama

Baselinea8948e8. No cambia backend, controlador, propietario o datos. La única defensa adicional de presentación impide volver a submit mientras una autenticación es incierta; Comprobar sesión pasa a ser el único CTA.

Locales:622unitarios, tipos y build correctos antes de la pasada Linux. No gráfico local. Pruebas de navegación A76/A78 usan ahora la ayuda nativa real para localizar alternativas: no force-click, no modificación de open desde script. Se conserva aceptación de dominio/recuperación.

Plan Linux serial:30A76,16A78, nueva A79 con concisión/recuperación/CTA único, más2A75baseline. Tres tamaños, ambos idiomas/packs representativos, ES/EN completos en A76. Buzones/cuentas aislados, unworker, cero retry, siete PNG explícitos como máximo. No pruebas humanas, dispositivo físico o gestor de contraseña real.

La aceptación visual exige revisar las capturas y comparar con A78, no solo pasar un detector. Métricas de altura, botones y palabras son límites de ensayo, no resultados de comprensión humana.

Primera pasada Linux39086671237 (`5ab612c`): tipos/build,622unitarios,99PG/Redis,backup,30A76 y2A75 correctos. A78 se detuvo tras3casos: el helper consultaba `count()` antes de que se montara el control y omitía desplegar su ayuda. Se añade espera de attached antes de inspeccionar ancestros. A79 se detuvo en registro: geometría de botones dentro de details cerrado no representa visibilidad (22palabras,487,6px,helpOpen=false pero4rectángulos). Se cuentan roles accesibles expuestos y se comprueba su visibilidad, manteniendo el límite3. No se relaja aceptación ni se fuerza click. Fallos conservados como evidencia; requiere ejecución nueva del candidato corregido.

Segunda pasada39087125690 SUCCESS, head99dae4a, checkout de integración a2515a3 (baseff23f580):622unitarios,99PG/Redis,30A76,16A78,7A79 y2A75baseline. Cuotas declaradas:30A76/11A78/2A79 skipped, no fallos ni retries. Los dos fallos anteriores eran sincronización/medición del test, no recuperación del producto. Siete capturas inspeccionadas: registro y verificación390, login/reset/incertidumbre1280, reparación390 y texto200%865. Encuadre y etiquetas conservados; ayuda de error larga requiere desplazamiento accesible. Se comprueba defecto visual pequeño: `summary` hereda marco de control y `details` margen40px global, haciendo competir ayuda con CTA. Corrección mínima: quitar marco/fondo y márgenes dentro de `.account-help`, conservar línea de separación, chevron y área44px. Requiere confirmación nueva de este CSS; no se atribuye la segunda pasada al candidato posterior.


## Confirmación final

CI [39087507256](https://github.com/earandes/diagon-alley/actions/runs/39087507256) SUCCESS. Head `28186fa80f586150588c3035a35c9983bd958c2b`; checkout de PR `74ad009` sobre base `ff23f580d9d3989abc9918d7b5bc8328d9e83b62`. Un worker, cero reintentos. Tipos, build, validación de contenido, scanner del build y copia/restauración aislada correctos; 622 unitarios y 99 integración PostgreSQL/Redis reales correctos. Baterías gráficas seriales: 30 A76, 16 A78, 7 A79 y 2 A75 baseline = 55 casos activos correctos. Los 30/11/2 skips de A76/A78/A79 corresponden a cuotas declaradas por proyecto, no fallos omitidos. A79 confirma también abrir la ayuda con Enter y utilizar la recuperación expuesta.

Los siete PNG finales fueron inspeccionados: encabezados completos, objetos sin deformación, una jerarquía principal, campos identificables y ayuda sin marco de botón. Verificación móvil 604,23 px; registro 447,61 px; acceso 499,06 px. Sin overflow horizontal en las muestras. Texto al 200% e información ampliada pueden requerir scroll accesible; no se elimina contenido para aparentar que cabe. El foco cian es un estado de interacción conservado, no decoración del campo. No se han validado movimientos mediante una captura: este incremento no introduce coreografía nueva.

## Comandos y cobertura

Locales: `npm run typecheck`, `npm test` (622), `npm run build` y `git diff --check`. Sin navegador local. CI vuelve a ejecutar tipos, contenido, unitarios, `npm run test:integration`, build, `node tools/verification/verify-accounts-backup-a76.mjs` y `npm run verify:arcana:build`.

En Linux, en serie:

- `ARCANA_CAPTURE_A76=1 npx playwright test --config playwright.accounts-a76.config.ts`
- `npx playwright test --config playwright.accounts-fixes-a78.config.ts`
- `ARCANA_CAPTURE_A79=1 npx playwright test --config playwright.account-entry-a79.config.ts`
- `ARCANA_CAPTURE_A75=1 npx playwright test --config playwright.experience-a75.config.ts` (fase baseline, solo dos casos).

A76 ejerce ES/EN y ambos paquetes, autocompletado/etiquetas, navegación y cancelación, arte ausente, ampliación, registro, vinculación, segundo contexto, recuperación y propietarios. A78 ejerce código inválido/solicitud retenida, sesión invitada caducada, cambios de tarea y visibilidad de contraseña, error incierto, acceso contextual y descarte de quotes al cambiar de dueño. A79 mide concisión en 390×844/1280×900/865×1079, reparación, ayuda real y la única acción ante incertidumbre. Sus cuentas son ficticias y sus namespaces privados. No cambia backend ni controlador: solo tres archivos de presentación respecto a A78.

## Límites

No batería completa de campaña, perfil gráfico o benchmark rAF nuevo; renderer, economía, catálogo y reglas no han cambiado. Alturas/palabras son mediciones de composición, no tiempos de uso ni prueba de comprensión. Los tiempos de las suites son automatizados. No se acredita GPU, memoria global, WCAG completa, lector hablado, dispositivo físico/teclado virtual o gestor real. No correo externo: ensayo con buzón privado local. Prueba humana de localización de ayuda y comprensión del cambio de partida pendiente.

La selección A75 se restaura a `full` al cerrar documentación. Esa restauración configura futuras ejecuciones: no convierte los dos casos baseline de esta pasada en una matriz completa. No se debilitan los guards ni se ejecuta otra batería sin cambio funcional que lo justifique.
