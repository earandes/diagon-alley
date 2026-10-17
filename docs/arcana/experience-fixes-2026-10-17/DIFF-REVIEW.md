# A75 · Revisión de alcance del diff

Revisión del coordinador sobre baseline937a0a1; no una segunda certificación de seguridad ni prueba humana. Estado final de ejecución en QA/REPORT.

- Producto: único cambio de capa aplicación en `GameController`: preservación de snapshot/propietario/receipt al consultar, validación de identidad y preflight de intención antes de nueva entrada explícita. No esquema SQL, endpoint económico, catálogo, campaña, fórmula, premio o motor alterado.
- Entrada: `TrialEntryGate` excluye de forma síncrona la activación duplicada durante POST+carga. No exclusión distribuida de dos entradas vírgenes; límite explícito en COMPATIBILITY. No creación automática de otra partida ante401 ni importación de saldo local como autoridad.
- Preparación: fuente de reglas efectiva única, proyecciones compartidas, filtros conservan `copyId`; ordinal/procedencia no cambia `unitId`. Equipo guardado independiente del borrador de formación/grageas. Propietario nuevo desmonta la preparación anterior.
- Recuperación: aviso en un solo contexto activo de preparación/inspector, sin ocultar salida tras cerrarlo. Consultar/cerrar no aborta un commit ni elimina su key. Económicas siguen confirmándose en servidor antes del resultado visual.
- Ruta: proyección pública sin callback de comando. Relaciones/posición/tipo/amenaza pública; sin semillas, tiradas u ofertas futuras. Visitados se consultan desde libro; bloqueados no se resuelven.
- Presentación: tarro existente compartido, preferencia propia/efectiva diferenciadas y fallback visible de mapa/lista. Ajustes conservó el fallback previo. Solo redistribución móvil de arena; sin modificar renderer, reloj, texturas, movimiento del actor oBattleLog.
- Compatibilidad de pruebas históricas: selectores que significaban «avanzar» pasan de enabled a `data-node-state=available`, ya que futuro habilitado ahora significa consulta. No se elimina un escenario ni se habilita resolver un nodo bloqueado.
- Producción: sin dependencias, assets, audio o configuración global nuevos. Fuentes Word y evidencia previa intactas. A74 documental preexistente no rastreado se incluye como dependencia canónica, sin atribuirle una auditoría nueva ni modificar sus conclusiones.
- Entrega: revisión del diff antes de cada commit, staging acotado, rama/PR sin main. Diagnósticos crudos conservados (algunos comprimidos byte a byte); pruebas fallidas/canceladas no se presentan como pasadas. No navegador local ni procesos ajenos cerrados.
