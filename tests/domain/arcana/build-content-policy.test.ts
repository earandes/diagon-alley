import { expect, it } from 'vitest';
// @ts-expect-error Node build script deliberately has no browser-facing type dependency.
import { inspectBuildText } from '../../../tools/arcana/build-content-policy.mjs';
it('allows the explicitly authorized Diagon presentation but preserves the ARCANA-only restriction', () => {
  expect(() =>
    inspectBuildText('Harry Potter · Diagon Alley · Ranas de Chocolate', 'diagon-alley'),
  ).not.toThrow();
  expect(() =>
    inspectBuildText('Harry Potter · Diagon Alley · Ranas de Chocolate', 'arcana'),
  ).toThrow(/ARCANA-only/);
  expect(() => inspectBuildText('ARCANA · Merlín · Sapo de Cacao', 'arcana')).not.toThrow();
});
it('rejects historical I1 storage, catalogs and art in either thematic build', () => {
  for (const policy of ['arcana', 'diagon-alley'])
    for (const source of [
      'magic-i1',
      'coleccion-magica-i1.json',
      '"C01"',
      '"R01"',
      'public/art/weasley-v1.webp',
    ])
      expect(() => inspectBuildText(source, policy)).toThrow(/Historical I1/);
  expect(() => inspectBuildText('anything', 'unknown')).toThrow(/Unknown/);
});
