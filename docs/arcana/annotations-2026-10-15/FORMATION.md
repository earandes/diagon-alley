# Preparación, álbum, sabores y atlas · A59

## Interacción implementada

- La nueva expedición presenta cinco puestos vacíos: la copia inicial existe en inventario, pero no queda elegida en la vista. Pulsar un cromo lo añade o retira de la selección local. Solo «Entrar al mapa» envía los IDs elegidos a `start-run`; sin un acompañante no se habilita.
- En una expedición activa se parte de sus miembros propios guardados. Los temporales ocupan puestos diferenciados, con borde discontinuo, emblema y descripción explícita. No se pueden convertir en copias o equipar mediante esta interfaz. Se conserva el límite conjunto de cinco.
- La preparación permite consultar los atributos de la definición guardada antes de salir; durante la ruta muestra los PV/PM actuales de miembros o reservas, sin aparentar curación al retirar/reincorporar. Permite asignar equipo poseído. Tocar «Equipar…» o «Sin equipar» es una orden explícita al caso existente, cuyo resultado se refleja desde el estado confirmado. Si un objeto pertenece a otra copia, la etiqueta accesible, el título y su nombre visible identifican al portador antes de trasladarlo. No hay compra, regalo o cálculo de stats nuevo.
- Elegir retratos es un borrador local; «Confirmar formación» persiste el cambio entre nodos. Cerrar un borrador no lo envía. Equipar es una acción persistente independiente: cerrar después no revierte una asignación ya confirmada.
- El álbum queda dedicado a descubrimientos, rarezas, cantidades y contexto. Al consultar un cromo se abre un folio de lectura; no contiene botones para formar, retirar ni equipar. Un acceso ilustrado lleva a preparar la expedición.
- La ayuda de sabores se abre desde un objeto con una receta visual de tres pasos: tarro → asignación antes del duelo → sabor realmente activado. Sigue derivándose de receipts confirmados, sin cambiar los cuatro sabores o inventario.
- Misiones muestra un atlas: región jugable seleccionable y bosque futuro no seleccionable. Ganar al jefe conserva el acceso descubierto, pero nunca presenta la siguiente campaña como jugable.

## Comprobaciones de este ámbito

`npx --no-install vitest run tests/domain/arcana/preparation-presentation.test.ts`: seis casos de presentación SSR correctos (ES/EN). Comprueban selección inicial vacía, ausencia de comandos al renderizar, temporales separados, álbum sin configuración y región futura no interactiva. Se añadieron después de la implementación; no son un ciclo RED/GREEN ni prueba de interacción de navegador.

`prettier --check` en los siete archivos de este ámbito: correcto. `npm run typecheck` global correcto después de integrar App; el fallo inicial de props correspondía a la integración todavía pendiente y quedó resuelto.

Primer recorrido aislado real en5240 con contextos nuevos ES/EN: elección de retratos no escribe, equipar/quitar persiste tras recargar, iniciar conserva la única copia propia y la formación elegida, folios cierran con Escape y devuelven foco, consultar álbum/receta/atlas no modifica estado, sin errores de página o desbordamiento horizontal. Log `evidence/formation-visual-review.log`; capturas iniciales conservadas en `after-formation-initial/`.

La inspección inicial encontró solapamiento de Ajustes/Volver en la preparación y título regional cortado: corregidos por el integrador en el CSS del marco. El segundo intento de recaptura se interrumpió por HMR (`evidence/formation-visual-review-r2.log`), sin atribuirlo a fallo del flujo. Se acotó después la espera de decode de imágenes lazy en el helper de capturas para evitar una espera infinita; no modifica el código del juego ni sus tiempos. El cierre visual y los checks generales se registran en el informe A59. No se ha accedido a la pestaña/partida del propietario, ni se han realizado observaciones de retención con usuarios.

Último pase de este ámbito: `evidence/formation-visual-review-r4.log`, dos contextos nuevos ES/EN correctos. Las26capturas de `after-formation/` incluyen1280×900,911×1079 y390×844, más ampliación del texto raíz al200% (no zoom nativo ni dispositivo físico). Estado exacto tras consultas, equipo tras recarga, selección explícita, retorno de foco/Escape y ausencia de errores de página verificados. Las últimas observaciones visuales sobre reserva del título/cierre y reflujo al200% se enviaron al integrador para el cierre general; no se presenta la ampliación como ausencia de scroll vertical en un modal.

## Adaptación de las regresiones existentes

`tests/browser-trial/game-fixture.ts` añade `startExpedition`: pulsa realmente una copia propia y confirma mediante la interfaz. No selecciona automáticamente en producción ni siembra estado por API. Se actualizaron los recorridos históricos `journey`, `commerce`, `team-beans`, `region-map`, `game-feel`, `hud-results`, `replay`, `visual-polish` y `visual-nodes` para la preparación explícita, el hub de tiendas, el fondo único y los folios de lectura. Las afirmaciones de autoridad, gasto, recarga, recuperación y resultados se conservan. El álbum ahora cierra el folio antes de abrir Ajustes y vuelve a consultarlo en el otro idioma. Estas adaptaciones de expectativas sustituidas se distinguen de una regresión de comportamiento; su ejecución se registra en el informe general. Tipos globales correctos tras editar los tests; no se ejecutaron suites de navegador adicionales mientras el integrador coordinaba la GPU.

### Ejecución de regresiones tras congelar fuentes

`ARCANA_TRIAL_TEST_PORT_BASE=5260 npx --no-install playwright test --config playwright.trial.config.ts --reporter=line`:72casos correctos y4fallos en5,9min. Los cuatro pertenecían al mismo recorrido `team-beans`, ES/EN por Chromium/WebKit: el test suponía volver al álbum tras recargar; «Preparar expedición» navega explícitamente al mapa. Se corrigió el test usando la navegación real de regreso a Cromodex antes de reabrir la preparación y comprobar el equipamiento guardado. Ninguna condición de gasto, receipt, recuperación o autoridad se eliminó o relajó. Log inicial y contextos de error conservados.

Reejecución focal con los mismos puertos y namespaces nuevos: `--last-failed --reporter=line`, cuatro casos correctos en20,8s. Cobertura consolidada:76casos distintos correctos (72+4), no80ni una corrida única76/76. Evidencia: `legacy-browser-initial.txt`, `legacy-browser-focused.txt`, `evidence/legacy-initial-failures/`.

Se usaron5260/5263/5262/5264 y cuentas/contextos nuevos; no se accedió a5194o sesiones ajenas. El muestreo antiguo de WebGL de `replay.spec.ts` se ejecutó como parte de sus assertions funcionales de draws/layout; sus métricas no se utilizan como rendimiento válido porque coincidía con otros checks. No se ejecutaron aquí las suites PWA, apertura fría ni arena-load, reservadas a la validación secuencial del integrador.
