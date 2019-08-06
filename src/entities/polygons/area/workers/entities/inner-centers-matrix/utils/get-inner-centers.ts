import { CenterPoint } from '../../../../../../points/center-point';
import { calcNearestAndTouchedIndexes } from '../../../utils/nearest-indexes';
import { CentersMatrix } from '../../centers-matrix';

export function getInnerCentersMatrix(
  matrix: CentersMatrix,
  innerEmpties: number[][],
): Array<Array<CenterPoint | undefined | 'inner'>> {
  const {
    payload,
    topLeft: {params},
  } = matrix;

  const innerMatrix = payload.map((row, i) => row.map(
    (center, j) => {
      if (
        !center &&
        innerEmpties.some(([i2, j2]) => i === i2 && j === j2)
      ) return 'inner';

      if (!center) return center;

      const nearestEmpties = calcNearestAndTouchedIndexes(i, j, params)
        .filter(([i, j]) => {
          if (!payload[i]) return false;

          if (j < 0 || j >= payload[0].length) return false;

          return !payload[i][j];
        });

      const isNearest = nearestEmpties.some(
        ([i1, j1]) => innerEmpties.some(([i2, j2]) => i1 === i2 && j1 === j2),
      );

      return isNearest ? center : undefined;
    })) as Array<Array<CenterPoint | undefined | 'inner'>>;

  return innerMatrix;
}
