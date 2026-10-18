import { expect, it } from 'vitest';
import { arenaFigureBudget } from '../../../src/arcana/presentation/arena-layout';
it('uses one figure scale for 5x3, based on the larger formation and measured labels', () => {
  const budget = arenaFigureBudget({
    stageHeight: 740,
    count: 5,
    heading: 44,
    synergies: 20,
    gap: 4,
    labels: 40,
  });
  expect(budget.figureCap).toBe(92);
  expect(budget.requiredHeight).toBe(580);
});
it('lets enlarged names expand the scene instead of overlapping PV or hiding fighters', () => {
  const budget = arenaFigureBudget({
    stageHeight: 740,
    count: 5,
    heading: 88,
    synergies: 40,
    gap: 4,
    labels: 130,
  });
  expect(budget.requiredHeight).toBe(1094);
  expect(budget.figureCap).toBe(60);
});
it('caps small formations without adding unbounded texture or actor scale', () => {
  expect(
    arenaFigureBudget({
      stageHeight: 1000,
      count: 1,
      heading: 44,
      synergies: 0,
      gap: 4,
      labels: 40,
    }).figureCap,
  ).toBe(190);
});
it('reserves the authored boss gesture minimum when text needs the full row budget', () => {
  const budget = arenaFigureBudget({
    stageHeight: 600,
    count: 5,
    heading: 44,
    synergies: 20,
    gap: 4,
    labels: 40,
    minimumFigure: 78,
  });
  expect(budget.requiredHeight).toBe(670);
  expect(budget.figureCap).toBe(78);
});
