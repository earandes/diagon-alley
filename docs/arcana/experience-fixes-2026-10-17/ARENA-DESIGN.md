# F06 · Referencia medida antes de editar CSS

CI Linux39054600466 success, head20cbd68; fase **baseline**, no regresión completa. Runtime/arena idénticos a937a0a1; solo test/instrumentación y contrato nuevos. Seis cargas declaradas de3×3,5×3,5×5 porpack enChromium390×844, sin cuenta/cambios de campaña. Artefacto y crudos en evidence/baseline y baseline-ci.json.

Cabecera50px, encabezado61px, controles50px, stage605px. En5×5 las peanas propias tienen109,4px: figura50,8px, etiqueta20,25px (36,5px nombrepartido) yPV18px. Quedan hasta~19px centrados sin utilidad. El rival reserva65px al actor y50px a otros. Huella alfa de fuente proyectada: propiasDiagon48,2–49,6px;ARCANA39,9–40,4px. No es píxel GPU, rig o memoria: rectángulo alfa>8 sobre fuente estática escalado al alto usado por renderer.

## Alternativas

**A: compactar cabecera y controles.** Recupera algo de altura; riesgo de apretar coste/consulta y sus44px táctiles. No resuelve que un presupuesto fijo de415px y35px poractor ignore nombres reales. Podría conservar el espacio vacío por fila aun ganando altura arriba.

**B: figura ocupa el espacio real restante de cada peana.** Mantener cabecera/controles/tamaño de texto; distribuir figura/nombre/PV con filas de layout, suelo mínimo y adaptación al nombre. Reutiliza las imágenes, centrosDOM yResizeObserver existente. Recupera el espacio medido sin otra lectura porframe. Riesgo: mínimos intrínsecos y texto ampliado; comprobar cinco filas y fallback.

Elegida **B**, acotada a ancho<=620px y formaciones con cinco integrantes en algúnbando. Tres porbando y escritorio conservan la composición previa. La muestra debe mejorar huella visible/mediana en390 sin reducir fuentes, ocultar unidades o invadirPV. Si falla el encaje, corregir la causa enlayout, no relajar el test. Ampliación puede requerir scroll accesible.

Orden autorizado cumplido: medirLinux→comparar→elegir→editar→medir/inspeccionar. Resultado posterior y límites se completarán tras CI; el diseño no declara aún una mejora ejecutada.
