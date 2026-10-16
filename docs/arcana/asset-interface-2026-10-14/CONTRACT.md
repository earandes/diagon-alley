# A54 — Interfaz mediante objetos ilustrados

14 octubre 2026. Dirección explícita de Enric: «El juego no tiene que tener casi nada de texto, todo tiene que ser visual, con assets nada de checkboxs, textbox, y demás. Tiene que ser todo mediante assets, animaciones, ...».

Estado inicial: A52 utiliza selects de materiales/equipo/filtros/grageas, checkbox de movimiento, guía y HUD verbosos. A53 primer objetivo enviado en ordenador; sin resultado humano recibido. La corrección visual es feedback del propietario, no prueba jugable completada.

Tres cambios autorizados: (1) navegación, orientación y HUD mediante emblemas/retratos; (2) taller, colección y equipo mediante piezas seleccionables; (3) preparación de combate y preferencias mediante objetos/sellos, con respuesta visual breve.

Acciones: tocar material → previsualizar receta → confirmar coste → obtener receipt; tocar equipo → guardar asignación; tocar frasco para un aliado → confirmar nodo. Selecciones, filtros, idioma y cancelaciones no gastan ni modifican estado de autoridad. Solo los casos de uso existentes guardan. Fallos/reintentos/recuperación conservan sus contratos; nunca anunciar éxito antes del receipt.

Texto visible reducido a nombres, cifras, acciones breves y errores necesarios. Reglas, probabilidades y ayuda accesibles a demanda. Botones semánticos con nombre es/en, foco y selección persistente visual; ningún select/input/textarea en estos recorridos. No sustituir semántica por canvas inaccesible. Rareza por silueta/sello además de color. Movimiento reducido muestra selección estática equivalente.

Recursos: reutilizar retratos/props originales del paquete; familia SVG local editable de marcos/sellos/interfaz, sin servicios con créditos. Arte ausente conserva nombre/acción. No cambiar probabilidades, costes, reglas de copias/temporales, backend, datos existentes, audio o campaña. Sin publicar.

Aceptación es/en: selección por teclado/clic; vista previa sin escritura; cancelación y cambio de idioma sin gasto; asignación de equipo confirmada y recuperable tras recarga; frasco no asignable a dos aliados; cero frascos sin controles vacíos; sin desbordamiento en 320/390/1280 px y 200% texto; movimiento reducido sin animación de selección. Comprobar flujos con Playwright, dominio/integración y build. Automatización separada de observación humana; rendimiento medido en escritorio, no afirmación móvil físico.
