# Colección, dulces, varitas y Gringotts · ampliación del estudio

19 octubre 2026. Baseline `d4a6d36fd0b1fb96ab4f3e8a071c88cfc5621f1f`. **Análisis y propuestas, sin implementación ni cambio económico.** Amplía las quince fichas originales con PM16–PM24 y reordena las veinticuatro en [PRIORITIES.md](PRIORITIES.md). Las prioridades originales quedan conservadas en [README-INITIAL.md](README-INITIAL.md). La sugerencia posterior de tiendas se desarrolla en [SHOPS.md](SHOPS.md).

## Experiencia y decisión de producto recomendada

Durante una expedición, el jugador prepara una compañía, descubre qué le falta y vuelve al Callejón para tomar una decisión que afecta a su siguiente plan. La progresión deseable es **más opciones comprensibles y objetivos alcanzables**, con una parte de descubrimiento aleatorio; acumular aperturas, gastar por gastar o visitar más mostradores no equivale a profundidad incremental.

Recomiendo mejorar primero **Cromodex → objetivo → preparación**, **varita → portador → renuncia real** y **gragea → riesgo conocido → activación comprobada**. Después introducir capítulos finitos que reconozcan descubrimiento y uso, y ensayar una sola tienda nueva. Investigar en paralelo la cola de repetidos, sin introducir un canje o una moneda por defecto.

No recomendaría añadir ahora niveles infinitos, ingresos pasivos, desgaste, mantenimiento diario, edificios con temporizadores o un porcentaje de colección que cambie para siempre. La progresión horizontal puede crecer mediante familias/versiones y objetivos de uso; el poder y la economía no deben crecer automáticamente al hacerlo.

## 1. Diagnóstico del sistema realmente activo

Todo este apartado es **contrastado por código/configuración**, no recorrido nuevo de navegador ni observación humana. Fuentes ampliadas en `sources.json`.

| Ámbito | Implementado y conservado | Oportunidad interpretada, todavía no problema humano demostrado |
| --- | --- | --- |
| Cromos | 34 identidades; Harry inicial y 33 tickets uniformes. Clasificación, casas/grupos, filtros, copias y encantado cosmético. Un vínculo efectivo, con contribuyentes distintos vivos; temporales no son propiedad | El álbum sabe clasificar, pero puede guiar mejor una intención de colección y su uso. Añadir más cartas sin revisar obtención diluye el acceso a todas |
| Ranas | Compra de 10, apertura de unidad poseída y compra+apertura atómica; tabla pública; entrega guardada antes de revelación; acabado encantado independiente al 1% | Completar tiene cola larga. No falta otra compra para una rana ganada ni una nueva animación general: ya están resueltos |
| Grageas | Compra de 5, asignación provisional a instancia, consumo al confirmar combate, cuatro sabores equiprobables. Colección derivada de activaciones válidas de receipts; ya existe libro de cómo descubrir | Se puede explicar mejor cuándo aceptar incertidumbre y qué ocurrió. Haber descubierto menta no permite escoger menta en el siguiente tarro |
| Varitas | Nueve recetas, tres maderas y tres núcleos, costes 15/20/25 según madera. Configuración efectiva v2: dragón daño×1,2; wyvern iniciativa+3 y daño×1; fénix recuperación2 PV/turno y daño×1. Instancias históricas inmutables | Llevar comparación contextual hasta el momento anterior a forjar. Las especializaciones ya existen; no presentarlas como feature nueva |
| Gringotts | Una llave de primera victoria del jefe bajo campaña actual, dos paquetes de botín con igual peso; libro de probabilidades y enlace a preparar ya existen | Una vez gastada la llave falta una función duradera más allá de consultar el último resultado. El equipo exclusivo de ambos paquetes no constituye un conjunto completable con esa única llave |
| Callejón | Tres destinos activos: confitería, taller y bóveda. Entrar no compra ni concede | La novedad de una cuarta fachada debe justificar otro recorrido. Una tienda sin decisión distinta tiene coste de arte y navegación sin profundidad demostrada |

**Fuentes/sumideros actuales.** Kit, primeras victorias, repeticiones, cofres, encuentros y bóveda aportan recursos según contenido vigente. Ranas, grageas y forja gastan Coronas; combates gastan Esencia; la bóveda consume llave. No hay conversión de cromos repetidos en forja ni canje implementado. Las victorias repetidas no renuevan la llave. El premio se identifica por nivel/campaña; cambiar catálogo o edición no debe recrearlo. No se ejecutó una simulación nueva de rutas/ingresos y no se atribuye una tasa de ganancias humana a este inventario.

**Los porcentajes deben expresar cosas distintas.** Identidades base, capítulos de uso, sabores, equipo obtenido y acabados encantados son ejes separados. No sumarlos en un 100% global: el equipo de bóveda no es totalmente obtenible con las reglas revisadas y los acabados no tienen plazo garantizado. La propiedad histórica de cartas se conserva al ampliar catálogo; una edición base terminada debe seguir figurando terminada, mostrando la ampliación aparte si se aprueba esa presentación.

## 2. Cálculo reproducible y consecuencias de diseño

Ejecutado: `python3 -B docs/arcana/product-roadmap-2026-10-19/commerce_analysis.py`. Resultados completos y hashes en [commerce-analysis.json](commerce-analysis.json). Cálculo exacto de ocupación/geometría; sin servicios, cambios de datos o simulaciones de personas. El modelo anterior de [collection-analysis.json](collection-analysis.json) permanece intacto.

| Pregunta matemática | Resultado | Qué permite decidir / qué no demuestra |
| --- | --- | --- |
| Completar los 33 resultados aleatorios actuales, con identidad inicial fuera de tabla | Mediana128 / P90188 / P95211 aperturas; media 134,93 | La completitud necesita estudiar la cola. No son horas, partidas o gasto real |
| Teniendo 32 de esos 33, obtener el último | 3,03% por apertura; media 33 adicionales; mediana 23 / P9075 / P9598 | El final puede tener periodos largos sin novedad; no demuestra frustración observada |
| Seguir sin una identidad concreta tras 50 aperturas | 21,47% | No prometer que repetir una cantidad razonable garantiza una carta |
| Ampliar hipotéticamente a 45 tickets uniformes, sin más fuentes | Mediana188 / P90270 / P95302; media 197,77 | Aumentar catálogo no es gratis en duración. Escenario de +12, **no catálogo propuesto aprobado** |
| Una identidad concreta en conjunto temático hipotético de ocho | Mediana6 / P9018 / P9523; media 8 | Concentrar tabla cambia drásticamente el valor de compra. No se ha fijado precio, composición ni producto |
| Descubrir los cuatro sabores con activaciones independientes actuales | Mediana7 / P9013 / P9516 activaciones; media 8,33 | Con cuatro sabores, más tareas de repetir sabores podrían ser relleno. No son necesariamente combates: puede haber varias activaciones por combate |
| Efecto adverso en una activación de gragea | Tierra/jabón suman50% | No es probabilidad de derrota ni balance neto: curación desperdiciada o distinto portador cambian valor |
| Obtener las dos piezas exclusivas de bóveda con una llave y un resultado | Probabilidad0 | No prometer «equipo100%». Elegir entre paquetes tampoco hace obtenibles ambos |

Con 30 resultados aleatorios distintos, faltan tres y la probabilidad de novedad es9,09%; con 25 es24,24%. Por eso la utilidad de una nueva apertura depende del estado de colección. Un conjunto temático de ocho al mismo coste puede dominar la rana general para un objetivo local; tampoco arregla toda la colección si sus conjuntos se solapan mal o excluyen identidades. Debe compararse una política completa, no solo ese caso favorable.

### Tres direcciones comparadas

| Dirección | Interés/claridad | Economía y riesgo | Producción / elección |
| --- | --- | --- | --- |
| A · Orientación, comparación y capítulos de uso | Convierte lo obtenido en planes y reconoce aprendizaje; no resuelve por sí sola el último faltante | Conserva obtención; evita falsa promesa de garantía | Menor riesgo, reutiliza assets. **Primera recomendación** |
| B · Una fuente dirigida acotada o excedentes | Más agencia sobre el objetivo permanente y menor cola potencial | Nueva regla de obtención; riesgo de ruta de farmeo dominante o pérdida de copias útiles | Comparar PM10/PM22 y elegir una política antes de implementar |
| C · Muchas tiendas/catálogos y mejora vertical | Gran amplitud aparente y coste de descubrimiento | Dilución, inflación, más gasto obligatorio y más superficies que mantener | Descartar como siguiente incremento. Solo una tienda con decisión distinta tras validar A |

No recomiendo aplicar canje, conjuntos temáticos y garantías simultáneamente: sería imposible atribuir el cambio y podrían trivializar la colección en conjunto. La opción A no sustituye la investigación B; esta última sube de prioridad como estudio económico.

## 3. Referentes investigados y límites

Consulta documental oficial el 19-10-2026. Sin instalar ni recorrer estos juegos, sin métricas comparativas de jugadores. Las reglas de otros productos no son autorización para cambiarlas aquí.

- **Pokémon TCG Pocket.** Su FAQ oficial separa puntos de expansión y cartas elegibles, además de apertura y uso de recursos. Adaptaría la claridad de procedencia/versiones y la separación entre azar y obtención dirigida. No copiaría su moneda de puntos, esperas o gasto monetizado. No extrapolo sus ratios a ARCANA. [FAQ oficial](https://support.pokemon.com/hc/en-us/articles/30330309361172-Pok%C3%A9mon-TCG-Pocket-Gameplay-FAQ).
- **MTG Arena.** El anuncio original de Golden Packs de 2022 describe protección frente a duplicados y condiciones de obtención. Sirve para distinguir un producto protegido de una apertura normal, no para afirmar que todas las reglas de 2022 sigan vigentes hoy. Adaptaría contratos explícitos y límites de elegibilidad; no introduciría comodines, gemas o medidor de compra. [Anuncio original oficial](https://magic.wizards.com/en/news/mtg-arena/introducing-mtg-arena-golden-packs).
- **Slay the Spire.** El press kit oficial presenta construcción de mazo, rutas y desbloqueos como partes de su propuesta. Inspira conectar descubrimiento con planes diferentes. No verifica por sí solo ritmo de desbloqueo, tasas de victoria, horas o retención; no lo uso para copiar un sistema concreto de XP. [Press kit de Mega Crit](https://www.megacrit.com/press-kits/slay-the-spire/).

La primera guía de Pokémon respondió mediante iframe; no se usó para deducir detalles no recuperados. Dos URLs históricas de Wizards con sufijo de fecha no fueron accesibles; se sustituyó por el anuncio oficial localizado por búsqueda. No se incorporan blogs, Reddit ni resúmenes como evidencia de reglas.

## 4. Validación futura del valor

HipótesisH1: elegir una meta y ver una comparación permite explicar qué buscar/comprar y por qué. H2: reconocer un capítulo o uso comprobado da un motivo para otra expedición sin premio de poder. Las sesiones futuras deben permitir rechazar ambas; no basta un clic, una compra o un detector sin findings.

Sesión formativa propuesta, sin explicar soluciones: preparar un plan alternativo con colección inicial; localizar una fuente de copia permanente; decidir entre dos varitas para dos amenazas; decidir usar o conservar una gragea; tras una bóveda gastada encontrar una siguiente acción real. Registrar ayuda, errores de temporal/propio, gasto anticipado, coste entendido y explicación del efecto. Separar perfiles iniciales/avanzados y rechazo voluntario de incapacidad. Cinco a ocho sesiones pueden descubrir problemas, no estimar retención o validar demanda estadística.

Métricas adicionales en [COMMERCE-VALIDATION.md](COMMERCE-VALIDATION.md); fichas ejecutables en [COMMERCE-FEATURES.md](COMMERCE-FEATURES.md). La nueva priorización no autoriza código ni gasto económico.
