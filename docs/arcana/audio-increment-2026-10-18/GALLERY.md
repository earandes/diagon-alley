# Ajustes de sonido · evidencia seleccionada

Primer pase: CI39122556273/head6570ae1. Capturas de un harness declarado con GameSettings/BattlePanel reales; el fondo conserva controles QA fuera del producto, sin cuenta/recursos del jugador. No son mockups ni prueban escucha o persistencia económica.

| Vista | Evidencia | Lectura experta |
|---|---|---|
|390×844, Chromium, ES/Diagon|[Ajustes](evidence/first-pass/chromium-390-motion-a69-settings.png)|Dos objetos/estados, nombres que pueden envolver, volumen a demanda. El diálogo puede desplazarse; no se oculta contenido para fingir que cabe.|
|1280×900, Chromium, ES/Diagon|[Ajustes](evidence/first-pass/chromium-1280-motion-a69-settings.png)|Mismos materiales, dorado, jerarquía y controles semánticos que Idioma/Mundo. No nuevo panel permanente sobre el mapa.|
|865×1079, WebKit, ES/Diagon|[Ajustes](evidence/first-pass/webkit-865-motion-a69-settings.png)|Rango nativo con aspecto propio de WebKit; texto, porcentaje y foco conservados. No se sustituye por un gesto preciso decorativo.|

El contorno cian identifica foco de teclado y se conserva. Las capturas tienen volumen desplegado y foco en el rango porque verifican esa interacción; por defecto permanece plegado. La adecuación estilística es valoración experta apoyada en las imágenes, no aceptación observada con jugadores.

Las nueve pruebas A84 de ese pase fueron correctas (incluidas las cuatro combinaciones idioma/pack por pareja), pero la CI general falló en regresiones antiguas. QA registra causas/correcciones y el pase final correspondiente; no se atribuye éxito global a estas capturas.

## Capturas del candidato final

CI39128171523, head2330f7b, checkout real4fea2b08. Job check correcto; los tres archivos se han inspeccionado. Solo composición/estado de foco: no prueban movimiento, salida acústica o satisfacción.

- [390×844 · ES/Diagon](evidence/final/chromium-390-motion-a69-settings.png): etiquetas de música en dos líneas, estado visible y rango cómodo. El diálogo desplaza sus secciones inferiores al desplegar volumen; no se ocultan ajustes.
- [1280×900 · ES/Diagon](evidence/final/chromium-1280-motion-a69-settings.png): misma familia de objetos de Idioma/Mundo, un grupo Sonido y detalle de volumen. No nuevo HUD; el final del diálogo puede desplazarse con el detalle abierto.
- [865×1079 · EN/ARCANA](evidence/final/webkit-865-motion-a69-settings.png): marco/símbolo ARCANA, estados y etiquetas localizados, rango nativo de WebKit y foco visible. No se recorta el contenido para aparentar que cabe.

La galería muestra volumen **abierto** por la prueba de teclado; por defecto está plegado. Las comprobaciones200%son geométricas en ejecución, no nuevas capturas. La valoración de coherencia visual es experta; la preferencia artística y el balance sonoro continúan pendientes de una persona.
