# A87 · Rendimiento: presupuestos y evidencia

Estado: medición gráfica del candidato pendiente en CI Linux. No se ejecutan navegadores, perfiles, matrices o capturas en el Mac. El preflight permitido `npm run test:browser:check` pasó sin abrir navegador; no equivale a un smoke ejecutado.

## Coste añadido y límites de diseño

- 16 WebP transparentes: 849.532 bytes. Los masters editables no forman parte del build. La UI descarga solo imágenes utilizadas.
- Cuatro texturas cast de 342 × 428 como máximo cuando estén presentes las cuatro especies. Su dimensión RGBA conjunta equivale a 2.342.016 bytes como estimación de píxeles sin comprimir; no es memoria GPU residente medida.
- Prioridad de admisión para todas las figuras en reposo antes de las poses cast. Se conserva el presupuesto existente de dos nuevas texturas por pasada.
- Una Sprite por unidad: intercambio entre dos texturas preparadas. Sin nuevo ticker, filtro, AnimatedSprite en bucle o reloj independiente.
- Siete cues: 94.388 bytes. No se solicitan antes del consentimiento de efectos. El sistema completo tiene 16 WAV, incluidos ambiente y efectos históricos. Límite de cuatro voces de efecto existente.
- Efectos Graphics finitos y localizados sobre la acción actual. Sin partículas persistentes o generación de recursos durante una interacción.

## Ensayo preparado

Seis contextos nuevos secuenciales de Chromium Linux 390 × 844: tres por paquete, ES, audio inicialmente desactivado, HTTP local sin throttling. Módulos ya evaluados al mostrar el mapa; no es un arranque frío del sistema operativo. El clic de entrada registra el tiempo inicial dentro del manejador real del botón de fixture.

Medidas separadas: acción → figuras preparadas, acción → registro CPU de las cuatro texturas cast, primera pose cast observada y 300 intervalos rAF sostenidos. El registro de texturas no prueba subida a GPU. Las long tasks se observan desde antes de la acción hasta el fin de la ventana. Se conservan filas crudas antes de evaluar el presupuesto, incluso si una muestra falla.

Objetivo sostenido de ensayo: P95 rAF ≤20 ms. Objetivos de arranque declarados: ≤1.000 ms para figuras y ≤1.500 ms para registro de poses en ese entorno. No son garantías universales o medidas actuales. Techo de estimación RGBA por escena: 32 MiB; el contador propio no acredita ausencia global de fugas.

Las pruebas funcionales observan pausa, omisión, inspector, recursos ausentes y contadores al desmontar. Una captura estática solo informa de composición; la congelación de pose/offset y la secuencia de fases aportan evidencia temporal limitada. La liberación de contadores propios se distingue de memoria global.

## Referencia histórica A86

En el ensayo pareado A75 de la fuente6cf2ac8, P95 rAF sostuvo16,7 ms, pero el arranque mediano empeoró de303,9 a340,5 ms. Se conserva ese resultado desfavorable. Aquellas ventanas tenían módulos ya evaluados y otro elenco; no se usan como una comparación causal directa de criaturas o de un dispositivo físico.

A87 se compara primero dentro de sus seis muestras declaradas. Si no cumple, se investigará la causa y se preservará la muestra adversa; no se cambiará el umbral ni se ocultarán unidades para pasar. La percepción de ritmo, la escucha y el rendimiento físico siguen pendientes.

## Referencia actual sin criaturas, candidato 428927f

La batería A70/A71 del run39178088811 ha pasado y ha publicado dos muestras Chromium1280×900 con los jefes históricos, sin criaturas nuevas. Checkout729c7076. [Procedencia y originales](evidence/reference-428/provenance.json).

- A70: arranque389,3ms; ventana sostenida600intervalos, P95rAF16,8ms y máximo16,8ms.
- A71: arranque344,9ms; ventana sostenida599intervalos, P95rAF16,7ms y máximo16,8ms.

El P95de las ventanas cortas de arranque es33,4ms en ambos casos. No se oculta ese comportamiento ni se mezclan esas ventanas con la reproducción sostenida. Son referencias del entorno actual con contenido histórico, no una comparación pareada que atribuya una mejora a las criaturas. El estudio A87 y el estado final de toda la CI siguen pendientes.

## Segunda muestra39182975065 (47b5892), sin ocultar resultado adverso

[Crudos](evidence/candidate-47/creature-performance.json). Seis contextos con las mismas condiciones declaradas: Diagon figuras225,4/240,6/201,7ms y registro234,6/243,2/210,1ms; ARCANA286,3/232,6/237,9ms y288,8/235,8/241,8ms. P95rAF16,7–16,8ms en todas. Una long task de56ms en la primera muestraARCANA; las otras cinco no registran. No se oculta ese pico ni se atribuye aGPU o a una causa concreta.

Las seis muestras428habían dado figuras161,6–202,7ms y registro163,7–204,7ms, sin long tasks en sus ventanas. Esta segunda muestra es más lenta: no se declara mejora o ausencia universal de picos. Ambas están bajo los presupuestos de ensayo. La batería general47falla por scroll del jefe e inyección inválida de un emblema, aunque el ensayo de rendimiento termina correcto.

### Precisión sobre la condición de arranque

La fixture ya ha evaluado su módulo de aplicación y montado el mapa antes del clic. El test espera al equipoDOM, no a una marca de mapaRendererReady: la importación asíncrona dePixi del mapa puede haber terminado o solaparse todavía con ese clic. Por tanto, la frase de los crudos «modules already evaluated» no acredita que todos los módulos/recursos gráficos estuvieran calientes. Se declara esa incertidumbre; no se presenta fríoOS, import aislado o efecto causal. El tiempo observado incluye el trabajo que reste desde la acción, sin insertar otra espera en la pantalla anterior.

## Muestra f79d9ce, run39186209500

[Crudos](evidence/candidate-f79/creature-performance.json), checkout7ef9b2b. Diagon figuras207,8/195,1/201,6ms y registro210,0/197,3/204,1ms. ARCANA211,1/224,0/201,3ms y registro213,3/226,9/203,4ms. P95rAF16,7–16,8ms en las seis; long tasks53y52ms en las dos primerasARCANA, ninguna observada en las otras cuatro. No se excluyen esos valores. Eljobcheck termina correcto; la regresión sigue en curso al registrar esta sección.

Las tres ejecuciones conservan variabilidad de arranque y tareas largas ocasionales. No se atribuye la diferencia de195–224frentea202–286o162–203ms a una optimización: la corrección actual es de diálogo/fixture y la coreografía no se ha sustituido. Se cumple el presupuesto sostenido de estas muestras; no se garantiza un dispositivo físico, fríoOS o ausencia general de fugas.

## Regresión general A67, no comparación conA86

El mismo run conserva [baselineA66](evidence/candidate-f79/a67-baseline.json) y [actual](evidence/candidate-f79/a67-current.json), ChromiumLinux1280×900. Primer popup dePacto:93,6ms→107,3ms hasta utilizable y544,8→542,6ms hasta asentamiento; no mejora universal. Los máximos de intervalo de esa ventana son83,3y50,1ms, no P95sostenido o tiempoGPU. La palabra«cold»delnombre delcaso identifica primera consulta; no controla cachés delOS.

Es un benchmark diagnóstico de recorrido frente aA66, concontenido/rivales de sus respectivosSHAy ordenbaseline→actual, no elensayopareadoA86niuncontrolcausalaislado decriaturas. Ambos comandos terminan correctos; no sustituyen el presupuesto A87de300intervalos en seiscontextos. Se conservan valores adversos ycrudos completos.

## WebKitpareado057: límite no cumplido

La fase resume publica por primera vez en este incremento el [ensayoWebKit](evidence/candidate-057/paired-webkit-performance.json) deA75. BaselineP9518/19/18ms; actual23/22/23ms sobre elmismo loglegacy, seiscontextos AB–BA–AB. Arranque baseline601/403/469ms, actual553/533/393ms; máximo sostenido baseline106/104/26, actual34/27/33ms. No hay longtasks API soportadas registradas enWebKit; no significa ausencia de trabajo largo. Chromium600intervalos P9516,7ms en todas. No es la muestra de criaturasChromiumA87ni tiempoGPU.

Se conserva elresultado fallido y se prueba deduplicación de tres atributos de diagnóstico porframe. Es una hipótesis sobre coste de publicación DOM, no una atribuciónconfirmada aGPU o una autorización para ocultar unidades. Fullpasará a incluir ambos motores en este ensayo, con elmismo límite y número de pares.

## Contraste f0c7810 — deduplicar no basta

CI39193444875 conserva el fallo WebKit: P95 referencia17/17/17ms, candidato22/22/22ms; Chromium16,7–16,8ms en ambos. La hipótesis de las tres escrituras redundantes no explica suficientemente la diferencia. No se aumenta el presupuesto ni se elimina el ensayo.

Siguiente ensayo acotado con fasewebkit original: contención CSS del host absoluto deCanvas, cuyo tamaño ya pertenece alstage. No cambia resolución, tamaño/visibilidad de figuras, datos ni reloj. Hipótesis: limitar invalidación/composición de la superficie; no se afirma causa GPU. Se registra además la geometría física/CSS deCanvas y el sink acotado de métricas CPU/wall existente para distinguir geometría, paint y submit. La instrumentación es idéntica para referencia/candidato, no CPU GPU pura. Si no mejora, conservar el resultado adverso y revisar la causa.
