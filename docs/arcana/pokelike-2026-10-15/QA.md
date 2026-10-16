# A60 · Verificación de navegador

Línea base A59 compilada congelada en `dist`, servida por el puerto propio 5270 con namespace aislado. Se crearon dos contextos Chromium nuevos (ES 865×1079, EN 1008×1079); se cerraron al terminar. No se usó Chrome del propietario ni su partida 5194.

18 capturas anteriores en `before/`: entrada; preparación vacía; elección; mapa; pacto consultado sin confirmar; preparación activa; rana sin stock; compra separada A59 con stock uno; grageas compradas/armario. Todo el inventario de estas cuentas se obtuvo por la interfaz y API real. `before/baseline-contexts.json` guarda sus estados finales como evidencia local aislada. El primer intento llegó al mapa y falló por un `baseURL` ausente en el helper GET de Playwright; fue corregido sin cambios de producto y se repitió el recorrido completo en contextos nuevos (`baseline-capture.txt`).

La suite nueva `tests/browser-trial/pokelike-experience.spec.ts` y configuración `playwright.pokelike.config.ts` utilizan exclusivamente puertos 5280/5281, namespaces UUID por ejecución, un worker y contextos nuevos por caso. Contiene20casos: cinco escenarios × es/en × Chromium/WebKit. Consultan estado/contenido por GET para comprobar invariantes; ninguna cuenta se prepara o cambia mediante POST programáticos.

Escenarios:

1. Selección deliberada, inspector/equipo a demanda, retorno de foco/Escape anidado, ausencia de escritura al consultar, mapa/origen/pacto auténtico y cofre cancelable. Medición geométrica a 1008×1079, 865×1079 y 390×844.
2. Compra/apertura única con precio visible, un POST/receipt/copia, selección/información sin gasto, recarga/idioma conservados y grageas con acción de preparación.
3. Rana sellada ganada al vencer al jefe mediante el recorrido real: abrir consume esa unidad, sin otro cobro/compra, reducido y recarga conservan entrega.
4. Compra/apertura con movimiento reducido a 390×844: resultado estático, sin canvas de chispas/celebración y retorno de tienda conservando datos.

5. Compatibilidad de contenido público antiguo sin `campaign.nodes`: fixture explícita que omite únicamente ese campo en la respuesta GET del navegador, conservando servidor, grafo, inventario y comandos reales. Pacto mantiene confirmación visible, avanza una sola vez y recluta un temporal sin alterar copias/saldo/grafo. La captura lleva rótulo de fixture. Añade cuatro casos ES/EN×Chromium/WebKit, total20casos distintos. Las respuestas efectivamente recibidas por la página se comprueban sin esa propiedad, además de verificar el comportamiento.

## Resultado final compilado

**20casos distintos verificados sobre el build congelado**, mediante cobertura consolidada, no una corrida única20/20. Comando `ARCANA_A60_COMPILED=1 npx --no-install playwright test --config playwright.pokelike.config.ts`. La pasada completa (`qa/browser-compiled.txt`) tuvo18/20correctos en1,2min; sus16recorridos normales y dos fixtures Chromium fueron correctos. Los dos fixtures WebKit no omitieron los planes en la UI porque el worker evitó la interceptación de red del test tras tomar control: la página recibió las acciones del contrato moderno. No se modificó producción por ese fallo de fixture.

Se bloquea el registro de service worker **solo dentro del describe de los cuatro casos que alteran GET**; los16recorridos normales conservan el worker compilado real. Los cuatro fixtures pasaron en8,4s (`qa/browser-compiled-legacy-focused.txt`) y volvieron a pasar en8,1s al añadir la aserción explícita de respuesta recibida (`qa/browser-compiled-legacy-final.txt`). No sumar18+4 como22casos distintos ni añadir repeticiones. La validación específica PWA pertenece a su suite independiente.

Las36capturas finales en `after/` corresponden al compilado y las dos de compatibilidad tienen rótulo visible de fixture. El helper espera animaciones CSS finitas del modal y opacidad≥0,99 antes de fotografiar; evita presentar el fotograma semitransparente de entrada como diseño final. No cambia tiempos de producción ni las mediciones separadas de apertura. Todos los contextos y servidores5280/5281 propios quedaron cerrados antes de la medición serial de apertura del integrador.

## Pasadas previas durante desarrollo

Resultado de desarrollo anterior a los casos de compatibilidad: **16/16 correctos en 1,3min** (`browser-pass2.txt`) y cuatro JSON de comprobación de compra atómica. Las cuatro repeticiones focales posteriores añaden inspección cerrada/abierta a390px, condición al foco y capturas tras corregir el ancho del wrapper: **4/4 correctas en15,6s** (`browser-preparation-focused.txt`). Son los mismos cuatro casos ampliados y no aumentan el número de casos distintos. Las capturas fueron sustituidas después por el pase compilado final.

La primera pasada (`browser-initial.txt`) tuvo8/16correctos y ocho fallos por una expectativa del test: exigía repetir el modal al recargar. El comportamiento previo recupera la entrega sin repetir la animación. Se corrigió exclusivamente esa expectativa, conservando igualdad completa del estado, saldo, copia, receipt y POST únicos. La primera ampliación focal (`browser-preparation-final.txt`) tuvo2/4correctos; su helper `Shift+Tab` no llegó al botón esperado en WebKit. Se cambió a foco explícito para comprobar el preview, manteniendo intactas las aserciones de retorno de foco mediante Escape y de modal padre abierto. No se presenta esa comprobación como validación de navegación Tab según preferencias del navegador/SO; estas no se verificaron aquí.

Observado técnicamente: selector/inspector/idiomas/consulta no generan POST, la compra+apertura confirma una única copia y cobro de10, la unidad ganada al jefe abre sin gasto adicional, los dos tipos de apertura sobreviven recarga sin otra operación; grageas se compran y ofrecen preparar, no descubren un sabor ficticio. La ruta es jugada mediante GUI y grafo autoritativo; no hay seed ni inventario inyectado. No equivale a validación con usuarios ni prueba en dispositivo físico. Las capturas ilustran apariencia; las aserciones de estado comprueban persistencia de cuentas aisladas por separado.
