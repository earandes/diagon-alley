# A67 · Movimiento de encuentros

16 octubre2026. Reutiliza la coreografía finita de entrada/salida A60/A66. No anima ni decide resultados en cliente. Sin audio automático, shake, flashes, partículas, loops o recursos nuevos.

| Evento | Información y capas | Anticipación / acción / reacción / cierre | Duración y omisión | Reducido / rendimiento |
|---|---|---|---|---|
| Abrir Encuentro | Identidad del NPC y alternativas del snapshot | Diálogo visible; entrada heredada200ms ease-out y retrato estático | No bloquea selección; cerrar cancela | Entrada sin animación en reducido; no renderer adicional |
| Hover con puntero preciso | Identificar el objeto seleccionable | Objeto asciende2px y borde se ilumina; vuelve al salir |160ms ease-out; interrumpible | Sin traslación/transición en reducido; transform/CSS local |
| Elegir trato | Borrador inequívoco | Borde/superficie/sello cambian y aparece selección de portador o preview; no partículas |160ms; no espera ni bloqueo de input | Estado estático equivalente; DOM acotado a dos opciones y cinco integrantes |
| Elegir portador | Destinatario concreto y condición exacta | Retrato recibe borde/sello; cifras antes→después cambian por helper compartido | Inmediato; se puede cambiar/cancelar | Ninguna animación obligatoria; no recomputación de combate |
| Seleccionar pasar | Avance sin trato | Marca en acción secundaria; preview de trato se retira | Inmediato; confirmar aún explícito | Igual sin movimiento |
| Confirmar | Autoridad, no espectáculo anticipado | Controles deshabilitados mientras opera; solo tras receipt aparece resultado confirmado/condición del equipo | Tiempo real de red/guardado, sin retraso artificial | Resultado recuperable idéntico en reducido, recarga y respuesta perdida |
| Regresar al mapa | Control y continuidad | Cierra diálogo, devuelve foco al nodo/recorrido y proyecta estado confirmado | Sin bloqueo decorativo | Registro/condición siguen accesibles si falta arte |

La omisión de replay/apertura existentes no afecta los Encuentros deterministas. Cambiar idioma o pack solo cambia presentación: no reejecuta el trato ni reproduce una celebración como otra concesión.

Las mediciones deben contar acción→respuesta utilizable, incluyendo red. No se declara60FPS ni mejora de rendimiento a partir de duraciones CSS. El perfil del incremento y sus límites se registran con mediciones ejecutadas, por separado.
