# A74 · Plan de implementación posterior

**Propuesto, no implementado ni aprobado por este documento.** Los tres incrementos siguientes conservan reglas/economía/persistencia/arte principal y resuelven recorridos completos. No requieren nueva librería, generación con créditos ni un lote de assets.

## I. Preparar y guardar con confianza

**Incluye F01–F04.** Impacto alto; esfuerzo medio por los estados de sesión/modal; riesgo principal: recuperar una operación con el jugador equivocado o mostrar otra versión de reglas. No es una reescritura de autenticación ni del controlador.

Recorrido: entrar → cargar → preparar → inspeccionar/equipar → guardar o recuperar → volver al mapa. En una ruta antigua, consultar exactamente las reglas que usará su combate.

Secuencia propuesta:

1. Caracterizar el rechazo401 con partida cargada, la entrada doble sin respuesta y los errores dentro del inspector superior mediante pruebas dirigidas. Conservar intención/key/player en estados inciertos.
2. Diseñar un único estado de recuperación global y su presencia en el modal superior. Diferenciar reintentar, recuperar y entrar; sin crear otra cuenta silenciosamente.
3. Excluir un segundo intento mientras entra y dar feedback inmediato. Manejar offline/error y devolver control sin reintentos automáticos.
4. Resolver reglas efectivas de una run desde su snapshot para todas las previsualizaciones; contenido actual para una run nueva. No duplicar fórmulas en JSX.
5. Verificar recorrido normal y adverso, cancelar/cerrar, ES/EN×packs y foco; revisar una muestra seleccionada antes de la matriz.

**Salida verificable:** ninguna acción queda deshabilitada sin causa/salida visible en los casos definidos; un POST de entrada en curso; error/recuperación accesibles en el contexto activo; preview/combate coinciden con snapshot. Tests de dominio/controlador, integración real solo donde se toque gateway/garantías y CI Linux para UI. Mantener A63 respuesta perdida y A73 recorrido completo.

## II. Elegir una unidad y un consumible con precisión

**Incluye F05/F11.** Impacto medio-alto en decisiones con repetidos; esfuerzo bajo-medio; riesgo: modificar una instancia distinta o consumir al consultar. No cambiar reglas de asignación ni crear bolsa.

Recorrido: consultar Encuentro o preparar duelo → identificar puesto/origen → previsualizar → elegir/quitar → cancelar o confirmar → comprobar exactamente la consecuencia.

Secuencia propuesta:

1. Fixture con dos instancias de la misma identidad/condición, una propia y otra temporal; diferencia de equipo. La operación sigue usando sus IDs existentes.
2. Reutilizar ordinal/procedencia y nombres/descripciones accesibles ya presentes en portadores/arena para los objetivos del Encuentro y sus resultados.
3. Unificar tarro del duelo y jefe: existencias×N, asignaciones provisionales y consumo al confirmar, sin fracción de progreso. Ayuda opcional conserva probabilidades de la fuente correcta del incremento I.
4. Verificar dos elecciones posibles, cancelar, recargar y respuesta perdida. Sin anuncio de sabor al consultar/asignar; sabor solo en combate confirmado.

**Salida verificable:** se elige el ID correcto con teclado/toque, y preview/receipt coinciden; stock/borrador/consumo inequívocos; sin nuevas monedas, concesiones o cambios de balance. Respuesta perdida consume una vez. Afirmar comprensión humana requiere observarla después.

## III. Mantener presencia ilustrada en arena móvil densa

**Incluye F06.** Impacto visual alto; esfuerzo medio; riesgo de reflujo, foco y rendimiento. Dependencia: baseline A73 congelado y fixtures declaradas. No requiere producir personajes nuevos ni rehacer jefe A71.

Recorrido: leer jefe → preparar → confirmar → ver diez unidades y acción → pausar/inspeccionar/2x/omitir → entender resultado → usar botín.

Secuencia propuesta:

1. Medir en Linux alturas reales de cabecera/controles/peanas, rectángulo útil de figura y espacio para nombres de una/dos líneas. Conservar los siete PNG A73 como referencia y una fixture5×5 declarada, no una nueva composición de campaña.
2. Comparar dos composiciones con assets actuales: reducir reserva superior y redistribuir peanas frente a encuadre local de figuras. Elegir por visibilidad/lectura, no por número de adornos.
3. Mantener todos los participantes, nombres/PV y controles; inspectores/texto ampliado pueden desplazarse. No ocultar filas para aparentar que cabe.
4. Si hace falta énfasis de actor/objetivo, usar el reloj y eventos confirmados existentes; gesto finito/localizado y equivalente reducido. No nuevo resultado ni rig corporal ficticio.
5. Revisar muestra por pack en contexto antes de ampliar. Cubrir3×3/5×3/5×5 y tamaños acordados; comparar rAF/arranque con condiciones equivalentes A73 y conservar regresiones/desfavorables.

**Salida verificable:** mejora de área útil/encuadre de figuras registrada frente al baseline sin perder datos, regiones táctiles ni foco. Sin reconstrucciones/efectos continuos nuevos innecesarios, pausa/hidden/omisión/fallback mantienen log y resultado. No declarar emoción/ritmo mejorados solo por una captura.

## Backlog posterior y dependencias

| Prioridad | Finding / alcance | Impacto | Esfuerzo estimado | Dependencia y riesgo | Aceptación |
|---|---|---|---|---|---|
| 1 | F01 sesión y recuperación | Alto en el estado | Medio | Controlador, gateway, UI global; no perder owner/key | F01, incremento I |
| 2 | F03 reglas de snapshot | Alto para run antigua | Bajo-medio | Una fuente de proyección; compatibilidad de runs sin snapshot | F03, incremento I |
| 3 | F04 error en inspector | Medio-alto | Medio | Top-layer/foco; evitar anuncios dobles y falsa cancelación | F04, incremento I |
| 4 | F02 entrada pendiente | Medio | Bajo | Entrada global; cookie/player coherentes | F02, incremento I |
| 5 | F05 instancia del Encuentro | Medio-alto | Bajo | Reutilizar identidad de formación, no IDs técnicos | F05, incremento II |
| 6 | F11 gragea consistente | Medio | Bajo | Stock/borrador existentes; source efectiva I | F11, incremento II |
| 7 | F06 arena densa | Alto visual | Medio | Layout y reloj A73; sin nuevos assets por defecto | F06, incremento III |
| 8 | F09 iconos sin arte | Medio en fallo | Bajo | Artwork/consumidores; fallback visible puntual | Casos F09 |
| 9 | F10 preferencia reducida | Medio en sistema reduce | Bajo | Semántica real del ajuste y persistencia | Cuatro combinaciones F10 |
| 10 | F07 consultar ruta/lista | Medio táctico | Medio | Decidir solo datos públicos a mostrar; no cambiar avances | Casos F07 |
| 11 | F08 colección amplia | Medio al crecer | Medio | Filtro/agrupación por afinidad, selección por instancia | Fixture30copias F08 |

Esfuerzo es estimación relativa, no compromiso de días. F09/F10 pueden acompañar un incremento si hay capacidad sin ampliar su riesgo; no son condición para resolver primero los errores de sesión. F07/F08 no deben retrasar indefinidamente I–III.

## Plan de pruebas para la siguiente fase

1. **Antes del cambio:** comprobar Git/SHA/CI, preservar trabajo ajeno y guardar contrato; usar baseline/evidencia válida existente. Una captura histórica no sustituye referencia del código real.
2. **Reglas/proyección:** TDD de comportamientos nuevos, snapshots divergentes, recursos/IDs, defaults antiguos. Evitar tests de estructura interna o solo clases CSS.
3. **Cliente y servicios:** entrada en curso/401, operación precommit/postcommit, dos pestañas y owner mismatch. PG/Redis reales cuando cambien garantías afectadas; no usar partida habitual.
4. **Gráficos Linux en serie:** una batería, guard/lock/watchdog, un worker/0retries; ES/EN×packs y1280×900/390×844/865×1079 en los casos pertinentes. No producto cartesiano indiscriminado.
5. **Inspección artística:** imágenes seleccionadas explícitas y observación dinámica permitida de actor/objetivo. Si no hay evidencia temporal, reconocer esa reserva; no llamar animación validada a un PNG.
6. **Regresiones:** A63 preparación/compra/apertura/recuperación, A70/A71 jefe, A73 expedición, intenciones/Halloween y PWA conforme a código afectado. Reutilizar objetos idénticos; no repetir baterías por cambiar solo documentación.
7. **Cierre:** tipos/build/tests, SHA real probado, coverage/omisiones, medidas comparables y límites; no declarar listo porque el detector no encuentre nada.

Mac: la única excepción local de navegador es `npm run test:browser:local` con sus controles. No usar Chrome/Browser/scripts alternativos para obtener evidencia. Las comprobaciones extensas y WebKit permanecen en CI Linux. No cerrar procesos ajenos.

## Sesión humana posterior, breve y sin explicar cómo

Usar una cuenta de prueba que la persona consienta; no manipular la habitual. Preparar objetivos, no instrucciones de interfaz:

1. «Prepara una expedición con este equipo y entra en la ruta».
2. «Elige el camino que prefieras hacia el jefe; explica qué esperas encontrar».
3. «Mejora la condición de este integrante concreto» (dos personajes repetidos).
4. «Prepara una gragea para el próximo combate sin gastarla todavía».
5. «Durante el combate, señala quién actúa y quién recibe la acción».
6. «Usa algo de lo que has ganado y decide qué harías después».

Observar sin ayudar inicialmente: objetivo percibido, qué toca/lee, expectativa antes de confirmar y consecuencia que reconoce. Registrar dudas, errores, pausas y ayuda necesaria con tiempos medidos **en esa sesión**, no estimados desde automatización. Preguntar después por motivo de elección y repetición, sin sugerir una respuesta.

Dos hipótesis prioritarias: **H1**, las instancias/objetos/preview permiten anticipar la consecuencia correcta; **H2**, las figuras y fases permiten seguir actor/objetivo en5×5 móvil sin perder información. Preparar también un caso de recuperación consentido, sin caducar una sesión personal. Prueba física y lector hablado separados de toque emulado/DOM.

Esta sesión no se ha realizado. No es requisito para terminar esta documentación ni autoriza implementar sus propuestas.
