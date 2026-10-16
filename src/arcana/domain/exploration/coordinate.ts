import { ArcanaError } from '../errors';

export interface NodeCoordinate {
  readonly row: number;
  readonly column: number;
}

export function createNodeCoordinate(row: number, column: number): NodeCoordinate {
  if (!Number.isSafeInteger(row) || row < 0 || !Number.isSafeInteger(column) || column < 0)
    throw new ArcanaError('INVALID_COORDINATE');
  return Object.freeze({ row, column });
}
