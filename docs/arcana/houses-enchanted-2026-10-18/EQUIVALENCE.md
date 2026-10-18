# A85+A86 · Código probado y documentación de cierre

Fuente `6cf2ac84fe3b5222f1973693acadefcffb41a7c7`, checkout sintético `0d59c6103e0ecaba1956b43b6ec8e84ba2e1f2cf`, CI [39167929972](https://github.com/earandes/diagon-alley/actions/runs/39167929972). Ambos jobs completos superados. Los candidatos fallidos/cancelados siguen enQA, sin atribución de éxito.

PR9 conservaA84 y tiene base main8b7dffd (PR8 ya integrada). El merge`1a549eafb33f771293603775a8586d0210c608a3` conserva exactamente el árbol probado. No se fuerza ni altera un check. Sin despliegue.

[Objetos del código/ensayos/guardas](evidence/local/runtime-objects.json). Las1152simulaciones conservan igualdad exacta de objetos de dominio, aplicación, infraestructura, contenido y script: [comparación](evidence/local/simulation-equivalence.json). No hay equivalencia gráfica global con eb0c050: A86 cambió arena y ensayos; se ejecutó de nuevo.

La documentación y metadatos de procedencia pendientes de cierre no cambian runtime. Tras su commit, ejecutar desde raíz:

```sh
git diff --exit-code 6cf2ac84fe3b5222f1973693acadefcffb41a7c7 HEAD -- . \
  ':(exclude)docs/arcana/houses-enchanted-2026-10-18/**' \
  ':(exclude)docs/arcana/arena-scene-2026-10-18/**' \
  ':(exclude)docs/PRD.md' ':(exclude)docs/DECISIONS.md' \
  ':(exclude)README.md' ':(exclude)DESIGN.md' \
  ':(exclude)design/houses-a85/manifest.json' \
  ':(exclude)design/arena-a86/manifest.json'
```

Debe terminar sin diferencias. Las exclusiones no abarcan código, tests, guards, workflow, dependencias o futuras criaturasA87. Los dos manifests son metadatos de fuente/procedencia sin consumidor de runtime; no sustituyen un recurso activo. No atribuir una batería completa a un SHA documental que no la ejecutó. Las imágenes actuales tienen su fuente6cf/checkout0d59 enA86; las anteriores se conservan como historia, no como código actual.
