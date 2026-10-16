# A67 · Encuentros, equipo y progresión · 16 octubre 2026

## Autorizado y referencia

Enric autoriza diseñar, implementar, validar e integrar/subir a main encuentros tácticos, especializaciones de equipo y una curva escalable sustentada en estudio de dificultad/completitud. Sin despliegue/publicación. Referencia: A65/A66 locales sobre main97573b0; diferencias previas conservadas en /tmp/diagon-a67-prior.patch y datos de referencia en evidence/reference. Rama feature/progression-a67. Sesiones técnicas aisladas, nunca partida habitual.

## Hechos comprobados y experiencia buscada

Encuentro actual: arriesgar/pasar con efecto sorteado; refugio ya permite PV/PM. Recetas V1 de igual madera/coste/bonus tienen multiplicadores1.2/1.15/1.1: existe opción dominante. Jefelegacy usa tres neutrales y puede ser tácticamente menor que duelosA65. Colección:30 identidades,29 sorteables equiprobables+aprendiz garantizado,4sabores; confirmar modelo completo por scripts.

Buscamos elecciones con costes anticipables, equipos especializados y dificultad elegida conscientemente. No se atribuye diversión o comprensión humana a estas comprobaciones.

## Diseño inicial contrastable

- Encuentros deterministas de sanador/estudioso: recuperar PV a cambio de PM o PM a cambio de PV. Dos ofertas fijas: recuperación focalizada o distribuida; pasar libre. Sin gasto de moneda, botín nuevo o pérdida permanente. Solo vivos, costes no letales, sin cobrar por beneficio nulo. Oferta versionada en snapshot de run, selección provisional y confirmación explícita. Preview y autoridad comparten función pura.
- ForgeV2 independiente: nuevas instancias pueden especializarse en daño/iniciativa/curación con compensación de multiplicador. Mismos precios/IDsde receta; recibos/versiones conservan instancias V1. Calibración fija valores finales. Bóveda/starter históricos no reinterpretados.
- Tres desafíos explícitos de la misma región, seleccionables en preparación y recordados durante la run. Default de aprendizaje, táctico y maestría optativos, sin premio ni energía extra. Contenido tácticoV2 y snapshot fijan perfil/composición al empezar. Misma campaña/levelIDs/derechosde primera victoria. Comparar mismas semillas antes de elegir composiciones.

## Límites y estado durable

Precios, pesos de apertura, botín único, coste/regeneración de energía, catálogo/stats maestras y habilidades generales intactos. No XP/pity/canje/monedas/regiones. No dificultad oculta o reroll al consultar. Runs activas conservan snapshots y reglas; campos nuevos opcionales no invalidan legacy. Guardar resultado/consumo antes de animar, mismas claves recuperan resultado, conflicto si cambia solicitud.

## Aceptación

Cada encuentro: iniciar→consultar→elegir/cancelar→confirmar→verPV/PM/coste exactos→continuar, sin sorteo por consulta ni cobro de beneficio nulo. Cada especialización debe resultar conveniente en escenarios declarados y no cambiar equipo previo. Curvas comparadas en colección inicial/media/amplia, políticas/condición/consumibles distintos, sin depender de raro concreto.

100%definido sobre contenido disponible; percentiles/aperturas/recursos/runs/tiempo activo/espera/calendario distinguidos con supuestos. ES/EN,ambospacks,3viewports,teclado/foco/reducido,errores/cancelación/recarga/respuestaperdida/dospestañas/legacy,PGRedisreal y regresiones. Capturas e inspección real, no mockups ni sesión humana. Tipos/build/pruebas, diffrevisado, mainremotoSHAyCIverificados antes de completargoal.
