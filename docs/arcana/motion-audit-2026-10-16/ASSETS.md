# A69 · Recursos para movimiento: auditoría y producción propuesta

16 octubre 2026. **Solo auditoría**: se han leído AGENTS, PRD y DECISIONS completos, las skills locales `local-magic-art` y `arcana-game-feel`, manifests, consumidores y evidencia histórica. Ningún navegador, render, captura nueva, instalación, generación, lote, commit o push. Las recomendaciones de las skills sobre audio, shake o 5–8 canales no sustituyen los límites actuales: elegir pocos canales locales, finitos y semánticos; audio solo mediante activación explícita.

## Qué está disponible realmente

La selección vigente se obtiene de `presentation/content-packs/{diagon-alley,arcana}/assets.json`, `active.ts` y `art.ts`: cada rol resuelve `sourcePack` si existe. `Artwork.tsx` sirve la URL con tamaño/alt y retorna ausencia si falla; los controles y datos funcionales pertenecen al DOM. Los manifests históricos acreditan procedencia, pero no sustituyen este mapping para decidir qué está activo.

Inventario calculado por lectura de JSON y `stat` en esta auditoría:

| Paquete | Roles declarados | Roles compartidos explícitos | Archivos únicos resueltos | Bytes de esos archivos |
| --- | ---: | ---: | ---: | ---: |
| Diagon Alley | 165 | 33 | 158 | 5.462.634 |
| ARCANA | 150 | 0 | 149 | 7.532.594 |
| Unión de ambos | — | — | 274 | 11.087.119 |

No son bytes iniciales de navegación, memoria GPU ni recursos visibles simultáneamente. Algunos roles apuntan al mismo archivo; las URLs importadas no implican descarga de todos sus bitmaps. El SVG estacional importado directamente, de1.864bytes, queda fuera de esta suma de manifests. Tampoco incluye CSS/JS, fuentes o maestros. A58 documentó162roles/39compartidos en aquel momento; no se copian esas cifras como inventario actual.

Se inspeccionaron visualmente dos archivos activos precisos: `character-illustrated-v2/apprentice/figure.webp` y `frog/chocolate-frog.webp`; y la captura de arena existente A63 `evidence/after/arena-profiles/chromium-390.png`. La primera es un **busto** recortado, la rana es una única pose pictórica y la arena histórica los presenta como figuras/peanas. No se infiere de esa captura que el código A68 actual se haya recorrido visualmente. No se usaron contact sheets como prueba de interfaz.

## Inventario de reutilización y límites de articulación

Rutas de archivo relativas a `src/arcana/presentation/content-packs/` salvo otra indicación. Dimensiones/pivotes del mapping; pesos de archivos actuales. Las muestras raster comprobadas con Pillow tienen **un fotograma**, no animación WebP.

| ID / consumidores | Archivos activos y datos | Fuente editable disponible / límite | Decisión |
| --- | --- | --- | --- |
| A69-A01 · figuras de arena; `BattlePanel` y `scenes/pixi-scenes.ts` | Diagon: `diagon-alley/art/character-illustrated-v2/<id>/figure.webp`,342×428, alpha, pivote(0,5;0,95),30exports,864.014B. ARCANA: `arcana/art/character/<id>/figure.webp`, aprendiz342×512, pivote(0,5;0,9),30exports1.046.662B. | Diagon conserva maestro768×1024, PNGalpha/cutout y crop por identidad en `design/diagon-alley/illustrated-v2/`; ARCANA conserva maestros raster y manifests en `design/arcana/production-v1/characters/`. Sin brazos/cabezas/capas de pintura ni rig. En Diagon el busto termina en torso: no permite inventar pies, caminar o lanzar con una mano articulada. | **Reutilizar** con cambio pequeño de pose global/posición y efecto que nace de un anclaje visual explícito. No producir30personajes nuevos para M01. |
| A69-A02 · retratos, miniaturas; Pacto/preparación/colección/encuentros | Diagon: portrait512×640 opaco,30archivos1.441.388B; thumbnail96×120 alpha,30archivos156.522B. Pivote(0,5;0,95). Ejemplo Harry81.394/5.834B. ARCANA: retratos2.842.192B y miniaturas204.478B; pivote(0,5;0,9). | Mismo maestro y encuadres conservados; miniatura facial no es una figura de cuerpo. Separar imagen y máscara/marco DOM para mover retrato→puesto. No estirar4:5 hasta una peana cuadrada. | **Reutilizar**. Capturar geometría del mismo control, conservar nombre/procedencia y foco. Un traslado semántico no requiere textura nueva. |
| A69-A03 · caja de rana; `CardReveal` | Diagon `art/frog/{model-closed,base,lid,seal}.webp`, cada uno768² alpha:33.366/21.918/26.906/3.522B; cerrado/base/sello pivote(0,5;0,72), tapa(0,5;0,49). `interior.webp`10.456B existe, pero `CardReveal` actual no lo consume por separado. ARCANA: cuatro piezas640²,95.740/68.074/69.936/112.296B; pivote(0,5;0,9). | Diagon **sí** tiene geometría separada editable: `design/diagon-alley/sources/frog-box/pentagonal-frog-box.blend`871.305B y `tools/visual/diagon-frog-box.py`; PNG de cada pieza y cámara ortográfica. No hay bisagra animada exportada al juego: GSAP transforma bitmaps. ARCANA base/interior son un raster, sin modelo/capas equivalentes. | **Adaptar coreografía primero**. No afirmar rotación de tapa físicamente correcta por tener un blend. En DOM `.opening-piece` hereda `transform-origin:50%35%`, distinto de pivotes de manifest: comprobar composición antes de cambiar anclajes. |
| A69-A04 · rana; `CardReveal` | Diagon `art/frog/chocolate-frog.webp`1024×683 alpha,109.080B, pivote(0,5;0,85). ARCANA `art/toad/subject.webp`640²,80.948B, pivote(0,5;0,9). | Fuentes PNG y recorte disponibles; ambos sujetos son planos. GSAP aplica salto/escala/giro del conjunto. No hay poses de salto o patas independientes de acabado vigente. | **Reutilizar** salto corto y sombra de contacto; si se exige flexión anatómica, **producir después una muestra**, no recortar patas automáticamente ni presentar escalado como rig. |
| A69-A05 · carta/rareza; `CardReveal`, `RevealTheatre`, `Celebration` | Diagon `art/card/{back,frame}.svg`512×640 alpha,3.337/2.177B,pivote(0,5;0,5); ARCANA WebP109.372/53.282B. Cuatro emblemas de rareza separados. Grabado SVG600×520 generado por `RevealTheatre.tsx`. | SVG/código realmente editables; marco y dorso separados del retrato. El giroY es transformación plana, no papel con reverso tridimensional. Rareza y nuevo/repetido vienen del receipt, no del efecto. | **Reutilizar** y graduar intensidad/cierre sin sustituir retratos, añadir rarezas o introducir otra capa de partículas sobre las existentes. |
| A69-A06 · fondos/mapa/fachadas; `MapPanel`, comercio, `SeasonalWindowGallery` | Diagon callejón1536×1024 RGB445.688B; dulcería1280×854144.968B; tres fachadas430×574 suman132.282B. Arena/workshop/vault se comparten desde ARCANA; arena1280×854 alpha227.860B. | Fondos PNG originales/procedencia y exports disponibles, **sin capas de profundidad**. Las tres fachadas son raster separados; ARCANA reutiliza interiores por falta de fachada equivalente. | **Conservar**. No proponer paralaje de edificios independientes ni cámara espacial a partir de una sola pintura. Para M03 basta trayectoria/vector sobre escena fija. |
| A69-A07 · nodos/amenazas; mapa/`TacticalBadge` | Seis DiagonSVG256² alpha,pivote central,3.241–3.557B; seis ARCANA866–1.107B. `presentation/art/tactical-a65/threat-{fire,vanguard}.svg`64²,fuente directa con manifest. | SVG, `design/diagon-alley/annotations-a59/create-node-art.py`, fuentes/licencias ARCANA conservadas. Capas de estado son DOM/CSS, no fotogramas dibujados. | **Reutilizar** como siluetas estables. Animar una ruta nueva una vez y cerrar; no añadir pulsación permanente a todos los iconos. |
| A69-A08 · equipo, grageas, llave/cofre; comercio/preparación/resultados | Objetos compartidos ARCANA640² alpha,pivote(0,5;0,9). Llave65.990B; cofre100.992B; cuatro sabores44.200–67.558B; varitas28.448–32.994B. Tarro Diagon512²61.450B frenteARCANA640²90.510B. | Maestros planos individuales, nueve recetas compuestas por madera/núcleo; no mecanismo de cerradura, tapa de cofre o forja por capas. | **Reutilizar** desplazamiento/encaje/reacción de peana. Un cofre realmente abriéndose requiere tapa/interior nuevos; M06 puede comunicar confirmación sin fingirlos. |
| A69-A09 · UI/sellos/libros | `ui.seal`, `ui.owned`, `ui.temporary`, `ui.pass`, `ui.health`, mapa/álbum/ajustes y estados DOM; SVG512² o256² segúnrol. | Fuentes `tools/visual/diagon-art-kit.py`, SVG directos y ARCANA PhosphorMIT; texto funcional externo. | **Reutilizar** para M04/M07–M09. Estados error/pendiente/confirmado se diferencian por símbolo, material y etiqueta, además del movimiento. |
| A69-A10 · Halloween; `SeasonalEvent` | `presentation/art/seasonal-a68/pumpkin-lantern.svg`160×192 alpha,1.864B,pivote conceptual(0,5;0,9). Ventanas reutilizan A06. | Vector propio editable y registro A68. Un solo emblema; ningún rig o lote de Navidad. | **Conservar**. Animación de concesión450ms solo para grant nuevo observado; historial estático. No nueva textura o canvas para M10. |
| A69-A11 · ambiente; `SceneAtmosphere` | Dos halos, una niebla y seis motas CSS; sin archivos raster dedicados. `prop.lantern`DiagonSVG512²1.613B existe, pero no es el origen de los halos actuales. | `game-experience.css` y `SceneAtmosphere.tsx`. Se pausa con documento oculto y modal abierto; reducido lo elimina. | **Adaptar prioridad**, no multiplicar capas. La pausa ante replay/celebración puede estudiarse antes de producir animación ambiental nueva. |

## Recursos por las diez propuestas

| Propuesta auditada | Recursos existentes que bastan para la primera muestra | Cambio de producción imprescindible / dependencia |
| --- | --- | --- |
| M01 · actor→lanzamiento→impacto y reloj de replay | A01figuras, A06arena; primitivas de proyectil/impacto del renderer actual | Ninguno para inclinación global, foco actor/objetivo e impacto localizado. Una varita/mano articulada exige nueva fuente y anclajes por figura; fuera del primer incremento. |
| M02 · caja/sello/rana/carta/rareza, nuevo/repetido | A03–A05, FrogMagicCanvas2D existente | Ninguno para mejorar continuidad/material/easing. Antes de producir, acordar si se requiere salto anatómico. No renderizar secuencia de cada personaje. |
| M03 · trazo de ruta finito | A06fondo, A07nodos y grafo/IDs existentes | Ninguno. Coordenadas medidas del mapa; no vídeo del fondo ni sprites de caminos por cada rama. |
| M04 · retrato de Pacto→puesto | A02miniatura/portrait, A09temporal/sello | Ninguno. Necesita geometría origen/destino y confirmación guardada; no clon interactivo ni incorporación anticipada. |
| M05 · Refugio/encuentroPVPM | A02retratos, A07refugio, A09salud/esencia | Ninguno. Valores compartidos antes/después; PM debe seguir rotulado porque esencia reutiliza icono de energía. |
| M06 · cofre/forja/bóveda | A08objetos, A09sello y fondo vigente | Ninguno para gesto de giro/encaje/luz postreceipt. Si se elige apertura visible del cofre, requiere tapa/interior/sombra nuevos y muestra de una sola pieza primero. |
| M07 · sockets de varita/escoba/gragea y sinergia | A08objetos, A02portadores, A09sellos | Ninguno. Dibujar guía/sombra CSS y conservar comparación/estado a demanda. No fabricar un inventario visual distinto. |
| M08 · descubrimiento/álbum/página/filtro | A02retratos, A05marco/rareza, A09álbum | Ninguno. Marcapágina vector/DOM sencillo solo si el existente no identifica nueva identidad; no libro3D o hoja con texto rasterizado. |
| M09 · navegación/diálogo/operación incierta | A09controles/materiales actuales, fondos A06 | Ninguno. Separar foco/estado operativo de transición. Las piezas decorativas no deben tapar error o recuperación. |
| M10 · cierre/recuerdo nuevo/historia/prioridad de ambiente | A08botín, A10linterna, A11ambiente | Ninguno. Una política de exclusión de efectos evita sumar celebraciones; conservar identificación de grant nuevo. |

La primera implementación puede hacerse **sin lote artístico nuevo**. Esto no declara que todos sus acabados sean definitivos: permite probar si la comunicación mejora con el arte vigente antes de aumentar coste y variantes.

## Qué no debe confundirse con un recurso terminado

- `design/production/reveal-v1/reveal-m2.blend` y su manifest tienen48frames a12FPS,960×600; geometría de cuerpo/patas con pivotes y tapa articulada, **sin armature**, acabado provisional. Su vídeo480×300/78.984B es animatic histórico, no una rana de juego lista para integrar.
- `design/production/m2-v1/callejon-m2.blend`10.870.976B contiene72frames/12FPS,lechuza/paseante geométricos y cámara real; no coincide con los fondos ilustrados vigentes y no justifica sustituirlos por3D o importar su vídeo.
- Las máscaras alfa conservadas de A58 separan sujeto/fondo; no revelan cara posterior, manos ocultas o pintura detrás de un brazo. Segmentar una imagen no crea las piezas que faltan.
- Un pivote de manifest no asegura que todo consumidor lo use. Pixi usa `asset.pivot`; `Artwork` es un `<img>` y la coreografía DOM necesita su propio origen consistente.

## Pipeline gratuito y aceptación de una eventual muestra

Para las diez propuestas: editar coreografía/CSS/SVG compartidos y reutilizar WebP. Ninguna inferencia en runtime, nuevo motor, servicio, Motion+ o instalación global.

Si una muestra posterior demuestra imprescindible un recurso nuevo, conservar fuente/versión/procedencia/licencia/dimensiones/pivotes y consumidor antes de ampliar:

1. **Articulación de rana opcional**: una fuente local editable con cuerpo y patas articulados, sombra separada y3poses legibles; conservar la rana existente como referencia de acabado. Propuesta de export de ensayo:8poses256×192RGBA en atlas1024×384, más pose estática, no vídeo de pantalla completa. Objetivo≤150kB WebP y1,57MBRGBA; no medidos ni garantizados. Anatomía/acabado requieren inspección de inicio/compresión/despegue/aterrizaje. No multiplicar por30cartas.
2. **Tapa de cofre opcional**: base/tapa/interior/sombra sobre lienzo común512²alpha, pivote de bisagra documentado en píxeles y normalizado. Fuente `.blend` o vector con capas reales, preview estático primero. Objetivo≤120kBsumados y4MBRGBA para cuatro piezas; comparar con gesto sobre objeto actual antes de autorizar lote.

Estas dos muestras quedan **propuestas, no producidas ni necesarias para ejecutar los primeros cambios**. Blender4.5.9portable se usaría únicamente mediante `tools/visual/blender.sh`, con parámetros aislados. Tras el incidente, leer una skill no autoriza reanudar render/inferenciaMetal en este Mac. La producciónGPU requiere planificación de recursos compatible y sesión autorizada; ahora no se ejecuta.

El pipelineA58 ya documenta MFLUX0.22/MLX y FLUX.2Klein4Blocal, prompts/seeds/PNG/máscaras y exportaciónCPU. Se conserva como procedencia histórica, no como orden de generar ni garantía de reproducibilidad de una instalación no comprobada hoy. Registros MIT/Apache2.0 del software/modelo y MIT dePhosphor no conceden derechos de distribución de la franquicia. SVG propios conservan procedencia del proyecto; arte raster histórico mantiene sus manifests originales. No se ha verificado una licencia comercial nueva ni se afirma permiso de publicación.

Si falta arte: conservar PV/PM, actor/objetivo, nombres, recompensa, estados, acciones y registro accesibles. Sombra/borde/silueta neutra pueden sostener el gesto. Omitir/reducido muestran el mismo resultado guardado sin generar una variante económica. Texto funcional, costes y errores nunca dentro de un atlas.

## Rendimiento: medido histórico frente a presupuesto propuesto

**Hechos de archivos comprobados hoy**: figuraDiagon342×428 supone585.504bytes si se convierte aRGBA8; diez5.855.040B. FiguraARCANA342×512 supone700.416B por unidad. Son estimaciones geométricas, no memoria total deGPU/proceso. Una pieza768²supone2.359.296BRGBAaunque el sello comprimido solo pese3.522B. Reducir bytes de red no elimina coste de textura/capa.

**Mediciones anteriores, no repetidas en A69**:

- A58: retirar arranquePixi/GlowFilter de decoración y componer dos sprites28²Canvas2D redujo el máximoChromium comparable216,7–233,2ms→16,8ms; WebKit41–44→31–35ms. La familia pictórica final registróWebKit35–37ms. Conservar ambas condiciones y sus ventanas, sin mezclarlas. `FrogMagic` actual mantiene24trayectorias/3200ms/DPRmáximo1,5 y detiene rAF al terminar/ocultar/desmontar.
- A60/A63 conservan el pipeline; A63 apertura completa resultado4389–4455ms,ventana5594–6059ms,Chromium60FPS/máximo16,8ms; WebKitmáximo33–38ms. No son duración humana ni garantía de móvil.
- ArenaA63 sigue mostrando arranque fríoChromium~183,4ms y tareas largas165–185ms. Una captura bonita o más piezas no resuelve esa inicialización. A67Linux midió acciones utilizables<190ms en una pareja de ejecuciones; no midió arranque inicial y síframesmáximos50ms.
- A68 amplió un smoke hasta alcanzar el límite propio1,5GBRSS y fue detenido. La validación pendienteLinux no se convierte en evidencia de rendimiento por tener unSVGpequeño.

**Objetivos para un incremento posterior, pendientes de medición**:

| Presupuesto propuesto | Cómo comprobar después, sin falsear resultados |
| --- | --- |
| Sin nuevos bitmaps para M01–M10 inicialmente; ningún canvas/contextoWebGL decorativo adicional | Diff de recursos, red/contextos observados enLinux desde entrada a recorrido. |
| Como máximo un efecto protagonista nuevo simultáneo; ambiente pausado bajo diálogo/replay/celebración | Contar capas/tickers activos y comprobar pausa/oculto/desmontaje. No ocultar actores para ajustarse. |
| Efectos reutilizan primitivas y sprites pequeños; no blur/filtro a pantalla completa por defecto | Perfil de frames y áreas compuestas; no inferir coste a partir de queCSS use`transform`. |
| P95frame≤20ms y ningún frame>50ms durante acciones comparables como meta inicial | Instrumentar desdepointerdown, incluyendo red/carga/primer dibujo. Reportar arranque frío por separado y dentro de la ventana completa; no desplazar espera al mapa. El resultado puede incumplir y deberá declararse. |
| Nuevos recursos opcionales≤250kBpor muestra completa, carga diferida al consumidor, fuente nunca enruntime | Comparar bytes servidos/descomprimidos; no confundir todo elbuilddual con carga inicial3–5MB delPRD. |

Los umbrales del watchdog son **protecciones del anfitrión**, no presupuesto de producto ni garantía deApple. No se aumentan para lograr una medición. `HOST-INCIDENT.md` registra27.714regionesIOSurface/18,5GBvirtuales, no18,5GBRAMresidente. Matrices, WebKit, perfiles y capturas extensas soloLinux, unrunner/bloqueo, sinreintentos/video/trazaspor defecto. En esta auditoría no se ejecuta ni siquiera elsmokelocal. La evidencia física/humana y la matrizLinuxA68 siguen siendo dependencias separadas.

Fuentes de contraste: [A58](../illustrated-assets-2026-10-15/REPORT.md), [sonda completaA58](../frog-opening-performance-2026-10-15/TESTING.md), [A60](../pokelike-2026-10-15/REPORT.md), [A63](../gameplay-increment-2026-10-16/PERFORMANCE.md), [A67Linux](../progression-increment-2026-10-16/PERFORMANCE.md), [protecciónMac](../progression-increment-2026-10-16/HOST-INCIDENT.md), [A68](../seasonal-halloween-2026-10-16/REPORT.md).


Inventario exhaustivo de roles resueltos: [JSON de ambos packs](evidence/resolved-asset-roles.json). Incluye ID, consumidor de presentación por pack, ruta activa, dimensiones, transparencia, pivote, peso y alt ES/EN. El mapping activo no demuestra que todos esos archivos se descarguen o dibujen en una pantalla. Las familias, fuentes editables y carencias de producción se describen arriba.
