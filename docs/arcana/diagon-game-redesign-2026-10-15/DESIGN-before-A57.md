# ARCANA · Teatro de alquimia

Dirección vigente A50, refinamientos A52–A56, actualizado15 octubre2026. Implementación React/DOM + PixiJS8 + GSAP; Motion mini libre para feedback de receipts. [Contrato y aceptación](docs/arcana/game-feel-2026-10-14/CONTRACT.md). No publicación.

El juego debe sentirse como un teatro botánico de bolsillo: verde profundo, pergamino, oro envejecido, madera cálida y personajes ilustrados. Conservar las escenas/retratos A50; usar objetos ilustrados para decidir y texto DOM breve como apoyo. El objetivo inmediato precede al detalle del equipo. No añadir sistemas o cambiar economía para hacer más vistoso un recorrido.

| Elemento | Regla aplicada |
|---|---|
| Paleta | Fuente `content-packs/arcana/pack.json` v5: fondo #0d211f, superficie #17322d, tinta #f3e7cb, oro #d8b86f, foco #8be2d0. Cuatro acentos de rareza existentes, sin significado exclusivo de color |
| Tipografía | Georgia/serif para mundo y títulos, system-ui para acciones/datos. Fuentes locales existentes, sin descargas. Titulares equilibrados, cifras tabulares, rem y altura flexible |
| Material | Fondos ilustrados atenuados; superficies verdes estables para texto. Marcos finos; objetos pulsables con coste numérico y confirmación explícita |
| Composición | Mapa100dvh sin scroll; resto1100px máximo.320px admitido; contenedores/grid y safe-area inferior |
| Equipo | Retrato derivado del maestro A50, nombre breve, emblema propio/temporal, PV/PM, equipo en disclosure. Sin duplicar el texto de objetos fuera y dentro del disclosure |
| Mapa | Guía contextual según run y nodos disponibles; fases recorridas cuentan filas de ruta, no todas las ramas. Contorno + estados accesibles; detalle de efecto en ayuda accesible. Pixi y DOM comparten IDs/posiciones |
| Cromodex | Descubrimientos y copias son cuentas distintas; ayuda explica utilidad actual sin prometer trueque. Estado «En tu equipo» y «Bloqueado», marco discontinuo para pendiente. Snapshot por copia intacto |
| Rareza | Cuatro emblemas SVG 32×32, stroke1.75, mismo pivote/aire: círculo, rombo, estrella de cuatro puntas, corona. Siempre acompañados de nombre y estrellas guardadas. No crean un quinto rango ni cambian potencia |
| Taller/bóveda | Objeto principal con precio/llave. La inspección conserva las confirmaciones existentes; forja/entrega sigue postreceipt con GSAP |

## Movimiento y feedback

Una acción tiene respuesta inmediata de control y, si escribe, confirmación solo después del receipt. Pulsación CSS 1px/120ms; no interpolar fondos cuando cambia simultáneamente el color del texto: el contraste debe mantenerse durante toda la interacción. Foco de 3px conservado. Para receipts, Motion `motion/mini` usa WAAPI en una única región de feedback: 4px→0 y opacidad0.7→1, ease(0.16,1,0.3,1), máximo220ms o duración de paquete menor. Cancelar al sustituir receipt, reducir movimiento o desmontar. Contenido visible por defecto, no espera la animación.

No se repite feedback ni anuncio por cambio de idioma o refresco del mismo receipt. El texto visible puede traducirse; el anuncio único conserva su idioma original. Si la petición está pendiente o falla, ocultar el banner anterior; no anunciar éxito optimista. No mover foco por un banner de compra. Resultado estático permanente, sin toast que desaparezca antes de leerlo.

GSAP conserva la apertura y forja existentes; Pixi conserva los impactos/replay. No añadir otro ticker, shake global, flashes ni audio. La opción propia o `prefers-reduced-motion` cancela movimiento nuevo y deja confirmación textual; omisión conserva el mismo resultado. [Coreografías existentes](docs/arcana/visual-production-2026-10-14/CHOREOGRAPHIES.md).

## Recursos y sustitución

Paquete activo en `src/arcana/presentation/content-packs/arcana/`: textos es/en, assets, timings y paleta. Retratos/escenas/objetos existentes, fuentes originales A50 y [cuatro SVG nuevos editables](docs/arcana/game-feel-2026-10-14/asset-manifest.json). Ausencia de arte no bloquea controles ni cambia reglas. [Guía de paquetes](docs/arcana/CONTENT-PACKS.md).

## Decisiones del jugador y balance

Conservar elegir ruta, revisar PV/equipo, conservar/gastar Coronas y asignar consumibles antes del duelo. Explicar objetivo según estado real; no tour obligatorio ni regalos adicionales. Los duplicados actuales permiten varias copias equipadas de forma distinta y conservan PV/PM al salir/reentrar. El ensayo no tiene intercambio.

[Revisión de gameplay y simulaciones](docs/arcana/game-feel-2026-10-14/GAMEPLAY.md) compara datos actuales con alternativas aisladas. Sus valores son hipótesis: ningún resultado del modelo aprueba balance ni sustituye sesiones de juego. No se modifica probabilidad/precio/energía/progreso guardado.

La meta WCAG2.2AA sigue pendiente de auditoría completa. Evidencia local separa unitarios, SQL/Redis reales, navegador emulado, capturas y rendimiento de escritorio. No atribuir observación con personas o teléfono físico a tests.

## A54 · Objetos que se juegan

La instrucción actual de Enric prevalece sobre el énfasis textual A52: casi nada de texto por defecto; materiales, equipo, filtros, frascos y navegación son assets tocables. Mantener nombres/cifras/costes/errores breves y ayuda/reglas a demanda. Botones DOM semánticos debajo del lenguaje ilustrado; ningún select, input o textarea en los recorridos actuales. No trasladar texto funcional al bitmap.

Paquete v3: diez SVG locales editables (nueve medallones de esmalte/latón y un marco), unidos a los retratos/props originales. Filtros por emblemas, selección por sello más contorno, origen de aliado por reloj de arena o gema propia, frascos por aliado, recompensa por objeto y cifra. Las copias siguen siendo instancias independientes; los temporales duran la expedición. No añadir canje o modificar balance para explicar duplicados.

`VisualChoices` agrupa botones con nombre localizado, aria-pressed, foco y fallback textual si falta la ilustración. Selección local inmediata, elevación de 5px y vuelta en 200ms easeOut; cancelar animación al cambiar selección, reducir movimiento o desmontar. No bloquea entrada ni escribe. La preferencia propia se propaga a controles ya montados; sistema/ajuste propio activan el equivalente estático. Confirmaciones de gasto/asignación y celebraciones siguen exclusivamente postreceipt.

Navegación por cuatro medallones con rótulo corto; HUD compacto con cifras/objetos; materiales en bandejas; receta como objeto pulsable con coste. Preservar lista equivalente del mapa, errores comprensibles y toda la ayuda es/en. [Contrato](docs/arcana/asset-interface-2026-10-14/CONTRACT.md), [evidencia](docs/arcana/asset-interface-2026-10-14/REPORT.md). La dirección se aplica por feedback explícito del propietario; sesión jugable A53 todavía sin observaciones de resolución.

## A55 · La región es el tablero

15 octubre2026. El mapa deja de parecer una ficha sobre pergamino: escena ilustrada visible dentro de la ruta, aristas doradas y nodos como sellos. Pixi usa transparencia; el fondo se elige por ID de zona desde `pack.regions` (v4), sin cambiar el grafo del servidor. Fallback de fondo oscuro/lista operable ante arte/WebGL ausentes. Una sola región jugable; [dirección incremental](docs/arcana/REGIONS-ROADMAP.md).

Pantalla por defecto: nombre de región, contador corto de etapas, retratos con barra de vida y emblema temporal/propio, mapa y recursos. Nombres completos/PV/PM/poder/velocidad/equipo/sinergias aparecen en una ficha al pasar cursor, enfocar o tocar. Se puede mover el cursor a la ficha; Escape, cierre, toque fuera o segundo toque en origen la descartan. Teclado abre con Enter y devuelve foco al origen al cerrar. Ficha acotada al viewport, lectura estática sin ticker, sin añadir animación a la consulta. Los IDs de instancia distinguen personajes repetidos.

Guía textual, nombres de nodos y resultados extensos quedan a demanda: ayuda, foco/lista y recibo desplegable. Recompensas confirmadas se ven como objetos/cifras incluso con el detalle plegado; el recibo no desplaza automáticamente al jugador fuera del mapa. Su detalle conserva narrativa, cantidades, recuperación y replay originales. No se suprimen errores ni anuncios accesibles.

Reutilización de `art/scene/passage.webp` y retratos/props A50; sin nueva generación/raster o coste externo. [Contrato](docs/arcana/region-map-2026-10-15/CONTRACT.md), [informe/capturas](docs/arcana/region-map-2026-10-15/REPORT.md). No confundir preparación visual por IDs con campañas futuras implementadas.


## A56 · El mapa es el tablero

Mapa primario a pantalla completa: header48, HUD48, tablero flexible, navegación64px; 44/44/48 en horizontal bajo. Sin scroll ni paneo automático. React mide el tablero con ResizeObserver y comparte posiciones ajustadas con Pixi; disposición vertical en estrecho, horizontal en ancho/bajo. Nodos44–72px, todos visibles. Reservar franja superior para región/ayuda y franja inferior para retratos/recibo. La lista equivalente y los detalles extensos sí pueden desplazarse; esto conserva acceso con texto ampliado sin convertir el tablero en una lista.

Familia de gemas SVG propias256×256 con engarce oro: Duelo, varitas rubí; Refugio, frasco/vida esmeralda; Cofre ámbar; Pacto, aliado amatista; Encuentro, dado turquesa; Jefe, torre/corona carmesí. No son indicadores de rareza. Disponible combina halo y rombo; visitado combina atenuación y marca; bloqueado conserva silueta y nombre accesible, botón deshabilitado. Foco muestra nombre DOM. Si falla el arte, símbolo estático visible; fallo WebGL conserva botones/lista.

La selección abre una preparación con efecto real, no una ilustración decorativa aislada. Duelo/Jefe presentan los assets de rivales de la arena, coste y premio correcto de primera/repetida victoria. Las Grageas se abren a demanda desde un frasco con contador; la preparación opcional no oculta por defecto el sello de confirmación. Cofre enseña contenido fijo. Refugio elige vida/maná y muestra cifras antes→después. Pacto muestra retrato/sello temporal, permite pasar con tres o sustituir únicamente temporal a cinco; nunca expulsa copia propia. Encuentro ofrece arriesgar/pasar; ayuda revela alcance del azar. Confirmar y cancelar usan sello/salida, con nombres accesibles ES/EN. Solo confirmación escribe.

Movimiento: mantener selección Motion mini200ms y respuesta CSS existente; no añadir flotación ni partículas permanentes al mapa. El mapa Pixi se dibuja por cambios/resize, no ticker continuo. Hover disponible escala1.08; se elimina con movimiento reducido del sistema o propio. Cambiar layout no anima posiciones ni regenera la ruta. Recibo solo después de commit; «Volver a la ruta» cierra detalle y devuelve foco sin scroll.

Rutas: generador v1 permuta planes completos y reduce conexiones; semilla elegida por servidor y guardada con la expedición. Primeras etapas garantizan formación; un Cofre temprano conduce a otro Pacto. Las partidas previas sin metadatos conservan su grafo. No confundir aleatoriedad de ruta con probabilidades de premios. Revisión de seis nodos, pruebas y escenarios en [A56](docs/arcana/visual-nodes-2026-10-15/CONTRACT.md).
