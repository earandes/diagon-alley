# A84 · Ambiente y hechizos del Callejón

18 octubre 2026. Implementado en `feature/a84-game-audio`, [PR8](https://github.com/earandes/diagon-alley/pull/8). Validación Linux en curso al redactar; resultados finales en QA. Sin despliegue ni integración automática en main.

## Qué cambia

El juego conserva silencio inicial. Ajustes incorpora dos objetos de la misma familia de idioma/mundo: lira para ambiente musical y varita para efectos, cada uno con nombre/estado/sello y botón semántico `aria-pressed`. Volumen nativo etiquetado aparece solo al desplegarlo. No hay otro HUD o pantalla de configuración, ni casillas sin explicación. Español/inglés y ambos paquetes desde el mismo componente GameSettings.

Una composición original de24segundos, de armonía cálida y campanas sintetizadas espaciadas, acompaña las escenas cuando se elige activarla. El bucle reutiliza el mismo buffer al navegar; la arena lo atenúa al48%del nivel elegido. No cambia al modificar idioma o presentación. Pausar el replay detiene efectos, no impone apagar el ambiente elegido; ocultar la página suspende ambos.

Hay cuatro señales de lanzamiento: aire áspero/barrido para Fuego, vidrio ascendente para Alquimia, aire grave para Sombras y campana breve para Neutral. Contacto, fallo, curación y quemadura tienen señales propias. Son ocho muestras finitas, sin voces, sonidos de películas o audio generado durante el juego. No se añaden ataques o roles por escuchar un timbre distinto.

## Integración y garantía de silencio

El nuevo consumidor toma `Combat.input` y las fases publicadas por ReplayClock. Lanzamiento en flight, contacto/fallo en impact; curación/quemadura solo con evento guardado. No nuevo ticker, sorteo, timer de coreografía o suscripción por frame. Se descartan fases ya consumidas y no hay cola de sounds atrasados. Pausa, inspector, omisión, ocultación y desmontaje detienen voces. 2x conserva el timbre, sin agudizar toda la música.

Un AudioContext se crea únicamente dentro de una interacción explícita y con al menos un canal habilitado. El consentimiento se conserva por dispositivo; después de recargar, la primera interacción deliberada puede desbloquearlo de nuevo. No se almacenan credenciales o estado económico. Almacenamiento bloqueado conserva preferencias en memoria. Eventos storage propagan apagado entre pestañas sin conceder desbloqueo a otra página.

Fallos de recurso, decode o API no bloquean el combate. Ajustes muestra un estado localizado con acción de reactivar; se conserva uso silencioso. No se puede garantizar reproducción si el navegador/sistema bloquea salida. Todos los significados siguen disponibles visual y semánticamente.

## Recursos, rendimiento y mantenimiento

Nueve WAV originales mono24kHz/PCM16,1.241.676bytes. Fuente reproducible `design/audio/a84/compose.py`, manifiesto de hashes/procedencia y `verify.py`. Los objetos lira/varita son SVG editables en TSX, sin raster adicional. [Fuentes y decisiones](../../../design/audio/a84/README.md).

La carga es a demanda: activar solo ambiente solicita una pista; solo efectos, ocho clips pequeños. Nunca forman parte del precache PWA. La allowlist acepta WAV compilados, pero no los añade a shell/arte cacheado. Los buffers están acotados a nueve, con una pista y cuatro efectos simultáneos. Apagar todos borra buffers y suspende; desmontar cierra contexto, desconecta y aborta solicitudes propias. No se cierra ningún proceso externo.

Estimación float al sample rate de origen:2.482.560bytes; AudioContext puede remuestrear. No es RSS, memoria GPU ni prueba de ausencia global de fugas. La composición no añade filtros/tareas Pixi o generación de muestras al frame. El chunk histórico grande no desaparece: build mantiene su advertencia. Medidas de fetch/decode y gesto→ready se recogen en Linux; no sustituyen latencia física o escucha.

## Estado del trabajo previo

Menú/cuentas A75–A82 estaban ya integrados en main `ac827a0`. El estudio de tipos y variantes del turno anterior se sube como documentación, con cálculos reproducibles y clasificación de30cromos; no se convierten sus propuestas en reglas. El audio se apoya en las afinidades actuales y no anticipa shaders, sinergias o skins inexistentes.

## Validación y observación posterior

Pruebas de preferencias, fases, inmutabilidad, límites, recursos, cancelación, errores y PWA; build/tipos/scanner. Nueva batería Linux con GameSettings/BattlePanel reales en harness declarado, native AudioContext/OfflineAudioContext, tres pares motor/viewport, ES/EN/swap y regresiones existentes. No navegador ni captura nueva en el Mac. Consultar QA para ejecuciones/SHA/omisiones reales; no inferir éxito de existir un test.

Escucha humana pendiente: ¿el ciclo se vuelve repetitivo tras varias expediciones?, ¿se perciben lanzamiento/contacto/fallo sin resultar invasivos?, ¿es suficiente el nivel inicial en auriculares y altavoz móvil?, ¿los timbres encajan con las ilustraciones? Prueba breve posterior: habilitar ambiente, entrar en un combate, pausar/omitir y silenciar efectos sin instrucciones sobre dónde están. No se afirma comprensión o satisfacción a partir de métricas PCM.

## Referencias técnicas

Consulta18octubre2026: [MDN, buenas prácticas Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices), [política de autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), [fuentes de buffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode), [visibilidad y reproducción voluntaria](https://developer.mozilla.org/en-US/blog/using-the-page-visibility-api/). Fundamentan desbloqueo/interrupción/recursos; no acreditan el rendimiento de esta aplicación. No runtime de pago o biblioteca nueva.
