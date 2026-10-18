# A78 · Acceso recuperable coherente con el juego

18 octubre2026. Corrección de F01–F08 A77 sobre A76 y la dependencia A75. Rama feature/a76-recoverable-accounts, PR7 draft sobre feature/a75-experience-fixes. Sin integración main ni despliegue.

## Qué cambia para quien juega

- Crear cuenta o recuperar acceso lleva directamente a introducir el código, conservando destinatario y propósito. Reenvío y cambio de correo se hacen deliberadamente desde la misma ruta; cancelar conserva partida.
- Las instrucciones de error tienen una salida pertinente. Una respuesta de correo perdida permite solicitar de nuevo; una autenticación incierta conserva Comprobar sesión y la recuperación del mismo dueño.
- La contraseña nueva comienza oculta y cliente/servidor utilizan la misma política Unicode. Se conservan pegado, autocomplete y credenciales anteriores, sin recortar o normalizar.
- Todos los Ajustes del juego ofrecen el mismo acceso, también desde nodo, preparación, forja/bóveda y apertura. La sesión se consulta antes de elegir la pantalla; otra pestaña no convierte el jugador cargado silenciosamente en otro.
- Cerrar funciona con flecha siempre visible y área44px; los errores quedan junto a la acción de reparación. El texto ampliado puede desplazarse. La confirmación focalizada comprueba título legible sin arte al200%.

## Diseño conservado

Escenario y personajes conservan protagonismo fuera del acceso. La cuenta permanece en bienvenida/Ajustes, sin otro control permanente en mapa. Se conserva la carta azul/oro y tipografía ilustrada; credenciales mediante campos nativos por su función, sin disfrazarlas de objetos. Un único coordinador mantiene origen, foco y guardas. No nuevos fondos, personajes, partículas o rituales; solo una flecha vectorial inline para una acción crítica independiente de carga.

## Garantías

No cambios de economía, combate, snapshots, kit, botín, schema o KDF. No fusión de partidas ni apropiación por ID. Vincular sigue asociando el mismo playerId. Pendientes económicos conservan key/propietario/receipt; consultar y cancelar no operan. Cambiar de dueño confirmado desmonta contextos y quotes anteriores. El servidor continúa decidiendo y guardando resultados.

## Evidencia y límites

CI39085206200 SUCCESS:622unitarios,99PGRedis,30A76,16A78 y2A75baseline correctos. Head7018045; checkout real65df2f7. Pruebas reales de código/contraseña, vínculo, recurso guardado con respuesta perdida, otras pestañas, propietario, stock y borradores/contextos. Fixtures y cuotas declaradas en los tests. [QA completa, fallos conservados y confirmación](QA.md), [matriz por finding](MATRIX.md), [galería](GALLERY.md).

Confirmación final de cabecera sin arte y captura de login: CI39085627260 SUCCESS, headf35015c /checkoutcc521924,6A78,30A76 y2A75baseline;622unitarios y99PGRedis. Dos capturas inspeccionadas. Separa esta pasada de la batería anterior; no atribuye toda la matriz a otroSHA. No navegador local, video, perfiles ni captura del Mac.

No se ha repetido toda la campaña y sus benchmarks: renderer y reglas permanecen sin cambios. No se acredita entrega de correo externo, seguridad productiva completa, gestor real, lector hablado o dispositivo físico. El buzón sigue siendo privado/local. Los tiempos de tests son automatizados, no tiempos humanos; no hay nuevas mediciones GPU/rAF ni se promete una mejora universal de rendimiento.

## Después

Observar sin explicar la solución: solicitar→código→reparar un error; guardar desde un Ajustes contextual y volver; reconocer la identidad tras vincular. Preguntar qué partida creen que se abrirá al entrar en otra cuenta y si el cambio de sesión se entiende. No usar esta sesión para convalidar retroactivamente tests o afirmar diversión/retención.
