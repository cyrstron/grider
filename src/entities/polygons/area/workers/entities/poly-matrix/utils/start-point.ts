import { GeoPoint } from '../../../../../../points/geo-point';
import { PolyMatrix } from '../poly-matrix';

export function getStartPoints(
  matrix: PolyMatrix,
) {
  const {
    topLeft: {
      params: {isHorizontal},
    },
    startIndexes: [startI, startJ],
  } = matrix;
  const points: GeoPoint[] = [];
  const touchedIndexes = matrix.touchedInnerIndexes(startI, startJ);

  touchedIndexes.sort(([iA, jA], [iB, jB]) => iB - iA || jA - jB);

  const outerCell = matrix.equivalentCell(startI, startJ);
  const refCenter = outerCell.center.moveByDiff(-1, -1);

  const isNorthern = outerCell.center.isNorthernTo(refCenter);
  const isEastern = outerCell.center.isEasternTo(refCenter);

  const nearestPoints = touchedIndexes.map(([i, j]) => {
    const cell = matrix.equivalentCell(i, j);

    return cell.commonPoints(outerCell)
        .sort((pointA, pointB) => {
          const isByEastern = (
            !isHorizontal && pointA.lng !== pointB.lng
          ) || (
            isHorizontal && pointA.lat === pointB.lat
          );

          if (isByEastern) {
            return pointA.isEasternTo(pointB) === isEastern ? 1 : -1;
          } else {
            return pointA.isNorthernTo(pointB) === isNorthern ? 1 : -1;
          }
        });
    })
    .reduce((points, commonPoints) => {
      points.push(...commonPoints);

      return points;
    }, [] as GeoPoint[]);

  nearestPoints.forEach((commonPoint) => {
    const lastPoint = points[points.length - 1];

    if (!lastPoint || !lastPoint.isEqual(commonPoint)) {
      points.push(commonPoint);
    }
  });

  return points;
}
