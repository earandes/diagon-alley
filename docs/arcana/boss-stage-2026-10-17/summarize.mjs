// Read-only evidence summary. No browser, services, rendering or benchmark execution.
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'docs/arcana/boss-stage-2026-10-17/evidence/linux');
const baseline = JSON.parse(
  await readFile(
    resolve(
      'docs/arcana/boss-increment-2026-10-16/evidence/linux/chromium-1280-boss-a70-performance-lifetimes.json',
    ),
    'utf8',
  ),
);
const files = await readdir(root);
const performanceFile = files.find((file) => file.endsWith('-performance.json'));
if (!performanceFile) throw Error('Missing A71 performance evidence; do not infer a pass');
const current = JSON.parse(await readFile(resolve(root, performanceFile), 'utf8'));
const round = (value) => (typeof value === 'number' ? Math.round(value * 10) / 10 : null);
function windowStats(window) {
  const samples = [...(window.intervals ?? window.samples ?? [])].sort((a, b) => a - b);
  const tasks = window.longTasks ?? window.tasks;
  const decodes = window.decodes ?? [];
  return {
    // Same lower-order empirical quantile as the historical A70 summarizer.
    sampleCount: samples.length,
    documentToReadUpperBoundMs: round(window.elapsedMs ?? window.atMs),
    p95RafMs: samples.length ? round(samples[Math.floor((samples.length - 1) * 0.95)]) : null,
    maxRafMs: samples.length ? round(samples.at(-1)) : null,
    longTaskCount: tasks === null ? null : (tasks?.length ?? null),
    maxLongTaskMs: tasks?.length ? round(Math.max(...tasks)) : null,
    cumulativeMaxDecodePromiseMs: decodes.length
      ? round(Math.max(...decodes.map((d) => d.end - d.start)))
      : null,
    cumulativeMaxDecodeRGBABytes: decodes.length
      ? Math.max(...decodes.map((d) => d.width * d.height * 4))
      : null,
  };
}
const journeys = [];
for (const file of files.filter((name) => name.endsWith('-real-journey.json'))) {
  const data = JSON.parse(await readFile(resolve(root, file), 'utf8'));
  journeys.push({
    file,
    sha: data.sha,
    engine: data.engine,
    viewport: data.viewport,
    actionToDomUsableUpperBoundMs: data.actionToDomUsableUpperBoundMs,
    actionToFiguresReadyUpperBoundMs: data.actionToFiguresReadyUpperBoundMs,
    queryCancelNoSpend: data.queryCancelNoSpend,
    confirmedReceiptImmutable: data.confirmedReceiptImmutable,
  });
}
console.log(
  JSON.stringify(
    {
      baseline: {
        sha: baseline.sha,
        startup: windowStats(baseline.startup),
        warm: windowStats(baseline.warm),
        actualPaints: baseline.actualPaints,
      },
      current: {
        sha: current.sha,
        startup: windowStats(current.startup),
        warm: windowStats(current.warm),
        actualPaints: current.actualPaints,
        warmWindowMs: current.warmWindowMs,
        skipToOutcomeUpperBoundMs: current.skipToOutcomeUpperBoundMs,
        resources: current.resources,
        teardownCountersZero: current.teardownCountersZero,
      },
      journeys,
      limits: [
        'Single serial sample per renderer, not a performance distribution',
        'Same seed70 mastery 5x5 fixture; player stats extended for playback',
        'OS caches and runner scheduling are not controlled',
        'rAF intervals are not GPU timings',
        'Decode promise includes network and scheduling',
        'Own counters do not prove absence of global leaks',
        'Decode observations are cumulative; warm decode maximum is not new decode work',
        'Quantiles use sorted[floor((n-1)*q)], matching historical A70 summary',
        'Authority journey timings include network and assertion polling; fixtures do not',
      ],
    },
    null,
    2,
  ),
);
