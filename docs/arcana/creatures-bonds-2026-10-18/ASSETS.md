# A87 · Recursos y consumidores

Implementados en la rama A87; aceptación en contexto Linux pendiente. El [manifest de producción](../../../design/creatures-a87/manifest.json) y el [índice de exports](../../../design/creatures-a87/exports-index.json) conservan rutas, dimensiones, variantes, transformaciones y procedencia.

## Familia ilustrada

Cuatro criaturas: fénix rojo y dorado, hipogrifo gris, unicornio blanco y dragón verde. Ocho masters RGBA de 1086 × 1448 seleccionados: reposo y lanzamiento por especie. Se conservan prompts y versiones rechazadas. El primer fénix y el primer ataque del unicornio cortaban la silueta; las versiones seleccionadas recuperan el encuadre.

Cada identidad entrega portrait 512 × 640, figure/cast 342 × 428 y thumbnail 96 × 120. Son 16 WebP con transparencia, 849.532 bytes en total. `export.py` usa Pillow ya disponible en el runtime local, sin añadir dependencias a la aplicación. Alinea ambas poses mediante una escala común y un punto de contacto registrado en `anchors.json`; añade margen transparente sin recortar la ilustración.

Son pinturas planas con dos poses, no piezas anatómicas ni un rig corporal. Las PNG son fuentes editables de píxeles; no se afirma disponer de capas de pintura. El estudio de color con el patio es una composición de diseño, no una captura de interfaz o evidencia de tamaño real. La muestra tiene una escala exagerada y solo acredita la exploración de paleta.

| Recurso | Consumidor real | Fallback |
|---|---|---|
| Portrait | Apertura, ficha del Cromodex e inspección | Nombre y placeholder accesibles |
| Thumbnail | Puestos de preparación, equipo compacto, candidatos de Pacto | Nombre y control semántico |
| Figure | Arena y preparación ilustrada | Figura DOM o placeholder; el resultado sigue disponible |
| Cast | Una misma Sprite de arena alterna textura durante el gesto | Figure; la pose ausente no bloquea el combate |
| Emblemas de grupo | Libro de preparación, mapa, clasificación e inspector de arena | Nombre localizado |

Las criaturas se comparten entre Diagon Alley y ARCANA mediante el sistema de assets existente. Los nombres y contextos se localizan por paquete; el texto funcional permanece fuera de las imágenes. No se sustituyen fondos o personajes anteriores. Falta comprobar material, encuadre y peso visual en las capturas reales de ambos paquetes. Una similitud en un estudio de color no sustituye esa revisión.

## Tres emblemas originales

SVG de 128 × 128: farol alado dentro de un círculo para Orden, máscara fracturada dentro de un octágono para Mortífagos y huella con contorno de hoja para Criaturas. Cambian silueta y símbolo, además del color. Fuentes vectoriales en `design/creatures-a87/emblems/`; exports activos en el pack. No son escudos oficiales copiados.

## Sonido original y voluntario

Siete WAV PCM16 mono de 24 kHz, 220–340 ms y 94.388 bytes en total. Fuente reproducible `audio/compose.py`: síntesis determinista, sin muestras de películas, voces, música ajena o servicios externos.

| Cue | Función |
|---|---|
| cast-order | Lanzamiento de un contribuyente de Orden, aire y acorde ligero |
| cast-death | Lanzamiento Mortífago, pulso hueco y breve |
| cast-creatures | Contacto con protección de criaturas confirmada; madera y aire |
| cast-phoenix | Lanzamiento del fénix, silbido vidriado |
| cast-hippogriff | Zarpazo del hipogrifo, pluma y aire |
| cast-unicorn | Lanzamiento del unicornio, campana suave |
| cast-dragon | Aliento del dragón, pulso grave contenido |

Se utiliza el ajuste de efectos A84. No hay audio al entrar, nueva música, otro control permanente o reproducción obligatoria. Una sola voz de lanzamiento; la especie prevalece sobre el grupo. La protección registrada puede sustituir el impacto ordinario, sin sumar otra capa de sonido.

Picos, RMS, DC, formato y mezcla se han comprobado numéricamente. El límite absoluto calculado para cuatro voces máximas, ambiente y ganancias actuales es 0,82948, menor que 1. Es una cota digital conservadora, no una escucha perceptiva ni una medición en altavoz físico. La decodificación nativa y el ciclo de vida en navegador están preparados para CI; no se dan por ejecutados todavía.

## Procedencia y aceptación

Ilustraciones generadas con la herramienta integrada, usando referencias del acabado ya activo. Emblemas y síntesis de audio originales del proyecto. No se descargaron arte oficial o grabaciones de películas. Se mantiene la incertidumbre T01: la producción original no acredita licencia para distribuir una franquicia.

La integración no significa acabado definitivamente aceptado. Deben revisarse siluetas, tamaño móvil, continuidad entre poses, lectura del contacto, movimiento reducido y recursos ausentes en el recorrido real. La escucha humana y el dispositivo físico quedan pendientes y se separan de las pruebas técnicas.
