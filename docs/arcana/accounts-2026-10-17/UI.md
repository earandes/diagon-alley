# A76 · Entrada y cuenta como carta consultable

## Diseño elegido

Se compararon dos composiciones con arte existente: tres portales equivalentes de acceso, o una entrada de cuenta compacta delante del Callejón conservando el portal invitado. Se elige la segunda: Crear cuenta como acción de cuenta principal, Iniciar sesión con contraste secundario y Jugar como invitado en el portal ilustrado existente. No se cambia el nombre accesible histórico del portal para conservar las regresiones. La ayuda breve comunica el límite del invitado, sin prometer recuperación sin sesión.

En Ajustes hay un único acceso: Guardar mi partida para invitado, Mi cuenta para cuenta conocida y Acceder a mi cuenta sin partida. La identidad conocida aparece aquí, fuera del HUD económico. Un fallo de consulta de identidad se muestra como indisponibilidad; nunca se convierte en invitado por defecto.

La carta modal reutiliza ui.missions y ui.pass, colores/contraste de lectura y la fuente Cinzel del juego. No necesita recursos nuevos. Correo, contraseña y código son campos nativos con etiquetas, autocompletado y pegado, excepción funcional explícitamente autorizada al lenguaje de objetos de juego. Desplazamiento del diálogo admite móvil y texto ampliado. Sin animaciones, partículas ni trabajo gráfico continuo.

## Recorridos y límites

- Crear cuenta solicita solo correo. El mensaje es genérico, no afirma que exista una cuenta ni que se haya entregado correo por Internet. Tengo el código permite introducir token y elegir contraseña15–128 antes de vincular/iniciar.
- Login conserva current-password y botón Mostrar contraseña. Entrar desde una partida utiliza por defecto el mismo propietario; abrir otra partida exige una acción voluntaria diferenciada. Con intención pendiente no se ofrece cambio de propietario.
- Recuperación solicita correo, después token/contraseña y vuelve a login. No transporta el token en URL ni lo guarda en almacenamiento local.
- Registro, verificación y logout hacen preflight del controlador; lectura de IndexedDB y exclusión cubren el transporte y la carga. Solo login del mismo propietario admite recuperar intención pendiente.
- Respuesta de autenticación incierta conserva la partida y muestra Comprobar sesión antes de otro envío. Un error de carga autoritativa no se oculta cerrando el modal como éxito.
- Las consultas y cancelaciones no consumen ni entregan. No hay mezcla de colecciones, migración económica del navegador o gasto automático.

## Verificación del subagente

`npx --no-install vitest run tests/domain/arcana/accounts-ui-a76.test.ts`: siete casos correctos de render estático/transporte. Acreditan ES/EN de registro, semántica de campos, explicación del cambio, bloqueo de cambio/logout con pending, no-store/same-origin y distinción entre transporte incierto y rechazo. No acreditan foco real, responsive, envío externo, animación ni comprensión humana.

`npm run typecheck`: primera pasada detenida por incompatibilidad de tipo del gateway en identidad (archivo del coordinador); ninguna incompatibilidad UI en esa ejecución. Una segunda pasada de `npm run typecheck` terminó correctamente tras integrar las correcciones del coordinador. La validación final y CI corresponden al coordinador.

No se abrió navegador ni se ejecutaron servicios, matrices gráficas, perfiles o capturas desde este subagente. La inspección Linux seleccionada, teclado/foco,texto ampliado y ambos packs siguen siendo responsabilidad de la batería coordinada, sin atribuirlas a este render estático.
