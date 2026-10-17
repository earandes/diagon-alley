Method: dual-agent (A: /root/boss_style_design_review · B: /root/boss_style_evidence_review)

# Revisión visual del jefe A70: sprite y preparación

Fecha: 17 octubre 2026. Base revisada: `dffd6aed21c4d52764b07b6d36e95ed6c4cd9802`.

## Veredicto y alcance

El recorrido tiene una base funcional y un arte ilustrado propio, pero todavía no alcanza la presencia de una escena de juego que solicita Enric. El popup organiza la preparación como una columna de configuración; el jefe utiliza una figura plana con piezas de un objeto, no una animación corporal expresiva. La oportunidad principal es cambiar composición y protagonismo, antes de añadir efectos.

Esta revisión no autoriza ni implementa un rediseño. No modifica aplicación, assets, reglas, economía ni partidas. Tampoco hace commit, push, instalación o publicación. Las propuestas siguientes quedan pendientes de implementación y comprobación.

## Método y evidencia

- Evaluación A independiente: composición, presencia del personaje y lenguaje visual; fuente y cuatro capturas Linux existentes. Terminó antes de incorporar los resultados del detector.
- Evaluación B independiente: controles reales, detector, procedencia y vigencia de la evidencia. Síntesis final contrastada con componentes, CSS y recursos activos.
- Skills: Game UI/UX, Game Feel e Impeccable/critique. Sus recomendaciones no constituyen aprobación de arte ni observación humana.
- No se abrió navegador ni se ejecutaron suites, servicios, perfiles, grabaciones o capturas nuevas. Se respetó `HOST-INCIDENT.md`. La inspección dinámica/overlay de la guía genérica quedó excluida por las instrucciones de protección del Mac.
- Las imágenes siguientes son estáticas, de Chromium Linux a 1280×900. No acreditan movimiento, percepción móvil ni comprensión por jugadores.

Capturas examinadas:

1. [Preparación](../boss-increment-2026-10-16/evidence/linux/selected-boss-preparation.png): recorrido autoritativo.
2. [Lanzamiento con libro](../boss-increment-2026-10-16/evidence/linux/selected-boss-object-cast.png): fixture declarada.
3. [Lanzamiento ARCANA](../boss-increment-2026-10-16/evidence/linux/selected-boss-object-arcana-cast.png): fixture declarada.
4. [Cierre](../boss-increment-2026-10-16/evidence/linux/selected-boss-closure.png): recorrido autoritativo.

Los 44 objetos raíz registrados en `boss-increment-2026-10-16/evidence/validated-code-objects.json` coinciden con HEAD. La evidencia guardada corresponde al candidato `0189d3a`, merge de CI `024e88d` y ejecución `38977202497`. Se revisaron los registros locales; esta auditoría no consultó de nuevo GitHub ni repitió las pruebas. Los 24 registros de recorrido cubren ES/EN, ambos packs, tres tamaños y dos motores; no equivalen a una revisión visual móvil. La entrega A70 distingue ya las pruebas técnicas de la observación humana pendiente.

## Especificidad y fortalezas

La pintura, los escenarios y los objetos pertenecen al universo visual elegido. La estructura del popup, en cambio, podría reutilizarse en un configurador convencional cambiando las ilustraciones. La identidad reside principalmente en la decoración, cuando debería organizar también la interacción.

Conservar:

- Acabado ilustrado, materiales y continuidad de identidad entre preparación, arena y cierre.
- Objetos de botín reconocibles y conexión funcional con su utilización.
- Consulta a demanda, gasto explícito, cancelación y controles semánticos. Cambiar su apariencia no exige perder botones HTML, foco o etiquetas.

## Heurísticas: valoración experta acotada

Escala 0–4. Son juicios de inspección sobre esta superficie y sus fuentes/evidencias guardadas, no mediciones de usuarios ni una nueva certificación de accesibilidad. La puntuación de usabilidad no mide por sí sola personalidad artística.

| # | Heurística | /4 | Motivo |
|---|---|---:|---|
| 1 | Estado del sistema | 3 | Coste y acciones explícitos; contador de grageas poco autoexplicativo. |
| 2 | Correspondencia con el mundo del juego | 2 | Objetos propios dentro de una estructura de configuración. |
| 3 | Control y libertad | 3 | Consultar, cancelar y preparar están diferenciados; no se ejecutaron aquí. |
| 4 | Consistencia | 2 | Acabado pictórico coherente, encuadre y peso del actor desiguales entre packs. |
| 5 | Prevención de errores | 3 | Frontera explícita de confirmación del gasto conservada. |
| 6 | Reconocer antes que recordar | 2 | El equipo y los objetos no organizan visualmente la preparación. |
| 7 | Eficiencia | 3 | Información plegada y accesos disponibles; no se midió tiempo humano. |
| 8 | Jerarquía y economía visual | 1 | Filas y paneles dominan sobre jefe, equipo y acción principal. |
| 9 | Recuperación | 3 | Contratos y evidencia previa de recuperación/fallback; sin nueva ejecución. |
| 10 | Ayuda y detalle | 3 | Inspección disponible; su presentación tiene demasiado peso visual. |
| | **Total** | **25/40** | Referencia experta inicial; sin tendencia comparable previa. |

## Dos prioridades

### P1 · El popup presenta una configuración, no un encuentro

**Evidencia:** `BossPrelude.tsx:54`, `boss-a70.css:22`, `App.tsx:606`, `contextual-preparation.css:286` y captura de preparación. La figura se limita a 110–136 px de altura; compite con filas de consulta, sinergias, preparación, grageas y confirmación dentro de un diálogo alto. Hay una sola acción principal de combate, no siete decisiones equivalentes.

**Problema:** los recuadros tienen más autoridad visual que el rival. El jugador recibe una secuencia de secciones que revisar en lugar de una confrontación que preparar. Esto es una interpretación experta; la dificultad real de comprensión requiere observación humana.

**Cambio propuesto: una antesala de duelo.**

- Jefe protagonista en el escenario; acompañantes detrás, con nombre y afinidades próximas a las figuras. Conservar toda la composición rival consultable.
- Equipo propio en primer término, como retratos/puestos con condición y objetos reales. Activarlos abre la preparación existente; no equipa ni guarda automáticamente.
- Tarro junto al equipo, con existencias visibles y asignación marcada sobre el portador. El detalle conserva cantidades exactas y significado. No introducir otra bolsa.
- Libro o medallón de inspección para rivales y sinergias. Los datos completos siguen disponibles, sin una columna permanente de paneles. La ausencia de sinergia puede quedar en el detalle; una activa conserva sus emblemas y valores reales.
- Un único control principal de desafío con coste junto a la acción. Mantener texto breve, activación convencional y confirmación explícita; no exigir arrastre, pulsación prolongada o ceremonia adicional.
- Regreso y Ajustes en segundo plano, accesibles y con objetivos táctiles cómodos. A 390×844: rival arriba, equipo abajo y acción clara; el detalle ampliado puede desplazarse sin esconder miembros.

**Resultado esperado:** primero se perciben oponente, equipo y decisión; las consultas acompañan la escena.

**Comprobación posterior:** reconocer esos tres elementos antes de leer todos los textos; ningún dato/actor necesario desaparece para caber; consulta y cancelación no gastan; toque, teclado y foco equivalentes; ES/EN, ambos packs y texto ampliado. La primera condición se verifica con sesión humana, no con un selector DOM.

Herramientas de trabajo pertinentes: Impeccable layout/distill, Game UI/UX; no ejecutadas como implementación en esta revisión.

### P1 · El sprite no tiene todavía silueta ni gesto suficientes a escala de combate

**Evidencia:** `boss-art.ts:24`, `pixi-scenes.ts` y capturas de lanzamiento. Hay dos recortes móviles del libro en Diagon Alley y dos del cuenco en ARCANA. Las figuras originales siguen planas. La portada gira aproximadamente 0,035 radianes; esto no constituye una pose de lanzamiento. El cuenco procede de una zona de 43×19 px dentro de una figura de 342×512 px y pierde lectura al reducirla. Diagon usa un busto; ARCANA una figura completa, con peso visual diferente a igualdad de altura.

**Problema:** se reconoce el retrato, pero la figura y su objeto apenas distinguen el acto de combatir. Agrandar un retrato, inclinarlo o añadir un halo no genera articulación corporal ni resuelve el encuadre.

**Cambio propuesto: una muestra de actor de combate.**

1. Fijar un criterio de encuadre y escala perceptiva coherente entre packs; conservar el retrato de colección y no deformar la imagen.
2. Probar una silueta y un objeto de lanzamiento legibles dentro de la arena real, con apoyo/sombra de contacto y espacio para PV y compañeros.
3. Si el gesto requiere cuerpo o manos, producir únicamente las poses/piezas imprescindibles: reposo, lanzamiento y reacción. Separar manos/objeto exige pintar zonas ocultas; no basta recortar la pintura actual. Registrar fuente editable, transparencia, pivotes y fallback antes de un lote.
4. Coreografiar anticipación → apertura/gesto → trayectoria confirmada → impacto → asentamiento, sobre el reloj compartido y eventos existentes. No añadir duración obligatoria, ataques, fases ni cálculos. Ajustar primero lectura y escala, después intensidad.
5. Movimiento reducido: postura/objeto y actor-objetivo reconocibles mediante estados estáticos equivalentes. Arte fallido: acciones, PV, registro y resultado siguen disponibles.

**Resultado esperado:** el jefe se identifica por silueta, gesto y objeto, además de por el nombre.

**Comprobación posterior:** muestra en contexto a tamaño real en los tres tamaños previstos y ambos packs; objeto distinguible sin zoom; todas las unidades/PV visibles; pausa, 2x, omisión y pérdida del renderer conservan log y resultado. Revisar evidencia dinámica Linux seleccionada antes de aprobar el movimiento. La percepción de personalidad sigue siendo hipótesis humana.

Herramientas pertinentes: Game Feel, PixiJS y pipeline visual local; no se produjo ni sustituyó arte en esta revisión.

## Observaciones menores relacionadas

- **Arena:** las grandes celdas/rectángulos de actor y objetivo dominan más que las figuras. Una puesta en escena enfrentada con profundidad y selección localizada podría ayudar; debe conservar los cinco miembros posibles, PV e inspectores. Es una dependencia compositiva de la muestra, no autorización de rehacer toda la arena.
- **Cierre:** objetos reconocibles seguidos de filas y tarjetas vuelven a producir sensación de menú. Mantener su continuidad funcional y estudiar después una bandeja de botín con acceso visual claro a la llave/bóveda. No añadir una reclamación ni otro paso.
- **Foco:** el contorno cian intenso de la captura es un estado de teclado; no es un textbox ni el estilo permanente. No eliminarlo para embellecer. Adaptarlo al objeto debe conservar visibilidad y contraste.
- **Controles:** los seis componentes principales inspeccionados no contienen `<form>`, `<input>`, `<textarea>` o `<select>`. Las selecciones son botones ilustrados con `aria-pressed`; las consultas son `details/summary` y diálogos. La sensación de formulario procede de la composición y los bordes, no de una entrada de datos real.

## Carga cognitiva y recorrido emocional: hipótesis, no observación humana

La secuencia visual actual se aproxima a escenario atractivo → configuración → reproducción en celdas → menú de resultado. La propuesta busca encuentro → preparación física → confrontación → botín utilizable. Se conserva la misma lógica y frontera de gasto.

Perfiles de revisión hipotéticos:

- **Primera visita:** puede interpretar los bloques como requisitos que debe cumplimentar y `0/1` como un paso pendiente. Comprobarlo sin explicar la pantalla.
- **Jugador táctico recurrente:** necesita inspeccionar rivales y preparar sin atravesar otra introducción obligatoria; la presentación propuesta no añade una segunda confirmación.
- **Teclado/toque y texto ampliado:** convertir filas en objetos no puede volver invisibles etiquetas, selección o foco ni depender de hover. Las zonas decorativas no deben invadir las áreas de acción.

No se afirma abandono, satisfacción ni dificultad observada en estos perfiles.

## Detector y límites

Una sola ejecución, salida `[]`, código 0 y stderr vacío:

```sh
.agents/skills/arcana-impeccable/scripts/impeccable detect --json src/arcana/presentation/BossPrelude.tsx src/arcana/presentation/BattlePanel.tsx src/arcana/presentation/BossBattleFacts.tsx
```

No reportó hallazgos, reglas ni ubicaciones. La salida vacía no incluye manifest por archivo; no acredita cobertura estética ni accesibilidad completa. Tampoco contradice la crítica de composición. No hubo overlays o inspección en navegador.

No se repitieron tipos/build/pruebas porque no hay cambios de aplicación. No se validó movimiento con imágenes estáticas. Pendientes: revisión dinámica permitida en Linux, revisión visual móvil, dispositivo físico, lector hablado y sesión humana.

## Siguiente incremento recomendado, todavía propuesto

Resolver juntos **una antesala de duelo y una muestra de actor a su escala real**, con el jefe actual y sin cambiar reglas. Primero composición con recursos existentes; después una única muestra de pose/piezas si hace falta; finalmente validación del recorrido preparación → replay → cierre y sus alternativas accesibles. No empezar por más partículas, marcos dorados o un lote de personajes.

Questions skipped: se han priorizado exactamente dos problemas; la dirección solicitada por Enric es explícita y esta revisión no necesita decisiones adicionales para concluir el análisis.
