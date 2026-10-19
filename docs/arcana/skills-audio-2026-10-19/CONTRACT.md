# A88 · Skills locales y continuidad de audio

19 octubre 2026. Baseline `a74c932b9a0f6d446af057d1d746785504d1a199`, main limpio en archivos rastreados. Existen archivos no rastreados ajenos: no se añaden o eliminan. Autorizado evaluar Game Dev, instalar solo en este proyecto, aplicar una mejora, validar e integrar en main. Sin despliegue, pago o configuración global.

## Experiencia y hechos

El jugador activa música/efectos voluntariamente desde los Ajustes existentes. Hoy `prepare()` solicita todos los assets mediante Promise.allSettled; con ambos canales son16 cargas/decodes potencialmente simultáneos. Además `sync()` arranca la música solo después del conjunto: un efecto lento retrasa un ambiente ya descargado. Es una dependencia comprobable de código, no una causa demostrada del P95 rAF histórico.

## Decisión y recorrido

Ajustes → activar audio → ambiente listo puede comenzar → efectos se preparan con trabajo acotado → combate emite solo cues disponibles → pausa/omisión/ocultación/apagado → regreso. Máximo dos cadenas de carga+decode activas por instancia/página; ninguna cola de impactos. No se añade otro control o contenido musical. Al activar ambos canales en una tanda se prepara primero el ambiente; no se interrumpen o reordenan las solicitudes ya encoladas de una tanda anterior.

Comparadas: precargar antes de consentimiento (rechazada), esperar todo como ahora (retiene dependencia innecesaria), carga acotada y publicación independiente (elegida). Puede tardar más en tener todos los efectos; a cambio reduce concurrencia y la música no espera al más lento. No se afirma todavía mejora de FPS o escucha.

## Persistencia y recuperación

Solo preferencias locales ya existentes; no nuevos datos de dominio/API/SQL/Redis. Reintento deliberado desde Ajustes, error de asset silencioso para gameplay, generación de renderer invalida recursos de contexto antiguo. Apagar, cerrar o disponer impide sonido tardío; colas canceladas no generan descargas nuevas. Sin cambios a reglas, precios, catálogo, probabilidades, premios, snapshots o BattleLog.

## Aceptación

1. Cero contexto o carga antes de consentimiento.
2. Máximo2 cadenas activas incluyendo decode, verificadas con dependencias retenidas.
3. Música lista comienza sin esperar un efecto retenido.
4. Fallo individual no bloquea la cola ni el canal listo; no reintento automático.
5. Dispose cancela pendientes/solicitudes, y nuevas generaciones no reciben buffers antiguos.
6. Pausa, ocultación, apagado y omisión mantienen límites existentes; no recuperación de cues atrasados.
7. ES/EN/ambos packs conservan Ajustes, teclado y foco sin cambios visuales.
8. Tipos/build/tests y CI Linux protegida sobre candidato real; integración main verificada.

Assets: todos existentes. Nuevas skills de texto con fuentes/licencias y adaptación explícita. Auditoría de WAV y vínculo con consumidor, sin generación gráfica. Pruebas humanas, escucha y dispositivo físico pendientes.
