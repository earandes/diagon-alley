# A70 · Rendimiento y límites de medida

## Método

Todas las mediciones gráficas A70 se ejecutan en CI Linux, en serie. No se ejecutó navegador, perfil, grabación o matriz gráfica local. El exportador de arte y este análisis de JSON trabajan por CPU y no arrancan el juego.

La acción autoritativa se mide desde antes de confirmar el jefe hasta dos puntos distintos: DOM utilizable y figuras listas. Incluye red, commit, consultas de estado, esperas de Playwright y aserciones; por eso se informa como **límite superior observado**, no como latencia exacta del primer frame. No se conserva un saldo antiguo para ocultar trabajo.

La fixture de presentación mide un documento nuevo hasta arte/overlay listo y una ventana sostenida de diez segundos. Resuelve su BattleLog durante el setup y prolonga estadísticas para observar fases. No es una medición de dificultad, duración humana o compra real. Documento nuevo tampoco equivale a borrar cachés del sistema, driver o runner.

Los intervalos rAF describen oportunidades de presentación; no son tiempos GPU. `actualPaints` confirma actividad propia. Los contadores de texturas y los ocho ciclos de montaje/desmontaje cubren recursos propiedad del renderer, no RSS, heap después de GC o ausencia global de fugas. WebKit sin Long Tasks API se registra como dato ausente, no como cero.

## Presupuestos y referencia

| Aspecto | Objetivo / referencia | Naturaleza |
| --- | --- | --- |
| Arte nuevo por pack | ≤100 kB comprimidos, ≤2 MiB RGBA8 geométricos | Presupuesto previo A70 |
| Arte producido Diagon | 11.458 B / 83.712 B | Medido en archivos; sin overhead de textura/proceso |
| Arte producido ARCANA | 1.666 B / 4.484 B | Medido en archivos; sin overhead de textura/proceso |
| Reproducción sostenida | P95 de intervalos rAF ≤20 ms en ventana comparable | Objetivo de ensayo, no garantía de dispositivo |
| Pausa / ocultación | Fase y pose estables; sin paints continuos innecesarios | Aserciones del reloj y renderer propios |
| Omisión / fallo | Resultado, acciones y registro disponibles sin esperar al arte | Criterio funcional; no se presenta como tiempo GPU |
| Desmontaje | Canvas retirado y texturas propias a cero | Criterio acotado de propiedad, no memoria global |

La [referencia A69](../motion-audit-2026-10-16/PERFORMANCE.md) obtuvo navegación→figuras de 477–563 ms en Chromium y 335–642 ms en WebKit (tres contextos por motor), y una ventana sostenida Chromium con P95≈16,7 ms. También registró picos de arranque hasta167/392 ms y variación entre ejecuciones. A70 utiliza otras formaciones y piezas: no se calcula un porcentaje causal de mejora o regresión comparando esas fixtures diferentes. Los picos no se atribuyen a import, shader, decode o GPU sin aislamiento adicional.

## Resultados del candidato

[CI38977202497](https://github.com/earandes/diagon-alley/actions/runs/38977202497), candidato `0189d3a`, merge ensayado `024e88dd21fbb6274a3756133d80043f49014f81`. El job completo terminó correctamente; ello acredita sus pruebas funcionales, no el cumplimiento universal de presupuestos. Comandos y omisiones se registran enQA. [Resumen reproducible](evidence/summary.json),67fichas JSON originales en `evidence/linux/`.

| Medida | Chromium | WebKit |
| --- | --- | --- |
| Confirmar jefe → DOM utilizable, límite superior |543–881ms, n=12 |534–1991ms, n=12 |
| Confirmar jefe → figuras listas, límite superior |545–906ms, n=12 |536–3620ms, n=12 |
| Fixture documento nuevo → arte listo, límite superior |451–767ms, n=9 |414–1668ms, n=9 |
| Texturas propias estimadas, perfiles3/4/5 |4.206.980–7.008.644B |4.206.980–7.008.644B |

Ventana sostenida independiente, Chromium1280×900: diez segundos,593intervalos rAF, P50≈16,7ms, P95≈16,8ms, máximo≈33,4ms,568paints propios, sin Long Tasks en esa ventana. El objetivo P95≤20ms se cumple **en esta muestra**, sin promesa universal de60FPS. Ocho ciclos seriales mantuvieron5.938.752B propios durante cada montaje y comprobaron Canvas retirado/texturas a cero al destruir. Las aserciones de pausa/ocultación, omisión y retorno de las piezas al reposo pasaron.

Arranque de esa misma fixture: límite superior684ms,14intervalos observados, P95≈100ms, máximo233,3ms y Long Tasks de58/86/172ms. Persisten picos de arranque por encima de50ms; no se dan por resueltos ni se atribuyen a una causa única. Las fichas de cada perfil conservan sus propias ventanas de arranque. WebKit no expone Long Tasks en este entorno. No se interpreta ausencia de API como ausencia de bloqueo.

Observación separada de imágenes en esa única fixture Chromium, hasta10.740,5ms de documento:11recursos de red con P50≈20,8ms, P95≈31,3ms y máximo31,4ms;12promesas originales de `decode()` con P50≈117,8ms, P95≈199,2ms y máximo200,7ms. Una imagen inline no tiene transferencia inferida. En11promesas enlazables a recursos, la porción dentro de la llamada posterior a respuesta tiene P50≈117,8ms, P95≈139,4ms y máximo191,9ms. Se calcula `finDecode − max(inicioDecode, finRespuesta)`: una figura puede haberse descargado antes de que Pixi invoque decode, y ese intervalo anterior no se cuenta como espera del decoder.

Los intervalos se solapan; no se suman como costes independientes. Promesas y cola del hilo, decodificación, coordinación y la propia instrumentación pueden intervenir. No son tiempos puros de CPU de decoder, subida de textura o GPU. El wrapper llama al método original inmediatamente, conserva errores y se restaura al terminar; límites128registros, sin perfil continuo ni textura adicional. Los casos conocidos de solapamiento, recurso previamente descargado e inline ausente se comprobaron en el resumidor sin navegador.

La [iteración2536b25](evidence/iteration-2536b25/summary.json), con el mismo renderer y otra composición de cabecera, midió una ventana cálida con P95≈16,8ms y pico33,4ms, y arranque con pico233,3ms. Esa variabilidad refuerza el límite de atribución: no se anuncia mejora porcentual por compactarCSS ni por añadir el objeto. El pipelineA67 también compara su fixture anterior/actual bajo condiciones controladas, pero no sustituye la atribución específica de coste A70 o el dispositivo real.

## Regresión comparable A69: resultado desfavorable conservado

La misma CI ejecutó la suiteA69 sin cambiar sus fixtures, tamaños o guion respecto a la referencia. [Resumen](evidence/a69-regression-summary.json),200JSON originales en `evidence/a69-regression/`. No es la fixture del jefe y tampoco se ejecuta en el mismo host físico que la CI histórica.

| Medida A69 | Referencia documentada | CI actual |
| --- | --- | --- |
| Documento nuevo → figuras, Chromium n=3 |477–563ms |564–681ms |
| Documento nuevo → figuras, WebKit n=3 |335–642ms |466–521ms |
| Apertura confirmada → resultado, Chromium n=48 |2819–3350ms |2835–3360ms |
| Apertura confirmada → resultado, WebKit n=48 |2466–3428ms |2564–3572ms |
| Omitir apertura → resultado, Chromium n=36 |6,9–29,8ms |8,3–56,5ms |
| Omitir apertura → resultado, WebKit n=36 |12–35ms |17–37ms |
| Arena genérica sostenida Chromium10s |P95≈16,7ms |P95≈33,4ms;504intervalos,477paints |

**El objetivo sostenido≤20ms no se cumple en esta muestra genérica.** No hubo Long Tasks en esa ventana; el arranque sí conserva picos, hasta216,6ms de intervalo enChromium y141ms enWebKit. Treinta ciclos conservaron3.513.024B propios y limpieza comprobada. No se oculta el resultado desfavorable ni se presenta el16,8ms del jefe como sustituto.

A69 ya documentó ventanas≈33,4/16,8ms con el mismo código anterior. En esta corrida también crecen algunos límites de carga/omisión; no se atribuyen automáticamente a una causa o se descartan como irrelevantes. Hace falta una comparación controlada repetida del mismo arranque y renderer, con separación de setup/import/decode/paint, antes de explicar la diferencia. Esta incertidumbre y el dispositivo físico permanecen como límites de rendimiento; no son un fallo de reglas, resultado o limpieza observado. No se añade un retraso para cambiar dónde se contabiliza la espera.

Para reproducir este segundo resumen sin navegador:

```sh
node docs/arcana/motion-audit-2026-10-16/summarize.mjs docs/arcana/boss-increment-2026-10-16/evidence/a69-regression
```

## Reproducción del análisis

La comparación A67 conserva además dos muestras seriales de nueve acciones de Pacto/taller: [baseline](evidence/a67-baseline.json) y [actual](evidence/a67-current.json). Apertura fría utilizable86,1/98ms y confirmar237,3/234ms respectivamente; el arranque sigue registrando Long Tasks. No es una comparación del jefe, una distribución de usuarios o una prueba causal de mejora. Los valores se conservan con sus costes de red/consulta y asentamiento, sin desplazar esperas entre pantallas.

Después de descargar la evidencia, sin iniciar navegador:

```sh
node docs/arcana/boss-increment-2026-10-16/summarize.mjs docs/arcana/boss-increment-2026-10-16/evidence/linux
```

El resumen conserva motores, ventanas y límites de cobertura por separado. No combina percentiles de ventanas diferentes. Quedan pendientes dispositivo físico, condiciones de red móvil y atribución de los picos de arranque; la percepción de respuesta y personalidad requiere la sesión humana.
