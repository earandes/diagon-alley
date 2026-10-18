# Compatibilidad A84

Base `ac827a0`, candidato de validación `6570ae143a025558ddb06cdc1ed23dd787cc5f64`.

- Sin modificaciones en `src/arcana/domain`, aplicación, APIs, autoridad, PostgreSQL/Redis, snapshots de catálogo/run/combate, receipts o IndexedDB de operaciones.
- Tres consumidores de presentación: App monta el ciclo de vida; GameSettings incluye controles compartidos; BattlePanel incorpora un consumidor del reloj ya existente. No se edita ReplayClock, useBattlePlayback o el motor de combate.
- `BattleAudioTrack` lee eventos/input confirmados, no pack/catálogo vivo. Dos marcas monótonas cursor/fase impiden repetir una señal al repintar o volver a una posición anterior. Cada reproducción explícita nueva puede tener su propia secuencia sonora, sin una ceremonia económica o entrega nueva.
- La única persistencia nueva es `arcana.presentation.audio.v1`, preferencia por dispositivo, validada y opcional. Cambiar cuenta no importa recursos ni comparte claves de operaciones. Un evento storage puede silenciar otro documento; no lo desbloquea sin gesto local.
- Audio desconectado/no disponible conserva el juego, navegación, registro y consecuencias visuales. No se usan microphones, permisos de grabación, credenciales, IA remota o URLs de medios externos.
- PWA admite assets WAV compilados en su allowlist, pero los excluye de precache y de la lista de arte. Offline no concede acciones ni inventario. Una pista ya decodificada puede permanecer audible mientras la página está visible; una carga nueva puede fallar y se recupera desde Ajustes.
- Cada documento mantiene como máximo un contexto/una pista/cuatro efectos/nueve buffers. No se afirma un límite global entre varios navegadores o todas sus pestañas. Suspensión/liberación propias no demuestran ausencia global de fugas.
- A68 Halloween no recibe audio nuevo de evento; A70/A71/A73 conservan su renderer/reloj/cierre. La batería existente vuelve a comprobar sus recorridos. Tipos/shiny siguen en documentos y no crean traits o sorteos nuevos.

La equivalencia de reglas se apoya en el diff sin cambios de dominio y en regresión; una captura no prueba persistencia, y la prueba del log inmutable del harness no acredita una partida económica real. La CI conserva las pruebas con servicios reales como evidencia separada.
