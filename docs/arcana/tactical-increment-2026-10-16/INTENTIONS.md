# A65 · Una intención voluntaria para volver

16 octubre 2026. Diseño e implementación técnica del tercer recorrido. No es una misión remunerada, un logro nuevo ni evidencia de retención. Game Design Workshop orienta agencia/objetivo/procedimiento/resultado; Game UI/UX orienta composición, foco, equivalencia de consulta y actualización por estado confirmado.

## Contrato de interacción

El cierre A63 conserva el primer plano: resultado, botín ganado y uso del stock actual. Debajo aparece una bandeja de **hasta tres intenciones viables**. Se puede seguir preparando otra expedición sin seleccionar ninguna.

- **Otra compañía:** un personaje que ya existe en las copias propias y no participó en ningún combate confirmado de la ruta anterior (si no hubo combates, se compara con los compañeros del cierre). El retrato identifica el objetivo concreto. Se realiza cuando esa copia propia participa en un combate confirmado de la siguiente expedición. Seleccionar formación o reclutar un temporal del mismo personaje no basta.
- **Otra sinergia:** una afinidad que las copias propias pueden activar con los umbrales compartidos existentes y que no se activó en ningún combate confirmado de la ruta anterior (si no hubo combates, se compara con la formación del cierre). No se prometen ofertas futuras de Pacto ni se inventa afinidad ausente del contenido. Se realiza con el evento `synergy-activated` del equipo del jugador en el log confirmado de la siguiente expedición.
- **Prueba un sabor:** aparece si quedan sabores sin descubrir y existe una gragea disponible o saldo suficiente para comprarla al precio vigente. El detalle distingue objeto poseído de compra pendiente y explica que el sabor puede repetirse. Se realiza con una activación propia confirmada; **no garantiza un descubrimiento nuevo**. Compra, asignación o replay no la completan.

La selección es una escritura explícita sin efectos económicos. No añade miembros, equipa, compra, asigna grageas, elige rama o inicia una run. La preparación y su confirmación permanecen como decisiones independientes. Cada opción se presenta mediante objeto/retrato y nombre breve; el procedimiento y las condiciones se consultan desplegando el detalle.

Un recordatorio compacto acompaña mapa y preparación. La composición ordinaria debe conservar el mapa central; el contenido ampliado del recordatorio puede necesitar desplazamiento accesible. El cierre de una intención solo presenta un sello y su estado. No existe reclamación ni premio.

## Autoridad y mínimo persistido

`SetIntentionRequest { afterRunId, choice }`, con `choice` nula para abandonar, o una unión explícita:

- `{kind:'new-companion',wizardId}`
- `{kind:'synergy',affinity}`
- `{kind:'bean'}`

`ExplorationState.intention?` contiene `{version:1,afterRunId,runId:null|string,choice}`. `set-intention` conserva receipt, revisión e idempotency key. Reutilizar una key con otra selección da conflicto. Una segunda pestaña con revisión vieja no sobreescribe silenciosamente una selección. No se cambia inventario, formación, premios o progreso de campaña.

Elegir requiere el cierre indicado y una opción todavía viable. Abandonar exige el `afterRunId` de la intención existente y también se permite durante la run vinculada. Al iniciar explícitamente otra expedición, `bindIntention` vincula el plan a ese ID una sola vez. Un intento vinculado no se arrastra silenciosamente a una tercera expedición.

El logro no se guarda como booleano editable: se deriva del `NodeReceipt` y `BattleLog` confirmados pertenecientes al `runId` vinculado. Un replay o cambio de idioma recupera la misma evidencia. No se anuncian estados con live regions nuevas que puedan revelar el resultado de combate antes del replay.

Estados de proyección:

| Estado | Significado |
|---|---|
| selected | Elección guardada; otra expedición todavía no iniciada |
| active | Run vinculada en curso; sin evidencia de realización |
| completed | Existe receipt confirmado que cumple el procedimiento |
| ended | Run vinculada terminada sin cumplirlo |
| unavailable | La selección previa perdió viabilidad antes de iniciar; se muestra revisión/cancelación, sin ocultarla |

Consultar no escribe. Cambiar o abandonar intención no revierte equipo guardado ni consume productos. Un fallo de commit no muestra la elección como confirmada. La autoridad HTTP y la columna JSONB nullable `arcana_exploration.intention` se integran en el recorrido del coordinador, mediante migración aditiva compatible. La prueba PostgreSQL debe reabrir pool y verificar lectura, no limitarse al double. Ausencia histórica y cancelación se normalizan a ausencia en la proyección de exploración; el receipt de abandono conserva `intention:null`.

## Presentación, arte y movimiento

Componentes `ExpeditionIntentions` e `IntentionReminder`, diccionario propio es/en y CSS acotado. Reutilización de retratos, `node.refuge` y `beans.jar` del pack activo; no hay nueva producción de personajes, fondos o assets pagados. Fuentes y procedencia se conservan en sus manifests existentes. `Artwork` conserva texto/acción cuando falla un recurso.

Selección: borde/sello y desplazamiento máximo 2 px, 140 ms ease-out, sin demora de estado o partículas. El ajuste propio `data-reduced=true` y `prefers-reduced-motion` eliminan transición y traslación. No loops, shake, flashes, renderer adicional o audio.

Los objetos son botones semánticos; selección mediante `aria-pressed` y `aria-disabled` con guard que conserva el foco durante la escritura, nombre accesible completo y consulta nativa por teclado/foco/toque. No formularios, drag obligatorio ni configuración en álbum. El componente de recordatorio no tiene anuncios automáticos por defecto.

## Evidencia técnica disponible de este subrecorrido

- `evidence/intentions-red.txt`: RED previo por ausencia del módulo nuevo.
- `evidence/set-intention-red.txt`: intento inicial con integración de receipt todavía incompleta y expectativa del código de revisión corregida al existente `STALE_GAME`; no se cuenta como fallo posterior del producto.
- `evidence/intentions-green.txt`: 20 casos nuevos correctos: 9 proyección/dominio, 5 frontera de escritura con double, 6 render es/en/preparación; junto con 10 casos previos de preparación, 30/30 focales. `intentions-history-red.txt` conserva dos RED reales de una corrección adversarial: derrota con todos caídos no olvida una sinergia anterior y retirar un personaje no lo convierte en nuevo respecto a esa ruta.
- `npx --no-install tsc -b --pretty false`: correcto tras integrar el receipt; comprobación técnica, sin atribuir browser/SQL.

Los casos cubren viabilidad, no mutación, vinculación única, no arrastre a otra run, evidencia de jugador frente a rival y run incorrecta, selección sin consumo, reintento/conflicto, abandono, revisión vieja, fallo de guardado y representación es/en sin formularios ni live status prematuro.

La validación visual, dos pestañas reales, recuperación HTTP y persistencia PostgreSQL/Redis corresponde a la evidencia integrada final. Las capturas o SSR no se presentan como prueba de autoridad o comprensión humana. Sigue pendiente observar si la intención despierta una estrategia distinta y deseo de repetir.

## Recorrido integrado compilado

`npx --no-install playwright test --config playwright.intentions-a65.config.ts`: **8/8 correctos** en candidate-3, ES/EN × Diagon/ARCANA × Chromium/WebKit. Resultado: `evidence/intentions-browser-final-candidate3.txt`. Puertos5394/5395 y namespace UUID por ejecución, cookie/cuenta nuevas por contexto. El bloque anterior al cierre utiliza comandos legítimos de la API sobre esa cuenta aislada, con enumeración del grafo que favorece Pactos/Refugios y evita duelos opcionales. Se guarda el camino de preparación en cada JSON; no se modifica saldo, resultado o estado para fabricar una victoria, ni se atribuye ese setup a una persona.

Después del setup, la GUI comprueba: elegir gragea con foco+Enter, escritura sin cambio de inventario/copias/run, recarga exactamente igual, abandonar y devolución de foco a `#content`, seleccionar otra vez, consultar/cancelar preparación sin iniciar run, confirmar explícitamente nueva expedición, recordatorio en preparación/mapa, asignar sin consumo, confirmar combate real, activación única, intención realizada desde receipt, recarga y replay sin premio ni escritura adicional. ARCANA usa preferencia del sistema de movimiento reducido. La suite no acredita dispositivo físico, lector hablado o diversión.

Capturas finales: `evidence/after-intentions/*-{selected|active|completed}-{1280|390|865}.png`, con JSON de autoridad por idioma/pack/motor. Cada tamaño verifica que **todos los botones de nodo caben dentro del viewport**, y el centro del recordatorio supera un hit-test de `elementFromPoint`: evita aceptar como visible un elemento tapado por el mapa. Inspección visual de active390/selected390 y escritorio confirma mapa completo y recordatorio legible. Vídeos de los ocho recorridos: `evidence/intentions-videos/manifest.json`.

Correcciones encontradas: primera captura mostraba el recordatorio detrás de la escena y geometría móvil recortada. Se corrigió en la integración CSS reservando su área real, y se repitió la matriz entera. El primer intento WebKit utilizaba clic de puntero esperando foco nativo; se cambió a foco+Enter para comprobar específicamente teclado. El segundo detectó una carrera del harness: `#content` ya estaba enfocado antes de terminar el abandono; ahora espera la desaparición del control antes de leer autoridad. El intento interrumpido `intentions-browser-webkit-pass2.txt` conserva su estado y no cuenta como ejecución final. Los avisos Vite de WebSocket24678 no impidieron previews aislados ni produjeron pageerrors.

Estas muestras se ejecutaron con otras pruebas funcionales activas; no se utilizan como benchmark de FPS o latencia. El rendimiento del incremento se mide en la pasada dedicada del coordinador.
