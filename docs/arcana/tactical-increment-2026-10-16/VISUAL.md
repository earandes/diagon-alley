# A65 · Pactos y amenazas

## Dirección e interacción implementadas

Se conserva Teatro de alquimia, Cinzel y los retratos ilustrados activos de ambos packs. No hay producción nueva de personajes o fondos. La dirección se extiende con dos grabados vectoriales originales: llama sobre escudo y creciente con punta de iniciativa. Se conservan color, contorno y nombre como indicadores redundantes; no se deduce una habilidad del aspecto del personaje.

El Pacto de dos candidatos es una pareja de retratos de igual importancia. Cada candidato lleva nombre, afinidad, reloj temporal y progreso de su afinidad actual → propuesta / umbral. El progreso procede de `synergyProgress` compartido con `activeSynergies`; caídos y neutrales conservan el tratamiento del motor. Una marca indica cuándo la propuesta ya activa esa sinergia. Los atributos completos se consultan mediante un inspector nativo por candidato, equivalente para teclado y toque.

Seleccionar un retrato solo modifica el borrador. El sello, el marco y `aria-pressed` identifican la selección; la incorporación usa la confirmación exterior. Pasar también es un borrador y conserva el mínimo actual de tres integrantes. Con cinco integrantes se exige elegir un temporal sustituible; las copias propias no aparecen como objetivos de sustitución. Sin temporales sustituibles, los candidatos quedan deshabilitados y se explica cómo volver a formación. No se genera una comparación de sustitución antes de elegir el miembro saliente.

Las expediciones históricas sin `recruits` conservan su Pacto único y las acciones A60. Ningún render o consulta ejecuta la resolución.

El mapa añade un emblema de amenaza de 28×28 px en el borde inferior del medallón de duelo. Nombre y amenaza se conservan en el nombre accesible y el título. La lista equivalente mantiene el mismo emblema y acciones. La confirmación muestra el emblema con nombre y una explicación desplegable. Fuego describe la quemadura de su sinergia real; Vanguardia describe la iniciativa de su composición, sin atribuirle Sombras. Los rivales conservan PV y poder compactos; nombre, afinidad, PV/PM y velocidad quedan disponibles en un inspector.

## Assets

Inventario editable y procedencia en `src/arcana/presentation/art/tactical-a65/manifest.json`. Dos SVG 64×64 con transparencia, encuadre contain y pivote central. Fuente y archivo final son el mismo vector. Dibujo propio con paleta existente; sin imágenes externas, IA con créditos, dependencias o configuración global. El nombre localizado permanece en DOM si la imagen falla. Los dos packs comparten reglas y estos símbolos, sin modificar su arte de personaje o escenario.

## Movimiento

- Selección/hover del retrato: elevación máxima de 2 px y transición de borde de 160 ms, `cubic-bezier(.16,1,.3,1)`. Solo ratón con hover; la selección es inmediata y no bloquea entrada.
- Confirmación/reclutamiento: conserva la entrega del servidor y el retorno actuales; no se añade espera ni una animación que conceda unidades.
- Amenazas y progreso: estáticos, sin bucles, partículas, flashes o audio.
- Reducido: `prefers-reduced-motion` y `.game-shell[data-reduced='true']` quitan transiciones y desplazamiento. Sello, texto y semántica permanecen.

## Verificación y límites

`node-pact-presentation-a65.test.ts` comprueba ambos idiomas, dos candidatos, ausencia de resolución al render, progresión de Alquimia 2→3 con el valor compartido, sustitución temporal y equipo completo propio. Se conservan las pruebas legacy A60. `synergies.test.ts` comprueba umbrales, caídos, inmutabilidad y correspondencia con las sinergias del motor.

Comando focal ejecutado: `npx --no-install vitest run tests/domain/arcana/node-pact-presentation-a60.test.ts tests/domain/arcana/node-pact-presentation-a65.test.ts tests/domain/arcana/synergies.test.ts tests/domain/arcana/combat-engine.test.ts`: **27/27**. Detector Impeccable sobre los tres archivos de presentación: `[]` (sin hallazgos mecánicos; no equivale a validación visual o accesibilidad certificada).

`evidence/pact-visual.mjs` crea contextos Chromium nuevos por pack, juega el inicio real y comprueba que selección, idioma y cancelación no alteran el estado autoritativo. Acepta `A65_UI_URL` para ejecutarse sobre el build final. La primera ejecución correcta produjo diez capturas y seis geometrías sin scroll del diálogo en 1280×900, 390×844 y 865×1079. Esas capturas son **intermedias, anteriores al indicador de progreso por candidato y al ajuste de emblema en mapa**. La evidencia final del incremento debe proceder de la revisión compilada posterior. Una interrupción previa coincidió con HMR de otro archivo y se repitió correctamente; no se atribuye a la versión compilada.

Inspección visual de las capturas intermedias: ambos retratos legibles a 390 px; confirmación dentro del diálogo; se corrigió el desplazamiento de los inspectores causado por una línea visible de selección y se retiró el marco rectangular heredado de sus resúmenes. Los atributos ampliados pueden desplazar el diálogo de forma accesible. Esta revisión no mide comprensión humana, dispositivo físico o diversión.
