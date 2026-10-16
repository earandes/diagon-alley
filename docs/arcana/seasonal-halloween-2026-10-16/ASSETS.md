# A68 · Recursos y muestra de composición

Dirección conservada: Teatro de alquimia. Se reutilizan fachadas, interiores, retratos y objetos de los dos paquetes. No hay producción de personajes, fondos, lote de Navidad, generación pagada o imágenes generadas durante las interacciones.

## Inventario activo

| ID | Función / consumidor | Fuente activa y editable | Procedencia y estado | Especificación / aceptación |
| --- | --- | --- | --- | --- |
| seasonal.pumpkin-lantern | Invitación en cabecera y recuerdo permanente en `SeasonalEvent.tsx` | `src/arcana/presentation/art/seasonal-a68/pumpkin-lantern.svg` | SVG propio escrito localmente, versión1; curvas/vector real, no raster ni rig. Original del proyecto, sin recurso remoto; reutilizable bajo los términos del repositorio, sin afirmar permisos de franquicia. | 160×192, proporción5:6, transparencia, centrado, margen de silueta, pivote conceptual(0.5,0.9). Sin texto. Gradientes estáticos y contraluz ámbar; marco/marca de selección y cantidades son DOM. Debe leerse a40–44px y a96px. No definitivo por estar integrado; aceptación estética humana pendiente. |
| seasonal.window.{sweetshop,workshop,vault} | Tres objetivos en `SeasonalWindowGallery` | `shopfront.confectionery`, `shopfront.workshop`, `shopfront.vault` de cada paquete; ARCANA utiliza sus `scene.*` al no tener fachadas propias | Reutilización de arte vigente, sin nuevos derivados persistidos ni licencias inventadas. Registro original A49/A59 y manifests de paquetes conservados. | Ventana DOM4:3, `object-fit:cover`, encuadre50%/60%; no deforma ilustración. Estados embrujado/actual/iluminado mediante cristal, borde, símbolo◇/✦ y texto fuera de imagen. Ambos paquetes verifican URL real en SSR. |
| seasonal.prepare | Elección de intercambio | `node.refuge` del paquete activo | Objeto vigente, sin nueva variante | Se reutiliza dentro de peana semántica; cantidad y consecuencia no están pintadas en el icono. |
| seasonal.members | Comparación PV/PM | `character.{id}.thumbnail` del paquete activo | Retratos vigentes | Encuadre2rem×2.6rem, nombre y valores DOM. Las cifras vienen del preview compartido del dominio. |

El mismo único emblema se usa para descubrimiento y recuerdo: no hubo segundo lote después de la muestra. Si falla el SVG, aparece un símbolo neutro; nombre, acción y progreso siguen en DOM. Si una fachada/interior falla, la ventana CSS y su nombre/estado permanecen. No se presenta ese fallo como arte final ni se altera el progreso.

## Muestra antes de ampliar producción

`CONTEXT-STUDY.png` combina la ilustración activa del Callejón, las tres fachadas actuales y la fuente SVG del primer emblema. Se inspeccionó localmente el16octubre2026. La invitación ocupa la cabecera y las ventanas/elecciones forman el foco del diálogo; el mapa no recibe un objeto flotante que tape nodos.

Es un **estudio de composición offline, no una captura de navegador, ni un render de React/CSS, ni evidencia responsive o de interacción**. El pequeño rasterizador de Pillow representa gradientes del SVG con colores medios; no sustituye el SVG activo. Textos del estudio explican la composición; los textos funcionales de la aplicación permanecen en DOM y se localizan.

Reproducción sin navegador ni captura del sistema:

```sh
/Users/enricarandes/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 docs/arcana/seasonal-halloween-2026-10-16/render-context-study.py
```

Fuente del estudio: `render-context-study.py`, Pillow12.3.0 del runtime instalado. Sin dependencias añadidas, GPU, WindowServer, servicio externo o coste adicional. La inspección de este PNG no acredita aspecto exacto del navegador, móvil físico, foco o rendimiento. Las comprobaciones ejecutadas del recorrido se registran en QA.

## Variantes y sustitución

La familia inicial usa un solo SVG neutro para ambos paquetes e idiomas. Las diferencias de estado son capas DOM/CSS, no nuevas identidades o recompensas. Puede retocarse el acabado del emblema sin modificar evento/edición/recuerdo. Una futura edición conserva la identidad recurrente pero tiene IDs y progreso propios. Navidad necesitará presentación/arte y texto propios; no se ha generado su lote.
