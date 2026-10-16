# A48 — Bufos e identidad en arena

12 octubre 2026. Estado inicial: BattleLog guarda sinergias por equipo y CombatInput conserva reglas; la arena muestra una lista global sin equipo, no explicita bonus por peana, y nombres repetidos no identifican actor/objetivo del registro.

Recorrido: reproducir combate confirmado → consumir activación guardada → mostrar tier/miembros/valor en columna y peanas de ese equipo. Antes del evento no hay bonus inventado. Valores provienen de combat.input.rules, nunca configuración actual; activaciones persistidas durante duelo aunque caigan contribuyentes. Engine v1 aplica bonos al equipo completo, también a unidades de afinidad diferente. No recalcular daño/curación/iniciativa o activaciones en React.

BattleReplay proyecta pasivos inmutables; valida activación frente a formación inicial/umbral del engine v1 y rechaza duplicados inconsistentes. Sin eventos nuevos, cambios de balance, API o migración SQL. Copias legacy válidas conservan log; ausencia de activación no se reconstruye como evento.

Arena es/en separa Tu Equipo/Rival, usa Alquimia III/Fuego II/Sombras I, muestra +PV por turno/quemadura/+iniciativa desde snapshot. Afinidad y consumible registrado por unidad; consumible no se etiqueta como bufo permanente. Posición de formación identifica cada actor/objetivo/medidor, aunque compartan nombre.

TDD previo: proyección cronológica/ambos equipos/beneficiario neutral/valores congelados/tier/cursor reversible/duplicados inválidos y DOM bilingual. Pruebas de scroll/foco/200%/contraste/carga y recorrido existente después de implementación, sin fingir RED de refuerzos. Clock/PRNG/tx/stock no cambian. Revisar peanas con texto adicional y mantener DOM/canvas alineados. No paquetes, gasto, publicación o arte nuevo.
