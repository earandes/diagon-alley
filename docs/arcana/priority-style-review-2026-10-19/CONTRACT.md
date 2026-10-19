# Revisión de estilo previa al merge · A90

19 octubre 2026. Baseline `be7090303273ea0f32d7af678c2b282b21e3345d`, rama `feature/roadmap-priorities-a89`, PR12 abierta. Main `d4a6d36fd0b1fb96ab4f3e8a071c88cfc5621f1f`. Worktree rastreado limpio al inicio; archivos ajenos no rastreados conservados. No integración en main, publicación o despliegue autorizados en esta revisión.

## Método y alcance

Revisión de todas las superficies nuevas A89: guía, intención de compañía/recordatorio, hechos del combate, lectura en Ajustes, Cromodex y fuentes/objetivo, comparación de varitas y preparación/riesgo de grageas. PM01/14 y PM10/22 no añaden pantallas; se comprueba que no se presenten como UI nueva. Se reutilizan las seis imágenes seleccionadas de CI39261802331 y los contratos/cobertura de A89. Capturas estáticas acreditan composición, no movimiento ni comprensión.

Game UI/UX, Impeccable y entrega-iterativa aplicados. Dos revisiones aisladas: Assessment A diseño independiente antes de conocer detector; Assessment B detector estático y cobertura. Restricciones del Mac prevalecen: ninguna apertura de navegador, overlay, perfil, grabación o captura local. Comprobación gráfica nueva solo CI Linux, guard original, serie, un worker, cero reintentos. Lote de revisión acotado. La confirmación descubrió S07 y después su defecto de cascada; tres candidatos documentados, con corrección demostrada entre ejecuciones. No ciclos cosméticos abiertos.

## Correcciones acotadas y aceptación

| ID | Evidencia → problema | Cambio mínimo → aceptación |
| --- | --- | --- |
| S01 | Source: aria-label genérico sustituye la instrucción visible de la guía | Nombre accesible conserva la instrucción ES/EN; icono solo sigue nombrado. Abrir/cerrar no opera ni pierde foco. |
| S02 | Source compartido: en cierre se proyectan todas las copias a PV máximos, pero el texto dice «en pie» | Explicar identidades propias disponibles para preparar; solo contribuyen las identidades distintas en pie de la formación confirmada, sin exigir incluir toda la colección ni afirmar compañía ya activa. No cambiar cálculo, disponibilidad o reglas. |
| S03 | PNG compañía/source: el escudo seleccionado se convierte en libro en recordatorio | Conservar HouseInsignia en seleccionado, activo, cumplido o no disponible; estado textual, pack e idioma intactos. |
| S04 | PNG compañía: tres «Cómo intentarlo» y barra «?» compiten con tres objetos | Un libro de ayuda para comparar todas las alternativas antes de elegir. Tres objetos siguen siendo acciones explícitas; abandonar secundario. Consulta no guarda ni consume. Semántica nativa, foco y objetivos cómodos conservados. |
| S05 | PNG Cromodex: versión técnica acompaña probabilidad en primer plano | Mantener fuente y probabilidad exacta visibles; versión y explicación aleatoria bajo «Cómo obtenerlo». Mismo contenido/objetivo/propietario, sin cambiar azar. |
| S06 | Source: guía oculta + Artwork ausente + marcador eliminado dejan una diana vacía | Sustituto textual breve solo al faltar imagen; nombre accesible, teclado y posibilidad de recuperar ayuda. Caso con error de imagen explícito para SVG inline, sin afirmar fallo de red real. |
| S07 | Captura nueva de Linux39277262203: grid de Ajustes trata grupo de tamaños y contraste como dos columnas; pila106+106px y contraste estirado | Dos tamaños en fila ordinaria, contraste separado, controles56px y sello. Una columna en320px; preferencias/reglas intactas. Hallazgo de confirmación visual, no supuesto previo. |

Varitas, grageas y resultado mantienen operaciones y composición. Ajustes conserva su familia ilustrada con S07; no se justifican assets nuevos, otra pantalla, filtros globales o rehacer arena. No se elimina información táctica para aparentar minimalismo. Se compara composición actual frente a: A) atenuar controles repetidos; B) agrupar ayuda sin cambiar elección. Se elige B por reducir cuatro disclosures a uno sin otro paso para guardar ni esconder costes.

## Persistencia, recuperación y recursos

No contratos de dominio, migraciones, catálogo, inventario, snapshots, receipts, reglas, economía o servidor modificados. Elección/abandono conserva comando e idempotencia actuales. Ayuda nativa de solo lectura, resultado confirmado antes de animación y recuperación existente intactos. Recursos ya activos, sin producción, dependencias, audio, tickers o instalación. Fuentes históricas se conservan. Fallback de imagen mantiene etiqueta visible; escudo vectorial existente.

## Plan

1. Contrastar fuente y evidencia; registrar evaluaciones independientes y hallazgos.
2. Pruebas de riesgos relevantes que fallen; corregir lote S01–S06.
3. Tipos, build y pruebas no gráficas pertinentes. Detector final sobre markup modificado.
4. Un candidato Linux serial con casos afectados, evidencia seleccionada móvil/escritorio y regresiones. Inspeccionar imágenes, registrar SHA y límites.
5. Actualizar documentación y PR de rama; sin merge. Observación humana, lector real y dispositivo físico pendientes.

Questions skipped: estilo, alcance de revisión y correcciones explícitamente autorizados por Enric; no hay elección material que impida avanzar.
