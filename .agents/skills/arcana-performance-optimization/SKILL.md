---
name: arcana-performance-optimization
description: Diagnóstico medido de carga y rendimiento del juego, sin gráficos locales.
---

# Diagnóstico medido de carga y rendimiento del juego, sin gráficos locales.

Adaptación local A88. Fuente, licencia y SHA fijados en `docs/arcana/skills-audio-2026-10-19/SOURCES.json`. Leer AGENTS.md y los contratos vigentes antes de aplicar. Consultar `references/upstream-skill.md` como guía; esta adaptación resuelve las diferencias de motor y seguridad.

## Límites del proyecto

- React/DOM, PixiJS8, Web Audio nativo, GSAP y reloj de replay existentes. Nada de Godot/Unity/Unreal, middleware, nuevos motores, hooks o delegación automática.
- Presupuesto adicional cero. No interpretar claves API o herramientas instaladas como consentimiento para gastar.
- En macOS no abrir navegadores, capturar, perfilar o grabar mediante rutas alternativas. Solo la excepción original `npm run test:browser:local` cuando proceda; matrices y mediciones gráficas en CI Linux protegida y serial.
- Resultado confirmado antes de animación/sonido. Nunca modificar reglas, azar, inventario o BattleLog para producir feedback.
- Distinguir fuente, medición, inferencia, hipótesis y cobertura ausente. No convertir tests o capturas en percepción humana.

## Aplicación

Definir escena, acción y presupuesto antes del cambio. Usar primero evidencia existente; medir solo en el entorno permitido. Una cuenta de solicitudes/decodes concurrentes mide concurrencia, no FPS ni tiempo GPU. Separar espera de red, promesa decode, tarea principal, rAF y memoria estimada. No prometer mejoras de frame sin contraste comparable.

Resolver un cuello comprobado mediante el cambio mínimo, con propiedad, límite, invalidación y limpieza explícitos. Conservar extremos desfavorables y descartar cambios sin beneficio demostrado. No imponer pools, atlas, precargas o texturas POT cuando no encajan con PixiJS8. No repetir baterías para elegir la muestra favorable.
