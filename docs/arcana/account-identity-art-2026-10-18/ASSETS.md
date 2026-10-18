# A81 · Recursos y mantenimiento

## Diseño de la familia

Un emblema del juego y dos objetos de acceso, no tres marcas independientes. El umbral relaciona Callejón/expedición y el cromo relaciona colección. Pluma/folio expresa inscripción; llave plateada/credencial expresa retorno a lo conservado. Esta última se diferencia del recurso dorado de la bóveda en forma, material y contexto. Es interpretación experta; la asociación real debe observarse sin explicar la solución.

Se mantienen las proporciones, tintas, contornos y gradientes materiales del kit vectorial de props vigente. No se sustituyen retratos o fondos pintados por iconografía geométrica. Verificar continúa usando el sobre A80, con la misma función de correspondencia. No texto funcional en las imágenes, ni logotipo/escudo/tipografía oficial copiados.

## Inventario

| ID estable | Función/consumidor | Archivos por paquete | Dimensiones/pivote |
| --- | --- | --- | --- |
| brand.emblem | App/bienvenida junto al nombre; AccountAccess/gestión | art/account/emblem.svg |512×512;0,5/0,5|
| account.register | Botón Crear cuenta y cubierta de registro | art/account/register.svg |512×512;0,5/0,5|
| account.login | Botón Iniciar sesión y cubierta de acceso | art/account/sign-in.svg |512×512;0,5/0,5|

Dos acabados por diseño: `diagon-alley` ciruela/oro y `arcana` verde/oro. Composición/silueta y significado se mantienen. Transparencia real del SVG; `object-fit:contain`; no deformaciones, rig, spritesheet o animaciones. Los detalles finos se subordinan a la silueta a44/36px; a168px puede verse grabado/folio. La lectura debe juzgarse en contexto, no solo a512px.

Fuentes editables y registro: `design/production/account-symbols-v1/<pack>/*.svg` y `manifest.json`. Generador reproducible: `tools/visual/account-symbols.py`. Copias runtime: `src/arcana/presentation/content-packs/<pack>/art/account/*.svg`. El manifest registra autoría Codex, procedencia local, SHA256, bytes, referencias de material, permiso privado, versiones y consumidor. Las pruebas verifican igualdad de export/fuente, ausencia de scripts/arte externo/texto embebido y límites de peso.

## Regeneración

`python3 tools/visual/account-symbols.py` utiliza únicamente stdlib, no red, Blender o configuración global. Regenera estos seis archivos y sus entradas nuevas en assets.json conservando las demás. No cambia por sí solo versiones de pack, campañas o datos. Para una revisión aceptada posterior: nueva fuente/manifest versionado, comprobar los consumidores y registrar el incremento de versión de presentación explícitamente. No sobrescribir evidencia de una revisión anterior aceptada.

Versiones de presentación activas tras integración: Diagon4 y ARCANA6. No cambia versión de campaña, contenido autoritativo o derechos de primera victoria. Los dos paquetes comparten IDs; cambiar idioma/paquete no crea otra cuenta o premio.

## Coste y fallback

15.066 bytes SVG sumados entre seis exports; cada paquete requiere7.533 bytes sin comprimir si se solicitan los tres símbolos. La bienvenida los solicita y las cartas reutilizan sus URLs; no se genera arte durante una interacción. Estas cifras son tamaños de archivo, no tiempos de descarga, memoria GPU o benchmarks. No dependencias nuevas, servicios, créditos o fuentes externas.

Los recursos son decorativos junto a texto y no están incluidos en el nombre accesible. Si fallan, Artwork los retira: botones, título, labels, foco y recorrido siguen funcionando. No se muestra una recompensa/estado por dibujar un sello. Los permisos de distribución de la temática siguen sin resolverse; no se presenta el emblema como marca oficial ni aprobación final de branding. No se han cambiado favicon, manifiesto PWA, menús del mapa o pantallas de combate.
