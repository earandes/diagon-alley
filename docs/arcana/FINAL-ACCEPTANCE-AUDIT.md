# ARCANA — auditoría final de aceptación técnica

> **A60 ·15 octubre2026:** incremento de diez anotaciones/PokéLike implementado y verificado localmente:368unitarios/40integración SQL-Redis; experiencia20consolidados,apertura16,swap16,PWA12, con regresiones/fixtures por separado. [Informe y límites](pokelike-2026-10-15/REPORT.md). [Contrato](pokelike-2026-10-15/CONTRACT.md), [análisis directo](pokelike-2026-10-15/POKELIKE-ANALYSIS.md). Configuración económica y guardados conservados; compra+apertura añade un comando atómico. No cierra aceptación física, estética humana, lector o retención.

Actualización A59 / PRD 1.0.27 (15 octubre): [las 16 anotaciones del propietario implementadas](annotations-2026-10-15/REPORT.md): escena continua con ambiente reducido/pausado, preparación explícita y equipo fuera del álbum, seis iconos regionales, tres fachadas pintadas e interiores, libretos, bóveda y celebración por rareza. 349 unitarios y 37 integración SQL/Redis correctos; suites de navegador ES/EN y cobertura consolidada detalladas por ejecución en el informe. Autoridad/configuración: 59 archivos sin cambios de bytes. Se conserva la mejora de apertura A58, sin atribuirla de nuevo a este incremento. Capturas antes/después y pruebas técnicas de escritorio; no cierra aceptación estética, hardware físico, lector hablado o retención. No publicado. Las cifras inferiores conservan su fecha histórica.

Actualización A58 / PRD1.0.26 (15 octubre): [treinta personajes pintados y apertura corregida](illustrated-assets-2026-10-15/REPORT.md),90WebP activos,2,46MB, familia inspeccionada y encuadres coordinados.339unitarios/37integración SQL-Redis y50casos navegador del ámbito correctos por suites separadas (4arte+16opening+16rediseño+12PWA+2arena); no se suman reintentos o los124históricos A57. Máximo frame apertura Chromium16,8ms frente216,7–233,2ms comparable anterior, WebKit35–37ms; cerca60FPS en escritorio, arte final compilado. Sin alterar economía/partidas y con es/en/swap/recarga/omitir/reducido/PWA comprobados. No cierra aceptación estética del propietario, hardware físico, lector hablado o retención. Las cifras inferiores conservan su fecha histórica.


Actualización A57 / PRD1.0.25 (15 octubre): [rediseño jugable Diagon Alley y ARCANA intercambiable](diagon-game-redesign-2026-10-15/REPORT.md), idiomas solo Ajustes, apertura ampliada y colección derivada de cuatro sabores reales.339 unitarios,37 integración reales y124 casos navegador distintos correctos por cobertura consolidada (76 recorrido+20 harness+16 A57 compilado+12 PWA), sin sumar repeticiones ni afirmar corrida única; desglose en el informe enlazado. La exclusión temática A29 queda sustituida solo en presentación. No cierra arte final, hardware físico, lector o sesión humana/retención. Las cifras siguientes conservan su fecha histórica.

Actualización A56 / PRD1.0.24 (15 octubre): [rutas variables guardadas, mapa completo sin scroll y seis nodos con decisiones/previsualización](visual-nodes-2026-10-15/REPORT.md). **319 unitarios,36 integración SQL/Redis,106 casos navegador distintos** (74 recorrido+20 harness+12 PWA); reejecuciones no sumadas. Una región; valores económicos/esquemas/Word conservados, nuevas elecciones y autoridad de rutas sí implementadas. No cierra hardware, lector hablado o sesión humana A53.


Actualización A55 / PRD1.0.23 (15 octubre): [mapa ilustrado y equipo a demanda](region-map-2026-10-15/REPORT.md),308 unitarios/36 integración/86 casos navegador distintos; una sola región y expansión futura documentada. Autoridad/economía/Word sin cambios. No cierra hardware, lector hablado o sesión jugable con personas.

Actualización A54 / PRD1.0.22: [interacción visual implementada y verificada](asset-interface-2026-10-14/REPORT.md),307 unitarios/36 integración/82 casos navegador distintos; cambios de autoridad/economía excluidos y hashes conservados. Feedback del propietario, sin observaciones de resolución humana todavía. Hardware/lector/aceptación con personas siguen abiertos.

Actualización 14 octubre, A52/PRD1.0.21: [evidencia de acabado, guía, herramientas y pruebas vigentes](game-feel-2026-10-14/REPORT.md). 307 unitarios/36 integración/76 navegador correctos; sin cerrar hardware/lector/observación. La revisión A48 de abajo conserva su fecha y alcance histórico.

12 octubre 2026. Revisión A48 / PRD 1.0.17. No cambia código, alcance, reglas, dependencias o balance. Las cuatro fases y los flujos del MVP están implementados; la aceptación de rendimiento en móvil físico sigue abierta.

| Entregable           | Fuente cotejada                                                                                         | Resultado                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Auditoría            | PHASE-1-AUDIT.md, REQUIREMENTS-STATUS.md, scanner build                                                 | Gaps iniciales conservados y estado vigente reconciliado; app activa sin contenido histórico distribuido                               |
| DDD/arquitectura     | PHASE-2-ARCHITECTURE.md, domain/{exploration,combat,collection,economy}, application/authority-ports.ts | Cuatro contextos, invariantes/snapshots inmutables y puertos pequeños; núcleo sin frameworks/adapters                                  |
| TDD                  | PHASE-3-TDD.md, tests/domain/arcana, logs tdd-\*                                                        | RED/GREEN por bloque, distinguiendo refuerzos posteriores e integración; sin reconstrucción retrospectiva                              |
| CombatEngine         | domain/combat/{engine,beans,synergies}.ts, combat-engine.test.ts                                        | Seed/entrada reproducen log completo; iniciativa, equipo, PM, sinergias, sabores y fin cubiertos                                       |
| AdvanceNodeUseCase   | application/run-use-cases.ts, run-use-cases.test.ts                                                     | Adyacencia/versiones/propiedad; coste, consumible, PV/PM, progreso, recompensa y receipt en una tx; seis tipos y desbloqueo conectados |
| OpenCocoaToadUseCase | application/shop-use-cases.ts, shop-use-cases.test.ts                                                   | Consumo/copia/descubrimiento/receipt atómicos; replay antes de config actual; conflicto y agotamiento rechazados                       |
| Autoridad            | infrastructure/{http,postgres,redis}, tests/integration                                                 | Fastify recibe intenciones; PostgreSQL guarda estado/progreso; Redis sesiones/límites/tiempo. Cliente no elige saldo/seed/resultado    |
| Presentación         | presentation, tests/browser-{trial,arcana,pwa}                                                          | Mapa/arena/álbum/Bazar/Taller/Bóvedas, replay, es/en, recuperación, DOM equivalente y shell PWA conectados                             |

Código relativo a src/arcana; pruebas relativas a tests/domain/arcana salvo suites indicadas. Combat es snapshot autocontenido; CromodexEntry proyección de copias confirmadas. No clases vacías ni segunda tx para cumplir nombres. La tx de jugador coordina los contextos del monolito.

Registros finales A48 cotejados: **298 unitarios, 36 integración PostgreSQL/Redis y 62 casos de navegador distintos Chromium/WebKit**. Los ocho casos finales de pasivos incluyen seis ya presentes y dos nuevos; no sumar repeticiones. Referencias exactas en PHASE-4-STATUS.md.

Scanner reejecutado: correcto, **938176 bytes**, final-acceptance-build-scan.txt. Imports de frameworks/adapters y Date.now/Math.random/localeCompare en dominio sin coincidencias. No repetir suites porque no cambió código ejecutable. Hashes de ambos Word coinciden con registros; siguen intactos.

## Límites de aceptación

- **60 FPS móvil físico:** ADB e inventario USB no muestran teléfonos/tabletas. Perfiles Mac headless 320/390/1280, cinco por lado, no acreditan hardware móvil. Pregunta sobre teléfono disponible sigue sin respuesta.
- **Firefox:** ejecutable instalado falla antes de abrir página con `Could not find profile folder`, también con perfil explícito creado bajo /tmp. Registro final-firefox-launch.txt; cero pruebas de aplicación ejecutadas en ese motor.
- Instalación PWA física, lector audible y zoom nativo sin comprobar. Texto raíz 200%, teclado, contraste estático y equivalencia DOM tienen evidencia; no certificación WCAG global.
- Arte/balance ausentes del PRD siguen provisionales. Recovery de cuenta productiva no elegido; ensayo con autoridad real y cookie siete días. Sin despliegue, publicación, push o CI remota observada.

No se identificó otro módulo funcional pendiente dentro del MVP durante esta revisión. Bosque ampliado pertenece al futuro del Word; desbloquearlo no obliga a construir esa expansión. No se añaden expansiones para sustituir la validación pendiente.

**Aceptación pendiente por acceso a hardware:** la misma ausencia de móvil se verificó en tres turnos consecutivos desde esta auditoría final, mediante ADB e inventario USB. El segundo turno no produjo avance; la tercera revalidación conserva cero dispositivos y no llegó una respuesta sobre hardware. No hay proceso de prueba móvil vivo que esperar ni otro gap funcional del MVP identificado que permita avanzar esa aceptación. Se alcanza el umbral para bloquear el Goal, sin declararlo completo. Para continuar, hace falta un dispositivo accesible y ejecutar allí el perfil de cinco unidades por columna y la instalación PWA; los demás límites de QA anteriores siguen explícitos.

## Addendum vigente · 14 octubre 2026 · A49–A51

La evidencia A48 anterior se conserva como baseline. A49/A50 integran lote ilustrado/animaciones/UX/paquetes sustituibles; [revisión actual con evidencia](visual-production-2026-10-14/REPORT.md). 304 unitarios, 36 integración PG/Redis y 68 casos browser distintos correctos; build/scanner actuales con catálogo de 9.057.054 bytes y entrada shell+bienvenida de1.913.697 bytes, arte diferido. Los 63 maestros/133 recursos están disponibles, sin rig/capas ficticios; arte revisado localmente no equivale a aceptación física o por usuarios.

Enric decide terminar/validar local sin servidor externo: A51 aplaza Sites completo. Preview http://127.0.0.1:5190/ con autoridad real; sin URL de deployment, cuentas recuperables o CI remota. La cláusula histórica de «arte provisional» se sustituye para este lote por producción revisada/integrada con fuentes; balance/observación y las verificaciones físicas siguen pendientes. Word SHA intactos.
