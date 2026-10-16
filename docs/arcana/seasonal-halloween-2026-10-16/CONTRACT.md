# A68 · Halloween estacional · 16 octubre 2026

Autorizado por Enric: diseñar, implementar y validar localmente, coste adicional cero. Sin commit, push, despliegue o publicación. Goal activo. Base main `2b9df81ff3dfcd2b7d7353a669ada44b314ddc26`, sin cambios tracked al iniciar. Word y evidencia previa intactos.

## Diseño antes del código

Durante el evento, el jugador recorre los escaparates embrujados, decide entre deshacer la broma ahora y aprovecharla para recuperar condición a cambio de retrasar su reparación, y conserva una linterna conmemorativa sin poder ni valor económico.

Emoción: curiosidad festiva y sensación de devolver luz al Callejón. Acción distinta: visitar un escaparate entre etapas de la ruta. La decisión contrapone progreso conocido a preparación inmediata; no depende de un sorteo. Tres luces y la linterna cerrarán la historia; después se conserva el recuerdo y la posibilidad de experimentar con la preparación mientras queden ventanas, sin nuevos premios de repetición.

Alternativas contrastadas:
- Tres expediciones obligatorias: reutilizable, pero repetición y energía excesivas para una historia breve; descartada.
- Minijuego separado: claro pero desconectado de condición/equipo, más producción y accesibilidad; descartado.
- Paradas estacionales sobre la expedición existente: reutiliza equipo/condición y deja elecciones situacionales. Elegida. No cambia nodos, ramas, combate o premios de campaña.

## Recorrido y reglas de ensayo

Objeto de Halloween en entrada/mapa → consulta de calendario/costes/recuerdo → participación explícita → preparar ruta existente si falta → tres escaparates en orden → recuerdo permanente consultable. Participar no inicia una run ni gasta. Cancelar la consulta no escribe nada.

Las oportunidades empiezan después de dos nodos visitados (los Pactos iniciales permiten formar equipo). Cada posición de ruta puede resolver una sola oportunidad estacional. Deshacer ilumina un escaparate sin alterar condición. Aprovechar la broma aplica el intercambio existente del sanador (equipo: +25%PVmáx, −10%PMmáx únicamente a beneficiarios vivos), no ilumina y exige avanzar un nodo antes de volver a intentarlo. Sin beneficio o PM insuficientes no se ofrece como acción válida. Así una run permite tres reparaciones y hasta dos desvíos antes del jefe; no exige vencer al jefe para cerrar la historia. Progreso acumulable entre runs, sin borrar una derrota. No exige raros ni compras.

Información previa: PV/PM exactos antes/después, progreso, próxima oportunidad, coste de combate vigente5Esencia. Deshacer conviene con condición buena o llegada tardía; preparar puede convenir con PV bajos y PM sobrantes, renunciando a esta oportunidad de progreso. No garantiza victoria. No se puede cultivar curación recargando o cambiando equipo/pestaña.

Calendario de ensayo2026 explícito Europe/Madrid: nuevas participaciones16octubre00:00–2noviembre00:00; expediciones vinculadas antes del cierre pueden resolver hasta3noviembre00:00. Consulta histórica permanente. Fechas con offset y reloj de autoridad inyectable, sin controles públicos. Es una configuración de ensayo, no promesa de calendario comercial. No se vinculan nuevas runs durante la gracia. Evento único activo por política explícita.

## Persistencia e integridad

Evento recurrente `enchanted-windows`, edición `halloween-2026`, definición versión1. Participación congela definición/calendario/objetivos/recuerdo; IDs de runs vinculadas, oportunidades usadas y ventanas reparadas separados del inventario. Concesión `seasonal:halloween-2026:lantern` única, con procedencia/fecha/versión. Recuerdo no es cromo y no entra en30identidades ni4sabores.

Comando estacional propio bajo lock de cuenta: key/petición/revisión, reloj servidor, resultado/condición/progreso/concesión/receipt en la misma transacción. Recuperar receipt antes de consultar reloj/config vigente. Consultar/idioma/pack no opera. Nuevas runs vinculadas explícitamente desde StartRun solo durante admisión, las existentes no se regeneran ni cambian snapshots. Otra edición tiene progreso independiente; historial y definiciones previas no se reinterpretan. Premios únicos de campaña conservan levelId+campaignVersion.

## Alcance y recursos

Incluye Halloween ES/EN y ambos packs, objeto de entrada, tres ventanas, comparación, cierre y vitrina histórica pequeña. Arte reutilizado de fachadas; añadir solo emblemas editables locales necesarios, sin generación pagada. Navidad documentada, sin aventura ni lote. Excluye monedas, consumibles, estadísticas/skills nuevos, cambios económicos, personalización general, editor/motor universal, región adicional.

## Aceptación y evidencia requerida

Calendario antes/durante/gracia/después; join/cancel; parcial/3ventanas/grant único; PV/PM exactos y rechazo sin beneficio; doble toque/dos conexiones; rollback/respuesta perdida/recuperación tras cierre; runs/versiones antiguas y nuevas; edición siguiente sin borrar recuerdos; ES/EN/packs; keyboard/reducido/arte ausente; inventario/cromodex/campaña invariantes. Tipos/build/unitarios/PGRedis reales y smoke local estrictamente acotado. Matrices gráficas/WebKit solo Linux: sin push no se fingirá CI nueva. Inspección de composiciones fuera del navegador permitida; capturas nuevas del navegador prohibidas localmente. Si falta comprobación necesaria, goal seguirá activo con límite concreto.

Duración por estimar tras comprobar ruta: tiempo activo supuesto separado de tiempos automatizados. No hay coste estacional adicional; cada combate sigue5Esencia, regen1/12min. No rachas/entradas diarias. Llegada tardía: puede completar tres ventanas de una run admitida antes del cierre y terminar durante gracia; después solo consulta de lo ganado.

Hipótesis humanas pendientes: reconocer objeto/objetivo sin explicación; percibir el coste de posponer reparación frente a curación. Sesión breve posterior, sin bloquear entrega técnica ni atribuir diversión a QA.
