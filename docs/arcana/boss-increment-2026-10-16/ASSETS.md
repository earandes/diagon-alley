# A70 · Una muestra de objeto, dos presentaciones

16 octubre 2026. **Producido por CPU e inspeccionado como composición estática; la integración Pixi y su validación Linux pertenecen al coordinador.** No se han abierto navegadores, lanzado Blender/Metal/inferencia, instalado paquetes, contratado servicios o generado un lote. Sin audio. La muestra conserva las figuras originales y no añade anatomía, habilidades o equipo económico.

## Jefe y fuentes reales

`progression-v2.json` configura `circe` como líder de Descubrimiento, acompañado por dos neutrales. La misma identidad se presenta como Hermione Granger en Diagon y Circe en ARCANA. No es el único jefe posible: Táctico/Maestría y runs anteriores conservan sus composiciones. `bossArt(packId,wizardId)` devuelve ausencia para otros líderes; el renderer debe conservar su comportamiento genérico.

- **Hermione:** figura activa `content-packs/diagon-alley/art/character-illustrated-v2/circe/figure.webp`,342×428 alpha. Maestro768×1024 y máscaras en `design/diagon-alley/illustrated-v2/{masters,masks}/`. Busto con manos fuera del encuadre, libro cerrado bajo el brazo. Fuentes A58 conservadas; no capas corporales ni pintura detrás de la mano/ropa/libro.
- **Circe:** figura activa `content-packs/arcana/art/character/circe/figure.webp`,342×512 alpha. Maestro1024×1536 y manifest en `design/arcana/production-v1/characters/circe/`. Figura completa con bastón, plantas y cuenco; maestro raster alpha sin rig/capas.

Se inspeccionaron con `view_image` ambas figuras activas y el maestro Hermione, además de recortes y registro estáticos CPU. No se infiere movimiento de esas imágenes.

## Decisión de producción

Conservar cuerpo/cara/manos originales y añadir piezas independientes del **objeto ya visible**. El libro conserva su pintura como respaldo; cubierta y página son piezas recortadas/creadas aparte. El cuenco conserva su volumen pintado; una superficie de líneas y un pequeño labio conservan registro. Es articulación/composición de objetos, **no rig anatómico**, animación de manos, nueva pose completa ni simulación 3D.

La primera composición CPU probó5°/10° de giro de cubierta. Se rechazó por doble contorno y exposición excesiva del plano original. La muestra seleccionada limita el giro a1°/2° y registra la cuña sin desplazarla fuera del libro. La implementación debe mantener una amplitud pequeña, cerrar al reposo y evitar representar un libro desplegado que la pintura no permite. En reducido o arte ausente, la figura original basta.

## Recursos entregados

Rutas runtime relativas a `src/arcana/presentation/content-packs/`.

| ID | Uso y fuente | Archivo | Tamaño/crop dentro figura | Pivote local | WebP / estimación RGBA8 |
| --- | --- | --- | --- | --- | --- |
| book-pages | Cuña de papel propia, color relacionado con las páginas visibles; visible solo en acción | `diagon-alley/art/boss-a70/book-pages.webp` |96×109; x170,y316 |(.43,.04) |3.550B /41.856B |
| book-cover | Textura frontal del libro vigente, recortada; no incluye brazo/mano | `diagon-alley/art/boss-a70/book-cover.webp` |96×109; x170,y316 |(.43,.04) |7.908B /41.856B |
| bowl-contents | Tres arcos locales propios sobre el cuenco, sin estado/poción económica | `arcana/art/boss-a70/bowl-contents.webp` |43×19; x234,y158 |(.5,.55) |724B /3.268B |
| bowl-rim | Pequeño recorte del labio de cobre existente | `arcana/art/boss-a70/bowl-rim.webp` |38×8; x237,y162 |(.5,.55) |942B /1.216B |

**Medido en archivos:** Diagon11.458B comprimidos/83.712B RGBA8 geométricos; ARCANA1.666B/4.484B; unión13.124B/88.196B. Todos WebP lossless RGBA de un fotograma. Estas sumas no son memoria GPU/proceso, descarga inicial o rendimiento medido. Cumplen los objetivos del contrato≤100kB/≤2MiB adicionales por pack antes de overhead.

Fuentes editables y PNG lossless de inspección en:

- `design/diagon-alley/boss-a70/`
- `design/arcana/boss-a70/`

Cada carpeta incluye `manifest.json` con SHA256 fuente/runtime, crop, pivote, fuente/procedencia, bytes y fallback. Los SVG de cubierta/labio contienen un **raster embebido recortado** con máscara editable; no son ilustraciones vectoriales originales. Página/superficie tienen trazados vectoriales. El script Python conserva la geometría de rasterización CPU exacta y es la fuente canónica para reproducir los PNG/WebP; no requiere un renderer SVG externo.

Las figuras originales no se sobrescriben. No se modifican `assets.json` ni el catálogo para presentar estas piezas como equipo poseído.

## Registro y consumo

`presentation/boss-art.ts` exporta `BossArt`, `BossArtLayer` y `bossArt`. Las URLs son estáticas y locales mediante `new URL`. Vite puede incorporar crops menores de4KiB como dataURL en el JS; esos bytes forman parte del módulo, aunque su decodificación/textura solo se solicita al montar este jefe. La cubierta7908B permanece como archivo independiente. No se presenta toda la metadata como descarga diferida.

- `figureSize` fija el registro original342×428 o342×512.
- `rect` es x,y,ancho,alto **normalizado dentro de esa figura**, no dentro de una peana o contenedor arbitrario.
- `pivot` es normalizado dentro del crop; anclar un Sprite con ese pivote exige añadir su posición a la esquina del rect.
- `origin` identifica el punto de lanzamiento visual: Hermione(211/342,321/428), Circe(255/342,160/512). No selecciona objetivo ni modifica el BattleLog.
- Las capas se dibujan en el orden páginas→cubierta o superficie→labio. El fondo/cuerpo original permanece intacto.

El renderer debe aplicar la misma transformación de figura a sus objetos; un cambio de escala/encuadre del cuerpo sin trasladar el registro produciría flotación. Las capas no deben alterar nombres, PV, artículos DOM o foco.

## Reproducción CPU y comprobación de muestra

Entorno ya existente: Python3.13/Pillow12.3.0 en `.tools/diagon-illustration/venv`. Sin nuevas dependencias ni configuración global.

```sh
.tools/diagon-illustration/venv/bin/python tools/visual/export-boss-a70.py
```

El script accede únicamente a fuentes locales y a sus carpetas de salida. No inicia el juego, GPU, navegador, red, autoridad o sesión de usuario. Los PNG de fuentes y la rasterización se guardan fuera de runtime; este solo sirve los cuatro WebP.

Se inspeccionaron las dos `selected-composites.png`: reposo, anticipación y salida seleccionados, figura completa sobre superficie oscura. Son composiciones CPU a tamaño fuente, **no capturas de la aplicación ni prueba del reloj o de continuidad animada**. La cubierta mantiene libro/papel; Circe mantiene el objeto en su mano. La superficie del cuenco es deliberadamente pequeña; su lectura al tamaño de arena necesita la muestra integrada antes de declararla suficiente.

## Procedencia y permisos

- Pintura Hermione: maestros A58, pipeline MFLUX/FLUX local histórico con prompts/seeds/crops/manifests conservados; esta producción no vuelve a inferir.
- Pintura Circe: maestro y manifest de producción ARCANA-v1, cuyo origen histórico es generación registrada; esta producción no consume créditos.
- Página y líneas de superficie: trazados propios del incremento; script y SVG editables en el proyecto.
- Pillow utiliza la licencia de su distribución existente; no se instaló otra versión. Las licencias de software/modelo no conceden derechos Harry Potter. No se declara permiso nuevo de distribución o acabado definitivo aprobado por Enric.

## Fallback y aceptación posterior

Una pieza fallida deja la figura original, actor/objetivo, PV, nombres, acciones y registro. El lanzamiento genérico debe seguir disponible; no esperar indefinidamente una imagen o introducir una operación. Reducido presenta objeto estático sin página/superficie diferida. Omitir conserva el resultado guardado.

Para aprobar la muestra en contexto: reposo sin doble contorno; cubierta/página sin huecos ni brazo recortado; origen del hechizo coincide con el objeto; todos los actores y PV legibles; pause/2x/hidden/skip y cambio de pack conservan fase; desmontaje libera recursos propios. Comprobar ambas presentaciones y tres tamaños en Linux bajo protección del repositorio. Esta tarea delegada no declara esas pruebas ejecutadas ni aceptación estética/humana/física.

Comprobación CPU ejecutada: cuatro crops RGBA, un fotograma, alpha transparente, dimensiones y hashes coincidentes con el manifest; límites de peso cumplidos. Una segunda ejecución del exportador produjo exactamente los mismos SHA256 runtime. `prettier` formateó únicamente `boss-art.ts`. No se ejecutaron build/tipos/suites desde este agente; el coordinador los ejecuta sobre la integración conjunta.
