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

## Correcciones derivadas de la validación final

- Encuentro: A67 reprodujo overflow922–947pxfrente863px. Se compacta texto de procedencia a posición/sello/etiqueta breve, conserva fuente completa accesible/ayuda, PV/PM/costes/unitId y no se relaja el límite de encaje. No lote de arte nuevo.
- Recuperación: prueba REDdemostró statusError caducado persistente tras loadválido; se limpia solo después de estado correcto/propietario validado. Rechazo conserva error, receipt y key.38casosdirigidos GREEN; UI del mismo propietario añadida en inglés.
- E2E: tests históricos usan copy actual y afirman conservación del diálogo/producto al reconsultar; no se cambia producto para satisfacer selectores antiguos.
- `git diff --check 937a0a1 HEAD` identifica dos avisos de whitespace en logs históricos A74 (`build.log:350`, `unit-tests.log:17`), incorporados byte a byte. Se conservan sin reescribir evidencia. El diff propio de código y documentación no añade esas advertencias.
- `playwright-safety.ts` conserva hashSHA256d6c7f8cd700bb351ebf339e9ffb6682cd61fd4af464e0cabaeff3ec0d7dcaed5, idéntico albaseline. No navegadorMac, cambio global o weakening delguard.
