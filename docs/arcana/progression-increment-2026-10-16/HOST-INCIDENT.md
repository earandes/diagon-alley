# Incidente del equipo anfitrión · 16 octubre 2026

## Evidencia aportada y alcance del diagnóstico

Enric aporta informe de caída de `WindowServer` a las17:08:50+0200. Es el compositor gráfico de macOS. Excepción `EXC_CRASH/SIGABRT`, `abort()` en `WSIOSurfaceDebugTallyAndAbort` → `iosurface_create_common` → `CaptureSurfaceMetal::CreateMetalBacking` → `CompositorMetal::CreateCaptureSurface` → `captureWindowList`.

El resumen VM registra `IOSurface 18.5G 27714`: **18,5GB de espacio virtual y27.714regiones**, no una medida de18,5GB deRAM física residente. El kernel también registra `vm_map_copyout_kernel_buffer failed`.

Estos datos prueban un fallo al crear una superficie de captura con acumulación elevada de recursos gráficos. No identifican al cliente que originó la solicitud, ni prueban por sí solos una fuga en Playwright, una avería dehardware o un defecto concreto del driver. No se ha intentado reproducir el fallo.

IOSurface comparte buffers de imagen entre procesos: [Apple](https://developer.apple.com/documentation/iosurface). La atribución de un cliente requiere evidencia adicional que este informe no contiene.

## Nuestra ejecución y responsabilidad

Se ejecutaron simultáneamente la regresión general y la bateríaA67 de dos motores, cada proceso con `workers:1`. La segunda grababa vídeo continuamente y capturaba una matriz extensa de tamaños/idiomas/packs. Unworker por comando no limita dos comandos diferentes: [paralelismo Playwright](https://playwright.dev/docs/test-parallel). Las opciones de vídeo estaban activadas en configuración: [vídeo Playwright](https://playwright.dev/docs/videos).

La concurrencia y el volumen gráfico fueron una precaución insuficiente. Son factores de carga comprobados y compatibles con el incidente, sin afirmar una causalidad exclusiva que el informe no permite demostrar.

Las ejecuciones interrumpidas por el cierre de sesión dejaron procesos preview huérfanos y logs con conexiones PostgreSQL terminadas. No se cuentan como baterías superadas ni como fallos funcionales del juego. El último caso WebKit de forja terminó con contexto/navegador cerrado; queda pendiente de validación en Linux.

## Contención ejecutada

- No se ha vuelto a abrir navegador, grabar vídeo, capturar pantalla ni ejecutar WebKit para investigar.
- Se identificaron y detuvieron únicamente los previews de nuestras pruebas:5430,5432,5434 y sus launchers huérfanos. No se cerraron Chrome/Safari, procesos WebKit del sistema o sesiones ajenas.
- No hay workers dePlaywright ni chrome-headless-shell/MiniBrowser de estas pruebas activos al verificar después de la limpieza.
- Los contenedores PostgreSQL/Redis no estaban activos tras la caída; no se reiniciaron para leer el diagnóstico. Tras la autorización local se pueden iniciar únicamente esos servicios del proyecto.
- No se modifica configuración global de macOS, GPU, herramientas o navegadores.

## Cambios preventivos del repositorio

Las19configuraciones Playwright usan ahora `defineSafeConfig`:

1. En macOS se rechazan las baterías gráficas completas antes de iniciar sus servidores/navegadores. Enric permite una excepción local acotada, descrita a continuación. La validación extensa y los perfiles de rendimiento se trasladan a CI Linux.
2. Unworker, sin paralelismo de archivos y sin reintentos automáticos.
3. Vídeo, trazas y screenshots automáticos desactivados por defecto, también si un proyecto individual intentaba activarlos.
4. Bloqueo compartido en Git common-dir para impedir dos suites simultáneas entre procesos/worktrees. Unbloqueo con propietario vivo no se roba; metadata inválida o propietario desaparecido exige revisión explícita. No se borra por antigüedad.
5. Las capturas manuales de la bateríaA67 son opt-in (`ARCANA_CAPTURE_EVIDENCE=1`) y de viewport; las comprobaciones ordinarias no generan la matriz dePNG. Los scriptsmanuales históricos permanecen históricos y no deben ejecutarse en este Mac.
6. Regla operativa persistida en AGENTS.md y README: ningún subagente lanza otra batería en paralelo; cerrar solo procesos propios; no repetir el incidente para “validarlo”.

Esto reduce exposición; no constituye una demostración de que el sistema operativo ya no pueda fallar. No se presenta un workaround deGPU como verificación visual real.

## Comprobaciones no gráficas

-6 pruebas de protección correctas, incluyendo vigilancia de recursos y propiedad de procesos: rechazo enmacOS; límites/grabación del runnerLinux; exclusión de segunda suite; no robar un bloqueo no verificable. `evidence/browser-safety-unit.txt`.
-`npm run typecheck` correcto, `evidence/types-safety.txt`.
-Carga de configuración mediante `--list`, sin navegador ni servidor: debe rechazar el hostMac; `evidence/browser-host-refusal.txt`.

No se ha ejecutado una prueba de carga del ordenador. El incrementoA67 sigue activo; integración/main/CI y comprobaciones gráficas restantes aún no se declaran completas.

## Excepción local autorizada posteriormente por Enric

«Puedes ejecutarlo en local pero siempre y cuando controles» permite un smoke; no revoca el límite a matrices/vídeo/concurrencia. `npm run test:browser:local` ejecuta únicamente `browser-local-smoke-a67.spec.ts`, un Chromium/context aislado, un viewport y sin capturas/vídeo/trazas. Enumera y comprueba un único test antes de abrir el navegador; configuración no ejecutable directamente sin token temporal de su watchdog. Una consulta/selección/cancelación de Pacto verifica que no cambia estado, sin gastar en la partida habitual.

Preflight y watchdog cada2s leen `ps`/carga del sistema; no capturan escritorio. Se rechaza carga1min superior a1,25×CPUlógicas; WindowServerCPU>70%, RSS>768MB o aumento>192MB; se cancela si cambia el PID del compositor, los procesos propios superan1,5GBRSS, falla la vigilancia o pasan60s. Son umbrales conservadores operativos, no límites de seguridad certificados por Apple. RSS no mide toda la memoriaIOSurface; estos controles no garantizan que macOS no pueda fallar.

El preflight ejecutado tras esta autorización **no lanzó navegador** y rechazó la ejecución por serviciosPG/Redis no saludables. Evidencia: `evidence/local-browser-preflight.txt`. El estado de carga/WindowServer se conserva en eseJSON. Las pruebas puras del monitor/propiedad deprocesos no abren navegador. No se ha relanzado una batería gráfica ni se ha forzado reproducción del incidente.

### Smoke local ejecutado con controles

Tras arrancar solo los contenedoresPG/Redis del proyecto, el preflight permitió la ejecución (carga2,73/11CPU,WindowServer~176,9MBRSS/1,8%CPU). `npm run test:browser:local`: **1/1caso correcto en3,6s**, sin screenshots/vídeo/trazas y sin reintentos. El watchdog no detectó umbrales de parada. Comprobación posterior: mismoWindowServer activo,~177MBRSS y ningún chrome-headless/MiniBrowser/preview de estas pruebas. No demuestra ausencia futura de fallos del sistema; sí que este recorrido concreto terminó bajo los controles. Logs: `evidence/services-recovered.txt`, `evidence/local-browser-smoke.txt`. No se ejecutó ninguna otra batería gráfica local después.
