// Read-only analysis of exported CI measurements. Never starts a browser or app.
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const input = resolve(process.argv[2] ?? 'docs/arcana/motion-audit-2026-10-16/evidence/linux');
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(join(dir, entry.name))
      : entry.name.endsWith('.json')
        ? [join(dir, entry.name)]
        : [],
  );
}
const records = files(input)
  .map((file) => ({ file, data: JSON.parse(readFileSync(file, 'utf8')) }))
  .filter(({ data }) => data.fixture === true);
function range(values) {
  const finite = values.filter(Number.isFinite);
  return {
    samples: finite.length,
    minimum: finite.length ? Math.min(...finite) : null,
    maximum: finite.length ? Math.max(...finite) : null,
  };
}
const engines = Object.fromEntries(
  ['chromium', 'webkit'].map((engine) => {
    const rows = records.filter(({ data }) => data.engine === engine).map(({ data }) => data);
    return [
      engine,
      {
        openingActionToResultMs: range(rows.map((d) => d.resultUsableMs)),
        skipActionToResultMs: range(rows.map((d) => d.skipUsableMs)),
        freshContextArenaBootMs: range(
          rows.filter((d) => d.freshContextFirstNavigation).map((d) => d.navigationToSceneReadyMs),
        ),
        freshContextOpeningBootMs: range(
          rows.filter((d) => d.freshContextFirstNavigation).map((d) => d.documentBootToReadyMs),
        ),
        ownTextureBytes: range(rows.flatMap((d) => d.renderer.map((r) => Number(r.textureBytes)))),
        longTaskApi: [
          ...new Set(rows.map((d) => (d.longTasks === null ? 'unavailable' : 'supported'))),
        ],
        maximumReportedLongTaskMs: rows.some((d) => d.longTasks !== null)
          ? Math.max(0, ...rows.flatMap((d) => d.longTasks ?? []))
          : null,
        freshContextArenaFrameWindows: rows
          .filter((d) => d.freshContextFirstNavigation && d.navigationToSceneReadyMs !== undefined)
          .map((d) => ({ viewport: d.viewport, frameMs: d.frameMs, longTasks: d.longTasks })),
      },
    ];
  }),
);
const warm = records
  .filter(({ file }) => file.includes('warm-replay'))
  .map(({ data }) => ({
    engine: data.engine,
    viewport: data.viewport,
    windowMs: data.windowMs,
    frameMs: data.frameMs,
    warmDraws: data.warmDraws,
    p95TargetMs: 20,
    p95TargetMet: data.frameMs.p95 !== null && data.frameMs.p95 <= 20,
    longTasks: data.longTasks,
  }));
const lifecycle = records
  .filter(({ file }) => file.includes('lifecycle'))
  .map(({ data }) => ({
    cycles: data.counts.length,
    ownTextureBytesDuringMount: range(data.counts.map((r) => Number(r.bytes))),
    limitation: data.limitation,
  }));
process.stdout.write(
  JSON.stringify(
    {
      fixtureRecords: records.length,
      testedMergeShas: [...new Set(records.map(({ data }) => data.sha))],
      engines,
      warm,
      lifecycle,
      limits: [
        'Declared presentation fixtures, not human play',
        'First fresh context only is cold; later navigations can reuse network cache',
        'Opening action starts with an already confirmed receipt; authority latency is not included',
        'Texture counters are not GPU-process memory',
        'Ranges describe this sample matrix, not a population distribution',
        'Frame percentiles remain per-window; they are not pooled from summaries',
      ],
    },
    null,
    2,
  ) + '\n',
);
