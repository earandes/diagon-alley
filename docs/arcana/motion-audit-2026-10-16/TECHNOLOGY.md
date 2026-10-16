# A69 · Tecnología para movimiento y efectos

Fecha de consulta: **16 octubre2026**, según el entorno de este trabajo. Auditoría documental y lectura del código; **no se han instalado herramientas, abierto navegadores locales, ejecutado renders ni realizado benchmarks gráficos**. Se conserva el trabajo A68 existente. Este documento propone decisiones, no las implementa.

## Recomendación

Mejorar la composición y el movimiento con **PixiJS8.22.0, GSAP3.15.0, Motion mini14.2.0, CSS y Canvas2D ya integrados**. Producir una muestra de piezas ilustradas articuladas y, si una deformación o efecto lo exige, una pequeña secuencia de sprites. No introducir Rive, Lottie o dotLottie en el siguiente incremento sin que una muestra demuestre una carencia concreta del sistema actual.

La carencia observada por código es principalmente de material animable y puesta en escena: la arena transforma una ilustración completa por personaje, mientras la apertura ya combina caja, tapa, sello, rana, carta y partículas. Una biblioteca nueva puede reproducir una marioneta o una secuencia; no crea sus capas, articulaciones, poses ni intención visual. Esta interpretación debe contrastarse en la revisión de pantallas; no es una observación de jugadores.

## 1. Punto de partida comprobado

Fuentes locales leídas: AGENTS.md vigente, PRD/DECISIONS y contrato A68; skills `arcana-pixijs-rendering` y `arcana-game-feel`. Las recomendaciones genéricas de shake/audio o liberación global no sustituyen las restricciones del proyecto.

| Pieza | Versión instalada y fijada | Consumidor real | Consecuencia para el diseño |
| --- | --- | --- | --- |
| PixiJS |8.22.0|`scenes/pixi-scenes.ts`, cargado desde `SceneCanvas.tsx`|Mapa/arena, figuras y efectos locales; la lógica de combate continúa fuera del renderer.|
| GSAP |3.15.0|Imports diferidos en `CardReveal.tsx` y `CommercePanel.tsx`|Timeline de apertura y confirmación de equipo/bóveda; existen cleanup y resultado estático.|
| Motion |14.2.0|`motion/mini` en `VisualChoices.tsx` y `OperationFeedback.tsx`|Selección y confirmaciones cortas; no se está usando el componente React `motion` completo.|
| CSS |API del navegador, sin versión npm|Estilos de escena/objetos, incluidos estados estacionales|Estados simples y feedback declarativo, conservando controles HTML.|
| Canvas2D propio |Sin dependencia adicional|`FrogMagic.tsx`|24destellos, dos sprites precocinados de28×28, duración3200ms, rAF y pausa por visibilidad; no nuevo contexto WebGL.|

`pixi-scenes.ts` inicializa `Application` de forma asíncrona, `antialias:false`, resolución máxima2 y **`preference:['webgl']`**. El mapa se pinta por cambios; la arena activa ticker durante reproducción. Conserva texturas por escena y las destruye al salir. El fallback real ante init/contexto fallido es la presentación DOM/registro de la aplicación, no otro motor invisible. `SceneCanvas` recrea al cambiar tipo de escena o pack; merece medir esa frontera antes de plantear un renderer persistente.

La figura de arena es un `Sprite` por unidad: posición/alpha, inclinación al caer y rotación local al recibir impacto. No hay rig corporal ni animación de boca/mano por el mero hecho de que el retrato tenga aspecto pintado. La apertura usa una timeline sobre piezas DOM y partículas Canvas2D separadas, siempre después del receipt confirmado.

## 2. Versiones externas y mantenimiento

Consulta de metadatos del registro oficial de publicación npm, sin descargar ni instalar paquetes. `latest` es una observación de esta consulta; no una obligación de actualizar. Fechas UTC de publicación, distintas de la fecha de consulta.

| Paquete | Instalado | Latest observado | Publicación de ese latest | Licencia declarada por el paquete |
| --- | --- | --- | --- | --- |
|`pixi.js`|8.22.0|8.22.0|2026-10-01T21:58:04.868Z|MIT|
|`gsap`|3.15.0|3.15.0|2026-04-13T13:15:35.800Z|Standard No Charge, no MIT|
|`motion`|14.2.0|14.3.0|2026-10-15T14:27:25.734Z|MIT|
|`@rive-app/canvas`|No instalado|2.44.2|2026-10-10T19:08:24.963Z|MIT|
|`@rive-app/webgl2`|No instalado|2.44.2|2026-10-10T19:07:50.362Z|MIT|
|`lottie-web`|No instalado|5.13.0|2025-05-21T17:23:47.288Z|MIT|
|`@lottiefiles/dotlottie-web`|No instalado|0.81.0|2026-10-06T07:39:49.900Z|MIT|

Fuentes primarias de las filas: [Pixi](https://registry.npmjs.org/pixi.js), [GSAP](https://registry.npmjs.org/gsap), [Motion](https://registry.npmjs.org/motion), [Rive Canvas](https://registry.npmjs.org/@rive-app%2fcanvas), [Rive WebGL2](https://registry.npmjs.org/@rive-app%2fwebgl2), [Lottie Web](https://registry.npmjs.org/lottie-web), [dotLottie Web](https://registry.npmjs.org/@lottiefiles%2fdotlottie-web). Repositorios del mantenedor enlazados en esos metadatos. La existencia de un release reciente no demuestra rendimiento, ausencia de errores ni compatibilidad con este juego.

**No se propone actualizar Motion solo porque exista14.3.0.** Las APIs usadas actualmente son pequeñas y el cambio no resuelve por sí mismo la calidad de las poses o el ritmo. La [release Pixi8.22.0](https://github.com/pixijs/pixijs/releases/tag/v8.22.0) documenta, entre otros cambios, correcciones de accesibilidad y filtros; ya está instalada, sin necesidad de migración para esta auditoría.

## 3. Corrección importante de los supuestos Pixi

La skill local se titula8.21. Parte de su flujo asíncrono sigue siendo pertinente, pero sus frases sobre fallback no bastan para describir la configuración concreta:

- En el **código instalado8.22.0**, `autoDetectRenderer.mjs` contiene WebGL, WebGPU y Canvas. Si `preference` es un array, solo prueba ese array; una cadena permite añadir los demás backends en orden.
- Nuestro array `['webgl']` excluye expresamente WebGPU y Canvas. Ante fallo, la aplicación debe conservar su fallback DOM.
- La [guía general8.x](https://pixijs.com/8.x/guides/components/renderers) todavía muestra Canvas como próximo, mientras el [anuncio oficial8.16.0 del4febrero2026](https://pixijs.com/blog/8.16.0) describe su introducción experimental. Se resuelve la contradicción mediante el código instalado, no eligiendo la frase que resulte más favorable.
- Habilitar Canvas experimental requiere comprobar sprites, composición, máscaras y fallback; su existencia no acredita paridad. Cambiar a WebGPU tampoco garantiza una mejora en este juego o dispositivo.

La recomendación es **conservar WebGL y DOM de respaldo**. Probar otro backend solo si una medición equivalente identifica un problema que ese cambio pueda resolver. Tampoco aplicar ciegamente `releaseGlobalResources:true` que recomienda la skill: antes hay que inventariar propiedad y compartición de cachés, para no invalidar recursos de otra escena. Actualmente se destruyen las texturas propias y se evita liberar globalmente.

## 4. Comparación para este juego

Los costes y riesgos siguientes son evaluación técnica, no resultados de una prueba comparativa ejecutada.

| Opción | Qué aporta aquí | Autoría/exportación a coste adicional cero | Carga, CPU/GPU y mantenimiento | Accesibilidad y fallback | Decisión |
| --- | --- | --- | --- | --- | --- |
|CSS/transiciones + WAAPI|Seleccionar, asentarse, iluminar ventana, entrada/salida breve de un objeto|Código y piezas SVG/raster propias; no editor de pago|Sin biblioteca nueva. Transform/opacity son candidatos; filtros grandes, layout y capas promocionadas pueden costar. No equivalen a GPU gratis.|HTML mantiene foco/nombre; detener animación y presentar estado final. No depender de `animationend` para confirmar dominio.|**Adoptar como primera opción** para estados simples.|
|GSAP existente|Secuencias de varias piezas, anticipación/acción/cierre, interrupción común|Timeline en TS y arte propio; sin suscripción para este uso del juego|Ya diferido. Reutilizar una timeline propietaria, revertir/cancelar y evitar animar la misma propiedad desde CSS y GSAP a la vez.|Omitir al resultado confirmado; fallback si import falla. Textos y botones fuera del arte.|**Conservar** para rituales y secuencias que lo necesiten.|
|Motion mini existente|Feedback discreto de selección/confirmación|Código, sin Motion+|Ya importado; no incorporar React/hybrid completo para replicar estas dos animaciones. Cancelar en desmontaje y al reducir movimiento.|Semántica HTML explícita; mini no convierte por sí solo un canvas en interfaz accesible.|**Conservar** para usos actuales, con dueño claro de cada animación.|
|Pixi8 existente|Actores, proyectiles, efectos unidos al BattleLog y composición del mapa|Piezas PNG/WebP con transparencia o atlas y JSON de pivotes propios|Hay contexto/ticker/decodificación/texturas. Favorecer recursos precreados y efectos acotados frente a redibujar geometría compleja por frame.|Canvas decorativo; foco, PV, resultado y registro equivalentes en DOM.|**Conservar**; mejorar poses/efectos antes de sumar motores.|
|Piezas articuladas + Pixi/GSAP|Mano con varita, inclinación del torso, capa o tapa con pivotes, manteniendo acabado pintado|Editar separaciones y zonas ocultas con pipeline local; fuente de capas y pivotes, sin fingir un rig a partir de un PNG plano|Más trabajo artístico y algo de composición; reutiliza renderer. Coste proporcional a piezas y resolución, no gratuito por ser2D.|Pose estática válida y mismos eventos; no texto incrustado.|**Primera muestra de producción recomendada**.|
|Spritesheet/atlas corto|Silueta de un hechizo, pliegue o deformación que no se obtiene con piezas rígidas|Export local de frames y atlas reproducible. Sin requerir empaquetador comercial.|Intercambia coste por frame y memoria de textura. Atlas gigante o muchos frames pueden empeorar arranque/memoria.|Fotograma final significativo y controles ajenos a la secuencia.|**Probar de forma limitada**, no lote completo de personajes.|
|Rive|Estado/mezcla de una ilustración interactiva con autoría visual|Runtime MIT; editor/export son condiciones separadas. Véase comprobación debajo.|Añade JS+WASM+.riv y otro ciclo de render, o integración avanzada más compleja. Necesita cleanup y compatibilidad de features.|Mantener HTML equivalente y póster; no confiar solo en listeners internos para teclado/localización.|**Descartar adopción inmediata**; prueba futura solo con caso no resuelto por piezas.|
|Lottie Web|Animación vectorial prefijada, sello o adorno diseñado en editor|Runtime MIT. After Effects no forma parte del presupuesto autorizado; alternativa libre a evaluar: Glaxnimate.|JSON+renderer; SVG puede crear muchos nodos, Canvas otra superficie. Raster embebido no se vuelve ligero por estar en JSON.|Controlar reproducción, detener en fotograma y mantener nombre/acción en HTML.|**No añadir ahora**; la mayor parte del arte es pintado y ya tiene alternativas.|
|dotLottie Web|Paquete comprimido de secuencias/recursos, estados/temas si más adelante hay un caso concreto|Runtime MIT; no confundir formato abierto con servicios/exportadores/assets gratuitos.|JS+WASM+archivo.lottie; descompresión y arranque antes de primera imagen. No sustituye por sí mismo a Pixi ni elimina el coste de render.|Póster y acción HTML, parada y recuperación si falla WASM.|**No añadir ahora**; comparar con Lottie solo después de demostrar necesidad.|

WAAPI dispone de timeline y controles de reproducción nativos; el contrato de omisión y limpieza sigue siendo responsabilidad de la aplicación. [Especificación W3C/CSSWG](https://drafts.csswg.org/web-animations-1/) y [MDN, modificación11septiembre2026](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

La licencia GSAP consultada es **gratuita para usos permitidos**, incluidos comerciales, con restricciones para herramientas visuales competidoras y conservación de avisos. No es MIT ni dominio público; este juego no está construyendo un editor comercial de animaciones. No se necesita Motion+ para las funciones actuales. [Licencia GSAP, efectiva30abril2025/modificada30mayo2025](https://gsap.com/community/standard-license/), [Motion y herramientas opcionales](https://motion.dev/docs/quick-start).

## 5. Rive, Lottie y autoría: comprobar el recorrido completo

**Rive:** la página oficial consultada ofrece Free con exportación`.riv` y splash de Rive, tres archivos colaborativos, y planes de pago para retirarlo. Esto corrige la simplificación «runtime gratuito ⇒ exportación libre sin condiciones», y también hace inexacto afirmar sin más que el plan gratuito no exporta. La página no da fecha de modificación: se registra su estado consultado, no se reconstruyen condiciones históricas. No se ha creado cuenta, archivo ni export para comprobar restricciones efectivas. [Pricing oficial](https://rive.app/pricing).

Su documentación actual recomienda WebGL2 para máxima compatibilidad con lo producido en el editor, ofrece Canvas y Canvas-lite con otras limitaciones y requiere cargar WASM. La API avanzada permite integrar varias instancias en un canvas, pero añade control manual y borrado de instancias C++; no es una integración gratuita en complejidad. Se fijaría versión de JS/WASM y se servirían localmente en una eventual prueba. [Web runtime](https://rive.app/docs/runtimes/web/web-js), [API avanzada y cleanup](https://rive.app/docs/runtimes/web/low-level-api-usage).

**Lottie Web:** su repositorio mantenido declara MIT, permite renderer SVG/Canvas/HTML y documenta el flujo Bodymovin/After Effects. No se ha verificado que el equipo disponga de After Effects, ni se autoriza adquirirlo. **Glaxnimate0.6.0** es una alternativa de autoría libre de KDE que anuncia Lottie, SVG animado y export de imágenes; una muestra debe comprobar fidelidad de gradientes, máscaras y recursos de nuestro arte. No se ha instalado ni exportado. [Lottie Web](https://github.com/airbnb/lottie-web), [Glaxnimate y publicación3marzo2026](https://glaxnimate.org/). La página antigua de formatos de Glaxnimate no fue accesible mediante la herramienta y no se usa como evidencia adicional.

**dotLottie:** el repositorio oficial describe núcleo Rust/WASM/ThorVG, empaquetado comprimido y backends distintos. Su `main` puede evolucionar tras una publicación; cualquier prueba deberá usar el tag/paquete exacto elegido y no asumir que todo lo documentado en `main` existe en0.81.0. No se ha probado ninguna exportación ni soporte visual. [Repositorio oficial](https://github.com/LottieFiles/dotlottie-web), [especificación del formato](https://www.dotlottie.io/spec/).

Para los tres: licencia del reproductor, plan del editor, derechos de la ilustración, permiso del archivo descargado y coste del pipeline son verificaciones diferentes. Una animación gratuita de una galería no acredita permiso de franquicia ni garantiza coherencia con Teatro de alquimia.

## 6. Tamaño medido y tamaño desconocido

Medición **solo de archivos existentes en disco**, Node`gzipSync` por defecto, sin nueva compilación. Los chunks del `dist/assets` leído tenían mtime2026-10-16T17:49:54Z. No se asigna ese directorio a un commit inmutable ni se usa como métrica de descarga inicial de una ruta.

| Archivo existente | Bytes sin comprimir | Bytes gzip | Interpretación correcta |
| --- | ---: | ---: | --- |
|`node_modules/gsap/dist/gsap.min.js`|72.927|28.420|Distribución minificada completa del core instalado; no el chunk exacto de la app.|
|`dist/assets/gsap-806FECi5.js`|69.599|27.057|Chunk diferido del build existente; no todo se paga al entrar ni mide tiempo de parseo.|
|`node_modules/pixi.js/dist/pixi.min.mjs`|841.319|238.307|Distribución monolítica, no bundle tree-shaken de ARCANA.|
|`dist/assets/pixi-scenes-2DC9tJjO.js`|249.761|73.207|Una parte del grafo diferido Pixi; hay chunks compartidos adicionales.|
|`dist/assets/index-DvkurfZC.js`|978.494|299.590|Entrada existente con múltiples responsabilidades; no atribuible a Motion ni a animación entera.|

Los pequeños chunks`CanvasRenderer`/`WebGLRenderer`/`WebGPURenderer` de58–59bytes son **reexports**, no motores que pesen59bytes. No sumar solo esos archivos para presentar un runtime insignificante.

Motion mini no está aislado en un chunk que permita atribuirle con rigor el peso marginal. La documentación pública actual anuncia mini3,2kB, mientras otra guía React muestra2,3kB: son cifras de distribución/versiones distintas, **no una medición de nuestro14.2.0**. [API animate actual](https://motion.dev/docs/animate), [guía de tamaño React](https://motion.dev/motion/guide-reduce-bundle-size/). Mediría una entrada equivalente con/sin la función cuando se autorice un ensayo; no multiplicaría el tamaño del archivo reexportado.

Para Rive/Lottie/dotLottie: **bundle efectivo, WASM transferido, arte, parseo, memoria y primera imagen utilizable desconocidos en este proyecto**. El registro informa tamaños desempaquetados de paquetes (Rive Canvas5.648.430bytes, Rive WebGL2 5.866.443, dotLottie7.445.107, Lottie Web25.415.905), pero contienen variantes, fuentes o demos y **no son transferencia runtime**. No justifican elegir el más pequeño ni el más grande.

Comando equivalente reproducible para la parte local, solo lectura:

```sh
node --input-type=module <<'JS'
import {readFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
for (const p of ['node_modules/gsap/dist/gsap.min.js',
                 'node_modules/pixi.js/dist/pixi.min.mjs']) {
  const b=readFileSync(p);
  process.stdout.write(JSON.stringify({path:p,bytes:b.length,gzip:gzipSync(b).length})+'\n');
}
JS
```

## 7. Memoria y arranque: presupuesto que falta comprobar

Estimación aritmética, **no memoria observada**: una textura RGBA8 de2048×2048 ocupa16MiB en un nivel; con cadena completa de mipmaps se aproxima a21,33MiB. Una de4096×4096 parte de64MiB. Esto no incluye copias decodificadas en CPU, buffers, alineación o driver. Un WebP pequeño en disco puede expandirse a esas dimensiones.

Un atlas de12frames256×256 empaquetados en1024×768 suma3MiB RGBA8 antes de mipmaps. Tiene más interés para un efecto breve que doce frames de cuerpo completo512×640, que por área cruda suman15MiB. La compresión de red, el empaquetado y el formato real deben medirse en una muestra, sin llamar a esta cuenta un benchmark.

Una superficie1280×900 aDPR2 tiene17,58MiB por buffer RGBA8; el renderer puede necesitar varios y otros attachments. Aumentar DPR, render targets o canvas simultáneos tiene coste incluso usando CSS/WAAPI. No se atribuye esta cuenta a los IOSurface del incidente: el crash aportado no permite identificar de forma exclusiva al cliente responsable.

Prioridades: resolución acorde con tamaño visible, atlas acotados, reutilización de texturas, movimiento solo mientras comunica algo, filtros delimitados y no recreados cada frame. Las [guías de rendimiento Pixi](https://pixijs.com/8.x/guides/concepts/performance-tips) advierten del coste de gráficos complejos cambiantes, máscaras y filtros; no prueban cuánto ahorraríamos aquí.

La medición futura partirá del **gesto del jugador** e incluirá red, commit, import, decodificación, upload/compilación y primera imagen/acción utilizable. Registrar frío y caliente, p50/p95, frames largos, contadores de contextos/texturas y desmontaje. No precargar en otra pantalla para desplazar una espera y llamarlo mejora. Un demo del fabricante o su FPS no sustituye ese ensayo.

## 8. Condiciones de aceptación para una muestra futura

No ejecutadas en esta auditoría. Antes de aceptar una tecnología o lote:

1. Mismo momento del juego, tamaño y acabado, misma versión de contenido y resultado confirmado; comparar pieza/pose actual frente a muestra con activos equivalentes.
2. Una sola secuencia por vez, sin nuevos controles permanentes. No dos motores escribiendo la misma propiedad; definir quién controla pausa, velocidad, salto y desmontaje.
3. ES/EN y ambos packs desde IDs y textos externos. Canvas decorativo; teclado, foco y toque equivalentes en HTML. El estado se entiende con movimiento desactivado. [Preferencia de movimiento, MDN modificada10junio2026](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).
4. Fallo de arte, import, WASM o contexto conserva acción/resultado/registro; recarga e idioma no vuelven a operar ni a sortear.
5. Comparar arranque completo y uso sostenido, incluyendo memoria y limpieza; conservar la referencia y declarar caché/viewport/renderer. No seleccionar por una cifra comercial de kB.
6. **Protección del Mac:** matrices, WebKit, perfiles y capturas nuevas extensas solo CI Linux. Localmente únicamente el smoke autorizado con preflight, lock y watchdog, sin captura/vídeo. Esta auditoría no abre ni ese smoke.

Resultado propuesto: **adoptar composición y piezas; conservar runtimes existentes; probar un atlas pequeño si aporta una pose/efecto imposible con piezas; descartar por ahora otra dependencia de animación**. Reabrir Rive/Lottie/dotLottie únicamente ante una muestra con mejora de comunicación y producción demostrada que compense su carga, límites de exportación y mantenimiento.
