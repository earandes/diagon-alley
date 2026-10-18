# A74 · Revisión experta del recorrido y del estilo

17 octubre2026. Instrucción actual: realizar la revisión experta de juego, testeo, estilo y diseño y documentar la corrección/implementación para una fase posterior. **No implementar fixes, producir assets de juego, hacer commit/push o desplegar.**

Base: main937a0a1f00bdbca7009a80cd99b7b4b450f652f0. Árbol rastreado limpio al iniciar; numerosos archivos ajenos no rastreados, conservados. A73validado enCI39038639396 sobremerge8541ee2c; equivalencia no documental guardada, no se atribuye nueva batería alcommit937a0a1.

Recorrido principal: entrada → preparación → mapa/decisión → Pacto/encuentro/refugio/cofre → preparación táctica → arena → jefe → cierre → botín → preparación explícita de otra expedición. Revisión complementaria de tiendas, apertura, colección, equipo/forja/bóveda, atlas, Halloween, Ajustes y estados de recuperación que formen parte del código actual.

Método: lectura completa de fuentes normativas; inventario de rutas/componentes; walkthrough cognitivo experto por pasos/estados; contraste de comportamiento, estilos, assets y evidencia Linux identificada porSHA. Juicio visual mediante capturas existentes de fuentes comprobadas. Separar hecho de código, comprobación ejecutada, evidencia histórica reutilizable, interpretación experta, hipótesis humana y propuesta.

No se simulará una persona ni se inventarán tiempos de duda, diversión, comprensión o retención. Una captura estática no demuestra movimiento. Una prueba funcional no aprueba dirección artística, WCAG o dispositivo físico. Un detector sin findings no demuestra calidad visual.

Seguridad Mac: no abrir navegadores/Chrome/Browser, suites gráficas, grabación, perfiles o capturas nuevas. Única excepción local de repositorio sería test:browser:local con controles originales; no necesaria si la evidencia reciente cubre el mismo código. Gráficos extensos solo CI Linux con guard/bloqueo/watchdog/unworker/ceroretries. Esta revisión no necesita modificar pruebas/workflows o crear una PR para volver a ejecutar código idéntico. Si falta evidencia, registrar el hueco.

Se aplican Game Design Workshop (diagnóstico), Game UI/UX, Game Feel, Impeccable audit/critique y lectura contextual Taste, subordinados a la dirección Teatro de alquimia y a las restricciones actuales. No se incorporan nuevos sistemas/librerías o reglas económicas.

Entregables: informe ejecutivo, recorrido/cobertura, auditoría visual y funcional por pantallas, findings accionables con evidencia→problema→propuesta→aceptación, backlog de siguiente implementación y protocolo de validación/humana posterior. Una recomendación no equivale a aprobación para implementar.

Plan: (1) fuentes y baseline; (2) evaluación independiente de diseño y diagnóstico técnico sin contaminación; (3) contraste de evidencia/código y síntesis; (4) contrato de fixes y validación posterior; (5) comprobar enlaces, consistencia y ausencia de cambios en aplicación.

Estado de cierre: los cinco pasos documentales completados. Contraste del coordinador corrigió un falso positivo parcial de B06 y consolidó once findings. 562 unitarios/build/tipos/scan de artefacto correctos en esta fase; cobertura gráfica/persistencia reutilizada del código equivalente, con límites explícitos. Sin cambios de aplicación ni publicación. La implementación y las comprobaciones nuevas de los fixes siguen pendientes de una fase posterior; no se confunden con esta auditoría completada.
