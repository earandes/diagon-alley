# A84 · Superficie del cambio

## Producto

- `src/arcana/presentation/audio/`: preferencias locales, catálogo/recursos PCM, mezclador nativo acotado, consumidor del reloj/log, ciclo de vida y dos objetos de Ajustes con localización/estilo.
- `App.tsx`, `GameSettings.tsx`, `BattlePanel.tsx`: consumidores de presentación. No se modifican motor, reloj, dominio, casos de uso, gateway, autenticación o esquema.
- `tools/arcana/pwa-build.ts`: admitir WAV públicos compilados y excluirlos del precache/lista de arte.
- `design/audio/a84/`: fuente editable/reproducible, manifiesto, verificador numérico y procedencia. Ninguna dependencia añadida.

## Comprobación

- Cuatro archivos de pruebas unitarias A84/PWA y una prueba de fixture de ruta; no equivalen a pruebas humanas.
- `tests/browser-audio/`, `playwright.audio-a84.config.ts`: tres parejas motor/tamaño, Settings/BattlePanel reales en harness declarado. La configuración dedicada permite selección explícita futura bajo el mismo guard.
- `tests/browser-motion/audio-a84.spec.ts`, configuración A69 y segundo entry Vite: ejecución dentro del proceso Linux ya existente; no se modifica `.github/workflows`, worker, reintentos o watchdog.
- `tests/browser-fluency/expedition-a73.spec.ts`, fixture JSON y generador offline: ruta conocida no visitada en la cuenta de ensayo creada por el test; comandos posteriores siguen siendo reales. La prueba de dominio compara fixture y contenido actual. No hay control público de semillas o concesiones.
- `tests/browser-motion/motion-a69.spec.ts`: separar inyecciones de arte/import ausentes y aislar la segunda de contexto/caché/historial previos, conservando assertions de petición fallida y resultado recuperable.

## Documentación

PRD, DECISIONS, DESIGN y README describen estado, configuración y límites. Esta carpeta conserva resultados y evidencia seleccionada. `traits-synergies-study-2026-10-18` recoge el estudio anterior de tipos/shiny como propuesta, sin modificaciones de reglas.

El diff de la PR es el inventario exacto de archivos. Se excluyen logs temporales, datos personales, credenciales y archivos históricos no rastreados ajenos al incremento. No se hace staging indiscriminado. Las capturas proceden de Linux, sin generar otra captura en este Mac.
