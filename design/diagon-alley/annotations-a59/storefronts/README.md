# A59 · Fachadas pintadas del Callejón

Autoría/preparación15octubre2026. Tres fachadas nuevas con producción local MLX/MFLUX; ninguna imagen A58, personaje o runlog anterior se sobrescribe. Directorio nuevo para maestros, prompts, manifests, exports, contexto y logs.

- Dulcería: madera violeta, ventanas curvas, tarros y cajas, puerta cálida.
- Ollivanders: madera verde bosque, escaparate alto asimétrico, cajas de varitas.
- Gringotts: piedra marfil, columnas, arco y puerta de latón.

Frontal de arquitectura completa, cuento pictórico y pincel, luz ámbar y sombras ciruela. Sin actores/animales, texto/carteles legibles o logo. Nombres y acción se añaden mediante HTML localizado, fuera de los bitmaps. No hay gasto, apertura o recompensa por entrar en una fachada.

Modelo ya instalado en `.tools/diagon-illustration/models/flux2-klein-4b-4bit`, revisión `860e87183ceb29e39627c0612ebd66d8ea66e68c`: FLUX.2 Klein4B cuantizado4bit, Apache2. MFLUX0.22.0 MIT; pruebas de licencia y SHA del modelo referenciadas por `plan.json`. El script verifica los tensores nuevamente antes de generar, usa únicamente archivos locales y ejecuta4pasos con guidance1.0. No APIs remotas, créditos, descargas o cambios globales. La licencia del modelo no acredita derechos de distribución de franquicia; uso privado, sin publicación.

## Comandos

Preparación **sin GPU/import de Metal**:

```sh
python3 tools/visual/diagon-a59-storefronts.py --prepare
```

Solo después de que el coordinador cierre navegadores/benchmarks:

```sh
tools/visual/diagon-mlx.sh tools/visual/diagon-a59-storefronts.py --id confectionery --generate --export --trim-paper --gpu-coordination-confirmed
```

Revisar maestro, export y estudio CPU de contexto. **No producir las otras dos antes de revisión root**. Después:

```sh
tools/visual/diagon-mlx.sh tools/visual/diagon-a59-storefronts.py --id workshop --generate --export --trim-paper --gpu-coordination-confirmed --root-sample-reviewed
tools/visual/diagon-mlx.sh tools/visual/diagon-a59-storefronts.py --id vault --generate --export --trim-paper --gpu-coordination-confirmed --root-sample-reviewed
```

Un intento existente se rechaza; elegir otro `--attempt N` conserva el anterior y cambia semilla explícitamente. No se acepta automáticamente el sufijo `_1/_2` de MFLUX. Se verifica que el archivo exista exactamente en la ruta declarada; maestro y export guardan SHA256, prompt/seed/modelo/revisión/pasos/herramientas y dimensiones reales.

Maestros768×1024PNG, exports430×574WebP opacos (objetivo≤50KB, calidad88→68). No estiramiento; `--trim-paper` retira margen blanco de papel mediante límites arquitectónicos revisados, registra sourceCrop y después centra/ajusta con Lanczos. El maestro y el primer export con papel se conservan. No se incorporan al paquete hasta inspección. Roles previstos `shopfront.confectionery`, `shopfront.workshop`, `shopfront.vault`; ARCANA conserva fallback de interiores. El script no escribe `assets.json` o ShopHub.

El archivo `context/*.png` es un estudio CPU de encuadre sobre el Callejón existente, etiquetado expresamente; **no es captura del juego ni prueba con usuarios**. La integración y capturas reales las registra el coordinador.

## Entrega inspeccionada

Los tres exports sin borde fueron inspeccionados por el integrador root y aceptados para integración dentro de su delegación; no se atribuye aprobación humana o resultados de retención. Coste adicional0, tres inferencias offline de4pasos,101.93s sumados de generación,132282bytes en runtime. `production-manifest.json` agrega maestros originales, SHA, prompts, seed/modelo, crop, dimensiones reales y validación. `review.json` conserva la separación entre selección del integrador y aprobación humana.

`runtime-proposal.json` conserva la propuesta previa; raíz realiza la copia/mapping real después de revisión. La metadata `labelArea` está en cada manifest export y en el agregado; coordenadas normalizadas respecto al export430×574 ya recortado. No añadir esos campos al esquema de asset sin una decisión de contrato; el layout HTML puede usarlos como dato de composición.

```sh
tools/visual/diagon-mlx.sh tools/visual/diagon-a59-storefronts.py --contact
```

Este comando solo recompone el estudio CPU y la propuesta desde exports existentes; no inicializa Metal. Los exports no contienen los rótulos dibujados en el estudio. No se han generado otros personajes, avatares, iconos o interiores.
