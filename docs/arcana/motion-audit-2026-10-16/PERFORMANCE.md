# Rendimiento medido y límites

CI Linux [38959694470](https://github.com/earandes/diagon-alley/actions/runs/38959694470), head `6910a48`, árbol de merge ensayado `10d2657e19b251b3c9b8c64f45bc3a30efc3c148`. Chromium y WebKit, un worker, media automática desactivada. Fixtures declaradas con componentes reales; no dispositivo físico ni observación humana. Los tiempos siguientes no incluyen una compra autoritativa: la apertura empieza desde un recibo ya confirmado.

## Última muestra

| Medida | Chromium | WebKit |
| --- | --- | --- |
| Navegación → figuras de arena listas, primer contexto de cada tamaño | 477–563 ms, n=3 | 335–642 ms, n=3 |
| Navegación → botón de apertura listo, primer contexto de cada tamaño | 100–125 ms, n=3 | 101–110 ms, n=3 |
| Acción → resultado nuevo utilizable, cuatro rarezas/packs/idiomas | 2819–3350 ms, n=48 | 2466–3428 ms, n=48 |
| Omitir → resultado utilizable | 6,9–29,8 ms, n=36 | 12–35 ms, n=36 |
| Máximo estimado de texturas propias de arena | 7.004.160 bytes | 7.004.160 bytes |

Son rangos de esta matriz, no distribuciones de jugadores. Solo la primera navegación de cada contexto recién creado se marca como fría. Las siguientes pueden reutilizar caché; tampoco se vacía la caché del sistema/driver. La fixture calcula su BattleLog durante el setup: sus medidas de arranque no aíslan ese coste del renderer ni describen el arranque completo de una cuenta de producción.

Muestra sostenida independiente: Chromium 1280×900, diez segundos, 601 intervalos rAF, P50≈16,7 ms, P95≈16,7 ms, pico≈16,8 ms, **574 paints propios**. No hubo Long Tasks en esa ventana. El conteo de paints acredita actividad, pero los intervalos rAF no son un perfil GPU ni una serie de tiempos individuales de `app.render`; no se anuncian 60 FPS garantizados.

Treinta ciclos consecutivos de montar/desmontar conservaron 3.513.024 bytes estimados durante cada montaje de la fixture 3×3. El test exige Canvas retirado y texturas propias a cero al destruir. No mide RSS del proceso GPU, heap post-GC o ausencia global de fugas.

## Objetivos que no se dan por resueltos

El arranque muestra picos superiores al presupuesto de frame de 50 ms: hasta 167 ms de intervalo en Chromium y 392 ms en WebKit en las primeras arenas. Chromium registra Long Tasks de carga, con un máximo de138ms entre los registros de documento; WebKit no expone esa API, por lo que no se informa cero. Los datos completos permanecen en JSON. No se ha aislado qué parte corresponde a setup de fixture, import, shader, decode o pintura.

El objetivo inicial P95≤20 ms se cumple en **esta ventana sostenida**, pero dos ejecuciones previas con el mismo código del renderer dieron aproximadamente33,4y16,8ms ([muestra previa](evidence/iteration-30fe1ba/summary.json)). La variabilidad del runner y el calentamiento impiden atribuir toda la diferencia a una corrección o afirmar estabilidad universal. Eliminar el paint duplicado es una corrección comprobable de implementación, no una prueba causal de mejora porcentual de FPS.

Quedan por medir CPU atribuible ≤2 ms/frame, memoria GPU total, carga bajo red móvil, arranque de compra con autoridad y comportamiento físico. No se desplaza ese coste a otra pantalla ni se convierte un presupuesto aspiracional en resultado medido. Se conserva DOM usable durante la carga y fallback ante fallo de renderer. Antes de otra biblioteca, conviene una muestra comparativa aislada del mismo arranque y un dispositivo real.

## Reproducción sin navegador

Después de descargar el artifact, ejecutar:

```sh
node docs/arcana/motion-audit-2026-10-16/summarize.mjs docs/arcana/motion-audit-2026-10-16/evidence/linux
```

El script solo lee JSON; no inicia procesos gráficos. [Resumen reproducible](evidence/summary.json). No combina percentiles de ventanas diferentes como si fueran una única muestra. Los presupuestos originales y controles están en [VALIDATION](VALIDATION.md).
