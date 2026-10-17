# A75 · Evidencia seleccionada y revisión visual

PNG creados explícitamente en CI Linux, Chromium390×844. No captura local ni matriz automática. Revisión del coordinador leyendo esos archivos; no sesión humana. La ejecución de procedencia y sus fallos se conservan: no se atribuye éxito global a un PNG.

| Vista | Antes | Después | Procedencia y lectura |
|---|---|---|---|
| Arena Diagon5×5 |[baseline](evidence/baseline/baseline-diagon-alley-dense.png) |[candidato](evidence/final/full-diagon-alley-dense.png) |Fixture declarada, baseline20cbd68/runtime937 y head 889886d. Más altura de figura, diez nombres/PV presentes, nombre de dos líneas conserva su espacio. No arte nuevo. |
| Arena ARCANA5×5 |[baseline](evidence/baseline/baseline-arcana-dense.png) |[candidato](evidence/final/full-arcana-dense.png) |Mismos encuadres/viewport. Margen transparente propio del pack sigue reduciendo huella visible; no estirado para fingir igualdad. |
| Colección amplia en preparación |Finding estáticoF08, sin PNG anterior equivalente |[filtro abierto](evidence/final/selected-preparation-filter.png) |Fixture30 copias, ES/Diagon, CI 39059090478/head 889886d. Formación separada del filtro, retratos e identidad a demanda. Scroll de preparación/índice permitido; QA language/pack pertenecen al harness, no al juego. No certifica colección ganada. |
| Encuentro con repetidos |Finding estáticoF05 |[instancia temporal](evidence/final/selected-encounter-instance.png) |Fixture EN/ARCANA con identidad/PV/PM idénticos, puestos y procedencia diferentes. Preview del puesto3 y coste/beneficio. El foco claro es teclado, no debe eliminarse. |
| Error de sesión en inspector |Finding estáticoF04 |[aviso contextual](evidence/final/selected-recovery-inspector.png) |Cuenta aislada real, cookie retirada solo de esa sesión. Texto funcional necesario con equipo todavía visible. Captura no prueba el commit; specs/controlador sí comprueban resultado y recuperación. |
| Consulta de ruta |Finding estáticoF07 |[cofre bloqueado](evidence/final/selected-route-inspection.png) |Cuenta aislada real, ES/Diagon. Objeto protagonista, posición/estado y conexiones a demanda. Etiqueta de solo consulta y regreso; POST0/estado igual se comprueban aparte. |

La arena se valoró comparando muestras equivalentes antes/después. Para otras vistas no se inventa un «antes» visual: se enlaza el finding con evidencia estática o técnica histórica. No se retocan capturas para ocultar errores, texto o controles.

La animación no se valida con estos PNG. Cursor/pausa/2x/inspector/ocultación sintética/omisión/log se evalúan en las pruebas temporales y regresiones Linux; rendimiento en PERFORMANCE. El toque emulado, texto200% y viewport320 no equivalen a dispositivo físico/zoom de navegador. Hipótesis de claridad y game feel pendientes en HUMAN-CHECK.

Los cuatro PNG específicos coinciden byte a byte con los ya inspeccionados de attempt-9. Las dos arenas finales se inspeccionaron de nuevo; el caption cambia según el momento de pausa, sin cambio de resultado. Merge probado8d38776 y head 889886d tienen el mismo árbol7a6e66a.
