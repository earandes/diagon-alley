# A87 · Compañías, no una pila de etiquetas

Diseño de ensayo dentro de la delegación de Enric; parámetros sujetos a contraste con motor/escenarios. Implementado en rama después de integrar A85/A86. Dominio y persistencia reales comprobados; revisión gráfica Linux todavía pendiente.

## Experiencia

«Reúno personajes o criaturas, elijo qué vínculo especializa a mi formación y veo su consecuencia en el combate; conservo mis copias y puedo cambiar de plan en otra ruta». La afinidad táctica existente continúa siendo independiente. La apariencia encantada no cuenta doble.

Tres opciones de estructura: (1) todas las etiquetas otorgan pasivos: mala legibilidad y ventaja para Snape/personajes con muchas afiliaciones; (2) una afiliación sustituye la casa: borra una identidad y decisiones anteriores; (3) una elección explícita de vínculo del equipo: preserva biografía y exige renunciar a otra especialización. Elegida3. Un vínculo por bando, no casa+afiliación+naturaleza simultáneas. Auto prioriza una casa activa y, cuando no la hay, un vínculo disponible con prioridad estable; las afinidades conservan sus reglas.

## Clasificación y alcance

Cuatro casas actuales intactas. Afiliaciones: Orden del Fénix, Mortífagos, Ejército de Dumbledore como registro de vínculos históricos, sin presentar lealtades como hechos simultáneos de una fecha única. Naturaleza: persona mágica/criatura; no etiquetar muggle-born como muggle, ni a Hagrid/Lupin como animales. Oficios/escuelas existentes se conservan; alquimista y magizoólogo describen Flamel/Newt cuando corresponda. Escuela/oficio/ED no implican nuevos pasivos en este incremento. No hay muggles coleccionables actualmente; no inventar un grupo jugable vacío o no respaldado por el motor.

Primeros vínculos alternativos jugables: Orden, Mortífagos (incluye su líder, no un juicio moral universal) y criaturas. Snape puede pertenecer a dos afiliaciones históricas, pero una sola elección de vínculo puede aplicarse al combate. Las copias de una identidad contribuyen una vez. Tres identidades distintas en pie activan, cuatro refuerzan; se fija al confirmar, como casasA85. No revivir o desactivar retroactivamente por una caída durante replay.

## Alternativas iniciales estudiadas (sustituidas por las revisiones posteriores)

| Vínculo | NivelI/II | Decisión / renuncia |
|---|---|---|
| Casas | Efectos A85 sin cambios | Conserva iniciativa, primer impacto, daño tardío o PV por turno según casa |
| Orden | Recuperar2/3PM por contribuyente al inicio del combate, una vez y limitado al máximo | Útil con desgaste; a PM completos no cambia nada. Renuncia a casa y no regenera por turno, porque coste vigente1PM haría esa regeneración prácticamente ilimitada |
| Mortífagos | +1/2daño al acertar sobre objetivo que ya estaba a mitad de PV o menos antes del impacto | Rematar frente a iniciativa deSlytherin/primer impactoGryffindor. No cambia selección de objetivo ni aplica al fallo; daño final limitado a PV restantes |
| Criaturas | Reducir3/5daño del primer impacto acertado recibido por cada contribuyente | Absorción inicial frente a recuperación sostenidaHufflepuff. Un fallo no gasta la protección, no reduce quemadura y no añade una barra de escudo permanente |

No implementar estos valores sin pruebas deterministas y escenarios pareados. Si un parámetro domina en los casos declarados, ajustar dentro del alcance y conservar resultados previos. No confundir etiquetas de lore con habilidades nuevas: fénix no resucita/cura automáticamente, unicornio no concede vida eterna, dragón no golpea a todo el equipo.

## Cuatro criaturas

Fénix/Fawkes, hipogrifo/Buckbeak, unicornio y dragón galés verde. Son cuatro identidades nuevas, no variantes de personajes, suficientes para3/4. Nombres ARCANA independientes: Fénix del Alba / Dawn Phoenix; Hipogrifo del Valle / Valley Hippogriff; Unicornio Lunar / Moon Unicorn; Dragón del Bosque / Forest Dragon. Ilustración común de bestiario original donde el sujeto no depende de actor/costume oficial; incertidumbreT01 de franquicia permanece. No fotografías o audio de películas.

Estadísticas nuevas deben tener compensaciones y compararse con el presupuesto actual de personajes; no modificar sus estadísticas maestras ni equiparar rareza con poder. Afinidades existentes exclusivamente. Equipo sigue siendo equipo vinculado, no un animal sosteniendo varita/volando en escoba. No nueva habilidad ni coste por mantener criaturas.

## Acceso y economía

Propuesta de nueva tabla:33identidades equiprobables (29anteriores+4criaturas), starter fuera del azar,34enCromodex. Es cambio explícito de catálogo/tabla4: 1/29→1/33por identidad, no «mismos porcentajes». Enchanted1% independiente intacto: identidad encantada1/3300. Precios/premios/Esencia/cuatro rarezas intactos. Mostrar probabilidades derivadas de la misma tabla del sorteo. Completitud principal incluye nuevas identidades, sin duplicar por acabado ni sumar recuerdos estacionales. No restar descubrimientos anteriores; el denominador crece de30a34.

La colección propia de criaturas depende de aperturas; la táctica no debe exigir comprarlas. Probar que los tres Pactos existentes ofrecen tres criaturas distintas como alternativa a la compañía de casa. Dos candidatos, no tres paneles. La oferta sigue fijada al crear run; consultar/recargar no cambia candidatos. Mantener alternativa de casa y formación viable con starter. La renuncia es elegir compañía de casa o de criaturas a lo largo de la ruta.

## Interacción

Cromodex: clasificación de identidad consultable y filtro de casa/afiliación/naturaleza a demanda. Cuatro nuevas fichas y copias normales/encantadas; historial de copia no reescrito para añadir metadatos. Clasificación actual y snapshot histórico de combate separados.

Preparación: un medallón/libro de vínculo abre las alternativas con contribuyentes/umbral/efecto derivados del dominio compartido. Borrador con selección reconocible, nombre accesible, teclado/toque/foco; guardar junto a la formación explícita. Cambiar/cancelar no gasta, cura o inicia combate. El detalle deOrden explica que ayuda a otro aliado herido durante el combate, sin curar la formación por consultar. Mapa muestra solo el vínculo elegido y sus contribuyentes/efecto, sin otra cabecera permanente. Acceso a cambiarlo mediante preparación actual.

ArenaA86: activación confirmada compacta por bando y sello por integrante; efectos localizados por acción confirmada. Guardado antes de animar, una pausa y registro consultable. SonidoA84 voluntario, sin nuevas opciones permanentes o reproducción inicial.

## Compatibilidad implementada

Conservar perfiles ejecutables a84/a85. Nuevo perfil a87: catálogo/tabla4, contenido táctico4, reglas/engine3. Campaña1 y derechos de primera victoria intactos. Traitsv2 aditivos; traitsv1 y copias/receipts anteriores inmutables. Identidad actual clasificada en catálogo; combate utiliza mapas de miembros congelados en sus reglas.

Selección opcional de vínculo en Team/SetTeamRequest y Run, valores auto/houses/order/death/creatures. Ausencia histórica=casas en reglas anteriores; Auto solo bajo reglas3. Guardar petición exacta, comparación de idempotencia y ownership; no reutilizar una clave para otro vínculo. Un combate registra foco de cada bando en input; no lee preferencias actuales durante replay. Viejas runs sin regla de vínculos no reciben pasivos nuevos. Las opciones actuales de equipo y consumo siguen separadas del borrador.

Preferir mapas congelados de wizardId→afiliaciones/naturaleza en reglas frente a ampliar cada unidad con metadatos redundantes. Arte/sonido eligen perfil por ID estable y foco del BattleLog, nunca por información de azar futuro. Eventos de activación, ayudaPV y protección incluyen valores reales necesarios para proyección y registro. No migraciónSQL destructiva; JSONB con validación aditiva.

## Validación prevista

TDD: umbrales2/3/4, duplicados/temporales/caídos; elegir foco desactiva casas alternativas sin tocar afinidad; efecto/renuncia y casos donde cada opción conviene; no recuperación por consultar; historial engine1/2; mismo acabado distinto produce el mismo combate. SQL/Redis: concurrencia/rollback/respuesta perdida/propietario/key/cambio de versión, primera victoria histórica no duplicada.

Modelo exacto de cupones para29vs33: CDF de identidades distintas, mediana/P90/P95 a25/50/75/100%, duplicados esperados y ausencia de identidad concreta; subconjunto de4criaturas y3para táctica. No convertir aperturas en horas humanas automáticamente. Escenarios pareados de motor y rutas con starter/colecciones declaradas/condición/consumibles, política de casa/afinidad/criaturas/foco por condición; no consultar resultados futuros para elegir.

Linux: ambos packs/idiomas,1280×900/390×844/865×1079, texto ampliado/320, cancelación/foco, arte ausente/reducido, pausa/2x/ocultación/omisión, consumo/recuperación y regresiones deA85/A86/cierre/Halloween/cuentas. Capturas seleccionadas; animación por muestras temporales del reloj, no por una imagen. No gráficos locales alternativos. Humana y móvil físico pendientes.

## Registro histórico de alternativas previas a la implementación

La fila inicial de recuperaciónPM queda como alternativa estudiada, **no implementada**. Hechos de código: el intento cuesta1PM y el catálogo parte habitualmente de40PM. Hipótesis: recuperar2/3al principio podría cambiar poco los combates ordinarios y dar un vínculo con escasa consecuencia perceptible. No se presenta esa hipótesis como un resultado de simulación de ruta.

Se elige contrastar una alternativa más propia de cooperación: **una ayuda de1/2PV por bando y ronda**, al comenzar el turno de un contribuyente que pueda ayudar a **otro** aliado en pie herido. Selecciona menor fracciónPV, con desempate por orden de formación. Nunca se cura a sí mismo ni revive; solo se usa el cupo de ronda si se produce una curación real. La afinidadAlquimia sigue curando al actor según sus reglas anteriores.

Renuncia frente aHufflepuff: Hufflepuff puede sanar a cada contribuyente en su propio turno y sostener al último superviviente; Orden comparte una sola ayuda por ronda, puede beneficiar a un aliado de otra casa, pero necesita que otro contribuyente sobreviva y actúe a tiempo. Un golpe que derriba al aliado antes no se evita retroactivamente. Esto permite casos de conveniencia opuesta sin inventar resurrección o regeneraciónPM ilimitada.

Contrato de log mínimo propuesto: `healed.actorId` conserva su significado histórico de **quien recuperaPV**; `source:order` añade `healerId` verificado, distinto y del mismo bando. Así no se reinterpretan proyecciónHP, efectos de curación o hechosA70anteriores. La escena destaca al ayudante y al receptor adecuados; solo muestra lo registrado. Reglas/engine3exclusivamente; logs1/2intactos. Fuente, valores y límite por ronda se verificarán con pruebas antes de fijarlos.

Criaturas: «primer impacto» significa primer acierto con daño bruto positivo antes de protección; fallo/daño bruto0no gastan la protección. Bloquea como máximo3/5una sola vez, no conserva sobrante ni reduce quemadura. La cantidad realmente bloqueada debe quedar registrada para lectura/efecto, sin una barra de escudo inventada.

Nueva expedición: la elección de vínculo también debe poder viajar en `StartRunRequest` al confirmar preparación, además deSetTeampara cambiar formación activa. No asumir que iniciar run ejecuta previamente otro comando de equipo. Una consulta/borrador no guarda por sí sola.

## Decisión operativa implementada

- Modo por defecto **Auto**, solo para elegir vínculo según formación: prioriza una casa activa; si no existe, una afiliación/naturaleza activa, con prioridad estable publicada. No compra, equipa, elige ruta o inicia nada. Un equipo que acaba de reunir tres criaturas no debe necesitar una casilla adicional para que su sinergia exista. Si hay conflicto, el jugador puede elegir Casas/Orden/Mortífagos/Criaturas en el libro de preparación. Cinco objetos pequeños bajo demanda (Auto reutiliza brújula/mapa), no otra barra permanente. El mapa muestra el vínculo **efectivo**, no cinco controles.
- Team/Run conservan modo opcional `auto|houses|order|death|creatures`; ausencia histórica=casas en reglas antiguas, auto únicamente bajo reglas3nuevas. Input de combate conserva elección efectiva `houses|order|death|creatures`, fijada antes de sortear/resolver. El replay nunca recalcula Auto con otro catálogo o bajas posteriores.
- Orden usa la ayuda cooperativa1/2PV descrita arriba, una vez por ronda, otro aliado herido vivo. `healed.actorId` sigue siendo receptor y `healerId` identifica al ayudante. Se compara con Hufflepuff, sin curación propia o resurrección.
- Mortífagos conserva +1/2daño de remate con condición previa≤mitadPV, posterior al multiplicador de gragea.
- Criaturas protege a **cada aliado en pie del equipo**, no solo a contribuyentes: −2/3del primer impacto con daño bruto positivo recibido; sin sobrante, sin quemadura y sin revivir. Esto permite que las tres criaturas temporales protejan al starter que ocupa el primer puesto, en vez de una sinergia inicial que no actuaría hasta que el starter cayera. Cantidad bloqueada real en log. Se compara con recuperación sostenidaHufflepuff y primer golpeGryffindor antes de aceptar valores.

La accesibilidad del grupo no basta como prueba de interés. Estos ajustes responden a lectura del motor/orden real de incorporación y se han contrastado con escenarios; falta la comprobación gráfica del recorrido integrado. El diseño inicialPM y protección3/5solo a contribuyentes quedan descartados, no implementados.
