# Diagon Alley · Callejón de maravillas

Producción local del 15 octubre 2026, autorizada por Enric para el nuevo incremento jugable. Coste adicional: **0**. No nuevas llamadas a imagegen, APIs, servicios con créditos o exportaciones de pago. Estos recursos son de prototipo privado y no acreditan permisos de distribución de Harry Potter.

## Familia vigente A58

Los personajes activos son las treinta pinturas del [lote illustrated-v2](illustrated-v2/README.md), con noventa exports por función y cuatro alias de rivales. Producción local MFLUX/MLX offline, sin APIs o créditos. Maestros, variantes, máscaras, crops y hashes documentados allí. Los apartados inferiores registran A57: sus retratos vectoriales y sus estados provisionales son históricos, sin selección de personajes en el paquete v2. Escenarios/props/caja conservan fuentes compatibles. [Informe y capturas A58](../../docs/arcana/illustrated-assets-2026-10-15/REPORT.md).

## Dirección y selección

La calle ilustrada ocupa el escenario. Índigo de noche, ventanas ámbar, papeles crema, terciopelo violeta y oro de confitería unen mapa, mostrador y álbum. La navegación se reconoce por objetos: atlas, álbum abierto, fachada de dulcería y carta sellada; ajustes es un mecanismo de latón. Texto funcional, costes, errores y traducciones permanecen fuera del arte.

Tres composiciones comparadas en [compositions/comparison.json](compositions/comparison.json):

1. [Callejón de maravillas](compositions/01-callejon-de-maravillas.png), seleccionada por criterio delegado del encargo actual: escena completa y ruta protagonista. Exige preservar contraste del trayecto sin tapar la ilustración.
2. [Atlas del merodeador](compositions/02-atlas-del-merodeador.png): contraste táctil de pergamino sobre mostrador; alternativa válida para libro/mapa consultable, con riesgo de volver a un panel.
3. [Maravilla del dulcero](compositions/03-maravilla-del-dulcero.png): producto grande sobre escenario; reservada a compra/apertura para no convertir todo el juego en una tienda.

Son **composiciones estáticas locales**, no capturas del juego funcional ni observaciones con usuarios. La selección se registra como decisión de ejecución dentro de la delegación del propietario; no se inventa una elección previa de Enric entre estas tres imágenes.

## Inventario entregado

- [assets-index.json](assets-index.json): registros listos para fusionar con el paquete de presentación. Incluye escenas, caja pentagonal, rana, marcos/cartas, navegación, farol, bolsa y efectos; alias `ui.shop` y `fx.portal` conservan contrato de integración.
- [manifest.json](manifest.json): dimensiones, alpha, pivotes, fuentes, SHA256 y tamaños de los recursos de escenario/objetos.
- [character-assets-index.json](character-assets-index.json): 30 personajes × figura/retrato/miniatura, con los IDs autoritativos existentes. El aspecto nunca cambia la identidad persistida.
- [portrait-provenance.json](portrait-provenance.json) y [portrait-runtime-manifest.json](portrait-runtime-manifest.json): familia original SVG de libro ilustrado y sus exports WebP. Rasgos reconocibles del encargo, sin fotografías de actores o trazados externos. Acabado vectorial **provisional**, más sencillo que una pintura final.
- [Muestra de protagonistas en contexto](compositions/04-character-family.png): Harry con gafas/cicatriz, Hermione con melena/libro y Ron pelirrojo/con pecas. Los demás conservan rasgos diferenciados: sombreros, barbas, peinado, accesorios, ojos o ropa.
- [sources/frog-box/pentagonal-frog-box.blend](sources/frog-box/pentagonal-frog-box.blend): geometría pentagonal realmente separada, con paredes huecas, interior, tapa y sello. Filigrana, cantos biselados, textura procedural y luz local. Renders RGBA de 768×768 con idéntica cámara para apilar piezas.

La rana es un **sprite raster plano sin rig**. Las escenas son **raster planos**, con efectos/props independientes; no se presentan como pinturas separadas por capas. El .blend de caja tiene piezas separadas, no un personaje articulado. Sus exports no contienen datos de recompensa o resultado.

## Fuentes reutilizadas

El callejón, la caja cerrada histórica y la rana provienen de `design/assets/preparation-v1/`, con la procedencia original en su manifest. Fueron producidos en el encargo histórico mediante imagegen; **esta entrega no los vuelve a generar**. Mostrador y tarro proceden del lote A50, que es visualmente neutro sin texto ARCANA incorporado. Las fuentes se conservan intactas; runtime WebP aplica reducción/compresión.

El único retrato HP raster histórico inequívoco localizado es Dumbledore, desde `design/concepts/weasley-flow-v1/03-wizard-card-revealed-es.png`. Se exporta una región sin rótulo como recurso de referencia independiente; no sustituye silenciosamente a toda la familia. El resto del roster nuevo tiene SVG propios; no se rebautizan retratos de personajes ARCANA como Harry/Hermione.

Los SVG originales y scripts se conservan bajo las condiciones del repositorio. El texto de licencia de Blender está en `.tools/blender/Blender.app/Contents/Resources/text/license/`; Blender es herramienta de autoría local, no dependencia runtime. No se importó arte de páginas web, marketplaces o juegos comerciales. La autorización de integración privada no resuelve los derechos de distribución de la franquicia; no se publica esta entrega.

## Coreografía recomendada para integración

Solo después del receipt confirmado: sello 0–300ms → tapa 200–1000ms → salto completo de rana 800–1600ms → cromo con giro 1300–2300ms → resultado estático. Halo y destellos acompañan el cromo, terminan y se desmontan; no ticker ambiental permanente ni flashes. La rana puede moverse/escalarse como sprite entero: no llamarlo animación de patas o rig.

Omitir y movimiento reducido llegan al mismo resultado estático confirmado; nunca vuelven a sortear ni reproducen una concesión al cambiar de idioma/pack. Las imágenes deben ser decorativas si ya existe control/etiqueta equivalente. Los errores conservan texto breve localizado y contraste estable.

## Reproducir

Usar el Python con Pillow del runtime local (`mcp__codex_app__load_workspace_dependencies` muestra la ruta disponible); `python3` del sistema no incluía Pillow en esta sesión.

```sh
tools/visual/blender.sh --background --factory-startup --python tools/visual/diagon-frog-box.py
python3 tools/visual/diagon-art-kit.py
python3 tools/visual/diagon-portraits.py
python3 tools/visual/diagon-compositions.py
python3 -m http.server 5207 --bind 127.0.0.1
node tools/visual/diagon-render-portraits.mjs
python3 tools/visual/diagon-encode-portraits.py
node tools/visual/diagon-capture-studies.mjs
```

Los comandos con Pillow deben invocarse con el ejecutable del runtime. El servidor de estudios sirve únicamente ficheros locales y no toca partidas. Las capturas usan un navegador técnico separado. `capture-check.json` registra cargas de imágenes y errores; no equivale a comprobación de persistencia, a gameplay humano o a aceptación del móvil físico.
