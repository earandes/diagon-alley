# A63 · Decisiones de interacción

16 octubre 2026. Implementadas dentro de B01/B02/B03. No son conclusiones de una sesión humana.

## Cierre → botín → otra intención

El estado cerrado de la run tiene una escena propia. El héroe visual, resultado y cantidades del último receipt sustituyen la preparación inicial 0/5. `expeditionClosure` es una proyección de lectura: el premio histórico procede del receipt de esta run y los destinos proceden del inventario **actual**. Nunca vuelve a conceder recursos.

Prioridad de acciones: llave disponible → Gringotts; rana sellada disponible → abrir esa unidad; equipo sin asignar → preparación/equipamiento; otra expedición → elección explícita de copias. Las alternativas permanecen visibles con menor peso. Puede aparecer una llave antigua junto a una victoria repetida, pero el botín repetido solo contiene lo entregado por esa victoria. No se promete una nueva llave. Cancelar preparación no inicia otra run. Consultar la bóveda no canjea; se mantiene su confirmación económica actual.

Abrir la rana es una acción explícita sobre su ID y versiones vigentes. Utiliza `open-toad`, nunca compra ni vuelve a sortear una operación confirmada. Continuar devuelve al cierre de esa misma run; ir al álbum es otra elección. Si el objeto se ha consumido, desaparece la invitación correspondiente al volver. Receipt, compañeros, procedencia y registro se conservan a demanda en «Tu recorrido». Bosque permanece futuro.

Victoria inicial/repetida, derrota y empate tienen estados independientes. La escena de derrota/empate conserva la explicación a demanda de copias propias/equipo frente a aliados temporales. No concede compensaciones.

## Arena → causas → desenlace

Dos columnas de figuras y PV, con posición numérica estable para distinguir repetidos. Actor, objetivo, delta y caído usan forma, texto/cifra y contraste además de color. PM, equipo, afinidad, gragea y efectos se consultan en el retrato; no desaparecen del modelo ni del registro. Inspector y libro pausan la reproducción y devuelven foco al origen. El usuario decide reanudar Auto.

Un grupo compacto contiene Pausa/Auto/2x/Omitir. Salida al mapa explícita arriba; el dock habitual no se superpone a unidades. El monedero se pliega, pero la consulta muestra el saldo confirmado actual. Resultado persistido antes de animar; estado inicial neutral «Combate guardado». El desenlace y su anuncio accesible solo aparecen al terminar u omitir. Cambiar idioma actualiza el texto visual sin repetir el anuncio previo, cuyo `lang` original se conserva.

Las composiciones 5×3 y 5×5 se comprueban con fixtures declaradas de presentación, además del 3×3 real de campaña. Adaptación de figuras a geometría DOM medida; no se quitan unidades para hacer caber la escena. Inspectores y texto ampliado admiten desplazamiento.

## Gragea → contexto → portador → efecto

La tienda abre un conector breve sobre su contexto. Con cero combates alcanzables, indica dónde podrá prepararse y permite volver al mapa. Con exactamente uno, «Preparar duelo/jefe» abre su preparación por elección explícita, sin ejecutar comandos. Con varias ramas devuelve al mapa; no presenta dos destinos indistinguibles ni elige por el jugador.

Ante un duelo/jefe, preparar equipo permite consultar puestos, condición, procedencia y gear. Una bandeja única de tarros reales conduce a una fila de portadores: seleccionar tarro, tocar portador; tocar otro lo mueve; repetir portador lo quita. Cada unidad y portador son exclusivos. Caídos visibles/deshabilitados; reservas fuera de asignación. Confirmar y cancelar se mantienen visibles en una barra adherida mientras se consulta el contenido.

Cuatro estados distintos: selección de formación sin guardar; formación confirmada; equipo guardado mediante comando propio; asignación local de consumibles. Cerrar no revierte equipo ya confirmado. El borrador de grageas se liga a jugador/run/revisión/nodo/versiones de reglas; idioma y pack no lo invalidan. Cancelar/cambiar nodo/recargar lo abandona. Un cambio real de equipo/revisión lo invalida. Consultar/asignar/cancelar no consume ni descubre sabores; el comando de combate vigente lo confirma una vez.

Comparaciones de equipo usan `equipItem`, `equipmentBonuses` y las mismas funciones puras de potencia/iniciativa del motor. Alquimia 2→3 usa `activeSynergies` y el valor real de reglas. Heridas/PM/afinidad de miembros y reservas prevalecen sobre catálogo. Proyección pública opcional de afinidades para copias fuera de run; payload antiguo sigue válido y dato ausente no se inventa. No se calcula ni promete victoria.

## Correcciones encontradas al integrar

- WebKit no enfoca automáticamente botones pulsados con ratón. Los emisores entregan `event.currentTarget` a preparación y cierre; Escape devuelve foco a ese control, sin listener global.
- Otro tab puede resolver un nodo mientras su confirmación está abierta. Al refrescar autoridad, una selección ya no alcanzable se cierra, borra opciones/borrador y devuelve foco; `resolveNode` también comprueba disponibilidad. No se envía otra intención sobre un evento ya cerrado.
- Borrador de formación se limpia también al pasar de run activa a entrada nueva, conservando idioma/pack/equipo como contextos independientes.

## Recursos

Reutilización de assets actuales. Sin nuevos personajes, fondos, apertura de ranas, audio, dependencias o servicios. Licencias/procedencia y fuentes editables previas conservadas. Los roles visuales no alteran IDs económicos.
