# A77 · Plan ejecutable posterior, todavía no implementado

No cambiar autenticación, reglas, KDF, precios, botín, inventario o snapshots para reparar la interfaz. Fuente de evidencia y aceptación en FINDINGS. No producir assets nuevos: primero resolver composición, estado y navegación con los existentes.

## 1. Solicitar → verificar → reparar → terminar

F01/F02/F03/F08. Separar solicitud de código de introducción y reenvío. Correo/propósito permanecen reconocibles; errores ofrecen reparación en el mismo contexto. Mostrar contraseña se limita a la tarea donde se eligió. Alinear la medida de longitud Unicode sin cambiar15–128 puntos/512 bytes o recortar credenciales. Ajustar copy ES/EN a la entrega real de ensayo, sin prometer correo externo.

Pruebas que deben fallar antes del fix: estado aceptado tiene continuación dominante; continuar no vuelve a enviar; reenviar es explícito; cambiar a contraseña nueva comienza oculto; inválido/caducado/usado tiene vuelta directa a solicitud; pérdida de respuesta de correo no pide una consulta inexistente. Preservar códigos genéricos antienumeración. Un error de autenticación incierta sigue ofreciendo comprobación y reautenticación del mismo propietario.

Recorrido completo: registrar desde bienvenida e invitado; recuperar contraseña; volver/cancelar; recargar mientras se consulta el buzón; completar con un único kit/vínculo. Reutilizar PG/Redis reales de A76 y buzones privados aislados, no importar datos del navegador.

## 2. Identidad vigente → contexto correcto → continuidad

F04/F06. Resolver o reconciliar modo con sesión vigente y respuestas fuera de orden. Un único coordinador App y propietario/guardas compartidos, no un autenticador diferente por GameSettings. Integrar estado y acceso contextual en las cinco instancias sin competir con el mapa.

Pruebas: dos pestañas guest→account, logout/revocación en otra, actualización tardía y modo pertinente; Ajustes desde mapa/preparación modal/nodo/forja-bóveda/revelación. Consultar o cancelar no escribe. Una operación incierta conserva key/propietario/receipt y bloquea cambio; mismo dueño puede recuperar.

Cuando el cambio de cuenta sea explícito, resolver los borradores del contexto anterior: no dejar una quote de forja o selección de nodo operable bajo otro dueño. Cerrar solo contextos propios, devolver foco al origen conectado o a un destino pertinente. No modificar operaciones ya confirmadas por cerrar la escena.

## 3. Composición móvil → fallo visible → salida clara

F05/F07. Reservar área para cierre y corregir apilado local. Error junto a acción que lo repara, antes de enlaces secundarios. Mantener texto/foco y desplazamiento para ampliación; no ocultar advertencias o bajar fuentes para aparentar que cabe.

Pruebas: hit-test de centro y puntos interiores del objetivo44 px; teclado/ShiftTab/Escape/retorno y toque sintetizado; icono ausente con salida visible. En390,1280,865 y texto 200%, error localizable con salida pertinente. No imponer que todo el texto ampliado quepa sin scroll. Capturas acotadas comparables: carta, conflicto, cierre y code-error, no otra matriz completa.

## Cierre del fix

1. Diseñar el cambio mínimo y añadir aserciones de aceptación sobre los diagnósticos actuales.
2. Implementar sin ampliar reglas o arte.
3. Ejecutar tipos/build/pruebas pertinentes y una tanda gráfica serial Linux, guard/lock/watchdog, cero reintentos; no gráfico local fuera de la excepción existente.
4. Inspeccionar evidencia y corregir defectos demostrados en una confirmación acotada.
5. Preservar fuente/receipts, actualizar documentación porSHA y PR; merge requiere autorización que esta auditoría no concede.

H01/H02 no son tareas obligatorias de este fix: observar si basta Mi cuenta/email como confirmación y elegir deliberadamente la jerarquía de bienvenida. Un acuse breve solo después del vínculo guardado, sin recompensa o ceremonia.
