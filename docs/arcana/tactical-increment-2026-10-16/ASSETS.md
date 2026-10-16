# A65 · Assets activos y procedencia

Se probó la composición con retratos/piezas existentes antes de producir dos emblemas. No personajes, escenarios o apertura nuevos. Direcciones Harry Potter y ARCANA conservan sus pinturas y roles; los símbolos de reglas se comparten explícitamente.

| ID | Función / consumidor | Fuente editable y export | Dimensiones / variantes | Procedencia y aceptación |
|---|---|---|---|---|
| threat.fire | Anticipar FuegoII en MapPanel y NodePreparation mediante TacticalBadge | src/arcana/presentation/art/tactical-a65/threat-fire.svg |64×64 alpha,28px compacto/40px con nombre | SVG propio original; llama/escudo puntiagudo distinguen silueta; nombre localizado no depende del color |
| threat.vanguard | Anticipar iniciativa en mismos consumidores | src/arcana/presentation/art/tactical-a65/threat-vanguard.svg |64×64 alpha,28px/40px | SVG propio original; media luna/perfil angular, equivalente textual |
| Retratos actuales | Alternativas y miembros propios/temporales | content-packs/* según manifest vigente | Retrato existente, contain, sin estirar | Familia A58 conservada; no se declaran nuevas pinturas definitivas |
| ui.temporary / ui.seal | Origen de acompañante / selección provisional | bindings de paquetes actuales |30/34px dentro marco | Assets existentes, estado no implica propiedad o recompensa |
| beans.jar / node.refuge | Intención probar gragea / otra sinergia | bindings de paquetes actuales |56–64px selector,32px recordatorio | Solo cuando el estado permite intentarlo; detalle localizado separado |

Manifest completo de los dos recursos originales: `src/arcana/presentation/art/tactical-a65/manifest.json`. Fuente SVG es editable y export servido por Vite; ninguna imagen raster llamada vector, ni rig ficticio. Código de UI determina foco/selección/disponibilidad; texto fuera de imagen. No recursos externos nuevos, atribuciones de terceros o capacidades pagadas. Licencias/manifests anteriores intactos; esta procedencia no cambia el estado histórico de permisos de distribución de la franquicia. Sin distribución.

Inspección en contexto: capturas compiladas ES/EN, ambos packs,1280/390/865; emblemas visibles en ruta y consulta, rostros completos y sin superposiciones con acciones. Arte/renderer ausentes se verifican en prueba adversa Chromium; los nombres y comandos permanecen. Detector visual mecánico `[]` y SSR no sustituyen esta revisión de imágenes ni una aceptación estética humana.
