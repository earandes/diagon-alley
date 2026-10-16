# A59 · Del panel al lugar jugable

15 octubre2026. Encargo autorizado por16anotaciones del propietario sobre entrada, mapa, ajustes, formación, tiendas, álbum, misiones y revelación. Es evaluación directa del propietario de apariencia/comprensión, no prueba moderada de retención.

## Estado inicial y diagnóstico

A58: personajes pintados y apertura fluida; el resto presenta paneles opacos, múltiples fondos con diferentes recortes, tabs de tiendas, details anchos y controles de equipo dentro del álbum. Las capturas aportadas911×1079 evidencian entrada casi vacía, discontinuidad arriba, CTA/controles que no encajan en marcos, falta de elección explícita del equipo y símbolos genéricos. A58 no se sobrescribe. Captura técnica aislada en5240 antes de editar; nunca se usa la pestaña/partida del propietario5194.

## Decisiones y acciones observables

1. Entrada con callejón continuo y ambiente ligero (luz/bruma/destellos), CTA entrar. Se elige animación de capas existentes sobre vídeo por interacción, coste/transferencia, responsive y reducido. No importar clips de películas ni generar con créditos. Fondo único por escena y HUD anclado, sin reset de background en header/main. [C1,C2]
2. Ajustes como estuche/libro de preferencias: opciones completas dentro de marco, tarjetas de idiomas/mundos, movimiento como objeto; cerrar/Escape/foco y es/en conservados. [C3]
3. Preparación antes de expedición: elegir conscientemente copias propias disponibles (sin elección inicial automática en la vista); Aprendiz/Harry sigue siendo el kit en autoridad, no selector gratuito de30personajes. Inicio usa start-run existente con1–5copias. Dentro del mapa puede cambiar formación/equipo entre nodos; temporales separados y sin conversión en propiedad,3–5para duelo. Configuración sale del álbum, que queda consulta/descubrimiento. [C4,C7]
4. Nodos con objetos regionales diferenciados (varitas/hechizo,caldero,carta encantada,baúl,encuentro,marca oscura), silueta y material coherentes; IDs/semilla/grafo/efectos intactos. [C5,C13]
5. Sabores: receta/objeto consultable a demanda, no franja details; colección derivada de receipts actual. No inventar nuevos sabores o canje. [C6]
6. Callejón previo como tres escaparates seleccionables hacia interiores reales. Volver al callejón, transición ligera y deep links conservados. Compra mediante pieza/moneda/coste explícito; apertura separada y confirmada. Probabilidades por libreto ilustrado consultable, derivadas de tabla actual. [C8,C9,C10,C12]
7. Bóveda como puerta/cerradura/llave: estado cerrado/sin llave/confirmación/resultado claros y objetivo de jefe accesible. No gastar por explorar/animar. Equipo propio y botín consultables sin panel continuo. [C11]
8. Misiones como atlas de viaje y regiones actual/futura con estado honesto. Un único mapa jugable, sin desbloqueo ficticio. [C14]
9. Celebración por rareza y formas/intensidad además de color, acotada y sin otro contexto WebGL. Común discreta,Inusual verdiazul,Épico amatista,Legendario oro. Acciones de resultado como cromo al álbum y continuación ilustrada, costes/rareza/estrellas semánticos. Reducido/omitir sin confeti; no repetir por idioma/swap. [C15,C16]

## Garantías y recuperación

Solo presentación/navegación: reglas, precios, RNG, versiones de balance, inventario y autoridad PostgreSQL/Redis sin cambios. Las operaciones actuales siguen idempotentes y postcommit; navegar/consultar/cancelar no consume. Cambio de idioma/mundo conserva vista/intención/receipt; fallo de guardado nunca éxito visual. Escenas ausentes conservan contraste/acciones. Error/estado incierto mantiene recuperación actual y no reenvío ciego. No publicar/desplegar/push, servicios/skills solo proyecto y gratuitos.

## Aceptación y evidencia

Situación: cuenta nueva con kit real. Acción: entrar, elegir copia e iniciar. Resultado: ninguna run antes de confirmar; un start-run y mismo kit, equipo explícito. Cancelar/idioma no escribe. Cuenta con run existente: mapa intacto, preparación a demanda, ninguna regeneración.

Situación: visitar callejón/tienda, libreto o bóveda sin llave. Acción: consultar, volver, Escape. Resultado: sin consumo y foco al objeto. Con saldo/llave, confirmación explícita, receipt y recarga exactos.

Verificar ES/EN, ARCANA swap, teclado/Escape,911×1079/1280×900/390×844, zoom200% y movimiento reducido. Capturas antes/después separadas, pruebas funcionales con sesiones propias, tipos/unitarios/integración/build/PWA pertinentes, rendimiento de ambiente y apertura. No atribuir automatización a usuarios, viewport a dispositivo físico o atractivo a retención observada. Documentar resultados reales y propuestas pendientes.

## Acabado de ejecución C12

Tras la primera revisión, las tres puertas con interiores repetidos seguían pareciendo paneles. Se producen tres fachadas pintadas nuevas offline con el mismo modelo/pipeline gratuito A58, sin tocar sus fuentes. Muestra de Dulcería inspeccionada y elegida por el integrador antes de las otras dos. Arquitectura violeta/verde/marfil distinta, rótulos HTML fuera de imagen; maestros, crops, SHA y modelos/licencias registrados. Tres exports suman132.282bytes. ARCANA conserva la alternativa de puertas/interiores existente. En390px se recorre la calle por desplazamiento horizontal nativo, con foco/teclado y escaparate vecino visible; no se aplica scroll al mapa. No se prometen regiones o tiendas sin comportamiento.
