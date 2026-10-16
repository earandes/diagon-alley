# A52 · Acabado y orientación del ensayo

14 octubre 2026. Autorización: encargo actual de Enric de instalar/utilizar herramientas gratuitas e implementar mejoras; sin publicación. Se conserva Teatro de alquimia A50. Estado inicial: React/DOM para HUD/tiendas/colección, PixiJS8 para mapa/arena, GSAP para apertura; PostgreSQL/Redis locales disponibles. Exploración, pacto, combate, botín, Cromodex, equipo, consumibles, forja y bóveda ya conectados. No hay intercambio de duplicados, segunda campaña ni audio.

Recorrido: iniciar ensayo → iniciar ruta → pactos hasta formación suficiente → elegir nodo → confirmar → leer resultado → comprar/abrir → inspeccionar/equipar → continuar. Se mejora su orientación/jerarquía, sin nuevo comando económico. Guía derivada del estado confirmado, retratos de equipo, rareza con forma/texto/estrellas, progreso de identidades separado de copias, estado de equipo y feedback postreceipt.

Persistencia: inventario, copias, HP/PM, run y receipts siguen exclusivamente en servidor. Guía/animación no escriben ni recalculan resultados. Cambiar idioma, reducir movimiento, recargar o fallar arte no consume ni duplica. Fallo de operación no puede generar feedback de éxito; recuperación vigente intacta. Textos/timings/assets sustituibles por paquete A50.

Aceptación es/en: guía cambia con pactos/run terminado y muestra solo opciones reales; controles conservan nombres/foco; progreso no cuenta repetidos como identidades nuevas; equipo temporal diferenciado; compra/equipamiento confirmado visible una vez por receipt; navegación/idioma no reanuncian éxito. Reduced-motion deja feedback estático sin transformaciones. 320/390/1280 y texto200% sin overflow global. Canvas se verifica con capturas y estado autoritativo, además del DOM.

Recursos: reutilizar retratos/escenas existentes; familia SVG propia de cuatro emblemas de rareza, con silueta/encuadre/stroke comunes y manifest. Solo Motion libre/MIT (mini) en DOM, sin Motion+; herramientas locales con SHA/licencias. Simulaciones separadas leen configuración vigente y escriben informes, nunca datos guardados. Propuestas de precios/pesos/utilidad de copias pendientes de calibración/usuarios y autorización antes de aplicar.

Pruebas: RED/GREEN de proyección de guía y navegador para feedback/idioma/reducido/estado; suites existentes dominio, integración real SQL/Redis, browser/PWA; build/scanner/paquete. Medición local de renderer/carga con sus límites. Arte/estilo no se consideran aprobados por tests, ni viewport emulado como móvil físico.
