# Arte, iconos y producción sostenible

## Inventario medido por archivo

| Magnitud | Resultado | Interpretación correcta |
| --- | --- | --- |
| Referencias en los dos registros |361| No361 imágenes distintas ni visibles simultáneamente |
| Diagon |188 referencias /181 rutas únicas /6.371.017 B| Reutiliza recursos del otro pack mediante sourcePack cuando corresponde |
| ARCANA |173 referencias /172 rutas únicas /8.468.019 B| Suma por pack no deduplicada entre paquetes |
| Archivos únicos entre ambos registros |301| Cero referencias a archivo ausente |
| Imágenes importables por glob |430 /13.616.262 B| Indexar URL no equivale a descargar todos los bytes al arrancar |
| Importables sin referencia de registro |129 /1.536.275 B| Candidatos a trazar, no huérfanos demostrados; CSS/direct URL/PWA pueden consumirlos |
| Audio |16 WAV /1.336.064 B| Cabeceras, no memoria decodificada ni calidad percibida |

Método: [tools/inventory.py](tools/inventory.py). Resuelve sourcePack como art.ts; bytes/hash y cabeceras WebP/PNG/SVG/WAV sin renderer. No decodifica todos los píxeles, no interpreta calidad artística ni escucha sonido. [Inventario completo](assets-inventory.json), [34 identidades](CATALOG-VISUALS.md).

No existe un presupuesto global nuevo aprobado con el que declarar todos los assets «dentro de presupuesto». Cumplimiento de un límite no definido: **no evaluado**, no aprobado por su peso reducido.

## Auditoría por familias activas

| Familia / consumidores | Evaluación y decisión | Producción o comprobación necesaria |
| --- | --- | --- |
| Callejón/fondos: App, ShopHub, escenas | Conservar protagonismo y perspectiva. El fondo Diagon principal pesa445.688 B a1536×1024; no es una causa de tirón demostrada | Ver contraste local de caminos U06; no repintar fondo ni desenfocarlo globalmente |
| Retratos: formación, Pacto, colección, apertura | Familia ilustrada coherente en muestras; encuadres no siempre equivalentes entre packs | Conservar fuentes; U08 distribución antes que recorte; no aprobar las34 por haber inspeccionado unas pocas |
| Figuras y cast: arena | Conservar figura/pose donde disponible, pivotes y suelo; no deformar para llenar puesto | Ver densidad5×5, criaturas y nombres largos en contexto; nueva pose solo si carencia se demuestra |
| Actor jefe por piezas: boss-art/pixi | Base, brazo/objeto y pivotes permiten gesto cut-paper; no rig anatómico universal | Mantener alineación reposo/cast y equivalencia de packs; no ampliar a lote |
| Nodos: node.*, MapPanel | Las siluetas diferencian tipo; la ruta requiere más peso que su fondo | Trazo vector/CSS con estado y soporte oscuro; no más medallones grandes |
| Afinidades, casas y grupos | Semántica distinta pero visualmente cercana | U07 define ubicación y nivel; no crear nuevos efectos mecánicos |
| Clasificación Ejército: ClassificationChoices | Mismo libro que Todos, U12 | Una muestra editorial24/32 px; producir solo tras verificar que se distingue de Orden/casa/rareza |
| Monedas/llaves/productos: comercio/cierre | Objetos activos dan significado y prioridad | Conservar. U02 es proyección/mensaje, no necesita nueva llave o tesoro |
| Caja/rana/carta/rareza/encantado | Secuencia existente y acabado independiente del poder | Conservar atlas/capas. U09 reduce bandas de texto, no eleva rareza ni añade chispas por repetido |
| Libros/cierres/sistema | Coherencia material buena; cierres solo-imagen frágiles | U05 fallback local vector/texto. No crear otro PNG de una X |
| Marca/acceso: brand.*, account.* | Fuentes vectoriales y acciones jerarquizadas existentes | Conservar texto funcional DOM y nativos. No otro logo por cada estado de error |
| Halloween: props y recuerdo | Separado de colección principal; no ventaja económica | Conservar. Falta muestra visual nueva de cada estado, no justifica lote navideño |
| PWA | Icono ARCANA512 pesa454.987 B; fuera de la escena ordinaria | Medir transferencia/uso PWA antes de export alternativo; no presentar tamaño RGBA como RAM |
| FX / partículas | Texturas/locales ya disponibles | Limitar simultaneidad; no producir variantes sin disparador/log consumidor |

## Fuentes y procedencia

- `design/production/account-symbols-v1/manifest.json`: fuente vectorial original y consumidores de entrada. Conservar editable, no rasterizar texto.
- Pipeline A58 de ilustrados y sus manifests en `design/production/` y `docs/arcana/illustrated-assets-2026-10-15/`: generación local histórica y exports; **no ejecutado ahora**. Existencia de imagen generada no acredita licencia del universo ni acabado definitivo.
- A70/A71: fuentes/partes y pivotes documentados en `docs/arcana/boss-stage-2026-10-17/ACTOR-ASSETS.md`; diferenciar reconstrucción de zonas tapadas de simple recorte.
- A87: criaturas, emblemas y sonidos, fuentes/transformaciones bajo `docs/arcana/creatures-bonds-2026-10-18/`; conservar IDs compartidos de identidad.
- `design/audio/a84/manifest.json` y compose.py: síntesis original offline, sin muestras de bandas sonoras.16 WAV activos incluyen la extensión de criaturas/grupos; no afirmar autorización de audio de la franquicia.

La auditoría de permisos es por fuente, no por extensión del archivo. Incertidumbres históricas de distribución siguen vigentes; esta revisión privada no publica recursos.

## Briefs mínimos propuestos, aún sin producir

| ID de estudio | Reutilizar/adaptar/producir | Especificación / editable / fallback | Aceptación |
| --- | --- | --- | --- |
| A91-army-mark | Producir una muestra, solo U12 | SVG256×256, figura dentro de80% central, transparencia, sin texto ni corona de rareza; InkScape/SVG local. Estado normal/selección/foco mediante CSS, no tres archivos. FuenteSVG y manifest propios; variante ARCANA solo si semántica lo requiere. Objetivo≤8KB por SVG, nuevo presupuesto de ensayo | A24/32 px distinto de Todos/Orden; etiqueta/nombre accesibles; fallo muestra nombre/símbolo local |
| A91-route-ink | Adaptar geometría existente U06 | Caminos vectoriales en coordenadas del mapa, doble trazo2capas con ancho según escala; sin bitmap ni descarga. Estado visitado/disponible/consultado por patrón además de color. Editablecódigo/constantes locales | Seguir conexiones sobre3fondos/escala/texto sin tapar nodos, sin revelar azar |
| A91-close-fallback | Reutilizar patrón actual de fallback | ×/flechaDOM/SVG inline,44 px área objetivo; texto localizado fuera, sin peso de red. No asset de producción adicional | Arte0: acción sigue reconocible a toque/teclado y foco vuelve al origen |
| A91-folio-levels | Adaptar composición U09 | Retratos existentes, marco actual y texto DOM; sin nueva carta pintada, sin cambiar arte de colección | Muestra multirrasgo/encantado/repetido conserva fuente/rareza/estrellas y reduce competencia con rostro |

No se necesitan nuevos fondos, personajes, poses, sonidos ni un lote de partículas para estos primeros cambios. Otra producción quedaría condicionada a una muestra en contexto y aceptación verificable.

## Optimización propuesta, no eliminación

U15: cruzar los129 candidatos con imports CSS, URL literales, content packs, worker y manifests. Documentar consumidor o archivo histórico. Solo después separar el patrón de glob del archivo de producción; preservar la evidencia. Comparar build/manifest/arranque con las mismas cachés. No confundir limpieza de disco con mejora medida de fluidez.
