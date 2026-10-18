# A84 · Cristal, madera y aire

Composición y diseño sonoro procedimentales originales a coste cero. Fuente editable: `compose.py`, Python estándar, 24kHz/mono/PCM16. No hay samples externos, voces, modelo generativo, citas de partitura o audio de película. Manifest registra hashes/dimensiones/peso/procedencia. Compartido explícitamente por Diagon Alley y ARCANA; no se atribuye una licencia de franquicia.

- `ambient`: ciclo armónico24s de cuatro acordes con transiciones solapadas y campanillas separadas. Frecuencias de pad periódicas respecto al ciclo, sin silencio añadido al final. Mono elegido por peso/previsibilidad; no se promete espacialización estéreo.
- `cast-fire`: soplo áspero y barrido descendente; `cast-alchemy`: vidrio ascendente; `cast-shadows`: aire grave; `cast-neutral`: dos parciales de campana.
- `impact`: contacto corto, sin explosión; `miss`: aire sin golpe; `heal`: intervalo consonante; `burn`: crepitar breve.

Consumidores: `presentation/audio/assets.ts` y `GameAudio`; asignación de combate en `BattleAudioTrack`. Nunca se sintetiza durante la acción. Nuevas familias futuras se incorporan explícitamente al catálogo de audio y al mapeo de eventos, sin cambiar reglas por el sonido. No se clasifica un personaje por su nombre del paquete.

`verify.py` comprueba formatos, hashes, silencio inesperado, pico, RMS, componente continua y paso entre extremos. Estas métricas no demuestran un loop imperceptible, belleza tímbrica ni volumen físico. La muestra requiere escucha humana con auriculares y altavoz móvil; no se presenta como realizada.

Presupuesto: familia<1,3MB, contexto/pista única, cuatro efectos simultáneos, nueve buffers como máximo. Bytes float al sample rate fuente son una estimación, no RSS; el navegador puede remuestrear y su memoria real es distinta. Los recursos solo entran por elección, fuera del precache PWA. Desactivar todos borra buffers; desmontar cierra contexto y aborta solicitudes. Un fallo mantiene el juego silencioso y accesible.

Dos iconos vectoriales de Ajustes (lira/varita) se dibujan en `AudioPreferences.tsx`, viewBox64, rol decorativo junto al texto. Fuente editable TSX, misma familia oro/material vigente, sin imagen/texto raster adicional. Estado y foco se conservan si no se ve el dibujo.
