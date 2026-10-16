# A60 · PokéLike como referencia y diez anotaciones

15 octubre 2026. Encargo autorizado: estudiar https://pokelike.xyz/ en Chrome y Browser, explicar qué adaptar/conservar y después implementar y validar. Los comentarios son feedback del propietario; la exploración técnica del referente no es una prueba con usuarios. A59 queda como línea base, con hashes de todo src/arcana antes de editar.

## Alcance antes de implementación

| Anotación | Acción prevista | Aceptación |
|---|---|---|
|1/3 Compra y siguiente acción|Una acción principal inequívoca por producto; rana comprar y abrir con precio explícito, unidad poseída abrir sin pagar de nuevo. Grageas compra y acceso directo a asignación, sin inventar una apertura de sabores.|Consultar/seleccionar no gasta. Confirmar cobra una vez; resultado guardado antes del espectáculo. Respuesta perdida/reintento/recarga no duplican ni vuelven a sortear. Si se combina compra/apertura, debe ser un comando atómico autoritativo, nunca dos efectos UI encadenados a ciegas.|
|2 Sabores|Retirar el armario de sabores del mostrador. Información junto al tarro; colección permanece en álbum.|Consultar no consume. Diferenciar poseer grageas de descubrir el sabor al activarse en combate.|
|4 Retorno|Flecha clara de regreso con escena de callejón/puerta y nombre breve.|Teclado, foco y ambos idiomas; vuelve a calle de tiendas.|
|5 Apertura/rango|Coreografía integrada alrededor de la carta, formas/color/intensidad por rareza, fin acotado.|Mantener Canvas2D/GSAP, omitible, reducido estático, sin WebGL nuevo, audio automático o esperas anteriores al clic.|
|6 Iconos del mapa|Medallones con fondo local contrastado, silueta grande y rutas/estado inequívocos.|Seis tipos distinguibles sobre el paisaje, 44px de objetivo y mapa sin scroll en tamaños probados.|
|7/9 Diálogos|Escena/objeto central, una elección clara y confirmación explícita sin iconos duplicados.|Pacto propio/temporal claro, cofre previsualiza y solo confirma una vez; errores/recuperación intactos.|
|8 Origen|Marca de partida no interactiva, separada del primer evento. Visitados sin sugerir acción nueva.|No quitar el primer pacto ni cambiar grafos de partidas guardadas; salir con personaje no recluta ni entrega otra copia.|
|10 Formación|Roster compacto; detalles/equipamiento solo al inspeccionar. Eliminar panel permanente y texto de relleno.|Borrador/cancelación seguros; equipar confirmado conserva estado; temporales no seleccionables como copias del álbum.|

## Conservar y límites

Dirección ilustrada Teatro de alquimia/Diagon Alley, ARCANA intercambiable, es/en, React/Pixi8/GSAP/Fastify/PostgreSQL/Redis. No nuevas dependencias salvo necesidad verificada; cero servicios/créditos de pago. Sin importar arte, código o datos de PokéLike. No publicar, desplegar, push o alterar trabajo ajeno.

Precios, pesos, potencia, energía, duplicados, campañas y partidas existentes se conservan. La petición de reproducir una jugabilidad sencilla orienta flujo y decisiones; no activa automáticamente Nuzlocke, reinicios, pity, monedas nuevas o tablas copiadas. Las alternativas económicas se comparan como propuestas. Solo una región propia jugable; roadmap de regiones futuras conservado.

Cambios de autoridad mínimos solo si la compra/apertura combinada lo necesita: contrato nuevo y versionado compatible, idempotencia/concurrencia/rollback reales, sin migrar resultados históricos. Abrir unidades antiguas continúa funcionando.

## Validación prevista

Recorrido técnico en cuentas y puertos aislados, nunca automatizar la partida5194. Capturas antes/después y fixtures de rareza etiquetadas; datos autoritativos comprobados aparte. Unitarios de reglas nuevas, SQL/Redis y HTTP reales si se añade comando, flujos web ES/EN Chromium/WebKit, reducido/omitir/arte ausente/offline/reintentos. Medición final serial con build congelado y sin otros browsers/GPU. No atribuir escritorio a hardware móvil ni retención observada.
