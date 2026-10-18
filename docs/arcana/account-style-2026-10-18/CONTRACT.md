# A80 · Acceso como correspondencia del Callejón

18 octubre 2026. Enric pide aplicar skills/herramientas para mejorar estilo y diseño de las nuevas pantallas. Baseline `e537d4d`, rama feature/a76-recoverable-accounts, PR7 dependiente de A75. Trabajo autorizado en rama, no main/despliegue. Se conserva A79 y su evidencia.

## Hecho, interpretación y elección

Las capturas A79 y su CSS coinciden: una tarjeta azul con un objeto de76px sobre campos oscuros y botón dorado. Concisión y recuperación probadas; sigue teniendo composición genérica de formulario. Esto último es juicio experto, no observación de jugadores.

Alternativas: (a) ampliar el icono sobre la misma tarjeta mantiene el esqueleto; (b) folio de correspondencia con objeto/título en una cubierta y escritura sobre papel cambia la composición y materialidad. Se elige b, utilizando papel, tinta, azul y ciruela ya presentes en las ilustraciones/UI. No fondos nuevos, dependencia, generación de pago o renderer nuevo.

En escritorio, objeto de mayor escala y título en una zona lateral; credenciales en una hoja contigua. En móvil se apilan en flujo. Campos nativos sobre papel con etiqueta y línea de escritura. Una única acción oscura y legible, sin el pequeño check decorativo que puede parecer una tarea marcada. Ayuda discreta y cerrada salvo reparación. El foco cambia de tinta según soporte, sin eliminarlo.

## Recorrido, estado y recuperación

Crear → código → vincular; entrar → misma partida; recuperar → código → nueva contraseña; error → acción pertinente. Se conserva todo el comportamiento A76–A79, sin cambios de backend/controlador/mensajes/dominio ni nuevos botones o pantallas. Consultar/cancelar no opera. No cambiar tokens, propietarios, snapshots, reglas o economía. Guardas de incertidumbre conservadas.

## Aceptación y plan

1. Implementar composición/estados con recursos existentes; sin nueva información visible.
2. Tipos/build/pruebas pertinentes. CI Linux serial de cuentas, guard/lock/watchdog intactos. Sin Chrome/Browser ni suite gráfica en Mac.
3. Inspección conjunta de capturas seleccionadas móvil/escritorio, ES/EN y paquetes; una corrección por lote si hay defectos, una confirmación como máximo.
4. Verificar encabezado/objeto/CTA, campos y todos sus estados, 44px, foco,200%, ausencia de arte, sin overflow. El papel mantiene contraste mínimo4,5:1 para texto funcional; los controles no dependen de color.
5. Preservar o mejorar la concisión A79: mismos campos, dos o tres botones más ayuda. Móvil ordinario inferior a660px de alto, inspección ampliada desplazable. No ocultar información para cumplir.
6. Documentar resultados y evidencia; actualizar PR7 sin merge. Observación humana, teclado virtual y dispositivo físico pendientes.

Skills: Game UI/UX (flujo/responsive/foco), Impeccable bolder/craft-floor (composición/jerarquía), fantasy (tokens/estados). Sus fuentes/font defaults no sustituyen Cinzel y la dirección vigente. No subagentes ni baterías paralelas. No se añaden efectos perpetuos, audio o nuevos assets.
