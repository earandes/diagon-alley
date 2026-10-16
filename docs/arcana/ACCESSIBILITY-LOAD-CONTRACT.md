# A47 — Carga cinco unidades y ampliación de texto

12 octubre 2026. Estado inicial: perfiles de ~2,2 s con tres unidades; texto raíz al 200% solo amplía tipografía heredada, varias etiquetas de px permanecen pequeñas. Pedestales usan altura fija y coordenadas gráficas fijas. Ninguna afirmación de 60 FPS sostenidos o WCAG completa.

Incluye harness exclusivo de pruebas para BattlePanel real con log determinista largo de cinco unidades por columna, nombres del catálogo y consumibles. Sin cuentas/recompensas de ensayo o importación de este fixture al build. Medir FPS/intervalos/render real bajo carga durante 10 s por tamaño, pausar comprobar ticker detenido, ampliar texto y comprobar contenido no recortado y navegación visible. Registrar resultado aunque no alcance 60; no relajar umbral para afirmar objetivo.

UI: tipografía funcional relativa al ajuste del usuario, crecimiento de controles/barra inferior y pedestales sin recorte. Coordenadas canvas deben alinearse con peanas DOM medidas después de layout, sin fórmulas de combate o reads cada frame. Map/lista siguen mismas acciones. Corregir solo fallos observados, sin motor genérico o nueva dependencia.

Contraste: obtener colores efectivos del DOM/composición sobre superficies utilizadas; verificar texto normal 4,5:1 y foco/controles 3:1 donde corresponde. No mezclar ratio de pares con certificación página completa. Herramientas emuladas no equivalen a lector audible/móvil físico/zoom nativo.

Referente revisado: skill local Web Design Guidelines y su fuente oficial actual; fuente y hallazgos en informe. Word/economía/balance/autoridad intactos. Pruebas que fallan antes de cambios de presentación; integración posterior de regresión según lo cambiado.
