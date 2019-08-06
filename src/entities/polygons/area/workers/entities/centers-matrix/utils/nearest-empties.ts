import { GridParams } from '../../../../../../grid-params';
import { CenterPoint } from '../../../../../../points/center-point';
import { calcNearestAndTouchedIndexes } from '../../../utils/nearest-indexes';

export function getNearestEmpties(
  i: number,
  j: number,
  matrix: Array<Array<CenterPoint | undefined | 'inner' | 'outer'>>,
  params: GridParams,
  emptiesCoords?: number[][],
): number[][] {
  if (!emptiesCoords) {
    emptiesCoords = [];
  }

  const hasPoint = !!emptiesCoords
    .find(([i2, j2]) => i === i2 && j === j2);

  if (hasPoint) return emptiesCoords;

  emptiesCoords.push([i, j]);

  const nearestEmptiesCords = calcNearestAndTouchedIndexes(i, j, params)
    .filter(([i, j]) => {
      if (!matrix[i]) return false;

      if (j < 0 || j >= matrix[0].length) return false;

      const value = matrix[i][j];

      return !(value instanceof CenterPoint);
    });

  nearestEmptiesCords.forEach(([i, j]) => {
    getNearestEmpties(i, j, matrix, params, emptiesCoords);
  });

  return emptiesCoords;
}
