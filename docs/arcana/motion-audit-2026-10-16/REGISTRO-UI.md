# A69 · Implementación de feedback de interfaz M03–M10

16 octubre 2026. Implementación posterior a AUDIT/SCREENS/MOTION, con ilustraciones actuales y sin cambios de dominio, economía, inventario o contratos de servidor. Este registro distingue el mínimo integrado de las propuestas de coreografía más amplias.

## Mecanismo compartido

`src/arcana/presentation/visual-history.ts` guarda únicamente pares namespace/ID de presentación en `sessionStorage`, con límite256 entradas y fallback en memoria si el almacenamiento falla. No guarda saldos, resultados, stats, progreso ni autorizaciones. Metadatos manipulados pueden suprimir/repetir una representación; nunca ejecutar un comando. La política de conservación es deliberadamente acotada: el caller distingue receipt confirmado de consulta histórica; la caché visual no es un historial económico infinito.

API compartida con apertura M02: `claimVisualEvent(namespace,id)` y `hasVisualEvent(namespace,id)`. `useConfirmedMotion` admite un receipt explícito, claim una vez, ventana≤500ms, fin por timer o documento oculto y cleanup de timer/listener. Reducido/oculto atienden el evento estáticamente y no difieren una celebración para después. StrictMode puede reanudar el mismo plazo desde la referencia local, no crea otro evento.

`useSelectionMotion` distingue cambio real de firma en un componente montado de su primera consulta. Motion mini160/180ms, translateY3px→0 y opacidad0.8→1, cancelado por cleanup, reducido u oculto. No espera antes de modificar estado ni añade operaciones. Idioma no forma parte de las firmas de equipo/sinergia/página.

## Registro por recorrido

| ID | Implementado | Conservado y límite concreto |
| --- | --- | --- |
| M03 | `MapPanel` acepta `confirmedReceiptId`; SVG decorativo traza el último enlace280ms desde coordenadas del mismo layout, nodo confirmado asienta220ms. Se retiran los dos pulsos900ms de invitación al remontar. No ticker nuevo, pointer-events:none, capa bajo los nodos. | La selección/cancelación no traza progreso. Lista equivalente y origen no interactivo intactos. Posiciones y alineación visual deben comprobarse en Linux; no se ha observado el trazo en este Mac. |
| M04 | `NodeResult` identifica por recruitId confirmado o recruit legacy del plan y muestra ese aliado, retrato/nombre/procedencia, en el resumen visible. Asentamiento240ms únicamente con receipt nuevo y confirmado. Pasar no muestra otro recluta. | No vuelo entre diálogos ni cambio de equipo provisional. El token de `TeamHud` no recibe una animación adicional: el puente visible es el resultado confirmado junto al mapa, con inspección de todo el equipo conservada. |
| M05 | Cambios PV/PM se muestran por integrante con signos y cifras exactas de diagnostics persistidos. Trato y legacy leen vitals del receipt. Refugio usa snapshot previo compatible pasado por App; si falta no inventa un antes mediante porcentajes inversos. Asentamiento240ms con el resultado nuevo; estado final permanece. | No se interpolan saldos/PV ficticios. Valores sin cambio no simulan una ganancia. Previews y reglas existentes conservados; fórmulas no duplicadas. Sin snapshot antes, la consulta final existente sigue mostrando condición registrada, sin delta inventado. |
| M06 | Forja/bóveda pasan por once ID y pop CSS local240ms del objeto confirmado, sin import asíncrono de GSAP. Se elimina confeti genérico de estas operaciones cotidianas. Cofre usa objetos/cantidades del receipt y feedback local de `NodeResult`. | No se fabrica una animación de herramientas o tapa articulada que el arte no tiene. Puerta/rueda/llave y libro de botines existentes conservados. Consultar de nuevo no vuelve a parecer una concesión. Cancelación/error/pending no disparan éxito. |
| M07 | `VisualChoices` responde solo al elegir otra opción:160ms, elevación3px y retorno. `PreparationGear` observa el loadout guardado en su wrapper: también cubre vacío→equipado/quitar, con consulta inicial estática. `EquipmentArt` puede desactivar su tween en ese wrapper y en resultado de forja para evitar capas transform duplicadas. `PreparationSynergies` reacciona180ms solo si cambia afinidad/umbral/bono real. | Gragea mantiene su selección/borrador y transform140ms existentes; no se anima consumo antes de combate. Reservas/temporales/copias y comparaciones siguen en dominio compartido. No animar2→2 como un bonus nuevo. |
| M08 | Galería del álbum reacciona160ms a firma de filtro/página con desplazamiento local3px y opacidad. Primera consulta estática, mismos retratos/controles y foco. | No doblado3D, carga de todas las páginas o marcador de descubrimiento inventado por filtrar. La propuesta de hoja saliente100ms queda reducida a un solo asentamiento no bloqueante; no se retarda el filtro para completar una salida. Sabores conservan descubrimiento autoritativo y consulta estática. |
| M09 | Caja de nodo160ms/icono180ms/interior160ms, sin retrasar controles. `OperationFeedback` usa once visual y duración≤180ms. Formularios de consulta siguen en diálogos nativos con foco/retorno originales. `useReducedMotion` soporta SSR sin matchMedia. | Cerrar es inmediato; no se añadió una animación de salida que bloqueara foco. Pending/UNKNOWN_COMMIT/error siguen estables con recuperación explícita. No hay un tween global aplicado a todas las pantallas ni shake para errores. |
| M10 | `ExpeditionClosure` anima botín340ms solo cuando App pasa receipt confirmado coincidente; consulta/retorno estáticos. `SceneAtmosphere` admite active; CSS pausa ambiente cuando hay dialog[open], además de visibility/reducido. Root conecta replay/operaciones como foco. | Halloween conserva su guard nuevo/histórico y linterna450ms de A68. No más motas ni otra fuente de premios. Se conserva orientación por stock actual tras usar botín. Nueva intención no celebra una recompensa inexistente. |

## Archivos de interfaz

Nuevos: `visual-history.ts`, `useConfirmedMotion.ts`, `useSelectionMotion.ts`, `node-result-motion.ts`, `motion-a69.css`.

Modificados: `MapPanel.tsx`, `NodeResult.tsx`, `CommercePanel.tsx`, `OperationFeedback.tsx`, `ExpeditionClosure.tsx`, `CollectionPanel.tsx`, `VisualChoices.tsx`, `SceneAtmosphere.tsx`, `EquipmentArt.tsx`, `PreparationSynergies.tsx`, subcomponente `PreparationGear` en `ExpeditionPreparation.tsx` y compatibilidad SSR en `useReducedMotion.ts`. El coordinador integra props y estado confirmado en App; M01/M02 tienen registro separado.

## Pruebas ejecutadas de este bloque

- RED inicial de historial: módulo inexistente; no se atribuyen cuatro assertions fallidas. Después4/4 comportamientos correctos: remount/reload, namespaces, storage bloqueado, límites y lectura por otro historial montado.
-5/5 casos de deltas/recluta: snapshot previo compatible, ausencia/incompatibilidad, diagnostics legacy, candidato exacto/pasar, representación ES/EN sin mutación y estática SSR.
- Regresión seleccionada7archivos:46/46 correctos a20:12:42, tras corregir5fallos reales de SSR por ausencia de matchMedia en mapa/preparación. Comando: `npm test -- tests/domain/arcana/visual-history-a69.test.ts tests/domain/arcana/node-result-motion-a69.test.ts tests/domain/arcana/preparation-presentation.test.ts tests/domain/arcana/encounter-presentation-a67.test.ts tests/domain/arcana/intention-presentation.test.ts tests/domain/arcana/map-presentation-a60.test.ts tests/domain/arcana/seasonal-presentation-a68.test.ts`.
- `npm run typecheck` correcto durante integración del bloque. El coordinador repite tipos/build/pruebas completas sobre el candidato final; no convertir el resultado parcial en validación del árbol posterior.

Después de añadir el wrapper de loadout y formatear, `npm run typecheck` volvió a terminar correctamente y los7archivos/46casos pasaron a20:14:59. El resultado completo del candidato y su CI se registra por el coordinador.

## Pendiente de ejecución gráfica

Comprobación real de coordenadas/foco/no oclusión, posiciones antes/durante/después, remount/reload sin replay, CSS reducido/sistema y cambio en caliente, ambos packs/idiomas, texto ampliado y viewports. Son pruebas Linux pendientes para este bloque al escribirlo, no acreditadas por SSR. No se ejecutó navegador ni captura/VFX nueva en Mac. No producción de assets, instalaciones, pago, commit o push desde este subencargo. Sesión humana y dispositivos físicos permanecen separados.
