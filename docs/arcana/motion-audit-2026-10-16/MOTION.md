# Dirección y diez fichas de coreografía A69

## Gramática: magia con causa, peso y reposo

Papel: flexión breve y asentamiento, nunca gelatina. Metal/madera: recorrido corto, contacto legible y retorno. Magia: nace del objeto/actor, recorre una dirección y termina en su objetivo. Personas: traslado del recorte y peso de la peana; no fingir rodillas/manos articuladas desde un bitmap. Un evento tiene un foco, como máximo dos capas de respuesta y una consecuencia visible. Estado de error/pendiente es estable; no tiene confeti de éxito.

IntensidadI cotidiana80–180ms, desplazamiento1–4px/escala.98→1; II táctica180–420ms,6–12px y sello local; III descubrimiento450–900ms de resolución, no mayor espera de red; IV excepcional600–1400ms solo en rareza/jefe/recuerdo nuevo, sin fullscreenflash. Son objetivos de diseño, no datos medidos. No loops nuevos. Ease-out para asentarse (`cubic-bezier(.16,1,.3,1)`/`power3.out`), ease-in para lanzamiento corto, back moderado solo en objetos elásticos. Variante reducida: mismo estado y foco, sin trayectoria/escala/temblor. Audio no implementado ni activado.

## M01 · Arena: un solo tiempo de presentación

**Antes/evidencia:** BattlePanel.tsx146–155 avanza cursor consetTimeout; pixi-scenes.ts acumulaelapsed porTicker. Pausar/reanudar vuelve a dar intervaloentero alDOM conservando elapsedCanvas; ocultar no suspende explícitamente ambos. La trayectoria actual pasa por centro y el golpe tiembla antes de que termine el evento. Hecho de código; nueva desviación temporal aún no medida en ejecución.

**Después/sensación:** intención, impulso, contacto y peso claramente del mismo hechizo. Anticipación0–18% (actorinclina2°, retroceso2px); lanzamiento18–78% (hazfino curvo desdeactor aobjetivo, sin proyectil rival ficticio); contacto78–90% (anillofinito localizado yrecorte4–7px); asentamiento90–100%. Duraciónguía650ms1x/325ms2x delpack. Fallo se desvía sinimpacto; curación aroascendente local, burnbrasa breve, manaexhausted sinproyectil, caído rota6°y atenúa sinocultarPV; logexistente, sin cálculo de daño/RNG.

**Capas/tech:** figuras actuales/pivotes, GraphicsPixi de bajo coste, deltaDOM yHPproyectados delBattleLog. Tiempo deevento conservado por reloj puro compartido con renderer; no60rerendersReact/s. Pausa/inspector/oculto congelan fracción,2x mantiene fracción, omitir salta afinal. Reducido/fallorenderer resultado+registro sinespera. Limpieza ticker/RAF/observer/texturas.

**Aceptar:** mismo cursor/fracción alpausar100ms/reanudar o cambiarvelocidad; oculto noavance; ceroPOST durante replay; actor ytargetcorrectos antes/contacto; ≤1efecto protagonista,10figuras visibles, mismoslogsaldos. MuestraLinux antesde ampliar efectos. No shake global/hitstop bloqueante enestaentrega; estudiar solo si contacto aún insuficiente.

## M02 · Apertura: objeto→rana→carta→identidad

**Antes:** CardReveal usaabsolutos0.4/0.85/1.1/2.15/3.2 másduracionespack; todasrareza comparten ritual yremount puede repetirlo. FrogMagic3200ms propio, no ligado a faseGSAP. A58 midió que Canvas2D evitaba eltirónWebGL; conservarlo.

**Después:** cajaaprieta sello120–180ms; sellocede conimpulso; tapa pivota sobrebisagraexistente ysale; rana comprime/salta/aterriza/huyedel mismopunto; dorsocarta ocupa su espacio y girafrente; marcoasienta y nombre/rareza/estrellas cierran. Descubrimiento nuevo tieneascenso deintensidad por cuatro rangos existentes; copia repetida resuelve más rápido con estampa breve, sinfingir identidadnueva. Guía ritual1.8–3.8s segúnnuevo/rareza, ajustado trasmuestra, nocosteeconómico.

**Tech/assets:** GSAPcontext/timeline conetiquetas derivadas deconfig, Canvas2D24spritesmáximo duranteventana significativa; rango modificaresolución/silueta/númeroacotado, no nuevo renderer/filtros. Una rana plana se deforma comoobjeto; patasanimadas requerirían nuevaspiezas (propuestaASSETS).

**Interrumpir:** omitir/reducido/recuperar muestranmisma carta; salirlibera. Idioma/pack/retornohistórico no reinician; pestañaoculta pausa o concluyeestáticosegúncontrato explícito, nunca salta un resultado distinto. Decodificaciónfallida no bloquea estático, ni se precargaotra pantalla paraocultararranque.

**Aceptar:** unaoperaciónmismaID antes/después; pose/tapaseal rastreables; fotografíaresultado final visible sin salto; comparación frío A58 desdeacción+red+decode+ritual; sin reintroducir la tarea>200ms. Medir1new+1repeat+4rangos porfixtures declaradas, no reponderar tabla.

## M03 · Mapa: la ruta responde a la decisión

**Antes:** Pixidibuja aristaspunteadas porvisited/available; estático y eficiente, sintrazo direccional deconfirmación. **Después:** alreceipt nuevo, últimoenlace se traza180–300ms desdeorigen hacia visitado y el nodoasienta1.04→1; los siguientes nodos aumentancontraste una vez. Inicio permanece nointeractivo.

**Assets/tech:** puntos/Graphics actuales o únicoSVGpath decorativo del layout compartido, no textura nueva. No reroute, noanimartransiciones deconsulta. EventID/visitedlongitud controlaonce, preservapausaoculto, reducido cambiaestado directo. **Aceptar:** coordenadas igualDOM/canvas,ningúnnodo tapado, mapacompleto sin scroll, ≤300ms ytickerparado alfinal; elección/cancelación no trazaavance.

## M04 · Pacto: de retrato a acompañante

**Antes:** selecciónsello yconfirmación, resultado textual/miniaturaenHUD sinpuenteclaro. **Después:** eleccióneleva carta4px/140ms, reversa alescogerotra; trasconfirmaciónretrato vuelve aescala1 con sello ypuesto delHUD asienta220ms. No hacer una carta volar porencima dediálogos/navegación ni simular queyaestá reclutada duranteborrador. Procedenciareloj/temporal permanece.

**Assets/tech:** retratos/thumbnail actuales, CSS/WAAPI/Motionmini acotado porIDdeoperación. Reducido/foco conservan sello/estado. Sustitución muestra puesto real, no elimina copia. **Aceptar:** cancelar sin traslados permanentes; solo candidato confirmado reacciona; idioma/pack/navegar no repite; equipofull/reemplazo validanreglas actuales.

## M05 · Refugio y encuentro: se ve lo que cambia

**Antes:** preview exacto pero paso decondición/resultadopoco material. **Después:** elecciónPV/PM respira una vez130ms, confirmacióndetieneobjeto, ganancia verde asciende4px y costePMseasienta2px durante240ms; después valoresguardadosestables. Distintos signos/etiquetas, no solo color. Encuentroaleatoriolegacy usaúnicamente receipt yefectoreal, no una ruleta nueva.

**Assets/tech:** medallones/frasco/refugio actuales, deltasDOM yfunción compartida; no animar números pasando por cifrasficticias. Reducido númerofinal+signos. **Aceptar:** previewyresultado exactos, sin éxito antesCOMMIT;0beneficio/ineligibilidadsinanimaciónengañosayopciónpasar legible.

## M06 · Cofre, forja y bóveda: acción material confirmada

**Antes:** CommercePanel vuelve a ejecutar popGSAP alremontar receipt; grantvisual puede parecer nuevo. **Después:** úniconuevorecibo dispara cierre/impacto deobjeto160ms yresultadoasienta240ms. Forjavaritaaparecedesdepeana existente, nofantasearanimacióndeherramientassinassets. Bóvedallaveseñala cerradura antesdeconfirmar; despuésbotíngarantizadoguardado, no suertevisual secundaria. Cofremuestracantidadesconorigen.

**Tech:** pequeñas transformaciones delPNG/DOMexistente, sello/costebreve, registrohistóricoestático conID. Sin llave/saldo/error:brilloenobjetonecesario únicofocosemántico, nuncafalsaconcesión. **Aceptar:** anular conservaestado;misma key/grant no reaniman alconsultar; recuerdoassetfaltante conservaobjeto/nombre/cantidad.

## M07 · Preparación: el objeto encaja y la formación responde

**Antes:** selecciónobjetos/slots ypreviews, movimientogenérico; cambiosinmediatos de sinergia. **Después:** varita/escoba/grageaasientan enpuesto4px→0/160ms; sellodecomposición seentinta180ms cuando cambieefectoreal. Borradordegragea tiene borde/fuente distinto delequipoguardado, sincelebración deconsumo.

**Tech:** CSS/WAAPI porintencióndelusuario ykey deestado, comparaciones de dominio; no copiarstats o engine. Reducido estático. **Aceptar:** 1–5/copiasduplicadas/temporales tienenpuestocorrecto, Alquimia2→3 solo activaelbonusreal, quitar/cancelarrevierteborradorsin consumir/descubrirsabor.

## M08 · Álbum y sabores: hojear, encontrar, reconocer

**Antes:** paginación/filterstate conilustración; sinpaso claro entrehojas ydetalle. **Después:** hoja saliente desvanece100ms, entranteasienta3px/160ms, sin doblaruna sola imagen como libro3D. Ficha seabrirá desdeunmarcodeconsulta ymarca de identidadreciénhallada solo cuando proceda del recibo nuevo, no cada filtro. Saboresreveladossoloactivaciónconfirmada.

**Tech/assets:** DOMgrid/portraitsinvariantes, transformación delcontenido sininterceptarbotones; sin recargar todaspáginas. Reducido instantáneo. **Aceptar:** filtrounopensamientodefoco, no reproduce premio/hallazgoporhojear; 200%texto/empty conserveacciones; no escucha-hoverúnica.

## M09 · Navegación y diálogo: entrar, consultar, volver

**Antes:** transicionesdiversasCSS/GSAP/estadosalgunasloopambientales. **Después:** entrada/interior/cancelacióndeconsulta tienenasentamiento120–180ms ydirección coherente (objetoconsultado seabre desdecentro, salida se disuelve), sin desplazartoda laweb. Pendiente/recuperación sellosinfirmar estático; éxito solo trasreceipt. Errorcon foco yacciónclara, sinshakeglobal.

**Tech:** CSS/WAAPIeventual, sin nueva librería. Cancelar/unmount abortaeffect sinbloquearfocusrestore; navegaciónhashatrásmantienelasrutas. **Aceptar:** transiciones no retardan operación ni dobletap; offline/UNKNOWN_COMMITnocelebran; semanticadialog/teclado permanece; conarti ausente sepuedeterminarelrecorrido.

## M10 · Cierre, Halloween y ambiente: un solo protagonista

**Antes:** closure-spoils340ms se repite porremount;Halloween yasepara grantnuevo/historia; ambientelamparas/mist/motes devarios11–21s permanece detrasdeescenas. **Después:** nuevocierre ilumina botínuna vez260–420ms, suuso esprincipal; consultahistórica estática. Halloween3luces mantienenritmofinito,recuerdo450ms solo grantnuevo. Ambiente se suspende conmodal/replay/oculto/reducido yvuelveaquietud en lugar deañadir másloops.

**Tech/assets:** CSS/finitesello/objetosvigentes + prioridad escena existente. No newtickerparabackground. **Aceptar:** animacionesambientalesdetenidas durantefoco yoculto, ningúncelebrationhistórico, seguimientotrasusarbotínseinforma porstockreal; nextintention no concede recursos.

## Muestra e iteración

Primera muestra implementada en contexto: un hechizo y una apertura normal/repetida con recursos existentes, snapshotsdepruebaetiquetados y cuentaaislada. Capturas seleccionadas de anticipación/contacto/resoluciónsoloLinux;no seconfunden conregistrotemporal. Medirritmoyliberación;revisarantesdeadmitir spritesheetnuevo/rig. Propuestasdeposesarticuladas/audio/quebrado3D quedan fueradelprimerincremento.
