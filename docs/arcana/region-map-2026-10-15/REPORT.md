# A55 — Región ilustrada y equipo a demanda

15 octubre2026. Implementado localmente a partir del feedback de Enric. [Contrato previo](CONTRACT.md), [capturas antes/después](GALERIA.md), [visión incremental por regiones](../REGIONS-ROADMAP.md), [diseño](../../../DESIGN.md). Sin publicación/despliegue, commit o push.

## Implementado

- Pixi deja de dibujar el pergamino opaco. `scene.passage` ocupa el área real de ruta, bajo aristas y sellos; entrada ilustrada antes de iniciar. Las acciones del grafo y la lista equivalente conservan IDs, adyacencia y reglas. Fondo ausente o WebGL fallido no bloquean el recorrido.
- Equipo en una fila de retratos, barra de vida y emblema propio/temporal. Ficha flotante por hover, foco, Enter o toque con PV/PM, poder, velocidad, equipo y sinergias. Hoverable, cierre por Escape/fuera/segundo toque o botón, retorno de foco y límites del viewport. Inspección vinculada al ID de copia/unidad: dos magos iguales conservan datos de instancia distintos.
- Se retiran del estado normal los nombres/estadísticas de miembros, títulos duplicados y nombres de nodos repetidos. Nombre de región, recursos y contador breve permanecen. Nombres de nodo por foco/tooltip o lista; guía textual por ayuda. Recibo plegado con objeto/sello/cifras visibles; el detalle conserva narrativa, cantidades, replay y desbloqueo. El receipt ya no desplaza automáticamente fuera del mapa; la ruta ajusta scroll respetando el menú fijo.
- Paquete v4: registro visual opcional `regions` por ID autoritativo, solo nombre bilingüe y referencia de arte validada. Sin generación de campañas, dificultad o pools en el cliente. Una sola región configurada/jugable.

## Futuro documentado, sin implementar

Regiones sucesivas con paisajes, magos/rivales/encuentros y complejidad propios. La siguiente debe aportar decisiones, no solamente repetir un fondo o aumentar estadísticas. Bosque se guarda hoy como desbloqueo al vencer al jefe, pero no tiene ruta nueva jugable. [Roadmap](../REGIONS-ROADMAP.md) separa dirección aprobada de grafos/pools/curvas/transición pendientes.

La aspiración Harry Potter sigue compatible con contenido sustituible A50; este incremento conserva ARCANA activo y no produce un catálogo alternativo. No cambia economía, equipo temporal/propio, duplicados, probabilidades, precios, energía, stats o botines. No inventa observaciones de la sesión A53: se recibió feedback del propietario, sin resultados de resolución del objetivo1 todavía.

## Recursos y herramientas

Reutiliza escena, retratos, props y medallones A50/A54. Cero nuevos raster y cero nuevas dependencias. [Procedencia y hash de la escena reutilizada](asset-reuse.json), fuentes/licencias anteriores conservadas. Sin generación con créditos ni APIs de pago.

Skills locales game-ui-ux, pixijs-rendering y Taste/rediseño; React/DOM para controles/ficha, Pixi8 transparente para rutas. Playwright CLI inspeccionó la página real; Playwright Test verificó flujos/estado. La ficha es estática, no añade ticker ni movimiento obligatorio; GSAP/Motion y sus garantías previas continúan. No se ha usado Impeccable para atribuir otro detector ejecutado en este incremento.

## Verificación y evidencia

macOS27.0.1, Node24.20.0, Playwright1.64 Chromium/WebKit; PostgreSQL/Redis reales locales. [56 hashes de autoridad/configuración/Word conservados](authority-unchanged.json). Inspeccionar/navegar/idioma/lista y recargar dejan el mismo estado confirmado ([comparación ES/EN](capture-observations.json)). Pruebas nuevas de interfaz escritas antes del código fallaron por ausencia del control de retrato ([RED](red.log)); validación extra de registro regional es refuerzo posterior.

| Check | Resultado / evidencia |
|---|---|
| Unidad | 308 correctos ([log](unit.log)) |
| Integración SQL/Redis | 36 correctos ([log](integration.log)) |
| Browser de recorridos | **54 correctos**, incluyen4 nuevos es/en en ambos motores ([log](browser.log)); [revalidación de controles](controls-final.log) tras ajuste final de altura de entrada |
| Harness de arena/persistencia/contraste | 20 correctos ([log](harness.log)) |
| PWA | 12 correctos ([log](pwa.log)); puerto aislado5196 |
| Tipos/validación de paquete/build | [build.log](build.log),147 assets registrados |
| Contenido distribuido | [scanner](build-scan.log) |

Cobertura: hover→ficha sin perderla al mover cursor, foco/Enter/cierre/retorno, toque/instancias temporales repetidas, cambio de idioma, reducido,320/390/1280px y texto200%, inspección sin comando, lista sin WebGL, formación/combate/recompensas/compra/apertura/equipamiento/jefe/bóveda, recarga y recuperación.

Regresiones encontradas y resueltas: ancho heredado de h2 oculto causaba overflow; primer nodo quedaba bajo navegación al retirar el scroll de mapa; recibo compacto podía recortarse al reubicar la ruta. Se conservaron assertions de accesibilidad/visibilidad y se ajustó layout. El test que exigía nombre siempre visible se actualizó al retrato accesible, de acuerdo con A55; la inspección nueva sí comprueba sus datos. [Primera ejecución amplia](browser-initial.log), [reajuste de layout](browser-layout-attempt.log), [recibo final](hud-layout-final.log); intentos instrumentales con lectura antes de ready y etiqueta de mapa antigua se corrigieron, no se atribuyen al producto. Una revalidación adicional recibió504 `Outdated Optimize Dep` al compartir caché Vite durante compilación ([log](controls-cache-conflict.log)); se repitió tras finalizar el build,4 controles correctos. El servidor de revisión se reinició después de todos los builds, conservando su namespace y estado.

## Rendimiento y límites

Paquete usa la imagen ya existente, sin duplicar descarga de raster. Artefacto completo9.119.915 bytes; inicial compilado shell/bienvenida390px **2.009.552 bytes sin comprimir**, inferior al objetivo3MB ([medición](performance.json)); cantidad de draws del mapa en reposo anotada antes/después de500ms. Perfiles de cinco unidades por lado/diez texturas: [Chromium](five-unit-profile-chromium.json), [WebKit](five-unit-profile-webkit.json);59,80–60,02FPS en Mac headless,320/390/1280px. No es rendimiento de teléfono físico. El mapa conserva el contador3→3 durante500ms en reposo; arena pausada no añade draws. No es latencia de red móvil ni transferencia comprimida.

Capturas no acreditan persistencia; la comparación de estado y SQL/Redis sí cubre los contratos probados. No se han hecho nueva sesión moderada, pruebas en móvil físico, lector hablado o despliegue; esos pendientes no se cierran con automatización.
