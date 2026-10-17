# A75 · Evidencia seleccionada y revisión visual

PNG creados explícitamente en CI Linux, Chromium390×844. No captura local ni matriz automática. Revisión del coordinador leyendo esos archivos; no sesión humana. La ejecución de procedencia y sus fallos se conservan: no se atribuye éxito global a un PNG.

| Vista | Antes | Después | Procedencia y lectura |
|---|---|---|---|
| Arena Diagon5×5 |[baseline](evidence/baseline/baseline-diagon-alley-dense.png) |[candidato](evidence/resume-final/resume-diagon-alley-dense.png) |Fixture declarada, baseline20cbd68/runtime937 y head 6d4dbcb. Más altura de figura, diez nombres/PV presentes, nombre de dos líneas conserva su espacio. No arte nuevo. |
| Arena ARCANA5×5 |[baseline](evidence/baseline/baseline-arcana-dense.png) |[candidato](evidence/resume-final/resume-arcana-dense.png) |Mismos encuadres/viewport. Margen transparente propio del pack sigue reduciendo huella visible; no estirado para fingir igualdad. |
| Colección amplia en preparación |Finding estáticoF08, sin PNG anterior equivalente |[filtro abierto](evidence/resume-final/selected-preparation-filter.png) |Fixture30 copias, ES/Diagon, CI 39063046713/head 6d4dbcb. Formación separada del filtro, retratos e identidad a demanda. Scroll de preparación/índice permitido; QA language/pack pertenecen al harness, no al juego. No certifica colección ganada. |
| Encuentro con repetidos |Finding estáticoF05 |[instancia temporal](evidence/tail-final/selected-encounter-instance.png) |Fixture EN/ARCANA con identidad/PV/PM idénticos, puestos y procedencia diferentes. Número/sello junto al retrato y etiqueta breve propia/temporal. Preview del puesto3 y coste/beneficio, sin las frases de procedencia que causaron el overflow real deA67. La fuente completa sigue en el nombre accesible y ayuda. El foco claro es teclado, no debe eliminarse. |
| Error de sesión en inspector |Finding estáticoF04 |[aviso contextual](evidence/resume-final/selected-recovery-inspector.png) |Cuenta aislada real, cookie retirada solo de esa sesión. Texto funcional necesario con equipo todavía visible. Captura no prueba el commit; specs/controlador sí comprueban resultado y recuperación. |
| Consulta de ruta |Finding estáticoF07 |[nodo bloqueado](evidence/resume-final/selected-route-inspection.png) |Cuenta aislada real, ES/Diagon. Objeto protagonista, posición/estado y conexiones a demanda. Etiqueta de solo consulta y regreso; POST0/estado igual se comprueban aparte. |

La arena se valoró comparando muestras equivalentes antes/después. Para otras vistas no se inventa un «antes» visual: se enlaza el finding con evidencia estática o técnica histórica. No se retocan capturas para ocultar errores, texto o controles.

La animación no se valida con estos PNG. Cursor/pausa/2x/inspector/ocultación sintética/omisión/log se evalúan en las pruebas temporales y regresiones Linux; rendimiento en PERFORMANCE. El toque emulado, texto200% y viewport320 no equivalen a dispositivo físico/zoom de navegador. Hipótesis de claridad y game feel pendientes en HUMAN-CHECK.

Los seis PNG nuevos proceden del merge de ensayo `cbd771c385164f4802ba17226d418fa92cdc7e5c`, head `6d4dbcb5df733641a8b9ce26bf8821c8f8289d05`, árbol común `d48d45df6a9d9a23cf0862893182270ff5c89976`. Se inspeccionaron de nuevo Encuentro y ambas arenas; las otras vistas mantienen sus consumidores. Los PNG del candidato anterior se conservan en evidence/final y sus intentos, sin presentarlos como una nueva ejecución. El caption de pausa puede variar sin alterar el resultado.

En la nueva muestra de ruta el objeto consultado es un Pacto bloqueado (el nodo concreto depende de la ruta de ensayo); se revisó esa captura de nuevo. Filtro y aviso del inspector son byte a byte iguales a los ya inspeccionados, mientras que Encuentro y arenas se revisaron en su nueva procedencia.

Último Encuentro: CI39064546905/head6f47559, fase tail24/24; nueva imagen inspeccionada después de recortar solo márgenes. Las otras cinco imágenes conservan procedencia6d4dbcb porque sus consumidores no cambian. A67 real se valida además con los24 rectángulos archivados, no mediante la fixture aislada.
