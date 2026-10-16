# Producción visual local sin servicios de pago

9 octubre 2026 · A21/A22 · PRD v0.18. Investigación, instalación y muestras de producción verificadas. La aplicación sigue sin implementar.

## Decisión y coste

Enric autoriza analizar, elegir e instalar herramientas para sacar recursos, con coste cero y alcance exclusivo del proyecto; también skills/MCP si se necesitan. Se elige **Blender 4.5.9 LTS portable + API Python nativa + render/encoder local**, y una skill propia del repositorio. La elección está dentro de esa delegación y se limita a autoría/exportación de arte; no selecciona stack de aplicación, proveedor de cuentas, pesos ni reemplaza A11/A12.

El flujo ejecutado no llama servicios de generación, no compra créditos ni utiliza una prueba de pago. Instalación, geometría, animación, PNG, GLB y MP4 tienen **0 € de gasto adicional de herramientas/servicios**. Se utilizan el ordenador, la electricidad y la sesión de Codex ya existentes; el tiempo y cómputo local siguen siendo recursos necesarios. No se garantiza un coste total de negocio nulo por elegir software libre.

Blender es software libre GPL, descargable y utilizable sin suscripción. La licencia del software no acredita permiso sobre Harry Potter. [Licencia oficial](https://www.blender.org/about/license/). La página respondió por descarga directa cuando el lector web falló; no se usó una fuente secundaria.

## Alternativas evaluadas

| Alternativa | Encaje con la restricción | Resultado |
| --- | --- | --- |
| Blender local | Modelado, articulación, materiales, cámara, render y vídeo sin API o exportación de pago; fuente editable y ejecución automatizable | Elegida e instalada; pruebas abajo |
| Spline | Ofrece editor gratuito, pero exportaciones/web sin marca/vídeo y descarga/self-hosted tienen restricciones de plan. No asegura el flujo independiente gratuito que necesitamos | No instalado. La recomendación anterior era anterior a conocer el límite de coste. [Precios](https://spline.design/pricing), [self-hosted](https://docs.spline.design/exporting-your-scene/web/exporting-as-self-hosted-project) |
| Runway/Higgsfield u otro vídeo generativo en nube | Acceso y créditos gratuitos finitos no acreditan producción reproducible sin gasto; cuenta/conexión no verificadas | No instalados ni usados; no basar la producción en créditos o trials |
| Rive/PixiJS | Pueden ser útiles para animación/integración 2D, pero no resuelven por sí solos las fuentes, geometría y clips del paseo | No añadidos ahora; evaluar una necesidad concreta después, sin comprometer una ruta de exportación pagada |
| IA generativa local | Puede evitar facturación por petición, pero exige modelo/licencia/descarga y verificar memoria/tiempo/calidad en este Mac | No instalada ni prometida como solución inmediata. Blender ya permite producir fuentes y clips sin esa dependencia |

La restricción de gasto se aplica también a futuras iteraciones: no ejecutar una API porque parezca incluida, ni instalar un servicio que requiera luego pagar para obtener la entrega. Los assets de imagegen preparados antes se conservan como referencias; en esta instalación no hubo nuevas llamadas de generación.

## Instalación por proyecto

- App: `.tools/blender/Blender.app`, 797 MB observados. No se copió a `/Applications` ni a `~/Applications`.
- Preferencias, scripts, datos y extensiones: `.tools/blender-user/`; temporales `.tools/tmp/`.
- Paquete descargado desde el distribuidor oficial, con SHA-256 publicado verificado **antes de montar o ejecutar**, y firma `codesign --verify --deep --strict`. No se desactivó protección de macOS.
- Versión fijada 4.5.9 LTS, build `8bf95cbd38d1`. No se afirma que sea el parche más nuevo. Arquitectura instalada: macOS arm64; host observado macOS 27.0.1.
- URL/checksum y alcance en [blender.lock.json](../../tools/visual/blender.lock.json); recibo local no versionado `.tools/blender/installation.json`.
- Runtime y cachés excluidos por `.gitignore`; scripts, lock, skill y fuentes de las muestras quedan disponibles para versionar. No hubo push.

Comandos:

```sh
python3 tools/visual/install_blender.py
tools/visual/blender.sh --version
tools/visual/blender.sh --background --factory-startup --python tools/visual/create_scene_sample.py -- --output design/production/m2-v1
tools/visual/blender.sh --background --factory-startup --python tools/visual/render_preview.py
tools/visual/blender.sh --background --factory-startup --python tools/visual/create_reveal_sample.py
tools/visual/blender.sh --background --factory-startup --python tools/visual/render_preview.py -- --source design/production/reveal-v1/reveal-m2.blend --output design/production/reveal-v1/reveal-preview.mp4
```

Siempre usar [blender.sh](../../tools/visual/blender.sh), que establece rutas propias antes de arrancar. Se verificó con `bpy.utils.user_resource()` y `bpy.app.tempdir`: config/scripts/temp apuntan al checkout. El instalador no modifica configuración global de Codex ni MCP.

## Skill y automatización

Skill propia: [local-magic-art/SKILL.md](../../.agents/skills/local-magic-art/SKILL.md). Puede leerse/invocarse por su ruta dentro de este proyecto y queda referenciada en AGENTS.md; no se instaló en el catálogo global. La detección automática por el cliente se revisará en el siguiente turno, sin fingir que ya figura en el catálogo de skills cargadas.

No se necesita un MCP extra para este pipeline: `bpy` ofrece las operaciones mediante CLI local y scripts reproducibles. No se instala un servidor remoto/addon de ejecución genérica para duplicar esa frontera. La skill describe ese acceso y sus límites; no es un MCP ni un modelo generativo.

El validador oficial de skill requería PyYAML, ausente tanto en Python del host como en el runtime disponible. Se creó `.tools/skill-validation/` con PyYAML 6.0.3 únicamente para validar. Resultado del `quick_validate.py`: **Skill is valid!**. Esa dependencia no forma parte del render ni de una aplicación.

## Recursos realmente producidos

| Muestra | Fuentes y exports | Qué demuestra y qué falta |
| --- | --- | --- |
| Tramo Callejón/Weasley | [Fuente .blend](../../design/production/m2-v1/callejon-m2.blend), [GLB](../../design/production/m2-v1/callejon-m2.glb), [entrada](../../design/production/m2-v1/entry.png), [punto medio](../../design/production/m2-v1/middle.png), [fachada](../../design/production/m2-v1/weasley.png), [vídeo](../../design/production/m2-v1/walkthrough-preview.mp4), [manifest](../../design/production/m2-v1/manifest.json) | Cámara de perspectiva se mueve realmente entre geometría; lechuza/paseante tienen pivotes articulados y keyframes, luz y motas. Formas de bloqueo, no acabado A12; caminar necesita refinamiento/contacto y no hay cámara controlada por usuario |
| Revelación | [Fuente .blend](../../design/production/reveal-v1/reveal-m2.blend), [momento mágico](../../design/production/reveal-v1/magic.png), [resultado de muestra](../../design/production/reveal-v1/sample-result.png), [vídeo](../../design/production/reveal-v1/reveal-preview.mp4), [manifest](../../design/production/reveal-v1/manifest.json) | Base hueca/tapa/interior separados, bisagra real, rana con patas articuladas, salto, motas y cromo en blanco. No sorteo, identidad, rango ni premio; arte/anatomía finales e integración pendientes |

Son **muestras técnicas provisionales** para demostrar la fabricación de recursos, no una propuesta de rebajar el acabado ilustrado aprobado. No se entregan como estilo final ni prueba de atractivo. El primer render de revelación mostró motas sobredimensionadas; la revisión visual lo detectó, se corrigió el escalado y se regeneraron PNG y MP4.

Las fuentes son geometría/materiales procedurales escritos para esta prueba; no se descargaron modelos de terceros, retratos de actores, tipografías o música. Articulación mediante objetos padre/pivotes; **no hay armature esquelético**. Ningún texto funcional está pintado en los renders. Etiquetas/control es/en corresponden a la futura presentación DOM, no al MP4. Manifests separan recurso existente de final pendiente y limitan usos/permisos.

## Verificación y límites

- Instalación oficial y firma comprobadas; rutas locales observadas. `Blender 4.5.9 LTS` ejecutado en background sin UI o servicio remoto.
- Render de entrada/medio/fachada, y cerrado/salto/resultado. Inspección visual de muestras detectó y corrigió el tamaño de partículas.
- Callejón: 1604 objetos, GLB de aproximadamente 2,5 MB y `.blend` de 10 MB. Vídeo local de 72 frames / 12 fps = 6 s, 480×300; tiempo de render observado 12,42 s, PNG de revisión 960×600. No es una medición de fps de navegador o rendimiento en móvil.
- Revelación: 48 frames / 12 fps = 4 s, 480×300. La ficha de exportación junto al MP4 conserva su tiempo real; no usar el tiempo del primer vídeo incorrecto.
- Comprobadas estructura GLB (37 animaciones y una cámara), streams/duración y decodificación de los vídeos (72/72 y 48/48 frames distintos); recibos/hashes en `design/production/verification.json`. Ninguna comprobación es una prueba de cuenta, premio, persistencia, omisión/accesibilidad integrada o interés real.
- Skill validada; scripts, enlaces, git diff y Word histórico comprobados. Build/tests de aplicación inexistentes, no declarados.

## Continuación viable

La instalación ya permite editar la escena, sustituir bloques por recursos refinados y elevar calidad/fps para la muestra. Próximo trabajo de arte: fachada teatral Weasley con personalidad, calle consistente en móvil, lechuza y paseante anatómicos, luz/materiales detallados y coreografía de rana pulida. Producir una muestra representativa con A12 antes de ampliar el lote.

Para aplicación, se podrán integrar renders o GLB con un motor web gratuito cuando corresponda elegir stack. Un vídeo es un recorrido grabado; no permite elegir libremente posiciones o tiendas. La fuente geométrica sí permite preparar esa integración después. No se implementaron registro, backend, inventario, premios o segunda tienda; A19/I1 siguen por ajustar.
