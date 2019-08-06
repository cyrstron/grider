import { GridParams } from '../../../../grid-params';

export function calcNearestIndexes(
  i: number,
  j: number,
  params: GridParams,
): number[][] {
  const indexes = [
    [i + 1, j],
    [i, j + 1],
    [i - 1, j],
    [i, j - 1],
  ];

  if (params.type !== 'hex') return indexes;

  indexes.push(
    [i - 1, j + 1],
    [i + 1, j - 1],
  );

  return indexes;
}

export function calcNearestAndTouchedIndexes(
  i: number,
  j: number,
  params: GridParams,
): number[][] {
  const indexes = [
    [i + 1, j],
    [i, j + 1],
    [i - 1, j],
    [i, j - 1],
    [i - 1, j + 1],
    [i + 1, j - 1],
  ];

  if (params.type !== 'rect') return indexes;

  indexes.push(
    [i + 1, j + 1],
    [i - 1, j - 1],
  );

  return indexes;
}
