# A75 · Recuperación, entrada e inspector (F01/F02/F04)

17 octubre 2026. Implementación de subrecorrido por agente de recuperación; integración de consumidores App/ExpeditionPreparation y ejecución Linux a cargo del coordinador. No modifica autoridad, economía o autenticación del ensayo.

## Estado y decisiones

- **F01 contrastado:** el controlador eliminaba game/pending de memoria al comenzar `load()`, antes de saber si una cookie caducada devolvería 401; un load con otra cookie sustituía el jugador sin intención explícita. `refreshStatus` no elevaba 401 a bloqueo general. El mensaje global de App omitía UNAUTHORIZED (consumidor coordinador).
- **F02 contrastado:** POST de entrada fuera del busy del controlador. Se añade exclusión inmediata que cubre POST **y** la consulta de autoridad posterior; no hay reintento automático.
- **F04 contrastado:** avisos en diálogo inferior/página y equipamiento en inspector superior. Se proporciona un aviso reusable que se coloca en el contexto activo. No se cierra el inspector para esconder el error ni se interpreta su cierre como cancelación del commit.

`RecoveryNotice` conserva una salida de consulta en ES/EN, diferencia sesión inválida de operación pendiente y explica una nueva entrada deliberada. Con operación incierta **no** ofrece otra entrada; conserva player/key. La entrada adicional es ayuda desplegable y acción explícita: si caducó la sesión crea una partida separada, sin trasladar recursos. No ofrece recuperación productiva de cuentas.

`load()` conserva game/pending/content/receipt durante una consulta fallida. Antes de aceptar otra cuenta valida el propietario. `load({allowPlayerChange:true})` existe solo para una entrada explícita sin pending; si existe pending la rechaza antes de consultar. Una query de estado 401/INVALID_SESSION bloquea nuevas confirmaciones sin borrar un receipt ya confirmado. Una respuesta definitiva de operación 401 no representa commit incierto: se conserva el rechazo y la consulta vuelve a ser explícita.

La UI no vuelve a enviar operaciones por consultar un aviso. `recover()` busca la operación y conserva su key; la política previa de reenvío solo tras NOT_FOUND sigue igual. El cambio no importa inventario local ni reinicia derechos de premios.

## API / propiedad

- `RecoveryNotice({state, language, onReload, onRecover, onEnter?, entering?, entryError?, announce?, connected?})`.
- `sessionInvalid(error)` exportado para consumidores.
- `useTrialEntry(start:()=>Promise<void>, canEnter:boolean)` devuelve `{enter,pending,error}`. El callback debe lanzar ante POST fallido y esperar a la carga del controlador. No se crea sesión con permisos falsos ni mientras otra entrada sigue activa.
- `TrialEntryGate` puro mantiene exclusión y notifica React por `useSyncExternalStore`.
- `connected=false` deshabilita consultas/recuperación/entrada y explica offline. Los mensajes se mantienen visibles.
- Slot de recuperación de ExpeditionPreparation acordado con agente de preparación/coordinador. Solo el contexto superior anuncia; el coordinador evita avisos inferiores duplicados.

Archivos propios: `application/client/game-controller.ts`; `presentation/{RecoveryNotice.tsx,recovery-messages.ts,recovery-notice.css,trial-entry.ts,useTrialEntry.ts}`; pruebas `game-controller.test.ts`, `trial-entry-a75.test.ts`, `recovery-notice-a75.test.ts`, `browser-experience-fixes/recovery-a75.spec.ts`.

## TDD y ejecución local no gráfica

- `npx vitest run tests/domain/arcana/game-controller.test.ts`: baseline ampliado **RED 4/24**, pérdida game/pending al reload401, cambio player implícito, nueva entrada con pending y refresh401 no bloqueante. Tras cambio **GREEN 24/24** (20 anteriores +4 A75). Caso adicional RED durante carga/recuperación: query posterior caducada no podía quedar `ready`; corregido, **GREEN 25/25**.
- `npx vitest run tests/domain/arcana/trial-entry-a75.test.ts`: **RED** módulo inexistente, luego **GREEN 3/3**: exclusión inmediata/duración completa, fallo y siguiente intento deliberado, permiso false sin petición.
- `npx vitest run tests/domain/arcana/recovery-notice-a75.test.ts`: **RED 1/4** en disponibilidad offline; corrección deshabilita consulta. **GREEN 4/4**: pending no permite nueva cuenta, offline, ES/EN y contexto inferior sin anuncio. Render estático no demuestra foco hablado o navegador.
- Final dirigido: `npx vitest run tests/domain/arcana/game-controller.test.ts tests/domain/arcana/trial-entry-a75.test.ts tests/domain/arcana/recovery-notice-a75.test.ts`: **34/34**, tres archivos, sin navegador ni servicios. No es suite global.
- Prettier local sobre archivos propios. No commits/push ni cambios de consumidores por el subagente.

## Casos Linux escritos, no ejecutados por el agente

`tests/browser-experience-fixes/recovery-a75.spec.ts`, app/gateway real 5520. Ocho casos (cuatro × ES/EN), solo Chromium390 para acotar sesiones/carga; los restantes proyectos se omiten explícitamente. Cuentas por contexto aislado.

1. POST retenido, feedback inmediato y un POST al repetir click/Enter; luego cuenta real cargada.
2. 503 de entrada inyectado, sin reintento automático y nueva activación deliberada funciona.
3. Borrar únicamente cookie del contexto de prueba (gateway real 401), error alcanzable dentro del inspector y persistente al cerrar; reconsulta sin POST de entrada automático.
4. Operación real de equipo confirmada, respuesta abortada: recuperación dentro del inspector con GET de la misma key, un POST y estado/receipt económicos idénticos tras recuperar.

Esta escritura no acredita que hayan pasado. La batería real, resultados SHA/CI y posibles correcciones se registrarán en el informe del coordinador. Tests unitarios añaden reload401 con pending, mismatch de propietario y conservación de receipt, sin simularlos como cobertura gráfica.

## Límites

Sin prueba humana, lector hablado o dispositivo físico. Los avisos no acreditan comprensión de recuperación. No se ha abierto navegador, ni ejecutado matrices/capturas/perfiles/servicios desde este agente. La UI integrada y foco deben comprobarse en Linux antes del cierre técnico. No hay cambios de dominio ni migraciones; PG/Redis/gateway reales se verifican por coordinación en los contratos afectados.

## Revisión estática posterior a integración

Se añadieron dos casos de caracterización (GREEN): reload401 después de confirmación conserva receipt, owner y clave finalizada; reload con cookie de otro player y una intención incierta no consulta receipt ni reasigna comando. Total dirigido actualizado **34/34** (controlador27/gate3/aviso4).

La revisión detectó que una preparación inline con key constante puede conservar selección/inspector de otra cuenta al realizar nueva entrada explícita. Se comunicó al coordinador: scope/key por player o reset explícito. También se comunicó el caso de metadata pendiente reclamada por otra pestaña después de cargar: el permiso de entrada no debe depender únicamente de pending en memoria; se requiere comprobar la fila del propietario antes de POST. Estas observaciones no se presentan como comprobaciones de navegador ni como ya corregidas por este agente.

## Preflight de entrada explícita

Añadido `GameController.prepareTrialEntry(): Promise<boolean>` después de la revisión integrada. Antes del POST, el consumidor debe esperarlo y salir sin POST cuando devuelve false. Lee la metadata del jugador visible y bloquea si otra pestaña reclamó una intención desde la última carga; incorpora esa intención conservando owner/key y ofrece recuperación. Un error al leer bloquea con error de almacenamiento, sin borrar la partida. Con intención conocida bloquea antes de leer; sin jugador ni intención conocida permite la entrada. La exclusión interna evita consulta solapada con otro trabajo del controlador.

TDD: tres casos RED (método inexistente) → GREEN; pending descubierto en otra pestaña, error de lectura y entrada sin pending. Total dirigido **37/37** (controlador30/gate3/aviso4). El coordinador integra su llamada en App.

**Límite declarado:** la lectura IndexedDB y el POST/cookie HTTP no forman una transacción distribuida. Otra pestaña puede reclamar después de la lectura; la fila antigua nunca se borra ni sus recursos se importan al nuevo jugador. No se acredita exclusión atómica global de crear sesión frente a un claim simultáneo. Una página sin snapshot de propietario tampoco identifica una cuenta caducada a partir de inventario local: no se construye recuperación productiva de cuenta en este incremento.
