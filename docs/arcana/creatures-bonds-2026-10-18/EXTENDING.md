# A87 · Añadir otra identidad o familia

Casas, afiliaciones históricas y naturaleza son dimensiones distintas. Solo existe un vínculo táctico efectivo por equipo; las afinidades continúan independientes. Escuela, profesión y Ejército de Dumbledore describen a los personajes sin otorgar otro pasivo. No hay un motor universal de habilidades.

## Datos y versiones

1. Definir un ID estable, nombres y contextos ES/EN, una rareza existente, estrellas y estadísticas con renuncias. No reciclar un ID ni reescribir copias antiguas.
2. Añadir la identidad al contenido versionado y sus rasgos a la configuración nueva. `traits-v1` queda congelado y `traits-v2` describe esta edición. Escuela no implica casa. Un mago nacido de muggles no se clasifica como muggle; una persona de ascendencia no humana no se convierte automáticamente en bestia.
3. `trialConfiguration` deriva los miembros de cada grupo desde los rasgos del catálogo y congela esos mapas en las reglas de combate. No hay otra lista manual en el renderer. Un cambio futuro solo se aplica a expediciones nuevas; no se recuentan registros históricos.
4. Reutilizar los tres comportamientos actuales únicamente cuando expresen la intención. Una mecánica diferente necesita código y pruebas; añadir una etiqueta no crea un efecto.
5. Versionar catálogo, probabilidades, contenido táctico y reglas cuando corresponda. Recalcular porcentajes y completitud: conservar pesos no conserva probabilidades individuales. Campaña 1 y derechos de premios únicos son independientes de estas versiones.
6. Comprobar acceso a tres y cuatro identidades, temporales, duplicados, caídos y una vía viable con colección inicial. No regalar rarezas para ocultar una decisión débil.

## Arte y sonido

Por identidad: portrait 512 × 640, figure/cast 342 × 428 y thumbnail 96 × 120, con transparencia. Conservar fuente, prompts, permiso, encuadre y punto de contacto. Revisar primero una muestra en contexto en ambos paquetes; dos poses comparten escala y contacto. Recortar una imagen no crea un rig.

Registrar las claves en ambos `assets.json` y localizar nombres y contextos. El arte puede compartirse cuando encaje; si hay una mezcla de materiales, se adapta la muestra antes de producir otra familia.

`cast-profile.ts` relaciona IDs con especie, origen visual y perfil de acción. Una especie nueva necesita un perfil o la reutilización explícita de uno existente. No se promete soporte arbitrario solo con JSON. El renderer representa hechos del BattleLog y utiliza su reloj compartido.

Un cue opcional usa el sistema A84, sin audio obligatorio o azar. Una voz de lanzamiento y fallback de afinidad; efectos de contacto solo cuando constan en el registro. Registrar el consumidor real, evitando sonidos o poses sin uso.

## Candidatos posteriores, no implementados

- Seres mágicos inteligentes: revisar identidad y representación de cada uno. Dobby o un centauro no pertenecen automáticamente al conjunto de bestias elegido aquí.
- Entidades oscuras no humanas: un Dementor no es un Mortífago. Requiere clasificación y una decisión de juego propia.
- Muggles: no existe ninguno en el catálogo actual. No presentar un grupo vacío o inventarle una casa para completar un umbral.
- Profesores, aurores y otras escuelas: primero describirlos. Un bono de oficio necesitaría al menos tres/cuatro identidades obtenibles, una renuncia y casos diferentes de casas o alianzas. No multiplicar pasivos por biografía.

## Validación

Ejecutar dominio, configuración, persistencia real, recuperación, rollback, concurrencia y derechos de primera victoria entre versiones. Comprobar ES/EN, cambio de paquete y probabilidades derivadas de la misma tabla.

La extensión gráfica se valida en CI Linux bajo las protecciones originales. No usar Chrome, Browser o scripts manuales en el Mac para evitarlas. Una captura no demuestra movimiento, persistencia o comprensión humana.

Las referencias históricas A85 que usaban `trialConfiguration()` sin argumento describen su SHA: para reproducirlas se usa aquel checkout o el perfil explícito `a85`. Los perfiles `a84` y `a85` siguen disponibles; sus 29 tickets no se atribuyen al contenido 4.
