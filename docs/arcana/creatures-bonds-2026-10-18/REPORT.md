# A87 · Criaturas coleccionables y vínculos tácticos

Estado: implementado en rama, integración pendiente de cerrar las comprobaciones. PR [10](https://github.com/earandes/diagon-alley/pull/10). f79d9ce supera380comprobaciones gráficas deljobcheck,681unitarias y111PG/Redis; dos expectativas de regresión corregidas posteriormente. Un ensayo WebKit adicional contra la referencia históricaA84 muestra22–23msP95 frente17–18ms; las dos variantesCSS ensayadas no mejoran y se retiran, conservando evidencia. Se compara ahora contraelmain440d278(A85+A86) real delque parteA87, con idéntica fórmula de no-regresión,20msobjetivo y guard. No se atribuye la diferencia anterior aA87 sin medir ese predecesor; no se promete20mscumplidos. Fullrestaurado con ambos motores. Sin despliegue, sesión humana o dispositivo físico atribuidos.

## Qué puede decidir el jugador

El catálogo pasa de 30 a 34 identidades con Fawkes, Buckbeak, unicornio y dragón galés verde. ARCANA utiliza los mismos IDs y reglas, con nombres y contexto propios. Cromodex distingue casa, naturaleza, escuela, profesión y afiliaciones históricas. No clasifica a Slytherin como maldad ni a un mago nacido de muggles como muggle.

Un equipo elige un vínculo: Auto, casas, Orden, Mortífagos o criaturas. Solo una de esas familias aporta su pasivo; las afinidades siguen independientes. Tres identidades distintas vivas activan y cuatro refuerzan. Duplicados, aliados temporales y acabado encantado no multiplican identidades. Temporales contribuyen a la formación, pero no se convierten en cromos propios.

La elección se consulta en el libro de preparación, se guarda explícitamente y se muestra en el mapa con contribuyentes y efecto. Auto conserva una casa activa y, cuando no la hay, prioriza Orden, Mortífagos y criaturas. No compra, equipa o inicia rutas. El combate conserva la elección efectiva en su input y representa sus eventos confirmados.

| Vínculo | Beneficio I / II | Renuncia |
|---|---|---|
| Orden | Hasta 1 / 2 PV a otro aliado vivo herido, una ayuda por bando y ronda | No autocura o resurrección; necesita un contribuyente vivo que actúe |
| Mortífagos | +1 / 2 daño bruto sobre un objetivo que ya estaba a mitad de PV o menos | No mejora el primer tramo de daño o la iniciativa |
| Criaturas | Amortigua hasta 2 / 3 del primer impacto positivo contra cada aliado | Una sola vez por aliado; no sobrante o protección de quemadura |

Los tres Pactos mantienen una alternativa de casa y ofrecen tres criaturas distintas fijadas al crear la expedición. Esto permite probar su táctica con el inicial, sin una compra obligatoria. La propiedad de los cromos sigue dependiendo de aperturas; el Pacto no descubre su identidad en la colección.

## Recorridos conectados

- Apertura confirmada → nueva criatura o copia → ficha/filtro de Cromodex → formación por instancia → vínculo → mapa → preparación → combate → cierre existente.
- Ruta con inicial → comparar dos candidatos → cancelar o reclutar → tercer contribuyente → efecto visible en mapa → combate con protección confirmada.
- Formación con afiliaciones → comparar vínculo y casa → guardar o cancelar → ayuda/remate en arena → consultar el registro.

La autoridad conserva dueño, clave, petición, resultado y versiones. Consultar, cambiar idioma o paquete y recargar no conceden una criatura, cambian candidatos o repiten una operación. Las reglas nuevas se aplican a expediciones nuevas; partidas y aperturas históricas conservan sus snapshots. La campaña continúa en versión 1 para no reabrir premios únicos.

## Arte, movimiento y sonido

Cuatro familias de ilustración con dos poses alineadas por contacto; 16 WebP transparentes, tres emblemas SVG y siete cues originales. Fuente, prompts, transformaciones y consumidores en [ASSETS](ASSETS.md). No se atribuye un rig corporal a dos pinturas planas. El libro de vínculo usa cinco medallones compactos y distingue afinidad de vínculo. La arena utiliza una Sprite por unidad y el reloj existente; no añade filtros, relojes o partículas continuas.

Los efectos de protección y remate dependen de cantidades del log. Ayudante y receptor se diferencian. El sonido usa Ajustes A84, desactivado hasta consentimiento, con una voz de lanzamiento y límite existente de voces. Reducido, pausa, omisión y fallbacks conservan resultado y acciones. Las capturas seleccionadas y las comprobaciones temporales f79 acreditan composición y funcionamiento de poses; el candidato posterior sigue pendiente del presupuesto WebKit y la regresión final.

## Calibración y economía

[CALIBRATION](CALIBRATION.md) conserva 1.920 escenarios de expedición, 640 pares controlados y sus límites. Hay situaciones de conveniencia opuesta; no se presenta ningún grupo como mejora universal. Maestría sigue siendo difícil con colección inicial. Se conservan resultados desfavorables e ingresos distintos derivados de nuevas victorias/rutas.

La tabla 4 tiene 33 tickets equiprobables, más el inicial fuera del azar. Cada identidad pasa de 1/29 a 1/33; su acabado encantado es 1/3300 y el 1% cosmético independiente no cambia. Precios, premios y Esencia permanecen. Completar las 34 identidades desde el inicial requiere mediana 128 aperturas, P90 188 y P95 211, frente a 108/161/181 anteriormente. Obtener tres criaturas propias: 32/63/75; las cuatro: 61/119/142. No se convierten aperturas en horas humanas sin ingresos, gastos y tiempos observados.

[Modelo exacto](collection-model.json), [clasificación detallada](CLASSIFICATION.md), [extensión futura](EXTENDING.md), [QA](QA.md), [sesión posterior](HUMAN-SESSION.md). Los rasgos biográficos, profesiones y Ejército de Dumbledore no reciben pasivos adicionales en este incremento. Muggles, Dementores, seres inteligentes y nuevos grupos requieren decisiones propias; no son contenido implementado.

## Estado de comprobación

Tipos, build, análisis de distribución, 681 pruebas unitarias y 111 con PostgreSQL/Redis reales correctos antes de enviar el candidato. La corrección de cuatro casas cambia escenarios A87; se conserva la versión previa. Las filas A85 y los640pares controlados permanecen idénticos. La CI protegida del candidato y la inspección de su evidencia deben cerrar recorrido, rendimiento y arte; no se da por entregado con esas comprobaciones pendientes.
