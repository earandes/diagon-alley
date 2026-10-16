# Contrato previo de motor y avance ARCANA

11 octubre 2026, A30/A32. Tercer bloque: completar motor puro y casos de uso de ruta con configuración suministrada por autoridad. No se decide contenido o balance productivo pendiente U25 ni se sustituye el MVP por una fixture.

## Motor v1 y decisiones técnicas explícitas

`CombatEngine` recibe snapshot de 3–5 unidades por lado, seed y reglas versionadas; crea PRNG por el puerto `CombatRandomFactory`. Un turno corresponde a la acción de una unidad; una ronda contiene como máximo un turno por unidad viva. Se ordena por iniciativa (velocidad + escoba + bono explícito de Sombras, luego efecto Tierra), desempate lexical de IDs estables. Objetivo: primera unidad viva de la formación rival. Son decisiones de algoritmo de ensayo documentadas, no balance o estrategia observados.

Daño base de hechizo: `(poder + bonus de varita) × multiplicador de varita`, seguido del efecto de Gragea. No se inventan armadura, críticos, elementos extra, compra adicional o aumento de potencia por rareza. Coste de PM y límite de rondas se reciben en reglas, sin defaults de producción. Sin PM suficiente se registra turno sin hechizo, sin PM negativos. El límite finito produce empate, no una victoria ficticia.

Gragea se activa una vez al inicio para unidad viva asignada, con tabla de pesos suministrada. Menta cura 25% PV máximo, Pimienta +30% durante primer turno, Tierra -15% iniciativa dos turnos y Jabón primer hechizo fallido. La log muestra efecto y estado; reproducir/pausar/acelerar nunca solicita random. Muertos no actúan ni se reviven por los bonos pasivos.

Sinergias actuales: composición inicial activa Fuego con ≥2, Alquimia con ≥3, Sombras con ≥1. Cuantías explícitas de config, no balance elegido: Fuego deja daño continuo sobre objetivo golpeado (tick al inicio del turno del afectado, reemplaza sin apilar); Alquimia cura al iniciar cada turno propio; Sombras suma iniciativa. No introducir motor genérico de efectos. Esta semántica del ensayo se mantiene identificada como implementación experimental y debe revisarse al fijar balance U25.

Resultado `Combat` conserva entrada, reglas/seed/versiones, logs secuenciales, saldos finales y ganador/empate. Validar datos/IDs/formación/tabla antes de crear PRNG; cero dependencias de frameworks/storage/reloj en motor. Valores finitos, HP/PM limitados y sin desbordamientos. Logs y snapshots inmutables.

## Ruta y economía

`Run` conserva grafo versionado, formación de unidades de run, vida/PM residual, nodo/recibos e identidades temporales. `AdvanceNodeUseCase` es la frontera pública para todos los tipos de nodo; combate se resuelve dentro de su tx sin un segundo commit de premio. `ResolveCombatUseCase` coordina el comportamiento de combate compartido; no valida un "gané" del cliente.

Primera victoria en nivel+versión conserva premio completo. Repetición solo 10% Coronas. Recompensas base y política de redondeo se reciben como datos explícitos; no deducir saldo inicial o botín de los precios de tests. Derrota/empate no dan premio. Refugio cura 40% PV máximo con cap. Costes/contenidos de nodos no combate, pacto/encuentros/reinicio están pendientes U25: cases reciben la definición concreta y no inventan valores productivos.

Una tx verifica propietario/revisión/key/petición/graph/config/adyacencia y formación propia antes del gasto/random, aplica Esencia con reloj autoridad, consume unidades activadas, calcula seed/log, vida/ruta/recompensa/progreso y recibo; confirma antes de anunciar. Replay recupera receipt original sin config/reloj/seed nuevos. Fallo no produce consumo/recompensa parcial; dos conexiones no avanzan la misma revisión. Resultados precedentes no cambian al editar reglas.

## TDD y comprobación

RED antes de cada bloque; GREEN/refactor después. Fixtures etiquetadas para stats/bonos/PM/límites/precios/loot, sin publicar defaults. Motor: 3vs3 y 5vs5, igualdad de log por seed, iniciativa/equipo/Tierra/desempate, muerte/PM/limit, todos los sabores, sinergias, versión/formación inválida y no mutación. Aplicación: grafo/salto/revisión, 5 Esencia, 100% vs 10%, consumo de Grageas único, replay/versiones, rollback/respuesta perdida/competencia y persistencia JSONB de Run en PostgreSQL real. La UI y el servidor HTTP siguen pendientes hasta conectar estos casos con fuentes productivas.

## Detalles aplicados del ensayo (no decisiones de balance)

Kit→3–5 sigue pendiente: `StartRunUseCase` acepta IDs de 3–5 copias existentes y una función de autoridad para leer equipo/afinidad; no concede dos aprendices ni cromos gratuitos. No aceptar HP/PM/poder/velocidad desde la petición. Una run activa no se sustituye; victoria/derrota/empate la cierran. Nueva run tras cierre restaura los stats de sus copias. Estos comportamientos de recuperación son del ensayo parametrizado y requieren elección U25 antes de habilitar un producto.

Refugio restaura PV exclusivamente (40% máximo, también miembros con 0 PV si la run sigue activa). Pacto aporta unidad temporal solo si hay hueco hasta 5; llena se rechaza sin avance. Encuentro recibe lista explícita de efectos recompensa/curación/daño y pesos, sin narrativa o balance inventados. Semántica y valores productivos pendientes. Redondeo de 10% se exige como dato `floor`/`ceil`; no default de balance. Llaves son inventario entero y solo el botín configurado de primera victoria puede concederlas.

Registros de run/recibos snapshot JSONB, victorias y zonas desbloqueadas relacionales, y columna SQL de llaves con migración aditiva a cero. Recuperación de replay confirmada lee SQL antes de pedir reloj; lectura del reloj solo necesaria para combate. La tx bloqueada vuelve a validar replay/revisión/grafo/unidades. No se afirma que el reloj esté integrado a HTTP: el caso recibe `AuthorityClock`, que Redis implementa.

Generación de grafo (siguiente comportamiento TDD): configuración suministrada por autoridad contiene anchuras por filas, pesos de los cinco tipos no jefe, versión e ID prefijo. Generar nodos y conexiones con `RandomTickets`; jefe único añadido en fila final. Garantizar cada nodo alcanzable y cada rama acceso al jefe, sin ciclos/saltos hacia atrás. La elección de anchuras, pesos y seed no es distribución de nodos productiva. Fixture de 15 nodos + jefe comprueba tamaño MVP sin afirmar que sea su topología aprobada. Columnas con `NodeCoordinate`, sin renderer en núcleo.
