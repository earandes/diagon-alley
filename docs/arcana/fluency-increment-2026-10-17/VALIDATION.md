# A73 · Validación y límites

## Ejecutado sin gráficos en Mac

- Tipos: correctos.
- Referencia:555unitarios/78archivos correctos.
- Candidato:560unitarios/80archivos correctos; incluye3casos de geometría (RED por módulo ausente antes de implementar, GREEN después) y2casos de invalidación agrupada/cancelación. Los dos últimos son pruebas suplementarias, no se inventa un RED retrospectivo.
-78integraciones con PostgreSQL/Redis reales,13archivos: correctas. Se reutilizan los servicios del proyecto, sin detener otros procesos ni alterar la cuenta habitual.
- Build, validación de ambos paquetes yscanner: correctos. Advertencia histórica de chunk>500kB conservada.
- Preflight local únicamente (`npm run test:browser:check`): permitido; no se lanzó el smoke ni otro navegador.

Logs en evidence/candidate-* ygeometry-red/green. Estos resultados no sustituyen las matricesLinux ni acreditan móvil físico.

## Referencia Linux

CI39026102712 sobre dcceff6: cancelada antes de fasegráfica para añadir el journey completo y corregir la composición declarada5×5. No se cuenta como una batería superada.

CI39026178568 sobre headd13c0d9, merge582bdc57a0e1675b21867b772363fd9ddc01ba3e: tipos/contenido555unitarios/78PGRedis/build/scanner correctos. FaseA70/A71/A73:103correctos y35omisiones explícitas de proyectos duplicados de rendimiento; incluye cuatrojourneys A73 yseisventanas. Cancelación deliberada después del artifact para no repetir regresiones que todavía no probaban la optimización. Laejecución global figura cancelada, no correcta. Procedencia enreference-ci.json yJSONoriginales; imágenes de esa fase no son evidencia del candidato optimizado.

## Candidato y matriz necesaria

Primer candidato40cc66d enCI39027491504: el primer journey completo terminó con trespageerrors `Illegal invocation`; fallo real del adaptador de callbacks, conservado enfailed-candidate-1/error-context.md. Se canceló el resto. Se corrige pasando cierres explícitos a requestAnimationFrame/cancelAnimationFrame, conservando su receptorWindow. No se relaja la comprobación de errores ni se declara resuelto por una repetición sin cambio. Tipos/build/scanner se repiten después de la corrección.

Pendiente nueva CI del candidato corregido: ES/EN, ambos paquetes,3viewports, figuras/PV completos, pausa/Auto/2x/inspector/ocultación/omisión, reducido/preferencia, idioma/pack, recarga/historia, arte/import/contexto fallidos, cancelación/foco, log/consumos/premios, preparación/jefe/cierre/tienda/intenciones/Halloween yPWA.

La matriz existente conserva sus casos; A73 añade medición de recorrido sin sustituirla. Guard, bloqueo entre procesos, watchdog, unworker, ceroretries y ausencia de grabación/trazas automáticas intactos. Capturas solo las seis seleccionadas deA71 bajo opt-inLinux.

## Pendientes humanos y físicos

Sesión breve posterior (no realizada): pedir iniciar unaexpedición, preparar un duelo, consultar un miembro y seguir hasta el jefe; observar si se percibe continuidad o espera sin explicar dónde mirar. Segunda hipótesis: la primera acción y sus consecuencias siguen legibles después de reducir paints. Preguntas neutrales sobre qué ocurrió/cuándo pudo actuar, sin afirmar personalidad, diversión o retención por un benchmark. Dispositivo físico, lector audible, red móvil y comportamiento GPU real pendientes.

## Candidato corregido9ff079c · CI39027727612

FaseA70/A71/A73 correcta; se recupera artifact para comparar. El target de rendimiento **no se cumple**: tres genéricosP95rAF33,3–33,4ms, aunque geometría92–99→0 ypaintsdearranque9–11→3–6. El arranque genérico469–531ms empeora frente345–399ms; jefe468–487ms mejora frente504–522ms. Son runners distintos: no se atribuye automáticamente regresión o mejora causal. Se conserva la comparación desfavorable. Se cancela el resto y no se integra. Siguiente ciclo: A/B en un mismo runner, documento nuevo y remount, para contrastar la variabilidad con condiciones comunes.
