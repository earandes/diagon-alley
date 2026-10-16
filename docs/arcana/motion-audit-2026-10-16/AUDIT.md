# A69 · Auditoría consolidada de movimiento

16octubre2026. Fase de análisis completada antes de editar aplicación. [Fuentes y alcance](CONTRACT.md), [inventario completo de pantallas y condiciones](SCREENS.md), [recursos activos](ASSETS.md), [tecnología/fuentesoficiales](TECHNOLOGY.md), [diezfichas](MOTION.md), [prioridades](BACKLOG.md), [validación](VALIDATION.md). La ejecución posterior estáautorizada por la última instrucción delmensaje deEnric; los resultados se añadirán porseparado, no reescribirán esta auditoría como observacióndinámica.

## Diagnóstico

La limitación principal no es falta de librerías. Ya existen Pixi8.22, GSAP3.15, Motion14.2(mini), CSS y Canvas2D. La unidad de dirección debe ser el evento confirmado y su desenlace visual. Hay cuatro relojes distintos (timerReact, tickerPixi, GSAP yCanvas2D), estadosCSS de ingreso porremount y nuevasacciones sin una consecuencia material inequívoca.

Hechos en fuente:
- `BattlePanel.tsx`146–155 programa cadaeventocompleto alreanudar/cambiarvelocidad; `pixi-scenes.ts` tiene elapsedpropio. No mismo reloj, ningún handler explícito paraoculto. La trayectoriaactual incluye unsegundo proyectildesdeelobjetivo sin que elBattleLogcontenga contrahechizo. PropuestaM01 elimina esaambigüedad, noañade skills.
- `CardReveal.tsx` mezclaetiquetasabsolutas conparámetrospack. `revealedMagic` evitaunhalo repetido, no la secuenciainicialGSAP alremontar. `FrogMagic`ya esCanvas2D acotado: no volveraWebGL/GlowFilter, dondeA58documentóeltirón.
- `SceneCanvas.tsx` cancela/destruyealunmount/contextlost e inicialización tardía; `pixi-scenes.ts`destruyetexturas propias. Mantener esa frontera yno liberar cachésglobalescompartidasindiscriminadamente. Falta detenerdeformaexplícita eltrabajopresentacionalalocultar.
- `CommercePanel.tsx` animaresultado coincidente conreceiptactual sinonceID; `closure-spoils` animaalremount. Sonconsulta histórica que puede parecerconcesiónnueva. `Celebration` yA68 ya tienenprotecciónparcial deID: unificarcriterio.
- `SceneAtmosphere`se montaenApp yusaCSS; oculto/reducido estántratados, pero laelección delprotagonista no esuniforme. Que unloop esté detràs no lohacegratis.
- Assetsfigurasonrecortesplanos; caja/tapa/sello sonpiezasseparadas. Esposiblepeso/lanzamiento/rotación, no unaactuaciónanatómica sin producir capas/fotogramas.

Interpretaciónexperta: movermenosperoenelmomentocorrecto hará más legibles loshechizos y lasrecompensas queaumentarconteodechispas. Hipótesis noobservada: esa mejora hará más satisfactorio elegir/preparar/coleccionar; requiereobservaciónhumana.

## Cobertura y límites

F: verificado por código/manifiesto/lockfile. H: evidencia histórica apuntadaenSCREENS/ASSETS, con suSHA/entorno/límite. NV: faltaejecuciónactual. Capturasestáticas no se cuentancomomovimiento. La revisión nueva no abre navegador enMac; A68ya alcanzó watchdog enlaampliación, sinrelajación deguard. No videos/capturas nuevas locales, WebKit ni matrices. PNGofflineA68 no esReact niaprobacióndiseño.

Comprobacionesanteriores útiles: A58 apertura≈60FPSdesktop trasCanvas2D ypico16.8msChromium/35–37msWebKit, no físico;A63arenadosbandos/5×5fixtures;A67CILinux sobremainanterior;A68smokebásico4.1s, ampliacionesdetenidasporRAM. Ningún dato se convierte enmediciónA69 ovalidacióndelábolnuevo.

## Qué conservar, rehacer e investigar

Conservar Teatrodealquimia, ilustraciones/IDs, faltadeventaja porrareza, Canvas2Dapertura, Pixi mapa/arena, GSAPcontext, Motionmini, semánticaDOM, guardadoantesdefeedback, estático/omisión/recuperación. No añadirRive/Lottie/filterplugin como soluciónpredeterminada.

Rehacer coordinación delreplay ypasos deapertura, exclusióndeanimacioneshistóricas, jerarquíadefocoambiental yfeedbackcontextual. Primeraunidad: arena1hechizo→resultado y unaaperturanueva/repetida, validada enLinux; despuésfeedback reusadoensalidas realesdeljuego.

Investigar mediante muestra, no lote: rana3–5poses o piezas conpivotes/cubrirhuecos; cofreconbase/tapareales; tinterodepapel ymetal. Su producciónrequierecontrolencontexto/pesosyprocedencia; lasplanasactualesno se declaranrig. Audio siguepropuestaindependiente sinimplementación.
