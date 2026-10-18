# A87 · Criaturas y vínculos de equipo

18 octubre2026. Enric autoriza ampliar clasificación, añadir un grupo pequeño de criaturas obtenibles, sus imágenes/estilo/animación/sonidos y Cromodex. Respuesta explícita: añadir criaturas y clasificar los actuales. Trabajo preparatorio de diseño/arte mientras PR9(A85/A86) termina; implementación de juego partirá de main una vez integrada y validada esa dependencia. Sin despliegue.

## Hechos / experiencia buscada

Catálogo actual30identidades,29tickets uniformes de rana y Harry inicial; cuatro casas3/4, afinidades existentes y1%cosmético independiente. Escuela/oficio no son pasivos. Casas están en snapshots/reglas2; temporal no es propiedad. Hay motor único de hechizo a un objetivo,1PMpor intento; no habilidades por especie, vuelo, resurrección o monedas robadas.

Buscamos construir una compañía por afinidad temática con una decisión táctica legible: casa, alianza o criaturas. Coleccionar una criatura abre composición y presencia nuevas, sin convertir rareza/encantado en potencia.

## Decisión de diseño a contrastar

Alternativas: apilar todos los metadatos multiplica ventajas de personajes con varias afiliaciones; reemplazar casas borra decisiones anteriores; elegir un vínculo de equipo conserva las casas y permiteAuto, que prioriza una casa ya activa y permite otra especialización con renuncia. Elegida la tercera, pendiente de calibración reproducible. Afinidades actuales se conservan. Un vínculo activo por bando,3identidades distintas en pie activan y4refuerzan, duplicados/encantados no inflan. La clasificación completa no implica que cada etiqueta tenga un bono.

Primer conjunto propuesto: fénix, hipogrifo, unicornio y dragón galés verde. Cuatro para que los dos umbrales sean alcanzables. Casas/Orden del Fénix/Mortífagos/criaturas, sin equiparar Slytherin a maldad o muggle-born a muggle. Afiliaciones históricas se explican; Snape no se reduce a una etiqueta moral.

## Recorridos y aceptación

Rana con tabla versionada → copia confirmada → revelación/encantado → ficha/filtro delCromodex → selección por instancia → vínculo provisional/confirmado → mapa con contribuyentes/efecto real → preparación → BattleLog guardado → efectos y sonido voluntario → cierre existente. Pactos deben ofrecer un camino viable hacia3criaturas, sin compra obligatoria.

La elección del vínculo se guarda explícitamente con la formación; consultar/cancelar no confirma. Un nuevo combate registra fuente/miembros/valores y reproduce esos hechos, no vuelve a contar catálogo vivo. Viejas runs/logs/receipts conservan reglas; nuevos datos solo se aplican mediante versiones. No reiniciar campaña1/primeras victorias.

## Economía / datos

No precios, premios, energía, rarezas nuevas, XP, pity, duplicados×2 o estadísticas maestras modificadas. Añadir4identidades obliga a publicar una nueva tabla y comparar sus probabilidades y completitud: no se promete conservar porcentajes individuales por el mero hecho de conservar pesos. Propuesta33tickets equiprobables más starter,34identidades; confirmar cálculo y contraste antes de habilitarla. Recuerdos estacionales/variantes fuera del denominador base.

## Arte y seguridad

Muestra primero: figura/portrait/thumbnail transparentes de una criatura con acabado ilustrado, luego familia mínima. Emblemas originales, animación sobre reloj existente y sonidos originales locales conA84opt-in. Ningún rig anatómico se atribuye a una imagen plana. Manifests con fuentes, parámetros, procedencia, exports/consumidores y fallbacks. Sin dependencias/servicios pagados.

No gráficos locales fuera del smoke original; CI Linux serial con guard/bloqueo/watchdog/1worker/0retries, evidencia seleccionada. Tests de dominio, SQL/Redis real, recuperación/concurrencia/versiones, ambos paquetes/idiomas y teclado/reducido. Humana/dispositivo físico pendientes. No declarar terminado mientras falten comprobaciones técnicas.

## Concreción de ensayo19octubre

[Especificación de datos de diseño](../../../design/creatures-a87/content-spec.json), sin activar runtime. Auto/selección explícita según la decisión operativa final enDESIGN; Orden ayuda1/2PV a otro aliado por ronda, Mortífagos remata+1/2, Criaturas amortigua2/3del primer impacto positivo de cada aliado. [Escenarios previos](SCENARIOS.md). Los valores deben contrastarse y pueden corregirse dentro de este alcance antes de aceptarlos. Se conservan versiones anteriores y campaña1. Ninguna prueba de esos efectos se da por ejecutada todavía.

## Baseline de implementación19octubre

PR9integrada enmain1a549eafb33f771293603775a8586d0210c608a3, árbol idéntico a6cf2ac8/checkout0d59c610, CI39167929972 completa correcta:662unit,103PGRedis,365gráficoscheck+134regresión(incluidos2benchmarks). Cierre documental440d2784de96ef19d99447bf693812eaf94011e2subido amain con diff acotado sin cambios runtime. NingunaPRabierta. RamaA87parte exactamente de440d278.

CI del merge39173082086cancelada deliberadamente durante testsunitarios, antes de gráficos, al quedar sustituida por39173115270delSHA documental (pendiente al empezarA87). No se cancela CIajena o se presenta la cancelación como éxito. La batería completa de6cfy equivalencia del árbol sustentan la base; se seguirá consultando la nuevaCI por su estado real. Rawlogs de cierre conservan whitespace original de las herramientas; no se editaron para simular salida distinta.
