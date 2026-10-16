# A58 · Personajes ilustrados y apertura fluida

15 octubre 2026. Continuación autorizada por Enric: assets Harry Potter con acabado coherente y corrección del tirón al abrir ranas. La dirección A57 y sus garantías continúan; no cambios de reglas, economía, partidas, Word o distribución.

## Estado inicial

A57 entrega treinta personajes vectoriales provisionales, sobre escenarios pintados raster y una caja pentagonal con fuente Blender. La diferencia de acabado es perceptible. Apertura compilada fría Chromium:43,5FPS en muestra corta, un pico183–200ms; WebKit alrededor60FPS. Referencia inalterada en `diagon-game-redesign-2026-10-15/`.

## Resultado y alcance

1. Personajes con dirección pictórica común: proporciones/edad propias, luz cálida lateral, sombras índigo, telas/madera/metal tratados como en los escenarios. Nada de texto funcional dentro de imágenes. Maestro conservado, crops coordinados para figura/retrato/miniatura y manifiesto con modelo/licencia/seed/prompt/transformaciones.
2. Muestra de tres personajes en contexto, inspección visual del integrador y producción del roster después de esa comprobación dentro de la delegación vigente. No se atribuye a Enric una aprobación que no haya emitido. No basta convertir o texturizar los SVG antiguos para llamarlos arte definitivo.
3. Recorrido de apertura con caja/sello/salto/carta intacto y trabajo por fotograma acotado. Medir separadamente primer uso y posteriores; no desplazar el bloqueo al click, la entrada en tienda o una espera oculta. Probar normal, omitir, reducido y ausencia de recursos.
4. Integrar el arte de Diagon manteniendo ARCANA intercambiable, nombres es/en e IDs/receipts sin mutación. Comprar/abrir/recuperar sigue en servidor antes de animar.

## Pipeline

Evaluación de MFLUX/MLX con FLUX.2 Klein4B cuantizado, local al proyecto y sin API de pago, para pintura real raster. Licencias y revisiones verificadas antes de uso; cache/modelos/venv bajo `.tools/`, sin configuración global. No generación en runtime. El software/modelo libre no acredita derechos de distribución de Harry Potter; no se publica.

Primero mediciones de apertura, después producción GPU; no ejecutar cargas de generación a la vez que benchmarks de navegador. Si una herramienta falla, registrar el fallo y la alternativa efectiva; no declarar producción final por cambiar una etiqueta de estado.

## Aceptación verificable

- Cada personaje resuelve figura/retrato/miniatura correctos, se reconoce a escala de carta y HUD, sin cortes accidentales o fondo residual; revisar la familia completa y muestras en mapa/álbum/arena/revelación.
- Registro de procedencia/composición y referencias de recursos completas; no fotografías de actores, assets extraídos de juegos comerciales o servicios con créditos.
- Apertura medida antes/después en contexto técnico independiente. Objetivo de trabajo: eliminar el pico anterior183–200ms, idealmente sin frames mayores50ms durante el arranque/acción. Informar números reales y límites, sin fabricar60FPS o aceptación física.
- ES/EN, swap exacto de estado, reducción/omisión, arte ausente, recarga y respuesta perdida pertinentes. Build/tipos/validadores y pruebas del ámbito; no presentar recorridos técnicos como personas.

La valoración estética del propietario y la retención requieren observación; «acabado de producción» aquí debe apoyarse en los recursos entregados y su inspección, no en una supuesta aprobación humana.

## Decisiones de ejecución

- Los tres maestros y su composición en callejón/carta fueron inspeccionados por el integrador; seleccionada esa dirección para el lote completo. No es una aprobación atribuida a Enric. Maestros pintados con fondo para retrato, figuras con alpha y miniaturas de rostro; los roles conservan encuadres específicos.
- Los cuatro alias visuales genéricos de rivales se alinearán con Draco/Snape/Bellatrix/Voldemort de la misma familia, sin alterar identidades de combate.
- Los SVG/WebP A57 se conservan como fuentes históricas sin selección en el paquete actualizado. No se borra trabajo previo para cambiar de acabado.
- Canvas2D con dos sprites de brillo prepaintados sustituye únicamente la decoración Pixi/GlowFilter de apertura. El baseline completo A58 y16 casos antes/después están en frog-opening-performance-2026-10-15; mapa/arena mantienen Pixi. Dependencia pixi-filters retirada al quedar sin imports.

## Cierre de ejecución

Treinta personajes/noventa exports integrados, cuatro alias de rival alineados; inspección de hojas y cartas1280/390px, variantes efectivas y hashes. Apertura Canvas2D medida con pinturas compiladas: máximo16,8msChromium/35–37msWebKit.339unitarios/37integración SQL-Redis/50casos navegador del ámbito correctos, por suites separadas. [Informe final](REPORT.md), [antes/después](GALLERY.md). No cambios de precios/pesos/partidas, publicación o aceptación humana atribuida.
