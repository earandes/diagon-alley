# Contrato previo de persistencia PostgreSQL

A32 requiere PostgreSQL/Redis; Docker Server 28.0.4 responde en este equipo. Antes de escribir adaptador: `GameTransactions` exige aislamiento por jugador, snapshot validado y commit de inventario/copia/recibo conjunto. El schema relacional separará cuentas, inventario, unidades, copias y recibos. El estado dinámico de run se añadirá como JSONB al integrarse `Run`; no inventar progreso ausente en el modelo actual.

El adapter de PostgreSQL adquiere conexión dedicada y `SELECT ... FOR UPDATE` sobre la cuenta antes de cargar agregado; escribe todo dentro de BEGIN/COMMIT en esa conexión. Ante fallo ROLLBACK; no devolver snapshot antes de commit. La inicialización idempotente de cuenta acepta un snapshot validado por aplicación y no decide regalos/stats: de ese modo no rellena U25 por infraestructura.

Pruebas RED antes del adapter; servicio nuevo aislado `arcana-*` exclusivamente con puertos de loopback, DB de pruebas y credenciales locales de desarrollo explícitas. Nunca ejecutar contra una DB externa, variables heredadas o datos previos. Tests reales: create concurrente único, dos conexiones para una unidad/revisión, rollback tras escritura antes de commit, lectura de copia y receipt tras cerrar/reabrir pool, replay original, rechazo de otra cuenta y cambios JSON incoherentes. Tests pueden limpiar exclusivamente filas de IDs generados para este test.

No usar SQLite como sustituto de la aceptación A32. Disponibilidad de Docker/archivo compose o adapter escrito no equivalen a prueba pasada. Capturar comandos/resultados reales. Redis se comprobará en un bloque separado con sesión/rate limiting y cursor autoritativo SQL, sin decidir TTL/limites comerciales silenciosamente.
