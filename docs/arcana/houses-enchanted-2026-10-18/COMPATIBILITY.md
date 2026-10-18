# A85 · Compatibilidad y recuperación

18 octubre2026. No hay migración SQL, restablecimiento de cuentas ni importación de autoridad local.

- **Copias anteriores:** `traits` y `finish` son opcionales en el snapshot de adquisición. Su ausencia no se transforma en una variante. El álbum puede consultar la clasificación actual por identidad sin escribir sobre el receipt histórico.
- **Runs activas:** usan sus planes y reglas congelados. Las anteriores continúan sin sinergias de casa (engine1). Un fallback sin snapshot también excluye la bandera nueva. La consulta al proveedor live sigue siendo perezosa: no se llama cuando ya existe snapshot.
- **Expediciones nuevas:** contenido táctico3, reglas2 y engine2; una tabla de pertenencias completa queda en `combatRules.houseMembers`. Una copia que se incorpora a la formación durante esa run toma la pertenencia congelada, no una revisión posterior del catálogo.
- **Derechos únicos:** campaña y versión de primera victoria siguen en1. EnsayoSQL ficticio gana primero en contenido anterior y después en nuevo: `[true,false]`, llaves `[1,0]`, una llave total. No se atribuye la concesión a la versión táctica.
- **Aperturas nuevas:** catálogo/tabla3, mismos29 pesos de identidad. Acabado independiente1/100. La petición con versión obsoleta se rechaza antes de gastar. Snapshot de copia y receipt conservan idéntica procedencia, acabado y versión en el mismo commit.
- **Respuesta perdida:** operación SQL recuperada sin consultar otra tabla ni llamar al RNG; conserva40monedas, dos copias y un solo acabado en el ensayo de compra/apertura. Un error anterior al commit conserva el estado y dos claves concurrentes sobre la misma revisión solo confirman una.
- **Replay:** eventos de activación y valores están en el BattleLog; el renderer no recalcula casas desde los supervivientes. Validación de engineVersion depende de la bandera del input guardado; la reproducción anterior no se reinterpreta.
- **Idioma/paquete:** casa e identidad son IDs compartidos. Los nombres temáticos y el metal/insignia son presentación. Cambiar idioma o pack no cambia probabilidad, contribuyentes, resultado o inventario.
- **Economía:** costes de combate/apertura, pesos de identidad, rarezas, energía, botines y estadísticas maestras intactos. La nueva táctica sí puede cambiar victorias e ingresos; se publican resultados desfavorables en simulación, sin afirmar neutralidad económica de las decisiones.

Pruebas de base de datos sobre jugadores ficticios `a85-<UUID>`, con borrado de sus filas al terminar; no se toca la cuenta habitual. Los tests completos existentes de Redis/gateway/cuentas siguen siendo necesarios para regresión; una transacción en memoria de simulación no los sustituye.

## Comprobación directa del riesgo ×2

Además de las pruebas de catálogo/motor, se ejecutó localmente un probeSSR sin navegador: tres copiasHufflepuff, mismosIDs y semilla85; todas normales frente a las tres encantadas. `prepareOwned`, `houseProgress` yBattleLog completos son idénticos. Conteo3 en ambos casos, hashSHA256 `f6fbd71491a095eb0b9c47715bc4274a33c7f9daac18840c7af8f3f42d399ffc`. [Resultado](evidence/local/finish-equivalence.json). No acreditaSQL ni comportamiento humano; esos contratos tienen pruebas separadas.

Reproducción desde la raíz (Node24, sin servidor de escucha ni navegador):

```js
// Ejecutar con node --input-type=module; finally cierra el Vite de SSR.
import { createServer } from 'vite';
import assert from 'node:assert/strict';
const s = await createServer({ server: { middlewareMode: true }, configFile: false });
try {
  const { trialConfiguration } = await s.ssrLoadModule('/src/arcana/infrastructure/content/trial-configuration.ts');
  const { CombatEngine } = await s.ssrLoadModule('/src/arcana/domain/combat/engine.ts');
  const { SeededRandom } = await s.ssrLoadModule('/src/arcana/infrastructure/random/seeded-random.ts');
  const { houseProgress } = await s.ssrLoadModule('/src/arcana/domain/combat/houses.ts');
  const c = trialConfiguration();
  const ws = c.opening.catalog.wizards.filter(w => w.traits?.house === 'hufflepuff').slice(0, 3);
  const team = special => ws.map((w, i) => c.campaign.prepareOwned({
    copyId: `probe:${i}`, wizard: { ...w, ...(special ? { finish: { id: 'enchanted', version: 1 } } : {}) },
    catalogVersion: 3, sourceId: 'probe', origin: 'toad',
  }));
  const a = team(false), b = team(true);
  const engine = new CombatEngine({ fromSeed: seed => new SeededRandom(seed) });
  const battle = player => engine.resolve({ id: 'finish-equivalence', seed: 85, player,
    rival: a.map((u, i) => ({ ...u, id: `rival:${i}` })), rules: c.campaign.combatRules });
  assert.deepEqual(a, b);
  assert.deepEqual(houseProgress(a), houseProgress(b));
  assert.deepEqual(battle(a), battle(b));
} finally { await s.close(); }
```
