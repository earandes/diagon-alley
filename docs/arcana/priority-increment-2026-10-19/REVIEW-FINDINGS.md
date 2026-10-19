# Revisión integrada previa a CI final

## R01 · Una sugerencia nueva invalidaba un plan de compañía todavía viable

**Evidencia → problema.** `availableIntentions` seleccionaba la primera compañía viable del catálogo antes de intentar conservar el plan escogido. Situación reproducida con fixture del catálogo vigente:3identidades Ravenclaw, elección Ravenclaw, adquisición posterior de3Gryffindor; ambas compañías viables. El selector devolvía Gryffindor/compañero/afinidad, dejando Ravenclaw fuera y marcando el plan como no disponible. No había pérdida de copias, pero se anunciaba una pérdida de viabilidad inexistente.

**Cambio mínimo.** Antes de sugerir otra compañía, conservar la ya seleccionada si el mismo predicado compartido confirma que sigue viable. No ofrecer más compañías, cambiar umbrales, equipar, consumir o iniciar una expedición. Máximo3opciones y tratamiento de intenciones antiguas conservados.

**Aceptación.** La compañía seleccionada continúa visible y con estado seleccionado tras ampliar colección; una compañía realmente inviable sigue sin quedar habilitada por esta corrección.

**Prueba.** Nuevo caso `keeps a viable selected Ravenclaw plan when new copies make Gryffindor eligible` en `company-intentions-a89.test.ts`. RED real:1fallo/7correctos mostrando Gryffindor en lugar de Ravenclaw; GREEN posterior8casos. Ejecución combinada con `intention-presentation.test.ts`:14/14correctos, incluido plan legado de grageas. Sin navegador local, Git o nueva CI atribuida. La primera CI sobre `aa575ea` no incluye este cambio; el coordinador debe verificar un candidato posterior.

## Cobertura de revisión de guía y lectura

Inspección de `ExpeditionGuide`, `ReadingPreferences`, preferencias, selector de objetivo, integración App y contratos de intención. La guía consulta sin avanzar, conserva mínimo de formación del dominio y coste constante compartido. Preferencias separadas por propietario/dispositivo, canales `storage` y memoria acotada, protección de contraste del sistema, cleanup de listeners y foco de orientación revisados por código. Esta inspección no acredita calidad visual o foco en ejecución.

No se encontró otro defecto bloqueante demostrado dentro de esta revisión estática. Persisten los límites documentados de lectura/ayuda de dispositivo frente a sincronización de cuenta y los casos dinámicos de la suite Linux. No se afirma que las pruebas humanas, el navegador o el dispositivo físico se hayan revisado aquí.
