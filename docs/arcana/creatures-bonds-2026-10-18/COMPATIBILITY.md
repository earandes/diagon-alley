# A87 · Compatibilidad y autoridad

## Versiones

| Dimensión | Perfil A85 | Perfil A87 |
|---|---|---|
| Catálogo / tabla | 3 / 3 | 4 / 4 |
| Identidades base / tickets aleatorios | 30 / 29 | 34 / 33 |
| Rasgos nuevos de catálogo | traits-v1 | traits-v2 |
| Contenido táctico | 3 | 4 |
| Reglas / motor de registros nuevos | 2 / 2 | 3 / 3 |
| Campaña y derechos únicos | 1 | 1 |
| Acabado encantado | 1% independiente, cosmético | Igual |

Los perfiles explícitos `a84` y `a85` siguen construyendo el contenido histórico. `trial-v1.json` y `traits-v1.json` no se modifican. Los parámetros maestros de las 30 identidades anteriores, sus rarezas y estrellas permanecen.

## Qué se conserva

Las expediciones activas usan su campaignSnapshot, reglas, rivales y versiones. Ausencia histórica de snapshot conserva el fallback anterior y excluye pasivos nuevos. No se regenera una ruta al actualizar catálogo, idioma o paquete. Un run antiguo no recibe Orden, Mortífagos o criaturas de forma retroactiva.

Una copia guarda su identidad y snapshot de adquisición. Cromodex muestra la clasificación descriptiva actual del catálogo, mientras que un combate utiliza los miembros congelados en sus reglas. No se utiliza la biografía viva para recontar un registro antiguo.

El campo opcional `bondFocus` separa el modo solicitado en Team/Run del foco efectivo `houses|order|death|creatures` fijado en el input de combate. `auto` se resuelve antes de ejecutar el motor; el renderer no vuelve a resolverlo tras una caída o cambio de catálogo. El modo viaja tanto en SetTeam como en StartRun, sin depender de que otro comando de equipo se haya ejecutado primero.

## Operaciones

Se conservan propietario, clave, petición y receipt completos, incluido el vínculo. La misma clave con otra selección da conflicto. Un resultado confirmado con respuesta perdida se recupera sin otra elección, sorteo, pago o consumo. Dos revisiones concurrentes no guardan dos resultados sobre el mismo estado. Los campos de cliente expresan intención; el servidor prepara las unidades y resuelve los efectos.

El nuevo log registra activación, contribuyentes, valor, ayuda, daño final y protección real. `healed.actorId` sigue siendo el receptor histórico; `healerId` identifica por separado al ayudante. El replay verifica y proyecta los deltas guardados, sin aplicar otra vez el bono. La cantidad bloqueada es daño bruto amortiguado, no una afirmación de PV salvados en presencia de exceso de daño.

No hay tablas nuevas, migración destructiva, copia de saldos del navegador o cambio de sesiones. La persistencia JSONB utiliza validación aditiva. PostgreSQL/Redis reales verifican los contratos pertinentes; ello no acredita un despliegue o una migración productiva ejecutada.

## Premios y economía

Campaña 1 conserva los derechos únicos. Un caso de integración gana antes y después de cambiar de contenido y comprueba una sola llave. Los premios, precios, costes y regeneración no cambian. Las nuevas composiciones de Pacto sí pueden cambiar condición, victorias e ingresos: el estudio conserva ese efecto.

La tabla 4 cambia probabilidades normalizadas al añadir cuatro identidades. Consultar probabilidades no gasta; una petición obsoleta requiere actualizar y reconfirmar. Aperturas históricas se recuperan incluso cuando la configuración viva ya es otra. Encantado continúa sin multiplicador para el conteo o estadísticas.

## Límites

No se promete que un cliente anterior pueda interpretar un registro del motor 3. Las actualizaciones y errores de versión mantienen los mecanismos existentes; no se ha desplegado una convivencia productiva de clientes antiguos y nuevos. Las pruebas utilizan cuentas aisladas, fixtures declaradas y servicios locales/CI. No alteran la partida habitual. La evidencia gráfica, recuperación conectada y resultado final de CI se registran en QA.
