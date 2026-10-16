# Paquetes de presentación · Diagon Alley / ARCANA

15 octubre2026. La nueva instrucción de Enric elige **Diagon Alley / Harry Potter como presentación principal** y conserva ARCANA como alternativa. Sustituye la restricción visual A29/A50 para este prototipo privado; no restaura el catálogo, las probabilidades ni los regalos históricos I1. La autoridad Fastify/PostgreSQL/Redis y los IDs internos siguen siendo los existentes.

## Cambiar de mundo durante el juego

Desde **Ajustes → Mundo** se selecciona Callejón Diagón o ARCANA. El idioma también se elige exclusivamente en Ajustes. El selector de presentación no recarga la página ni llama a la API: conserva pantalla, partida, selección y operación pendiente.

`active.ts` exporta `selectedContentPackId()`, `setContentPack(id)`, `subscribeContentPack(listener)`, `contentPackOptions`, `getContentPack(id)` y `DEFAULT_CONTENT_PACK_ID`. `activePack` es una referencia viva. El cambio notifica suscriptores y emite `arcana:content-pack-changed`; React debe suscribirse para volver a dibujar. La preferencia se guarda únicamente en `localStorage["arcana.presentation.content-pack.v1"]`. Si el navegador bloquea preferencias, el cambio sigue funcionando durante esa sesión. No se escribe inventario, receipt, run ni saldo local.

Un navegador sin preferencia elige `default.json`: **diagon-alley**. Una preferencia inválida se ignora. Cambiar el default del build no borra la preferencia de quien ya juega.

## Fuentes editables

| Contenido | Fuente |
|---|---|
| Default del build | `src/arcana/presentation/content-packs/default.json` |
| Marca, paleta, región, rivales, coreografías | `<pack>/pack.json` |
| Textos funcionales es/en | `<pack>/messages.json`; nuevas claves comunes tienen fallback ARCANA explícito |
| Treinta nombres/contextos | `<pack>/characters.json`, por ID estable |
| Relatos existentes | `<pack>/narratives.json`; conservar `source/sourceVersion`, sustituir solo `text` |
| Assets lógicos, dimensiones/alfa/pivote/alt | `<pack>/assets.json` |
| Ilustraciones individuales | `<pack>/art/` |
| Selector observable | `content-packs/active.ts` |
| Resolución de arte | `content-packs/art.ts` |

`<pack>` es `src/arcana/presentation/content-packs/arcana` o `…/diagon-alley`. Ambos paquetes se incluyen en el **build dual actual** para permitir un cambio inmediato en Ajustes; la metadata de URL no descarga todos los bitmaps. El shell PWA deja el arte a demanda; la fuente local compilada Cinzel (.ttf) se precachea como recurso público del shell. No acepta fuentes por URL remota, API, query o rutas fuera de assets/. El manifest y los iconos instalables usan el default del build: cambiar la apariencia durante una sesión no reescribe una instalación PWA existente.

`sourcePack` opcional en un asset indica explícitamente una pieza compartida. Por ejemplo, un retrato provisional Diagon puede referenciar `sourcePack: "arcana"` y conservar el archivo original; no se inventa una ruta en el paquete nuevo. `visualAsset()` respeta esa procedencia. Un recurso nuevo propio omite `sourcePack`. El validador comprueba las dimensiones reales en la carpeta indicada.

## Estado del contenido Diagon

Los treinta IDs se proyectan a nombres/contextos Harry Potter bilingües. `apprentice` se ve como Harry Potter; `merlin`, como Albus Dumbledore. El snapshot antiguo conserva exactamente sus etiquetas originales. Región `pasaje` se ve como Callejón Diagón; el desbloqueo futuro se muestra como Bosque Prohibido, **sin prometer una segunda ruta jugable**.

Sapos se presentan como Ranas de Chocolate; Grageas del Azar, como Grageas de Todos los Sabores; Coronas, como Galeones. Son etiquetas de los recursos actuales, con los mismos IDs, importes, rarezas y cuatro sabores implementados. No hay conversión monetaria ni nuevo producto. Descubrir sabores procede del combate confirmado existente, sin apertura independiente de grageas o concesiones nuevas.

Los treinta personajes Diagon usan una familia **vectorial provisional propia** con rasgos reconocibles; sus noventa roles retrato/miniatura/figura usan exportaciones WebP de treinta originales SVG conservados. No son treinta maestros pintados finales ni fotografías de actores. Los objetos, rivales y escenas que todavía indiquen `sourcePack: "arcana"` son **arte provisional compartido**, pendiente de sustitución temática cuando corresponda. El lote nuevo, las piezas reutilizadas y sus fuentes se distinguen en `design/diagon-alley/manifest.json` y en el informe de entrega. No se importan assets I1 o archivos de videojuegos comerciales.

## Validar, preparar y activar

```sh
npm run validate:skin
node tools/arcana/validate-content-pack.mjs arcana --complete
node tools/arcana/validate-content-pack.mjs diagon-alley --complete
node tools/arcana/activate-content-pack.mjs diagon-alley
npm run build
npm run verify:arcana:build
```

Activación modifica solo `default.json`, después de validar el paquete. No cambia preferencias runtime existentes. `copy-content-pack.mjs nombre` sigue sirviendo como scaffolding: no sobrescribe carpetas y copia el default actual. Antes de activar un tercer paquete hay que registrarlo expresamente en `active.ts`, en los IDs aceptados por el activador y en la política de build; no se importan carpetas arbitrarias.

El validador revisa claves es/en, parámetros, treinta IDs, ausencia de autoridad, archivos/dimensiones/alfa/pivotes y duraciones acotadas. No certifica acabado artístico o permisos. Los textos de Diagon se combinan con mensajes comunes ARCANA para no dejar claves nuevas sin localización; las etiquetas temáticas principales tienen traducción propia.

## Política de artefacto

`verify-build.mjs` usa el default del build o `--pack diagon-alley`. El modo Diagon permite el contenido de franquicia autorizado para el prototipo privado y sigue rechazando firmas históricas I1: almacenamiento/export `magic-i1`, catálogo C01/O01/S01/R01 y viejos archivos de arte. Mantener `publicDir: false` y la entrada de `src/arcana` evita incluir el producto histórico.

La política estricta anterior se conserva con:

```sh
node tools/arcana/verify-build.mjs --pack arcana
```

**Ese comando rechaza el build dual actual**, porque incluye el paquete Diagon autorizado. No afirmar que seleccionar ARCANA en Ajustes o cambiar `default.json` produce un artefacto distribuible exclusivamente ARCANA: aislar imports/arte al compilar es una tarea distinta, todavía no implementada. No publicar el build dual bajo la garantía antigua «sin materiales Harry Potter».

## Invariantes al sustituir arte

| Presentación sustituible | Autoridad conservada |
|---|---|
| Marca, nombres, relatos, región visible | IDs, propietarios, snapshots, rutas y desbloqueos |
| Retratos, escenas, envases, iconos | Catálogo de treinta, cuatro rarezas y estrellas guardadas |
| Grageas, varitas, escobas, llaves | Cuatro sabores/efectos, nueve recetas, selección/consumo |
| Paleta, encuadre, tiempos/partículas | Precios, pesos, saldos, energía, seed/daño/progreso |
| Resultado renderizado/animado | Transacción, receipt, idempotencia y recuperación |

Identidades desconocidas usan el texto guardado. Relatos se sustituyen solo si coinciden texto y versión fuente; un relato histórico desconocido permanece legible. El servidor nunca recibe un nombre de pack para calcular premios o combate. Abrir, omitir, cambiar idioma/mundo o recargar tras commit conserva el resultado.

Los recursos nuevos deben registrar fuentes, herramienta, permiso, dimensiones, recorte y pivote. Texto funcional fuera del bitmap; foco/teclado, nombres accesibles, costes explícitos y movimiento reducido siguen siendo requisitos. No generación runtime, APIs con créditos, motor nuevo, cambios económicos o publicación.

## Evidencia actual

`content-pack-swap.test.ts` cubre validación de ambos paquetes, treinta IDs, etiquetas bilingües, invariancia de snapshots/config, fallback desconocido, escritura exclusiva de preferencia, suscriptores y almacenamiento bloqueado. `build-content-policy.test.ts` comprueba políticas Diagon/ARCANA y rechazo I1; `pwa-build.test.ts` valida manifest del default, iconos y caché pública a demanda. Estas pruebas no equivalen a una sesión humana ni a comprobar con servidor real cada superficie del nuevo paquete; el informe general registra las pruebas integradas.

## Evidencia histórica A50

### Sustitución neutra comprobada el14octubre

En una copia aislada `.tools/arcana-theme-qa` con la misma arquitectura real Fastify/PostgreSQL/Redis local se hizo compra/apertura, después se cambió a `qa-theme`: marca ATELIER QA, nombres de los treinta en es/en, color y retrato del aprendiz sustituido por otro archivo existente. Se activó/validó/compiló el paquete, se recargó la misma sesión y se comparó **todo el estado JSON del servidor**: idéntico. Dos copias, 40 Coronas y los mismos IDs de receipts. UI/título/imagen cambiaron y ambos idiomas resolvieron los nombres nuevos.

Evidencia: [theme-after.txt](visual-production-2026-10-14/theme-after.txt), [validación](visual-production-2026-10-14/theme-validation.txt), [build](visual-production-2026-10-14/theme-build.txt), capturas `theme-before.png`, `theme-after-es.png`, `theme-after-en.png`. Es una sustitución de presentación de ensayo; no demuestra que cualquier paquete arbitrario sea válido ni una integración de materiales Harry Potter. Las demás superficies usan los mismos resolutores/contrato, revisados en código y recorridos ARCANA; no se afirma haber jugado hasta el jefe en la temática neutra.

