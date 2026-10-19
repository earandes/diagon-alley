---
name: arcana-asset-audit
description: Auditoría de assets activos de los paquetes Pixi/DOM y audio, con presupuestos verificables.
---

# Auditoría de assets activos de los paquetes Pixi/DOM y audio, con presupuestos verificables.

Adaptación local A88. Fuente, licencia y SHA fijados en `docs/arcana/skills-audio-2026-10-19/SOURCES.json`. Leer AGENTS.md y los contratos vigentes antes de aplicar. Consultar `references/upstream-skill.md` como guía; esta adaptación resuelve las diferencias de motor y seguridad.

## Límites del proyecto

- React/DOM, PixiJS8, Web Audio nativo, GSAP y reloj de replay existentes. Nada de Godot/Unity/Unreal, middleware, nuevos motores, hooks o delegación automática.
- Presupuesto adicional cero. No interpretar claves API o herramientas instaladas como consentimiento para gastar.
- En macOS no abrir navegadores, capturar, perfilar o grabar mediante rutas alternativas. Solo la excepción original `npm run test:browser:local` cuando proceda; matrices y mediciones gráficas en CI Linux protegida y serial.
- Resultado confirmado antes de animación/sonido. Nunca modificar reglas, azar, inventario o BattleLog para producir feedback.
- Distinguir fuente, medición, inferencia, hipótesis y cobertura ausente. No convertir tests o capturas en percepción humana.

## Aplicación

Raíces activas: `src/arcana/presentation/content-packs/` y `src/arcana/presentation/audio/`. Fuentes/manifests en `design/`; no confundir fuentes históricas con descargas de runtime. Resolver consumidores mediante imports/manifiestos/configuración efectiva, no solo búsqueda literal del nombre.

Medir archivos reales (bytes, formato, dimensiones, transparencia, WAV frecuencia/canales/duración) con herramientas locales sin navegador. Comparar con presupuestos aprobados del incremento; si no existen, marcar NO EVALUADO, no inventar un aprobado. Pixi/WebP transparentes no requieren POT ni convertir a PNG/OGG por defaults de Godot.

Conservar procedencia, licencia, fuente editable, variantes, pivotes y fallback. Revisar una muestra en contexto usando evidencia Linux permitida, sin atribuir calidad artística a un detector. Esta skill audita; los fixes deben tener autorización de la tarea y aceptación independiente. No borrar posibles huérfanos automáticamente.
