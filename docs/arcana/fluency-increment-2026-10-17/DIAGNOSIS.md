# A73 · Investigación y decisiones

## Separación de evidencia

**Hechos comprobados en código:**

- `useBattlePlayback` publica fronteras de fase y utiliza el mismo `ReplayClock` que Pixi. No recalcula combate.
- `BattlePanel` mide geometría al cambiar combate, idioma o tamaño; no hace lecturas DOM por frame.
- `SceneAtmosphere` ya cede ante arena/preparación. El backdrop histórico duplicado está anulado por CSS.
- `pixi-scenes.update` invalida geometría incluso cuando solo cambia la fase. Cada decode resuelto solicita otro paint, también mientras el ticker está activo.
- Pixi8.22 instalado: `autoDetectRenderer` llama a `isWebGLSupported`; este crea y pierde un contexto de prueba antes de crear el contexto de trabajo. La documentación ofrece construcción directa de `WebGLRenderer`. No se afirma aún cuánto tarda este paso.

**Problema histórico reproducido anteriormente:** arena genérica P95rAF33,4ms en dos de tres ejecuciones con el mismo runtime; arranque con máximo≈233ms. Los valores16,8ms del jefe no sustituyen el caso desfavorable.

**Referencia Linux39026178568:** fase A70/A71/A73 correcta y artifact guardado; ejecución global cancelada deliberadamente después, sin atribuir éxito total. Mergeensayado582bdc57a0e1675b21867b772363fd9ddc01ba3e, head d13c0d9. Seis ventanas10s: todasP95rAF16,7–16,8ms y ceroLongTasks cálidas. El caso histórico33,4ms **no se reprodujo en esta referencia**. Renderer declaradoANGLE/SwiftShader. Inicialización29,2–50,8ms e importación39,3–72,4ms; no explican por sí solas todos los picos. Se observaron tres adquisiciones decontexto (sondas internas yrenderer), no solo la sonda de capacidad.

Arranque: genérico345,3–399,3ms yjefe504–522,2ms como cotassuperiores hastaart-ready; máximo rAF66,5–150ms. Entre9y16paints antes de esa lectura, con39,1–75,2ms acumulados dentrodepaint. Los callbacksdecode sucesivos intercalan envíos de4–11ms; esta ráfaga es trabajo redundante comprobado. Promesasdecode81,9–109,7ms incluyen schedulingyred y no se suman comoCPU. Geometría cálida92–99reconstrucciones por10s, coste acumulado6,6–12,1ms: reducible, pero demasiado pequeño para atribuirle los intervalos históricos33ms.

Los hooks no alteran decisiones, reglas u operaciones y no se activan en uso ordinario.

## Hipótesis y contraste

| Hipótesis | Qué la apoyaría | Qué la limitaría/descartaría |
|---|---|---|
| Inicialización/autodetección | `renderer-init` y Long Tasks relevantes; dos contextos observados | Mayor coste fuera de init o ausencia de mejora al evitar la sonda |
| Importación/evaluación | intervalo `module-import` dominante | intervalo pequeño; coste persiste con módulo disponible |
| Decode/subida inicial | promesas y primer submit coinciden con el pico | promesas solapadas no prueban CPU; submit no mide GPU |
| Geometría redundante | muchas reconstrucciones por fase sin variar puestos/arte/condición | coste insignificante; reducirlas no cambia la ventana |
| Trabajo continuo no visual | paints durante eventos sin movimiento; coste de submit relevante | mismos intervalos pese a menos envíos |
| Instrumentación/runner | variación entre muestras, renderer software y comparación A69 sin sink | no explica por sí solo un defecto causal de app |

Primero comparar sobre las mismas fixtures y ventanas. Ninguna observación aislada acredita fuga, tiempoGPU o causalidad. No modificar reglas para fabricar un combate favorable.

## Alternativas condicionadas a medición

1. Inicializar directamente el WebGLRenderer ya requerido; conserva try/catch y fallback DOM, sin otro motor ni capability-context desechable.
2. Invalidar geometría solo cuando cambia su entrada y agrupar invalidaciones de carga; mantener todos los actores, fases y posiciones.
3. Evitar envíos repetidos de una imagen estática durante eventos sin movimiento, conservando el avance del reloj compartido.
4. Reutilización acotada entre pantallas: solo si recrear recursos demuestra un coste relevante. Debe definir propiedad y liberación; no es una decisión tomada.

No se adoptan por ahora cachés globales, prewarming, reducción de resolución, nuevos formatos o exports, rendergroups, otro runtime ni cambios de arte. Son costes y riesgos innecesarios sin evidencia específica.

## Fuentes técnicas

Consulta17octubre2026: [Renderers Pixi8](https://pixijs.com/8.x/guides/components/renderers), [API8.22 WebGLRenderer](https://pixijs.download/v8.22.0/docs/rendering.WebGLRenderer.html). Código instalado en `node_modules/pixi.js/lib/rendering/renderers/autoDetectRenderer.mjs`, `utils/browser/isWebGLSupported.mjs`, `app/Application.mjs` y `rendering/renderers/gl/WebGLRenderer.mjs`. El código fijado por lockfile resuelve diferencias con documentación dev. No se usa una demo del proveedor como benchmark propio.

## Primer ciclo elegido

Evidencia → cambio: las llegadas de textura realizaban pinturas síncronas independientes → invalidación agrupada por frame; si el ticker ya está activo, lo utiliza sin un segundo envío. Pausa vacía la invalidación de inmediato; ocultación y desmontaje cancelan callbacks. Sin retrasos temporizados, prewarming, nueva caché o cambio de resolución.

Las fases reconstruían plataformas/figuras sin variar geometría → comparar puestos, orden, apariencia y condición vivo/caído. PV/PM, actor/objetivo y coreografía siguen proyectándose desde el log actual. Caída, nueva figura, encuadre, tamaño, textura resuelta y resize invalidan correctamente. El coste de comparación es≤10unidades; no se memoriza el log completo ni se altera el reloj.

Se descartan por ahora la sustitución de Application, caché de contextos y cambios de exports: init es una fracción pequeña deesta referencia y la ráfaga de paints tiene una corrección menor. La construcción directa documentada sigue siendo alternativa, no implementación.

Presupuestos de ensayo elegidos tras la referencia: P95rAFsostenido≤20ms; navegación→arte genérico≤400ms/jefe≤550ms y máximo rAFdearranque≤100ms como objetivo más exigente que el máximo150ms observado. Son objetivos en lasfixtures declaradas, no garantías físicas. Además se exige una reducción reproducible de paints/reconstrucciones sin empeorar el recorrido; pasar un techo sin diferencia antes/después no se declara mejora.

## A/B mismo runner · 39029402120

Referencia d13 y candidato075d se compilaron y midieron en el mismo job, orden AB/BA/AB, contextos separados. Mediana de arte listo genérico531→471ms, jefe722→484ms. P95 sostenido genérico33,3–33,4ms en ambos, también tras remontar; jefe16,8ms. Los intervalos de paint/commit de React P95 estuvieron entre0,6–1,4ms, sin aislar GPU ni composición. No es suficiente para cumplir20ms. Crudos en evidence/ab-1.

Ensayo siguiente: mipmaps de imágenes minificadas, sin cambiar ilustraciones/resolución/encuadre. Pixi8.22 comprueba soporte NPOT antes de generar niveles. Coste potencial: preparación inicial y hasta aproximadamente un tercio adicional de texels; no equivale a memoria residente. Hipótesis de muestreo, no causa GPU demostrada. El constructor de referencia se ajusta a las mismas tres entradas Vite antes de comparar de nuevo.

## Segundo A/B ·39029992923 ·ensayo de mipmaps descartado

Con entradas Vite igualadas, ambas variantes dieron P95rAF16,7–16,8ms, incluido remontaje. Arranque genérico referencia419–454ms/candidato377–406ms; jefe508–516/370–460ms. No se aísla beneficio sostenido de mipmaps: también la referencia mejoró respecto al runner anterior. Se retira el ensayo para evitar coste adicional no justificado; no se elige esta muestra favorable como prueba universal. Se conservan crudos y resumen en evidence/ab-2. Fase gráfica correcta, resto de workflow cancelado deliberadamente, no CI global.

Siguiente corrección demostrable por dependencia de código: iniciar decode de las imágenes pertinentes en paralelo con app.init, incluidas base/brazo del jefe. Texturas GPU solo después de inicializar. Propiedad por escena y limpieza; no precarga desde otra pantalla, caché global, nuevas ilustraciones ni resolución reducida. Fallo de decode mantiene el fallback y no crea reintentos. Arranque se seguirá midiendo desde navegación/clic incluyendo todo este trabajo; tiempos de init/decode pueden solaparse y no se suman como CPU.
