# A71 · Compatibilidad y frontera de presentación

No hay migración, importación de inventario, versión nueva de campaña ni derecho de premio nuevo. El rol `boss.circe.figure` es una clave de presentación en los dos packs; la identidad económica `circe`, el snapshot y el BattleLog permanecen iguales. La colección sigue usando sus figuras/retratos originales.

[Objetos Git comparados](evidence/compatibility-objects.json) conserva la igualdad exacta de árboles de dominio, aplicación, infraestructura y contenido respecto a la base A70, y de dependencias/workflow/guard. Esto acredita que este incremento no reescribe esas fuentes; no prueba datos de una cuenta ni sustituye regresiones de persistencia.

La antesala usa estado confirmado y los borradores existentes. Consultar/cerrar detalles/retrato/cancelar no guarda, equipa o consume. Equipo guardado conserva su confirmación; gragea sigue siendo borrador hasta confirmar el combate. El coste se muestra en la única acción explícita, sin otra operación o confirmación añadida. Intenciones y uso de botín mantienen comandos existentes.

La UI/Canvas consume el resultado guardado antes del replay. No hay sorteo, compensación, fase o premio en renderer, selector, pose o asset. Fallar base/brazo mantiene compuesto estático; fallar rol completo permite figura anterior y controles/registro DOM. Pack/idioma cambian presentación conservando IDs y resultado. Omitir, recuperar o consultar historia no concede ni consume.

La nueva batería ejecuta cuentas aisladas contra PostgreSQL/Redis reales. La atomicidad, respuesta perdida, concurrencia y consumo de grageas se verifican además en pruebas/regresiones compartidas. No se afirma que las fixtures de composición prueben autoridad, ni que A71 haya añadido una carrera de dos pestañas específica del jefe o un consumo real de gragea en su nuevo journey: se reutilizan contratos existentes, con cobertura y resultados detallados enQA.

main no forma parte de esta entrega: PR4 está apilada sobre A70/PR3, conservando la dependencia actual. No merge, despliegue o publicación. Las pruebas físicas, lector hablado y comprensión humana siguen separadas.
