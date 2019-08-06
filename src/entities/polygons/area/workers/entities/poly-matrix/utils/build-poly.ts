import { GeoPoint } from '../../../../../../points/geo-point';
import { PolyMatrix } from '../poly-matrix';

export function buildPoly(
  matrix: PolyMatrix,
  isInner: boolean = false,
): GeoPoint[] {
  const [startI, startJ] = matrix.startIndexes;
  const points = matrix.startPoints;

  let [nextI, nextJ] = matrix.nextIndexes(
    points,
    startI,
    startJ,
  );

  let prevI = startI;
  let prevJ = startJ;

  while (nextI !== startI || nextJ !== startJ) {
    const nextPoints = matrix.nextPoints(points, nextI, nextJ, isInner);

    points.push(...nextPoints);

    const [i, j] = matrix.nextIndexes(
      points,
      nextI,
      nextJ,
      prevI,
      prevJ,
    );

    prevI = nextI;
    prevJ = nextJ;
    nextI = i;
    nextJ = j;
  }

  return points;
}
