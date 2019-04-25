import isEqual from 'lodash/isEqual';
import { Grider } from '../grider';
import { GeographyUtils, ShapeUtils } from '../utils';

export class BorderRenderer {
  constructor(
    public figure: grider.GeoPoint[],
    public shape: grider.GeoPoint[],
    public geography: GeographyUtils,
    public shapeUtils: ShapeUtils,
    public grider: Grider,
  ) {}

  calcBorderTileFigure(
    tileCoord: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
  ) {
    const tileGeoShape = this.calcTileShape(tileCoord, zoomCoofX, zoomCoofY);

    const contains = tileGeoShape.map(
      (point) => this.geography.polyContainsPoint(this.shape, point),
    );

    if (contains.every((isContained) => !isContained)) {
      return [];
    } else {
      return [{
        x: 0,
        y: 0,
      }, {
        x: 1,
        y: 0,
      }, {
        x: 1,
        y: 1,
      }, {
        x: 0,
        y: 1,
      }];
    }
  }

  calcTileShape(
    tileCoord: grider.Point,
    zoomCoofX: number,
    zoomCoofY: number,
  ): grider.GeoPoint[] {
    const bottomRightTile = {
      x: tileCoord.x + 1,
      y: tileCoord.y + 1,
    };
    const northWest = this.geography.mercToSpherMap({
      x: tileCoord.x / zoomCoofX,
      y: tileCoord.y / zoomCoofY,
    });
    const southEast = this.geography.mercToSpherMap({
      x: bottomRightTile.x / zoomCoofX,
      y: bottomRightTile.y / zoomCoofY,
    });

    return [
      northWest, {
        lat: northWest.lat,
        lng: southEast.lng,
      },
      southEast, {
        lat: southEast.lat,
        lng: northWest.lng,
      },
    ];
  }

  checkPoint(
    figure: grider.GeoPoint[],
    distances: number[],
    index: number,
    segmentIndexes: number[],
    gridParams: grider.GridParams,
    isInner: boolean,
  ): boolean {
    const pointDistance = distances[index];

    let segment = segmentIndexes.map((index) => figure[index]);

    const lngs = segment.map(({lng}) => lng);
    const lngMin = Math.min(...lngs);
    const lngMax = Math.max(...lngs);
    const isRipped = lngMax - lngMin > 180;

    if (isRipped) {
      segment = segment.map(({lat, lng}) => ({
        lng: this.geography.reduceLng(lng - 180),
        lat,
      }));
    }

    const gridSegment = segment.map((point) => this.grider.calcGridPointByGeoPoint(point, gridParams));

    const pointsInRow = gridSegment.reduce((pointsInRow: number[][], pointA, indexA) => {
      return gridSegment.reduce((pointsInRow: number[][], pointB, indexB) => {
        if (indexA >= indexB) return pointsInRow;

        const startPoint = pointA;
        const endPoint = pointB;

        gridSegment.forEach((point, index) => {
          if (index === indexA || index === indexB) return;

          const testPoint = point;

          const diff = Math.round((
            (startPoint.i - testPoint.i) * (endPoint.j - testPoint.j) -
            (endPoint.i - testPoint.i) * (startPoint.j - testPoint.j)
          ) * 3);

          if (diff === 0) {
            pointsInRow.push(
              [indexA, indexB, index]
              .sort((a, b) => a - b)
              .map((index) => segmentIndexes[index]),
            );
          }
        });

        return pointsInRow;

      }, pointsInRow);
    }, []);

    let toBeAdded;

    if (pointsInRow.length === 0) {
      toBeAdded = true;
    } else if (pointsInRow.length > 1 && pointsInRow.every((row) => row.includes(index))) {
      const outOfRowIndexes = segmentIndexes.filter((index) => pointsInRow.every((row) => !row.includes(index)));

      if (outOfRowIndexes.length !== 1) return true;

      const isPointFurther = pointDistance < distances[outOfRowIndexes[0]];

      return isPointFurther === isInner;
    } else {
      toBeAdded = pointsInRow
        .reduce((toBeAdded: boolean, row): boolean => {
          if (toBeAdded) return toBeAdded;

          if (row.includes(index)) {
            return false;
          }

          const testPointIndex = row[1];
          const isPointFurther = pointDistance < distances[testPointIndex];

          return isPointFurther === isInner;
        }, false);
    }

    return toBeAdded;
  }

  simplifyFigure(
    figure: grider.GeoPoint[],
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
    if (gridParams.type === 'rect') return figure;

    const len = figure.length;
    const isInner = this.geography.polyContainsPoint(shape, figure[0]);

    const distances = figure.map((point): number =>
      this.shapeUtils.reduceEachShapeSide<grider.GeoPoint, number>(shape,
        (minDistance, side): number => {
          const closestPoint = this.geography.closestPointOnSection(point, side);

          if (!closestPoint) return minDistance;

          const distance = this.geography.calcMercDistance(point, closestPoint);

          return Math.min(distance, minDistance);
        }, Infinity),
    );

    const simplified = figure.reduce((result: grider.GeoPoint[], point, index) => {
      const prevIndex3: number = index - 3 < 0 ? index - 5 + len : index - 3;
      const prevIndex2: number = index - 2 < 0 ? index - 4 + len : index - 2;
      const prevIndex: number = index - 1 < 0 ? len - 2 : index - 1;

      const nextIndex: number = index + 1 > len - 1 ? 1 : index + 1;
      const nextIndex2: number = (index + 2) > (len - 1) ? index + 3 - len : index + 2;
      const nextIndex3: number = (index + 3) > (len - 1) ? index + 4 - len : index + 3;

      const segmentIndexes = [
        prevIndex2,
        prevIndex,
        index,
        nextIndex,
        nextIndex2,
        nextIndex3,
      ];

      let toBeAdded = this.checkPoint(figure, distances, index, segmentIndexes, gridParams, isInner);

      if (!toBeAdded) {
        const segmentIndexesEnsure = [
          nextIndex2,
          nextIndex,
          index,
          prevIndex,
          prevIndex2,
          prevIndex3,
        ];

        toBeAdded = this.checkPoint(figure, distances, index, segmentIndexesEnsure, gridParams, isInner);
      }

      if (toBeAdded) {
        result.push(point);
      }

      return result;
    }, []);

    const simpleLen = simplified.length;
    const simplifiedGrid = simplified.map((point) => this.grider.calcGridPointByGeoPoint(point, gridParams));

    const cleared = simplifiedGrid.reduce((
      cleared: grider.GeoPoint[],
      point,
      index,
    ): grider.GeoPoint[] => {
      const prevIndex = index === 0 ? simpleLen - 2 : index - 1;
      const nextIndex = index + 1 === simpleLen ? 1 : index + 1;
      const prevPoint = simplifiedGrid[prevIndex];
      const nextPoint = simplifiedGrid[nextIndex];

      const diff = Math.round((
        (prevPoint.i - point.i) * (nextPoint.j - point.j) -
        (nextPoint.i - point.i) * (prevPoint.j - point.j)
      ) * 3);

      if (diff !== 0) {
        cleared.push(simplified[index]);
      }

      return cleared;
    }, []);

    const clearedLen = cleared.length;

    if (!isEqual(cleared[0], cleared[clearedLen - 1])) {
      cleared.push(cleared[0]);
    }

    this.indexateFigure(cleared);

    return cleared;
  }

  indexateFigure(figure: grider.GeoPoint[]) {
    const lngIndexes: {[key: number]: number[]} = {};
    const latIndexes: {[key: number]: number[]} = {};

    figure.forEach(({lng, lat}, index) => {
      if (!lngIndexes[lng]) {
        lngIndexes[lng] = [];
      }
      if (!latIndexes[lat]) {
        latIndexes[lat] = [];
      }

      lngIndexes[lng].push(index);
      latIndexes[lat].push(index);
    }, {});

    console.log(Object.keys(lngIndexes));
    console.log(Object.keys(latIndexes));
  }
}
