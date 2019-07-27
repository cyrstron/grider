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
  const {payload} = matrix;
  const points: GeoPoint[] = [];
  
  nearestCentersIndexes.sort(([iA, jA], [iB, jB]) => iB - iA || jA - jB);

  const [i, j] = nearestCentersIndexes[0];
  const sampleCell = (payload[i][j] as CenterPoint).toCell();
  const diffI = i - startI;
  const diffJ = j - startJ;

  const outerCell = sampleCell.moveByDiff(diffI, diffJ);
  const refCenter = outerCell.center.moveByDiff(-1, -1);

  const isNorthern = outerCell.center.isNorthernTo(refCenter);
  const isEastern = outerCell.center.isEasternTo(refCenter);

  const nearestPoints = nearestCentersIndexes.map(([i, j]) => {
    const cell = (payload[i][j] as CenterPoint).toCell();

    return cell.commonPoints(outerCell)
        .sort((pointA, pointB) => {
          if (pointA.lng !== pointB.lng) {
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
  params: GridParams,
  points?: GeoPoint[],
  prevI?: number,
  prevJ?: number,
): GeoPoint[] {
  const {payload} = matrix;

  const nearestIndexes = calcNearestAndTouchedIndexes(startI, startJ, params);
  const nearestCentersIndexes = nearestIndexes
    .filter(([i, j]) => !!payload[i] && !!payload[i][j] && payload[i][j] !== 'outer');
  const nearestOuterIndexes = nearestIndexes
    .filter(([i, j]) => !!payload[i] && payload[i][j] === 'outer');

  if (!points) {
    points = getStartPoints(matrix, nearestCentersIndexes, startI, startJ);


  }

  return points;
}

export function getOuterPoly(
  matrix: OuterCentersMatrix,
): GeoPoint[] {
  const {
    payload,
    topLeft: {params}
  } = matrix;

  const startI: number = 0;
  const startJ = payload[0].reduce((startJ, _value, j) => {
    if (startJ !== undefined) return startJ;

    const nearest = calcNearestAndTouchedIndexes(startI, j, params);
    const hasNearest = nearest.reduce((hasNearest, [i, j]) => {
      return hasNearest || (!!payload[i] && !!payload[i][j] && payload[i][j] !== 'outer');
    }, false);

    return hasNearest ? j : startJ;
  }, undefined as undefined | number) as number;

  return getOuterPoints(matrix, startI, startJ, params);

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
  