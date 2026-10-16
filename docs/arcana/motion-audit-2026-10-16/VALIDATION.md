# Validación A69 · plan previo

## Riesgos funcionales

UnitariosTDD: reloj mantienefracciónalpausar/2x/oculto, no saltaresultados, clamp0/total, omisiónempotente; recetasdecoreografíaporrarity/new-repeat finitas; guardonce no se rearmaporidioma/pack/montaje; errores/pendientes no disparanéxito. Regresiones dominio yPGRedis reales aunque no se cambieregla, para preservardeA68. Tipos, build,scanner, contentpacks. No testsdeimplementaciónpuramenteespejo.

BrowserLinux compilado: mismoBattleLog/receiptantesdespués, pausa/2x/inspector/oculto/omitir/reducido/contextlost; ES/ENyambospacks;1280×900/390×844/865×1079;3×3,5×3,5×5fixturesdeclaradas;apertura4rangos/nuevo/repetido/recarga/GSAPoassetfallido;nodospacto/refugio/cofre/encuentro,forja/bóveda,yconsultahistóricasinreplay;A68matrizpendiente. Teclado,foco,toqueemulado/texto200%;no evidencia física/humana.

## Medición desde la acción

Frío: antespointer/tecla deconfirmar/abrirreplay→primerobjetointencional→resultadoutilizable; incluirred/commit/import/decode/animación, no movercostoapantallaanterior. Medirbaseyactualenentornoequivalente, conmismafixture/seed ypack, cachefría explícita. Repeticióncaliente10–20s y30reentradas secuencialescontextos sinmatrizcapturas. Fasesnormal/pausa/oculto/2x/omisión/desmontaje. Registrarcuántasmuestras,entorno/SHA/API, P50/P95/pico, no FPSdesdeunticker sinpaint.

Objetivos, **no medidosA69**:
-60Hz:presupuestoframe16.7ms;P95≤20msdesktopemulado, sin nuevas tareas>50msatribuiblesafecto; dispositivos reales porvalidardespués. WebKitlongtaskAPIausentenoseconvierteencero.
-Capaefectos≤2msCPU/frame propuesto;simultáneos1proyectil+1impacto/curación,≤12marcasGraphics deimpacto, FrogMagic≤24sprites/2texturasprepaint28×28; sin Canvasnuevo.
-Arena10texturas de342×428≈5.86MBRGBAdecode como referenciaA58;objetivo≤12MBtexturaspropiasenunaescena, conteoyestimaciónw×h×4 (noGPUtotal),resolution≤2actual. Fondosnosubira4Kporbrillo.
-AperturaDPR≤1.5actual;recursosincrementalescomprimidosobjetivo≤150KB, no lote;JSincrementalgzip≤15KBobjetivoinicial. Builddual14MBnoesdescargainicial.
-Pausa/oculto:cursor/renderCountestablesexceptopaintúnicodeestadopendiente/resize;no rAF/tickermantenidoinnecesariamente. Omisión→estadofinal≤100msobjetivoDOM,sinrednueva. Desmontaje:0ticker/rAF/listener/observerpropio;0texturasvivasdelrendererretirado,memoriapostGCsincrecimientomonótono30ciclos (noexigirGCinmediata).

## Evidencia gráfica y Mac

HOST-INCIDENTvigente. Ningúnnavegadorlocalparaestaampliación; no reinstalar/reconfigurar/falsificarprocess.platform. Linuxunworker, bloquocomún, mediaoff,retries0. Capturasmanualesoptinseleccionadas:1arenaanticipación/impacto/finaly1aperturapeak/resultadoporcontextomuestra, no todamatriz. Capturaestática≠movimiento; medirtrayectorias/transform/duraciónenruntime.

Pushrama devalidación autorizado comopasonecesario haciamain; no pushmain hastaCIcandidataresuelta. Conservartrials aislados, no abrirpartidahabitual. SiCI externano disponible, registrarpendiente yno falsearvalidadocompleto o repetirgráficosMac. Sesiónhumana10minposterior para distinguiractor/impacto/nuevorepetido;no bloqueatécnicapor sísola.

Revisión cruzada antes de CI: se corrigió un posible fotograma con fase nueva y actor anterior, rechazando paints con cursores distintos. Las cifras de impacto conservan una clave por evento/unidad a través de eventos de contabilidad; su ventana CSS de520ms termina en opacidad cero y pausa con la reproducción. Una prueba adicional confirma identidad estable y sustitución por el siguiente cambio real. No cambia HP ni BattleLog. RED inicial: módulo ausente; GREEN:1/1. La primera ejecución CI se canceló antes de usar sus resultados para validar, al incorporar estas correcciones.

La matriz estacional se separa del descubrimiento general de tests porque necesita toque y un calendario declarado. El launcher privado de ensayo admite `ARCANA_TRIAL_CLOCK_ISO`, inyectado exclusivamente por servidor; la configuración A68 fija20octubre2026. Sin esa variable se conserva Redis TIME. Sesiones y límites mantienen su autoridad Redis. No existe control público para cambiar fechas. La prueba HTTP con PostgreSQL/Redis dio un RED real de serverTime y después GREEN; 77 integraciones correctas, incluidos estado y participación con el mismo reloj. La segunda ejecución se canceló para incorporar esta corrección antes de interpretar resultados; no se acredita una suite cancelada.
