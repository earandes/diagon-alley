# A87 · Escenarios de aceptación antes de código

Diseñados, **todavía no ejecutados**. No son partidas humanas ni promesa de balance. Fijar semilla, HP/PM, orden y reglas de cada fixture; publicar también resultados desfavorables.

## Reglas y renuncias

| Caso | Situación/acción | Resultado requerido |
|---|---|---|
| Umbral | 2/3/4/5 identidades vivas del grupo | 0/I/II/II; copias repetidas no sustituyen identidades |
| Procedencia | Mismo grupo propio/temporal/encantado | Igual contribución; nunca propiedad por reclutar o multiplicador por acabado |
| Exclusión | Snape y dos Slytherin, vínculo Mortífagos | Solo efecto de vínculo seleccionado; afinidad independiente conservada |
| Auto | Tres criaturas y starter sin casa activa | Criaturas efectivo, fijado en input antes de resolver; sin tocar formación o ruta |
| Orden | Dos aliados heridos, contribuyente actúa | Ayuda al otro vivo con menor fracciónPV; empate por formación; 1/2PV según nivel |
| LímiteOrden | Otro contribuyente actúa en la misma ronda | No segunda ayuda; si no hubo curación anterior no se desperdicia el cupo |
| RenunciaOrden | Último contribuyente herido sin otro vivo | No autocura. Hufflepuff sí puede sanar a su propio contribuyente en su turno |
| VentajaOrden | Primer aliado herido no pertenece aOrden | Puede recibir ayuda; no recibiría curación de casaHufflepuff por no contribuir |
| Remate | Objetivo en51%/50%/menos de50% antes del golpe | Bono solo en50% o menos; no cambiar objetivo o azar; después del multiplicador de gragea |
| RenunciaRemate | Rival rápido derriba antes de actuar | Comparar con iniciativaSlytherin, sin garantizar que el remate compense |
| Guardia | Primer fallo/daño bruto0 y posterior acierto positivo | Fallo/0 no gastan. Acierto bloquea hasta2/3brutos una vez por aliado; registrar cantidad |
| RenunciaGuardia | Combate largo, varios golpes y quemadura | Solo primer impacto; no reducir quemadura o conservar sobrante. Comparar con curación sostenida |
| Bloqueo | Cae un contribuyente durante replay | Activación inicial sigue fija, como casas. Siguiente combate cuenta condición actual |
| Historial | engine1/2 y run anterior sinreglas3 | Eventos/resultados originales idénticos; no aplicar grupos vivos nuevos |

El renderer proyecta daño/curación ya confirmados. No vuelve a aplicar guardia/remate; `healed.actorId` sigue siendo receptor y `healerId` identifica al ayudante deOrden. Afirmar «bloqueó2» describe daño bruto registrado, no garantiza2PV de supervivencia si ya había exceso de daño.

## Recorrido y autoridad

- Elegir vínculo en preparación nueva viaja enStartRunRequest; cambiar durante run viaja enSetTeamRequest. Consultar/cancelar no guarda ni consume. La elección efectiva de combate queda en snapshot.
- Misma operación recupera recibo; otra selección con igualkey da conflicto; dos pestañas con revisión antigua no guardan dos formaciones. Una respuesta perdida conserva propietario y petición completos.
- Tres Pactos fijan tres criaturas distintas como alternativas de casa; no reroll por idioma, reload o consulta. No añadir un cuarto Pacto, coste o regalo permanente.
- Apertura confirma identidad/copia/acabado y tabla4 en transacción; 33tickets uniformes. Cliente desactualizado debe actualizar y reconfirmar. Recibos anteriores conservan tabla3.
- Primera victoria a ambos lados de contenido táctico3→4 conserva campaña1 y una sola concesión histórica.
- Cromodex incluye34identidades, no68por acabado ni recuerdos estacionales. Temporales no aparecen como descubiertos propios. Metadatos actuales de identidad no reescriben snapshots antiguos.

## Presentación y recursos

Dos poses pintadas por especie, contacto estable y cambio con reloj existente; no rig corporal. Efectos y sonido dependen de evento confirmado. Una voz de lanzamiento por acción; sonido solo con preferencia existente habilitada. Reducido usa imagen/indicador estático equivalente. Pose ausente cae a reposo, no bloqueo del resultado.

Validar enLinux original, secuencial: ambos packs/idiomas, tres tamaños, diez unidades, foco/teclado/toque emulado/texto ampliado, pausa/2x/ocultación/omisión, recurso ausente/import fallido, operación perdida y consulta histórica. La muestra artística estática previa no acredita esa integración.
