import { CenterPoint } from '../../../../points/center-point';
import { CentersMatrix } from '../entities/centers-matrix';
import { calcNearestIndexes} from './nearest-indexes';

export function unionNearestCenters(
  i: number,
  j: number,
  matrix: CentersMatrix,
  set?: Set<CenterPoint>,
): Set<CenterPoint> {
  if (!set) {
    set = new Set<CenterPoint>();
  }

  const {payload} = matrix;

  const point = payload[i] && payload[i][j];

  if (!(point instanceof CenterPoint)) return set;

  if (set.has(point)) return set;

  set.add(point);

  const indexes = calcNearestIndexes(i, j, point.params);

  indexes.forEach(([i, j]) => {
    unionNearestCenters(i, j, matrix, set);
  });

  return set;
}

export function getBiggestSet(
  matrix: CentersMatrix,
) {
  const sets = matrix.payload.reduce((sets, row, i) => row.reduce(
    (sets, center, j) => {
      if (!(center instanceof CenterPoint)) return sets;

      if (sets.some((set) => set.has(center))) return sets;

      const set = unionNearestCenters(i, j, matrix);

      sets.push(set);

      return sets;
    }, sets), [] as Array<Set<CenterPoint>>)
    .sort((setA, setB) => setB.size - setA.size);

  return sets[0];
}
