# ARCANA · A52 implementado y verificado localmente

14 octubre 2026. Encargo actual de Enric; [contrato previo](CONTRACT.md), [diseño vigente](../../../DESIGN.md), [galería antes/después](GALERIA.md). Sin publicación, despliegue, commit o push. Se mantiene Teatro de alquimia A50; las mejoras están en el repositorio y en el build local de `http://127.0.0.1:5195/`.

## Qué cambió

- La acción inicial aparece antes del detalle del equipo. Guía contextual para iniciar, reclutar, preparar formación, elegir ruta y terminar por victoria/derrota/empate. Solo sugiere Pacto si existe una opción alcanzable. Cuenta etapas de la ruta, no ramas como pasos obligatorios.
- Equipo con retratos reutilizados del lote A50, origen propio/temporal, PV/PM y equipo desplegable; se elimina la repetición de nombres de objetos. Datos y snapshots siguen en servidor.
- Nodos disponibles con contorno, estado textual y efecto/coste breve. Espacio inferior del mapa adaptado al alto medido de etiquetas; el primer nodo queda sobre la navegación también tras iniciar.
- Cromodex separa identidades y copias, muestra «En tu equipo» y explica cómo usar duplicados. Cuatro SVG de rareza editables de la misma familia, nombre/estrellas y marco discontinuo para pendientes. [Manifest](asset-manifest.json). No se regeneró el lote ilustrado ni se usaron créditos.
- Compra, selección de formación y equipamiento confirmados con región visible y anuncio único por receipt. Motion mini solo después de confirmación; idioma/refresh no repiten anuncio, petición pendiente/error oculta el banner previo. Reduced-motion deja resultado estático.
- Forja/Bóveda destacan su acción y coste existentes. Pulsación breve CSS, contraste continuo en botones activos y marco del resumen de combate alineado al sistema.
- Paquete de presentación v2: **296 mensajes es/en, 30 personajes, 137 assets y tres relatos** validados. IDs, datos económicos y Word conservados.

## Revisión inicial y herramientas utilizadas

Se leyeron AGENTS, PRD completo/decisiones, README, contratos mecánicos, matriz de requisitos/aceptación, producción A49/A50, fuentes y componentes. No hay un backlog independiente vigente identificado: se utilizan REQUIREMENTS-STATUS, incertidumbres U25/U26 y pendientes del informe A50. El stack real es React19/TypeScript/Vite, PixiJS8, GSAP, Fastify, PostgreSQL y Redis; interfaz híbrida DOM/Canvas, no un motor nuevo. Exploración, Pactos, combate, colección/equipo, Sapos/Grageas, forja y bóveda estaban conectados. Se conservan esos sistemas, no se declara inventar módulos que ya existían.

Se ejecutó/inspeccionó primero el preview existente5190 con CLI y capturas es/en. Las primeras capturas precipitadas de escritorio se sustituyeron antes de la entrega por tomas390px con arte decodificado. La comparación publicada muestra estados equivalentes de inicio (50 Coronas/una copia), en sesiones distintas; no se editaron saldos para igualarlos.

| Herramienta | Instalación/licencia | Uso concreto |
|---|---|---|
| [Impeccable](https://github.com/pbakaus/impeccable) | Skill local `arcana-impeccable`, Apache2.0, SHA fijado | Contexto real del launcher; polish/craft-floor/animate/onboard; jerarquía, estados, contraste. Detector real una pasada: una advertencia de borde lateral3px del resumen; sustituido por contorno1px. El JSON conserva la advertencia original, no se presenta como un scan limpio |
| [Taste](https://github.com/Leonxlnx/taste-skill) | `arcana-redesign-skill`, MIT, SHA fijado; instalación A28 conservada | Auditar antes de editar, conservar identidad, tipografía, densidad, pressed/focus y componentes existentes. No defaults de marketing, nueva imagen o fuente externa |
| [Awesome Gamedev](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) | Solo game-feel, game-ui-ux, pixijs-rendering y RPG; Apache2.0, SHA fijado | Feedback proporcional, safe-area/foco, estado derivado por eventos; Pixi v8 y renderer separados del estado. RPG guía las decisiones equipo/ruta, sin adoptar XP/presets o cambiar motor |
| [Agency Agents](https://github.com/msitarzewski/agency-agents) | Dos perfiles de texto en `tools/arcana/design-guides`, MIT, SHA fijado | Game Designer: objetivo/decisión/consecuencia por sesión. Economy Designer: fuentes/sumideros y escenarios. No agentes externos ejecutados ni monetización nueva |
| [Game Design Skills Suite](https://github.com/Wilson520403/game-design-skills) | Workshop local + runtime mínimo de probabilidad/economía/contratos, MIT, SHA fijado; biblioteca estándar Python | Diagnóstico playcentric; módulo de dados uniforme y `simulate_economy` realmente ejecutados; simulación específica reproducible. Heurísticas/calibración separadas de reglas |
| [Motion](https://github.com/motiondivision/motion) | **14.2.0**, dependencia exacta/lock, MIT | `motion/mini`/WAAPI para confirmación de operación; cancelación/reducido. Sin Motion+; GSAP/Pixi conservan apertura y arena |
| [Playwright CLI](https://github.com/microsoft/playwright-cli) + Test | CLI local existente **0.1.22**, Apache2.0; Test1.64.0 | Sesión propia `arcana-feel`, snapshots/acciones/capturas/medición de carga. Suites y script de captura sobre estado SQL/Redis real. No se añadió MCP redundante |

[Revisiones exactas/licencias/rutas](../../../tools/arcana/design-tools-sources.json), [guía local y adaptaciones](../../../.agents/skills/README.md). Las cinco fuentes solicitadas se consultaron en sus repositorios oficiales actuales y se descargaron por revisión. Licencias conservadas como UPSTREAM-LICENSE o LICENSE. Impeccable motor con cache aislada `IMPECCABLE_HOME` dentro de `.tools`, sin hooks/globales; no servicios de pago o generación con créditos. No se instaló un motor para justificar una skill.

## Comprobaciones finales

Mac, Node24.20.0; npm11.19.0, dependencias locales con lock. PostgreSQL16.9 y Redis7 reales en servicios Docker `arcana-local` ya disponibles, puertos55432/56379 loopback. Gateways/namespaces de ensayo propios; no manipularon las partidas de Enric.

| Comando real | Resultado final | Evidencia |
|---|---|---|
| `npm test` | **307** correctos, incluidos23 históricos y tres nuevos de guía | [unit-final](unit-final.txt) |
| `npm run test:integration` | **36**, SQL/Redis reales | [integration-final](integration-final.txt) |
| `npm run test:e2e` | **44**, Chromium/WebKit, es/en | [browser-final](browser-final.txt) |
| `npm run test:arcana:browser` | **20**, fixtures de cliente/arena/carga/contraste | [harness-final](harness-final.txt) |
| PWA con configuración equivalente en5196 | **12**, Chromium/WebKit, build/SW/red/offline/recovery | [pwa-final](pwa-final.txt), [configuración usada](pwa-config-used.ts) |
| `npm run build` | Tipos app/worker, validación de paquete y build correctos | [build-final](build-final.txt) |
| `npm run verify:arcana:build` | Correcto, **9.079.926 bytes** de catálogo/artefacto completo | [scanner-final](scanner-final.txt) |
| `node tools/arcana/capture-game-feel.mjs` | Recorrido real es/en, sin errores JS; navegar/recargar conserva exactamente estado | [observaciones](capture-observations.json), [galería](GALERIA.md) |
| `python3 tools/arcana/simulate-balance.py` + módulo de suite | Escenarios reproducibles, sin escribir servidor | [gameplay](GAMEPLAY.md) y [resultados](balance-scenarios.json) |

**76 casos de navegador distintos**, sin sumar reejecuciones. Canvas no se valida solo por árbol accesible: screenshots, renderer WebGL/texturas, pausa/frames y estado autoritativo leído por API complementan el DOM.

RED de la guía conservado en [cue-red](cue-red.txt); GREEN y suite final la verifican. Las pruebas UI A52 son refuerzos posteriores, no se reconstruye una secuencia RED ficticia. Las suites completas detectaron contraste transitorio y primer nodo demasiado bajo; reparados antes del pase final44/44. Un perfil falló por HMR durante edición, no se usa como métrica final. [Fallos conservados](browser-before-repairs.txt). El primer test A52 tenía un selector exacto de label incorrecto y una ruta de fallo mal nombrada; se corrigieron, y la suite final intercepta `/api/purchases` y comprueba cero éxito/cero mutación al rechazar.

PWA se ejecutó en5196 para conservar el preview existente5190. Primer wrapper temporal arrancó desde su subcarpeta y no encontró `dist`; se corrigió `webServer.cwd`, sin cambiar configuración original ni tomar el puerto del usuario. El log de setup fallido se conserva. Las capturas iniciales de desarrollo incluyen401 esperado antes de crear sesión; capturas finales no tienen errores JS nuevos. No atribuir HMR, errores HTTP inyectados o capturas antes de decodificar a defectos del build final.

## Rendimiento y accesibilidad comprobados

- **1.936.569 bytes iniciales sin comprimir** al sumar URLs únicas visibles y cuerpos reales del shell cacheado, excluyendo API. Inferior al objetivo3MB. El total9,08MB corresponde al catálogo distribuido a demanda, no a la bienvenida. Incremento frente a A50:22.872 bytes. [Medición CLI](download-initial.txt); no es latencia de red móvil ni memoria GPU.
- Cinco unidades por lado, diez texturas ilustradas distintas, tres tamaños, muestras10s: **60,00–60,03 FPS** locales, sin frames>25ms en las muestras guardadas. La pausa detiene renders reales. [Chromium](five-unit-profile-chromium.json)/[WebKit](five-unit-profile-webkit.json). No renderer económico nuevo, ni carga de treinta figuras en GPU. El conjunto se ejecutó en Mac headless, con otros servicios locales; no demuestra 60FPS en teléfono o carga térmica sostenida.
- Vistas320/390/1280, ambos idiomas, texto200%, teclado/foco, reduced-motion, arte/WebGL/GSAP ausentes y recarga probados en suites pertinentes. El feedback nuevo respeta preferencia propia y de sistema; las pruebas A52 verifican explícitamente la del sistema, y las suites existentes ejercitan la propia. No se declara certificación WCAG, lector audible, zoom nativo o PWA instalada físicamente.

## Conservación y pendientes

[56 archivos de autoridad/configuración/Word cotejados](authority-unchanged.json) con la huella A50: **ninguno cambiado**. Solo presentación, herramientas, pruebas y documentación; sin migración, cambio de saldo, pérdida de copias o nueva economía. Los binarios del motor de herramientas/cache quedan aislados e ignorados. No staging general ni borrado/reset de trabajo previo.

[Propuestas de balance](GAMEPLAY.md): precios8/10/12 y pesos comunes×2 comparados fuera del juego. A20 aperturas, el modelo actual produce14,61 identidades nuevas medias y5,39 duplicados; son hipótesis con supuestos explícitos. No se aplica rebalanceo, canje o garantía. Pendiente calibración con juego observado, pruebas físicas/lector y aceptación de arte por el usuario. Sin despliegue o servicios externos contratados.
