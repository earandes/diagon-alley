# A68 · Movimiento y confirmación

Las decisiones no dependen de animación. Join, intercambio, reparación y recuerdo solo se presentan como guardados después del estado/receipt confirmado por servidor. No hay sorteo visual, audio, bucles de calabazas, sacudidas o flashes.

| Momento | Anticipación → acción → reacción / cierre | Tiempo y capas | Interrupción / reducido |
| --- | --- | --- | --- |
| Descubrir | Objeto estático en cabecera → clic/tecla → diálogo nativo con tres ventanas y linterna | Sin animación; DOM top-layer, foco inicial en Volver | Escape/Volver devuelve foco al objeto. Consultar no participa ni gasta. |
| Elegir | Dos objetos y consecuencias → selección provisional → borde y sello✓, preview exacto por retrato | Cambio inmediato DOM/CSS; ningún cálculo por frame | Cambiar/cancelar borra borrador; no cambia condición. Hover y foco no ejecutan comandos. |
| Confirmar | Acción nombrada → botón ocupado → estado/receipt confirmado → ventana iluminada o valores PV/PM guardados | Sin espera artificial; actualización por estado, no polling/ticker | No reintento automático. Se puede cerrar conservando recuperación del journal. Error/recovery visible también dentro del diálogo. |
| Recuerdo nuevo | Tres reparaciones confirmadas → linterna y cierre → aparición localizada | 450ms ease-out, opacidad0.3→1, desplazamiento vertical0.5rem→0; solo la linterna, sin partículas/canvas | Solo un grant **nuevo observado con el diálogo abierto** anima. Recarga, idioma y consulta histórica son estáticos. Cerrar omite el efecto. Reducido elimina animación y conserva resultado. |
| Historia | Consultar edición anterior → ventanas, estado y recuerdo histórico | Estático; controles de historial, sin reproducir operaciones | No animación ni anuncio de concesión por consultar. Edición parcial cerrada también consultable. |

El anuncio accesible se emite una vez por ID de receipt estacional nuevo en la sesión. La referencia se inicializa con el receipt existente: montar/recargar no anuncia premios históricos. Cambiar idioma no reemite el anuncio anterior. Durante el diálogo, el live-region vive dentro del modal para no quedar inerte; fuera se conserva un equivalente. App no debe anunciar otra vez el mismo receipt estacional.

`prefers-reduced-motion` y el ajuste propio pasan a la alternativa estática. El SVG es estático. No carga Pixi/GSAP ni abre un renderer nuevo. Riesgo de rendimiento acotado: una imagen pequeña nueva y tres imágenes existentes solo al abrir el diálogo; no hay captura, vídeo, precarga de otro renderer o filtros GPU. Los tiempos450ms son especificación de movimiento, no medición de latencia extremo a extremo.

Verificación realizada: SSR ambos idiomas/paquetes, galería y lectura sin mutación; tipos. Foco/teclado/reducido/errores requieren el smoke acotado o la matriz Linux documentados por el coordinador. El estudio offline de ASSETS no acredita estos comportamientos.
