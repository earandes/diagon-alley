# A84 · Sonido voluntario del Callejón

18 octubre 2026. Baseline main `ac827a0f16085a354793bfe58e27dc441af267db`, árbol de aplicación equivalente a A82/fd4739c. PR7 integrada y main remoto comprobado. El estudio previo de tipos/shiny es documentación, no implementación; se conserva como propuesta. El audio no anticipa esas reglas.

## Experiencia y alcance autorizado

Un fondo musical discreto de fantasía ilustrada y señales breves que distingan afinidades reales, lanzamiento, contacto, fallo, quemadura y curación confirmados. Composición sonora original procedimental, sin usar grabaciones o melodías de películas. Dos objetos de Ajustes —ambiente y efectos— con estado localizado, activación voluntaria y volumen a demanda. Sin controles permanentes nuevos en mapa.

Recorrido: bienvenida/Ajustes → habilitar explícitamente → ambiente → preparación → BattleLog guardado → lanzamiento/contacto/resultado audibles → pausa/inspección/2x/omisión/regreso → silenciar en Ajustes. El juego completo sigue funcionando en silencio, con recurso/API ausente o reproducción bloqueada.

Opciones comparadas: (1) bibliotecas/licencias externas, mayor trabajo de procedencia y dependencia; (2) síntesis continua en runtime, coste/relojes innecesarios; (3) composición offline reproducible y buffers nativos, opción elegida por coste cero, propiedad clara y carga acotada. No instalar dependencias ni generar durante las interacciones.

## Estado, integridad y recuperación

Preferencia local versionada por dispositivo: ambiente/efectos separados, ambos inicialmente apagados, volúmenes conservadores. No forma parte de la partida ni se anuncia como sincronizada por cuenta. Storage bloqueado conserva uso en memoria. Recarga conserva elección, pero no crea AudioContext ni descarga sonidos antes de una interacción de desbloqueo. Cambiar idioma/pack no reanuda ataques ni reinicia pista. Una instancia de contexto, una pista, máximo cuatro voces; recursos liberados al desmontar.

Audio se añade únicamente en presentación; consume fases del reloj compartido y eventos de combate guardados. No altera eventos, resultados, azar, inventario o persistencia. Pausa/inspector/omisión/ocultación detienen efectos, sin cola ni ráfaga al regresar. No retrasar replay por descarga/decodificación. No audibilizar el desenlace guardado antes de reproducirlo.

## Aceptación

- Sin consentimiento: cero contexto/fetch/reproducción. Habilitar música y efectos independientemente; apagar detiene su canal. Gestor no falla el juego si AudioContext/fetch/decode falla.
- Preferencias válidas, recarga, almacenamiento denegado y sincronización de preferencias entre pestañas; ningún token o dato de cuenta.
- Efectos diferenciados de las cuatro afinidades actuales y contacto/fallo/curación/quemadura desde log. Fase ya emitida no suena al cambiar idioma/pack o pausar/reanudar; omitir no sonoriza eventos pendientes.
- Volumen limitado, pistas sin clipping, extremos/loop comprobados numéricamente; limitar buffers/voces y no trabajo gráfico añadido. Apreciación artística y escucha humana/física se documentan aparte, sin fingirlas.
- ES/EN/ambos packs; controles nativos, foco/teclado/toque y 1280×900,390×844,865×1079. Volumen a demanda con labels; estado no depende de sonido ni color.
- Tipos/build/tests locales no gráficos. Navegador y capturas seleccionadas solo CI Linux serial con guard/lock/watchdog, un worker y cero reintentos. Sin navegador en Mac.

## Plan y límites

1. Contrato/dirección y pruebas RED de preferencias, fases y reproducción.
2. Composición de una familia sonora offline, manifest/fuentes y análisis técnico.
3. Motor Web Audio acotado, Ajustes del mismo lenguaje visual e integración del reloj existente.
4. Pruebas no gráficas, CI Linux y evidencia seleccionada; corregir defectos demostrados.
5. Documentar resultados/SHA/límites y subir rama revisable. No desplegar; no asumir nueva autorización de merge a main a partir del merge ya realizado A82.

No se implementan tipos, shiny, nuevas habilidades, costes, recompensas, audio de revelación, voces o música por cada pantalla. Ambos packs comparten una familia sonora original coherente con fantasía; se documenta consumidor y sustitución futura sin duplicar assets. El encargo pide «subido todo lo anterior»: estudio previo se incluye como propuesta documental, no se convierte en reglas aprobadas silenciosamente.
