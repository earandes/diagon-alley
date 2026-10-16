# A60 · Regresión de los recorridos históricos

15 octubre 2026. Pruebas técnicas en contextos nuevos y namespaces de prueba, sin operar la partida del propietario en 5194. No son sesiones con usuarios ni prueba en móvil físico.

## Línea base y adaptaciones

`ARCANA_TRIAL_TEST_PORT_BASE=5290 npm run test:e2e -- --list` conserva **76 casos distintos en diez archivos**. Se excluyen las suites nuevas A59/A60 (annotation-experience, shop-journey, commerce-a60, pokelike-experience), que se ejecutan por sus propias configuraciones. Puertos propios 5290/5293/5292/5294, guard real de sesiones conservado y namespaces aleatorios por ejecución. No hay bypass de rate-limit.

Antes de adaptar los recorridos se ejecutó la muestra de forja/comercio ES/EN en Chromium. Los dos casos fallaron al esperar `Varita para copia 1` sin abrir el nuevo inspector explícito: contrato de interacción obsoleto, no fallo de guardado. Dos casos posteriores no corrieron por `--max-failures=2`; el runner reportó detención anticipada. [Log original](initial.txt). Se preservan textos fuente previos como `.ts.txt` y hashes; no se suman esos intentos al resultado final.

Cambios de pruebas, sin modificar producción:

- `game-fixture`: inspeccionar una copia mediante `[data-preparation-inspect]` y cerrar inspector/preparación como dos niveles; elegir el roster sigue siendo una acción separada.
- `route-helpers`: Reclutar resuelve el Pacto cuando hay botón directo. Para equipo lleno permanece selección/reemplazo o Pasar, seguida de confirmación. Los demás nodos usan `.node-confirm-action`, que conserva semántica y ahora muestra la acción concreta del evento.
- Recorridos de forja/equipo, idiomas y Grageas abren la ficha real y mantienen las comprobaciones de equipamiento persistido, cancelación, consumo y asignación.
- Recorridos de ranas usan `Comprar y abrir 1 · 10 Coronas` como una operación atómica y esperan el mismo resultado confirmado mediante el receipt nuevo `buy-open-toad`. Se elimina el segundo clic Abrir de la compra nueva; las unidades ganadas siguen cubiertas por las suites nuevas. El caso sin GSAP espera dos receipts (kit + compra/apertura), en lugar de tres (kit + compra + apertura).
- Feedback A52 de compra se verifica con Grageas, que conserva el comando `purchase`: rechazo sin feedback optimista, éxito ligado al receipt, anuncio único, idioma/reducido/persistencia se mantienen.
- Cero saldo ahora realiza cinco compras/aperturas explícitas, verificando en cada paso coste de diez, unidad consumida y copia adicional; al llegar a cero la compra se deshabilita y recarga conserva todo. No se espera inventario pendiente de abrir cuando el nuevo contrato abre inmediatamente.
- Rechazo de rana intercepta el endpoint real `/api/toads/buy-open`. Los límites de cero gasto/entrega y ausencia de sincronización atascada permanecen.
- Capturas y geometrías A56 se escriben en esta carpeta A60 para conservar evidencia histórica A57.

## Resultado

**76 casos distintos correctos por cobertura consolidada**, no una única corrida 76/76:

| Ejecución | Resultado | Evidencia |
|---|---|---|
| Muestra inicial sin adaptar | 2 fallidos, 2 no ejecutados por límite | [initial.txt](initial.txt) |
| Completa tras primera adaptación | 62 correctos / 14 fallidos · 5,8 min | [adapted-first.txt](adapted-first.txt) |
| Tres archivos corregidos, ambos motores | 20 correctos / 0 fallidos · 1,5 min | [adapted-focused.txt](adapted-focused.txt) |

Los 14 fallos completos fueron exclusivamente expectativas pendientes de adaptación: ocho A52 que debían reelegir Grageas tras Actualizar estado (el mostrador se remonta con rana elegida) y seis recorridos que buscaban `open-toad` cuando la compra/apertura nueva devuelve `buy-open-toad`. Se corrigieron solo esas tres pruebas. Los 20 focales incluyen esos 14 casos y seis ya correctos: no se suman como 82 casos ni como nueva cobertura. [Identidades y deduplicación](coverage-summary.json); errores intermedios preservados en `first-error-contexts/`.

Se mantienen las aserciones de gastos, receipts, estado exacto tras recarga/cancelación, logs de combate, llaves, copia/stock, foco y accesibilidad. Los veinte casos de nodos fueron correctos en la ejecución completa, incluidos pérdida de respuesta/recuperación, Refugio PV/PM, encuentros y cofres. Sin modificación de producción para adaptar la regresión.

Los contextos/browsers y los cuatro servidores propios terminaron al cerrar los 20 focales; se verificó ausencia de procesos Vite en 5290/5292/5293/5294. No se operó 5194 ni se ejecutó un build. El coordinador conserva la validación de fuente final/compiled y el fallback de contenido público antiguo sin planes; la API de esta regresión entrega planes reales.

El caso histórico de renderer registra actividad/dimensiones, pero su FPS durante esta regresión no es un benchmark serial de rendimiento. El coordinador ejecuta esa medición final por separado con build congelado y sin navegadores concurrentes.
