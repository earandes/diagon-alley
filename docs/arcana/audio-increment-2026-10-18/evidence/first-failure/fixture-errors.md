# Errores de las fixtures de comprobación

Extractos seleccionados de CI Linux; no son errores observados con jugadores. Las páginas/contenido del producto no se modifican para evitar estas assertions.

## CI39124837482 / head8f610ce

A70 no inició sus casos. Log:

```text
TypeError: Module "file:///home/runner/work/diagon-alley/diagon-alley/src/arcana/content/equipment-v2.json" needs an import attribute of "type: json"
```

La importación nueva de trialConfiguration desde el runner de Node usaba el contrato de módulos JSON de Vite. Se sustituye por JSON mediante fs, generado offline y comparado con el contenido vigente en dominio.

## CI39126440801 / head9abc4fc

Caso `A73 complete authoritative expedition fluency es arcana`, antes de avanzar ruta:

```text
TimeoutError: locator.click: Timeout 10000ms exceeded.
  waiting for getByRole('button', { name: /^(Actualizar Energía|Refresh Energy)$/ })
```

DOM observado:

```yaml
- generic: Esencia
- meter "Esencia Rúnica"
- button "Actualizar Esencia"
```

El selector nuevo no contemplaba el nombre del paquete ARCANA. Se amplía a los cuatro nombres reales localizados, sin añadir texto/capacidad al producto. No se reduce el timeout ni se elimina la consulta/actualización autoritativa de estado.

## Inyección GSAP en WebKit

En las dos primeras baterías completadas, el fallback estático permitía continuar y conservaba receipt, pero `failedGsapRequests` era0. Dividir arte/import en navegaciones separadas no bastó. El candidato9abc4fc conserva `failedGsapRequests > 0` y aísla el import fallido en un contexto nuevo, tras cerrar la página anterior. Su resultado debe registrarse en QA al acabar la ejecución; no se infiere éxito de este cambio.
