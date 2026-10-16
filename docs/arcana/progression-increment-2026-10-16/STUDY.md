# A67 · Complejidad, dificultad y progresión

16 octubre 2026. Estudio de código y escenarios puros reproducibles. No entrevistas, tasas de victoria humanas o demostración de diversión. Las recomendaciones se contrastan con implementación y QA en el informe del coordinador.

## Qué existe y qué significa complejidad

**Hechos:** una región,16 eventos posibles distribuidos en7filas y exactamente7 eventos por camino completo. El generador permuta eventos enteros y conserva IDs de victoria. Empieza1 copia propia; explorar admite1–5 y combatir exige3–5, con dos Pactos tempranos accesibles. Tres Pactos ofrecen pares temporales fijados; cuatro duelos tienen familias Fuego/Vanguardia. El jefe A65 es un trío neutral. HP/PM se conservan durante ruta; al comenzar otra expedición se preparan de nuevo copias propias a salud completa. La colección y las instancias de equipo permanecen; temporales no se convierten en colección.

| Dimensión | Estado comprobado A65 | Interpretación / oportunidad |
|---|---|---|
| Comprender reglas | Copia/temporal, HP/PM/energía, tres afinidades, equipo y consumo de gragea son conceptos distintos | Introducirlos en contexto reduce carga; más sistemas no equivale a mejor profundidad |
| Decidir | Formación1–5, equipo por instancia, tres ofertas dobles, refugioHP/PM, ruta y consumibles | Ya existe agencia; falta que amenazas tardías y equipo obliguen a reconsiderar planes |
| Ejecución | Combate automático, orden por iniciativa, objetivo primer rival vivo; pausa/2x no cambian resultado | Destreza de reflejos no es el reto; la preparación debe explicar el desenlace |
| Dificultad | Dos líderes de catálogo y neutral débil por duelo; jefe3 neutrales80HP/poder6 | El jefe puede exigir menos contrajuego que un duelo. Colecciones de5 reducen mucho la presión |
| Duración | Rutas7eventos; premios únicos y repetidos distintos;29identidades sorteables | Terminar ruta, dominar región y completar colección son escalas diferentes |
| Espera | Energía50, coste5/batalla, +1/12min | Una hora por batalla recuperada desde0 es espera, no profundidad táctica |

**Motor real revisado:** orden descendente `speed+broomInitiative+Sombras`, desempate por ID lexical; objetivo primer vivo en orden de formación, no selección inteligente ni elemental. Hechizo cuesta1PM, daño de varita compartido. Alquimia3 cura3 por acción propia; Fuego2 provoca quemadura2; Sombras1 suma2iniciativa al equipo. La sinergia se fija al iniciar combate y no desaparece al caer un integrante. Todas las unidades comienzan nivel1; rareza no añade potencia. Una gragea sortea uno de4efectos equiprobables:25%curación, primerturno×1,3daño, dos turnos iniciativa×0,85 o fallo primer hechizo. No inventamos resistencias, tanques, sanadores dirigidos o habilidades nuevas.

**Límite real:** la iniciativa y el foco al primer vivo producen discontinuidades: ganar un turno o conservar un integrante puede importar más que unos puntos de daño. Esto permite especializar equipo sin XP. Alquimia suele recuperar mejor con heridas; Sombras disputa orden a salud plena. Los consumibles son riesgo y preparación, no un buff garantizado.

## Experiencia buscada y decisión

Primero aprender con margen, luego reconocer amenazas y elegir un compromiso, después escoger una exigencia mayor de forma explícita. Mantener una misma región y los premios actuales. Se recomiendan tres variantes opcionales visibles antes de confirmar la expedición; no adaptación oculta a número de victorias, colección, dinero o resultados.

- **Descubrimiento:** introducción de duelo sencilla en filas tempranas; posteriores familias existentes; jefe un líder de catálogo y dos neutrales históricos. Enseña lectura y recuperación sin nueva potencia.
- **Táctica:** familias existentes; jefe cuatro integrantes, dos de catálogo y dos neutrales históricos. Preparación, reserva y condición ganan importancia.
- **Maestría:** amenazas tardías con tríos de catálogo y jefe cinco; requiere plan de afinidad, orden y recuperación. Aviso visual5rivales y preparación recomendada5, sin imponer un raro o pieza concreta.

Los eventos cambian de fila al generar. Por eso la presión debe derivarse de **la fila real del grafo generado**, después de `randomizeRoute`, y quedar congelada en la run. Un supuesto “primer duelo” identificado por `pasaje:2:0` sería erróneo. Los niveles económicos mantienen IDs/versiones: el desafío no concede otra primera victoria.

## Escenarios y evidencia

`tools/arcana/a67-study.mjs` importa el motor A65 congelado y el generador congelado; nunca abre API, DB o cuenta. La referencia contiene JSON económico/catálogo, ofertas, motor/funciones compartidas, sinergias A65 y PRNG. Hashes en `evidence/reference/hashes.json`. El motor de HEAD es A63 idéntico para estos efectos; las sinergias se copian del estado A65. El estudio conserva explícitamente qué versión usa, sin depender de cambios simultáneos de A67.

Se emparejan semillas de ruta0–127 y se enumeran caminos legales. Cada camino pesa igual; no es una frecuencia humana. Cinco políticas: primer candidato disponible/cantidad, preferencia Alquimia, Fuego, Sombras y referencia de preparación por amenaza. Esta última ve el siguiente duelo del camino ya enumerado: es una referencia con conocimiento del camino, no predictor en la interfaz. Recluta hasta5, pasa encuentros, curaHP en refugio. No compra equipo o consumibles. Modos sin gragea o una ganada por combate, a salud inicial100% o60%. El60% es condición adversa artificial, no cambio del inicio real.

Colecciones declaradas, equipo del kit solo sobre aprendiz:

- Inicial: aprendiz.
- Intermedia: aprendiz, Circe, Guardián de las Brasas.
- Amplia sin raros: aprendiz, Merlín, Flamel, Circe, Morgana.
- Duplicados reales: aprendiz, dos copias de Merlín. No se fingen copias extra de aprendiz no sorteable.

Los planes de rivales se construyen con estadísticas existentes: no se multiplican HP/poder. Gragea es la única extracción de azar del combate en estos escenarios; repetir seeds sin grageas prueba distribución de rutas y estabilidad, no128combates aleatorios independientes.

| Perfil | Inicial Alquimia: victorias /1171 | Intermedia Alquimia | Amplia común | Monedas repetidas medias iniciales | Semillas iniciales con algún camino ganado /128 |
|---|---:|---:|---:|---:|---:|
| baseline | 830 | 1169 | 1171 | 14.52 | 128 |
| discovery | 806 | 1171 | 1171 | 14.65 | 128 |
| tactical | 359 | 1111 | 1168 | 12.51 | 126 |
| mastery | 0 | 246 | 345 | 10.40 | 0 |

320 filas ×1171 caminos =374.720 evaluaciones de ruta (4contenidos ×4colecciones ×5políticas ×2condiciones ×2modos de gragea), más combates aislados. Son ejecuciones técnicas, no374.720partidas humanas. La referencia reproduce exactamente830/1171 de A65 para kit/Alquimia/saludplena/sin grageas, comprobación cruzada de recuperación incluida.

La variante inicial conserva una vía en128/128semillas y una intro sencilla, pero no hace ganables todos los caminos:806 frente830A65. Táctica reduce ingreso inicial14,52→12,51 aunque los premios sean iguales; con colección intermedia Sombras mejora1120/1171 frente1111Alquimia y conserva másHP agregado266,21 frente261,10. Maestría inicial no tiene camino ganado con kit fijo; se ofrece como reto explícito con5rivales anticipados, no siguiente paso obligatorio ni requisito de colección. Con cinco comunes hay345/1171caminos ganados y al menos uno en107/128semillas: la región no garantiza recuperación de cada rama.

Las grageas y condición60% se conservan desglosadas en calibration.json. No se elige solo la política o seed favorable. No existe una tasa objetivo de diversión. La política amplia de cinco mantiene miembros fijos, por eso cambiar preferencia de Pacto no altera esa fila: no es prueba de equivalencia entre candidatos.

 `calibration-original-row.json` conserva un experimento descartado que graduaba por posición original; no se usa como aceptación final.

## Pruebas de decisiones sin rareza requerida

Con salud plena y solo kit en aprendiz, el jefe de cinco (Circe, Brasas, Cobre, Tormentas, Bruma) tiene vías de victoria con cinco comunes: aprendiz+Merlín+Flamel+Circe+Morgana acaba175HP; aprendiz+Merlín+Paracelso+Morgana+Bruma acaba155HP en la caracterización declarada. Alquimia3+Fuego2 sin Sombras pierde en otra composición común. Es diferencia medible de orden/sinergia; no prueba que una persona lo descubra o prefiera.

Estas cifras son ensayos aislados con IDs de fixture estables; la aceptación de ruta utiliza IDs reales de candidatos porque el desempate lexical importa. No se exige esa composición exacta y no se revela un resultado aleatorio futuro.

## Evidencia → problema → propuesta → resultado → comprobación

1. **A65 cinco copias comunes reducen presión** → repetir con colección amplia usa decisiones ya resueltas → dificultad opcional con más unidades/combinaciones → motivos tácticos para preparar, sin cifras maestras nuevas → comparar mismas semillas/colecciones y mantener vía ganadora común.
2. **Jefe neutral y duelos con sinergias** → clímax poco relacionado con preparación → líder/afinidad y tamaños de bando anticipados → usar lo aprendido en jefe → efecto reconocible en BattleLog y UI, escenarios de5×5.
3. **Tres núcleos mismo coste/bonus, Dragón mayor multiplicador** → opciones dominadas → compensaciones horizontales versionadas en equipo → iniciativa frente a daño, con renuncia real → situaciones donde cada receta gana por alguna métrica, comparar antes/después con función compartida.
4. **Dos sobres con idéntica tabla1/3** → repetir contenido no aumenta decisión → encuentros con personajes y costesHP/PM conocidos → decidir según condición → consultar/cancelar no muta; preview=receipt; trade no mata ni produce moneda nueva.
5. **Cola de colección exacta larga** → confundir suerte/repetición con dificultad → separar claramente dominio de región y descubrimiento → expectativas fiables, sin recortar pesos ni prometer pity → distribución exacta y escenarios financieros en COMPLETION.md.

## Qué conserva y qué no resuelve

Conservar precios, pesos, energía, cantidades de premios y estadísticas maestras significa conservar también las asimetrías económicas: cofre10+gragea frente a duelo repetido2; jefe repetido5 sin llave/rana. Los desafíos no tienen premio extra; por tanto su incentivo es voluntario y la ruta segura puede seguir siendo la mejor para coleccionar. No falsear ese límite prometiendo que Maestría sea la vía óptima de farmeo.

La cola de duplicados sin conversión permanece. Completar colección no exige “superar Maestría”; tampoco completar Maestría garantiza colección. No hay contenido infinito dentro de una región finita. Escalabilidad conseguida es contenido/versiones de encuentros, especializaciones y composiciones ampliables con pruebas, no crecimiento automático sin límite.

## Preguntas para observación humana posterior

¿Se reconoce que elegir desafío cambia la exigencia sin dar otro botín único? ¿Cuándo compensa curarHP a costaPM? ¿Se ve por qué la iniciativa permite sobrevivir? ¿Cambiar equipo se entiende antes del combate? ¿Repetir una región aporta un plan o solo dinero? ¿Cuándo el duplicado deja de sentirse útil? ¿Qué espera la persona al ver “legendario” si todas las identidades tienen igual probabilidad? Medir duración de cada decisión/pausa; los tiempos de COMPLETION son supuestos, no observaciones.

## Contraste de los intercambios nuevos

36celdas adicionales ×1171caminos =42.156evaluaciones emparejadas. Se usa `previewEncounterTrade` compartido: se consultan opciones/portadores elegibles y se elige el mayor `ΔHP +2·ΔPM` positivo; si no existe, se pasa. Ese peso es una heurística declarada de conservación, **no** valor óptimo de unPM ni regla nueva. No conoce el siguiente resultado o adversario para elegir el trato.

| Perfil / cohorte,100%HP,sin gragea | Ganadas pasando | Ganadas con política de condición | Intercambios medios por camino | Monedas repetidas medias con intercambios |
|---|---:|---:|---:|---:|
| discovery/initial | 806 | 805 | 0.176 | 14.63 |
| discovery/intermediate | 1171 | 1171 | 0.128 | 16.51 |
| discovery/broad | 1171 | 1171 | 0.136 | 16.51 |
| tactical/initial | 359 | 371 | 0.218 | 12.55 |
| tactical/intermediate | 1111 | 1122 | 0.171 | 16.30 |
| tactical/broad | 1168 | 1168 | 0.166 | 16.50 |
| mastery/initial | 0 | 0 | 0.193 | 10.40 |
| mastery/intermediate | 246 | 263 | 0.184 | 12.62 |
| mastery/broad | 345 | 425 | 0.166 | 13.33 |

La política mejora varias situaciones de Táctica/Maestría y pierde una ruta de Descubrimiento: la consecuencia tiene coste real, no beneficio garantizado. A PMllenos, enfoque puede ser inútil; a HPllenos, curar no aporta. No afirmar que cada oferta convenga siempre. El modelo financiero de COMPLETION conserva pasar encuentros para separar fuentes monetarias y no atribuir a la heurística un comportamiento humano.

## Reproducción y comprobaciones del estudio

Node24.20.0 y Python3.14.2 locales, sin paquetes nuevos. Desde raíz:

```sh
node tools/arcana/a67-study-checks.mjs
A67_SEEDS=128 node tools/arcana/a67-study.mjs
python3 tools/arcana/a67-completion.py
```

El segundo comando escribe `calibration.json` y `route-bank.json`; el tercero debe ejecutarse después de que termine para leer el banco completo. El constructor de perfiles se importa de la implementación; la referencia anterior de combate/datos está congelada. `study-sources.json` permite identificar código utilizado. Los scripts solo escriben su carpeta de evidencia; no conectan servicios ni tocan saves. Los logs y JSON sirven para cotejar cifras, no sustituyen integración PostgreSQL/Redis, inspección visual o sesión humana.

Checks independientes correctos:30catálogo/29elegibles/tabla uniforme, tamaños3/4/5, premios y stats maestros conservados, dos planes íntegramente comunes ganan el jefe de Maestría, referencia no modificada. Cadena exacta cotejada con1y2cupones; calendario cotejado con tres intentos de25energía: una visita necesita esperar y dos intentos/día no, respetando capacidad50. Los intentos exploratorios descartados no se cuentan como aceptación.

Limitaciones adicionales del benchmark: no retira copias a reserva ni reemplaza temporales al llegar a5; refugio siempreHP, no estrategia óptima dePM. Combate y ruta usan el mismo índice de seed para emparejar escenarios, mientras la autoridad obtiene sus semillas de forma independiente. Eso puede correlacionar sabores en el benchmark; no se utiliza para estimar probabilidades de colección (calculadas aparte con RNG independiente y fórmula exacta). Los IDs propios de fixtures son estables, no una muestra de todos los posibles desempates lexicales de cuentas reales. La formación inicial con aprendiz/Pactos sí conserva sus IDs reales de contenido.

## Investigación del referente sin repetirla

Se reutilizó [A60, observación directa del15octubre](../pokelike-2026-10-15/POKELIKE-ANALYSIS.md), sin nueva visita al sitio: no había una operación concreta pendiente que justificase entrar en una sesión ajena. Ese informe registra captura entre3candidatos, preparación explícita de jefe, condición entre encuentros y derrota con repetición; documenta ayudas/tienda de duplicados sin afirmar canjes ejecutados. No demuestra tiempos de completar PokéLike ni sus garantías económicas.

| Referencia útil | Adaptación en este incremento | Qué no se adopta |
|---|---|---|
| Preparar jefe con condición acumulada | Perfil y rivales anticipados, especialización con consecuencia en el log | XP o crecimiento de atributos para desbloquear el derecho a ganar |
| Varios candidatos de captura | Conservar oferta doble A65 y hacer útiles los planes que construye | Copiar personajes o pasar de2a3por imitación |
| Objetos con destino claro | Forjar→comparar→equipar→reconocer efecto | Bolsa nueva o configuración en álbum |
| Objetivos de modos persistentes | Dificultad voluntaria en una región con mismos derechos de premio | Más monedas, diarios o recompensas por cambiar desafío |
| Ayuda muestra utilidad de duplicados | Documentar cola real y decisión económica pendiente | Afirmar que vimos/evaluamos su canje ni implantar conversión aquí |

La investigación que resuelve duración aquí es código+modelo de nuestro catálogo y economía; copiar un precio o regla visible de otro juego no estimaría nuestras horas o colas. Las conclusiones históricas se identifican por fecha y no se presentan como verificación del referente actual.
