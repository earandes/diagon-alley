# ARCANA — matriz vigente de requisitos y límites

> **A60 ·15 octubre2026:** incremento de diez anotaciones/PokéLike implementado y verificado localmente:368unitarios/40integración SQL-Redis; experiencia20consolidados,apertura16,swap16,PWA12, con regresiones/fixtures por separado. [Informe y límites](pokelike-2026-10-15/REPORT.md). [Contrato](pokelike-2026-10-15/CONTRACT.md), [análisis directo](pokelike-2026-10-15/POKELIKE-ANALYSIS.md). Configuración económica y guardados conservados; compra+apertura añade un comando atómico. No cierra aceptación física, estética humana, lector o retención.

Actualización A59 / PRD 1.0.27 (15 octubre): [las 16 anotaciones del propietario implementadas](annotations-2026-10-15/REPORT.md): escena continua con ambiente reducido/pausado, preparación explícita y equipo fuera del álbum, seis iconos regionales, tres fachadas pintadas e interiores, libretos, bóveda y celebración por rareza. 349 unitarios y 37 integración SQL/Redis correctos; suites de navegador ES/EN y cobertura consolidada detalladas por ejecución en el informe. Autoridad/configuración: 59 archivos sin cambios de bytes. Se conserva la mejora de apertura A58, sin atribuirla de nuevo a este incremento. Capturas antes/después y pruebas técnicas de escritorio; no cierra aceptación estética, hardware físico, lector hablado o retención. No publicado. Las cifras inferiores conservan su fecha histórica.

Actualización A58 / PRD1.0.26 (15 octubre): [treinta personajes pintados y apertura corregida](illustrated-assets-2026-10-15/REPORT.md),90WebP activos,2,46MB, familia inspeccionada y encuadres coordinados.339unitarios/37integración SQL-Redis y50casos navegador del ámbito correctos por suites separadas (4arte+16opening+16rediseño+12PWA+2arena); no se suman reintentos o los124históricos A57. Máximo frame apertura Chromium16,8ms frente216,7–233,2ms comparable anterior, WebKit35–37ms; cerca60FPS en escritorio, arte final compilado. Sin alterar economía/partidas y con es/en/swap/recarga/omitir/reducido/PWA comprobados. No cierra aceptación estética del propietario, hardware físico, lector hablado o retención. Las cifras inferiores conservan su fecha histórica.


Actualización A57 / PRD1.0.25 (15 octubre): [rediseño jugable Diagon Alley y ARCANA intercambiable](diagon-game-redesign-2026-10-15/REPORT.md), idiomas solo Ajustes, apertura ampliada y colección derivada de cuatro sabores reales.339 unitarios,37 integración reales y124 casos navegador distintos correctos por cobertura consolidada (76 recorrido+20 harness+16 A57 compilado+12 PWA), sin sumar repeticiones ni afirmar corrida única; desglose en el informe enlazado. La exclusión temática A29 queda sustituida solo en presentación. No cierra arte final, hardware físico, lector o sesión humana/retención. Las cifras siguientes conservan su fecha histórica.

Actualización A56 / PRD1.0.24 (15 octubre): [rutas variables guardadas, mapa completo sin scroll y seis nodos con decisiones/previsualización](visual-nodes-2026-10-15/REPORT.md). **319 unitarios,36 integración SQL/Redis,106 casos navegador distintos** (74 recorrido+20 harness+12 PWA); reejecuciones no sumadas. Una región; valores económicos/esquemas/Word conservados, nuevas elecciones y autoridad de rutas sí implementadas. No cierra hardware, lector hablado o sesión humana A53.


Actualización A55 / PRD1.0.23 (15 octubre): mapa sobre ilustración regional, roster reducido a retratos con ficha hover/foco/toque, guía/recibos a demanda. **308 unitarios,36 integración SQL/Redis,86 casos navegador distintos** (54 recorrido +20 harness +12 PWA), sin sumar repeticiones. [Evidencia y límites A55](region-map-2026-10-15/REPORT.md). Una sola región; [dirección incremental futura](REGIONS-ROADMAP.md). Sin cambios de economía/autoridad ni aceptación física/usuario cerrada.

Actualización A54 / PRD1.0.22: interfaz mediante assets y diez SVG editables, sin formularios convencionales en el recorrido. **307 unitarios,36 integración real,82 casos navegador distintos** (50 recorridos +20 harness +12 PWA); movimiento reducido, arte ausente y persistencia comprobados. [Informe y capturas A54](asset-interface-2026-10-14/REPORT.md). Medición inicial1,998MB y arena~60FPS en escritorio. No se cierra aceptación física/lector ni sesión humana A53. Las referencias siguientes conservan la evidencia anterior.

14 octubre 2026, A49–A52 / PRD 1.0.21. Baseline A48 conservado, con acabado local y orientación/game-feel actualizados. Fuente: mensaje actual de Enric, ampliado por Word ARCANA intacto; Word histórico y dirección I1 quedan fuera del build. Esta matriz sustituye como estado vigente los gaps de la auditoría inicial, que conserva evidencia histórica. Aceptación final pendiente por acceso a hardware; tercera revalidación sin dispositivo en la auditoría final.

Última evidencia A52: **307 unitarios, 36 integración real PostgreSQL/Redis, 76 casos navegador distintos** (44 recorrido +20 harness +12 PWA). [Informe y límites](game-feel-2026-10-14/REPORT.md), [DESIGN](../../DESIGN.md). Guía/equipo/colección/feedback/rareza SVG implementados; balance comparado solo fuera de partidas. Las cifras por bloque de la tabla conservan su evidencia histórica, sin sumar reejecuciones.

| Requisito | Estado verificable | Evidencia / límite |
|---|---|---|
| Cuatro fases secuenciales | Documentadas y ejecutadas | PHASE-1-AUDIT, PHASE-2-ARCHITECTURE, PHASE-3-TDD, PHASE-4-STATUS; contratos registrados antes de bloques |
| Presentación Diagon Alley/ARCANA intercambiable (A57 sustituye exclusión temática A29) | Paquetes visuales; IDs/reglas/snapshots conservados | Scanner dual privado correcto; no certifica artefacto exclusivo ARCANA ni derechos de distribución |
| Pasaje vertical ramificado de 15 nodos + jefe | Implementado | JSON versionado, grafo/adyacencia/reachability y seis tipos; mapa Pixi + lista DOM |
| Kit exacto de un aprendiz/varita +2/escoba +3/50 Coronas | Autoritativo e idempotente | Dominio/API/SQL reales; no arrastra regalos I1 |
| Formación inicial y 3–5 unidades | Kit uno; pactos iniciales permiten tres | Reglas límite 5 y equipo permanente/temporal. Stats/pactos provisionales; fixture visual cinco por lado comprobado A47/A48, hardware físico pendiente |
| Duelo/Refugio/Cofre/Pacto/Encuentro/Jefe | Casos conectados | Transacción única, HP/PM persistidos; refugio 40%; narrativa/efecto guardados; derrota/draw cierran run |
| Jefe desbloquea siguiente localización | Guardado y visible | Jefe→resultado→Misiones→recarga. Bosque de 20 nodos corresponde al futuro del Word, ruta aún no jugable |
| Motor determinista por iniciativa y seed | Implementado en dominio puro | Server seed/PRNG, BattleLog cronológico, reproducibilidad, reglas sin React/Pixi/SQL/reloj local |
| Sinergias y cuatro efectos de Grageas | Implementados y versionados | Semántica requerida/semillas deterministas, umbrales compartidos con HUD; valores no especificados son provisionales |
| Bufos por unidad / pertenencia de sinergias en arena | Completado A48 | Activación consumida/tier/valor/miembros por equipo y peana, afinidad propia e identidad por posición, fallback incompatible. No recomputar combate |
| Arena dos columnas/proyectiles/colisiones | PixiJS v8 conectado a replay | DOM equivalente, pausa/Auto/2x/omitir solo reproducción, contexto perdido conserva log/resultado |
| Esencia 50 / coste 5 / punto cada 12 min | Regla pura y autoridad temporal | Redis TIME; GET no escribe SQL ni concede crédito local, HUD refresca/especifica lectura offline |
| Anti-grind primera victoria 100% / repetición 10% Coronas | Regla autoritativa | Progreso por nivel/versiones, botín único no repetido; dominio/SQL/retry |
| Bazar compra y apertura Sapos/Grageas | Flujo completo | Consumo+resultado+copia+receipt antes de GSAP, precios/probabilidades públicos derivan de configuración |
| Cromodex: 30 identidades, filtros, locks, stats, equipo | Implementado es/en | Copias/snapshots históricos, PV/PM/poder/velocidad, objetos propios asignables sin segunda compra |
| Cuatro rangos y estrellas 1–5/holografía | Implementado | Campo por copia/receipt; rango→estrellas provisional explícito. Legacy sin campo no se reclasifica |
| Taller maderas/núcleos/forja/multiplicadores | Implementado | Nueve recetas, compra→pieza→asignación. Precios/bonos provisionales |
| Bóveda llave de jefe→botín valioso | Implementado | Una llave en tx; concurrency/recovery SQL; tablas/botín provisionales |
| Clean Architecture / cuatro contextos | Núcleo independiente y monolito modular | Ports pequeños de tx, RNG, tiempo/autoridad y cliente; adapters HTTP/PG/Redis/IDB/rendering. Sin bus/microservicios/event sourcing |
| Run/Combat/Inventory/Cromodex y VO | Modelados | Invariantes/snapshots inmutables, ManaPoints/NodeCoordinate/Seed/Rarity. Cromodex es proyección de copias, no segunda transacción |
| TDD reglas críticas | Evidencia RED/GREEN conservada | No afirmar RED retrospectivo de integración/refuerzos UI; 298 unitarios, 36 integración vigentes |
| Integridad costo/entrega/retry/reload/tabs | Autoridad real | Row lock SQL, receipts por key/request/versiones, respuesta perdida, rollback antes de commit, recuperación después, IDB solo intención |
| Stack React/Vite/TS + Fastify + PG/Redis + Pixi8/GSAP | Conectado localmente | Build y tipos correctos; launchers loopback de ensayo, no deployment/backend público |
| PWA responsiva | Manifest/iconos/worker compilados y probados | Shell offline, API nunca cacheada, bloqueo de gasto; hash/reload/update/reconnect. Instalación física pendiente |
| Assets iniciales <3–5 MB | Shell y bienvenida medidos <3 MB | A49: 1.913.697 bytes únicos sin comprimir; arte a demanda. Catálogo distribuido 9.057.054 bytes, distinto de descarga inicial; download-initial/scanner en visual-production-2026-10-14 |
| 60 FPS escritorio/móvil | No acreditado en toda condición | Cinco por lado, diez segundos por 320/390/1280: 59,10–60,02 FPS en Mac headless, mejora desktop 50,22→60 sin MSAA. Móvil físico pendiente |
| Español/inglés, teclado/foco, motion/skip/fallback | Recorridos probados | 30 UI + 20 metadata/arena/contraste + 12 PWA Chromium/WebKit. CLI 320/texto raíz 200% y SQL intacto; no zoom nativo o lector físico |
| Contraste/WCAG/dispositivos | Verificación incompleta | Texto ampliable y contraste estático arena/foco/hover probados; no certificación WCAG global, Firefox/lector/móvil físico pendientes; no atribuir emulación a hardware |
| Cuenta/recovery productivas y balance | No elegidos/observados con usuarios | Cookie siete días/autoridad local reales. Sin cuentas recuperables o importación de saldo local confiable |
| Gasto, publicación, push, CI remoto | No realizados | CI escrita no es una ejecución observada; servicios propios detenidos/volúmenes conservados |

Auditoría final realizada: [resultado y límites](FINAL-ACCEPTANCE-AUDIT.md). Firefox local falla antes de cargar página incluso con perfil explícito; sin móvil identificado por ADB/USB. Trabajo siguiente: QA físico donde exista acceso, sin atribuirlo a fixtures/emulación ni añadir expansiones como sustituto.

## Actualización visual/local A49–A51

Treinta personajes/rivales/jefe/seis escenas/productos integrados con 133 recursos y 63 maestros; fuentes/prompts/manifests/código disponibles. Apertura ilustrada GSAP postreceipt, confeti limitado/reduced, arena con figuras Pixi/DOM alternativo, UX/stock/plurales/resultado/objetivo corregidos. Paquete de contenido es/en sustituible probado sin cambiar estado autoritativo. [Matriz/evidencia nueva](visual-production-2026-10-14/REPORT.md), [galería](visual-production-2026-10-14/GALERIA.md), [guía](CONTENT-PACKS.md).

304 unitarios (281 ARCANA+23 históricos), 36 integración real y 68 browser distintos (36 recorridos+20 fixtures+12 PWA) correctos. No se suman repeticiones/perfiles. Servicios/preview locales disponibles; Sites **aplazado por Enric** por ausencia de servidor externo gratuito. Móvil físico/lector audible/zoom nativo/instalación física y observación de balance/diversión siguen pendientes. El estado visual local no cierra esas aceptaciones.
