import { GeoPoint } from '../../../../../../points/geo-point';
import { Cell } from '../../../../../cell';
import { PolyMatrix } from '../poly-matrix';

function getOuterCommonCell(
  commonCells: Cell[],
  prelastPoint: GeoPoint,
  prevCell: Cell | undefined,
): Cell | undefined {
  if (prevCell) {
    return commonCells.find(
      (cell) => !!prevCell && prevCell.isNeighbor(cell),
    );
  } else if (commonCells.length === 1) {
    return commonCells[0];
  } else {
    return commonCells.find(
      (cell) => !!cell.findEqualGeoPoint(prelastPoint),
    );
  }
}

function getInnerCommonCell(
  commonCells: Cell[],
  prelastPoint: GeoPoint,
  prevCell: Cell | undefined,
): Cell | undefined {
  if (commonCells.length === 1) {
    return commonCells[0];
  } else if (prevCell) {
    return commonCells.find(
      (cell) => !!prevCell && !prevCell.isNeighbor(cell),
    );
  } else {
    return commonCells.find(
      (cell) => !!cell.findEqualGeoPoint(prelastPoint),
    );
  }
}

export function getNextPoints(
  matrix: PolyMatrix,
  points: GeoPoint[],
  outerI: number,
  outerJ: number,
  isInner: boolean = false,
) {
  const outerCell = matrix.equivalentCell(outerI, outerJ);
  const touchedIndexes = matrix.touchedInnerIndexes(outerI, outerJ);
  const touchedCells = touchedIndexes.map(([i, j]) => {
    return matrix.equivalentCell(i, j);
  });
  const nextPoints = [];

  let prevCell: Cell | undefined;

  while (touchedCells.length > 0) {
    const lastPoint: GeoPoint = nextPoints[nextPoints.length - 1] ||
      points[points.length - 1];
    const commonCells = touchedCells.filter((cell: Cell) => (
      !!cell.findEqualGeoPoint(lastPoint)
    ));
    const prelastPoint: GeoPoint = nextPoints[nextPoints.length - 2] ||
      points[points.length - 2];

    const commonCell: Cell | undefined = isInner ?
      getInnerCommonCell(commonCells, prelastPoint, prevCell) :
      getOuterCommonCell(commonCells, prelastPoint, prevCell);

    if (!commonCell) break;

    const commonCellIndex = touchedCells.indexOf(commonCell);

    if (commonCellIndex === -1) break;

    const commonPoints = commonCell.commonPoints(outerCell)
      .filter((point) => (
        !point.isEqual(lastPoint)
      ));

    nextPoints.push(...commonPoints);
    prevCell = commonCell;
    touchedCells.splice(commonCellIndex, 1);
  }

  return nextPoints;
}
