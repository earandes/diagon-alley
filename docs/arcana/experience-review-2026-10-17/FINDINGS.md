# A74 · Registro consolidado para fixes posteriores

Baseline `937a0a1`. Rutas abreviadas desde `src/arcana/presentation/`, salvo indicación. Las líneas corresponden al baseline, no a una implementación futura. P1 = impacto alto en un estado concreto; P2 = defecto de comunicación/elección o compromiso visual relevante. Frecuencia no medida.

Tipos de evidencia: **C** = comprobado en código; **V** = observado en PNG actual seleccionado; **T** = ejecución técnica identificada; **H** = hipótesis de experiencia. Ninguna C se presenta como reproducción de navegador. Las pruebas generales que pasan no demuestran que un caso adverso no cubierto funcione.

## F01 · P1 · La sesión inválida puede dejar al jugador sin recuperación general visible

**Evidencia C:** `App.tsx:471–491` excluye `UNAUTHORIZED` del aviso global; entrada/creación de sesión solo se pinta con `!game` (`:423–438`). `application/client/game-controller.ts:218–240` conserva `game`, pone `status:error` y limpia una operación rechazada definitivamente. El gateway rechaza una cookie expirada/revocada con 401 (`infrastructure/http/trial-gateway.ts:11,67–69`). Origen B01.

**Caso para reproducir después:** cargar una cuenta aislada, expirar/revocar su sesión, confirmar una acción y cerrar el diálogo. El modelo conserva partida y error, mientras el banner general omite ese error y la entrada no se muestra. Un modal puede tener su propio error; no resuelve la salida general al cerrarlo. La recarga manual puede devolver la bienvenida. No se demuestra pérdida de inventario.

**Problema → cambio mínimo:** falta explicar por qué no se puede continuar → estado global visible/localizado de sesión y siguiente acción alcanzable, distinguiendo operación pendiente, recarga y nueva entrada. No crear otra cuenta ni descartar la intención anterior silenciosamente.

**Resultado esperado:** reconocer el bloqueo y continuar por una vía explícita sin riesgo de mezclar jugadores.

**Aceptación posterior:** mapa/tienda/colección y modal cerrado, ES/EN, teclado; error anunciado una vez y recuperación disponible. Con respuesta incierta conservar key/player, no repetir gasto ni trasladar recursos a una cuenta nueva. Test de controlador + integración de gateway y gráfico Linux de la salida completa. No hace falta construir autenticación productiva.

## F02 · P2 · Falta estado inmediato de entrada en curso

**Evidencia C:** `App.tsx:327–341` ejecuta el POST de entrada fuera de `GameController.busy`; el botón solo usa `state.status==='loading'` (`:431`). Tras el 401 inicial, durante la espera de ese POST puede seguir en error. Dos peticiones sin cookie pueden crear IDs distintos en el gateway (`trial-gateway.ts:41–55`). Origen B02.

**Problema → cambio mínimo:** red lenta permite varios intentos sin feedback → una exclusión de entrada y estado pendiente desde la primera activación, liberados en éxito/error. No se afirma que ya hayan aparecido dos cuentas en una sesión real ni que se duplique un premio dentro de una cuenta.

**Resultado esperado:** una entrada deliberada corresponde a una petición activa y a la cuenta que se carga.

**Aceptación posterior:** retener respuesta de entrada; doble toque y Enter repetido emiten un POST activo, indicador inmediato ES/EN. Error vuelve a permitir un intento deliberado; éxito carga cookie/player coherentes. No probar sobre la cuenta habitual.

## F03 · P2 · Algunas previsualizaciones leen reglas vivas en lugar del snapshot activo

**Evidencia C:** `ExpeditionPreparation.tsx:458–463` pasa `content.combatRules` a `PreparationSynergies`; `BeanAssignments.tsx:50–55,162–182` usa las reglas vivas para sinergias y pesos de sabores. `contextual-preparation.ts:69–80` proyecta los valores recibidos. El avance usa `original.campaignSnapshot ?? this.configuration()` (`application/run-use-cases.ts:298`); el detalle de nodo ya pasa reglas congeladas (`App.tsx:657`). Origen B03, ampliado al consumidor de grageas por el coordinador.

**Condición:** el valor visible solo difiere numéricamente si reglas vivas y snapshot difieren. No se ha probado que eso ocurra en una partida actual. El combate autoritativo permanece correcto; el fallo está en la fuente de la consulta.

**Problema → cambio mínimo:** la preparación podría prometer otro bono/tabla → resolver una fuente efectiva común por run/snapshot, con fallback histórico explícito y contenido vivo para una nueva expedición. No cambiar reglas, historial ni porcentajes para esconder la divergencia.

**Aceptación posterior:** fixture con valores distintos de Alquimia/Fuego/Sombras y pesos de sabores entre snapshot/vivo; todas las consultas de la run antigua muestran su fuente congelada y el combate usa la misma. Nueva run muestra versión vigente. ES/EN×packs, sin mutación por consultar ni cambio de probabilidades reales. Revisar también la afinidad de una copia que entra por primera vez en una run antigua, sin presumir aquí otro defecto no reproducido.

## F04 · P2 · El error de equipar puede quedar detrás del inspector activo

**Evidencia C:** `<dialog>.preparation-inspection` en `ExpeditionPreparation.tsx:576–660`, equipamiento dentro en `:645–654`. `PreparationGear` no recibe error/pending/recovery; los avisos están en el diálogo inferior (`App.tsx:967–971`) y en la página. Origen B04.

**Problema → cambio mínimo:** tras un fallo o respuesta incierta, el modal superior puede bloquear el acceso al único mensaje → presentar estado/recuperación en el contexto activo o cerrar de forma controlada y enfocar el mensaje pertinente. No interpretar cerrar como cancelar un commit iniciado.

**Aceptación posterior:** equipo→inspector→equipar, con rechazo precommit, respuesta perdida postcommit, offline y fallo de almacenamiento de intención. Mensaje y acción alcanzables sin salir a ciegas; misma key/receipt al recuperar, foco estable, anuncio único y ES/EN. El workaround actual es cerrar el inspector; su necesidad no se ha probado con una persona o lector.

## F05 · P2 · Encuentro identifica personaje, pero no instancia

**Evidencia C/V:** `EncounterPreparation.tsx:181–229` usa nombre por `wizardId` como `aria-label` y muestra nombre/PV/PM; no ordinal, copia ni procedencia. Dos instancias del mismo personaje y condición pueden tener el mismo nombre y contenido visible. Los PNG actuales de antesala contienen dos Ginny/dos Tejedoras y prueban que pueden coexistir duplicados, no el aspecto de este Encuentro. Origen A-04.

**Problema → cambio mínimo:** elegir una unidad no garantiza reconocer qué instancia se cambia → reutilizar ordinal de formación y origen propia/temporal en objetivo y previsualización; nombre/descripción accesibles incluyen esos datos. Mantener `unitId` como identidad de operación, no añadir IDs técnicos visibles.

**Aceptación posterior:** dos copias/temporales de igual identidad y PV/PM, diferente equipo; elegir inequívocamente puesto 2 o 4 con teclado/toque. Preview y receipt afectan exactamente al ID elegido; cancelar no opera. Ambos packs/idiomas. DOM accesible comprobable, lector hablado pendiente de prueba específica.

## F06 · P2 · Arena móvil 5×5 pierde protagonismo ilustrado

**Evidencia V/C:** [imagen actual de 390×844](../fluency-increment-2026-10-17/evidence/final/selected-paused-resize.png), fixture densa declarada. Se ven diez nombres/PV; figuras pequeñas frente a rótulos. `arena-a63.css:152–166,242–251`, `BattlePanel.tsx:422–468`. Desktop 3×3 da más presencia al personaje. Origen A-01.

**Interpretación:** las etiquetas pasan a ser el elemento dominante y el personaje parece un marcador. No se demuestra ocultación, recorte, lentitud o dificultad humana para seguir la acción.

**Cambio propuesto:** ensayar redistribución del espacio de cabecera/controles y alturas de unidades; encuadre con assets existentes y énfasis localizado de actor/objetivo. Probar nombres de una/dos líneas. No ocultar unidades, reducir texto funcional, montar un carrusel de combatientes ni rehacer todo el arte.

**Aceptación posterior:** comparar área útil de figuras y lectura completa en 390×844, 865×1079, 1280×900; control adicional de reflujo a 320/texto ampliado. 3×3,5×3,5×5, ambos packs/idiomas; diez figuras/nombres/PV sin solapamientos, foco y controles accesibles. Clip dinámico Linux breve seleccionado solo si autorizado por política; en su defecto observación dinámica permitida en CI con fases/posiciones y declarar límite artístico. Pausa/2x/omisión/reducido/fallback conservan log. Contrastar rendimiento equivalente con A73, sin trasladar esperas.

## F07 · P2 · Consulta de ruta y avance comparten bloqueo; la lista no expresa conexiones

**Evidencia C:** `MapPanel.tsx:84–143` deshabilita nodos no disponibles; `:157–160` reutiliza el mismo control en una lista inversa. Los trazados representan relaciones visualmente, pero el listado no identifica fila/rama/origen/destinos. Costes/consecuencias disponibles incluyen contenido visualmente oculto (`:127–141`). Orígenes A-02+B05, consolidados para no duplicar el mismo recorrido.

**Problema:** puede verse una ruta futura sin consultar sus datos congelados por toque/teclado, y dos nodos iguales no explican bien su relación en la lista. Acciones de avance sí son equivalentes. No se demuestra una ruta incomprensible ni se autoriza revelar secretos o futuros resultados aleatorios.

**Cambio propuesto:** separar consulta de solo lectura y resolución; como opción de composición, un libro de ruta con tipos/datos públicos y relaciones mínimas. Estado/coste/bloqueo de avance se conservan. Sin tabla permanente o botones equivalentes acumulados.

**Aceptación posterior:** dos opciones del mismo tipo y rama divergente; nombres/relaciones distinguibles por teclado/toque/AT, consulta sin POST de avance ni cambio de inventario, cancelación devuelve foco. Bloqueado nunca puede resolverse. Antes de implementar concretar qué datos ya públicos se muestran; ampliar información estratégica no pública requiere decisión aparte.

## F08 · P2 · Preparar muchas copias obliga a memorizar páginas

**Evidencia C:** `ExpeditionPreparation.tsx:284–285,473–573`: páginas de seis en orden de copias y anterior/siguiente, sin agrupación por afinidad/identidad. La afinidad se consulta en inspector (`:640–644`). Puestos seleccionados visibles mitigan el problema. Origen A-03.

**Cambio propuesto:** agrupación/filtro visual a demanda por afinidad e identidad; conservar selección e inspección por instancia, equipo diferente y cinco puestos. No añadir una bolsa ni trasladar configuración al álbum.

**Aceptación posterior:** fixture de al menos 30 copias con duplicados; localizar una afinidad sin recorrer páginas de otras, elegir dos instancias concretas, conservar borrador al filtrar/swap/idioma, confirmar IDs correctos. Filtro vacío y limpieza accesibles/localizados. No se atribuye este coste al starter de una copia ni se han medido tiempos humanos.

## F09 · P2 · El cambio mapa/lista queda sin señal visible al fallar su arte

**Evidencia C:** `Artwork.tsx:19–28` devuelve null al agotar recursos; `MapPanel.tsx:148–155` depende de arte decorativo con texto visualmente oculto. Conserva nombre accesible/title y funcionamiento; falta una señal visible propia en el caso de fallo. Origen B06, **corregido parcialmente al contrastar CSS**: Ajustes sí revela su texto sin imagen mediante `game-stage.css:1159–1175`; esa mitad del finding independiente se descarta. No se localizó un fallback equivalente para `.map-view-toggle` en los estilos activos.

**Cambio propuesto:** símbolo/texto breve localizado como fallback visible cuando falta ese arte, conservando el nombre. No producir otra familia de imágenes ni imponer texto permanente si el icono carga.

**Aceptación posterior:** fallar ui.map/ui.missions individualmente, con swap; poder identificar y accionar el cambio de vista por toque/teclado. Verificar fallback visible, no solo enabled/aria-label. Conservar la solución ya existente de Ajustes; no reimplementarla. No afirmar que el conjunto de la aplicación deja de funcionar sin arte.

## F10 · P2 · El toggle de movimiento mezcla preferencia propia y estado efectivo

**Evidencia C:** `useReducedMotion.ts:35` calcula `system || own`; `GameSettings.tsx:103–110` anuncia `aria-pressed={reduced}` pero invierte `ownReduced`. Con sistema activo la acción puede guardar otro valor sin cambiar el estado anunciado. Origen B07.

**Cambio propuesto:** explicar precedencia del sistema o separar la elección propia del estado efectivo con semántica congruente. Mantener la protección del sistema, omisión y resultado estático; no desactivar forzadamente reduced.

**Aceptación posterior:** cuatro combinaciones system/own, usando Ajustes real, recarga y cambio durante replay. Estado guardado/efectivo comprensibles y comprobables; sin reiniciar replay o alterar inventario/log. El caso A73 que cambia la prop no valida este toggle real.

## F11 · P2 · La fracción de grageas reaparece en el duelo ordinario

**Evidencia C:** `App.tsx:703–721` muestra asignadas/stock como fracción en el summary del duelo, mientras `BossSupplies.tsx:10–34` presenta ×stock y borrador sin consumir. El significado numérico no es un requisito de completar un paso; asignar es opcional. Finding del coordinador, no visualizado en un PNG actual de duelo ordinario.

**Problema/H:** dos gramáticas para el mismo objeto; 0/1 podría parecer una tarea pendiente. La confusión humana es hipótesis, la divergencia de presentación es comprobable.

**Cambio propuesto:** reutilizar la distinción existencias×N / asignadas sin consumir en duelo y jefe, sin repetir bloques, añadir una segunda bolsa o operar automáticamente.

**Aceptación posterior:** stock 0/1/varios y borrador 0/1/varios, en ambos tipos de combate. Estado vacío no obligatorio, preview de portador correcto, cancelar no consume ni descubre, confirmar combate consume una vez. ES/EN, teclado/toque y origen del foco conservados.

## Oportunidades y límites que no se convierten en nuevos bugs

- **Entrada y confianza:** `App.tsx:423–437` oculta visualmente la nota sobre ensayo/cookie. Ajustes sí permite consultar guardado. Conviene probar una nota breve visible antes de entrar, sin añadir una pantalla legal. No prometer recuperación productiva o sincronización que no existen. Es una propuesta de comunicación; esta revisión no diseña cuentas.
- **Atlas/Misiones:** `JourneyCabinet.tsx` utiliza métricas y destinos existentes; el futuro sigue no jugable. Revisar con persona si añade orientación respecto del cierre/intención, antes de eliminarlo o añadir más misiones. No hay evidencia actual de que estorbe.
- **Estilo de aliados ARCANA/Diagon:** bustos y figuras completas tienen pesos distintos en las muestras de arena. El jefe A71 conserva encuadre propio. No se declara un error de arte universal ni se aprueba un lote nuevo; medir primero encuadre/área en F06.
- **Documentación de estado:** REQUIREMENTS-STATUS/FINAL-ACCEPTANCE/PHASE-4 mantienen cabeceras históricas que no resumen A73. Enlazar un índice actualizado en una fase documental posterior; no interpretar sus antiguas cifras como resultados actuales.
- **Rendimiento:** conservar resultados favorables y desfavorables A73; un chunk de entrada >500kB es un aviso, no una causa probada de lentitud actual. No abrir otra optimización sin medición causal.

No hay fix aplicado por escribir este registro. La aceptación de propuestas, la ejecución gráfica de casos nuevos y la observación humana son etapas posteriores diferenciadas.
