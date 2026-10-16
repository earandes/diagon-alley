# Personajes pintados · producción local v2

Incremento del 15 octubre 2026. El objetivo es sustituir la familia vectorial provisional por ilustraciones con volumen, materiales y rostros diferenciados coherentes con el Callejón. Familia integrada en el paquete Diagonv2:30personajes/90WebP,2.461.924bytes; revisión de exports y pruebas del juego documentadas en el [informe A58](../../../docs/arcana/illustrated-assets-2026-10-15/REPORT.md). La aprobación estética del propietario no se atribuye a la revisión técnica.

## Fuentes oficiales y coste

- [MFLUX](https://github.com/mflux-community/mflux), paquete PyPI `0.22.0`, licencia MIT. Implementación nativa MLX; la [documentación FLUX.2](https://github.com/mflux-community/mflux/blob/main/src/mflux/models/flux2/README.md) permite FLUX.2 klein4B y edición con referencias.
- [Modelo MLX 4bit](https://huggingface.co/mlx-community/flux2-klein-4b-4bit), revisión fija `860e87183ceb29e39627c0612ebd66d8ea66e68c`, 4.619.708.452 bytes en el árbol oficial, licencia Apache2.0 del modelo base [FLUX.2 klein4B](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B). Convertido por la comunidad MLX, no un servicio de inferencia.
- [rembg](https://github.com/danielgatis/rembg) para segmentación local CPU, cuando haga falta separar figura sin tocar el maestro pintado. No se usan sus proveedores cloud.

Licencias, README oficiales, versión, revisión, hashes de distribución PyPI e integridad de los pesos se conservan en `evidence/`. El software/modelo tienen sus licencias; no se atribuye a ellas permiso de distribución de Harry Potter. Uso privado sin publicación.

Coste adicional **0**: ni inferencia hospedada, ni créditos, ni suscripciones, ni cuentas/login. La descarga pública contiene únicamente paquetes y pesos; no se envían imágenes del proyecto a un servidor. La inferencia funciona offline con pesos locales. La electricidad, recursos del equipo y tiempo de producción siguen siendo recursos reales.

## Aislamiento y reproducción

Todo el entorno se instala dentro de `.tools/diagon-illustration/`: venv, pesos, cachés Hugging Face/Pip, Matplotlib, temporales y modelos de segmentación. Nada se instala globalmente. El instalador usa `token=False`; el wrapper desactiva token implícito y telemetría, fuerza Hugging Face/Transformers offline y no incorpora credenciales.

```sh
/opt/homebrew/bin/python3.13 tools/visual/diagon-mlx-install.py --download-model
tools/visual/diagon-mlx.sh tools/visual/diagon-mlx-generate.py --gpu-coordination-confirmed
```

La confirmación del argumento GPU corresponde a coordinación técnica entre agentes para no contaminar las mediciones de juego; no solicita permiso comercial al usuario. Descargar/instalar no dispara inferencia ni Metal. El comando de generación se ejecuta solo tras liberar el coordinador la GPU.

`samples-plan.json` y `prompts/` conservan los prompts exactos, seeds y dimensiones. La API nativa permite cargar un único modelo y generar las tres imágenes secuencialmente, con metadatos por maestro. `python-requirements.lock.txt` fija todo el entorno utilizado. Pesos y venv quedan fuera de Git bajo `.tools/`; únicamente scripts, metadatos y arte entregable se versionan.

## Dirección de las tres muestras

Referencias inspeccionadas: los fondos activos `art/scene/diagon-alley.webp` y `art/scene/sweetshop.webp`. Luz ámbar de ventana, sombras índigo, papeles cálidos, tejidos y detalles pequeños del cuento ilustrado. Gouache editorial con veladuras pintadas y volumen; no un filtro aplicado sobre el SVG anterior.

Harry es adolescente con cara estrecha juvenil, gafas/cicatriz; Hermione tiene rostro oval, melena y expresión propios; Dumbledore es claramente anciano con nariz/barba/sombrero distintos. Bustos de tres cuartos a 768×1024 sin rótulo, borde ni texto funcional. No fotografías de actores o fotogramas; el prompt solicita interpretaciones de libro.

El maestro pintado se preserva. El retrato toma un encuadre adecuado sin estirar; la miniatura recorta el rostro para legibilidad; la figura elimina el fondo con una máscara guardada y revisada. Las máscaras se inspeccionan por pelo, barba y borde de ropa, y su opacidad se verifica antes de integrar. No se llama rig a una imagen recortada ni se multiplica el lote de treinta hasta revisar las muestras en contexto.

## Selección y archivos efectivos

La dirección y las tres muestras en contexto fueron aceptadas por el integrador antes del lote de27, dentro de la delegación del propietario. Las cuatro correcciones seleccionadas se registran por **ruta efectiva y SHA256** en `selected-attempts.json`; la tabla de intentos completos/rechazados está en `evidence/attempts-selection.json`.

Se corrigió un error del wrapper durante los reintentos: MFLUX no sobrescribe por defecto y añade `_1`, `_2` al nombre. Se estaban reabriendo los nombres originales. Los PNG reales y sus sidecars nativos se conservaron, se inspeccionaron y se eligieron explícitamente; los informes de retry se repararon contra sus rutas/hashes. `superseded-output-tracking.json` conserva el reporte anterior marcado como inválido. Los generadores ahora usan nombres explícitos con seed y rechazan destinos preexistentes; nunca dependen del sufijo silencioso.

El original no se sustituye. El exportador verifica el hash seleccionado antes de crear el maestro derivado y las máscaras; las cuatro variantes aceptadas son:

- Tonks: `samples/storm-caller_2.png`, repintado condicionado con técnica de la familia.
- Hagrid: `samples/night-forger_1.png`, silueta ancha, pelo y barba largos de semigigante.
- Moody: `samples/root-speaker_2.png`, un ojo normal y uno mecánico en cuenca correcta, sin lente en frente.
- Voldemort: `samples/veil-walker_1.png`, rostro serpentino con ranuras nasales y ojos rojos.

No se hicieron más generaciones al localizar las variantes válidas. La última edición de Voldemort se interrumpió de forma deliberada, sin usar un resultado parcial. Los aliases de referencia denominados `rejected/*-second.png` conservan el primer PNG que realmente recibió la edición, por el error de ruta anterior; sus hashes y referencias nativas permiten identificarlo sin atribuir otra imagen como entrada.

La cicatriz de Harry es un retoque pequeño y editable, autorizado por el integrador, en `retouches/apprentice-scar.svg`; el original generado permanece intacto. Los bordes/firma sintética de Hermione y el mínimo borde blanco de Bellatrix se excluyen con crops registrados. Todos los role exports mantienen proporción: retrato anclado arriba, figura con contain/padding transparente para no cortar sombrero/coronilla, miniatura con crop facial específico. El modelo no creó una mano animada ni un rig.

## Exportación y validación sin inferencia

Con el entorno local ya instalado, estos comandos trabajan solo sobre los maestros existentes y no generan nuevas imágenes:

```sh
tools/visual/diagon-mlx.sh tools/visual/diagon-mlx-export.py --ids apprentice circe merlin
tools/visual/diagon-mlx.sh tools/visual/diagon-mlx-validate.py
python3 tools/visual/install-illustrated-pack.py --check
```

El exportador del ejemplo rehace solo las tres muestras; `--ids` acepta las identidades de `production-plan.json` para repetir el resto. Conserva los demás registros del índice. El validador comprueba toda la familia. El último comando verifica la familia completa sin tocar runtime. Quitar `--check` instala los90exports y alias de rivales; no ejecuta una apertura ni escribe partidas. `runtime-manifest.json` enlaza cada archivo servido con su fuente y hash. [Hojas finales de retratos](final-portraits.jpg), [figuras](final-figures.jpg) y [miniaturas](final-thumbnails.jpg).

## Estado y límites

Las observaciones de calidad se registran por recurso en `art-review.json`. Los archivos anteriores A57 se conservan y el swap de presentación conserva IDs, snapshots y partidas. Ningún script de este pipeline cambia economía, inventario o autoridad. La producción de assets no constituye por sí sola un recorrido jugable probado, observación de interés/retención o una verificación de móvil físico; esas comprobaciones son del integrador.
