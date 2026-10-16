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

Pendientes de la ejecución completa del candidato `2536b25` en CI38974420825. Esta sección debe sustituirse con el artifact real antes de cerrar el goal; los presupuestos de arriba no acreditan resultados.

## Reproducción del análisis

Después de descargar la evidencia, sin iniciar navegador:

```sh
node docs/arcana/boss-increment-2026-10-16/summarize.mjs docs/arcana/boss-increment-2026-10-16/evidence/linux
```

El resumen conserva motores, ventanas y límites de cobertura por separado. No combina percentiles de ventanas diferentes. Quedan pendientes dispositivo físico, condiciones de red móvil y atribución de los picos de arranque; la percepción de respuesta y personalidad requiere la sesión humana.
