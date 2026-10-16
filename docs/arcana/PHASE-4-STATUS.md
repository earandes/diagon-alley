# ARCANA — Implementación y evidencia actual

> **A60 ·15 octubre2026:** incremento de diez anotaciones/PokéLike implementado y verificado localmente:368unitarios/40integración SQL-Redis; experiencia20consolidados,apertura16,swap16,PWA12, con regresiones/fixtures por separado. [Informe y límites](pokelike-2026-10-15/REPORT.md). [Contrato](pokelike-2026-10-15/CONTRACT.md), [análisis directo](pokelike-2026-10-15/POKELIKE-ANALYSIS.md). Configuración económica y guardados conservados; compra+apertura añade un comando atómico. No cierra aceptación física, estética humana, lector o retención.

Actualización A59 / PRD 1.0.27 (15 octubre): [las 16 anotaciones del propietario implementadas](annotations-2026-10-15/REPORT.md): escena continua con ambiente reducido/pausado, preparación explícita y equipo fuera del álbum, seis iconos regionales, tres fachadas pintadas e interiores, libretos, bóveda y celebración por rareza. 349 unitarios y 37 integración SQL/Redis correctos; suites de navegador ES/EN y cobertura consolidada detalladas por ejecución en el informe. Autoridad/configuración: 59 archivos sin cambios de bytes. Se conserva la mejora de apertura A58, sin atribuirla de nuevo a este incremento. Capturas antes/después y pruebas técnicas de escritorio; no cierra aceptación estética, hardware físico, lector hablado o retención. No publicado. Las cifras inferiores conservan su fecha histórica.

Actualización A58 / PRD1.0.26 (15 octubre): [treinta personajes pintados y apertura corregida](illustrated-assets-2026-10-15/REPORT.md),90WebP activos,2,46MB, familia inspeccionada y encuadres coordinados.339unitarios/37integración SQL-Redis y50casos navegador del ámbito correctos por suites separadas (4arte+16opening+16rediseño+12PWA+2arena); no se suman reintentos o los124históricos A57. Máximo frame apertura Chromium16,8ms frente216,7–233,2ms comparable anterior, WebKit35–37ms; cerca60FPS en escritorio, arte final compilado. Sin alterar economía/partidas y con es/en/swap/recarga/omitir/reducido/PWA comprobados. No cierra aceptación estética del propietario, hardware físico, lector hablado o retención. Las cifras inferiores conservan su fecha histórica.


Actualización A57 / PRD1.0.25 (15 octubre): [rediseño jugable Diagon Alley y ARCANA intercambiable](diagon-game-redesign-2026-10-15/REPORT.md), idiomas solo Ajustes, apertura ampliada y colección derivada de cuatro sabores reales.339 unitarios,37 integración reales y124 casos navegador distintos correctos por cobertura consolidada (76 recorrido+20 harness+16 A57 compilado+12 PWA), sin sumar repeticiones ni afirmar corrida única; desglose en el informe enlazado. La exclusión temática A29 queda sustituida solo en presentación. No cierra arte final, hardware físico, lector o sesión humana/retención. Las cifras siguientes conservan su fecha histórica.

Actualización A56 / PRD1.0.24 (15 octubre): [rutas variables guardadas, mapa completo sin scroll y seis nodos con decisiones/previsualización](visual-nodes-2026-10-15/REPORT.md). **319 unitarios,36 integración SQL/Redis,106 casos navegador distintos** (74 recorrido+20 harness+12 PWA); reejecuciones no sumadas. Una región; valores económicos/esquemas/Word conservados, nuevas elecciones y autoridad de rutas sí implementadas. No cierra hardware, lector hablado o sesión humana A53.


Auditoría final 12 octubre: [entregables cotejados y límites](FINAL-ACCEPTANCE-AUDIT.md). Sin otro gap funcional identificado en MVP; hardware móvil/Firefox/lector/zoom nativo no acreditados. Scanner reejecutado correcto; suites vigentes sin repetir al no cambiar código.

Actualizado 12 octubre 2026. La entrega comienza por auditoría y continúa la implementación completa solicitada. Goal activo; no presentar como ARCANA terminado.

## Estado actual tras decimoséptimo bloque A48

Arena muestra bonificaciones por equipo y peana, afinidad, consumible registrado e identidad de formación por posición. Alquimia III/Fuego II/Sombras I separan tier de número de contribuyentes; valor proviene de `combat.input.rules`, no configuración vigente. Medidores y registro distinguen actores que comparten nombre. Mensajes es/en completos con singular/plural. [Contrato previo](ARENA-PASSIVES-CONTRACT.md).

`ReplayPassive`/`ReplayUnit.passives` son proyecciones inmutables de activaciones ya consumidas. Antes del evento quedan vacías; validación usa formación inicial/umbrales de engine v1 y rechaza neutral/miembros incompatibles/duplicados. Engine aplica bonos al equipo completo, incluido aliado neutral, y conserva activación durante el duelo aunque caigan contribuyentes; la vista conserva esa semántica. No recalcula combate, daño, curación o iniciativa. No nuevos eventos, esquema SQL/API o balance.

`BattlePanel` valida snapshot antes de montar playback. Registro incompatible muestra alerta localizada y retorno al mapa, sin crash, seed, comando o recompensa nueva; no reemplaza resultado persistido. Prueba de corrupción es fixture de navegador, no un fallo real del servidor. Frame válido conserva los mismos HP/PM/resultados.

### Verificación vigente A48

- **298 unitarios**, 33 archivos (23 históricos + 275 ARCANA), `block-17-unit-final-extra.txt`; **36 integración PostgreSQL/Redis**, siete archivos, `block-17-integration-final.txt`.
- Navegador **62 casos distintos correctos**: 30 UI/recorrido (`block-17-browser-trial-final.txt`), 20 metadata/arena/contraste (18 de suite `block-17-browser-metadata-final.txt` + dos casos Shadows añadidos, comprobados con ocho de passives en `block-17-browser-passives-final.txt`), 12 PWA compilada (`block-17-browser-pwa-final-current.txt`), Chromium/WebKit. No sumar repetición de casos como casos nuevos. UI Shadows I sobre neutral y singular del registro es/en; fallback ambos idiomas sin pageerror; texto 200%/contraste/pausa/frame vivo cinco unidades.
- Tipos (`block-17-types-final.txt`), build con principal/worker (`block-17-build-final-current.txt`) y scanner (`block-17-build-scan-final.txt`) correctos: **938176 bytes** distribuidos, sin recursos/términos históricos. Pruebas/fixture de carga fuera del build. Word hashes intactos.
- TDD: tres RED de assertions de pasivos (`tdd-arena-passives-red.txt`) → GREEN; neutral/cambio de contribuyentes/Shadows/cero como refuerzo posterior explícito. UI cuatro RED por regiones/bonos ausentes (`tdd-arena-passives-ui-red.txt`), pasos posteriores no alcanzados. Primer GREEN falló al localizar summary como button; primera corrección por reemplazo de string no coincidió con formato multilínea, intento repetido conservado, luego selector summary corregido con comprobación de coincidencia. `tdd-arena-passives-recovery-red.txt`: cuatro validos GREEN y dos RED de corrupción/crash, luego guard y seis GREEN. Shadows/singular suplementarios, ocho finales GREEN. No RED retrospectivo del guard, de integración o de refuerzos.
- Perfil cinco por lado, diez segundos/320/390/1280, warmup 500 ms, trace off: Chromium **59,10 / 60,00 / 60,00 FPS**, WebKit **60,02 / 60,02 / 60,02**, p95 16,7–18 ms (`block-17-profile-*`). UI adicional mantiene nivel de A47; no mejora GPU nueva atribuida a etiquetas. Contraste estático bajo texto de peanas mantiene mínimo **5,20233:1**, foco probado (`block-17-contrast-*`). No página completa/lector/animación certificados.
- CLI propia `arcana-a48` sobre build: imágenes `block-17-passives-320-es.png` / `block-17-passives-320-en-200.png` revisadas. Root32, scrollWidth320, peanas sin recorte, seis nombres de medidor distintos para tres por lado, SQL igual después de idioma/navegación (`block-17-cli.txt`). Texto ampliado requiere scroll vertical; no zoom nativo o móvil físico. 401 inicial esperado sin cookie; no consola vacía afirmada.
- Sin dependencia, gasto, instalación global, push/despliegue o CI remota observada. Preview/CLI y servicios propios detenidos, volúmenes conservados (`block-17-services-stop.txt`). Pregunta de hardware pendiente; tiempo no equivale a respuesta.

**Goal activo:** cerrar auditoría final de aceptación y verificar hardware/lector/zoom nativo donde exista acceso. Flujos MVP, bufos y stack están conectados; no atribuir estas pruebas de escritorio a un teléfono. Balance/arte/cuentas siguen identificados como ensayo. [Matriz vigente](REQUIREMENTS-STATUS.md). Secciones posteriores históricas.

## Evidencia del decimosexto bloque A47

Tipografía funcional en rem: etiquetas de unidades/controles ahora crecen con el texto al 200%. Peanas con altura mínima flexible; `BattlePanel` mide centros DOM después de layout con ResizeObserver y entrega posiciones al adaptador Pixi, sin reads por frame o cálculo de combate. Cabecera/barra inferior envuelven; altura real de nav reserva contenido y márgenes de scroll. Títulos largos se parten sin provocar overflow. Mapa adapta distancia entre filas a etiquetas medidas y su ancho relativo permite pan interno al ampliar; lista equivalente conserva acciones. [Contrato previo](ACCESSIBILITY-LOAD-CONTRACT.md).

Fixture visual explícito de cinco unidades por columna, log largo determinista y consumibles, fuera del build y sin cuenta/inventario económico. Mide diez segundos por tamaño y confirma que pausa detiene dibujos. Comparación mostró coste de multisampling: antialiasing del canvas desactivado para la geometría provisional, texto DOM sigue nativo. Reglas/seed/resultado no cambian.

Contraste de arena: se oculta solo color del texto sin alterar layout y se captura fondo WebGL real; se compara cada píxel bajo las cajas de etiquetas con foreground CSS. Muestra estática confirmada: mínimo **4,40555:1** con fondo rival previo, RED ambos motores; opacidad rival 80% eleva mínimo conjunto a **5,20233:1**. Indicador de foco de replay comprobado con modalidad teclado y ratio >=3. No certificación página completa/animación/lector. Revisión CLI también encontró hover activo con texto oscuro sobre fondo oscuro: RED de recorrido, tratamiento gold propio para nav/welcome corrige.

### Verificación vigente A47

- **293 unitarios**, 33 archivos (23 históricos + 270 ARCANA), `block-16-unit-final-current.txt`; **36 integración PostgreSQL/Redis**, siete archivos, `block-16-integration-final.txt`.
- Navegador **54 casos correctos**: 30 UI/recorrido (`block-16-browser-trial-final-current.txt`), 12 metadata/arena/contraste (`block-16-browser-metadata-load-final.txt`) y 12 PWA compilada (`block-16-browser-pwa-final-current.txt`), Chromium/WebKit. Dos casos de contraste repetidos después de corrección de tipos con mismo resultado (`block-16-contrast-final-current.txt`), no contados dos veces. E2E conserva SQL al ampliar/idioma/recarga y ahora comprueba hover legible y nav font duplicada.
- Build con tipos principal/worker (`block-16-build-final-hover.txt`) y scanner (`block-16-build-content-final-hover.txt`) correctos: **934600 bytes**. Typecheck inicial del fixture usaba un argumento extra de createInventory; corregido. Siguiente typecheck detectó remove sobre Node genérico: usar parentNode.removeChild corrige, contraste vuelve a pasar. Logs fallidos conservados.
- TDD: texto cinco unidades RED real (14 px sin crecimiento), primer GREEN todavía RED por overflow; recorrido cuatro RED por ampliación. CLI identifica título sin corte de palabra que excedía ancho. `tdd-map-spacing-red/green.txt` assertion real por spacing ignorado; helper ampliado conserva IDs/adyacencia. Contraste RED real (`block-16-contrast-first.txt` + JSON), GREEN tras opacidad; hover activo RED cuatro (`tdd-active-hover-red.txt`), GREEN en suite final. Assertions suplementarias no declaradas como RED previo.
- Perfiles de cinco por lado: diez segundos por 320/390/1280, warmup 500 ms, Mac headless, sin trace en medición. Antes de cambio GPU, Chromium desktop **50,22 FPS**, p95 33,4 ms (`block-16-load-untraced-chromium.json`). Tras desactivar antialiasing: **59,10 / 60,00 / 60,00 FPS**; WebKit **60,02 / 60,02 / 60,02** (`block-16-load-no-msaa-*`). p95 Chromium 16,7–16,8 ms, un intervalo >25 ms a 320; WebKit 18 ms y un intervalo >25 ms a 320. No afirmar cero frames perdidos o teléfono real. Mediciones con trace anteriores conservadas (`block-16-load-traced-*`); primer intento de configurar trace en describe rechazado por Playwright, cero mediciones de ese intento.
- CLI `arcana-a47-final` sobre build estable: root **32 px**, unidad **24 px** a 320, nav **28 px**, alto nav135/reserva159, scrollWidth320; peanas sin texto recortado. Mapa560 dentro de viewport288, solo pan interno, lista accesible. SQL idéntico después de idioma/navegación (`block-16-cli-final.txt`). Imágenes arena/reveal es/en/map revisadas `block-16-*-320-*-200-final.png`: anteriores a la última corrección de hover; la imagen map muestra el fallo de hover, no se presenta como acabado final. Hover corregido verificado en E2E. Primer diagnóstico posterior a HMR perdió ajuste de root y no acredita 200% (`block-16-cli-after.txt`); revisión estable sí. 401 inicial esperado sin cookie, no consola vacía afirmada.
- Consulta read-only ADB: cero dispositivos conectados. Pregunta sobre hardware disponible pendiente; ninguna respuesta inferida por tiempo. No instalación global/paquetes/gasto/push/despliegue o CI remota observada. Word hashes intactos. Servicios/CLI propios detenidos en `block-16-services-stop.txt`, volúmenes conservados.

**Goal activo:** verificar hardware/lector/zoom nativo y cerrar presentación de bufos por unidad/separación de sinergias de equipo en arena. La medición actual es de escritorio, no rendimiento móvil observado. Balance/arte/cuentas continúan de ensayo. [Matriz vigente](REQUIREMENTS-STATUS.md). Entradas siguientes son históricas.

## Evidencia del decimoquinto bloque A46

Navegación por hash cerrado conserva vista y subtienda en recarga/atrás/adelante. El hash solo identifica presentación, sin IDs económicos o peticiones; ruta desconocida normaliza al mapa. Arena sin log explica ausencia y ofrece retorno. Cambio de ruta enfoca contenido; idioma mantiene vista. Sin router/dependencia ni reglas en React. [Contrato previo](NAVIGATION-ERRORS-CONTRACT.md).

Mensajes es/en explican energía/fondos/llaves/formación/stock/versiones/sesión/almacenamiento/intención pendiente/resultado incierto. El modal de nodo muestra causa y actualizar antes de reconfirmar; operación pendiente usa recuperación existente. Resultado del jefe enlaza con Misiones y muestra desbloqueo guardado. Bosque ya estaba guardado/visible desde A41; su ruta de 20 nodos sigue futura, sin nuevo balance.

Navegación encontró regresión PWA real: `Request.url` de reload conservaba fragmento, por tanto la allowlist exacta no reconocía shell. RED unitario nuevo + ocho fallos de browser conservados; normalizar solo `url.hash` antes de match corrige, API/query/POST siguen fuera de caché. Nueva ejecución recuperó correctamente Bazar, pero el test anterior esperaba volver al mapa: expectativa actualizada a pantalla conservada, sin cambio económico.

### Verificación vigente A46

- **292 unitarios**, 33 archivos (23 históricos + 269 ARCANA), `block-15-unit-final-current.txt`; **36 integración PostgreSQL/Redis**, siete archivos, `block-15-integration-final.txt`.
- Navegador **48 correctos**: 30 recorrido/UI (`block-15-browser-final.txt`), 6 metadata (`block-15-metadata-final.txt`), 12 PWA compilada (`block-15-pwa-final-restored-view.txt`), Chromium/WebKit. Casos existentes ampliados para URL/atrás/adelante/reload/subtienda/foco/SQL intacto, jefe→Misiones/reload y rechazo de Esencia simulado en HTTP dentro del modal→actualizar→nueva confirmación. La simulación UI no acredita un rechazo económico real; reglas de servidor ya cubiertas por dominio/integración.
- Tipos principal/worker (`block-15-types-final.txt`), build (`block-15-build-final-current.txt`) y scanner (`block-15-build-scan-current.txt`) correctos: **932426 bytes** distribuidos. Sin contenido histórico en app/build. Word hashes intactos.
- TDD: `tdd-navigation-errors-red.txt` módulo ausente (cero assertions alcanzadas), GREEN cuatro casos; `tdd-network-error-red.txt` assertion real detectó código `NETWORK_ERROR`, GREEN tras corregir mapa. Navegador suplementario escrito después del helper; no RED retrospectivo para esas nuevas assertions. `tdd-pwa-hash-red.txt` assertion real seguida de GREEN. PWA `block-15-pwa-final.txt` ocho reloads fallidos con hash, `block-15-pwa-final-current.txt` ocho expectativas antiguas fallidas tras corregir worker, final 12 GREEN. Primer test enfocado siete GREEN/uno interrumpido por HMR mientras se editaba App/traducciones; suite estable posterior 30 GREEN. Intentos fallidos conservados.
- CLI propia `arcana-a46`: imágenes revisadas `block-15-boss-unlock-320-es.png` y `block-15-unlocked-320-en-200.png`. 320 px, raíz EN al 200%, scrollWidth 320; Bosque guardado y misma cuenta/SQL tras idioma/navegación/recarga (`block-15-cli.txt`). Texto ampliado requiere scroll vertical; no zoom completo, lector físico o certificación WCAG. 401 inicial sin cookie esperado.
- Perfil Mac 320/390/1280 ~2,2 s: **55,46–60,03 FPS**, sin overflow (`block-15-profile-chromium/webkit.json`). 60 sostenidos, cinco unidades bajo carga y móvil físico aún pendientes. No atribuir mejora de renderer a navegación.
- Sin paquete, gasto, instalación global, push/despliegue o CI remota observada. Limpieza de servicios/preview/CLI propios registrada en `block-15-services-stop.txt`; volúmenes conservados.

**Goal activo:** flujos MVP y stack conectados; restan verificación de carga/rendimiento y QA de accesibilidad/dispositivos. Configuración y arte son de ensayo, sin aprobación de balance productivo o recuperación de cuenta elegida. [Matriz vigente de requisitos](REQUIREMENTS-STATUS.md). Las secciones posteriores son históricas.

## Evidencia del decimocuarto bloque A45

PWA del artefacto compilado: manifest standalone e iconos PNG propios 192/512, worker TypeScript con configuración WebWorker y precache generado de archivos exactos del build. API, POST, orígenes externos y URLs no declaradas siempre pasan a red; no saldo ni operaciones económicas offline. Activación elimina solo cachés propias antiguas, sin `skipWaiting` ni recarga forzada. Registro opcional: si falla, la aplicación online sigue operativa. [Contrato previo](PWA-CONTRACT.md).

UI es/en bloquea comandos offline; una sesión cargada identifica sus saldos como última lectura. Recargar offline recupera shell, sin inventario cacheado. Reconexión consulta estado/receipt con controller existente y conserva la misma key. Preview conectado opt-in mediante `npm run preview:arcana`, mismo gateway local y PostgreSQL/Redis; no servidor público ni autenticación productiva nueva.

### Verificación vigente A45

- **287 unitarios**, 32 archivos (23 históricos + 264 ARCANA), `block-14-unit-final.txt`; **36 integración PostgreSQL/Redis**, siete archivos, `block-14-integration-final.txt`.
- Navegador **48 correctos**: 30 recorrido/UI (`block-14-browser-final.txt`), 6 metadata (`block-14-browser-metadata.txt`) y 12 PWA compilada (`block-14-pwa-browser-final-current.txt`), Chromium/WebKit. Offline/recarga/reconexión es/en sin cambios SQL, fallo de registro, actualización esperando cierre y caché ajena conservada, compra SQL confirmada cuya respuesta se descarta antes de llegar al cliente: recarga offline y reconexión recuperan mismo receipt, sin otro POST. Pérdida de respuesta simulada con wrapper fetch después del commit real; no corte de red físico.
- Tipos principal/worker (`block-14-types-final-current-second.txt`), build (`block-14-build-second.txt`) y scanner (`block-14-build-content-final-current.txt`) correctos: **926599 bytes** distribuidos. Manifest y contenido histórico inspeccionados. Criterios técnicos de instalabilidad Chromium sin errores; no instalación real en Android/iOS.
- TDD: módulos build/worker ausentes en `tdd-pwa-build-red.txt` / `tdd-pwa-worker-red.txt` (sin assertions alcanzadas); GREEN posterior. Navegador RED real por manifest ausente (`tdd-pwa-browser-red.txt`). Primer GREEN detectó fallo Chromium offline por `Vary: Origin`: precache y módulo usan solicitudes distintas. Match `ignoreVary` solo para allowlist pública estática inmutable corrige, API no cambia. Fallos posteriores de interceptación quedan registrados: route de Page no observó worker, update sin bytes nuevos no instaló versión, route de contexto no descartó respuesta WebKit controlada por worker. Fixtures corregidas: contexto para bloqueo, bytes reales temporales/restaurados del worker, fetch del cliente para pérdida de respuesta. Logs fallidos conservados; no contados como éxito.
- CLI propia `arcana-a45` cerrada: capturas `block-14-offline-session-320-es.png` / `block-14-offline-boot-320-en-200.png`, icono revisados. `block-14-cli.txt`: viewport/scrollWidth 320, comienzo offline deshabilitado y SQL igual al reconectar; raíz al 200% no equivale a zoom completo o móvil físico.
- Perfil Mac 320/390/1280, muestra ~2,2 s: **55,46–60,27 FPS**, sin overflow (`block-14-profile-chromium/webkit.json`). No acredita 60 sostenidos, cinco unidades bajo carga ni móvil físico.
- Sin dependencia nueva, gasto, instalación global, push/despliegue o CI remota observada. Preview/CLI y servicios propios detenidos, volúmenes conservados (`block-14-services-stop.txt`). Word intactos.

**Goal activo:** revisar desbloqueo visible, navegación/errores y aceptación/rendimiento restante frente al alcance requerido. Bosque ampliado de 20 nodos pertenece al futuro del Word; balance/arte/cuentas son de ensayo. Las secciones siguientes son evidencia histórica.

## Evidencia del decimotercer bloque A44

Encuentros narrativos completos para las tres salidas del ensayo. `EncounterChoice` incluye narrativa opcional `{version,text:{es,en}}`, y `NodeReceipt.encounter.resolution` conserva efecto elegido, relato y PV antes/después por unidad. Seed/índice originales siguen guardados; nada se reconstruye de config vigente. `resolveEncounter` aplica recompensa/curación/daño como servicio puro, y `encounterResolutionSnapshot` comprueba resultados almacenados usando la misma regla, IDs/PV finales y recompensa. App solo coordina RNG/transacción; SQL JSONB/HTTP/controller existentes conservan datos nuevos sin migración.

Config de ensayo versión 3 incorpora tres relatos originales/narrativa versión 1; pesos 1/1/1, premio 10 Coronas y curación/daño 10% intactos. Campaña/grafo/reglas versión 1 sin cambio mecánico, por tanto runs activas compatibles. No balance productivo aprobado. Legacy sin resolución mantiene ausencia y la vista explica que el detalle no se registró, conservando PV/recompensas conocidos. [Contrato previo](ENCOUNTER-CONTRACT.md).

`EncounterOutcome` muestra relato del snapshot, efecto/porcentaje y PV antes→después con claves completas/localización. Aviso de riesgo antes de confirmar; cancelar no gasta ni avanza. Idioma/recarga conservan resolución y no envían operación. No elección narrativa nueva, ingredientes, zona o motor genérico. Historia se confirma dentro de la misma tx que ruta/recompensa/PV/receipt, antes de presentarla.

### Verificación vigente A44

- **282 unitarios**, 30 archivos (23 históricos + 259 ARCANA), `block-13-unit-final-current.txt`. Siete nuevos: servicio de tres efectos/caps/inmutabilidad, validar datos almacenados y narrativa, uso/replay sin config, rechazo antes de seed, compatibilidad legacy/tamper y contenido de ensayo.
- **36 integración PostgreSQL/Redis**, siete archivos, `block-13-integration-final.txt`. Nuevo caso de narrativa: fallo antes de COMMIT conserva estado; respuesta perdida posterior, pool reabierto y replay sin config/seed recuperan relato/efecto/versiones y una sola recompensa. Inicialmente GREEN sobre adapter existente (`block-13-postgres-first.txt`), no RED retrospectivo.
- UI/recorrido es/en Chromium/WebKit **30 correctos**, `block-13-browser-final.txt`; metadata real **6 correctos**, `block-13-browser-metadata.txt`; total navegador **36**. Caso HUD ahora pasa por encuentro y jefe: cancelación con SQL intacto, relato/efecto, idioma y recarga sin gasto, jefe/llave/replay conservados. Tres ramas de efecto forzadas en dominio; UI usa selección real de servidor, no afirmar que las cuatro ejecuciones aleatorias cubran las tres salidas.
- Tipos correctos (`block-13-types-final-current.txt`), build (`block-13-build-final.txt`, incluye tsc) y scanner (`block-13-build-content-final.txt`): **916972 bytes** distribuidos, sin contenido histórico. Presupuesto actual con arte provisional, no tamaño final de recursos.
- TDD: `tdd-encounter-red.txt` dos RED reales de assertions (resolución ausente/config inválida aceptada) y servicio ausente (cero assertions previas de esos tres casos), GREEN posterior; contenido RED→GREEN `tdd-encounter-content-*`. UI RED antes de controles por aviso ausente, pasos posteriores no alcanzados en RED. Primer GREEN `tdd-encounter-ui-green.txt` falló por lectura antes de commit; espera al resultado confirmado corrige, cuatro GREEN `tdd-encounter-ui-green-current.txt`, luego suite completa. Legacy/tamper/SQL suplementarios. Typecheck inicial detectó spread nullable de fixture; usar valor previamente estrechado corrige. Intentos conservados, sin reconstruir evidencia previa.
- CLI propia `arcana-a44` cerrada. Capturas vistas `block-13-encounter-320-es.png`, `block-13-encounter-320-en-200.png`: 320×844, raíz 32 px en EN, scrollWidth 320 y SQL igual después de idioma (`block-13-cli.txt`). Texto ampliado requiere scroll vertical, sin recortar el contenido; no zoom completo del navegador o lector físico. Primer intento CLI pasó acciones pero falló al usar URL relativa en APIRequestContext sin baseURL; retomado en la misma run para revisión con URL absoluta, sin repetir concesión/avance (`block-13-cli-first-attempt.txt`). 401 inicial sin cookie esperado; no consola vacía afirmada.
- Perfiles vigentes `block-13-profile-chromium/webkit.json`: Mac 320/390/1280, muestra ~2,2 s tras warmup 500 ms, **55,91–60,00 FPS**, sin overflow. Objetivo 60 sostenidos/móvil físico/cinco unidades bajo carga aún no demostrado; no mejora de renderer atribuida al texto de este bloque.
- Sin paquete, gasto, instalación global, push/despliegue o CI remota observada. Vite/CLI y servicios propios detenidos; volúmenes conservados (`block-13-services-stop.txt`). Word históricos/adjunto intactos.

**Goal activo:** quedan presentación completa del desbloqueo, PWA, navegación URL/errores/QA restante y objetivo de rendimiento. Bosque ampliado de 20 nodos es futuro del Word; no añadirlo automáticamente al MVP. Balance/arte/cuentas de ensayo, U25/U26 sin decisión productiva. Bloques siguientes son evidencia histórica; pendientes resueltos no describen estado vigente.

## Evidencia del duodécimo bloque A43

Cromos con 1–5 estrellas en revelación holográfica, álbum e inspección por copia, es/en. `WizardDefinition.stars?: StarCount` acepta únicamente enteros 1–5 cuando existen; snapshot/adquisición/copy/receipt los conservan y la coincidencia almacenada valida el campo. Catálogo público y configuración de ensayo versión 2; tabla de sapos versión 2/catalogVersion 2. Mismos cuatro rangos, IDs/stats/pesos/precios y kit; sin nueva potencia o variante.

Correspondencia provisional explícita por identidad en JSON: Común 1, Inusual 2, ocho Épicos alternan 3/4, Arcano Legendario 5. U25 no resuelto como balance productivo. Cambios futuros se versionan y afectan nuevas adquisiciones, nunca copias/receipts anteriores. Copias antiguas sin estrellas muestran “Estrellas no registradas”/“Stars not recorded”; no inferencia desde catálogo nuevo. SQL existente de snapshots/receipt basta, sin migración. [Contrato previo](STARS-CONTRACT.md).

`StarRating` representa símbolos decorativos y texto completo/plural, sin azar o reglas en React. CLI encontró overflow del sello de GSAP: span invisible escala 1,7 con ancho del panel y dejaba página de 369 px en viewport 320. Ancho propio 34 px y margen centrado corrigen sin recortar contenido funcional/cambiar operación.

### Verificación vigente A43

- **275 pruebas unitarias** correctas, 29 archivos (23 históricas + 252 ARCANA), `block-12-unit-final.txt`. Seis nuevas: validar inválidos, snapshot/inmutabilidad/stats intactos, histórico por copia, contenido público, adquisición/replay/versiones y discrepancia copia/receipt.
- **35 integración PostgreSQL/Redis** correctas, siete archivos, `block-12-integration-final.txt`. Nueva prueba SQL tras cerrar/reabrir pool: estrellas guardadas 2, replay conserva 2 tras configurar 5 y nueva adquisición guarda 5; ambas copias/receipts conservan su dato. Refuerzo posterior inicialmente GREEN (`block-12-postgres-first.txt`), sin inventar RED del adapter existente.
- UI/recorrido es/en Chromium/WebKit **30 correctas** tras corregir sello, `block-12-browser-final-current.txt`; metadata real **6 correctas**, `block-12-browser-metadata.txt`; navegador total **36**. Revelación/álbum/inspección/recarga y cambio de idioma mantienen snapshot SQL, 320 px y raíz 200% sin overflow.
- Tipos correctos (`block-12-types-final.txt`), build actual con tipos incluido (`block-12-build-final-current.txt`) y scanner (`block-12-build-content-final-current.txt`): **912521 bytes** distribuidos, sin términos/assets históricos. Presupuesto actual con arte provisional; no arte final estimado.
- TDD: seis RED de assertions `tdd-stars-red.txt` y GREEN; UI RED es/en `tdd-stars-ui-red.txt` antes de estrellas y GREEN cuatro `tdd-stars-ui-green.txt`. Campos/idioma suplementarios identificados. RED de viewport `tdd-seal-overflow-red.txt` ambos idiomas, GREEN cuatro `tdd-seal-overflow-green.txt`; seguido de regresión completa. Primer intento `tdd-seal-overflow-first-attempt.txt` no añadió assertions por formato multilinea del test, no es RED. Typecheck inicial detectó dos accesos a unión de receipts sin estrechar; guards por kind corregidos. Logs previos/fallidos conservados.
- CLI propias `arcana-a43`/`arcana-a43-final` cerradas. Capturas vistas iniciales `block-12-stars-320-es.png`, `block-12-stars-320-en-200.png` muestran antes de fix (overflow invisible confirmado por geometría, no apariencia). Capturas actuales vistas `block-12-stars-320-es-current.png`/`block-12-stars-320-en-200-current.png`: scrollWidth 320 para viewport 320, estrellas/etiquetas legibles. Raíz 32 px no equivale a zoom completo del navegador. 401 inicial sin cookie esperado; lector/móvil físico no verificados. Screenshot no prueba persistencia: SQL/recorrido sí.
- Perfil vigente `block-12-profile-chromium/webkit.json`, Mac a 320/390/1280, ~2,2 s tras warmup 500 ms: **55,46–60,00 FPS**, sin overflow. Objetivo 60 sostenidos/físico/cinco unidades bajo carga no demostrado. Perfiles son de suite posterior al fix, no mejora atribuida a estrellas.
- Sin paquete/gasto/instalación global/push/despliegue o CI remota observada. Vite y servicios propios detenidos, volúmenes conservados (`block-12-services-stop.txt`). Word históricos/adjunto intactos.

**Goal activo:** faltan encuentros narrativos con resultado detallado guardado y desbloqueo visible completo, PWA, navegación URL/errores/QA restante y objetivo de rendimiento. Bosque ampliado 20 nodos es futuro del Word, no obligación introducida automáticamente. Balance/arte/cuentas de ensayo, U25/U26 pendientes de decisión productiva. Secciones posteriores son evidencia histórica; pendientes resueltos no describen estado vigente.

## Evidencia del undécimo bloque A42

Taller y Bóvedas conectados al recorrido Bazar→confirmación→resultado→Cromodex. `ForgeWandUseCase` cobra y entrega una pieza propia; `OpenObsidianVaultUseCase` consume una llave y conserva botín/piezas/receipt. Ambos reutilizan la transacción de cuenta, replay previo a configuración/azar y validación de snapshots. No nuevo esquema SQL, repositorio genérico o dependencia. La asignación posterior usa las piezas obtenidas, sin segunda compra ni autoequipado.

Configuración de ensayo pública/versionada: nueve combinaciones madera/núcleo, precios 15/20/25 Coronas por Abedul/Sauce/Saúco y bonus +2/+3/+4; Dragón ×1,20, Fénix ×1,15, Wyvern ×1,10. Bóveda cuesta una llave, dos entradas de peso 1: 50 Coronas + dos sapos + Saúco/Dragón +4 ×1,30, o 75 Coronas + dos tarros + Céfiro 2000 +8 iniciativa. Porcentajes derivados de pesos. Son valores provisionales, no aprobación de balance; kit original intacto. [Contrato previo](FORGE-VAULT-CONTRACT.md).

`CommercePanel` mantiene solo selección/cotización, confirmación nativa y recuperación. Cancelar conserva recursos; idioma dentro del diálogo conserva petición y foco. Ofertas/asequibilidad/probabilidades provienen de aplicación/dominio, precios y premios no se calculan en React. Resultado enfocado después de commit, conservado por receipt tras recarga; error de versión exige refrescar/reconfirmar. Bóveda sin llave explica obtenerla de jefe y deshabilita abrir.

### Verificación vigente A42

- `npm test`: **269 correctos**, 28 archivos (23 históricos + 246 ARCANA), `block-11-unit-final.txt`. Reglas/config, fondos/llaves/versión antes de azar, replay/conflicto/rollback/concurrencia, snapshots/transport/controller/proyección.
- PostgreSQL/Redis: **34 correctos**, siete archivos, `block-11-integration-final.txt`. Tres casos nuevos de comercio SQL: fallo anterior a COMMIT, respuesta perdida posterior con recuperación sin nuevo sorteo, conexiones distintas por una llave, reapertura de pool y equipo/productos persistidos. Caso HTTP autenticado real de forja/canje/replay adicional.
- UI es/en Chromium/WebKit: **30 correctos**, `block-11-browser.txt`; metadata real **6 correctos**, `block-11-browser-metadata.txt`, total navegador **36**. Forjar→equipar→pactos→jefe→llave→canje→recarga; cancelación conserva snapshot SQL, idioma dentro del modal y foco comprobados. Unidad obtenida abrible/equipo asignable sin otra compra.
- Tipos/build/scanner correctos: `block-11-types-final.txt`, `block-11-build-final.txt`, `block-11-build-content-final.txt`. **911596 bytes** distribuidos, sin contenido histórico; assets actuales provisionales, no estimación del arte final.
- RED/GREEN reales conservados en `tdd-commerce-*`, `tdd-vault-probability-*`: módulos ausentes antes del código de reglas; transporte 404/métodos ausentes, metadata, contenido/proyección ausentes y UI antes de Taller. Integración inmediatamente GREEN sobre adapter genérico existente: **no atribuirle RED anterior**. Assertions adicionales de foco/idioma suplementarias. Primer GREEN UI `tdd-commerce-ui-green.txt` falló por selector `getByLabel` que incluía opciones del select; interrumpido y corregido a rol/nombre accesible. GREEN actual `tdd-commerce-ui-green-current.txt`, seguido de suite completa, sin borrar intentos fallidos.
- CLI propia `arcana-a42` cerrada. Capturas vistas: `block-11-workshop-320-es.png`, diálogo y resultado `block-11-forge-*-320-en-200.png`, bóveda sin llave `block-11-vault-empty-320-{es,en}-200.png`. Viewport 320×844, raíz 200%/32 px; sin overflow horizontal. Diálogo: top 68,44 / bottom 775,56; resultado top 70,84 / bottom 754,34, nav top 779; heading enfocado entre 99,84–121,84. Texto al 200% no equivale a zoom completo del navegador. 401 inicial sin cookie esperado, no consola vacía afirmada. Capturas no prueban SQL: integración/recorrido sí.
- Perfiles vigentes `block-11-profile-chromium/webkit.json`: 320/390/1280 en Mac, muestras ~2,2 s tras 500 ms de warmup, **55,46–60,03 FPS**, sin overflow. Objetivo 60 sostenidos/móvil físico y cinco unidades bajo carga aún no demostrados; no atribuir mejora de rendimiento a este bloque de comercio.
- Sin dependencia nueva, gasto, push/despliegue o CI remota observada. Vite/CLI/servicios propios detenidos, volúmenes conservados (`block-11-services-stop.txt`). Word original/adjunto intactos.

**Goal activo:** faltan estrellas, resolución visible completa de encuentros/desbloqueo siguiente localización, navegación URL/errores/QA restante, PWA y objetivo de rendimiento. El Bosque ampliado de 20 nodos pertenece al futuro del Word; no introducirlo automáticamente como obligación del MVP. Balance/arte/cuentas de ensayo, U25/U26 sin aprobación productiva. Secciones siguientes son evidencia histórica, cuyos pendientes resueltos no describen el estado vigente.

## Evidencia del décimo bloque A41

`PlayerStatus` proyecta puntos regenerados y próximo punto con regla pura + Redis TIME; GET conserva reserva/cursor SQL, revisión, recibos e inventario. DTO obligatorio validado por cliente, sin calcular créditos en React. Controller refresca explícitamente/cada minuto visible/al volver a pestaña, conservando receipt y excluyendo intención pendiente. Otro dueño o revisión anterior no sustituyen el estado; fallo de consulta posterior conserva operación confirmada y señala Esencia sin actualizar, sin nuevo POST.

`activeSynergies` comparte umbrales con engine y HUD de formación viva para el próximo duelo; replay conserva activaciones originales del log. Barras PV/Esencia, PM, equipo propio y títulos es/en; equipo de run cerrada muestra valores guardados, sin aplicarle gear actual a un histórico. `NodeResult` muestra recompensa real y stats de receipt de última visita por ID run/nodo, independientemente de operaciones posteriores de equipo. Recarga recupera resultado/replay sin gasto. Misiones muestra zonas de progreso; Bosque desbloqueado guardado pero su ruta todavía no jugable. Narrativa/effectos detallados de encuentro siguen incompletos, no inferirlos de configuración actual.

Resultado no combatiente se anuncia una vez por receipt (no por refresco/idioma); lector físico no verificado. CLI encontró resultado inicialmente bajo nav. RED formal y primera corrección fallida: el MapPanel volvía a desplazar por nuevas referencias del GET posterior. Dependencias de navegación estables y scroll de resultado corrigen; CTA vuelve a ruta con foco visible, sin seleccionar/consumir. Vite ignora trazas/metadata generadas para evitar recargas ajenas al código de aplicación.

### Verificación vigente A41

- `npm test`: **251 correctos** (23 históricos + 228 ARCANA), `block-10-unit-final.txt`. Once casos nuevos de proyección/sinergias/HTTP/controller/read-model.
- Integración PostgreSQL/Redis: **30 correctos**, `block-10-integration-final.txt`. Consulta con Redis TIME y cursor de fixture pasado, reserva/revisión SQL intactas después de dos lecturas y nuevo adapter.
- Recorrido/UI es/en Chromium/WebKit: **26 correctos**, `block-10-browser-final.txt`. Incluye jefe/llave/recompensa/recarga/replay, query sin escritura y región por encima de nav. Metadata real: **6 correctos**, `block-10-browser-metadata.txt`; total navegador **32**.
- Tipos/build/scanner correctos, `block-10-types-final.txt`, `block-10-build-final.txt`, `block-10-build-content-final.txt`: **898313 bytes** distribuidos, sin términos/assets históricos. Presupuesto vigente con geometría provisional; no tamaño final de arte futuro.
- RED/GREEN: `tdd-hud-models-*` (módulos ausentes no assertions previas), `tdd-hud-http-*`, `tdd-hud-controller-*` (método/campos ausentes), `tdd-saved-node-result-*`, `tdd-hud-results-ui-*`. Refuerzo de integración añadido después de reglas, no RED retrospectivo. `tdd-node-result-viewport-red.txt` tras hallazgo CLI; `tdd-node-result-viewport-green.txt` falló con re-scroll de snapshots, GREEN real `tdd-node-result-viewport-green-current.txt`, seguido de suite completa. No contar intentos fallidos como éxito.
- Fallo intermedio `block-10-browser.txt`: una medición WebKit interrumpida por navegación/HMR mientras se editaba el HUD; ejecución actual con código estable pasa. Typecheck inicial encontró import ya no usado, corregido. No evidencias reconstruidas como RED anterior.
- CLI propias `arcana-a41`/`arcana-a41-review` cerradas. Capturas vistas `block-10-hud-320-es.png`, `block-10-hud-320-en-200.png` (raíz 32 px, no zoom completo), `block-10-node-result-320-es.png` posterior a corrección. Región a 320: top 308,55 / bottom 754,11 / nav top 779, sin overflow; CTA foco pasaje:1:0 entre y361,55–482,14, sobre nav. 401 inicial sin cookie esperado, no afirmar consola vacía. Captura no prueba SQL; integración/recorrido sí.
- Perfiles de ejecución final a 320/390/1280 Mac: `block-10-profile-chromium/webkit.json`, muestras ~2,2 s después de warmup. **55,91–60,03 FPS**, objetivo 60 sostenidos/móvil físico aún no demostrado; cinco unidades/carga larga pendientes. No llamar emulación a dispositivo real.
- Sin nuevas dependencias, gasto, push/despliegue/CI remota observada. Servicios propios detenidos y volúmenes conservados, `block-10-services-stop.txt`. Word históricos y adjunto intactos.

**Goal activo:** faltan estrellas, Taller/Bóvedas, siguiente ruta/narrativa completa de encuentros, navegación URL/errores/QA restante, PWA y objetivo de rendimiento. Balance/arte/cuentas siguen de ensayo; U25/U26 sin aprobación productiva. No reducir objetivo a los bloques verificados. Secciones posteriores históricas: pendientes resueltos no describen estado vigente.

## Evidencia del noveno bloque A40

Cromodex con filtros de rareza/descubrimiento y estado vacío, inspección de cada copia (snapshot, PV/PM activos, poder y velocidad), selección de equipo y equipar/desequipar varita/escoba poseída. Transferencia explícita por instancia mediante casos existentes, recarga conserva loadout. `CollectionPanel` separa presentación de las transacciones; no nuevo cálculo de estadísticas o azar.

`BeanAssignments` antes de duelo/jefe: una Gragea disponible por unidad viva, instancia seleccionada deshabilitada para otras unidades. Efectos y porcentajes de tabla pública; borrador no consume. Cancelar conserva estado/revisión, reabrir empieza sin asignaciones. Idioma se puede cambiar dentro del modal sin perder selección o enviar operación; confirmación guarda exactamente los IDs y activación en log de servidor. Recuperación mantiene la petición mediante controller ya existente.

### Verificación vigente A40

- `npm test`: **240 correctos** (23 históricos + 217 ARCANA), `block-9-unit.txt`.
- Integración SQL/Redis: **29 correctos**, `block-9-integration.txt`.
- Recorrido/UI es/en Chromium/WebKit: **22 correctos**, `block-9-browser-current.txt`; metadata real: **6 correctos**, `block-9-browser-metadata.txt`. Total navegador actual **28**.
- Tipos/build/scanner correctos: `block-9-types-final.txt`, `block-9-build-final.txt`, `block-9-build-content-final.txt`. **886651 bytes** distribuidos, sin términos/assets históricos.
- RED previo es/en por filtro ausente: `tdd-team-beans-ui-red.txt`. Los pasos posteriores de equipamiento/Grageas no llegaron a ejecutarse en ese RED; no atribuirles assertions previas. Primer intento posterior `tdd-team-beans-ui-green.txt` falló por campo de evento incorrecto del test (`type`/`kind`). `block-9-browser.txt` detectó regresión del foco inicial por nuevos botones de idioma, corregida cambiando orden; assertion de `<option disabled>` usa atributo nativo porque toBeDisabled no lo reconocía. Logs fallidos conservados. GREEN de versiones sucesivas en `block-9-browser-final.txt` y vigente `block-9-browser-current.txt`.
- CLI propia `arcana-a40` cerrada: 320 px es/en, raíz 200%/32 px y sin overflow horizontal. Capturas vistas `block-9-collection-320-es.png`, `block-9-collection-320-en-200.png`, `block-9-gear-320-en-200.png`, anteriores al añadido final de descripción estática de equipo que envuelve. No es zoom completo del navegador ni lector/móvil físico. 401 inicial sin cookie esperado; no consola vacía afirmada.
- Perfiles actuales aislados por test, copiados a `block-9-profile-chromium/webkit.json`; viewport emulado en Mac, muestras cortas. Primeras regresiones A40 reutilizaron por error los nombres block-8 de JSON (cifras originales conservadas en reporte histórico, JSON ahora posterior); corregido a `info.outputPath` para no sobrescribir evidencia en siguientes ejecuciones. Objetivo 60 sostenidos/móvil físico sigue sin demostrar; no contar esta regresión como mejora de rendimiento.
- Servicios propios detenidos, volúmenes conservados (`block-9-services-stop.txt`). Sin gasto, dependencia nueva, push, despliegue o CI remota observada. Word intactos.

**Goal activo:** faltan estrellas, HUD/sinergias/equipo y energía regenerada visible, resultados de nodos/boss, Taller/Bóvedas, navegación/errores/QA restante, PWA y objetivo de rendimiento. Balance/arte/cuentas siguen de ensayo, U25/U26 abiertos. No reducir el objetivo al incremento probado. Bloques siguientes son históricos y sus pendientes resueltos no describen el estado vigente.

## Evidencia del octavo bloque A39

Mapa PixiJS 8.22.0 de pergamino/ramas punteadas, seis tipos y botones DOM alineados; lista equivalente, nodo inicial visible y diálogo nativo. Arena dos columnas/peanas/rival rojo, PV/PM/nivel/bonus/beans/sinergias y proyectiles/partículas en canal central. `BattleReplay` copia valores de log validado por cursor, comprueba final contra registro y no calcula daño/azar. Auto/pausa/2x/omitir cambian solo presentación; ningún POST o saldo cambia por reproducir/cambiar idioma.

GSAP 3.15.0 lazy anima sello/carta después de receipt, con omisión/motion reducido. Asset ausente mantiene resultado estático sin rechazo JS no tratado. WebGL explícito (sin fallback automático oculto a otro renderer), ausencia/context loss conserva DOM y termina frame estático; evento de pérdida simulado, no fallo de GPU física observado. Renderer/ticker/observer/tweens se destruyen al cerrar, incluso con init asíncrono tardío. Geometría fija cacheada, solo proyectiles por frame, dimensiones por ResizeObserver; sin bucle de mapa estático. Arte original geométrico/provisional, manifest versión 2.

### Verificación vigente A39

- `npm test`: **240 correctos** (23 históricos + 217 ARCANA), `block-8-tests-final.txt`.
- `npm run test:integration`: **29 correctos** con SQL/Redis, `block-8-integration-final.txt`.
- `npm run test:e2e`: **18 correctos**, Chromium/WebKit es/en, controles/reload/viewport/foco/WebGL/GSAP/perfiles, `block-8-browser-current.txt`.
- `npm run test:arcana:browser`: **6 correctos** de metadata real, `block-8-browser-metadata.txt`; total navegador actual 24.
- Tipos/build/scanner correctos, `block-8-types-final.txt`, `block-8-build-final-current.txt`, `block-8-build-content-current.txt`: **878072 bytes** de artefacto completo, incluidas librerías deferred. No assets históricos distribuidos. Presupuesto <3–5 MB cumplido para recursos provisionales actuales, revisar cuando cambie arte.
- Perfiles reales de arena activa a 320/390/1280 en este Mac, muestras ~2,2 s tras 500 ms de warmup de resize, `block-8-profile-chromium/webkit.json`. Sin overflow horizontal; **55,91–60,00 FPS** (Chromium 320 ~55,91; WebKit escritorio ~57,36). El objetivo 60 sostenidos aún no está demostrado, tampoco cinco unidades o móvil físico. Instrumentación cuenta draws reales más RAF; no inferir FPS por tamaño del build. Optimización/perfil más amplio pendientes.
- RED previo modelos (8), campo corrupto adicional, replay/mapa/fallback/foco, viewport inicial y fallos de contexto/GSAP: logs `tdd-graphics-models-*`, `tdd-replay-fields-*`, `tdd-replay-ui-*`, `tdd-map-viewport-*`, `tdd-graphics-loss-*`. Casos sin módulo no acreditan assertions previas; perfiles/omisión suplementarios no se presentan como TDD retrospectivo.
- Fallos intermedios conservados: selector de victoria también encontraba item del log; WebGL preference string permitía Canvas de fallback; foco Safari usaba activeElement previo; primer nodo bajo nav. Correcciones y GREEN real. Suite ampliada también encontró helper de test sin run y límite de diez nuevas sesiones por IP/h; helper nullable y cuota local 30/h para varias personas/pruebas, rate activo. `block-8-browser-final.txt` falló; no contabilizarlo como éxito.
- Capturas CLI propias vistas: `block-8-map-mobile.png` anterior a corrección de viewport/anchos y `block-8-arena-mobile.png`; sesión cerrada. Screenshot no prueba economía; integración y snapshot posterior a replay sí. Sin gasto, installs globales, push, despliegue o CI remota observada.

**Goal activo:** quedan filtros/estrellas, selección/gear/Grageas completos, HUD y energía regenerada visible, mensajes y resultados de nodos, Taller/Bóvedas, navegación/recuperación/QA restante y PWA. Balance/arte/cuentas son de ensayo; método productivo U25/U26 no elegido. No reducir objetivo a renderer o tests verdes. Bloques siguientes históricos; pendientes ya resueltos no gobiernan estado actual.

## Evidencia del séptimo bloque A38

Ensayo local ejecutable: `npm run services:up` y `npm run dev`, URL `http://127.0.0.1:5189/`. Vite conecta gateway de ensayo/API Fastify con PostgreSQL/Redis reales. Cookie opaca HttpOnly/SameSite Strict de siete días; UUID/kit por autoridad, reentrada sin duplicar kit, origen/contexto de cuenta validados. No recuperación autenticada elegida. U25/U26 sin respuesta: configuración de ensayo explícita, no aprobación de producto.

`trial-v1.json`: 30 identidades bilingües (aprendiz + cinco nombres del PRD + arquetipos originales), cuatro rangos, 15 nodos + jefe/seis tipos, pesos/precios/stats/afinidades/loot provisionales. Dos pactos iniciales amplían 1→3 temporales; Bazar permite equipo permanente sin regalos extra. Proyección `CromodexEntry` conserva copies/snapshots/rangos/versiones, también fuera del catálogo actual; probabilidades derivadas de tabla y adyacencia delegada a dominio.

Entrada principal ahora usa UI ARCANA, título actual y `publicDir: false` evita distribuir recursos históricos. Fuentes/Word/guardado históricos intactos, sin migrar saldos. Primera UI DOM es/en conecta sesión→run→pactos→3vs3→recompensas→compra→apertura→álbum y recarga. Mensajes por claves con parámetros y plurales (`translations.ts`), IDs de catálogo compartidos. Arena muestra resultado de servidor, todavía sin replay/Canvas; mapa ofrece lista de nodos, sin vista ramificada gráfica. Arte/balance/cuenta de ensayo identificados; manifest en `design/arcana/trial-art-manifest.json`.

### Verificación del séptimo bloque

- `npm test`: **231 correctos** (23 históricos + 208 ARCANA), `block-7-tests-final.txt`.
- Integración: **29 correctos**, tres nuevos de gateway/kit/reentrada/contexto/pactos/combate con SQL/Redis, `block-7-integration.txt`.
- `npm run test:e2e`: **4 correctos**, recorrido básico y recarga es/en en Chromium/WebKit, después de traducciones: `block-7-browser-final.txt`.
- `npm run test:arcana:browser`: **6 correctos** de metadata real, `block-7-browser-metadata.txt`.
- Tipos/build/scan correctos, `block-7-types-final.txt`, `block-7-build-translated.txt`, `block-7-build-content-final.txt`. Scanner RED antes de retirar entry/resources históricos; GREEN después. Tamaño total **275586 bytes** distribuido, todavía sin Pixi/GSAP: no medida final o FPS.
- RED previo: `tdd-trial-content-*`, `tdd-trial-gateway-*`, `tdd-read-models-*`, `tdd-trial-ui-*`, `tdd-cookie-client-*`, `tdd-translations-*`. Módulos ausentes no acreditan assertions previas. UI RED buscó acciones ARCANA antes de la presentación; traducciones prueban claves/idiomas/params/plurales antes del extractor/refactor.
- Primer run conjunto de navegador compartía outputDir y falló al cerrar trazas Chromium (ENOENT), `block-7-browser-journey.txt`. Directorios separados, suite reejecutada: cuatro correctos. No contabilizar la ejecución fallida como positiva.
- Playwright CLI local, sesión propia `arcana-a38` inspeccionada/cerrada. Captura 390×844 vista en `trial-mobile-start.png`. Network devuelve 401 esperado al cargar sin cookie; no afirmar consola vacía. Captura no prueba transacciones; integración sí.

**Goal activo:** falta Pixi/GSAP, replay/pausa/2x/colisiones, mapa ramificado gráfico, filtros/estrellas/gear/Grageas, foco/errores específicos, Taller/Bóvedas según reglas, PWA y bundle/FPS/QA completa. UI base aún no satisface todo PRD. Balance/arte/cuentas provisionales. Sin gasto/global install/push/despliegue o CI remota observada. Servicios locales detenidos tras verificar, volúmenes conservados. Bloques siguientes históricos; sus pendientes resueltos no gobiernan el estado vigente.

## Evidencia del sexto bloque A37

`GameController` mantiene snapshots/intención/recuperación sin React o economía. `ClientGateway` y `ClientOperations` son puertos pequeños; HTTP transporta y `IndexedDbClientOperations` guarda exclusivamente petición/key/revisión/versiones/propietario en base separada del guardado histórico. Slot transaccional por jugador; guardar antes del POST, reconocer key antes de anunciar receipt, sin sobrescribir/limpiar otra operación. No guarda saldo, copies, seed o token como autoridad.

Respuesta perdida después de commit recupera receipt sin otro POST; fallo anterior reusa comando íntegro. Fallo de guardado local impide gasto; fallo al reconocer mantiene recuperación sin anuncio nuevo. Config offline permite recuperar receipt anterior. Otra pestaña puede reclamar primero; controller presenta esa intención recuperable. HTTP detecta token cambiado desde el último state validado y bloquea transporte hasta sincronizar; identidad continúa resuelta en servidor.

### Verificación del sexto bloque

- `npm test`: **219 correctos** (23 históricos + 196 ARCANA), `block-6-tests.txt`.
- `npm run test:integration`: **26 correctos** (14 PG, 6 Redis, 6 composición), `block-6-integration.txt`.
- `npm run test:arcana:browser`: **6 correctos**, tres casos en Chromium/WebKit de IndexedDB real, recarga, dos pestañas y metadata inválida, `block-6-browser.txt`.
- Tipos/build correctos: `block-6-types/build.txt`. Primer typecheck detectó imports de URL Vite en tests; corregidos antes de comprobación final.
- RED de controlador (11 iniciales) y adapter previo al módulo; `tdd-client-controller-*`, `tdd-client-indexeddb-*`. Imports ausentes no acreditan assertions previas. Assertions RED de token cambiado y claim concurrente, luego GREEN: `tdd-client-session-*`, `tdd-client-concurrent-controller-*`.
- Formato local, sin dependencia nueva, arte generado, gasto, instalación global, push, despliegue o CI remota observada. Servicios propios detenidos después de verificar, sin borrar volúmenes.

**Goal activo:** faltan proyección Cromodex/log, UI es/en PixiJS/GSAP, configuración completa y U25, identidad/recuperación U26, talleres/bóvedas según reglas, PWA y bundle/FPS. Entry y recursos aún históricos: **build no cumple ARCANA**. Harness vacío de metadata no prueba mapa/arena/Bazar ni accesibilidad del juego. Bloques siguientes históricos.

## Evidencia del quinto bloque A36

Kit exacto inicializado por autoridad una sola vez: un Aprendiz de Alquimia nivel 1, Abedul +2 poder, Céfiro Cadete +3 iniciativa y 50 Coronas. Catálogo/stats suministrados, sin nuevos regalos o datos productivos elegidos. Receipt de kit mantiene referencias/versión y rechaza duplicar copia con esa fuente o quitar su registro. Cuenta existente se recupera sin catálogo/reloj nuevos; concurrencia real no duplica kit.

Equipo persistente por IDs de copias y loadouts; gear como entidades propias versionadas, una instancia por asignación, transferencia/desequipado sin borrado/compra adicional. Solo inventario de autoridad modifica bonus de combate. `SetTeamUseCase` y `EquipEquipmentUseCase`, rutas HTTP/clientes y tx SQL conectados. Cambios entre nodos mantienen HP/PM, run conserva reservas para no curar por retirar/reincluir y temporales siguen solo en run. Histórico BattleLog/input no cambia al mover una varita.

Exploración empieza con 1–5, duelo mantiene 3–5 y retorna INVALID_FORMATION sin Esencia/seed/avance cuando falta formación. La configuración productiva decide cómo se llega a tres; el kit no concede otros dos. Journey probado con kit único→compra dos sapos→apertura→selección→equipar→duelo, usando valores de ensayo explícitos (no balance aprobado).

SQL añade gear/miembros/loadouts relacionales con FK por dueño y unicidad, reserves en JSONB. Reapertura de pool recupera selección/equipo/reservas; init/selección concorrentes y rollback/COMMIT incierto comprobados. `PlayerAccounts` es el puerto de create/read/transact, sin registro público a partir de playerId.

### Verificación del quinto bloque

- `npm test`: **206 correctos** (23 históricos + 183 ARCANA), `block-5-unit.txt`.
- `npm run test:integration`: **26 correctos** (14 PG, 6 Redis, 6 composición HTTP+PG+Redis), `block-5-integration.txt`.
- `npm run typecheck` y `npm run build`: correctos, `block-5-types/build.txt`.
- RED anterior al código: 9 casos kit/equipo, 4 SQL y 2 API; `tdd-kit-team-red.txt`, `tdd-team-postgres-red.txt`, `tdd-team-http-red.txt`. Suites sin módulo se registran como tales. RED con assertions para grant duplicado y receipt ausente; `tdd-kit-uniqueness-red.txt`, `tdd-kit-receipt-red.txt`; GREEN tras corrección.
- Verificación suplementaria fortalece reserva con una batalla que inflige daño y PM; no TDD retrospectivo. La integración del journey completo de kit se añadió después de probar cada comportamiento, sin afirmar un RED previo para ese añadido.
- Sin dependencia nueva en este bloque; código/tests formateados localmente. Sin gasto, generación de arte, instalación global, push o despliegue. No CI remota nueva observada.

Preparación de UI en `UI-CONTRACT.md`: análisis real de captura, anatomía/tokens/estados/recorrido/fallos/persistencia y QA es/en antes de implementar. Taste solo en partes pertinentes porque excluye UI densa; Fantasy estructura componentes y Image-to-Code analiza la referencia, sin generación pagada o uso del arte/personajes adjuntos. Documento no acredita UI escrita.

**Goal activo:** falta controlador/intención recuperable, proyección Cromodex y UI es/en PixiJS/GSAP, configuración completa de ensayo/producto y decisiones de balance/U25, identidad/recuperación U26, talleres/bóvedas según reglas, PWA, bundle/FPS y navegador. El entrypoint y recursos distribuidos aún son históricos: el build compila pero **no cumple ARCANA**. Evidencia posterior sustituye pendientes resueltos de las secciones históricas siguientes.

## Evidencia del cuarto bloque A35

API Fastify 5.12.5 implementada en `infrastructure/http`: estado propio con hora de autoridad, contenido público versionado, recuperación de recibo, compra, apertura, inicio/avance de run y revocación de sesión. JSON Schema rechaza campos extra y coerción. Identidad por sesión Redis; el cliente no proporciona playerId, seed, stats, ganador, recompensa, saldo u hora. Rate limits por IP real/jugador, no-store y códigos neutrales para traducción es/en. UNKNOWN_COMMIT indica conservar/reusar la misma key.

Composición real conecta pg, Redis TIME/sesiones/limits, motor puro, PRNG y `node:crypto` para seed/ticket. Las pruebas ejecutan ruta→combate del servidor→recompensa→compra→apertura; el log persistido se reproduce íntegramente con su entrada/seed. Aislamiento de sesiones, revocación, race HTTP, rollback/respuesta perdida y rate counters comprobados. Un socket TCP loopback se abrió/cerró y el cliente tipado consumió state/content/compra/recovery por red real. No hay servicio HTTP escuchando al terminar.

`PublicContent` proyecta solo campos públicos; snapshot de magos también selecciona atributos explícitos, sin copiar metadata no definida. El primer intento filtraba solo el exterior y la prueba detectó propiedades extra de WizardDefinition; RED/intermedio conservados y GREEN tras corregir el snapshot. No se presenta el intento fallido como comprobación positiva.

Cliente HTTP tipado: valida estado/clock/receipt/config, snapshots inmutables, key/versiones originales y errores de red/JSON/401/conflicto/commit incierto. No lee saldo histórico del navegador, calcula premios o reintenta automáticamente con otra key. Persistir intención pendiente, controlar recuperación/reproducción y conectar React son siguientes tareas.

### Verificación del cuarto bloque

- `npm test`: **193 correctos** (23 históricos + 170 ARCANA), `block-4-unit.txt`.
- `npm run test:integration`: **21 correctos** (10 PG, 6 Redis, 5 composición HTTP+PG+Redis), `block-4-integration.txt`.
- `npm run typecheck` y `npm run build`: correctos, `block-4-types/build.txt`.
- RED previo de API (19 iniciales), crypto (3), composición (5) y cliente (8). RED por módulo ausente se registra sin afirmar assertions ejecutadas antes de importación. Dos correcciones con assertions RED: metadatos públicos y policy incompleta. Logs `tdd-http-*`, `tdd-crypto-red.txt`, `tdd-public-content-*`, `tdd-wizard-public-red.txt` y `tdd-http-policy-*`.
- Fastify instalado localmente con versión exacta/lockfile. Prettier de proyecto aplicado; ninguna instalación global, gasto, generación de arte, push o despliegue. CI remota no observada.
- Redis TIME está integrado al caso de combate por composición real. Registro/login/recuperación U26 no están elegidos: tests provisionan cuentas y sesiones técnicas por autoridad, sin aceptar playerId del cliente. No se afirma autenticación de producto o resistencia exhaustiva a trampas.

**Goal todavía abierto.** Falta kit/equipo completos, configuración productiva (30 cromos/ruta MVP/precios/weights/stats/bonos y transición aprendiz→3–5), registro/login/recuperación, controlador/persistencia de intención, interfaz ARCANA es/en PixiJS/GSAP, talleres/bóvedas según reglas, PWA y medidas de bundle/FPS. La factory HTTP no proporciona aún comando de arranque de producto con configuración real. `src/main.tsx` todavía usa UI/arte históricos: **el build no es ARCANA válido**, aunque compile. Evidencia posterior sustituye pendientes resueltos de las secciones históricas siguientes.

## Evidencia del tercer bloque A34

Implementados en `src/arcana`: motor `CombatEngine` puro de 3–5 unidades por lado, iniciativa/varita/escoba, PM, sinergias y cuatro Grageas; agregado `Combat` con entrada/seed/versiones/log/saldos inmutables. Generador de grafo por pesos/anchuras y PRNG produce la fixture de 15 nodos + jefe, con todos los nodos alcanzables. Dominio no importa React, PixiJS, pg o Redis.

Casos `StartRunUseCase`, `ResolveCombatUseCase` y `AdvanceNodeUseCase`: formación por IDs poseídos y valores de autoridad, prohibición de sustituir run activa, adyacencia/versiones/revisión, consumo 5 Esencia con reloj de autoridad, vida/PM residual, Grageas consumidas una sola vez, primera victoria completa y repetición 10% Coronas, sin repetir items/llaves. Refugio 40%, cofre, pacto temporal hasta 5, encuentro ponderado y jefe que desbloquea zona. Consumo/log/ruta/recompensa/progreso/recibo en una tx por cuenta. Replay devuelve receipt histórico y estado actual sin config/reloj/seed nuevos.

Estos casos son parametrizados; **las cifras y contenido de fixtures son datos de tests, no balance productivo elegido**. `COMBAT-NODE-CONTRACT.md` documenta decisiones de algoritmo de ensayo, recuperación y redondeo explícito. No se conceden magos adicionales para resolver aprendiz→3–5. Taller/bóvedas completas, recetas, precios y catálogo productivo siguen pendientes U25/U26.

Persistencia real: PostgreSQL 16.9 y Redis 7-alpine sobre Docker Server 28.0.4 en servicios propios loopback. Inventario incorpora Llaves de Oro con migración aditiva; run/grafo y battle logs en JSONB, progreso de victorias y zonas en tablas relacionales. FOR UPDATE por cuenta; lecturas repeatable-read. JSONB reordena claves: integración detectó la comparación textual incorrecta y se corrigió por estructura del grafo. Las pruebas cierran/reabren pools reales, **no reinician todavía el proceso PostgreSQL**.

El caso de avance recibe `AuthorityClock`, implementado por Redis TIME; tests del caso usan reloj controlado y tests separados prueban TIME real. No afirmar una conexión end-to-end HTTP/Redis/combat por composición aún inexistente. Sesiones/TTL/rate-limit Redis están probados, pero registro/login/recuperación de cuenta no están decididos ni conectados.

### Verificación del tercer bloque

- `npm test`: 161 correctos (23 históricos + 138 ARCANA), `block-3-unit.txt`.
- `npm run test:integration`: 16 correctos (10 PostgreSQL + 6 Redis), `block-3-integration.txt`.
- `npm run typecheck` y `npm run build`: correctos, `block-3-types/build.txt`.
- RED anterior a implementación: motor (14 tests), run (10 iniciales), generador (5); `tdd-combat-red/green.txt`, `tdd-run-red/green.txt`, `tdd-route-generation-red/green.txt`. RED adicional por premio de repetición al límite seguro, `tdd-repeat-preflight-red/green.txt`.
- Persistencia run RED antes de extender adapter SQL, `tdd-run-postgres-red.txt`; GREEN final comprueba reapertura de pools, rollback tras escrituras, respuesta perdida después de COMMIT, dos conexiones y llaves/zonas/pacto.
- Casos adversos suplementarios/rewards caracterizan reglas existentes; no se inventa una ejecución RED retrospectiva.
- Formato local Prettier aplicado al código/tests ARCANA; sin dependencia nueva en este bloque, instalación global, generación de arte, gasto, commit/push o despliegue. CI remota no observada.

**Build todavía histórico:** `src/main.tsx` usa la UI previa y copia su arte/nombres. No es un artefacto ARCANA válido. PixiJS/GSAP/Fastify no están instalados/conectados; faltan API/identidad/equipo/kit completo, contenido real de 30 cromos y ruta MVP, UI es/en, talleres/bóvedas, PWA, bundle/FPS y end-to-end. El goal sigue activo para completar el MVP; este bloque no cierra la migración. La evidencia siguiente conserva los estados históricos de bloques anteriores, sin hacer vigentes sus pendientes ya resueltos.

## Entregado

- Fase 1: matriz completa de flujos/pantallas/economía/contenido/arquitectura y gaps priorizados en `PHASE-1-AUDIT.md`. Inspección real del código, Word completo, fuentes históricas y checkout. Snapshot/captura del ensayo actual en `baseline-mobile.yml/png`.
- Fase 2: diseño de los cuatro contextos, agregados/VO/eventos, carpeta propuesta, dependencias, transacción y contratos de aplicación en `PHASE-2-ARCHITECTURE.md`. Puertos descritos, todavía no implementados ni conectados a un servidor.
- Fase 3: matriz de casos prioritarios `PHASE-3-TDD.md` y 37 tests ejecutables de Esencia/grafo/PRNG en `tests/domain/arcana`. `tdd-red.txt` registra módulos ausentes: suites fallaron en importación antes de implementar. No se afirma que se ejecutaran assertions antes de existir módulos. `tdd-green.txt`: 37 correctos tras implementación.
- Fase 4 parcial: `src/arcana/domain/economy/essence.ts`, `exploration/route.ts`, `combat/seeded-random.ts` y `errors.ts`. Sin React, infraestructura, reloj global, Math.random o contenido del universo anterior. Funciones puras/objetos inmutables salvo estado interno del PRNG. No están conectados al entrypoint histórico.

## Elecciones técnicas aplicadas

Esencia entero 0..50, costo fijo 5 e intervalos 720000 ms. Regenerar aplica intervalos completos y conserva resto mientras no se alcanza cap. Cap lleno descarta crédito excedente y cuenta desde gasto; no retrocede cursor con reloj atrasado. Son semánticas de implementación para máximo/regeneración, no prueba de reloj autoritativo. Se validan números finitos/enteros seguros. El reloj debe venir de autoridad en los futuros casos de uso.

Grafo con IDs/versiones, seis tipos de nodo, fila estrictamente creciente, referencias únicas/existentes, todos los nodos alcanzables y cada rama con acceso a jefe. Historia valida raíces/aristas/unicidad antes de aceptar avance. Esto implementa navegación de dominio, no un mapa visual o la topología productiva de 15 nodos.

PRNG Mulberry32 v1 admite seed uint32 incluido cero; muestreo por rechazo produce tickets dentro de límite entero sin sesgo de módulo. Misma seed reproduce secuencia. No es fuente criptográfica ni servidor, y no implementa daño/sinergias/grageas o prevención de trampas. El algoritmo debe conservar versión cuando se integre a recibos de batalla.

No se seleccionó una fórmula de daño, contenido de treinta cromos, precio de producto, tablas ni bonos por conveniencia de código. No se concedieron dos magos adicionales para solucionar el conflicto del kit inicial con 3vs3.

## Comprobaciones reales

Entorno: macOS; Node 24.20.0, npm 11.19.0. Herramientas del repo: TypeScript 5.9.3, Vite 8.3.4, Vitest 5.0.3, Playwright 1.64.0, CLI 0.1.22. No instalación nueva o servicio de pago.

| Comando | Resultado | Cobertura/límite |
| --- | --- | --- |
| `npm test` antes de cambios | 23 correctos | Ensayo histórico |
| `npm run typecheck` y `npm run build` antes de cambios | Correctos | Build histórico, no ARCANA |
| `npm run test:e2e -- --project chromium --project webkit` | 90 correctos, 26,5 s | Ensayo histórico es/en; `baseline-browser.txt` |
| `npx --no-install vitest run tests/domain/arcana` RED | Exit 1, tres suites sin módulo | `tdd-red.txt`, código todavía ausente |
| Mismo comando GREEN | 37 correctos | `tdd-green.txt`; reglas puras nuevas |
| `npm test`, `npm run typecheck`, `npm run build` finales | 60 tests correctos; tipos y build correctos | `final-unit/types/build.txt`; 23 históricos + 37 nuevos; no tests de UI ARCANA inexistente |
| Playwright CLI sesión propia `arcana-audit`, 390×844 | Snapshot y PNG revisados | Estado actual inglés; no arte ARCANA aprobado |

Las pruebas de navegador sobrescriben algunas capturas históricas. Se restauraron exclusivamente PNG rastreados que estaban limpios en el estado inicial; cambios locales preexistentes conservados. Nuevas capturas están bajo `docs/arcana`.

## Trabajo pendiente para el goal completo

U25/U26 siguen pendientes sin respuesta: configuración productiva, transición aprendiz→3–5, identidad/recuperación, estrellas↔rareza y reglas de talleres/bóvedas. Algoritmo de ensayo, seis nodos, recompensas y aperturas ya implementados y probados según A34; no se presentan como balance aprobado.

Siguiente trabajo independiente: controlador/persistencia de intención pendiente; proyección Cromodex y UI ARCANA es/en con mapa/arena/Bazar/Cromodex/equipo/Misiones; separación de assets/build limpio; Canvas/Pixi/GSAP/PWA y aceptación end-to-end. API/cliente y kit/equipo ya están implementados por A35/A36; falta arranque con configuración completa y sesión de producto. Configuración de 30 cromos y ruta MVP necesita U25. Reinicio real de servicios, medidas bundle/FPS y recuperación/autenticación siguen sin comprobar. No hay servidor desplegado, anti-trampas verificado, PR, push, CI remota nueva, arte final, móvil físico, lector audible ni observación de usuarios. Servicios propios detenidos al terminar verificaciones mediante `npm run services:stop`, volúmenes conservados.
