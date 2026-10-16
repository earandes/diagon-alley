# A58 · Control de acabado

La dirección se elige por revisión del integrador dentro de la delegación vigente, no por una aprobación atribuida a Enric. La familia se revisa en contexto y en sus exports reales; el maestro por sí solo no demuestra que un sombrero sobreviva al encuadre final.

## Muestra y lote

Harry/Hermione/Dumbledore: maestros nuevos generados localmente, no filtros sobre SVG A57. La composición `design/diagon-alley/illustrated-v2/samples-in-context.jpg` muestra volumen, edades distintas y relación de luz/materiales con el callejón. Elegida como dirección del lote.

El integrador inspeccionó también McGonagall, Flamel, Snape, Ron y Luna en tableros intermedios. Pelo, prendas, edades y siluetas diferenciados. El revisor independiente examinó quince personajes, once figuras exportadas y retratos/miniaturas seleccionados; sus observaciones son evidencia de archivos, no una sesión humana ni una inspección de todas las pantallas.

## Defectos detectados antes de integrar

| Recurso | Hallazgo | Corrección / comprobación |
| --- | --- | --- |
| Hermione, maestro inicial | Borde claro y firma sintética en margen inferior | Crop registrado excluye margen; original conservado y sin texto en export |
| Harry | Cicatriz poco visible bajo flequillo | Retoque pequeño independiente en SVG, registrado/reversible |
| Dumbledore/McGonagall/Hermione, exports iniciales | Fit centrado eliminaba parte superior de sombrero/coronilla | Retrato proporcional anclado arriba y figura contain con margen transparente; comprobación final de archivos y cartas |
| Tonks, primer intento | Acabado cel/plano frente al volumen pictórico común | Repintado condicionado seleccionado por ruta efectiva/SHA; original conservado |

| Hagrid, primer intento | Proporciones poco distintivas del semigigante | Variante con hombros anchos, barba y pelo largos seleccionada |
| Moody, primer intento | Lente en frente, como tercer ojo | Edición sobre imagen: una cuenca con ojo mecánico y otra con ojo normal |
| Voldemort, primer intento | Nariz demasiado humana | Variante con ranuras y rostro serpentino seleccionada |
| Seguimiento de variantes | MFLUX guardaba `_1`/`_2` y se revisaba el nombre original | Selección explícita por ruta/SHA, informes anteriores marcados superados, máscaras/exports rehechos desde el archivo aceptado; wrapper rechaza destino existente |

Los cuatro maestros corregidos fueron abiertos y revisados también por el integrador: técnica pictórica común, identidades diferenciadas y corrección de la cuenca de Moody. El índice de selección conserva todas las variantes y sus hashes, no solo una declaración de que se regeneraron.

## Cierre

El integrador abrió las hojas finales de los treinta retratos, figuras y miniaturas y los archivos efectivos de Dumbledore/McGonagall/Hermione. Sombreros completos, máscaras sin fondo material residual, rostros legibles y técnica pictórica común. Se abrieron también las cuatro variantes corregidas por sus rutas seleccionadas. La revisión independiente anterior cubrió quince personajes y encontró los recortes ya corregidos; no se atribuye al revisor una segunda revisión de los treinta que no realizó.

La fixture reproduce el atributo de paquete usado por la app para aplicar su encuadre correspondiente. Las capturas del componente real de revelación muestran Dumbledore, McGonagall y Hagrid en1280/390px. Se ajustó el anclaje vertical del retrato Diagon a arriba y su margen bajo el marco: el cover centrado quitaba unos píxeles de sombrero dentro del marco. ARCANA mantiene su encuadre. Las noventa imágenes decodifican y el swap conserva carga correcta en ambos motores e idiomas. Las cartas de estas muestras son fixtures técnicas etiquetadas, sin entrega al inventario. La ausencia de fallos de carga no equivale a una valoración estética aprobada por el propietario.
