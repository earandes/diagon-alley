# Estudio de tipos, sinergias y variantes excepcionales

18 octubre 2026. **Primera propuesta, sin implementación ni aprobación de balance.** Baseline inspeccionado: `fd4739c76b6e497b62344a07e4b2c8d7183c595e`. Tracked limpio al empezar. Solo se añaden documentos y un cálculo de lectura en esta carpeta. No se modifica aplicación, cuentas, inventario, probabilidad, PRD aprobado ni evidencia histórica. Sin navegador local, producción de arte, commit o push.

## Dirección recomendada

La idea puede dar un motivo para coleccionar y elegir aliados: **construir una compañía reconocible, ver qué le falta y decidir si completar su sinergia o conservar un especialista**. La progresión interesante será dominar composiciones, no acumular multiplicadores o depender de una copia extremadamente rara.

Recomiendo casas como primera familia de sinergias temáticas, profesiones como segunda dimensión seleccionada y variantes excepcionales principalmente visuales. No convertir cada dato biográfico en un bono. Los tipos no necesitan una tabla de ventajas elementales como Pokémon: el motor actual no tiene ese sistema y las casas no son elementos enfrentados canónicamente.

Hay trabajo de diseño pendiente antes de implementar: acceso desigual a las casas, cobertura de personajes sin casa, convivencia con afinidades y potencia de los nuevos efectos. No se presenta este documento como calibración terminada.

## 1. Hechos comprobados

| Hecho | Fuente activa | Implicación |
|---|---|---|
| 30 personajes; Harry es el starter, 29 identidades tienen peso 1 en ranas | `src/arcana/content/trial-v1.json`, `catalog`, `toadTable` | Cada identidad elegible tiene 1/29. «Legendario» hoy no implica menor probabilidad individual |
| Las casas/profesiones no forman parte de `WizardDefinition`; no hay `variantId` | `domain/collection/wizards.ts` | Clasificación y shiny son propuestas nuevas, no datos ya guardados |
| Afinidades neutral/alchemy/fire/shadows | `domain/combat/synergies.ts` | No equivalen a casa o moralidad. Hermione tiene Fuego y McGonagall Sombras |
| Fuego 2, Alquimia 3, Sombras 1; no escalan con más miembros | mismo servicio | Los números romanos actuales expresan umbral, no niveles acumulables |
| Bonos de ensayo: quemadura 2, curación 3 por turno, iniciativa +2 | `trial-v1.json`, `campaign.combatRules` | No existe aún un efecto diferente por casa |
| Cuentan unidades en pie al empezar; hoy las copias repetidas cuentan por instancia | `synergies.ts`, `engine.ts` | Cambiar a identidades distintas sería una regla nueva y debe probarse |
| Los bonos se fijan al inicio y benefician al bando completo; no desaparecen al caer un contribuyente | `engine.ts`, contrato A48 | No atribuir activación dinámica por muerte al motor actual |
| Ataque único: primer rival vivo, gasto 1 PM, daño del poder/equipo/gragea; máximo 60 rondas | `engine.ts`, `equipment-effects.ts`, reglas | No hay roles de tanque, provocación, escudo, hechizo exclusivo o contra elemental por identidad |
| Ruta permite 1–5 miembros; combate exige 3–5 | contrato kit/equipo y preparación | El escalado debe caber en cinco puestos, no prometer umbrales de seis u ocho |
| Sinergias del mapa están dentro del inspector; preparación muestra activas, no toda la distancia al umbral | `TeamHud.tsx`, `PreparationSynergies.tsx` | La oportunidad principal es hacer visible el plan mientras se elige ruta |
| Apertura ya distingue rareza y descubrimiento/repetición con GSAP, decoración Canvas2D acotada y resultado confirmado | `CardReveal.tsx`, `opening-motion-model.ts`, `FrogMagic.tsx` | Extender esa secuencia; no volver a introducir un renderer pesado o sorteo visual |

Se contrastaron contratos de contenido intercambiable, preparación efectiva, HUD, pasivos y el estudio A67. Se consultaron Game Design Workshop, Game UI/UX y Game Feel. Se inspeccionaron dos PNG históricos seleccionados: antesala móvil A71 y mapa A60. **Solo acreditan composición histórica**, no el estado visual completo actual ni movimiento. No se ejecutaron pruebas con personas ni nuevas pruebas gráficas.

## 2. Clasificación del catálogo real

La clasificación completa de los 30 IDs está en [CATALOG.md](CATALOG.md), generada desde las fuentes activas más un mapa de etiquetas propuesto.

| Grupo descriptivo | Integrantes actuales |
|---|---|
| Gryffindor · 14 | Harry, Dumbledore, McGonagall, Hermione, Ron, Ginny, Arthur, Lupin, Sirius, Neville, Hagrid, Molly, Fred, George |
| Ravenclaw · 4 | Luna, Trelawney, Flitwick, Cho |
| Hufflepuff · 4 | Sprout, Tonks, Cedric, Newt |
| Slytherin · 4 | Snape, Bellatrix, Draco, Voldemort |
| Beauxbatons · 2 | Flamel, Fleur; escuela, no casa de Hogwarts |
| Casa no verificada aquí · 2 | Moody, Kingsley; no se inventa una |
| Profesores · 8, solapa con casas | Dumbledore, McGonagall, Snape, Sprout, Lupin, Trelawney, Flitwick, Hagrid |
| Aurores · 3, solapa con casas | Tonks, Moody, Kingsley |
| Muggles / animales como identidades actuales | 0 / 0 |

No usaría «buenos/malos» como atributo permanente. Casa, oficio, naturaleza y afiliación son ejes diferentes. Slytherin no equivale a mortífago; Snape no cabe en una etiqueta moral binaria. Un animago no se convierte por ello en un cromo animal; Hermione no es muggle. La tabla docente toma la representación escolar de Neville, sin añadir automáticamente su carrera futura. El Moody auténtico no recibe la docencia ejercida por quien lo suplantaba.

Los datos narrativos pueden describir más cosas que las reglas: casa/escuela, oficio, naturaleza, afiliaciones contextualizadas. Solo una selección explícita de ellos se convierte en rasgos de combate. Evitaría atributos de potencia ligados a pureza de sangre.

### Acceso desigual: problema demostrado por cálculo, no por una sesión humana

Con la tabla actual, Harry inicial y contando **identidades distintas**, estas son las aperturas para reunir tres miembros propios de una casa:

| Casa | Mediana | P90 | P95 |
|---|---:|---:|---:|
| Gryffindor | 4 | 8 | 9 |
| Cada una de las otras tres | 28 | 55 | 66 |

Cálculo exacto de ocupación con repetición sobre 29 identidades uniformes. Excluye Pactos, compras necesarias, energía, cambios de formación y comportamiento humano. No significa que una ruta tarde 28 aperturas. **Sí demuestra que copiar el umbral sin revisar acceso favorece mucho la casa del starter.**

Propuesta: mantener el inicio comprensible con Harry y ofrecer oportunidades de probar otras casas mediante Pactos fijados por servidor. No regalar nuevas copias ni retocar probabilidades como solución automática. Simular después el recorrido con ofertas reales y ambas decisiones de cada Pacto; consultar no puede volver a generar candidatos. Una colección pequeña debe conservar equipo válido y alternativas sin tipo activo.

## 3. Sistema que probaría

Comparación de enfoques:

| Enfoque | Ventaja | Coste/riesgo | Recomendación |
|---|---|---|---|
| Solo cuatro casas | Se aprende rápido, emblemas reconocibles | Cuatro personajes quedan sin casa y el catálogo es desigual | Núcleo de la muestra, no sustitución inmediata del sistema actual |
| Casa + oficio seleccionado | Permite mezclar casas y encontrar intersecciones | Bonos solapados, profesores potencialmente dominantes | Diseño objetivo; introducir una familia secundaria cada vez |
| Toda etiqueta da sinergia y shiny duplica todas | Muchísimas combinaciones aparentes | Lectura difícil, explosión de acumulación, cartas claramente superiores | Descartar |

**No activaría en producción todas las afinidades actuales y todos los tipos nuevos sin recalibrar.** La muestra debe comparar: A, afinidades actuales; B, sustitución temática; C, coexistencia acotada. Preferencia de diseño: un sistema principal comprensible, sin una pila permanente de Alquimia/Fuego/Sombras + casas + oficios + facciones. La sustitución no se puede cerrar todavía porque Flamel y Fleur perderían participación temática. Eso es un requisito de cobertura antes de publicar reglas nuevas, no una razón para inventarles una casa.

### Reglas propuestas para la muestra

- Un personaje aporta a una casa y, como máximo, un oficio de combate seleccionado. El resto son metadatos de ficha.
- Activación a **3**, refuerzo a **4**, especialización a **5**. Aplica el nivel mayor, no la suma de tres premios.
- Probar inicialmente **3/4 para todas las casas**: Ravenclaw/Hufflepuff/Slytherin solo tienen cuatro identidades. No mostrar un nivel 5 imposible ni reservárselo al shiny.
- Recomendación para incentivar variedad: cada identidad distinta en pie aporta una vez a cada rasgo. Copias repetidas siguen siendo seleccionables y conservan equipo/condición; no se eliminan. **Esto cambia la regla actual de contar instancias**, así que debe compararse con la alternativa de contar todas las copias. Si destruye planes iniciales, no se adopta por preferencia estética.
- Temporales y propios aportan igual, con procedencia visible. Reservas y caídos al confirmar no aportan. Fijar activaciones antes de reproducir; no perder el bono en mitad del combate cuando cae un miembro.
- Beneficios de casa solo para sus contribuyentes en la muestra. Evita que tres cartas activen un bono enorme para dos especialistas ajenos. También es un cambio frente al bono global actual.
- Con cinco puestos y casas exclusivas no caben dos casas activas de tres. Casa + profesión sí: Dumbledore/McGonagall/Lupin activan ambos grupos. Evaluar específicamente ese solapamiento.

Se enumeraron las 142.506 formaciones de cinco identidades distintas: 65.676 contienen una casa de tres, 14.532 tres profesores, y 7.158 ambas. **No son probabilidades de equipos humanos, victorias ni balance.** Son una comprobación exhaustiva de que la doble activación es posible y frecuente dentro del subconjunto docente.

### Efectos concretos, candidatos de ensayo

Las cifras siguientes **no están simuladas en el motor ni implementadas**. Permiten hacer una muestra verificable, no aprobar potencia por intuición. Se aplica una vez el valor del nivel alcanzado; nunca se multiplican todos los atributos.

| Tipo | Decisión/identidad jugable | Nivel 3 / 4 / futuro 5 | Beneficiarios y límites | Trabajo de dominio |
|---|---|---|---|---|
| Gryffindor · Arrojo | Ventaja de apertura; ceder puestos flexibles para golpear antes de recibir desgaste | +2 / +3 / +4 daño en el primer impacto acertado de cada contribuyente | Una vez por miembro y combate; un fallo no recibe daño ficticio | Contador de primera activación; no cambia objetivo |
| Slytherin · Astucia | Iniciativa frente a rivales cercanos en velocidad | +1 / +2 / +3 iniciativa | Solo contribuyentes, durante ese combate; no garantiza actuar primero | Reutilizar canal de iniciativa, nueva activación versionada |
| Hufflepuff · Perseverancia | Resistir combates largos o llegar dañado | 1 / 2 / 3 PV al comienzo del turno propio | Solo vivos contribuyentes, tope PV; sin resurrección | Reutilizar curación y su registro; revisar bucles de empate |
| Ravenclaw · Precisión | Preparar un equipo que sobreviva hasta aprovechar una ventaja tardía | +1 / +2 / +3 daño desde su tercer intento de hechizo | Solo contribuyentes; sin PM no hay hechizo ni daño; contador explícito | Nuevo disparador sobre ataques existentes, sin hechizo nuevo |
| Profesores · Preparación | Recuperar margen de PM durante una ruta desgastada | +4 / +6 / +8 PM una vez al empezar su primer turno | Solo profesores vivos, tope PM; puede valer cero si siguen llenos | Evento autoritativo de recuperación PM; no fingir un evento ya existente |

Costes de oportunidad: tres/cuatro puestos restringidos, condición, orden y renuncia a otras afinidades o especialistas. Hufflepuff no debe neutralizar todo daño; Ravenclaw no debe ser inútil en todos los duelos; Profesores podría resultar demasiado débil por tener 40 PM y coste 1. **No darlo por útil hasta medir el PM realmente perdido en rutas.** No usar reducción de coste PM como atajo: con coste actual 1, restar 1 vuelve gratuitos los ataques.

La muestra mínima compara Gryffindor frente a Hufflepuff y sus alternativas sin sinergia; después extiende a las cuatro casas. Profesores se valida después, sin añadir otro bono si no genera una decisión real. Aurores sería la siguiente familia a estudiar (tres integrantes actuales, enfoque de iniciativa/primer turno), pero no se publica otro bono redundante con Astucia por tener un nombre atractivo. Mortífagos, criaturas, muggles, Ejército de Dumbledore y Orden del Fénix quedan como metadatos o diseños posteriores, no una lista de pasivos por acumular.

### Catálogo y personajes adicionales

No añadiría cromos al azar para inflar colección. Para ofrecer nivel 5 con identidades distintas, candidatos justificados: **Ollivander** para Ravenclaw, **Slughorn** para Slytherin y un quinto Hufflepuff pendiente de ficha canónica y diseño, por ejemplo Hannah Abbott, cuya página no pudo verificarse en esta consulta. Ninguno existe hoy en el catálogo jugable; no se crean IDs, estadísticas, rarezas o pesos aquí.

Para Flamel/Fleur estudiaría la escuela Beauxbatons cuando exista un tercer integrante, por ejemplo Madame Maxime, o una familia transversal con reglas justificadas. No les asignaría «sin casa» como una casa artificial. Moody/Kingsley encuentran una posibilidad en Aurores con Tonks. **Cobertura y oportunidad comparable para los treinta es una puerta de aceptación antes de reemplazar afinidades**, sin exigir que todo equipo de cinco tenga un bono activo. Si eso requiere ampliar catálogo, comparar su coste y la alteración de probabilidades antes de autorizarlo.

Muggles y criaturas necesitarían catálogo, obtención, representación y acciones propias. No incluiría a Vernon lanzando magia por reutilizar `spell-cast`. Primer paso más coherente: presencia en encuentros; combate posterior solo con un diseño real. Animales, criaturas y seres mágicos no forman necesariamente una única familia mecánica.

## 4. Cómo se ve durante la ruta

**Mapa:** debajo/junto a los retratos del equipo, una banda integrada con sus medallones; no otra barra superior. Emblema, nombre breve y tres/cuatro marcas: `Gryffindor 2/3` o `Gryffindor · II` con nombre accesible inequívoco «nivel 2, cuatro integrantes». Evitar números romanos que puedan confundirse con el umbral actual. El diseño final debe escoger una sola notación consistente.

- Los tipos activos aparecen estables; los incompletos solo si hay contribuyentes. No mostrar diez emblemas vacíos como tareas pendientes.
- Tocar, enfocar o pasar el cursor abre la misma consulta: contribuyentes por puesto, procedencia, efecto actual y próximo cambio. Costes/estado y nombres fuera del arte. Área de activación 44 px aunque el dibujo mida 24–28 px.
- Seleccionar un candidato de Pacto previsualiza `2 → 3`, ilumina solo sus retratos y muestra la consecuencia real. Confirmar fija la incorporación; cancelar no cambia formación ni progreso.
- Un miembro caído deja de contar en la preparación del **próximo** combate; el mapa no debe reescribir los bonos de un replay anterior. Tooltip breve explica la diferencia si se consulta.
- Una respuesta de 180–240 ms enlaza retrato y medallón al confirmar. Sin loop; con reducido cambia contorno/marcas de forma estática. El efecto no retrasa el comando.

**Cromo e inspector:** emblema de casa en el marco, oficio secundario pequeño solo cuando corresponda. Naturaleza y afiliaciones bajo detalle, sin una fila de siete insignias. Filtros a demanda sobre la preparación y álbum, manteniendo selección por copia, ordinal y equipamiento.

**Arena:** al consumir la activación confirmada, pulso breve de 220–300 ms en contribuyentes y sello. Daño/curación/PM se representa cuando el log lo registre. No confundir «forma equipo» con un hechizo que esté ocurriendo en ese instante.

Son especificaciones de composición, no pantallas implementadas o validadas en móvil. Deben comprobarse 1280×900, 390×844, 865×1079 y reflujo/ampliación sin ocultar unidades o tapar caminos.

## 5. Ataques con personalidad: dos alcances distintos

**Primero, presentación:** mantener el mismo evento/daño/objetivo e incorporar perfiles de gesto y trayectoria. La casa aporta acentos de forma/material; no determina todos los hechizos del personaje ni convierte el color de una casa en una maldición concreta.

| Perfil visual propuesto | Anticipación → acción → contacto → reposo | Recursos mínimos |
|---|---|---|
| Arrojo | Gesto corto firme → trazo recto → chispa compacta → asentamiento | Punta/estela reutilizable y pose existente cuando sea legible |
| Astucia | Preparación contenida → curva estrecha → anillo que se cierra → disolución | Misma textura transformada, sin asociar todo Slytherin a Avada Kedavra |
| Precisión | Dos trazos caligráficos locales → convergencia → sello breve → desaparición | Vector/bitmap de runa genérica sin texto incrustado |
| Perseverancia | Trazo amplio y estable → contacto suave localizado → retorno | Perfil de trayectoria; curación solo si existe evento `healed` |
| Docente | Gesto personal de libro/varita → canal del ataque real | Reutilizar figura/objeto; no prometer manos articuladas desde una imagen plana |

Ventana orientativa por evento 350–550 ms a velocidad normal, acomodada a las marcas del reloj compartido, no un segundo temporizador. Actor/objetivo/PV visibles; 2x, pausa, ocultación e inspector conservan sincronía. Reducido: marcador de origen/destino y contacto breve sin recorrido. Fallo: trayectoria que se disuelve, sin número de daño. Ningún perfil genera daño, quemadura o curación por su aspecto.

**Después, mecánica:** los pasivos candidatos ya requieren un motor/versionado nuevo. Hechizos exclusivos, escudos, selección de objetivo, ataques de animales o inmunidades serían otra ampliación; no se camuflan como cambio de animación. Las activaciones nuevas deben emitir eventos y parámetros explícitos al confirmar el combate; el renderer nunca los deduce de la casa vigente.

No producir treinta ataques antes de comprobar dos perfiles en la arena real. Nada de filtros WebGL pesados, flashes de pantalla, audio o nuevas dependencias como solución por defecto.

## 6. Variantes excepcionales («shiny»)

Tiene sentido como hallazgo especial. Lo llamaría provisionalmente **Cromo Encantado / Enchanted Card**, separado de la rareza actual y de las estrellas. La identidad sigue siendo la misma; no aparece otro personaje en el denominador de la colección base. Atuendo, pose o acabado holográfico pueden cambiar sin redefinir personalidad o habilidades. No basta recolorear con un filtro de tono.

| Alternativa | Interés | Riesgo | Dictamen |
|---|---|---|---|
| Variante ilustrada, sin potencia | Hallazgo, exhibición y coleccionismo | No cambia el plan táctico | Primera opción recomendada |
| Cuenta ×2 para todas sus etiquetas, sin límite | Activa varias sinergias muy pronto | Ventaja por suerte, presión por reemplazar toda copia normal | No recomendar |
| Resonancia limitada | Tres identidades reales + una contribución extra a una casa declarada; máximo +1 por equipo | Sigue siendo una ventaja de poder y exige balance | Alternativa posterior si se desea conservar parte del ×2 |

Ejemplo del riesgo: con ×2 irrestricto, **dos** cartas especiales de una casa ya suman cuatro; **tres** suman seis y alcanzan cualquier umbral 5 sin dedicar cinco puestos. Si además son profesores se duplica también esa segunda construcción. Una carta normal idéntica queda mecánicamente dominada por su variante, aunque el drop sea muy bajo.

En la versión limitada: tres miembros distintos, uno especial, podrían sumar cuatro a **una** casa; una segunda especial no aumenta otra vez. No activa nada con dos miembros, no aumenta oficios y jamás sobrepasa nivel 5. **No la habilitaría antes de que todas las casas puedan alcanzar nivel 5 con cartas normales.** Hoy tres casas no pueden. La opción cosmética es por tanto la recomendación inicial; no se elimina la idea del usuario sin compararla, pero no se da por equilibrada.

### Probabilidad: escenarios, no una tasa aprobada

Suponiendo variante independiente por apertura, sin pity ni garantías:

| Probabilidad hipotética | Primera variante: mediana / P90 / P95 aperturas | Sin ninguna tras 100 |
|---|---|---:|
| 0,1% | 693 / 2302 / 2995 | 90,48% |
| 0,5% | 139 / 460 / 598 | 60,58% |
| 1% | 69 / 230 / 299 | 36,60% |

`P(ninguna en n)=(1-p)^n`; cuantiles geométricos exactos. Una variante de una identidad concreta tiene probabilidad `p/29` en el modelo uniforme. Al 0,5%, completar las 29 variantes elegibles tendría esperanza aproximada de **22.978 aperturas**. Harry no está en la tabla: su variante ni siquiera sería obtenible por ese mecanismo. No diseñar un contador de completitud total imposible.

Frente a las 108 aperturas de mediana para las 30 identidades del estudio A67, 0,1% convertiría la muestra especial en algo que la mayoría ni verá durante ese objetivo. No elegiría una tasa por sonar «increíblemente rara». Estudiaría primero 0,5–1% como sensibilidades cosméticas, sin establecerlas ni traducirlas a horas. Las colas anteriores no modelan ingresos, energía o sesiones y no demuestran retención.

Dos etapas autoritativas —identidad y variante— permiten conservar las probabilidades marginales de cada personaje, si así se decide. Guardar `variantId`, versión y resultado con la copia/receipt antes de animar. Mostrar en el libro tanto probabilidad de variante como conjunta; independencia explícita, ningún reroll al recargar. Variantes antiguas ausentes significan «normal/legacy», sin sorteo retroactivo. No cambiar permanentemente una copia histórica por una tirada del cliente.

### Apertura excepcional propuesta

Conservar continuidad caja → sello → tapa → rana → carta. Misma geometría y feedback reconocible; el resultado excepcional se comunica cuando aparece la carta:

1. Sello/tapa/rana conservan el ritmo base y omisión inmediata.
2. Carta de perfil, pausa expresiva **máximo 120–180 ms**, giro y entrada del arte alternativo 350–450 ms.
3. Ribete de forma distinta y halo iridiscente **localizado**, barrido único 450–650 ms. No flash global ni partículas perpetuas.
4. Personaje protagonista y etiqueta breve «Cromo Encantado». Asentamiento 250 ms, acción disponible sin esperar a un final decorativo.

Presupuesto de diseño: extensión total ≤700 ms sobre la apertura equivalente normal, máximo 24 partículas/3,2 s como límites existentes, sin aumentar resolución del canvas ni añadir otro contexto. Son objetivos, no medidas actuales. Nuevo/repetido y especial/normal son ejes distintos: una copia especial repetida tiene acabado distintivo sin otra ceremonia larga. Variante no debe eclipsar la rareza o identidad.

Reducido/omisión/fallo de arte: carta estática, marco distintivo y etiqueta; si falta el atuendo, retrato base + marca de variante conservada. No perder el premio, cambiar el sorteo ni anunciar éxito antes del commit. Cambio de idioma/pack, consulta histórica y recarga no reinician celebración.

## 7. Recursos y compatibilidad

No se produjo ningún recurso. Muestra propuesta antes de lote:

| Recurso | Especificación inicial | Consumidor / fallback |
|---|---|---|
| Cuatro medallones de casa | Fuente SVG por capas, viewBox 128, lectura 24–32 px, dos estados contorno/relleno, forma distinta además de color; texto HTML separado | Mapa, cartas, preparación; nombre localizado si falta |
| Libro docente | Reutilizar libro actual antes de otro asset; distinguirlo del acceso a reglas | Inspector y preparación; símbolo/texto |
| Dos perfiles de impacto | Un atlas/texture existente adaptado, recorte transparente ≤128 px por muestra, sin filtros costosos | Escena sobre log; contacto DOM estático |
| Una variante excepcional por paquete | Retrato/figura/thumbnail con dimensiones reales de los roles actuales, composición y márgenes equivalentes; no exigir doble resolución | Revelación, colección y arena; base + sello |
| Acabado excepcional | SVG editable del marco/sello y textura pequeña transparente ≤256 px si hace falta | Barrido finito y estático; sin WebGL nuevo |

Conservar fuentes, piezas, pivotes, versiones, dimensiones, procedencia y peso. Objetivo orientativo ≤250 KB por nueva imagen de muestra y ≤50 KB para efectos compartidos, a revisar frente a calidad real; no son tamaños medidos. Pipeline gratuito del proyecto, no generación con créditos. La producción propia no acredita licencia de franquicia.

**Paquetes:** las reglas pertenecen al dominio con IDs estables, no a `characters.json` de presentación. Misma pertenencia mecánica y variante para ambos paquetes; ARCANA proyecta casas a compañías originales con nombre/emblema propios, sin cambiar miembros ni potencia. Un `merlin` del dominio es Dumbledore en Diagon: no inferir su casa consultando el nombre neutral Merlín. Validar cobertura total y explícita de ambos packs, no generar etiquetas desde nombres o imágenes.

**Históricos:** campañas activas y BattleLogs conservan afinidades/reglas anteriores; nuevo esquema de tipos solo en expediciones nuevas bajo versión explícita. Metadatos biográficos no reescriben sus eventos. Copias antiguas pueden participar en nuevas reglas mediante un snapshot de pertenencias al iniciar run, conservando su snapshot de obtención. Definir ese mecanismo, en vez de reescribir cada copia histórica. Variante aleatoria pertenece a la instancia, nunca se deduce del catálogo nuevo.

No reiniciar campaña ni primeras victorias por nueva versión táctica. Persistencia de variante, concesión y operación atómica; concurrencia, respuesta perdida y reintento recuperan el mismo resultado. Un pase de presentación no debe tocar economía ni importar estado manipulable del cliente.

## 8. Orden y puertas de validación antes de implementar

1. **Taxonomía y cobertura:** revisar los 30 personajes, representación temporal y ejes descriptivos. Resolver Flamel/Fleur, condiciones del quinto miembro y política de duplicados. No aprobar un tipo inalcanzable o un personaje estrictamente dominado por falta de etiqueta.
2. **Banco de combate real:** misma colección/semillas/condición/equipo/rivales, baseline y candidatos; 3/4 miembros, mixtos, caídos, temporales, duplicados, cruce Gryffindor+Profesores. Comparar victorias/empates/PM/PV/turnos, no solo daño agregado. Incluir sinergias sin valor en escenarios reales; eliminar/rediseñarlas.
3. **Acceso por ruta:** ofertas y formaciones iniciales reales, elecciones de ambos candidatos, cuenta inicial/intermedia/amplia y todos los desafíos. Medir posibilidades de construir cada plan y premios indirectos; no modificar drops para ocultar un sesgo.
4. **Una muestra integrada:** mapa → Pacto → cambio visible → preparación → activación confirmada → consecuencias en arena → cierre. No un cromo bonito aislado. Comparaciones de reglas compartidas y snapshot efectivo.
5. **Identidad visual de ataques:** dos perfiles primero, pausas/2x/omitir/reducido/fallo de renderer, todas las unidades/PV visibles; métricas desde la acción, sin trasladar cargas al mapa. CI Linux serial protegida, no en este Mac.
6. **Variante cosmética:** una muestra por paquete, guardado/recuperación, libro de probabilidades y denominador de colección separados. Determinar acceso de Harry antes de prometer todas las variantes. Resonancia de poder solo después de comparar su dominancia y acceso normal.

Aceptación técnica posterior: ES/EN/swap invariantes; asignar/consultar/cancelar no consume; rechazo antes de commit y respuesta perdida después; dos pestañas, log/versiones, estado histórico, claves de operación y premios únicos; PG/Redis reales cuando cambien contratos. UI móvil, teclado/foco/toque, texto ampliado, arte ausente y reducido. No se ejecutaron estas comprobaciones futuras en este análisis.

Hipótesis humanas: (1) el jugador anticipa qué gana al alcanzar tres sin abrir una explicación larga; (2) conservar un especialista sin completar casa sigue siendo una elección comprensible; (3) una variante cosmética resulta deseable sin sentir que la copia normal quedó obsoleta. Sesión posterior de 10–15 minutos con elección de Pacto, preparación y apertura declarada de ensayo; no afirmar diversión con combinatoria.

## 9. Fuentes y reproducibilidad

Consulta oficial realizada el 18 octubre 2026. Las fuentes verifican contexto narrativo; los bonos y agrupaciones de combate son **diseño propio propuesto**, no reglas canónicas:

- [Gryffindor, enciclopedia oficial](https://www.harrypotter.com/fact-file/magical-miscellany/gryffindor).
- [Casas de personajes adultos](https://www.harrypotter.com/features/the-hogwarts-house-of-every-grown-up-in-harry-potter).
- [Slytherin, enciclopedia](https://www.harrypotter.com/de/fact-file/magical-miscellany/slytherin).
- [Ravenclaws conocidos](https://www.harrypotter.com/features/famous-ravenclaws-through-the-ages).
- [Cho Chang](https://www.harrypotter.com/fact-file/characters-and-pets/cho-chang), [Cedric](https://www.harrypotter.com/fact-file/characters-and-pets/cedric-diggory), [Sprout](https://www.harrypotter.com/fact-file/characters-and-pets/pomona-sprout).
- [Tonks y Hufflepuff](https://www.harrypotter.com/features/why-tonks-was-a-true-hufflepuff).
- [Beauxbatons: Flamel y Fleur](https://www.harrypotter.com/writing-by-jk-rowling/beauxbatons-academy-of-magic).
- [Moody y su suplantación](https://www.harrypotter.com/features/ranked-the-defence-against-the-dark-arts-teachers).
- [Slughorn](https://www.harrypotter.com/fact-file/characters-and-pets/horace-slughorn).

No se pudo abrir la ficha solicitada de Hannah Abbott; no se presenta esa consulta como verificación. Kingsley/Moody permanecen sin casa verificada en este estudio. No se consultó un wiki comunitario como autoridad.

Comando ejecutado desde raíz: `python3 docs/arcana/traits-synergies-study-2026-10-18/model.py`. Genera [catálogo](CATALOG.md) y [resultados crudos](model-results.json), conserva hashes de contenido, valida cobertura de 30 IDs y tabla uniforme, contrasta un caso geométrico conocido, enumera todas las formaciones únicas y calcula las colas. No modifica archivos de aplicación ni lanza servicios. No se ejecutó build, tests de juego o navegador: no hay cambios de aplicación que validar en esta fase. Los resultados no simulan los nuevos efectos ni tiempos humanos.

**Conservar:** arte ilustrado, cinco puestos, Pactos, objetos, autoridad y snapshots. **Cambiar primero:** lectura de pertenencias/progreso en ruta y una muestra de sinergias realmente distintas. **Simplificar:** evitar moralidad binaria y acumulación de toda etiqueta. **Diseñar después:** cobertura completa, oficios útiles y una variante visual excepcional. **Hipótesis pendientes:** balance, comprensión, deseo de coleccionar y emoción percibida de la apertura.
