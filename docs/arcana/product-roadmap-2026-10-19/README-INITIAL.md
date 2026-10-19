> Versión inicial conservada. El orden vigente está en [PRIORITIES.md](PRIORITIES.md).

# Próximos desarrollos · producto, diseño y análisis de negocio

19 octubre 2026. **Estudio propuesto; no autorización ni implementación de las features.** Baseline de código `d4a6d36fd0b1fb96ab4f3e8a071c88cfc5621f1f`. El alcance de esta entrega es investigar, priorizar y dejar desarrollos verificables. No se ejecutan navegadores, altas externas, migraciones, cambios económicos, commits, push o despliegues.

## Decisión recomendada

El siguiente incremento jugable debería unir **primer recorrido comprensible → plan de compañía → consecuencias reconocibles**: PM02, PM03 y PM06, entregados sucesivamente y sin construir un tutorial paralelo. Antes de cambiar economía o ampliar regiones, conviene observar si las decisiones existentes se entienden y medir dónde se interrumpe el recorrido. PM01 puede empezar con registro manual de ensayo; PM15 no es requisito para diseñar ni probar la aplicación aislada.

El juego ya tiene bastante amplitud de sistemas. La hipótesis prioritaria es que **hacer utilizable y comprensible esa amplitud** aporta más valor que añadir otro catálogo o una nueva moneda. No es una conclusión sobre diversión o retención observadas.

## Documentos para ejecutar futuros incrementos

- [BASELINE.md](BASELINE.md): hechos, evidencia concreta, diferencias entre antecedentes y funciones actuales, carencias de información.
- [FEATURES.md](FEATURES.md): quince fichas con valor, diseño, recorrido, cambios, persistencia, implementación, aceptación, métricas, esfuerzo y riesgos.
- [METRICS.md](METRICS.md): tres indicadores principales, diagnósticos, fórmulas, eventos, cohortes, calidad de datos y límites.
- [DELIVERY.md](DELIVERY.md): orden por recorridos, dependencias, validación técnica/humana y criterios para continuar o descartar.
- [collection_analysis.py](collection_analysis.py) y [collection-analysis.json](collection-analysis.json): cálculo exacto reproducible del catálogo actual, sin cuentas, red o simulación de personas.
- [sources.json](sources.json): fuentes de código/documentos y referencias oficiales consultadas.
- [VALIDATION.md](VALIDATION.md): comprobaciones ejecutadas en este estudio y límites de cobertura.

## Priorización

P0 = habilitador o integridad; P1 = siguiente ciclo de valor jugable; P2 = posterior condicionado a señales; P3 = expansión. No representan severidades de bugs ni compromisos de fechas. Impacto y confianza son juicios expertos, no resultados de un RICE con alcance inventado. Esfuerzo orientativo de diseño+implementación+QA técnico de una persona, con repositorio conocido, sin esperas de CI ni reclutamiento: S 2–4 jornadas, M 5–9, L 10–18, XL 19–30. Son bandas de planificación que se recalibran tras una muestra; no presupuestos aprobados.

| ID | Propuesta y valor esperado | Prioridad / esfuerzo | Dependencias y condición |
| --- | --- | --- | --- |
| PM01 | Medición mínima: decidir sobre evidencia y separar problemas de hipótesis | P0 / M | Definir contrato y ensayo; no requiere proveedor de analítica |
| PM02 | Primera expedición con ayuda contextual: llegar al primer combate con una decisión propia | P1 / M | Aprovechar Pactos/kit existentes; medir antes de tocar onboarding |
| PM03 | Plan de compañía: unir vínculo elegido, reclutamiento y objetivo de otra expedición | P1 / M | Snapshots y reglas compartidas; ampliar intenciones sin premios |
| PM04 | Hasta tres formaciones recordadas: experimentar sin reconstrucción repetitiva | P2 / M | PM03 útil; preferencias por propietario y selección explícita |
| PM05 | Cromodex orientado a un objetivo: saber qué buscar y qué puede hacer con lo que tiene | P2 / M | Catálogo público efectivo y vínculo; no otro gestor de equipo |
| PM06 | Lectura táctica al terminar cualquier combate: reconocer dos hechos y elegir qué revisar | P1 / M | BattleLog guardado; reutilizar hechos del jefe, sin causalidad ficticia |
| PM07 | Diario breve de expediciones: recuperar contexto y contrastar planes | P2 / L | PM14 antes de retener/cargar más historial; PM06 |
| PM08 | Dominio de la región: retos voluntarios finitos con evidencia de realización | P2 / L | PM03/06; desafíos actuales ya existen, no duplicarlos |
| PM09 | Encuentros conectados: una pequeña consecuencia posterior dentro de la ruta | P2 / L | Versionado explícito; calibrar las renuncias y excluir recursos infinitos |
| PM10 | Excedentes y cola de colección: decidir una utilidad sin inflar poder o ingresos | P2 / L–XL | Estudio económico y aprobación específica antes de cualquier canje |
| PM11 | Lectura accesible configurable: contraste y tamaño de texto propios sin abandonar la escena | P1 transversal / M | Ajustes existentes, tokens de ambos packs; pruebas físicas pendientes |
| PM12 | Navidad reutilizable: una aventura corta de entregas sobre la región actual | P3 / L | Aprender de Halloween; presentación nueva, no solo cambiar JSON |
| PM13 | Segunda región con identidad táctica: nuevas decisiones cuando la primera esté consolidada | P3 / XL | Señales de PM02/03/06/08, capacidad de arte y regla de acceso aprobada |
| PM14 | Partida sostenible al crecer: estado acotado e historial duradero sin romper recuperación | P0 investigar / L | Medir primero lectura/escritura y payload; no borrar receipts |
| PM15 | Piloto privado recuperable: personas reales pueden entrar, guardar y volver | P0 para piloto externo / L | Composición HTTPS/correo/backup/coste; no publicar launcher local |

PM10, PM12 y PM13 requieren decisiones de producto adicionales. Una ficha detallada no autoriza reglas económicas, nuevas regiones o publicación. No se añaden XP, niveles persistentes, pity, monetización, trading, PvP, chat o rachas como efecto indirecto de este estudio.

## Valor de negocio en esta fase

No existe un modelo comercial validado ni tráfico de producción revisado. Por tanto, valor de negocio significa ahora: **reducir abandono por confusión, proteger confianza en la colección, aumentar experimentación voluntaria y reducir coste de producir/operar contenido**. No se calculan ingresos, LTV, CAC o rentabilidad ficticios. La monetización y la distribución de materiales siguen fuera del encargo.

Un 100% rápido no se corrige automáticamente haciendo más rara una carta. Debemos separar vencer la región, dominar sus decisiones, completar identidades, probar sabores y poseer variantes cosméticas. El reto debe crecer mediante preparación y elecciones; la cola aleatoria de duplicados no acredita dificultad estratégica.

## Qué conservar, simplificar y aplazar

Conservar dirección ilustrada Teatro de alquimia, ambos paquetes, ES/EN solo en Ajustes, mapa central, objetos/retratos protagonistas, un vínculo por equipo, encantado cosmético, BattleLog confirmado, economía y operaciones recuperables. Simplificar reconstrucción de equipo, ayuda desconectada y explicaciones sin una acción contextual. Aplazar más familias, estadísticas o regiones hasta comprobar que una elección actual cambia el plan y su consecuencia resulta perceptible.

La propuesta no demuestra demanda, diversión o retención. El anexo de validación prepara cómo descubrirlas sin atribuir observaciones a automatizaciones.
