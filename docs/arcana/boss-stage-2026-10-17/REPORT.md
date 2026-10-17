# A71 · Antesala y actor del jefe

17 octubre2026. **Implementado y comprobado técnicamente.** [CI38988996115 correcta](https://github.com/earandes/diagon-alley/actions/runs/38988996115), código `445d6f4`, merge ensayado `ffb9094`. [PR4](https://github.com/earandes/diagon-alley/pull/4) en `feature/boss-stage-a71`, apilada sobre A70/PR3. Sin integración en main, despliegue o publicación.

## Qué cambia al jugar

Mapa→antesala→preparación existente→confirmación explícita→combate guardado→desenlace→botín utilizable. El recorrido está conectado a los comandos existentes; no es una muestra independiente.

La consulta enfrenta al rival protagonista y sus acompañantes con el equipo propio en primer término. Los retratos muestran condición, procedencia y objetos por instancia, y abren la preparación existente sin escribir. Un libro concentra rivales/sinergias; el tarro muestra stock×N separado del borrador. Preparar y Sinergias comparten fila móvil, con detalle abierto a ancho completo. Vacíos no se presentan como casillas pendientes. Desafiar es la única confirmación y conserva coste5, estado pendiente/error y cancelación.

Hermione/Circe comparten encuadre medio y una muestra de brazo/objeto pintados por capas. El gesto recoge, extiende y devuelve libro/cuenco al reposo; contacto y caída derivan del evento confirmado. No es un rig corporal ni se rehace la colección. El mismo reloj gobierna DOM y Pixi; pausa,2x, inspector, cambio de pack, omisión y reducido conservan log/resultado. Fallar una pieza conserva el compuesto estático; fallar el renderer mantiene controles, PV y registroDOM.

La selección de actor/objetivo se localiza junto a la figura, en lugar de enmarcar toda la celda. La formación densa5×5 redistribuye espacio sin ocultar unidades; figura, nombre yPV se comprueban dentro de su puesto/viewport. El cierre conserva resultado/recompensas confirmadas y acciones de uso del botín primero, con hechos del combate en el libro histórico. No se añade otra operación o celebración al consultar historia.

## Decisiones, recursos y evidencia

- [Contrato previo y plan cerrado](CONTRACT.md), [interacciones y sesión humana propuesta](INTERACTIONS.md).
- [Galería comparada](GALLERY.md): seis PNG seleccionados Linux, revisados a escala mostrada. Juicio experto acotado, no observación de jugadores.
- [Assets y fuentes editables](ACTOR-ASSETS.md), [coreografía](ACTOR-MOTION.md). Dos alternativas de composición comparadas; elegido enfrentamiento frente a gabinete de estantes. Primera máscara/encuadre ARCANA descartados por costura/cara pequeña antes de integrar.
- Seis WebP runtime384×512,269.284B conjuntos; fuentes PNG/máscaras/script/manifiestos reproducibles por CPU local. Solo una muestra por pack, sin servicios con créditos o dependencias nuevas. Arte no declarado definitivo por pasar tests.
- [QA y cobertura](QA.md), [rendimiento y límites](PERFORMANCE.md), [compatibilidad](COMPATIBILITY.md), [archivos modificados](FILES.txt).

## Validación y límites

Tipos, build, validación de packs/contenido y scanner correctos.554unitarios,77pruebas con PostgreSQL/Redis reales y263casos de navegador correctos;15omisiones intencionales de muestreo. Incluye ES/EN, ambos packs, tres tamaños, teclado/toque emulado/foco, texto200% acotado,1–5integrantes/temporales/duplicados/caídos, consulta/cancelación/recarga, import/arte/renderer fallidos, reducido y regresiones de cierre/arena/preparación/tienda/colección/Pactos/intenciones/Halloween/PWA. La cobertura por fixture, cuenta real y simulación de fallo se detalla sin equipararlas. Los intentos anteriores fallidos y sus correcciones se conservan.

Dominio, aplicación, servidor, contenido económico, dependencias, workflow y guard tienen los mismos objetos Git que A70. No hay migraciones, nuevos premios, precios, reglas, fases, audio, relojes o sorteos. Se preservan partidas/snapshots y autoridad. Consultar/cancelar no consume; replay no modifica el BattleLog. Las garantías de concurrencia y respuesta perdida se verifican mediante contratos compartidos, sin inventar una nueva carrera específica de dos pestañas ante el jefe.

Todos los gráficos se ejecutaron enCI Linux, en serie y sin reintentos. En elMac solo producción/inspecciónCPU, código, pruebas no gráficas y preflight sin navegador; no capturas del escritorio, WebKit, perfiles o grabaciones. No se tocaron sesiones/procesos ajenos ni la partida habitual.

Muestra cálida del jefe: P95rAF16,8ms en10s, objetivo de ensayo cumplido en esa muestra. Persisten picos de arranque233,3ms y la muestra genéricaA69 sigue en33,4ms P95 frente a objetivo20ms, como en A70. No se presentan como resueltos ni se atribuyen causalmente sin aislarlos. Texturas propias estimadas suben1.690.080B; no es memoriaGPU/proceso medida. La actualización final de evidencia conserva los objetos de runtime ensayados; [certificado](evidence/runtime-equivalence.json).

Pendientes: percepción de encuentro, lectura del gesto, personalidad, comprensión, lector hablado y dispositivo físico. Sesión humana breve propuesta enINTERACTIONS, sin explicar la solución. Tests e imágenes no acreditan diversión ni aceptación artística definitiva.
