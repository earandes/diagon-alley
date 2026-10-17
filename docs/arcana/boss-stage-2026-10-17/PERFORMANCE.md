# A71 · Rendimiento y propiedad de recursos

## Método y comparabilidad

La medición se ejecuta exclusivamente en CI Linux, en serie y con las protecciones originales. No navegador, perfil, vídeo ni captura del Mac. La muestra utiliza la misma fixture A70 mastery, seed70, formación5×5 y estadísticas de jugador prolongadas para observar el replay; no demuestra dificultad o duración humana. Los recorridos reales utilizan cuentas de ensayo aisladas y PostgreSQL/Redis, sin cuenta habitual.

Confirmar→DOM utilizable y confirmar→figuras listas son límites superiores desde antes del click, incluyendo red, commit y esperas/aserciones. No se conserva saldo antiguo ni se traslada carga a otra pantalla para fabricar mejora. Documento nuevo→arte listo incluye import, scheduling y decode; no es caché de sistema fría garantizada. La ventana cálida dura10s y conserva paints reales propios. Percentiles por ventana, sin mezclar motores: `sorted[floor((n−1)×q)]`, igual al resumidor histórico A70.

Las promesas originales de `decode()` se invocan inmediatamente; sus tiempos pueden incluir red y cola del hilo, no son CPU pura ni subida GPU. Los registros decode son acumulativos: su máximo en la lectura cálida puede proceder del arranque. Intervalos rAF no son tiempos GPU. Memoria RGBA estimada a partir de dimensiones no es memoria residente del proceso/GPU. Caché de sistema y carga del runner no están controladas; una muestra no prueba mejora causal ni una distribución estable.

## Presupuestos y aceptación

| Aspecto | Criterio | Naturaleza |
| --- | --- | --- |
| Arte añadido por pack |≤200kB comprimidos | Presupuesto A71, medido en archivos |
| Capas por jefe |Base+brazo; estática conservada para fallback | Implementación, no nuevo renderer/filtro |
| Imágenes nuevas |384×512 RGBA; tres por pack |2,25MiB geométricos por pack antes de overhead/DOM |
| Ventana cálida comparable |P95 rAF≤20ms |Objetivo de ensayo, no garantía60FPS |
| Pausa/ocultación |Misma pose/fase; sin paints continuos de replay |Aserciones del reloj/renderer propios |
| Omisión/fallo |Resultado y acciones disponibles sin esperar recursos |Criterio funcional |
| Desmontaje |Canvas retirado, texturas propias0 y tickingfalse |Propiedad acotada, no prueba de fugas globales |

Los seis archivos nuevos suman269.284B (108.244Diagon/161.040ARCANA). La versión A70 añadía solo pequeños recortes; A71 cambia a un brazo pintado con frame común y fallback completo. No se oculta su coste mayor. Ni la compresión ni el recorte aparente reducen los bytes RGBA de un frame384×512 transparente.

## Resultado

[CI38988996115](https://github.com/earandes/diagon-alley/actions/runs/38988996115), candidato `445d6f4`, merge ensayado `ffb909467ae6ff1ca5ecaa5a2cad379c1c69ca89`. La batería del jefe terminó correctamente. El job completo y sus regresiones terminaron correctamente; comandos/cobertura enQA. [43fichas A71](evidence/linux/) y [resumen reproducible](evidence/summary.json); [67fichas de regresión A70 actuales](evidence/a70-regression/) y [su resumen](evidence/a70-summary.json).

| Medida comparable de fixture5×5 Chromium1280 |A70 histórico |A71 |
| --- | --- | --- |
| Documento nuevo→lectura arte listo, límite superior |683,9ms |719,4ms |
| Arranque P95/máximo rAF |100/233,3ms |100/233,3ms |
| Long Tasks de arranque: cantidad/máximo |3/172ms |3/175ms |
| Máximo acumulado de promesa decode |200,7ms |207,8ms |
| Ventana10s: muestras / paints propios |593/568 |593/571 |
| Ventana10s: P95/máximo rAF |16,8/33,4ms |16,8/33,4ms |
| Long Tasks en ventana cálida |0 |0 |
| Texturas propias estimadas al montar |5.938.752B |7.628.832B |

El objetivo P95≤20ms se cumple en esta muestra. Los picos de arranque **siguen presentes**; no se dan por resueltos ni se atribuyen a GPU, decode o una biblioteca concreta. La diferencia de35,5ms de arranque no es una regresión causal probada con un solo runner. El incremento geométrico de texturas propias es1.690.080B por la nueva base/brazo/compuesto. No es RAM/GPU global medida.

A71 omitir→resultado: límite superior86ms en esta muestra; pausa mantuvo pose/contador, desmontaje retiró Canvas y texturas propias. La regresión A70 actual ejecutó además ocho montajes/desmontajes, cada uno con7.628.832B propios y limpieza verificada. Su ventana cálida independiente obtuvo P95≈16,8ms y máximo33,4ms, sin Long Tasks,567paints. No se combinan las dos ventanas como si fuesen una distribución.

Recorridos A71 autoritativos (12por motor): confirmar→DOM utilizable590–845ms Chromium/560–961ms WebKit; confirmar→figuras592–867ms/565–1052ms. La regresión A70 conserva su guion más largo e instrumentación:537–929/535–1900ms hastaDOM y539–932/537–3727ms hastafiguras. Sus valores históricos eran543–881/534–1991 y545–906/536–3620ms. Hay dispersión y un límite superior WebKit>3s que no se oculta con los tiempos mejores del nuevo journey.

No se inventa mejora porcentual de rendimiento. La ventana del jefe no sustituye la regresión genérica A69, archivada con200JSON actuales y su resumen. WebKit sin Long Tasks API se trata como no disponible, no como ausencia de tareas largas.

### Regresión genérica A69: objetivo pendiente conservado

[Resumen A69 actual](evidence/a69-summary.json), [200JSON originales](evidence/a69-regression/), mismo guion que el documentado en A70. CI funcional correcta no implica cumplir cada presupuesto de ensayo.

| Medida |A70 documentado |Actual A71 |
| --- | --- | --- |
| Arena genérica10s P95/máximo rAF |33,4/≈33,4ms |33,4/33,4ms |
| Intervalos / paints |504/477 |522/493 |
| Long Tasks cálidas |0 |0 |
| Navegación→figuras Chromium, n=3 |564–681ms |552,6–669,5ms |
| Navegación→figuras WebKit, n=3 |466–521ms |457–500ms |
| Apertura confirmada→resultado Chromium, n=48 |2835–3360ms |2828,1–3353,3ms |
| Apertura confirmada→resultado WebKit, n=48 |2564–3572ms |2505–3566ms |
| Omitir apertura Chromium, n=36 |8,3–56,5ms |8–66,6ms |
| Omitir apertura WebKit, n=36 |17–37ms |16–46ms |

**El objetivo genérico cálido≤20ms sigue sin cumplirse en esta muestra**, como ya ocurría en A70. No se sustituye por16,8ms del jefe ni se declara resuelto. No se afirma una regresión causal nueva: el objetivo ya se incumplía en A70 y esta muestra, con variación conocida entre runners, no aísla el coste de un cambio concreto de presentación o de carga del entorno. El arranque genérico registró picos de hasta233,3ms Chromium/136ms WebKit. Treinta ciclos conservaron3.513.024B propios y limpieza verificada. Persisten investigación de scheduling/arranque y dispositivo físico; no se ha desplazado espera ni introducido un retraso para cambiar la métrica.

Reproducción del resumen, sin navegador ni renderer:

```sh
node docs/arcana/boss-stage-2026-10-17/summarize.mjs docs/arcana/boss-stage-2026-10-17/evidence/linux
```

Faltan dispositivo físico, red móvil, percepción humana del gesto/respuesta y atribución aislada de picos de arranque. No se da por hecho que una mejora compositiva elimine esos picos.

Las dos variantesA67 de nueve acciones conservan [baseline](evidence/a67-baseline.json) y [actual](evidence/a67-current.json). Son otra fixture, no benchmark del jefe ni duración humana. Sus pruebas terminaron correctamente en la mismaCI serial.
