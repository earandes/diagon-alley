# A71 · Muestra de actor pintado

17 octubre 2026. Producción CPU local; no inferencia, GPU, Blender, navegador, cuenta de juego, servicio de pago ni instalación. La muestra se inspeccionó en composiciones estáticas y coordinación aceptó integrarla para comprobarla en contexto. No constituye aceptación artística humana ni prueba de movimiento.

## Técnica y selección

La pintura vigente se conserva como fuente. Una máscara manual separa un brazo visible con su libro/cuenco. La base restaura únicamente ropa inmediatamente oculta con clonación de textura local. Hay un pivote de articulación 2D de recorte, no esqueleto corporal, anatomía nueva, pintura completa por capas ni manos inventadas. Las caras y el resto del cuerpo permanecen planos.

Se descartó la primera máscara Circe porque cortaba demasiado alto y dejaba una solapa en el hombro al girar. Se restringió al antebrazo/cuenco. Se descartó el primer encuadre ARCANA por mantener el peso facial pequeño: el crop final sacrifica parte alta del bastón y faldón para priorizar cara y cuenco. Se añadió corte de cintura fijo para que el extremo de busto Hermione no gire creando un triángulo. Todo ello queda editable en el script, sin deformación de proporciones.

Fuentes anteriores intactas:

- Diagon: `content-packs/diagon-alley/art/character-illustrated-v2/circe/figure.webp`,342×428, fuente A58.
- ARCANA: `content-packs/arcana/art/character/circe/figure.webp`,342×512, fuente ARCANA production-v1.

Las transformaciones exactas, máscaras, SHA256, procedencia y tamaños están en `design/{diagon-alley,arcana}/boss-a71/manifest.json`. La licencia de herramientas no concede nuevos derechos sobre Harry Potter. No se declara permiso de distribución nuevo.

## Entrega y consumidores

Cada paquete tiene tres WebP RGBA estáticos384×512 en `content-packs/{pack}/art/boss-a71/`:

| Recurso | Función | Consumidor | Fallback |
|---|---|---|---|
| `actor-rest.webp` | Compuesto pintado de reposo | rol `boss.circe.figure`, antesala, cierre y DOM arena | `Artwork.fallbackAsset` → figura de personaje anterior; nombre/acciones siguen fuera del arte |
| `actor-base.webp` | Torso/base con reparación local de ropa | Pixi, solo líder `circe` y cuando ambas capas se cargan | mantiene compuesto estático |
| `actor-arm.webp` | Brazo y objeto recortados con registro común | Sprite hijo del actor Pixi | mantiene compuesto estático y proyectil genérico |

Todos tienen alpha, un fotograma y el mismo frame; no se estiran. El rol nuevo es exclusivamente de presentación de jefe: no sustituye personajes de colección ni crea identidad de equipo económico. Otros líderes conservan su representación anterior.

Fuentes editables CPU: `tools/visual/export-boss-a71.py`, cuatro PNG de composición/capas por paquete, `arm-mask.png`, `clothing-repair-mask.png` y manifiesto. `actor-cast.png` es estudio estático fuera de runtime; no se sirve una secuencia ni se recalcula combate.

| Paquete | Crop / escala / offset dentro384×512 | Pivote de brazo (px) | Origen visual (px) | Runtime comprimido medido |
|---|---|---|---|---|
| Diagon | `[0,0,342,428]` /0,98 /`[24,48]` |289,58;293 |235,68;378,26 |108.244B |
| ARCANA | `[80,65,290,279]` /1,8 /`[3,60]` |244,2;301,2 |318;227,4 |161.040B |

Runtime WebP quality95/method6, alpha idéntico; fuentes PNG lossless. Frente al primer export lossless633.158B conjuntos, entrega269.284B (−57,5%). Inspeccionadas ambas `compression-comparison.png` CPU lado a lado a tamaño fuente: no se aprecia degradación material de rostro/objeto a esa escala; no equivale a un estudio perceptual. Las dimensiones/registro permanecen idénticos y cada paquete queda bajo200kB comprimidos. La compresión no reduce la estimación RGBA de las texturas decodificadas.

Estimación geométrica RGBA8: base+brazo1.572.864B por paquete; si Pixi conserva también el compuesto estático son2.359.296B para los tres, antes de overhead. No se presentan como memoria GPU/proceso medida. El DOM puede mantener imagen decodificada adicional; medir arranque/recursos sobre integración Linux corresponde a coordinación. El canvas no añade filtros ni texturas de partículas.

## Reproducibilidad y comprobaciones ejecutadas

```sh
.tools/diagon-illustration/venv/bin/python tools/visual/export-boss-a71.py
npx --no-install vitest run tests/domain/arcana/boss-actor-a71.test.ts tests/domain/arcana/boss-motion-a70.test.ts tests/domain/arcana/boss-prelude-a70.test.ts
npx --no-install tsc --noEmit
```

Exportación final repetida: seis SHA256 runtime idénticos. Pillow comprueba384×512/RGBA/un fotograma/alpha transparente y hashes coincidentes con manifiesto. Pruebas12/12 correctas en tres archivos; TypeScript correcto al ejecutar tras integración del actor. No se abrió un navegador ni se ejecutó ninguna batería gráfica desde este agente. Build, matriz visual, fallos simulados, renderer y persistencia integrada pertenecen a la validación coordinada, no se declaran aprobados aquí.

## Muestra integrada y revisión acotada

CI38988996115,445d6f4/mergeffb9094: batería del jefe correcta, con fases/pausa/swap/reducido/fallo de pieza y desmontaje. Coordinación inspeccionó seis PNG Linux seleccionados, incluidos los dos lanzamientos≥0,14rad a escala3×3: objeto/rostro separados y sin duplicación o costura obvia en esas poses. El perfil5×5 pasa geometría de figuras/nombres/PV y número de actores; no se finge una captura5×5. [Galería y límites](GALLERY.md). Los PNG `selected-composites.png` siguen siendo composiciones CPU, no evidencia del juego o temporización. La fluidez percibida, personalidad y lectura humana del gesto no quedan aprobadas por tests o imágenes.
