# Contrato de kit y equipo ARCANA (antes del código)

11 octubre 2026 · A30/A32. Quinto bloque necesario para kit/banqueta/Cromodex: persistencia del aprendiz y equipo poseído, sin elegir balance U25 o identidad U26.

## Inicialización

`InitializePlayerUseCase` lo invoca autoridad, nunca un request que aporte playerId/saldo. `PlayerAccounts.create` inicializa una vez en SQL, incluidas dos conexiones competidoras. Si la cuenta ya existe se devuelve su estado sin volver a consultar catálogo/reloj ni conceder regalos. Cuenta ausente: catálogo versionado de autoridad debe contener Aprendiz de Alquimia con stats suministrados. Una copia nivel 1, Varita de Abedul +2 poder (sin núcleo elegido por el PRD; núcleo null, multiplicador neutral 1), Céfiro Cadete +3 iniciativa, 50 Coronas, Esencia llena hasta 50. Cero sapos/grageas añadidos. IDs de kit estables dentro de cuenta; no importar datos de la demo histórica.

Equipment es entidad de inventario por ID, versión y tipo. Varitas: maderas Abedul/Sauce/Saúco, núcleo null para starter o Dragón/Fénix/Wyvern cuando configurado; bonus/multiplicador explícitos. Escobas: Céfiro Cadete/Céfiro 2000/Saeta del Viento e iniciativa. Datos posteriores de forja/precios siguen pendientes, no se conceden por este modelo.

## Formación, equipamiento y run

Equipo persistente con IDs de copias activas (0–5 fuera de run) y loadouts por copia poseída. Asignar equipo mueve la instancia entre propietarios; una pieza no equipa a dos copias y cada copia tiene como máximo una varita/escoba. Desequipar devuelve al inventario, no elimina ni compra otra pieza. Nada puede asignarse a copia/item ajenos. Preparación calcula bonus únicamente del inventario/loadout de autoridad; la configuración aporta base/afinidad, no concede equipo que no se posee.

`SetTeamUseCase` y `EquipEquipmentUseCase` usan key/revisión, tx/receipt/replay y persisten antes de mostrar éxito. Se pueden gestionar entre nodos; no reinician vida/PM. Una run conserva además reservas de copias propias que se retiraron: reincluirlas recupera vida/PM residual, sin curación por alternar formación. Copia que entra por primera vez usa su snapshot de stats; temporal de pacto permanece en la run y nunca se convierte en copia/propiedad. Contar temporales al límite de 5.

El kit tiene 1 unidad. `StartRunUseCase` debe admitir exploración con 1–5 poseídas, sin conceder otras dos; motor de duelo conserva mínimo 3 por lado. Un duelo con menos de 3 se rechaza sin Esencia/seed/avance. Esto permite que la ruta productiva proporcione pactos o que el Bazar permita preparar formación, pero **no elige cómo se hace en la experiencia inicial** (U25). Run activa debe tener al menos una unidad viva; no sustituirla ni restaurarla mediante comandos de equipo. Cambio de formación inválido mantiene estado previo. Refugio cura solo equipo activo; no toda la reserva.

## Persistencia y aceptación

Inventario añade equipment, GameState añade team, Run añade reserves; campos opcionales normalizados a vacío para cuentas técnicas existentes, sin grants retroactivos. PostgreSQL tablas de gear/loadouts/miembros activos con referencias propiedad jugador; run/reserves continúan JSONB. Todos los cambios junto al receipt en tx de cuenta; outputs y versiones previos inmutables.

RED antes de implementar: kit exacto/idempotencia/config/propiedad, selección/desequipado/transferencia, bonuses de equipo poseído, consumo no afectado, cambios durante run, reserva con HP/PM, duelo demasiado pequeño y datos inválidos. Integración real: init concurrente, gear/team/reserves al reabrir pool, rollback/COMMIT incierto, dos clientes y API con schemas sin stats/precios/saldo de cliente. HTTP cliente añade comandos tipados. Etiquetas es/en vendrán de contenido/UI; no se considera recorrido visual cerrado sin conectarlos.

## Recibos y transporte aplicados

Kit guarda receipt `starter-kit` con catálogo/copia/equipo; una copia que reclama esa fuente necesita receipt y debe ser la única del grant. IDs de gear/copia de kit solo tienen significado dentro de su cuenta. Stats de aprendiz siguen configuración de autoridad (fixture en tests, no balance productivo).

`POST /api/team` recibe copyIds; `POST /api/equipment` recibe copia/slot/ID de pieza o null. La API no recibe bonus/precio/stats. `POST /api/runs` admite 1–5; la validación específica del duelo devuelve `422 INVALID_FORMATION` cuando faltan 3. Composición y cliente incluyen ambos comandos. Registro/login sigue U26: no existe un endpoint público que conceda cuenta indicando playerId.
