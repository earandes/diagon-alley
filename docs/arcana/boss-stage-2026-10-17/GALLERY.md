# A71 · Evidencia seleccionada y comparación

## Referencia anterior A70

[Preparación anterior](../boss-increment-2026-10-16/evidence/linux/selected-boss-preparation.png) · [Libro durante lanzamiento](../boss-increment-2026-10-16/evidence/linux/selected-boss-object-cast.png) · [Cuenco durante lanzamiento](../boss-increment-2026-10-16/evidence/linux/selected-boss-object-arcana-cast.png) · [Cierre anterior](../boss-increment-2026-10-16/evidence/linux/selected-boss-closure.png).

Son las fuentes históricas conservadas, no regeneradas sobre A71. La comparación es de composición; cuentas, inventario y condiciones técnicas de las imágenes no son idénticos y sus cifras no se usan como benchmark económico.

## Primer pase A71 y correcciones

CI38986042403 sobre76a9b34 produjo seis PNG, inspeccionados antes de otra corrección. Se conservan [escritorio](evidence/attempt-2/preparation-desktop.png) y [móvil](evidence/attempt-2/preparation-mobile-diagon.png) como evidencia del header anidado con estilo global y del contador cercano a Ajustes. La lectura de objetos/equipo mejoró, pero no se aprobó ese pase como final. También se detectó pérdida de tamaño por margen transparente del actor y se compensó en layout medido, sin alterar PV o esconder unidades.

## Confirmación seleccionada · CI38988996115

Los seis PNG proceden del merge ensayado `ffb9094`, candidato `445d6f4`, en Linux/Chromium. Coordinación los inspeccionó como imágenes del juego, además de revisar las aserciones. [Procedencia y SHA256](evidence/provenance.json). No se regeneraron capturas A70.

| Escena | Evidencia | Revisión experta acotada |
| --- | --- | --- |
| Antesala1280×900 |[Escritorio](evidence/linux/selected-preparation-desktop.png) |Rival y equipo diferenciados, libros/tarro consultables, una acción con coste; no columna dominante de recuadros |
| Antesala390×844 Diagon |[Móvil Diagon](evidence/linux/selected-preparation-mobile-diagon.png) |Nombre/contador/Ajustes separados; retratos y condición completos; preparación/sinergia comparten fila y tarro queda sobre CTA |
| Antesala390×844 ARCANA |[Móvil ARCANA](evidence/linux/selected-preparation-mobile-arcana.png) |Encuadre acerca caras conservando origen/orden; rival y objeto reconocibles en la composición; no desbordamiento visible |
| Gesto Diagon1280×900 |[Libro](evidence/linux/selected-actor-diagon.png) |Extensión≥0,14rad, origen del proyectil fuera del cuerpo; rostro/objeto/PV y compañeros separados en la pose |
| Gesto ARCANA1280×900 |[Cuenco](evidence/linux/selected-actor-arcana.png) |Encuadre medio y cuenco protagonista; no costura o duplicación obvia en la pose mostrada |
| Cierre1280×900 |[Botín](evidence/linux/selected-closure.png) |Resultado y recompensas primero; llave/rana/nueva preparación diferenciadas; hechos quedan en libro secundario |

Los dos lanzamientos son fixtures3×3 declaradas, no composiciones nuevas de campaña. La composición5×5 y865×1079 se comprueba por límites de figura/nombre/PV dentro del puesto y viewport, más renderer/log; no se presenta como una captura adicional inspeccionada. La corrección densa reparte presupuesto sin ocultar unidades. La lectura humana del gesto sigue pendiente.

Ningún PNG demuestra continuidad de movimiento. Fase, pausa, swap, omisión y resultado se contrastan con aserciones dinámicas del renderer. No se grabó vídeo ni se presenta emulación como dispositivo físico. Los tamaños restantes se comprueban mediante geometría/acciones en la matriz, sin fingir una inspección visual de cada combinación.
