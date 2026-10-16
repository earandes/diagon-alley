# A54 — ARCANA mediante objetos ilustrados

14 octubre 2026. Incremento implementado en repositorio, sin commit, push, publicación o despliegue. [Contrato previo](CONTRACT.md), [antes/después](GALERIA.md), [dirección y movimiento](../../../DESIGN.md).

## Qué cambió

1. **Identidad de juego en la interacción:** navegación por medallones, HUD de objetos/cifras, guía de ruta visual y ayuda a demanda, equipo mediante retratos con gema propia/reloj de arena temporal. Pacto y recompensas muestran personajes/objetos. Casilla de movimiento sustituida por medallón con sello.
2. **Objetos seleccionables:** maderas/núcleos en bandejas, receta pulsable con coste numérico, compras ilustradas, filtros por emblemas y equipamiento por objetos. `VisualChoices` conserva teclado, nombres es/en, aria-pressed y confirmaciones existentes. Ningún input/select/textarea en las vistas actuales.
3. **Preparación y respuesta:** cada aliado recibe sus frascos mediante assets, selección única y cancelable. Cero frascos presenta objeto/cifra0 sin selectores vacíos. Sello + contorno + elevación breve de5px/200ms, cancelación al sustituir/reducir/desmontar, sin retrasar entrada. La preferencia propia se propaga a controles ya montados; sistema/ajuste propio muestran equivalente estático.

Se mantiene Teatro de alquimia A50. Nombres, costes, PV/PM, errores y acciones breves siguen siendo texto funcional; reglas, lore y probabilidades se consultan a demanda. No se hornea texto dentro del arte ni se elimina accesibilidad para cumplir la dirección visual.

## Herramientas y recursos

Skills locales game-ui-ux/game-feel para interacción/feedback; Impeccable context y detector mecánico (una pasada, [cero hallazgos](design-detect.json)) para acabado. Playwright CLI inspeccionó/capturó la vista real; Playwright Test comprobó recorridos. Motion mini gratuito para selección; GSAP/Pixi conservan apertura/combate. No se necesitaban nuevas dependencias ni instalaciones globales. A52 conserva versiones/licencias en `tools/arcana/design-tools-sources.json`.

Diez SVG originales editables: nueve medallones y un marco; [manifest con autor/herramienta/dimensiones/pivotes](asset-manifest.json). Reutiliza props/retratos A50, sin raster nuevo, servicios con créditos o APIs de pago. Material original del proyecto, sin recurso externo nuevo que atribuir; no se infiere autorización de distribución a partir de este registro.

## Integridad y gameplay

Navegar, filtrar, elegir material/equipo/frascos, cancelar y cambiar idioma no escribe ni gasta. Guardar/confirmar sigue usando el controlador y los casos de uso existentes; éxito solo después del receipt. [56 fuentes de autoridad/configuración/Word comparadas](authority-unchanged.json): sin cambios. No se migraron o editaron partidas, precios, probabilidades, costes de energía, progresión o reglas de duplicados. Las sesiones técnicas creadas por pruebas se aíslan por contexto/namespace.

A53 mantiene su revisión técnica del bucle y moderación. Enric corrigió dispositivo a **ordenador** y pidió esta dirección visual. Todavía no comunicó resolución del primer objetivo: no hay entrevista completada, dudas observadas ni tiempos de usuario. Las tres áreas anteriores responden a su dirección explícita; no se presentan como tres hallazgos de playtest. El diseño de rutas, utilidad de duplicados y ritmo necesitan retomar esa sesión. Propuestas de economía A52 siguen aisladas, sin aplicar.

## Verificación

Entorno macOS27.0.1, Node24.20.0, Chromium/WebKit Playwright1.64, PostgreSQL/Redis locales reales. ES/EN y 320/390/1280px, texto200%, arte ausente, selección por teclado, preferencias de movimiento, cancelación/idioma/recarga sin gasto, equipamiento guardado, frasco único/consumo, jefe y bóveda. Capturas automáticas: [sin errores JS, previews y recargas intactos](capture-observations.json). El401 inicial sin sesión es respuesta esperada de `/api/state`, no excepción JS.

| Check | Evidencia |
|---|---|
| 307 unitarios | [unit.log](unit.log) |
| 36 integración SQL/Redis | [integration.log](integration.log) |
| 50 recorridos Chromium/WebKit | [browser.log](browser.log) |
| 18 harness correctos y 2 contraste corregidos | [harness.log](harness.log), [contrast-final.log](contrast-final.log) |
| 12 PWA | [pwa.log](pwa.log), [config de puerto aislado](pwa-config-used.ts) |
| Tipos, paquete y build | [build.log](build.log) |
| Scanner de distribución | [build-scan.log](build-scan.log) |

Prueba nueva falló antes de implementar por checkbox presente ([RED](red.log)). La primera ejecución amplia detectó medidor móvil oculto con display:none y foco sin fallback de token en harness; ambos corregidos, sin debilitar assertions. [Primer recorrido](browser-initial.log) y harness conservan esos fallos para trazabilidad. Inspección visual corrigió además alto del HUD y estilos antiguos de selección.

## Rendimiento y límites

Artefacto completo **9.108.805 bytes**, assets a demanda. Bienvenida390px + shell cacheado: **1.998.442 bytes sin comprimir**, por debajo del objetivo3MB ([medición](initial-download.json)); A52 medía1.936.569, diferencia61.873 bytes. No equivale a transferencia comprimida o latencia móvil. Perfiles de arena de diez texturas/cinco unidades por lado y parada de render al pausar: [ejecución](performance.log), [métricas Chromium](five-unit-profile-chromium.json). Chromium mide60,00FPS, p95 de frame16,7–16,8ms en320/390/1280px, diez texturas y sin desbordamiento; máquina de escritorio, sin objetivo de FPS impuesto por la prueba. No se añade otro ticker ni audio.

No prueba dispositivo físico, lector de pantalla hablado, instalación PWA nativa, red móvil o comprensión del jugador. Capturas/perfiles técnicos no cierran esos pendientes. Sesión humana de10–15min pendiente de respuesta al objetivo1; se reanudará sobre esta interfaz con objetivos sin anticipar soluciones.
