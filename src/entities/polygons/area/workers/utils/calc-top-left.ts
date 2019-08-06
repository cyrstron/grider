import { CenterPoint } from '../../../../points/center-point';

export function calcTopLeft(
  matrix: Array<Array<CenterPoint | 'outer' | 'inner' | undefined>>,
): CenterPoint {
  const i = matrix.findIndex((row) => row.some(
    (center) => center instanceof CenterPoint,
  ));
  const j = matrix[i].findIndex(
    (center) => center instanceof CenterPoint,
  );
  const center = matrix[i][j] as CenterPoint;

  return center.moveByDiff(-i, -j);
}
