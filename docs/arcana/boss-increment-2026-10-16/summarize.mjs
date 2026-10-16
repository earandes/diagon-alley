// Reads exported CI JSON only. Never starts an app, browser, renderer or profiler.
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const root = resolve(process.argv[2] ?? 'docs/arcana/boss-increment-2026-10-16/evidence/linux');
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(join(dir, entry.name))
      : entry.name.endsWith('.json')
        ? [join(dir, entry.name)]
        : [],
  );
const records = walk(root).map((file) => ({ file, data: JSON.parse(readFileSync(file, 'utf8')) }));
const range = (values) => {
  const valid = values.filter(Number.isFinite);
  return valid.length
    ? { samples: valid.length, min: Math.min(...valid), max: Math.max(...valid) }
    : null;
};
const percentiles = (values) => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const p = (q) => sorted[Math.floor((sorted.length - 1) * q)];
  return { samples: sorted.length, p50: p(0.5), p95: p(0.95), max: sorted.at(-1) };
};
const output = {
  records: records.length,
  sourceShas: [...new Set(records.map((r) => r.data.sha).filter(Boolean))],
  authority: Object.fromEntries(
    ['chromium', 'webkit'].map((engine) => {
      const matching = records.filter((r) => r.data.engine === engine && r.data.fixture === false);
      return [
        engine,
        {
          cases: matching.length,
          actionToDomUsableUpperBoundMs: range(
            matching.map((r) => r.data.actionToDomUsableUpperBoundMs),
          ),
          actionToFiguresReadyUpperBoundMs: range(
            matching.map((r) => r.data.actionToFiguresReadyUpperBoundMs),
          ),
        },
      ];
    }),
  ),
  presentation: Object.fromEntries(
    ['chromium', 'webkit'].map((engine) => {
      const matching = records.filter(
        (r) =>
          r.data.engine === engine &&
          r.data.fixture === true &&
          Number.isFinite(r.data.navigationToReadyMs),
      );
      return [
        engine,
        {
          cases: matching.length,
          navigationToReadyUpperBoundMs: range(matching.map((r) => r.data.navigationToReadyMs)),
          ownTextureBytes: range(matching.map((r) => Number(r.data.resources?.textureBytes))),
        },
      ];
    }),
  ),
  warmWindows: records
    .filter((r) => r.data.warm)
    .map(({ file, data }) => ({
      file: file.slice(root.length + 1),
      engine: data.engine,
      viewport: data.viewport,
      windowMs: data.warmWindowMs,
      rafIntervalsMs: percentiles(data.warm.samples),
      longTasksMs: data.warm.tasks,
      actualPaints: data.actualPaints,
      cycles: data.cycles,
      ownTextureBytes: range(data.resources.map((r) => Number(r.textureBytes))),
      startup: {
        elapsedUpperBoundMs: data.startup?.elapsed,
        rafIntervalsMs: percentiles(data.startup?.samples ?? []),
        longTasksMs: data.startup?.tasks,
      },
    })),
  limitations: [
    'Authority action bounds include Playwright waits, API commit/state polling and UI assertions; they are not human timings.',
    'Presentation fixtures use prolonged player stats, not campaign balance; setup also resolves their log.',
    'New document is not an OS/driver cache reset. rAF intervals are not GPU timings.',
    'Resource counters cover owned textures only, not total GPU memory or a global leak proof.',
    'Do not pool percentiles from separate windows or claim causal improvement against different A69 fixtures.',
  ],
};
console.log(JSON.stringify(output, null, 2));
