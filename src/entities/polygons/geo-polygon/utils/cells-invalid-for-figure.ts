import { Cell } from "../../cell";
import { GeoPolygon } from "../geo-polygon";
import { GridParams } from "../../../grid-params";
import { GeoSegment } from "../../../segments/geo-segment";

export function getInvalidCells(
  shape: GeoPolygon,
  params: GridParams,
): Cell[] {
  return shape.reduceNeighboringSidesPairs((
    invalidCells: Cell[],
    prevSide: GeoSegment,
    nextSide: GeoSegment
  ): Cell[] => {
    const closestCells = getClosestToPeakCells(prevSide, nextSide, params);
    const intersectedCells = closestCells.reduce((
      intersectedCells: Cell[],
      cell: Cell
    ): Cell[] => {
      return intersectedCells;
    }, []);
  }, []);
}

function getClosestToPeakCells(
  sideA: GeoSegment,
  sideB: GeoSegment,
  params: GridParams,
  steps: number = 3
): Cell[] {
  const initCell = Cell.fromGeoPoint(sideA.pointA, params);
  const closestCells: Cell[] = [];

  let nextCell: Cell | undefined;
  let prevCell: Cell | undefined;

  for (let i = 0; i < steps; i += 1) {
    prevCell = prevCell ? 
      prevCell.nextCellOnSegment(sideA) : 
      initCell;
    nextCell = nextCell ? 
      nextCell.nextCellOnSegment(sideB) : 
      initCell;

    const hasPrev = !!closestCells.find((cell) => prevCell && cell.isEqual(prevCell));
    const hasNext = !!closestCells.find((cell) => nextCell && cell.isEqual(nextCell));

    if (prevCell && !hasPrev) {
      closestCells.push(prevCell);
    }
    if (nextCell && !hasNext) {
      closestCells.push(nextCell);
    }
  }

  return closestCells;
}