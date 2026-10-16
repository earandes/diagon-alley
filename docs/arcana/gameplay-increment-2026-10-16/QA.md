# A63 · Validación y alcance de evidencia

16 octubre 2026. Mac Apple M3 Pro/arm64, Darwin27.0.0, Node24.20.0, Playwright1.64.0. React/Vite/Pixi8 y servicios del proyecto; sin instalaciones/dependencias nuevas. PostgreSQL 16.9 y Redis 7 reales en loopback55432/56379. Cuentas nuevas y namespaces aislados por runner/motor; no uso de la sesión habitual5194, Chrome propietario o credenciales ajenas. Tras interrupción, servicios existentes arrancados con `npm run services:up`, sin reset de volúmenes. Los intentos sin servicios se distinguen de fallos del producto.

## Ejecuciones

| Comando / configuración | Resultado verificable | Evidencia |
|---|---|---|
| `npm test` |395/395,50 archivos |evidence/unit-final.txt|
| `npm run test:integration` |40/40,8 archivos, PostgreSQL/Redis reales |evidence/integration-final.txt|
| `npm run build` |Correcto; incluye skin completo, tipos y compilado |evidence/build-final.txt|
| `npm run typecheck` |Correcto, app/tests y worker |evidence/types-final.txt|
| `npm run verify:arcana:build` |Correcto,14.54 MB distribuidos; I1 excluido |evidence/verify-build.txt|
| `playwright.gameplay-a63.config.ts` |16/16, compilado, ambos motores/idiomas/packs; primera/repetida, rana, bóveda, recuperación, recarga, nueva run y dos pestañas |evidence/gameplay-final.txt|
| `playwright.preparation-a63.config.ts` |6/6, compiladoHP; ES/EN×Chromium/WebKit, consumo/sabor/foco/revisión |evidence/preparation-compiled-verified.txt|
| Configuración arena focal, por pack |18/18 ARCANA+18/18 HP; incluye regresión anterior pertinente |evidence/arena-regression-verified-arcana.txt; arena-regression-final-diagon.txt|
| `test:e2e` compilado,4 workers funcionales |76/76 correctos tras corregir selector del harnessGSAP y confirmar2/2 focales |evidence/journeys-all-green.txt; lazy-gsap-compiled-verified.txt|
| `npm run test:commerce` |20/20, ambos motores |evidence/commerce-regression.txt|
| `ARCANA_A60_COMPILED=1 npm run test:pokelike` |20/20, ambos motores; pruebas existentes, no investigación nueva del referente |evidence/pokelike-regression.txt|
| Rediseño compilado |16/16, ambos motores; swap/es-en/sabores/apertura |evidence/redesign-verified.txt|
| `npm run test:pwa` |12/12, worker real/offline/reconexión/actualización |evidence/pwa-regression.txt|

Comprobaciones adicionales finales: `closure-history-focus-final.txt`, **8/8** recorridos completos de cierre con retorno de foco desde acción principal e historial, tras el último ajuste de callback. `opening-verified.txt`, **16/16** con perfil frío y omisión/reducido/fallback. `actions-verified.txt`, **2/2** con tiempos desde input. `impeccable-detect.json`: `[]` en una pasada mecánica sobre los seis componentes principales; no acredita calidad humana por sí sola.

Perfiles dedicados de apertura/acciones y límites de comparación en [PERFORMANCE.md](PERFORMANCE.md). Los runners funcionales en paralelo no fundamentan métricas de rendimiento. No se suman reintentos, capturas o suites solapadas como casos humanos o cobertura nueva.

## Matriz de aceptación

| Requisito / estado | Evidencia actual y tipo | Límite |
|---|---|---|
| Primera victoria y repetida, botín exacto |GUI real A63, receipt comparado con inventario; integración de run y comercio |No cambia tabla; no valida balance o interés|
| Rana ganada sin recompra |GUI verifica+1 copia,monedas iguales,`open-toad`; respuesta perdida y recarga |Transporte adverso declarado; sorteo real del servidor|
| Llave una sola vez / cancelar |GUI cancelar snapshot idéntico y canje-1; SQL dos clientes / rollback / recuperación |Vídeo solo acompaña, no demuestra transacción|
| Sin pendientes → siguiente preparación |Modelo y GUI tras objetos usados; nueva run solo selección+confirmación |No abre región nueva|
| Derrota y empate |Proyección y renderSSR localizado de cierre; arenafixture desenlace/registro |No se fabricó una derrota/empate de campaña en una cuenta real|
| Tres–cinco por lado, ordinario sin scroll |72 geometrías, PNG y canvas; 3×3 real además de 3×3/5×3/5×5 fixtures |Fixtures5×5 no amplían campaña|
| Replay/Pausa/Auto/2x/Omitir/salida |GUI de campaña y fixture, mismo BattleLog y estado económico |No pronóstico de victoria|
| Sin desenlace prematuro DOM/ARIA |Tests arena en evento0 y resultado al omitir; NodeAnnouncement omite batalla |No prueba hablada con lector físico|
| PM/gear/afinidad/log disponibles |Inspectores/registro con pausa/foco y consulta de saldo actual |Wallet consultado puede ampliar contenido, igual que inspectores|
| Equipo1–5, temporales/propios, duplicados |Modelos de preparación, fixtures5 portadores y reservas; GUI1 propio+Pactos y formación real |No todos los tamaños/formaciones atraviesan campaña real|
| Duplicados con equipo diferente |Pruebas de comparación porcopyId y casos de dominio/integración de equipo |Sin canje/XPnuevo|
| Caídos/reservas |Modelos preservanHP/PM, excluyen caído de asignación, reservas conservadas; arenafixture |Casos adversos de composición declarados|
| Stock vacío / asignar / mover / quitar |Modelo y controlesSSR; GUI compra/asigna/mueve/cancela/confirma |No segunda bolsa|
| Alquimia 2→3 y comparación de gear |Reglas compartidas + prueba exacta de umbral y valores; 640 BattleLog idénticos antes/después |Es evidencia aritmética, no calibración humana|
| Consultar/cancelar no consume o descubre |GUI snapshot exacto; sabor solo tras comando real de combate |Equipar es escritura explícita separada, no se revierte al cerrar|
| Consumo una vez y sabor guardado |GUI preparación y álbum; PostgreSQL flavour/run/recovery |No resultado optimista|
| Revisión/run/nodo incompatibles |Scope síncrono de borrador; GUI cambia gear/revisión y borra asignación; nueva run explícita; dos pestañas |Idioma/pack quedan fuera del scope intencionalmente|
| Dos pestañas |GUI mismo contexto aislado: cofre confirmado en 2,refreshGETen1 cierra selección,1 POST/premio |No sesiones ajenas|
| Error antes de guardar / versión obsoleta |RollbackSQL real, conflictos/idempotencia/contentversions de dominio; GUI rechazo sin éxito optimista |No se interrumpe una transacción del usuario habitual|
| Respuesta perdida / recarga durante animación |GUIA63+PWA e integración postCOMMITcon pools reabiertos |Fixture transporte identificado|
| Desconexión/reconexión / worker |SuitePWA compilada12/12 |No instalación física|
| Saldo/energía insuficientes |GUI cero saldo real y rechazo de energía por transportefixture; validación de dominio/servidor |No se altera regeneración para fabricar estado|
| Asset ausente / renderer fallido |GUI/fixtures arena, WebGLcontextloss y apertura fallback; acciones/registro/saldo conservados |No cubre cada modeloGPUfísico|
| ES/EN / swap |GUI ambos packs/idiomas; mismos IDs/estado tras cambiar |Idioma solo Ajustes|
| Reducido / teclado / foco / toque |Preferencia propia/sistema, Escape y retorno explícito, inspectores y selección porclick/foco; Chromium/WebKit |Toque es interacción emulada; no lector/dispositivo físico|
| Texto200% / tamaños |Arena matrices y prueba ampliada con scroll accesible; recorrido general320/390/865/1280 |No se afirma WCAGcertificada|

## Incidencias encontradas y resueltas

- Composición inicial de arena: alturas/canales y figura del renderer no correspondían a peana; ajustadas tras capturas, sin eliminar actores. Fichas/log a demanda y footer estable.
- Foco de preparación dependía de foco nativo del ratón. WebKit lo expuso; origen explícito desde cierre/tienda/álbum/HUD/forja y confirmación de nodo.
- Confirmación obsoleta si otra pestaña resolvía el nodo: cerrar al actualizar disponibilidad y guard adicional antes de enviar. Prueba real ES/EN×dos motores.
- Asignador alargaba el popup y alejaba sus acciones: compactado y barra adherida; ambas dentro844 tras asignar, scroll accesible del contenido.
- Pruebas históricas asumían dock dentro de arena y receipt cerrado sin su nueva consulta. Se adaptaron a salida al mapa y «Tu recorrido», conservando los asserts de inventario/registro.
- Intercepción de red en WebKit compilado podía quedar fuera de `page.route` bajo control del worker. Suites de fallos de transporte bloqueanworker explícitamente; PWA se prueba aparte conworker. No se cambió el worker ni se ocultó un fallo de autoridad.
- TestGSAP anterior solo interceptaba`gsap.js` de desarrollo. Ahora reconoce también el chunk compilado conhash y prueba realmente su ausencia.
- Separación de descubrimiento de suites: los sondeosA63 tienen configs propias y no se descubren por `test:e2e`. La primera ejecución accidental sobrescribió la baseline Chromium del perfil de arena con código actual; aislada como inválida en superseded, sin usarla para comparar. BaselineWebKit original y evidenciaA62 permanecen válidas.
- Directorio nuevo de capturas de nodos: creación explícita antes del primerJSON. HMRdurante iteraciones y servicios detenidos constan como fallos de harness/entorno, no del juego.

Los logs intermedios se conservan; nombres `final` anteriores no prevalecen sobre esta selección de evidencia verificada. Sesión humana, comprensión/diversión, móvil físico y lector hablado quedan pendientes; no bloquean la implementación autorizada.
