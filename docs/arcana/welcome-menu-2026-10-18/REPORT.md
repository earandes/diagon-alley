# A82 · Menú de entrada

## Cambio de experiencia
Una identidad centrada con emblema y filete ornamental sustituye cabecera+nombre de lugar repetidos. El Callejón conserva el protagonismo y queda visible entre marca y acciones. Invitado ocupa la primera posición y el material dorado; iniciar sesión azul y crear cuenta noche mantienen acceso inmediato. Orden visual y teclado coinciden. La advertencia de invitado conserva su contenido veraz.

FantasyActionButton agrupa marco doble, esquinas ornamentadas, relieve, objeto y flecha. Las etiquetas siguen siendo texto y la acción un botón nativo. Objetos A81 reutilizados, sin producción adicional, bibliotecas o créditos. No se reencuadran fondos ni cromos. La marca se localiza como Callejón Diagón/Diagon Alley; ARCANA conserva su identidad.

Ajustes44px, símbolo24px, en margen seguro. Acciones76/80px ordinarias, nunca menos56px. Pulsación localizada120ms y borde160ms; la carta de acceso entra con opacidad160ms sin retrasar foco o peticiones. Sin relojes JavaScript nuevos, loops o audio. Reducido conserva resultado/estado sin movimiento. Se retira el espacio de cabecera del layout antiguo en bienvenida; el mapa mantiene su cabecera.

## Lo que se conserva
Registro/login/invitado, campos nativos y gestores de credenciales, error, mutex de entrada, recuperación, propietario, keys/receipts y foco A75–A81. No cambios al dominio/economía/combate, ni a probabilidades, catálogo o inventario. Ninguna operación real de la partida habitual. Las pruebas usan contextos aislados y namespaces UUID.

## Evidencia y límites
Baseline visual: A81/evidence/final/chromium-390-a81-welcome.png sobrec9955b4, fuente equivalente028ac85 (documentación posterior). La referencia nueva es el PNG aportado por Enric, guía de composición; no se recorta para producir controles.

Local:624tests unitarios correctos, tipos/build/scanner correctos. Detector de layout sin findings. Batería general Linux CI39115461901 SUCCESS sobre f9082cf (624unitarios,99PG/Redis,446casos gráficos activos/258omisiones). Se inspeccionaron siete capturas y se corrigió el marco opaco heredado. La posterior reserva de Ajustes y emblema ante arte ausente se confirma con fixture real paraSVG incrustados enCI39119749580; ver QA y equivalencia de fuentes por scope. La galería corresponde expresamente af9082cf, sin atribuirla a otroSHA. Los jobs cancelados de preparación no cuentan como éxitos. Ver QA para resultado final.

No se atribuye comprensión/diversión a tests. Observación humana, móvil físico, lector hablado, gestor real y correo externo pendientes; no impiden revisar técnicamente el menú. Sin despliegue/publicación.

## Entrega
Recorrido técnico completo: elegir invitado o cuenta, consultar/cancelar con foco, confirmar entrada con feedback y continuar mediante los sistemas existentes. Validación y equivalencia cerradas; [estado de integración PR7](https://github.com/earandes/diagon-alley/pull/7). Main incorpora también la dependencia A75 sin duplicarla. La evidencia histórica y los Word permanecen intactos. No se atribuye una batería nueva al commit documental o al merge.

**Qué conservar:** escena, emblema/objetos A81 y cartas de cuenta A80. **Qué cambia:** composición, jerarquía, marco/materiales compartidos, respuesta localizada y recuperación visual ante arte ausente. **Pendiente:** percepción humana, móvil físico, lector hablado, gestor real y correo externo; sin despliegue. Ver [QA](QA.md), [galería](GALLERY.md), [rendimiento y límites](PERFORMANCE.md) y [equivalencia](EQUIVALENCE.md).
