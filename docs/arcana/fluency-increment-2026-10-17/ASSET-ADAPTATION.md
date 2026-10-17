# A73 · Metadata de silueta, no nuevas ilustraciones

Estado: muestra técnica en ensayo; aceptación visual/rendimiento pendientes.

No se escribe, reduce o regenera ningún bitmap. Las fuentes activas y sus fuentes editables históricas permanecen intactas. Se añade `scene-alpha.json`, derivado mediante `tools/visual/measure-scene-alpha-a73.py` y Pillow ya disponible en el runtime local. Coste adicional cero; no Blender, servicio, modelo o instalación nueva. El script es la fuente editable de esta transformación geométrica; los WebP son entradas activas, no se presentan como masters por capas.

Cada registro identifica archivo/paquete, SHA256, dimensiones originales, marco rectangular y, cuando ahorra margen suficiente, bandas horizontales de64píxeles. Se conservan todos los píxeles con alfa>0, un píxel de guarda y las filas vecinas para obtener los límites laterales. La unión se verifica contra el alfa completo. Fuentes animadas se excluyen. Las pruebas vinculan certificados con los bytes vigentes; al modificar un export debe regenerarse la metadata. No es una nueva licencia o aprobación de arte: procedencia y condiciones son las de los recursos originales y manifiestos A58/A71.

Consumidores: `scene-texture.ts` aplica frame/trim/orig sin modificar resolución o pivotes. `SceneFigureAtlas` usa bandas únicamente en figuras ordinarias de≥96píxeles del renderer; las pequeñas y el jefe conservan el frame único. Todas las bandas comparten TextureSource y UV de la misma imagen. No son piezas anatómicas, poses ni un rig. No añaden uploads de fuente o memoriaRGBA por banda; sí wrappers, vértices y transformaciones CPU, cuyo coste debe medirse. No se promete menor memoria residente.

Propiedad: caché de frames por escena y fuente; cambios de tamaño alternan banda/frame único sin modificar el personaje. Se destruyen wrappers con destroy(false) y después la fuente una sola vez con el propietario original. Metadata ausente/incompatible conserva imagen completa; arte ausente conserva fallback DOM. No hay trabajo de producción de assets durante una interacción.

Aceptación: ninguna diferencia visible de encuadre, ancla, silueta, color, transparencia, gesto o PV; sin costuras entre bandas a escala real, también durante movimiento; sin reuso de fuente tras desmontaje y sin recurso oculto para aparentar que cabe. Dos PNG seleccionados en Linux se capturan después de medir/pausar, no acreditan una animación o dispositivo físico. Regresiones ES/EN y ambos paquetes todavía pendientes del candidato final.

## Resolución del ensayo

El atlas no se adopta. Tras aislar la mejora en batching (ab-9), se retiran metadata y helpers de las fuentes activas. Las imágenes originales, encuadre y transparencia permanecen intactos. Generador y certificados quedan recuperables en commitsfa41664/78267f5, no como capacidades activas ni recursos finales. La evidencia ab-7/8 y las diferencias RGB se conservan. El incremento final no necesita producir o adaptar assets.
