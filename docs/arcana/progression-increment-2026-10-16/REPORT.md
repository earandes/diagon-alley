# A67 · Encuentros, especializaciones y progresión

16 octubre 2026. Implementación integrada localmente; validación no gráfica ejecutada. La regresión gráfica y comparación de rendimiento Linux, integración en main y SHA/CI remotos permanecen pendientes hasta registrarse expresamente aquí.

## Qué puede decidir el jugador

1. Un personaje ofrece recuperar PV pagando PM o recuperar PM pagando PV. Se elige alcance individual o equipo, portador cuando corresponde, o pasar. La proyección muestra cifras exactas antes de confirmar; consultar y cancelar no cambian condición. Los tratos solo afectan vivos y nunca matan por el coste.
2. En el mismo Taller y con los mismos precios, una nueva varita Dragón conserva daño ×1,2; Wyvern renuncia a ese multiplicador por +3 iniciativa; Fénix por recuperar 2 PV al empezar su turno. Forjar, comparar, equipar y reconocer el efecto en preparación y BattleLog forman un recorrido. Las instancias anteriores conservan sus valores.
3. Antes de iniciar se escoge Descubrimiento, Táctica o Maestría. Es la misma región con composiciones y tamaños de bando distintos, sin aumentar estadísticas maestras ni premios. No hay subida automática, coste extra, bloqueo por personaje raro o repetición de premios únicos.

Se conservan los Pactos dobles, amenazas, intenciones voluntarias, cabecera/Pacto A66, arena/preparación/cierre A63, ambos packs y ES/EN. El idioma sigue en Ajustes. No se añaden regiones, monedas, XP, pity o canjes.

## Curva y duración

El inicio conserva una vía ganadora en las 128 semillas modeladas con aprendiz y Pactos. Las rutas no son todas equivalentes: 806/1171 ganadas bajo la política inicial declarada; Táctica 359/1171. Maestría requiere otro plan: el kit fijo no gana en ese barrido; cinco comunes obtienen 345/1171 y 425 con la heurística de encuentros. Son resultados de políticas técnicas, no tasas de victoria humanas ni garantía de diversión.

La primera victoria de Descubrimiento requiere mediana 1 intento y P90 2 en el modelo; actividad supuesta 4,1–10,2 minutos para la mediana. Para personajes 30/30: mediana exacta 108 aperturas, P90 161, P95 181. Cuenta nueva en Descubrimiento: mediana 57 intentos, P90 94; actividad supuesta mediana 4,1–10,3 horas; a dos intentos diarios, mediana 29 días y P90 47. Son rangos de lectura/replay declarados, no mediciones humanas. Cuatro sabores: mediana 7 activaciones, P90 13, P95 16. No existe garantía finita de completar una colección aleatoria.

Un “100% de todos los objetos de bóveda” no es un objetivo garantizado con una sola llave única y botines excluyentes. Nueve recetas de forja cuestan 180 monedas en conjunto; eso no equivale a poseer todos los botines. La colección no exige Maestría ni prueba dominio táctico. El estudio completo distingue actividad, espera y calendario: [COMPLETION](COMPLETION.md), [STUDY](STUDY.md), [EQUIPMENT](EQUIPMENT.md).

## Autoridad y compatibilidad

Ofertas y adversarios se fijan en snapshot al iniciar. El nuevo contenido usa versión táctica 2 y reglas de equipo 2; campaña y IDs de derechos económicos permanecen iguales. Runs activas antiguas utilizan sus snapshots. Nueva dificultad no renueva primeras victorias, llave o rana. Resultado/consumo se guardan antes de animar; las respuestas perdidas recuperan el mismo receipt. Consulta, borrador, confirmación, reproducción y recuperación son estados distintos.

## Evidencia y validación

- Local final no gráfica: 465 pruebas unitarias/presentación, 63 de integración con PostgreSQL/Redis reales, tipos/build/skins y scanner. Logs `evidence/*-release.txt`.
- Antes del incidente: batería A67 20/20 y refinamiento posterior de encuentros/adversos 16/16. Forja final 3/4 y regresión 39/56 quedaron interrumpidas; no se dan por completadas.
- Tras el incidente: un único smoke local autorizado, 1/1 en 3,6 s, sin grabación ni capturas; watchdog y limpieza de procesos propios. Seis pruebas puras de protección. No se ha repetido la carga que provocó el incidente.
- Linux CI: pendiente de ejecución/registro sobre SHA exacto. No se cuenta una configuración de workflow como una prueba ejecutada.

[Galería](GALLERY.md), [QA](QA.md), [rendimiento](PERFORMANCE.md), [contratos backend](QA-BACKEND.md), [encuentros](QA-ENCOUNTERS.md), [incidente del host](HOST-INCIDENT.md).

## Límites y siguiente observación humana

No hay pruebas con jugadores, dispositivo físico, lector audible o retención. Viewports son emulación. Observar comprensión de coste PV/PM, elección de núcleo y relación iniciativa/supervivencia, intención al repetir, expectativas ante dificultad sin premio extra, uso de omisión y utilidad marginal del duplicado. La economía protegida mantiene colas largas y ventaja de cofres seguros; cualquier conversión de excedentes, rareza probabilística o acceso al resto de bóveda requiere propuesta/decisión separada.
