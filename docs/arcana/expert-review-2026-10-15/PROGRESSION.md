# A62 · Progresión, economía y motivos para repetir

15 octubre 2026. **Diseño propuesto, sin cambios de reglas o partidas.** Esta revisión utiliza Game Design Workshop (decisión/consecuencia y bucles), Agency Game Designer/Economy Designer (fuentes y sumideros, valores como hipótesis) y el módulo local Game Design Skills Suite para escenarios. Sus defaults de monetización, diarios o umbrales no se adoptan: este producto no necesita pagos, otra moneda ni presión diaria para probar su bucle.

## Diagnóstico ejecutivo

La región ya permite preparar, explorar, reclutar, combatir, obtener recursos, abrir cromos, equiparse y volver. La carencia principal no es una pantalla más. Es la relación entre **decisión visible → cambio táctico → resultado legible → siguiente intención**.

Hechos inspeccionados:

- La variedad de ruta es real; la variedad de rivales y reclutas dentro de esa ruta es mínima.
- No existe XP: el nivel 1 es metadato fijo, no progreso ganado durante la run.
- Tres aliados de Alquimia activan curación pasiva; los pactos actuales ofrecen siempre esa afinidad.
- Cada copia tiene identidad, condición y equipamiento propios. Repetir personaje puede servir para formar un equipo y activar sinergias; no hay fusión, conversión o recompensa por excedente.
- La primera victoria por nodo/versión y la repetida pagan de forma distinta; el jefe solo entrega llave/rana en la primera. Cofres y encuentros no tienen esa reducción.
- Bosque puede quedar desbloqueado en progreso y seguir sin campaña jugable. No debe presentarse como un destino que ya se puede explorar.
- El cierre, el inventario y las recomendaciones no siempre utilizan la misma definición de “equipo suficiente”: Misiones mira identidades únicas, combate mira unidades/copias.

Fuentes: `src/arcana/application/run-use-cases.ts:257–365`, `src/arcana/infrastructure/content/trial-configuration.ts:44–80`, `src/arcana/domain/combat/synergies.ts:7–19`, `src/arcana/application/team-use-cases.ts:87–116`, `src/arcana/presentation/JourneyCabinet.tsx:25–74`.

**Interpretación experta:** antes de aumentar poder con XP, conviene demostrar que elegir formación, ruta, equipo y consumible cambia el plan. Añadir niveles sobre enemigos homogéneos puede hacer el juego más fácil y más largo sin hacerlo más interesante. Es una hipótesis contrastable, no un resultado con jugadores.

## Tres horizontes

| Escala | Decisión actual | Recompensa/consecuencia actual | Fricción o vacío | Diseño recomendado |
|---|---|---|---|---|
| Acción, segundos | Elegir destino y confirmar; reclutar; comprar/abrir | Unidad temporal, condición o inventario confirmado | El resultado se guarda, pero su uso siguiente puede quedar fuera del foco | Animación del objeto al destino real y acción contextual sobre ese objeto |
| Expedición, 7 eventos | Formar equipo, elegir ramas, refugio PV/PM, riesgo, grageas | Condición acumulada, sinergias, botín y jefe | Mismos reclutas y rivales; seguridad a menudo sin sacrificio visible | Hacer visibles las sinergias y consecuencias; después diseñar amenazas/ofertas distintas |
| Entre expediciones | Abrir, coleccionar copias, forjar, usar llave, repetir | Colección/equipamiento permanentes; primeras victorias registradas | Repetición da menos y casi no redefine objetivo; llave no se renueva en cada jefe | Cierre con recompensas usables y una intención real para otra formación; metas persistentes nuevas solo tras diseño |

La duración de 10–15 min es un objetivo de sesión humana futura, no una duración medida en esta revisión. Siete eventos pueden sentirse rápidos o vacíos según la calidad de sus decisiones; aumentar filas por sí solo no resuelve eso.

## Área A · Mejorar o especializar el equipo durante la ruta

### A0 · Hacer legibles los sistemas actuales — recomendada primero

**Qué cambia:** en preparación y antes de un duelo, un pequeño aro de afinidad alrededor de los puestos enseña cuántos faltan para activar una sinergia. Al consultar un aliado candidato, se previsualiza la composición antes/después; al asignar equipo, se previsualiza la magnitud que efectivamente cambia. Grageas muestran asignación y activación, separando efecto aleatorio del gesto de consumir.

**Decisión:** “¿este aliado completa mi combinación?”, “¿a quién conviene dar la escoba?” y “¿arriesgo una gragea aquí?”. **Beneficio esperado:** descubrir estrategia existente sin más texto o atributos permanentes. **Esfuerzo:** medio de presentación; bajo de arte si se reutilizan emblemas. **Riesgo:** enseñar demasiada aritmética; enseñar solo umbral activado y detalle bajo demanda. **Reglas nuevas:** ninguna, siempre que la previsualización use exactamente las reglas compartidas y no prometa un resultado de combate.

**Validación:** mostrar Alquimia 2→3 debe activar el mismo bono que el log guardado; retirar unidad debilitada no cuenta como activación; idioma/swap no envían comandos. La futura observación humana debe preguntar qué cambió, sin explicar el símbolo antes.

### A1 · Ofertas tácticas y rivales con contrajuego — siguiente diseño recomendado

**Qué cambia:** cada Pacto ofrece dos alternativas contrastadas y cada familia de duelo plantea una amenaza distinta. En una región basta un pequeño conjunto coherente de roles; no hacen falta 30 kits únicos inmediatamente.

**Ejemplo de hipótesis:** apoyo que sostiene al grupo frente a atacante que acelera una victoria; rival rápido y frágil frente a rival resistente que exige conservar PM. La afinidad y la silueta deben corresponder al comportamiento. No asignar esos roles fingiendo que el motor actual ya contiene habilidades especiales.

**Decisión:** elegir fuerza inmediata, sinergia o preparación para una amenaza futura. **Beneficio:** cada ruta construye una composición, no solo añade cuerpos. **Esfuerzo:** alto, contenido+contrato de oferta+versionado+balance. **Riesgos:** oferta que bloquea formación inicial, opciones dominadas, incapacidad de remontar. **Reglas nuevas:** sí; ofertas/resultados deben guardarse en autoridad, sin regeneración al consultar/recargar. Mantener acceso a tres miembros antes de combate y una opción viable cuando no se posee colección extensa.

**Validación de diseño posterior:** comparar varias políticas sobre los mismos seeds y composiciones; buscar al menos dos planes que cambien su preferencia según condición. No fijar un porcentaje de victoria objetivo sin definir público, dificultad y duración.

### A2 · Dos especializaciones temporales — alternativa frente a XP

**Qué cambia:** en un momento definido de la ruta, elegir uno de dos sellos que alteren una propiedad táctica hasta el final de la expedición; por ejemplo iniciativa frente a conservación de PM. No son monedas ni progresión persistente.

**Decisión:** comprometerse con un estilo, renunciar al otro. **Beneficio:** identidad de run sin curva numérica larga. **Esfuerzo:** alto; efectos, acumulación, reset y compatibilidad de replay. **Riesgo:** poder gratuito sobre una dificultad ya baja, nuevos iconos y tutorial. **Reglas nuevas:** sí; requiere versión, límites, resultados guardados y calibración. No aplicar valores de ejemplo como balance.

**XP temporal** queda como alternativa más costosa: especificar cómo se gana, cuánto sube, qué se reinicia y por qué una victoria dé poder frente a evitarla. No recomendar XP persistida que obligue a repetir para poder vencer contenido inicial.

## Área B · Duplicados: utilidad sin castigar la colección

### B0 · Copias con función, sin consumo — primero comunicar

Una copia puede pertenecer a la formación y portar varita/escoba distintas. Dos copias de la misma identidad no son un error ni una segunda identidad descubierta. El álbum debe contar identidades y copias por separado; preparación debe mostrar la instancia concreta.

**Decisión:** usar una copia como parte de una composición, mantener otra equipada/reserva o cambiar equipamiento. **Beneficio:** utilidad inmediata ya implementada. **Límite:** cuando sobran muchas copias y solo caben 5, equipar por separado deja de aportar suficiente valor. No anunciar “servirá más adelante” sin regla acordada.

**Problema comprobable:** `JourneyCabinet.tsx:27/64` usa `new Set(wizard.id).size<3` para orientar a comprar; con 3 copias de dos identidades puede existir una formación válida y aun así recomendarse otra compra. Propuesta: recomendación basada en el estado autoritativo relevante —copias disponibles, temporales, equipo actual— y colección única solo para el objetivo de colección. No vender el tercer personaje como condición inexistente.

### B1 · Canje voluntario de excedentes por una identidad faltante — preferida para prototipar después

**Entrada propuesta:** escoger 2/3/4 copias sobrantes elegibles; **salida:** una identidad pendiente elegida entre un conjunto definido, en vez de otro sorteo. No se implementa ni se selecciona ratio ahora.

**Decisión:** conservar profundidad de formación o acelerar completitud. **Ventaja:** cada duplicado puede contribuir a un objetivo claro sin introducir otra moneda. **Riesgos:** acelerar de forma extrema la colección, vaciar formación, consumir una copia equipada o convertir raridades baratas en cualquier pieza sin intención de diseño.

**Salvaguardas necesarias:** no consumir última copia por identidad; excluir copias en run/equipadas/reservadas o resolver explícitamente su tratamiento; vista previa de entradas/salida; cancelar conserva todo; tx única y receipt; key y tabla de destinos versionadas; nunca reconvertir datos históricos. “Proteger última copia” por sí solo no protege un equipo con duplicados. No importar automáticamente la propuesta I1 P06 como aprobación ARCANA.

**Complejidad:** alta de autoridad/UX/compatibilidad; media de assets. **Balance nuevo:** sí. Requiere elegir si importa rareza/familia y si puede alcanzar cualquier identidad. Los escenarios de abajo son deliberadamente permisivos y sirven como límite superior de aceleración.

### B2 · Duplicado como variante de especialización — alternativa sin sumar potencia

La instancia podría conservar una configuración táctica alternativa o desbloquear un acabado de álbum conocido, sin consumirla o con un intercambio explícito. **Beneficio:** preserva identidad/colección y ofrece expresión. **Riesgo:** variantes que solo cambian un número no justifican otra pantalla; una especialización exclusiva de duplicado puede castigar al jugador con pocas copias. **Balance/reglas nuevas:** sí cuando haya efecto; un simple marcador visual de copia ya puede hacerse sin efecto nuevo.

No se recomienda ahora fusión de estrellas/potencia, polvo automático, venta, pity o más rarezas: aumentarían sistemas antes de saber si el cuello de botella es comprensión o utilidad real.

## Área C · Objetivo después del jefe

### C0 · Recompensa→uso→nueva intención — recomendada para siguiente incremento

Usar el receipt y el inventario actuales para construir un cierre con una acción principal:

1. Llave disponible → bóveda; mostrar llave ganada y cerradura correspondiente.
2. Rana disponible → abrir la unidad ya obtenida, sin compra.
3. Nuevo equipo/cromo → inspección y preparación, sin autoseleccionar.
4. Sin recompensa pendiente → preparar otra expedición y mostrar qué se conserva.

Mantener salida a álbum/mapa y resumen consultable. El orden puede admitir elección entre llave/rana: la regla esencial es que cada objeto señale su uso. No ocultar una rana si el jugador prefiere abrirla antes de la bóveda.

**Beneficio:** cerrar un recorrido real y dar un motivo basado en lo ganado. **Riesgo:** una recomendación obsoleta después de consumir o desde una pestaña sin refrescar. **Reglas nuevas:** no; usar estado vigente y receipts sin ejecutar acciones automáticas. **Aceptación:** si ya se usó la llave, el siguiente CTA no ofrece abrir una bóveda gratis; la rana ganada no se compra otra vez; Bosque futuro no se vuelve interactivo; recarga recupera estado; repetición no anuncia otro botín de primera victoria.

### C1 · Objetivos personales de dominio, sin premio nuevo

Proponer “probar una composición distinta”, “descubrir un sabor pendiente” o “encontrar una identidad” solo cuando el juego permita intentarlo de verdad. El objetivo debería derivarse del estado; no exigir un personaje concreto no disponible. Puede comenzar como orientación/selección voluntaria, no como sistema de misiones con cobro pendiente.

**Beneficio:** repetir para experimentar, no solo para acumular moneda. **Esfuerzo:** medio. **Riesgo:** objetivo puramente cosmético si el desafío no cambia. **Reglas nuevas:** no para orientación, sí para almacenar metas/logros o dar premios.

### C2 · Desafíos de región con variantes — diseño posterior

Tras consolidar variedad táctica, una expedición con restricciones voluntarias o rival diferenciado puede ampliar vida de una sola región. **Beneficio:** relectura del contenido. **Esfuerzo/riesgo:** alto; no reciclar cuatro duelos iguales con un contador. **Reglas nuevas:** sí para condiciones, progreso/premios y dificultad. Nuevas regiones permanecen fuera de este incremento.

## Economía actual: fuentes, sumideros y huecos

| Recurso | Fuentes actuales | Consumo/transformación | Observación |
|---|---|---|---|
| Galeones/Coronas |50 delkit;20 duelo/50 jefeprimera;2/5 repetidos;10 cofre; encuentro 10 conpeso 1/3; bóveda 50/75 | Rana 10; gragea 5; forja 15/20/25 | Fuentes de cofre/encuentro no bajan al repetir; falta calibración global, no necesariamente subir precios |
| Energía/Esencia |50 máximo,1 cada 12 min con tiempo autoridad |5 porcombate, ganeopierda; no paga otros nodos |10 combates desde lleno; reponer una batalla desde 0 requiere 60 min. No confundirPM conenergía |
| Rana | Compra; primer jefe; bóveda en una rama | Apertura→una copia permanente; unidad consumida | Comprar+abrir es un comando atómico; una ganada abre sin recobro |
| Gragea | Compra; primerduelo; cofre; bóveda alternativa | Se asigna antes de combate y consume allí→sabor/efecto aleatorio | Comprar no descubre sabor; consultar/asignación cancelada no consume |
| Llave | Primer jefe por ID/versión | Bóveda consume 1 y entrega una rama de botín | No hay llave nueva en cada repetición del mismo jefe |
| Copias | Kit y aperturas | Se seleccionan/equipan, no se consumen hoy | No hay canje o compensación por excedentes |
| Equipo | Kit; forja; bóveda | Portador exclusivo por instancia; transferible | No degradación, venta o gasto al jugar |
| Temporales | Pactos | Integran la run; no salen como copia permanente | Son capacidad táctica, no ingreso de colección |

Fuentes: `trial-v1.json:701/952/1000/1040`, `domain/economy/essence.ts:8–10`, `application/run-use-cases.ts:270–365`, `application/team-use-cases.ts:32–81`.

**Falsa elección en forja:** con una misma madera, las tres recetas tienen el mismo coste y bonus; Dragón multiplica 1,2, Fénix 1,15 yWyvern 1,1. El motor solo aplica el multiplicador al daño, sin una ventaja compensatoria del otro núcleo. Por tanto Dragón domina al mismo precio en la configuración actual. Fuentes: `trial-v1.json:1040`, `domain/combat/engine.ts:336–338`. Opciones propuestas: simplificar catálogo visible hasta tener diferencias reales, o diseñar compensaciones horizontales; no inventar lore que prometa una mecánica inexistente. No se elimina ni cambia receta ahora.

**Rareza y obtención:**29 identidades elegibles, todas peso 1. Cada una tiene 3,448%independientemente del rango; grupos común 24,14%, inusual 27,59%, épico 27,59%, legendario 20,69%. El aprendiz está en catálogo pero no en tabla. La tabla es coherente con el sorteo actual; el problema de diseño es que “legendario” sugiere una dificultad que no es menor por identidad. Antes de cambiar pesos, decidir si rareza significa disponibilidad, acabado o ambas. No presentar un ajuste de probabilidades como un arreglo de etiqueta.

## Escenarios ejecutados, sin aplicar

### 1 · Ruta y presión táctica

[evidence/gameplay-model.mjs](evidence/gameplay-model.mjs) importa el generador y `CombatEngine` actuales.500 semillas,4585 caminos, sin cuentas/DB. Política explícita: aprendiz con equipo inicial, reclutar siempre hasta 5, refugio PV, pasar encuentros, sin comprar o usar grageas. **4585/4585 resultan victoria**, con mínimo 217 PVagregados finales. Consumo 5–25 energía y monedas 50–130 si todos los combates de esa ruta fueran primeras victorias;5–37 si todos esosIDs ya estuvieran superados. El modelo no es una tasa de victoria humana y no cubre todas las políticas; sí prueba que no hace falta progresión numérica para vencer esos caminos bajo esa política.

La semilla de combate se iguala a la de ruta para reproducibilidad, no porque la autoridad real las acople. No se afirma que todas las sesiones reales ganen; una mala formación, grageas adversas, condición u otras decisiones cambian resultados. La conclusión de diseño es ensayar presión y diversidad antes de regalar poder.

### 2 · Colección y duplicados

[evidence/gameplay-economy.py](evidence/gameplay-economy.py), semilla 62015,20.000 ensayos por escenario,29 candidatos/pesos actuales, colección elegible inicialmente vacía más aprendiz no sorteable. No mezcla los 30 cromos con 29 candidatos.

| Aperturas | Únicas medias actuales | Duplicados medios | ÚnicasP10–P90 | Probabilidad exacta de seguir sin una identidad concreta |
|---|---:|---:|---:|---:|
|5|4,66|0,34|4–5|83,91%|
|20|14,63|5,37|13–17|49,57%|
|40|21,89|18,11|20–24|24,57%|
|80|27,27|52,73|26–29|6,04%|
|120|28,58|91,42|28–29|1,48%|

Completar los 29 elegibles sin conversión: mediana 108 aperturas,P90160,P95181; media 114,28 conun ensayo censurado a 400. No es un límite de mala suerte; la distribución no garantiza completar tras 181. Si todas se comprasen,160 aperturas serían 1600 monedas al precio actual, pero botín y bóveda pueden aportar unidades: no convertir ese importe en horas/días sin modelo de ingresos.

| Propuesta de canje ideal | Únicas medias a 20 aperturas | A 40 | Completitud mediana | P90 |
|---|---:|---:|---:|---:|
|Sin canje|14,63|21,89|108|160|
|2 excedentes→1 faltante|16,85|28,63|40|42|
|3→1|15,94|26,19|47|51|
|4→1|15,52|24,95|53|56|

Estos escenarios presuponen canje voluntario **ejecutado siempre de forma óptima en el modelo**, destino pendiente elegible y una copia retenida por identidad. No simulan protección de formación/equipo, restricciones por rareza/familia, decisiones humanas o UI. Son un límite superior de aceleración, no una recomendación automática de 3:1. Las secuencias de RNG no son emparejadas entre ratios porque elegir destinos también consume RNG; diferencias pequeñas de la primera ventana son ruido de MonteCarlo.

Caso desfavorable: la protección de última copia sola permitiría consumir dos integrantes repetidos de una formación válida. Otro: tras completar 29 identidades, el canje a faltantes deja de ser sumidero; el modelo vuelve a acumular duplicados. Diseñar uso postcompletitud antes de prometer una solución eterna.

### 3 · Flujo 90 días como diagnóstico, no pronóstico

Se reutiliza `tools/arcana/game_design_skills_suite/prob_and_economy_sim.py:317` únicamente para saldo con fuentes/gastos supuestos. Con 50 iniciales,1 run/día, ingreso fijo 5/16/37 y compra deseada diaria 10:

| Ingreso supuesto/run | Saldo día 90 con clamp 0 | Cesta deseada sin financiar |
|---|---:|---:|
|5|0|400|
|16|590|0|
|37|2480|0|

5 y 37 son extremos del modelo de caminos con todos los combates ya ganados;16 es un valor diagnóstico intermedio, no ingreso observado ni promedio ponderado de jugadores. Sin gasto, los saldos serían 500/1490/3380; con cesta 15/día,0/140/2030. Se excluyen primera victoria mixta, llave/bóveda, forja, duración, regeneración, victoria y decisiones. El helper satura a 0: “sin financiar” es demanda hipotética, no compras autorizadas con saldo negativo.

**Lo que demuestra:** una sola media diaria oculta trayectorias muy distintas; no se puede afirmar inflación o escasez real sin medir qué caminos y gastos ocurren. No aplicar nuevos precios por estos escenarios.

## Qué falta decidir y observar

1. ¿La fantasía de rango debe implicar menor probabilidad individual? Resolver contrato antes de retocar tabla.
2. ¿La región enseña una composición segura y luego exige variarla, o pretende poder ganarse con el mismo trío siempre? La configuración actual favorece lo segundo.
3. ¿Qué excedente conviene conservar para formar equipos? Definir protección más fuerte que “última copia”.
4. ¿Qué objetivo sigue tras gastar la primera llave, cuando el jefe no dará otra? Evitar una promesa falsa de granja de bóvedas.
5. ¿El jugador identifica un motivo para volver distinto de comprar otro cromo? Requiere sesión posterior y retorno espontáneo, no se demuestra por este análisis.

**Tres frentes recomendados para un incremento futuro:** cierre y uso de recompensas; previsualización contextual de formación/sinergias/amenaza; orientación fiel a estado real (copias, coste, primera/repetida). La diversificación mecánica y el canje requieren diseño/aprobación adicional. No queda ninguna regla económica aplicada por estos documentos.

## Evidencia gráfica actual incorporada

Además de los modelos de dominio, se cotejaron tres capturas nuevas: [preparación activa](evidence/captures/es-18-preparation-active-1280.png), [cierre del jefe](evidence/captures/es-19-after-map-1280.png) y [Misiones con llave](evidence/captures/es-21-missions-after-boss-1280.png). Temporales y copias ya se distinguen con reloj y nombre; Misiones sí lleva a la bóveda cuando existe una llave. La mejora C0 consiste en trasladar esa orientación al cierre, cuya jerarquía actual da prioridad a otra preparación vacía. No debe describirse como un botón inexistente en todas las pantallas. Las dos rutas técnicas llegaron al jefe con 3 integrantes (aprendiz+2 temporales), obtuvieron 1 llave y la consumieron en bóveda; luego forjaron/equiparon e iniciaron otra run. Los logs/GET correspondientes están en evidence; no son sesiones humanas ni tasas de conversión.
