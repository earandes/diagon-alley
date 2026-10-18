# A76 · Candidato y entrega

- Baseline/dependenciaA75: `ff23f580d9d3989abc9918d7b5bc8328d9e83b62`, PR6 todavía abierta al preparar esta entrega.
- Rama: `feature/a76-recoverable-accounts`.
- [PR7](https://github.com/earandes/diagon-alley/pull/7), draft y base `feature/a75-experience-fixes`; no propone saltar su dependencia.
- Código probado: `3f6e1223d7b9ada6cae55f50f7b2627f2c35100b`.
- [CI39070225878](https://github.com/earandes/diagon-alley/actions/runs/39070225878), checkoutmerge `bc8c166ab38132c7c0e8e471a7206973c25dd151`.
- Árbol del head y del merge idéntico: `c755d7debc31728151af02629b2c08c024a20cb6`.
- Main remoto de referencia: `937a0a1f00bdbca7009a80cd99b7b4b450f652f0`; A76 no lo modifica.

La continuación[CI39074119331](https://github.com/earandes/diagon-alley/actions/runs/39074119331) pasó sobre88eaa44092fc0b4652a21b62d00f63ebb48c2e66. Su único cambio contra3f6 es la selección temporalfull→tail ya existente; checkout7fe58d38cc780d4afaaa7eb8ebd96e1c49162412, mismo árbol973ccf9f46296ddb6fb604610107dba282e39010. La primera CI agotó55min, no fue success.

El cierre restaurafull y únicamente añade documentación/evidencia frente a3f6. La comprobación `git diff --name-only 3f6e122 <cierre-documental>` debe contener soloREADME/DESIGN y docs; fuentes, pruebas, dependencias, herramientas y configuración ordinaria idénticas. No se atribuye una nueva batería completa al commit que únicamente documenta evidencia.

No desplegado, publicado o integrado en main. Los mensajes de correo se entregan al buzón local privado del servidor; envío externo y operación pública requieren una configuración/autorización posterior. La PR puede revisarse en conjunto con A75; no se hace forcepush ni reset de trabajo previo.

La batería completa puede exceder el límite55min del job ordinario: las comprobaciones necesarias se ejecutaron en dos tandas en serie con la fase existente, no elevando timeout o debilitando protecciones. Para futuras validaciones conservar cobertura porSHA al segmentar; este registro no convierte el run cancelado en verde.

Resultado conjunto de comprobaciones:618unitarias y98integraciones reales correctas en ambas tandas; A76 30correctas en cada una. Primera tanda389casos gráficos correctos antes de cancelación; segunda132correctos, con solapamiento. Intenciones8/PWA12 y ambas muestras de rendimiento quedaron resueltas en la segunda. [QA y límites](QA.md).
