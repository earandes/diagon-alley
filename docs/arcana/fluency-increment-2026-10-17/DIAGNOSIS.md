# A73 · Investigación y decisiones

## Separación de evidencia

**Hechos comprobados en código:**

- `useBattlePlayback` publica fronteras de fase y utiliza el mismo `ReplayClock` que Pixi. No recalcula combate.
- `BattlePanel` mide geometría al cambiar combate, idioma o tamaño; no hace lecturas DOM por frame.
- `SceneAtmosphere` ya cede ante arena/preparación. El backdrop histórico duplicado está anulado por CSS.
- `pixi-scenes.update` invalida geometría incluso cuando solo cambia la fase. Cada decode resuelto solicita otro paint, también mientras el ticker está activo.
- Pixi8.22 instalado: `autoDetectRenderer` llama a `isWebGLSupported`; este crea y pierde un contexto de prueba antes de crear el contexto de trabajo. La documentación ofrece construcción directa de `WebGLRenderer`. No se afirma aún cuánto tarda este paso.

**Problema histórico reproducido anteriormente:** arena genérica P95rAF33,4ms en dos de tres ejecuciones con el mismo runtime; arranque con máximo≈233ms. Los valores16,8ms del jefe no sustituyen el caso desfavorable.

**Referencia Linux39026178568:** fase A70/A71/A73 correcta y artifact guardado; ejecución global cancelada deliberadamente después, sin atribuir éxito total. Mergeensayado582bdc57a0e1675b21867b772363fd9ddc01ba3e, head d13c0d9. Seis ventanas10s: todasP95rAF16,7–16,8ms y ceroLongTasks cálidas. El caso histórico33,4ms **no se reprodujo en esta referencia**. Renderer declaradoANGLE/SwiftShader. Inicialización29,2–50,8ms e importación39,3–72,4ms; no explican por sí solas todos los picos. Se observaron tres adquisiciones decontexto (sondas internas yrenderer), no solo la sonda de capacidad.

Arranque: genérico345,3–399,3ms yjefe504–522,2ms como cotassuperiores hastaart-ready; máximo rAF66,5–150ms. Entre9y16paints antes de esa lectura, con39,1–75,2ms acumulados dentrodepaint. Los callbacksdecode sucesivos intercalan envíos de4–11ms; esta ráfaga es trabajo redundante comprobado. Promesasdecode81,9–109,7ms incluyen schedulingyred y no se suman comoCPU. Geometría cálida92–99reconstrucciones por10s, coste acumulado6,6–12,1ms: reducible, pero demasiado pequeño para atribuirle los intervalos históricos33ms.

Los hooks no alteran decisiones, reglas u operaciones y no se activan en uso ordinario.

## Hipótesis y contraste

| Hipótesis | Qué la apoyaría | Qué la limitaría/descartaría |
|---|---|---|
| Inicialización/autodetección | `renderer-init` y Long Tasks relevantes; dos contextos observados | Mayor coste fuera de init o ausencia de mejora al evitar la sonda |
| Importación/evaluación | intervalo `module-import` dominante | intervalo pequeño; coste persiste con módulo disponible |
| Decode/subida inicial | promesas y primer submit coinciden con el pico | promesas solapadas no prueban CPU; submit no mide GPU |
| Geometría redundante | muchas reconstrucciones por fase sin variar puestos/arte/condición | coste insignificante; reducirlas no cambia la ventana |
| Trabajo continuo no visual | paints durante eventos sin movimiento; coste de submit relevante | mismos intervalos pese a menos envíos |
| Instrumentación/runner | variación entre muestras, renderer software y comparación A69 sin sink | no explica por sí solo un defecto causal de app |

Primero comparar sobre las mismas fixtures y ventanas. Ninguna observación aislada acredita fuga, tiempoGPU o causalidad. No modificar reglas para fabricar un combate favorable.

## Alternativas condicionadas a medición

1. Inicializar directamente el WebGLRenderer ya requerido; conserva try/catch y fallback DOM, sin otro motor ni capability-context desechable.
2. Invalidar geometría solo cuando cambia su entrada y agrupar invalidaciones de carga; mantener todos los actores, fases y posiciones.
3. Evitar envíos repetidos de una imagen estática durante eventos sin movimiento, conservando el avance del reloj compartido.
4. Reutilización acotada entre pantallas: solo si recrear recursos demuestra un coste relevante. Debe definir propiedad y liberación; no es una decisión tomada.

No se adoptan por ahora cachés globales, prewarming, reducción de resolución, nuevos formatos o exports, rendergroups, otro runtime ni cambios de arte. Son costes y riesgos innecesarios sin evidencia específica.

## Fuentes técnicas

Consulta17octubre2026: [Renderers Pixi8](https://pixijs.com/8.x/guides/components/renderers), [API8.22 WebGLRenderer](https://pixijs.download/v8.22.0/docs/rendering.WebGLRenderer.html). Código instalado en `node_modules/pixi.js/lib/rendering/renderers/autoDetectRenderer.mjs`, `utils/browser/isWebGLSupported.mjs`, `app/Application.mjs` y `rendering/renderers/gl/WebGLRenderer.mjs`. El código fijado por lockfile resuelve diferencias con documentación dev. No se usa una demo del proveedor como benchmark propio.

## Primer ciclo elegido

Evidencia → cambio: las llegadas de textura realizaban pinturas síncronas independientes → invalidación agrupada por frame; si el ticker ya está activo, lo utiliza sin un segundo envío. Pausa vacía la invalidación de inmediato; ocultación y desmontaje cancelan callbacks. Sin retrasos temporizados, prewarming, nueva caché o cambio de resolución.

Las fases reconstruían plataformas/figuras sin variar geometría → comparar puestos, orden, apariencia y condición vivo/caído. PV/PM, actor/objetivo y coreografía siguen proyectándose desde el log actual. Caída, nueva figura, encuadre, tamaño, textura resuelta y resize invalidan correctamente. El coste de comparación es≤10unidades; no se memoriza el log completo ni se altera el reloj.

Se descartan por ahora la sustitución de Application, caché de contextos y cambios de exports: init es una fracción pequeña deesta referencia y la ráfaga de paints tiene una corrección menor. La construcción directa documentada sigue siendo alternativa, no implementación.

Presupuestos de ensayo elegidos tras la referencia: P95rAFsostenido≤20ms; navegación→arte genérico≤400ms/jefe≤550ms y máximo rAFdearranque≤100ms como objetivo más exigente que el máximo150ms observado. Son objetivos en lasfixtures declaradas, no garantías físicas. Además se exige una reducción reproducible de paints/reconstrucciones sin empeorar el recorrido; pasar un techo sin diferencia antes/después no se declara mejora.

## A/B mismo runner · 39029402120

Referencia d13 y candidato075d se compilaron y midieron en el mismo job, orden AB/BA/AB, contextos separados. Mediana de arte listo genérico531→471ms, jefe722→484ms. P95 sostenido genérico33,3–33,4ms en ambos, también tras remontar; jefe16,8ms. Los intervalos de paint/commit de React P95 estuvieron entre0,6–1,4ms, sin aislar GPU ni composición. No es suficiente para cumplir20ms. Crudos en evidence/ab-1.

Ensayo siguiente: mipmaps de imágenes minificadas, sin cambiar ilustraciones/resolución/encuadre. Pixi8.22 comprueba soporte NPOT antes de generar niveles. Coste potencial: preparación inicial y hasta aproximadamente un tercio adicional de texels; no equivale a memoria residente. Hipótesis de muestreo, no causa GPU demostrada. El constructor de referencia se ajusta a las mismas tres entradas Vite antes de comparar de nuevo.

## Segundo A/B ·39029992923 ·ensayo de mipmaps descartado

Con entradas Vite igualadas, ambas variantes dieron P95rAF16,7–16,8ms, incluido remontaje. Arranque genérico referencia419–454ms/candidato377–406ms; jefe508–516/370–460ms. No se aísla beneficio sostenido de mipmaps: también la referencia mejoró respecto al runner anterior. Se retira el ensayo para evitar coste adicional no justificado; no se elige esta muestra favorable como prueba universal. Se conservan crudos y resumen en evidence/ab-2. Fase gráfica correcta, resto de workflow cancelado deliberadamente, no CI global.

Siguiente corrección demostrable por dependencia de código: iniciar decode de las imágenes pertinentes en paralelo con app.init, incluidas base/brazo del jefe. Texturas GPU solo después de inicializar. Propiedad por escena y limpieza; no precarga desde otra pantalla, caché global, nuevas ilustraciones ni resolución reducida. Fallo de decode mantiene el fallback y no crea reintentos. Arranque se seguirá midiendo desde navegación/clic incluyendo todo este trabajo; tiempos de init/decode pueden solaparse y no se suman como CPU.

## Tercer A/B ·39030494297

Decode paralelo: referencia d13 frente a a5. Genérico539–620→456–501ms, jefe685–738→489–494ms; arranque maxrAF183–250→83–117ms. Todas las parejas mejoran, sin mover trabajo a otra vista. Warm genérico33,4ms en ambos, jefe16,8. El objetivo sostenido continúa incumplido. Crudos ab-3, incluidos intervalos desfavorables.

Se acota otro experimento para aislar el muestreo: baseline cambia explícitamente a a5 (optimización de arranque ya aplicada), candidato difiere solo en mipmaps. Tres parejas en mismo runner, sin reintentos; referencia anterior preservada. Se había descartado frente a d13 por no poder atribuir beneficio; ahora se compara una sola variable. Si no se demuestra mejora, no se adopta por el coste de texels. No se interpreta el dato textureBytes, que solo estima nivel0, como memoria de mipmaps ni residente.

## Cuarto A/B ·39030942928 ·mipmaps aislados: rechazo

Baseline a5 y candidato ffba, única variable de render: mipmaps. Genérico P95rAF33,4ms en seis ventanas por variante; jefe33,2–33,3ms en ambas. No mejora consistente de arranque. Se retira definitivamente el ensayo: su coste de texels no se justifica. El entorno también degradó al jefe respecto a runs anteriores, sin atribuir causa única. Crudos ab-4.

Siguiente variante: ticker solo para los eventos que mueven figuras/efectos. La imagen no cambia entre frames de turn-started/synergy/bean/mana; update conserva su dibujo puntual y el reloj independiente continúa. Entrada/hechizo/curación/quemadura conservan todos sus frames y movimientos. Se añaden etiquetas de cursor/fase a la instrumentación idéntica de ambas variantes para comprobar intervalos de acción, sin esconderlos entre pausas visuales. Revisión estática independiente sin defecto demostrable; validación Linux pendiente.

## Quinto A/B ·39031399760 ·ticker bajo demanda

Referencia a5 frente a14a7: todos los sostenidos16,7–16,8ms en ambos, también remontajes. No acredita corregir el runner desfavorable. Sí reduce drawElements de1211–1214 a1076–1092 en genérico y3526–3544 a3021–3058 en jefe; no se quitan fases ni efectos. Arranque actual genérico393–422ms/jefe483–515ms, maxrAF67–100ms. Una cota superior observada genérica excede400ms. Crudos ab-5. Goal activo; comparación favorable no es prueba universal.

Se identifica carga ajena a los consumidores actuales: browserAll añade EventSystem/EventsTicker, accesibilidad Canvas y otras extensiones. Canvas es aria-hidden/pointer-events:none y todas las acciones/etiquetas son DOM. Pixi8.22 admite skipExtensionImports; Graphics/máscaras/texturas/ticker de Application ya se registran en las clases/imports usadas. Se prueba omitir autoload, conservando API/render/semántica. Baseline pasa a14a7 para aislar esta única opción. Sin import interno privado, extensión eliminada globalmente, nueva dependencia o arte reducido. Riesgos: cobertura de máscaras del brazo, imágenes y controles en matriz completa antes de integrar.

## Sexto A/B ·39032033053 ·autoextensiones: no se adopta

Referencia14a7 frente a eadded8. Genérico sigue33,4ms, jefe16,8 en ambos. Init se acorta, pero el arranque total no mejora consistentemente y la mediana del jefe empeora≈503→576ms. Se retira la opción antes de integrar: menor init aislado no basta. Crudos ab-6. No se declara una causa única de ese resultado.

Nueva muestra técnica: se analiza alfa de los exports activos, sin modificar imágenes. Rectángulos de figuras Diagon incluyen≈10–16% de píxeles enteramente transparentes en muestras; varias ARCANA y el jefe tienen más margen. Se usa Texture.frame/trim/orig público para omitir ese margen de la geometría, preservando marco lógico/pivotes, resolución y cada píxel alfa>0 más un píxel de guarda de muestreo. No se reducen figuras ni información. Metadata fuente/versionada incluyeSHA256 y dimensiones; checks de integridad y fallback a frame completo si faltan datos/tamaño incompatible. El script demuestra alfa cero fuera del marco y no escribe artwork. Baseline14a7/candidato: solo esta geometría de textura; carga y fuentes intactas. Beneficio GPU todavía hipótesis.

## Séptimo A/B ·39032748032 ·trim rectangular

Baseline14a7 frente a fa41664. Genérico33,3–33,4→33,3ms, también remontajes; jefe16,8 en ambos. El número de frames/draws genéricos aumenta en las tres parejas, pero no cumple20ms. Arranque genérico479–521→464–493ms, jefe479–591→465–570; no se sustituye el caso peor. Crudos ab-7. El margen transparente se omite sin reducir resolución o píxeles visibles; aún no hay aceptación visual nueva.

Siguiente muestra: atlas de franjas para figuras ordinarias grandes (≥96píxeles de alto del renderer). Usa la misma fuente completa, UV y marco original; frames adyacentes no se solapan. Cada banda conserva todo alfa positivo, filas vecinas de guarda para el filtro y un píxel lateral. No se divide el actor del jefe ni sus piezas. Figuras pequeñas mantienen el trim rectangular. Metadata se valida contra hashes y el generador demuestra que no queda alfa positivo fuera de la unión; pruebas comprueban marco, ancla, escala, UV de unión y recuperación del frame único al redimensionar. Frames de atlas comparten fuente y se liberan sin destruirla hasta cleanup de escena. No nuevas imágenes, resolución menor, ticker, efecto o regla.

Baseline pasa a fa41664 para aislar las franjas. Se autorizan exactamente dos PNG Linux opt-in (referencia/candidato genérico, primera pareja, tras medir y pausar), bajo ARCANA_CAPTURE_A71=1 existente. No vídeo/trazas o capturas en Mac. Se usan para inspeccionar la muestra antes de cualquier ampliación, no como prueba de movimiento. Goal activo hasta comparación y regresiones integradas.

## Octavo A/B ·39033526883 ·bandas

Baseline fa41664/candidato78267f5. Genérico33,3–33,4→33,3ms, remount igual; jefe16,7–16,8. Más frames genéricos en cada pareja pero sigue sin20ms. Arranque genérico468–551→471–488ms; jefe566–592→594–629ms: coste/regresión observada no se oculta. Las dos imágenes pausadas fueron inspeccionadas: sin costuras evidentes, pero21305píxeles RGB difieren, máximo25por canal dentro de las figuras. No se proclama identidad de píxeles o movimiento validado. Misma fuente no garantiza idéntica precisión de interpolación. Raw/fotos ab-8.

Se investiga el clear por defecto(COLOR/DEPTH/STENCIL); la escena es2D y no usa profundidad, pero la máscara del jefe sí requiere stencil. No se cambia sin medir su coste.

Hallazgo prioritario de shader: GlLimitsSystem usa el máximo del driver para generar un sampler y una rama por textura en DefaultShader. La escena habitual usa6fuentes+blanco; el catálogo entero no necesita estar en un solo lote. Se prueba cap8 por renderer, nunca por unidades. Pixi divide los lotes que excedan8, conservando fuentes/unidades/PV. API pública maxBatchableTextures, antes del primer draw, no cambio de configuración global o motor. Baseline78267f5; candidato solo cambia ese presupuesto. Se registra el número real de samplers del GLSL, capacidades y spans nativos acotados para confirmar o rechazar el coste; son wall-times de envío, no tiempoGPU. Si resuelve la causa, se reconsiderará la necesidad de la geometría de atlas más compleja.

## Noveno A/B ·39034276488 ·límite de batching

Baseline78267f5 frente ae5aa2af. En el mismo runner, las tres muestras genéricas pasan deP95rAF33,3–33,4 a16,7ms; remontaje33,3 a16,8. Jefe16,8 a16,7 sin empeoramiento sostenido. GLSL observado: referencia32/32samplers y candidato32/8: Graphics conserva32; el batch de figuras utiliza8. Se confirma el ámbito limitado de la intervención, no se proclama un límite global de shaders ni una causa universalGPU.

Inicio genérico465–564→454–472ms; jefe473–589→495–532ms, con una pareja desfavorable. MáximorAFdearranque genérico100–133→83,3–83,4ms; jefe100–117→83–100ms. La primera consulta getProgramParameter observada23,1→5,9ms no se considera costeCPU puro de compilación ni explica por sí sola el sostenido. Las primeras16llamadas nativas de cada método se midieron en ambas variantes, sin finish/readback/GPUquery.

Fase de diagnóstico correcta; resto cancelado deliberadamente tras recuperar artifact. No es CIglobal correcta. Se conserva el objetivo400msgenérico incumplido y la variabilidad de arranque. Crudos ab-9.

Candidato mínimo siguiente: se retiran certificados alfa, franjas y sus helpers/tests/generador activos. Esas intervenciones no resolvieron el objetivo y alteraron precisión RGB; no compensan su complejidad una vez encontrado el límite de batching. Se conservan evidencia e historia. Comparación final vuelve a referencia iniciald13, con idénticas entradasVite/instrumentación; tres parejas, secuencia acotada sin reintentos. Si el sostenido vuelve a fallar, no se integra por la muestra9 favorable.

## Espera evitable tras init · hipótesis concreta siguiente

En ab-9 genérico/candidato, todos los decodes ya terminaron antes de la primera geometría: pareja0 termina211,9–258,4ms, geometría260,8ms; parejas1/2 también terminan antes de init. El cargador vuelve a encadenar .then sobre esas promesas; textures sigue vacío durante ese paint y solo se rellena en la microtarea posterior. Eso demuestra una oportunidad de uso inmediato, no permite atribuirle automáticamente los80ms entre paints: LongTask y paint no cubren el mismo intervalo.

Cambio mínimo en ensayo: un registro por imagen de escena conserva el resultado resuelto, que la promesa ya retenía. loadTexture lo instala síncronamente si está disponible; si sigue pendiente, conserva callback/invalidación. No await de todo el conjunto, carga en pantalla anterior, nuevo recursoGPU o segunda caché global. Guardas contra destroyed/duplicación y catch por recurso mantienen fallback aunque falle Texture.from. Se unifican los tres cargadores idénticos para mantener esas garantías.

Coste/renuncia: el primer paint puede concentrar uploads; se comparará arranque completo, máximos y paints, no solo inicialización. Aún no es mejora medida. Presupuestos400/550ms y≤100msdearranque siguen siendo de ensayo, no se rebajan para aceptar el cambio.

## Décimo A/B ·39034798097 ·candidato mínimo frente a inicio

Referenciad13 frente a0c0547c (sin alfa/atlas). Este runner fue favorable para ambas variantes: sostenidos16,7–16,8ms, remontajes16,7–16,8. No se usa ese hecho como causalidad del sostenido; ab-9 aisló el cap en el runner desfavorable. Arranque genérico319–392→278–348ms (una pareja319→348 empeora), jefe418–442→346–367ms (tres parejas mejoran). Máximo rAF de arranque genérico83–117→50ms, jefe117–133→50ms. Los presupuestos de ensayo se cumplen en estas tres muestras, no como garantía universal.

No modifica ilustraciones, resolución ni composiciones. Dos PNG seleccionados tras medir conservados enab-10; no son evidencia de movimiento. Fase de diagnóstico pasada; resto cancelado deliberadamente, no CIglobal.

Siguiente comparación (última hipótesis de arranque prevista): referencia0c0547c frente al uso inmediato de imagen ya decodificada. Aislará esa variable; si no reduce trabajo/arranque de forma convincente o agrava picos, se retirará. Tres parejas, sin reintentos ni nueva matriz exploratoria.

## Undécimo A/B ·39035264888 ·no aceptar concentración de arranque

Baseline0c frente ad03. Todas las ventanas del candidato pasan≤20ms; una ventana baselinegenérico/remount vuelve a33,3ms, conservada. Genérico actual409–433ms frente450–507 (mejora las tres parejas), pero máximos de arranque117–133ms frente83–100. Jefe469–512 frente493–523, con una pareja desfavorable; picos167–183 frente83. El presupuesto de picos falla. No se integra esta variante como solución terminada.

La medición sitúa onceuploads del jefe en el mismo primer paint (render-submit66ms/paint71ms en pareja0), frente a uploads en pinturas separadas antes. No se llama a esa suma tiempoGPU ni se atribuye todo elrAF183ms a ese envío.

Ensayo12: conservar la disponibilidad inmediata pero admitir como máximo dos fuentes nuevas en cada paint. Es un presupuesto de trabajo de arranque, no de unidades visibles ni de texturas totales: los retratosDOM permanecen hasta que hay figuras y todas las fuentes terminan incorporándose. Texturas ya instaladas dibujan normalmente. Las pendientes solo invalidan y pasan por el mismo presupuesto; no temporizadores, cola global, await de todo o carga anterior. Se mide el coste total de los frames adicionales, no solo primer paint. Para el jefe, el punto de arte listo espera también actor por piezas; los registros de ensayos anteriores conservan su data-boss-actor-ready para distinguir el criterio.

Dos fuentes se eligen como ensayo por llamadastexImage2D observadas de2–6ms cada una, dejando margen para composición/shader; no es una garantía de12msCPU o20msGPU. Si empeora el recorrido o no acota los picos, no se adopta por una cifra parcial. Misma batería acotada y guards, tres parejas contra d03, sin reintentos. No se altera ninguna matriz funcional.

## Duodécimo A/B ·39035910193 ·presupuesto de admisión

Baseline d03 frente a83d4e48. Este runner fue favorable en sostenido para ambas variantes (16,7–16,8ms, también remontajes). Candidato genérico320–336ms, máximorAF≈66,7ms; jefe367–369ms incluido actor, máximorAF≈66,7ms. Se cumplen400/550/100msen las tres muestras. Coste real frente a todo-de-golpe: genérico301/240/263→335/336/320 (+34/+96/+57ms), jefe320/321/318→367/369/368 (+47/+48/+50ms). Los máximos jefe≈100→67ms en las tres parejas. No se oculta el aumento de tiempo total ni se afirma que este ensayo mejoró el sostenido cuando también la referencia fue rápida.

Se elige el presupuesto2 como compromiso de ensayo porque el envío simultáneo falló con167–183ms en otro runner; no se utiliza el runner favorable para aceptar el envío sin límite. Dos admisiones de Texture.from no garantizan exactamente dos uploadsGPU: una pieza puede empezar a dibujarse después. La limitación es de admisión, se conserva la observación nativa y no se anuncia un presupuestoGPU que no se ejecuta.

Última comparación prevista: mantener runtime83d4e48 y volver a referencia iniciald13, mismas entradas/instrumentación actual, tres parejas. Es necesaria para comprobar el coste total final frente al comienzo, no un reintento automático para borrar resultados desfavorables. Luego matriz funcional completa y regresiones, sin más cambios por ajustes cosméticos.

Alternativa revisada sin ejecutar: forzar batchMode público de Graphics podría evitar usar su shader32; también aumentaría empaquetado/buffers de geometría por frame. No se adopta al cumplir la muestra actual y no haber comparación que justifique ese coste. No se modifica un sistema privado ni se recompilan shaders manualmente.

## Decimotercer A/B ·39036393375 ·comparación contra el inicio

Runtime83 frente a referenciad13, entradas iguales. P95 sostenido16,7–16,8 en ambos en este runner favorable, también remontajes. MáximorAFgenérico117–150→83,3ms yjefe150–183→83,3ms, tres parejas mejoran. Arte listo genérico405–484→412–426ms: dos parejas empeoran; objetivo400ms incumplido. Jefe508–548→530–544ms: una pareja empeora. Se conservan todos los valores; no se anuncia una mejora general de latencia por reducir el pico.

La prioridad de bloqueos mejora de forma reproducible, pero el objetivo de arranque queda activo. Se contrasta la alternativa pública previamente revisada: ink.context.batchMode y sparks.context.batchMode pasan a batch. Son paths acotados de fills/strokes; no cambia tessellación, formas, orden o máscaras. El batch usará el límite8 ya aplicado en lugar del shaderGraphics32, si la librería lo admite en ejecución. Se medirá GLSL real y buffers, no se promete eliminación de toda creación durante init.

Ensayo14 contra83, única variable de renderer. Riesgo/coste: mayor empaquetado de vértices y updates de buffer al reconstruir sparks. Mapa estático también usa el mismo ink: la matriz debe comprobar su entrada, nodos y retornos. No se toca ningún sistema privado, extensión global, shader manual o dependencia. Se retira si no demuestra beneficio suficiente o si hay regresión visual/funcional.

## Decimocuarto A/B ·39036894838 ·formas en batch

Baseline83 frente aca9cc86, única variable batchMode público en ink/sparks. GLSL realmente compilado32/8→8. Genérico367–427→330–365ms yjefe383–397→338–355ms: todas las parejas mejoran. Máximosgenérico67–100→33–50ms yjefe≈67→≈33ms. Sostenidos16,7–16,8ms en ambas variantes, incluidos remontajes; no se proclama una nueva ganancia sostenida porque ambos ya son rápidos. Los envíos/buffers y métricas wall se conservan enraw.

Se adopta la composición en batch para estas formas acotadas; no se reescriben shaders ni cambian sus paths/colores/orden. GraphicsAdaptor puede crear su programa32 en memoria durante init, pero ese programa no se observó compilado/usado porGL en estas muestras. No es una declaración global sobre todos los posibles Graphics futuros.

Último contraste de aceptación: runtimeca9 contra d13, protocolo actual y tres parejas; matriz posterior enfull. La revisión de cobertura además detectó tres combinaciones no acreditadas por los casos existentes: preferencia reducida durante replay, resize pausado y ocultación durante decode pendiente. Se añade un caso Linux/Chromium acotado, fixture5×5 con gate de decode y visibilidad sintética, sin operaciones económicas: muestra cola terminando, actores/PV visibles en390/865, cursor pausado y log/resultado conservados. Su mera escritura no se cuenta como ejecución.
