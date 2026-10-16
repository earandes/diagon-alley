# A46 — Navegación recuperable y errores explicados

12 octubre 2026. Incremento autorizado dentro de la presentación ARCANA; sin cambiar reglas, balance, API o inventario.

Estado inicial: vistas solo en memoria; reload vuelve al mapa, atrás no recorre pantallas. Error general fuera de diálogo puede quedar inaccesible bajo modal. Bosque desbloqueado ya visible en Misiones, falta asociación explícita en resultado del jefe.

Acciones/resultado: navegar Mapa/Cromodex/Bazar/Misiones o replay, cambiar subtienda, volver atrás/adelante y recargar conserva vista mediante hash de rutas cerradas. Hash desconocido vuelve al mapa; arena sin combate guardado explica ausencia con retorno. El hash no contiene IDs económicos, tokens ni peticiones. Cambiar idioma conserva pantalla; navegar nunca ejecuta comando. Foco al contenido cuando cambia ruta, sin captura de foco inicial.

Errores: mensajes es/en para energía/fondos/llaves/formación/stock/versiones/sesión/persistencia/intención pendiente/resultado incierto. No convertir error desconocido en recompensa o rechazo confirmado. Diálogo de nodo muestra la causa y recuperación existente. Actualizar y confirmar de nuevo ante versión obsoleta; no reenviar silenciosamente una petición distinta.

Boss: resultado de victoria muestra desbloqueo guardado y acceso a Misiones. Lista explica ruta futura todavía no disponible. No añadir Bosque de 20 nodos, economía offline, router externo, nueva autoridad o almacenamiento.

Aceptación: pruebas de parseo/canonicalización y mensajes antes de implementar; ampliar casos de navegador ya existentes es/en/Chromium/WebKit para hash/back/reload y SQL intacto. Error simulado de HTTP declarado como tal, nunca prueba de rechazo económico real. Núcleo/reglas ya cubren validaciones autoritativas. Verificar build/tipos/regresión apropiada y registrar límites.
