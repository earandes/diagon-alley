# Pantallas, overlays y estados reales · A91

Inventario de68 superficies/estados significativos, no68URLs. Rutas reales: mapa, colección, tienda/callejón, tienda/confitería, tienda/taller, tienda/bóveda, misiones y arena; bienvenida depende de sesión. Las consultas y cuenta son overlays. C=código,V=muestra vista,T=prueba histórica,H=hipótesis. Las muestras no cubren todas las variantes. Archivos relativos a `src/arcana/presentation/`, excepto rutas `../`. No una lista de pantallas futuras.

## S01 · Entrada y recuperación · Carga inicial

**Entrada y consumidor:** Raíz sin game, consulta de sesión; `App.tsx`, `useTrialEntry.ts`. **Decisión:** Esperar estado utilizable.

**Jerarquía actual:** Fondo, estado breve; accesos bloqueados durante petición. **Estados:** Carga/entrada fallida/offline.

**Conservar/cambiar:** Mantener feedback inmediato; evitar repetir anuncio de entrada entre CTA y status. **Aceptación posterior:** Un intento activo; éxito/fallo permite continuar o reintentar deliberadamente.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S02 · Entrada y recuperación · Menú de bienvenida

**Entrada y consumidor:** Sin partida cargada; `App.tsx`, `FantasyActionButton.tsx`. **Decisión:** Probar, entrar o crear cuenta.

**Jerarquía actual:** Una marca, invitado principal, dos accesos secundarios y nota breve de recuperación. **Estados:** Arte ausente, ES/EN, cuenta ya conocida.

**Conservar/cambiar:** Conservar jerarquía A82; revisar longitud de la nota sin ocultar límite del invitado. **Aceptación posterior:** Tres acciones reconocibles, foco y misma semántica con/sin iconos.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S03 · Entrada y recuperación · Crear cuenta

**Entrada y consumidor:** Bienvenida o Guardar mi partida→register; `AccountAccess.tsx`. **Decisión:** Solicitar verificación de correo.

**Jerarquía actual:** Pluma/folio, email y CTA; ayuda plegada. **Estados:** Correo inválido, en curso, error, cancelación.

**Conservar/cambiar:** Conservar campo convencional y una tarea; copy de ensayo breve y veraz. **Aceptación posterior:** Pegado/autocompletado; cancelar no cambia jugador ni concede kit.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S04 · Entrada y recuperación · Verificar correo y elegir contraseña

**Entrada y consumidor:** Registro→verify o tengo código; `AccountAccess.tsx`. **Decisión:** Verificar y fijar credencial.

**Jerarquía actual:** Folio, código/contraseña y email contextual; ojo y ayuda. **Estados:** Código inválido/caducado, reenviar/reparar, busy.

**Conservar/cambiar:** Mantener reparación en contexto; no esconder etiqueta o compatibilidad gestor por estilo. **Aceptación posterior:** Reenvío invalida/renueva según contrato; uso único y misma partida; no afirmar correo externo.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S05 · Entrada y recuperación · Iniciar sesión

**Entrada y consumidor:** Bienvenida/Ajustes→login; `AccountAccess.tsx`. **Decisión:** Abrir la partida de la cuenta.

**Jerarquía actual:** Llave/credencial, email y contraseña; una acción. **Estados:** Credencial inválida, owner incompatible, cancelación.

**Conservar/cambiar:** Conservar A79–82; reutilizar desde aviso de sesión U03. **Aceptación posterior:** Login mismo dueño recupera pending; otro dueño no reutiliza su operación.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S06 · Entrada y recuperación · Solicitar recuperación

**Entrada y consumidor:** Ayuda login→request-reset; `AccountAccess.tsx`. **Decisión:** Solicitar código privado.

**Jerarquía actual:** Un email, envío; ayuda tengo código. **Estados:** Sin red, rate limit, respuesta genérica.

**Conservar/cambiar:** Conservar mínima información y prevención de enumeración. **Aceptación posterior:** Respuesta no promete que exista cuenta; buzón de ensayo distinto de correo externo.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S07 · Entrada y recuperación · Restablecer contraseña

**Entrada y consumidor:** Código→reset; `AccountAccess.tsx`. **Decisión:** Verificar código y cambiar contraseña.

**Jerarquía actual:** Código/contraseña, identidad contextual y CTA. **Estados:** Expirado/usado, busy, incierto.

**Conservar/cambiar:** Conservar contexto del paso; retorno a acceso con aviso breve de completado. **Aceptación posterior:** Credencial nueva válida; sesiones revocadas según contrato, inventario exacto.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S08 · Entrada y recuperación · Vincular invitado

**Entrada y consumidor:** Ajustes→Guardar mi partida; `AccountAccess.tsx`, `App.tsx`. **Decisión:** Convertir el mismo jugador en recuperable.

**Jerarquía actual:** Estado invitado y folio de verificación. **Estados:** Sesión perdida, código inválido, pending.

**Conservar/cambiar:** No convertirlo en importación o fusión; explicar conservación con una línea. **Aceptación posterior:** Mismo playerId, copias/snapshots/receipts; cancelación intacta.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S09 · Entrada y recuperación · Cambio a otra cuenta

**Entrada y consumidor:** Ayuda login con jugador actual; `AccountAccess.tsx`, `App.tsx`. **Decisión:** Elegir abrir otra partida guardada.

**Jerarquía actual:** Advertencia pertinente y elección explícita. **Estados:** Pending bloquea, dueño incompatible, retorno.

**Conservar/cambiar:** Mantener fricción de seguridad aunque añada texto; nunca cambio silencioso. **Aceptación posterior:** Colecciones separadas, pending no pierde propietario, cancelar vuelve a su contexto.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S10 · Entrada y recuperación · Gestión y cierre de sesión

**Entrada y consumidor:** Ajustes→cuenta vinculada; `AccountAccess.tsx`, `GameSettings.tsx`. **Decisión:** Consultar identidad/salir/recuperar acceso.

**Jerarquía actual:** Identidad mínima; acciones bajo ayuda. **Estados:** Offline/pending/operación incierta.

**Conservar/cambiar:** Mantener fuera del HUD y agrupar en Cuenta si se prueba U13. **Aceptación posterior:** No logout con operación incierta; otra pestaña revalida sesión.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S11 · Entrada y recuperación · Sesión inválida y operación pendiente

**Entrada y consumidor:** Error de consulta/comando en vista o modal superior; `RecoveryNotice.tsx`, `App.tsx`. **Decisión:** Comprobar resultado o volver a entrar.

**Jerarquía actual:** Estado breve, acción reparadora y dueño preservado. **Estados:** Precommit/commit perdido/otro propietario.

**Conservar/cambiar:** U03: login contextual, no nuevo ensayo por defecto. **Aceptación posterior:** Una salida recuperable al cerrar; mismo key/owner/receipt sin volver a gastar.

**Evidencia:** C/T/H. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S12 · Entrada y recuperación · Offline/PWA/reconexión

**Entrada y consumidor:** Sin conexión y shell instalado/cacheado; `App.tsx`, `../infrastructure/pwa/register.ts`. **Decisión:** Consultar lo conservado y reconectar.

**Jerarquía actual:** Aviso corto, comandos bloqueados; no pantalla de instalador propia. **Estados:** Cache previo ausente, update pendiente, reconexión.

**Conservar/cambiar:** Conservar lectura; estado utilizable tras recuperar autoridad antes de saldo definitivo. **Aceptación posterior:** API no cacheada, sin economía offline o recarga forzada. Instalar es UI del navegador.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S13 · Ajustes · Estuche general

**Entrada y consumidor:** Engranaje de bienvenida/juego/modal/pausa; `GameSettings.tsx`. **Decisión:** Localizar preferencia o cuenta.

**Jerarquía actual:** Idioma, mundo, lectura, reproducción, audio, movimiento; scroll accesible. **Estados:** Cuenta/invitado, retorno foco, arte ausente.

**Conservar/cambiar:** U13: índice con estado resumido, no otra cadena modal. **Aceptación posterior:** Todas opciones alcanzables con teclado/toque; idioma solo aquí, sin pérdida de estado.

**Evidencia:** C/V/T/H. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S14 · Ajustes · Lectura y movimiento efectivos

**Entrada y consumidor:** Ajustes; `ReadingPreferences.tsx`, `GameSettings.tsx`, `useReducedMotion.ts`. **Decisión:** Elegir legibilidad y movimiento respetando sistema.

**Jerarquía actual:** Dos tamaños, contraste separado, sello y explicación del sistema. **Estados:** Own/system,200%,320 px,recarga.

**Conservar/cambiar:** Conservar S07A90; no eliminar foco ni forzar movimiento. **Aceptación posterior:** Estado propio/efectivo distinguibles; no reiniciar replay/log; no contenido oculto.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S15 · Ajustes · Sonido y volumen

**Entrada y consumidor:** Ajustes→Sonido; `audio/AudioPreferences.tsx`. **Decisión:** Optar por música/efectos y volumen.

**Jerarquía actual:** Lira/varita y estado; rangos nativos a demanda. **Estados:** Apagado, cargando, bloqueado, no disponible.

**Conservar/cambiar:** Mantener dos consentimientos; U17 escucha antes de producir más sonidos. **Aceptación posterior:** Sin audio/descarga antes de consentimiento; retry, ocultación y omisión sin cola.

**Evidencia:** C/T/H. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S16 · Preparación · Primera formación

**Entrada y consumidor:** Mapa sin run; `ExpeditionPreparation.tsx`, `ExpeditionGuide.tsx`. **Decisión:** Elegir copia real e iniciar expedición.

**Jerarquía actual:** Cinco puestos, colección propia, CTA y ayuda contextual. **Estados:** Una copia, incompleto, sin PV, recursos insuficientes.

**Conservar/cambiar:** Conservar orientación PM02; no regalar dos aliados ni tutorial paralelo. **Aceptación posterior:** Kit real→Pactos→formación de combate válida, cancelar conserva recursos.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S17 · Preparación · Elegir desafío

**Entrada y consumidor:** Preparación→desafío; `ExpeditionChallenge.tsx`. **Decisión:** Escoger Descubrimiento/Táctico/Maestría.

**Jerarquía actual:** Tres emblemas bajo consulta, composición/riesgo conocidos. **Estados:** Recomendado tras cierre, legacy.

**Conservar/cambiar:** Conservar mismo coste/botín explícitos; no confundir mayor desafío con más premio. **Aceptación posterior:** Elegir no inicia, nueva run fija versión, anterior no cambia.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S18 · Preparación · Formación, reservas y filtros

**Entrada y consumidor:** Preparación activa o inicial; `ExpeditionPreparation.tsx`, `ClassificationChoices.tsx`. **Decisión:** Seleccionar instancias y vínculo.

**Jerarquía actual:** Retratos, puestos, sellos, filtro a demanda. **Estados:** 30copias, duplicados,temporales,caídos,filtro vacío.

**Conservar/cambiar:** U07 gramática del plan y U10 no sobrecargar stock; conservar búsqueda existente. **Aceptación posterior:** Borrador sobrevive al filtrar, cinco puestos, identidad de instancia no cambia.

**Evidencia:** C/T/H. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S19 · Preparación · Inspector de copia

**Entrada y consumidor:** Retrato→consulta; `ExpeditionPreparation.tsx`, `EquipmentArt.tsx`. **Decisión:** Entender condición y objetos de esa copia.

**Jerarquía actual:** Retrato, PV/PM, origen, varita/escoba y detalle. **Estados:** Temporales, duplicados, equipo antiguo.

**Conservar/cambiar:** Mantener datos a demanda; misma ordinal/procedencia en todas selecciones. **Aceptación posterior:** Hover/foco/toque equivalentes; devolver foco al puesto correcto.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S20 · Preparación · Equipar y transferir

**Entrada y consumidor:** Objeto de inspector; `ExpeditionPreparation.tsx`. **Decisión:** Consultar, comparar y guardar equipamiento.

**Jerarquía actual:** Piezas poseídas y acción de guardar separada. **Estados:** Error, pending, conflicto, respuesta perdida.

**Conservar/cambiar:** U05 controles de cierre robustos; recuperación dentro del inspector. **Aceptación posterior:** Consultar/cerrar no cancela commit; stock/owner y receipt correctos.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S21 · Ruta · Mapa ilustrado y origen

**Entrada y consumidor:** Run activa→#/map; `MapPanel.tsx`, `scenes/SceneCanvas.tsx`. **Decisión:** Elegir camino alcanzable.

**Jerarquía actual:** Fondo, conexiones, seis siluetas, origen no interactivo. **Estados:** Disponible/bloqueado/visitado,semilla fija,arte ausente.

**Conservar/cambiar:** U06 jerarquía de caminos, conservar mapa completo y lista. **Aceptación posterior:** Misma semilla, todos nodos visibles, no scroll ordinario; 3tamaños y ampliación accesible.

**Evidencia:** C/V/T/H. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S22 · Ruta · Lista equivalente

**Entrada y consumidor:** Mapa→cambiar lista; `MapPanel.tsx`. **Decisión:** Consultar/seleccionar ruta por texto y objetos.

**Jerarquía actual:** Nodo con posición y relaciones bajo details. **Estados:** Varios del mismo tipo, teclado, fallback toggle.

**Conservar/cambiar:** Conservar equivalencia; reducir repetición de “Consultar” si no pierde relaciones. **Aceptación posterior:** Bloqueado se consulta pero no avanza; misma información pública y comandos.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S23 · Ruta · Inspector de nodo público

**Entrada y consumidor:** Consultar nodo disponible/bloqueado/visitado; `RouteInspection.tsx`. **Decisión:** Anticipar función y conexiones.

**Jerarquía actual:** Icono, coste, estado, anterior/siguiente. **Estados:** Sin from/to, nodo cambiado, teclado.

**Conservar/cambiar:** Relaciones como mini ruta de objetos; conservar posición y lectura textual. **Aceptación posterior:** No callback económico, secreto/seed no expuesto; cierre y foco al origen.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S24 · Ruta · Equipo compacto, casa y vínculo

**Entrada y consumidor:** Mapa con formación; `TeamHud.tsx`, `BondBand.tsx`, `HouseInsignia.tsx`. **Decisión:** Consultar condición y plan activo.

**Jerarquía actual:** Retratos, estandarte y sinergias a demanda. **Estados:** Activo/inactivo, propio/temporal, duplicado.

**Conservar/cambiar:** U07 separar afinidad/vínculo/intención; no multiplicar emblemas permanentes. **Aceptación posterior:** Mismos contribuyentes y valores que reglas efectivas/log; mapa entero cabe.

**Evidencia:** C/V/T/H. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S25 · Nodos · Pacto de dos candidatos

**Entrada y consumidor:** Nodo Pacto disponible; `NodePreparation.tsx`, `TacticalBadge.tsx`. **Decisión:** Comparar aliado temporal y elegir o pasar.

**Jerarquía actual:** Dos retratos protagonistas, origen y antes/después. **Estados:** Oferta fijada, cupo disponible,consulta/cancelación.

**Conservar/cambiar:** Conservar A66; U07 mostrar solo cambio relevante de plan. **Aceptación posterior:** Recarga no reroll; elegir incorpora una vez; consultar no avanza.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S26 · Nodos · Pacto con equipo completo

**Entrada y consumidor:** Pacto con5miembros; `NodePreparation.tsx`. **Decisión:** Sustituir explícitamente o pasar.

**Jerarquía actual:** Candidato y miembro sustituible identificable. **Estados:** Propio/temporal,duplicados,asignación inválida.

**Conservar/cambiar:** No compactar hasta ocultar quién sale; condición conservada. **Aceptación posterior:** Sin pérdida de copia/gear permanente; cancelación/otra pestaña seguras.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S27 · Nodos · Refugio

**Entrada y consumidor:** Nodo refugio; `NodePreparation.tsx`. **Decisión:** Recuperar PV o PM según condición.

**Jerarquía actual:** Dos objetos, comparación por retrato. **Estados:** PV/PMllenos,caídos,histórico.

**Conservar/cambiar:** Conservar decisión; presentar efecto real aplicado, no repetir porcentaje como cura garantizada. **Aceptación posterior:** PMsolo en pie y reglas efectivas; antes/después exactos y retorno.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S28 · Nodos · Cofre

**Entrada y consumidor:** Nodo cofre; `NodePreparation.tsx`, `NodeResult.tsx`. **Decisión:** Aceptar botín conocido o regresar.

**Jerarquía actual:** Cofre y contenido cuantificado. **Estados:** Primero/repetido,pendiente,error.

**Conservar/cambiar:** No ceremonia redundante; resultado breve y sello confirmado. **Aceptación posterior:** Recompensa actual intacta; consulta no gasta, commit antes de animar.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S29 · Nodos · Encuentro con personaje

**Entrada y consumidor:** Nodo encuentro; `EncounterPreparation.tsx`, `EncounterTradeOutcome.tsx`. **Decisión:** Intercambiar condición, elegir alcance/portador o pasar.

**Jerarquía actual:** Figura,2alternativas y previsualización. **Estados:** Duplicados,equipo completo,PV/PMbajos,legacy.

**Conservar/cambiar:** U07/U08 mantener comparación local y nombres sin IDs. **Aceptación posterior:** Alternativas exactas, fuente temporal/propia y unitId coincidente con receipt.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S30 · Nodos · Duelo ordinario

**Entrada y consumidor:** Nodo duelo; `NodePreparation.tsx`. **Decisión:** Reconocer rival y preparar/confirmar.

**Jerarquía actual:** Rivales, amenaza, formación, coste5 y tarro. **Estados:** Mínimo3,recursos insuficientes,stock0+.

**Conservar/cambiar:** Gramática de preparación común al jefe sin copiar toda su ceremonia. **Aceptación posterior:** Cancelar no gasta; snapshot/beans válidos; confirmación explícita.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S31 · Nodos · Antesala del jefe

**Entrada y consumidor:** Nodo jefe; `BossPrelude.tsx`, `BossPartyStage.tsx`, `BossSupplies.tsx`. **Decisión:** Leer composición y preparar antes de confirmar.

**Jerarquía actual:** Jefe grande, acompañantes, equipo/objetos y CTAcoste. **Estados:** 3/4/5 rivales,ambos packs,nombres largos.

**Conservar/cambiar:** U08 evitar corte dentro de apellido; U07 plan legible sin otra columna de controles. **Aceptación posterior:** Todos visibles, sin dobleconfirmación; consultar no inicia; foco/error/recovery.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S32 · Nodos · Asignación de grageas

**Entrada y consumidor:** Tarro en preparación de duelo/jefe; `BeanAssignments.tsx`, `BossSupplies.tsx`. **Decisión:** Elegir portador o conservar.

**Jerarquía actual:** Stock, tarros, retratos, borrador; riesgos bajo demanda. **Estados:** 0/1/muchos,caído,reserva,revisionincompatible.

**Conservar/cambiar:** U10 acotar repetición visual por unidad manteniendo IDs. **Aceptación posterior:** Asignar/quitar/cancelar no consume/descubre; combate confirma una vez.

**Evidencia:** C/V/T/H. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S33 · Combate · Entrada neutral

**Entrada y consumidor:** Commit de combate→#/battle; `BattlePanel.tsx`, `motion/useBattlePlayback.ts`. **Decisión:** Reconocer bandos y seguir primer evento.

**Jerarquía actual:** Figuras/PV, nombre de encuentro, ronda válida, pausa. **Estados:** Primer evento no reproducido,latencia/import.

**Conservar/cambiar:** Conservar neutralidad; no anuncio automático de victoria anticipada. **Aceptación posterior:** Log ya confirmado, saldo veraz consultable, no reroll/commit retrasado.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S34 · Combate · Reproducción y acción

**Entrada y consumidor:** Replay activo; `BattlePanel.tsx`, `scenes/pixi-scenes.ts`. **Decisión:** Ver actor/objetivo/daño/curación/caída.

**Jerarquía actual:** Dos bandos, indicadores locales y PV. **Estados:** 3×3/5×3/5×5,miss,escudos reales.

**Conservar/cambiar:** U16 medir antes de más efecto; mantener contraste local y figuras sin grandes rectángulos. **Aceptación posterior:** Mismo log; reloj compartido y todos participantes/nombres/PV visibles.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S35 · Combate · Pausa, velocidad y omisión

**Entrada y consumidor:** Pausa propia de encuentro; `BattlePanel.tsx`, `GameSettings.tsx`. **Decisión:** Consultar/reanudar/omitir o salir.

**Jerarquía actual:** Menú bajo demanda, recursos y registro. **Estados:** Pausa temprana,2x,ocultación,tab.

**Conservar/cambiar:** Conservar una pausa y velocidad recordada; sin Auto permanente redundante. **Aceptación posterior:** Cursor/DOM/Canvas/audio coherentes, omisión finita, sin operación económica nueva.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S36 · Combate · Inspector y libro del combate

**Entrada y consumidor:** Unidad o libro/registro; `BattlePanel.tsx`, `BossBattleFacts.tsx`. **Decisión:** Consultar detalle sin perder evento.

**Jerarquía actual:** PM/gear/efectos y log, foco al diálogo. **Estados:** Unidad caída,10actores,registro largo.

**Conservar/cambiar:** Mantener detalle accesible sin estadísticas permanentes; máximo2hechos al final. **Aceptación posterior:** Pausa al consultar, retorno de foco, no reanudación o resultado anticipado.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S37 · Combate · Victoria, derrota y empate

**Entrada y consumidor:** Fin u omisión; `BattlePanel.tsx`, `BossBattleFacts.tsx`. **Decisión:** Entender resultado y siguiente acción.

**Jerarquía actual:** Resultado/recompensa y hasta2hechos confirmados. **Estados:** Primer/repetido,plan sin activación,logviejo.

**Conservar/cambiar:** Conservar hechos efectivos sin “ganaste gracias a”; menos hechos si no hay evidencia. **Aceptación posterior:** Resultado correcto, cantidad aplicada, bando/instancia y continuación.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S38 · Combate · Consulta histórica

**Entrada y consumidor:** Ver combate guardado/recarga; `BattlePanel.tsx`, `visual-history.ts`. **Decisión:** Revisar el mismo combate.

**Jerarquía actual:** Escena y registro consultables. **Estados:** Idioma/pack,recarga,no conexión.

**Conservar/cambiar:** Conservar modo histórico sin nueva celebración/recompensa. **Aceptación posterior:** BattleLog igual, recursos exactos, anuncios una vez por presentación autorizada.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S39 · Combate · Arte/import/renderer fallido

**Entrada y consumidor:** Fallo técnico de presentación; `scenes/SceneCanvas.tsx`, `BattlePanel.tsx`. **Decisión:** Acceder a resultado/registro y continuar.

**Jerarquía actual:** Fallback DOM con nombres/PV/acciones. **Estados:** WebGLperdido,imagenrota,reducido.

**Conservar/cambiar:** No tratar fallback como otra aplicación sin estilo; preservar acción y nombres. **Aceptación posterior:** Resultado accesible sin renderer, no desaparición de controles ni nuevo cálculo.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S40 · Combate · Sin combate guardado

**Entrada y consumidor:** #/battle sin battle; `App.tsx`. **Decisión:** Regresar al mapa.

**Jerarquía actual:** Mensaje corto y una acción. **Estados:** Cuenta nueva/cambio de dueño.

**Conservar/cambiar:** Mantener vacío sencillo, sin ilustración que sugiera combate inexistente. **Aceptación posterior:** Volver conserva hash/foco; no iniciar ni fabricar log.

**Evidencia:** C. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S41 · Resultado · Resultado de nodo

**Entrada y consumidor:** Resolver un nodo→mapa; `NodeResult.tsx`, `EncounterOutcome.tsx`. **Decisión:** Entender qué cambió y continuar.

**Jerarquía actual:** Resumen plegable, recompensa y retorno. **Estados:** Refugio/Pacto/encuentro/pase,repetido.

**Conservar/cambiar:** Priorizar el cambio recién confirmado; historial no debe dominar ruta. **Aceptación posterior:** Mismo receipt, no volver a animar/grant por idioma o recarga.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S42 · Resultado · Cierre de expedición

**Entrada y consumidor:** Jefe/fin de run→mapa cerrado; `ExpeditionClosure.tsx`. **Decisión:** Usar botín o preparar otra.

**Jerarquía actual:** Resultado, rival, recompensas y acción contextual; historia bajo consulta. **Estados:** Primera/repetida/derrota/empate,botín usado.

**Conservar/cambiar:** Conservar A63; U02 orientación posterior sin prometer otra llave. **Aceptación posterior:** Botín ganado real, rana propia sin recompra; nueva run requiere selección/confirmación.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S43 · Resultado · Intención siguiente y recordatorio

**Entrada y consumidor:** Después del botín o durante run; `ExpeditionIntentions.tsx`. **Decisión:** Escoger/cambiar/abandonar plan voluntario.

**Jerarquía actual:** Hasta3objetos,un libro,estandarte recordatorio. **Estados:** Viable/no viable,cumplida/intentada,legacy.

**Conservar/cambiar:** Conservar A90; U07 intención sin cifra de potencia y sin premio. **Aceptación posterior:** Elección no compra/avanza; cumplimiento solo log propio y propietario correcto.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S44 · Comercio · Callejón de fachadas

**Entrada y consumidor:** #/shop; `ShopHub.tsx`. **Decisión:** Entrar en confitería/taller/bóveda.

**Jerarquía actual:** Tres fachadas/puertas y carteles funcionales fuera del arte. **Estados:** Pack,ES/EN,arteausente.

**Conservar/cambiar:** Conservar tienda como lugar; comprobar carteles a tamaño real antes de nuevos locales. **Aceptación posterior:** Entrar/regresar no opera; nombre accesible y foco, destinos reales.

**Evidencia:** C. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S45 · Comercio · Confitería: rana

**Entrada y consumidor:** #/shop/confectionery→rana; `SweetshopScene.tsx`. **Decisión:** Abrir poseída o comprar+abrir.

**Jerarquía actual:** Caja protagonista, stock/coste y una acción contextual. **Estados:** Con rana/sin rana,sin monedas,pendiente.

**Conservar/cambiar:** Conservar apertura propia sin cobro; no añadir CTA de compra equivalente. **Aceptación posterior:** Mismo unitId/tableVersion y receipt; consulta/retorno no gasta.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S46 · Comercio · Confitería: grageas

**Entrada y consumidor:** Confitería→tarro; `SweetshopScene.tsx`. **Decisión:** Comprar o preparar el stock.

**Jerarquía actual:** Tarro, coste,stock,preparar principal si poseído. **Estados:** Sin combate alcanzable,stock0+,sin monedas.

**Conservar/cambiar:** Conservar conector al contexto; U10 stock agregado legible sin bolsa nueva. **Aceptación posterior:** No elegir rama automáticamente, explicación de dónde asignar y retorno seguro.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S47 · Comercio · Libros de probabilidades y botines

**Entrada y consumidor:** Objeto libro de cada tienda; `ShopBook.tsx`, `SweetshopScene.tsx`, `CommercePanel.tsx`. **Decisión:** Conocer azar/coste antes de operar.

**Jerarquía actual:** Tabla/objetos dentro del libro, porcentaje real y detalle acabado. **Estados:** ES/EN,tablaactualizada,catálogo34.

**Conservar/cambiar:** U05 cierre robusto; índice visual por familia si se prueba escalabilidad, sin ocultar odds. **Aceptación posterior:** Porcentaje de identidad y acabado distinguido, consulta sin comando.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S48 · Apertura · Caja, sello, rana y carta

**Entrada y consumidor:** Resultado autoritativo de open/buy-open; `CardReveal.tsx`, `FrogMagic.tsx`, `RevealTheatre.tsx`. **Decisión:** Ver u omitir revelación.

**Jerarquía actual:** Piezas separadas,4rarezas,nueva/repetida,acabado. **Estados:** Oculto/reducido/importfail/recarga.

**Conservar/cambiar:** Conservar coreografía material; U16 muestra medida antes de cambiar renderer o filtros. **Aceptación posterior:** No nuevo sorteo, mismoresultado, cleanup, omisión y estático equivalentes.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S49 · Apertura · Resultado nuevo/repetido/encantado

**Entrada y consumidor:** Revelación final; `CardReveal.tsx`, `EnchantedFinish.tsx`. **Decisión:** Reconocer identidad/acabado y conservar/continuar.

**Jerarquía actual:** Retrato grande,nombre,rareza/estrellas/casa y2destinos. **Estados:** Repetida,encantada,arteausente,histórico.

**Conservar/cambiar:** U09 jerarquía de marcas; no reducir protagonismo de carta por más badges. **Aceptación posterior:** Acabado cosmético, no ×2; identidad única y anuncios correctos.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S50 · Colección · Cromodex y progreso

**Entrada y consumidor:** #/collection; `CollectionPanel.tsx`. **Decisión:** Explorar colección y elegir meta.

**Jerarquía actual:** Álbum4cartas, progreso/copias, fuente y objetivo. **Estados:** Inicial/amplia/completa,históricos.

**Conservar/cambiar:** U01 universo de progreso común; U09 portada; U11navegación adaptativa. **Aceptación posterior:** No inflación por duplicados/encantados/recuerdos, archivo explícito.

**Evidencia:** C/T/H. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S51 · Colección · Cajón de filtros

**Entrada y consumidor:** Álbum→filtros; `CollectionPanel.tsx`, `ClassificationChoices.tsx`, `VisualChoices.tsx`. **Decisión:** Localizar familia/rareza/descubrimiento/acabado.

**Jerarquía actual:** 19opciones en4grupos solo al expandir. **Estados:** Vacío,filtro combinado,páginafuera.

**Conservar/cambiar:** U11 resumen/limpiar visible; U12 emblemaArmy; no convertir todo en tabs permanentes. **Aceptación posterior:** Filtros no alteran porcentaje ni borran meta; foco/página consistentes.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S52 · Colección · Ficha de identidad y copias

**Entrada y consumidor:** Retrato del álbum; `CollectionPanel.tsx`, `HouseInsignia.tsx`. **Decisión:** Inspeccionar identidad o copia concreta.

**Jerarquía actual:** Folio,marcas,nombre,copias y snapshots. **Estados:** Sin descubrir,duplicados,equipodistinto,archivo.

**Conservar/cambiar:** U09 dos niveles; U05 cierre fallback; equipo sigue en preparación. **Aceptación posterior:** Metadatos secretos conservadores; identidad/copias/acabado diferenciados y retorno exacto.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S53 · Colección · Objetivo y fuentes

**Entrada y consumidor:** Ficha→marcar objetivo; `CollectionSources.tsx`, `useCollectionGoal.ts`. **Decisión:** Escoger una adquisición y conocer fuente real.

**Jerarquía actual:** Marcapáginas, probabilidades,propia/temporal; versión a demanda. **Estados:** Obtenido,archivado,cambiacuenta,sin fuente.

**Conservar/cambiar:** Conservar PM05/A90; integrar visualmente al folio sin otra tarjeta dominante. **Aceptación posterior:** Temporal no adquiere; consulta no consume ni cambia azar; meta por dueño/versión.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S54 · Colección · Sabores y ayuda

**Entrada y consumidor:** Álbum/atlas→tarro; `FlavourCabinet.tsx`. **Decisión:** Ver descubiertos y cómo intentarlo.

**Jerarquía actual:** Cuatro muestras y libro; no fabricar sabor. **Estados:** 0–4,activo conocido/desconocido,ayuda.

**Conservar/cambiar:** U14 lenguaje descubrir frente a receta; U05 cierre. **Aceptación posterior:** Descubrir solo activación válida, no selección/compra; porcentaje separado de cromos.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S55 · Taller · Materiales y comparación

**Entrada y consumidor:** #/shop/workshop; `CommercePanel.tsx`, `WandRecipeComparison.tsx`. **Decisión:** Elegir receta y portador de referencia.

**Jerarquía actual:** Madera/núcleo,2varitas y3diferencias; coste. **Estados:** Sin portador,duplicados,legacy,no saldo.

**Conservar/cambiar:** Conservar muestra A90; consulta de renuncia sin promesa de victoria. **Aceptación posterior:** Fuente efectiva/motor compartido; elegir referencia no equipa ni compra.

**Evidencia:** C/V/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S56 · Taller · Confirmar forja

**Entrada y consumidor:** Receta→cotización; `CommercePanel.tsx`. **Decisión:** Aceptar coste o cancelar.

**Jerarquía actual:** Pieza,coste,confirmar/cancelar y error en contexto. **Estados:** Versiónobsoleta,pending,respuestaperdida.

**Conservar/cambiar:** Conservar confirmación económica; no ceremonializar otro paso. **Aceptación posterior:** Una entrega/consumo, recovery y foco en resultado u origen.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S57 · Taller · Varita obtenida e historial

**Entrada y consumidor:** Forja confirmada/regreso; `CommercePanel.tsx`. **Decisión:** Inspeccionar y preparar equipo.

**Jerarquía actual:** Pieza y CTAcontextual; equipo poseído en libro. **Estados:** Resultadoviejo,inventariogrande.

**Conservar/cambiar:** Separar último resultado histórico del objeto aún pendiente de equipar; no fingir novedad al volver. **Aceptación posterior:** Equipar explícito; no celebrar histórico ni comprar de nuevo.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S58 · Bóveda · Sin llave

**Entrada y consumidor:** #/shop/vault con0llaves; `CommercePanel.tsx`. **Decisión:** Entender requisito o siguiente destino viable.

**Jerarquía actual:** Cerradura y llave; ayuda/destino. **Estados:** Antes jefe,primera llave ya consumida.

**Conservar/cambiar:** U02 distinguir pendiente de ya completada; no añadir otra fuente o compensación. **Aceptación posterior:** Mensaje viable en cada estado y conservación de derechos únicos.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S59 · Bóveda · Llave y confirmación

**Entrada y consumidor:** Bóveda con llave→cotización; `CommercePanel.tsx`. **Decisión:** Consumir1llave explícitamente.

**Jerarquía actual:** Llave/cerradura,botinesconsultables,confirmar/cancelar. **Estados:** Dobletoque,staletable,otra pestaña.

**Conservar/cambiar:** Conservar objeto protagonista y una acción pagada. **Aceptación posterior:** Consultar/cancelar no consume; llave y recompensa atómicas una vez.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S60 · Bóveda · Botín y retorno

**Entrada y consumidor:** Apertura confirmada; `CommercePanel.tsx`. **Decisión:** Usar lo obtenido y volver.

**Jerarquía actual:** Cofre,objeto,monedas/gear y preparar. **Estados:** Rana/gear/beans,resultadohistórico.

**Conservar/cambiar:** Priorizar destino del objeto ganado cuando haya rana; no todo botín conduce a equipar. **Aceptación posterior:** Destino no consume automáticamente; inventario/receipt exactos y actualización tras uso.

**Evidencia:** C/T/H. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S61 · Atlas · Misiones/objetivos

**Entrada y consumidor:** #/missions; `JourneyCabinet.tsx`. **Decisión:** Reconocer avance y siguiente objetivo.

**Jerarquía actual:** Tres objetos y orientación, sabores/atlas. **Estados:** Inicio,avanzado,sin llaves,colección34.

**Conservar/cambiar:** U01 progreso fiable y U02meta viable; consolidar destinos duplicados si no añaden elección. **Aceptación posterior:** Mismos totales y fuentes que sus pantallas; no pantalla nueva de reclamaciones.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S62 · Atlas · Región futura

**Entrada y consumidor:** Atlas→página futura; `JourneyCabinet.tsx`. **Decisión:** Comprender disponibilidad real.

**Jerarquía actual:** Página actual y futura bloqueada/desbloqueada. **Estados:** Jefe vencido sin región2jugable.

**Conservar/cambiar:** Mostrar “Próximamente”/“Coming later” junto al estado narrativo; nunca CTAjugable falso. **Aceptación posterior:** No generar otra ruta ni prometer acceso por desbloqueo de estado.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S63 · Temporada · Descubrimiento y participación

**Entrada y consumidor:** Calabaza de cabecera; `SeasonalEvent.tsx`. **Decisión:** Conocer historia,fecha,coste y elegir participar.

**Jerarquía actual:** Tres escaparates y recuerdo,una acción. **Estados:** Antes/abierto/gracia/cerrado,otraediciónactiva.

**Conservar/cambiar:** Conservar voluntario; revisar muestra en contexto antes de más ambiente. **Aceptación posterior:** Hora servidor, joinidempotente y costes reales; consultar no progresa.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S64 · Temporada · Progreso parcial y espera

**Entrada y consumidor:** Participaciónactiva; `SeasonalEvent.tsx`. **Decisión:** Saber cuándo avanzar y qué falta.

**Jerarquía actual:** Tres objetivos/estado y destino de ruta. **Estados:** Runactiva,cerrada,ventana no alcanzada.

**Conservar/cambiar:** Progreso por objetos, una orientación; no exigir repetición vacía o urgencia artificial. **Aceptación posterior:** Edición/snapshot conservados; cierre temporal de run permite plazo correcto.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S65 · Temporada · Elección temática

**Entrada y consumidor:** Oportunidad admitida; `SeasonalEvent.tsx`. **Decisión:** Reparar o intercambiar condición/aplazar.

**Jerarquía actual:** Dos objetos y cambios PV/PM,confirmación explícita. **Estados:** Portadores/condición distinta,cancelar,error.

**Conservar/cambiar:** U04error localizado; consecuencias antes de gastar y coste de aplazar visible. **Aceptación posterior:** Consulta no resortea, resultado/progreso/operación guardados juntos.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S66 · Temporada · Cierre y recuerdo

**Entrada y consumidor:** Tres objetivos confirmados; `SeasonalEvent.tsx`. **Decisión:** Reconocer fin y conservar recuerdo.

**Jerarquía actual:** Linterna y cierre breve,animación450msnueva. **Estados:** Responselost,dobletoque,recarga,pack.

**Conservar/cambiar:** Conservar recuerdo sin poder/valor ni denominador de colección principal. **Aceptación posterior:** Concesión propia única; consulta sin nueva celebración ni premio.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S67 · Temporada · Histórico y próxima edición

**Entrada y consumidor:** Evento fuera de calendario con historial; `SeasonalEvent.tsx`. **Decisión:** Consultar lo conservado.

**Jerarquía actual:** Recuerdo estático y reglas/fechas a demanda. **Estados:** Calendariopasado,edicióncompatible/incompatible.

**Conservar/cambiar:** Conservar distinción evento/edición; no producir Navidad por esta auditoría. **Aceptación posterior:** Historial no se borra, progreso nuevo no migra objetivos incompatibles.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## S68 · Transversal · Operación, vacío y arte ausente

**Entrada y consumidor:** Cualquier superficie; `OperationFeedback.tsx`, `Artwork.tsx`, `RecoveryNotice.tsx`. **Decisión:** Saber si se confirmó, está pendiente o falló.

**Jerarquía actual:** Sello/estado breve y detalle optativo. **Estados:** Errorantescommit,replyperdida,stock0,contexto nuevo.

**Conservar/cambiar:** U04/U05/U18 coherencia por familias, sin borrar alertas por reducir texto. **Aceptación posterior:** Successsolo postreceipt; fallar medición/arte no cambia economía; foco y acción conservados.

**Evidencia:** C/T. Ver MOTION-AUDIO.md; estático no acredita temporalidad.

## Elementos compartidos que no son pantallas nuevas

Artwork, EquipmentArt, BondEmblem, HouseInsignia, TraitBadge, RarityBadge, StarRating, FinishLabel, TacticalBadge, VisualChoices, FantasyActionButton, Celebration, SceneAtmosphere, NodeAnnouncement y los hooks de fuentes/selección/replay son consumidores transversales. El inventario TSX y el contrato de estilo los cubren sin inventar rutas. PWA no incluye instalador propio; Navidad, laboratorio, trueque y región2 no son jugables. No reintroducir cajas de bromas o I1 histórico.
