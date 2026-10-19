# Estado contrastado y oportunidades

## Método y límites

Lectura de AGENTS, PRD, DECISIONS, DESIGN y README, fuentes vigentes enumeradas en `sources.json` y código de consumidores indicados abajo. Las referencias históricas A63/A65/A67/A68/A70–A76/A85–A88 se contrastan con el registro actual y los consumidores pertinentes, sin repetir íntegramente aquellas auditorías. Algunas cabeceras históricas dicen «pendiente» o «sin main» para su momento; prevalecen las actualizaciones posteriores y el código actual. A69 documenta el cierre técnico de Halloween; no se toma la validación parcial inicial A68 como estado final. No hubo recorrido dinámico nuevo ni pruebas con jugadores en esta investigación.

No se consultaron cuentas, inventarios personales, bases de la partida habitual ni datos de uso. Las cifras de CI citadas son **evidencia histórica documentada**, no ejecuciones nuevas de este estudio. El SHA comprobado al empezar es `d4a6d36fd0b1fb96ab4f3e8a071c88cfc5621f1f`; `git status --short --untracked-files=no` estaba vacío. Se conservan archivos no rastreados, incluido el estudio de despliegue previo.

## Inventario actual: evitar proponer lo ya entregado

| Área | Comprobado en código/documentación | Oportunidad restante, no defecto humano observado |
| --- | --- | --- |
| Acceso | Bienvenida, invitado, registro/login, vínculo y recuperación de cuentas A76–A82; `AccountAccess.tsx`, `GameSettings.tsx` | HTTPS, envío externo y operación del piloto siguen sin implementarse; no «añadir login» de nuevo |
| Preparación | Cinco puestos, copia exacta, origen, condición, equipo y borrador de grageas; filtros A75; `ExpeditionPreparation.tsx` | Recuperar un plan de formación y comprender cómo alcanzar un vínculo, sin duplicar equipamiento |
| Pacto | Dos candidatos, elección/consulta/cancelación, acceso temporal a casas y criaturas A87 | Vincular comparación con la intención elegida y las amenazas públicas |
| Vínculos | `combat/bonds.ts`, `houses.ts`: casas/Orden/Mortífagos/criaturas, único enfoque, tres identidades vivas para nivel I y cuatro para II | Extender las intenciones antiguas a esos vínculos; no apilar afiliaciones/oficios |
| Afinidades | Motor conserva alquimia/fuego/sombras y neutral sin bono | Explicar diferencia entre afinidad, biografía y vínculo; no inventar tipos de daño |
| Colección | 30 identidades iniciales + cuatro criaturas; clasificación, rareza, descubrimiento, acabado y copias; `CollectionPanel.tsx` | Objetivo seleccionado y fuentes públicas; filtros y contadores no son nuevos |
| Encantado | Acabado cosmético independiente 1%, sin ×2, no otra identidad | Mantener sorpresa sin convertirlo en requisito de poder o completitud base |
| Intenciones | `domain/exploration/intentions.ts`: `new-companion`, `synergy` de afinidad, `bean`; disponibilidad/progreso desde receipts | No hay opción específica de vínculo de casa/Orden/Mortífagos/criaturas en ese contrato |
| Encuentros | `progression-content.ts`, `encounter-trades.ts`: tratos PV/PM deterministas y pasar | Una consecuencia posterior pequeña; no volver a implementar dos botones PV/PM como novedad |
| Equipo | ForgeV2 potencia/iniciativa/recuperación, comparación compartida, instancias históricas | Facilitar planes alternativos; demostrar casos de conveniencia antes de añadir otra pieza |
| Desafíos | Descubrimiento/Táctico/Maestría ya implementados, mismas condiciones económicas | Evidencia finita de dominio y recomendación viable, no «introducir dificultades» |
| Arena/jefe | Cabecera propia, figuras/PV, pausa con opciones; reloj compartido, omisión, fallbacks | Explicar hechos tácticos también tras duelos ordinarios, sin reabrir la reescritura artística |
| Hechos de cierre | `boss-facts.ts`/`BossBattleFacts.tsx`: hasta dos hechos de gragea, curación o afinidad | Añadir vocabulario de vínculos confirmados y contexto de preparación, sin afirmar causalidad |
| Cierre/botín | `ExpeditionClosure.tsx`, flujo A63: resultado→uso de stock pendiente→siguiente expedición explícita | Elegir qué probar después con una colección concreta; no duplicar pantalla de premios |
| Halloween | Objetivos, concesión única, progreso/histórico estacional separado del álbum; documentación A69 y `SeasonalEvent.tsx` | Navidad necesita presentación/datos/arte y pruebas, no un sistema universal de misiones |
| PWA/accesibilidad/audio | Offline sin gasto, recuperación, teclado/foco/reducido; sonido voluntario A84/A88 | Contraste/tamaño propios y verificación física; no volver a añadir ajustes de audio |

## Hallazgos nuevos de esta revisión estática

**B1 · Intención y vínculos no comparten todavía vocabulario completo.** El tipo `IntentionChoice` solo enumera compañero/afinidad/gragea. `availableIntentions` calcula afinidades con reglas compartidas; no propone probar Orden o criaturas. Esto justifica PM03 como ampliación concreta. No demuestra que un jugador se haya confundido.

**B2 · El historial crece en el camino de guardado.** `src/arcana/infrastructure/postgres/game-transactions.ts` lee todos los `arcana_operations` del jugador sin LIMIT; `writeGame` borra/reinserta relaciones de agregado, incluidas operaciones, y vuelve a insertar cada receipt. Hay comentario explícito de optimizar deltas después de medir. Es un patrón contrastado, **no una latencia o pérdida reproducida**. PM14 propone medir su coste antes de cambiarlo. Añadir un diario sin esta revisión aumentaría el riesgo de cargar más historial.

**B3 · No se localizó instrumentación de producto dedicada.** La búsqueda `telemetry|analytics|trackEvent|captureEvent` en TS/TSX de `src/arcana` y `tools/arcana` no devolvió coincidencias. Existen mediciones técnicas de QA y los receipts aportan hechos del dominio; eso no equivale a un historial de visitas, abandono o retención. No se afirma ausencia de toda observabilidad externa. PM01 diseña la medición que falta para esta pregunta.

**B4 · Colección y acceso táctico son problemas distintos.** El modelo A87 da 34 identidades; tres criaturas temporales pueden probar un vínculo mediante Pactos sin poseerlas. Colección propia, nivel II y disponibilidad inicial de casas siguen siendo desiguales; A87 lo declara. Una media global de victorias no debe ocultar acceso por colección/condición.

**B5 · El 100% de equipo no es equivalente al de identidades.** El estudio A67 identifica dos ramas de bóveda y una sola llave de primera victoria. Conservar esa regla no permite prometer obtener ambos botines. La nueva ficha de completitud debe explicarlo; cambiar acceso o conceder otra llave requiere aprobación económica.

## Datos numéricos y su procedencia

- Configuración actual A87: `trial-configuration.ts` compone `trial-v1.json` y `creatures-v1.json`: 34 identidades, inicial fuera del azar, 33 tickets uniformes. Rareza no altera el peso individual en esta tabla. Acabado 1% independiente.
- Modelo exacto histórico A87: mediana 128 aperturas, P90 188, P95 211; primera copia encantada cualquiera: 69/230/299. Se recalcula la ocupación exacta en el script de esta entrega, con entradas del repositorio. No son horas ni comportamiento observado.
- Modelos de tiempo/economía A67 usan catálogo y perfiles anteriores. Sus resultados temporales **no se trasladan automáticamente a A87**. Para hablar de horas y calendario hay que actualizar financiación con composición A87 y medir duración humana.
- A88 documenta CI `39218434156` sobre `28ec176`/checkout `031ef1c`: 689 unitarias, 111 PG/Redis y 522 gráficas activas. No se repitieron aquí ni acreditan valor de producto.
- A88 conserva P95 rAF WebKit 23–24 ms en muestras declaradas y objetivo 20 ms no universalmente cumplido. Esto no mide GPU ni rendimiento físico de un móvil.

## Desconocidos que condicionan la prioridad

No sabemos todavía: tiempo humano hasta primer combate, porcentaje que entiende temporal/propio/vínculo, retorno espontáneo, frecuencia deseada de sesión, políticas reales de gasto, dificultad percibida, tolerancia a repetidos o satisfacción con audio. No hay base para afirmar que «faltan contenidos», «las cuentas no convierten» o «el juego retiene mal». El público histórico fan adulto casual es una orientación; no sustituye segmentación observada del juego actual.

Las hipótesis se contrastarán con personas invitadas voluntariamente y cohortes elegibles. Cambiar tres variables de balance a la vez impediría saber qué mejoró. La medición no debe convertir un juego ilustrado en un dashboard visible para jugadores.
