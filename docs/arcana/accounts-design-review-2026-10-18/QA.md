# A77 · Ejecución, evidencia y límites

## Candidatos y equivalencia

Aplicación revisada:0f849bad6e36b694c5efc1515518a12c42fed85f. Misma fuente A76 que3f6, con documentación posterior. Durante A77 no se ha modificado `src/`, `public/`, dependencias, autoridad o reglas. Árbol `src` idéntico en baseline, ambos heads y ambos checkouts reales: `009108da03c2725264a3038d0d0d0f2055d9d750`.

| Tanda | Head | Checkout real | Resultado |
| --- | --- | --- | --- |
| [39081730688](https://github.com/earandes/diagon-alley/actions/runs/39081730688) | 67197eeb6921db238becb286cfae677d26632b43 | 44e915752d4fee8f2aa29623a83b7c7bf97aae46 | SUCCESS: A77 siete correctos/dos omisiones,26,45s |
| [39082151180](https://github.com/earandes/diagon-alley/actions/runs/39082151180) | b24b656b12470921e5b9beaa23a12e8a4691d72d | 828b58964bd0104d5f1731f360bbde5090629c71 | SUCCESS: una confirmación focalizada,3,66s |

La segunda repite un caso de formularios, no un recorrido nuevo. Las omisiones de la primera evitan repetir el diagnóstico de transporte en otros dos proyectos. Sin flaky o reintentos automáticos. Los diagnósticos constatan defectos, no contienen aserciones que pretendan que ya estén corregidos.

## Comandos reales

- Local sin gráficos: `npm run typecheck` correcto tras instrumentar y tras corregir sincronización. `npx --no-install prettier --write` solo sobre configuración/spec propios. Detector Impeccable una vez, AccountAccess: JSON vacío. No navegador, screenshot, vídeo, perfil o servidor local A77.
- Ambas CI: `npm ci --no-fund --no-audit`, tipos, validación de contenido,618 unitarias,98 integraciones PostgreSQL/Redis, build, backup/restauración y scanner correctos. Node24, imágenes PG16/Redis fijadas por digest, namespaces/correos ficticios UUID. No partida habitual.
- A76 sin modificar: `ARCANA_CAPTURE_A76=1 npx playwright test --config playwright.accounts-a76.config.ts`,30 correctos/30 omisiones deliberadas en ambas CI. No atribuir sus cruces o recorridos completos a la auditoría nueva.
- Primera: `ARCANA_CAPTURE_A77=1 npx playwright test --config playwright.accounts-review-a77.config.ts`; tres proyectos representativos, siete correctos/dos omisiones.
- Confirmación: `ARCANA_CAPTURE_A77=1 ARCANA_CAPTURE_A77_CONFIRM=1 npx playwright test --config playwright.accounts-review-a77.config.ts --project chromium-390-a77 --grep "remaining forms"`; uno correcto y solo un PNG.
- La fase baseline existente ejecutó además A75/arena en alcance baseline: dos correctos, no la batería A75 completa. Las grandes regresiones previas no se repiten ni se declaran ejecutadas en A77.

Un worker y un archivo a la vez, bloqueo compartido y watchdog originales, cero reintentos, sin vídeo/trazas/capturas automáticas. Capturas explícitas solo Linux, doce iniciales y una de confirmación. Una batería completa a la vez; la segunda empezó después de terminar la primera. No se aumentaron límites o añadió infraestructura.

## Corrección del instrumento, no de producto

La primera espera `role=status` también podía coincidir con Conectando. En390, la observación registration-accepted y su PNG son transitorios. Se conservaron como operación activa; no se presentan como prueba de solicitud ya aceptada. El caso completo sí terminó, pues después esperaba botones habilitados y recorría verificación.

Se añadió `aria-busy=false` como condición causal antes de observar. La confirmación produce estado estable: register conserva Crear cuenta como CTA principal y Tengo el código secundario; request-reset conserva Enviar recuperación. Una única pasada focalizada, sin reintento automático ni temporizador para ocultar el problema. Los otros once PNG iniciales se reutilizan.

## Evidencia guardada

- [Resumen por ejecución](evidence/ci-summary.json).
- `evidence/linux/first/`: doce PNG, tres JSON de observaciones, resultados y procedencia. La captura `mail-sent` está clasificada como Conectando, no postenvío.
- `evidence/linux/confirmation/`: un PNG estable, observaciones, resultados y procedencia.
- Se eliminó solo metadata gitDiff duplicada de los reportes JSON, conservando casos/config/estadísticas; hashes del original en provenance. Artefactos originales permanecen en GitHub. No buzones, contraseñas o códigos válidos en Git. El código de ceros de la imagen es una fixture inválida.
- Logs completos descargados a `.local/a77-{first,confirm}-ci.log`, fuera de Git. Las imágenes se visualizaron desde archivos, sin capturar el escritorio.
- [Contraste sólido calculado](evidence/solid-color-contrast.json) y [detector](evidence/impeccable-detect.json). Contraste no incluye composición sobre ilustraciones/antialiasing; detector vacío no sustituye auditoría de flujo.

## Estado final y pendientes

Se restaura `full` y el comando de auditoría normal sin filtro de confirmación; el bloque A77 se conserva opt-in en fase baseline. El cierre posterior añade documentación/evidencia y restaura esa selección, no nuevos fixes. Se verifica rama remota y PR7, sin merge/main/despliegue. No se atribuye una batería nueva al commit documental.

Pendientes explícitos: reproducción de acceso a cuenta dentro de los cuatro contextos modales de F06; PNG propio de operación económica pending; todos los cruces de cada error con texto ampliado; lector hablado, teclado virtual/gestos reales, gestor real, correo externo y dispositivo físico. Estas limitaciones no se sustituyen por observaciones humanas inventadas. La función base ya tenía pruebas de autoridad y recuperación reales A76; no es una auditoría de seguridad productiva completa.

No se ejecutó perfil nuevo o prueba de carga del Mac. Las medidas rAF históricas A76 no se reinterpretan ni se atribuyen a esta revisión de pantallas. El veredicto artístico y de continuidad figura enREPORT, separado de los tests verdes.

F08 se contrastó con fuente y documentación MDN consultada18octubre: longitudHTML enUTF16 frente a puntos de código/bytes deScryptPasswords. Ejemplos de conteo calculados, no login o pegado Unicode ejecutado. Su prueba de UI y el idioma de mensajes de validación nativa quedan en el plan de fix; no se prolonga la tanda gráfica por esa comprobación.

Archivo Impeccable local: `.impeccable/critique/2026-10-18T00-25-54Z__src-arcana-presentation-accountaccess-tsx.md`, fingerprint de AccountAccess `6d984c8df856bd64368daa8767efe17bd91104718d84be4088a59ab2de80099b`. Primera valoración guardada para ese target,25/40heurísticos, sin tendencia ni medida con usuarios. No se modifica el contenido previo de .impeccable ni se incluye el directorio ajeno indiscriminadamente enGit. Informe y evidencia versionados en esta carpeta.
