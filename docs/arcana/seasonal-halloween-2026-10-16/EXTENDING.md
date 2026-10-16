# Añadir una celebración y una edición

## Fronteras actuales

`domain/seasonal/events.ts` contiene una familia pequeña: tres objetivos ordenados, una oportunidad por posición de expedición desde dos visitas, reparar o intercambiar condición con las reglas existentes. No interpreta scripts ni contratos arbitrarios. `application/seasonal-events.ts` coordina reloj, revisión, condición, progreso, concesión y receipt. El cliente solo solicita participar/reparar/aprovechar; nunca envía progreso, premio o tiempo.

`content/halloween-2026.json` define evento recurrente `enchanted-windows`, edición `halloween-2026`, versión1, tresIDs, recuerdo `lantern` y tres instantes en milisegundos UTC. `timezone` controla presentación, no aritmética de calendario. Fuente humana equivalente:16octubre2026 00:00+02 →2noviembre2026 00:00+01, gracia hasta3noviembre00:00+01. Considerar cambio de horario al editar. `infrastructure/content/seasonal-content.ts` valida; composición HTTP inyecta el proveedor y el reloj Redis. `PublicContent.seasonalEdition` publica la misma definición validada. No existe interruptor público del reloj.

PostgreSQL `arcana_seasonal_state` conserva JSONB validado con FK a cuenta. La transacción y lock de cuenta existentes cubren estado, run, operaciones y recuerdo. No se crea saldo estacional, inventario paralelo, tablas de cromos o derecho de victoria. El journal cliente reconoce `seasonal-event`, conserva request/key/revisión y consulta `/api/operations/:id` antes de reenviar tras incertidumbre.

## Nueva edición anual

1. Crear archivo nuevo, p.ej. `halloween-2027.json`. Conservar eventId; elegir editionId nuevo, versión1, objetivosIDs de significado compatible y nuevos instantes explícitos con offsets convertidos aUTC. Conservar histórico del2026.
2. Validar definición. La concesión se identifica `seasonal:<editionId>:<keepsakeId>`; versión de contenido no se usa como multiplicador de premio. Misma edición no concede otro recuerdo por subir versión.
3. Cambiar proveedor público/servidor juntos durante admisión planificada. No modificar datos guardados. Cada participación conserva definición original. Actualizar una edición incompatible requiere ID nuevo o migración explícita fuera de este incremento; no se migra silenciosamente.
4. Participaciones nuevas empiezan con0/3 y nuevas oportunidades. Historia/recuerdos anteriores permanecen. La UI permite consultarlos; una participación anterior todavía vigente tiene prioridad y se puede terminar durante su gracia.
5. Política actual: una participación incompleta y no cerrada a la vez. Se permite consultar otras y participar después del cierre o finalización de la anterior. No hay composición arbitraria de beneficios de dos eventos. Planificar calendarios sin solapamiento si no se desea esta exclusión.
6. Ejecutar validadores, tipos/build, unitarios y PGRedis: bordes exactos, snapshotsv1/v2, dos conexiones, respuesta perdida, invariantes económicos, nueva edición y concesión antigua. Matrices gráficasLinux; Mac solo smoke permitido. No publicar sin autorización nueva.

Cambiar o retirar la definición pública no borra una participación. La consulta usa las definiciones congeladas; una run ya admitida puede terminar hasta su límite. StartRun no vincula expediciones iniciadas durante la gracia. Al terminar la gracia se conserva progreso parcial, pero no se convierte en recompensa. Una confirmación ya guardada siempre es recuperable, incluso con reloj o configuración temporalmente indisponibles.

## Navidad documentada, no implementada

«El correo perdido de las lechuzas»: tres sobres han llegado a escaparates equivocados. El jugador sigue pistas entre etapas, decide entregar el sobre ahora o desviar su magia para recuperar condición, y conserva una postal sin poder ni valor económico.

Reutiliza participación/calendario, checkpoints, elección conocida, comparaciónPV/PM, progreso acumulado, concesión única, histórico, teclado/reducido y recuperación. Tres entregas iluminan tres escaparates; no exigir login diario ni colecciones raras. Puede usar exactamente la familia actual si cada entrega es ordenada y el desvío usa el mismo intercambio.

Datos: otro eventId `owl-post`, edición `christmas-2026`, fechas/zonahoraria explícitas, tresobjetivosIDs y un keepsakeId `winter-postcard`. No se añade este archivo activo ahora ni se habilita el evento.

Arte: sobre/sello/lechuzacomoobjeto de invitación, postal y variantes de ventana; fuentes editables, mismos encuadres y nombres accesibles fuera del dibujo. Reusar fondos y fachadas. No se ha producido este lote.

Código: la presentación actual está escrita para Halloween. Añadir los textos/IDsdepresentación de Navidad y selección explícita por eventId (ES/EN/ambospacks) requiere una pequeña adaptación de UI/manifest, no un editor. La mecánica actual solo permite entregar en orden. Si las pistas permiten elegir destinatario, equivocarse o transportar un sobre, será una mecánica nueva: contrato, tipos/request/preview, snapshotversionado, reglas de consecuencia y pruebas antes del código. No afirmar que puede activarse únicamente cambiando un JSON.

## Qué se cambia dónde

| Cambio | Datos | Arte | Código/pruebas |
|---|---|---|---|
| Otra edición del mismo Halloween | calendario/editionId/version/IDs | opcional con procedencia | verificar invariantes/calendario; UI del año derivada |
| Tresobjetivos con misma reglaPV/PM | IDsdefinición | variante si necesaria | textos e identidad de situaciones en presentación |
| Navidad con entregas ordenadas | nueva definición/proveedor | sobres/postal | ampliar presentación por eventId, sin engine nuevo |
| Elegir destinatarios/pistas ramificadas | datos tras contrato | escenas/objetos | comportamiento nuevo explícito; no soportado ahora |
| Dos eventos combinados | política pendiente | pendiente | deliberadamente no implementado |

El servidor es el único lugar para configurar reloj de ensayo mediante inyección en tests/composición aislada. No añadir botones de “adelantar fecha”, progreso o concesión en cliente. Las pruebas usan cuentas generadas y nunca la partida habitual.
