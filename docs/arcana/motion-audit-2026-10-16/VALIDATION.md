# Validación A69

## Riesgos y cobertura prevista

TDD: reloj que conserva fracción al pausar, acelerar y ocultar; omisión idempotente; recetas finitas por rareza y nuevo/repetido; historial visual acotado; datos PV/PM procedentes del resultado guardado. Pendiente y error no deben producir éxito. Se ejecutan regresiones del dominio y PostgreSQL/Redis aunque A69 no cambie economía, para conservar la dependencia A68.

Linux compilado: mismo BattleLog y estado antes/después, pausa, 2x, inspector, ocultación, omisión, reducido y pérdida de contexto. ES/EN y ambos packs a 1280×900, 390×844 y 865×1079. Composiciones 3×3, 5×3 y 5×5 mediante fixtures declaradas, sin cambiar la campaña. Apertura de cuatro rangos, descubrimiento/copia, recarga, cambio de pack e idioma, asset ausente e import fallido. Regresiones de ruta, Pacto, refugio, cofre, encuentro, forja, bóveda y consulta histórica; matriz A68 independiente.

Teclado, foco, toque emulado y texto al 200 % se distinguen de dispositivo físico y lector hablado. La ocultación sintética prueba el listener de visibilidad; no demuestra comportamiento del sistema operativo de un teléfono.

## Medición y presupuestos

Medir desde pointer/tecla hasta resultado utilizable, conservando red, confirmación, import, decode y animación donde existan. No trasladar trabajo a otra pantalla para fabricar una mejora. Registrar entorno, SHA, fixtures, caché, número de muestras, P50/P95 y pico.

El harness A69 parte de un **resultado ya confirmado** y mide presentación/carga/animación; no tiene una operación de autoridad y no acredita latencia de red de una compra real. Las baterías integradas del juego comprueban operaciones reales por separado. Una nueva navegación no equivale automáticamente a caché de red vacía.

| Presupuesto propuesto | Objetivo y alcance |
| --- | --- |
| Frame a 60 Hz | 16,7 ms por frame; P95 ≤20 ms en escritorio emulado. Ninguna nueva tarea >50 ms atribuible al efecto. No es garantía en móvil físico. |
| CPU de efectos | ≤2 ms/frame como objetivo; medir con perfil atribuible antes de afirmarlo. |
| Simultaneidad | Un proyectil y un impacto o curación; ≤12 marcas Graphics; FrogMagic ≤24 sprites y dos texturas precocinadas de 28×28. |
| Texturas propias | ≤12 MiB por arena; estimación ancho×alto×4, no memoria GPU total. Referencia de figuras: unas 5,86 MB RGBA para diez. |
| Resolución | Arena DPR≤2; apertura DPR≤1,5. No subir fondos a 4K para añadir brillo. |
| Payload incremental | Objetivo ≤150 kB comprimidos de arte y ≤15 kB gzip de JS. Un build dual de unos 14 MB no es una descarga inicial. |
| Pausa y ocultación | Cursor y renderCount estables, salvo un paint de estado pendiente o resize; sin ticker/RAF mantenido innecesariamente. |
| Omisión | Resultado DOM utilizable en ≤100 ms como objetivo, sin otra operación de red. |
| Desmontaje | Cero recursos propios activos. Comprobar 30 ciclos en serie: Canvas retirado y texturas propias destruidas. Memoria de heap/GPU y post-GC requieren medición específica; estos atributos no prueban ausencia global de fugas. |

Medir también 10–20 s de uso sostenido por separado del arranque. No calcular FPS solo desde el ticker si no se pinta. Si WebKit no expone Long Tasks, registrar ausencia de API, nunca cero tareas. Las cifras históricas A58 no se convierten en medidas actuales o comparaciones equivalentes. La comparación aislada A69 antes/después queda limitada si no existe la misma muestra reconstruida; no se afirmará una mejora porcentual sin ella.

## Mac y evidencia seleccionada

Rige HOST-INCIDENT. A69 no ejecuta navegador local, matrices, perfiles o grabaciones. `npm run test:browser:check` solo comprueba el preflight. No se reinstalan herramientas, alteran límites o elude el guard mediante otro script.

Linux usa un worker, lock común, media automática desactivada y cero reintentos. El workflow añade serialización entre ejecuciones. La evidencia gráfica es explícita: tres imágenes seleccionadas de arena y una de apertura en un proyecto Chromium. Una captura estática no acredita movimiento; secuencias, transformaciones, tiempo y pausa se comprueban en ejecución.

No se utiliza la partida habitual. La rama/PR es un paso necesario para comprobar en Linux; main se actualiza tras resolver el candidato. Si CI no está disponible, el estado queda pendiente sin regresar a gráficos del Mac.

## Ejecución local y correcciones previas

515 pruebas unitarias y 77 integraciones PostgreSQL/Redis correctas; tipos, build y escaneo correctos. Comandos y salidas en `evidence/`. El build mantiene el aviso conocido del chunk principal superior a 500 kB.

La revisión cruzada detectó un posible paint con fase nueva y actor anterior: se rechaza cuando los cursores difieren. Las cifras de daño mantienen identidad por unidad/evento a través de sucesos de contabilidad; su ventana CSS de 520 ms termina en opacidad cero y pausa con el replay. No se modifica HP ni BattleLog. Prueba adicional: RED por módulo ausente y GREEN 1/1.

La matriz estacional sale del descubrimiento general porque necesita toque y calendario declarado. El launcher privado acepta `ARCANA_TRIAL_CLOCK_ISO` en servidor; A68 fija 20 de octubre de 2026. Sin variable, mantiene Redis TIME. Sesiones y límites conservan autoridad Redis. No existe control público de fechas. La prueba HTTP con PostgreSQL/Redis dio un RED real de serverTime y después GREEN.

La evidencia parcial de ejecuciones canceladas mostró una expectativa antigua de confeti y un timeout de toque a 320 px. Se exige ahora el teatro de revelación y ausencia de confeti duplicado, manteniendo las aserciones económicas. El resumen del recluta/condición se pliega en mapa estrecho hasta consultar detalles, para no invadir retratos del equipo. Las ejecuciones canceladas no se cuentan como suites validadas ni se reintentan automáticamente.

## Sesión humana posterior

Duración sugerida: unos diez minutos, con objetivos sin explicar la solución.

1. Observar un combate y explicar quién actúa, a quién afecta y qué cambia. Hipótesis: el contacto local facilita esa lectura sin depender del registro.
2. Abrir una rana nueva y una repetida, reconocer la diferencia y continuar. Hipótesis: el ritmo y la materialidad dan importancia al hallazgo sin convertir la repetición en espera.
3. Cambiar una pieza o composición y consultar un resultado anterior. Observar si distingue selección, cambio guardado y consulta histórica.

Registrar dudas, ayuda, objetivos percibidos y pausas. No atribuir diversión o comprensión a simulaciones. Dispositivos físicos y lector hablado permanecen pendientes.

Los resultados Linux y sus límites se añaden en el informe tras completar la ejecución.

## Primer resultado Linux completo y corrección

CI [38947929656](https://github.com/earandes/diagon-alley/actions/runs/38947929656), candidato `8335ce0`: tipos, 515 unitarios, 77 PostgreSQL/Redis, build, suite general, A67, A63, A66, A65, doce proyectos A68, PWA y perfiles A67 correctos. A69:16 correctos,3 fallidos y5 omitidos intencionados. Los tres fallos Chromium proceden del mismo caso: una actualización pendiente hacía un paint adicional después de ocultar el documento, aunque cursor y reloj quedaban congelados. WebKit no reprodujo esa carrera en esta ejecución.

Se corrige `paint` para rechazar también `document.hidden`; no se elimina la aserción ni se aumenta su tolerancia. La nueva ejecución debe verificar el cese de dibujo y recuperación al volver visible, junto con las regresiones. La CI fallida sigue siendo evidencia de detección, no validación completa.

La inspección visual de las cuatro capturas del primer run detectó estrellas todavía atenuadas cuando el resultado ya era utilizable. Se asientan rareza/estrellas inmediatamente en estado `result`; el test exige opacidad1 sin esperar al fin de otro fade. Las capturas de arena evidenciaban composición y trayectoria, pero el protocolo entre observar fase y pausar podía fotografiar una fase posterior. La captura pasa a observar y pausar dentro del mismo RAF del navegador, limitada a un `spell-cast`, y verifica la fase congelada. Se vuelve a validar el candidato conjunto; no se presentan las primeras imágenes como prueba exacta de anticipación/contacto.

La siguiente ejecución prioriza A68/A69 tras build y navegadores, y sube su evidencia inmediatamente. Después conserva todas las baterías de regresión y perfiles previos, siempre en serie. Esto permite revisar el incremento antes de esperar las baterías largas; no elimina comprobaciones ni añade workers o reintentos.

Primer muestreo sostenido A69:560aprox. intervalos rAF, P95≈33,3ms y611draws en10s; supera el objetivo inicial de20ms y no acredita60FPS. La lectura detecta submissions duplicadas: cada cambio React de fase pintaba inmediatamente además del ticker activo. Se invalida la escena y se deja pintar al siguiente tick; pausa, mapa y omisión mantienen paint inmediato. Se vuelve a medir, sin prometer que esta corrección explique todos los intervalos largos del runner. El objetivo CPU/GPU atribuible sigue sin perfil específico.

Candidato `15b6c83`, CI38952731935: A69 completa19/19 con5 omisiones intencionadas; correcciones de ocultación y legibilidad verificadas. A68 produce dos timeouts WebKit1280: portal aún cargando al límite de4s, y recorrido ya completado que agota30s al consultar tras recarga. El contexto final conserva el recuerdo, los tres objetivos y el mapa; no evidencia una pérdida de estado. Se elimina el límite4s heredado del ensayo local y se declaran10s por interacción/60s para este recorrido Linux con cinco nodos, cuatro escrituras estacionales, fixturePG, ES/EN, pack y recarga. Se registra navigationToReadyMs y duración completa, sin presentar el nuevo timeout como rendimiento de producto. Guard,60s globales y límites del smokeMac permanecen intactos. Repetición explícita por corrección del ensayo, sin retries automáticos.
