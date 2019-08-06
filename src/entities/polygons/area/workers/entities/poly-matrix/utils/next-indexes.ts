import { GeoPoint } from '../../../../../../points/geo-point';
import { PolyMatrix } from '../poly-matrix';

export function callNextIndexes(
  matrix: PolyMatrix,
  points: GeoPoint[],
  startI: number,
  startJ: number,
  prevI?: number,
  prevJ?: number,
): [number, number] {
  const lastPoint = points[points.length - 1];

  let touchedIndexes = matrix.touchedOuterIndexes(startI, startJ)
    .filter(([i, j]) => {
      const eqCell = matrix.equivalentCell(i, j);

      return !!eqCell.findEqualGeoPoint(lastPoint);
    });

  if (
    touchedIndexes.length > 1 &&
    (prevI !== undefined && prevJ !== undefined)
  ) {
    touchedIndexes = touchedIndexes.filter(
      ([i, j]) => i !== prevI || j !== prevJ,
    );
  } else if (touchedIndexes.length > 1) {
    return touchedIndexes.sort(([, jA], [, jB]) => jB - jA)[0] as [number, number];
  }

  if (touchedIndexes.length > 1) {
    touchedIndexes.filter(([i, j]) => i === startI || j === startJ);
  }

  return touchedIndexes[0] as [number, number];
}
