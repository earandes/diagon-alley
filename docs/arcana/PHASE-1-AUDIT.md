# ARCANA — Fase 1 Auditoría de la aplicación existente

A48: Bufos por peana/separación de equipos e identidad de actores ahora completos desde log/reglas guardadas. Registro incompatible no crashea. 298 unitarios/36 integración/62 casos browser correctos; actualizaciones y límites en estado. Auditoría final/hardware/lector/zoom nativo pendientes.

A47: Texto funcional de px no crecía al 200%; corregido a rem y containers flexibles. Contraste rival 4,40555→5,20233, hover activo ilegible corregido. Benchmark cinco unidades/diez segundos detectó MSAA: quitarlo mejora desktop Chromium 50,22→60 FPS. 293 unidad/36 integración/54 navegador correctos. Detalle de bufos por unidad y sinergias de ambos equipos requiere completar presentación; físico/lector no probado.

A46: Vistas/subtiendas recuperables por hash, causas de errores localizadas en modal, jefe enlaza con desbloqueo guardado. Regresión PWA con fragmento corregida; 292 unitarios/36 integración/48 navegador correctos. Ver matriz vigente REQUIREMENTS-STATUS.md; auditoría inicial posterior histórica.

A45: PWA compilada añadida y auditada: API fuera de caché, shell offline, comandos bloqueados y reconexión sin duplicación. 287 unitarios/36 integración/48 navegador correctos. Instalación física y aceptación restante abiertas.

Reconciliación A44 (12 octubre): Encuentros conservan efecto, narrativa bilingüe versionada y PV antes/después en receipt. Dominio aplica/valida misma regla; UI lee snapshot, cancelación/recarga/idioma y respuesta perdida verificados con SQL. Relatos provisionales/config 3, efectos/pesos/campaña existentes sin cambios. Legacy no reconstruye información ausente. Desbloqueo visible completo, PWA y QA/rendimiento pendientes; matriz inicial histórica.

Reconciliación A43 (12 octubre): cromos y copias/receipts conservan 1–5 estrellas; catálogo/tabla de ensayo versión 2, cuatro rangos e IDs/stats/pesos sin cambios. Copias históricas sin campo mantienen ausencia. Revelación/álbum/inspección es/en y SQL reabierto verificados; sello GSAP invisible provocaba overflow y se corrige mediante RED/GREEN a 320 px/texto 200%. Encuentros/desbloqueo visible completo, PWA y aceptación/rendimiento restantes abiertos; evidencia vigente en Fase 4. Matrices posteriores históricas.

Reconciliación A42 (12 octubre): Taller/Bóvedas conectados a casos transaccionales, recetas y botín versionados de ensayo. Coste/llave/entrega/replay, cancelación, foco/idioma, asignación sin segunda compra y SQL/Redis reales comprobados. 269 unitarios, 34 integración, 36 navegador; build 911596 bytes sin contenido histórico. Estrellas, encuentros/desbloqueo visible completo, PWA y QA/rendimiento siguen pendientes. Matriz inicial posterior histórica.

Reconciliación A41 (12 octubre): Esencia regenerada visible por reloj de servidor/consulta sin escritura, barras y gear/sinergias de formación, último resultado y replay por run/nodo y zonas desbloqueadas desde progreso. Refresco no repite POST/receipt. Resultado bajo nav detectado en CLI y RED, corregido; mapa solo desplaza al cambiar elecciones, no por snapshots HTTP nuevos. Estrellas, Taller/Bóvedas, siguiente ruta/narrativa completa, PWA y QA/rendimiento pendientes.

Reconciliación A40 (12 octubre): filtros e inspección por copia, selección/gear poseído y asignación explícita de Grageas conectados a casos existentes. Cancelar sin consumo y recarga/idioma comprobados en es/en. Estrellas, HUD/energía visible, resultados de nodos, Taller/Bóvedas/PWA y QA pendiente; matriz inicial siguiente histórica.

Reconciliación A39 (12 octubre): mapa ramificado Pixi, arena/peanas/replay de log, Auto/pausa/2x/omitir y apertura GSAP conectados. Dominio/engine no se ejecutan por el renderer; coordenadas/lista/controles/foco en DOM, fallback para falta/pérdida de WebGL y GSAP ausente. TDD y perfiles guardados; FPS en móvil físico/aceptación completa no demostrados. Filtros/estrellas/equipo/Grageas, Taller/Bóvedas/PWA y demás gaps siguen abiertos. Estado actual en `PHASE-4-STATUS.md`; matriz inicial siguiente histórica.

Reconciliación A38: entrada principal y build ya usan ARCANA, sin recursos históricos distribuidos. Núcleo/API/SQL/Redis y UI DOM básica conectados; 30 cromos y ruta de 16 nodos como ensayo explícito. El P0 del artefacto histórico se corrige por exclusión/sustitución, no borrado de historia. Faltan Pixi/GSAP, reproducción/ramificación visual, equipo/consumibles/filtros, talleres/bóvedas y aceptación completa; ver `PHASE-4-STATUS.md`. La matriz siguiente conserva el diagnóstico inicial de la base examinada.

Fecha: 11 octubre 2026. Base examinada: `a88d923ee6dd0caaeaf55107411fd65ac1419bd4` más cambios locales existentes. Auditoría previa a implementar ARCANA. El directorio de trabajo ya contenía cambios en README/DECISIONS, estudios, assets y herramientas; no se descartan ni se atribuyen a este encargo.

## Conclusión

La aplicación actual es un ensayo local de visita, apertura única y álbum. No es todavía un roguelike ni un auto-battler. React, TypeScript, Vite y las técnicas de transacción/recuperación son reutilizables; el catálogo, las invariantes de bienvenida, la navegación y los recursos asociados al producto anterior no satisfacen ARCANA. No se justifica reescribir el stack; sí introducir el dominio nuevo y casos de uso explícitos.

Las 23 pruebas unitarias existentes, comprobación de tipos y build pasan en Node 24.20.0/npm 11.19.0. Eso verifica el ensayo anterior, no los requisitos nuevos. Chromium/WebKit: 90 tests correctos en 26,5 s, registrados en `baseline-browser.txt`. No hay comprobación de servidor, PWA, combate, energía o economía en la base auditada. Los módulos nuevos independientes y sus comprobaciones posteriores están separados en `PHASE-4-STATUS.md`.

## Autoridad y conflictos resueltos

Fuente normativa: especificación ARCANA del mensaje actual y Word ARCANA v1.0.0 adjunto. Si difieren, prevalece el mensaje actual. Los documentos anteriores son antecedentes, no fuentes de reglas ARCANA. El Word histórico anterior y el Word ARCANA se conservan intactos.

La instrucción nueva sustituye expresamente universo/localizaciones, personajes, productos, kit inicial, cuatro rarezas, energía y barra inferior. Por tanto, las restricciones antiguas de conservar universo comercial, tres rangos, bienvenida nueva, ausencia de barra inferior y exclusión de energía dejan de gobernar ARCANA. Mantener español/inglés, accesibilidad, atomicidad, versiones y separación de evidencia sigue siendo compatible. No se considera aprobada una cifra ausente del PRD por aparecer en código de ensayo.

El adjunto añade especificidad: MVP con El Pasaje Torcido (15 nodos ramificados y un jefe), 3 contra 3, 30 cromos y cálculo de servidor. Taller/Bóvedas figuran como pantallas de producto, pero el roadmap MVP enumera mapa/combate/álbum/bazar; no fija reglas completas de forja/bóvedas. Se deben delimitar y documentar, no inventar recetas o premios.

La captura adjunta es una referencia de composición de tres zonas y ornamento. Contiene nombres y arte del universo anterior, chat, comercio social y navegación que no describen el MVP nuevo. No reutilizarla como asset ni copiar sus personajes/textos. No es evidencia de código o permisos. La selección de nombres de folclore es un requisito de contenido; esta auditoría no acredita por sí misma derechos sobre ilustraciones ni una garantía jurídica universal.

## Matriz exhaustiva de requisitos

| Requisito | Estado comprobado | Evidencia actual | Trabajo necesario |
| --- | --- | --- | --- |
| Core loop mapa→gasto→evento/combate→recompensa→equipo/bazar→colección | Ausente | `src/ui/App.tsx:37` enumera calle/tienda/ficha/apertura/álbum/ajustes | Caso de uso transaccional de resolución de nodo, luego presentación |
| Mapa vertical, 15 nodos y jefe, ramificaciones/puntos | Ausente | No hay grafo o ruta en `src/domain`/`src/content` | Grafo versionado, aristas válidas, fila/avance, selección legal, final de ruta |
| Duelo, refugio 40%, cofre, pacto, azar, jefe | Ausente | Ningún tipo de nodo | Resultados tipados, recuperación y consecuencias persistidas |
| Header Coronas/Esencia/sinergias/banqueta | Ausente | Header solo marca/idioma/ajustes | Proyección del estado de equipo/economía, sin cálculos de reglas en React |
| Barra Mapa/Cromodex/Bazar/Misiones | Contradice | `App.tsx`; prueba antigua `navigation.spec.ts` exige omitir barra | Reemplazar aceptación; no llamar regresión al cambio aprobado |
| Arena dos columnas y peanas, 3 contra 3 MVP | Ausente | Sin unidades o batalla | Motor determinista, preparación, timeline y resultado persistido |
| PV/nivel/PM/poder/velocidad/varita/escoba/consumible | Ausente | `src/domain/model.ts:6` Identity solo contenido/rareza/asset | Definición de mago y unidad de equipo con equipo/vida residual |
| Orden por iniciativa, proyectiles, Auto/2x | Ausente | Solo ritual CSS 1,6 s de apertura | Orden estable; reproducción acelerable/omitible del mismo resultado |
| Sinergias de afinidad | Ausente | No existen afinidades | Reglas explicitadas y probadas; falta cuantificar bonos |
| Grageas activadas aleatoriamente al inicio | Ausente | Beans se conserva sin poder abrir | PRNG inyectable/seed, menta 25%, pimienta primer ataque 30%, tierra 15% dos turnos, jabón primer fallo |
| Compra/apertura de sapos con Coronas | Parcial incompatible | `opening.ts:72` apertura única de bienvenida, stock sin precio | Compra y apertura separadas, unidad/clave únicas, tabla y precio visibles |
| Tarros/lotes de grageas | Ausente | `Shop.tsx` informa apertura no disponible | Compra, asignación, consumo único en combate |
| Cromodex filtros cuatro rarezas | Parcial incompatible | `Album.tsx:59`, R01–R03 y total 12 | 30 magos, cuatro IDs de rareza, siluetas/candado, stats y equipar |
| Copias y descubrimientos | Presente para I1 | `model.ts`, `addCopy`, `copyCount` | Reutilizar concepto, nuevas identidades/snapshots y equipos sin duplicación por idioma |
| Taller maderas/núcleos/multiplicadores | Ausente | Fichas de objetos sin uso implementado | Pantalla/inspección y alcance según reglas definidas; recetas/costes pendientes |
| Bóvedas/llaves de jefe | Ausente | No hay llaves ni jefes | Derecho de acceso, gasto/recompensa atómicos; tabla/coste/hitos pendientes |
| Onboarding aprendiz nivel 1, abedul +2, cadete +3, 50 Coronas | Contradice | `opening.ts:10`, regalos O01/O02/S01/S02 y dos unidades | Inicialización única separada de cualquier apertura, namespace ARCANA |
| Esencia 50/5/1 cada 12 min | Ausente | No hay reloj, energía o saldo | VO, cursor, intervalos completos, saturación, no crédito por reloj atrasado |
| Primera victoria 100%, repeticiones 10% Coronas | Ausente | No existen victorias/premios | Historial por nivel, sin botín de primera victoria duplicado |
| Combate reproducible por semilla | Ausente | `demo-store.ts:45` crypto ticket sin motor de combate | Semilla generada por autoridad; motor puro; versiones/input/eventos guardados |
| Integridad frente a cliente manipulado | No soportada | IndexedDB editable; import acepta saldo local | Servidor calcula gastos/resultados; no confiar en ganador/seed/recompensa del cliente |
| Framework independiente del dominio | Presente parcialmente | `src/domain` no importa React/idb | Mantener; no meter PRNG, red o animación en reglas |
| Puertos y casos de uso de aplicación | Ausentes | `App.tsx:47` crea `DemoStore` y llama directamente al adaptador | Application con puertos de tx/reloj/semillas, composition root explícito |
| Atomicidad/commit antes de anunciar | Presente local | `demo-store.ts:108`; `App.tsx:291` guarda antes del ritual | Conservar en backend, probar fallo/rollback y respuesta perdida |
| Idempotencia/concurrencia | Presente para una unidad | `opening.ts:80`, pruebas `persistence.spec.ts` | Extender claves/peticiones/revisión a nodo/compra/apertura/equipar |
| Recuperación/recarga/export/import | Presente solo esquema I1 | `validation.ts:169` exige 2 unidades/≤1 operación | Preservar almacenamiento anterior aislado, no convertir sus IDs/saldos en ARCANA |
| Localización es/en | Presente para I1 | `i18n/messages.ts`, pruebas 3 idiomas/formatos | Glosario nuevo, estados y acciones nuevos en ambos idiomas |
| Teclado/foco/omisión/reducido/arte ausente | Implementado para I1 | App/Shop/Album/CSS, tests journey/design/visual | Revalidar recorridos nuevos; lector físico y WCAG no acreditados |
| Sin términos de franquicia en app distribuida | Contradice | catalog, types, validation, UI, HTML, manifest y raster public | Excluir dependencias/recursos anteriores del artefacto ARCANA; escaneo textual + revisión visual |
| Responsiva Canvas/WebGL/PWA | Responsive DOM/SVG parcial | CSS móvil, Vite; no service worker/manifest | Renderer separado; PWA/caché/versiones; mantener controles HTML equivalentes |
| Backend sugerido/autoridad de servidor | Ausente | package scripts solo Vite; no endpoints | Selección de persistencia/identidad/tiempo confiable antes de afirmar anti-trampas |
| Verificación automática/CI | Presente solo I1 | Vitest/Playwright/GitHub workflow | Suite ARCANA + tests de servidor/tx; CI no comprobada para cambios sin push |

## Hallazgos arquitectónicos priorizados

**P0 — Frontera de confianza inexistente para el producto nuevo.** El adaptador local permite editar/restaurar el estado y el resultado se decide en el cliente. Correcto para el ensayo local previo; insuficiente para el requisito de servidor del Word. La UI enviará intención y versión, nunca un resultado económico o una semilla escogida por el jugador.

**P0 — Nomenclatura y recursos incompatibles.** `catalog.json` contiene cuatro personajes de la franquicia, `model.ts:15/42`, `opening.ts:58` y `validation.ts:71/126` fijan la tienda anterior, `messages.ts` e `index.html:8` la nombran. `VisualArt.tsx:82` representa C01 con un retrato antiguo y carga `public/art/*.webp`; cambiar etiquetas no elimina ese contenido. La compilación Vite copia `public` entero: dejar raster allí publica assets antiguos aunque no se importen.

**P1 — UI como coordinador de aplicación.** `App.tsx` tiene 865 líneas y combina estados de nueve vistas, acceso a IndexedDB, recovery, revisión, preferencias, import/reset, broadcasts, foco y animación. No hay economía/combate filtrado: están ausentes. Hay acoplamiento concreto a `DemoStore` creado globalmente y duplicación de recuperación en start/refresh/open. Extraer casos de uso y presenter/hook con puertos; evitar crear una interfaz por componente.

**P1 — Invariantes específicas no extensibles por renombrar.** `validateState` exige exactamente cuatro regalos, dos unidades y como máximo una operación; `openFrog` rechaza cualquier segunda apertura incluso con otra unidad. `Identity`, `RarityId`, IDs y JSON fijan doce identidades. Son decisiones válidas de I1, no malas abstracciones: conservar historia y sustituir modelo ARCANA sin flexibilizarlas a ciegas.

**P1 — Falta de modelo de estado de ruta/batalla.** No hay identidad de nivel, grafo, resultado de batalla, equipo con vida residual, primera victoria, clock cursor o semilla/versiones de motor. No implementarlos como flags de componentes o efectos temporizados.

**P2 — Datos/proyecciones acoplados.** `Album.tsx` y `progressText` duplican total 12. `VisualArt` selecciona retrato/objeto por IDs. Migrar a definiciones/configuración y manifest explícitos. Derivar probabilidades desde tabla (la implementación previa ya lo hace correctamente).

**P2 — Suite de aceptación ligada al producto anterior.** Pruebas de ausencia de menú y bienvenida nueva son contrarias al encargo nuevo. Separar suites históricas y nuevas, con trazabilidad; no borrar pruebas para ocultar fallos ni considerarlas aceptación de ARCANA.

No hay evidencia de necesidad para microservicios, event sourcing, repositorios genéricos, bus distribuido, motor de reglas universal, Next.js, Phaser o un cambio de framework. PixiJS v8/GSAP/PostgreSQL/Redis están requeridos por ampliación A32, que sustituye cualquier recomendación previa de omitirlos. Una arquitectura hexagonal modular y un renderer sustituible resuelven las fronteras reales.

## Reauditoría frente a la ampliación A32

Snapshot posterior: tres módulos iniciales y bloques nuevos de efectos/colección/inventario presentes en `src/arcana`; 21 pruebas de efectos y 20 de colección/economía correctas. Compra/apertura de aplicación tienen tests escritos en RED por módulos aún ausentes (`tdd-shop-red.txt`); no contar esos tests como comportamiento implementado. El entrypoint todavía importa `src/ui/App.tsx`, y el build copia los recursos antiguos: la migración visual/de contenido no está terminada.

| Requisito explícito A32 | Evidencia actual | Gap y aceptación necesaria |
| --- | --- | --- |
| PixiJS v8 mapa/arena/partículas | Ausente de package.json/src | Instalar localmente, renderer con lifecycle/cancelación, escena/lista equivalente; comprobar canvas y colisiones reales |
| GSAP cartas/apertura | Ausente de dependencias/imports | Timeline postcommit, cleanup, pausa/skip/reducido y resultado inmutable |
| 60 FPS móvil/escritorio | Sin medición ARCANA | Captura de tiempos reales/percentiles; emulación no acredita móvil físico |
| Assets iniciales <3–5 MB | Solo tamaño build histórico | Medir artefacto ARCANA y transferencia inicial; no sumar solo JS ignorando public/texturas |
| Node/Fastify o Kotlin backend | No server/handlers/scripts | Composition root, entrada validada, servidor dueño de formación/seed/resultados |
| BattleLog cronológico reproducible | Solo PRNG y efectos puros | Motor completo, seed/input/versiones/log persistidos; reproducción sin recalcular economía |
| PostgreSQL cuentas/inventario/progreso + JSONB run | Sin pg/schema/migraciones/adaptador | SQL relacional, tx por jugador, rollback/aislamiento/reinicio reales; fixtures no pruebas DB |
| Redis sesiones/rate limiting/Esencia temporal | Sin cliente/adaptador | TTL, límites atómicos y reloj/coordinación, sin perder cursor/saldo SQL ante evicción |
| Run/Combat/PlayerInventory/CromodexEntry | RouteRun/Inventory/OwnedWizard parciales | Formalizar invariantes/identidad y límites de tx; nombres no requieren clases vacías |
| ManaPoints/NodeCoordinate/Seed/Rarity | Rarity como unión/seed validado dentro PRNG | VO con factories y errores; separar adaptador PRNG del puerto puro |
| StartRun/AdvanceNode/ResolveCombat/OpenCocoaToad | Solo helpers de dominio; tests de shop RED | Casos de uso tipados y atómicos por puertos, contratos/persistencia real |
| Pausa de reproducción | No reproducción de batalla | Pausar/reanudar timeline sin modificar resultado o provocar más gasto |
| Confitería/Taller/Bóvedas | UI anterior sigue activa | Recorridos completos, es/en, autoridad/transacciones; recetas/precios/tabla pendientes |
| Rarezas de 1–5 estrellas | Modelo nuevo conserva cuatro IDs previos | Correspondencia no fijada; no suponer 5 rangos ni duplicar identidades |
| Pimienta +30% durante primer turno | Helper anterior aplica primer hechizo | Actualizar al turno del portador y probar varias acciones; no cerrar con semántica antigua |

Herramientas detectadas: CLI Docker disponible; `psql`, `redis-server`, `pg_ctl` no localizados en PATH. La presencia de Docker no confirma daemon/servicios iniciados. Verificar servicios concretos antes de afirmar pruebas PostgreSQL/Redis. Documentación primaria revisada: [PixiJS Application v8](https://pixijs.com/8.x/guides/components/application), [Fastify](https://fastify.dev/docs/latest/Guides/Getting-Started/), [transacciones node-postgres](https://node-postgres.com/features/transactions), [cliente Redis Node](https://redis.io/docs/latest/develop/clients/nodejs/). Son guías de integración, no ejecución de servicios en este proyecto.

**Evidencia posterior en este mismo encargo:** Docker Server 28.0.4 responde; se crearon servicios propios PostgreSQL/Redis con `compose.arcana.yml`, ambos healthy. Segundo bloque: 120 unitarios + 12 integración correctos, tipos/build correctos. PG/Redis y compra/apertura ya están implementados por puerto; no siguen ausentes. `PHASE-4-STATUS.md` identifica sus límites (sin HTTP/Run/BattleLog/Pixi/GSAP) y sustituye esos estados de la tabla inicial. Permanecen P0 motor/nodo/autoridad end-to-end y build con contenido previo; la auditoría no se considera remediación total por los adapters.

## Decisiones de producto pendientes en la fuente

1. Del aprendiz único al combate 3 contra 3: ¿pactos/reclutamiento previo, equipo parcial permitido o préstamo? No conceder dos magos permanentes ni inventar un bloqueo inicial.
2. Estadísticas de 30 cromos, afinidades, enemigos, daño/PM/defensa, objetivo, desempate, límite de combate, derrota/recuperación y valor de sinergias.
3. Precio de sapos/tarros, pesos por identidad y rareza, contenidos/cantidades de nodos, recompensa base/rounding del 10%, botín del jefe y tratamiento de repeticiones/rutas nuevas.
4. Encuentros y pactos: duración de reclutas, elecciones, coste, riesgos y expiración. Taller/bóvedas: recetas, llaves, tablas, costes y alcance MVP.
5. Identidad/recuperación del jugador en servidor, persistencia y requisitos PWA offline; no importar el saldo manipulable antiguo como estado confiable.

Se pidió una única elección agrupada sobre delegar valores de ensayo versionados o mantener pendientes las reglas no definidas. Mientras se resuelve, arquitectura, contratos, tests de reglas definidas y auditoría avanzan. Las fixtures de prueba no aprueban balance de juego.

## Secuencia de migración y aceptación

1. Fuentes actuales y archivo histórico; registrar sustitución de decisiones anteriores sin modificar Word.
2. Dominio nuevo y puertos. Grafo/config validados antes de habilitar gasto. Núcleo sin dependencias de UI/storage.
3. Tests que fallen: energía, grafo, seed/replay, grageas, primera victoria/repetición, compras/apertura atómicas, conflictos y fallos de commit. Registrar RED antes de implementar.
4. Servidor/adaptadores y recorridos completos bilingües. Onboarding→nodo válido→resultado→recompensa→compra/apertura→Cromodex/equipar→nuevo nodo. Reproducción visual sin autoridad económica.
5. Build/test/tipos, navegador, rollback/respuesta perdida/concurrencia/reinicio real del servidor. Verificar artefacto limpio de términos/arte antiguos. Informar por separado funcionalidad, límite de seguridad local, arte provisional, PWA y pruebas físicas.

La auditoría es evidencia del estado inspeccionado, no observación de usuarios ni validación del balance.

**Remediación posterior A34:** engine determinista, sinergias/Grageas, `Run`, tres casos de uso de ruta/combate, seis nodos y premios decrecientes implementados; generación prueba 15 nodos+jefe. PostgreSQL guarda run/log JSONB y progreso relacional en misma tx. 161 unitarios y 16 integración real, tipos/build correctos. Esto resuelve los gaps de reglas/persistencia en el núcleo parametrizado, sin elevar fixtures a contenido productivo. P0 del entrypoint/artefacto histórico continúa; HTTP/identidad/formación/equipo productivos, catálogo/ruta completos y UI Pixi/GSAP es/en siguen pendientes. Consultar `PHASE-4-STATUS.md` para estado vigente en lugar de interpretar las tablas de auditoría inicial como código aún ausente.

**Remediación posterior A35:** HTTP Fastify y composición pg/Redis/PRNG/crypto ya implementados, con sesión, schema estricto, rate limit, estado/config pública, recuperación y comandos de los flujos existentes. Cliente tipado probado por socket TCP local. Esto sustituye el pendiente HTTP del bloque A34, pero no crea registro/login/recuperación de producto ni interfaz ARCANA. Build histórico P0, equipo/kit completo, contenido/producto y Pixi/GSAP/PWA/FPS continúan pendientes. Evidencia/cobertura actual en `PHASE-4-STATUS.md`.

**Remediación posterior A36:** kit exacto único, selección/loadouts/gear poseído y reservas HP/PM implementados; composición pg/Redis/API/cliente probada. Cuatro tests PG y dos API previos a implementación, dos correcciones de grant con assertions RED. 206 unitarios/26 integración correctos. Exploración admite aprendiz único pero conserva 3–5 de combate, sin elegir onboarding o conceder dos gratis. El gap de kit/modelo de equipo se resuelve en núcleo/SQL/API; UI, configuración productiva y artefacto siguen pendientes.
