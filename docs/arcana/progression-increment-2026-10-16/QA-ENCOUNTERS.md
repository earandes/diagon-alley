# A67 · QA de encuentros y recorridos integrados

## Presentación aislada

`npm test -- tests/domain/arcana/encounter-presentation-a67.test.ts`:8 casos correctos. ES/EN y ambos packs; sin preselección/escritura al renderizar, preview exacta compartida, alcance individual/equipo, integrantes caídos, pasar disponible y resultado guardado con/sin roster.

`impeccable detect --json` sobre EncounterPreparation, EncounterTradeOutcome, encounter-a67.css y encounter-messages.ts:sin hallazgos automáticos (`evidence/encounter-design-detect.json`). No sustituye inspección visual ni auditoría WCAG.

Fuente de fixture: `evidence/encounter-visual-fixture.html` y `evidence/capture-encounter-fixture.mjs`, sobre Vite local5461 sin modo authority/API. Solo composición declarada con cinco integrantes50%PV/PM, NPC y opciones de prueba. Capturas `evidence/encounter-fixture/` inspeccionadas. Se corrigió el salto del quinto destinatario y se sustituyó `ui.team` ausente en ARCANA por retratos reales de la formación. Medidas finales de diálogo:

-390×844:358×740,86px; sin overflow horizontal/vertical ordinario.
-1280×900:520×741,63px; sin overflow.
-865×1079:520×835,91px; sin overflow.

Servidor5461 detenido tras capturar; no se ejecutaron operaciones ni se tocó la sesión habitual.

## Batería integrada

`playwright.progression-a67.config.ts` inicia previews compilados5420/5421, namespaces efímeros, nuevos contexts por prueba, worker/service-worker bloqueado para fixtures de transporte fiables. Ambos motores Chromium/WebKit. No usa perfiles personales o sesión habitual.

`tests/browser-trial/progression-a67.spec.ts` cubre20 casos:

-8 recorridos completos ES/EN × ambos packs × ambos motores: selector de los tres desafíos sin mutación, inicio explícito, Pactos reales necesarios, mapa en tres tamaños, encuentro con selección provisional/portador, ayuda, cancelación/Escape/foco, recarga de oferta fija, confirmación y receipt/PV/PM exactos, recarga y resultado consultable.
-4 casos de alcance equipo y respuesta perdida: consulta/cancelación de pasar conserva estado; autoridad real confirma trato; se pierde la respuesta después del commit; recuperar y recargar conservan un único POST y condición exacta.
-4 casos de taller/equipo/combate: cancelar forja, dos recetas de15monedas (wyvern/fénix), persistencia V2, equipar fénix, iniciar desafío Táctico, recoger temporales reales, confirmar duelo y reproducir el BattleLog con wandHealing2 guardado, misma economía tras recarga.
-4 casos adversos ES/EN × ambos motores: arteWebP ausente, rendererWebGL indisponible, reducido, teclado y texto200%; pasar confirmado conserva recursos/condición y permite continuar. Scroll de detalles/texto ampliado expresamente permitido; no se oculta contenido.

### Fixture de condición

Los encuentros nuevos son deterministas y pueden no aportar beneficio con todos los recursos llenos. Para probar el trato con condiciones reproducibles, cada caso afecta solo al `playerId` que acaba de crear en su context. Una transacción SQL con revisión/ID de run comprobados coloca PV/PM de miembros activos al50%y aumenta revisión. No modifica moneda, inventario, premios, catálogo o reglas; se recarga desde API antes de consultar. Los receipts previos no se alteran. Es preparación técnica declarada; no una condición producida por un jugador.

Al terminar se eliminan únicamente las cuentas creadas por la batería. El resto de operaciones (kit, inicio, Pactos, forja, equipamiento, combate, trato, consulta y recuperación) usa la API local y PostgreSQL/Redis reales. No se atribuyen a esta batería pruebas de concurrencia SQL del contrato completo; esas garantías se registran en la suite de integración del coordinador.

### Historial del harness

-Primera ejecución: lectura de estado antes de que terminase de aparecer preparación; corregida espera al destino observable, sin cambio de aplicación.
-Segunda ejecución:16/20 correctos. Los4 de respuesta perdida leían estado mientras la petición todavía estaba viajando; corregida espera explícita al aborto de la respuesta posterior a `route.fetch`.
-Enfocado posterior: localizador genérico de recuperación encontraba botón del fondo y del diálogo; acotado al modal activo.
-Enfocado final de recuperación:1/1 correcto, con commit real y sin segundo POST.

La ejecución final uniforme de20 casos sobre el compilado definitivo y sus resultados se registra en el informe del coordinador y `evidence/browser-final.txt`. Los logs anteriores se conservan como fallos del harness y no se cuentan como aceptación.

## Límites

Viewports son emulación, no móviles físicos. No hay lector audible, pruebas con personas, certificación de accesibilidad o evidencia de diversión/retención. Capturas de presentación no prueban autoridad. Tiempo acción→receipt incluye autoridad/red y overhead del runner; no es tiempo humano ni FPS y requiere comparación equivalente para inferir rendimiento.
