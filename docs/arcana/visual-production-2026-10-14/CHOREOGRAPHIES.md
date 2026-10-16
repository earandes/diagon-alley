# Coreografías implementadas · A49/A50

Parámetros principales: `src/arcana/presentation/content-packs/arcana/pack.json`. Código editable: `CardReveal.tsx`, `Celebration.tsx`, `BattlePanel.tsx`, `CommercePanel.tsx`, `scenes/pixi-scenes.ts` y `styles.css`, dentro de `src/arcana/presentation/`.

## Sapo de Cacao

| Tiempo desde comienzo visual | Representación |
|---|---|
| 0–250 ms | Caja cerrada; sello sube de escala y se desvanece |
| 250–650 ms | Caja cerrada cede a base/interior; tapa sube 110 px y gira −18° |
| 650–1300 ms | Sapo entra desde el interior, escala 0,7→1 y sube |
| 1300–1450 ms | Pausa breve para reconocer el sapo |
| 1450–1950 ms | Sapo sale/desvanece; cromo real entra y se endereza |
| Resultado | Retrato en marco, nombre/rareza/estrellas/repetido en DOM; continuar o Cromodex |

Las mezclas breves (180/200 ms), posiciones y curvas son código legible en el componente; las duraciones principales se cambian en el paquete. Pivotes/recortes se documentan en manifests. Un envase de geometría diferente puede requerir ajustar el registro CSS/GSAP en ese componente: no se promete sustitución automática de cualquier diseño arbitrario.

**La secuencia empieza después del receipt de servidor.** Resultado funcional y CTAs aparecen inmediatamente, sin esperar los 1950 ms. No se invoca economía desde GSAP. No hay nuevo sorteo, generación runtime ni premio ficticio. Recargar conserva el cromo y elimina la presentación transitoria; omitir muestra resultado estático y retira el botón. Cambiar idioma no reinicia la secuencia ni el confeti. GSAP ausente o movimiento reducido dan resultado estático; arte ausente deja textos/acciones. El anuncio accesible se emite una vez por receipt, manteniendo el idioma de ese anuncio inicial.

## Celebración

28 piezas DOM de confeti, máximo 1200 ms; paleta/contador/duración en el paquete, trayectorias en `Celebration.tsx`/CSS. Se dispara por descubrimiento nuevo al acabar la apertura (no cuando se omite), victoria de combate presentada desde su receipt nuevo, forja y bóveda confirmadas. Se conserva un registro en memoria por ID de receipt para impedir reinicios de la misma presentación. Un receipt antiguo leído/reproducido después de recargar no dispara una celebración nueva.

Los fragmentos se recortan al área de ilustración (apertura/producto) o al canal central de arena; no cubren controles ni resultados DOM. `pointer-events:none`, decorativo y sin anuncios extra. Desmontar la vista limpia el temporizador; movimiento reducido desactiva/interrumpe. Combate puede omitirse sin alterar resultado; la celebración de victoria depende de la presentación nueva del receipt, no de otra operación.

## Arena

PixiJS v8 reproduce BattleLog confirmado: 650 ms por evento, 325 ms a 2x. Entrada de figuras 350 ms, proyectiles/impactos y pequeña reacción visual; derrota con inclinación, gris y opacidad, además de «Fuera de combate»/«Defeated» en DOM. No es animación articulada de extremidades. Las figuras usan ilustraciones reales, no triángulos. Canvas muestra el arte cuando está cargado; el DOM mantiene espacio/texto y alternativa ante WebGL/arte ausentes. Texturas propias se destruyen al salir. Pausa detiene renders; Auto/2x/omisión modifican reproducción, nunca daño o premio.

El resultado persistido y vuelta al mapa están encima del área de arena. Los PV intermedios del replay se distinguen del estado final guardado. La apariencia del jefe ocupa la posición central del encuentro actual; no se inventa otro enemigo.

## Taller y Bóveda

Entrada GSAP de la ilustración de resultado: 350 ms, escala 0,93→1/opacidad 0,6→1, exclusivamente sobre resultado confirmado. No retrasa su consulta. Receipt leído después de recarga muestra resultado e ilustración estáticos sin otra compra/canje o celebración. Confirmación de gasto y foco de resultado conservados.

## Evidencia

`12-toad-visible.png`, `40-toad-final-en-390.png`, `41-result-confetti-en-390.png`, `42-result-focus-en-390.png`, `44-result-reduced-es-320.png`; logs `opening-visibility.txt`, `celebration-final.txt` y suites en [REPORT](REPORT.md). Los WebM del CLI que contienen frames grises no acreditan movimiento; las fases se inspeccionaron en ejecución y capturas, con tests de estados/lifecycle.
