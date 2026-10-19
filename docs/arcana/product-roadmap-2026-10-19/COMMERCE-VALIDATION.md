# Medición y aceptación de colección y tiendas

Amplía [METRICS.md](METRICS.md), sin añadir más indicadores principales ni instalar analítica. K1/K2/K3 y G1/G2 siguen vigentes. No hay baseline humano, eventos nuevos o objetivos porcentuales aprobados. Medición manual primero; si se instrumenta, contrato de propietario, privacidad, cobertura y no bloquear economía del documento principal.

## Diagnósticos adicionales

| ID | Definición, unidad y denominador | Segmentación, fuente y decisión |
| --- | --- | --- |
| D15 · Capítulo comprendido/usado | Sesiones de ensayo donde se explica correctamente requisito y hecho completado / sesiones que consultaron ese capítulo; separado de capítulos completos / propietarios elegibles con ventana terminada | Manual con rúbrica de hechos, PM16 y receipts. Inicial/avanzado/temporal/propio/versiones. No confundir visitas con comprensión ni exposición con elegibilidad |
| D16 · Continuidad de ranas | Tiempo acción «abrir»→resultado utilizable, pasos entre dos aperturas deliberadas poseídas y errores/reintentos por intento | Cliente para tiempo, receipt para entrega, caché/contexto y cantidad poseída. Comparar sin agrupar compra con apertura gratuita de unidad. Fallos/abandono/timeout reportados, no borrarlos del denominador |
| D17 · Elección de varita | Ejercicios donde la persona anticipa una diferencia correcta / ejercicios con comparación disponible; coste y cambios de equipamiento por expedición como diagnósticos separados | Rúbrica sobre motor/log, no sobre ganar. Portador, núcleo, condición, amenaza y disponibilidad económica. No diversidad «buena» si una opción es simplemente dominada |
| D18 · Decisión de gragea | Participantes que distinguen azar, borrador y consumo / participantes expuestos; activaciones válidas / unidades asignadas al confirmar, identificando actor caído/ausencia de activación | Manual+estado/receipt, versiones de tabla y condición. Conservar vs usar no son éxito/fallo; separar sabor descubierto de efecto útil. No usar compras como demanda de receta conocida |
| D19 · Salida de Gringotts | Sesiones con botín confirmado que encuentran una acción viable sin ayuda / sesiones con botín confirmado; después tiempo hasta acción deliberada y abandono | Manual+receipts, llave disponible/abierta/sin llave y primera/repetida. «Volver a abrir» sin fuente de llave es error de promesa, no retención |
| D20 · Valor de una nueva tienda | Sesiones donde se elige un plan viable y se explica su objetivo / sesiones con tomo mostrado; pasos/tiempo desde objetivo a preparación frente a acceso desde Cromodex | Muestra formativa emparejada con orden alternado, no A/B significativo con pocas personas. Contar también elección «ninguno», cerrar y no viable. Una tienda que solo añade pasos se descarta |
| D21 · Agencia y cola de obtención | Distribución de aperturas entre novedades, tiempo de calendario hasta meta y coste por identidad nueva; porcentaje sin completar a horizonte declarado entre participantes/cohortes elegibles | Simulación exacta no es telemetría. Tiempo activo/espera/gasto por ruta y fuentes separados. Censura por la derecha para quienes no completan; no excluir la cola, ni promediar solo a completadores. Estratificar progreso inicial, tabla, política y grupo objetivo |

Rúbrica de comprensión: pregunta neutral, respuesta espontánea antes de acción, contraste con fuente efectiva y registro de ayuda posterior. No inferir respuesta de un clic. Definir previamente qué hechos mínimos bastan para clasificar respuesta correcta. Pocas sesiones informan diseño, no una tasa poblacional ni causalidad de retención.

## Investigación económica que sigue pendiente

El cálculo adjunto valida ocupación, no una economía completa. Antes de aprobar PM10/22/23/24:

1. Mantener baseline ejecutable e inputs/hash de contenido actual; extraer ingresos/gastos/Esencia/premios únicos/encuentros desde reglas efectivas. No volver a conceder primeras victorias al reiniciar una simulación de continuación.
2. Comparar perfiles inicial, medio y casi completo, con condición buena/mala, derrotas, abandonos, duplicados útiles/protegidos y objetivo por familia. Políticas declaradas: conservar recursos, comprar general, preparación razonada y dirigido/canje por separado. Nunca seleccionar solo política favorable.
3. Usar semillas comunes cuando los flujos sean comparables. Si difiere número de tiradas, separar flujos por propósito para evitar emparejar azar distinto por accidente; registrar algoritmo y límites, no «misma semilla» como prueba suficiente de igualdad.
4. Medir mediana/P90/P95 y casos extremos de descubrimiento y completitud, victorias, condición, gastos, ingresos netos y recursos para recuperarse. Declarar horizonte y proporción censurada. No convertir precio 10 en horas sin modelo de rutas y rangos humanos de duración.
5. Para Monte Carlo, acotar antes tamaño y parada. Propuesta de ensayo:10.000 perfiles por política de colección,100.000 solo si la estimación deP95 requiere más precisión, con intervalos bootstrap y error de cuantil conservados. El cálculo exacto evita esa muestra cuando corresponda. **No se han ejecutado esas simulaciones aquí**; no lanzarlas desde una suite gráfica ni cargar servicios reales por volumen.
6. Analizar dominancia: una fuente solo es mejor si se comparan objetivo, acceso, coste total, copias retenidas y renuncias. El canje no consume última/equipada/activa/reserva/encantada sin política aprobada. Lo conocido no debe convertirse en requisito del jefe; elegir bóveda no debe renovar derechos.
7. Presentar una sola política recomendada y sensibilidad antes de aprobar datos/reglas. Definir criterio de rechazo si no mejora cola o si elimina decisiones/preparaciones alternativas. No fijar un porcentaje arbitrario de victoria como diversión.

## Matriz técnica futura por recorrido

| Recorrido | Pruebas pertinentes antes de declararlo entregado |
| --- | --- |
| Cromodex→objetivo→capítulo | Identidad/copia/temporal/encantado separados, snapshot frente a catálogo, datos ausentes, catálogo retirado, progreso por receipt; no guardar al consultar |
| Rana poseída→otra→salir | Misma unidad/reintento, unidad consumida por otra pestaña, fondos cero, tabla obsoleta, commit con respuesta perdida, omisión/recarga, último resultado consultable |
| Receta→forja→equipar→combate | Comparación compartida correcta; compra no equipa; consulta no compra; instancia antigua conserva efectos; doble confirmación y rollback; consecuencia del mismo BattleLog |
| Tarro→portador→activación→sabor | Stock0/1/n, duplicados, temporal, caído; asignar no revela; consumo único, identidad de producto/actor/operación concordantes; derrota/replay/reducido |
| Llave→bóveda→uso/histórico | Premio correcto, llave única, dos pestañas, derechos de campaña sin reset, sin llave no falso objetivo, arte ausente; versión de concesión si cambia política |
| Tienda→tomo→ejercicio→retorno | Requisito viable, ninguna compra/rama iniciada por consulta, cancelar/foco, propietario, idiomas/packs, histórico no duplicado; mismos hechos fuera/dentro de tienda |

Unitarios de comportamiento primero, integración PG/Redis reales cuando cambie transacción/sesión/gateway, tipos/build y regresión afectados. Browser extenso únicamente CI Linux serial con guard/bloqueo/preflight/watchdog, un worker y cero reintentos, capturas explícitas seleccionadas. En Mac no navegador nuevo para esta investigación; excepción original controlada solo si procede en implementación. No alterar cuenta habitual, estado, precios, premios o configuración global.

Validación de interfaz futura:ES/EN, dos packs,1280×900/390×844/865×1079, reflujo320 y texto ampliado, teclado/foco/toque emulado, reducido, fallo del arte/renderer, offline y resultado incierto. Una captura prueba composición, no movimiento; fixture no es comportamiento de una persona; emulación no es dispositivo físico. Revisar continuidad con mapa, Pactos, preparación, arena, cierre, temporada, identidad y PWA según código afectado.

## Qué se ejecutó en esta ampliación documental

Inspección de código/JSON, consulta de tres referencias oficiales recuperadas y cálculo exacto reproducible con casos conocidos; resultado en `commerce-analysis.json`. El primer intento del script detectó una ruta de JSON incorrecta (`rules` frente a `combatRules`), se corrigió y se ejecutó correctamente; no se cambió el contenido fuente. Comprobaciones finales de fichas, prioridades, enlaces, hashes y ámbito se registran en [VALIDATION.md](VALIDATION.md).

No se ejecutaron compras, aperturas, combates, correo, servicios PG/Redis, build/tipos/tests de app o animaciones; no existen nuevos assets ni implementaciones para validar visualmente. No hay horas de personas, retención observada, benchmark de otras apps, autorización económica o estimación de entrega cerrada.
