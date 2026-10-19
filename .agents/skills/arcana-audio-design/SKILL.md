---
name: arcana-audio-design
description: Audio de juego con consentimiento, buses acotados y continuidad de recursos.
---

# Audio de juego con consentimiento, buses acotados y continuidad de recursos.

Adaptación local A88. Fuente, licencia y SHA fijados en `docs/arcana/skills-audio-2026-10-19/SOURCES.json`. Leer AGENTS.md y los contratos vigentes antes de aplicar. Consultar `references/upstream-skill.md` como guía; esta adaptación resuelve las diferencias de motor y seguridad.

## Límites del proyecto

- React/DOM, PixiJS8, Web Audio nativo, GSAP y reloj de replay existentes. Nada de Godot/Unity/Unreal, middleware, nuevos motores, hooks o delegación automática.
- Presupuesto adicional cero. No interpretar claves API o herramientas instaladas como consentimiento para gastar.
- En macOS no abrir navegadores, capturar, perfilar o grabar mediante rutas alternativas. Solo la excepción original `npm run test:browser:local` cuando proceda; matrices y mediciones gráficas en CI Linux protegida y serial.
- Resultado confirmado antes de animación/sonido. Nunca modificar reglas, azar, inventario o BattleLog para producir feedback.
- Distinguir fuente, medición, inferencia, hipótesis y cobertura ausente. No convertir tests o capturas en percepción humana.

## Aplicación

Revisar consentimiento antes de contexto/descarga, buses/ganancia actuales, mezcla, límites de voces y trabajo de carga/decodificación, fallos, pausa/ocultación, omisión y desmontaje. No exigir música adaptativa, aleatoriedad de tono o cambio de curva de volumen solo porque lo propone upstream. No retrasar impactos esperando sonidos. Toda escucha humana debe declararse por separado de análisis PCM o reproducción técnica.

Antes de corregir, reproducir el riesgo con recursos retenidos/fallidos y acciones reales. Validar que un canal listo no espera recursos opcionales de otro, que el trabajo está acotado y que apagar no produce audio tardío. Mantener Ajustes existentes y ES/EN.
