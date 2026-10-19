# Rendimiento y límites · A89

## Medido localmente sin gráficos

PM14 aísla el crecimiento de receipts con0/100/1.000/5.000 operaciones ficticias,3observaciones por escala y versión. PostgreSQL real, agregado de colección constante y mismo servicio. Mediana de comando con5.000:1.544,34→22,88ms;5.027–5.029→26consultas. No se afirma reducción universal del coste de lectura: carga/validación siguen leyendo historial completo. El estado de esa fixture pesa≈544KB y no representa5.000combates con todos sus logs. Extremos desfavorables y deltas de heap completos conservados en JSON; no demuestran memoria residente o ausencia de fugas. [Diagnóstico](PM01-PM14.md).

Build final local previo a la PR: principal1.160,01kB/gzip355,48kB, Pixi269,91kB/gzip83,72kB. Advertencia de chunk>500KB conservada; no es una medición de primera pantalla utilizable ni se confunde bundle completo con transferencia efectiva. No dependencias, texturas o audio nuevos. La envoltura de preferencias y las proyecciones se ejecutan sobre estado ya disponible; no añaden una consulta SQL por render.

## Comprobación gráfica

Pendiente CI sobre el candidato real. Se preparan cuatro observaciones de respuesta de fixtures, desde antes de activación hasta aserción de estado utilizable, incluyendo protocolo/autowait. No son latencias puras del producto o tiempos humanos y no controlan todas las cachés. El JSON conserva campos de navegación/recursos existentes; ninguna entrada se interpreta como tiempoGPU oCPU de decodificación.

La suite de regresión existente compara arena con la referencia A73 bajo sus propias condiciones/fixtures. Este incremento no modifica Pixi, el reloj ni exporta assets: sus objetos se contrastan con baseline; no se atribuirá una mejora de render a esta identidad de archivos. Se registrarán también resultados adversos. Objetivo de ensayoP95rAF≤20ms conservado, sin afirmarlo cumplido universalmente ni ocultar los20–24msWebKit históricos. No vídeo/perfil/capturas extensas en Mac.

Una captura acredita composición, no fluidez. Contadores de recursos propios no demuestran ausencia global de fugas. Las medidas CI no acreditan móvil físico. Los resultados de ejecución, su SHA y la procedencia de las cinco capturas se añaden tras descargar la evidencia.
