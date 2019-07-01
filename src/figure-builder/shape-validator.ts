import isEqual from 'lodash/isEqual';
import { Grider } from '..';
import { GeographyUtils, ShapeUtils } from '../utils';
import { CellFinder } from './cell-finder';

export class ShapeValidator {
  constructor(
    public geography: GeographyUtils,
    public shape: ShapeUtils,
    public grider: Grider,
    public cellFinder: CellFinder,
  ) {}
//done
  validate(shape: grider.GeoPoint[], gridParams: grider.GridParams): boolean {
    if (shape.length < 3) return false;

    const selfIntersects = this.getSelfIntersectsPoints(shape);

    if (selfIntersects.length > 0) return false;

    const tooCloseCells = this.getTooCloseCells(shape, gridParams);

    if (tooCloseCells.length > 0) return false;

    return true;
  }

  // done
  getSelfIntersectsPoints(shape: grider.GeoPoint[]): grider.GeoPoint[] {
    return this.geography.calcPolyItselfIntersections(shape);
  }

//done
  getTooCloseCells(
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): grider.GeoPoint[][] {
    const cells = shape.reduce((
      cells: grider.GridPoint[],
      point,
      index,
    ): grider.GridPoint[] => {
      const nextPoint = this.shape.getNextPoint(shape, index);
      const prevPoint = this.shape.getPrevPoint(shape, index);

      const closestCellCenters: grider.GridPoint[] = [];
      let nextCellCenter: grider.GridPoint | undefined;
      let prevCellCenter: grider.GridPoint | undefined;

      for (let i = 0; i < 3; i += 1) {
        nextCellCenter = this.cellFinder.calcNextCellCenter(nextCellCenter, [point, nextPoint], gridParams);
        prevCellCenter = this.cellFinder.calcNextCellCenter(prevCellCenter, [point, prevPoint], gridParams);

        if (nextCellCenter && !closestCellCenters.find((centerPoint) => isEqual(centerPoint, nextCellCenter))) {
          closestCellCenters.push(nextCellCenter);
        }
        if (prevCellCenter && !closestCellCenters.find((centerPoint) => isEqual(centerPoint, prevCellCenter))) {
          closestCellCenters.push(prevCellCenter);
        }
      }

      const intersectedCells = closestCellCenters.reduce((
        intersectedCells: grider.GridPoint[],
        cellCenter: grider.GridPoint,
      ): grider.GridPoint[] => {
        const cellCenters = this.getCloseCellIntesectedNeighbors(cellCenter, point, shape, gridParams);

        return [
        ...intersectedCells,
        ...cellCenters.filter(
          (center) => !intersectedCells.find((cellCenter) => isEqual(center, cellCenter)),
        ),
      ];
    }, [])
      .filter((centerCell) => !cells.find((center) => isEqual(center, centerCell)));

      return [...cells, ...intersectedCells];
    }, [])
      .map((centerPoint) => this.grider.buildPolyByCenterGridPoint(centerPoint, gridParams));

    return cells;
  }

//done
  getCloseCellIntesectedNeighbors(
    cellCenter: grider.GridPoint,
    shapePeak: grider.GeoPoint,
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): grider.GridPoint[] {
    const cell = this.grider.buildPolyByCenterGridPoint(cellCenter, gridParams);

    const intersectedCells = this.shape.reduceEachShapeSide<grider.GeoPoint, grider.GridPoint[]>(shape, (
      intersectedCells,
      side,
    ) => {
      if (side.find(((point) => isEqual(point, shapePeak)))) return intersectedCells;

      const cellIntersect = this.geography.calcPolyAndLineInersections(cell, side);

      if (cellIntersect.length > 0) {
        const isRepeated = intersectedCells.find((center) => isEqual(cellCenter, center));

        return isRepeated ? intersectedCells : [...intersectedCells, cellCenter];
      }

      const cellPointsByDistance = cell.sort((pointA, pointB) => {
        const closestPointA = this.geography.closestPointOnSection(pointA, side);
        const closestPointB = this.geography.closestPointOnSection(pointB, side);

        if (!closestPointA || !closestPointB) return 0;

        const distanceA = this.geography.calcMercDistance(closestPointA, pointA);
        const distanceB = this.geography.calcMercDistance(closestPointB, pointB);

        return distanceA - distanceB;
      });

      const closestSide: [grider.GeoPoint, grider.GeoPoint] = [cellPointsByDistance[0], cellPointsByDistance[1]];
      const nextCellCenter = this.cellFinder.getNextCellByCellSide(cellCenter, closestSide, gridParams);
      const nextCell = this.grider.buildPolyByCenterGridPoint(nextCellCenter, gridParams);
      const nextCellIntersects = this.geography.calcPolyAndLineInersections(nextCell, side);

      if (nextCellIntersects.length === 0) return intersectedCells;

      const isCellRepeated = intersectedCells.find((center) => isEqual(cellCenter, center));

      if (!isCellRepeated) {
        intersectedCells.push(cellCenter);
      }

      const isNextCellRepeated = intersectedCells.find((center) => isEqual(nextCellCenter, center));

      if (!isNextCellRepeated) {
        intersectedCells.push(nextCellCenter);
      }

      return intersectedCells;
    }, []);

    return intersectedCells;
  }
}
