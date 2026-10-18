# A84 · Registro de validación

Baseline main `ac827a0f16085a354793bfe58e27dc441af267db`. La tarea no abre navegador, genera capturas ni reproduce audio en el Mac. No se toca partida habitual; no se infiere la actividad manual de Enric a partir de esto.

Entorno local no gráfico: Darwin/arm64, Node24.20.0, npm11.19.0, Python3.14.2. CI final: Ubuntu24.04.5, Node24.21.0/npm11.19.0; Playwright1.64.0 fijado por package-lock. PostgreSQL16.9 y Redis7 en servicios aislados del runner. Los límites de un worker/reintentos0corresponden a las baterías gráficas; no se atribuyen a los workers internos de Vitest.

## Ejecutado localmente, no gráfico

- `python3 design/audio/a84/compose.py`: nueve recursos originales,1.241.676bytes, manifiesto y fuente editable.
- `python3 design/audio/a84/verify.py`: hashes/formatos/picos/RMS/DC/extremos correctos; resultados en ASSET-QA.json. No prueba calidad percibida o salida física.
- RED inicial de audio: imports todavía inexistentes; no se presenta como assertion de comportamiento fallida. Después ocho casos de preferencias/fases/cancelación/límites/fallos correctos.
- RED funcional PWA: aceptar WAV sin precache falló con la allowlist antigua. Corregida su admisión pública sin incluirlo en precache/arte.
- `npm test`:94archivos,637pruebas correctas, incluidos cuatro casos de semántica ES/EN/swap y la regresión PWA.
- `npm run build`: validación de paquetes, tipos y build correctos. Se conserva advertencia de chunk>500KB; no se afirma que desaparezca el peso anterior.
- Build compilado del harness A84 correcto, sin abrir navegador.
- `npm run verify:arcana:build`: correcto. Artefacto dual privado16.316.807bytes, incluyendo audio. Audio no se descarga automáticamente por formar parte de dist.
- PostgreSQL/Redis: no cambian contratos o código de dominio/servidor. La batería existente vuelve a ejecutarse en CI; no se acredita nueva ejecución local por esto.

## CI pendiente al registrar

Rama `feature/a84-game-audio`, configuración dedicada `playwright.audio-a84.config.ts`. La CI existente ejecuta los mismos tests mediante `playwright.motion-a69.config.ts` y un entry compilado adicional, sin modificar workflows. Linux con guard/lock/watchdog originales, en serie, un worker, sin reintentos. Tres proyectos activos: Chromium390/1280 y WebKit865; las otras tres parejas A69 omiten deliberadamente los casos nuevos de audio y conservan sus pruebas de movimiento. Tres capturas explícitas de Ajustes, no vídeo/trazas. Harness declarado con GameSettings/BattlePanel/runtime reales y BattleLog calculado una vez; no cuenta con recursos económicos. El artefacto existente A69 recoge el subdirectorio nuevo `evidence/linux/a84`, sin sobrescribir evidencia anterior; después se copia a esta carpeta.

El primer push fue rechazado por carecer el OAuth de permiso `workflow`. No se amplían permisos ni se debilitan guardas: se revierte ese cambio propio no publicado y se conecta la cobertura a la batería autorizada existente. El commit local no enviado se recompone antes de subir, sin force-push. La validación numérica de los nueve recursos también queda en una prueba Vitest ejecutada por la CI existente.

Cobertura prevista: cuatro combinaciones idioma/pack por tamaño; opt-in/no fetch inicial, teclado/toque, volúmenes/persistencia, salida de foco, fuentes nativas, pausa/2x/omisión/reducido y log inmutable; decode/mix OfflineAudioContext real y fallo de red recuperable. Regresiones generales sobre build de aplicación en la misma CI. No atribuir resultados hasta disponer del SHA/ejecución.

## Límites

No se ha escuchado la muestra con una persona, ni probado salida física, Safari/iOS físico, altavoces, auriculares, latencia de hardware o balance perceptivo. WebKitLinux no los sustituye. OfflineAudioContext acredita renderizado de muestras numéricas, no lo que llega al oído. Cifras de decode son tiempo de pared incluyendo fetch, no CPU pura; bytesfloat no son memoria residente. No pruebas de diversión/retención.

## Primera CI y correcciones de sus causas

- CI39122435573 sobree240535 cancelada durante integración: se había detectado un método de automatización incorrecto para el rango nativo; se cambia `fill` por Home/ArrowRight, sin navegador local ni reintento automático.
- CI39122556273 sobre6570ae1: nueve casos A84 correctos, tres capturas revisadas y doce muestras de activación/decode. El check global falla en una expectativa de victoria A73 y tres inyecciones combinadas A69; regresión dependiente no ejecutada. No se declara la batería completa superada.
- A73 esperaba victoria de cualquier ruta aleatoria elegida de forma voraz. Se conserva el fallo original en `evidence/first-failure/a73-lost-route.md`. Un caso determinista semilla36 reproduce que un primer duelo puede cerrar continuaciones ganadoras. La corrección final fija **solo el grafo no visitado a semilla0**, en la cuenta aislada creada por esa prueba, mediante transacción PG/revisión; no modifica estadísticas/inventario ni añade API/controles públicos. Se mantienen primer duelo, jefe, victoria, uso de rana poseída y otra expedición con las mismas assertions. El resultado pasa a declararse fixture y no se compara como A/B emparejado con muestras aleatorias previas. No se reescriben receipts históricos y las pruebas separadas de recuperación permanecen.
- A69 inyectaba arte ausente e import GSAP fallido simultáneamente; el fallback correcto de arte podía omitir el import. Se separan en dos navegaciones con IDs de muestra distintos, manteniendo tanto la petición fallida GSAP comprobada como el resultado/acciones/receipt. No se cambia CardReveal ni se elimina la assertion de fallo.
- Se conservan las primeras capturas/datos A84 en `evidence/first-pass`, con procedencia6570ae1. El pase final seleccionará ES/Diagon en390/1280 y EN/ARCANA en865, tres capturas en total. No se amplía una matriz de capturas.

Las comprobaciones exploratorias con128semillas detectaron además rutas incompatibles con la política técnica restringida; no se usan para afirmar que todo inicio debe ganarse. Se descarta un planificador ampliado innecesario y se conservan los helpers generales originales. La fixture final no regala victorias: servidor/motor siguen resolviendo los comandos reales con contenido/stat/economía existentes.

## Segunda CI: fallos conservados y corrección de aislamiento

CI39124837482 sobre8f610ce: tipos/build/640pruebas unitarias e integración correctos; nueve casos A84 correctos otra vez. Check general fallido y regresión dependiente omitida.

- A70 no llegó a ejecutar tests: Node rechazó `equipment-v2.json` sin atributo de importación. El nuevo import de `trialConfiguration` en la fixture técnica no era compatible con el loader de Playwright; la aplicación Vite no presenta ese error. Se sustituye por una fixture JSON leída mediante fs, generada por `node tools/verification/build-a73-route-fixture.mjs` sin navegador/listener. Un test compara grafo y planes completos con el contenido vigente, para impedir divergencias silenciosas.
- Separar arte/import en dos navegaciones no bastó: WebKit seguía registrando cero peticiones GSAP abortadas, mientras el resultado estático permanecía accesible. Se conserva la assertion de petición fallida y se realiza esa inyección en un contexto aislado nuevo, con routing instalado antes de su primera navegación y movimiento normal explícito. La página anterior se cierra primero: ninguna escena paralela. Se elimina contaminación de caché/historial/preferencias; no se afirma haber medido internamente cuál de esas capas evitó la petición. No se cambia el renderer del producto.

Nueva ejecución necesaria sobre el candidato corregido; no se atribuye éxito por corregir la configuración o por pasar las pruebas de sonido aisladas.

## Tercera CI: movimiento/audio correctos, selector de fixture pendiente

CI39126440801 sobre9abc4fc, checkout de merge05be649 contra mainac827a0: tipos/build/641unitarias/integración correctos. A76:30; A82:6; A78:16; A79:7; A80:3; A81:3; A75:113; A68:12 casos correctos. A69+A84:28correctos/14omisiones explícitas; quedan resueltas las tres inyecciones de import fallido de WebKit. Los nueve casos A84 pasan por tercera vez, sin sumar esas repeticiones como cobertura única.

A70:19correctos antes de fallar el nuevo selector en el primer recorrido A73 (ES/ARCANA); había buscado únicamente Energía/Energy donde el paquete muestra Esencia/Essence. Es un defecto del test añadido, no una operación fallida del juego. Se corrige incluyendo los cuatro nombres accesibles reales. Extractos conservados en `evidence/first-failure/fixture-errors.md`. La victoria/uso de botín de A73 y el job regression siguen pendientes de este pase; no se declaran cubiertos por las19pruebas previas.

El siguiente candidato añade también texto200%en los controles A84 y una muestra nativa de storage entre dos pestañas (solo Chromium1280). La segunda pestaña no recibe gesto de activación: debe reflejar el apagado sin crear AudioContext. No cambia código de producto desde la primera familia sonora validada.

## Candidato final y alcance comprobado

[CI39128171523](https://github.com/earandes/diagon-alley/actions/runs/39128171523), head`2330f7b18b5a594663efa18cbd1449f7744c503e`; checkout real`4fea2b08d8416132f40bc127973bb29c44556177`contra mainac827a0. Ambos árboles Git son`8c811ef706732ce55c0f9ce81ab57d5c3e569e82`, cotejados por fetch/diff, no inferidos del nombre de rama. Jobcheck117677598386 correcto; metadata y tres reportes/tres capturas de audio en `evidence/final`.

| Comprobación | Resultado del job check |
|---|---|
|`npm run typecheck`, `validate:content`, `build`, `verify:arcana:build`|Correctos; advertencia histórica de chunk grande conservada|
|`npm test`|96archivos/641casos correctos|
|`npm run test:integration`|16archivos/99casos correctos con PostgreSQL/Redis reales|
|`verify-accounts-backup-a76.mjs`|Copia/restauración aislada correcta,15tablas; no partida habitual|
|Cuentas A76 / menú A82|30correctos/30omisiones;6correctos|
|A78 / A79 / A80 / A81|16/7/3/3correctos; A78omite11y A79omite2parejas no seleccionadas|
|Experiencia A75|113correctos/175omisiones explícitas|
|Jefe A70/A71 + expedición/recuperación A73|103correctos/35omisiones; cuatro rutas de idioma/pack con fixture declarada, sin error de página|
|Halloween A68|12correctos|
|Movimiento A69 + audio A84|28correctos/14omisiones, de ellos9casos A84en tres parejas; las otras parejas conservan movimiento sin duplicar audio|

Sonido comprobado: silencio sin fetch/contexto inicial, activación por teclado/toque emulado, decode real de nueve recursos, render offline de curación, fuentes nativas al seguir el reloj/log, límites del gestor, pausa/2x/omisión/reducido, fallo de recurso con juego utilizable, persistencia/recarga, foco y disposición. Las cuatro combinaciones de idioma/pack por tamaño y texto200%se verifican en los tres pares; storage nativo entre dos pestañas, en Chromium1280. Tests unitarios cubren almacenamiento denegado, payload inválido, APIs ausentes y descarga tardía; no se presentan como todos esos fallos reproducidos con hardware real.

Los cuatro JSON A73 están en `evidence/regression-a73`: cada uno indica fixturetrue, semilla0, comandos posterioresPG/Redisy sus límites. No se comparan sus tiempos con rutas aleatorias como si fuera el mismo recorrido. Las capturas A84son de un harness declarado con componentes reales, sin jugador económico; las pruebas económicas/operaciones corresponden a las baterías separadas.

Jobregression117684588440 correcto, sobre el mismo checkout4fea2b08 verificado en su log. Estado global de CI39128171523: **success**.

| Comando del segundo job | Casos correctos |
|---|---:|
|`ARCANA_TRIAL_COMPILED=1 npm run test:e2e -- --project chromium --project webkit --reporter=line,github`|56|
|`playwright.progression-a67.config.ts` (Chromium/WebKit)|20|
|`playwright.gameplay-a63.config.ts`|16|
|`playwright.header-pact-a66.config.ts`|20|
|`playwright.intentions-a65.config.ts`|8|
|`npm run test:pwa -- --project chromium --project webkit`|12|
|Referencia A66 reconstruida + performanceA67 baseline/current|1+1|

Total gráfico activo de la ejecución:321en check+134en regression=455; nueve son A84. Omisiones de check:267, por selección explícita de parejas/proyectos; no se suman como cobertura ejecutada. No hay reintentos automáticos. El segundo job se inicia después del primero, no hay baterías gráficas simultáneas. `evidence/final/check-job.json` y `regression-job.json` conservan metadata de los jobs; logs completos accesibles desde la CI.

El cierre documental conserva código/tests/configuración del candidato probado y registra [equivalencia](EQUIVALENCE.md), sin atribuir una ejecución nueva al SHA documental posterior. Word y evidencia histórica intactos. Sin navegador/captura/audio automatizado en Mac, sin merge/despliegue. Escucha humana, salida física, Safari/iOS/Android físicos y apreciación del timbre siguen pendientes.
