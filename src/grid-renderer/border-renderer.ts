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

  simplifyFigure(
    figure: grider.GeoPoint[],
    shape: grider.GeoPoint[],
    gridParams: grider.GridParams,
  ): grider.GeoPoint[] {
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
      if (index === len || index === 0) {
        result.push(point);
        return result;
      }

      const pointDistance = distances[index];

      const prevIndex2: number = index - 2 < 0 ? index - 3 + len : index - 2;
      const prevIndex: number = index - 1 < 0 ? len - 1 : index - 1;
      const nextIndex: number = index + 1 > len - 1 ? 0 : index + 1;
      const nextIndex2: number = (index + 2) > (len - 1) ? index + 2 - len : index + 2;

      const segmentIndexes = [
        prevIndex2,
        prevIndex,
        index,
        nextIndex,
        nextIndex2,
      ];

      let segment = [
        figure[prevIndex2],
        figure[prevIndex],
        figure[index],
        figure[nextIndex],
        figure[nextIndex2],
      ];

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

      const toBeAdded = pointsInRow.length === 0 || pointsInRow
        .reduce((toBeAdded: boolean, row): boolean => {
          if (toBeAdded) return toBeAdded;

          if (row.includes(index)) {
            return false;
          }

          const testPointIndex = row[1];
          const isPointNearer = pointDistance < distances[testPointIndex];

          return isPointNearer === isInner;
        }, false);

      if (toBeAdded) {
        result.push(point);
      }

      return result;
    }, []);

    return simplified;
  }
}
