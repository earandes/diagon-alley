# A56 · Rutas variables, mapa central y seis nodos jugables

15 octubre 2026. Implementado y verificado localmente sobre ARCANA. [Contrato previo y revisión nodo por nodo](CONTRACT.md), [galería antes/después](GALERIA.md), [escenarios y propuestas de balance](BALANCE.md), [diseño vigente](../../../DESIGN.md). Sin publicación, despliegue, commit o push. Feedback del propietario; no sesión con usuarios completada.

## Tres mejoras implementadas

1. **Mapa como tablero completo.** Ocupa el espacio entre HUD y navegación, sin scroll, paneo ni salto tras cada recibo. Disposición vertical en estrecho y horizontal en ancho/bajo;16 nodos visibles. Fondo ilustrado de Pasaje, color propio por evento y siluetas claras; estado disponible con halo/rombo y visitado con marca. Retratos del equipo en franja inferior, estadísticas por hover/foco/toque. Región, ayuda y recibo ocupan franjas libres. Inspección visual detectó y corrigió solapamientos en320px; las pruebas comprueban ahora controles dentro del header y ausencia de intersecciones con nodos.
2. **Rutas nuevas elegidas por autoridad.** Generador restringido v1 permuta IDs/planes completos y conexiones, conservando cantidades, premios y claves de primera victoria. Semilla y versión se guardan en la expedición antes de responder. El primer Pacto y las alternativas tempranas se conservan por formación; la rama del Cofre temprano conduce a un Pacto para asegurar tres miembros antes de combatir. Posiciones/conexiones posteriores varían. Todas las ramas alcanzan al jefe. Recarga/reintento no sortean otra ruta. Las partidas previas sin metadatos conservan su grafo; no se reescriben. Cambios futuros del generador deben versionarse y conservar la reproducción v1.
3. **Preparación con decisiones y resultado verificable.** La selección no escribe; el sello confirma la intención. Preparación opcional de Grageas plegada por defecto, con reserva/cantidad elegida; los rivales usan los mismos assets que la arena y la confirmación queda visible. Elecciones bloqueadas mientras se envía/recupera para no aparentar que cambia una operación pendiente. Nuevos campos opcionales pasan validación de intención IndexedDB, HTTP, autoridad y recibos; una misma clave con otra elección da conflicto. Cancelar inspección conserva estado, cerrar una operación pendiente no revierte un commit.

| Nodo | Presentación y mecánica implementadas | Cobertura específica |
|---|---|---|
| Duelo | Varitas rubí, tres rivales con PV/poder, coste5 y botín de victoria real, reducido si ya se ganó ese nivel; Grageas opcionales plegadas tras el frasco, sin dominar la preparación | Recorrido conectado, preparación/consumo y replay |
| Refugio | Frasco esmeralda; elegir vida o maná; cifras antes→después por aliado | ES/EN, preview/guardado/recarga; límites de PM y reintento/conflicto unitarios |
| Cofre | Cofre ámbar; contenido fijo visible antes de confirmar | Entrega conectada,10 Coronas actuales y recarga |
| Pacto | Aliado amatista, retrato/sello temporal; reclutar o pasar con tres miembros; a cinco, sustituir solo temporal o pasar | Reclutamiento conectado; fixture unitario de equipo lleno protege copias propias y rechaza sustitución de propio |
| Encuentro | Dado turquesa; arriesgar o pasar, ayuda a demanda; pasar no adquiere semilla ni entrega/daña/cura | ES/EN conectado, pérdida real de respuesta tras commit, recuperación con misma elección; contador de semillas unitario |
| Jefe | Torre/corona carmesí, rivales y recompensa de primera/repetida victoria | Jefe→llave→bóveda conectado; desbloqueo y recibo tras recarga |

Refugio mantiene40% PV como opción predeterminada. PM40% solo para unidades en pie es nueva hipótesis de ensayo, elegida por simetría con la escala existente; no balance validado. Pacto mantiene la identidad/pool actual, no crea copia permanente. Encuentro arriesgado conserva sus pesos/efectos. La ruta continúa usando una sola región; [regiones incrementales futuras](../REGIONS-ROADMAP.md) pendientes de contenido y calibración.

## Persistencia, economía y compatibilidad

No se modifican precios, tablas de sorteo, recompensas base, stats de catálogo/combate, esquemas o adaptadores PostgreSQL/Redis. [18 archivos comparados con A55 y ambos Word con su referencia registrada](economy-persistence-reference.json). Sí cambian los casos de uso para generar rutas nuevas y aplicar elecciones explícitas; no se afirma que toda la autoridad sea idéntica.

El grafo guardado y los recibos anteriores permanecen válidos. Seeds solo se adquieren dentro del flujo autorizado; `StartRun` confirmado se recupera incluso con configuración indisponible sin adquirir otra semilla. Resolver/consumir/premiar/progresar sigue en la misma transacción. Una respuesta perdida se recupera desde el recibo canónico; los casos nuevos comprueban que IndexedDB termina sin intención pendiente y sin segundo POST. No se importan saldos locales ni se modifican partidas existentes para balancear.

La topología cambia la exposición a eventos aunque los números base coincidan. Se compararon6000 recorridos sintéticos, tres prioridades y grafo fijo/variable, suponiendo victorias: [datos](route-scenarios.json). No son tiempos de sesión, victorias observadas ni retención. No se aplican las propuestas pendientes.

## Arte y herramientas

Paquete visual v5: seis SVG de nodos y dos apoyos (`ui.health`, `ui.pass`),256×256, alfa/pivote común,6.327 bytes de fuentes en total. [Autoría, alternativas y estado provisional](../../../src/arcana/presentation/content-packs/arcana/art/icons/A56-SOURCES.md). Composición local original, sin recursos externos nuevos ni servicios/créditos de generación. Se reutilizan escenas y retratos A50/A55 con sus registros anteriores.

Guías locales leídas/aplicadas: game-ui-ux, PixiJS, RPG y Game Design Workshop; perfiles Game Designer/Economy Designer como criterios de agencia, bloqueos y sensibilidad. PixiJS conserva paths/render por eventos; Motion mini existente da respuesta de selección y respeta movimiento reducido. Playwright CLI se usó para estado inicial, captura y medidas DOM; Playwright Test para flujos y WebGL real. No se instalaron nuevas dependencias ni herramientas globales. Orígenes/licencias existentes en `tools/arcana/design-tools-sources.json`.

## Verificación ejecutada

Entorno: macOS27.0.1, Node24.20.0, Playwright1.64.0, Chromium156 y WebKit27.2. PostgreSQL/Redis locales reales, namespaces de pruebas independientes. Las extensiones A56 separan sus sesiones en5191/5193 de los recorridos anteriores5189/5192; se conserva el límite real30 entradas/hora. No se elimina ni aumenta para hacer pasar la suite.

| Comando | Resultado | Evidencia |
|---|---|---|
| `npm run build` | Compila; incluye validación completa del paquete y typecheck | [build.log](build.log) |
| `npm run typecheck` | Correcto tras cambios finales | [typecheck.log](typecheck.log) |
| `npm test` |319 correctos en39 archivos;23 históricos y296 ARCANA | [unit.log](unit.log) |
| `npm run test:integration` |36 correctos en7 archivos, servicios reales | [integration.log](integration.log) |
| `npm run test:e2e` |74 correctos en Chromium/WebKit, ES/EN | [browser.log](browser.log) |
| Reejecución de recuperación tras bloquear elecciones pendientes |4 correctos; mismos casos, no sumados | [browser-recovery.log](browser-recovery.log) |
| `npm run test:arcana:browser` |20 correctos, fixtures de arena/cliente/contraste | [harness.log](harness.log) |
| `npm run test:pwa` |12 correctos, shell/offline/actualización/recuperación | [pwa.log](pwa.log) |
| `npm run verify:arcana:build` | Correcto;9.134.054 bytes distribuidos | [build-scan.log](build-scan.log) |
| `git diff --check` | Sin errores en diff rastreado; archivos nuevos cubiertos por build/checks específicos | [diff-check.log](diff-check.log) |

La última pasada completa tras la interrupción terminó con74/74 recorridos y12/12 PWA; integración real reejecutada36/36. El diagnóstico `browser-interrupted.log` corresponde a la detención del entorno local, no se cuenta como pasada correcta. Los servicios se reanudaron con sus volúmenes existentes.

**106 casos de navegador distintos** =74+20+12, sin sumar reejecuciones. RED previo en [generación/disposición](red.log), [intención local](red-pending.log) y [bloqueo pendiente](red-choice-lock.log), además de [preparación de combate](red-combat-preview.log). Los diagnósticos intermedios se conservan; no se presentan como pasadas correctas. Fallos corregidos: rivales sin asset de preparación, Grageas ocupando la ventana, intención local que rechazaba campos nuevos, devolución de foco, cierre del recibo, solapamiento a320px y aislamiento de cuotas en pruebas.

Cobertura nueva:100 semillas válidas con variación, mismo conjunto de IDs/tipos, ruta reproducible y sin mutación de configuración; persistencia tras respuesta perdida; restricciones de formación/propio-temporal; PM limitado; pasar sin azar; elección inválida rechazada antes de gasto; proyección pública inmutable sin metadatos privados; formatos previos aceptados. Interfaz:16 nodos/6 assets, targets≥44px y sin scroll/intersecciones a1440×900,390×844,320×640,320×568 y844×390. Teclado, foco devuelto, lista equivalente, WebGL ausente/contexto perdido, arte ausente y ajustes de movimiento reducido cubiertos en suites correspondientes. No se atribuye a un teléfono físico la emulación de viewport.

## Rendimiento y límites

[Medición de build y mapa](performance.json): shell/recursos visibles únicos2.023.691 bytes sin comprimir, +14.139 respecto de A55; el total distribuido crece los mismos14.139 (+0,16%). No es una medida de transferencia3G o latencia real. En reposo, contador Pixi3→3 durante500ms; no ticker permanente nuevo. Las ocho fuentes SVG pesan6,3kB.

[Chromium con cinco unidades por bando](five-unit-chromium.json) y [WebKit](five-unit-webkit.json): muestras10s por tamaño320/390/1280, aproximadamente60FPS, p95 máximo19ms, cero frames>25ms en estas muestras. Diez texturas de arte,7.004.160 bytes decodificados; heap JS Chromium~37,3MB, WebKit no lo expone. Fixtures de arena sobre este Mac, no rendimiento garantizado en móvil físico ni consumo total de memoria.

Sin aceptación global WCAG, lector hablado, Firefox o instalación PWA en hardware nuevo. A53 sigue pendiente de observación de resolución con Enric: la inspección automatizada y la revisión visual del asistente son evidencia técnica. Reconocimiento de iconos, motivación y ritmo necesitan esa sesión. Dispositivo indicado por Enric para la sesión guiada: ordenador. El arte permanece provisional; no acredita permisos de distribución temática. Sin publicación.

## Reproducir capturas y escenarios

- Galería: las pruebas `visual-nodes.spec.ts` capturan ambos idiomas y motores en `captures/`.
- Pactos/rivales/jefe: `ARCANA_CAPTURE_URL=http://127.0.0.1:5194 node tools/arcana/capture-visual-nodes.mjs`; crea su propia sesión técnica, no reutiliza la partida del propietario.
- Peso/reposo: preview del build en5197 y `ARCANA_CAPTURE_URL=http://127.0.0.1:5197 node tools/arcana/measure-visual-nodes.mjs`.
- Escenarios: comando exacto en [BALANCE](BALANCE.md). No escribe cuentas o partidas.

Ejecutar build antes de suites de navegador, sin build concurrente sobre la caché Vite compartida. Las capturas no demuestran por sí solas persistencia; esta se acredita separadamente con casos de uso, integración real y recuperación conectada.
