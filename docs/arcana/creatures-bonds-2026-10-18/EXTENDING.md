# A87 · Añadir otra identidad o familia

Diseño actual: casas, afiliación histórica y naturaleza son dimensiones distintas. Un solo vínculo táctico efectivo, afinidades independientes. Profesión/escuela/EDdescriben; no pasivo automático. No existe motor universal dehabilidades o grupos nuevos por escribir una etiqueta.

## Mediante datos

1. DefinirIDestable, nombre/contextoES/EN, rareza/estrellas actuales y estadísticas con renuncia. No reciclar unIDparaotro personaje o alterar copias antiguas.
2. Añadir identidad encontenido versionado y sus rasgos en la siguiente configuracióntraits. `traits-v1`permanececongelado; `traits-v2`contiene esta edición. Escuela/profesión no implica casa; persona nacida demuggles no es muggle, ni persona de ascendencia nohumana es automáticamente bestia.
3. La clasificación actual es fuente única para miembros: `trialConfiguration` deriva mapas de grupo desde rasgos y los congela enBundledecombate. El cliente consulta ese snapshot para efectos. No mantener otra lista manual enelrenderer. Si cambia unrasgo enelfuturo, aplicar su nueva versión aexpediciones nuevas; jamás recontar logsantiguos.
4. Reutilizar solo comportamientos actuales con parámetros versionados y positivos. Una mecánica diferente necesita código/pruebas; ampliarenum/grupos sin definirrenuncia y efecto no está soportado automáticamente.
5. Ampliar catálogo/tabla/táctica/reglas cuando proceda. Recalcular probabilidades y completitud: conservarpesos no conserva porcentajes. Precios, regalos, campaña1yderechos únicos no se modifican por subirversión.
6. Publicar las referencias delmodelo y comprobar3/4alcanzable, duplicados/temporales/caídos yuna colección pequeña viable. No regalar rarezas para evitar un diseño débil.

## Arte y sonido

Poridentidad: portrait512×640,figure/cast342×428,thumbnail96×120,transparente; conservar fuente/prompts/pivote/permiso. Primero muestraencontexto conambospaquetes; variantes depose comparten escala/contacto y no sonrigporrecortar. Registrar claves enambosassets.json y nombres/contextos separados. Se puede compartir artecuandoencaja; no es obligatorio ignorar mezclas deestilo.

`cast-profile.ts`es mapeo pequeño porID: perfil/origen visual yforma conreloj compartido. Paraotraespecie hacefaltaconectar su perfil alrenderer; no se promete soportearbitrario porJSON. Reutilizar un perfil existente cuando expreselaacción adecuada. UnSFXfinitooriginal opcional usaA84, una vozporlanzamiento yfallbackafinidad; ninguna dependencia deazar oaudioobligatorio.

## Candidatos posteriores, no implementados

- Seres mágicos inteligentes: revisar de forma individual identidad/lore yrepresentación; no asumir queDobby o uncentauro pertenece algrupo de bestias elegidoaquí.
- Entidades oscuras nohumanas: no confundir Dementores con afiliaciónMortífaga. Requiere clasificación/documentación propia antes de elegir unefecto.
- Personajesmuggles: no hayunoactual; no ofrecer ungrupovacío ni inventarcasa/potencia para completarlo.
- Nuevosprofesores, aurores yescuelas: describir primero. Unbonodeoficio requiere almenos3/4identidades obtenibles,renuncia ycasos distintos delas casas/alianzas; no multiplicar pasivos porbiografía.

## Validación

Ejecutar dominioconfiguración/persistencia real, recuperación/rollback/concurrencia y derechos de primera victoria entreversiones. Revisar ES/EN/swap yprobabilidades derivadas. Extensión gráfica solamenteenCILinux bajo guardas originales; MacsinChrome/Browser/scriptsmanuales. Capturas elegidas no prueban movimiento, SQLopruebas humanas.

ReferenciasA85que usen`trialConfiguration()`sinperfil describen suSHAhistórico: para reproducirlas usar sucheckout o el perfil explícito`a85`, no atribuir alcontenido4los29tickets deA85. Los perfilesa84/a85siguen ejecutables y susfixtures/historiales se conservan.
