# Decisiones y ritmo · A52

14 octubre 2026. Guías utilizadas: Agency Game Designer/Economy Designer y Game Design Workshop, como apoyo al diagnóstico; sin agentes externos, monetización nueva o adopción automática de sus presets. El bucle real es ruta → pacto/duelo/evento → botín → preparar formación o comprar → descubrir. No hay XP/niveles nuevos, trueque o ruta del Bosque jugable.

## Cambios implementados

- Objetivo inicial delante del equipo: iniciar la ruta y reunir tres mediante Pactos. Durante run incompleta se recomienda Pacto solo si uno es alcanzable. Con formación insuficiente sin Pacto disponible, se remite a copias propias; no se ofrece combatir gratis ni se concede un aliado.
- Origen temporal visible: los Pactos amplían esa expedición, los Sapos aportan copias persistidas. Formación y PV son conceptos separados; una copia herida no se presenta como una copia inexistente.
- Nodo disponible con efecto breve y coste de combate5; la selección no consume, confirmación vigente intacta. Objetivo cerrado distingue victoria, derrota y empate.
- Compras y cambios de equipo muestran confirmación guardada; no hay confirmación optimista. Cromodex explica cómo usar copias y muestra selección real/progreso de identidades.
- Taller/Bóvedas destacan su CTA existente con coste/llave; recompensas y consumo siguen en una transacción antes de cualquier efecto.

Hipótesis de UX: una acción siguiente visible y diferencia temporal/permanente deberían reducir la duda inicial. Se necesita observar a Enric/usuarios sin instrucciones; no se ha medido comprensión, diversión o retención.

## Simulación reproducible y separada

```sh
python3 tools/arcana/simulate-balance.py > /tmp/arcana-balance.json
PYTHONPATH=tools/arcana python3 -m game_design_skills_suite.prob_and_economy_sim --dice 1d29 --trials 10000 --seed 52 --export-json
```

El primer comando lee la configuración vigente; el segundo usa el módulo instalado de la suite para comprobar una selección equiprobable de29. MIT, solo biblioteca estándar. El modelo específico usa `simulate_economy` de esa suite y Monte Carlo local con semilla52/3000 trayectorias por escenario. [Resultados íntegros y hash de entrada](balance-scenarios.json), [salida de suite](suite-roll.json). No conexión a base de datos, cookies o partidas; stdout es el único resultado del simulador.

29 candidatos actuales, peso1 cada uno; aprendiz fuera de la tabla, 10 Coronas/Sapo. Escenario alternativo duplica solo el peso de comunes en memoria. Descubrimientos siguientes excluyen el aprendiz; el presupuesto cuenta aperturas compradas, sin incluir Sapos de botín.

| Aperturas | Identidades nuevas medias, actual | Copias repetidas medias, actual | Identidades nuevas, comunes×2 propuesto | Coste con precio actual |
|---|---:|---:|---:|---:|
| 5 | 4,68 | 0,32 | 4,64 | 50 |
| 10 | 8,57 | 1,43 | 8,47 | 100 |
| 20 | 14,61 | 5,39 | 14,25 | 200 |
| 40 | 21,85 | 18,15 | 21,18 | 400 |
| 80 | 27,25 | 52,75 | 26,62 | 800 |

En20 aperturas, P10–P90 actual13–16 identidades; ponderar comunes no soluciona la acumulación de copias y retrasa algo la completitud. No recomendar ese cambio como mejora demostrada. Las copias tienen uso hasta cinco puestos; su utilidad marginal posterior merece prueba específica.

Sensibilidad de presupuesto90 días: hipótesis de comprar un Sapo/día y obtener solo recompensa de duelos ya superados (2 Coronas/duelo, 10% de20). Se comparan precios8/10/12 en memoria. Con un duelo/día, faltan490/670/850 Coronas para esa cesta deseada; con tres faltan130/310/490. Con seis, saldos finales410/230/50 desde50 iniciales. Son flujos simplificados con suelo0, no compras realmente autorizadas ni una previsión de retención. Excluyen victorias iniciales, cofres, jefe, energía, probabilidad de vencer, selección de ruta, otros gastos y disponibilidad de días; el simulador no prueba que seis duelos diarios sean viables o deseables.

## Propuestas pendientes

1. Observar sesiones de10–15min: si entienden Pactos, encuentran la próxima acción y comparan equipo antes de combatir. Registrar idioma, ayudas y motivo de cada elección.
2. Medir utilidad de copias con cinco puestos ocupados antes de proponer un canje. Un ratio futuro necesitaría protección de última copia, transacción y simulación propia; no se implementa aquí.
3. Comparar precios8/10/12 solo si aparece una fricción real de ahorro; preservar10 como referencia. No aplicar una rebaja porque un modelo presupuestario abstracto termina en0.
4. Mantener pesos actuales; calibrar rarezas/estrellas y ritmo con juego observado. No añadir pity/garantía/fomo ni convertir recomendaciones de perfiles en reglas aprobadas.

Estas hipótesis quedan pendientes; la entrega mejora lectura y feedback del juego que ya existe.
