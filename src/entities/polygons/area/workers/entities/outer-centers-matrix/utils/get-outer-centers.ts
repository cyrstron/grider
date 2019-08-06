import { CenterPoint } from '../../../../../../points/center-point';
import { calcNearestAndTouchedIndexes } from '../../../utils/nearest-indexes';
import { CentersMatrix } from '../../centers-matrix';

export function getOuterCentersMatrix(
    matrix: CentersMatrix,
  ): Array<Array<CenterPoint | 'outer' | undefined>> {
    const {
      payload,
      borderEmpties,
      topLeft: {params},
    } = matrix;

    const maxI = payload.length - 1;
    const maxJ = payload[0].length - 1;

    const outerCenters = payload.map((row, i) => row.map(
      (center, j) => {
        if (
          !center &&
          borderEmpties.some(([i2, j2]) => i === i2 && j === j2)
        ) return 'outer';

        if (!center) return center;

        if (
          i === maxI ||
          j === maxJ ||
          i === 0 ||
          j === 0
        ) return center;

        const nearestEmpties = calcNearestAndTouchedIndexes(i, j, params)
          .filter(([i, j]) => {
            if (!payload[i]) return false;

            if (j < 0 || j >= payload[0].length) return false;

            return !payload[i][j];
          });

        const isOnBorder = nearestEmpties.some(
          ([i1, j1]) => borderEmpties.some(([i2, j2]) => i1 === i2 && j1 === j2),
        );

        return isOnBorder ? center : undefined;
      }),
    ) as Array<Array<(CenterPoint | 'outer' | undefined)>>;

    outerCenters.forEach((row) => {
      row.unshift('outer');
      row.push('outer');
    });

    const rowLength = outerCenters[0].length;

    outerCenters.unshift(new Array(rowLength).fill('outer'));
    outerCenters.push(new Array(rowLength).fill('outer'));

    return outerCenters;
  }
