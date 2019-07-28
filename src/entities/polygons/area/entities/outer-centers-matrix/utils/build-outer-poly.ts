import { CenterPoint, GeoPoint } from "../../../../../points";
import { GridParams } from "../../../../../grid-params";
import { calcNearestAndTouchedIndexes } from "../../../utils/nearest-indexes";
import { OuterCentersMatrix } from "../../outer-centers-matrix";

// function calcNextOuter(
//   matrix: OuterCentersMatrix,
//   points: GeoPoint[],
//   nearestIndexes: number[][],
//   startI: number,
//   startJ: number,
//   prevI?: number,
//   prevJ?: number,
// ): [number, number] {
//   if ()
// }

function getStartPoints(
  matrix: OuterCentersMatrix,
  nearestCentersIndexes: number[][],
  startI: number,
  startJ: number,
) {
  const {
    payload, 
    topLeft: {
      params: {isHorizontal}
    }
  } = matrix;
  const points: GeoPoint[] = [];
  
  nearestCentersIndexes.sort(([iA, jA], [iB, jB]) => iB - iA || jA - jB);

  const outerCell = matrix.equivalentCell(startI, startJ);
  const refCenter = outerCell.center.moveByDiff(-1, -1);

  const isNorthern = outerCell.center.isNorthernTo(refCenter);
  const isEastern = outerCell.center.isEasternTo(refCenter);

  const nearestPoints = nearestCentersIndexes.map(([i, j]) => {
    const cell = (payload[i][j] as CenterPoint).toCell();

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
            return pointA.isNorthernTo(pointB) === isNorthern ? 1 : -1
          }            
        })
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

function getOuterPoints(
  matrix: OuterCentersMatrix,
  startI: number,
  startJ: number,
  points?: GeoPoint[],
  prevI?: number,
  prevJ?: number,
): GeoPoint[] {

  const touchedCentersIndexes = matrix.touchedCenters(startI, startJ);
  const touchedOuterIndexes =  matrix.touchedOuterEmpties(startI, startJ);

  if (!points) {
    points = getStartPoints(matrix, touchedCentersIndexes, startI, startJ);
  }

  return points;
}

export function getOuterPoly(
  matrix: OuterCentersMatrix,
): GeoPoint[] {

  const [startI, startJ] = matrix.startIndexes;

  return getOuterPoints(matrix, startI, startJ);

  // const nearests = calcNearestIndexes(i, j, params)
  //   .filter(([i, j]) => matrix[i] && matrix[i][j]);

  // const [prevI, prevJ] = indexes[indexes.length - 1] || [] as Array<number | undefined>;

  // indexes.push([i, j]);

  // let nextI;
  // let nextJ;

  // if (nearests.length === 1 || (prevI === undefined && prevJ === undefined)) {
  //   [nextI, nextJ] = nearests[0];
  // } else if (nearests) {
  //   [nextI, nextJ] = nearests.find(([i, j]) => i !== prevI && j !== prevJ);
  // }

  // const [startI, startJ] = indexes[0];

  // if (nextI === startI && nextJ === startJ) return indexes;

  // orderIndexesByBorder(nextI, nextJ, matrix, params, indexes);

  // return indexes;
}
  