# ARCANA · Teatro de alquimia · fuentes de producción

Dirección 1 elegida por Enric el 14 octubre de 2026 (A50). Integración local A49; no es una publicación en Sites ni aceptación de hardware físico.

- [MANIFEST.json](MANIFEST.json): 133 recursos activos, identidad/uso, ruta, dimensiones, alpha, pivote y alt es/en. Cada entrada enlaza su fuente y manifest de procedencia.
- [exports.json](exports.json): 125 exports raster con hashes de fuente/export, bytes y recorte reproducible. Los ocho SVG auténticos proceden de Phosphor, con MIT y fuentes en [icons](icons/).
- `characters/<id>/`: treinta retratos/figuras individuales. Maestro original, versión corregida cuando procede, maestro con margen de arena, prompts y `manifest.json`. Retrato y miniatura derivan del mismo sujeto; ninguna lámina pequeña sustituye los maestros.
- `rivals/<appearance>/`: tres rivales y jefe. Apariencias de posiciones de los combatientes existentes, sin nuevas identidades/reglas.
- `scenes/<scene>/`: seis originales 1536×1024, estáticos, sin texto o controles. No son pintura por capas; los objetos que se mueven son archivos independientes.
- `products/<id>/`: 23 originales individuales. Caja cerrada, base/interior, tapa, sello y sapo; tarro/cuatro sabores; dorso/marco; tres maderas/tres núcleos/tres escobas/llave/cofre.

**Disponible para editar o sustituir:** PNG raster originales, revisiones conservadas, prompts/referencias, exports WebP/PNG, SVG de librería, manifests y código de preparación/coreografía. No hay PSD, capas de pintura, rig, modelo 3D ni secuencia de fotogramas articulada. La base y el interior del envase son un único raster; los nueve tipos de varita son composición de madera y núcleo, no nueve ilustraciones aplanadas.

El marco tiene ventana alpha real; el dorso es opaco. Personajes/objetos tienen alpha real, verificado en manifests individuales. Se conservan límites conocidos: pequeñas diferencias de cámara entre tapa/base, margen de algunos originales y franja de alpha muy bajo del marco. Exports y encuadres revisados en el juego y en hojas de QA; ningún recorte destruye el original.

Preparación determinista, sin generación en runtime:

```sh
node tools/arcana/prepare-art.mjs /ruta/al/modulo/sharp/dist/index.mjs
node tools/arcana/prepare-icons.mjs
npm run validate:skin
npm run build
```

En este entorno se usó Sharp del runtime local incluido, sin añadir dependencia ni facturación. `prepare-art.mjs` conserva originales y elimina únicamente exports huérfanos de su carpeta de arte. Reproducir exports no equivale a aprobar visualmente una ilustración nueva: inspeccionar alpha, encuadre, tamaño y montaje después de prepararla.

[Cómo sustituir la temática sin alterar progreso](../../../docs/arcana/CONTENT-PACKS.md). [QA y límites actuales](../../../docs/arcana/visual-production-2026-10-14/REPORT.md). Las planchas en `capturas/` son inspección del lote, no assets de aplicación.
