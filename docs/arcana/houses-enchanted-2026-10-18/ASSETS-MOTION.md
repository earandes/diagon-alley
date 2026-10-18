# Recursos y movimiento A85

Fuentes editables y consumidores en [manifest](../../../design/houses-a85/manifest.json). Producción original local con SVG/React, sin servicios, créditos, imágenes nuevas o dependencia añadida. Los retratos existentes mantienen su procedencia y la incertidumbre T01; dibujar una silueta propia no acredita permiso de distribución de una franquicia.

| Recurso | Fuente y encuadre | Función | Respuesta/fallback |
|---|---|---|---|
| Cuatro insignias | `HouseInsignia.tsx`,128×128 transparente, pivote central | Siluetas de león/ave/tejón/serpiente,24–30px en contexto; no escudos oficiales copiados | Nombre/conteo fuera del SVG y consulta semántica; no depende solo del esmalte |
| Acabado encantado | `EnchantedFinish.tsx`,400×500 transparente, borde facetado, sello y remaches | Distinguir una instancia sin alterar identidad/rareza; no cambia atuendo | Etiqueta localizada permanente, retrato y resultado aunque falle el arte |
| Perfil de lanzamiento | `motion/house-cast.ts` y `pixi-scenes.ts`, coordenadas locales sobre el mismo ataque | Recta, curva estrecha, cruz/convergencia o arco estable | Sin casa: trazo anterior; fallo/reducido: resultado/registro disponibles |

No se añade textura raster, filtro pesado, partículas en lote, contexto WebGL o asset descargado durante apertura. El peso del SVG está en el JS compilado; no se equipara a una texturaRGBA ni a memoria residente medida.

## Coreografía

- **Pacto:** las cifras antes→después cambian en la selección provisional, calculadas por el dominio compartido; confirmar sigue siendo una operación explícita. El sello de selección existente y el detalle de efecto no afirman una victoria futura.
- **Mapa:** el medallón está estable, sin movimiento perpetuo. Consulta por objeto/teclado muestra contribuyentes, procedencia y nivel. La altura real del equipo se reserva antes de encuadrar la ruta; no se ocultan nodos o controles para aparentar cabida.
- **Apertura:** la secuencia existente conserva sello/tapa/rana/carta. En la etiqueta `reveal`, borde0,96→1 y reflejo650ms con GSAP sobre el mismo timeline. Un único recorrido y cierre; omitir, reducido, historial o importación fallida llevan al mismo resultado estático. El acabado ya está confirmado enSQL.
- **Combate:** el perfil consume la casa guardada en el input y las marcas del reloj compartido. Anticipación→vuelo0,18–0,78del evento→contacto→asentamiento; 2x escala ese mismo reloj. El renderer no elige objetivo ni calcula daño/azar. La curación aparece solo por un evento `healed` confirmado.
- **Sonido:** conserva el sistemaA84 voluntario de afinidades, silencioso por defecto y controlado desde Ajustes. La insignia no dispara sonido por sí sola. Sin composición, voz o audio automático nuevo.

El marco no se extiende al ancho del diálogo del álbum: sigue la anchura del retrato y el cierre queda por encima. PrimeraCI reprodujo el defecto y se conserva enQA, sin clic forzado.

## Límites de aceptación

Una captura estática valida composición, no el movimiento. El spec toma muestras temporales del transform/opacity de la revelación y posiciones del lanzamiento sobre el reloj de replay; la sesión humana deberá juzgar espectacularidad, lectura de siluetas pequeñas y fatiga. No se declara rig corporal, atuendo alternativo, acabado artístico definitivo o móvil físico por superar automatización.
