# A88 · Skills útiles aplicadas al juego

Implementado; pendiente validar CI e integrar. Esta referencia no acredita todavía ejecución nativa nueva.

Se evaluaron35entradas GameDev deSkillIssue. Se instalaron únicamente tres guías de texto dentro de `.agents/skills/`: auditoría deassets deGameStudios, AudioDesign y PerformanceOptimization deawesome-gamedev. [Evaluación detallada](EVALUATION.md), [revisiones/licencias](SOURCES.json). No se instala otro motor, hooks, agentes, dependencias o configuración global. Podrán detectarse automáticamente en el siguiente turno y se han leído/aplicado directamente ahora.

## Qué cambia en el juego

Ajustes y sus objetos existentes se conservan. Tras elegir audio, el ambiente tiene prioridad y comienza en cuanto está preparado sin esperar un efecto lento. Carga+decode pasan de hasta16cadenas simultáneas a un máximo2, incluso mientras acaba uncontexto anterior. Recursos opcionales fallidos no bloquean el resto de la cola; dispose descarta trabajo que no empezó. Sin cola de golpes pendientes, cambios devoz, mezcla o volumen. Silencio por defecto y antes delconsentimiento, máximo4efectos y1ambiente conservados.

Se eligió este cambio frente a otra generación visual: aporta una mejora funcional reproducible sin rehacer arte que ya funciona, esperar a un servicio, gastar créditos o añadir pantallas. Puede tardar más en tener todos los efectos disponibles; no se presenta como una mejora universal deFPS. [Contrato](CONTRACT.md), [QA y límites](QA.md).

## Alcance de auditoría

Los16WAV activos coinciden con sus manifiestos/fuentes, consumidor y formato. No assets nuevos o cambios alCromodex, casas, criaturas, combate, economía o persistencia. No se reaudita cada pantalla o archivo histórico ni se declara una revisión artística completa. Guía adaptada aPixi/WebAudio: se descartan reglas dePOT/OGG deotros motores.

Antes de integrar se verificará laCI real sobreelcandidato. Escucha, comprensión y dispositivo físico quedan pendientes. No despliegue o publicación.
