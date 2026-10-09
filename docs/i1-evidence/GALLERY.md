# Capturas reales revisadas de I1

10 de octubre de 2026. Chromium de Playwright, viewport 390×844. Son evidencia visual de una demo local con arte provisional; no prueba de persistencia o aprobación de arte final. Full-page conserva navegación fija a la altura del viewport; se incluyen capturas de viewport sin composición adicional. Los nombres de resultados pueden diferir entre las ejecuciones es/en: el azar de la demo no está guionizado para las capturas.

| Vista | Español | English |
| --- | --- | --- |
| Callejón | [Vista real](screenshots/es-alley-390-viewport.png) · [Página completa](screenshots/es-alley-390.png) | [Vista real](screenshots/en-alley-390-viewport.png) · [Página completa](screenshots/en-alley-390.png) |
| Interior | [Vista real](screenshots/es-shop-390-viewport.png) · [Página completa](screenshots/es-shop-390.png) | [Vista real](screenshots/en-shop-390-viewport.png) · [Página completa](screenshots/en-shop-390.png) |
| Detalle | [Vista real](screenshots/es-detail-390-viewport.png) · [Página completa](screenshots/es-detail-390.png) | [Vista real](screenshots/en-detail-390-viewport.png) · [Página completa](screenshots/en-detail-390.png) |
| Resultado | [Vista real](screenshots/es-result-390-viewport.png) · [Página completa](screenshots/es-result-390.png) | [Vista real](screenshots/en-result-390-viewport.png) · [Página completa](screenshots/en-result-390.png) |
| Álbum | [Vista real](screenshots/es-album-390-viewport.png) · [Página completa](screenshots/es-album-390.png) | [Vista real](screenshots/en-album-390-viewport.png) · [Página completa](screenshots/en-album-390.png) |

[Resultado es a 320 px](screenshots/es-result-320.png) · [Resultado en a 320 px](screenshots/en-result-320.png).

[Movimiento reducido/arte ausente/texto 200 % es](screenshots/es-reduced-result-320-200percent.png) · [en](screenshots/en-reduced-result-320-200percent.png); [álbum es](screenshots/es-reduced-album-320-200percent.png) · [en](screenshots/en-reduced-album-320-200percent.png). Escalado de fuente CSS, no móvil físico o lector.

[Salto durante la apertura tras commit](screenshots/es-ritual-jump-390.png). La captura no adjudica el resultado y no demuestra las invariantes transaccionales; ver pruebas y REPORT.md.

Correcciones verificadas: reserva de altura sin SVG, wrap de nombres al ampliar, foco al origen, reserva dinámica de altura de barra y pausa/omisión. Capturas tomadas después de esperar transiciones finitas para evitar presentar el interior desvanecido como su estado estable. En una página larga, desplazarse permite alcanzar todos los controles; las capturas full-page muestran la barra fija en su posición de viewport, no una barra situada realmente en medio del documento.
