# A72 · Consolidación A70/A71 · 17 octubre 2026

## Autorización y estado inicial

Enric autoriza revisar/corregir/validar, commits e integración/push a main. No despliegue o publicación. Goal explícito activo. Base remota main `f5d3a891d5f5a6c1a69a28b46b8c96de8ead82b8`; PR3 `dffd6ae` sobre main, PR4 `7450285` sobre PR3, ambas abiertas. Árbol tracked limpio; 1972 entradas untracked ajenas conservadas. No limpieza ni staging general.

A71 ya implementa antesala, actor por piezas, foco/selección localizada y cierre. CI38988996115 correcta sobre445d6f4/mergeffb9094; los objetos runtime actuales coinciden. Último check PR4 cancelado por actualización documental. Último check PR3 falla en `trial-gateway.test.ts:177` con422, no una caída gráfica. Inspección muestra petición sin elección para encuentros A67, aunque el generador puede situarlos antes del primer duelo. La atribución se comprobará con rutas deterministas, no se tratará una ejecución verde aleatoria como resolución.

## Recorrido y aceptación

Mapa → rival conocido → equipo/objetos → preparación/cancelación → confirmación coste5 → log guardado/replay → desenlace → botín → otra decisión explícita. Conservar las operaciones, economía, reglas y snapshots existentes. No nuevas ilustraciones o mecánicas.

Revisar las seis capturas A71 existentes y sus componentes, distinguir composición estática de dinámica Linux, y contrastar ES/EN/packs/3tamaños. No defecto artístico nuevo demostrado inicialmente. No repetir implementación por preferencia cosmética.

## Corrección condicionada y recuperación

Si las rutas deterministas reproducen422: adaptar exclusivamente la política del test a decisiones permitidas (pasar encuentro cuando el recorrido no evalúa tratos, reclutar/pasar Pacto según capacidad). Probar antes que falla y después que completa, sin relajar validaciones/expectativas o modificar servidor. Preservar cobertura de tratos en sus pruebas específicas. No recursos de cuenta habitual.

No nuevo estado persistido. Recuperación/reload/fallback/skip siguen contratos A70/A71. Historial/Word intactos.

## Plan vivo

1. Completado: fuentes, PR/SHA/evidencia, revisión visual/código y falloCI.
2. Completado: reproducción determinista y corrección mínima si procede; tipos/build/unitarios/PGRedis.
3. En curso: candidato único de integración sobre main que contenga A70/A71; CI Linux serial con guard/lock/watchdog originales, sin reintentos. Reutilizar evidencia anterior con objetos equivalentes y registrar los resultados nuevos.
4. En curso: integrar sin force-push, verificar main remoto/ancestría/CI y documentación final.

CI puede usar consolidación equivalente para no integrar un candidato intermedio con un fallo conocido ni duplicar matrices. Las garantías gráficas extensas se ejecutan solo en Linux. No navegador en el Mac. Humana/lector hablado/dispositivo físico pendientes; límites de rendimiento genérico/arranque conservados explícitos.

## Avance previo a integración

Seed17 reproduce422INVALID_OPERATION en encuentro; seed0 directa. Test corregido con pase explícito, sin cambio de servidor; RED/GREEN archivados.554unitarios/78PGRedis/build/tipos/scanner locales correctos. Estrategia: consolidación por avance directo de A70/A71 a main, con runtime idéntico al mergeffb9094 ya validado y única modificación nueva de test comprobada. Una CI de main serial comprobará el resultado integrado, sin ejecutar una matriz gráfica duplicada previa sobre el mismo runtime.

## Integración y CI en curso

Avance directo remoto main f5d3a89→de99ef3 confirmado, sin force-push o conflictos. GitHub reconoce PR3/PR4 comoMERGED, PR4retargetmain. CI39016752481 de main en curso; tipos/contenido/554unitarios/78PGRedis/build/scanner y batería conjuntaA70/A71 correctos. Halloween correcto. Resto de regresiones pendiente; goal activo. Seis PNG actuales descargados e inspeccionados, evidencia histórica intacta.

## Finding de sincronización A69 antes de corregir

CI39016752481: A70/A71 98correctos y Halloween12correctos; A69 18correctos/1fallido/5omisiones. Se cancela el resto de esta ejecución propia tras conservar artifact, sin contar suite incompleta como aprobada. Error en condición de ocultación simulada: cursor DOM3→4. El reloj liquida tiempo visible en setVisible y publica estado React; el test lee el atributo inmediatamente sin esperar ese commit ni la última actualización del renderer. Esto es compatible con carrera del test, no prueba de que avance oculto.

Cambio mínimo previsto: esperar estado no-playing/no-ticking y asentamiento DOM como ya hace la prueba de pausa; después muestrear cursor/progreso/paints y exigir inmovilidad durante300ms. Mantener asserts y añadir progreso oculto; sin temporizador de tolerancia añadido ni cambio de reloj/renderer. Caracterizar también cruce de frontera al ocultar en prueba pura. CI nueva necesaria por este cambio de prueba; no reintento automático del candidato fallido.

## Finding de selector de foco antes de corregir

CI39018704725 sobre8155efc: jefe/Halloween/A69 correctos. Regresión general55correctos/1fallido: ruta WebKit abrió EncuentroA67, test buscaba solo Pacto o confirmación habilitada, mientras App enfoca [data-encounter-choice] correctamente. Snapshot conserva diálogo y dos elecciones. Se cancela resto propio después de preservar error; no se cuenta comoCIcompleta. Cambio mínimo: añadir la elección de encuentro al selector esperado, conservando toBeFocused, Cancelar y retorno al nodo; reforzar consulta/cancelación con igualdad de estado económico. No cambio de App, foco productivo, reglas o renderer.
