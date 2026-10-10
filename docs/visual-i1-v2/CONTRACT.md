# Adaptación visual I1 · 10 octubre 2026

Autorización actual: «Pues vayamos a por ello no? Ahora que tenemos el diseño». Se integra la dirección del pack weasley-flow-v1 en la demo local; no se amplían reglas, cuentas ni I2. PRD v0.19 y AC01–12 siguen vigentes.

Estado inicial: demo persistente 4/12, una rana y grageas no abribles; SVG esquemático. Acciones: entrar, consultar cuatro opciones, consultar probabilidades, usar rana, omitir/ver resultado, álbum y volver. Consultar grageas/inventos conserva unidades/copias. Inventos son las mismas O01/O02 del álbum. Resultado usa identidad y versiones persistidas; Dumbledore nunca se fuerza para igualar una muestra.

Presentación: interior cálido continuo, opciones ilustradas con HTML, caja pentagonal por piezas DOM, rana/sombra/cromo independientes; ritual existente 1,6 s después de commit. Textos funcionales fuente en es/en, nunca la captura completa como interfaz. CSS encuadra/máscara regiones de los raster existentes sin regenerarlos; exportación WebP solo codifica/comprime, sin inventar pintura oculta o un rig. El recorte central del interior excluye carteles escritos; miniaturas excluyen sus etiquetas pintadas.

Recursos: tres conceptos aportados y callejón/rana provisionales previos con procedencia conocida. Originales intactos. Assets raster siguen sin pintura por capas; marco/piezas y límites CSS editables. Otras identidades usan símbolos provisionales reconocibles; no dibujar otro personaje sobre un resultado distinto. Gasto adicional cero, sin imagegen/servicios ni nuevas dependencias de runtime.

Aceptación: comprobar cuatro consultas sin consumo y retorno de foco; lista equivalente; probabilidades completas antes de consumo; resultado/persona u objeto consistente en imagen/texto/álbum; ES/EN, 320/390 px, ampliación, teclado, arte ausente y reducido. Reejecutar regresión de transacción/recuperación/concurrencia. Capturas reales y peso fresco producción. Lector audible, móvil físico, A17 y autorización de distribución mantienen pendientes; no declarar acabado final ni 60fps.
