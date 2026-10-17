# A71 · Antesala y actor ilustrado · contrato previo

17 octubre 2026. Base `dffd6ae`, rama `feature/boss-stage-a71`, dependiente de A70 sin integrar en main. Autorizados diseño, producción mínima gratuita, implementación y validación. Rama/PR para CI Linux permitidas; no merge en main, despliegue o publicación. Árbol tracked limpio al comenzar; evidencia histórica/untracked ajena intacta. Goal explícito de este incremento; recorrido técnico resuelto con la evidencia final registrada abajo.

## Estado comprobado y experiencia

Los findings de `boss-style-review-2026-10-17/REPORT.md` siguen vigentes: jefe pequeño entre filas desplegables, equipo representado por acceso rectangular y grageas por contador asignados/stock; arena con grandes celdas seleccionadas. Cuerpo plano y piezas pequeñas de libro/cuenco A70. No hay textbox/checkbox real en esta superficie; los controles semánticos se conservan.

Queremos reconocer amenaza, equipo y coste en una escena de confrontación. Se comparan A) antesala enfrentada, rival protagonista arriba/derecha y equipo propio en primer término, libro/tarro integrados; B) gabinete central con estantes laterales, más compacto pero cercano al configurador. Elegida A por jerarquía y adaptación móvil, sin introducir otro paso ni intro obligatoria. Hipótesis de comprensión/personalidad, no observación humana.

## Recorrido y resultado observable

Mapa → consulta de la formación rival guardada → equipo propio/objetos → preparación existente → confirmación explícita con coste → BattleLog confirmado → cierre y botín existentes.

- Rival grande y acompañantes secundarios identificados; libro consulta stats y sinergias compartidas. Equipo propio con retratos, condición, procedencia, gear y gragea en borrador. Activar un retrato abre preparación, no escribe.
- Tarro junto al equipo; stock ×N separado de asignaciones, texto completo accesible. Desplegar/quitar/cancelar no consume ni descubre sabores.
- Una acción de desafío con coste visible; volver/Ajustes secundarios, foco protegido. Vacíos consultables no parecen tareas obligatorias.
- Actor circe/Hermione-Circe: muestra de recorte pintado con encuadre medio coherente en ambos packs. Brazo/objeto separado solo si la pintura permite un retoque local de la zona oculta con acabado suficiente. Fuentes/máscaras/transformaciones CPU editables. No inventar rig anatómico ni una pose por inclinar el retrato. Inspeccionar muestra estática antes de integrar/ampliar.
- Anticipación → extensión del objeto → trayectoria → contacto → reacción → reposo/caída sobre reloj y log existentes. Sin nuevos efectos de reglas/audio/filtros/contextos/relojes. Reducido/fallo conserva figura estática, PV, controles y registro.
- Selección actor/objetivo localizada en arena, sin ocultar integrantes; cierre aligera únicamente tarjetas relacionadas, manteniendo prioridad del botín real.

## Persistencia e invariantes

No se añade estado económico ni de partida. Las únicas selecciones locales siguen siendo borradores existentes; formación/gear conservan sus comandos explícitos. Cancelación, idioma, pack, consulta histórica, recarga y omisión no conceden ni consumen. No se modifican dominio, servidor, catálogo, composiciones, stats, premios, costes, energía, snapshots ni versiones históricas. Arte/renderer nunca decide el resultado. Se mantiene recuperación de operaciones y dos pestañas.

## Aceptación y comprobación

- Una jerarquía principal: rival, equipo y desafío; sin columna dominante de campos. Todos los actores, afinidades conocidas y datos completos disponibles.
- 1–5 miembros propios/temporales/duplicados, caídos y reservas; inventario vacío/con grageas y cancelación. Reutilizar preparación/equipo y cálculos compartidos.
- Coste, confirmación y operación pendiente/error accesibles; foco vuelve al origen correcto incluso desde diálogos anidados.
- Muestra a tamaño real de arena, ambos packs; reposo sin duplicaciones/huecos y objeto legible, gestos distintos sobre eventos reales. No modificar retratos de colección.
- ES/EN, ambos packs, 1280×900/390×844/865×1079, teclado/toque emulado/texto ampliado/reducido. Detalle puede desplazarse; no esconder actores para caber.
- Replay inmutable y resultado neutral hasta finalizar; pausa temprana,2x,oculto,inspector,skip,swap,recarga,arte/import/renderer fallidos. Primera/repetida/derrota/empate conservados.
- Tipos/build/content/unitarios; pruebas de autoridad pertinentes sobre PG/Redis reales y recorridos/regresiones Linux en serie con guard/watchdog/sin reintentos. Capturas seleccionadas explícitas, sin matrices/grabaciones extensas.
- Medir acción→utilizable, carga/arranque/replay/pausa/omisión/limpieza en condiciones comparables A70. No confundir rAF con tiempo GPU o contadores propios con prueba de fugas globales.

No gráficos locales salvo excepción original `test:browser:local` cuando proceda; no se necesita para diseñar. No instalar dependencias ni cerrar procesos ajenos. Humana, lector hablado y dispositivo físico pendientes explícitos.

## Plan vivo y responsabilidades

1. Completado: fuentes/contrato/aceptación y dos composiciones.
2. Implementado: TDD focalizado, antesala y muestra CPU; root integra App/grageas/arena/cierre; agente staging dueño BossPrelude/BossPartyStage/CSS específicos; agente actor dueño boss-art/motion/Pixi/fuentes. Muestras CPU inspeccionadas: primera Circe rechazada por escala facial/costura; segunda recorta bastón/faldón intencionadamente y mejora objeto. Integración permitida como muestra, no arte final/humana.
3. Comprobado localmente sin navegador: tipos/build/packs/scanner y554unitarios correctos, seis assets269.284B con fuentes/máscaras/hashes reproducibles. Preflight permitido sin abrir navegador. Ningún agente inicia baterías gráficas.
4. Completado: PR4 apilada sobre A70, CI38988996115 íntegramente correcta en445d6f4/mergeffb9094:554unitarios,77integraciónPG/Redis y263navegador ejecutados;15skips de muestreo deliberados. Se corrigieron grid/footer, separación de autoridades para cuota, identidad/Ajustes, tarro móvil y reparto denso5×5; se reforzaron200% y límites internos de figura/nombre/PV sin ocultar información. Intentos previos conservados, ninguno contado como aprobado. Workflow/guard intactos.
5. Completado: seis PNG Linux seleccionados inspeccionados; recursos/fuentes/manifiestos, mediciones crudas y resúmenes, compatibilidad y límites archivados. PRD/DECISIONS/DESIGN coherentes. Actualización documental posterior conserva objetos de código/config/assets/pruebas ensayados, sin repetir gráficos por documentación. Entrega en rama/PR, sin main/despliegue/publicación. Observación humana, lector hablado y dispositivo físico siguen pendientes expresos, no se cuentan como pruebas realizadas.
