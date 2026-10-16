# A60 · Jugabilidad legible y diez anotaciones implementadas

15 octubre 2026. Cambios implementados en el repositorio local, sin publicación/despliegue/push. Se estudió directamente [PokéLike v3.4.1](https://pokelike.xyz/) en Chrome solicitado y navegador integrado; se recorrió una ruta hasta derrota contra el jefe, y se inspeccionaron tienda, logros y ayudas. [Análisis detallado: observado, reglas mostradas y límites](POKELIKE-ANALYSIS.md). No se copiaron recursos/código del referente ni se presenta automatización como pruebas con usuarios.

## Resultado por anotación

| Comentario | Problema | Implementado y verificable |
|---|---|---|
|1 y3|Compra, bolsa y apertura compiten|Sin rana: Comprar y abrir, coste explícito y un comando/transacción/receipt. Con unidad poseída: Abrir1 sin otro cobro; no una compra competidora. Grageas no entregan cromo: muestran unidades y Preparar equipo como siguiente acción.|
|2|Sabores ocupa el mostrador sin explicar utilidad|Armario retirado de tienda, conservado en álbum. Sello informativo junto al frasco: conseguir→asignar→activar/descubrir. Consultar no gasta.|
|4|Retorno poco reconocible|SVG propio flecha izquierda+puerta y nombre Callejón/Alley, foco y retorno a exterior.|
|5|Magia y rango parecen una capa ajena|Grabado vectorial detrás de carta, aura y recetas de4rarezas; partículas dentro de la escena, sello de rareza/estrellas, corona legendaria, tiempos finitos y reducido estático. Conserva retratos pintados/GSAP/Canvas2D.|
|6|Iconos se pierden en el paisaje|Seis medallones de material/silueta/contorno distintos, estado disponible por doble marco+flecha, rutas alcanzables contrastadas, visitados señalados. ≥44px y mapa completo.|
|7|Pacto con varios pasos genéricos|Retrato con reloj temporal; Reclutar/Pasar directo cuando hay espacio. Equipo completo mantiene elección de reemplazo y confirmación. Reglas/min3 para pasar intactas.|
|8|Inicio parece un evento|Marcador con retrato y nombre Inicio, sin botón, fuera del grafo; primer Pacto real conservado. No se concede compañero extra.|
|9|Cofre y confirmación poco expresivos|Escenario de objeto, recompensas agrupadas y Abrir cofre con asset; entrada breve y cierre independiente, sin consumo al consultar. Otros tipos tienen su propia acción nombrada.|
|10|Formación sobrecargada|Cinco puestos, cartas centradas, condición por hover/foco y ficha/equipamiento a demanda con Escape/foco protegidos. Sin panel lateral permanente.|

[Galería antes/después](GALLERY.md). Las18capturas anteriores son del build A59 congelado. Las36posteriores de `after/` se recapturan en A60 compilado, con entrada del modal terminada;40de comercio y32de mapa añaden contextos/tamaños. Las cuatro rarezas en `reveal-fixtures/` son fixtures visuales rotuladas sin entrega, no premios reales. Los estados económicos se comprueban por separado mediante aserciones, no por las imágenes.

## Integridad y arquitectura

El coordinador añade `buy-open-toad` en los contratos/caso de uso/controlador/HTTP existentes. Compra y consumo de unidad, sorteo, copia y receipt se guardan juntos, antes de animar. Repetir key recupera el resultado; otra petición con esa key da conflicto; versiones/saldo/stock se validan antes del azar. SQL JSONB conserva receipts antiguos; no migración de partidas. Recuperación tras respuesta perdida consulta la misma operación por GET, no un segundo POST.

[Detalle de comercio](COMMERCE.md), [preparación](PREPARATION.md), [mapa](MAP.md). La comparación SHA256 confirma **436 archivos protegidos de dominio/contenido/paquetes sin cambios** respecto a la línea base A60; JSON de economía idéntico. Veinte archivos existentes modificados y siete añadidos bajo `src/arcana`; los cambios de autoridad son explícitos para el nuevo comando, no se afirma que toda la autoridad quedara intacta. [Hashes](qa/source-integrity.json). Copias, seeds/grafos persistidos, premios y configuración no se reescriben. Puerto/cuenta del propietario5194 no se usa en la QA.

## Herramientas y recursos

Se reutilizan las instalaciones locales gratuitas, sin dependencias nuevas de runtime o motor. Fuentes/revisiones/licencias en `tools/arcana/design-tools-sources.json` y `.agents/skills/design-sources.json`.

| Herramienta | Uso real A60 | Licencia/alcance |
|---|---|---|
|Impeccable|Contexto y detector sobre archivos cambiados; inspección real de jerarquía/contraste y estados|Apache2.0; un aviso advisory por pequeño overshoot del sello, intencional para game-feel; no errores bloqueantes.|
|Taste/redesign|Conservar dirección ilustrada, reducir información permanente, acciones claras con el stack existente|MIT; guía, no motor ni aprobación humana.|
|Game UI/UX y Game Feel|HUD/mapa central, tamaños, foco/modal, feedback finito y reducido|Apache2.0, skills locales ya instaladas.|
|Game Design Workshop y Agency Game/Economy Designer|Objetivo→decisión→consecuencia, fuentes/sumideros y separar hipótesis de observación|MIT, guías de texto locales; no se ejecuta un equipo externo Agency ni se introduce monetización. Licencias conservadas en instalación.|
|Game Design Skills Suite|Simulación Python local de colección y presupuesto|MIT; hipótesis sin escribir configuración o partidas.|
|Playwright Test/CLI instalado y control Chrome/Browser|Recorridos, capturas, estado real y medidas seriales|Apache2.0 para Playwright; contextos/cuentas propios. No MCP nuevo necesario.|
|React/Pixi8/GSAP/Canvas2D/Motion mini existentes|Render, apertura, feedback y estados|Dependencias/lockfile existentes; sin Motion+ o servicios con créditos.|

Los nuevos SVG/CSS son fuentes editables propias: [manifest con dimensiones, pivote, hash, accesibilidad y permiso](asset-manifest.json). No nuevo lote raster ni IA en runtime. Las licencias de herramientas no resuelven derechos de franquicia; preparación privada, T01 histórico conservado. No se modifica el catálogo global de skills/MCP. El launcher creó una caché de binario fuera del proyecto; se comparó su SHA con el motor local y se retiró únicamente esa caché nueva, conservando la instalación anterior del usuario (`qa/tool-scope.txt`). El detector detectó el sidecar Impeccable anterior desactualizado; no se ha reparado automáticamente ni sustituido DESIGN.md por esos datos.

## Verificación

Entorno local macOS, Node/npm y Docker; versiones/servicios en `qa/environment.txt`. Compilado congelado, un worker y suites/medición GPU **seriales**; PWA restaura sus320archivos exactamente. Artefacto14.500.904bytes totales (ambos paquetes/recursos, no carga inicial). Warning de Vite: chunk inicial886,37kB minificado /275,75kB gzip; queda como presupuesto de optimización, no se oculta elevando el límite.

| Comando/suite | Resultado | Evidencia |
|---|---|---|
|`npm test`|368/368 unitarios|`qa/unit-final.txt`|
|`npm run test:integration`|40/40 PostgreSQL/Redis reales|`qa/integration-final.txt`|
|`npm run build`, validador ambos packs, scanner|Correctos; typecheck incluido|`qa/build-final.txt`, `qa/arcana-pack.txt`, `qa/build-scan.txt`|
|A60 experiencia compilada|20casos distintos por cobertura consolidada:18/20 +4/4 focal, dos repetidos; no una corrida20/20|[QA](QA.md), `qa/browser-compiled*.txt`|
|Comercio DEV|20/20; incluye12nuevos y8regresiones|[COMMERCE-QA](COMMERCE-QA.md)|
|Regresión histórica DEV|76casos distintos por cobertura consolidada:62/76 +20/20 focal, seis repetidos|[Regresión y deduplicación](legacy/REPORT.md)|
|Apertura fría compilada|16/16; ES/EN×Chromium/WebKit, omitir/reducido/render fallido y persistencia|`qa/opening-final.txt`|
|PWA compilada|12/12; offline, stock, respuesta perdida y actualización shell|`qa/pwa-final.txt`|
|Rediseño/swap compilado|16/16 correctos ES/EN y ambos motores|`qa/redesign-final.txt`|
|Cuatro rarezas, fixtures|4/4casos ES/EN×Chromium/WebKit; cada uno compara4rarezas normal/reducido, sin POST|`qa/reveal-fixtures-final.txt` (4/4 finales)|

No se suman conteos entre suites como casos nuevos: comparten recorridos/riesgos. Los mocks/fixtures están rotulados; no equivalen a SQL real. Los cuatro casos de compatibilidad omiten `campaign.nodes` solo en GET interceptado y bloquean su worker para que la página reciba la fixture; los16normales conservan worker. Dominio/servidor/grafo reales en ambos.

Fallos preservados: expectativas antiguas de dos receipts/compra separada, inspector y recarga de modal se actualizaron a interacción vigente sin quitar aserciones de estado; dos fixtures WebKit eludían interceptación por SW y se acotaron; foto de entrada semitransparente se recapturó en reposo. La inspección sí encontró un defecto real: CTA Preparar en hover1,47:1, corregido y verificado≥4,5:1. [Logs y explicación de cada bloque](COMMERCE-QA.md). No se presenta todo fallo de helper como bug de producto ni como TDD funcional.

## Rendimiento y movimiento

Medida serial sobre artefacto compilado, contextos nuevos, desde clic Comprar y abrir hasta terminar revelación **y magia final**, sin precalentamiento al comprar. Incluye transacción HTTP. Cuatro perfiles en `qa/opening/`:

| Motor | FPS ES/EN | Frame máximo | P95 | Ventana total clic→final |
|---|---|---|---|---|
|Chromium|60,00 /60,00|16,8ms|16,7–16,8ms|5,58–5,75s|
|WebKit|60,23 /60,03|30–32ms|19ms|5,59–5,74s|

Resultado visible a4,41–4,44s desde clic; la cola decorativa dura1,17–1,32s en esos perfiles y no bloquea Continuar. Ningún longtask observado en Chromium; WebKit no ofrece esa API, su array vacío no demuestra ausencia. Se mantienen sondas de contextos GL/decode/fases previas para no esconder un tirón desplazándolo. No comparación causal con los peores frames históricos ni prueba física. Mapa idle serial: cuatro muestras de5s,911×1079 y390×844 en ambos motores, ~60FPS, máximos16,8ms Chromium/19–20ms WebKit, sin overflow y estado idéntico. Reducido elimina ambiente; no longtasks Chromium, API ausente WebKit. `qa/scene/profiles.json`.

Reducido propio/sistema elimina chispas/celebración/pulso/entradas; omitir conserva el resultado estático y el mismo receipt. Idioma/swap no reaniman premios o escriben autoridad. Cerrar/recargar nunca pierde la copia confirmada. El renderer no decide daño, sorteo o saldo.

## Pendientes de producto

[Escenarios y propuestas](BALANCE-PROPOSALS.md), con salida completa/semilla en `balance-scenarios.json`. No precios, pesos, XP, pity, shards, regiones extra o canje implementados. El referente hace útil el duplicado; aquí queda pendiente una regla propia, además de las copias que ya admiten equipos/equipamiento separados.

Sigue pendiente la sesión guiada humana10–15min A53, comprensión sin ayuda y deseo de continuar; también móvil físico, lector y aceptación estética del propietario. Las pruebas automáticas no acreditan retención, distribución autorizada o instalación PWA física. No publicación/despliegue/push; servicios del propietario y Word históricos conservados.
