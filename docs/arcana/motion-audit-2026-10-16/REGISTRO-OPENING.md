# A69 · M02 · Apertura implementada

16octubre2026. Se implementa la coreografía autorizada después de la auditoría. No se cambian peticiones, costes, probabilidades, receipt, inventario ni contenido de personajes. Sin nuevos assets, dependencias, audio, WebGL o filtros. No se ha abierto navegador ni ejecutado una suite gráfica desde esta tarea delegada.

## Cambio real

`opening-motion-model.ts` genera una receta finita a partir de `sealMs`, `lidMs`, `subjectMs`, `cardMs` y `holdMs` del paquete. Las etiquetas relativas sustituyen los absolutos mezclados con duraciones: anticipación→sello→tapa→salto→apoyo→huida→dorso→giro→frente→asentamiento. La tapa pivota desde el mismo envase; la rana vuelve al apoyo antes de escapar y el dorso ocupa ese espacio. No se fingen patas articuladas de un raster plano.

Con los tiempos actuales, un descubrimiento Común dura aproximadamente2,415s y el Legendario2,995s, con los rangos intermedios entre ambos. La copia repetida se resuelve en1,8s y con menor intensidad. Son duraciones calculadas de la receta; **no mediciones del gesto completo ni rendimiento observado**. Todo queda entre1,8–3,8s incluso si el paquete proporciona un tiempo desproporcionado.

Cuatro rarezas existentes conservan color y grabado distintivos. La intensidad aumenta por forma y luz localizada:6/10/16/24destellos para un descubrimiento nuevo;4para una copia. El efecto Canvas2D empieza al mostrar el frente de la carta, en lugar de gastar su duración sobre la caja cerrada. Dura720/940/1160/1380ms por rango nuevo y420ms para repetida. Se elimina la segunda capa `Celebration` de la apertura para no duplicar el burst. Otros consumidores de Celebration permanecen intactos.

## Inicio único y cancelación

Se usa el historial compartido `visual-history.ts` de M03–M10, namespace`opening` y namespace separado`opening-result` para el anuncio. Conserva únicamente IDs visuales en sessionStorage con caché acotada; no autoridad económica ni copia del receipt. Se reclama al empezar, también si se omite o reduce. Recargar/remontar una ID retenida presenta resultado estático; idioma no reinicia la timeline y cambiar de pack durante el ritual concluye estáticamente. El historial es una ayuda cosmética: almacenamiento bloqueado usa memoria; borrarlo o expulsar IDs antiguos por el límite puede permitir repetir un efecto, nunca una operación.

Una ref por montaje conserva admisión y tiempo de presentación durante el reinicio de efectos de React StrictMode, evitando reclamar otra vez o dejar pendiente un import cancelado. Solo se conserva la receta visual del receipt actual. La reacción accesible de descubrimiento/copia se anuncia al resultado, no al inicio del ritual.

Omitir, activar movimiento reducido, fallo de import GSAP o error de una imagen del escenario dejan inmediatamente la misma carta confirmada, nombre, rareza, estrellas y destinos. No se añade espera por decodificación ni precarga en otra pantalla; los recursos siguen cargándose en el contexto real de la acción y la medición posterior deberá incluirlo.

## Pausa y recursos

Solo se pausa la timeline propietaria al ocultar la pestaña. GSAP conserva su posición y reanuda al regresar. La capa SVG pausa sus animaciones CSS y FrogMagic detiene rAF, conserva tiempo transcurrido y reinicia la referencia temporal al volver; el tiempo oculto no entra como un delta enorme. No se pausa el ticker global GSAP ni animaciones ajenas.

FrogMagic conserva los límites A58: un canvas de efecto, dos sprites prepaintados28×28,24destellos como máximo,DPR≤1,5, duración≤3200ms. No recalcula gradientes por frame. Desmontar/omitir cancela rAF, observer y listener; la timeline se mata y el contexto revierte. El resize no vuelve a asignar el backing store si sus dimensiones no cambian.

## Comprobaciones de esta tarea

Comando dirigido: `npx --no-install vitest run tests/domain/arcana/opening-motion-model.test.ts`.

- RED inicial: módulo todavía inexistente,0assertions ejecutadas. No se describe como cuatro fallos de comportamiento.
- Primera implementación:3casos correctos y1fallo real del límite3800 por punto flotante (`3800.0000000000005`). Se corrigió fijando el extremo canónico de la receta.
- GREEN:4casos correctos, última ejecución72ms. Cubren secuencia/rangos/nuevo-repetido, influencia del pack, límites y extremos de fase; no acreditan cleanup DOM, rendimiento o percepción humana.
- Lectura de tipos inicial detectó un alias de namespace GSAP incorrecto y se corrigió. El coordinador ejecutará tipos/build y regresión conjunta; el estado global de ese comando no se atribuye a esta entrega parcial.

Pendiente de comprobación coordinada en Linux: las cuatro rarezas con fixtures declaradas, nuevo/repetido, montaje/recarga/idioma/pack/StrictMode, pausa oculta, omisión/reducido, import o asset fallidos, foco/teclado, trayectorias y continuidad visual. Medir desde gesto+red+commit+import/decode+animación hasta resultado utilizable. Los antiguos perfiles que esperaban3200ms de partículas desde el inicio deben observar ahora la fase activa real; no se alarga el efecto para satisfacer una ventana de FPS artificial. No se ha validado en dispositivo físico ni con jugadores.
