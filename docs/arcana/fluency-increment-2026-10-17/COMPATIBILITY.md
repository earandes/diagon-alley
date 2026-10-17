# A73 · Compatibilidad y recuperación

A73 cambia únicamente presentación y verificación. No añade migraciones, snapshots, versiones de campaña, probabilidades, premios, habilidades o equipos. No importa estado económico local. Los árboles protegidos se comparan por objetosGit, además de ejecutar las integraciones reales. El resultado continúa guardándose antes de presentar la arena; ninguna métrica o frame concede recursos.

## Propiedad de recursos

No se añade caché ni pool. Cada escena sigue siendo propietaria de su Application, Graphics, Sprites y texturas. Conserva resolución, renderer, fuentes y número de figuras. Las imágenes se solicitan al entrar en la misma escena; no se precalienta la siguiente ni se traslada carga a preparación/mapa.

La nueva cola conserva como máximo un callback de display. Cuando hay ticker activo no crea otro frame: invalida para el siguiente tick existente. Pausar vacía la cola de inmediato y representa el snapshot actual; ocultar/desmontar cancela el callback. La cola no lleva tiempo de replay ni decide fases. El reloj compartido sigue siendo el único tiempo del BattleLog.

La comparación geométrica ignora cambios que no modifican la figura/plataforma: fase, PM o PV mientras la unidad sigue en pie. Conserva invalidación por orden, identidad, arte, puesto/encuadre, vivo↔caído, tamaño y llegada de textura. Actor, objetivo, daño, curación y pose siguen leyendo current y el reloj en cada paint; no se memorizan resultados de combate.

## Recuperación y fallback

Consultar, cancelar, omitir, cambiar idioma/pack, recargar o consultar historia sigue sin emitir una operación económica adicional. Los fallos de import/renderer/arte conservan DOM, controles, registro y resultado confirmado. El cambio de pack conserva la destrucción y creación con el frame vigente; no reutiliza texturas del paquete anterior.

No se reclama ausencia global de fugas. Los contadores solo describen recursos propios; la revisión de código y los casos de ciclo de vida no miden el procesoGPU ni todos los recursos internos del navegador.

## Cobertura separada

- Pruebas nuevas: invariantes de geometría y agrupación/cancelación de callbacks.
- Integraciones reales existentes: atomicidad, idempotencia, concurrencia, respuesta perdida, primera/repetida, consumos y snapshots;78casos correctos localmente.
- Linux: matriz completa y comparación del candidato corregido pendientes al redactar; resultados finales se registran en VALIDATION y REPORT.
- Revisión independiente de código: sin otro defecto demostrable tras corregir el receptor nativo. La carga durante pausa temprana está cubierta por A69; carga durante ocultación y resize durante pausa no tienen una comprobación específica nueva.
- Humana, lector audible y dispositivo físico no realizados.

## Candidato mínimo posterior a los ensayos

La pequeña Map de imágenes pertenece únicamente a una escena: conserva promesas mientras init y decode se solapan, y se vacía al fallar/desmontar. No sobrevive al cambio de paquete ni genera una textura GPU tras destroyed. No es un pool de contextos ni caché entre pantallas.

El límite8 pertenece al renderer recién creado y se aplica antes de su primer draw. No modifica un ajuste global, el catálogo ni la cantidad de actores. Las máscaras/Graphics conservan su shader; lotes adicionales son un coste posible comprobado en Linux. El DefaultShader de Pixi tiene caché de módulo: todos los consumidores Application del juego pasan por el mismo límite; no se introduce una segunda política incompatible.

Se retiraron atlas/certificados alfa y sus adaptadores activos. No cambia un solo bitmap ni fuente editable. Mapas, figuras y máscaras mantienen las mismas geometrías ilustradas originales.

El ticker estático no sustituye el reloj: update representa una vez cada acuse; spell-cast/healed/burn-tick y entrada mantienen frames. Ocultar/desmontar cancela callbacks propios. La carga y el resize durante pausa conservan invalidación única; no se reclama cobertura visual de cada combinación hasta registrar la matriz final.

El ensayo de uso inmediato de imágenes resueltas preserva el catch de Texture.from también en el camino síncrono; una textura fallida conserva el fallback sin reintentar continuamente. loading/textures y destroyed garantizan instalación única y ausencia de alta tardía después de desmontar. Su aceptación dinámica todavía está pendiente; tipos no acredita conversión/visualizaciónGPU.

## Política final de carga y formas

Dos fuentes listas se admiten por paint, sin await del conjunto ni temporizador. Las restantes mantienen dirty y usan el ticker existente o un único rAF diferido si está pausado. Una promesa pendiente solo invalida; una fallida permanece sin reintento continuo. Hidden conserva trabajo pendiente sin dibujar; visible reanuda; destroy cancela el callback y evita altas tardías. El ensayo15 de ciclo de vida comprobó esas combinaciones enfixtureChromium, visibilidad sintética y390/865, con estado/log yresultado intactos.

Ink/sparks tienen batchMode público. Mantienen exactamente fills/strokes/paths y orden de escena, incluida máscara de brazo independiente; se evita usar el shaderGraphics32 observado antes. El coste de empaquetado/buffers se mide enA/B y la matriz visual debe comprobar ambas presentaciones. No se altera configuración global o API privada.
