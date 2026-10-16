# Recorrido técnico A53 · antes de observación humana

14 octubre 2026. Revisión sobre A52 sin cambiar comportamiento. Perfil propio CLI `arcana-a53`, preview compilado5195 y PostgreSQL/Redis reales. Ventana emulada390×844 en ordenador, español; resultado de bóveda también en inglés. No representa teléfono físico ni sesión con personas. El participante confirmó ordenador y tiene un objetivo1 pendiente en el registro separado.

## Recorrido ejecutado

Entrada con kit normal → iniciar run → Pactos0:0/1:0 → duelo2:0 → comprar/abrir Sapo → añadir copia propia → forjar/equipar varita → cofre3:0 → refugio4:0 → cofre5:1 → jefe6:0 → canjear llave en Bóvedas → recargar/cambiar idioma. Acciones normales por UI, sin editar saldos/azar o conceder recursos con fixtures.

| Hito | Estado servidor observado | Evidencia |
|---|---|---|
| Primer duelo | Victoria,29 eventos, equipo aprendiz +dos temporales | [snapshot](technical-current-snapshot.txt), capturas confirm-pasaje-2-0/after-pasaje-1-0 |
| Compra/apertura | 60Coronas, dos copias; Herborista Lunar/Inusual/2estrellas obtenida por azar | [receipt](technical-opening.json), [captura](capturas/05-recompensa.png) |
| Incorporación/forja | Cuatro miembros en run,45Coronas después de forjar por15 | [estado](technical-formation-forge.json), [capturas](capturas/07-forja.png) |
| Equipamiento y jefe | Varita propia guardada en copia nueva; run ganada,115Coronas y una llave | [estado/log](technical-equipment-boss.json), [equipo](capturas/08-equipo-guardado.png), [jefe](capturas/09-jefe.png) |
| Bóveda | Llave1→0,115→190Coronas en resultado de ensayo; dos copias conservadas | [comparación](technical-vault-reload.json), [resultado](capturas/12-botin-boveda.png) |
| Recarga/idioma | Estado completo JSON idéntico al confirmado | [comparación](technical-vault-reload.json), [EN](capturas/13-vault-en.png) |

No se encontró un bloqueo funcional en este recorrido concreto. No prueba todas las rutas, derrota, cinco miembros o recuperación ante fallos. Las suites A52 son evidencia previa, no se declaran reejecutadas por esta revisión documental.

Los primeros macros tuvieron errores de instrumentación: URL relativa sin base, intento de comenzar una sesión ya existente y lectura prematura de receipts. No son errores de la aplicación. Se continuó en el perfil de auditoría con pasos UI delimitados y lectura tras confirmación; las capturas/receipts finales anteriores son evidencia válida. No usar las salidas `technical-walkthrough.txt`, `macro-attempt-2.txt` o `technical-continuation.txt` como pase completo ni métricas de tiempo. No se modifica la sesión del participante.

## Hechos técnicos e hipótesis para contrastar

| Hallazgo | Hecho comprobable | Hipótesis, pendiente de participante | Cambio candidato, aún no seleccionado |
|---|---|---|---|
| Preparación del duelo sin consumibles | Con cero tarros, modal muestra tres selectores «Sin Gragea», explicación y disclosure además de confirmar | Ruido y desplazamiento para una elección que no puede cambiarse en ese momento | Resumen compacto cuando no hay consumibles; conservar asignación cuando sí existen |
| Reproducción del combate | Logs de29 y71 eventos; intervalo normal650ms/evento | Una reproducción larga podría sentirse repetitiva o incentivar omitir | Claridad del tempo/duración y controles; no cambiar resultado o daño |
| Ruta ramificada | En configuración actual, las opciones de cada fila desembocan en las mismas opciones de la siguiente | El jugador podría esperar consecuencias de ruta futura que el grafo no tiene | Explicar consecuencia inmediata y ayudas para comparar; tocar el grafo sería decisión aparte |
| Colección y preparación | Incorporar/equipar requiere filtrar/inspeccionar una copia y confirmar cada guardado; la forja se entrega aparte | Puede no quedar clara la diferencia entre poseer, incorporar y equipar | Continuidad contextual desde recompensa/forja hasta preparación |
| Copias repetidas | Dos aliados temporales con misma identidad; dos copias propias en esta muestra son de identidades diferentes | No permite afirmar utilidad de un duplicado propio observado | Mantener duda abierta y observar si aparece naturalmente; pregunta hipotética explícita si no |

Duración nominal del replay, no espera medida ni obligatoria:29×650ms=18,85s y71×650ms=46,15s a1x; a2x serían aproximadamente la mitad. El usuario puede volver/omitir, el cálculo excluye carga/pausa/render y no es una medición de aburrimiento. Se deja como señal para preguntar solo después de su experiencia.

Las capturas inmediatamente posteriores a cerrar un modal pueden capturar transición de layout/scroll; no se interpreta un frame incompleto como un hueco estable del juego. Los hallazgos se apoyan en controles/textos/log/configuración, no en atribuir una experiencia subjetiva a ese frame.

## Próximo paso

Completar la sesión moderada en `SESSION.md`. Elegir tres mejoras vinculadas a sus observaciones y/o fallos técnicos reproducibles, definir aceptación y escribir pruebas antes del código pertinente. Mantener las candidatas sin aprobar hasta entonces. Precios10/pesos1 y todas las reglas permanecen intactos. Simulaciones A52 siguen disponibles, sin una nueva propuesta de balance aplicada.
