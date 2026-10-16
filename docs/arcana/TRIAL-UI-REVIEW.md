# Revisión de la primera UI DOM A38

A48: Peanas muestran afinidad, identidad y bono registrado; columnas separan equipos. Seis medidores únicos para actores repetidos en combate real tres por lado. CLI320 es/en/root32 sin overflow/recorte y SQL intacto; fotos revisadas. Shadow sobre neutral, singular y fallback es/en probados. No lector audible/zoom nativo/físico certificado.

A47: Texto real de etiquetas crece al 200%, peanas flexibles, altura de nav reservada y mapa interno pan/lista. Contraste de arena medido bajo texto sobre WebGL, rival/hover reparados. CLI estable root32/nav28/unidad24 a320 sin overflow/recorte; imágenes anteriores al último fix de hover explícitas, E2E posterior green. No zoom nativo/lector/físico ni certificación global.

A46: Navegación hash/atrás/adelante/reload y foco al contenido, causas dentro de modal y actualizar antes de reconfirmar. Resultado jefe enlaza Misiones/desbloqueo guardado. CLI 320 es/en/texto raíz 200% sin overflow y SQL intacto; capturas vistas en estado. Zoom completo/contraste/lector/físico y rendimiento sostenido pendientes.

A45: Aviso offline es/en y acciones deshabilitadas; shell tras recarga, reconexión recupera lectura autoritativa. CLI 320 px y raíz al 200%, sin overflow, SQL intacto. No instalación física, zoom completo ni certificación WCAG.

A44: Encuentro muestra riesgo antes de confirmar, texto guardado por idioma, efecto y PV antes/después. Región accesible específica; cancelar conserva SQL, idioma/recarga mantienen resolución. Interfaz no calcula curación/daño ni infiere historia de config. RED UI inicial fue aviso ausente, espera de commit corregida en primer GREEN del test. CLI 320 es/en y raíz EN al 200%: scrollWidth 320, relato y unidades envuelven; scroll vertical necesario y estado SQL intacto al cambiar idioma. Capturas vistas en estado. No zoom completo, lector o certificación por tests.

A43: estrellas con símbolos decorativos y etiqueta textual completa/plural es/en, dato por copia. CLI encontró overflow de sello ampliado aunque opacity 0; se acota a 34 px antes de escala. RED real a 320 px y GREEN Chromium/WebKit, también texto raíz 200%; intento inicial no llegó a añadir assertions y no se cuenta como RED. Capturas `block-12-stars-320-*` iniciales anteriores a corrección, no prueba del layout final. Capturas `*-current.png` posteriores revisadas: scrollWidth 320, etiqueta y símbolos legibles a 320 es/en y raíz 200%; no zoom completo del navegador. Navegación URL, contraste/zoom/lector/móvil físico y aceptación restante pendientes.

A42: Taller/Bóvedas con selects nativos y confirmación/cancelación, idioma dentro de diálogo, resultado enfocado y equipo propio asignable. CLI 320×844 es/en, raíz al 200%: sin overflow horizontal, diálogo EN y resultado por encima de nav; foco heading resultado visible. Bóveda sin llave tiene explicación y acción deshabilitada. Capturas y límites en `PHASE-4-STATUS.md`. Navegación URL, errores/contraste/zoom completo, lector y móvil físico siguen pendientes. Entradas posteriores conservan hallazgos históricos, no describen gaps ya corregidos.

A41: energía/health meters DOM con nombre, equipo/sinergias, título localizado y resultados guardados. CLI 320 px es/en y raíz 200%/32 px, sin overflow horizontal. Resultado del pacto inicialmente bajo nav: RED por límites reales, scroll de región y MapPanel dependiente de elecciones/identidad corrigen la carrera con refresco. CTA volver a ruta devuelve foco a opción disponible; comprobado CLI (sin gasto). Anuncio de nodo no combatiente una vez por receipt; idioma en lang propio del anuncio inicial, no repetido por refrescar/cambiar idioma. No lector físico verificado. URL/errores/contraste/zoom completo y QA restante pendientes.

A40: filtros de álbum, inspección/loadout y asignación de Grageas disponibles. CLI propio revisa 320 px es/en y raíz al 200% (32 px), sin overflow horizontal; select largo tiene descripción estática que envuelve. No equivale a zoom completo del navegador, lector o WCAG certificada. Diálogo mantiene foco inicial previo, idioma accesible dentro del modal; cancelación no consume. Navegación URL, causas de error, HUD/energía y QA restante pendientes.

A39, 12 octubre: se corrigen foco/diálogo nativo/retorno al botón de origen en WebKit, enlace de salto, nodo inicial visible y separación MapPanel/BattlePanel/CardReveal. Pixi mantiene controles/texto DOM; context loss y módulo GSAP ausente permiten resultado estático. Viewports 320/390/1280 sin desbordamiento horizontal en la arena medida. Navegación URL, filtros/equipo/consumibles, causas de error, contraste/zoom/lector y aceptación completa siguen pendientes. No interpretar correcciones parciales como certificación.

Web Design Guidelines aplicada sobre App.tsx/styles.css, [fuente actual consultada](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Playwright CLI propio y captura 390×844 inspeccionados. Es revisión parcial, no certificación WCAG o sustitución de pruebas con lector/móvil físico.

- `src/arcana/presentation/App.tsx` — confirmación de nodo necesita gestión de foco/apertura/cierre y retorno a destino válido tras consumo; panel actual no atrapa teclado.
- `src/arcana/presentation/App.tsx` — falta enlace de salto al contenido y navegación/vista recuperable por URL.
- `src/arcana/presentation/App.tsx` — mensaje de error genérico; añadir causas/recuperación específicas, estado vacío de selección/stock y foco al error pertinente.
- `src/arcana/presentation/App.tsx` — presentación concentrada en un archivo; extraer vistas/control de reproducción manteniendo controller y dominio independientes.
- `src/arcana/presentation/styles.css` — foco visible y controles >=44 px presentes; falta medir contraste/200%/320 px y comprobar que barra fija no oculta foco/contenido.

La lista permite acciones por teclado nativo y controles DOM; mapa ramificado y arena animada siguen sin implementar. Mensajes por claves es/en y parámetros/plurales introducidos antes de entregar esta UI. No imágenes externas/textos raster, audio o animación automática en este bloque. Los estados de servidor son autoridad; resultado de combate en DOM no es reproducción Pixi.

Referencias técnicas preparadas para siguiente bloque: [Application PixiJS v8](https://pixijs.com/8.x/guides/components/application) y [GSAP context](https://gsap.com/docs/v3/GSAP/gsap.context()/), consultadas; aún no instaladas o usadas. No prueba de FPS por tamaño de bundle o captura.
