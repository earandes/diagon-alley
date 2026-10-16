# A60 · Escenarios de economía, sin aplicar

Se conservan los JSON de configuración y todas las partidas. La nueva compra+apertura utiliza el precio vigente de10 y la misma tabla, una transacción y un receipt. No introduce descuento, garantía de rareza ni una segunda concesión.

Se reutiliza el simulador local instalado `tools/arcana/simulate-balance.py` (módulos gratuitos Game Design Skills Suite); salida íntegra en `balance-scenarios.json`. Semilla52,3.000 ensayos por escenario de colección. Los resultados son hipótesis sintéticas, no comportamiento humano o validación de balance.

| Aperturas | Coste actual | Identidades únicas medias, tabla actual | Duplicados medios | Alternativa pesos comunes ×2: únicas / duplicados |
|---|---:|---:|---:|---:|
|5|50|4,68|0,32|4,64 /0,36|
|20|200|14,61|5,39|14,25 /5,75|
|40|400|21,85|18,15|21,18 /18,82|

Con un presupuesto hipotético de50, precios8/10/12 permiten6/5/4 aperturas. El modelo simple de90días supone50 iniciales, tres duelos repetidos diarios con ingreso total6/día y una rana deseada/día: faltan130/310/490 monedas respectivamente; no permite saldo negativo. Excluye recompensas de rutas/jefes, otros gastos/ingresos, energía, curación, tiempo, tasa de victoria y regalos. No predice la economía real ni justifica por sí solo abaratar.

## Propuestas pendientes

- **Duplicados:** antes de convertirlos, medir si el jugador usa copias equipadas de forma diferente y cuántas quedan sin finalidad. Comparar compensación fija con canje voluntario protegiendo la última copia. Ninguna implementada.
- **Progreso durante ruta:** valorar XP temporal o una elección de mejora contextual frente al sistema actual. Requiere especificar curva, reset, dificultad y efectos; no copiar los EV del referente.
- **Recompensa/siguiente objetivo:** preferir comunicar premios y destinos existentes antes de añadir monedas. La rana ganada ya tiene apertura sin compra; grageas ya enlazan con preparación. Nuevas misiones o premios recurrentes quedan pendientes.
- **Protección de mala suerte:** solo explorar después de medir distribución de duplicados y tiempo por apertura. Mostrar tabla exacta y versionar cualquier regla futura; no anunciar pity inexistente.

No se aplican los pesos comunes ×2, precios alternativos, shards, vitaminas, pity o pagos por derrota de PokéLike. La incertidumbre sobre un aumento observado de moneda en ese referente no se convierte en regla propia.
