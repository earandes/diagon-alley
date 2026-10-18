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
