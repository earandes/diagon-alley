# A86 · Validación en curso

Baseline46a43df; candidato inicialbe00335. No navegador local. `npm run typecheck`, `npm run build`, `node tools/arcana/verify-build.mjs`, build del harnessA69 y `npm test`: correctos;658tests/102archivos. Build16.345.454bytes, advertencia existente de chunks>500KB conservada. Impeccable detect:[]; no acredita calidad artística.

Pruebas de preferencias:2correctas. Proyección estática de arena:1correcta; SceneCanvas/diagnóstico sustituidos solo en esa prueba sin navegador. Sus fallos iniciales eran errores de fixture (faltaba tiempo/esquema de inventario y renderer dependía de window), no prueba RED de defecto del producto. No se atribuye TDD retroactivo. Pruebas antiguas adaptadas a navegación real por pausa; referencias congeladas anteriores mantienen sus controles antiguos de forma explícita. Guard, bloqueo, watchdog, workers y reintentos intactos.

CI39159355139 de A85 cancelada deliberadamente porque el nuevo recorrido requiere validar juntos A85+A86; comprobaciones parciales no equivalen a batería superada. CI39163511473 del primer candidatoA86 se sustituye para conservar la evidencia nueva en el artefacto permitido del workflow existente (sin ampliar capturas o cambiar workflow). Estado final todavía pendiente.

Evidencia gráfica prevista: dos imágenes móviles seleccionadas con casas (Diagon/ARCANA), muestras de arenaA75 y coreografías ya medidas porA69/A70/A71. No capturas automáticas, vídeo o perfil local. Los rawA86 se escriben bajo el artefactoA69 existente y se copian aquí tras CI con SHA/procedencia.

## Candidato combinado en curso
Fuente27ccc03d51291b333d8e409fb69d5450f490cba3, CI39163805967. Los candidatos anteriores be00335/fbc624f se cancelaron deliberadamente al ajustar conservación de artefactos, navegación de pruebas entre preferencias recordadas y foco. No fueron reintentos automáticos ni se consideran baterías superadas. Guardas/workflow intactos. La primera pasada se conserva para inspeccionar composición y reunir defectos; hay una corrección adicional de retorno de foco al cerrar el registro con X preparada para el candidato de confirmación.

## Primera ejecución terminada y correcciones

CI39163805967 / fuente27ccc03 / merge1ce3b87:658unit,103PostgreSQL/Redis;A75 113pass, A68 12pass, A69 72pass. A70falló en su primer recorrido: el helper buscaba la salida ahora plegada sin abrir Pausa, por lo que comprobaba el mapa estando todavía en combate. No se considera validación integrada superada; regresión omitida por dependencia. Se corrige navegación real, sin force-click ni alterar el juego.

Correcciones adicionales: Pausa es diálogo nativo con foco contenido y retorno desde registro/Ajustes; los harness pasan Ajustes al mismo consumidor que producción; presupuesto común de figuras 5×3 medido con etiquetas reales y crecimiento accesible. Cuatro tests geométricos RED/GREEN; total local662/103, tipos y build/scanner pasan. Falta CI del candidato corregido y su regresión completa. Ningún navegador local.

Confirmación d661a94 / checkout067e927: A75 termina correctamente y sus dos capturas densas móviles se inspeccionaron. Todos los nombres/PV y figuras visibles; los retratos ARCANA son figuras completas y conservan menor tamaño de rostro que los bustosDiagon. No se afirma equivalencia artística o articulación anatómica. A70/A69/regresión todavía pendientes. Los picos de arranque54–67ms se conservan en PERFORMANCE; no son tiemposGPU.

A70 del candidato d661a94 supera sus cuatro recorridos reales ES/EN×pack, después falla en la fixture de gesto pausado: el muestreador antiguo pulsaba `.replay-controls button:first-child`, ahora Reanudar, de modo que comparaba dos frames en movimiento. Se corrigen los tres muestreadores temporales A69/A70/A71 para activar Pausa real en la fase observada y cerrar el menú sin reanudar. No se muta el reloj o resultado, ni se relaja la igualdad de posición/render/escala congelados. Es una corrección de navegación de ensayo necesaria; el pipeline completo del nuevo candidato sigue pendiente.

CI39165666169 termina fallida: A70cuatro recorridos reales pasan, su muestreador de pausa falla; A68 12pass yA69 66pass/6fallos/24skips. Los seis fallos nuevos deA86 reproducen foco fuera del primer control al hacerTab desdeCerrar. Se añade ciclo explícito deTab/Shift+Tab en el diálogo nativo, sin interceptar el diálogo hijoAjustes. La comprobación de foco no se relaja. También se mueve el foco tras omisión a efecto posterior al cierre modal para que la limpieza de pausa no lo robe. B1cdc17/CI39166679843, con runtimeidéntico a d661a94, se cancela como candidato sustituido antes de gráficos mientras instalaba navegadores. Ninguna CI ajena cancelada; nueva ejecución solo después de estas correcciones, no retry automático.

Fuente6cf2ac8/checkout0d59c610: A75 yA70completos terminan correctamente; dos capturas reales seleccionadas de preparaciónA71 inspeccionadas (ambos paquetes) y preservadas con sus JSON de recorrido. No tomar las imágenes históricas de la raíz del artefacto por capturas nuevas. A68/A69/regresión siguen pendientes. Nuevas medidas de arranque son peores frente a la referencia histórica en esta pasada, aunque P95sostenido16,7ms se conserva; detalle enPERFORMANCE.

Confirmación6cf2ac8 / merge0d59c610 / CI39167929972: primer job completo superado.662unit/103archivos,103integraciones PostgreSQL/Redis/17archivos; tipos/build/backup/scanner correctos. Cuentas/entrada/estilo65casos; A75 113pass/175skips; A70+A71+A73 103pass/35skips; A68 12pass; A69+A84+A85+A86 72pass/24skips. Los seis pares de navegador/tamaño superan Tab/Shift+Tab, retorno del registro, Ajustes anidados y foco tras omisión. Regresión final todavía en curso; no éxito global atribuido.

Dos capturas A86 móviles de este checkout inspeccionadas: diez figuras/nombres/PV y casas visibles, sin barra global o controles permanentes. El aro cian es foco de teclado, no decoración. Diagon usa bustos y ARCANA figuras completas: persiste diferencia de escala del rostro. Una captura no prueba la coreografía; los muestreadores temporales originales pasan en A69/A70/A71. La pequeña barra de fixture al pie no es navegación productiva.

## Cierre técnico19octubre

19 octubre2026. A85+A86 integrados mediante PR9 en main`1a549eafb33f771293603775a8586d0210c608a3`. CI39167929972 **completa y correcta**, fuente6cf2ac8/checkout0d59c610; árbol idéntico al merge. Documentación posterior no se atribuye otra batería. Sin despliegue.
Regresión original completa: ver [resumen del log](../arena-scene-2026-10-18/evidence/focus-candidate/validation.json). Se verificó igualdad exacta del árbol fuente/checkout/merge. No cambio de workflow, guard, lockfile o SQL. Pruebas humanas/físicas pendientes; no navegador local. El resultado desfavorable de arranque se conserva enPERFORMANCE, sin presentarlo como optimización.
