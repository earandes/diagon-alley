# A67 · Qué significa100% y cuánto puede durar

16 octubre2026. Cálculo sobre contenido real y escenarios reproducibles. **No se han medido tiempos humanos.** Los intervalos de actividad y calendario de este documento dependen de supuestos declarados; no son promesas de duración o retención.

## Cinco definiciones que no deben mezclarse

| Objetivo | Definición verificable hoy | ¿Finito y alcanzable? |
|---|---|---|
| Superar región | Ganar jefe de Pasaje/Callejón; cierre `won` confirmado | Sí. Bosque sigue futuro; desbloquear etiqueta no lo hace jugable |
| Dominar contenido actual | Ganar cuatro duelos estables y jefe; probar variantes/decisiones opcionales | IDs de victoria son verificables. No hay un logro global que registre cada elección o intención histórica; no inventar ese100% |
| Colección de personajes | Aprendiz garantizado +29identidades elegibles distintas =30/30 | Sí con probabilidad tendente a1; ninguna cantidad finita de ranas lo garantiza |
| Colección de sabores |4sabores desde activaciones confirmadas de gragea en combate | Sí con probabilidad tendente a1. Comprar/asignar no descubre; usar no garantiza nuevo |
| Equipo | Kit +9recetas forjables +botín obtenido de la única llave | Forjar las9cuesta180monedas. Poseer **todos los botines posibles** de bóveda no está garantizado ni es posible conseguir ambas ramas con la llave única actual |

No contar todas las combinaciones de copias/equipo, todas las versiones históricas de estadísticas, regiones futuras o todos los caminos aleatorios como un100% alcanzable. La UI puede mostrar30identidades y4sabores; no debe presentar un porcentaje global falso que incluya piezas incompatibles.

La bóveda tiene dos entradas peso1; una llave se entrega solo en primera victoria del jefe porlevelId+campaignVersion. Una rama da50monedas+2ranas+varita; otra75monedas+2grageas+escoba. Ganar de nuevo o escoger otro desafío no entrega otra llave. Con las reglas preservadas, la rama no obtenida puede quedar inaccesible para esa cuenta. Resolverlo requeriría una decisión económica posterior; no se añaden llaves o compensaciones ahora.

## Obtención y cola de duplicados

Catálogo30; aprendiz fuera de la tabla;29identidades con peso1. Probabilidad individual1/29=3,4483%, también para legendarios. La rareza actual no predice menor probabilidad por identidad. Grupos:7comunes,8inusuales,8épicos,6legendarios; el grupo legendario suma20,6897% porque tiene6identidades, no porque cada una tenga un peso distinto.

Para `n` resultados uniformes y `k` descubiertos, la siguiente apertura descubre con probabilidad `(n-k)/n`. El modelo exacto propaga `P(K_t=k)` mediante transición permanecer`k/n` y avanzar`(n-k)/n`. Esperanza para completar `n·H_n`. Comprobaciones conocidas:1identidad tarda1;2uniformes media3 y probabilidad completa a10 `1-2·(1/2)^10`.

| Hito sobre30, incluyendo aprendiz | Elegibles nuevas necesarias | Mediana exacta aperturas | P90 | P95 | P99 |
|---|---:|---:|---:|---:|---:|
|50% =15/30|14|18|22|24|26|
|75% =23/30, redondeo hacia arriba|22|39|48|52|58|
|90% =27/30|26|60|78|84|97|
|100% =30/30|29|108|161|181|228|

Media exacta114,887960 aperturas para todas.50.000simulaciones, semilla67016, dan media114,92102; mediana109 por ruido de MonteCarlo frente108exacto. Se prioriza cálculo exacto para cuantiles y no se presenta la diferencia de una apertura como ajuste de balance.

Al completar, los duplicados son aperturas−29: mediana exacta79, P90132 y P95152. No todos esos duplicados son inútiles: caben en formación/equipamiento distinto; su utilidad marginal cae mucho más allá de5miembros. No hay conversión, venta, pity o fusión implementados.

| Tras aperturas | P(exacta de tener toda la colección) | P(exacta de seguir sin una identidad concreta) |
|---|---:|---:|
|40|0,0006886%|24,57%|
|80|13,5893%|6,04%|
|100|39,3917%|2,99%|
|120|63,9478%|1,48%|
|160|89,8620%|0,36%|
|181|95,0392%|0,17%|
|200|97,4285%|0,0896%|
|300|99,9223%|0,00267%|

La probabilidad de faltar una identidad concreta es `(28/29)^t`; no es la probabilidad de faltar **alguna**, porque pueden faltar identidades diferentes. Esperar la última concreta tiene distribución geométrica y media29aperturas más, sin techo. La investigación no convierte esta cola en “dificultad”.

## Sabores

Cuatro resultados uniformes. Media exacta8,333activaciones; mediana7, P9013, P9516, P9921. Tras10activaciones la probabilidad de4/4 es78,06%, tras20es98,73%. Con una gragea consumida por batalla equivalen a7/13/16batallas en esos cuantiles; asignar varias por batalla reduce batallas y conserva el mismo número de activaciones. Hay máximo una por unidad viva asignable y3–5miembros por combate. Ninguna identidad rara es necesaria.

No se convierte automáticamente ese número en días: las grageas pueden proceder de cofres/primeras victorias/bóveda o comprarse a5, y sus efectos cambian supervivencia. El modelo de rutas sí compara ausencia/uso de una gragea ganada, pero no ejecuta una política adaptativa hasta4sabores; no atribuirle un tiempo humano exacto de esa completitud.

## Fuentes, sumideros y oportunidades actuales

| Recurso | Fuente | Gasto / limitación |
|---|---|---|
|Monedas|50kit;20/50primer duelo/jefe;2/5repetidos;10cofre; encuentro histórico10 con1/3; bóveda50/75|Rana10, gragea5, forja15/20/25|
|Ranas|Compra, primerjefe1, una rama de bóveda2|Una copia permanente aleatoria por apertura; rana poseída no vuelve a cobrarse|
|Grageas|Compra, primerduelo1, cofre1, otra rama de bóveda2|Asignar no consume; comando confirmado de combate consume y guarda efecto/sabor|
|Llave|Primerjefe1|Una bóveda, sin regeneración ni repetición por desafío|
|Energía|50capacidad, +1cada12min de autoridad|5por combate gane/pierda/empate; no por comprar o eventos|
|HP/PM|Preparación inicial, refugio40%, encuentros y efectos|Condición acumulada en run, se conserva en reservas; no confundirPM con energía|
|Equipo/copia|Kit, apertura, forja o bóveda|Permanente, exclusivo por instancia de equipo, no se gasta al combatir|

Los nuevos encuentros de intercambioHP/PM no añaden moneda. La dificultad cambia ingresos indirectamente por derrotas. El cofre repetido sigue dando10+gragea y un duelo repetido2: la ruta segura puede seguir siendo mejor para colección. Esto queda como límite de balance conservado, no como una compensación automática.

## Modelo de financiación y tiempo

`tools/arcana/a67-completion.py` utiliza el banco reproducible del motor:128semillas,1171caminos por fila. Escoge caminos uniformemente y mantiene una formación/política fija por cohorte. La cohorte inicial conserva aprendiz+Pactos aunque adquiera copias nuevas: es una conducta declarada, no un jugador adaptativo óptimo. Intermedia y amplia parten de esas colecciones ya obtenidas; sus costes previos se excluyen y no se presentan como tiempo desde cuenta nueva.

Por trayectoria conserva saldo y derechos de primera victoria de cuatro duelos+jefe, incluidos intentos perdidos; paga bonificaciones iniciales una sola vez y redime como máximo una llave. Abre ranas a10 cuando alcanza saldo; las regaladas se abren sin precio. No se suman monedas hipotéticas si se pierde. Se comparan cesta de colección, una forja25 y gasto5/intento. Las dos últimas son coste de oportunidad: no atribuyen al equipo/gragea un beneficio que no se haya aplicado a ese banco de combates.

5.000trayectorias por celda, flujos RNG separados y emparejados por índice de muestra para rutas, cartas y bóveda. Cada cohorte de colección considera sus identidades ya conocidas; compras iniciales con50monedas. El azar de bóveda no cambia los números aleatorios de cartas. No se vuelve a dar una llave al cambiar de desafío.

Supuestos de tiempo, **no observados**:

- Cada evento realmente visitado:20–45s para leer/decidir/actuar.
- Cada combate reproducido:30–90s; omitirlo produce otro ritmo.
- Cierre, retorno y compras por intento:45–120s.
- Cada apertura:3–10s.

Se incluyen eventos hasta la derrota, no7eventos completos en todos los intentos. No son tiempos de automatización. El modelo de calendario reproduce cap50, puntos enteros cada12min, pérdida de regeneración al estar lleno y5por combate. Dos o cinco intentos por visita diaria; si falta energía dentro de esa visita, espera allí. No presume regeneración ilimitada durante la noche. La cota energética `(energíaGastada−50)·12min` se muestra separada de calendario y no se suma de nuevo a las horas activas.

| Perfil / colección de partida | Intentos mediana /P90 /P95 | Horas activas supuestas, mediana rango | Días a2intentos/visita diaria, mediana/P90 | Días a5intentos/visita diaria, mediana/P90 |
|---|---:|---:|---:|---:|
| baseline/initial | 58/95/109 | 4.0–10.3 | 29/48 | 12/19 |
| discovery/initial | 57/94/108 | 4.1–10.3 | 29/47 | 12/19 |
| tactical/initial | 67/111/126 | 4.7–11.8 | 34/56 | 14/23 |
| mastery/intermediate | 65/109/124 | 4.7–12.0 | 33/55 | 13/22 |
| mastery/broad | 61/104/118 | 4.4–11.3 | 31/52 | 13/21 |

La fila inicial parte de cuenta nueva; intermedia/amplia son **tiempo restante desde esa colección**, con costes históricos excluidos. No comparar esas filas como ventaja gratuita. Todos los escenarios consumen solo dinero obtenido y admiten derrotas. No hay censura a1500intentos en las celdas ejecutadas.

| Primera victoria de región / cohorte | Intentos mediana/P90 | Minutos activos acumulados mediana bajo los dos ritmos |
|---|---:|---:|
| discovery/initial | 1/2 | 4.1–10.2 |
| tactical/initial | 2/7 | 8.7–22.0 |
| mastery/intermediate | 3/10 | 13.2–33.8 |
| mastery/broad | 2/7 | 9.2–23.5 |

Estos tiempos son de ruta y cierre hasta primera victoria, incluyen intentos perdidos previos cuando los hay y excluyen aperturas orientadas a otra meta. La tabla de colección sí incluye aperturas y compras. No se suma como actividad la espera de energía o los días entre visitas. Una primera ruta ganada suele ser corta bajo estos supuestos; la colección completa tiene otra escala.

| Sensibilidad nueva cuenta/Discovery | Intentos mediana/P90 | Horas activas supuestas, mediana rango |
|---|---:|---:|
| collection-only | 57/94 | 4.1–10.3 |
| forge-once-25 | 59/96 | 4.2–10.6 |
| bean-each-attempt | 86/143 | 6.0–15.3 |

La cesta5/intento aparta dinero; no simula que una gragea mejore siempre el combate. La matriz del motor estudia aparte grageas reales con sus resultados favorables/adversos. Una forja25 retrasa compras por ese coste de oportunidad; no se atribuye potencia nueva sin modelarla.

Ejemplo de espera separada: Discovery inicial/colección consume mediana635energía (P901050). A2intentos/visita diaria no aparece espera de energía en esas celdas; a5intentos en una sola visita la mediana acumula unas12,1h de espera energética durante toda la trayectoria, aunque el calendario mediano baje a12días. No son12días de sesiones breves: requiere esperar dentro de algunas visitas. Repartir visitas es otro supuesto. La cota energética continua es mediana7020min≈4,9días desde lleno; no es una duración activa ni el calendario a2visitas.

Caso adverso adicional: Maestría con kit fijo no gana la región bajo la política modelada, pero aún puede financiar30/30 mediante cofres y compras: mediana93intentos,P90146. Ese dato es importante: **colección completa no demuestra dominio del combate**. Su primera victoria queda`null`, sin inventar un tiempo o descartar las trayectorias desfavorables. El estudio incluye36celdas financieras ×5000=180.000trayectorias; todas terminan colección antes de1500intentos en la muestra, lo que no elimina la cola teórica.

Resultados completos en `evidence/completion-model.json`. Son sensibilidades, no pronósticos personales.

## Qué haría y qué no cambiaría

**Conservar:** colección pequeña inicial y apertura que puede dar variedad sin convertir rareza en fuerza; rutas cortas; equipo permanente y temporales; mismas cantidades económicas y acceso. **Cambiar primero:** introducir decisiones horizontales de equipo/encuentros y dificultad voluntaria anticipada. Esto aumenta planes sin añadir espera.

**No aumentar duración mediante:** pesos más bajos, precios mayores, enemigos conPVmultiplicados, XPobligatoria o repetir para pagar el derecho a jugar. Las colas actuales ya generan bastante repetición de colección. **Decisión económica posterior concreta:** significado de rareza, utilidad segura de excedentes y accesibilidad de botines de bóveda restantes; comparar antes de autorizar cualquier nueva regla. No se elige ratio de canje o pity en este incremento.

## Límites y medición posterior

La elección humana de rutas/equipo, reintentos voluntarios, lectura de cartas, omisión, reservas y compras puede desplazar mucho los tiempos. No hay una cifra universal de100%. Medir primera victoria, tiempo de decisión, combates por sesión, uso de omisión, frecuencia de cofres frente a duelos, gasto real, variedad de formación y reacción al duplicado. Una sesión corta puede descubrir problemas de comprensión; semanas de calendario/retención no se validan con un recorrido técnico.
