# A79 · Acceso breve dentro del juego

18octubre2026. Enric autoriza replantear e implementar crear cuenta, verificar correo e iniciar sesión: muy sencillos, mínimos botones, información concisa y apariencia de juego. Baselinea8948e8, rama/PR7 existente. Sin main, despliegue o publicación. Evidencia A76–A78 intacta.

## Diagnóstico y elección

Hecho: la carta A78 repite salida superior/inferior, muestra enlaces alternativos simultáneos, revelado de contraseña como fila completa y párrafos de ensayo/ayuda permanentes. Verify ocupa casi toda la altura390. Autenticación/propietario/recuperación ya funcionan y no se rehacen.

Dos alternativas: dividir cada credencial en más pantallas reduce campos por vista pero añade pasos y navegación; carta de una tarea con ayuda contextual conserva1–2campos imprescindibles y reduce decisiones visibles. Se elige la segunda: objeto ilustrado central, título, campos discretos, un sello de acción y una sola ayuda contextual. Excepción necesaria: credenciales siguen siendo campos semánticos convencionales.

## Recorrido y aceptación

- Registro: correo → solicitar código → código+contraseña → cuenta/partida conservada.
- Login: correo+contraseña → entrar; ayuda ofrece recuperación/crear cuenta.
- Verify/reset: destinatario, código y contraseña; ayuda/reparación para otro código conserva contexto.
- Un solo cierre superior; sin otra fila Volver. Mostrar contraseña mediante ojo accesible junto al campo.
-1acción principal; máximo3botones visibles normalmente (incluye cierre/ojo). Alternativas reales en un único desplegable contextual, sin anidar menús.
- Aviso breve y visible de ensayo local/sin correo externo. Detalle del buzón/caducidad/gestor a demanda. No afirmar que se envió correo a una identidad inexistente.
- No ocultar costes de abrir otra partida: advertencia completa antes de elegir, selección explícita, pending mantiene propietario. Un error abre su reparación pertinente.
- Errores próximos a la acción. Respuesta de identidad incierta sustituye submit por Comprobar sesión, sin otro CTA equivalente.
- Semántica, ES/EN, ambos packs, foco, teclado/toque emulado,200%, ausencia de arte y reducido.

## Exclusiones y datos

No backend, schema, authmétodo, KDF, dominio, economía, recursos del jugador, tokens, probabilidades o reglas. No nuevo arte raster, dependencias, servicios, audio o animaciones. Se reutilizan objetos por pack; fuente de dos iconos funcionales inline es JSX/SVG. Cancelar/consultar siguen sin operar. Fuente de verdad y recuperación A76/A78 conservadas.

## Plan vivo

1. [hecho] Composición, texto y ayuda contextual.
2. [hecho] Adaptar pruebas de navegación a las acciones visibles reales y aceptación A79.
3. [hecho] Tipos/build/unitarios y validación serial Linux de cuentas; siete capturas finales inspeccionadas. CI39087507256 correcto.
4. [hecho] Corrección visual mínima confirmada; documentación y evidencia conservadas, entrega en PR7 sin merge.

No navegador gráfico local. CI con guard, bloqueo, watchdog, unworker/cero retry. No observar jugadores ni dispositivo físico ficticios. La aprobación estética humana sigue pendiente.
