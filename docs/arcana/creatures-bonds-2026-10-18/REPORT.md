# A87 · Criaturas coleccionables y vínculos tácticos

**Estado de esta referencia:** PR [10](https://github.com/earandes/diagon-alley/pull/10) integrada en main `bde8275bac6d48a2bfb8e3a259fe322edb27d102`. Jobcheck full de `d539103` correcto:381gráficos,681unitarios y111PostgreSQL/Redis. `651dd98`, [CI39202690011](https://github.com/earandes/diagon-alley/actions/runs/39202690011), corrige y verifica la expectativa sobre Neutral mediante resume original, con aplicación/arte idénticos. No se atribuye una batería completa aresume. Se restablece full en main; suCI completa se verifica antes del cierre técnico de la tarea. [Integración y equivalencia](INTEGRATION.md). Sin despliegue; observación humana, escucha y dispositivo físico pendientes.

## Qué cambia para el jugador

El catálogo pasa de 30 a **34 identidades obtenibles**: Fawkes, Buckbeak, unicornio y dragón galés verde. ARCANA comparte sus IDs y reglas con nombres propios: Fénix del Alba, Hipogrifo del Valle, Unicornio Lunar y Dragón del Bosque.

Cromodex incorpora naturaleza, casa, escuela, oficio y afiliaciones históricas. La [lista detallada](CLASSIFICATION.md) clasifica a las treinta personas existentes y las cuatro criaturas. Hagrid, Lupin y Fleur siguen siendo personas mágicas; un mago nacido de muggles no es un muggle. Slytherin no significa maldad. Snape conserva dos afiliaciones históricas, sin acumular sus ventajas.

Antes de combatir se elige **un vínculo**: Automático, casas, Orden del Fénix, Mortífagos o criaturas. Tres identidades distintas vivas activan el nivel I; cuatro refuerzan al II. Duplicados y acabados encantados no multiplican el conteo. Los temporales contribuyen a la formación, pero no se convierten en copias propias.

| Vínculo | Nivel I / II | Renuncia |
|---|---|---|
| Orden | Hasta 1 / 2 PV a otro aliado vivo herido, una ayuda por bando y ronda | No autocura ni resurrección; necesita un contribuyente vivo que actúe |
| Mortífagos | +1 / 2 daño bruto al acertar sobre un objetivo que ya estaba a mitad de PV o menos | No mejora la iniciativa ni el primer tramo de daño |
| Criaturas | Amortigua hasta 2 / 3 del primer impacto positivo contra cada aliado | Una sola vez por aliado; no protege de quemadura ni conserva sobrante |

Las casas conservan sus efectos anteriores. Las afinidades permanecen independientes: Neutral no tiene bono. El nivel queda fijado al confirmar cada combate; el replay no lo vuelve a contar tras las caídas. El siguiente combate sí usa la condición actual del equipo.

Se eligió una familia táctica por equipo para evitar que varios datos biográficos conviertan a un personaje en superior por acumulación. Escuelas, profesiones y Ejército de Dumbledore siguen siendo descriptivos. Automático prioriza una casa activa y, en su ausencia, Orden, Mortífagos y criaturas; no promete elegir la mejor estrategia.

## Recorridos integrados

- Rana confirmada → criatura nueva o copia → revelación → ficha y filtros de Cromodex → formación por instancia → guardar vínculo → mapa → preparación → combate → cierre existente.
- Ruta con el inicial → comparar dos candidatos de Pacto → cancelar o reclutar → tres criaturas temporales distintas → vínculo visible en mapa → protección registrada en combate.
- Formación con afiliaciones → comparar casa y otro vínculo → guardar o cancelar → ayuda o remate en arena → consultar el registro.

Los tres Pactos ofrecen una alternativa humana de casa y otra de criatura, fijadas por el servidor. Conservan acceso a las cuatro casas y permiten probar tres criaturas sin comprarlas. No garantizan ganar ni completar la colección. El inicial solo no fuerza Gryffindor; otros personajes propios pueden orientar las ofertas. La distribución histórica de propiedad sigue siendo desigual y se explica en [COLLECTION](COLLECTION.md).

La elección se consulta en un libro y se guarda explícitamente con la formación. El mapa muestra el vínculo efectivo, contribuyentes y efecto. Consultar, cambiar idioma o paquete y recargar no recluta, compra o avanza nodos. Ofertas, incorporación, formación y consumo siguen siendo operaciones distintas.

## Arte, movimiento y sonido

Se produjeron ocho pinturas seleccionadas de cuatro criaturas, con dos poses por especie y contacto alineado; **16 WebP transparentes**, **tres emblemas originales** y **siete sonidos sintetizados**. [Fuentes, transformaciones, dimensiones y consumidores](ASSETS.md). Se conservan versiones rechazadas. Son pinturas planas con cambio de pose; no se presentan como rig corporal.

El lanzamiento sale de pico, garra, cuerno o boca según la especie. Una misma Sprite alterna textura y utiliza el reloj existente. Ayudante y receptor se distinguen; protección y remate dependen de cantidades confirmadas en el BattleLog. No hay habilidades nuevas por especie, filtros, relojes o partículas continuas añadidos. [Coreografía y alternativas](MOTION.md).

Los sonidos utilizan el ajuste de efectos existente, tras consentimiento. Una sola voz de lanzamiento, con prioridad de especie sobre grupo; no hay otra música o control permanente. La decodificación y los arranques nativos observados no equivalen a escucha humana o balance acústico en un teléfono.

La [galería](GALLERY.md) distingue fixtures y evidencia de App conectada. Las capturas seleccionadas permiten revisar composición; los JSON y aserciones del reloj sustentan la comprobación temporal. El acabado humano histórico de ARCANA sigue siendo diferente y no se ha rehecho.

## Compatibilidad y economía

Catálogo/tabla 4, rasgos v2, contenido táctico 4 y reglas/motor 3 para expediciones nuevas. Perfiles `a84`/`a85`, snapshots y resultados históricos se conservan. La campaña continúa en versión 1 para no reabrir premios únicos. Propietario, key, petición, selección y receipt permanecen recuperables. [Contrato de compatibilidad](COMPATIBILITY.md).

No cambian precios, premios, Esencia, estadísticas anteriores ni el 1% cosmético independiente. Añadir cuatro tickets sí cambia las probabilidades normalizadas: **1/33 por identidad**, **1/3300 para su acabado encantado**. La rareza indicada no modifica esos pesos uniformes.

El modelo exacto estima **128 aperturas de mediana, 188 P90 y 211 P95** para las 34 identidades desde el inicial, frente a 108/161/181 anteriormente. Tres criaturas propias: 32/63/75; las cuatro: 61/119/142. No se convierten esas cifras en horas sin medir ingresos, gastos y tiempos humanos. Acabados y recuerdos estacionales quedan fuera del denominador base.

La [calibración reproducible](CALIBRATION.md) conserva 1.920 escenarios y 640 pares controlados, políticas distintas y resultados desfavorables. Hay situaciones de conveniencia opuesta; no demuestra diversión, retención o una tasa universal de victoria. Maestría no se presenta como superable con cualquier colección inicial.

## Comprobaciones y límites

[QA](QA.md) registra comandos, SHA, fases, errores y correcciones. La captura de un Pacto es una fixture del diálogo; los cuatro recorridos HTTP/PG/Redis aportan evidencia autoritativa separada. Cancelación, recarga, respuesta perdida, concurrencia, snapshots anteriores, idiomas, paquetes, teclado, reducido y fallbacks se distinguen por capa en [COVERAGE](COVERAGE.md).

El [rendimiento](PERFORMANCE.md) conserva todos los intentos. Chromium sostenido da P95 rAF 16,7–16,8 ms en las muestras declaradas. WebKit ha dado 20 y 22 ms con el mismo código en diferentes cohortes, igual que su referencia inmediata A86: sin regresión sostenida detectada, sin afirmar 20 ms estables. Hay arranques y tareas largas desfavorables. rAF no es tiempo GPU; registro de textura no es memoria residente ni subida GPU medida.

No se abrió un navegador en el Mac. Gráficos en Linux con guard, bloqueo, watchdog, un worker y cero reintentos automáticos. [Sesión humana pendiente](HUMAN-SESSION.md): comprensión del vínculo, percepción de consecuencias, estilo, escucha y dispositivo físico. T01 y los límites de distribución permanecen; no se ha desplegado o publicado la aplicación.

[Añadir otra identidad o familia](EXTENDING.md) explica qué requiere datos, arte o código, sin introducir un motor universal de habilidades.
