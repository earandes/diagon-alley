/** Measured presentation geometry, independent of combat rules and initiative. */
export function arenaFigureBudget({
  stageHeight,
  count,
  heading,
  synergies,
  gap,
  labels,
  minimumFigure = 60,
}: {
  stageHeight: number;
  count: number;
  heading: number;
  synergies: number;
  gap: number;
  labels: number;
  minimumFigure?: number;
}) {
  const rows = Math.max(1, count);
  const chrome = heading + synergies + Math.max(0, rows - 1) * gap;
  const requiredHeight = chrome + rows * (minimumFigure + labels);
  return {
    requiredHeight,
    figureCap: Math.min(
      190,
      Math.max(minimumFigure, (Math.max(stageHeight, requiredHeight) - chrome) / rows - labels),
    ),
  };
}
