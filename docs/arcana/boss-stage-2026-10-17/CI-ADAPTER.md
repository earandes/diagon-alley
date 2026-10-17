# A71 · Validación con el workflow existente

La credencial GitHub permite rama/PR pero no el scopeOAuth `workflow`. El primer push fue rechazado al intentar modificar `checks.yml`; no creó la rama remota ni inicióCI. No se solicitan permisos adicionales ni se modifica configuración global.

Se conserva el workflow exacto de A70 y se amplía su batería protegida para incluir A71 en el mismo runner serial. No se ejecuta un segundo Playwright hijo ni otra batería en paralelo; se conservan bloqueo común, watchdog,workers1,retries0 y límites del anfitrión. El config dedicado A71 sigue disponible para reproducción independiente Linux.

Las capturas A71 son seis opt-in seleccionadas. El adaptador redirige su evidencia a un subdirectorio `a71` del artifact A70 ya publicado por el workflow; no sobrescribe PNG históricos A70. La descarga final se archiva bajo la carpeta nueva A71 con procedencia explícita.

Para retirar el cambio de workflow de todos los commits nuevos se recompone únicamente la historia local no publicada creada en esta tarea, mediante soft reset a la base guardada: conserva código, fuentes y staged files. Copia binaria de seguridad local en `/tmp/a71-before-ci-adapter.patch`; ningún commit ajeno o remoto se reescribe, ningún hard reset/force push/main. Candidato final de código445d6f42018f0dc29c75650eef626d06cb3304ce; CI38988996115 correcta íntegra sobre mergeffb909467ae6ff1ca5ecaa5a2cad379c1c69ca89. Documentación/evidencia posterior conserva objetos ensayados; no se repite la matriz por esos archivos. Se mantiene el registro de candidatos fallidos/cancelados enQA.
