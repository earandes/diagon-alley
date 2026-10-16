# A65 · Elegir aliados, preparar rivales y volver con intención

16 octubre2026. **Implementado en el repositorio y verificado técnicamente.** Un incremento de tres recorridos sobre A63, sin publicación/despliegue/push. La sesión humana será posterior: comprensión, diversión y deseo de repetir siguen siendo hipótesis.

## Qué puede decidir ahora el jugador

1. **Pactos con dos candidatos.** Dos retratos temporales, progreso real de afinidad antes→después/umbral y atributos a demanda. Elegir no incorpora: requiere confirmar. Equipo lleno permite pasar o sustituir un temporal explícitamente; las copias propias se conservan. Oferta fijada por servidor, recarga sin reroll y una sola incorporación por operación.
2. **Preparar según el rival.** Fuego y Vanguardia tienen composiciones diferentes con stats/afinidades de personajes existentes. Emblemas propios, nombres accesibles y consulta de rivales conectan mapa→preparación→arena. Simulaciones reproducibles muestran conveniencia distinta de Alquimia/Sombras y contextos favorables para ambas opciones de cada Pacto, sin inventar habilidades o ganador en UI.
3. **Otra expedición con intención.** El botín conserva prioridad en cierre A63. Una bandeja ofrece hasta tres opciones viables: combatir con otra copia propia, activar otra sinergia o probar gragea sin prometer sabor nuevo. Selección/abandono guardados sin recursos, vinculación solo a la siguiente expedición confirmada y cumplimiento desde BattleLog. Recordatorio en preparación/mapa con espacio real reservado.

**Los cambios tácticos se aplican a nuevas expediciones.** Las activas conservan contenido anterior. Versión táctica1 separada de campaña/primeras victorias: no se renuevan llaves, ranas o botines únicos al introducir estas ofertas. Word, JSON económico original y evidencia A62/A63 intactos.

## Diseño y recursos

Teatro de alquimia, Harry Potter/Diagon Alley principal, ARCANA intercambiable y ES/EN solo Ajustes. Dos SVG originales de amenaza con fuente editable/manifest; retratos, escenarios, objetos y apertura existentes reutilizados. Sin dependencia, servicio de pago, generación con créditos o audio nuevo.

[Contrato](CONTRACT.md) · [Interacciones](INTERACTIONS.md) · [Assets](ASSETS.md) · [Dirección/inspección visual](VISUAL.md) · [Movimiento](MOTION.md) · [Intenciones](INTENTIONS.md).

## Validación y evidencia

- **431/431 unitarias**,56archivos; **49/49 integraciones**,10archivos, con PostgreSQL/Redis reales. Incluyen snapshots antiguos/nuevos, protección de primeras victorias, selección obligatoria, conflictos, carreras, rollback, respuesta perdida/pools reabiertos e intenciones sin cambios económicos.
- **12/12 recorridos nuevos de Pactos/rivales** y **8/8 de intenciones**, ES/EN×ambos packs×Chromium/WebKit. Cancelar/recargar/replay no consumen ni conceden de nuevo. Los setups y rutas técnicas están declarados, no presentados como jugadores.
- **4/4 adversos de interfaz** ES/EN×ambos motores, imágenes/renderer ausentes, texto200%, reducido y foco inicial en candidato.
- **22/22 regresiones** compiladas de inicio/álbum/preparación/equipamiento/grageas/replay/apertura/fallback y **12/12 PWA** con worker/offline/recuperación. **16/16 regresiones de cierre/botín A63**, incluidas primera/repetida, rana sin recompra, bóveda, retorno y dos pestañas.
- Build,tipos,skin y scanner correctos. Artefacto dual14.570.854bytes; chunkprincipal~928,90kBminificado, aviso de tamaño conservado. Sin cambio de stack.
- Todos los nodos dentro del viewport y documento sin scroll ordinario a1280×900,390×844,865×1079. Recordatorio comprobado además con hit-test para detectar oclusión real. Inspectores/texto ampliado admiten desplazamiento accesible. Capturas y revisión visual de canvas/DOM acompañan los estados de servidor.

[QA, comandos y límites](QA.md) · [QA Pactos](QA-PACTS.md) · [Antes/después y vídeos](GALLERY.md).

## Calibración y límites

[TACTICS.md](TACTICS.md) conserva referencia ejecutable anterior,224.832evaluaciones de ruta y4.608combates aislados. Kit inicial tiene al menos un camino ganador en cada una de128semillas por cada política modelada, sin asegurar que todas las ramas sean recuperables.390/1171caminos no pasan por refugio. Colecciones desarrolladas reducen la presión táctica: no se oculta con habilidades o stats nuevos.

Premios/precios/pesos/costes intactos; sí cambia el ingreso indirecto al perder más rutas agresivas. En la política Alquimia declarada, media primera85,34→67,14 y repetida16,51→14,52monedas por camino. No es ingreso esperado de personas ni tasa de victoria humana. No se compensa automáticamente. El antiguo recluta de ensayo90/10/7 permanece en legacy; la nueva oferta utiliza su definición existente de catálogo80/12/8, sin alterar estadísticas maestras.

[PERFORMANCE.md](PERFORMANCE.md): cuatro perfiles seriales desde input, incluyendo red/decodificación/animaciones. Abrir Pacto con arte asentado377–397ms; selección191–227ms; mapa disponible tras reclutar89–188ms. El fin de efectos~1,9s incluye pulso orientativo finito de próximo nodo, sin bloqueo del control. **Chromium conserva tareas largas de arranque de arena164–351ms y frame máximo366,6ms.** No se presenta una media de rAF cercana60 como ausencia de tirón, ni una comparación porcentual sin baseline equivalente.

Sin sesión humana, móvil físico, lector hablado o certificaciónWCAG. Las nuevas decisiones son aritméticamente distintas y operables; su lectura/interés necesita observación posterior.

## Correcciones de los ciclos

- Separar versiones evita renovar derechos a botín único y permite continuar snapshots guardados sin configuración viva.
- Normalizar intención vacía evita diferencias de estado entre respuesta y recargaSQL.
- Historial de BattleLogs evita olvidar sinergias tras derrota y compañeros retirados.
- El recordatorio quedaba detrás de la escena: banda reservada96px, sin ocultar nodos o simular encaje.
- Progreso de afinidad1→2/3 evita que «Sin sinergias activas» oculte el valor de una primera incorporación.
- Foco inicial en candidato/pasar viable, nunca en confirmación deshabilitada; abandono vuelve a contenido.
- Esperas del harness distinguen compra pendiente/commit y bloqueo IndexedDB entre pestañas de carrerasSQL reales. Logs intermedios conservados sin contarlos como cobertura adicional.

## Siguiente sesión humana

Observar sin explicar solución: qué diferencia anticipa entre dos candidatos, qué cambia en la preparación ante cada amenaza, cuándo se consume la gragea, si distingue copia propia/temporal y qué intención elige después del jefe. No introducir regiones, XP o canjes para sustituir esa observación.
