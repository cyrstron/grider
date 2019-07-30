import { CenterPoint, GeoPoint } from "../../../../../points";
import { Cell } from "../../../../cell";
import { InnerCentersMatrix } from "../";

function calcNextInner(
  matrix: InnerCentersMatrix,
  points: GeoPoint[],
  startI: number,
  startJ: number,
  prevI?: number,
  prevJ?: number,
): [number, number] {
  const lastPoint = points[points.length - 1];
  let touchedCentersIndexes = matrix.touchedCenters(startI, startJ)
    .filter(([i, j]) => {
      const eqCell = matrix.equivalentCell(i, j);

      return !!eqCell.findEqualGeoPoint(lastPoint);
    });

  if (
    touchedCentersIndexes.length > 1 &&
    (prevI !== undefined && prevJ !== undefined)
  ) {
    touchedCentersIndexes = touchedCentersIndexes.filter(
      ([i, j]) => i !== prevI || j !== prevJ
    );
  } else if (touchedCentersIndexes.length > 1) {
    return touchedCentersIndexes.sort(([, jA], [, jB]) => jB - jA)[0] as [number, number];
  }

  if (touchedCentersIndexes.length > 1) {
    touchedCentersIndexes.filter(([i, j]) => i === startI || j === startJ);
  }

  return touchedCentersIndexes[0] as [number, number];
}

function getStartPoints(
  matrix: InnerCentersMatrix,
  touchedInnersIndexes: number[][],
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
  
  touchedInnersIndexes.sort(([iA, jA], [iB, jB]) => iB - iA || jA - jB);

  const outerCell = (matrix.payload[startI][startJ] as CenterPoint).toCell();
  const refCenter = outerCell.center.moveByDiff(-1, -1);

  const isNorthern = outerCell.center.isNorthernTo(refCenter);
  const isEastern = outerCell.center.isEasternTo(refCenter);

  const nearestPoints = touchedInnersIndexes.map(([i, j]) => {
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

function getNextPoints(
  matrix: InnerCentersMatrix,
  points: GeoPoint[],
  outerI: number,
  outerJ: number,
) {
  const outerCell = matrix.equivalentCell(outerI, outerJ);
  const nearestInnerEmpties = matrix.touchedInnerEmpties(outerI, outerJ);

  let lastPoint = points[points.length - 1];
  let prevCell: Cell | undefined;
  const nextPoints = [];

  let commonCells = nearestInnerEmpties.map(([i, j]) => {
    return matrix.equivalentCell(i, j);
  });

  while(commonCells.length > 0) {
    lastPoint = nextPoints[nextPoints.length - 1] || lastPoint;
    
    let commonCellIndex: number;

    const cells = commonCells.filter((cell) => (
      !!cell.findEqualGeoPoint(lastPoint)
    ));

    if (prevCell) {
      const cell = cells.length > 1 ?
        cells.find((cell) => !!prevCell && !prevCell.isNeighbor(cell)) :
        cells[0];

      commonCellIndex = commonCells.indexOf(cell as Cell);
    } else {
      if (cells.length === 1) {
        commonCellIndex = commonCells.indexOf(cells[0])
      } else {
        const preLastPoint = nextPoints[nextPoints.length - 2] || 
          points[points.length - 2];

        commonCellIndex = commonCells.findIndex((cell) => (
          !!cell.findEqualGeoPoint(lastPoint) && 
            !cell.findEqualGeoPoint(preLastPoint)        
        ));
      };
    }

    if (commonCellIndex === -1) break;

    const cell = commonCells[commonCellIndex];
    const commonPoints = cell.commonPoints(outerCell)
      .filter((point) => (
        !point.isEqual(lastPoint)
      ));

    nextPoints.push(...commonPoints);
    prevCell = cell;
    commonCells.splice(commonCellIndex, 1);
  }

  return nextPoints;
}

function getInnerPoints(
  matrix: InnerCentersMatrix,
  startI: number,
  startJ: number,
  points?: GeoPoint[],
): GeoPoint[] {

  const touchedInnerEmpties = matrix.touchedInnerEmpties(startI, startJ);

  if (!points) {
    points = getStartPoints(matrix, touchedInnerEmpties, startI, startJ);
  }

  let [nextI, nextJ] = calcNextInner(
    matrix, 
    points, 
    startI,
    startJ
  );

  let prevI = startI;
  let prevJ = startJ;

  while(nextI !== startI || nextJ !== startJ) {
    const nextPoints = getNextPoints(matrix, points, nextI, nextJ);

    points.push(...nextPoints);

    const [i, j] = calcNextInner(
      matrix, 
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

export function getInnerPoly(
  matrix: InnerCentersMatrix,
): GeoPoint[] {

  const [startI, startJ] = matrix.startIndexes;

  return getInnerPoints(matrix, startI, startJ).reverse();
}
