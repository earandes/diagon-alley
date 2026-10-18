**A79 · Acceso simplificado y probado en rama:** crear cuenta, verificar e iniciar sesión comparten una carta breve, una acción principal y ayuda contextual. Se conserva el buzón local privado y la persistencia de A76/A78. [Informe](docs/arcana/account-entry-redesign-2026-10-18/REPORT.md), [capturas](docs/arcana/account-entry-redesign-2026-10-18/GALLERY.md) y [pruebas/límites](docs/arcana/account-entry-redesign-2026-10-18/QA.md). PR7 sin merge.

> **A76 · Cuentas recuperables (ensayo validado, sin integración en main):** la bienvenida ofrece crear cuenta, iniciar sesión o jugar como invitado. Ajustes permite vincular el mismo jugador y conservar su colección. Registro: correo → código del buzón → contraseña; recuperación usa otro código. En este ensayo los mensajes se entregan exclusivamente a archivos privados `.local/arcana-mail/<ARCANA_TRIAL_NAMESPACE>/` (fuera de Git y acceso HTTP). Consultarlos requiere acceso local al servidor; **no se envían correos por Internet ni hay despliegue**. No compartir esos archivos. No vincular la partida habitual durante pruebas automatizadas. Contrato y resultados en [A76](docs/arcana/accounts-2026-10-17/CONTRACT.md). La cookie invitada sigue siendo temporal y perderla sin vincular puede impedir recuperar acceso. Las referencias inferiores a “sin recuperación” describen versiones previas. [Guía de uso local](docs/arcana/accounts-2026-10-17/LOCAL-GUIDE.md), [resultados y límites](docs/arcana/accounts-2026-10-17/QA.md) y [PR7 dependiente deA75](https://github.com/earandes/diagon-alley/pull/7). La validación se completó en dos tandas Linux: primera cancelada por límite total55min, continuación superada; no se abre el ensayo a Internet.

**A78 · Correcciones de cuentas implementadas y probadas en rama:** [contrato](docs/arcana/accounts-fixes-2026-10-18/CONTRACT.md) y [QA](docs/arcana/accounts-fixes-2026-10-18/QA.md). Se resuelven los ocho hallazgos A77 sin alterar partidas o economía. El ensayo de cuentas sigue usando un buzón local privado; no correo externo ni despliegue. PR7 pendiente, sin merge autorizado.

# Diagon Alley / ARCANA

> **A72 ·17 octubre2026:** jefe A70/A71 revisado e integrado en main: antesala ilustrada, actor por piezas y cierre con botín utilizable. CI Linux39021060226 correcta sobre15b1a99:555unitarios,78integraciones PostgreSQL/Redis y263casos de navegador; sin gráficos locales. [Entrega, pruebas y límites](docs/arcana/boss-integration-2026-10-17/REPORT.md). Sin despliegue; observación humana, dispositivo físico y límites de rendimiento siguen pendientes.

> **Pruebas gráficas · protección del Mac (16 octubre2026):** tras la caída de WindowServer registrada durante las pruebas, las configuraciones Playwright rechazan las baterías completas en macOS **antes de abrir navegador o servidor**. Ejecutarlas en CI Linux, una batería a la vez entre procesos/worktrees, sin vídeo/trazas/capturas automáticas ni reintentos por defecto. Enric autoriza un smoke local controlado: `npm run test:browser:check` hace solo el preflight; `npm run test:browser:local` permite un único test Chromium, sin grabación/capturas, máximo60s y vigilancia cada2s. Rechaza carga alta, presión/cambio deWindowServer o servicios no saludables; cancela solo procesos propios si se superan los umbrales. Para evidencia manual A67 en Linux, `ARCANA_CAPTURE_EVIDENCE=1` habilita capturas seleccionadas. Las pruebas de dominio, tipos y build no abren navegador. [Diagnóstico y límites](docs/arcana/progression-increment-2026-10-16/HOST-INCIDENT.md). No repetir localmente el fallo como comprobación.

> **A60 ·15 octubre2026:** revisión directa de PokéLike y diez anotaciones implementadas: comprar/abrir una rana con un solo comando atómico, uso de grageas visible, mapa legible y formación compacta, revelación por rareza. [Análisis: qué cambiar/conservar](docs/arcana/pokelike-2026-10-15/POKELIKE-ANALYSIS.md), [antes/después](docs/arcana/pokelike-2026-10-15/GALLERY.md), [informe/pruebas](docs/arcana/pokelike-2026-10-15/REPORT.md). `npm run test:pokelike` y `npm run test:commerce` aíslan estos flujos de la partida del propietario. Configuración económica conservada; no desplegado ni validación de retención.

> **A59 ·15 octubre2026:** las16anotaciones se implementan como recorrido de juego: entrada y mapa con fondo continuo/ambiente ligero, elección de compañeros antes de ruta, configuración fuera del álbum, callejón de tres fachadas pintadas e interiores, libros de probabilidades, bóveda/cerradura y recompensa por rareza. [Informe](docs/arcana/annotations-2026-10-15/REPORT.md), [antes/después](docs/arcana/annotations-2026-10-15/GALLERY.md). `npm run test:experience` comprueba este incremento; los flujos históricos siguen separados en `npm run test:e2e`. Conserva kit/IDs/reglas/economía/partidas, es/en y ARCANA; no publicación.

> **A58 ·15 octubre2026:** treinta personajes Harry Potter pintados y noventa exports por función sustituyen a los personajes vectoriales anteriores. Apertura con decoración Canvas2D acotada; mantiene caja/rana/carta GSAP, omisión, reducido y entrega confirmada. Diagon Alley principal y ARCANA intercambiable; idioma solo Ajustes. [Informe y pruebas A58](docs/arcana/illustrated-assets-2026-10-15/REPORT.md), [antes/después](docs/arcana/illustrated-assets-2026-10-15/GALLERY.md), [fuentes y pipeline local](design/diagon-alley/illustrated-v2/README.md), [diseño vigente](DESIGN.md). Sin cambios de precios, probabilidades o partidas; sin publicación. [Rediseño A57](docs/arcana/diagon-game-redesign-2026-10-15/REPORT.md) conservado como antecedente. No se declara aceptación estética humana, móvil físico o retención.


> **Estado activo: ARCANA (12 octubre 2026).** Ensayo conectado con 30 identidades provisionales y autoridad PostgreSQL/Redis. Mapa PixiJS y arena que reproduce BattleLog; Auto/pausa/2x/omitir, movimiento reducido y apertura GSAP. [PRD](docs/PRD.md), [auditoría](docs/arcana/PHASE-1-AUDIT.md), [evidencia y pendientes](docs/arcana/PHASE-4-STATUS.md). Cromodex con filtros/inspección por copia, equipo poseído y asignación de Grageas antes del duelo. HUD con energía de autoridad/sinergias/equipo y resultados de nodo/replay tras recarga. Taller de Varitas y Bóvedas conectados: forjar/equipar, jefe→llave→canje, con cancelación y recibos persistidos. Cromos con 1–5 estrellas guardadas por copia; hallazgos antiguos sin dato conservan ausencia. Encuentros con relato/efecto/PV guardados y recuperación tras recarga. PWA compilada con shell offline y bloqueo de operaciones sin conexión; recuperación de receipt al reconectar. Pantalla/subtienda conservadas en recarga y atrás/adelante; errores localizados y acceso al desbloqueo desde jefe. Texto ampliable/peanas y nav sin recorte, contraste de arena/hover corregidos. Benchmark cinco unidades a ~60 FPS en escritorio; bufos por peana/equipo e identidad de actor conectados, fallback de registro incompatible. Hardware/QA restantes en el informe. Fuentes/guardado/Word históricos fuera del build; documentación inferior histórica. No desplegado.

Arranque actual, con Docker local disponible:

```sh
npm run services:up
npm run dev
```

Abrir `http://127.0.0.1:5189/` y comenzar explícitamente el ensayo. Cookie HttpOnly de siete días y kit único por jugador. Crear cuenta, entrar y vincular invitado conservan la partida; verificación y recuperación del ensayo mediante buzón local privado, sin correo externo. [Guía de cuentas](docs/arcana/accounts-2026-10-17/LOCAL-GUIDE.md). Todos los precios/pesos/stats del ensayo se identifican como provisionales. `npm run test:e2e` comprueba el recorrido es/en con SQL/Redis; `npm run verify:arcana:build` inspecciona términos del artefacto después de `npm run build`. Detener Vite con Ctrl+C y servicios propios con `npm run services:stop`.

Para probar la PWA sobre el artefacto compilado con la misma autoridad local:

```sh
npm run services:up
npm run build
npm run preview:arcana
# http://127.0.0.1:5190/
# En otra terminal, tras detener preview si se ejecutará la suite:
npm run test:pwa
```

La suite inicia su propio preview. Service worker solo en build: `dev` no prueba offline. API siempre de red; la PWA no permite gastar offline. Iconos propios provisionales, sin instalación física verificada. Detener preview con Ctrl+C y los servicios con `npm run services:stop`.

[Arquitectura de Fase 2](docs/arcana/PHASE-2-ARCHITECTURE.md), [casos TDD de Fase 3](docs/arcana/PHASE-3-TDD.md) y [estado real de implementación](docs/arcana/PHASE-4-STATUS.md). Núcleo `src/arcana`: Esencia, generación/avance de grafo, combate determinista, sinergias/Grageas, premios decrecientes y casos transaccionales conectados con la UI DOM actual. Los datos de ensayo permiten probar aprendiz→tres; no son balance aprobado.

Ampliación A32: PixiJS v8/GSAP/PostgreSQL/Redis conectados, con núcleo puro, run JSONB/progreso relacional y API Fastify. Renderer separado de `BattleReplay`, sin cálculo de combate/azar en vista. Launcher local provisiona sesiones de ensayo; sin recuperación de cuenta productiva elegida. [Contrato gráfico](docs/arcana/GRAPHICS-CONTRACT.md), [HTTP](docs/arcana/HTTP-CONTRACT.md) y [kit/equipo](docs/arcana/KIT-TEAM-CONTRACT.md).

A37 añade controlador sin React y metadata IndexedDB de intención (sin saldo/token), recuperación de la misma key y exclusión entre pestañas. [Contrato](docs/arcana/CLIENT-CONTROLLER-CONTRACT.md). `npm run test:arcana:browser` ejecuta sus pruebas reales Chromium/WebKit en harness aislado; no verifica todavía el recorrido visual ARCANA.

```sh
npm run services:up
npm run test:arcana
npm run test:integration
npm run services:stop
```

`compose.arcana.yml` crea solo servicios `arcana-local`, PostgreSQL en `127.0.0.1:55432` y Redis en `127.0.0.1:56379`, imágenes fijadas y volúmenes propios. Credenciales públicas de desarrollo, solo loopback; no despliegue. Integración limpia sus propias filas/claves, sin tocar otros datos. El PRNG está en infraestructura. El scanner verifica el artefacto ARCANA actual, sin acreditar permisos de arte o balance final.

## Referencia histórica I1

Las secciones siguientes se conservan como documentación de la aplicación anterior. Sus reglas, capturas y resultados no gobiernan ARCANA; los comandos actuales son los del inicio de este README.

Maqueta móvil jugable local: **Callejón → Weasley → consultar una rana → abrirla → resultado → álbum → Callejón**. Español e inglés, guardado IndexedDB recuperable, bienvenida nueva A13/A18 y arte provisional identificado adaptado a los conceptos de Weasley. Sin cuentas, backend, pagos o publicación.

## Ejecutar

Node **24** y npm. Lockfile incluido.

```sh
npm ci
npm run dev -- --port 5187
```

Abrir <http://127.0.0.1:5187/>. El puerto explícito evita interferir con otros proyectos locales. Guardado asociado al origen/perfil del navegador; cambiar puerto, localhost por 127.0.0.1 o perfil cambia el almacenamiento. Para mover una partida, exportar/importar JSON desde Ajustes.

Empieza con O01/O02/S01/S02 conocidos (4/12), una rana y una unidad de grageas guardada pero no abrible en I1. La rana garantiza identidad nueva entre seis candidatos; se guardan consumo/copia/operación antes del ritual omitible de 1,6 s. Recargar no concede otro regalo. Sin menú inferior fijo: accesos al álbum desde callejón, Weasley y resultado, con retorno al origen y foco. Ajustes permanecen en la cabecera. Con stock cero el álbum sigue accesible. Exportación/restauración validada y reset confirmado crean/sustituyen una demo local sin valor económico.

## Verificar

```sh
npm run typecheck
npm run validate:content
npm test
npm run build
npx playwright install chromium webkit
npm run test:e2e -- --project chromium --project webkit
```

`npm run test:e2e` intenta los tres motores configurados, incluido Firefox; ese motor no arranca su perfil en el Mac de esta entrega y queda pendiente. La CI ejecuta Chromium. No cambiar un perfil pendiente por una afirmación de cobertura de Safari/iPhone.

```sh
npm run preview -- --port 5190
# En otra terminal:
node tools/verification/measure-first-view.mjs
node tools/verification/measure-contrast.mjs
```

## Estado y fuentes

- [PRD histórico v0.19](docs/arcana/HISTORICAL-PRD-v0.19.md), [decisiones A23–A25](docs/DECISIONS.md), [Word histórico v0.5 intacto](docs/PRD_Coleccion_Magica.docx) e [instrucciones](AGENTS.md).
- [Evidencia y matriz I1-AC01–12](docs/i1-evidence/REPORT.md): implementado/probado y cobertura pendiente separados.
- [Capturas revisadas es/en](docs/i1-evidence/GALLERY.md).
- [Navegación sin menú inferior A27: pruebas y capturas actualizadas](docs/navigation-i1/REPORT.md).
- [Mejora de diseño A28, uso de las cinco skills y capturas Playwright CLI](docs/design-i1-v3/REPORT.md).
- [Skills locales, fuentes fijadas y comandos de inspección](.agents/skills/README.md); [sistema de interfaz aplicado](docs/design-i1-v3/DESIGN.md).
- [Auditoría integral y propuesta de rediseño v4](docs/redesign-i1-v4/REPORT.md), con [canvas navegable de muestra](docs/redesign-i1-v4/canvas.html). Propuesta P21 pendiente de revisión; no modifica la demo o la partida. Con el servidor en 5193: `/docs/redesign-i1-v4/canvas.html`.
- [Replanteamiento P22: el mostrador imposible](docs/disruptive-i1-v5/REPORT.md), con [canvas espacial de muestra](docs/disruptive-i1-v5/canvas.html) y animatic esquemático. Propuesta independiente, sin sorteo/guardado real o integración en la demo. Con Vite en 5193: `/docs/disruptive-i1-v5/canvas.html`.
- [Configuración, invariantes, versiones y dependencias](docs/i1-evidence/CONFIGURATION.md).
- [Manifest de arte provisional utilizado](src/content/art-manifest.json).

Dominio puro en `src/domain`; adaptador transaccional en `src/infrastructure`; datos e idiomas independientes en `src/content`/`src/i18n`; presentación raster encuadrado/SVG/DOM/CSS en `src/ui`. Sin arquitectura de expansiones o dependencias de IA/servicios externos.

El recorrido está implementado y comprobado en Chromium/WebKit emulados. **Quedan pendientes lector audible, móvil físico, Firefox, arte final y sesiones A17**: no se declara cierre total de I1, certificación WCAG o validación del atractivo/balance. Autenticación e historial por cuenta A19 y dirección ambiental ampliada A20 se conservan para el producto posterior. La confirmación actual delimita primero este ensayo local.

La adaptación visual A26 integra los conceptos de interior/rana/revelación mediante encuadres de raster y controles HTML. [Evidencia visual v2](docs/visual-i1-v2/REPORT.md). La caja tiene piezas DOM con máscaras; no un rig. C01/O01/O02 usan ilustraciones aportadas; otros cromos usan grabados SVG provisionales. No son assets finales. Otros estudios anteriores permanecen independientes. La procedencia de dibujos/tooling no acredita autorización Harry Potter. T01 sigue pendiente antes de la distribución correspondiente. No hay despliegue ni monetización.


### Acabado visual ARCANA · A49/A50 (14 octubre)

Versión local ilustrada verificada, dirección **Teatro de alquimia**: [entrega, capturas y validación](docs/arcana/visual-production-2026-10-14/REPORT.md), [guion para Enric](docs/arcana/visual-production-2026-10-14/MANUAL-ENRIC.md), [cambiar textos/arte/animaciones por otra temática](docs/arcana/CONTENT-PACKS.md), [fuentes de arte](design/arcana/production-v1/README.md). ARCANA sigue activo; IDs/reglas/receipts conservados.

Preview local con autoridad real: **http://127.0.0.1:5190/**. Si se detuvo, servicios arriba + build + `ARCANA_TRIAL_NAMESPACE=arcana-visual-a50 npm run preview:arcana`; no lanzar dos previews en el mismo puerto. Cookie de ensayo7d, sin cuenta recuperable. Nueva ventana/perfil privado crea otro ensayo con kit normal para repetir, sin editar saldos. Mantener Docker/volúmenes/namespace.

Sites queda aplazado por Enric al no disponer de backend externo gratuito; no se publicó frontend desconectado ni se contrató hosting.

### Orientación y game-feel · A52 (14 octubre)

Mejoras implementadas sobre Teatro de alquimia: guía contextual de expedición, retratos/origen de aliados, nodos con efecto y coste, Cromodex con descubrimientos/copias/equipo, emblemas SVG de rareza y feedback de compras/equipo confirmados con Motion mini libre. [DESIGN.md](DESIGN.md), [informe/herramientas/pruebas](docs/arcana/game-feel-2026-10-14/REPORT.md), [capturas antes/después](docs/arcana/game-feel-2026-10-14/GALERIA.md), [simulaciones y balance pendiente](docs/arcana/game-feel-2026-10-14/GAMEPLAY.md).

Build actualizado disponible localmente en **http://127.0.0.1:5195/** mientras este preview y Docker sigan activos. `ARCANA_TRIAL_NAMESPACE=arcana-feel-preview-a52 npm run preview:arcana -- --port 5195` permite reiniciarlo sin ocupar el preview anterior. No publicar; las reglas económicas y partidas anteriores se conservan. Las capturas se reproducen con `node tools/arcana/capture-game-feel.mjs` sobre ese preview y sesiones de ensayo nuevas; la simulación es de solo lectura con `python3 tools/arcana/simulate-balance.py`.

### Interfaz visual A54

Materiales/equipo/grageas/filtros mediante assets seleccionables, medallones de navegación y respuestas breves. Texto mínimo por defecto, ayuda/reglas a demanda; español/inglés y controles semánticos conservados. [Contrato, antes/después y pruebas](docs/arcana/asset-interface-2026-10-14/REPORT.md). Capturas reproducibles sobre una sesión técnica nueva: `ARCANA_CAPTURE_URL=http://127.0.0.1:5194 node tools/arcana/capture-asset-interface.mjs` (servidor local activo, sin usar la partida del jugador).

### Mapa regional A55
Ruta sobre fondo ilustrado y equipo compacto con ficha por hover/foco/toque; una sola región jugable. [Expansión incremental prevista](docs/arcana/REGIONS-ROADMAP.md), [capturas/pruebas](docs/arcana/region-map-2026-10-15/REPORT.md). Captura vigente A56 con `ARCANA_CAPTURE_URL=http://127.0.0.1:5194 node tools/arcana/capture-visual-nodes.mjs`; no reutiliza ni reinicia la partida del usuario.


### Nodos y rutas A56 (15 octubre)
Mapa completo sin desplazamiento, seis assets propios y rutas nuevas elegidas por servidor y guardadas con cada expedición. Refugio PV/PM, Pacto con pase/sustitución temporal y Encuentro con riesgo/pase; Duelo/Jefe/Cofre muestran rivales o botín. [Contrato, revisión de nodos y evidencia](docs/arcana/visual-nodes-2026-10-15/REPORT.md), [escenarios de balance](docs/arcana/visual-nodes-2026-10-15/BALANCE.md). No se regeneran partidas anteriores ni cambian precios/pesos/premios base.

### Jugabilidad A63 · 16 octubre

Cierre→botín utilizable→otra expedición explícita; arena con3–5 participantes por lado y detalles a demanda; preparación contextual de equipo/grageas. Reglas/economía/campaña y partidas conservadas. [Informe y límites](docs/arcana/gameplay-increment-2026-10-16/REPORT.md), [antes/después](docs/arcana/gameplay-increment-2026-10-16/GALLERY.md). Sin publicación o sesión humana atribuida.

Después de `npm run services:up` y `npm run build`, recorrido A63 aislado en Chromium/WebKit: `npx --no-install playwright test --config playwright.gameplay-a63.config.ts`. Levanta sus propios previews5365/5366 y namespaces efímeros, sin reutilizar la partida habitual. Para servidor propio, `A63_BASE_URL` debe apuntar a una autoridad de prueba.

Regresión general sobre compilado: `ARCANA_TRIAL_COMPILED=1 ARCANA_TRIAL_TEST_PORT_BASE=5370 ARCANA_NODES_EVIDENCE_ROOT=docs/arcana/gameplay-increment-2026-10-16/evidence/regression-nodes npm run test:e2e`. Las fixtures de transporte bloquean worker para interceptar de forma fiable; `npm run test:pwa` prueba por separado worker/offline/reconexión. Los perfiles de rendimiento deben ejecutarse solos con las variables explícitas de la documentación A63.

Preparación A63 compilada y vídeo: `npx --no-install playwright test --config playwright.preparation-a63.config.ts` (5367/5368 aislados). Perfiles de acciones, ejecutar sin otros navegadores/builds: `npx --no-install playwright test --config playwright.actions-a63.config.ts` (5380/5381 aislados).

### A65 · Pactos, rivales e intención (16 octubre)

Dos candidatos temporales por Pacto, dos familias de rivales con preparación distinta y una intención voluntaria para la siguiente expedición. Cambios tácticos solo en **nuevas expediciones**; las activas conservan su contenido. Versión de campaña y derechos a premios únicos intactos. [Informe](docs/arcana/tactical-increment-2026-10-16/REPORT.md), [capturas/vídeos](docs/arcana/tactical-increment-2026-10-16/GALLERY.md), [simulación y límites](docs/arcana/tactical-increment-2026-10-16/TACTICS.md).

Con servicios arriba y build actualizado, suites compiladas aisladas:

```sh
npx --no-install playwright test --config playwright.tactics-a65.config.ts
npx --no-install playwright test --config playwright.intentions-a65.config.ts
npx --no-install playwright test --config playwright.adverse-a65.config.ts
```

Perfiles dedicados, sin otros runners/builds: `A65_PROFILE=1 npx --no-install playwright test --config playwright.tactics-a65.config.ts`. No confundir muestras técnicas/simulaciones con pruebas humanas. Sin nuevas dependencias, costes o publicación.

### A67 · Encuentros, equipo y progresión

Nuevas expediciones: Descubrimiento, Táctico o Maestría explícitos, sin nuevos premios ni costes. TratosPV/PMdeterministas con personajes y dos alcances; ForgeV2especializa nuevas varitas en potencia, iniciativa o recuperación. Runs/equipo anteriores mantienen sus snapshots; una campaña no renueva premiosúnicos al cambiar desafío. [Contrato](docs/arcana/progression-increment-2026-10-16/CONTRACT.md), [estudio](docs/arcana/progression-increment-2026-10-16/STUDY.md), [completitud y duración condicional](docs/arcana/progression-increment-2026-10-16/COMPLETION.md), [QAservidor](docs/arcana/progression-increment-2026-10-16/QA-BACKEND.md). [Informe y validación](docs/arcana/progression-increment-2026-10-16/REPORT.md): 465unitarios,63integración PostgreSQL/Redis y134casos de navegador correctos en CI Linux. Sin despliegue; observación humana pendiente.

Baterías completas sobreLinux con servicios y build: `npx playwright test --config playwright.progression-a67.config.ts`. EnMac solo `npm run test:browser:local` tras `npm run test:browser:check`, con preflight, untestChromium y watchdog. LaCI incluye regresiones, ambos motores, cierre, PWA y comparación serialcontra referenciaA66 reconstruida. Capturas y vídeos se conservan como evidencia anterior; por defecto no se generan grabaciones nuevas.
