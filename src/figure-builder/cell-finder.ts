import isEqual from 'lodash/isEqual';
import { Grider } from '../';
import { GeographyUtils, ShapeUtils } from '../utils';

export class CellFinder {
  constructor(
    public geography: GeographyUtils,
    public shape: ShapeUtils,
    public grider: Grider,
  ) {}

  getNextCellByCellSide(
    initialCellCenter: grider.GridPoint,
    section: [grider.GeoPoint, grider.GeoPoint],
    gridParams: grider.GridParams,
  ): grider.GridPoint {
    const axesKeys = Object.keys(initialCellCenter) as grider.PointHexKeys[];
    const gridSection = section.map(
      (point) => this.grider.calcGridPointByGeoPoint(point, gridParams),
    );
    const averPoint = gridSection.reduce((
        averPoint: grider.GridPoint,
        point: grider.GridPoint,
        index: number,
      ): grider.GridPoint => {
        if (index === 0) return averPoint;

        axesKeys.forEach((axisKey: grider.PointHexKeys): void => {
          averPoint[axisKey] += point[axisKey];
        });

        return averPoint;
      }, gridSection[0]);

    axesKeys.forEach((axisKey: grider.PointHexKeys): void => {
      averPoint[axisKey] = averPoint[axisKey] / section.length;
    });

    const nextCenter = axesKeys.reduce((
      nextCenter: {[key: string]: number},
      axisKey: grider.PointHexKeys,
    ): {[key: string]: number} => {
      const axisVector = (averPoint[axisKey] - initialCellCenter[axisKey]) * 2;
      nextCenter[axisKey] = Math.round(initialCellCenter[axisKey] + axisVector);

      return nextCenter;
    }, {}) as grider.GridPoint;

    return nextCenter;
  }

  getNextCellSide(
    initialCellCenter: grider.GridPoint,
    section: [grider.GeoPoint, grider.GeoPoint],
    gridParams: grider.GridParams,
  ) {
    const endPoint = section[1];
    const initialCell = this.grider.buildPolyByCenterGridPoint(initialCellCenter, gridParams);
    const intersectedSidesByDistances = this.shape.reduceEachShapeSide<
      grider.GeoPoint,
      Array<{side: [grider.GeoPoint, grider.GeoPoint], distance: number}>
    >(
      initialCell, (
        intersectedSides,
        side,
    ) => {
      const intersect = this.geography.calcSectionsIntersect(side, section);

      if (intersect) {
        intersectedSides.push({
          side,
          distance: this.geography.calcMercDistance(endPoint, intersect),
        });
      }

      return intersectedSides;
    }, [])
      .sort((sideA, sideB) => sideA.distance - sideB.distance)
      .map(({side}) => side);

    return intersectedSidesByDistances[0];
  }

  checkStartPoint(
    point: grider.GeoPoint,
    prevPoint: grider.GeoPoint | undefined,
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): boolean {
    const nearestPoints = this.getNearestPoints(point, gridParams)
      .filter((point) => !isEqual(point, prevPoint));

    const suitablePoints = nearestPoints.reduce((
      suitablePoints: grider.GeoPoint[],
      nearestPoint: grider.GeoPoint,
      ): grider.GeoPoint[] => {
        const isSuitable = this.shape.reduceEachShapeSide<
          grider.GeoPoint,
          boolean
        >(shape, (isSuitable, side) => {
          if (!isSuitable) return isSuitable;

          const intersect = this.geography.calcSectionsIntersect(side, [point, nearestPoint]);

          return !intersect;
        }, true);

        if (isSuitable) {
          suitablePoints.push(nearestPoint);
        }
        return suitablePoints;
    }, []);

    if (suitablePoints.length === 1) {
      return this.checkStartPoint(suitablePoints[0], point, shape, gridParams);
    } else {
      return suitablePoints.length > 1;
    }
  }

  findStartPoint(
    cellCenter: grider.GridPoint,
    cellPoints: grider.GeoPoint[],
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
    isInner: boolean = true,
  ): grider.GeoPoint | undefined {
    const startCellContains = cellPoints.map((
        point: grider.GeoPoint,
      ): boolean => this.geography.polyContainsPoint(shape, point),
    );

    if (startCellContains.every((isContained) => isContained === !isInner)) {
      return;
    }

    const nextCellCenter = this.calcNextCellCenter(
      cellCenter,
      [shape[0], shape[1]],
      gridParams,
    ) || this.grider.calcGridCenterPointByGeoPoint(shape[1], gridParams);

    const takenPoints = cellPoints.filter(
      (_point, index) => startCellContains[index] === isInner,
    );

    if (takenPoints.length === 1) {
      const pointIsValid = this.checkStartPoint(takenPoints[0], undefined, shape, gridParams);

      if (pointIsValid) {
        return takenPoints[0];
      } else {
        return;
      }
    }

    const nextCellPoints = this.grider.buildPolyByCenterGridPoint(nextCellCenter, gridParams);
    
    if (startCellContains.every((isContained) => isContained === isInner)) {
      const prevSection = [
        this.shape.getPrevPoint(shape, 0),
        shape[0]
      ] as [grider.GeoPoint, grider.GeoPoint];
      const section = [
        shape[0],
        shape[1]
      ] as [grider.GeoPoint, grider.GeoPoint];

      const startCell = this.shape.reduceEachShapeSide<
        grider.GeoPoint, 
        grider.GeoPoint | undefined
      >(
        cellPoints, 
        (startCell, cellSide) => {
          if (startCell) return startCell;
          const intersect = this.geography.calcSectionsIntersect(section, cellSide);
          const intersectPrev = this.geography.calcSectionsIntersect(prevSection, cellSide);

          if (!intersect || !intersectPrev) return startCell;
          const [pointA, pointB] = cellSide;
          
          const distanceAPrev = this.geography.calcMercDistance(pointA, intersectPrev);
          const distanceACurr = this.geography.calcMercDistance(pointA, intersect);

          return distanceAPrev < distanceACurr ? pointA : pointB;
      }, undefined) as grider.GeoPoint;

      return startCell;
    }

    const firstPoint = cellPoints.find((
      point: grider.GeoPoint,
      index: number,
      ): boolean => {
        if (startCellContains[index] !== isInner) return false;

        const nextIndex = cellPoints[index + 1] ? index + 1 : 0;
        const prevIndex = cellPoints[index - 1] ? index - 1 : cellPoints.length - 1;

        if (startCellContains[nextIndex] === startCellContains[prevIndex]) return false;

        return !nextCellPoints.find((pointNext) => isEqual(point, pointNext));
    });

    if (!firstPoint) return;

    const pointIsValid = this.checkStartPoint(firstPoint, undefined, shape, gridParams);

    if (pointIsValid) {
      return firstPoint;
    }
  }

  calcNextCellCenter(
    initialCellCenter: grider.GridPoint | undefined,
    section: [grider.GeoPoint, grider.GeoPoint],
    gridParams: grider.GridParams,
  ): grider.GridPoint | undefined {
    const [startPoint, endPoint] = section;
    const startCellCenter = this.grider.calcGridCenterPointByGeoPoint(startPoint, gridParams);
    const endCellCenter = this.grider.calcGridCenterPointByGeoPoint(endPoint, gridParams);

    if (isEqual(startCellCenter, endCellCenter)) return;

    if (!initialCellCenter) return startCellCenter;

    const nextCellSide = this.getNextCellSide(initialCellCenter, section, gridParams);
    const nextCellCenter = this.getNextCellByCellSide(initialCellCenter, nextCellSide, gridParams);

    if (!isEqual(nextCellCenter, endCellCenter)) return nextCellCenter;
  }

  getNearestPoints(
    point: grider.GeoPoint,
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
    const cellCenter = this.grider.calcGridCenterPointByGeoPoint(point, gridParams);
    const cellPoints = this.grider.buildPolyByCenterGridPoint(cellCenter, gridParams);

    const equalPoint = cellPoints.find((cellPoint) => isEqual(cellPoint, point)) as grider.GeoPoint;
    const pointIndex = cellPoints.indexOf(equalPoint);
    const nextPoint =  this.shape.getNextPoint(cellPoints, pointIndex);
    const prevPoint =  this.shape.getPrevPoint(cellPoints, pointIndex);
    const nearestPoints = [prevPoint, nextPoint];
    const possiblePoints: grider.GeoPoint[] = [];

    nearestPoints.forEach((pointA) => {
      const cellCenterA = this.getNextCellByCellSide(cellCenter, [point, pointA], gridParams);
      const cellPointsA = this.grider.buildPolyByCenterGridPoint(cellCenterA, gridParams);
      const equalPointA = cellPointsA.find((cellPoint) => isEqual(cellPoint, point)) as grider.GeoPoint;
      const pointIndexA = cellPointsA.indexOf(equalPointA);

      const nextPointA =  this.shape.getNextPoint(cellPointsA, pointIndexA);
      const prevPointA =  this.shape.getPrevPoint(cellPointsA, pointIndexA);
      possiblePoints.push(nextPointA, prevPointA);
    });

    possiblePoints.forEach((posPoint) => {
      if (nearestPoints.find((point) => isEqual(point, posPoint))) return;

      nearestPoints.push(posPoint);
    });

    return nearestPoints;
  }
}
